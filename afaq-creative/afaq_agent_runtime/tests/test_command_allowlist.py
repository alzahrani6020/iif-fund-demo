from __future__ import annotations

import unittest

from afaq_agent_runtime.command_allowlist import CommandNotAllowed, check_allowed


class CommandAllowlistTests(unittest.TestCase):
    def test_git_push_denied(self):
        with self.assertRaises(CommandNotAllowed):
            check_allowed("git push")

    def test_pip_denied(self):
        with self.assertRaises(CommandNotAllowed):
            check_allowed("pip install requests")

    def test_git_status_allowed(self):
        self.assertEqual(check_allowed("git status"), ["git", "status"])

    def test_arbitrary_powershell_pipeline_denied(self):
        with self.assertRaises(CommandNotAllowed):
            check_allowed('powershell -NoProfile -NonInteractive -Command "Get-ChildItem | Remove-Item"')


if __name__ == "__main__":
    unittest.main()
