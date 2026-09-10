"""Tests for afaq_intelligence_core (stdlib unittest, no dependencies).

Covers: create / retrieve / supersede / invalidate / persistence /
isolation / retrieval / evaluation / audit immutability.
"""

from __future__ import annotations

import tempfile
import unittest
from datetime import timedelta
from pathlib import Path

from afaq_intelligence_core import (
    MemoryConflictError,
    MemoryEvidence,
    MemoryNotFoundError,
    MemoryQuery,
    MemoryRecord,
    MemoryRetrieval,
    MemoryScope,
    MemoryService,
    MemoryState,
    MemoryStore,
    MemoryType,
    SqliteMemoryStore,
    evaluate_record,
    new_memory_record,
    reflect,
    validate_lesson,
)


def scope(tenant="t1", project="p1", agent="a1", env="production") -> MemoryScope:
    return MemoryScope(
        tenant_id=tenant, project_id=project, agent_id=agent, environment=env
    )


def evidence(confidence=0.8) -> tuple[MemoryEvidence, ...]:
    return (MemoryEvidence("ev-1", "test://source", confidence),)


class StoreContractTests(unittest.TestCase):
    def setUp(self) -> None:
        self.store = MemoryStore()

    def test_add_and_get(self):
        record = new_memory_record(
            memory_type=MemoryType.KNOWLEDGE,
            content={"note": "hello"},
            evidence=evidence(),
            scope=scope(),
        )
        self.store.add(record)
        self.assertEqual(self.store.get(record.memory_id), record)
        self.assertTrue(self.store.exists(record.memory_id))
        self.assertEqual(self.store.count(), 1)

    def test_add_duplicate_raises_conflict(self):
        record = new_memory_record(
            memory_type=MemoryType.KNOWLEDGE,
            content={"note": "x"},
            evidence=evidence(),
            scope=scope(),
        )
        self.store.add(record)
        with self.assertRaises(MemoryConflictError):
            self.store.add(record)

    def test_get_missing_raises_not_found(self):
        with self.assertRaises(MemoryNotFoundError):
            self.store.get("MEM-nope")

    def test_supersede_marks_previous_and_links(self):
        old = self.store.add(
            new_memory_record(
                memory_type=MemoryType.KNOWLEDGE,
                content={"v": 1},
                evidence=evidence(),
                scope=scope(),
            )
        )
        new = self.store.add(
            new_memory_record(
                memory_type=MemoryType.KNOWLEDGE,
                content={"v": 2},
                evidence=evidence(),
                scope=scope(),
                supersedes=old.memory_id,
            )
        )
        self.assertEqual(self.store.get(old.memory_id).state, MemoryState.SUPERSEDED)
        self.assertEqual(new.supersedes, old.memory_id)
        self.assertEqual(self.store.list_active(), (new,))

    def test_supersede_missing_target_raises(self):
        with self.assertRaises(MemoryNotFoundError):
            self.store.add(
                new_memory_record(
                    memory_type=MemoryType.KNOWLEDGE,
                    content={"v": 1},
                    evidence=evidence(),
                    scope=scope(),
                    supersedes="MEM-ghost",
                )
            )

    def test_cannot_supersede_non_active(self):
        old = self.store.add(
            new_memory_record(
                memory_type=MemoryType.KNOWLEDGE,
                content={"v": 1},
                evidence=evidence(),
                scope=scope(),
            )
        )
        self.store.transition(
            old.memory_id,
            to_state=MemoryState.INVALIDATED,
            expected=(MemoryState.ACTIVE,),
            actor="test",
            reason="bad",
        )
        with self.assertRaises(MemoryConflictError):
            self.store.add(
                new_memory_record(
                    memory_type=MemoryType.KNOWLEDGE,
                    content={"v": 2},
                    evidence=evidence(),
                    scope=scope(),
                    supersedes=old.memory_id,
                )
            )

    def test_transition_cas_conflict(self):
        record = self.store.add(
            new_memory_record(
                memory_type=MemoryType.KNOWLEDGE,
                content={"v": 1},
                evidence=evidence(),
                scope=scope(),
            )
        )
        with self.assertRaises(MemoryConflictError):
            self.store.transition(
                record.memory_id,
                to_state=MemoryState.INVALIDATED,
                expected=(MemoryState.SUPERSEDED,),
                actor="test",
                reason="wrong expectation",
            )

    def test_invalidation_requires_reason(self):
        record = self.store.add(
            new_memory_record(
                memory_type=MemoryType.KNOWLEDGE,
                content={"v": 1},
                evidence=evidence(),
                scope=scope(),
            )
        )
        updated = self.store.transition(
            record.memory_id,
            to_state=MemoryState.INVALIDATED,
            expected=(MemoryState.ACTIVE,),
            actor="test",
            reason="outdated",
        )
        self.assertEqual(updated.invalidation_reason, "outdated")

    def test_audit_trail_is_append_only_and_ordered(self):
        record = self.store.add(
            new_memory_record(
                memory_type=MemoryType.KNOWLEDGE,
                content={"v": 1},
                evidence=evidence(),
                scope=scope(),
            ),
            actor="creator",
        )
        self.store.transition(
            record.memory_id,
            to_state=MemoryState.INVALIDATED,
            expected=(MemoryState.ACTIVE,),
            actor="reviewer",
            reason="outdated",
        )
        trail = self.store.audit_trail(record.memory_id)
        self.assertEqual([e.action.value for e in trail], ["CREATED", "INVALIDATED"])
        self.assertEqual(trail[0].actor, "creator")
        self.assertEqual(trail[1].actor, "reviewer")
        # Frozen dataclass — no attribute mutation possible.
        with self.assertRaises(Exception):
            trail[0].actor = "hacker"  # type: ignore[misc]


