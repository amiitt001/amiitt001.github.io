<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# Agent Instructions — Amit Verma Portfolio (v2)

## Mission

Implement, debug, and extend the portfolio at https://amiitt001.github.io.
The stack is **Next.js 16 (App Router) · TypeScript · Prisma 7 · SQLite · Tailwind CSS v4 · Framer Motion 13**.

## Before making changes

1. Read `ARCHITECTURE.md` and `IMPLEMENTATION_PLAN.md`.
2. Inspect the files you intend to edit — never overwrite `ClientPortfolio.tsx` or `app/globals.css` wholesale.
3. Check `package.json` for installed packages before proposing new dependencies.
4. Run `npm run build` to confirm the current baseline builds cleanly.

## Core rules

- Preserve existing routes, DB schema, server actions, metadata, and deployment config unless a change is justified.
- Prefer incremental, reviewable changes over full rewrites.
- Do not fabricate project descriptions, statistics, achievements, or links.
- Do not leave placeholder repository URLs or contact details.
- Do not add `@prisma/adapter-better-sqlite3` configuration — it is already set up in `lib/prisma.ts`.
- Do not add an `app/api/` route unless there is no alternative; prefer Server Actions in `lib/actions.ts`.
- Validate all user input with Zod before calling Prisma.
- Keep essential content in HTML (not only in canvas or animation-only elements).
- Keyboard-accessible interactions are required.
- Respect `prefers-reduced-motion` (hook available at `hooks/useReducedMotion.ts`).

## Engineering constraints

- **Next.js**: Use App Router conventions. Do not use `pages/`. Read `node_modules/next/dist/docs/` if unsure.
- **Prisma 7**: The client is in `generated/prisma/`. Use the singleton from `lib/prisma.ts`. Run `npx prisma generate` after schema changes.
- **TypeScript**: Fix all type errors before committing. Run `npx tsc --noEmit`.
- **Tailwind v4**: Config is via PostCSS. Do not create a `tailwind.config.js`.
- **Framer Motion 13**: Use for UI animations. Do not add GSAP or React Three Fiber.
- **Styling**: CSS custom properties are defined in `app/globals.css`. Add new tokens there; do not hard-code values.
- **Fonts**: Space Grotesk (`--font-space-grotesk`) and Space Mono (`--font-space-mono`) are loaded in `app/layout.tsx`.

## Workflow

For each task:
1. State the intended scope briefly.
2. Inspect files that will change.
3. Implement the smallest coherent change.
4. Run `npm run lint`, `npx tsc --noEmit`, and `npm run build`.
5. Review the diff for regressions and placeholder content.
6. Report changed files, commands run, results, and remaining issues.

If a command fails, report the failure accurately and diagnose it rather than claiming success.

## Completion report

Include:
- Summary of implemented behavior.
- Files created or changed.
- Commands/tests run and their actual results.
- Any unresolved issues.
- Any manual checks still needed.

