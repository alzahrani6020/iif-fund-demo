from __future__ import annotations
import json
import os
import socket
from urllib import request, error
from .provider import AIRequest, AIResponse

class OllamaProvider:
    name = "ollama"
    def __init__(self, model: str = "qwen2.5-coder:7b", base_url: str = "http://127.0.0.1:11434", timeout: int | None = None):
        self.model = model
        self.base_url = base_url.rstrip("/")
        # CPU-bound local generation can exceed minutes for large proposals;
        # the old hardcoded 120s killed healthy-but-slow calls. Configurable
        # via env, explicit constructor value always wins.
        self.timeout = timeout if timeout is not None else int(os.getenv("AIC_OLLAMA_TIMEOUT_S", "600"))

    def generate(self, req: AIRequest) -> AIResponse:
        model = req.model or self.model
        payload = {
            "model": model,
            "prompt": req.prompt,
            "system": req.system,
            # Streaming is required for correctness, not convenience: with
            # stream=False Ollama buffers the whole generation and sends it in
            # one body read, so a healthy-but-slow model (measured ~5 tok/s
            # for the 7B coder) blows any per-read socket timeout long before
            # finishing — proven live as 60s zero-byte "timeouts" on proposal
            # calls. Streamed chunks keep the timeout a true liveness check.
            "stream": True,
            # Thinking models (e.g. qwen3) otherwise spend the whole
            # num_predict budget on reasoning and return an empty response.
            "think": False,
            "options": {"temperature": req.temperature, "num_predict": req.max_tokens},
        }
        if req.keep_alive:
            payload["keep_alive"] = req.keep_alive
        body = json.dumps(payload).encode("utf-8")
        http = request.Request(self.base_url + "/api/generate", data=body, headers={"Content-Type": "application/json"})
        effective_timeout = req.timeout or self.timeout
        try:
            with request.urlopen(http, timeout=effective_timeout) as r:
                chunks: list[str] = []
                done_data: dict = {}
                for raw in r:
                    line = raw.decode("utf-8", errors="replace").strip()
                    if not line:
                        continue
                    try:
                        event = json.loads(line)
                    except ValueError:
                        continue  # tolerate interleaved non-JSON lines
                    chunks.append(event.get("response") or "")
                    if event.get("done"):
                        done_data = event
                        break
        except error.HTTPError as exc:
            # e.g. 404 model not pulled — the router's fail-clearly contract
            # depends on an accurate, distinguishable message.
            raise RuntimeError(
                f"Ollama HTTP {exc.code} for model {model}: {exc.reason}"
            ) from exc
        except (TimeoutError, socket.timeout) as exc:
            raise RuntimeError(
                f"Ollama request timed out after {effective_timeout}s (model {model}): {exc}"
            ) from exc
        except error.URLError as exc:
            reason = getattr(exc, "reason", exc)
            if isinstance(reason, (TimeoutError, socket.timeout)):
                raise RuntimeError(
                    f"Ollama request timed out after {effective_timeout}s (model {model})"
                ) from exc
            raise RuntimeError(f"Ollama unreachable at {self.base_url}: {reason}") from exc
        text = "".join(chunks).strip()
        if not text:
            raise RuntimeError(f"empty response from model {model}")
        return AIResponse(text=text, model=model, provider=self.name,
                          metadata={"done": done_data.get("done"), "eval_count": done_data.get("eval_count")})

    def health(self):
        try:
            with request.urlopen(self.base_url + "/api/tags", timeout=3) as r:
                return {"ok": r.status == 200, "provider": self.name, "model": self.model}
        except Exception as exc:
            return {"ok": False, "provider": self.name, "model": self.model, "error": str(exc)}
