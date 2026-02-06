export interface AIMapListingsProps {
  /** Repliers API key - required */
  apiKey: string;
  /** MapBox access token - required */
  mapboxToken: string;
  /** Initial map center coordinates [lng, lat] - auto-detects if not provided */
  initialCenter?: [number, number];
  /** Initial zoom level - auto-calculates if not provided */
  initialZoom?: number;
  /** Map container height */
  height?: string;
  /** Map container width */
  width?: string;
  /** Map style */
  mapStyle?: string;
  /** Center calculation method */
  centerCalculation?: "average" | "city";
  /** Show property count display */
  showPropertyCount?: boolean;
}

export interface ClusterFeature {
  type: "Feature";
  properties: {
    count: number;
    precision: number;
    id: string;
    members?: any[]; // Store actual cluster members from API
    apiCount?: number; // Original unfiltered count from API for debugging
  };
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}

export interface PropertyFeature {
  type: "Feature";
  properties: {
    mlsNumber: string;
    listPrice?: number;
    propertyType?: string; // "Sale" or "Lease"
    isProperty: true;
    // Enhanced fields available at zoom 13+
    address?: {
      city?: string;
      streetDirection?: string;
      streetName?: string;
      streetNumber?: string;
      streetSuffix?: string;
      state?: string;
    };
    details?: {
      numBedrooms?: number;
      numBedroomsPlus?: number;
      numBathrooms?: number;
      numBathroomsPlus?: number;
      numGarageSpaces?: number;
      propertyType?: string;
    };
    images?: Array<string>;
    type?: string;
    lastStatus?: string;
    status?: string;
    class?: string;
  };
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface AutoCenterData {
  center: [number, number];
}

export interface MapFilters {
  listingType: "sale" | "lease";
  propertyTypes: string[];
  minPrice?: number;
  maxPrice?: number | null; // null represents "Max" (no limit)
  bedrooms?: "all" | "0" | "1" | "2" | "3" | "4" | "5+";
  bathrooms?: "all" | "1+" | "2+" | "3+" | "4+" | "5+";
  garageSpaces?: "all" | "1+" | "2+" | "3+" | "4+" | "5+";
  minSqft?: number;
  maxSqft?: number | null; // null represents "Max" (no limit)
  openHouse?: "all" | "today" | "thisWeek" | "thisWeekend" | "anytime";
  maxMaintenanceFee?: number | null; // null represents "Max" (no limit)
  // Status filters - can be enabled/disabled independently for bundled searches
  activeListingDays?: "1" | "3" | "7" | "30" | "90" | "all" | "15+" | "30+" | "60+" | "90+"; // Active listing date filter (undefined = off)
  soldListingDays?: "1" | "3" | "7" | "30" | "90" | "180" | "360" | "all" | "2025" | "2024" | "2023" | "2022" | "2021" | "2020" | "2019" | "2018" | "2017" | "2016" | "2015" | "2014" | "2013" | "2012" | "2011" | "2010" | "2009" | "2008" | "2007"; // Sold listing date filter (undefined = off)
  unavailableListingDays?: "1" | "3" | "7" | "30" | "90" | "180" | "360" | "all" | "2025" | "2024" | "2023" | "2022" | "2021" | "2020" | "2019" | "2018" | "2017" | "2016" | "2015" | "2014" | "2013" | "2012" | "2011" | "2010" | "2009" | "2008" | "2007"; // Unavailable listing date filter (undefined = off)
  // Location filters from NLP
  city?: string;
  neighborhood?: string;
  map?: number[][][]; // GeoJSON polygon coordinates [[lng, lat]]
}

export interface ListingResult {
  mlsNumber: string;
  listPrice: number;
  address?: {
    city?: string;
    streetDirection?: string;
    streetName?: string;
    streetNumber?: string;
    streetSuffix?: string;
    state?: string;
  };
  details?: {
    numBedrooms?: number;
    numBedroomsPlus?: number;
    numBathrooms?: number;
    numBathroomsPlus?: number;
    numGarageSpaces?: number;
    propertyType?: string;
  };
  images?: Array<string>;
  type?: string;
  lastStatus?: string;
  status?: string;
}

export interface ListingPreviewProps {
  listing: ListingResult;
  onClick?: () => void;
}

export interface PropertyTooltipProps {
  open: boolean;
  onClose: () => void;
  listing: ListingResult | null;
  position: {
    x: number;
    y: number;
  };
  mapContainer: HTMLElement | null;
}

export interface ClusterTooltipProps {
  open: boolean;
  onClose: () => void;
  properties: ListingResult[];
  position: {
    x: number;
    y: number;
  };
  mapContainer: HTMLElement | null;
}

export interface PropertyTypeFilterProps {
  filters: MapFilters;
  onFiltersChange: (filters: MapFilters) => void;
  apiKey: string;
}

export interface PriceRangeFilterProps {
  initialMin: number;
  initialMax: number | null; // null represents "Max" (no limit)
  onApply: (min: number, max: number | null) => void;
  priceBreakpoints?: number[]; // Optional custom breakpoints
}

export interface SquareFootageFilterProps {
  initialMin: number;
  initialMax: number | null;
  onApply: (min: number, max: number | null) => void;
  sqftBreakpoints?: number[];
}

export interface MaintenanceFeeFilterProps {
  isOpen: boolean;
  initialMax: number | null;
  onApply: (max: number | null) => void;
  onCancel: () => void;
  feeBreakpoints?: number[];
}

export interface FilterPanelProps {
  filters: MapFilters;
  onFiltersChange: (filters: MapFilters) => void;
  apiKey: string;
}

export interface ActivityLogEntry {
  id: string;
  timestamp: Date;
  type: 'search' | 'understood' | 'update' | 'status' | 'polygon';
  data: {
    query?: string;
    summary?: string;
    filters?: Partial<MapFilters>;
    message?: string;
    polygon?: number[][][];
    updateField?: string;
    updateValue?: any;
  };
}
