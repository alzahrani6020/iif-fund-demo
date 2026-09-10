from __future__ import annotations
from dataclasses import dataclass
from typing import Callable, Any

@dataclass(frozen=True)
class ToolSpec:
    name: str
    description: str
    risk: str = "read"  # read | write | privileged
    handler: Callable[..., Any] | None = None

class ToolRegistry:
    def __init__(self): self._tools: dict[str, ToolSpec] = {}
    def register(self, tool: ToolSpec):
        if tool.name in self._tools: raise ValueError(f"Duplicate tool: {tool.name}")
        self._tools[tool.name] = tool
    def get(self, name: str) -> ToolSpec: return self._tools[name]
    def list(self): return tuple(self._tools.values())
    def execute(self, name: str, **kwargs):
        tool = self.get(name)
        if tool.handler is None: raise RuntimeError(f"Tool has no handler: {name}")
        return tool.handler(**kwargs)
