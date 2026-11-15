---
published: true
name: 'How to read an unfamiliar codebase without drowning'
icon: 'paper'
description: 'A repeatable pass-by-pass method for onboarding onto a large codebase'
date: 2026-01-14
tags: [career]
---

Every new job, project, or open-source contribution starts the same way: a codebase you don't understand, a deadline you do. Over a few onboarding cycles I've settled on a method that works — for me and for the people I've mentored.

### Pass 1: the shape, not the files (30 minutes)

Resist opening source files. Instead:

- Run the project. `README`, then `docker compose up` or the equivalent — getting it _running_ teaches you the real entry points
- Read the dependency list and the folder structure. `src/routes`, `src/services`, `src/lib` — the directories are the architecture diagram the docs forgot
- Find the deployment config. It tells you what the _runtime_ actually cares about

### Pass 2: trace one feature end to end (2–3 hours)

Pick something small and user-visible — a button, an endpoint. Follow it: route → controller → service → query → response. The goal is not to understand everything; it's to calibrate how this codebase does **error handling, logging, validation, and auth** — its idioms. Every later change is easier because you've seen the pattern once.

### Pass 3: the gravity wells (ongoing)

Every codebase has them: the module everyone tiptoes around, the file with 40% of the churn. Find them with `git log --stat` frequency, and read the _tests_ around them — tests are executable documentation of intent.

### Rules that make it stick

- **take notes as an outsider.** The gaps you notice on day one disappear on day ten — you stop seeing them. Write them down; that list is your first contribution.
- **fix one small thing immediately.** A typo, a flaky test, a stale comment. It exercises the entire pipeline — branch, CI, review, deploy — while the stakes are zero.
- **ask questions in batches**, with what you tried attached. "I expected x, saw y, read z — where did I go wrong?" Gets great answers; "how does this work?" Gets none.

---

Reading code is the majority of the job and the least-taught skill. Treat it like the engineering problem it is: measure, trace, and leave the map better than you found it.
