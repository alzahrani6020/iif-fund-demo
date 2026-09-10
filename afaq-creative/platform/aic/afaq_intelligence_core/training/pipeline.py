from __future__ import annotations
from dataclasses import dataclass

@dataclass(frozen=True)
class TrainingCandidate:
    dataset_path: str
    base_model: str
    method: str = "lora"

class TrainingPipeline:
    """Safety boundary: prepares/validates training jobs; does not auto-promote models."""
    def validate_candidate(self, candidate: TrainingCandidate) -> dict:
        return {"valid": bool(candidate.dataset_path and candidate.base_model), "method": candidate.method}
    def promote(self, *args, **kwargs):
        raise PermissionError("Model promotion requires an explicit approval workflow")