class ServiceTests(unittest.TestCase):
    def setUp(self) -> None:
        self.service = MemoryService()

    def test_create_and_retrieve(self):
        record = self.service.create(
            memory_type=MemoryType.EXPERIENCE,
            content={"tags": ["search"], "note": "n"},
            evidence=evidence(),
            scope=scope(),
            actor="agent-1",
        )
        self.assertEqual(self.service.get(record.memory_id), record)
        trail = self.service.store.audit_trail(record.memory_id)
        self.assertEqual(trail[0].action.value, "CREATED")
        self.assertEqual(trail[0].actor, "agent-1")

    def test_supersede_via_service(self):
        old = self.service.create(
            memory_type=MemoryType.DECISION,
            content={"v": 1},
            evidence=evidence(),
            scope=scope(),
        )
        new = self.service.supersede(
            old.memory_id, content={"v": 2}, evidence=evidence()
        )
        self.assertEqual(self.service.get(old.memory_id).state, MemoryState.SUPERSEDED)
        self.assertEqual(self.service.get(new.memory_id).state, MemoryState.ACTIVE)

    def test_invalidate_idempotent_and_guarded(self):
        record = self.service.create(
            memory_type=MemoryType.KNOWLEDGE,
            content={"v": 1},
            evidence=evidence(),
            scope=scope(),
        )
        once = self.service.invalidate(record.memory_id, reason="r1")
        twice = self.service.invalidate(record.memory_id, reason="r2")
        self.assertEqual(once, twice)
        self.assertEqual(once.invalidation_reason, "r1")  # history preserved

        with self.assertRaises(ValueError):
            self.service.invalidate(new_memory_record(
                memory_type=MemoryType.KNOWLEDGE,
                content={"v": 2},
                evidence=evidence(),
                scope=scope(),
            ).memory_id, reason="")

    def test_cannot_invalidate_superseded(self):
        old = self.service.create(
            memory_type=MemoryType.KNOWLEDGE,
            content={"v": 1},
            evidence=evidence(),
            scope=scope(),
        )
        self.service.supersede(old.memory_id, content={"v": 2}, evidence=evidence())
        with self.assertRaises(MemoryConflictError):
            self.service.invalidate(old.memory_id, reason="late")

    def test_scope_isolation_between_tenants(self):
        s1, s2 = scope(tenant="t1"), scope(tenant="t2")
        r1 = self.service.create(
            memory_type=MemoryType.KNOWLEDGE,
            content={"secret": "t1"},
            evidence=evidence(),
            scope=s1,
        )
        self.service.create(
            memory_type=MemoryType.KNOWLEDGE,
            content={"secret": "t2"},
            evidence=evidence(),
            scope=s2,
        )
        hits = self.service.search(MemoryQuery(scope=s1))
        self.assertEqual([h.record.memory_id for h in hits], [r1.memory_id])

    def test_scope_isolation_between_environments(self):
        s_prod = scope(env="production")
        s_dev = scope(env="development")
        self.service.create(
            memory_type=MemoryType.FAILURE,
            content={"bug": "x"},
            evidence=evidence(),
            scope=s_dev,
        )
        self.assertEqual(self.service.search(MemoryQuery(scope=s_prod)), ())


