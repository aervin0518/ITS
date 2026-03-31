# I.T.S. Fatherhood Research Center — Master Build Prompt

> Copy this entire document into any AI coding tool (Cursor, v0, ChatGPT, Claude, etc.) to reproduce this site from scratch.

\---

## PROJECT OVERVIEW

Build a modern, credible **Fatherhood Research Center** website for **I.T.S. Fatherhood**. The site should feel like a university-adjacent research institution — authoritative, calm, evidence-based, and mission-driven. It is **not** a corporate website and not a startup. Think Brookings Institution or Urban Institute in tone.

**Organization name:** I.T.S. Fatherhood Research Center  
**Tagline:** Evidence-based, community grounded, policy relevant.  
**Mission:** Advancing rigorous, community-informed research on fatherhood and family engagement across diverse populations.

\---

## TECH STACK

* **Framework:** Next.js 15 with App Router
* **Language:** TypeScript (strict mode)
* **Styling:** Tailwind CSS
* **Animations:** Framer Motion
* **Icons:** lucide-react
* **Fonts:** Playfair Display (serif headings) + Inter (sans body) via Google Fonts
* **Port:** 5000

\---

## DESIGN SYSTEM

### Color Palette

```ts
// tailwind.config.ts
colors: {
  stone: {
    50:  "#FAFAF9",
    100: "#F5F5F4",
    200: "#E7E5E4",
    300: "#D6D3D1",
    400: "#A8A29E",
    500: "#78716C",
    600: "#57534E",
    700: "#44403C",
    800: "#292524",
    900: "#1C1917",
  },
  navy: {
    50:  "#EFF3F8",
    100: "#D9E2EF",
    200: "#B3C5DF",
    300: "#8DA8CF",
    400: "#6B8FBF",
    500: "#1B3A5C",   // PRIMARY ACCENT — used everywhere
    600: "#162F4A",
    700: "#112438",
    800: "#0C1926",
    900: "#070E14",
  },
}
```

### Typography

```ts
fontFamily: {
  serif: \\\["'Playfair Display'", "Georgia", "serif"],
  sans:  \\\["'Inter'", "system-ui", "sans-serif"],
}
```

All `h1`–`h6` are `font-serif` by default. Body text is `font-sans`.

### Global CSS Classes (globals.css)

```css
/\\\* Import fonts \\\*/
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700\\\&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400\\\&display=swap');

body { @apply font-sans text-stone-800 bg-stone-50 antialiased; }
h1,h2,h3,h4,h5,h6 { @apply font-serif; }

/\\\* Utility classes \\\*/
.container-narrow { @apply max-w-6xl mx-auto px-4 sm:px-6 lg:px-8; }
.container-wide   { @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8; }
.section-padding  { @apply py-16 md:py-24; }
.divider          { @apply border-t border-stone-200; }
.btn-primary      { @apply inline-flex items-center px-6 py-3 bg-navy-500 text-white font-sans font-medium text-sm tracking-wide uppercase hover:bg-navy-600 transition-colors duration-200; }
.btn-secondary    { @apply inline-flex items-center px-6 py-3 border border-navy-500 text-navy-500 font-sans font-medium text-sm tracking-wide uppercase hover:bg-navy-50 transition-colors duration-200; }
.badge            { @apply inline-block px-3 py-1 text-xs font-sans font-medium tracking-wider uppercase; }
.badge-brief      { @apply badge bg-navy-50 text-navy-600; }
.badge-report     { @apply badge bg-stone-200 text-stone-700; }
.badge-insight    { @apply badge bg-stone-100 text-stone-600; }
```

### Design Rules

* **No loud gradients.** No neon. No startup visual language.
* **Whitespace is generous.** `section-padding` = `py-16 md:py-24`.
* **Borders are subtle.** Prefer `border-stone-200`.
* **Shadows are soft.** Use `shadow-sm` or `shadow-md`, never heavy.
* **Rounded corners:** `rounded-xl` or `rounded-2xl` for cards. Buttons are square (no border-radius).
* **Section backgrounds alternate:** white → stone-50 → stone-100 → stone-900 (dark).

\---

## SITE STRUCTURE — 11 PAGES

