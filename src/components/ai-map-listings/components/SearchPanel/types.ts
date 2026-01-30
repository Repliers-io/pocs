import type { MapFilters } from '../../types';

export interface SearchPanelProps {
  filters: MapFilters;
  onFiltersChange: (filters: MapFilters) => void;
  apiKey: string;
  onSearch?: (query: string) => void;
  onMapUpdate?: (update: { center?: [number, number]; bounds?: number[][][]; zoom?: number }) => void;
}

export interface FilterState extends MapFilters {
  // Additional filter state for NLP-parsed values
  city?: string;
  area?: string;
  neighborhood?: string;
  drawnPolygon?: any;
  locationId?: string;
}
