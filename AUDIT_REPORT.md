# Phase 0 — Repository Audit Report

**Project:** Amit Verma Personal Portfolio  
**Audit date:** 15 October 2026  
**Source directory:** `/home/orion/projects/amiitt001.github.io`  
**Design docs:** `/home/orion/projects/portfolio0.2/`  
**Live site:** https://amiitt.vercel.app/

---

## 1. True Stack (diverges from docs)

The design documents say "React + Vite", but the actual codebase is:

| Item | Actual value |
|---|---|
| Framework | **Next.js 16.3.0** (App Router) |
| React | **19.2.8** |
| Language | **TypeScript** |
| Styling | **Tailwind CSS v4** + custom CSS (`globals.css`) |
| Animation | **framer-motion 13** (installed, barely used) |
| Icons | **Lucide React 1.30** |
| Database | **Prisma 7 + SQLite** (`dev.db`) |
| ORM | Prisma with `better-sqlite3` driver adapter |
| Package manager | **npm** (package-lock.json present) |
| Deployment | Vercel (`amiitt.vercel.app`; no `vercel.json` found) |

> **Impact on design docs:** The AGENTS.md and design.md assume Vite and plain React. All library version checks must use **React 19** compatibility. This means **@react-three/fiber v9** (not v8) when installing.

---

## 2. Current Architecture

```text
amiitt001.github.io/
  app/
    layout.tsx          — Root layout: fonts, metadata, OG tags
    page.tsx            — Server component: fetches DB projects, renders Nav + ClientPortfolio + Footer
    globals.css         — 631-line design-token system (brutalist palette + full component CSS)
    admin/page.tsx      — Admin dashboard (/admin route)
  components/
    ClientPortfolio.tsx — 819-line 'use client' monolith: all portfolio sections
    AdminDashboardClient.tsx — Admin CRUD UI
  lib/
    actions.ts          — Server actions: projects CRUD, contact form, GitHub sync
    prisma.ts           — Prisma singleton
    validations.ts      — Zod schemas
  prisma/
    schema.prisma       — Models: Project, ContactMessage, Experience, Achievement, User
  public/
    logo.png, SVGs
  legacy_static/        — Old static HTML/JS site (not served, kept as reference)
```

---

## 3. Current Sections & Status

| Section | Anchor | Status | Notes |
|---|---|---|---|
| Navigation | sticky | ✅ Working | Responsive; collapses at 900px |
| Hero | `#home` | ✅ Working | 2D canvas particles, profile photo, 3 CTAs |
| Marquee ticker | — | ✅ Working | Scrolling tech banner |
| About | `#about` | ✅ Working | 3 capability cards |
| Skills | `#skills` | ✅ Working | Core pills + secondary pills (static) |
| Projects | `#projects` | ✅ Working | DB-driven, filterable, expandable drawers |
| Experience | `#experience` | ✅ Working | 2 timeline entries |
| Achievements | `#achievements` | ✅ Working | 3 cards |
| Problem Solving | `#problem-solving` | ✅ Working | LeetCode/Codeforces stats |
| Currently Building | `#building` | ✅ Working | DG-AI progress bar |
| Resume | `#resume` | ⚠️ Broken | Links to GitHub, not PDF |
| Contact | `#contact` | ✅ Working | Form + direct links |
| Admin | `/admin` | ✅ Working | Full CRUD + GitHub sync |

---

## 4. Design System — Current vs Target

| Token | Current (brutalist) | Target (scientific/green) |
|---|---|---|
| Background | `#fafaf5` | `#FAF8F3` |
| Primary | `#0d0d0d` (black) | `#2D4F3A` (forest green) |
| Accent | `#f5d90a` (yellow) | `#A34B3C` (critical red) |
| Secondary | `#00c48c` (green) | `#556B4E` (sage) |
| Border | `2px solid #0d0d0d` | `1px solid #D7DDD3` |
| Shadow | hard offset brutalist | soft/glowy |
| Typography | Space Grotesk + Space Mono | editorial + sans + mono |

