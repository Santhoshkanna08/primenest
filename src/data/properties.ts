import { Property } from '../types/property';

export const propertiesData: Property[] = [
  {
    id: 'pn-104-obsidian-horizon',
    refCode: 'PN-EST-104',
    title: 'The Obsidian Horizon Villa',
    subtitle: 'Dramatic modern architectural sanctuary with panoramic ocean vistas',
    category: 'luxury_villa',
    categoryLabel: 'Luxury Villa',
    price: 6850000,
    priceDisplay: '$6,850,000',
    pricePerSqFt: '$856 / sq.ft',
    location: {
      city: 'Malibu Coast',
      neighborhood: 'Point Dume Enclave',
      state: 'California',
      country: 'United States',
      landmark: 'Minutes from private cove access'
    },
    specs: {
      bedrooms: 5,
      bathrooms: 6,
      builtUpAreaSqFt: 8000,
      plotSizeSqFt: 32670,
      carParks: 4,
      facing: 'South-West Pacific View',
      readyStatus: 'Immediate'
    },
    description: 'An architectural tour-de-force engineered for seamless indoor-outdoor living. Built with post-tensioned board-formed concrete, warm cedar claddings, and 12-foot floor-to-ceiling motorized glazing that opens fully to an expansive travertine terrace. Features a 60-foot zero-edge reflection pool that mirrors the Pacific sunset, an integrated outdoor chef kitchen, and private primary suite pavilion with private garden court.',
    editorialHighlight: 'Featured in Architectural Digest as one of the year’s most harmonious coastal modern residences.',
    images: [
      {
        url: '/src/assets/images/hero_luxury_villa_exterior_1792478313210.jpg',
        caption: 'Twilight elevation showcasing the reflection pool and cantilevered cedar terrace',
        isCover: true
      },
      {
        url: '/src/assets/images/featured_villa_estate_1792478314692.jpg',
        caption: 'Daylight terrace with travertine stone flooring and cypress promenade'
      },
      {
        url: '/src/assets/images/luxury_modern_penthouse_1792478315544.jpg',
        caption: 'Double-height great room with bespoke marble fireplace and sculpture collection'
      }
    ],
    amenities: [
      '60-ft Heated Zero-Edge Pool',
      'Travertine Outdoor Fireplace Lounge',
      'Wine Cellar with Climate Control',
      'Motorized Glass Pocket Doors',
      'Private Spa & Cedar Sauna',
      'Sub-Zero & Wolf Kitchen Suite',
      'Smart Home Home Automation (Crestron)',
      'Solar Array with Tesla Powerwalls'
    ],
    features: [
      'Engineered Acoustic Ceilings',
      'Curated Drought-Tolerant Olive Tree Grove',
      'Direct Gated Access to Beach Trail',
      'Triple-Filtered Fresh Air Exchange'
    ],
    legalStatus: 'Clear Title, Unencumbered, Coastal Commission Certified',
    featured: true,
    investmentHighlight: 'High-appreciation coastal pocket with historic 14% 3-year value growth.',
    publishedDate: '2026-08-14'
  },
  {
    id: 'pn-201-grand-orchard-estates',
    refCode: 'PN-PLT-201',
    title: 'The Grand Orchard Plots',
    subtitle: 'Master-planned luxury residential plotted land with curbed tree-lined boulevards',
    category: 'residential_plot',
    categoryLabel: 'Residential Plot',
    price: 1250000,
    priceDisplay: '$1,250,000',
    pricePerSqFt: '$125 / sq.ft',
    location: {
      city: 'Sonoma Foothills',
      neighborhood: 'Oak Ridge Reserve',
      state: 'California',
      country: 'United States',
      landmark: 'Adjoining protected viticultural greenbelt'
    },
    specs: {
      plotSizeSqFt: 10000,
      plotSizeAcres: 0.23,
      facing: 'North-East & East',
      roadWidthFt: 60,
      zoning: 'R-1 Low Density Residential Estate',
      readyStatus: 'Ready to Construct'
    },
    description: 'A distinguished master-planned plotted development framed by rolling hills and native valley oaks. Each designated parcel features wide 60-foot tree-lined avenues with pedestrian promenades, underground utility conduits (water, 3-phase power, high-speed fiber), and pre-approved architectural design guidelines that protect your long-term capital value.',
    editorialHighlight: 'Designed around low-impact ecological contours with dedicated rainwater conservation channels.',
    images: [
      {
        url: '/src/assets/images/residential_plots_aerial_1792478314103.jpg',
        caption: 'Aerial master view of the contoured parcels and central landscaped median',
        isCover: true
      },
      {
        url: '/src/assets/images/coastal_land_estate_1792478315558.jpg',
        caption: 'Topographical view towards the valley corridor'
      }
    ],
    amenities: [
      '60-Foot Wide Paved Internal Avenues',
      'Underground Cabling & Fiber Optic Ducting',
      '24/7 Monitored Access Gatehouse',
      'Perimeter Stone Masonry Compound Wall',
      'Dedicated Club Meadow & Tennis Court',
      'Stormwater Percolation & Rain Harvesting',
      'Architectural Review Board Pre-Clearance'
    ],
    features: [
      '100% Freehold Residential Land Ownership',
      'Clear Municipal Demarcation Stones',
      'Soil Suitability & Geotech Report Verified',
      'Permitted for Immediate Construction'
    ],
    legalStatus: 'County Approved Master Plan, Freehold Title',
    featured: true,
    investmentHighlight: 'High demand plotted enclave with 2.8x appreciation benchmark in neighboring phases.',
    publishedDate: '2026-09-02'
  },
  {
    id: 'pn-308-cypress-travertine',
    refCode: 'PN-VLA-308',
    title: 'The Cypress Travertine Residence',
    subtitle: 'Cantilevered limestone pavilion residence with linear swimming canal',
    category: 'luxury_villa',
    categoryLabel: 'Luxury Villa',
    price: 4950000,
    priceDisplay: '$4,950,000',
    pricePerSqFt: '$727 / sq.ft',
    location: {
      city: 'Carmel Valley',
      neighborhood: 'Santa Lucia Foothills',
      state: 'California',
      country: 'United States',
      landmark: 'Near Santa Lucia Preserve Gateway'
    },
    specs: {
      bedrooms: 4,
      bathrooms: 5,
      builtUpAreaSqFt: 6800,
      plotSizeSqFt: 24000,
      carParks: 3,
      facing: 'South Orientation',
      readyStatus: 'Immediate'
    },
    description: 'Sculpted from warm Portuguese limestone and vertical cedar louvers, this single-level modern masterpiece frames panoramic mountain ridge views. A 75-foot linear lap canal connects the entertaining terraces to a shaded outdoor dining loggia. Inside, wide-plank French white oak flooring meets custom basalt stone fireplaces and a temperature-controlled tasting gallery.',
    editorialHighlight: 'A benchmark in architectural quiet luxury with discreet zero-sill threshold transitions.',
    images: [
      {
        url: '/src/assets/images/featured_villa_estate_1792478314692.jpg',
        caption: 'Travertine lounge terrace and lap pool aligned with Italian cypress trees',
        isCover: true
      },
      {
        url: '/src/assets/images/luxury_modern_penthouse_1792478315544.jpg',
        caption: 'Light-filled living room featuring floor-to-ceiling iron-framed glass'
      },
      {
        url: '/src/assets/images/hero_luxury_villa_exterior_1792478313210.jpg',
        caption: 'South-facing twilight view of the cantilevered pavilion'
      }
    ],
    amenities: [
      '75-Foot Integrated Lap Canal',
      'Covered Travertine Loggia with Fire Table',
      'Sommelier Tasting Cellar (800 Bottles)',
      'Detached Guest Casita with Ensuite',
      'Private Wellness Studio & Gym',
      'Bespoke Poliform Wardrobe Suites',
      'Motorized Solar Louver Pergolas'
    ],
    features: [
      'Certified Net-Zero Energy Ready',
      'Geothermal Heating & Cooling System',
      'Radiant Heated Bathroom Floors',
      'Enclosed Citrus & Herb Kitchen Garden'
    ],
    legalStatus: 'Fully Permitted, Freehold Residential Deed',
    featured: true,
    investmentHighlight: 'Exclusive sanctuary location with stringent zoning protecting vistas.',
    publishedDate: '2026-07-28'
  },
  {
    id: 'pn-412-calacatta-sky-penthouse',
    refCode: 'PN-PNT-412',
    title: 'The Calacatta Sky Penthouse',
    subtitle: 'Duplex crown penthouse with 22-foot double-height gallery & 360° horizon views',
    category: 'penthouse',
    categoryLabel: 'Penthouse',
    price: 8200000,
    priceDisplay: '$8,200,000',
    pricePerSqFt: '$1,366 / sq.ft',
    location: {
      city: 'Bellevue Waterfront',
      neighborhood: 'Marina District',
      state: 'Washington',
      country: 'United States',
      landmark: 'Direct high-speed elevator access'
    },
    specs: {
      bedrooms: 4,
      bathrooms: 5,
      builtUpAreaSqFt: 6000,
      carParks: 3,
      facing: 'North-West Marina & City Panorama',
      readyStatus: 'Immediate'
    },
    description: 'Perched on the top floors of the city’s premier residential tower, this penthouse is centered around a monumental 22-foot bookmatched Calacatta marble fireplace and a floating helical steel staircase. Wraparound glass walls frame sunrise over the Cascades and sunset across the open bay waters.',
    editorialHighlight: 'Custom lighting installation by Studio Bocci with museum-grade art illumination throughout.',
    images: [
      {
        url: '/src/assets/images/luxury_modern_penthouse_1792478315544.jpg',
        caption: 'Double-height grand salon featuring bookmatched marble hearth and bespoke furniture',
        isCover: true
      },
      {
        url: '/src/assets/images/hero_luxury_villa_exterior_1792478313210.jpg',
        caption: 'Skyline sunset perspective from the wraparound observation deck'
      }
    ],
    amenities: [
      'Private High-Speed Direct Foyer Elevator',
      'Bookmatched Italian Marble Fireplace',
      'Sculptural Helical Steel Staircase',
      '1,400 Sq.Ft Wraparound Sky Terrace',
      'Boffi Kitchen with Gaggenau 400 Series',
      'Secondary Butler Prep Galley',
      'Automated Valet Parking with 3 Stalls',
      '24/7 White-Glove Concierge & Security'
    ],
    features: [
      'Triple-Pane Acoustic Glazing (Zero City Hum)',
      'Motorized Silk Blackout Screens',
      'Integrated Bang & Olufsen Spatial Sound',
      'Private Rooftop Jacuzzi Plunge'
    ],
    legalStatus: 'Condominium Title with Dedicated Deed Rights',
    featured: true,
    investmentHighlight: 'Trophy real estate asset with elite international lease demand.',
    publishedDate: '2026-08-30'
  },
  {
    id: 'pn-505-azure-point-land',
    refCode: 'PN-LND-505',
    title: 'The Azure Point Coastal Acreage',
    subtitle: 'Prime 4.2-acre cliffside residential land parcel with private shoreline access trail',
    category: 'land_investment',
    categoryLabel: 'Land Investment',
    price: 3400000,
    priceDisplay: '$3,400,000',
    pricePerSqFt: '$18.50 / sq.ft',
    location: {
      city: 'Big Sur North',
      neighborhood: 'Pacific Headland Corridor',
      state: 'California',
      country: 'United States',
      landmark: 'Private gated access lane off Scenic Highway'
    },
    specs: {
      plotSizeSqFt: 182952,
      plotSizeAcres: 4.2,
      facing: 'West Unobstructed Oceanfront',
      roadWidthFt: 40,
      zoning: 'Rural Residential & Private Estate Land',
      readyStatus: 'Ready to Construct'
    },
    description: 'An irreplaceable 4.2-acre legacy land holding perched high above the azure Pacific waters. Complete with an existing cleared construction building pad, approved coastal geotech envelope, drilled deep-water well with verified yield, and a private stone walkway descending to a secluded cove below.',
    editorialHighlight: 'One of only three remaining buildable oceanfront private parcels in this protected sector.',
    images: [
      {
        url: '/src/assets/images/coastal_land_estate_1792478315558.jpg',
        caption: 'Aerial headland view showing boundary line and natural stone terrace pathway',
        isCover: true
      },
      {
        url: '/src/assets/images/residential_plots_aerial_1792478314103.jpg',
        caption: 'Enclave approach road and protected natural buffer'
      }
    ],
    amenities: [
      '4.2 Contiguous Pristine Acres',
      'Private Sea Trail to Rocky Cove',
      'Pre-Graded 12,000 Sq.Ft Building Envelope',
      'Drilled High-Yield Domestic Water Well',
      'Pre-Approved Fire Access Roadways',
      'Underground Electrical Conduit at Boundary',
      'Architectural Concept Drawings Included'
    ],
    features: [
      'Unobstructed 180-Degree Ocean Sunsets',
      'Protected From Future Coastal Encroachment',
      'Ideal for Off-Grid or Hybrid Eco-Estate',
      'Complete Topographical & Drone Survey Package'
    ],
    legalStatus: 'Fee-Simple Freehold Estate, Coastal Permit Stage 1 Cleared',
    featured: true,
    investmentHighlight: 'Scarcity-driven coastal acreage with generational value retention.',
    publishedDate: '2026-09-18'
  },
  {
    id: 'pn-209-meadow-grove-plots',
    refCode: 'PN-PLT-209',
    title: 'The Meadow Grove Sanctuary Plots',
    subtitle: 'Boutique collection of 0.5-acre wooded residential plots in private valley enclave',
    category: 'residential_plot',
    categoryLabel: 'Residential Plot',
    price: 890000,
    priceDisplay: '$890,000',
    pricePerSqFt: '$41 / sq.ft',
    location: {
      city: 'Napa Valley Border',
      neighborhood: 'Silverado Foothills',
      state: 'California',
      country: 'United States',
      landmark: 'Adjacent to Meadowood Woodland Reserve'
    },
    specs: {
      plotSizeSqFt: 21780,
      plotSizeAcres: 0.5,
      facing: 'South & South-East',
      roadWidthFt: 50,
      zoning: 'Residential Estate (Single Family)',
      readyStatus: 'Ready to Construct'
    },
    description: 'Envisioned for those seeking privacy and natural majesty. Set amid heritage olive groves and mature cedar stands, each half-acre plot features graded driveway access, underground power and municipal water connection stubs, and perimeter dry-stack stone walls.',
    editorialHighlight: 'Low density layout with 40% reserved open meadow space ensuring continuous tranquility.',
    images: [
      {
        url: '/src/assets/images/residential_plots_aerial_1792478314103.jpg',
        caption: 'Golden hour drone perspective over the tree-framed estate parcels',
        isCover: true
      },
      {
        url: '/src/assets/images/featured_villa_estate_1792478314692.jpg',
        caption: 'Architectural inspiration for home construction on the plots'
      }
    ],
    amenities: [
      'Gated Entry with Stone Pillars',
      'Municipal Potable Water Hookup Ready',
      'Underground 400A Electrical Panel at Lot',
      'Natural Meadow Walking Trails',
      'Strict Design Standards Preserving Values'
    ],
    features: [
      'Zero Overhead Cables or Utility Eyesores',
      'Mature Native Oak Preservation Program',
      'Gentle 2% Grade (Low Foundation Cost)'
    ],
    legalStatus: 'Individual Registered Plot Deeds, Immediate Registration',
    featured: false,
    investmentHighlight: 'Premium school district and rapid appreciation corridor.',
    publishedDate: '2026-09-25'
  },
  {
    id: 'pn-614-solarium-courtyard',
    refCode: 'PN-HSE-614',
    title: 'The Solarium Courtyard House',
    subtitle: 'Organic modernist single-level house wrapped around a Japanese maple zen atrium',
    category: 'house',
    categoryLabel: 'Independent House',
    price: 3750000,
    priceDisplay: '$3,750,000',
    pricePerSqFt: '$815 / sq.ft',
    location: {
      city: 'Pasadena Hills',
      neighborhood: 'Oak Knoll Terraces',
      state: 'California',
      country: 'United States',
      landmark: 'Short drive to Langham Sanctuary'
    },
    specs: {
      bedrooms: 4,
      bathrooms: 4,
      builtUpAreaSqFt: 4600,
      plotSizeSqFt: 18000,
      carParks: 2,
      facing: 'East-West Cross Light',
      readyStatus: 'Immediate'
    },
    description: 'Conceived by renowned mid-century modernist disciples, this single-story haven revolves around an open-air central glass courtyard. Highlights include rift-sawn white oak millwork, polished terrazzo floors, clerestory ceiling windows, and an intimate plunge pool with dark river stone masonry.',
    editorialHighlight: 'Exemplary natural lighting design that shifts throughout the day into warm golden serenity.',
    images: [
      {
        url: '/src/assets/images/featured_villa_estate_1792478314692.jpg',
        caption: 'Courtyard connection and floor-to-ceiling glass architecture',
        isCover: true
      },
      {
        url: '/src/assets/images/luxury_modern_penthouse_1792478315544.jpg',
        caption: 'Minimalist interior gallery living space'
      }
    ],
    amenities: [
      'Central Glass Zen Maple Courtyard',
      'Saltwater River-Stone Plunge Pool',
      'Polished Terrazzo Flooring Throughout',
      'Custom Rift-Sawn Oak Cabinetry',
      'Secondary Tea Pavilion / Library',
      'Acoustically Isolated Home Office'
    ],
    features: [
      'High-Thermal-Mass Concrete Walls',
      'Passive Solar Cross-Ventilation Design',
      'Custom Architectural Bronze Hardware'
    ],
    legalStatus: 'Historic Modernist Preservation Registry, Clear Title',
    featured: false,
    investmentHighlight: 'Architectural provenance creates rare collector appeal.',
    publishedDate: '2026-10-01'
  }
];

export const propertyCategories = [
  { id: 'all', label: 'All Properties', count: propertiesData.length },
  { id: 'residential_plot', label: 'Residential Plots', count: propertiesData.filter(p => p.category === 'residential_plot').length },
  { id: 'luxury_villa', label: 'Luxury Villas', count: propertiesData.filter(p => p.category === 'luxury_villa').length },
  { id: 'penthouse', label: 'Penthouses', count: propertiesData.filter(p => p.category === 'penthouse').length },
  { id: 'land_investment', label: 'Land Investment', count: propertiesData.filter(p => p.category === 'land_investment').length },
  { id: 'house', label: 'Houses', count: propertiesData.filter(p => p.category === 'house').length },
];
