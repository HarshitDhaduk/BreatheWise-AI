import { describe, it, expect } from 'vitest';
import { analyzeThermalInversion, generateDiurnalCurve } from '../utils/inversionEngine';

describe('Inversion Engine & Diurnal Modeler', () => {
  it('detects critical thermal inversion during stagnant cold winter mornings', () => {
    const result = analyzeThermalInversion({
      temperature: 11,
      humidity: 82,
      windSpeed: 3.2, // Stagnant
      hourOfDay: 7, // Morning inversion peak
      pm25: 290,
    });

    expect(result.isInversionLikely).toBe(true);
    expect(['Severe', 'Critical']).toContain(result.severity);
    expect(result.cleanAirWindow.start).toBe('12:30 PM');
    expect(result.cleanAirWindow.end).toBe('03:15 PM');
  });

  it('detects low or no inversion during warm windy afternoons', () => {
    const result = analyzeThermalInversion({
      temperature: 26,
      humidity: 35,
      windSpeed: 18, // High wind mixing
      hourOfDay: 14,
      pm25: 35,
    });

    expect(result.severity).toBe('None');
    expect(result.isInversionLikely).toBe(false);
  });

  it('generates 24-hour diurnal points with expected peaks and clean windows', () => {
    const points = generateDiurnalCurve(200, 14);
    expect(points).toHaveLength(24);

    // Midday hours (13:00) should have lower PM2.5 than morning hours (08:00)
    const morningPoint = points.find(p => p.time === '08:00');
    const middayPoint = points.find(p => p.time === '13:00');

    expect(morningPoint).toBeDefined();
    expect(middayPoint).toBeDefined();
    expect(middayPoint!.pm25).toBeLessThan(morningPoint!.pm25);
    expect(middayPoint!.isCleanWindow).toBe(true);
  });
});
