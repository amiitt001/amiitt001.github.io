# Amit Verma — Personal Portfolio

A React + Vite personal portfolio exploring a futuristic, physics-inspired visual language with a cream and forest-green identity.

**Live site:** https://amiitt.vercel.app/

## Design goals

- Immersive orbital 3D hero
- Mathematical motion: parametric paths, vectors, easing, waves, and 3D transforms
- Interactive projects and technology skills
- Responsive, accessible content
- Good mobile performance and a static fallback when WebGL is unavailable

## Design documents

- [`design.md`](./design.md) — visual direction, sections, math/physics concepts, stack, accessibility, and definition of done
- [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md) — phased implementation and acceptance criteria
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — component boundaries and data flow
- [`MATH_AND_PHYSICS.md`](./MATH_AND_PHYSICS.md) — formulas and interaction algorithms
- [`TESTING.md`](./TESTING.md) — verification checklist
- [`AGENTS.md`](./AGENTS.md) — repository rules for AI coding agents

## Prerequisites

- Node.js version compatible with the current Vite project
- npm (or the package manager already used by the repository)

Check the existing `package.json` before changing Node or dependency versions.

## Local setup

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Build and preview

```bash
npm run build
npm run preview
```

Use the repository's actual scripts if they differ. If linting or tests are configured, run those too.

## Main design tokens

| Token | Value |
|---|---|
| Cream | `#FAF8F3` |
| Forest green | `#2D4F3A` |
| Secondary green | `#556B4E` |
| Soft highlight | `#A6B69A` |

## Deployment

The site is hosted on Vercel. Use the project's existing deployment configuration and verify a preview deployment before promoting changes. Never commit API keys, private credentials, or other secrets.

## Contribution workflow

1. Read `AGENTS.md`, `design.md`, and `IMPLEMENTATION_PLAN.md`.
2. Audit the current code before changing it.
3. Make small, focused changes.
4. Run the build and relevant tests.
5. Verify desktop, mobile, keyboard, reduced-motion, and no-WebGL behavior.
6. Record any remaining limitations honestly.
