from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class EvidenceRecord:
    execution_id: str
    source: str
    payload: Any


class EvidenceGate:
    """Fail-closed evidence gate.

    Model text is never evidence. Evidence must come from an actual tool/result
    and be tied to the current execution.
    """

    @staticmethod
    def from_tool_result(execution_id: str, source: str, payload: Any) -> EvidenceRecord:
        return EvidenceRecord(execution_id=execution_id, source=source, payload=payload)

    @staticmethod
    def verify(execution_id: str, records: list[EvidenceRecord]) -> bool:
        return bool(records) and all(r.execution_id == execution_id for r in records)

    @classmethod
    def require(cls, execution_id: str, records: list[EvidenceRecord]) -> None:
        if not cls.verify(execution_id, records):
            raise RuntimeError("NO EVIDENCE = NO CLAIM")
