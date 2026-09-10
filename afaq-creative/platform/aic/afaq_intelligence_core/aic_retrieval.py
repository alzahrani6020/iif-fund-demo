"""Deterministic retrieval layer for the memory nucleus.

Ranking is rule-based and reproducible: mean evidence confidence, memory-type
relevance weight, and a bounded recency bonus. No randomness, no network.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta, timezone

from .aic_memory_contracts import (
    MemoryRecord,
    MemoryState,
    MemoryType,
)
from .aic_memory_store import MemoryStore


@dataclass(frozen=True, slots=True)
class MemoryQuery:
    """Scoped retrieval request. scope=None means all scopes (admin tooling
    only — services should always pass a scope)."""

    scope: object | None = None
    memory_type: MemoryType | None = None
    state: MemoryState = MemoryState.ACTIVE
    tags: tuple[str, ...] = ()
    min_confidence: float = 0.0
    created_after: datetime | None = None
    created_before: datetime | None = None
    limit: int = 20


@dataclass(frozen=True, slots=True)
class MemoryHit:
    record: MemoryRecord
    score: float
    reasons: tuple[str, ...]


class MemoryRetrieval:
    """Ranked search over a MemoryStore."""

    RECENCY_HORIZON = timedelta(days=30)
    RECENCY_WEIGHT = 0.25
    TYPE_WEIGHT: dict[MemoryType, float] = {
        MemoryType.LESSON: 1.0,
        MemoryType.DECISION: 0.9,
        MemoryType.KNOWLEDGE: 0.8,
        MemoryType.EXPERIENCE: 0.7,
        MemoryType.FAILURE: 0.6,
    }

    @classmethod
    def search(
        cls, store: MemoryStore, query: MemoryQuery
    ) -> tuple[MemoryHit, ...]:
        if query.limit <= 0:
            raise ValueError("query limit must be positive")
        if not 0.0 <= query.min_confidence <= 1.0:
            raise ValueError("min_confidence must be between 0.0 and 1.0")
        if query.state is None:
            raise ValueError(
                "query state must be an explicit MemoryState; None would "
                "silently include superseded/invalidated records"
            )

        records = store.filter_records(
            scope=query.scope,
            memory_type=query.memory_type,
            state=query.state,
            created_after=query.created_after,
            created_before=query.created_before,
        )

        hits: list[MemoryHit] = []
        now = datetime.now(timezone.utc)

        for record in records:
            if record.confidence < query.min_confidence:
                continue

            if query.tags:
                record_tags = record.content.get("tags", ())
                if not isinstance(record_tags, (list, tuple)):
                    record_tags = ()
                if not all(tag in record_tags for tag in query.tags):
                    continue

            confidence = record.confidence
            type_weight = cls.TYPE_WEIGHT.get(record.memory_type, 0.5)
            age = max(now - record.created_at, timedelta(0))
            recency_bonus = (
                1.0 - min(age / cls.RECENCY_HORIZON, 1.0)
            ) * cls.RECENCY_WEIGHT

            score = confidence * type_weight + recency_bonus
            reasons = (
                f"confidence={confidence:.2f}",
                f"type_weight={type_weight:.2f}",
                f"recency_bonus={recency_bonus:.3f}",
            )
            hits.append(MemoryHit(record=record, score=score, reasons=reasons))

        hits.sort(key=lambda h: (-h.score, h.record.memory_id))
        return tuple(hits[: query.limit])
