import { describe, it, expect } from 'vitest';
import { 
  DELHI_MICRO_STATIONS, 
  INDIA_CITIES, 
  getIndiaCitiesByRegion, 
  getDelhiStationById, 
  getIndiaCityById 
} from '../data/indiaAirData';

describe('India Air Data & Delhi Micro-Hotspots Engine', () => {
  it('contains 10 valid Delhi NCR micro-stations with geographic and emission profiles', () => {
    expect(DELHI_MICRO_STATIONS.length).toBe(10);

    DELHI_MICRO_STATIONS.forEach((station) => {
      expect(station.id).toBeDefined();
      expect(station.name).toBeDefined();
      expect(station.latitude).toBeGreaterThan(28.0);
      expect(station.latitude).toBeLessThan(29.0);
      expect(station.longitude).toBeGreaterThan(76.5);
      expect(station.longitude).toBeLessThan(77.6);
      expect(station.typicalWinterAQI).toBeGreaterThan(200);
      expect(station.primaryEmissionSources.length).toBeGreaterThanOrEqual(2);
      expect(station.gridCoordinates.x).toBeGreaterThanOrEqual(0);
      expect(station.gridCoordinates.x).toBeLessThanOrEqual(100);
    });
  });

  it('correctly identifies Anand Vihar as the highest pollution hotspot in Delhi', () => {
    const anandVihar = getDelhiStationById('anand-vihar');
    expect(anandVihar).toBeDefined();
    expect(anandVihar?.typicalWinterAQI).toBeGreaterThanOrEqual(450);
    expect(anandVihar?.primaryEmissionSources).toContain('Interstate Diesel Bus Terminal (ISBT)');
  });

  it('contains comprehensive All-India cities covering all major geographic regions', () => {
    expect(INDIA_CITIES.length).toBeGreaterThanOrEqual(16);

    const regions = new Set(INDIA_CITIES.map(c => c.region));
    expect(regions.has('Indo-Gangetic Plain')).toBe(true);
    expect(regions.has('Western')).toBe(true);
    expect(regions.has('Southern')).toBe(true);
    expect(regions.has('Eastern & Central')).toBe(true);

    INDIA_CITIES.forEach((city) => {
      expect(city.id).toBeDefined();
      expect(city.latitude).toBeGreaterThan(8.0); // India southern tip ~8°N
      expect(city.latitude).toBeLessThan(35.0); // India northern boundary
      expect(city.cleanAirWindow.start).toBeDefined();
      expect(city.cleanAirWindow.end).toBeDefined();
    });
  });

  it('filters cities by regional zones accurately', () => {
    const igpCities = getIndiaCitiesByRegion('Indo-Gangetic Plain');
    expect(igpCities.length).toBeGreaterThanOrEqual(6);
    expect(igpCities.some(c => c.name === 'Delhi NCR')).toBe(true);
    expect(igpCities.some(c => c.name === 'Patna')).toBe(true);

    const southernCities = getIndiaCitiesByRegion('Southern');
    expect(southernCities.some(c => c.name === 'Bengaluru')).toBe(true);
    expect(southernCities.some(c => c.name === 'Chennai')).toBe(true);

    const allCities = getIndiaCitiesByRegion('All');
    expect(allCities.length).toBe(INDIA_CITIES.length);
  });

  it('retrieves specific city by ID correctly', () => {
    const mumbai = getIndiaCityById('mumbai');
    expect(mumbai).toBeDefined();
    expect(mumbai?.state).toBe('Maharashtra');
    expect(mumbai?.geographicTopography).toContain('Coastal');
  });
});
