---
published: true
name: 'Idempotency keys in practice'
icon: 'code'
description: 'Why "just retry" corrupts data, and how to build idempotent APIs that actually work'
date: 2026-05-12
tags: [apis, reliability]
---

Every distributed system tutorial eventually says the words "make your operations idempotent." What it doesn't say is how much subtlety hides behind that one word. Here's the version I wish I'd read before implementing payments.

### The problem in one paragraph

Networks retry. Users double-click. Kafka delivers twice. If `POST /payments` creates a charge every time it's called, your users get double-charged and you get a very bad week. The fix is to make the operation safe to repeat — and the standard tool is the **idempotency key**: the client generates a unique token per logical operation and sends it with every retry.

### The parts tutorials skip

**Store the response, not just the key.** A naive implementation records "seen it, skip." But the client that retried _needs the original response_ — it never got it the first time. Save the key, the request fingerprint, and the full response together; replay the response on retry.

**Define the conflict behavior.** Same key, _different_ body: that's a client bug. Return `422`, loudly. Same key while the first request is still in flight: return `409` with a retry-after, or queue it — but decide deliberately.

**Scope and expire keys.** Keys should be scoped to the endpoint and the actor, and they need a TTL (24–72h is typical), or your idempotency table becomes its own outage.

**Get the storage model right.** The key, request hash, and response live in one row, written in the same transaction as the operation itself. Otherwise there's a window where the payment posts but the key doesn't — and the retry double-charges anyway.

### Testing it honestly

The test that matters isn't "calling twice returns the same response." It's: **start request, crash mid-transaction, restart, replay the same key, verify exactly one charge exists.** Simulate the crash. Inject the latency. Idempotency that isn't tested against partial failure is a comment in your code, not a property of your system.

---

Shipped well, this is invisible. That's the point — the best time to implement it is before the first double-charge, not after.
