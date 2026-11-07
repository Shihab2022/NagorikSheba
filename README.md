# Hemoglobin

A blood donation platform. This repository currently holds the **front end** —
a marketing landing site plus donor-registration and blood-request flows.

## Tech stack

| Layer     | Choice                                   |
| --------- | ---------------------------------------- |
| Framework | Next.js 16 (App Router, Turbopack)       |
| UI        | React 19                                 |
| Language  | TypeScript                               |
| Styling   | Tailwind CSS v4 (`@theme` design tokens) |

No component or icon libraries — the logo and the icon set are local, inline SVG.

## Project layout

```
haemoglobin/
├── frontend/               # Next.js app
│   ├── app/
│   │   ├── layout.tsx      # Fonts, metadata, viewport
│   │   ├── globals.css     # Brand tokens, base styles, motion
│   │   ├── icon.svg        # Favicon (blood drop + heartbeat mark)
│   │   ├── page.tsx        # Landing page
│   │   ├── donate/         # Donor registration
│   │   └── request-blood/  # Blood request form
│   ├── components/
│   │   ├── Logo.tsx        # Brand mark + wordmark lockup
│   │   ├── Icons.tsx       # Inline icon set
│   │   ├── Form.tsx        # Field / Input / Select / Textarea / Button
│   │   ├── Navbar.tsx      # Sticky nav with mobile menu
│   │   ├── Hero.tsx
│   │   ├── Stats.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── BloodTypes.tsx  # ABO/Rh compatibility table
│   │   ├── WhyDonate.tsx
│   │   ├── Testimonials.tsx
│   │   ├── CallToAction.tsx
│   │   ├── SectionHeading.tsx
│   │   ├── DonorRegistrationForm.tsx
│   │   └── BloodRequestForm.tsx
│   └── lib/utils.ts        # `cn` class-name helper
└── server/                 # Express + JWT API (scaffold, not wired up yet)
```

## Getting started

```bash
npm install          # installs root tooling (concurrently)
npm run client       # Next.js dev server on http://localhost:3000
```

Other scripts:

```bash
cd frontend
npm run dev          # dev server
npm run build        # production build
npm run start        # serve the production build
npm run lint         # ESLint (note: `next lint` was removed in Next 16)
```

> Running `next build` and `next dev` against the same `.next` folder at the same
> time can fail on Windows with `EPERM ... rename`. Stop the dev server first.

## Routes

| Route            | Purpose                                          |
| ---------------- | ------------------------------------------------ |
| `/`              | Landing page                                     |
| `/donate`        | Donor registration form (validated, client-side) |
| `/request-blood` | Blood request form for patients, families, hospitals |

## The logo

`components/Logo.tsx` exports two pieces:

- `<LogoMark />` — the blood drop with a heartbeat line, in a crimson gradient
- `<Logo />` — the mark plus the `Hemo` + `globin` wordmark, with an optional
  "Blood Donation Network" strapline

The same artwork is reused as the favicon in `app/icon.svg`.

## Current status

The front end is complete and builds cleanly. Both forms validate and show a
success state, but **they do not submit anywhere yet** — wiring them to the
`server/` API is the next step.



## English & Bangla Translation (Google Translate Widget)

NagorikSheba uses the browser-side Google Translate website widget for free, site-wide English and Bangla (`bn`) translation across both statically rendered UI and dynamic data fetched from the Express API.

### Marking Text as Untranslatable

Any text that must NOT be translated (brand names, personal names, tracking/application IDs, currency codes, email addresses, etc.) should be marked with `notranslate`:

1. Using the wrapper component:
   ```tsx
   import NoTranslate from "@/features/translate/NoTranslate";

   <NoTranslate>{user.name}</NoTranslate>
   <NoTranslate>{trackingId}</NoTranslate>
   ```

2. Using HTML attributes:
   ```tsx
   <span className="notranslate" translate="no">NagorikSheba</span>
   ```

### Known Translation Limitations

- **Iframes**: Text inside embedded iframes (third-party payment forms, widgets) is not translated.
- **Video Subtitles**: Not translated; require dedicated `.vtt` track files.
- **Images/Canvas**: Text baked into images or rendered on `<canvas>` is not translated.
- **HTML Attributes**: `placeholder` and `title` attributes may be bypassed by the widget.
- **SEO**: Search engines crawl and index only the default English markup.
- **Initial Load Flash**: The server and initial client render output English first, so a brief flash of English before Bangla renders is expected when Bangla is selected.
