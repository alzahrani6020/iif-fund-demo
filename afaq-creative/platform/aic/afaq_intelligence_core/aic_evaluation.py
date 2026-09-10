"""Evaluation, reflection, and candidate-lesson validation.

All checks are deterministic rules (no external model calls), matching the
platform autonomy policy: Level 0-1 (observe / recommend). A candidate LESSON
must survive validation before the service persists it.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone

from .aic_memory_contracts import (
    LessonValidationOutcome,
    LessonValidationResult,
    MemoryRecord,
    MemoryState,
    MemoryType,
)
from .aic_memory_store import MemoryNotFoundError, MemoryStore

MIN_LESSON_CONFIDENCE = 0.5
LESSON_SOURCE_TYPES = (
    MemoryType.EXPERIENCE,
    MemoryType.FAILURE,
    MemoryType.DECISION,
)


@dataclass(frozen=True, slots=True)
class EvaluationCheck:
    name: str
    passed: bool
    note: str


@dataclass(frozen=True, slots=True)
class EvaluationReport:
    memory_id: str
    passed: bool
    score: float
    checks: tuple[EvaluationCheck, ...]


@dataclass(frozen=True, slots=True)
class ReflectionSummary:
    scope_boundary: str  # tenant/project/environment fingerprint
    generated_at: datetime
    total_memories: int
    active_by_type: dict
    active_by_state: dict
    mean_confidence: float
    top_tags: tuple[str, ...]
    open_failures: tuple[str, ...]  # FAILURE ids with no derived lesson yet
    derived_lessons: int


def evaluate_record(record: MemoryRecord) -> EvaluationReport:
    """Rule-based sanity evaluation for any memory record."""
    checks = [
        EvaluationCheck("content_present", bool(record.content), "non-empty content"),
        EvaluationCheck(
            "evidence_present", len(record.evidence) > 0, f"{len(record.evidence)} evidence items"
        ),
        EvaluationCheck(
            "confidence_floor",
            record.confidence >= MIN_LESSON_CONFIDENCE,
            f"mean confidence {record.confidence:.2f}",
        ),
        EvaluationCheck(
            "invalidated_has_reason",
            record.state is not MemoryState.INVALIDATED
            or bool(record.invalidation_reason),
            "invalidation reason recorded",
        ),
        EvaluationCheck(
            "scope_present",
            bool(record.scope.tenant_id and record.scope.project_id),
            "tenant/project bound",
        ),
    ]
    return EvaluationReport(
        memory_id=record.memory_id,
        passed=all(c.passed for c in checks),
        score=record.confidence,
        checks=tuple(checks),
    )


def validate_lesson(
    store: MemoryStore, candidate: MemoryRecord
) -> LessonValidationResult:
    """Challenge a candidate LESSON before it may be persisted.

    Rejection reasons are collected (not thrown) so callers can surface every
    violation at once — this is the challenger step of the learning loop.
    """
    reasons: list[str] = []

    if candidate.memory_type is not MemoryType.LESSON:
        reasons.append("candidate is not a LESSON record")

    reflection = candidate.content.get("reflection")
    if not isinstance(reflection, str) or not reflection.strip():
        reasons.append("lesson requires a non-empty 'reflection' string")

    derived_from = candidate.content.get("derived_from")
    if not isinstance(derived_from, str) or not derived_from.strip():
        reasons.append("lesson requires 'derived_from' memory id")
    else:
        try:
            source = store.get(derived_from)
        except MemoryNotFoundError:
            reasons.append(f"derived_from memory not found: {derived_from}")
        else:
            if source.memory_type not in LESSON_SOURCE_TYPES:
                reasons.append(
                    f"derived_from type {source.memory_type.value} cannot "
                    f"anchor a lesson"
                )
            if source.state is MemoryState.INVALIDATED:
                reasons.append("derived_from memory is invalidated")
            if not source.scope.same_boundary(candidate.scope):
                reasons.append(
                    "lesson crosses a tenant/project/environment boundary"
                )

    if candidate.confidence < MIN_LESSON_CONFIDENCE:
        reasons.append(
            f"mean confidence {candidate.confidence:.2f} below "
            f"minimum {MIN_LESSON_CONFIDENCE:.2f}"
        )

    # Duplicate guard: an identical lesson already active in the same
    # boundary adds retrieval noise, not knowledge. Only the reflection
    # text is compared — two lessons may share evidence but must differ in
    # what they teach.
    candidate_reflection = (
        reflection.strip() if isinstance(reflection, str) else ""
    )
    if candidate_reflection and not reasons:
        for existing in store.filter_records(scope=candidate.scope):
            if (
                existing.memory_type is MemoryType.LESSON
                and existing.state is MemoryState.ACTIVE
                and existing.memory_id != candidate.memory_id
                and isinstance(existing.content.get("reflection"), str)
                and existing.content["reflection"].strip() == candidate_reflection
            ):
                reasons.append(
                    "duplicate of an existing active lesson in this scope"
                )
                break

    if reasons:
        return LessonValidationResult(
            outcome=LessonValidationOutcome.REJECTED,
            reasons=tuple(reasons),
        )
    return LessonValidationResult(outcome=LessonValidationOutcome.ACCEPTED)


def reflect(store: MemoryStore, scope: object) -> ReflectionSummary:
    """Aggregate reflection over one scope boundary (observe/recommend only)."""
    records = store.filter_records(scope=scope)

    active = [r for r in records if r.state is MemoryState.ACTIVE]
    by_type: dict[str, int] = {}
    by_state: dict[str, int] = {}
    tags: dict[str, int] = {}
    confidences: list[float] = []
    failure_ids = set()
    lesson_sources = set()

    for r in records:
        if r.state is not MemoryState.ACTIVE:
            continue
        by_state[r.state.value] = by_state.get(r.state.value, 0) + 1
        by_type[r.memory_type.value] = by_type.get(r.memory_type.value, 0) + 1
        confidences.append(r.confidence)

        raw_tags = r.content.get("tags", ())
        if isinstance(raw_tags, (list, tuple)):
            for tag in raw_tags:
                tags[str(tag)] = tags.get(str(tag), 0) + 1

        if r.memory_type is MemoryType.FAILURE:
            failure_ids.add(r.memory_id)
        if r.memory_type is MemoryType.LESSON:
            derived = r.content.get("derived_from")
            if isinstance(derived, str):
                lesson_sources.add(derived)

    open_failures = tuple(sorted(failure_ids - lesson_sources))
    top_tags = tuple(
        tag for tag, _ in sorted(tags.items(), key=lambda kv: (-kv[1], kv[0]))[:5]
    )

    boundary = "/".join(
        [
            getattr(scope, "tenant_id", "?"),
            getattr(scope, "project_id", "?"),
            getattr(scope, "environment", "?"),
        ]
    )

    return ReflectionSummary(
        scope_boundary=boundary,
        generated_at=datetime.now(timezone.utc),
        total_memories=len(records),
        active_by_type=by_type,
        active_by_state=by_state,
        mean_confidence=(
            sum(confidences) / len(confidences) if confidences else 0.0
        ),
        top_tags=top_tags,
        open_failures=open_failures,
        derived_lessons=len(lesson_sources & failure_ids),
    )
