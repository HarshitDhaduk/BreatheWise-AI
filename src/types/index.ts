export type AQICategory = 
  | 'Good' 
  | 'Moderate' 
  | 'UnhealthyForSensitive' 
  | 'Unhealthy' 
  | 'VeryUnhealthy' 
  | 'Hazardous' 
  | 'SevereHazardous';

export interface AirQualityMetrics {
  aqi: number;
  category: AQICategory;
  pm25: number; // ug/m3
  pm10: number; // ug/m3
  no2: number; // ug/m3
  o3: number; // ug/m3
  so2: number; // ug/m3
  co: number; // ug/m3
  temperature: number; // Celsius
  humidity: number; // %
  windSpeed: number; // km/h
  windDirection: number; // degrees
  timestamp: string;
  locationName: string;
  latitude: number;
  longitude: number;
}

export interface InversionRisk {
  isInversionLikely: boolean;
  severity: 'None' | 'Moderate' | 'Severe' | 'Critical';
  reason: string;
  cleanAirWindow: {
    start: string;
    end: string;
    description: string;
  };
}

export interface DiurnalPoint {
  time: string;
  pm25: number;
  aqi: number;
  temperature: number;
  isCleanWindow?: boolean;
}

export interface FamilyMembers {
  infants: number; // Under 2
  children: number; // 2 to 12
  adults: number;
  elderly: number; // 65+
  respiratoryVulnerable: number; // Asthma, COPD, allergic bronchitis
}

export interface HousingProfile {
  type: 'apartment' | 'independent_house';
  floorLevel: number;
  windowSealing: 'drafty' | 'moderate' | 'airtight';
  hasPurifier: boolean;
  cookingFuel: 'induction' | 'piped_gas' | 'lpg_cylinder' | 'biomass_wood';
  heatingType: 'electric_radiator' | 'reverse_cycle_ac' | 'gas_heater' | 'wood_fire' | 'blankets_only';
}

export interface CommuteProfile {
  mode: 'metro' | 'electric_bus' | 'ice_bus' | 'two_wheeler_petrol' | 'ev_two_wheeler' | 'car_solo' | 'carpool' | 'walk_cycle';
  distanceKm: number;
  typicalDepartureTime: string; // HH:mm
  typicalReturnTime: string; // HH:mm
}

export interface UserContext {
  family: FamilyMembers;
  housing: HousingProfile;
  commute: CommuteProfile;
  vulnerabilityScore: number; // 1 (Low) to 5 (Critical)
}

export interface DailyRoutineOptimization {
  standardSchedule: {
    title: string;
    time: string;
    exposureEstimateUg: number;
  }[];
  optimizedSchedule: {
    title: string;
    time: string;
    shiftReason: string;
    exposureEstimateUg: number;
    emissionSavingsKgCO2: number;
  }[];
  totalExposureAvoidedUg: number;
  equivalentCigarettesSaved: number;
  totalCO2SavedKg: number;
  totalNOxSavedGrams: number;
  advisoryPoints: string[];
}

export interface IAQHackItem {
  id: string;
  title: string;
  category: 'diy_filtration' | 'sealing' | 'ventilation' | 'heating_cooking' | 'plants';
  estimatedCostUSD: number;
  estimatedCostINR: number;
  difficulty: 'Easy (10 mins)' | 'Medium (30 mins)' | 'Advanced (1 hr)';
  materials: string[];
  steps: string[];
  cadreEstimateM3h: number; // Clean Air Delivery Rate
  pm25ReductionPercent: number;
  scientificExplanation: string;
  proTip: string;
}

export interface CommunityPledge {
  id: string;
  title: string;
  category: 'commute' | 'heating' | 'waste' | 'neighborhood';
  participantsCount: number;
  estimatedCommunityCO2SavedKg: number;
  userPledged: boolean;
  description: string;
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedFollowUps?: string[];
  impactHighlight?: {
    metric: string;
    value: string;
    meaning: string;
  };
}
