#!/usr/bin/env bash
# Prisma Reviews quickstart with a test key: connect, list, reply. Needs curl and jq.
set -euo pipefail
API=https://api.prismareviews.com/v1
AUTH="Authorization: Bearer ${PRISMA_API_KEY:?Set PRISMA_API_KEY to your pk_test_ key}"

# 1. Connect a platform (a test key connects at once with sample data).
curl -s -X POST "$API/connections" -H "$AUTH" -H "Content-Type: application/json" \
  -d '{"platform": "app_store"}' | jq '{id, platform, status}'

# 2. List locations and take the first one.
LOCATION=$(curl -s "$API/locations" -H "$AUTH" | jq -r '[.data[] | select(.platform == "app_store")][0].id')
echo "Location: $LOCATION"

# 3. List its latest reviews.
curl -s "$API/reviews?location_id=$LOCATION&limit=5" -H "$AUTH" | jq '.data[] | {id, rating, author, text}'

# 4. Reply to the newest one (queued, then published; test keys never publish for real).
REVIEW=$(curl -s "$API/reviews?location_id=$LOCATION&limit=1" -H "$AUTH" | jq -r '.data[0].id')
curl -s -X POST "$API/reviews/$REVIEW/reply" -H "$AUTH" -H "Content-Type: application/json" \
  -H "Idempotency-Key: quickstart-$REVIEW" \
  -d '{"text": "Thanks for the review!"}' | jq '.reply'
