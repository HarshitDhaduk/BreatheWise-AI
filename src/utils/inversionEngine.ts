import { InversionRisk, DiurnalPoint } from '../types';

export interface WeatherConditionInput {
  temperature: number; // Celsius
  humidity: number; // %
  windSpeed: number; // km/h
  hourOfDay: number; // 0 to 23
  pm25: number; // ug/m3
}

/**
 * Analyzes meteorological conditions to detect winter atmospheric thermal inversion.
 * Winter inversions typically occur when:
 * 1. Surface wind speed is low (< 7 km/h or ~2 m/s stagnation)
 * 2. Temperatures are low (winter conditions <= 18°C)
 * 3. Time is late night, dawn, or early morning (22:00 - 09:00)
 * 4. High relative humidity (> 60%) contributing to aerosol hygroscopic growth (dense smog/fog).
 */
export function analyzeThermalInversion(input: WeatherConditionInput): InversionRisk {
  const { temperature, humidity, windSpeed, hourOfDay, pm25 } = input;

  const isNightOrMorning = (hourOfDay >= 20 || hourOfDay <= 9);
  const isStagnantWind = windSpeed <= 8.0; // km/h
  const isColdOrCool = temperature <= 20.0;
  const isHighMoisture = humidity >= 55.0;

  let score = 0;
  if (isNightOrMorning) score += 2;
  if (isStagnantWind) score += 2;
  if (isColdOrCool) score += 2;
  if (isHighMoisture) score += 1;
  if (pm25 >= 150) score += 2;

  let severity: InversionRisk['severity'] = 'None';
  let reason = 'Normal atmospheric convective mixing. Boundary layer is dispersed.';

  if (score >= 7) {
    severity = 'Critical';
    reason = 'Severe nocturnal thermal inversion ceiling (<150m) trapping particulate smog against ground level. Near-zero convective dispersion.';
  } else if (score >= 5) {
    severity = 'Severe';
    reason = 'Significant temperature inversion lid formed. Ground-level cooling and low wind preventing pollutant dissipation.';
  } else if (score >= 3) {
    severity = 'Moderate';
    reason = 'Shallow boundary layer with low dispersion. Smog concentration elevated in low-lying corridors.';
  }

  // Calculate clean air ventilation window
  // Typically occurs between 12:30 PM and 15:30 PM when solar radiation peaks and breaks the inversion lid
  const cleanAirWindow = {
    start: '12:30 PM',
    end: '03:15 PM',
    description: 'Convective solar mixing temporarily breaks the surface inversion lid. Lowest 24-hr particulate density window for controlled 15-minute home air exchange.',
  };

  return {
    isInversionLikely: severity !== 'None',
    severity,
    reason,
    cleanAirWindow,
  };
}

/**
 * Generates synthetic or real diurnal 24-hour smog cycle reflecting typical winter inversion patterns.
 * Shows peaks at 07:00-09:00 (morning inversion + rush hour) and 21:00-23:00 (night cooling + wood/biomass heating).
 * Shows valley at 13:00-15:00 (solar convective breakup).
 */
export function generateDiurnalCurve(basePm25: number, currentTemp: number): DiurnalPoint[] {
  const points: DiurnalPoint[] = [];

  for (let hour = 0; hour < 24; hour++) {
    const timeLabel = `${hour.toString().padStart(2, '0')}:00`;
    let multiplier = 1.0;

    // Morning peak (Inversion + cold + school/work rush)
    if (hour >= 6 && hour <= 9) {
      multiplier = 1.35;
    }
    // Afternoon clean window (Sun heating ground, inversion breakup)
    else if (hour >= 12 && hour <= 15) {
      multiplier = 0.58;
    }
    // Evening transition (Sunset cooling, traffic, domestic heating)
    else if (hour >= 18 && hour <= 22) {
      multiplier = 1.45;
    }
    // Deep night (Stagnant cold trap)
    else if (hour >= 23 || hour <= 5) {
      multiplier = 1.2;
    }

    const pm25Val = Math.max(10, Math.round(basePm25 * multiplier));
    // Estimate AQI proportionally
    const aqiVal = Math.round(pm25Val * 1.6);
    const tempVariation = Math.sin((hour - 8) * (Math.PI / 12)) * 5;
    const tempVal = Math.round((currentTemp + tempVariation) * 10) / 10;
    const isClean = hour >= 12 && hour <= 15;

    points.push({
      time: timeLabel,
      pm25: pm25Val,
      aqi: aqiVal,
      temperature: tempVal,
      isCleanWindow: isClean,
    });
  }

  return points;
}
