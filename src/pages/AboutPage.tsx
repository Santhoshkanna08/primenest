import React from 'react';
import { Compass, Sparkles, Shield, ArrowRight, Check } from 'lucide-react';
import { ResilientImage } from '../components/ui/ResilientImage';
import { siteConfig } from '../data/config';

interface AboutPageProps {
  onOpenEnquiry: () => void;
  onNavigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenEnquiry, onNavigate }) => {
  return (
    <div className="pt-24 sm:pt-28 pb-24 bg-[#F7F5EF] min-h-screen text-[#202B25]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 mb-2 text-[#B69A70]">
            <Compass className="w-3.5 h-3.5" />
            <span className="text-xs uppercase tracking-[0.25em] font-mono font-semibold">
              ABOUT PRIMENEST PROPERTIES
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#172720] tracking-tight [text-wrap:balance]">
            Dedicated to Spaces of Enduring Architectural Character.
          </h1>
          <p className="text-base sm:text-lg text-[#777B75] mt-4 leading-relaxed">
            PrimeNest Properties was established on a single foundational belief: purchasing land or commissioning an architectural residence is an intimate, generational decision that demands absolute clarity, discernment, and care.
          </p>
        </div>

        {/* Narrative Split with Photography */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-24">
          <div className="lg:col-span-6 space-y-6 text-[#777B75] leading-relaxed text-sm sm:text-base">
            <h2 className="text-2xl sm:text-3xl font-serif text-[#172720]">
              Our Philosophy: Selective Curation Over Volume
            </h2>
            <p>
              Rather than attempting to list every available tract of real estate on the open market, PrimeNest operates as an intentional, boutique property advisory. We represent only those properties that exhibit superior architectural design, strategic site topography, and verifiable legal clarity.
            </p>
            <p>
              Whether you are an individual searching for a panoramic coastal plot on which to build an architect-designed home, or an investor acquiring a master-planned parcel with established infrastructure, our team provides unvarnished data and personal stewardship.
            </p>

            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-3 text-[#172720] font-semibold text-sm">
                <Check className="w-4 h-4 text-[#B69A70]" />
                <span>Rigorous title and boundary verification before every listing</span>
              </div>
              <div className="flex items-center gap-3 text-[#172720] font-semibold text-sm">
                <Check className="w-4 h-4 text-[#B69A70]" />
                <span>Zero fabricated metrics, claims, or artificial sales pressure</span>
              </div>
              <div className="flex items-center gap-3 text-[#172720] font-semibold text-sm">
                <Check className="w-4 h-4 text-[#B69A70]" />
                <span>Direct coordination of private, unhurried on-site inspections</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-[#E7DCC7] shadow-xl">
              <ResilientImage
                src="/assets/images/featured_villa_estate_1792478314692.jpg"
                alt="PrimeNest Architectural Excellence"
                className="w-full h-full object-cover"
                containerClassName="h-full"
              />
            </div>
          </div>
        </div>

        {/* Categories Served Section */}
        <div className="mb-24 bg-white p-8 sm:p-12 rounded-xl border border-[#E7DCC7] shadow-sm">
          <div className="max-w-2xl mb-10">
            <span className="text-xs uppercase font-mono tracking-widest text-[#B69A70]">
              CORE FOCUS AREAS
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif text-[#172720] mt-1">
              Property Categories We Represent
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-[#F7F5EF] rounded-lg border border-[#E7DCC7]/60 space-y-3">
              <span className="text-xs font-mono uppercase text-[#B69A70] tracking-wider block">
                01 · LAND & PARCELS
              </span>
              <h4 className="text-lg font-serif font-bold text-[#172720]">
                Residential Plots & Master Plans
              </h4>
              <p className="text-xs text-[#777B75] leading-relaxed">
                Clear-title residential parcels within master-planned enclaves with wide avenues, underground electrical conduits, potable water lines, and strict design guidelines.
              </p>
            </div>

            <div className="p-6 bg-[#F7F5EF] rounded-lg border border-[#E7DCC7]/60 space-y-3">
              <span className="text-xs font-mono uppercase text-[#B69A70] tracking-wider block">
                02 · ARCHITECTURE
              </span>
              <h4 className="text-lg font-serif font-bold text-[#172720]">
                Luxury Villas & Private Estates
              </h4>
              <p className="text-xs text-[#777B75] leading-relaxed">
                Bespoke contemporary residences designed with natural stone, board-formed concrete, reflection pools, and panoramic landscape orientations.
              </p>
            </div>

            <div className="p-6 bg-[#F7F5EF] rounded-lg border border-[#E7DCC7]/60 space-y-3">
              <span className="text-xs font-mono uppercase text-[#B69A70] tracking-wider block">
                03 · CAPITAL STRATEGY
              </span>
              <h4 className="text-lg font-serif font-bold text-[#172720]">
                Strategic Land Holdings
              </h4>
              <p className="text-xs text-[#777B75] leading-relaxed">
                Generational acreages, coastal parcels, and high-appreciation development corridors evaluated for long-term wealth preservation.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-[#172720] text-white p-8 sm:p-12 rounded-xl text-center space-y-6">
          <h3 className="text-2xl sm:text-3xl font-serif text-white max-w-xl mx-auto">
            Ready to Discuss Your Property Aspirations?
          </h3>
          <p className="text-xs sm:text-sm text-[#E7DCC7]/80 max-w-lg mx-auto">
            Our advisory desk is prepared to provide unlisted dossier access, topography surveys, and private ground tours.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onOpenEnquiry}
              className="px-8 py-3.5 bg-[#B69A70] hover:bg-[#E7DCC7] text-[#172720] text-xs uppercase tracking-widest font-bold rounded transition-colors"
            >
              Contact Our Advisors
            </button>
            <button
              onClick={() => onNavigate('/properties')}
              className="px-7 py-3.5 bg-transparent hover:bg-white/10 text-white border border-[#E7DCC7]/40 text-xs uppercase tracking-widest font-semibold rounded transition-colors"
            >
              Browse Active Listings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
