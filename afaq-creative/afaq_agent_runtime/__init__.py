"""AFAQ Agent Runtime.

The deterministic governed core is importable without optional legacy AIC
packages. Legacy runtime symbols are loaded lazily only when requested.
"""

__version__ = "1.2.0"

from .governed_core import GovernedAgentError, GovernedProjectAgent
from .orchestrator import AfaqOrchestrator, OrchestrationError
from .repository_mapper import map_repository

__all__ = [
    "AfaqOrchestrator",
    "GovernedAgentError",
    "GovernedProjectAgent",
    "OrchestrationError",
    "map_repository",
    # legacy symbols below remain available lazily when their dependencies exist
    "AgentRuntime",
    "ModelUnavailableError",
    "RuntimeRouter",
    "EventLog",
    "ModelRouter",
    "TaskStore",
    "TERMINAL_STATES",
]


def __getattr__(name: str):
    if name in {"AgentRuntime", "ModelUnavailableError", "RuntimeRouter"}:
        from .agent_runtime import AgentRuntime, ModelUnavailableError, RuntimeRouter
        return {"AgentRuntime": AgentRuntime, "ModelUnavailableError": ModelUnavailableError, "RuntimeRouter": RuntimeRouter}[name]
    if name == "EventLog":
        from .event_log import EventLog
        return EventLog
    if name == "ModelRouter":
        from .model_router import ModelRouter
        return ModelRouter
    if name in {"TaskStore", "TERMINAL_STATES"}:
        from .task_store import TaskStore, TERMINAL_STATES
        return {"TaskStore": TaskStore, "TERMINAL_STATES": TERMINAL_STATES}[name]
    raise AttributeError(name)
