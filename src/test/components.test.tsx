import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '../components/Header';
import { IAQLab } from '../components/IAQLab';

describe('BreatheWise UI Components & Accessibility', () => {
  const mockMetrics = {
    aqi: 320,
    category: 'Hazardous' as const,
    pm25: 280,
    pm10: 420,
    no2: 85,
    o3: 32,
    so2: 24,
    co: 1900,
    temperature: 12.5,
    humidity: 78,
    windSpeed: 3.2,
    windDirection: 280,
    timestamp: '09:00 AM',
    locationName: 'New Delhi (NCR)',
    latitude: 28.6139,
    longitude: 77.209,
  };

  it('renders Header with accessible status, location, and emergency toggle', () => {
    render(
      <Header
        metrics={mockMetrics}
        emergencyMode={false}
        onToggleEmergency={() => {}}
        onOpenProfile={() => {}}
        onOpenSettings={() => {}}
        onSelectLocation={() => {}}
        vulnerabilityScore={3.8}
        hasCustomKey={false}
      />
    );

    expect(screen.getByText(/BreatheWise/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Select location/i)).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders IAQLab with Corsi-Rosenthal Box and DIY blueprints', () => {
    render(<IAQLab onOpenCopilot={() => {}} />);

    expect(screen.getByText(/Low-Cost Indoor Air Quality/i)).toBeInTheDocument();
    expect(screen.getByText(/The Corsi-Rosenthal Box/i)).toBeInTheDocument();
    expect(screen.getByText(/Zero-Draft Winter Window/i)).toBeInTheDocument();
  });
});
