---
published: true
name: 'The AppSec checklist every app developer fails'
icon: 'code'
description: 'The ten vulnerabilities that actually ship — and the habits that stop them'
date: 2026-09-15
tags: [security]
---

Most security advice is written for security teams. This is for the rest of us — the ten ways applications actually get broken, and the habits that catch them before a pentest report does.

### 1. Authorization is not authentication

"I know who you are" ≠ "you may see this." The classic bug: `/api/invoices/42` returns the invoice because the user is logged in — anyone's invoice. Fix: **every fetch by ID goes through ownership/tenant checks**, ideally enforced in the data layer so forgetting it once doesn't leak a database. Write the test: user a requests user b's resource → expect 404.

### 2. Mass assignment

`user.update(req.body)` — and a customer sends `{"role": "admin"}`. Allow-list fields explicitly, or strip privileged ones. Frameworks make this too convenient; that's the vulnerability.

### 3. Injection didn't die, it moved

SQL injection is solved by parameterized queries _until_ someone concatenates an order-by column or a table name. Then there's the new generation: **prompt injection** into LLM features, and shell interpolation in CI scripts. The rule is unchanged: data is data, code is code, never the twain.

### 4. Secrets in the wrong places

Keys in environment variables, never in code; different secrets per environment; rotation rehearsed, not theorized; and the front matter of every tutorial ignored — if it's in a client bundle, it's public. The number of "private" API keys shipping in JavaScript would keep a bug bounty program busy forever.

### 5. The dependency you didn't audit

`npm audit` on CI, lockfiles committed, and a healthy suspicion of packages that do one nice thing and want 40 transitive permissions. Your attack surface includes everyone else's attack surface.

### 6. Auth sessions done halfway

HttpOnly cookies over HTTPS, short-lived access tokens, refresh with rotation, logout that actually invalidates. And rate limit login endpoints — credential stuffing is background noise on every public API.

### 7. File uploads

Never trust the filename or content-type. Validate the magic bytes, store outside the webroot, serve from a separate domain (that's how you avoid stored-xss via SVG), and cap sizes.

### 8. Information leakage in errors

Stack traces to the client, SQL errors with table names, "invalid password" vs "no such user" — each is a free reconnaissance report to an attacker. Log richly server-side, return politely and vaguely.

### 9. Missing security headers

CSP (start report-only, tighten monthly), HSTS, x-content-type-options, frame-ancestors. An afternoon of headers neutralizes entire exploit classes.

### 10. "We'll add rate limiting later"

You won't. Every public endpoint gets a rate limit on day one. See my earlier post — being a good 429 is also a security control.

---

None of this requires being a security engineer. It's a checklist habit: before shipping a feature — who can access it, what input does it trust, what does it leak when it fails. Ten minutes; the pentest report you never get is the reward.
