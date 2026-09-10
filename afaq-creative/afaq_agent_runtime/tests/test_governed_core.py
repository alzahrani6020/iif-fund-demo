from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from afaq_agent_runtime.governed_core import GovernedAgentError, GovernedProjectAgent


class GovernedCoreTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        (self.root / "a.txt").write_text("hello world\n", encoding="utf-8")
        self.agent = GovernedProjectAgent(self.root)

    def tearDown(self):
        self.tmp.cleanup()

    def test_cannot_escape_root(self):
        with self.assertRaises(GovernedAgentError):
            self.agent.read("../outside.txt")

    def test_edit_requires_approval(self):
        with self.assertRaises(GovernedAgentError):
            self.agent.edit("a.txt", "hello", "bye")

    def test_edit_requires_exactly_one_match(self):
        (self.root / "a.txt").write_text("x x", encoding="utf-8")
        with self.assertRaises(GovernedAgentError):
            self.agent.edit("a.txt", "x", "y", approved=True)

    def test_approved_edit_returns_diff(self):
        diff = self.agent.edit("a.txt", "hello", "bye", approved=True)
        self.assertIn("--- a.txt", diff)
        self.assertIn("+++ a.txt", diff)
        self.assertEqual((self.root / "a.txt").read_text(encoding="utf-8"), "bye world\n")


if __name__ == "__main__":
    unittest.main()
