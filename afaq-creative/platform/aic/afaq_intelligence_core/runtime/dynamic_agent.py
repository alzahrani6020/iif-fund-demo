from __future__ import annotations
from dataclasses import dataclass
from typing import Any

@dataclass
class RunReport:
    goal: str
    steps: list[dict]
    completed: bool
    pending_approval: bool = False

class DynamicAgent:
    def __init__(self, planner, tools, policy, evaluator, environment="dev"):
        self.planner=planner; self.tools=tools; self.policy=policy; self.evaluator=evaluator; self.environment=environment

    def run(self, goal: str, context: dict | None = None) -> RunReport:
        plan = self.planner.plan(goal, [t.name for t in self.tools.list()], context)
        log=[]
        for step in plan:
            tool=self.tools.get(step.tool)
            decision=self.policy.decide(tool.risk, self.environment)
            entry={"tool":tool.name,"objective":step.objective,"policy":decision.action}
            if decision.action == "deny":
                entry["status"]="denied"; log.append(entry); return RunReport(goal,log,False)
            if decision.action == "approve":
                entry["status"]="pending_approval"; log.append(entry); return RunReport(goal,log,False,True)
            try:
                result=self.tools.execute(step.tool, **step.args)
                ev=self.evaluator.evaluate(result)
                entry.update({"status":"ok" if ev.success else "failed","score":ev.score})
            except Exception as exc:
                ev=self.evaluator.evaluate(None, exc); entry.update({"status":"failed","score":ev.score,"error":type(exc).__name__})
                log.append(entry); return RunReport(goal,log,False)
            log.append(entry)
        return RunReport(goal,log,True)
