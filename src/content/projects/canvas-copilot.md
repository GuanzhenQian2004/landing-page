---
title: Canvas CoPilot
summary: >-
  An AI-powered academic assistant that helps students manage and prioritize
  their coursework. Won 1st place at the University of Virginia Hackathon.
organization: University of Virginia
role: Machine Learning Engineer
dateLabel: March 2024
date: 2024-03-01
featured: true
gallery: []
tags:
  - OpenAI API
  - Python
  - ETL
  - Web Scraping
  - AES
draft: false
---

Canvas CoPilot connects a student's Canvas account to a language model so that
assignments, deadlines, and course material become something you can ask
questions about, rather than something you have to dig through.

It won **1st place** at the University of Virginia Hackathon.

## What it does

Students authenticate once, and CoPilot pulls their courses, assignments, and
due dates into a single view. From there it ranks daily academic tasks by
urgency and workload, so the next thing to work on is always at the top.

## How it works

- **Data collection** — web scraping scripts pull course content that the Canvas
  API doesn't expose directly.
- **ETL pipeline** — an extract-transform-load pipeline moves data between Canvas
  and the application database, normalizing inconsistent course structures along
  the way.
- **Assistant layer** — the OpenAI API turns that structured data into
  prioritized, plain-language guidance.

## Security

Because the system holds student academic records, encryption was part of the
design rather than an afterthought: **AES** for data at rest in the database, and
**SSL/TLS** for data in transit.
