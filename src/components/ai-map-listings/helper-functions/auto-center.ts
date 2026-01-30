import { Coordinate, MapBounds, AutoCenterData } from "../types";

/**
 * Extract coordinates from various API response formats
 */
export const extractCoordinates = (listing: any): Coordinate | null => {
  // Try different coordinate formats
  if (listing.coordinates?.lat && listing.coordinates?.lng) {
    return { lat: listing.coordinates.lat, lng: listing.coordinates.lng };
  }
  if (listing.latitude && listing.longitude) {
    return { lat: listing.latitude, lng: listing.longitude };
  }
  if (listing.map?.latitude && listing.map?.longitude) {
    return { lat: listing.map.latitude, lng: listing.map.longitude };
  }
  // Also check cluster coordinate formats
  if (listing.location?.latitude && listing.location?.longitude) {
    return { lat: listing.location.latitude, lng: listing.location.longitude };
  }
  if (listing.center?.lat && listing.center?.lng) {
    return { lat: listing.center.lat, lng: listing.center.lng };
  }
  return null;
};

/**
 * Calculate bounds from an array of coordinates
 */
export const getPolygonBounds = (coordinates: Coordinate[]): MapBounds | null => {
  if (coordinates.length === 0) return null;

  let north = coordinates[0].lat;
  let south = coordinates[0].lat;
  let east = coordinates[0].lng;
  let west = coordinates[0].lng;

  coordinates.forEach((coord) => {
    north = Math.max(north, coord.lat);
    south = Math.min(south, coord.lat);
    east = Math.max(east, coord.lng);
    west = Math.min(west, coord.lng);
  });

  return { north, south, east, west };
};

/**
 * Calculate density-weighted center from coordinates (original grid method)
 */
export const calculateAverageCenter = (
  coordinates: Coordinate[],
  bounds: MapBounds
): [number, number] => {
  const { north, south, east, west } = bounds;

  // Create a density grid to find the densest area
  const gridSize = 20; // 20x20 grid for density calculation
  const latStep = (north - south) / gridSize;
  const lngStep = (east - west) / gridSize;

  // Initialize density grid
  const densityGrid: number[][] = Array(gridSize)
    .fill(0)
    .map(() => Array(gridSize).fill(0));

  // Count listings in each grid cell
  coordinates.forEach((coord) => {
    const latIndex = Math.floor((coord.lat - south) / latStep);
    const lngIndex = Math.floor((coord.lng - west) / lngStep);

    // Ensure indices are within bounds
    const safeLatIndex = Math.max(0, Math.min(gridSize - 1, latIndex));
    const safeLngIndex = Math.max(0, Math.min(gridSize - 1, lngIndex));

    densityGrid[safeLatIndex][safeLngIndex]++;
  });

  // Find the densest grid cell
  let maxDensity = 0;
  let densestLat = 0;
  let densestLng = 0;

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (densityGrid[i][j] > maxDensity) {
        maxDensity = densityGrid[i][j];
        densestLat = south + (i + 0.5) * latStep; // Center of grid cell
        densestLng = west + (j + 0.5) * lngStep;
      }
    }
  }

  // If no dense area found, fall back to geometric center
  const center: [number, number] =
    maxDensity > 0
      ? [densestLng, densestLat]
      : [(east + west) / 2, (north + south) / 2];

  return center;
};

/**
 * Cache management for auto-center data
 */
export const getCachedAutoCenter = (apiKey: string): AutoCenterData | null => {
  try {
    const cached = localStorage.getItem(`mapListings-autoCenter-${apiKey}`);
    if (cached) {
      const data = JSON.parse(cached);
      // Check if cache is less than 24 hours old
      if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
        return { center: data.center };
      }
    }
  } catch (error) {
    // Silently fail
  }
  return null;
};

export const setCachedAutoCenter = (apiKey: string, data: AutoCenterData): void => {
  try {
    const cacheData = {
      ...data,
      timestamp: Date.now(),
    };
    localStorage.setItem(
      `mapListings-autoCenter-${apiKey}`,
      JSON.stringify(cacheData)
    );
  } catch (error) {
    // Silently fail
  }
};

/**
 * Auto-detect optimal map center from listings data using bundled searches
 */