```
/ (Homepage)
/about
/research
/publications
/data-surveys
/programs
/partners
/news-events
/contact
/get-involved
/donate
```

\---

## LAYOUT — NAVBAR + FOOTER

### Navbar (`src/components/Navbar.tsx`)

**Top utility bar** (small, above main nav):

* Left: Empty or logo subtext
* Right: "✉ Contact" link | "🔍 Search" link | "Newsletter" link

**Main navigation bar:**

* Logo: "I.T.S. Fatherhood" (serif, bold) with subtitle "RESEARCH CENTER" (small caps)
* Nav links: About · Research · Publications · Data \& Surveys · Programs · Partners · News \& Events · Get Involved
* CTA button (right): "Donate" — styled as `btn-primary`
* Mobile: hamburger icon that opens a full-menu drawer

### Footer (`src/components/Footer.tsx`)

* **Col 1:** Logo + mission blurb + social icons (Twitter/X, LinkedIn, Facebook, YouTube)
* **Col 2:** Quick Links (Home, About, Research, Publications, Data \& Surveys)
* **Col 3:** Programs \& Engagement (Programs, Partners, News \& Events, Get Involved, Donate)
* **Col 4:** Contact info (email, phone placeholder) + Newsletter email signup form
* **Bottom bar:** © 2025 I.T.S. Fatherhood Research Center · Privacy Policy · Terms of Use · Research Ethics

\---

## TYPESCRIPT INTERFACES

### `src/types/index.ts`

```ts
export interface Publication {
  id: string;
  title: string;
  abstract: string;
  category: "Brief" | "Report" | "Insight";
  date: string;
  year: number;
  topics: string\\\[];
  authors: string\\\[];
  downloadUrl?: string;
}

export interface NewsPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageAlt: string;
  slug: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  registrationUrl?: string;
}

export interface Program {
  id: string;
  name: string;
  tagline: string;
  description: string;
  outcomes: string\\\[];
  evidenceSummary: string;
}

export interface Partner {
  id: string;
  name: string;
  type: "University" | "Community" | "Government" | "Foundation" | "Corporate";
}

export interface ResearchArea {
  id: string;
  title: string;
  description: string;
  slug: string;
}

export interface Metric {
  id: string;
  label: string;
  value: string;
  description?: string;
}
```

### `src/types/leadership.ts`

```ts
export interface LeadershipMember {
  id: string;
  name: string;
  role: string;
  summary: string;
  initials: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  contribution: string;
  initials: string;
}

export interface CollaborationPartner {
  id: string;
  name: string;
  description: string;
  category: string;
}
```

\---

## MOCK DATA

### Publications (`src/data/publications.ts`) — 9 entries

|id|Title|Category|Date|Topics|Authors|
|-|-|-|-|-|-|
|pub-001|Father Presence and Academic Outcomes in Urban School Districts: A Longitudinal Analysis|Report|2025-09-15|Father–Children Engagement, Education|Dr. Marcus Whitfield, Dr. Tanya Reynolds|
|pub-002|Digital Era Fathering: How Technology Mediates Father–Child Relationships|Brief|2025-06-22|Digital Era Fathering, Co-Parenting|Dr. Aisha Johnson|
|pub-003|Reentry and Reconnection: Fatherhood Among Justice-Involved Men|Report|2025-03-10|Reentry \& Justice-Involved Fathers, Economic Mobility|Dr. Marcus Whitfield, James Carter MSW|
|pub-004|Co-Parenting Dynamics in Unmarried Households: Patterns and Policy Implications|Insight|2024-11-08|Co-Parenting, Father–Children Engagement|Dr. Tanya Reynolds|
|pub-005|Young Fathers, Emerging Identities: A Qualitative Study|Brief|2024-08-19|Youth/Young Fathers, Economic Mobility|Dr. Aisha Johnson, Dr. Marcus Whitfield|
|pub-006|Economic Mobility and Fatherhood: Employment Barriers Facing Black and Latino Fathers|Report|2024-05-14|Economic Mobility, Youth/Young Fathers|James Carter MSW, Dr. Tanya Reynolds|
|pub-007|The Father's Voice: Community Perspectives on Fatherhood Programming|Insight|2024-02-28|Father–Children Engagement, Co-Parenting|Dr. Aisha Johnson|
|pub-008|Measuring What Matters: A Proposed Framework for Fatherhood Impact Assessment|Brief|2023-10-05|Father–Children Engagement, Education|Dr. Marcus Whitfield|
|pub-009|Fatherhood in the Digital Age: Survey Methodology and Preliminary Findings|Report|2023-07-20|Digital Era Fathering|Dr. Tanya Reynolds, Dr. Aisha Johnson|

