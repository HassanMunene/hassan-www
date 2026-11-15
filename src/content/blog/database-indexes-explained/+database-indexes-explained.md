---
published: true
name: 'Database indexes, explained with a phone book'
icon: 'code'
description: 'What B-trees actually do, why your WHERE clause ignores your index, and how to read an explain plan'
date: 2026-08-27
tags: [databases, performance]
---

The phone book is the best explanation of a database index ever printed. Names are sorted by surname, then first name. That single design decision explains B-trees, composite index ordering, and most "why is this query slow?" Meetings you'll ever attend.

### What the index buys you

Find "Okafor" in a phone book and you don't start at page 1 — you jump to roughly the right page, because the book is **sorted**. A B-tree index is a sorted structure with a map: "Okafor entries start at offset x." Lookups go from O(n) full scans to O(log n) navigated jumps. Sorted insertions keep it that way.

### The rules the phone book teaches

**1. Column order is everything.** The book is sorted by `(surname, firstname)`. Finding "Okafor" is fast. Finding everyone named "Chidi" — without a surname — is a full-book scan, because firstname isn't sorted at the top level. Same in SQL: an index on `(a, b)` serves queries filtering `a`, or `a and b`, but **not `b` alone** (the leftmost-prefix rule). Order composite indexes by how you query.

**2. Ranges break the second column.** "All names between Murimi and Mutua, sorted by firstname" — the book can't do that, because within a surname the entries are sorted by firstname, and you're spanning many surnames. In SQL, a range condition on `a` prevents `(a, b)` from serving `b` too. Range columns go last in composite indexes.

**3. Some sorts are free.** A query ordering by `(surname, firstname)` needs no sort step — the index _is_ the order. Order by clauses that match index order are a quiet but large win.

### Why your index might be ignored anyway

- **the planner did the math and a scan is cheaper.** Returning 40% of the table, a scan is honest work. Indexes aren't automatic wins
- **functions and casts on the column**: `where lower(email) = ...` needs an expression index
- **leading wildcards**: `like '%son'` can't use the sort; `'son%'` can
- **implicit type casts** between column and parameter

### Reading the explain plan without fear

`explain analyze` is the phone book's table of contents. Look for: **Seq Scan** on a big table with a selective filter (bad sign), rows estimates wildly off reality (stale statistics — run analyze), and **nested loops over thousands of rows** (usually an N+1 wearing a suit). Fix the estimate or the access path — in that order of cheapness.

---

Add an index when a measured query needs it, verify with the plan, and stop. Every index also taxes every write. The phone book works because it's small and changes slowly — your hottest table might not have that luxury.
