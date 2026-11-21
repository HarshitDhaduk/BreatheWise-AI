import { AirQualityMetrics, DiurnalPoint } from '../types';
import { calculateAQIFromPM25, getAQICategory } from '../utils/aqiCalculator';
import { generateDiurnalCurve } from '../utils/inversionEngine';

export interface PredefinedLocation {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  description: string;
}

export const SMOG_LOCATIONS: PredefinedLocation[] = [
  {
    name: 'New Delhi (NCR)',
    country: 'India',
    latitude: 28.6139,
    longitude: 77.209,
    description: 'Severe winter crop-residue smoke & cold thermal inversion corridor.',
  },
  {
    name: 'Anand Vihar (East Delhi)',
    country: 'India',
    latitude: 28.6469,
    longitude: 77.3160,
    description: 'ISBT diesel terminus & Ghazipur landfill particulate drift hotspot.',
  },
  {
    name: 'Jahangirpuri (North-West)',
    country: 'India',
    latitude: 28.7257,
    longitude: 77.1685,
    description: 'Northern industrial clusters and bypass transport particulate trap.',
  },
  {
    name: 'Lucknow (UP)',
    country: 'India',
    latitude: 26.8467,
    longitude: 80.9462,
    description: 'Indo-Gangetic central plain humidity & nocturnal smog basin.',
  },
  {
    name: 'Patna (Bihar)',
    country: 'India',
    latitude: 25.5941,
    longitude: 85.1376,
    description: 'Downstream Ganga riverine inversion aerosol trap.',
  },
  {
    name: 'Kolkata (West Bengal)',
    country: 'India',
    latitude: 22.5726,
    longitude: 88.3639,
    description: 'Lower delta plain with dense winter riverine mist & diesel soot.',
  },
  {
    name: 'Mumbai (Maharashtra)',
    country: 'India',
    latitude: 19.0760,
    longitude: 72.8777,
    description: 'Coastal maritime ventilation corridor with winter boundary compression.',
  },
  {
    name: 'Bengaluru (Karnataka)',
    country: 'India',
    latitude: 12.9716,
    longitude: 77.5946,
    description: 'High-altitude Deccan plateau with strong atmospheric dispersion.',
  },
];

export async function fetchLiveAirQuality(
  lat: number,
  lon: number,
  locationName: string
): Promise<{ metrics: AirQualityMetrics; diurnal: DiurnalPoint[] }> {
  try {
    // 1. Fetch Air Quality from Open-Meteo
    const aqUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,nitrogen_dioxide,ozone,sulphur_dioxide,carbon_monoxide&hourly=pm2_5,pm10,us_aqi&forecast_days=2`;
    // 2. Fetch Weather from Open-Meteo
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m`;

    const [aqRes, weatherRes] = await Promise.all([
      fetch(aqUrl, { cache: 'no-cache' }),
      fetch(weatherUrl, { cache: 'no-cache' }),
    ]);

    if (!aqRes.ok || !weatherRes.ok) {
      throw new Error(`API responded with status: ${aqRes.status} / ${weatherRes.status}`);
    }

    const aqData = await aqRes.json();
    const weatherData = await weatherRes.json();

    const currentAQ = aqData.current || {};
    const currentWeather = weatherData.current || {};

    const rawPm25 = Number(currentAQ.pm2_5 ?? 145);
    const calculatedAqi = calculateAQIFromPM25(rawPm25);
    const category = getAQICategory(calculatedAqi);

    const metrics: AirQualityMetrics = {
      aqi: calculatedAqi,
      category,
      pm25: Math.round(rawPm25 * 10) / 10,
      pm10: Math.round(Number(currentAQ.pm10 ?? rawPm25 * 1.8) * 10) / 10,
      no2: Math.round(Number(currentAQ.nitrogen_dioxide ?? 65) * 10) / 10,
      o3: Math.round(Number(currentAQ.ozone ?? 35) * 10) / 10,
      so2: Math.round(Number(currentAQ.sulphur_dioxide ?? 22) * 10) / 10,
      co: Math.round(Number(currentAQ.carbon_monoxide ?? 1100) * 10) / 10,
      temperature: Math.round(Number(currentWeather.temperature_2m ?? 14) * 10) / 10,
      humidity: Math.round(Number(currentWeather.relative_humidity_2m ?? 72)),
      windSpeed: Math.round(Number(currentWeather.wind_speed_10m ?? 4.2) * 10) / 10,
      windDirection: Math.round(Number(currentWeather.wind_direction_10m ?? 280)),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      locationName,
      latitude: lat,
      longitude: lon,
    };

    // Diurnal points from hourly forecast or generated inversion curve
    let diurnal: DiurnalPoint[] = [];
    if (aqData.hourly && aqData.hourly.time && aqData.hourly.pm2_5) {
      const times: string[] = aqData.hourly.time.slice(0, 24);
      const pmValues: number[] = aqData.hourly.pm2_5.slice(0, 24);

      diurnal = times.map((t, idx) => {
        const d = new Date(t);
        const hour = d.getHours();
        const hourLabel = `${hour.toString().padStart(2, '0')}:00`;
        const val = Math.round(pmValues[idx] || rawPm25);
        return {
          time: hourLabel,
          pm25: val,
          aqi: calculateAQIFromPM25(val),
          temperature: metrics.temperature,
          isCleanWindow: hour >= 12 && hour <= 15,
        };
      });
    } else {
      diurnal = generateDiurnalCurve(metrics.pm25, metrics.temperature);
    }

    return { metrics, diurnal };
  } catch (err) {
    console.warn('Falling back to local high-fidelity smog profile:', err);
    return getFallbackAirQuality(locationName, lat, lon);
  }
}

export function getFallbackAirQuality(
  locationName: string,
  lat = 28.6139,
  lon = 77.209
): { metrics: AirQualityMetrics; diurnal: DiurnalPoint[] } {
  // Realistic winter smog profile for urban cold stagnation
  const isDelhiOrLahore = locationName.toLowerCase().includes('delhi') || locationName.toLowerCase().includes('lahore');
  const basePm25 = isDelhiOrLahore ? 285 : 142;
  const aqi = calculateAQIFromPM25(basePm25);
  const temp = isDelhiOrLahore ? 13.5 : 8.0;

  const metrics: AirQualityMetrics = {
    aqi,
    category: getAQICategory(aqi),
    pm25: basePm25,
    pm10: Math.round(basePm25 * 1.8),
    no2: 84.5,
    o3: 28.2,
    so2: 32.1,
    co: 1850,
    temperature: temp,
    humidity: 78,
    windSpeed: 3.5, // calm stagnation
    windDirection: 290,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    locationName,
    latitude: lat,
    longitude: lon,
  };

  const diurnal = generateDiurnalCurve(basePm25, temp);

  return { metrics, diurnal };
}
