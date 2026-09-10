"""AFAQ Intelligence Core (AIC).

Governed memory nucleus + model-agnostic learning agent.
Standalone component: no web framework imports, no network, stdlib only.
Layers:
  contracts    → types, scope boundaries, audit events
  store        → locking, atomic transitions, append-only audit
  persistence  → optional SQLite backend (not wired into production)
  retrieval    → deterministic ranked search
  evaluation   → record evaluation, lesson validation, reflection
  service      → governance facade used by callers
  agent        → recall -> execute -> evaluate -> reflect -> remember loop
"""

from .aic_agent import (
    AfaqLearningAgent,
    AgentContext,
    AgentRun,
    AgentTask,
    Evaluation,
    Reflector,
    RunEvaluator,
    TaskExecutor,
)
from .aic_memory_contracts import (
    LessonValidationOutcome,
    LessonValidationResult,
    MemoryAction,
    MemoryAuditEvent,
    MemoryEvidence,
    MemoryRecord,
    MemoryScope,
    MemoryState,
    MemoryType,
    new_audit_event,
    new_memory_record,
)
from .aic_memory_store import (
    MemoryConflictError,
    MemoryNotFoundError,
    MemoryStore,
    MemoryStoreError,
)
from .aic_persistence import SqliteMemoryStore
from .aic_retrieval import MemoryHit, MemoryQuery, MemoryRetrieval
from .aic_evaluation import (
    EvaluationCheck,
    EvaluationReport,
    ReflectionSummary,
    evaluate_record,
    reflect,
    validate_lesson,
)
from .aic_memory_service import MemoryService

__all__ = [
    # agent layer
    "AfaqLearningAgent", "AgentContext", "AgentRun", "AgentTask",
    "Evaluation", "TaskExecutor", "RunEvaluator", "Reflector",
    # contracts
    "MemoryEvidence", "MemoryRecord", "MemoryScope", "MemoryState",
    "MemoryType", "MemoryAction", "MemoryAuditEvent",
    "LessonValidationOutcome", "LessonValidationResult",
    "new_memory_record", "new_audit_event",
    # store + persistence
    "MemoryStore", "MemoryStoreError", "MemoryConflictError",
    "MemoryNotFoundError", "SqliteMemoryStore",
    # retrieval + evaluation
    "MemoryQuery", "MemoryHit", "MemoryRetrieval",
    "EvaluationCheck", "EvaluationReport", "ReflectionSummary",
    "evaluate_record", "validate_lesson", "reflect",
    # service facade
    "MemoryService",
]
