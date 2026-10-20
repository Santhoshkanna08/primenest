import React from 'react';
import { Bookmark, ArrowUpRight, Bed, Bath, Maximize2, MapPin } from 'lucide-react';
import { Property } from '../../types/property';
import { ResilientImage } from '../ui/ResilientImage';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string, e: React.MouseEvent) => void;
  aspect?: 'wide' | 'standard' | 'portrait';
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  isFavorite = false,
  onToggleFavorite,
  aspect = 'standard'
}) => {
  const coverImage = property.images[0]?.url || '';

  const aspectClass =
    aspect === 'wide'
      ? 'aspect-[16/10]'
      : aspect === 'portrait'
      ? 'aspect-[3/4]'
      : 'aspect-[4/3]';

  return (
    <article
      onClick={() => onSelect(property)}
      className="group cursor-pointer bg-white rounded-lg overflow-hidden border border-[#E7DCC7]/40 shadow-sm hover:shadow-xl hover:border-[#B69A70]/60 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Visual Asset Container */}
      <div className={`relative w-full ${aspectClass} overflow-hidden bg-[#202B25]`}>
        <ResilientImage
          src={coverImage}
          alt={property.title}
          fallbackTitle={property.title}
          className="group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Gradient Scrim for subtle contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Floating Controls */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          {/* Subtle text label (NO PILLS) */}
          <span className="text-[11px] font-mono tracking-widest text-white/95 uppercase bg-[#172720]/80 backdrop-blur-md px-2.5 py-1 rounded">
            {property.categoryLabel}
          </span>

          {/* Favorite Bookmark Button */}
          {onToggleFavorite && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(property.id, e);
              }}
              aria-label={isFavorite ? 'Remove from saved' : 'Save property'}
              className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                isFavorite
                  ? 'bg-[#B69A70] text-[#172720]'
                  : 'bg-black/40 text-white hover:text-[#B69A70]'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        {/* Bottom overlay: Price */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-end justify-between text-white">
          <div>
            <p className="text-xl font-serif font-semibold tracking-tight text-white drop-shadow-md">
              {property.priceDisplay}
            </p>
            {property.pricePerSqFt && (
              <span className="text-[11px] text-[#E7DCC7]/80 font-mono">
                {property.pricePerSqFt}
              </span>
            )}
          </div>
          <span className="text-xs text-[#E7DCC7]/90 font-mono tracking-wider">
            {property.refCode}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col justify-between flex-grow">
        <div>
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-[#777B75] mb-2">
            <MapPin className="w-3.5 h-3.5 text-[#B69A70] shrink-0" />
            <span className="truncate">{property.location.neighborhood}, {property.location.city}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-serif font-semibold text-[#172720] group-hover:text-[#B69A70] transition-colors leading-snug mb-2 line-clamp-1">
            {property.title}
          </h3>

          {/* Subtitle / summary */}
          <p className="text-xs text-[#777B75] leading-relaxed line-clamp-2 mb-4">
            {property.subtitle}
          </p>
        </div>

        {/* Specifications Strip & View CTA */}
        <div className="pt-3 border-t border-[#E7DCC7]/40 flex items-center justify-between text-xs text-[#202B25]">
          <div className="flex items-center gap-3 font-mono text-[11px] text-[#777B75]">
            {property.specs.bedrooms && (
              <span className="flex items-center gap-1" title="Bedrooms">
                <Bed className="w-3.5 h-3.5 text-[#B69A70]" />
                <span>{property.specs.bedrooms} Beds</span>
              </span>
            )}
            {property.specs.bathrooms && (
              <span className="flex items-center gap-1" title="Bathrooms">
                <Bath className="w-3.5 h-3.5 text-[#B69A70]" />
                <span>{property.specs.bathrooms} Baths</span>
              </span>
            )}
            {property.specs.plotSizeSqFt && (
              <span className="flex items-center gap-1" title="Plot Size">
                <Maximize2 className="w-3.5 h-3.5 text-[#B69A70]" />
                <span>{property.specs.plotSizeSqFt.toLocaleString()} sq.ft</span>
              </span>
            )}
            {property.specs.builtUpAreaSqFt && !property.specs.plotSizeSqFt && (
              <span className="flex items-center gap-1" title="Built Area">
                <Maximize2 className="w-3.5 h-3.5 text-[#B69A70]" />
                <span>{property.specs.builtUpAreaSqFt.toLocaleString()} sq.ft</span>
              </span>
            )}
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#172720] group-hover:text-[#B69A70] uppercase tracking-wider transition-colors shrink-0">
            <span>Details</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </article>
  );
};
