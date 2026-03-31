# Workspace

## Overview

**I.T.S. Fatherhood** — a production-ready "Fatherhood Impact & Intelligence Platform" website. Positioned as a technology-enabled intelligence system, NOT a nonprofit or research center. The brand lives at the intersection of warmth and data intelligence.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend framework**: Next.js 15 (App Router) — handles ALL routes including /api/*
- **API framework**: Express (DISABLED — Next.js handles everything)
- **Database**: PostgreSQL + Drizzle ORM
- **Styling**: Tailwind CSS v4 with custom color palette (see Brand Kit below)
- **Animations**: Framer Motion v12
- **Icons**: lucide-react
- **Charts**: Recharts
- **Validation**: Zod

---

## OFFICIAL BRAND KIT v2.1 (March 2026)

**Source:** `attached_assets/ITS_Fatherhood_Brand_Kit_1774214180060.pdf`

This is the authoritative reference for ALL design work — website, forms, flyers, stationery, and applications.

### Logo & Icon Assets (available in attached_assets/)

| File | Use |
|------|-----|
| `ITS_Logo_LightBG_1774214243187.png` | Logo on white/light backgrounds |
| `ITS_Logo_DarkBG_1774214243186.png` | Logo on dark/charcoal backgrounds |
| `ITS_Logo_Transparent_1774214243188.png` | Logo with transparent background |
| `ITS_Icon_NavyBG_1774214243185.png` | Icon mark only, on navy background |

**To use in the app:** copy to `artifacts/next-app/public/` and reference as `/filename.png`

### Logo Description (Vertex Pulse Mark)

Two data-node stick figures connected by a neural-mesh:
- **Left figure (larger/father/mentor):** Navy `#152A4A` body with data-node joints
- **Right figure (smaller/child/mentee):** Blue `#6A9EC5` body with data-node joints
- **Gold pulse heart:** Legacy Gold `#C8963E` arc connecting their hands — the bond
- **Wordmark:** "I.T.S." in Exo 2 ExtraBold 800, "FATHERHOOD" spaced tracking, "RESEARCH CENTER/RESEARCH HUB" smaller beneath gold underline bar

### Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| **Charcoal** | `#111114` | Hero section backgrounds — the dark editorial canvas |
| **I.T.S. Navy** | `#152A4A` | PRIMARY — headers, buttons, trust surfaces |
| **I.T.S. Blue (mid)** | `#1E3A5F` | Secondary navy, supporting surfaces |
| **I.T.S. Blue (accent)** | `#6A9EC5` | Accent headlines, links, eyebrow text |
| **Light Blue** | `#8FB8D9` | Lighter blue accent, supporting elements |
| **Ice Blue** | `#D6E8F5` | Card surfaces, feature highlights |
| **Legacy Gold** | `#C8963E` | CTAs, highlights, badges, gold accent bars, underlines |
| **Warm White** | `#FAF8F5` | Page background — light sections (NOT pure white) |

**Do NOT use pure black `#000000`** — always use Charcoal `#111114`

### Typography

| Role | Font | Weight | Size | Notes |
|------|------|--------|------|-------|
| **Editorial Headlines** | Playfair Display | ExtraBold 800 | Large | White on dark; Navy on light; Blue (`#6A9EC5`) for active/transformative portion |
| **Brand Wordmark** | Exo 2 | ExtraBold 800 | Logo only | Logo lockup, brand headers, official documents |
| **Body Copy** | DM Sans | Regular 400 | 16px / 1.75 | ALL paragraph text, descriptions, navigation |
| **Data & Labels** | Space Mono | Regular 400 | 10px, tracking 4px, uppercase | Statistics, eyebrow labels, form fields, version tags, data cards |

**Current implementation note:** Body is currently Inter (needs updating to DM Sans) and wordmark/nav uses default sans (needs Exo 2). These are pending font upgrades.

### Headline Formula

Split headlines: **White serif** for the anchor statement + **Blue (#6A9EC5) accent** for the transformative/active portion.
> "We Don't Just Support Fathers. **We Build Systems That Improve Fatherhood Outcomes.**"

### Button System

1. **Primary:** Filled Navy `#152A4A`, white text — one per section
2. **Secondary:** White outline, muted text
3. **Tertiary:** Blue `#6A9EC5` outline, blue text

### Eyebrow Text Rule

Every hero/section opens with: Space Mono · 10px · letter-spacing 4px · uppercase · I.T.S. Blue `#6A9EC5`

### Gold Accent Signature

A gold `#C8963E` bar appears: beneath headings, document footers, CTA buttons, progress indicators. Signals I.T.S. presence and legacy.

### Dark Editorial Canvas (Hero Pattern)

- Background: Charcoal `#111114` (NOT stone-900, NOT pure black)
- Headline: White Playfair Display 800 + Blue active portion
- Body: DM Sans in `rgba(255,255,255,0.75)`
- This defines all hero sections, slide covers, report covers

### Data Card Rules

- 1px border
- 12px border-radius (note: current site uses square/sharp — may need adjustment for cards)
- White (or Warm White `#FAF8F5`) background
- Numbers: Playfair Display 800 in Navy `#152A4A`; "+" or "M" suffix in Blue `#6A9EC5`
- Supporting text: DM Sans

### Sub-Brand Programs

| Program | Accent | Tag |
|---------|--------|-----|
| MetaDAD | Navy-to-blue gradient | MENTORSHIP · TECH |
| The Father's Table | Legacy Gold (warmth) | COMMUNITY |
| Research Hub | Deep purple | RESEARCH |
| Journey 2 Manhood | Green (growth) | YOUTH |

### Brand Voice

- Warm but authoritative. Direct, encouraging, solution-oriented.
- Use "fathers" not "clients." Lead with empathy, follow with data.
- Photography: Authentic and candid. Fathers with children, mentorship in action. Warm lighting. Never staged. Diverse representation.

### DO / DON'T (Critical Rules)

**DO:**
- Use Playfair Display 800 for all editorial headlines
- Split headlines: white anchor + blue active statement
- Use Charcoal `#111114` for all hero sections
- Apply three-button hierarchy (filled, outline, accent)
- Use Space Mono for all eyebrow text and data labels
- Maintain gold accent bar in all official documents
- Use Legacy Gold `#C8963E` for CTAs, highlights, and accent bars

**DON'T:**
- Don't use pure black `#000` — always use Charcoal `#111114`
- Don't mix more than two colors in a single headline
- Don't skip eyebrow text above hero headlines
- Don't recolor the navy/blue figure pairing in the logo
- Don't place the logo below 140px (digital minimum)
- Don't place the logo on busy or low-contrast backgrounds

### Current Implementation vs. Brand Spec (Delta)

| Element | Currently Implemented | Brand Spec |
|---------|----------------------|------------|
| Primary navy | `#1B3A5C` | `#152A4A` |
| Hero bg | stone-900 | Charcoal `#111114` |
| Accent blue | Tailwind blue | `#6A9EC5` |
| Gold/orange | `#E8572A` (orange) | `#C8963E` (gold) |
| Body font | Inter | DM Sans |
| Eyebrow font | Inter (tracking) | Space Mono |
| Wordmark font | Serif / sans | Exo 2 ExtraBold 800 |
| Light bg | White + stone-50 | Warm White `#FAF8F5` |
| Navbar logo | Custom SVG (placeholder) | Official Vertex Pulse Mark |
| Data cards | Sharp/no radius | 1px border, 12px radius |

---

## Key External Links

- JotForm survey: `https://form.jotform.com/253554464301049` (always `target="_blank" rel="noopener noreferrer"`)

## Site Pages (13)

| Path | Description |
|------|-------------|
| `/` | Homepage: Hero, System Gap, How It Works, Comparison Table, Metrics, Audience Segments, Featured Insights → Research Hub, CTA |
| `/about` | Platform mission, founder vision, problem framing, strategic future, what separates I.T.S. |
| `/platform-model` | 4-pillar architecture (Measure, Activate, Analyze, Scale) |
| `/metadad` | MetaDAD cohort model — mentor/mentee structure, phases, who qualifies, apply CTA |
| `/research` | Research Hub — content type guide (Insights/Articles/Briefs/Reports) with interactive tab examples |
| `/publications` | Client-side filtering by category (Report/Brief/Insight/Article), topic, year + search |
| `/partners` | 6 partner types, 4 deployment models, partner inquiry flow |
| `/partner-intake` | Partner intake landing (form placeholder with contact CTA) |
| `/survey` | Survey page with JotForm link |
| `/resources` | Resource categories with Research Hub link |
| `/get-involved` | 5 audience pathways: Father, Volunteer, Organization, Researcher, Funder |
| `/donate` | Strategic investment framing — 4 tiers, 4 investment areas |
| `/contact` | Contact form with subject dropdown, contact info |

## Nav Links (Current)

About · Platform Model · Research Hub · MetaDAD · Partners · Support · Contact + **"TAKE THE SURVEY"** primary CTA button

## Data Files

- `src/data/insights.ts` — 6 insight records (used for Featured Insights on homepage)
- `src/data/audienceSegments.ts` — 6 audience segments for homepage
- `src/data/platformPillars.ts` — 4 platform pillars + howItWorksSteps
- `src/data/metrics.ts` — platform-focused stats for homepage metrics section
- `src/data/partners.ts` — partner data
- `src/data/publications.ts` — 9 publications (Report/Brief/Insight/Article categories)
- `src/data/researchAreas.ts` — research focus areas

## Key Components

- `src/components/Navbar.tsx` — placeholder SVG logo + full nav (logo needs upgrading to official asset)
- `src/components/ResearchHubContent.tsx` — "use client" interactive Research Hub with tab examples
- `src/components/MetricCard.tsx` — white text value for dark section context
- `src/components/NewsletterForm.tsx` — newsletter signup
- `src/components/ContactForm.tsx` — contact form with subject dropdown

## Positioning Language

**Use:** measure / track / analyze / activate / improve / scale / intelligence / platform / ecosystem / outcomes / infrastructure / data / longitudinal / defensible

**Avoid:** help / serve / support / provide services / nonprofit / charity

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server (disabled)
│   └── next-app/           # Next.js 15 frontend (App Router) — main site
│       └── public/         # Static assets (copy brand logos here for use)
├── lib/                    # Shared libraries
├── attached_assets/        # Brand logos + kit (NOT web-served — copy to public/ for use)
└── ...
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. Run `pnpm run typecheck` from root.

## Client Component Pattern

Interactive pages use a `"use client"` component in `src/components/`, with a thin server `page.tsx` that exports metadata only.

## Tailwind v4 Gotcha

No chaining custom `@apply` with custom classes — inline all styles directly in JSX.

## Canvas / Dev Preview

- Dev runs on `PORT` env var (proxied to port 80 in Replit)
- `next.config.ts` has `allowedDevOrigins` set to Replit dev domain for canvas iframe preview

## Database

`lib/db` — Drizzle ORM + PostgreSQL. Development: `pnpm --filter @workspace/db run push`. Production migrations handled by Replit on publish.

## Auth System (Supabase — Working)

### Architecture
- **Login**: Server Action (`actions.ts`) with `useActionState` in `LoginForm.tsx` — SSR client does `signInWithPassword` (sets session cookie), then **service role client** reads `user_profiles` + `user_roles` to find role and redirect
- **Session**: Supabase SSR cookie-based auth (`@supabase/ssr`)
- **Logout**: `/api/auth/logout` route — signs out and clears cookie on response
- **Invitation flow**: `/auth/callback` route handles post-invite token exchange + role-based redirect

### Critical Rule: Always use `createAdminClient()` (service role) for role checks
RLS blocks anon-key reads on `user_profiles` and `user_roles`. Every `getCallerRole()` function and dashboard role guard **must** use `createAdminClient()` from `src/lib/supabase/admin.ts`.

Regular `createClient()` (SSR/anon) is only used for `auth.getUser()` / `auth.signInWithPassword()` — auth operations that don't hit RLS.

### DB Schema
- `user_profiles` — id, email, first_name, last_name, status (active/inactive)
- `user_roles` — user_id → user_profiles, role_id → roles
- `roles` — id, name: "Admin" / "Partner" / "Program Admin" / "Researcher" / "Subscriber"

### Role → Dashboard routing
| Role | Path |
|------|------|
| Admin | `/cms/dashboard` |
| Program Admin | `/cms/program` |
| Researcher | `/cms/research` |
| Partner | `/cms/partner` |
| Subscriber | `/subscriber` |

### Files
- `src/lib/supabase/admin.ts` — `createAdminClient()` using `SUPABASE_SERVICE_ROLE_KEY`
- `src/lib/supabase/server.ts` — `createClient()` SSR cookie-based (anon key)
- `src/app/(public)/login/actions.ts` — Server Action for login
- `src/components/LoginForm.tsx` — Client component using `useActionState`
- `src/app/api/auth/logout/route.ts` — Logout handler
- `src/app/auth/callback/route.ts` — Post-invitation callback
- `src/app/cms/dashboard/page.tsx` — Admin dashboard (uses admin client for role guard)
- `src/app/api/admin/users/route.ts` — List/bulk user ops
- `src/app/api/admin/users/[id]/route.ts` — PATCH/DELETE single user
- `src/app/api/admin/roles/route.ts` — List all roles
- `src/app/api/admin/create-user/route.ts` — Invite new user
