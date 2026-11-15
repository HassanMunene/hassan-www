---
published: true
name: 'What the outbox pattern actually buys you'
icon: 'code'
description: 'Dual writes lose data in production. The outbox pattern is the boring fix.'
date: 2026-02-26
tags: [reliability, databases]
---

Here's a bug that ships quietly and detonates later:

```js
await db.save(order);        // succeeds
await events.publish(...);   // broker hiccups, throws
// order exists, downstream never hears about it. no error anywhere.
```

Two writes to two systems — a database and a message broker — with no shared transaction. The database commit succeeds, the publish fails, and the two systems silently disagree forever. This is the **dual-write problem**, and the fix has a boring name: the **transactional outbox**.

### The pattern

Instead of publishing the event, you _write it to a table_, in the same transaction as your business data:

```
BEGIN
  insert into orders ...
  insert into outbox (event_type, payload, status) values (...)
COMMIT
```

Either both writes happen or neither does. Atomicity, restored — between your rows.

Then a separate **relay** (poller or change-data-capture tail) reads the outbox, publishes each event, and marks it done. Consumers get exactly-once _visibility into what happened_, with at-least-once delivery in practice — which is why your consumers still need idempotency (see: every event handler should tolerate redelivery).

### The details that decide success or failure

- **ordering:** one relay, one partition per aggregate ID, or explicit sequence numbers. Naive parallelism shuffles your event history.
- **cleanup:** outbox rows are a liability after delivery. Archive aggressively.
- **monitoring the lag:** alert on `oldest undelivered event age`, not just queue depth. A stuck relay is an outage that hasn't been noticed yet.

### Why I like it

The outbox isn't clever. It uses the atomicity your database already has, requires no new infrastructure, and fails in ways you can see and replay. In a field full of exotic consistency schemes, "write it down in the same transaction, then deliver" is the pattern most likely to still be running correctly in five years.
