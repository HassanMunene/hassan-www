---
published: true
name: 'A survival guide to rate limiting'
icon: 'globe'
description: 'Token buckets vs sliding windows, where to put the counter, and the four-way handshake of 429s'
date: 2026-08-06
tags: [apis, reliability]
---

Rate limiting looks like a one-liner and ships like a subsystem. Here's the field guide I wish I had before my first API went viral.

### Pick your algorithm (they're not equal)

- **fixed window:** "100 requests per minute" reset on the clock. Simple, but clients learn to slam you at :59 and :00 — two windows' worth in two seconds. Fine for coarse protection
- **sliding window log:** exact, memory-hungry. Every request stored with a timestamp. Great for small n, expensive at scale
- **sliding window counter:** the pragmatic compromise — interpolate between the current and previous window. Good accuracy, tiny memory
- **token bucket:** the professional's choice. Requests consume tokens; tokens refill at a steady rate, letting controlled bursts through while capping sustained load. It maps directly onto how real traffic behaves

### The distributed elephant

One node, an in-memory counter, done. **Ten nodes behind a load balancer:** where does the counter live?

- **Redis with a Lua script** (atomic check-and-decrement) is the standard answer. It costs a round trip per request — usually acceptable
- **local counters with sync** trade precision for latency: each node limits at 1/n locally, syncing periodically. Occasional overage, no hot-spot on Redis
- **the chunky compromise:** each node leases batches of capacity (100 at a time), renewing as drained. Fewer round trips, bounded overshoot

Choose based on what the limit protects: billing hard limits want correctness; abuse protection tolerates fuzz.

### The part everyone skips: being a good 429

A rate limit response is an API contract. Include:

- `429` with **`retry-after`** in seconds — clients that honor it become well-behaved automatically
- **`ratelimit-limit` / `ratelimit-remaining` / `ratelimit-reset`** headers so clients self-regulate before hitting the wall
- A **distinct error body** — "rate limited" is a different world from "you did something wrong," and SDKs branch on it

And on the consuming side: respect those headers, back off exponentially with jitter, and cache aggressively. The best rate limit handling is the requests you never made.

---

Start with a token bucket at the edge, one shared counter store, honest 429s — then instrument before tightening anything. Most rate limit outages are self-inflicted by limits set with confidence instead of data.
