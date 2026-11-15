---
published: true
name: 'Your app is not slow because of JavaScript'
icon: 'globe'
description: 'Measuring before optimizing: the four horsemen of slow frontends and how to tell them apart'
date: 2026-06-04
tags: [frontend, performance]
---

When a frontend feels slow, JavaScript gets blamed first and fired last. In most audits I've done, the framework is the _fourth_ biggest cause — behind images, waterfalls, and plain unmeasured guesses. Performance work is diagnosis, not vibes.

### Step zero: measure the actual user

Your laptop is a liar. Chrome DevTools CPU throttling at 4x, network at "slow 4g," and Lighthouse's **field data** (real users) instead of lab scores. A dev machine on fiber renders anything smoothly; your users in Nairobi on mid-range androids live in a different physics.

### The four horsemen, in guilt order

**1. Images.** The usual 70% of the page weight, and the usual 70% of the win: proper `srcset`/sizes, modern formats (avif/webp), explicit width/height (no layout shift), `loading="lazy"` below the fold, and preload for the one image that must lead the page.

**2. Request waterfalls.** Third-party scripts, fonts chained behind CSS, API calls that could run in parallel. The fix is boring: preload the critical path, defer everything else, and audit the third-party tags quarterly — they accrete like barnacles.

**3. Blocking the main thread.** Long tasks jank the page regardless of framework. Code-split by route, defer hydration-weight libraries (the date picker does not need to load on the login screen), move genuinely heavy work (parsing, crypto) to a web worker.

**4. JavaScript, finally.** Yes, the framework matters — but by the time it's your bottleneck, you've fixed the rest and earned the right to care. Memoize the actually-expensive render, not everything with a prop.

### The discipline that separates pros

**One change, one measurement.** "We refactored for performance" is a story; "we cut LCP from 4.1s to 2.3s by converting hero images to AVIF and adding srcset" is engineering. Keep a perf log: change, hypothesis, before/after numbers. Half the time the number refuses to move — that's information too, and it's how you learn what actually matters on your site.

---

Performance isn't a feature you finish; it's a budget you keep. Measure first, fix the horsemen in order, and only then blame JavaScript.