export const detectAutoCenter = async (
  apiKey: string,
  method: "average" | "city" = "average"
): Promise<AutoCenterData | null> => {
  // Try bundled approach first, fallback to individual calls if 400 error
  try {
    // Use bundled search to get both clusters and listings in one request
    const bundledQuery = {
      queries: [
        {
          cluster: true,
          clusterPrecision: 8, // Low precision for bigger clusters
          clusterLimit: 50,
          status: "A"
        },
        {
          cluster: false,
          listings: true,
          pageSize: 500, // Get more listings for better center calculation
          status: "A"
        }
      ]
    };

    const response = await fetch("https://api.repliers.io/listings", {
      method: "POST",
      headers: {
        "REPLIERS-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bundledQuery),
    });

    if (response.status === 400) {
      return detectAutoCenterFallback(apiKey, method);
    }

    if (!response.ok) {
      throw new Error(
        `Bundled auto-center API Error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Extract clusters and listings from bundled response
    const clusterData = data[0] || {}; // First query result (clusters)
    const listingData = data[1] || {}; // Second query result (listings)

    const clusters = clusterData.aggregates?.map?.clusters || clusterData.clusters || [];
    const listings = listingData.listings || listingData.results || [];

    if (method === "city" && clusters.length > 0) {
      // Find the cluster with the most listings
      let largestCluster = null;
      let maxCount = 0;

      clusters.forEach((cluster: any) => {
        const count = cluster.count || 0;
        if (count > maxCount) {
          maxCount = count;
          largestCluster = cluster;
        }
      });

      if (largestCluster) {
        // Extract coordinates from the largest cluster
        const coordinates = [
          (largestCluster as any).location?.longitude ||
            (largestCluster as any).coordinates?.lng ||
            (largestCluster as any).longitude ||
            (largestCluster as any).center?.lng,
          (largestCluster as any).location?.latitude ||
            (largestCluster as any).coordinates?.lat ||
            (largestCluster as any).latitude ||
            (largestCluster as any).center?.lat,
        ];

        if (coordinates[0] && coordinates[1]) {
          const center: [number, number] = [coordinates[0], coordinates[1]];
          const autoCenter: AutoCenterData = { center };

          // Cache the result with method-specific key
          setCachedAutoCenter(`${apiKey}-${method}`, autoCenter);
          return autoCenter;
        }
      }
    }

    // Average method (or fallback)
    if (listings.length === 0) {
      return null;
    }

    // Extract coordinates from listings
    const coordinates: Coordinate[] = [];
    listings.forEach((listing: any) => {
      const coord = extractCoordinates(listing);
      if (coord) {
        coordinates.push(coord);
      }
    });

    if (coordinates.length === 0) {
      return null;
    }

    // Calculate bounds and center using average method
    const bounds = getPolygonBounds(coordinates);
    if (!bounds) {
      return null;
    }

    const center = calculateAverageCenter(coordinates, bounds);
    const autoCenter: AutoCenterData = { center };

    // Cache the result with method-specific key
    setCachedAutoCenter(`${apiKey}-${method}`, autoCenter);

    return autoCenter;
  } catch (error) {
    // Try fallback approach for non-400 errors too
    return detectAutoCenterFallback(apiKey, method);
  }
};

/**
 * Fallback auto-center detection using individual API calls
 */
export const detectAutoCenterFallback = async (
  apiKey: string,
  method: "average" | "city" = "average"
): Promise<AutoCenterData | null> => {
  try {
    let clusters: any[] = [];
    let listings: any[] = [];

    // First, try to get clusters for city method
    if (method === "city") {
      try {
        const clusterUrl = new URL("https://api.repliers.io/listings");
        clusterUrl.searchParams.set("cluster", "true");
        clusterUrl.searchParams.set("clusterPrecision", "8");
        clusterUrl.searchParams.set("clusterLimit", "50");
        clusterUrl.searchParams.set("status", "A");

        const clusterResponse = await fetch(clusterUrl.toString(), {
          headers: {
            "REPLIERS-API-KEY": apiKey,
            "Content-Type": "application/json",
          },
        });

        if (clusterResponse.ok) {
          const clusterData = await clusterResponse.json();
          clusters = clusterData.aggregates?.map?.clusters || clusterData.clusters || [];
        }
      } catch (error) {
        // Cluster fetch failed in fallback
      }
    }

    // Get individual listings for average method or as fallback for city method
    try {
      const listingUrl = new URL("https://api.repliers.io/listings");
      listingUrl.searchParams.set("pageSize", "500");
      listingUrl.searchParams.set("status", "A");

      const listingResponse = await fetch(listingUrl.toString(), {
        headers: {
          "REPLIERS-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
      });

      if (listingResponse.ok) {
        const listingData = await listingResponse.json();
        listings = listingData.listings || listingData.results || [];
      }
    } catch (error) {
      // Listing fetch failed in fallback
    }

    // Process the same way as bundled approach
    if (method === "city" && clusters.length > 0) {
      // Find the cluster with the most listings
      let largestCluster = null;
      let maxCount = 0;

      clusters.forEach((cluster: any) => {
        const count = cluster.count || 0;
        if (count > maxCount) {
          maxCount = count;
          largestCluster = cluster;
        }
      });

      if (largestCluster) {
        // Extract coordinates from the largest cluster
        const coordinates = [
          (largestCluster as any).location?.longitude ||
            (largestCluster as any).coordinates?.lng ||
            (largestCluster as any).longitude ||
            (largestCluster as any).center?.lng,
          (largestCluster as any).location?.latitude ||
            (largestCluster as any).coordinates?.lat ||
            (largestCluster as any).latitude ||
            (largestCluster as any).center?.lat,
        ];

        if (coordinates[0] && coordinates[1]) {
          const center: [number, number] = [coordinates[0], coordinates[1]];
          const autoCenter: AutoCenterData = { center };

          // Cache the result with method-specific key
          setCachedAutoCenter(`${apiKey}-${method}`, autoCenter);
          return autoCenter;
        }
      }
    }

    // Average method (or fallback)
    if (listings.length === 0) {
      return null;
    }

    // Extract coordinates from listings
    const coordinates: Coordinate[] = [];
    listings.forEach((listing: any) => {
      const coord = extractCoordinates(listing);
      if (coord) {
        coordinates.push(coord);
      }
    });

    if (coordinates.length === 0) {
      return null;
    }

    // Calculate bounds and center using average method
    const bounds = getPolygonBounds(coordinates);
    if (!bounds) {
      return null;
    }

    const center = calculateAverageCenter(coordinates, bounds);
    const autoCenter: AutoCenterData = { center };

    // Cache the result with method-specific key
    setCachedAutoCenter(`${apiKey}-${method}`, autoCenter);

    return autoCenter;
  } catch (error) {
    return null;
  }
};
