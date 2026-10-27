"""Pages through every review in the workspace with next_cursor.

    pip install requests
    PRISMA_API_KEY=pk_test_... python list_reviews.py [platform]
"""
import os
import sys

import requests

API = "https://api.prismareviews.com/v1"
HEADERS = {"Authorization": f"Bearer {os.environ['PRISMA_API_KEY']}"}


def reviews(**params):
    cursor = None
    while True:
        query = {"limit": 100, **params, **({"cursor": cursor} if cursor else {})}
        resp = requests.get(f"{API}/reviews", params=query, headers=HEADERS, timeout=30)
        resp.raise_for_status()
        page = resp.json()
        yield from page["data"]
        cursor = page["next_cursor"]
        if not cursor:
            return


if __name__ == "__main__":
    filters = {"platform": sys.argv[1]} if len(sys.argv) > 1 else {}
    count = 0
    for r in reviews(**filters):
        count += 1
        print(f"{r['platform']:<12} {'★' * (r['rating'] or 0):<5} {r['author'] or '—'}: {(r['text'] or '')[:80]}")
    print(f"\n{count} reviews")
