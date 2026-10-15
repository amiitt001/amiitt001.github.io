# Implementation Plan — Amit Verma Portfolio (v2)

**Project:** Amit Verma personal portfolio  
**Live site:** https://amiitt001.github.io  
**Stack:** Next.js 16 (App Router) · TypeScript · Prisma 7 · SQLite · Tailwind CSS v4 · Framer Motion 13  
**Architecture reference:** `ARCHITECTURE.md`  
**Design reference:** `design.md`

## Objective

Continue building the v2 portfolio — a brutalist-precision, content-rich site with a dynamic admin CMS, database-backed projects, and smooth Framer Motion animations — while preserving working functionality.

## Non-negotiable rules

- Read `ARCHITECTURE.md` and `AGENTS.md` before editing.
- Preserve existing routes, sections, metadata, server actions, and DB schema unless a change is justified.
- Do not rewrite `ClientPortfolio.tsx` or `app/globals.css` wholesale.
- Use real project information and verified links; do not invent metrics, experience, or completion status.
- Run `npm run build` after significant changes and fix all TypeScript / lint errors before committing.
- Respect reduced-motion preferences (`useReducedMotion.ts` hook is already wired).
- Keep the site responsive — no horizontal overflow.

## Status as of v2

| Phase | Status |
|---|---|
| Stack migration (React + Vite → Next.js 16) | ✅ Complete |
| Prisma 7 + SQLite setup | ✅ Complete |
| Server actions (projects, contacts) | ✅ Complete |
| Admin dashboard (`/admin`) | ✅ Complete |
| Portfolio sections (Hero, About, Skills, Projects, Experience, Achievements, DSA, Resume, Contact) | ✅ Complete |
| Design system (CSS variables, Space Grotesk/Mono, brutalist tokens) | ✅ Complete |
| SEO metadata + Open Graph | ✅ Complete |
| Framer Motion animations | ✅ Complete |
| Scroll progress indicator | ✅ Complete |
| Responsive layout | ✅ Complete |

## Ongoing / Next work

### Phase A — Content quality
- Verify all project `githubUrl` and `demoUrl` values link to real, live URLs.
- Ensure no placeholder text remains in DB-seeded projects, experiences, or achievements.
- Add `skills` model to DB if skill data needs to become dynamic (currently hard-coded in `ClientPortfolio.tsx`).

### Phase B — Admin UX
- Add Experience and Achievement CRUD to `AdminDashboardClient.tsx` (currently only Projects + Messages).
- Add read/unread filtering for ContactMessages.
- Add search/filter on the projects table.

### Phase C — Performance
- Run `npm run build` and check bundle size; split `ClientPortfolio.tsx` into smaller sub-components if needed.
- Lazy-load Framer Motion for below-fold sections.
- Optimise images in `public/` (use `next/image` everywhere).
- Verify `prisma generate` runs cleanly as part of `npm run build`.

### Phase D — Accessibility & QA
- Audit keyboard navigation through all interactive elements.
- Verify focus rings are visible.
- Check color contrast on all text against background tokens.
- Test on mobile (no horizontal overflow, touch targets ≥ 44 px).
- Test with `prefers-reduced-motion: reduce`.

### Phase E — Deployment
- Confirm GitHub Pages deployment pipeline is up to date.
- Verify Open Graph preview on social share.
- Check production console for errors.

## Commands

```bash
# Development
npm run dev

# Type-check
npx tsc --noEmit

# Lint
npm run lint

# Build (runs prisma generate + next build)
npm run build
```

## Definition of done

- [ ] All project links verified (no dead links, no placeholders).
- [ ] Admin CRUD covers Projects, Experiences, Achievements, and ContactMessages.
- [ ] Production build succeeds with zero errors.
- [ ] Lighthouse performance ≥ 85 on mobile.
- [ ] No horizontal overflow at 375 px viewport.
- [ ] Reduced-motion mode is smooth and usable.
- [ ] Keyboard-only navigation works end-to-end.
- [ ] Open Graph metadata verified.
