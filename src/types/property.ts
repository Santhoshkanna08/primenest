export type PropertyCategory = 
  | 'residential_plot'
  | 'luxury_villa'
  | 'penthouse'
  | 'house'
  | 'land_investment';

export interface PropertyImage {
  url: string;
  caption?: string;
  isCover?: boolean;
}

export interface PropertySpecs {
  bedrooms?: number;
  bathrooms?: number;
  builtUpAreaSqFt?: number;
  plotSizeSqFt?: number;
  plotSizeAcres?: number;
  carParks?: number;
  facing?: string;
  roadWidthFt?: number;
  zoning?: string;
  readyStatus?: 'Immediate' | 'Under Development' | 'Ready to Construct' | 'Possession Q4 2026';
}

export interface Property {
  id: string;
  refCode: string;
  title: string;
  subtitle: string;
  category: PropertyCategory;
  categoryLabel: string;
  price: number;
  priceDisplay: string;
  pricePerSqFt?: string;
  location: {
    city: string;
    neighborhood: string;
    state?: string;
    country: string;
    landmark?: string;
  };
  specs: PropertySpecs;
  description: string;
  editorialHighlight: string;
  images: PropertyImage[];
  amenities: string[];
  features: string[];
  legalStatus?: string;
  featured?: boolean;
  investmentHighlight?: string;
  publishedDate: string;
}

export interface SearchFilters {
  keyword: string;
  category: string;
  location: string;
  minPrice: number;
  maxPrice: number;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'area-desc' | 'newest';
}

export interface EnquiryData {
  propertyId?: string;
  propertyTitle?: string;
  propertyRef?: string;
  fullName: string;
  phone: string;
  email: string;
  preferredContact: 'whatsapp' | 'phone' | 'email';
  message: string;
  purpose: 'Buy' | 'Investment' | 'Site Visit';
  preferredDate?: string;
  preferredTime?: string;
}
