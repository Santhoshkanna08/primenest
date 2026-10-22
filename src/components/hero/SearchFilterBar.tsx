import React, { useState } from 'react';
import { Search, MapPin, Building, DollarSign, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { SearchFilters } from '../../types/property';

interface SearchFilterBarProps {
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: Partial<SearchFilters>;
  className?: string;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  onSearch,
  initialFilters,
  className = ''
}) => {
  const [keyword, setKeyword] = useState(initialFilters?.keyword || '');
  const [category, setCategory] = useState(initialFilters?.category || 'all');
  const [location, setLocation] = useState(initialFilters?.location || 'all');
  const [budgetRange, setBudgetRange] = useState<'all' | 'under-1.5m' | '1.5m-3.5m' | '3.5m-6m' | '6m-plus'>('all');
  const [intent, setIntent] = useState<'buy' | 'invest'>('buy');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let min = 0;
    let max = 100000000;

    if (budgetRange === 'under-1.5m') {
      max = 1500000;
    } else if (budgetRange === '1.5m-3.5m') {
      min = 1500000;
      max = 3500000;
    } else if (budgetRange === '3.5m-6m') {
      min = 3500000;
      max = 6000000;
    } else if (budgetRange === '6m-plus') {
      min = 6000000;
    }

    onSearch({
      keyword,
      category,
      location,
      minPrice: min,
      maxPrice: max,
      sortBy: 'featured'
    });
  };

  return (
    <div className={`w-full max-w-5xl mx-auto ${className}`}>
      {/* Intent switcher */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex flex-col xs:flex-row sm:inline-flex items-stretch sm:items-center bg-[#172720]/80 backdrop-blur-md p-1 rounded border border-[#E7DCC7]/15 w-full sm:w-auto gap-1 sm:gap-0">
          <button
            type="button"
            onClick={() => setIntent('buy')}
            className={`flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-semibold tracking-wider transition-all rounded text-center truncate xs:whitespace-nowrap ${
              intent === 'buy'
                ? 'bg-[#B69A70] text-[#172720]'
                : 'text-[#E7DCC7]/70 hover:text-white'
            }`}
          >
            Residential Purchase
          </button>
          <button
            type="button"
            onClick={() => setIntent('invest')}
            className={`flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-semibold tracking-wider transition-all rounded text-center truncate xs:whitespace-nowrap ${
              intent === 'invest'
                ? 'bg-[#B69A70] text-[#172720]'
                : 'text-[#E7DCC7]/70 hover:text-white'
            }`}
          >
            Land & Capital Investment
          </button>
        </div>
      </div>

      {/* Main Filter Form */}
      <form
        onSubmit={handleSearchSubmit}
        className="bg-[#202B25]/90 backdrop-blur-xl border border-[#E7DCC7]/20 rounded-lg p-3 sm:p-4 shadow-2xl shadow-black/40"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 items-center">
          {/* Location field */}
          <div className="flex flex-col gap-1 px-3 py-2 bg-[#172720]/70 rounded border border-[#E7DCC7]/10 focus-within:border-[#B69A70]">
            <label className="text-[10px] uppercase font-mono tracking-wider text-[#B69A70] flex items-center gap-1.5">
              <MapPin className="w-3 h-3" />
              <span>Location / Enclave</span>
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent text-sm font-medium text-white focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#202B25] text-white">All Regions & Enclaves</option>
              <option value="Malibu Coast" className="bg-[#202B25] text-white">Malibu Coast</option>
              <option value="Sonoma Foothills" className="bg-[#202B25] text-white">Sonoma Foothills (Plots)</option>
              <option value="Carmel Valley" className="bg-[#202B25] text-white">Carmel Valley</option>
              <option value="Bellevue Waterfront" className="bg-[#202B25] text-white">Bellevue Waterfront</option>
              <option value="Big Sur North" className="bg-[#202B25] text-white">Big Sur Coast (Acreage)</option>
              <option value="Napa Valley Border" className="bg-[#202B25] text-white">Napa Valley Reserve</option>
            </select>
          </div>

          {/* Property Category */}
          <div className="flex flex-col gap-1 px-3 py-2 bg-[#172720]/70 rounded border border-[#E7DCC7]/10 focus-within:border-[#B69A70]">
            <label className="text-[10px] uppercase font-mono tracking-wider text-[#B69A70] flex items-center gap-1.5">
              <Building className="w-3 h-3" />
              <span>Property Classification</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-transparent text-sm font-medium text-white focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#202B25] text-white">All Categories</option>
              <option value="residential_plot" className="bg-[#202B25] text-white">Residential Plots & Land</option>
              <option value="luxury_villa" className="bg-[#202B25] text-white">Luxury Architectural Villas</option>
              <option value="penthouse" className="bg-[#202B25] text-white">Duplex Penthouses</option>
              <option value="land_investment" className="bg-[#202B25] text-white">Strategic Land Holdings</option>
              <option value="house" className="bg-[#202B25] text-white">Independent Houses</option>
            </select>
          </div>

          {/* Budget Range */}
          <div className="flex flex-col gap-1 px-3 py-2 bg-[#172720]/70 rounded border border-[#E7DCC7]/10 focus-within:border-[#B69A70]">
            <label className="text-[10px] uppercase font-mono tracking-wider text-[#B69A70] flex items-center gap-1.5">
              <DollarSign className="w-3 h-3" />
              <span>Investment Scale</span>
            </label>
            <select
              value={budgetRange}
              onChange={(e) => setBudgetRange(e.target.value as any)}
              className="bg-transparent text-sm font-medium text-white focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#202B25] text-white">Any Price Bracket</option>
              <option value="under-1.5m" className="bg-[#202B25] text-white">Under $1,500,000</option>
              <option value="1.5m-3.5m" className="bg-[#202B25] text-white">$1.5M – $3,500,000</option>
              <option value="3.5m-6m" className="bg-[#202B25] text-white">$3.5M – $6,000,000</option>
              <option value="6m-plus" className="bg-[#202B25] text-white">$6,000,000 & Above</option>
            </select>
          </div>

          {/* Search Trigger */}
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="w-full h-full py-3.5 px-6 bg-[#B69A70] hover:bg-[#E7DCC7] text-[#172720] text-xs uppercase tracking-widest font-bold rounded transition-colors flex items-center justify-center gap-2 group shadow-lg"
            >
              <Search className="w-4 h-4 text-[#172720]" />
              <span>Search Properties</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
