import { useMemo } from 'react';
import type { ExtractedEntities, MapFilters } from '../types';

/**
 * Hook to convert AI-extracted entities to Repliers API filter format
 *
 * This hook transforms the structured entities from OpenAI parsing into
 * the exact format expected by the Repliers Listings API.
 *
 * @param entities - Extracted entities from OpenAI parser
 * @returns MapFilters - Formatted filters for Repliers API
 *
 * @example
 * const entities = { location: "Toronto", bedrooms: 3, price_max: 800 };
 * const filters = useMapFilters(entities);
 * // filters = { city: ["Toronto"], bedrooms: 3, priceMax: 800000 }
 */
export function useMapFilters(entities: ExtractedEntities): MapFilters {
  return useMemo(() => {
    const filters: MapFilters = {};

    // Location -> city array
    if (entities.location) {
      filters.city = [entities.location];
    }

    // Direct number mappings
    if (entities.bedrooms) {
      filters.bedrooms = entities.bedrooms;
    }

    if (entities.bathrooms) {
      filters.bathrooms = entities.bathrooms;
    }

    if (entities.parking_spaces) {
      filters.parkingSpaces = entities.parking_spaces;
    }

    // Property type -> array
    if (entities.property_type) {
      filters.propertyTypes = [entities.property_type];
    }

    // Price conversion: thousands to actual amount
    if (entities.price_min) {
      filters.priceMin = entities.price_min * 1000;
    }

    if (entities.price_max) {
      filters.priceMax = entities.price_max * 1000;
    }

    // Square footage
    if (entities.sqft_min) {
      filters.sqftMin = entities.sqft_min;
    }

    if (entities.sqft_max) {
      filters.sqftMax = entities.sqft_max;
    }

    // Boolean filters
    if (entities.waterfront !== undefined) {
      filters.waterfront = entities.waterfront;
    }

    // Keywords from amenities
    if (entities.keywords && entities.keywords.length > 0) {
      filters.keywords = entities.keywords;
    }

    return filters;
  }, [entities]);
}
