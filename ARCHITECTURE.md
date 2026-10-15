# Architecture — Amit Verma Portfolio (v2)

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + custom CSS variables |
| Fonts | Space Grotesk, Space Mono (via `next/font/google`) |
| Animation | Framer Motion 13 |
| Icons | Lucide React |
| Database | SQLite via `better-sqlite3` |
| ORM | Prisma 7 (driver adapter: `@prisma/adapter-better-sqlite3`) |
| Validation | Zod 4 |
| Deployment | GitHub Pages / Vercel |

## Goals

Keep content, database operations, UI components, and server actions separate.
Extend the app incrementally; do not replace working code without an audit first.

## Actual file structure

```text
/
├── app/
│   ├── layout.tsx           # Root layout: fonts, metadata, scroll-progress div
│   ├── page.tsx             # Server component: fetches projects, renders nav + footer
│   ├── globals.css          # Global CSS variables, Tailwind base, typography
│   ├── favicon.ico
│   ├── admin/               # Admin dashboard route
│   └── styles/              # Additional CSS modules / layers
├── components/
│   ├── ClientPortfolio.tsx  # Main client component: all portfolio sections
│   └── AdminDashboardClient.tsx # Admin UI client component
├── hooks/
│   └── useReducedMotion.ts  # Respects prefers-reduced-motion
├── lib/
│   ├── actions.ts           # Server actions (CRUD for projects, messages, etc.)
│   ├── prisma.ts            # Prisma client singleton
│   └── validations.ts       # Zod schemas
├── prisma/
│   └── schema.prisma        # DB schema: User, Project, Experience, Achievement, ContactMessage
├── generated/
│   └── prisma/              # Prisma generated client output
├── utils/                   # Pure utility functions
├── public/                  # Static assets (logo.png, etc.)
├── legacy_static/           # Old static site (reference only, not served)
├── next.config.ts
├── prisma.config.ts
└── tsconfig.json
```

## Sections (rendered via `ClientPortfolio.tsx`)

| Section | Anchor | Source |
|---|---|---|
| Hero | — | Hard-coded in component |
| About | `#about` | Hard-coded in component |
| Skills | `#skills` | Hard-coded in component |
| Projects | `#projects` | DB → `getProjectsAction()` |
| Experience | `#experience` | Hard-coded / DB |
| Achievements | `#achievements` | Hard-coded / DB |
| Problem Solving (DSA) | `#problem-solving` | Hard-coded in component |
| Resume | `#resume` | Hard-coded in component |
| Contact | `#contact` | DB → `createContactMessageAction()` |

## Database models

- **User** — admin credentials (email, name, role)
- **Project** — name, title, description, problem, architecture, keyFeatures, technicalDecisions, githubUrl, demoUrl, icon, iconBg, category, approved, featured
- **Experience** — organization, role, period, description
- **Achievement** — title, category, description
- **ContactMessage** — name, email, message, read flag

## Data flow

```
app/page.tsx (Server Component)
  └─ getProjectsAction()          ← lib/actions.ts → Prisma → SQLite
       └─ passes initialProjects
            └─ ClientPortfolio.tsx (Client Component, Framer Motion)
                 └─ contact form → createContactMessageAction() (Server Action)
```

Admin route (`/admin`) uses `AdminDashboardClient.tsx` for full CRUD.

## Rendering model

- `app/page.tsx` is an **async Server Component** — fetches data at request time.
- `ClientPortfolio.tsx` is a **Client Component** — handles all UI state, animations, and interactivity.
- Server Actions in `lib/actions.ts` handle all DB mutations.
- No API routes (`app/api/`) are currently used.

## Styling conventions

- CSS custom properties (`--font-space-grotesk`, `--yellow`, `--black`, `--border`, `--shadow`, `--white`) defined in `app/globals.css`.
- Tailwind v4 used for utility classes; Tailwind config injected via PostCSS.
- Component-level layout uses inline styles where dynamic values require it.

## Error and fallback behavior

- If the DB is unavailable, `getProjectsAction()` returns an empty array; the Projects section renders gracefully with no cards.
- If a project has no `demoUrl`, the live-demo link is omitted.
- Reduced-motion is respected via `useReducedMotion.ts` hook.
- Contact form submission is validated client-side (Zod) before the server action fires.

## Dependencies

Do not add libraries without a concrete need. Prefer:
- Framer Motion for all UI animations (already installed).
- Lucide React for icons (already installed).
- Zod for validation (already installed).
- Do **not** add React Three Fiber, GSAP, or other heavy libraries unless explicitly required.