Each abstract is 2–3 sentences describing methodology, sample size (e.g. "412 fathers"), and key finding.

### Research Areas (`src/data/research-areas.ts`) — 6 entries

1. **Co-Parenting** — communication, conflict resolution, cooperative decision-making in unmarried/separated households
2. **Digital Era Fathering** — digital tools shaping father–child interaction across distance
3. **Economic Mobility** — fatherhood + employment stability, workforce development programs
4. **Youth / Young Fathers** — identity development, support needs, outcomes for fathers aged 16–24
5. **Reentry \& Justice-Involved Fathers** — formerly incarcerated fathers, family reconnection frameworks
6. **Father–Children Engagement** — dimensions of presence, participation, relational quality and child development outcomes

### Programs (`src/data/programs.ts`) — 3 entries

**1. MetaDad Virtual Mentorship**

* Tagline: "Structured mentorship grounded in research, delivered through technology"
* Description: Pairs experienced fathers with younger/first-time fathers via virtual platform. Informed by longitudinal research on father identity development and peer support impact on parenting confidence.
* Outcomes: 87% increased parenting confidence after 12 weeks; 72% strengthened engagement with children; 64% improved employment status
* Evidence: Draws from 2024 qualitative study on young father identity formation

**2. The Father's Table**

* Tagline: "Facilitated community dialogues informed by lived experience and data"
* Description: Recurring facilitated roundtable discussions where fathers, researchers, and practitioners examine fatherhood research topics. Each session structured around a research theme.
* Outcomes: 40+ sessions in 6 cities since 2022; insights directly informed 3 published research briefs; 92% rated sessions highly valuable
* Evidence: Developed from 2024 community listening sessions

**3. Co-Parenting Support Circles**

* Tagline: "Evidence-based workshops for healthier co-parenting relationships"
* Description: Structured workshops covering communication strategies, conflict resolution, decision-making frameworks, child-centered planning for co-parenting pairs.
* Outcomes: 78% improved communication after 8-week series; 65% developed written co-parenting plan; children showed improved school attendance
* Evidence: From 2024 Insight publication on co-parenting dynamics

### Partners (`src/data/partners.ts`) — 8 entries

|Name|Type|
|-|-|
|Howard University|University|
|University of Chicago School of Social Work|University|
|UCLA Center for Community Partnerships|University|
|National Fatherhood Initiative|Community|
|Urban Institute|Foundation|
|Annie E. Casey Foundation|Foundation|
|Chicago Department of Family \& Support Services|Government|
|Fathers Incorporated|Community|

### News Posts (`src/data/news.ts`) — 5 entries

1. Research Center Releases Annual Fatherhood Outcomes Report (2025-11-12) — Publication
2. Partnership Announced with Three University Research Labs (2025-10-03) — Partnership
3. MetaDad Virtual Mentorship Program Reaches 500 Participants (2025-08-18) — Program Update
4. Dr. Whitfield Presents Findings at National Fatherhood Policy Summit (2025-06-29) — Event
5. New Research Brief Explores Co-Parenting Communication Patterns (2025-04-15) — Publication

### Events (`src/data/events.ts`) — 4 entries

1. Fatherhood Research Symposium 2026 — April 12, 2026 — Howard University, Washington D.C.
2. The Father's Table: Community Dialogue on Economic Mobility — March 22, 2026 — Virtual (Zoom)
3. Data Collection Training: Community Research Methods — March 8, 2026 — Virtual (Zoom)
4. Co-Parenting Workshop Series: Session 3 – Conflict Resolution — May 10, 2026 — Chicago Community Center

### Metrics (`src/data/metrics.ts`) — 5 entries

|Value|Label|
|-|-|
|1,200+|In-Depth Interviews Conducted|
|3,800+|Survey Responses Collected|
|45|Community Partners|
|24|Publications Released|
|12|Cities Engaged|

