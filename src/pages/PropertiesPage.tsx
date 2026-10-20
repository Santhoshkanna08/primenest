import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, RotateCcw, ArrowUpDown, MapPin, Sparkles } from 'lucide-react';
import { Property, SearchFilters } from '../types/property';
import { propertyCategories } from '../data/properties';
import { PropertyCard } from '../components/property/PropertyCard';

interface PropertiesPageProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  initialFilters?: Partial<SearchFilters>;
}

export const PropertiesPage: React.FC<PropertiesPageProps> = ({
  properties,
  onSelectProperty,
  isFavorite,
  onToggleFavorite,
  initialFilters
}) => {
  const [keyword, setKeyword] = useState(initialFilters?.keyword || '');
  const [selectedCategory, setSelectedCategory] = useState(initialFilters?.category || 'all');
  const [selectedLocation, setSelectedLocation] = useState(initialFilters?.location || 'all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'area-desc' | 'newest'>('featured');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  React.useEffect(() => {
    if (initialFilters?.category) setSelectedCategory(initialFilters.category);
    if (initialFilters?.keyword !== undefined) setKeyword(initialFilters.keyword);
    if (initialFilters?.location) setSelectedLocation(initialFilters.location);
  }, [initialFilters]);

  // Extract unique locations from properties
  const locations = useMemo(() => {
    const locSet = new Set<string>();
    properties.forEach((p) => locSet.add(p.location.city));
    return Array.from(locSet);
  }, [properties]);

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // Keyword filter
      if (keyword.trim()) {
        const q = keyword.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesCity = p.location.city.toLowerCase().includes(q);
        const matchesNeighborhood = p.location.neighborhood.toLowerCase().includes(q);
        const matchesRef = p.refCode.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCity && !matchesNeighborhood && !matchesRef) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // Location filter
      if (selectedLocation !== 'all' && p.location.city !== selectedLocation) {
        return false;
      }

      // Price range
      if (priceRange === 'under-2m' && p.price >= 2000000) return false;
      if (priceRange === '2m-5m' && (p.price < 2000000 || p.price > 5000000)) return false;
      if (priceRange === '5m-plus' && p.price < 5000000) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'area-desc') {
        const aArea = a.specs.plotSizeSqFt || a.specs.builtUpAreaSqFt || 0;
        const bArea = b.specs.plotSizeSqFt || b.specs.builtUpAreaSqFt || 0;
        return bArea - aArea;
      }
      if (sortBy === 'newest') return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [properties, keyword, selectedCategory, selectedLocation, priceRange, sortBy]);

  const handleClearFilters = () => {
    setKeyword('');
    setSelectedCategory('all');
    setSelectedLocation('all');
    setPriceRange('all');
    setSortBy('featured');
  };

  const hasActiveFilters =
    keyword !== '' ||
    selectedCategory !== 'all' ||
    selectedLocation !== 'all' ||
    priceRange !== 'all' ||
    sortBy !== 'featured';

  return (
    <div className="pt-28 pb-24 bg-[#F7F5EF] min-h-screen text-[#202B25]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Page Header */}
        <div className="mb-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 mb-2 text-[#B69A70]">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs uppercase tracking-[0.25em] font-mono font-semibold">
              PORTFOLIO CATALOG
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#172720] tracking-tight">
            Curated Properties & Estates
          </h1>
          <p className="text-sm sm:text-base text-[#777B75] mt-2">
            Browse our hand-selected residential land parcels, bespoke villas, and generational holdings.
          </p>
        </div>

        {/* Category Filter Tabs (Zero-pill, clean segmented control buttons) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none border-b border-[#E7DCC7]/60">
          {propertyCategories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs font-semibold tracking-wider whitespace-nowrap transition-all rounded ${
                  isSelected
                    ? 'bg-[#172720] text-white shadow-sm'
                    : 'text-[#777B75] hover:text-[#172720] hover:bg-black/5'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`ml-2 text-[10px] font-mono ${isSelected ? 'text-[#B69A70]' : 'text-[#777B75]'}`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search, Filter Bar & Sort Controls */}
        <div className="bg-white p-4 rounded-lg border border-[#E7DCC7]/60 shadow-sm mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Keyword search input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-[#777B75] absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search by name, reference (e.g. PN-EST-104), or area..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#F7F5EF]/60 border border-[#E7DCC7] rounded focus:outline-none focus:border-[#B69A70] text-[#172720]"
              />
              {keyword && (
                <button
                  onClick={() => setKeyword('')}
                  aria-label="Clear search input"
                  className="absolute right-3 top-3 text-[#777B75] hover:text-[#172720]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Location selector */}
            <div className="md:col-span-3">
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-[#B69A70] absolute left-3 top-3" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 text-xs bg-[#F7F5EF]/60 border border-[#E7DCC7] rounded focus:outline-none focus:border-[#B69A70] text-[#172720] cursor-pointer"
                >
                  <option value="all">All Locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price bracket selector */}
            <div className="md:col-span-2">
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-[#F7F5EF]/60 border border-[#E7DCC7] rounded focus:outline-none focus:border-[#B69A70] text-[#172720] cursor-pointer"
              >
                <option value="all">Any Price</option>
                <option value="under-2m">Under $2,000,000</option>
                <option value="2m-5m">$2M – $5,000,000</option>
                <option value="5m-plus">$5,000,000 & Up</option>
              </select>
            </div>

            {/* Sort selector */}
            <div className="md:col-span-2">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2.5 text-xs bg-[#F7F5EF]/60 border border-[#E7DCC7] rounded focus:outline-none focus:border-[#B69A70] text-[#172720] cursor-pointer"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="area-desc">Area: Largest First</option>
                  <option value="newest">Recently Listed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Result Count & Clear Filters Active Indicator */}
          <div className="flex items-center justify-between pt-2 border-t border-[#E7DCC7]/40 text-xs text-[#777B75]">
            <span className="font-mono">
              Showing <strong className="text-[#172720]">{filteredProperties.length}</strong> {filteredProperties.length === 1 ? 'property' : 'properties'}
            </span>

            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1.5 text-xs text-[#172720] hover:text-[#B69A70] font-semibold underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Property Grid or Empty State */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((prop) => (
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
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-[#E7DCC7] p-8 max-w-xl mx-auto space-y-4">
            <div className="w-12 h-12 bg-[#F7F5EF] text-[#B69A70] rounded-full mx-auto flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif text-[#172720]">
              No Matching Properties Found
            </h3>
            <p className="text-xs sm:text-sm text-[#777B75] leading-relaxed">
              We could not find any properties matching your current filter criteria. Try expanding your search or clearing your active filters.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-2.5 bg-[#172720] text-white text-xs uppercase tracking-widest font-semibold rounded hover:bg-[#B69A70] hover:text-[#172720] transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
