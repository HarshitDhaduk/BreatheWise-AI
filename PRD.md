# Product Requirements Document (PRD)
## BreatheWise AI: Urban Air Quality & Winter Smog Copilot for Families and Communities
**Challenge**: [Challenge 6] Urban Air Quality Assistant  
**Platform**: Google PromptWars Challenge 6  
**Author**: Harshit Dhaduk  
**Version**: 1.0.0  
**Status**: Approved & Ready for Implementation  

---

## 1. Executive Summary & Vision

During severe winter months, urban areas across the globe (such as Delhi NCR, Lahore, Salt Lake City Basin, London, Milan, Beijing, and Central Europe) face catastrophic smog crises driven by **thermal temperature inversions**, stagnant winds, biomass burning, vehicular emissions, and industrial stagnation. Particulate matter ($PM_{2.5}$ and $PM_{10}$) spikes past 400–500 $\mu g/m^3$, severely exceeding WHO safe limits (15 $\mu g/m^3$).

Families, parents with infants, elderly relatives, and daily commuters are left trapped in high-pollution environments without clear, tailored guidance. Standard weather apps simply state "AQI 420: Hazardous - Stay Indoors," which is neither actionable nor practical for families who must commute, cook, heat their homes, and safeguard children.

**BreatheWise AI** is an intelligent, GenAI-powered urban air quality copilot that transforms passive AQI numbers into **hyper-personalized daily action plans, low-cost indoor air hacks, and sustainable low-emission routines**. Uniquely, it features an **Impact & Explainability Engine** that quantifies the direct personal health protection (micrograms of $PM_{2.5}$ avoided, equivalent cigarettes not inhaled) and community emission reduction (kg of $CO_2$ and $NO_x$ prevented) of every decision made.

---

## 2. Target Personas & User Verticals

| Persona | Role & Context | Primary Pain Points | BreatheWise Value Proposition |
| :--- | :--- | :--- | :--- |
| **P1: Urban Parents & Caregivers** | Families with toddlers, school-going children, or elderly parents in high-smog cities. | Unsure when to send kids to school, how to purify indoor air without expensive \$400 HEPA filters, fear of long-term lung damage. | Low-cost DIY air purifiers (Corsi-Rosenthal Box), school transit timing, pediatric indoor respiratory protocols. |
| **P2: Daily Urban Commuters** | Office workers, delivery riders, students commuting 1-2 hours daily across smog corridors. | High outdoor exposure during peak transit hours, lack of awareness regarding route pollution levels and personal vehicle emission footprint. | Smog-aware transit route advisor (Metro/Bus vs Two-Wheeler), optimal commute windows, mask fit guidance. |
| **P3: High-Risk & Sensitive Individuals** | Asthmatics, COPD patients, pregnant women, cardiovascular patients. | Severe acute exacerbations during sudden smog spikes; no early warning on atmospheric inversion traps. | Proactive Inversion Early Warning, personalized exposure budgeting, emergency smog lockdown protocol. |
| **P4: Community Leaders & Housing Societies** | Resident Welfare Associations (RWAs), neighborhood groups, apartment complexes. | Open waste burning, generator diesel exhaust, lack of community-wide coordination for emission cuts. | Community Action Hub, Clean Commute Tuesday challenges, shared sensor tracking, collective emission milestones. |

---

## 3. Core Feature Architecture & Modules

### Module 1: Atmospheric Inversion & Live Air Intelligence
- **Real-Time Data**: Global real-time Air Quality Index (AQI), $PM_{2.5}$, $PM_{10}$, $NO_2$, $O_3$, $SO_2$, $CO$, temperature, relative humidity, wind speed, and atmospheric pressure.
- **Inversion Layer Risk Detector**: Detects winter temperature inversion conditions (low surface wind, temperature gradient, nighttime cold air trap) that prevent smog dispersal.
- **"Clean Air Window" Ventilation Predictor**: Analyzes 24-hour diurnal pollutant curves to pinpoint the exact 30–60 minute safe window (typically early afternoon when solar heating breaks inversions) to ventilate living spaces without toxic ingress.

### Module 2: Family Vulnerability & Context Engine
- Dynamic family configuration:
  - Household members: Infants (< 2 yrs), Children (2-12 yrs), Asthmatic/Respiratory patients, Elderly (65+ yrs), Healthy adults.
  - Housing profile: Multi-story apartment vs ground floor house, window sealing quality (single pane vs sealed), primary cooking fuel, winter heating source.
  - Daily commute mode: Two-wheeler, public transit / metro, shared auto/cab, private car, walking.
- Generates a **Personalized Vulnerability Multiplier** to calibrate health risk warnings.

### Module 3: Low-Emission Daily Routine Planner
- Evaluates daily schedule and suggests schedule optimizations:
  - **Commute Shift**: Shift commute 30 minutes earlier or later to avoid rush-hour $NO_2$/diesel soot spikes.
  - **Low-Emission Modal Shifts**: Replaces single-occupancy driving with metro or EV transit, displaying both time, emissions saved, and inhaled pollutant reduction.
  - **School & Exercise Advisory**: Flags high-risk morning outdoor jogging hours and suggests indoor aerobics or afternoon clean-window alternatives.