The existing site is a **polished brutalist** design. The target is **scientific / forest-green / futuristic**. These are substantially different visual identities requiring a full color and shadow system migration (to be done incrementally across phases).

---

## 5. Functionality to Preserve

- Admin dashboard at `/admin` with Prisma CRUD
- Contact form with server-side persistence (ContactMessage model)
- Project filter and drawer expansion
- Scroll progress bar
- Email copy-to-clipboard
- All verified external links (GitHub, LinkedIn, LeetCode, Codeforces, adk-hiring-agent demo)
- SEO metadata and Open Graph in `layout.tsx`
- Vercel deployment and `next.config.ts` image remote patterns

---

## 6. Missing / Incomplete Items

| Item | Status |
|---|---|
| Resume PDF URL | Broken (links to GitHub root) |
| `metadataBase` | Missing → OG images resolve to `http://localhost:3000` |
| Canonical URL | Points to `amiitt001.github.io`, not `amiitt.vercel.app` |
| `robots.txt` | Not present |
| `sitemap.xml` | Not present |
| Person JSON-LD | Not implemented |
| `prefers-reduced-motion` | No CSS or JS support |
| Focus styles | Browser defaults only |
| WebGL / canvas fallback | None for hero canvas |
| GIH 2.0 Hackathon | In `details.md`, absent from site |

---

## 7. Dependency Compatibility

| Library | Installed | Note |
|---|---|---|
| React | 19.2.8 | Requires **R3F v9** |
| framer-motion | 13.0.0 | ✅ React 19 compatible |
| three | ❌ | Install for Phase 2 |
| @react-three/fiber | ❌ | Install **v9** (React 19) |
| @react-three/drei | ❌ | Install compatible version |
| @types/three | ❌ | Dev dep needed |
| lucide-react | 1.30.0 | ✅ Already installed |

---

## 8. Baseline Build & Lint Results

### Build: ✅ PASS
```
npm run build  →  SUCCESS (Next.js 16 + Turbopack, ~2.4s compile)
Warning: metadataBase not set
```

### Lint: ❌ 26 problems (16 errors, 10 warnings) — ALL PRE-EXISTING
Key errors (all in existing code):
- `prefer-const` on `let width/height/mouse` in hero canvas
- `react/no-unescaped-entities` on `"` and `'` characters
- `@typescript-eslint/no-unused-vars` (5 unused icon imports)
- `@typescript-eslint/no-explicit-any` in `lib/actions.ts`

**No new errors introduced.**

---

## 9. Risks

| Risk | Severity |
|---|---|
| Resume link broken | High |
| `metadataBase` missing → broken OG previews | Medium |
| Canvas runs without `prefers-reduced-motion` check | Medium |
| No focus ring styles | Medium |
| `ClientPortfolio.tsx` is 819-line monolith | Medium |
| Canonical URL mismatch | Medium |
| SQLite `dev.db` committed to repo | Low |

---

## 10. Phase 1 Implementation Plan

Safe, non-breaking changes to implement in this phase:

1. Add target design tokens to `globals.css` (alongside existing brutalist tokens)
2. Add `metadataBase` to `layout.tsx`
3. Fix canonical OG URL
4. Create `public/robots.txt`
5. Add `prefers-reduced-motion` CSS rule
6. Add `:focus-visible` outline using new green palette
7. Fix all pre-existing lint errors
8. Create `hooks/useReducedMotion.ts` and `utils/math.ts` scaffolding
9. Create `app/styles/tokens.css` for the new design-system tokens

Deferred to later phases:
- Removing existing brutalist tokens (breaks current UI)
- Installing Three.js / R3F (Phase 2)
- Splitting `ClientPortfolio.tsx` (Phase 3)
- Any section replacement (Phase 3+)
