---
published: true
name: 'Deploying small projects without a Kubernetes cluster'
icon: 'globe'
description: 'A pragmatic hosting stack for side projects: what to run where, and what to skip'
date: 2026-02-09
tags: [devops]
---

Every few months someone tells me their side project needs Kubernetes. It doesn't. Here's the stack I've converged on for small services — boring, cheap, and surprisingly hard to outgrow.

### The layers

**Static frontend → pages/cdn.** SvelteKit or next with static output goes to Cloudflare pages, GitHub pages, or Netlify. Free, fast, done. Don't rent a server for HTML.

**One API → one small VPS or a platform free tier.** Fly.io, Railway, Render, or a $5 VPS with a systemd unit. Until you have real traffic, a single well-configured process beats a swarm of misconfigured ones. (And if you choose the VPS, learn systemd restarts and log rotation _before_ the 2am crash, not during.)

**Postgres, managed.** Neon, Supabase, or your provider's managed Postgres. The moment you're storing money or user data, you do not want to be your own DBA — backups and point-in-time recovery are the whole product.

**Redis → only when justified.** It's a dependency with its own failure modes. Most "we need caching" problems at this scale are an index away from solved.

### The boring stuff that matters

- **HTTPS everywhere** via a reverse proxy (caddy makes this a two-liner)
- **migrations as code**, run on deploy, never by hand
- **one health endpoint** that actually checks the database, and uptime monitoring pointed at it
- **logs to stdout**, shipped wherever you'll actually look — not scattered across machines
- **a deploy script you can run from your phone**, because incidents don't wait for your laptop

### The real trick

The goal isn't an impressive architecture diagram; it's a service that survives you ignoring it for three weeks. Choose components that fail loudly, recover on their own, and cost little enough that you don't resent them. Scale problems are good problems — and they announce themselves with data, not opinions, so you'll know when it's time.
