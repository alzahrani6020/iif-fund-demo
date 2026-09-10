from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Callable, Mapping, Protocol
from uuid import uuid4
import re

from .aic_memory_contracts import MemoryEvidence, MemoryRecord, MemoryScope, MemoryType
from .aic_memory_service import MemoryService


@dataclass(frozen=True, slots=True)
class AgentContext:
    tenant_id: str
    project_id: str
    agent_id: str = "afaq-learning-agent"
    environment: str = "development"

    def as_metadata(self) -> dict[str, str]:
        return {
            "tenant_id": self.tenant_id,
            "project_id": self.project_id,
            "agent_id": self.agent_id,
            "environment": self.environment,
        }


@dataclass(frozen=True, slots=True)
class AgentTask:
    instruction: str
    context: AgentContext
    task_id: str = field(default_factory=lambda: f"TASK-{uuid4()}")
    metadata: Mapping[str, Any] = field(default_factory=dict)


@dataclass(frozen=True, slots=True)
class Evaluation:
    success: bool
    score: float
    reason: str

    def __post_init__(self) -> None:
        if not 0.0 <= self.score <= 1.0:
            raise ValueError("evaluation score must be between 0.0 and 1.0")


@dataclass(frozen=True, slots=True)
class AgentRun:
    run_id: str
    task_id: str
    started_at: datetime
    finished_at: datetime
    output: Mapping[str, Any]
    evaluation: Evaluation
    recalled_memory_ids: tuple[str, ...]
    created_memory_ids: tuple[str, ...]


class TaskExecutor(Protocol):
    def __call__(
        self,
        task: AgentTask,
        recalled_memories: tuple[MemoryRecord, ...],
    ) -> Mapping[str, Any]: ...


class RunEvaluator(Protocol):
    def __call__(
        self,
        task: AgentTask,
        output: Mapping[str, Any],
    ) -> Evaluation: ...


class Reflector(Protocol):
    def __call__(
        self,
        task: AgentTask,
        output: Mapping[str, Any],
        evaluation: Evaluation,
    ) -> Mapping[str, Any] | None: ...


_TOKEN_RE = re.compile(r"[\w\u0600-\u06FF]+", re.UNICODE)


def _tokens(value: Any) -> set[str]:
    text = str(value).lower()
    return {token for token in _TOKEN_RE.findall(text) if len(token) > 2}


class AfaqLearningAgent:
    """Model-agnostic agent loop: recall -> execute -> evaluate -> reflect -> remember.

    The class deliberately does not call an LLM or production service directly.  Those
    capabilities are injected as callables so the governance layer stays testable and
    can be connected to any approved runtime later.
    """

    def __init__(
        self,
        *,
        memory: MemoryService,
        executor: TaskExecutor,
        evaluator: RunEvaluator,
        reflector: Reflector | None = None,
        recall_limit: int = 5,
    ) -> None:
        if recall_limit < 0:
            raise ValueError("recall_limit must be >= 0")
        self._memory = memory
        self._executor = executor
        self._evaluator = evaluator
        self._reflector = reflector
        self._recall_limit = recall_limit

    def recall(self, task: AgentTask) -> tuple[MemoryRecord, ...]:
        if self._recall_limit == 0:
            return ()

        task_tokens = _tokens(task.instruction)
        scope = task.context.as_metadata()
        ranked: list[tuple[int, float, MemoryRecord]] = []

        for record in self._memory.list_active():
            # Isolation is enforced on the record's hard scope boundary, never
            # on caller-supplied metadata (which may be missing or spoofed).
            if any(
                getattr(record.scope, key) != value for key, value in scope.items()
            ):
                continue

            record_tokens = _tokens(record.content)
            overlap = len(task_tokens & record_tokens)
            if overlap == 0:
                continue

            confidence = sum(e.confidence for e in record.evidence) / len(record.evidence)
            ranked.append((overlap, confidence, record))

        ranked.sort(key=lambda item: (item[0], item[1], item[2].created_at), reverse=True)
        return tuple(record for _, _, record in ranked[: self._recall_limit])

    def run(self, task: AgentTask) -> AgentRun:
        started_at = datetime.now(timezone.utc)
        recalled = self.recall(task)
        output = dict(self._executor(task, recalled))
        evaluation = self._evaluator(task, output)
        created: list[str] = []

        evidence = (
            MemoryEvidence(
                evidence_id=f"EV-{uuid4()}",
                source_ref=f"agent-run:{task.task_id}",
                confidence=max(0.0, min(1.0, evaluation.score)),
            ),
        )
        metadata = {
            **task.context.as_metadata(),
            "task_id": task.task_id,
            "evaluation_score": evaluation.score,
            **dict(task.metadata),
        }
        scope = MemoryScope(
            tenant_id=task.context.tenant_id,
            project_id=task.context.project_id,
            agent_id=task.context.agent_id,
            environment=task.context.environment,
        )

        experience_type = MemoryType.EXPERIENCE if evaluation.success else MemoryType.FAILURE
        experience = self._memory.create(
            memory_type=experience_type,
            content={
                "instruction": task.instruction,
                "output": output,
                "evaluation_reason": evaluation.reason,
            },
            evidence=evidence,
            scope=scope,
            metadata=metadata,
        )
        created.append(experience.memory_id)

        # A lesson is a derived proposal: it must carry the experience it was
        # learned from and a reflection, and it only clears governance when the
        # evidence confidence meets the lesson floor (see aic_evaluation).
        lesson_confidence = max(0.0, min(1.0, evaluation.score))
        if self._reflector is not None and lesson_confidence >= 0.5:
            lesson_content = dict(self._reflector(task, output, evaluation))
            if lesson_content:
                lesson_content.setdefault("reflection", evaluation.reason)
                lesson_content["derived_from"] = experience.memory_id
                lesson = self._memory.create(
                    memory_type=MemoryType.LESSON,
                    content=lesson_content,
                    evidence=(
                        MemoryEvidence(
                            evidence_id=f"EV-{uuid4()}",
                            source_ref=f"memory:{experience.memory_id}",
                            confidence=lesson_confidence,
                        ),
                    ),
                    scope=scope,
                    metadata={**metadata, "derived_from": experience.memory_id},
                )
                created.append(lesson.memory_id)

        finished_at = datetime.now(timezone.utc)
        return AgentRun(
            run_id=f"RUN-{uuid4()}",
            task_id=task.task_id,
            started_at=started_at,
            finished_at=finished_at,
            output=output,
            evaluation=evaluation,
            recalled_memory_ids=tuple(record.memory_id for record in recalled),
            created_memory_ids=tuple(created),
        )


__all__ = [
    "AfaqLearningAgent",
    "AgentContext",
    "AgentTask",
    "AgentRun",
    "Evaluation",
    "TaskExecutor",
    "RunEvaluator",
    "Reflector",
]
