import React from 'react';
import { Property } from '../../types/property';
import { ResilientImage } from '../ui/ResilientImage';
import { ArrowUpRight, MapPin, Maximize2, MessageCircle } from 'lucide-react';

interface ChatCardProps {
  property: Property;
  onViewDetails: (property: Property) => void;
  onEnquire: (property: Property) => void;
}

export const ChatCard: React.FC<ChatCardProps> = ({
  property,
  onViewDetails,
  onEnquire
}) => {
  const coverUrl = property.images[0]?.url || '';
  const area = property.specs.plotSizeSqFt
    ? `${property.specs.plotSizeSqFt.toLocaleString()} sq.ft Plot`
    : property.specs.builtUpAreaSqFt
    ? `${property.specs.builtUpAreaSqFt.toLocaleString()} sq.ft Built`
    : '';

  return (
    <div className="bg-white rounded-lg border border-[#E7DCC7] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 text-left my-2 max-w-[280px] sm:max-w-[300px]">
      {/* Property Cover Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#202B25]">
        <ResilientImage
          src={coverUrl}
          alt={property.title}
          fallbackTitle={property.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2 z-10">
          <span className="text-[10px] font-mono tracking-wider uppercase text-white bg-[#172720]/85 px-2 py-0.5 rounded">
            {property.categoryLabel}
          </span>
        </div>
        <div className="absolute bottom-2 right-2 z-10">
          <span className="text-[10px] font-mono text-[#E7DCC7] bg-black/70 px-1.5 py-0.5 rounded">
            {property.refCode}
          </span>
        </div>
      </div>

      {/* Info Body */}
      <div className="p-3">
        <div className="flex items-center gap-1 text-[11px] text-[#777B75] mb-1">
          <MapPin className="w-3 h-3 text-[#B69A70] shrink-0" />
          <span className="truncate">{property.location.neighborhood}, {property.location.city}</span>
        </div>

        <h4 className="text-sm font-serif font-semibold text-[#172720] line-clamp-1 mb-1">
          {property.title}
        </h4>

        <div className="flex items-center justify-between my-2">
          <span className="text-sm font-serif font-bold text-[#172720]">
            {property.priceDisplay}
          </span>
          {area && (
            <span className="text-[10px] font-mono text-[#777B75] flex items-center gap-1">
              <Maximize2 className="w-2.5 h-2.5 text-[#B69A70]" />
              <span>{area}</span>
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E7DCC7]/50">
          <button
            type="button"
            onClick={() => onViewDetails(property)}
            className="w-full py-1.5 px-2 bg-[#F7F5EF] hover:bg-[#E7DCC7] text-[#172720] text-[10px] uppercase font-bold tracking-wider rounded transition-colors flex items-center justify-center gap-1"
          >
            <span>Details</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>

          <button
            type="button"
            onClick={() => onEnquire(property)}
            className="w-full py-1.5 px-2 bg-[#172720] hover:bg-[#202B25] text-white text-[10px] uppercase font-bold tracking-wider rounded transition-colors flex items-center justify-center gap-1"
          >
            <MessageCircle className="w-3 h-3 text-[#B69A70]" />
            <span>Enquire</span>
          </button>
        </div>
      </div>
    </div>
  );
};
