from __future__ import annotations
from dataclasses import dataclass
import json, os

@dataclass(frozen=True)
class AICConfig:
    environment: str = "dev"
    ollama_url: str = "http://127.0.0.1:11434"
    model: str = "qwen2.5-coder:7b"

    @classmethod
    def load(cls, path: str | None = None):
        data={}
        if path and os.path.exists(path):
            with open(path,"r",encoding="utf-8") as f: data=json.load(f)
        return cls(
            environment=os.getenv("AIC_ENV", data.get("environment","dev")),
            ollama_url=os.getenv("AIC_OLLAMA_URL", data.get("ollama_url","http://127.0.0.1:11434")),
            model=os.getenv("AIC_MODEL", data.get("model","qwen2.5-coder:7b")),
        )
