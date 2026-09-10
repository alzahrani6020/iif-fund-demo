from __future__ import annotations
from dataclasses import dataclass

@dataclass(frozen=True)
class Decision:
    action: str  # allow | approve | deny
    reason: str

class PolicyEngine:
    def decide(self, risk: str, environment: str = "dev") -> Decision:
        if risk == "read": return Decision("allow", "Read-only operation")
        if risk == "write" and environment != "production": return Decision("allow", "Non-production write")
        if risk in {"write", "privileged"}: return Decision("approve", "Human approval required")
        return Decision("deny", "Unknown risk class")
