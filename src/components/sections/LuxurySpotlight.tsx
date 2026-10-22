import React from 'react';
import { ArrowUpRight, Bed, Bath, Maximize2, MapPin, Sparkles, MessageCircle } from 'lucide-react';
import { Property } from '../../types/property';
import { ResilientImage } from '../ui/ResilientImage';
import { siteConfig } from '../../data/config';

interface LuxurySpotlightProps {
  property: Property;
  onSelectProperty: (property: Property) => void;
  onEnquire: (property: Property) => void;
}

export const LuxurySpotlight: React.FC<LuxurySpotlightProps> = ({
  property,
  onSelectProperty,
  onEnquire
}) => {
  return (
    <section className="py-24 bg-[#F7F5EF] text-[#202B25] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#202B25] text-white rounded-2xl overflow-hidden border border-[#E7DCC7]/20 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left Content / Editorial Story */}
            <div className="lg:col-span-5 p-4 xs:p-6 sm:p-10 lg:p-16 flex flex-col justify-between min-w-0 max-w-full">
              <div>
                <div className="inline-flex items-center gap-2 mb-4 text-[#B69A70]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-xs uppercase tracking-[0.2em] font-mono font-semibold">
                    ESTATE SPOTLIGHT
                  </span>
                </div>

                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-white tracking-tight leading-tight mb-4 [text-wrap:balance] break-words">
                  Designed for the Way You Want to Live.
                </h2>

                <p className="text-sm sm:text-base text-[#E7DCC7]/80 leading-relaxed mb-6 sm:mb-8 break-words">
                  {property.description}
                </p>

                {/* Specs Box */}
                <div className="border-y border-[#E7DCC7]/15 py-3 sm:py-6 my-4 sm:my-6 grid grid-cols-3 gap-1 sm:gap-4 text-center min-w-0">
                  <div className="min-w-0">
                    <span className="text-lg xs:text-xl sm:text-2xl font-serif text-white block truncate">
                      {property.specs.bedrooms}
                    </span>
                    <span className="text-[9px] xs:text-[10px] sm:text-[11px] font-mono text-[#E7DCC7]/70 uppercase tracking-wider block truncate">
                      Bedrooms
                    </span>
                  </div>
                  <div className="border-x border-[#E7DCC7]/15 min-w-0 px-1">
                    <span className="text-lg xs:text-xl sm:text-2xl font-serif text-white block truncate">
                      {property.specs.bathrooms}
                    </span>
                    <span className="text-[9px] xs:text-[10px] sm:text-[11px] font-mono text-[#E7DCC7]/70 uppercase tracking-wider block truncate">
                      Bathrooms
                    </span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-lg xs:text-xl sm:text-2xl font-serif text-white block truncate">
                      {property.specs.builtUpAreaSqFt?.toLocaleString()}
                    </span>
                    <span className="text-[9px] xs:text-[10px] sm:text-[11px] font-mono text-[#E7DCC7]/70 uppercase tracking-wider block truncate">
                      Sq.Ft Built
                    </span>
                  </div>
                </div>

                {/* Location & Pricing */}
                <div className="space-y-1 mb-6 sm:mb-8">
                  <div className="flex items-center gap-1.5 text-xs text-[#E7DCC7]/80">
                    <MapPin className="w-3.5 h-3.5 text-[#B69A70]" />
                    <span>{property.location.neighborhood}, {property.location.city}</span>
                  </div>
                  <p className="text-2xl sm:text-3xl font-serif font-bold text-[#B69A70]">
                    {property.priceDisplay}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4 border-t border-[#E7DCC7]/15">
                <button
                  onClick={() => onSelectProperty(property)}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#B69A70] hover:bg-[#E7DCC7] text-[#172720] text-xs uppercase tracking-widest font-bold rounded transition-colors inline-flex items-center justify-center gap-2"
                >
                  <span>View Estate Details</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <a
                  href={siteConfig.buildPropertyWhatsAppUrl(property.title, property.refCode)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-3.5 bg-[#172720] hover:bg-black/60 text-white border border-[#E7DCC7]/30 text-xs uppercase tracking-widest font-medium rounded transition-colors inline-flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>WhatsApp Enquiry</span>
                </a>
              </div>
            </div>

            {/* Right Architectural Image */}
            <div className="lg:col-span-7 relative min-h-[260px] sm:min-h-[380px] lg:min-h-full">
              <ResilientImage
                src="/assets/images/featured_villa_estate_1792478314692.jpg"
                alt={property.title}
                className="w-full h-full object-cover"
                containerClassName="h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden" />
              <div className="absolute bottom-4 right-4 z-10 bg-[#172720]/80 backdrop-blur-md px-3 py-1.5 rounded text-xs font-mono text-[#E7DCC7] border border-[#E7DCC7]/20">
                {property.refCode} · {property.categoryLabel}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
