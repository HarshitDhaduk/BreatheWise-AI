export interface DelhiMicroStation {
  id: string;
  name: string;
  zone: 'North' | 'South' | 'East' | 'West' | 'Central' | 'NCR Border';
  latitude: number;
  longitude: number;
  typicalWinterAQI: number;
  typicalWinterPM25: number;
  typicalWinterPM10: number;
  typicalWinterNO2: number;
  elevationMeters: number;
  primaryEmissionSources: string[];
  localVulnerabilityFactor: string;
  gridCoordinates: { x: number; y: number }; // 0-100 normalized on Delhi NCR bounding box
}

export interface IndiaCity {
  id: string;
  name: string;
  state: string;
  region: 'Indo-Gangetic Plain' | 'Western' | 'Southern' | 'Eastern & Central';
  latitude: number;
  longitude: number;
  typicalWinterAQI: number;
  typicalWinterPM25: number;
  inversionRiskTier: 'Critical' | 'Severe' | 'Moderate' | 'Low';
  geographicTopography: string;
  cleanAirWindow: {
    start: string;
    end: string;
    reason: string;
  };
  keyPollutionDrivers: string[];
  mapCoords: { x: number; y: number }; // 0-100 normalized on India SVG map
}

export const DELHI_MICRO_STATIONS: DelhiMicroStation[] = [
  {
    id: 'anand-vihar',
    name: 'Anand Vihar (East Delhi)',
    zone: 'East',
    latitude: 28.6469,
    longitude: 77.3160,
    typicalWinterAQI: 465,
    typicalWinterPM25: 380,
    typicalWinterPM10: 520,
    typicalWinterNO2: 98,
    elevationMeters: 208,
    primaryEmissionSources: [
      'Interstate Diesel Bus Terminal (ISBT)',
      'Ghazipur Landfill & Waste Combustion',
      'UP Border Heavy Freight Transit',
    ],
    localVulnerabilityFactor: 'Acute hotspot: Stagnant diesel idling plumes mixed with landfill particulate drift.',
    gridCoordinates: { x: 78, y: 46 },
  },
  {
    id: 'jahangirpuri',
    name: 'Jahangirpuri (North-West)',
    zone: 'North',
    latitude: 28.7259,
    longitude: 77.1627,
    typicalWinterAQI: 435,
    typicalWinterPM25: 340,
    typicalWinterPM10: 480,
    typicalWinterNO2: 88,
    elevationMeters: 212,
    primaryEmissionSources: [
      'Industrial metal smelting units',
      'Informal waste incinerators',
      'GT Karnal Road freight movement',
    ],
    localVulnerabilityFactor: 'Dense unplanned industrial pocket under nocturnal cold air stagnation.',
    gridCoordinates: { x: 42, y: 22 },
  },
  {
    id: 'wazirpur',
    name: 'Wazirpur Industrial Area',
    zone: 'North',
    latitude: 28.6999,
    longitude: 77.1654,
    typicalWinterAQI: 440,
    typicalWinterPM25: 350,
    typicalWinterPM10: 490,
    typicalWinterNO2: 92,
    elevationMeters: 214,
    primaryEmissionSources: [
      'Steel pickling and electroplating furnaces',
      'Chemical trade corridors',
      'Internal combustion generators',
    ],
    localVulnerabilityFactor: 'Chemical volatile organic vapors (VOCs) secondary aerosol generation.',
    gridCoordinates: { x: 44, y: 32 },
  },
  {
    id: 'punjabi-bagh',
    name: 'Punjabi Bagh (West Delhi)',
    zone: 'West',
    latitude: 28.6692,
    longitude: 77.1317,
    typicalWinterAQI: 395,
    typicalWinterPM25: 295,
    typicalWinterPM10: 420,
    typicalWinterNO2: 85,
    elevationMeters: 216,
    primaryEmissionSources: [
      'Ring Road intersection vehicular gridlock',
      'Rohtak Road transport hub',
      'Commercial diesel generators',
    ],
    localVulnerabilityFactor: 'High-density arterial street canyon trapping vehicular exhaust at head height.',
    gridCoordinates: { x: 34, y: 42 },
  },
  {
    id: 'rk-puram',
    name: 'RK Puram (South Delhi)',
    zone: 'South',
    latitude: 28.5660,
    longitude: 77.1767,
    typicalWinterAQI: 320,
    typicalWinterPM25: 220,
    typicalWinterPM10: 310,
    typicalWinterNO2: 65,
    elevationMeters: 225,
    primaryEmissionSources: [
      'Outer Ring Road vehicular transit',
      'Domestic winter heating',
      'Proximity to Safdarjung airfield',
    ],
    localVulnerabilityFactor: 'Protected residential green buffer partially shields against severe spikes.',
    gridCoordinates: { x: 48, y: 72 },
  },
  {
    id: 'connaught-place',
    name: 'Connaught Place (Central Delhi)',
    zone: 'Central',
    latitude: 28.6315,
    longitude: 77.2167,
    typicalWinterAQI: 280,
    typicalWinterPM25: 185,
    typicalWinterPM10: 270,
    typicalWinterNO2: 58,
    elevationMeters: 218,
    primaryEmissionSources: [
      'Central commercial traffic',
      'Pedestrian transit',
      'Smog tower operational radius',
    ],
    localVulnerabilityFactor: 'Wide radial avenues allow moderate daytime convective air circulation.',
    gridCoordinates: { x: 55, y: 52 },
  },
  {
    id: 'rohini',
    name: 'Rohini (North Delhi)',
    zone: 'North',
    latitude: 28.7495,
    longitude: 77.0673,
    typicalWinterAQI: 415,
    typicalWinterPM25: 320,
    typicalWinterPM10: 450,
    typicalWinterNO2: 80,
    elevationMeters: 215,
    primaryEmissionSources: [
      'Punjab/Haryana stubble smoke entry corridor',
      'Construction dust from extension sectors',
      'Open ground thermal cooling',
    ],
    localVulnerabilityFactor: 'First gateway receiving agricultural biomass haze from northwest plains.',
    gridCoordinates: { x: 26, y: 16 },
  },
  {
    id: 'dwarka',
    name: 'Dwarka / IGI Airport',
    zone: 'West',
    latitude: 28.5921,
    longitude: 77.0460,
    typicalWinterAQI: 340,
    typicalWinterPM25: 240,
    typicalWinterPM10: 340,
    typicalWinterNO2: 68,
    elevationMeters: 228,
    primaryEmissionSources: [
      'Aviation jet fuel ground taxi exhaust',
      'Runway radiation fog stagnation',
      'Najafgarh drain open emissions',
    ],
    localVulnerabilityFactor: 'Open topography prone to dense radiative fog and moisture-induced aerosol swelling.',
    gridCoordinates: { x: 20, y: 65 },
  },
  {
    id: 'noida-sec62',
    name: 'Noida Sector 62 (UP Border)',
    zone: 'NCR Border',
    latitude: 28.6258,
    longitude: 77.3649,
    typicalWinterAQI: 420,
    typicalWinterPM25: 330,
    typicalWinterPM10: 460,
    typicalWinterNO2: 84,
    elevationMeters: 202,
    primaryEmissionSources: [
      'NH-24 / Delhi-Meerut Expressway traffic',
      'Construction and road dust resuspension',
      'Industrial generator exhaust',
    ],
    localVulnerabilityFactor: 'Unshielded expressway wind tunnel pushing coarse and fine particulates eastward.',
    gridCoordinates: { x: 88, y: 56 },
  },
  {
    id: 'gurugram-cybercity',
    name: 'Gurugram Cyber City (Haryana Border)',
    zone: 'NCR Border',
    latitude: 28.4949,
    longitude: 77.0895,
    typicalWinterAQI: 365,
    typicalWinterPM25: 265,
    typicalWinterPM10: 380,
    typicalWinterNO2: 74,
    elevationMeters: 232,
    primaryEmissionSources: [
      'NH-48 interstate corporate highway',
      'High-capacity diesel generator clusters',
      'Aravali foothills dust drift',
    ],
    localVulnerabilityFactor: 'Micro-valley between Aravali ridges traps evening vehicular exhaust.',
    gridCoordinates: { x: 28, y: 88 },
  },
];

