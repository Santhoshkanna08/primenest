import React from 'react';
import { Hero } from '../components/hero/Hero';
import { TrustStrip } from '../components/sections/TrustStrip';
import { FeaturedShowcase } from '../components/sections/FeaturedShowcase';
import { PlottedDevelopments } from '../components/sections/PlottedDevelopments';
import { LuxurySpotlight } from '../components/sections/LuxurySpotlight';
import { WhyPrimeNest } from '../components/sections/WhyPrimeNest';
import { HowItWorks } from '../components/sections/HowItWorks';
import { OurApproach } from '../components/sections/OurApproach';
import { Property, SearchFilters } from '../types/property';

interface HomePageProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onSearch: (filters: SearchFilters) => void;
  onNavigate: (route: string) => void;
  onExploreLandProjects: () => void;
  onOpenEnquiry: (property?: Property) => void;
  onScheduleSiteVisit: (property: Property) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  properties,
  onSelectProperty,
  onSearch,
  onNavigate,
  onExploreLandProjects,
  onOpenEnquiry,
  onScheduleSiteVisit,
  isFavorite,
  onToggleFavorite
}) => {
  const plotsProperty = properties.find((p) => p.category === 'residential_plot') || properties[1];
  const spotlightProperty = properties.find((p) => p.id === 'pn-308-cypress-travertine') || properties[2];

  return (
    <div className="w-full">
      {/* 1. Cinematic Hero Section with Asset 2 Luxury Villa Video Background */}
      <Hero
        onSearch={onSearch}
        onExploreClick={() => onNavigate('/properties')}
        onProjectsClick={() => onNavigate('/residential-plots')}
      />

      {/* 2. Trust and Value Strip */}
      <TrustStrip />

      {/* 3. Featured Properties — Editorial Showcase */}
      <FeaturedShowcase
        properties={properties}
        onSelectProperty={onSelectProperty}
        onExploreAll={() => onNavigate('/properties')}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
      />

      {/* 4. Residential Plots and Land Investments with Asset 1 Video */}
      <PlottedDevelopments
        plotsProperty={plotsProperty}
        onSelectProperty={onSelectProperty}
        onExploreLand={onExploreLandProjects}
        onScheduleSiteVisit={onScheduleSiteVisit}
      />

      {/* 5. Featured Luxury Property Spotlight */}
      <LuxurySpotlight
        property={spotlightProperty}
        onSelectProperty={onSelectProperty}
        onEnquire={onOpenEnquiry}
      />

      {/* 6. Why PrimeNest Brand Story */}
      <WhyPrimeNest />

      {/* 7. How It Works (Four-Step Process) */}
      <HowItWorks
        onStartSearch={() => onNavigate('/properties')}
        onOpenEnquiry={() => onOpenEnquiry()}
      />

      {/* 8. The PrimeNest Advisory Standard */}
      <OurApproach
        onOpenConsultation={() => onOpenEnquiry()}
      />
    </div>
  );
};
