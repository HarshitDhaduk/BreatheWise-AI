# Tech Stack - BreatheWise AI

## Frontend Core
- **Framework**: React 18 with TypeScript
- **Build System**: Vite (fast builds, minimal bundle footprint, zero bloat)
- **Styling**: Tailwind CSS (utility-first, responsive, accessible contrast)
- **Icons**: Lucide React (feather-light, tree-shakeable icons)

## AI & APIs
- **GenAI Provider**: Google Gemini API (`gemini-1.5-flash` / `gemini-2.0-flash` or customizable by user)
- **Domain AI Engine**: Grounded System Prompts + Structured Response Parsers + Built-in Knowledge Base fallback
- **Air Quality API**: Open-Meteo Air Quality & Weather API (Global, real-time, hourly $PM_{2.5}$, $PM_{10}$, $NO_2$, $O_3$, $CO$, $SO_2$, temperature, wind, humidity, no API key barriers)

## Testing & Quality
- **Test Runner**: Vitest (fast, native ESM, Vite integrated)
- **Assertions**: `@testing-library/react`, `@testing-library/jest-dom`
- **Linter & Formatter**: ESLint + Prettier

## Constraints
- **Repository Size**: Strictly $< 10\text{ MB}$ (all build artifacts, node_modules, and cache directories ignored).
- **Single Branch**: All code resides on `main`.
