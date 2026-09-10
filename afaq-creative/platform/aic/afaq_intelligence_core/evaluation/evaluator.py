from __future__ import annotations
from dataclasses import dataclass

@dataclass(frozen=True)
class Evaluation:
    success: bool
    score: float
    notes: str

class RuleEvaluator:
    def evaluate(self, result, error: Exception | None = None) -> Evaluation:
        if error: return Evaluation(False, 0.0, f"Execution error: {type(error).__name__}")
        if result is None: return Evaluation(False, 0.25, "No result returned")
        return Evaluation(True, 1.0, "Execution completed")
