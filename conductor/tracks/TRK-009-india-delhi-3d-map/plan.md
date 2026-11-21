# Implementation Plan: TRK-009
## 3D Delhi NCR Micro-Smog Simulation & Comprehensive All-India Air Quality City Explorer

**Track ID**: `TRK-009`  
**Status**: Verification & Deployment  

---

## Phase 1: India Air Quality & Delhi NCR Hotspots Data Engine
- [x] Task 1.1: Create `src/data/indiaAirData.ts` with comprehensive data for:
  - 10 Delhi NCR micro-stations (coordinates, typical winter AQI, local sources, altitude, zone).
  - 16 All-India metropolitan hubs across Northern, Western, Southern, and Eastern corridors.
  - Meteorological basin vulnerability factors (Indo-Gangetic Plain river basin trap vs Coastal breeze vs Deccan elevation).
- [x] Task 1.2: Add unit tests in `src/test/indiaAirData.test.ts` validating coordinates, data integrity, and regional filtering functions.

---

## Phase 2: Interactive 3D Delhi NCR Simulation Component
- [x] Task 2.1: Implement `src/components/Delhi3DSimulator.tsx`:
  - 3D Isometric projection engine with WebGL / HTML5 Canvas.
  - Interactive orbit, tilt, and zoom camera manipulation.
  - 3D extruded pillars for 10 Delhi micro-monitoring stations with glowing pulse rings.
  - Animated volumetric smog haze layer with day/night inversion toggle (120m nocturnal trap vs 450m solar convective dispersion).
  - Station detail inspector flyout card ($PM_{2.5}$, $PM_{10}$, $NO_2$, temperature, local source drivers).

---

## Phase 3: Comprehensive All-India City Air Quality Map Component
- [x] Task 3.1: Implement `src/components/IndiaAirMap.tsx`:
  - Geographic vector map of India with state boundaries and major river basin highlights.
  - Interactive pulse markers for all 16 Indian cities with live AQI color coding.
  - Regional filter pills (All India, Indo-Gangetic Plain, Western Corridor, Southern Hubs, Eastern Plains).
  - City selection synchronization: selecting a city updates global app state, Open-Meteo feeds, clean air window, and Copilot context.

---

## Phase 4: App Integration & Unified Navigation
- [x] Task 4.1: Integrate `Delhi3DSimulator` and `IndiaAirMap` into `src/App.tsx`.
- [x] Task 4.2: Add top-level navigation tabs (`India Air Map` and `3D Delhi Simulation`).
- [x] Task 4.3: Ensure seamless synchronization between map city selection and the rest of the application (Action Matrix, Room Simulator, Commute Simulator, Day Scrubber, and Copilot).

---

## Phase 5: Verification, Production Build & GitHub Synchronization
- [x] Task 5.1: Run `pnpm test` and verify 100% test pass rate across all suites.
- [x] Task 5.2: Run `pnpm run build` and verify 0 errors, 0 warnings with optimized bundle size.
- [x] Task 5.3: Verify git repository size remains strictly `< 10 MB` (currently ~400 KB).
- [ ] Task 5.4: Test interactive rendering with the browser subagent at `http://localhost:5173/`.
- [ ] Task 5.5: Commit and push changes to GitHub `main` branch to trigger automated GitHub Pages deployment.
