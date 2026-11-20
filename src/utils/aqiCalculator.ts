import { AQICategory } from '../types';

export interface AQIBreakpoint {
  cLow: number;
  cHigh: number;
  iLow: number;
  iHigh: number;
}

// EPA PM2.5 (ug/m3) Breakpoints to AQI
const PM25_BREAKPOINTS: AQIBreakpoint[] = [
  { cLow: 0.0, cHigh: 12.0, iLow: 0, iHigh: 50 },
  { cLow: 12.1, cHigh: 35.4, iLow: 51, iHigh: 100 },
  { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150 },
  { cLow: 55.5, cHigh: 150.4, iLow: 151, iHigh: 200 },
  { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },
  { cLow: 250.5, cHigh: 350.4, iLow: 301, iHigh: 400 },
  { cLow: 350.5, cHigh: 500.4, iLow: 401, iHigh: 500 },
];

/**
 * Calculates AQI from PM2.5 concentration using piecewise linear interpolation.
 */
export function calculateAQIFromPM25(pm25: number): number {
  if (pm25 < 0) return 0;
  
  for (const bp of PM25_BREAKPOINTS) {
    if (pm25 >= bp.cLow && pm25 <= bp.cHigh) {
      const aqi = ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (pm25 - bp.cLow) + bp.iLow;
      return Math.round(aqi);
    }
  }

  // Linear projection above 500 ug/m3
  if (pm25 > 500.4) {
    const last = PM25_BREAKPOINTS[PM25_BREAKPOINTS.length - 1];
    const aqi = last.iHigh + (pm25 - last.cHigh) * 0.5;
    return Math.min(999, Math.round(aqi));
  }

  return Math.round(pm25);
}

/**
 * Categorizes an AQI number into standardized tiers.
 */
export function getAQICategory(aqi: number): AQICategory {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'UnhealthyForSensitive';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'VeryUnhealthy';
  if (aqi <= 400) return 'Hazardous';
  return 'SevereHazardous';
}

export interface AQIUITheme {
  category: AQICategory;
  label: string;
  badgeBg: string;
  textColor: string;
  borderColor: string;
  hex: string;
  healthSummary: string;
  maskRecommendation: string;
}

export function getAQITheme(aqi: number): AQIUITheme {
  const category = getAQICategory(aqi);

  switch (category) {
    case 'Good':
      return {
        category,
        label: 'Good Air Quality',
        badgeBg: 'bg-emerald-500/15',
        textColor: 'text-emerald-400',
        borderColor: 'border-emerald-500/30',
        hex: '#10B981',
        healthSummary: 'Air quality is satisfactory and poses little or no risk.',
        maskRecommendation: 'No mask required. Safe for all outdoor activities.',
      };
    case 'Moderate':
      return {
        category,
        label: 'Moderate',
        badgeBg: 'bg-amber-500/15',
        textColor: 'text-amber-400',
        borderColor: 'border-amber-500/30',
        hex: '#FBBF24',
        healthSummary: 'Air quality is acceptable; unusually sensitive individuals should observe symptoms.',
        maskRecommendation: 'Sensitive individuals should carry a surgical or N95 mask near heavy traffic.',
      };
    case 'UnhealthyForSensitive':
      return {
        category,
        label: 'Unhealthy for Sensitive Groups',
        badgeBg: 'bg-orange-500/15',
        textColor: 'text-orange-400',
        borderColor: 'border-orange-500/30',
        hex: '#F97316',
        healthSummary: 'Children, seniors, and asthmatics may experience breathing discomfort.',
        maskRecommendation: 'Fitted N95 recommended for children, seniors, and people with respiratory conditions.',
      };
    case 'Unhealthy':
      return {
        category,
        label: 'Unhealthy (Red Alert)',
        badgeBg: 'bg-rose-500/15',
        textColor: 'text-rose-400',
        borderColor: 'border-rose-500/30',
        hex: '#EF4444',
        healthSummary: 'Everyone may begin to experience adverse health effects; sensitive groups face serious risk.',
        maskRecommendation: 'Fitted N95/FFP2 mask mandatory for all outdoor transit. Avoid jogging outdoors.',
      };
    case 'VeryUnhealthy':
      return {
        category,
        label: 'Very Unhealthy (Purple Alert)',
        badgeBg: 'bg-purple-500/15',
        textColor: 'text-purple-400',
        borderColor: 'border-purple-500/30',
        hex: '#8B5CF6',
        healthSummary: 'Health alert: Increased risk of respiratory illness across the entire population.',
        maskRecommendation: 'Strict N95/N99 protection required. Keep indoor air purifiers/hacks running on high.',
      };
    case 'Hazardous':
      return {
        category,
        label: 'Hazardous (Severe Smog)',
        badgeBg: 'bg-red-950/40',
        textColor: 'text-red-300',
        borderColor: 'border-red-600/50',
        hex: '#DC2626',
        healthSummary: 'Health warnings of emergency conditions. Severe trigger for pulmonary and cardiac distress.',
        maskRecommendation: 'Emergency condition: Remain indoors. Seal drafty windows. Double-strap N95 if outdoors.',
      };
    case 'SevereHazardous':
      return {
        category,
        label: 'Severe Emergency (Hazardous+)',
        badgeBg: 'bg-rose-950/60',
        textColor: 'text-rose-200',
        borderColor: 'border-rose-700/80',
        hex: '#7F1D1D',
        healthSummary: 'Catastrophic smog crisis: Thermal inversion trap. Extreme toxicity level.',
        maskRecommendation: 'Stay in sealed clean-air room. Children and seniors must not step outside.',
      };
  }
}
