import { useEffect } from 'react';
import type { Map as MapboxMap } from 'mapbox-gl';
import type { GeocodedLocation } from '../types';

/**
 * Geocode a location using Repliers Locations API
 *
 * @param location - Location name to geocode
 * @param apiKey - Repliers API key
 * @returns Geocoded coordinates or null
 */
async function geocodeLocation(
  location: string,
  apiKey: string
): Promise<GeocodedLocation | null> {
  try {
    const response = await fetch(
      `https://api.repliers.io/locations/autocomplete?search=${encodeURIComponent(location)}`,
      {
        headers: {
          'repliers-api-key': apiKey
        }
      }
    );

    if (!response.ok) {
      console.error('Geocoding failed:', response.status);
      return null;
    }

    const data = await response.json();

    if (data.locations && data.locations.length > 0) {
      const loc = data.locations[0];
      return {
        lng: loc.longitude,
        lat: loc.latitude,
        name: loc.name
      };
    }

    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

/**
 * Hook to auto-zoom map to searched location
 *
 * When a user searches for a location, this hook geocodes it and
 * smoothly animates the map to center on that location.
 *
 * @param map - Mapbox map instance
 * @param location - Location to zoom to
 * @param apiKey - Repliers API key for geocoding
 *
 * @example
 * useMapSync(map, "Toronto", repliersApiKey);
 * // Map flies to Toronto coordinates
 */
export function useMapSync(
  map: MapboxMap | null,
  location: string | undefined,
  apiKey: string
): void {
  useEffect(() => {
    // Skip if no map or location
    if (!map || !location || !apiKey) {
      return;
    }

    // Skip if map hasn't loaded yet
    if (!map.loaded()) {
      return;
    }

    // Geocode and fly to location
    geocodeLocation(location, apiKey)
      .then(coords => {
        if (coords) {
          console.log(`Flying to ${coords.name} (${coords.lat}, ${coords.lng})`);
          map.flyTo({
            center: [coords.lng, coords.lat],
            zoom: 12,
            duration: 1500,
            essential: true
          });
        } else {
          console.warn(`Could not geocode location: ${location}`);
        }
      })
      .catch(error => {
        console.error('Error in useMapSync:', error);
      });
  }, [map, location, apiKey]);
}
