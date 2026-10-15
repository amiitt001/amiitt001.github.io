# Versioning — Amit Verma Portfolio

## Version Overview

| Version | Tag | Commit | Branch | Description |
|---|---|---|---|---|
| **V1** | `v1.0.0` | `b5840eb` | `main` (historical) | Last clean static HTML/CSS/JS portfolio |
| **V2** | `v2` | `b083c06` | `main` | Next.js 16 + Prisma + SQLite portfolio (current production) |
| **V2 Dev** | — | `c599f9e`+ | `v2-redesign` | Active development branch |

---

## V1 — Static Portfolio (Baseline)

- **Tag:** `v1.0.0`
- **Commit:** `b5840eb`
- **Date:** Aug 8, 2026
- **Stack:** Vanilla HTML · CSS · JavaScript
- **Description:** The last clean iteration of the original static portfolio before the Next.js migration. Contains `index.html`, `css/styles.css`, and `js/script.js`.

> V1 is **read-only**. Do not add commits to this tag. It is a permanent baseline snapshot.

---

## V2 — Next.js Portfolio (Production)

- **Tag:** `v2`
- **Commit:** `b083c06`
- **Branch:** `main`
- **Stack:** Next.js 16 · TypeScript · Prisma 7 · SQLite · Tailwind CSS v4 · Framer Motion 13
- **Description:** Full Next.js App Router rewrite with database-backed projects, admin CMS, server actions, and Framer Motion animations.

---

## Active Development

- **Branch:** `v2-redesign`
- **Branched from:** `b083c06` (tag `v2`, `main`)
- **Purpose:** All new features, redesigns, and improvements are developed here before merging into `main`.

---

## Switching Between Versions

```bash
# View V1 static portfolio (read-only)
git checkout v1.0.0

# Return to current V2 production
git checkout main

# Switch to active development branch
git checkout v2-redesign
```

> After checking out a historical tag/commit you will be in **detached HEAD** state.  
> Run `git checkout main` or `git checkout v2-redesign` to return to a normal branch.

---

## Restore V1 in a Separate Directory (safe inspection)

```bash
# Clone just the V1 snapshot into a separate folder — does not affect this repo
git clone . /tmp/portfolio-v1
cd /tmp/portfolio-v1
git checkout v1.0.0
```

---

## Pushing Tags and Branch to Remote

```bash
# Push the v1.0.0 tag
git push origin v1.0.0

# Push the v2-redesign branch
git push -u origin v2-redesign
```

---

## Merging V2 Dev into Production (when ready)

1. Ensure all tests pass and `npm run build` succeeds on `v2-redesign`.
2. Open a Pull Request from `v2-redesign` → `main` on GitHub.
3. Review the diff carefully — do not force-merge without review.
4. After merging, tag the new production state:

```bash
git checkout main
git pull origin main
git tag v2.1.0   # increment as appropriate
git push origin v2.1.0
```

---

## Rollback Instructions

### Roll back production to a specific commit

```bash
# Identify the target commit
git log --oneline main

# Create a revert commit (safe — does not rewrite history)
git revert <bad-commit-hash>
git push origin main
```

### Roll back to V1 entirely (emergency)

```bash
# This creates a new commit that restores V1 state — does NOT rewrite history
git checkout main
git checkout v1.0.0 -- index.html css/ js/
git commit -m "rollback: restore V1 static portfolio"
git push origin main
```

### Roll back to V2 tag baseline

```bash
git revert b083c06..HEAD   # reverts all commits after the v2 tag
git push origin main
```

> ⚠️ **Never** `git push --force` to `main` or rewrite published history.

---

## Stash Note

There is one existing stash entry (`stash@{0}`) containing a large WIP UI change that was in progress before the `v2` tag was created. It is preserved and has not been discarded.

```bash
# Inspect the stash
git stash show -p stash@{0}

# Apply it on v2-redesign if you want to resume that work
git checkout v2-redesign
git stash pop
```
