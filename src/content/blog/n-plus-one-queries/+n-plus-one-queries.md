---
published: true
name: 'N+1 queries: a love letter to the query log'
icon: 'code'
description: 'An ORM made it one line of code. It also made it four hundred queries.'
date: 2026-03-19
tags: [databases, performance]
---

The N+1 query problem is the first performance bug everyone hits and the first one everyone's ORMs helpfully hide. This is a short field guide, written by someone who has caused it more than once.

### Anatomy of the bug

You have orders, each with a customer. You write:

```js
const orders = await db.orders.findAll();
for (const order of orders) {
	console.log(order.customer.name); // lazy-loads per iteration
}
```

One query for orders, then **one query per order** for its customer. Two hundred orders, two hundred and one round trips. Locally: instant. In production, with real data and real network latency: a three-second endpoint and a pager.

### How to find them

**Turn on query logging and read it.** Every ORM has it. The pattern is unmistakable once you've seen it — the same statement shape repeating with different parameters, right after a big result set loads.

Better: **instrument in aggregate.** Log query count per request alongside duration. When a page's count creeps up as data grows, you've found an N+1 before your users do. This one middleware has caught more problems for me than any APM dashboard.

### The fixes, ranked

1. **Eager load with a join or `include`.** The ORM's answer, and usually the right one: fetch orders _with_ their customers in one or two queries.
2. **Batch with `in`.** When you've already got the parents in memory, collect their IDs and fetch all children in one query, then stitch in memory. A `Map` keyed by ID is all the "ORM" you need here.
3. **Denormalize deliberately.** For genuinely hot paths — a username on a comment, say — storing the name on the child row is a legitimate trade. Just remember: you've now signed up to keep it consistent.

### The deeper lesson

The ORM gave you a line of code that looked free. It wasn't free; it was _amortized invisibly_. The general skill — worth building at every level — is knowing what your one-liner costs at 10 rows, at 10,000, and at 10,000,000. The query log is how you find out. Love it accordingly.
