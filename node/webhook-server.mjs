// Minimal webhook receiver that verifies Prisma-Signature (t=<unix>,v1=<hex HMAC-SHA256 of "t.rawBody">).
//   PRISMA_WEBHOOK_SECRET=... node webhook-server.mjs   → listens on http://localhost:3000/webhooks/prisma
// Register the endpoint with POST /v1/webhooks and keep the secret it returns (shown once).
import crypto from 'node:crypto';
import http from 'node:http';

const secret = process.env.PRISMA_WEBHOOK_SECRET;
if (!secret) throw new Error('Set PRISMA_WEBHOOK_SECRET');

export function verifyPrismaSignature(rawBody, header, secret) {
  const parts = Object.fromEntries((header ?? '').split(',').map((p) => p.split('=')));
  const t = Number(parts.t);
  if (!t || !parts.v1 || Math.abs(Date.now() / 1000 - t) > 300) return false;
  const expected = crypto.createHmac('sha256', secret).update(`${t}.${rawBody}`).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(parts.v1);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

const seen = new Set(); // de-duplicate retried events by id (use your database in production)

http.createServer((req, res) => {
  if (req.method !== 'POST' || req.url !== '/webhooks/prisma') return res.writeHead(404).end();
  let raw = '';
  req.on('data', (chunk) => (raw += chunk));
  req.on('end', () => {
    if (!verifyPrismaSignature(raw, req.headers['prisma-signature'], secret)) return res.writeHead(400).end('bad signature');
    const event = JSON.parse(raw);
    res.writeHead(200).end('ok'); // answer fast, work after
    if (seen.has(event.id)) return;
    seen.add(event.id);
    // Events carry IDs only: fetch the current object, e.g. GET /v1/reviews/{event.data.id}.
    console.log(event.type, event.data);
  });
}).listen(3000, () => console.log('Listening on http://localhost:3000/webhooks/prisma'));
