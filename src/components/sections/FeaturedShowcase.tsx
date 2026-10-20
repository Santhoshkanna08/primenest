import React from 'react';
import { ArrowRight, Sparkles, MapPin, Bed, Bath, Maximize2 } from 'lucide-react';
import { Property } from '../../types/property';
import { PropertyCard } from '../property/PropertyCard';
import { ResilientImage } from '../ui/ResilientImage';

interface FeaturedShowcaseProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onExploreAll: () => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

export const FeaturedShowcase: React.FC<FeaturedShowcaseProps> = ({
  properties,
  onSelectProperty,
  onExploreAll,
  isFavorite,
  onToggleFavorite
}) => {
  // Select marquee property and 2 complementary properties
  const marquee = properties.find((p) => p.id === 'pn-104-obsidian-horizon') || properties[0];
  const sideProperties = properties.filter((p) => p.id !== marquee.id).slice(0, 2);

  return (
    <section className="py-24 bg-[#F7F5EF] text-[#202B25]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 text-[#B69A70]">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-xs uppercase tracking-[0.2em] font-mono font-semibold">
                CURATED SELECTION
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#172720] tracking-tight">
              Spaces That Inspire.
            </h2>
            <p className="text-sm sm:text-base text-[#777B75] mt-2 max-w-xl">
              Explore properties chosen for their character, location, and potential.
            </p>
          </div>

          <button
            onClick={onExploreAll}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#172720] hover:text-[#B69A70] transition-colors group shrink-0"
          >
            <span>View All Listings</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Asymmetrical Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Marquee Large Property Card (col-span-7) */}
          <div
            onClick={() => onSelectProperty(marquee)}
            className="lg:col-span-7 group cursor-pointer bg-white rounded-lg overflow-hidden border border-[#E7DCC7]/50 shadow-sm hover:shadow-2xl hover:border-[#B69A70] transition-all duration-300 flex flex-col justify-between"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-[#202B25]">
              <ResilientImage
                src={marquee.images[0]?.url}
                alt={marquee.title}
                className="group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <span className="text-xs font-mono tracking-widest text-white uppercase bg-[#172720]/80 backdrop-blur-md px-3 py-1 rounded">
                  {marquee.categoryLabel}
                </span>
                <span className="text-xs font-mono text-[#E7DCC7] bg-[#B69A70]/30 backdrop-blur-md px-2.5 py-1 rounded">
                  MARQUEE RESIDENCE
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between text-white">
                <div>
                  <span className="text-xs font-mono text-[#E7DCC7] tracking-wider block mb-1">
                    {marquee.refCode} · {marquee.location.neighborhood}
                  </span>
                  <p className="text-2xl sm:text-3xl font-serif font-bold text-white">
                    {marquee.priceDisplay}
                  </p>
                </div>
                <span className="text-xs font-mono text-[#E7DCC7]/80">
                  {marquee.specs.builtUpAreaSqFt?.toLocaleString()} sq.ft
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow bg-white">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#777B75] mb-2">
                  <MapPin className="w-3.5 h-3.5 text-[#B69A70]" />
                  <span>{marquee.location.city}, {marquee.location.state}</span>
                </div>
                <h3 className="text-2xl font-serif text-[#172720] group-hover:text-[#B69A70] transition-colors mb-3">
                  {marquee.title}
                </h3>
                <p className="text-sm text-[#777B75] leading-relaxed mb-6">
                  {marquee.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E7DCC7]/40 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-xs font-mono text-[#777B75]">
                  <span className="flex items-center gap-1.5">
                    <Bed className="w-4 h-4 text-[#B69A70]" />
                    <span>{marquee.specs.bedrooms} Bedrooms</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5">
                    <Bath className="w-4 h-4 text-[#B69A70]" />
                    <span>{marquee.specs.bathrooms} Bathrooms</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5">
                    <Maximize2 className="w-4 h-4 text-[#B69A70]" />
                    <span>{marquee.specs.plotSizeSqFt?.toLocaleString()} sq.ft Lot</span>
                  </span>
                </div>

                <span className="text-xs uppercase font-bold tracking-widest text-[#172720] group-hover:text-[#B69A70] transition-colors inline-flex items-center gap-1.5">
                  <span>Explore Residence</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </div>

          {/* Two Complementary Cards (col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {sideProperties.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                onSelect={onSelectProperty}
                isFavorite={isFavorite(prop.id)}
                onToggleFavorite={onToggleFavorite}
                aspect="wide"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
