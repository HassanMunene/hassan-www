---
published: true
name: EDMS
description: An electronic document management system by OnceSync, built on Mayan EDMS with a new interface and APIs for the local market, running on a private network
thumbnail: edms-hero.jpg
ogImage: edms-hero.jpg
images: [edms-hero.jpg]
role: Part of the team that tailored and deployed it
status: Live, on a private network for the organization
stack:
date: 2026-09-01
---

<!-- TODO: add the frontend stack for the new interface, your exact role, and any numbers (users, documents) you're happy to share. -->

EDMS is the Electronic Document Management System from OnceSync. It is another big one I worked on as part of a team, and it is a very different kind of project from the others: instead of building everything from scratch, we started from the best open source EDMS we could find and made it fit the local market.

## Starting from Mayan EDMS

We decided to build on **Mayan EDMS**, the strongest open source document management system we evaluated. It already did the hard parts well. It exposed API endpoints, it had workers for background processing, and it had the depth a real document system needs.

## Making it fit the local market

Mayan on its own wasn't what our customers needed. So we kept its engine and rebuilt the experience around it:

- we consumed Mayan's APIs from our own code
- we built a new interface for it
- we added new APIs of our own on top, for what the local market asked for

The result is a system that feels made for the people who use it, with Mayan doing the heavy lifting underneath.

## What it can do

EDMS is much more than a place to store files. It carries out work on documents:

- **Workflows.** Documents move through steps and approvals, not just sit in folders.
- **Access control.** ACLs decide who can see and do what, down to individual documents.
- **Email and notifications.** The system manages email and notifies people when something needs their attention.
- **Document manipulation.** Redactions, and transformations of both documents and individual pages.

It is a genuinely powerful management tool, and it runs on a private network for the organization we set it up for, on their own infrastructure.

## What I learned

Building on top of something mature taught me a different kind of engineering: choosing well, learning a big system quickly, and adding value at the edges instead of rewriting the core.
