import { describe, it, expect } from 'vitest';
import { calculateDirectImpact, UG_PM25_PER_CIGARETTE } from '../utils/impactCalculator';

describe('Impact & Explainability Engine', () => {
  const mockCommute = {
    mode: 'car_solo' as const,
    distanceKm: 15,
    typicalDepartureTime: '08:30',
    typicalReturnTime: '18:30',
  };

  const mockFamily = {
    infants: 1,
    children: 1,
    adults: 2,
    elderly: 0,
    respiratoryVulnerable: 0,
  };

  const mockHousing = {
    type: 'apartment' as const,
    floorLevel: 3,
    windowSealing: 'drafty' as const,
    hasPurifier: false,
    cookingFuel: 'piped_gas' as const,
    heatingType: 'electric_radiator' as const,
  };

  it('quantifies PM2.5 and CO2 savings when adopting public transit and masks', () => {
    const impact = calculateDirectImpact(250, mockCommute, mockFamily, mockHousing, {
      switchedToPublicTransit: true,
      woreN95Mask: true,
      usedDIYFilter: true,
      avoidedPeakCommute: true,
      avoidedBiomassBurning: true,
    });

    expect(impact.pm25AvoidedUg).toBeGreaterThan(0);
    expect(impact.equivalentCigarettesSaved).toBeGreaterThan(0);
    expect(impact.co2SavedKg).toBeGreaterThan(0);
    expect(impact.noxSavedGrams).toBeGreaterThan(0);
    expect(impact.causalExplanation).toContain('Your proactive adjustments');
  });

  it('calculates cigarette equivalents consistent with Berkeley Earth standard', () => {
    // 264 ug of inhaled PM2.5 = 1 cigarette
    const expectedCigs = Math.round((528 / UG_PM25_PER_CIGARETTE) * 10) / 10;
    expect(expectedCigs).toBe(2);
  });
});
