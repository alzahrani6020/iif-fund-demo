from __future__ import annotations
from dataclasses import dataclass
import json
from ..ai.provider import AIRequest

@dataclass(frozen=True)
class PlanStep:
    tool: str
    objective: str
    args: dict

class Planner:
    def __init__(self, router): self.router = router
    def plan(self, goal: str, tools: list[str], context: dict | None = None) -> list[PlanStep]:
        req = AIRequest(
            system="You are AFAQ Planner. Return JSON only: {\"steps\":[{\"tool\":str,\"objective\":str,\"args\":object}]}. Use only allowed tools.",
            prompt=f"Goal: {goal}\nAllowed tools: {tools}\nContext: {context or {}}",
            max_tokens=1200,
        )
        text = self.router.generate(req, complexity=6).text.strip()
        try:
            data = json.loads(text)
        except json.JSONDecodeError as exc:
            raise ValueError("Planner returned invalid JSON") from exc
        steps=[]
        for raw in data.get("steps", []):
            if raw.get("tool") not in tools: raise ValueError(f"Planner requested unregistered tool: {raw.get('tool')}")
            steps.append(PlanStep(raw["tool"], raw.get("objective", ""), dict(raw.get("args", {}))))
        return steps
