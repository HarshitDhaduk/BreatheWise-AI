# Track Specification: TRK-009
## 3D Delhi NCR Micro-Smog Simulation & Comprehensive All-India Air Quality City Explorer

**Track ID**: `TRK-009`  
**Type**: Feature  
**Status**: In Progress  
**Created**: 2026-11-21  

---

## 1. Context & Motivation
India's National Capital Region (Delhi NCR) and the Indo-Gangetic Plain represent the epicenter of severe winter air pollution globally. In winter, thermal inversions trap industrial emissions, crop residue smoke, and vehicular exhaust beneath a shallow boundary layer (<120m), causing particulate spikes exceeding 400–500 $\mu g/m^3$.

However, air quality across Delhi NCR is **not uniform**:
- **Anand Vihar** (adjacent to Ghazipur landfill and ISBT diesel terminal) experiences acute localized spikes ($AQI > 450$).
- **Wazirpur / Jahangirpuri** suffers from industrial boiler stagnation.
- **Punjabi Bagh** faces heavy ring-road arterial diesel canyon effects.
- **Connaught Place** and parts of South Delhi enjoy slight green buffers.

Furthermore, families and communities across India (from the Indo-Gangetic plain cities like Lucknow, Patna, and Varanasi to coastal cities like Mumbai and Chennai, and plateau cities like Bengaluru and Hyderabad) require an interactive pan-India visualization to understand regional dispersion physics and take proactive measures.

---

## 2. User Stories
- **As an urban resident or parent in Delhi NCR**, I want to view an interactive 3D map of Delhi showing micro-station AQI pillars and the nocturnal inversion smog ceiling, so that I can see the real pollution concentration in my specific neighborhood.
- **As a commuter or traveler across India**, I want to explore an interactive All-India Air Quality Map covering 16+ key urban hubs, so that I can compare regional smog levels, understand local clean-air windows, and adopt localized low-emission routines.
- **As an environmental health researcher or judge**, I want to interact with a hardware-accelerated 3D simulation that visualizes the physics of thermal inversion breakup during the solar midday window without exceeding the 10 MB repository limit.

---

## 3. Acceptance Criteria
1. **Interactive 3D Delhi Simulation (`Delhi3DSimulator.tsx`)**:
   - Renders 10 key micro-monitoring zones across Delhi NCR in a 3D isometric perspective.
   - Hotspot pillars extruded in 3D proportionally to AQI severity with standard CPCB/EPA color coding.
   - Interactive orbit, tilt, and zoom controls.
   - Volumetric 3D smog blanket visualizing the nocturnal thermal inversion ceiling (<120m) vs midday solar dispersion.
   - Clicking any station opens an inspection card with detailed $PM_{2.5}$, $PM_{10}$, $NO_2$, and localized emission source drivers.
2. **Comprehensive All-India City Map (`IndiaAirMap.tsx`)**:
   - Displays an interactive geographical map of India with 16+ major urban centers.
   - Color-coded pulse markers showing live AQI and regional basin classifications (Indo-Gangetic Plain, Deccan Plateau, Coastal Buffer).
   - Regional filter buttons (All India, Indo-Gangetic Smog Belt, Western Corridor, Southern Hubs, Eastern Plains).
   - Clicking any city updates the entire app context, pulling live Open-Meteo feeds, clean-air window, and localized recommendations.
3. **App Integration & Performance**:
   - Top-level focus switcher toggles seamlessly between *Full Daily Copilot*, *3D Delhi Simulation*, *All-India Map*, *Decision Matrix*, *Room Defense Lab*, and *Commute Optimizer*.
   - Strict adherence to `< 10 MB` repository size limit.
   - 100% test pass rate on all calculations and models.
