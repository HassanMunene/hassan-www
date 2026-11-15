---
published: true
name: Cybill Software
description: An antivirus reseller platform in Kenya where partners sell Kaspersky and Bitdefender licences on commission, with M-Pesa and bank payments
thumbnail: cybillsoftware-hero.jpg
ogImage: cybillsoftware-hero.jpg
images: [cybillsoftware-hero.jpg]
role: Developer on the team, early in my career, learning from the senior developers
stats:
  - { n: '1st', label: 'Real project I worked on' }
date: 2026-10-01
---

<!-- TODO: add the stack, whether it's still live, and any numbers (partners, sales) you're happy to share. -->

Cybill Software was the first project that really mattered to me. It was early in my career, and it was the first time I was handed something interesting to build, something that real people would use and pay through.

## The idea

The company had won a contract to resell Kaspersky, and we were tasked with building an e-commerce style system around it. Instead of selling directly, we would onboard partners who sell licences on commission and earn on every sale. Partners sign up, pick a licence for their client, and send the client an M-Pesa payment request. After payment, the client gets the activation code and download link by email, and the partner's commission lands in their dashboard.

## The hard part: being the middle man

The biggest integration was the money flow. We sat between the Kaspersky distributor and the customer, so the payment had to be handled carefully:

- the money a customer pays goes directly to Kaspersky's accounts
- our cut is what remains for the company
- from that cut, the partner is paid their commission

Getting those three flows to reconcile, every time, was what made it more than a shop. Every payment had to be tracked and attributed to the right partner, and the numbers in the dashboard had to be right.

## Learning to integrate payments

I learned M-Pesa integration here, under the guidance of my senior developer **Pascal Muchiri**. M-Pesa was the way customers would pay locally, with an STK push straight to their phone. We also integrated with banks through the API endpoints they provide. Watching a senior developer work through payment callbacks, retries and failure cases taught me how seriously you have to treat anything that touches money.

## What it taught me

Cybill introduced me to the world of software engineering: building solutions that matter and that people actually use. I had written code before, but this was the first time a bug could mean a customer not getting their code or a partner not getting paid.

I learned to ask better questions, to read other people's code, and to respect the details around money. I still carry those habits into every project, from the Shamba platform to PMIS.
