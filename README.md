# Prisma Reviews API examples

Copy-paste examples for the [Prisma Reviews API](https://prismareviews.com). It is one REST API for reviews from 32 platforms: the App Store, Google Play, Judge.me, Trusted Shops, eKomi, Yelp, Tripadvisor, Booking.com, Google Maps, G2 and more. You get every review in the same JSON format, reply where the platform allows it, and receive webhooks for new reviews.

- **Docs:** https://prismareviews.com/docs
- **OpenAPI 3.1 spec:** [`openapi.json`](openapi.json), also at https://prismareviews.com/openapi.json
- **Postman collection:** [`prisma-reviews.postman_collection.json`](prisma-reviews.postman_collection.json)
- **Free key:** https://app.prismareviews.com/signup (2 locations free, no card)
- **Which platforms have an API, and what each allows:** https://prismareviews.com/which-review-platforms-have-an-api
- **State of Review Platform APIs 2026** (who allows replies, who gates access, who has no API): https://prismareviews.com/guides/state-of-review-platform-apis-2026
- **Webhooks:** https://prismareviews.com/review-webhooks

Test keys (`pk_test_…`) connect any platform at once, with sample locations and reviews. They never publish replies, so you can run every example here without a real account.

## Run the examples

```bash
export PRISMA_API_KEY="pk_test_..."
```

| Example | What it does |
| --- | --- |
| [`curl/quickstart.sh`](curl/quickstart.sh) | Connects a platform, lists locations and reviews, and replies to one |
| [`node/list-reviews.mjs`](node/list-reviews.mjs) | Pages through every review with `next_cursor` (Node 18+, no dependencies) |
| [`node/reply.mjs`](node/reply.mjs) | Replies to a review with an idempotency key |
| [`node/webhook-server.mjs`](node/webhook-server.mjs) | Receives webhooks and verifies the `Prisma-Signature` header |
| [`python/list_reviews.py`](python/list_reviews.py) | Pages through every review (`requests`) |
| [`python/webhook_server.py`](python/webhook_server.py) | Receives webhooks with Flask and verifies the signature |

## Generate a typed client

The OpenAPI spec works with any code generator. For example:

```bash
npx @openapitools/openapi-generator-cli generate -i https://prismareviews.com/openapi.json -g typescript-fetch -o prisma-client
```

## License

MIT. Prisma Reviews is a product of Sopa Lab SL (Madrid, Spain). It is not affiliated with any review platform.
