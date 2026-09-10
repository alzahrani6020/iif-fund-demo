from __future__ import annotations
from dataclasses import dataclass
from typing import Any
from .provider import AIRequest, AIResponse

@dataclass
class RouteRule:
    name: str
    provider: str
    max_complexity: int = 10

class AIRouter:
    def __init__(self):
        self.providers: dict[str, Any] = {}
        self.rules: list[RouteRule] = []

    def register(self, name: str, provider: Any):
        self.providers[name] = provider

    def add_rule(self, rule: RouteRule):
        self.rules.append(rule)

    def generate(self, request: AIRequest, complexity: int = 5, preferred: str | None = None) -> AIResponse:
        if preferred:
            return self.providers[preferred].generate(request)
        for rule in self.rules:
            if complexity <= rule.max_complexity and rule.provider in self.providers:
                return self.providers[rule.provider].generate(request)
        if not self.providers:
            raise RuntimeError("No AI providers registered")
        return next(iter(self.providers.values())).generate(request)
