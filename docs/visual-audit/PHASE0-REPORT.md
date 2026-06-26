# Phase 0 — تقرير تدقيق الثقة

Generated: 2026-06-25T07:35:19.783Z
Base URL: http://localhost:3000

| # | Path | Desktop | Mobile | Digits | Match | Notes |
|---|------|---------|--------|--------|-------|-------|
| 25 | `/dashboard/command` | [desktop](./phase0/error.png) | [mobile](./phase0/error.png) | لاتينية ✅ | ❌ | page.waitForURL: Timeout 60000ms exceeded.
=========================== logs ===========================
waiting for navigation to "**/dashboard**" until "load"
============================================================ |
| 17 | `/dashboard/campaigns/new` | [desktop](./phase0/error.png) | [mobile](./phase0/error.png) | لاتينية ✅ | ❌ | page.waitForURL: Timeout 60000ms exceeded.
=========================== logs ===========================
waiting for navigation to "**/dashboard**" until "load"
============================================================ |
| 22 | `/dashboard/campaigns/cmqt6f8sg000aepx03yphhw6l/live` | [desktop](./phase0/error.png) | [mobile](./phase0/error.png) | لاتينية ✅ | ❌ | page.waitForURL: Timeout 60000ms exceeded.
=========================== logs ===========================
waiting for navigation to "**/dashboard**" until "load"
============================================================; page.waitForSelector: Timeout 60000ms exceeded.
Call log:
  - waiting for locator('#phone') to be visible
 |
| 35 | `/sponsor/roi` | [desktop](./phase0/35-sponsor-roi-desktop.png) | [mobile](./phase0/35-sponsor-roi-mobile.png) | لاتينية ✅ | ✅ | يطابق التقرير |
| 37 | `/marketplace` | [desktop](./phase0/37-marketplace-desktop.png) | [mobile](./phase0/37-marketplace-mobile.png) | لاتينية ✅ | ✅ | يطابق التقرير |
| 48 | `/intelligence/heatmap` | [desktop](./phase0/error.png) | [mobile](./phase0/error.png) | لاتينية ✅ | ❌ | page.waitForURL: Timeout 60000ms exceeded.
=========================== logs ===========================
waiting for navigation to "**/dashboard**" until "load"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
============================================================; page.waitForURL: Timeout 60000ms exceeded.
=========================== logs ===========================
waiting for navigation to "**/dashboard**" until "load"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
============================================================ |
| 41 | `/admin/wallet` | [desktop](./phase0/41-admin-wallet-desktop.png) | [mobile](./phase0/41-admin-wallet-mobile.png) | لاتينية ✅ | ✅ | يطابق التقرير |
| 47 | `/agency/dashboard` | [desktop](./phase0/47-agency-dashboard-desktop.png) | [mobile](./phase0/47-agency-dashboard-mobile.png) | لاتينية ✅ | ✅ | يطابق التقرير |
| 9 | `/leaderboard/sponsors/damascus` | [desktop](./phase0/09-leaderboard-sponsors-damascus-desktop.png) | [mobile](./phase0/09-leaderboard-sponsors-damascus-mobile.png) | لاتينية ✅ | ✅ | يطابق التقرير |
| 39 | `/partner` | [desktop](./phase0/39-partner-desktop.png) | [mobile](./phase0/39-partner-mobile.png) | لاتينية ✅ | ✅ | يطابق التقرير |
| 28 | `/dashboard/notifications` | [desktop](./phase0/error.png) | [mobile](./phase0/error.png) | لاتينية ✅ | ❌ | page.waitForURL: Timeout 60000ms exceeded.
=========================== logs ===========================
waiting for navigation to "**/dashboard**" until "load"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
============================================================; page.waitForURL: Timeout 60000ms exceeded.
=========================== logs ===========================
waiting for navigation to "**/dashboard**" until "load"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
  navigated to "http://localhost:3000/login"
============================================================ |
| 5 | `/c/SPARK-HERO-H1?demo=1` | [desktop](./phase0/05-c-SPARK-HERO-H1-demo-1-desktop.png) | [mobile](./phase0/05-c-SPARK-HERO-H1-demo-1-mobile.png) | لاتينية ✅ | ✅ | يطابق التقرير |

**Summary:** 7/12 pages passed (desktop + mobile).

**Gate:** ❌ STOP — ≥3 failures; reapply critical prompt.