class RetrievalTests(unittest.TestCase):
    def setUp(self) -> None:
        self.service = MemoryService()

    def test_filtering_and_ranking(self):
        s = scope()
        low = self.service.create(
            memory_type=MemoryType.FAILURE,
            content={"tags": ["x"]},
            evidence=evidence(0.6),
            scope=s,
        )
        high = self.service.create(
            memory_type=MemoryType.LESSON,
            content={
                "tags": ["x", "priority"],
                "reflection": "r",
                "derived_from": low.memory_id,
            },
            evidence=evidence(0.95),
            scope=s,
        )
        # high-confidence LESSON should outrank low-confidence FAILURE
        hits = self.service.search(MemoryQuery(scope=s, tags=("x",)))
        self.assertEqual(len(hits), 2)
        self.assertEqual(hits[0].record.memory_id, high.memory_id)
        self.assertEqual(hits[1].record.memory_id, low.memory_id)
        self.assertGreater(hits[0].score, hits[1].score)

    def test_min_confidence_and_state_filter(self):
        s = scope()
        self.service.create(
            memory_type=MemoryType.KNOWLEDGE,
            content={"weak": 1},
            evidence=evidence(0.4),
            scope=s,
        )
        strong = self.service.create(
            memory_type=MemoryType.KNOWLEDGE,
            content={"ok": 1},
            evidence=evidence(0.9),
            scope=s,
        )
        hits = self.service.search(
            MemoryQuery(scope=s, min_confidence=0.5)
        )
        self.assertEqual([h.record.memory_id for h in hits], [strong.memory_id])

        self.service.invalidate(strong.memory_id, reason="old")
        # weak record is still ACTIVE but below the confidence floor
        self.assertEqual(
            self.service.search(MemoryQuery(scope=s, min_confidence=0.5)), ()
        )
        self.assertEqual(
            len(self.service.search(MemoryQuery(scope=s, state=MemoryState.INVALIDATED))), 1
        )


class EvaluationTests(unittest.TestCase):
    def setUp(self) -> None:
        self.service = MemoryService()

    def _failure(self, s=None):
        return self.service.create(
            memory_type=MemoryType.FAILURE,
            content={"tags": ["f"]},
            evidence=evidence(0.9),
            scope=s or scope(),
        )

    def test_lesson_requires_validation(self):
        failure = self._failure()
        lesson = self.service.create(
            memory_type=MemoryType.LESSON,
            content={
                "reflection": "validate inputs early",
                "derived_from": failure.memory_id,
                "tags": ["validation"],
            },
            evidence=evidence(0.9),
            scope=scope(),
        )
        self.assertEqual(lesson.state, MemoryState.ACTIVE)

    def test_lesson_missing_reflection_rejected(self):
        failure = self._failure()
        with self.assertRaises(ValueError):
            self.service.create(
                memory_type=MemoryType.LESSON,
                content={"derived_from": failure.memory_id},
                evidence=evidence(0.9),
                scope=scope(),
            )

    def test_lesson_cross_boundary_rejected(self):
        failure = self._failure(s=scope(tenant="other"))
        candidate = new_memory_record(
            memory_type=MemoryType.LESSON,
            content={
                "reflection": "x",
                "derived_from": failure.memory_id,
            },
            evidence=evidence(0.9),
            scope=scope(tenant="t1"),
        )
        verdict = validate_lesson(self.service.store, candidate)
        self.assertFalse(verdict.accepted)
        self.assertTrue(any("boundary" in r for r in verdict.reasons))

    def test_lesson_from_invalidated_source_rejected(self):
        failure = self._failure()
        self.service.invalidate(failure.memory_id, reason="false alarm")
        candidate = new_memory_record(
            memory_type=MemoryType.LESSON,
            content={
                "reflection": "x",
                "derived_from": failure.memory_id,
            },
            evidence=evidence(0.9),
            scope=scope(),
        )
        verdict = validate_lesson(self.service.store, candidate)
        self.assertFalse(verdict.accepted)

    def test_evaluate_record(self):
        record = self._failure()
        report = self.service.evaluate(record.memory_id)
        self.assertTrue(report.passed)
        self.assertAlmostEqual(report.score, 0.9)

    def test_reflect_summary(self):
        s = scope()
        failure = self._failure(s)
        summary = self.service.reflect(s)
        self.assertEqual(summary.total_memories, 1)
        self.assertEqual(summary.open_failures, (failure.memory_id,))
        self.service.create(
            memory_type=MemoryType.LESSON,
            content={
                "reflection": "fixed",
                "derived_from": failure.memory_id,
                "tags": ["bugfix"],
            },
            evidence=evidence(0.9),
            scope=s,
        )
        summary = self.service.reflect(s)
        self.assertEqual(summary.open_failures, ())
        self.assertEqual(summary.derived_lessons, 1)
        self.assertEqual(summary.top_tags[0], "bugfix")