export const INDIA_CITIES: IndiaCity[] = [
  // Indo-Gangetic Plain (The Epicenter)
  {
    id: 'delhi-ncr',
    name: 'Delhi NCR',
    state: 'Delhi',
    region: 'Indo-Gangetic Plain',
    latitude: 28.6139,
    longitude: 77.2090,
    typicalWinterAQI: 415,
    typicalWinterPM25: 320,
    inversionRiskTier: 'Critical',
    geographicTopography: 'Shallow river basin between Aravali ridges and Yamuna plain; severe nocturnal stagnation.',
    cleanAirWindow: {
      start: '12:30 PM',
      end: '03:15 PM',
      reason: 'Midday solar insolation creates thermal updrafts that thin the nocturnal boundary layer (<120m).',
    },
    keyPollutionDrivers: ['Vehicular emissions', 'Stubble burning smoke', 'Construction dust', 'Thermal inversion'],
    mapCoords: { x: 36, y: 28 },
  },
  {
    id: 'lucknow',
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    region: 'Indo-Gangetic Plain',
    latitude: 26.8467,
    longitude: 80.9462,
    typicalWinterAQI: 360,
    typicalWinterPM25: 270,
    inversionRiskTier: 'Severe',
    geographicTopography: 'Flat central Gangetic plain with high winter humidity and dense fog formation.',
    cleanAirWindow: {
      start: '01:00 PM',
      end: '03:30 PM',
      reason: 'Gomti basin fog lifts by midday, allowing solar convective dispersion.',
    },
    keyPollutionDrivers: ['Bio-fuel domestic burning', 'Arterial transit', 'Brick kilns in periphery'],
    mapCoords: { x: 48, y: 34 },
  },
  {
    id: 'kanpur',
    name: 'Kanpur',
    state: 'Uttar Pradesh',
    region: 'Indo-Gangetic Plain',
    latitude: 26.4499,
    longitude: 80.3319,
    typicalWinterAQI: 375,
    typicalWinterPM25: 285,
    inversionRiskTier: 'Severe',
    geographicTopography: 'Industrial hub in lower Gangetic basin with dense particulate loading.',
    cleanAirWindow: {
      start: '12:45 PM',
      end: '03:15 PM',
      reason: 'Peak solar zenith breaks ground fog ceiling.',
    },
    keyPollutionDrivers: ['Tannery and chemical combustion', 'Heavy diesel freight', 'Unpaved road dust'],
    mapCoords: { x: 46, y: 36 },
  },
  {
    id: 'patna',
    name: 'Patna',
    state: 'Bihar',
    region: 'Indo-Gangetic Plain',
    latitude: 25.5941,
    longitude: 85.1376,
    typicalWinterAQI: 385,
    typicalWinterPM25: 290,
    inversionRiskTier: 'Critical',
    geographicTopography: 'Low-lying riparian floodplain along Ganga River; acts as a downstream aerosol trap.',
    cleanAirWindow: {
      start: '01:15 PM',
      end: '03:45 PM',
      reason: 'Riverine mist burns off by early afternoon.',
    },
    keyPollutionDrivers: ['Biomass and waste burning', 'High-density unpaved dust', 'Diesel transit'],
    mapCoords: { x: 62, y: 38 },
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    region: 'Indo-Gangetic Plain',
    latitude: 25.3176,
    longitude: 82.9739,
    typicalWinterAQI: 340,
    typicalWinterPM25: 250,
    inversionRiskTier: 'Severe',
    geographicTopography: 'Dense ancient urban fabric along Ganga curved banks; narrow street canyons.',
    cleanAirWindow: {
      start: '12:30 PM',
      end: '03:00 PM',
      reason: 'Sun breaks river fog layer, restoring brief convective airflow.',
    },
    keyPollutionDrivers: ['Dense two-wheeler congestion', 'Peripheral wood burning', 'Construction activity'],
    mapCoords: { x: 54, y: 40 },
  },
  {
    id: 'ludhiana',
    name: 'Ludhiana',
    state: 'Punjab',
    region: 'Indo-Gangetic Plain',
    latitude: 30.9010,
    longitude: 75.8573,
    typicalWinterAQI: 330,
    typicalWinterPM25: 240,
    inversionRiskTier: 'Severe',
    geographicTopography: 'Northwest industrial plains close to Himalayan foothills; early winter chill trap.',
    cleanAirWindow: {
      start: '12:00 PM',
      end: '02:45 PM',
      reason: 'Short northern winter daylight window with brief solar ground warming.',
    },
    keyPollutionDrivers: ['Agricultural post-harvest residue', 'Hosiery & metal dye units', 'Diesel freight'],
    mapCoords: { x: 30, y: 18 },
  },
  {
    id: 'chandigarh',
    name: 'Chandigarh',
    state: 'Punjab / Haryana',
    region: 'Indo-Gangetic Plain',
    latitude: 30.7333,
    longitude: 76.7794,
    typicalWinterAQI: 210,
    typicalWinterPM25: 140,
    inversionRiskTier: 'Moderate',
    geographicTopography: 'Planned grid city at Shivalik foothills with high urban tree cover and broad boulevards.',
    cleanAirWindow: {
      start: '11:45 AM',
      end: '03:30 PM',
      reason: 'Wide avenues and mountain valley breezes support daytime dispersion.',
    },
    keyPollutionDrivers: ['Interstate transit traffic', 'Peripheral crop smoke', 'Cold night pooling'],
    mapCoords: { x: 34, y: 19 },
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    region: 'Indo-Gangetic Plain',
    latitude: 26.9124,
    longitude: 75.7873,
    typicalWinterAQI: 260,
    typicalWinterPM25: 175,
    inversionRiskTier: 'Moderate',
    geographicTopography: 'Semi-arid basin surrounded by Aravali hills with high ambient mineral dust.',
    cleanAirWindow: {
      start: '11:30 AM',
      end: '04:00 PM',
      reason: 'Dry desert solar radiation rapidly breaks shallow nocturnal inversion.',
    },
    keyPollutionDrivers: ['Mineral & crustal road dust', 'Vehicular congestion', 'Stone cutting units'],
    mapCoords: { x: 32, y: 34 },
  },

  // Western Corridor
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    region: 'Western',
    latitude: 19.0760,
    longitude: 72.8777,
    typicalWinterAQI: 195,
    typicalWinterPM25: 125,
    inversionRiskTier: 'Moderate',
    geographicTopography: 'Coastal peninsula with diurnal land-sea breeze system; inversion occurs when sea breeze is delayed.',
    cleanAirWindow: {
      start: '01:30 PM',
      end: '06:00 PM',
      reason: 'Afternoon sea breeze sweeps marine air across the island city, purging coastal smog.',
    },
    keyPollutionDrivers: ['Heavy construction activity', 'Refineries & port traffic', 'Vehicular tailpipe exhaust'],
    mapCoords: { x: 26, y: 58 },
  },
  {
    id: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    region: 'Western',
    latitude: 18.5204,
    longitude: 73.8567,
    typicalWinterAQI: 180,
    typicalWinterPM25: 110,
    inversionRiskTier: 'Moderate',
    geographicTopography: 'Deccan plateau valley at 560m elevation surrounded by Sahyadri hills; winter morning cold trap.',
    cleanAirWindow: {
      start: '11:00 AM',
      end: '04:30 PM',
      reason: 'High plateau solar exposure drives rapid vertical mixing.',
    },
    keyPollutionDrivers: ['Mass two-wheeler transit', 'Construction and quarry dust', 'Industrial periphery'],
    mapCoords: { x: 30, y: 62 },
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    state: 'Gujarat',
    region: 'Western',
    latitude: 23.0225,
    longitude: 72.5714,
    typicalWinterAQI: 245,
    typicalWinterPM25: 160,
    inversionRiskTier: 'Moderate',
    geographicTopography: 'Sabarmati plains with dry winter stagnation and industrial manufacturing belts.',
    cleanAirWindow: {
      start: '11:30 AM',
      end: '03:45 PM',
      reason: 'High daytime solar warmth dispels surface cooling lid.',
    },
    keyPollutionDrivers: ['Textile and chemical industrial clusters', 'Vehicular exhaust', 'Construction dust'],
    mapCoords: { x: 24, y: 44 },
  },

  // Southern Tech Hubs
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    region: 'Southern',
    latitude: 12.9716,
    longitude: 77.5946,
    typicalWinterAQI: 95,
    typicalWinterPM25: 48,
    inversionRiskTier: 'Low',
    geographicTopography: 'High altitude Deccan plateau at 920m elevation; strong wind shear and moderate temperatures prevent severe inversions.',
    cleanAirWindow: {
      start: '10:00 AM',
      end: '05:00 PM',
      reason: 'Elevated topography allows continuous air circulation throughout daylight hours.',
    },
    keyPollutionDrivers: ['Traffic congestion corridors (Silk Board, Outer Ring Road)', 'Construction dust', 'Garbage burning in suburbs'],
    mapCoords: { x: 38, y: 78 },
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    region: 'Southern',
    latitude: 17.3850,
    longitude: 78.4867,
    typicalWinterAQI: 145,
    typicalWinterPM25: 85,
    inversionRiskTier: 'Moderate',
    geographicTopography: 'Granitic plateau at 540m altitude with undulating terrain; morning temperature dips create shallow inversions.',
    cleanAirWindow: {
      start: '10:30 AM',
      end: '04:30 PM',
      reason: 'Dry plateau warmth clears morning haze by late morning.',
    },
    keyPollutionDrivers: ['IT corridor peak vehicular rush', 'Industrial estates (Balanagar, Patancheru)', 'Biomass burning'],
    mapCoords: { x: 42, y: 64 },
  },
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    region: 'Southern',
    latitude: 13.0827,
    longitude: 80.2707,
    typicalWinterAQI: 110,
    typicalWinterPM25: 60,
    inversionRiskTier: 'Low',
    geographicTopography: 'Coastal plain along Bay of Bengal; maritime air exchange keeps boundary layer mixed.',
    cleanAirWindow: {
      start: '11:00 AM',
      end: '05:30 PM',
      reason: 'Bay of Bengal sea breeze displaces urban vehicle plumes toward the hinterland.',
    },
    keyPollutionDrivers: ['Heavy vehicular traffic (Mount Road)', 'Ennore thermal power clusters', 'Port freight emissions'],
    mapCoords: { x: 46, y: 76 },
  },

  // Eastern & Central
  {
    id: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    region: 'Eastern & Central',
    latitude: 22.5726,
    longitude: 88.3639,
    typicalWinterAQI: 295,
    typicalWinterPM25: 210,
    inversionRiskTier: 'Severe',
    geographicTopography: 'Lower delta plain along Hooghly River; high winter humidity traps diesel taxi exhaust in low boundary layers.',
    cleanAirWindow: {
      start: '12:15 PM',
      end: '03:30 PM',
      reason: 'Delta mist thins by noon under direct solar heating.',
    },
    keyPollutionDrivers: ['Aging diesel taxi and commercial fleet', 'Coal and wood street-food chulhas', 'Peripheral industrial units'],
    mapCoords: { x: 72, y: 46 },
  },
  {
    id: 'bhopal',
    name: 'Bhopal',
    state: 'Madhya Pradesh',
    region: 'Eastern & Central',
    latitude: 23.2599,
    longitude: 77.4126,
    typicalWinterAQI: 215,
    typicalWinterPM25: 145,
    inversionRiskTier: 'Moderate',
    geographicTopography: 'Hilly terrain in central Malwa plateau with upper and lower lake micro-climates.',
    cleanAirWindow: {
      start: '11:00 AM',
      end: '04:00 PM',
      reason: 'Lake breeze and plateau sunlight promote vertical convective mixing.',
    },
    keyPollutionDrivers: ['Commercial transit corridors', 'Industrial estates (Govindpura)', 'Construction dust'],
    mapCoords: { x: 39, y: 46 },
  },
];

/**
 * Filters Indian cities by region.
 */
export function getIndiaCitiesByRegion(region: string): IndiaCity[] {
  if (region === 'All') return INDIA_CITIES;
  return INDIA_CITIES.filter(c => c.region === region);
}

/**
 * Retrieves a Delhi micro-station by ID.
 */
export function getDelhiStationById(id: string): DelhiMicroStation | undefined {
  return DELHI_MICRO_STATIONS.find(s => s.id === id);
}

/**
 * Retrieves an Indian city by ID.
 */
export function getIndiaCityById(id: string): IndiaCity | undefined {
  return INDIA_CITIES.find(c => c.id === id);
}
