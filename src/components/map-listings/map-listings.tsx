import React, { useRef, useEffect, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { PropertyPreviewModal } from "../property-preview-modal/property-preview-modal";

export interface MapListingsProps {
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
}

interface ClusterFeature {
  type: "Feature";
  properties: {
    count: number;
    precision: number;
    id: string;
  };
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}

interface PropertyFeature {
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

interface Coordinate {
  lat: number;
  lng: number;
}

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface AutoCenterData {
  center: [number, number];
}

// Price formatting is handled by Mapbox GL expressions in the price-text layer

// Utility functions for auto-centering

/**
 * Extract coordinates from various API response formats
 */
const extractCoordinates = (listing: any): Coordinate | null => {
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
const getPolygonBounds = (coordinates: Coordinate[]): MapBounds | null => {
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
const calculateAverageCenter = (
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

  const totalListings = coordinates.length;
  const densityRatio = maxDensity / totalListings;

  console.log(
    `📍 Density-weighted center: [${center[0].toFixed(4)}, ${center[1].toFixed(
      4
    )}] (density: ${densityRatio.toFixed(2)})`
  );

  return center;
};


/**
 * Cache management for auto-center data
 */
const getCachedAutoCenter = (apiKey: string): AutoCenterData | null => {
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
    console.warn("Failed to retrieve cached auto-center data:", error);
  }
  return null;
};

const setCachedAutoCenter = (apiKey: string, data: AutoCenterData): void => {
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
    console.warn("Failed to cache auto-center data:", error);
  }
};

/**
 * Auto-detect optimal map center from listings data using bundled searches
 */
const detectAutoCenter = async (
  apiKey: string,
  method: "average" | "city" = "average"
): Promise<AutoCenterData | null> => {
  try {
    console.log(`🎯 Auto-detecting map center using ${method} method with bundled search...`);

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

    if (!response.ok) {
      throw new Error(
        `Bundled auto-center API Error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("📊 Bundled response:", data);

    // Extract clusters and listings from bundled response
    const clusterData = data[0] || {}; // First query result (clusters)
    const listingData = data[1] || {}; // Second query result (listings)

    const clusters = clusterData.aggregates?.map?.clusters || clusterData.clusters || [];
    const listings = listingData.listings || listingData.results || [];

    console.log(`📊 Bundled data: ${clusters.length} clusters, ${listings.length} listings`);

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
          console.log(
            `🏆 Largest cluster center: ${maxCount} listings at [${center[0].toFixed(
              4
            )}, ${center[1].toFixed(4)}]`
          );

          // Cache the result with method-specific key
          setCachedAutoCenter(`${apiKey}-${method}`, autoCenter);
          return autoCenter;
        }
      }

      console.warn(
        "⚠️ Largest cluster method failed, falling back to average method"
      );
    }

    // Average method (or fallback)
    if (listings.length === 0) {
      console.warn("⚠️ No listings found for auto-center detection");
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
      console.warn("⚠️ No valid coordinates found in listings");
      return null;
    }

    // Calculate bounds and center using average method
    const bounds = getPolygonBounds(coordinates);
    if (!bounds) {
      console.warn("⚠️ Could not calculate bounds from coordinates");
      return null;
    }

    const center = calculateAverageCenter(coordinates, bounds);
    const autoCenter: AutoCenterData = { center };
    console.log(
      `✅ Average-based center detected: [${autoCenter.center[0]}, ${autoCenter.center[1]}] from ${coordinates.length} properties`
    );

    // Cache the result with method-specific key
    setCachedAutoCenter(`${apiKey}-${method}`, autoCenter);

    return autoCenter;
  } catch (error) {
    console.error("❌ Auto-center detection failed:", error);
    return null;
  }
};

/**
 * MapListings Component
 *
 * A high-performance real estate map component that displays property listings
 * using server-side clustering from the Repliers API. Automatically adjusts
 * cluster precision based on zoom level for optimal user experience.
 *
 * Features:
 * - Server-side clustering for optimal performance
 * - Zoom-based precision adjustment
 * - Hierarchical cluster drilling
 * - Minimal API calls
 * - Property count display
 */
export function MapListings({
  apiKey,
  mapboxToken,
  initialCenter,
  initialZoom,
  height = "100%",
  width = "100%",
  mapStyle = "mapbox://styles/mapbox/streets-v12",
  centerCalculation = "average",
}: MapListingsProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(
    initialCenter || null
  );
  const [mapZoom, setMapZoom] = useState<number | null>(initialZoom || null);
  const currentZoomLevel = useRef<number | null>(null);
  const lastFetchParams = useRef<{ bounds: string; zoom: number } | null>(null);

  // Modal state for property preview
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<any>(null);

  // Auto-center detection effect
  useEffect(() => {
    const performAutoCenter = async () => {
      if (mapCenter && mapZoom) return; // Already have center/zoom

      // Check cache first with method-specific key
      const cached = getCachedAutoCenter(`${apiKey}-${centerCalculation}`);
      if (cached) {
        console.log(
          `📦 Using cached ${centerCalculation} auto-center data:`,
          cached
        );
        setMapCenter(cached.center);
        setMapZoom(initialZoom || 10); // Use prop or fallback
        return;
      }

      // Perform detection
      const detected = await detectAutoCenter(apiKey, centerCalculation);
      if (detected) {
        setMapCenter(detected.center);
        setMapZoom(initialZoom || 10); // Use prop or fallback
      } else {
        // Fallback to default
        console.log("🗺️ Using fallback center: Continental USA");
        setMapCenter([-98.5795, 39.8283]);
        setMapZoom(initialZoom || 10); // Use prop or fallback
      }
    };

    performAutoCenter();
  }, [apiKey, mapCenter, mapZoom, centerCalculation, initialZoom]);

  // Get cluster precision based on zoom level (more aggressive to break up large clusters)
  const getClusterPrecision = useCallback((zoom: number): number => {
    if (zoom <= 6) return 5; // Continental level (increased from 3)
    if (zoom <= 8) return 8; // State/Province level (increased from 5)
    if (zoom <= 10) return 12; // Metropolitan level (increased from 8)
    if (zoom <= 12) return 16; // City level (increased from 12)
    if (zoom <= 14) return 20; // District level (increased from 16)
    return 25; // Street level (increased from 20, max precision for fine-grained clustering)
  }, []);

  // Convert bounds to polygon format for Repliers API
  const boundsToPolygon = useCallback((bounds: mapboxgl.LngLatBounds) => {
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    return [
      [
        [sw.lng, sw.lat],
        [ne.lng, sw.lat],
        [ne.lng, ne.lat],
        [sw.lng, ne.lat],
        [sw.lng, sw.lat], // Close the polygon
      ],
    ];
  }, []);

  // Fetch clusters from Repliers API
  const fetchClusters = useCallback(
    async (bounds: mapboxgl.LngLatBounds) => {
      if (!map.current) return;

      const zoom = map.current.getZoom();
      const precision = getClusterPrecision(zoom);

      // Create bounds key for comparison
      const boundsKey = JSON.stringify(boundsToPolygon(bounds));
      const roundedZoom = Math.round(zoom * 2) / 2; // Round to 0.5 precision for optimization

      // Check if this is a duplicate request
      if (lastFetchParams.current &&
          lastFetchParams.current.bounds === boundsKey &&
          Math.abs(lastFetchParams.current.zoom - roundedZoom) < 0.5) {
        console.log(`⏭️ Skipping duplicate request (zoom: ${zoom.toFixed(1)}, similar to last: ${lastFetchParams.current.zoom.toFixed(1)})`);
        return;
      }

      // Update last fetch params
      lastFetchParams.current = { bounds: boundsKey, zoom: roundedZoom };

      // Track zoom level changes and detect threshold crossing
      const wasHighZoom = currentZoomLevel.current !== null && currentZoomLevel.current >= 13;
      const isHighZoom = zoom >= 13;

      if (currentZoomLevel.current !== null && wasHighZoom !== isHighZoom) {
        console.log(`🎚️ Zoom threshold crossed: ${wasHighZoom ? 'HIGH→LOW' : 'LOW→HIGH'} (${currentZoomLevel.current.toFixed(1)} → ${zoom.toFixed(1)})`);
      }

      currentZoomLevel.current = zoom;

      console.log(
        `🔍 Fetching clusters - zoom: ${zoom.toFixed(
          1
        )}, precision: ${precision}, enhanced: ${zoom >= 13 ? 'YES' : 'NO'}`
      );

      setError(null);

      try {
        const url = new URL("https://api.repliers.io/listings");
        url.searchParams.set("cluster", "true");
        url.searchParams.set("clusterPrecision", precision.toString());
        url.searchParams.set("clusterLimit", "100");
        url.searchParams.set("status", "A");
        url.searchParams.set("map", JSON.stringify(boundsToPolygon(bounds)));
        url.searchParams.set("key", apiKey);

        // At high zoom levels, also get individual properties
        if (zoom >= 13) {
          url.searchParams.set("listings", "true");
          url.searchParams.set(
            "fields",
            "mlsNumber,listPrice,address,details.numBedrooms,details.numBathrooms,details.propertyType,images,status,class,type,lastStatus"
          );
          url.searchParams.set(
            "clusterFields",
            "mlsNumber,listPrice,coordinates"
          );
          url.searchParams.set("pageSize", "200");
        } else {
          url.searchParams.set("listings", "false");
        }

        const response = await fetch(url.toString(), {
          headers: {
            "REPLIERS-API-KEY": apiKey,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            `API Error: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("📊 API Response:", data);

        // Process clusters - they're nested under aggregates.map.clusters
        const clusters = data.aggregates?.map?.clusters || data.clusters || [];
        const clusterFeatures: ClusterFeature[] = [];
        const singlePropertyFeatures: PropertyFeature[] = [];

        clusters.forEach((cluster: any, index: number) => {
          const originalCoordinates = [
            cluster.location?.longitude ||
              cluster.coordinates?.lng ||
              cluster.longitude ||
              cluster.center?.lng,
            cluster.location?.latitude ||
              cluster.coordinates?.lat ||
              cluster.latitude ||
              cluster.center?.lat,
          ];

          // If cluster has only 1 property, treat as individual property
          if (cluster.count === 1) {
            singlePropertyFeatures.push({
              type: "Feature" as const,
              properties: {
                mlsNumber: cluster.mlsNumber || `single-${index}`,
                listPrice: cluster.listPrice,
                propertyType: cluster.propertyType || cluster.status || "Sale",
                isProperty: true as const,
              },
              geometry: {
                type: "Point" as const,
                coordinates: [
                  originalCoordinates[0],
                  originalCoordinates[1],
                ] as [number, number],
              },
            });
          } else {
            // For multi-property clusters, try to position bubble over densest sub-area
            let clusterCoordinates = originalCoordinates;

            // If we have sub-cluster data or property list, find densest position
            if (cluster.properties && Array.isArray(cluster.properties)) {
              const subCoords: Coordinate[] = [];
              cluster.properties.forEach((prop: any) => {
                const coord = extractCoordinates(prop);
                if (coord) subCoords.push(coord);
              });

              if (subCoords.length > 0) {
                // Find densest sub-area within this cluster using average method
                const clusterBounds = getPolygonBounds(subCoords);
                if (clusterBounds) {
                  const avgCenter = calculateAverageCenter(
                    subCoords,
                    clusterBounds
                  );
                  clusterCoordinates = avgCenter;
                  console.log(
                    `🎯 Adjusted cluster ${index} position for density (${subCoords.length} properties)`
                  );
                }
              }
            }

            clusterFeatures.push({
              type: "Feature" as const,
              properties: {
                count: cluster.count || 1,
                precision: cluster.precision || precision,
                id: `cluster-${index}`,
              },
              geometry: {
                type: "Point" as const,
                coordinates: [clusterCoordinates[0], clusterCoordinates[1]] as [
                  number,
                  number
                ],
              },
            });
          }
        });

        // Process individual properties (at high zoom)
        const propertyFeatures: PropertyFeature[] = (data.listings || []).map(
          (listing: any) => {
            const baseProperties = {
              mlsNumber: listing.mlsNumber,
              listPrice: listing.listPrice,
              propertyType: listing.propertyType || listing.details?.propertyType || listing.type || listing.status || "Sale",
              isProperty: true as const,
            };

            // Add enhanced fields when available (zoom 13+)
            const enhancedProperties = zoom >= 13 ? {
              address: listing.address,
              details: listing.details,
              images: listing.images,
              type: listing.type,
              lastStatus: listing.lastStatus,
              status: listing.status,
              class: listing.class,
            } : {};

            return {
              type: "Feature" as const,
              properties: { ...baseProperties, ...enhancedProperties },
              geometry: {
                type: "Point" as const,
                coordinates: [
                  listing.coordinates?.lng || listing.longitude,
                  listing.coordinates?.lat || listing.latitude,
                ] as [number, number],
              },
            };
          }
        );

        // Log detailed property data when enhanced fields are available
        if (zoom >= 13 && data.listings && data.listings.length > 0) {
          console.log(`📊 Enhanced property data (${data.listings.length} listings):`, data.listings.slice(0, 2)); // Log first 2 for brevity
          console.log(`🏠 Sample property fields:`, Object.keys(data.listings[0] || {}));
          console.log(`💰 Sample prices:`, data.listings.slice(0, 3).map((l: any) => ({
            mls: l.mlsNumber,
            price: l.listPrice,
            type: l.propertyType || l.type || l.status
          })));

          // Log enhanced field details
          const sampleListing = data.listings[0];
          if (sampleListing) {
            console.log(`🏡 Enhanced fields test:`, {
              address: sampleListing.address,
              details: sampleListing.details,
              images: sampleListing.images?.slice(0, 2), // First 2 images
              type: sampleListing.type,
              lastStatus: sampleListing.lastStatus,
              status: sampleListing.status,
              class: sampleListing.class
            });
          }
        }

        // Combine features
        const allFeatures = [
          ...clusterFeatures,
          ...singlePropertyFeatures,
          ...propertyFeatures,
        ];

        console.log("🔧 Debug info:");
        console.log("- Raw clusters from API:", clusters);
        console.log("- Processed cluster features:", clusterFeatures);
        console.log("- Property features with enhanced data:", propertyFeatures);
        console.log("- All features for map:", allFeatures);

        // Test enhanced data storage in features
        if (zoom >= 13 && propertyFeatures.length > 0) {
          console.log(`🎯 Testing enhanced data storage in features:`);
          const sampleFeature = propertyFeatures[0];
          console.log(`- Sample feature properties:`, sampleFeature.properties);
          console.log(`- Has enhanced address:`, !!sampleFeature.properties.address);
          console.log(`- Has enhanced details:`, !!sampleFeature.properties.details);
          console.log(`- Has images:`, !!sampleFeature.properties.images?.length);
        }

        // Update map source
        const source = map.current.getSource(
          "listings"
        ) as mapboxgl.GeoJSONSource;
        if (source) {
          source.setData({
            type: "FeatureCollection",
            features: allFeatures,
          });
          console.log(
            "✅ Map source updated with",
            allFeatures.length,
            "features"
          );
        } else {
          console.error("❌ Map source 'listings' not found");
        }

        // Update total count
        const total =
          data.count ||
          clusterFeatures.reduce(
            (sum, feature) => sum + feature.properties.count,
            0
          );
        setTotalCount(total);

        console.log(
          `✅ Loaded ${clusterFeatures.length} clusters, ${propertyFeatures.length} properties, ${total} total`
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load listings";
        setError(errorMessage);
        console.error("❌ Fetch failed:", err);
      }
    },
    [apiKey, getClusterPrecision, boundsToPolygon]
  );

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current || !mapCenter || mapZoom === null)
      return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: mapCenter,
      zoom: mapZoom,
    });

    map.current.on("load", () => {
      if (!map.current) return;

      // Add source for listings
      map.current.addSource("listings", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      // Add cluster layer
      map.current.addLayer({
        id: "clusters",
        type: "circle",
        source: "listings",
        filter: ["has", "count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "count"],
            "#51bbd6", // 1-49: Blue
            50,
            "#f1c40f", // 50-499: Yellow
            500,
            "#f28cb1", // 500-1499: Pink
            1500,
            "#e74c3c", // 1500-2000: Red
          ],
          "circle-radius": [
            "step",
            ["get", "count"],
            10, // 1-49: Small (10px)
            50,
            14, // 50-499: Medium (14px)
            500,
            18, // 500-1499: Large (18px)
            1500,
            22, // 1500-2000: Extra Large (22px)
          ],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
          "circle-opacity": 0.8,
        },
      });

      // Add cluster count text
      map.current.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "listings",
        filter: ["has", "count"],
        layout: {
          "text-field": ["get", "count"],
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": [
            "step",
            ["get", "count"],
            10, // 1-49: Small text (10px)
            50,
            12, // 50-499: Medium text (12px)
            500,
            14, // 500-1499: Large text (14px)
            1500,
            16, // 1500-2000: Extra large text (16px)
          ],
        },
        paint: {
          "text-color": "#ffffff",
        },
      });

      // Add individual property dots layer (small circles)
      map.current.addLayer({
        id: "property-dots",
        type: "circle",
        source: "listings",
        filter: ["has", "isProperty"],
        paint: {
          "circle-color": "#374151",
          "circle-radius": 3,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
          "circle-opacity": 0.9,
        },
      });

      // Add price text layer with simplified formatting
      map.current.addLayer({
        id: "price-text",
        type: "symbol",
        source: "listings",
        filter: ["all", ["has", "isProperty"], ["has", "listPrice"]],
        layout: {
          "text-field": [
            "case",
            // Lease properties (typically thousands)
            ["==", ["get", "propertyType"], "Lease"],
            [
              "concat",
              "$",
              [
                "case",
                [">=", ["get", "listPrice"], 1000],
                [
                  "concat",
                  [
                    "case",
                    ["==", ["%", ["get", "listPrice"], 1000], 0],
                    ["to-string", ["/", ["get", "listPrice"], 1000]], // Whole thousands: 3K
                    [
                      "concat",
                      ["to-string", ["round", ["/", ["get", "listPrice"], 100]]], // Round to tenths: 3.2K
                      ["==", ["%", ["round", ["/", ["get", "listPrice"], 100]], 10], 0], "",
                      ".", ["%", ["round", ["/", ["get", "listPrice"], 100]], 10]
                    ]
                  ],
                  "K"
                ],
                ["to-string", ["get", "listPrice"]] // Under 1000: show full amount
              ]
            ],
            // Sale properties (typically hundreds of thousands or millions)
            [
              "concat",
              "$",
              [
                "case",
                [">=", ["get", "listPrice"], 1000000],
                [
                  "concat",
                  [
                    "case",
                    ["==", ["%", ["get", "listPrice"], 1000000], 0],
                    ["to-string", ["/", ["get", "listPrice"], 1000000]], // Whole millions: 3M
                    [
                      "concat",
                      ["to-string", ["round", ["/", ["get", "listPrice"], 100000]]],
                      ".", ["%", ["round", ["/", ["get", "listPrice"], 100000]], 10]
                    ]
                  ],
                  "M"
                ],
                [">=", ["get", "listPrice"], 1000],
                [
                  "concat",
                  ["to-string", ["round", ["/", ["get", "listPrice"], 1000]]],
                  "K"
                ],
                ["to-string", ["get", "listPrice"]] // Under 1000: show full amount
              ]
            ]
          ],
          "text-font": ["DIN Offc Pro Bold", "Arial Unicode MS Bold"],
          "text-size": 11,
          "text-offset": [0, -1.8], // Position above dots
          "text-anchor": "bottom",
        },
        paint: {
          "text-color": "#ffffff",
          "text-halo-color": [
            "case",
            ["==", ["get", "propertyType"], "Lease"],
            "#a855f7", // Purple for lease
            "#22c55e", // Green for sale (default)
          ],
          "text-halo-width": 2.5,
          "text-opacity": 1.0,
        },
      });

      // Click handler for clusters
      map.current.on("click", "clusters", (e) => {
        if (!map.current || !e.features?.[0]) return;

        const feature = e.features[0];
        const coordinates = (feature.geometry as any).coordinates;
        const count = feature.properties?.count;

        // Calculate zoom level to drill down
        const currentZoom = map.current.getZoom();
        const targetZoom = Math.min(currentZoom + 4, 16);

        console.log(`🎯 Cluster clicked - Current zoom: ${currentZoom.toFixed(1)} → Target zoom: ${targetZoom.toFixed(1)}`);

        map.current.easeTo({
          center: coordinates,
          zoom: targetZoom,
          duration: 1000,
          easing: (t) => t * (2 - t), // Smooth ease-out animation
        });
      });

      // Click handler for individual properties (both dots and text)
      const handlePropertyClick = (
        e: mapboxgl.MapMouseEvent & {
          features?: mapboxgl.MapboxGeoJSONFeature[] | undefined;
        }
      ) => {
        if (!e.features?.[0]) return;

        const feature = e.features[0];
        const properties = feature.properties;

        console.log("🏠 Property clicked:", properties);

        // Create listing object for modal from feature properties
        const listing = {
          mlsNumber: properties?.mlsNumber || "N/A",
          listPrice: properties?.listPrice || 0,
          address: properties?.address,
          details: properties?.details,
          images: properties?.images,
          type: properties?.type,
          lastStatus: properties?.lastStatus,
          status: properties?.status,
        };

        console.log("📋 Opening modal with listing:", listing);

        setSelectedListing(listing);
        setModalOpen(true);
      };

      map.current.on("click", "property-dots", handlePropertyClick);
      map.current.on("click", "price-text", handlePropertyClick);

      // Hover cursors
      map.current.on("mouseenter", "clusters", () => {
        if (map.current) map.current.getCanvas().style.cursor = "pointer";
      });
      map.current.on("mouseleave", "clusters", () => {
        if (map.current) map.current.getCanvas().style.cursor = "";
      });
      map.current.on("mouseenter", "property-dots", () => {
        if (map.current) map.current.getCanvas().style.cursor = "pointer";
      });
      map.current.on("mouseleave", "property-dots", () => {
        if (map.current) map.current.getCanvas().style.cursor = "";
      });
      map.current.on("mouseenter", "price-text", () => {
        if (map.current) map.current.getCanvas().style.cursor = "pointer";
      });
      map.current.on("mouseleave", "price-text", () => {
        if (map.current) map.current.getCanvas().style.cursor = "";
      });

      // Initial data fetch
      const bounds = map.current.getBounds();
      if (bounds) {
        fetchClusters(bounds);
      }
    });

    // Update data on map move
    map.current.on("moveend", () => {
      if (!map.current) return;
      const bounds = map.current.getBounds();
      if (bounds) {
        fetchClusters(bounds);
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken, mapStyle, mapCenter, mapZoom, fetchClusters]);

  return (
    <div style={{ width, height, position: "relative" }}>
      {/* Map Container */}
      <div
        ref={mapContainer}
        style={{ width: "100%", height: "100%" }}
        className="rounded-lg overflow-hidden"
      />


      {/* Property Count Display */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          padding: "8px 12px",
          borderRadius: "6px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          fontSize: "14px",
          fontWeight: "600",
          color: "#374151",
        }}
      >
        {error ? (
          <span style={{ color: "#ef4444" }}>Error</span>
        ) : (
          <span>{totalCount.toLocaleString()} properties</span>
        )}
      </div>


      {/* Error Message */}
      {error && (
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            left: "16px",
            right: "16px",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "6px",
            padding: "12px",
            color: "#b91c1c",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      {/* Property Preview Modal */}
      <PropertyPreviewModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        listing={selectedListing}
        onViewDetails={(mlsNumber) => {
          console.log("🔗 View details for MLS:", mlsNumber);
          // TODO: Implement navigation to full listing page
          // window.open(`/listings/${mlsNumber}`, '_blank');
        }}
      />
    </div>
  );
}