### Leadership Data (`src/data/leadershipData.ts`)

**leadershipMembers (Leadership Team tier):**

* Gabriel Allen Ervin Sr. — Founder \& Executive Director — initials: "GA"

  * Summary: "Leads the vision, strategy, and ecosystem development of I.T.S. Fatherhood, integrating fatherhood research, technology, and community-based programming."

**dataResearchTeam:**

* Hema — Data \& Research Team — "Supports research coordination, data organization, and analysis workflow support."
* Akshat — Data \& Research Team — "Contributes to systems thinking, research infrastructure, and research support."
* Olena — Data \& Research Team — "Supports research administration, documentation, and program coordination."
* Justin — Data \& Research Team — "Contributes to data processing, analysis support, and research execution."

**collaborationPartners:**

* Program Administration Support (Operations) — "Supports communication, scheduling, follow-up, and outreach coordination."
* Church \& Community Partners (Community) — "Extends local engagement through trusted institutions."
* Fatherhood Program Support Partners (Programs) — "Helps strengthen program delivery, mentoring support, and engagement strategy."
* Research Engagement Support (Research) — "Assists with survey participation outreach and community-informed research support."

\---

## REUSABLE COMPONENTS

### `Hero.tsx`

Props: `headline`, `subhead`, `primaryCta: {label, href}`, `secondaryCta: {label, href}`

* Full-width dark section (bg-stone-900, text-white)
* Large serif headline (`text-5xl md:text-6xl lg:text-7xl`)
* Lighter subhead paragraph
* Two buttons: primary (white bg, dark text) and secondary (outlined white)
* `secondaryCta` for "Take the Fatherhood Impact Survey" links to: `https://form.jotform.com/253554464301049` (opens in `\\\_blank`)

### `PublicationCard.tsx`

Props: `publication: Publication`

* White card, border-stone-200, rounded-xl
* Category badge (Brief = navy-50/navy-600, Report = stone-200/stone-700, Insight = stone-100/stone-600)
* Title in serif font
* Topics as small tags
* Date formatted (e.g. "September 2025")
* First 150 chars of abstract
* Authors list

### `SectionHeading.tsx`

Props: `title`, `subtitle?`, `align?: "left" | "center"`, `className?`

* h2 in serif, 3xl–4xl
* Optional subtitle in stone-500
* Navy accent line (w-16, h-0.5) below

### `MetricCard.tsx`

Props: `metric: Metric`

* Large value (4xl–5xl serif, navy-500)
* Label in uppercase tracking-wider stone-500
* Optional description in small text

### `TopicTag.tsx`

Props: `area: ResearchArea`

* Card-style (not just a pill) — border, rounded-xl, p-6
* Title in serif
* Description text
* Hover: slight navy border accent

### `ProgramCard.tsx`

Props: `program: Program`

* White card, border, rounded-xl
* Program name (serif h3)
* Tagline in italic stone-500
* Short description
* Outcomes as bulleted list
* Evidence summary in small italic text at bottom

### `EventCard.tsx`

Props: `event: Event`

* Date formatted prominently
* Time + location below
* Title in serif
* Description text
* Optional "Register" link

### `NewsCard.tsx`

Props: `post: NewsPost`

* Placeholder image area (stone-200 bg, aspect-video)
* Category badge
* Date
* Title in serif
* Excerpt

### `PartnerLogo.tsx`

Props: `partner: Partner`

* Placeholder card (stone-100 bg, stone-300 border)
* Partner name centered in stone-600
* Partner type as small label below

\---

## PAGE SPECIFICATIONS

### Homepage (`/`)

Sections in order:

1. **Hero** — "A Research Center Advancing Fatherhood Outcomes" / "Evidence-based, community grounded, policy relevant. We collect, analyze, and publish fatherhood insights that improve outcomes for Black and Brown fathers, families, and communities."
2. **What We Do** — 4 pillars grid: Research \& Evaluation (BookOpen icon) · Data Collection (BarChart3) · Publications \& Briefs (FileText) · Community Translation (Users). Each has icon in bordered square, serif title, description.
3. **Featured Publications** — 3 PublicationCards + "View all publications →" link
4. **Research Focus Areas** — 6 TopicTag cards in 3-column grid
5. **Data \& Impact** — dark stone-900 section. 5 MetricCards in row. Below: ethics note with link to `/data-surveys#ethics`
6. **Research-Informed Programs** — 3 ProgramCards
7. **Partners \& Collaborators** — PartnerLogo grid + "Partner with the Research Center" CTA
8. **News \& Events** — 1 EventCard (left col) + 2 NewsCards (right cols)