class PersistenceTests(unittest.TestCase):
    def test_sqlite_roundtrip(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "aic.db"
            store = SqliteMemoryStore(path)
            service = MemoryService(store)
            s = scope()
            record = service.create(
                memory_type=MemoryType.KNOWLEDGE,
                content={"note": "persist me", "tags": ["db"]},
                evidence=evidence(0.7),
                scope=s,
                actor="agent-p",
            )
            service.supersede(record.memory_id, content={"note": "v2"}, evidence=evidence(0.75))
            store.close()

            reopened = SqliteMemoryStore(path)
            service2 = MemoryService(reopened)
            self.assertEqual(service2.store.count(), 2)
            superseded = service2.store.get(record.memory_id)
            self.assertEqual(superseded.state, MemoryState.SUPERSEDED)
            self.assertEqual(superseded.content["note"], "persist me")
            actions = [e.action.value for e in reopened.audit_trail()]
            self.assertEqual(actions, ["CREATED", "SUPERSEDED", "CREATED"])
            hits = service2.search(MemoryQuery(scope=s))
            self.assertEqual(len(hits), 1)
            reopened.close()

    def test_sqlite_isolation(self):
        with tempfile.TemporaryDirectory() as tmp:
            store = SqliteMemoryStore(Path(tmp) / "aic.db")
            service = MemoryService(store)
            s1, s2 = scope(tenant="ta"), scope(tenant="tb")
            service.create(
                memory_type=MemoryType.KNOWLEDGE,
                content={"k": 1},
                evidence=evidence(),
                scope=s1,
            )
            service.create(
                memory_type=MemoryType.KNOWLEDGE,
                content={"k": 2},
                evidence=evidence(),
                scope=s2,
            )
            self.assertEqual(len(service.search(MemoryQuery(scope=s1))), 1)
            self.assertEqual(len(service.search(MemoryQuery(scope=None))), 2)
            store.close()

    def test_inmemory_and_sqlite_parity(self):
        records = []
        for store in (MemoryStore(),):
            service = MemoryService(store)
            s = scope()
            r = service.create(
                memory_type=MemoryType.EXPERIENCE,
                content={"e": 1},
                evidence=evidence(0.66),
                scope=s,
            )
            service.invalidate(r.memory_id, reason="test parity")
            records.append((store.audit_trail(), store.get(r.memory_id).state))
        with tempfile.TemporaryDirectory() as tmp:
            store = SqliteMemoryStore(Path(tmp) / "p.db")
            service = MemoryService(store)
            s = scope()
            r = service.create(
                memory_type=MemoryType.EXPERIENCE,
                content={"e": 1},
                evidence=evidence(0.66),
                scope=s,
            )
            service.invalidate(r.memory_id, reason="test parity")
            self.assertEqual(
                [e.action.value for e in store.audit_trail()], ["CREATED", "INVALIDATED"]
            )
            self.assertEqual(store.get(r.memory_id).state, MemoryState.INVALIDATED)
            store.close()


if __name__ == "__main__":
    unittest.main()
