import React from 'react';
import { Bookmark, ArrowRight, Trash2 } from 'lucide-react';
import { Property } from '../types/property';
import { PropertyCard } from '../components/property/PropertyCard';

interface FavoritesPageProps {
  properties: Property[];
  favoriteIds: string[];
  onSelectProperty: (property: Property) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onClearFavorites: () => void;
  onExploreProperties: () => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  properties,
  favoriteIds,
  onSelectProperty,
  onToggleFavorite,
  onClearFavorites,
  onExploreProperties
}) => {
  const savedProperties = properties.filter((p) => favoriteIds.includes(p.id));

  return (
    <div className="pt-28 pb-24 bg-[#F7F5EF] min-h-screen text-[#202B25]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-[#E7DCC7]/60">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 text-[#B69A70]">
              <Bookmark className="w-3.5 h-3.5" />
              <span className="text-xs uppercase tracking-[0.25em] font-mono font-semibold">
                PRIVATE SHORTLIST
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif text-[#172720]">
              Saved Properties ({savedProperties.length})
            </h1>
            <p className="text-xs sm:text-sm text-[#777B75] mt-1">
              Your saved collection of residential plots, luxury villas, and land holdings.
            </p>
          </div>

          {savedProperties.length > 0 && (
            <button
              onClick={onClearFavorites}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 hover:text-red-900 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Shortlist</span>
            </button>
          )}
        </div>

        {savedProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedProperties.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                onSelect={onSelectProperty}
                isFavorite={true}
                onToggleFavorite={onToggleFavorite}
                aspect="standard"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-[#E7DCC7] p-8 max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 bg-[#F7F5EF] text-[#B69A70] rounded-full mx-auto flex items-center justify-center">
              <Bookmark className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-serif text-[#172720]">
              Your Shortlist is Empty
            </h3>
            <p className="text-xs sm:text-sm text-[#777B75]">
              As you browse properties and plots, click the bookmark icon on any card to save it for easy comparison and direct consultation.
            </p>
            <button
              onClick={onExploreProperties}
              className="px-6 py-3 bg-[#172720] hover:bg-[#B69A70] text-white hover:text-[#172720] text-xs uppercase tracking-widest font-semibold rounded transition-colors inline-flex items-center gap-2"
            >
              <span>Explore Properties</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
