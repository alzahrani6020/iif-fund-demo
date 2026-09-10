from __future__ import annotations
from dataclasses import dataclass, field
from typing import Protocol, Any

@dataclass(frozen=True)
class AIRequest:
    system: str
    prompt: str
    context: dict[str, Any] = field(default_factory=dict)
    temperature: float = 0.2
    max_tokens: int = 2048
    # Per-operation ceiling. None -> the provider's own default. Lets the
    # runtime give a quick classification a short leash and a long proposal
    # a long one, instead of one flat timeout for everything.
    timeout: float | None = None
    # Per-request model override (hardware-adaptive routing). None -> the
    # provider's configured default model. Lets the router pick a different
    # local model per task without rebuilding provider slots.
    model: str | None = None
    # Ollama keep_alive for this request (e.g. "30m" to keep a fast model
    # warm between tasks when RAM headroom allows). None -> server default.
    keep_alive: str | None = None

@dataclass(frozen=True)
class AIResponse:
    text: str
    model: str
    provider: str
    metadata: dict[str, Any] = field(default_factory=dict)

class AIProvider(Protocol):
    name: str
    def generate(self, request: AIRequest) -> AIResponse: ...
    def health(self) -> dict[str, Any]: ...
