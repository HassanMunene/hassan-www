---
published: true
name: PMIS
description: A system tracking food security and climate resilience work across 13 arid and semi-arid counties, built with the World Bank for the Ministry of Agriculture
thumbnail: pmis-hero.jpg
ogImage: pmis-hero.jpg
images: [pmis-hero.jpg, pmis.jpg]
insetLabel: Training the team
role: Part of the lead team, backend, APIs, tracking and reporting, plus rollout and support
status: Live, supported in production
stack:
stats:
  - { n: '13', label: 'Arid and semi-arid counties' }
  - { n: '1M+', label: 'Farmers the project aims to benefit' }
date: 2026-11-02
---

<!-- TODO: confirm "FSRP" expansion (Food Systems Resilience Project) from the project docs. -->

PMIS is the Project Management Information System for the Ministry of Agriculture, built in collaboration with the World Bank. It is part of a government of Kenya initiative to promote food security and climate resilience in arid and semi-arid (ASAL) regions, with the goal of benefiting more than 1 million farmers. The system gives the ministry one place to see what is being done, where, and for whom.

## Thirteen counties, four regions

The project spans 13 counties, and the system had to work for all of them:

- **Rift Valley (6):** Turkana, West Pokot, Elgeyo-Marakwet, Baringo, Samburu and Laikipia
- **Eastern (2):** Marsabit and Isiolo
- **North Eastern (3):** Mandera, Wajir and Garissa
- **Coast (2):** Tana River and Lamu

These counties are far apart and very different, and the people entering and reading data in each of them have different needs and connectivity. That shaped a lot of how we designed the system.

## What we built it with

I was part of the lead team, working on the backend, the APIs, implementation tracking and reporting.

The backend is Python with Django, on PostgreSQL. Redis and Celery handle background and scheduled work, with a worker and a beat scheduler running alongside the app. The frontend is TypeScript and React with shadcn/ui. Everything runs in Docker, so the same stack that runs on my laptop is the one we deploy. `docker compose up` brings up Postgres, Redis, Django and Celery together.

## Rolling it out

I trained the people who use it, in person, in rooms like the one in the photo above. Standing in front of the users taught me things a spec never could: what they actually click, what confuses them, and which words in the interface they don't understand.

## Software development is half the work

The biggest thing PMIS taught me is that writing the system is only half the job. The real work starts once people begin using it.

Edge cases show up that nobody planned for. Phone calls come at odd hours. The system feels slow on the day it matters most, and you have to find out why. Troubleshooting a live system, with real people waiting on it, is a different skill from building one.

## What I've learned

Build for the person using it in the hardest conditions, not the demo. Plan the rollout and support as part of the system, not as an afterthought. And be ready to answer the phone.