### About (`/about`)

1. Navy hero header — "About the Center"
2. Our Mission — long-form text (2 paragraphs)
3. Our Story — long-form text (3 paragraphs) on stone-100 bg
4. **Leadership \& Research Ecosystem** section (see below — main component)
5. **Advisory Board** — Dr. Heidi featured card (full bio card) + 6 placeholder advisor cards in 2-col grid

**Advisory Board — Dr. Heidi card:**

* Initials avatar "DH" (bg-stone-900, white text)
* Name: "Dr. Heidi"
* Role: "Research Advisor / Strategic Partner" (navy uppercase small)
* Description: "Supports research alignment, strategic development, and broader positioning of the Fatherhood Research Center."
* navy-200 border, rounded-2xl

**Advisory Board — placeholder members:**

* Dr. Patricia Owens — Stanford University, Department of Psychology
* Dr. Raymond Clarke — Morehouse School of Medicine, Community Health Sciences
* Dr. Linda Nakamura — University of Michigan, School of Social Work
* Dr. Charles Beaumont — Brookings Institution, Center on Children and Families
* Rev. Diane Foster — National Fatherhood Initiative, Board of Directors
* Dr. Samuel Herrera — Columbia University, Mailman School of Public Health

### Research (`/research`)

* Navy hero header — "Our Research"
* Overview: methodology, approach, epistemological framing (qualitative + quantitative + mixed methods)
* 6 Research Focus Area cards with descriptions
* CTA: "View Our Publications"

### Publications (`/publications`)

* Hero header
* **Client-side filtering** by: Type (All / Brief / Report / Insight) + Topic dropdown + Year dropdown
* Search input (filters by title/abstract)
* Grid of PublicationCards matching filters
* "No results" empty state

### Data \& Surveys (`/data-surveys`)

* Hero header — "Data \& Surveys"
* Fatherhood Impact Survey section: description, methodology, CTA button linking to `https://form.jotform.com/253554464301049` (opens `\\\_blank`)
* How data is collected: community-informed, privacy-respecting methodology
* **Research Ethics section** (`id="ethics"`): informed consent, anonymization, IRB compliance, data storage
* Impact metrics row

### Programs (`/programs`)

* Hero header — "Research-Informed Programs"
* Intro paragraph connecting research to programming
* Each program gets its own section: full description, outcome bullets, evidence summary
* Programs: MetaDad Virtual Mentorship, The Father's Table, Co-Parenting Support Circles

### Partners (`/partners`)

* Hero header — "Partners \& Collaborators"
* Partnership types: University / Research, Community, Government, Foundation
* Partner grid organized by type
* "How to Partner" section: 3 pathways (Research Partnership, Community Host, Funder/Sponsor)
* CTA form or contact prompt

### News \& Events (`/news-events`)

* Hero header
* All events in a list (EventCards)
* All news posts in a grid (NewsCards)
* Category filter tabs

### Contact (`/contact`)

* Hero header — "Contact Us"
* Contact form: Name, Email, Organization, Message, Subject dropdown (General / Research Inquiry / Partnership / Media / Speaking Request)
* Contact info column: email placeholder, office address placeholder
* "Request a Research Briefing" CTA

### Get Involved (`/get-involved`)

* Hero header — "Get Involved"
* Three pathways: Participate in Research, Volunteer, Support the Center
* Newsletter signup (`id="newsletter"`)
* Survey CTA linking to JotForm

### Donate (`/donate`)

* Simple, dignified page — not flashy
* Mission statement about why funding matters
* Donation tiers described in text (no Stripe integration needed, placeholder)
* CTA button

\---

## LEADERSHIP \& RESEARCH ECOSYSTEM SECTION

This is the main interactive section on the About page. It is a **client component** with 3 tiers.

