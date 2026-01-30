import type { MapFilters } from '../types';

/**
 * Parse Repliers NLP API URL response into filter state
 * Example URL: https://api.repliers.io/listings?propertyType=Condo%20Apt&minBeds=2&city=Toronto
 */
export function parseNLPUrl(url: string): Partial<MapFilters> {
  const urlObj = new URL(url);
  const params = urlObj.searchParams;

  const filters: Partial<MapFilters> = {};

  // Property Type
  const propertyType = params.get('propertyType');
  if (propertyType) {
    filters.propertyTypes = propertyType.split(',').map(t => t.trim());
  }

  // Bedrooms
  const minBeds = params.get('minBeds');
  if (minBeds) {
    const bedroomValue = parseInt(minBeds);
    if (bedroomValue === 0) filters.bedrooms = '0';
    else if (bedroomValue === 1) filters.bedrooms = '1';
    else if (bedroomValue === 2) filters.bedrooms = '2';
    else if (bedroomValue === 3) filters.bedrooms = '3';
    else if (bedroomValue === 4) filters.bedrooms = '4';
    else if (bedroomValue >= 5) filters.bedrooms = '5+';
  }

  // Bathrooms
  const minBaths = params.get('minBaths');
  if (minBaths) {
    const bathroomValue = parseInt(minBaths);
    if (bathroomValue === 1) filters.bathrooms = '1+';
    else if (bathroomValue === 2) filters.bathrooms = '2+';
    else if (bathroomValue === 3) filters.bathrooms = '3+';
    else if (bathroomValue === 4) filters.bathrooms = '4+';
    else if (bathroomValue >= 5) filters.bathrooms = '5+';
  }

  // Price Range
  const minPrice = params.get('minPrice');
  if (minPrice) filters.minPrice = parseInt(minPrice);

  const maxPrice = params.get('maxPrice');
  if (maxPrice) filters.maxPrice = parseInt(maxPrice);

  // Square Footage
  const minSqft = params.get('minSqft');
  if (minSqft) filters.minSqft = parseInt(minSqft);

  const maxSqft = params.get('maxSqft');
  if (maxSqft) filters.maxSqft = parseInt(maxSqft);

  // Garage/Parking
  const minParkingSpaces = params.get('minParkingSpaces');
  if (minParkingSpaces) {
    filters.garageSpaces = `${minParkingSpaces}+` as any;
  }

  // Listing Type (sale vs lease)
  const type = params.get('type');
  if (type === 'sale' || type === 'Sale') filters.listingType = 'sale';
  else if (type === 'lease' || type === 'Lease') filters.listingType = 'lease';

  // Status
  const status = params.get('status');
  if (status === 'A') filters.activeListingDays = 'all';
  else if (status === 'U') filters.unavailableListingDays = 'all';
  else if (status === 'S') filters.soldListingDays = 'all';

  // Location - City
  const city = params.get('city');
  if (city) filters.city = city;

  // Location - Neighborhood
  const neighborhood = params.get('neighborhood');
  if (neighborhood) filters.neighborhood = neighborhood;

  // Location - Map polygon
  const map = params.get('map');
  if (map) {
    try {
      const parsed = JSON.parse(map);
      if (Array.isArray(parsed)) {
        filters.map = parsed;
      }
    } catch (e) {
      // Invalid map format, ignore
    }
  }

  return filters;
}

/**
 * Extract summary text from NLP response for display
 */
export function extractNLPSummary(response: {
  request: { summary: string };
}): string {
  return response.request.summary || '';
}

/**
 * Check if NLP response includes image search items
 */
export function hasImageSearch(response: {
  request: { body: { imageSearchItems?: any[] } | null };
}): boolean {
  return Boolean(
    response.request.body?.imageSearchItems &&
    response.request.body.imageSearchItems.length > 0
  );
}
