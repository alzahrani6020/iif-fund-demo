from __future__ import annotations

from copy import deepcopy
from dataclasses import replace
from datetime import datetime
from threading import RLock

from .aic_memory_contracts import (
    MemoryAction,
    MemoryAuditEvent,
    MemoryRecord,
    MemoryState,
    new_audit_event,
)


class MemoryStoreError(Exception):
    pass


def _copy_record(record: MemoryRecord) -> MemoryRecord:
    """Defensive copy: content/metadata are plain dicts on a frozen dataclass,
    so callers holding a returned record must never mutate stored state."""
    return replace(
        record,
        content=deepcopy(record.content),
        metadata=deepcopy(record.metadata),
    )


class MemoryNotFoundError(MemoryStoreError):
    pass


class MemoryConflictError(MemoryStoreError):
    pass


class MemoryStore:
    """Thread-safe memory store with immutable history semantics.

    All state changes go through ``transition`` (compare-and-swap under a
    single lock), so supersede/invalidate can never bypass locking or poke at
    internals. Every lifecycle change appends an immutable audit event; there
    is no path that mutates or erases history.
    """

    def __init__(self) -> None:
        self._records: dict[str, MemoryRecord] = {}
        self._audit: list[MemoryAuditEvent] = []
        self._audit_seq = 0
        self._lock = RLock()

    # ------------------------------------------------------------------
    # Storage primitives — subclasses (e.g. SQLite) override these.
    # ------------------------------------------------------------------
    def _put_record(self, record: MemoryRecord) -> None:
        self._records[record.memory_id] = _copy_record(record)

    def _fetch_record(self, memory_id: str) -> MemoryRecord | None:
        return self._records.get(memory_id)

    def _fetch_all_records(self) -> list[MemoryRecord]:
        return list(self._records.values())

    def _append_audit_event(self, event: MemoryAuditEvent) -> None:
        self._audit_seq += 1
        self._audit.append(replace(event, seq=self._audit_seq))

    def _fetch_audit_events(
        self, memory_id: str | None = None
    ) -> list[MemoryAuditEvent]:
        if memory_id is None:
            return list(self._audit)
        return [e for e in self._audit if e.memory_id == memory_id]

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------
    def add(self, record: MemoryRecord, *, actor: str = "system") -> MemoryRecord:
        with self._lock:
            if self._fetch_record(record.memory_id) is not None:
                raise MemoryConflictError(
                    f"memory already exists: {record.memory_id}"
                )

            if record.supersedes is not None:
                self._transition_locked(
                    record.supersedes,
                    to_state=MemoryState.SUPERSEDED,
                    expected=(MemoryState.ACTIVE,),
                    actor=actor,
                    detail=f"superseded by {record.memory_id}",
                )

            self._put_record(record)
            self._append_audit_event(
                new_audit_event(
                    action=MemoryAction.CREATED,
                    memory_id=record.memory_id,
                    actor=actor,
                )
            )
            return record

    def get(self, memory_id: str) -> MemoryRecord:
        with self._lock:
            record = self._fetch_record(memory_id)

            if record is None:
                raise MemoryNotFoundError(f"memory not found: {memory_id}")

            return _copy_record(record)

    def exists(self, memory_id: str) -> bool:
        with self._lock:
            return self._fetch_record(memory_id) is not None

    def list_all(self) -> tuple[MemoryRecord, ...]:
        with self._lock:
            return tuple(_copy_record(r) for r in self._fetch_all_records())

    def list_active(self) -> tuple[MemoryRecord, ...]:
        return self.filter_records(state=MemoryState.ACTIVE)

    def count(self) -> int:
        with self._lock:
            return len(self._fetch_all_records())

    def filter_records(
        self,
        *,
        scope: object | None = None,
        memory_type: object | None = None,
        state: MemoryState | None = None,
        created_after: datetime | None = None,
        created_before: datetime | None = None,
    ) -> tuple[MemoryRecord, ...]:
        """Filter by scope (exact match), type, state, and creation window."""
        with self._lock:
            records = self._fetch_all_records()

        if scope is not None:
            records = [
                r
                for r in records
                if (
                    r.scope.tenant_id,
                    r.scope.project_id,
                    r.scope.agent_id,
                    r.scope.environment,
                )
                == (
                    getattr(scope, "tenant_id", None),
                    getattr(scope, "project_id", None),
                    getattr(scope, "agent_id", None),
                    getattr(scope, "environment", None),
                )
            ]
        if memory_type is not None:
            records = [r for r in records if r.memory_type is memory_type]
        if state is not None:
            records = [r for r in records if r.state is state]
        if created_after is not None:
            records = [r for r in records if r.created_at >= created_after]
        if created_before is not None:
            records = [r for r in records if r.created_at <= created_before]
        return tuple(_copy_record(r) for r in records)

    def transition(
        self,
        memory_id: str,
        *,
        to_state: MemoryState,
        expected: tuple[MemoryState, ...],
        actor: str,
        reason: str | None = None,
        detail: str | None = None,
    ) -> MemoryRecord:
        """Atomic compare-and-swap state transition (public, lock-guarded)."""
        with self._lock:
            return _copy_record(
                self._transition_locked(
                    memory_id,
                    to_state=to_state,
                    expected=expected,
                    actor=actor,
                    reason=reason,
                    detail=detail,
                )
            )

    def _transition_locked(
        self,
        memory_id: str,
        *,
        to_state: MemoryState,
        expected: tuple[MemoryState, ...],
        actor: str,
        reason: str | None = None,
        detail: str | None = None,
    ) -> MemoryRecord:
        current = self._fetch_record(memory_id)

        if current is None:
            raise MemoryNotFoundError(f"memory not found: {memory_id}")

        if current.state not in expected:
            raise MemoryConflictError(
                f"cannot move {memory_id} from {current.state.value} "
                f"to {to_state.value}; expected one of "
                f"{[s.value for s in expected]}"
            )

        updated = replace(
            current,
            state=to_state,
            invalidation_reason=(
                reason.strip() if to_state is MemoryState.INVALIDATED else None
            ),
        )

        self._put_record(updated)
        self._append_audit_event(
            new_audit_event(
                action=MemoryAction(to_state.value),
                memory_id=memory_id,
                actor=actor,
                detail=detail or reason,
            )
        )
        return updated

    def audit_trail(
        self, memory_id: str | None = None
    ) -> tuple[MemoryAuditEvent, ...]:
        """Read-only view of the append-only audit trail, oldest first.

        Ordered by the store-assigned monotonic ``seq`` (not wall-clock time,
        which can collide within a single microsecond).
        """
        with self._lock:
            events = self._fetch_audit_events(memory_id)
        return tuple(sorted(events, key=lambda e: e.seq))
