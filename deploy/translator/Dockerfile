FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY translator/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY translator/app.py /app/app.py

EXPOSE 7071

ENV IIF_TRANSLATE_PORT=7071

CMD ["python", "app.py"]

