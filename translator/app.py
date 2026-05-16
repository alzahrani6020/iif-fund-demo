import os
import re
from typing import Any, Dict, List, Optional, Union

from fastapi import FastAPI
from pydantic import BaseModel, Field


def _guess_source_lang(text: str) -> str:
    # Minimal heuristic: Arabic script → arb_Arab; else English.
    if re.search(r"[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]", text or ""):
        return "arb_Arab"
    return "eng_Latn"


def _pick_device() -> str:
    pref = (os.getenv("IIF_TRANSLATE_DEVICE") or "auto").strip().lower()
    if pref in ("cpu", "cuda"):
        return pref
    try:
        import torch

        return "cuda" if torch.cuda.is_available() else "cpu"
    except Exception:
        return "cpu"


MODEL_NAME = (os.getenv("IIF_TRANSLATE_MODEL") or "facebook/nllb-200-distilled-600M").strip()
DEVICE = _pick_device()

_translator = None


def get_translator():
    global _translator
    if _translator is not None:
        return _translator
    from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

    tok = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)
    if DEVICE == "cuda":
        model = model.to("cuda")
    _translator = (tok, model)
    return _translator


def translate_one(text: str, source_lang: str, target_lang: str) -> str:
    tok, model = get_translator()
    tok.src_lang = source_lang
    encoded = tok(text, return_tensors="pt", truncation=True, max_length=512)
    if DEVICE == "cuda":
        encoded = {k: v.to("cuda") for k, v in encoded.items()}
    forced_bos = tok.convert_tokens_to_ids(target_lang)
    out = model.generate(
        **encoded,
        forced_bos_token_id=forced_bos,
        max_new_tokens=256,
        num_beams=4,
        length_penalty=1.0,
        no_repeat_ngram_size=3,
    )
    return tok.batch_decode(out, skip_special_tokens=True)[0]


class TranslateReq(BaseModel):
    text: Union[str, List[str]] = Field(..., description="Text or list of texts")
    source_lang: Optional[str] = Field(None, description="NLLB language code, e.g. arb_Arab")
    target_lang: str = Field(..., description="NLLB language code, e.g. eng_Latn")


app = FastAPI(title="IIF Local Translator", version="1.0")


@app.get("/healthz")
def healthz() -> Dict[str, Any]:
    return {
        "ok": True,
        "model": MODEL_NAME,
        "device": DEVICE,
    }


@app.post("/translate")
def translate(req: TranslateReq) -> Dict[str, Any]:
    items: List[str]
    if isinstance(req.text, list):
        items = [str(x) for x in req.text]
    else:
        items = [str(req.text)]
    src = req.source_lang
    out: List[str] = []
    for t in items:
        s = (src or _guess_source_lang(t)).strip()
        out.append(translate_one(t, s, req.target_lang.strip()))
    return {"ok": True, "source_lang": src or "auto", "target_lang": req.target_lang, "result": out if isinstance(req.text, list) else out[0]}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=int(os.getenv("IIF_TRANSLATE_PORT") or "7071"))

