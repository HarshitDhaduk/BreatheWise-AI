import { CommuteProfile, FamilyMembers, HousingProfile } from '../types';

export interface CalculatedImpact {
  pm25AvoidedUg: number;
  equivalentCigarettesSaved: number;
  co2SavedKg: number;
  noxSavedGrams: number;
  cleanAirBreathsEstimated: number;
  causalExplanation: string;
}

// Berkeley Earth standard: 1 cigarette corresponds to 22 ug/m3 of PM2.5 over 24 hours
// Total inhaled mass per 24h at 22 ug/m3 with average 12 m3/day breathing = ~264 ug
export const UG_PM25_PER_CIGARETTE = 264;

/**
 * Calculates personal health protection and community emission savings
 * based on user context and behavioral choices.
 */
export function calculateDirectImpact(
  currentPm25: number,
  commute: CommuteProfile,
  family: FamilyMembers,
  housing: HousingProfile,
  options: {
    switchedToPublicTransit: boolean;
    woreN95Mask: boolean;
    usedDIYFilter: boolean;
    avoidedPeakCommute: boolean;
    avoidedBiomassBurning: boolean;
  }
): CalculatedImpact {
  let pm25AvoidedUg = 0;
  let co2SavedKg = 0;
  let noxSavedGrams = 0;

  // 1. Commute exposure and emission impact
  const distance = Math.max(2, commute.distanceKm || 10);
  const roundTripDistance = distance * 2;

  // Outdoor commute breathing rate ~ 0.8 m3/hr, trip duration ~ 0.75 hr
  const commuteBreathingVolumeM3 = 0.6; // m3 of air inhaled during round-trip transit
  const baselineTransitExposureUg = currentPm25 * commuteBreathingVolumeM3;

  if (options.switchedToPublicTransit) {
    // Metro/train cabins have heavy filtration (~65% reduction in cabin PM2.5)
    pm25AvoidedUg += baselineTransitExposureUg * 0.65;

    // Emission savings compared to private modes
    if (commute.mode === 'car_solo') {
      // Car produces ~170g CO2/km vs Metro ~18g/p-km
      co2SavedKg += roundTripDistance * 0.152;
      noxSavedGrams += roundTripDistance * 0.55;
    } else if (commute.mode === 'two_wheeler_petrol') {
      // Petrol scooter produces ~45g CO2/km vs Metro ~18g
      co2SavedKg += roundTripDistance * 0.027;
      noxSavedGrams += roundTripDistance * 0.32;
    }
  }

  // 2. Mask filtration protection
  if (options.woreN95Mask) {
    // N95 filters 95% of fine particulates
    pm25AvoidedUg += baselineTransitExposureUg * 0.85;
  }

  // 3. Peak commute timing shift
  if (options.avoidedPeakCommute) {
    // Shifting out of peak rush-hour avoids high localized diesel tailpipe soot (~25% lower exposure)
    pm25AvoidedUg += baselineTransitExposureUg * 0.25;
  }

  // 4. Indoor Air Quality DIY hack (Corsi-Rosenthal Box / Sealing)
  if (options.usedDIYFilter || housing.hasPurifier) {
    // Indoor breathing: ~12 m3/day for adults, ~6 m3/day for children
    const totalFamilyDailyInhalationM3 = 
      family.adults * 10 + 
      family.elderly * 8 + 
      family.children * 7 + 
      family.infants * 4;

    // Indoor air without filter in winter drafty home is ~60-70% of outdoor PM2.5
    // With DIY filter, indoor PM2.5 drops to < 15-20% of outdoor
    const indoorUgAvoidedPerM3 = Math.max(10, currentPm25 * 0.55);
    pm25AvoidedUg += (totalFamilyDailyInhalationM3 * indoorUgAvoidedPerM3) / 2; // Split daytime benefit
  }

  // 5. Heating / biomass avoidance
  if (options.avoidedBiomassBurning || housing.heatingType === 'electric_radiator' || housing.heatingType === 'reverse_cycle_ac') {
    // Avoiding 1 evening of domestic firewood/waste burning prevents ~4.5 kg CO2 and direct toxic VOCs
    co2SavedKg += 4.5;
    noxSavedGrams += 12.0;
  }

  // Equivalence calculations
  const equivalentCigarettesSaved = Math.round((pm25AvoidedUg / UG_PM25_PER_CIGARETTE) * 10) / 10;
  const cleanAirBreathsEstimated = Math.round(pm25AvoidedUg * 14);

  // Generate plain-language causal narrative
  const explanationParts: string[] = [];

  if (pm25AvoidedUg > 0) {
    explanationParts.push(
      `Your proactive adjustments prevented your family from inhaling approximately ${Math.round(pm25AvoidedUg).toLocaleString()} µg of deep-lung toxic particulate matter.`
    );
  }

  if (equivalentCigarettesSaved > 0.3) {
    explanationParts.push(
      `In respiratory toxicity terms, this is equivalent to sparing your lungs from ${equivalentCigarettesSaved} toxic cigarettes.`
    );
  }

  if (co2SavedKg > 0) {
    explanationParts.push(
      `Concurrently, your sustainable transit and heating choices prevented ${co2SavedKg.toFixed(1)} kg of CO₂ and ${Math.round(noxSavedGrams)} g of respiratory-irritating NOx from entering your community's shallow winter inversion layer.`
    );
  }

  const causalExplanation = explanationParts.join(' ');

  return {
    pm25AvoidedUg: Math.round(pm25AvoidedUg),
    equivalentCigarettesSaved,
    co2SavedKg: Math.round(co2SavedKg * 10) / 10,
    noxSavedGrams: Math.round(noxSavedGrams * 10) / 10,
    cleanAirBreathsEstimated,
    causalExplanation,
  };
}
