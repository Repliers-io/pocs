/**
 * TypeScript types for MapSearchPOC component
 */

import type { Map as MapboxMap, LngLatBounds } from 'mapbox-gl';

/**
 * Extracted entities from AI search
 * These come from OpenAI entity extraction via useOpenAIParser hook
 */
export interface ExtractedEntities {
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  property_type?: string;
  price_min?: number;  // in thousands
  price_max?: number;  // in thousands
  sqft_min?: number;
  sqft_max?: number;
  parking_spaces?: number;
  waterfront?: boolean;
  keywords?: string[];
  amenities?: string[];
  proximity?: string[];
  style_preferences?: string[];
  commute_time?: string;
}

/**
 * Filters formatted for Repliers Listings API
 */
export interface MapFilters {
  city?: string[];
  bedrooms?: number;
  bathrooms?: number;
  propertyTypes?: string[];
  priceMin?: number;  // actual price (not thousands)
  priceMax?: number;  // actual price (not thousands)
  sqftMin?: number;
  sqftMax?: number;
  parkingSpaces?: number;
  waterfront?: boolean;
  keywords?: string[];
}

/**
 * Property cluster from Repliers API
 */
export interface PropertyCluster {
  latitude: number;
  longitude: number;
  count: number;
  precision: number;
}

/**
 * Individual property listing
 */
export interface PropertyListing {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft?: number;
  property_type?: string;
  images?: string[];
  [key: string]: any;
}

/**
 * Clustered listings response from Repliers API
 */
export interface ClusteredListingsResponse {
  clusters?: PropertyCluster[];
  listings?: PropertyListing[];
  total?: number;
}

/**
 * Geocoded location
 */
export interface GeocodedLocation {
  lng: number;
  lat: number;
  name: string;
}

/**
 * Search completion data from AISearchInput
 */
export interface SearchCompletionData {
  query: string;
  entities: ExtractedEntities;
  results: PropertyListing[];
  summary: string;
  conversationId: string;
}

/**
 * MapContainer component props
 */
export interface MapContainerProps {
  filters: MapFilters;
  onMapLoad: (map: MapboxMap) => void;
  onResultsUpdate: (count: number) => void;
  mapboxToken: string;
  repliersApiKey: string;
}

/**
 * MapSearchPOC component props
 */
export interface MapSearchPOCProps {
  openaiApiKey: string;
  repliersApiKey: string;
  mapboxToken: string;
}
