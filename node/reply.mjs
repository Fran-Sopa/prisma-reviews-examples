// Replies to a review. The reply is queued (202) and published by Prisma; you then get reply.published or reply.failed.
//   PRISMA_API_KEY=pk_test_... node reply.mjs rev_... "Thanks for your review!"
import crypto from 'node:crypto';

const [reviewId, text] = process.argv.slice(2);
if (!reviewId || !text) throw new Error('Usage: node reply.mjs <review_id> "<text>"');

const res = await fetch(`https://api.prismareviews.com/v1/reviews/${reviewId}/reply`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.PRISMA_API_KEY}`,
    'Content-Type': 'application/json',
    // Retrying with the same key never posts the reply twice.
    'Idempotency-Key': crypto.randomUUID(),
  },
  body: JSON.stringify({ text }),
});
const body = await res.json();
console.log(res.status, res.ok ? body.reply : body.error);
