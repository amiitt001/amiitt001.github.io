# Instructions for AI Coding Agents

## Mission

Implement the physics-inspired redesign described in `design.md` and sequenced in `IMPLEMENTATION_PLAN.md` for the existing React + Vite portfolio at https://amiitt.vercel.app/.

## Before making changes

1. Inspect the repository structure and `package.json`.
2. Identify the React version, package manager, scripts, routing, styling approach, and existing animation/3D libraries.
3. Run the existing build and distinguish baseline errors from new errors.
4. Read `design.md` and `IMPLEMENTATION_PLAN.md`.
5. Check existing components and links before replacing or deleting anything.

## Core rules

- Preserve existing working functionality, routes, metadata, links, and deployment settings.
- Prefer incremental, reviewable changes over a full rewrite.
- Do not overwrite `App.jsx`, global CSS, or configuration blindly.
- Reuse installed dependencies where practical; do not add libraries without a concrete need.
- Do not fabricate project descriptions, statistics, achievements, testimonials, or experience.
- Do not leave placeholder repository URLs or contact details in the finished portfolio.
- Keep essential text and navigation in semantic HTML, not only in WebGL/canvas.
- Make all essential interactions keyboard accessible.
- Support `prefers-reduced-motion` and a useful no-WebGL fallback.
- Avoid expensive effects that do not materially improve the experience.
- Do not claim a build, test, or deployment succeeded unless it was actually run and verified.

## Design constraints

- Main background: `#FAF8F3`
- Primary green: `#2D4F3A`
- Secondary green: `#556B4E`
- Soft highlight: `#A6B69A`
- Direction: futuristic 3D, scientific, editorial, elegant—not generic neon cyberpunk.
- Use orbital paths, geometry, particles, perspective, and restrained glow as a coherent visual system.
- The hero may have the richest animation; other sections should not all run expensive continuous effects.

## Engineering constraints

- Match React Three Fiber to the installed React version: R3F v8 for React 18; R3F v9 for React 19.
- Keep animation-frame updates out of React state when refs or Three.js object updates are more appropriate.
- Use frame delta for time-based animation.
- Bound attraction forces, particle speeds, and pointer-driven rotations.
- Reuse Three.js geometries and materials.
- Lazy-load heavy 3D scenes when practical.
- Avoid mixing Motion and GSAP for the same simple animation.
- Maintain responsive layout and avoid horizontal overflow.

## Workflow

For each phase:
1. State the intended scope briefly.
2. Inspect the files that will change.
3. Implement the smallest coherent change.
4. Run relevant lint, type-check, tests, or build scripts that exist.
5. Review the diff for regressions and placeholders.
6. Report changed files, checks run, results, and remaining limitations.

If a command fails, report the failure accurately and diagnose it rather than claiming success.

## Completion report

Include:
- Summary of implemented behavior.
- Files created or changed.
- Commands/tests run and their actual results.
- Any unresolved issues.
- Any manual checks still needed.
