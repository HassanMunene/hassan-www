---
published: true
name: 'The testing pyramid is upside down for APIs'
icon: 'code'
description: 'Why integration tests earn more than unit tests at the API boundary — and how to keep them fast'
date: 2026-04-07
tags: [apis, testing]
---

The classic testing pyramid says: many unit tests, fewer integration tests, a thin layer of end-to-end. After a few years of building APIs, I've concluded that for most backend work the pyramid is **upside down** — the money is in a small number of fast, honest integration tests.

### Why unit tests disappoint at the API layer

The job of an API is to accept requests, enforce rules, and commit correct data. Strip the database away and your unit test is asserting on mocks — it verifies your code agrees with your _assumptions_. SQL is not a mock. Transactions, constraints, generated columns, and query plans are where the actual behavior lives. A test suite that mocks the database mostly tests the mocks.

### The stack that earns its keep

One Postgres container, the real app, real HTTP calls:

- **the golden path** per endpoint: valid request → 200/201 → assert response _and_ database state
- **the rejection paths**: validation failures, auth failures, the conflict case (duplicate, overdrawn, expired) — assert status codes and that _nothing was written_
- **the evil trio**: retry (same idempotency key twice → one resource), concurrent (two parallel withdrawals → balance never negative), and crash-mid-operation (kill the process during a request; restart; assert the invariant holds)

That last trio is what unit tests structurally cannot give you, and what production inflicts on you anyway.

### Keeping it fast

Integration tests are slow only when you let them be:

- **one shared container per suite**, schema reset between tests via truncation or per-test transactions — not re-migrations
- **parallelize by database schema**, not by praying
- **keep mock-happy boundaries at the edges** (payment gateways, email) with contract tests instead of brittle stubs

### The honest split

For a typical API: 80% integration tests against real infrastructure, 20% unit tests — and only for genuine logic: date math, money rounding, validation rules. The pyramid assumed unit tests were the cheap, fast ones. With containers on every dev machine, that assumption expired. Build the suite that catches _production-shaped_ bugs, not the one that maximizes coverage percentages.
