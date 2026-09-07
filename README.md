# PromptLens

**Can you describe an image better than AI?** PromptLens is a competitive prompt-engineering game: you're shown an AI-generated image, you write the prompt you think produced it, and an evaluator scores your prompt against the image's real visual attributes — then shows you exactly what you nailed and what you missed.

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, and Framer Motion.

## Design system

The UI is deliberately flat: one solid accent color, hairline borders, no gradients, no glassmorphism/blur. Every color is a CSS variable in `app/globals.css` (`--bg`, `--surface`, `--accent`, `--success`, `--warning`, `--danger`, …), each mapped to a Tailwind utility via `@theme inline`, so components use classes like `bg-surface`, `text-accent`, `border-border-strong` rather than hardcoded colors. The app ships with both a dark and a light theme — the toggle lives in the navbar (`components/ui/theme-toggle.tsx`), backed by `lib/theme.ts` (a `useSyncExternalStore` store that persists the choice to `localStorage` and defaults to the visitor's OS preference on first visit). An inline script in `app/layout.tsx` sets the theme before first paint so there's no flash of the wrong theme.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # ESLint
```

## What's implemented

PromptLens was deliberately simplified down to the essentials — two modes, a 3-category scorecard, and a shorter difficulty/level ladder — so new players can understand the whole game in one glance.

- **Landing page** — animated hero, "how it works," a live scoring showcase, a 2-mode grid, category/difficulty browser.
- **Guess the Prompt** (`/play/[challengeId]`) — the core loop: image → prompt editor with autosave, character counter, hint system (progressive, point-costed), submit confirmation, ⌘/Ctrl+Enter shortcut → animated score reveal (overall ring + 3 category bars: Subject, Scene & Style, Details & Craft) → matched/missed/"too vague" concept lists → original prompt reveal with copy button → side-by-side prompt comparison with highlighting → AI tutor feedback with an improved-prompt rewrite → shareable result card → Try Again / Next Challenge.
- **Daily Challenge** (`/daily`) — the same image for everyone, deterministic per calendar day.
- **Leaderboard** (`/leaderboard`) — Today / This Week / All Time tabs, your rank, achievement badges.
- **Profile** (`/profile`) — stats, level progression, score history chart, per-category "prompt strengths."
- **Admin** (`/admin`) — create, preview, publish/unpublish, and delete challenges; published ones are immediately playable from `/play`.
- **9 seed challenges** across Architecture, Sci-Fi, Cinematic, Nature, Cyberpunk, Fantasy, and Photography, each with a full scoring rubric, at 3 difficulty tiers (Easy / Medium / Hard).
- **4 XP levels** (Prompt Rookie → Prompt Skilled → Prompt Expert → Prompt Wizard).

Prompt Battle, Fix the Prompt, and Spot the Difference still exist in the codebase (`/battle`, `/fix`, `/spot`) but were dropped from the nav and landing page to keep the game to two clear choices. Delete those route/component folders if you don't want them at all, or re-link them from `components/layout/navbar.tsx` and `components/home/modes-grid.tsx` if you want them back.

## The scoring engine

`lib/scoring.ts` is a **local, deterministic evaluator** — no API key required, and it's the one seam you'd touch to upgrade to a real vision-LLM evaluator.

Each challenge (`data/challenges.ts`) defines a set of weighted `ConceptTarget`s across nine fine-grained scoring dimensions (subject, environment, composition, style, lighting, color, camera, mood, specificity), carried over from the original spec so matching stays precise under the hood. `GROUP_OF` in `lib/scoring.ts` rolls those nine into the 3 categories players actually see: **Subject** (50%), **Scene & Style** (30% — environment, style, lighting, color, mood), and **Details & Craft** (20% — composition, camera, specificity). Each concept carries a curated synonym list so that, e.g., "warm sunset lighting" scores like "golden hour." `evaluatePrompt()`:

1. Normalizes and tokenizes the user's prompt.
2. Matches each concept via exact phrase, fuzzy/reordered token overlap (stemmed), or a "vague" fallback (generic language that gestures at the idea without adding recreatable detail).
3. Rolls matches up into the 3 category scores, then a weighted overall score.
4. Applies a small efficiency bonus for high signal-density prompts (so a short, accurate prompt can beat a long, padded one) and never rewards raw length.
5. Produces matched/missed/vague concept lists, a rewritten "improved prompt," and templated tutor feedback.

**To wire up a real AI evaluator:** replace `evaluatePrompt()`'s body with a call to your vision-LLM of choice (send it the target image + the user's prompt + the challenge's concept list, ask it to return the same `EvaluationResult` shape). Everything downstream — the UI, the store, XP, leaderboards — is already built against that return type, so no other file needs to change.

**To restore the original 9-category scorecard:** delete the `GROUP_OF`/`GROUP_WEIGHTS`/`GROUP_LABELS` grouping step in `lib/scoring.ts` and roll `dimensions` up by `ScoreDimensionKey` directly (using the still-present `DIMENSION_WEIGHTS`/`DIMENSION_LABELS`) instead of `ScoreGroupKey`.

## Images

Challenge images are hotlinked from Unsplash's public CDN (`images.unsplash.com`), which is how the vast majority of production sites use Unsplash — no API key needed. `components/ui/smart-image.tsx` wraps `next/image` with a two-stage fallback (optimizer → direct browser fetch → placeholder icon) in case a server-side image fetch is ever blocked by a restrictive network.

## Persistence

There's no backend in this build — user profile, XP, streaks, history, hints used, and admin-created challenges all live in `localStorage`, accessed through small `useSyncExternalStore`-based stores in `lib/store.ts` and `lib/admin-store.ts`. This is intentionally the layer to swap for real auth + a database (Postgres/Supabase/etc.) — the shapes in `lib/types.ts` are ready to become API-backed without changing the components that consume them.

## Project structure

```
app/                 routes (App Router)
components/
  ui/                 shared primitives (buttons, cards, score ring/bars, modal…)
  layout/              navbar, footer
  home/                landing page sections
  game/                the Guess the Prompt loop
  play/                challenge picker
  battle/ fix/ spot/ daily/   the other four modes
  leaderboard/ profile/ admin/
lib/                  scoring engine, stores, levels/XP, categories, types
data/challenges.ts    the seed challenge library
```
