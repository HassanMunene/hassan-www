---
published: true
name: 'Schema migrations without downtime'
icon: 'code'
description: 'Expand-and-contract, the danger of NOT NULL, and why lock_timeout is your new best friend'
date: 2026-07-16
tags: [databases, reliability]
---

At some point every backend engineer runs their first destructive migration against a live table and learns a lesson they never forget. This post is that lesson, secondhand, for free.

### The golden rule: expand and contract

Never change what the code and the database agree on in one step. Instead, split every migration into three safe phases:

1. **Expand** — add the new column nullable, the new table, the new index `concurrently`. The old code doesn't care
2. **Migrate** — backfill in batches, deploy code that writes _both_ shapes, read from the new one. Rollout is a deploy, not a DDL statement
3. **Contract** — only when nothing reads the old shape anymore: drop the old column, remove the dual-write. Weeks later, on purpose

The killer feature of this discipline: **every step is reversible or harmless**. A bad migration becomes a non-event.

### The classic traps

- **`not null` on a big table.** Postgres must verify every row while holding a lock. Instead: add the column nullable → backfill in batches → add `not null` via `check (col is not null) not valid` then `validate constraint` — the modern way takes the lock for milliseconds
- **`alter table ... alter column type`.** Rewrites the table. Behind a lock. During Friday deploy. Don't
- **`create index` without `concurrently`** on anything real — it blocks writes for the duration
- **long-running transactions holding locks**, turning your fast migration into a queue of every query behind it. Set `lock_timeout` (fail fast, retry) and `statement_timeout` on migration runs

### Migrations are code, not events

- Forward-only files, reviewed like code, run by CI on deploy — never hand-typed into a console at midnight
- Tested against a **copy of production-scale data**, because a migration that takes 3 seconds on your laptop takes 40 minutes on the real table
- Every migration gets a **runbook line**: what it does, expected duration, rollback plan. Future-you at 2am is the audience

---

Downtime isn't a fact of life for growing systems; it's an architectural decision made lazily and paid loudly. Expand and contract is more steps and zero heroics — which is exactly why it works.
