import React from 'react';
import { Compass, Trees, Car, Zap, Shield, ArrowRight, Calendar, CheckCircle2 } from 'lucide-react';
import { Property } from '../types/property';
import { PropertyCard } from '../components/property/PropertyCard';
import { ResilientImage } from '../components/ui/ResilientImage';

interface PlotsPageProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onScheduleSiteVisit: (property: Property) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

export const PlotsPage: React.FC<PlotsPageProps> = ({
  properties,
  onSelectProperty,
  onScheduleSiteVisit,
  isFavorite,
  onToggleFavorite
}) => {
  const plotsAndLand = properties.filter(
    (p) => p.category === 'residential_plot' || p.category === 'land_investment'
  );

  const flagshipPlot = plotsAndLand[0];

  const [activeMediaTab, setActiveMediaTab] = React.useState<'aerial' | 'video'>('video');

  return (
    <div className="pt-24 sm:pt-28 pb-24 bg-[#F7F5EF] min-h-screen text-[#202B25]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Land Header */}
        <div className="mb-10 sm:mb-14 max-w-3xl">
          <div className="inline-flex items-center gap-2 mb-2 text-[#B69A70]">
            <Compass className="w-3.5 h-3.5" />
            <span className="text-xs uppercase tracking-[0.25em] font-mono font-semibold">
              ACQUISITIONS & LAND RESERVES
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#172720] tracking-tight">
            Residential Plots & Strategic Land
          </h1>
          <p className="text-sm sm:text-base text-[#777B75] mt-3 leading-relaxed">
            Acquire pristine land parcels, master-planned gated plots, and legacy coastal acreages vetted for unencumbered ownership, infrastructure readiness, and long-term capital preservation.
          </p>
        </div>

        {/* Master Aerial Feature Section */}
        {flagshipPlot && (
          <div className="mb-16 bg-[#172720] text-white rounded-2xl overflow-hidden border border-[#B69A70]/30 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10] overflow-hidden bg-[#172720] flex items-center justify-center">
                {activeMediaTab === 'video' ? (
                  <div className="w-full h-full relative flex items-center justify-center overflow-hidden bg-black/60">
                    {/* Ambient cinematic backdrop */}
                    <img
                      src="/assets/videos/residential-plots-poster.jpg"
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover filter blur-xl opacity-35 scale-110 pointer-events-none"
                    />
                    <video
                      src="/assets/videos/residential-plots-development.mp4"
                      poster="/assets/videos/residential-plots-poster.jpg"
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="relative z-10 max-h-[96%] aspect-[9/16] object-cover rounded-md shadow-2xl border border-[#B69A70]/40"
                    />
                  </div>
                ) : (
                  <ResilientImage
                    src={flagshipPlot.images[0]?.url}
                    alt={flagshipPlot.title}
                    className="w-full h-full object-cover"
                    containerClassName="h-full w-full"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                
                {/* View Switcher Controls */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#172720]/90 backdrop-blur-md p-1 rounded border border-[#B69A70]/30">
                  <button
                    type="button"
                    onClick={() => setActiveMediaTab('video')}
                    className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                      activeMediaTab === 'video'
                        ? 'bg-[#B69A70] text-[#172720] font-semibold'
                        : 'text-[#E7DCC7] hover:text-white'
                    }`}
                  >
                    ▶ Field Video
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveMediaTab('aerial')}
                    className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                      activeMediaTab === 'aerial'
                        ? 'bg-[#B69A70] text-[#172720] font-semibold'
                        : 'text-[#E7DCC7] hover:text-white'
                    }`}
                  >
                    Aerial Survey
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 p-8 sm:p-10 space-y-6">
                <div>
                  <span className="text-xs font-mono text-[#B69A70] uppercase tracking-wider">
                    {flagshipPlot.refCode} · {flagshipPlot.location.city}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif text-white mt-1">
                    {flagshipPlot.title}
                  </h2>
                  <p className="text-2xl font-serif font-bold text-[#B69A70] mt-2">
                    {flagshipPlot.priceDisplay}
                  </p>
                  <p className="text-xs sm:text-sm text-[#E7DCC7]/80 mt-3 leading-relaxed">
                    {flagshipPlot.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs border-y border-[#E7DCC7]/15 py-4">
                  <div>
                    <span className="text-[#777B75] block font-mono">Plot Extent</span>
                    <strong className="text-white font-serif text-sm">
                      {flagshipPlot.specs.plotSizeSqFt?.toLocaleString()} sq.ft
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#777B75] block font-mono">Road Width</span>
                    <strong className="text-white font-serif text-sm">
                      {flagshipPlot.specs.roadWidthFt || 60} Ft Arterial
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#777B75] block font-mono">Utilities</span>
                    <strong className="text-white font-serif text-sm">
                      100% Underground
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#777B75] block font-mono">Title</span>
                    <strong className="text-[#25D366] font-serif text-sm">
                      Freehold Registered
                    </strong>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => onSelectProperty(flagshipPlot)}
                    className="px-6 py-3 bg-[#B69A70] hover:bg-[#E7DCC7] text-[#172720] text-xs uppercase tracking-widest font-bold rounded transition-colors"
                  >
                    View Plot Dossier
                  </button>
                  <button
                    onClick={() => onScheduleSiteVisit(flagshipPlot)}
                    className="px-5 py-3 bg-transparent hover:bg-white/10 text-white border border-[#E7DCC7]/30 text-xs uppercase tracking-widest font-medium rounded transition-colors flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-[#B69A70]" />
                    <span>Arrange Site Visit</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Land Parcels & Plots Grid */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-serif text-[#172720]">
              Available Land & Plot Holdings
            </h3>
            <span className="text-xs font-mono text-[#777B75]">
              {plotsAndLand.length} Verified Parcels
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plotsAndLand.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                onSelect={onSelectProperty}
                isFavorite={isFavorite(prop.id)}
                onToggleFavorite={onToggleFavorite}
                aspect="standard"
              />
            ))}
          </div>
        </div>

        {/* Land Standards Advisory Strip */}
        <div className="mt-16 bg-white p-8 sm:p-10 rounded-xl border border-[#E7DCC7] shadow-sm">
          <h3 className="text-xl font-serif text-[#172720] mb-4">
            Our Residential Land Verification Checklist
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#777B75]">
            <div className="space-y-2">
              <strong className="text-sm font-semibold text-[#172720] block">
                Topographical & Soil Studies
              </strong>
              <p className="leading-relaxed">
                Slope elevation surveys, percolation test reports, and foundation feasibility are validated prior to marketing.
              </p>
            </div>
            <div className="space-y-2">
              <strong className="text-sm font-semibold text-[#172720] block">
                Zoning & Construction Clearances
              </strong>
              <p className="leading-relaxed">
                Floor-area ratios (FAR), setback limits, and architectural covenant rules are provided upfront in every plot dossier.
              </p>
            </div>
            <div className="space-y-2">
              <strong className="text-sm font-semibold text-[#172720] block">
                Guaranteed Access Rights
              </strong>
              <p className="leading-relaxed">
                Permanent legal right-of-way, paved road deed easements, and dedicated utility corridors are guaranteed with zero dispute risk.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
