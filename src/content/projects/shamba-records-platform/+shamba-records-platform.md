---
published: true
name: Shamba Records Platform
description: The digital platform serving more than 150,000 farmers across Kenya, now on a new UI with mobile support
thumbnail: shamba-records-platform-hero.jpg
ogImage: shamba-records-platform-hero.jpg
images: [shamba-records-platform-hero.jpg, shamba-records-platform.jpg]
insetLabel: In the field
role: Software engineer, mostly backend, frontend when needed
status: Live, used by farmers and field agents every day
stack:
stats:
  - { n: '150k+', label: 'Farmers on the platform' }
  - { n: '4', label: 'Channels: web, mobile, field agent, USSD' }
date: 2026-11-03
---

<!-- TODO: confirm from your CV before adding: this work contributed to expanding access to financial services and credit for over 50,000 farmers. -->

Shamba Records is one of the leading agritech companies in Kenya, and its platform serves more than 150,000 farmers. I joined as a software engineer, mostly on the backend, picking up the frontend whenever it was needed. This is the story of what working on one platform for this long has taught me.

## It started as a web app

The platform began as a web app talking to its own database, and that was enough. Then the farmers it served needed more than a website, and the real work began.

## The database taught me to measure

As the number of farmers grew, things that had been fine started to feel slow. My first instinct was to guess. What actually worked was to stop guessing: find the queries that were really slow, look at how the data was being asked for, and index for those real access patterns. Rewriting a query often did more than adding hardware.

That was my first lesson: performance work is mostly measurement. Fix what you can prove is slow.

## Then the platform had to go mobile

When we built MyShamba, our app on Google Play, the question changed. It was no longer "how do I make this screen work", it was "how do the web, the app, the field agents and USSD all see the same farmer".

We made the system **API first**. The APIs stopped being a detail of the web app and became the product, and every entry point became a client of the same APIs. A farmer registered by a field agent shows up in the app and on the web without anyone copying anything, and the rules live in one place.

This changed how I design things. I used to think in screens. Now I start with the data and the contract, and the screens come after.

## USSD taught me to respect the smallest screen

The channel that humbled me most is USSD. Farmers dial `*789*10#` and there is no app, no data bundle and no screen to speak of. The phone keeps no state, a session can drop at any moment, and the network won't wait for a slow API.

Working within that taught me to make every step small, keep the server in charge of state, and never leave half-finished work behind when a session ends. It also reminded me who the platform is for: not everyone has a smartphone, and the product has to work for them anyway.

## The new UI, and the payoff

We have since moved to a new UI with mobile support, and because the APIs were already shared, the new front end was built on top of what existed instead of replacing it. That is the payoff of the API-first decision I barely understood when we made it.

## Where I've grown

I came in thinking about features. I'm leaving each year thinking about systems: measure before optimizing, make the contract the center, design for the hardest channel first, and remember the person on the other end.
