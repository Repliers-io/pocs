/**
 * Geocode a location (neighborhood, city, etc.) using the Repliers Locations API
 */
export async function geocodeLocation(
  apiKey: string,
  params: {
    neighborhood?: string;
    city?: string;
    area?: string;
  }
): Promise<{
  center: [number, number];
  bounds?: number[][][];
  zoom: number;
} | null> {
  try {
    const url = new URL('https://api.repliers.io/locations');

    // Add search parameters
    if (params.neighborhood) {
      url.searchParams.set('name', params.neighborhood);
      url.searchParams.set('type', 'neighborhood');
    }

    if (params.city) {
      url.searchParams.set('city', params.city);
    }

    if (params.area) {
      url.searchParams.set('area', params.area);
    }

    // Request full map data
    url.searchParams.set('fields', 'name,type,locationId,map');

    const response = await fetch(url.toString(), {
      headers: {
        'REPLIERS-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Locations API error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    const locations = data.locations || [];

    if (locations.length === 0) {
      console.log('No locations found for:', params);
      return null;
    }

    // Use the first result
    const location = locations[0];
    const map = location.map;

    if (!map) {
      console.log('No map data in location response');
      return null;
    }

    // Extract center coordinates
    const center: [number, number] = [
      map.longitude || map.point?.[0],
      map.latitude || map.point?.[1],
    ];

    // Extract boundary if available
    let bounds: number[][][] | undefined;
    if (map.boundary && Array.isArray(map.boundary)) {
      bounds = [map.boundary]; // Wrap in array to match GeoJSON polygon format
    }

    // Determine appropriate zoom based on location type
    const zoom = location.type === 'neighborhood' ? 14 :
                 location.type === 'city' ? 11 :
                 location.type === 'area' ? 10 : 12;

    console.log('📍 Geocoded location:', {
      name: location.name,
      type: location.type,
      center,
      zoom,
      hasBounds: !!bounds,
    });

    return {
      center,
      bounds,
      zoom,
    };
  } catch (error) {
    console.error('Failed to geocode location:', error);
    return null;
  }
}