### File structure

```
src/components/leadership/
  LeadershipResearchEcosystemSection.tsx  ← main "use client" wrapper
  SectionHeader.tsx
  LeadershipCard.tsx
  InteractiveTeamTile.tsx                 ← also exports AccordionTeamTile
  CollaborationPartnerItem.tsx
  TeamDetailPanel.tsx
  SectionCTA.tsx
```

### Tier 1 — Leadership Team

* Layout: single card (`max-w-2xl`) when 1 member; 2-column grid when 2+
* **LeadershipCard:** initials avatar (bg-stone-900, white text, w-16 h-16 rounded-full) + name (serif, xl–2xl) + role (navy uppercase tracking-\[0.18em], 11px) + summary (stone-500, 14px)
* Hover: `y: -3` lift + top accent sweep div fades in
* Scroll-triggered fade-up with `whileInView`

### Tier 2 — Data \& Research Team

**Desktop (md+):** 4 clickable tiles in a grid + detail panel beside them

* Tile: initials avatar + name + "Research" label + selection dot indicator
* Selected state: navy avatar bg, navy text, navy border
* Detail panel: `TeamDetailPanel` — shows selected member's name, role, and contribution. Animates with `AnimatePresence mode="wait"` on key change.

**Mobile:** `AccordionTeamTile` per member

* Tap to expand — `AnimatePresence` height animation
* `+` icon rotates to `×` when open
* Contribution text revealed below

### Tier 3 — Collaboration Partners

* 2-column grid of `CollaborationPartnerItem`
* Each row: category badge (colored by category) + name + ChevronDown icon
* Click to expand description with `AnimatePresence` height animation
* Category badge colors: Operations=stone-100/stone-600, Community=blue-50/navy-600, Programs=navy-50/navy-700, Research=stone-100/navy-600

### Section CTA (`SectionCTA`)

* bg-stone-900, rounded-2xl
* Title: "Join the Fatherhood Research Movement"
* Body: "We are building a collaborative ecosystem of leaders, researchers, and partners committed to strengthening fathers, families, and communities."
* Two buttons: "Get Involved" (white bg, → arrow) → `/get-involved` | "Partner With Us" (outlined) → `/partners`

### Animation rules (Framer Motion)

* All cards: `initial={{ opacity: 0, y: 24 }}` → `whileInView={{ opacity: 1, y: 0 }}` with `viewport={{ once: true }}`
* Stagger: `delay: index \\\* 0.08` (tiles) or `index \\\* 0.12` (cards)
* Accordion: `animate={{ height: "auto" }}` / `exit={{ height: 0 }}` duration 0.24s
* Detail panel: `initial={{ opacity: 0, x: 12 }}` → `animate={{ opacity: 1, x: 0 }}` duration 0.28s
* Hover lift: `whileHover={{ y: -3 }}` duration 0.2s

\---

## ACCESSIBILITY REQUIREMENTS

* All `<button>` elements have `aria-expanded` (accordions), `aria-pressed` (selection tiles), `aria-label`, `aria-controls`
* Detail panels have `role="region"` and `aria-live="polite"`
* All images have `alt` text
* Focus rings: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 focus-visible:ring-offset-2`
* Heading hierarchy: h1 (page) → h2 (section) → h3 (group) → h4 (card)
* Semantic markup: `<section>`, `<article>`, `<header>`, `<nav>`, `<main>`, `<footer>`

\---

## IMPORTANT LINKS

* "Take the Fatherhood Impact Survey" → `https://form.jotform.com/253554464301049` — **always opens `target="\\\_blank"` with `rel="noopener noreferrer"`**
* Research Ethics anchor: `/data-surveys#ethics`
* Newsletter anchor: `/get-involved#newsletter`

\---

## QUALITY BAR

The finished site should communicate:

* **Institutional credibility** — like a university research center, not a startup or blog
* **Research authority** — data-forward, evidence-cited, methodologically serious
* **Community trust** — human, mission-driven, centering father voices
* **Calm professionalism** — no loud animations, no aggressive CTAs, no clutter

The palette (stone neutrals + navy accent), serif headings, generous whitespace, and subtle borders are the core of the aesthetic. Never deviate from this system.

