// Pages through every review in the workspace with next_cursor. Node 18+, no dependencies.
//   PRISMA_API_KEY=pk_test_... node list-reviews.mjs [platform]
const API = 'https://api.prismareviews.com/v1';
const headers = { Authorization: `Bearer ${process.env.PRISMA_API_KEY}` };

async function* reviews(params = {}) {
  let cursor;
  do {
    const query = new URLSearchParams({ limit: '100', ...params, ...(cursor && { cursor }) });
    const res = await fetch(`${API}/reviews?${query}`, { headers });
    if (!res.ok) throw new Error(`Prisma ${res.status}: ${JSON.stringify((await res.json()).error)}`);
    const page = await res.json();
    yield* page.data;
    cursor = page.next_cursor;
  } while (cursor);
}

const platform = process.argv[2];
let count = 0;
for await (const r of reviews(platform ? { platform } : {})) {
  count++;
  console.log(`${r.platform.padEnd(12)} ${'★'.repeat(r.rating ?? 0).padEnd(5)} ${r.author ?? '—'}: ${(r.text ?? '').slice(0, 80)}`);
}
console.log(`\n${count} reviews`);
