# Local Translator (NLLB-200)

This folder provides a **free, local** translation service using **NLLB-200**.

## Quick start (Windows)

```powershell
cd C:\Users\vip\iif-fund-demo\translator
python -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt
.\.venv\Scripts\python app.py
```

Service listens on: `http://127.0.0.1:7070`

## API

- `GET /healthz`
- `POST /translate`

Example:

```powershell
curl -X POST http://127.0.0.1:7070/translate `
  -H "Content-Type: application/json" `
  -d "{\"text\":\"مرحبا\",\"source_lang\":\"arb_Arab\",\"target_lang\":\"eng_Latn\"}"
```

## Notes

- Default model: `facebook/nllb-200-distilled-600M`
- You can override:
  - `IIF_TRANSLATE_MODEL`
  - `IIF_TRANSLATE_DEVICE` = `cuda` | `cpu` | `auto`

