# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Next.js dev server
npm run storybook        # Storybook on port 6006
npm run build            # Next.js production build
npm run build-storybook  # Build Storybook static output
npm run lint             # ESLint
npm run create-component <ComponentName> [feature-folder]  # Scaffold new component
```

No test framework is configured — there are no test files.

## Architecture

**Next.js 16 app** with Storybook for component development. The Next.js app (`src/app/`) is a thin demo shell; the real work is in `src/components/`.

### Global wiring (`src/app/layout.tsx`)

`ApiKeysProvider` wraps the entire app, making the Repliers API key available globally via `useApiKeys()` (from `src/lib/api-keys-context.tsx`). The key is stored in `sessionStorage`. `ChatbotIntegration` is also mounted here as a persistent floating chatbot.

### Component structure

Each feature lives in `src/components/<feature>/`. Simple components follow the flat pattern from `autocomplete-search/`:
```
autocomplete-search/
  autocomplete-search.tsx      # Component
  autocomplete-search.stories.tsx
  autocomplete-search.mdx      # Tutorial
  index.ts
```

Complex components (e.g. `map-listings/`, `ai-map-listings/`) expand to:
```
map-listings/
  map-listings.tsx
  components/    # Sub-components
  hooks/         # Component-specific hooks
  types/         # TypeScript types
  constants/
  helper-functions/
  index.ts
```

### Key components

- **`autocomplete-search/`** — Reference pattern for new components. Uses Repliers API for property search with autocomplete.
- **`map-listings/`** — Mapbox GL map with property clustering and listing cards.
- **`ai-map-listings/`** — AI-driven version of map-listings with NLP query support.
- **`chatbot/`** — Floating AI chatbot that integrates with the Repliers API. Has its own `services/`, `hooks/`, `types/`.
- **`statistics/`** — Market insight components: `market-insights/`, `market-insights-by-address/`, `statistics-by-zip/`.
- **`comparables/`** — `comparables-by-address-search/`.
- **`agents/`** — `agent-dashboard/`.
- **`ui/`** — shadcn/ui primitives (Button, Input, Select, etc.). Don't modify these directly.

### Shared utilities

- `src/lib/api-keys-context.tsx` — `useApiKeys()` / `useRepliersApiKey()` hooks for API key access
- `src/lib/utils.ts` — `cn()` for Tailwind class merging
- `src/hooks/useRepliersNLP.js` — NLP query parsing for Repliers API
- `src/hooks/useOpenAIParser.js` — OpenAI-based address parsing

### Storybook

Stories live alongside components (`.stories.tsx`). MDX tutorials (`.mdx`) document integration steps for developers copying components into their own projects. Storybook is deployed to GitHub Pages via `npm run deploy-storybook`.
