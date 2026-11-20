import { describe, it, expect } from 'vitest';
import { calculateAQIFromPM25, getAQICategory, getAQITheme } from '../utils/aqiCalculator';

describe('AQI Calculator and Categorization', () => {
  it('correctly calculates AQI for Good air quality', () => {
    expect(calculateAQIFromPM25(0)).toBe(0);
    expect(calculateAQIFromPM25(6.0)).toBe(25);
    expect(calculateAQIFromPM25(12.0)).toBe(50);
  });

  it('correctly calculates AQI for Moderate air quality', () => {
    const aqi = calculateAQIFromPM25(24);
    expect(aqi).toBeGreaterThan(50);
    expect(aqi).toBeLessThanOrEqual(100);
    expect(getAQICategory(aqi)).toBe('Moderate');
  });

  it('correctly categorizes Severe / Hazardous AQI levels', () => {
    expect(getAQICategory(350)).toBe('Hazardous');
    expect(getAQICategory(450)).toBe('SevereHazardous');
  });

  it('returns valid theme properties and accessibility descriptions', () => {
    const theme = getAQITheme(320);
    expect(theme.category).toBe('Hazardous');
    expect(theme.hex).toBe('#DC2626');
    expect(theme.maskRecommendation).toContain('N95');
  });

  it('handles extreme outlier concentrations', () => {
    const highAqi = calculateAQIFromPM25(650);
    expect(highAqi).toBeGreaterThan(500);
    expect(highAqi).toBeLessThanOrEqual(999);
  });
});