### Module 4: Low-Cost Indoor Air Quality (IAQ) Hacks & DIY Lab
- Step-by-step interactive blueprint library for affordable, accessible home air protection:
  - **DIY Corsi-Rosenthal Box**: 4 MERV-13 filters + box fan providing equivalent Clean Air Delivery Rate (CADR) to a \$500 purifier for under \$35.
  - **Winter Weatherstripping & Positive Pressure Sealing**: Thermal draft blocking that keeps both freezing air and particulate soot outside.
  - **Kitchen Cooking Fume & Inversion Protocols**: Cross-ventilation sequences when gas stoves emit $NO_2$ into sealed winter rooms.
  - **Air-Purifying Botanical Strategy**: Scientifically validated plants (Snake Plant, Areca Palm, Spider Plant) and their optimal room distribution.

### Module 5: Direct Impact & Explainability Engine
- Translates abstract metrics into concrete human-relatable outcomes:
  - **Personal Health Burden Avoided**: Micrograms of $PM_{2.5}$ blocked from deep alveolar penetration; equivalent cigarette toxic burden avoided.
  - **Personal Emission Savings**: Kilograms of $CO_2$ avoided, grams of $NO_x$ prevented through low-emission choices.
  - **Causal Reasoning**: GenAI explains *why* the choice matters (e.g., "Switching your 12km commute from scooter to Metro today prevented inhaling $84\,\mu g$ of toxic fine particulate soot while reducing city $NO_x$ output by $34\,g$").

### Module 6: GenAI Winter Smog Copilot (Google Gemini Powered)
- Multi-turn conversational AI specialized in winter urban smog mitigation.
- Grounded in environmental science, WHO air quality guidelines, and pediatric respiratory safety.
- Features preset one-click prompts: *"How do I protect my 8-month-old during an AQI 420 spike?"*, *"Step-by-step Corsi-Rosenthal filter build"*, *"Winter room heating without emitting smoke"*.
- Resilient fallback engine with offline expert knowledge base if API credentials are absent.

### Module 7: Severe Smog Emergency Lockdown (AQI 300+ / 400+)
- Instant one-tap Emergency Mode activation when air quality reaches "Severe" or "Hazardous":
  - Checklist for child safety & school notifications.
  - Mask guide: N95/FFP2 vs surgical vs cloth (explaining why cloth masks fail against $PM_{2.5}$).
  - Bedroom "Clean Air Sanctuary" isolation protocol.

### Module 8: Community Action Hub & Emission Reduction Pledges
- Gamified community milestones:
  - "Zero Waste Burning Pledge"
  - "Carpool / Metro Days"
  - "Community Filter Donation Drives"
- Collective impact dashboard estimating neighborhood emission abatements.

---

## 4. Technical Architecture & Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React (Accessible, responsive, modern, mobile-first design).
- **AI Services**: Google Gemini API (structured streaming and conversational assistance with JSON function calling / system prompts), with built-in zero-latency local fallback knowledge base.
- **Air Quality APIs**: Open-Meteo Air Quality & Weather API (free, open, global, no rate-limiting barriers, hourly $PM_{2.5}$, $PM_{10}$, $NO_2$, $O_3$, etc.).
- **Testing**: Vitest + React Testing Library (comprehensive unit tests for calculators, UI state, and API services).
- **Repository Management**: Single `main` branch, strict `.gitignore`, strictly under 10 MB total footprint.

---

## 5. Evaluation Alignment Matrix

| Evaluation Criteria | Weight | BreatheWise Implementation |
| :--- | :--- | :--- |
| **Problem Statement Alignment** | **High Impact** | Dedicated specifically to severe winter smog, families, daily routine optimization, indoor hacks, and impact explanation. |
| **Code Quality** | **High Impact** | Clean modular architecture, TypeScript type safety, ESLint/Prettier compliance, decoupled services, clear separation of concerns. |
| **Security** | **Medium Impact** | Client-side API key isolation (keys never hardcoded), input sanitization, defense against prompt injection, zero sensitive data telemetry. |
| **Efficiency** | **Medium Impact** | Zero heavy runtime dependencies, optimized Vite build, cached API requests, local storage persistence, repo size strictly < 10 MB. |
| **Testing** | **Low Impact** | 100% test pass rate across impact math, AQI categorization, inversion detection logic, and component rendering. |
| **Accessibility** | **Low Impact** | WCAG 2.1 AA compliant, colorblind-safe AQI gauges, full keyboard navigability, semantic HTML, and ARIA labels. |

---

## 6. Assumptions & Constraints
1. **Repository Constraints**: Strictly $< 10\text{ MB}$, single `main` branch, public GitHub repo.
2. **API Resilience**: Live APIs (Open-Meteo, Gemini) must feature robust offline and demo mock fallbacks to guarantee uninterrupted testing for evaluators.
3. **Health Advisory Scope**: Guidance provides preventive and lifestyle recommendations aligned with WHO and EPA standards; disclaimers note that emergency clinical symptoms require medical attention.
