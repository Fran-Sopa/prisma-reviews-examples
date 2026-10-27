"""Webhook receiver with Flask that verifies Prisma-Signature.

    pip install flask
    PRISMA_WEBHOOK_SECRET=... python webhook_server.py   → http://localhost:3000/webhooks/prisma
"""
import hashlib
import hmac
import os
import time

from flask import Flask, abort, request

app = Flask(__name__)
SECRET = os.environ["PRISMA_WEBHOOK_SECRET"]
seen = set()  # de-duplicate retried events by id (use your database in production)


def verify_prisma_signature(raw_body: bytes, header: str, secret: str) -> bool:
    try:
        parts = dict(p.split("=", 1) for p in header.split(","))
        t, sig = parts["t"], parts["v1"]
        if abs(time.time() - int(t)) > 300:
            return False
    except (KeyError, ValueError):
        return False
    expected = hmac.new(secret.encode(), t.encode() + b"." + raw_body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, sig)


@app.post("/webhooks/prisma")
def prisma_webhook():
    if not verify_prisma_signature(request.get_data(), request.headers.get("Prisma-Signature", ""), SECRET):
        abort(400)
    event = request.get_json()
    if event["id"] not in seen:
        seen.add(event["id"])
        # Events carry IDs only: fetch the current object, e.g. GET /v1/reviews/{event["data"]["id"]}.
        print(event["type"], event["data"])
    return "ok"


if __name__ == "__main__":
    app.run(port=3000)
