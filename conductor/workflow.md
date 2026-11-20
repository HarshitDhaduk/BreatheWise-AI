# Workflow & Development Standards - BreatheWise AI

## TDD & Verification
- Unit test coverage for core business logic:
  - AQI and pollutant categorization
  - Inversion risk detection algorithm
  - Clean air window calculation
  - Health burden avoided math ($PM_{2.5}$ to cigarette equivalence)
  - Emission reduction calculations ($CO_2$, $NO_x$)
  - Family vulnerability risk multiplier

## Commit Strategy
- **Format**: Conventional Commits (`feat:`, `fix:`, `test:`, `docs:`, `chore:`)
- **Branch**: Single `main` branch only, as strictly required by competition rules.

## Accessibility Requirements
- Semantic HTML tags (`<main>`, `<header>`, `<section>`, `<article>`, `<button>`)
- Full keyboard accessibility and visible focus rings
- WCAG 2.1 AA compliant color contrast ratios
- Screen-reader compatible ARIA labels on all interactive controls
