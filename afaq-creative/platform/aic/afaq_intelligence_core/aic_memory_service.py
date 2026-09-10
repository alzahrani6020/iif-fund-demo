from __future__ import annotations

from typing import Any, Mapping

from .aic_memory_contracts import (
    MemoryEvidence,
    MemoryRecord,
    MemoryScope,
    MemoryState,
    MemoryType,
    new_memory_record,
)
from .aic_evaluation import (
    EvaluationReport,
    ReflectionSummary,
    evaluate_record,
    reflect,
    validate_lesson,
)
from .aic_retrieval import MemoryHit, MemoryQuery, MemoryRetrieval
from .aic_memory_store import (
    MemoryConflictError,
    MemoryNotFoundError,
    MemoryStore,
)


class MemoryService:
    """Governed application service over a MemoryStore.

    The service owns policy (lesson validation, retrieval scoping); the store
    owns persistence and locking. Mutations never reach into store internals.
    """

    def __init__(self, store: MemoryStore | None = None) -> None:
        self._store = store or MemoryStore()

    @property
    def store(self) -> MemoryStore:
        return self._store

    # ------------------------------------------------------------------
    # Lifecycle
    # ------------------------------------------------------------------
    def create(
        self,
        *,
        memory_type: MemoryType,
        content: Mapping[str, Any],
        evidence: tuple[MemoryEvidence, ...],
        scope: MemoryScope | None = None,
        supersedes: str | None = None,
        metadata: Mapping[str, Any] | None = None,
        actor: str = "system",
    ) -> MemoryRecord:
        if scope is None:
            # Backward-compatible path: derive the isolation boundary from the
            # well-known metadata keys legacy callers already pass. Callers that
            # care about boundaries should pass an explicit MemoryScope.
            derived = dict(metadata or {})
            scope = MemoryScope(
                tenant_id=str(derived.get("tenant_id") or "default"),
                project_id=str(derived.get("project_id") or "default"),
                agent_id=str(derived.get("agent_id") or "default"),
                environment=str(derived.get("environment") or "development"),
            )

        record = new_memory_record(
            memory_type=memory_type,
            content=content,
            evidence=evidence,
            scope=scope,
            supersedes=supersedes,
            metadata=metadata,
        )

        if memory_type is MemoryType.LESSON:
            verdict = validate_lesson(self._store, record)
            if not verdict.accepted:
                raise ValueError(
                    "lesson rejected by validation: " + "; ".join(verdict.reasons)
                )

        return self._store.add(record, actor=actor)

    def get(self, memory_id: str) -> MemoryRecord:
        return self._store.get(memory_id)

    def list_active(self) -> tuple[MemoryRecord, ...]:
        return self._store.list_active()

    def list_all(self) -> tuple[MemoryRecord, ...]:
        return self._store.list_all()

    def search(self, query: MemoryQuery) -> tuple[MemoryHit, ...]:
        return MemoryRetrieval.search(self._store, query)

    def evaluate(self, memory_id: str) -> EvaluationReport:
        return evaluate_record(self._store.get(memory_id))

    def reflect(self, scope: MemoryScope) -> ReflectionSummary:
        return reflect(self._store, scope)

    def validate_lesson_candidate(self, candidate: MemoryRecord):
        return validate_lesson(self._store, candidate)

    # ------------------------------------------------------------------
    # Governed transitions (atomic, auditable)
    # ------------------------------------------------------------------
    def invalidate(
        self,
        memory_id: str,
        *,
        reason: str,
        actor: str = "system",
    ) -> MemoryRecord:
        if not reason.strip():
            raise ValueError("invalidation reason is required")

        current = self._store.get(memory_id)

        if current.state is MemoryState.INVALIDATED:
            return current

        return self._store.transition(
            memory_id,
            to_state=MemoryState.INVALIDATED,
            expected=(MemoryState.ACTIVE,),
            actor=actor,
            reason=reason.strip(),
        )

    def supersede(
        self,
        memory_id: str,
        *,
        content: Mapping[str, Any],
        evidence: tuple[MemoryEvidence, ...],
        metadata: Mapping[str, Any] | None = None,
        actor: str = "system",
    ) -> MemoryRecord:
        current = self._store.get(memory_id)

        if current.state is not MemoryState.ACTIVE:
            raise MemoryConflictError(
                f"cannot supersede non-active memory: {memory_id}"
            )

        if current.memory_type is MemoryType.LESSON:
            # A replacement lesson must still anchor to the same source
            # experience/failure; inherit it when the caller does not restate it.
            content = dict(content)
            if not content.get("derived_from"):
                inherited = current.content.get("derived_from")
                if inherited:
                    content["derived_from"] = inherited

        return self.create(
            memory_type=current.memory_type,
            content=content,
            evidence=evidence,
            scope=current.scope,
            supersedes=memory_id,
            metadata=metadata,
            actor=actor,
        )

    def require_active(self, memory_id: str) -> MemoryRecord:
        record = self._store.get(memory_id)

        if record.state is not MemoryState.ACTIVE:
            raise MemoryConflictError(f"memory is not active: {memory_id}")

        return record


__all__ = [
    "MemoryService",
    "MemoryConflictError",
    "MemoryNotFoundError",
]
