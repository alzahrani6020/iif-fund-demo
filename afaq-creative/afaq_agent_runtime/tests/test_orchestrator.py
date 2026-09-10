from __future__ import annotations

import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from afaq_agent_runtime.orchestrator import AfaqOrchestrator


class OrchestratorTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        (self.root / "a.txt").write_text("hello\n", encoding="utf-8")
        self.env_patch = patch.dict(
            os.environ,
            {"AFAQ_ORCHESTRATOR_ENABLED": "true"},
            clear=False,
        )
        self.env_patch.start()
        self.addCleanup(self.env_patch.stop)
        self.orch = AfaqOrchestrator(str(self.root))

    def tearDown(self):
        self.tmp.cleanup()

    def test_feature_flag_off_denies_before_tool_execution(self):
        with patch.dict(
            os.environ,
            {"AFAQ_ORCHESTRATOR_ENABLED": "false"},
            clear=False,
        ):
            with patch.object(
                self.orch,
                "_execute_tool",
                side_effect=AssertionError("tool execution must not be reached"),
            ) as execute_tool:
                result = self.orch.execute("read", {"path": "a.txt"})

        self.assertEqual(result["status"], "DENIED")
        self.assertEqual(
            result["reason"],
            "orchestrator feature flag is off",
        )
        execute_tool.assert_not_called()

    def test_read_has_execution_evidence_and_verification(self):
        result = self.orch.execute("read", {"path": "a.txt"})
        self.assertEqual(result["status"], "COMPLETE")
        self.assertTrue(result["execution"]["execution_id"])
        self.assertTrue(result["execution"]["evidence"])
        self.assertTrue(result["verification"]["verified"])

    def test_unknown_is_fail_closed(self):
        result = self.orch.execute("delete_everything", {})
        self.assertEqual(result["status"], "DENIED")

    def test_shadow_blocks_write_before_execution(self):
        with patch.dict(os.environ, {"AFAQ_ORCHESTRATOR_SHADOW": "true"}, clear=False):
            result = self.orch.execute("edit", {"path": "a.txt", "old": "hello", "new": "bye", "approved": True})
        self.assertEqual(result["status"], "SHADOW_BLOCKED")
        self.assertEqual((self.root / "a.txt").read_text(encoding="utf-8"), "hello\n")

    def test_edit_without_approval_fails(self):
        result = self.orch.execute("edit", {"path": "a.txt", "old": "hello", "new": "bye"})
        self.assertEqual(result["status"], "FAILED")
        self.assertIn("explicit approval", result["error"])

    def test_edit_complete_only_after_exact_readback(self):
        result = self.orch.execute(
            "edit",
            {
                "path": "a.txt",
                "old": "hello",
                "new": "bye",
                "approved": True,
            },
        )

        self.assertEqual(result["status"], "COMPLETE")
        self.assertTrue(result["verification"]["verified"])
        self.assertEqual(
            (self.root / "a.txt").read_text(encoding="utf-8"),
            "bye\n",
        )

    def test_read_only_run_success_can_complete(self):
        with patch.object(
            self.orch,
            "_execute_tool",
            return_value={
                "passed": True,
                "returncode": 0,
                "stdout": "",
                "stderr": "",
            },
        ):
            result = self.orch.execute(
                "run",
                {"command": "git status"},
            )

        self.assertEqual(result["status"], "COMPLETE")
        self.assertTrue(result["verification"]["verified"])
        self.assertEqual(result["verification"]["status"], "PASS")

    def test_write_run_success_is_not_complete_without_postcondition(self):
        with patch.object(
            self.orch,
            "_execute_tool",
            return_value={
                "passed": True,
                "returncode": 0,
                "stdout": "",
                "stderr": "",
            },
        ):
            result = self.orch.execute(
                "run",
                {"command": "python -m build"},
            )

        self.assertEqual(result["status"], "NOT_VERIFIED")
        self.assertFalse(result["verification"]["verified"])
        self.assertEqual(
            result["verification"]["status"],
            "NOT VERIFIED",
        )

    def test_write_run_nonzero_is_not_verified(self):
        with patch.object(
            self.orch,
            "_execute_tool",
            return_value={
                "passed": False,
                "returncode": 1,
                "stdout": "",
                "stderr": "failed",
            },
        ):
            result = self.orch.execute(
                "run",
                {"command": "python -m build"},
            )

        self.assertEqual(result["status"], "NOT_VERIFIED")
        self.assertFalse(result["verification"]["verified"])
        self.assertEqual(result["verification"]["status"], "FAIL")
    def test_edit_diff_alone_cannot_mark_complete(self):
        fake_diff = "--- a.txt\n+++ a.txt\n@@ -1 +1 @@\n-hello\n+bye\n"

        with patch.object(
            self.orch.core,
            "edit",
            return_value=fake_diff,
        ):
            result = self.orch.execute(
                "edit",
                {
                    "path": "a.txt",
                    "old": "hello",
                    "new": "bye",
                    "approved": True,
                },
            )

        self.assertEqual(result["status"], "NOT_VERIFIED")
        self.assertFalse(result["verification"]["verified"])
        self.assertEqual(
            (self.root / "a.txt").read_text(encoding="utf-8"),
            "hello\n",
        )


if __name__ == "__main__":
    unittest.main()
