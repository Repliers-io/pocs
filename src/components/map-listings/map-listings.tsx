import React, { useRef, useEffect, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

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
    isProperty: true;
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
  zoom: number;
}

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
 * Calculate center and optimal zoom from bounds
 */
const calculateCenterAndZoom = (bounds: MapBounds): AutoCenterData => {
  const { north, south, east, west } = bounds;
  
  const center: [number, number] = [
    (east + west) / 2, // longitude
    (north + south) / 2, // latitude
  ];

  // Calculate zoom based on bounds span
  const latSpan = north - south;
  const lngSpan = east - west;
  const maxSpan = Math.max(latSpan, lngSpan);

  // Zoom calculation based on span (rough approximation)
  let zoom = 10; // default
  if (maxSpan > 50) zoom = 3;
  else if (maxSpan > 20) zoom = 4;
  else if (maxSpan > 10) zoom = 5;
  else if (maxSpan > 5) zoom = 6;
  else if (maxSpan > 2) zoom = 7;
  else if (maxSpan > 1) zoom = 8;
  else if (maxSpan > 0.5) zoom = 9;
  else if (maxSpan > 0.25) zoom = 10;
  else if (maxSpan > 0.1) zoom = 11;
  else if (maxSpan > 0.05) zoom = 12;
  else zoom = 13;

  return { center, zoom };
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
        return { center: data.center, zoom: data.zoom };
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
    localStorage.setItem(`mapListings-autoCenter-${apiKey}`, JSON.stringify(cacheData));
  } catch (error) {
    console.warn("Failed to cache auto-center data:", error);
  }
};

/**
 * Auto-detect optimal map center and zoom from listings data
 */
const detectAutoCenter = async (apiKey: string): Promise<AutoCenterData | null> => {
  try {
    console.log("🎯 Auto-detecting map center from listings data...");

    // Make API call to get a sample of listings for center detection
    const url = new URL("https://api.repliers.io/listings");
    url.searchParams.set("cluster", "false");
    url.searchParams.set("listings", "true");
    url.searchParams.set("pageSize", "500"); // Get more listings for better center calculation
    url.searchParams.set("status", "A");
    url.searchParams.set("key", apiKey);

    const response = await fetch(url.toString(), {
      headers: {
        "REPLIERS-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Auto-center API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const listings = data.listings || data.results || [];

    if (!listings || listings.length === 0) {
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

    // Calculate bounds and center
    const bounds = getPolygonBounds(coordinates);
    if (!bounds) {
      console.warn("⚠️ Could not calculate bounds from coordinates");
      return null;
    }

    const autoCenter = calculateCenterAndZoom(bounds);
    console.log(`✅ Auto-center detected: [${autoCenter.center[0]}, ${autoCenter.center[1]}] at zoom ${autoCenter.zoom} from ${coordinates.length} properties`);

    // Cache the result
    setCachedAutoCenter(apiKey, autoCenter);

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
}: MapListingsProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(initialCenter || null);
  const [mapZoom, setMapZoom] = useState<number | null>(initialZoom || null);
  const [isDetectingCenter, setIsDetectingCenter] = useState(!initialCenter);

  // Auto-center detection effect
  useEffect(() => {
    const performAutoCenter = async () => {
      if (mapCenter && mapZoom) return; // Already have center/zoom
      
      setIsDetectingCenter(true);
      
      // Check cache first
      const cached = getCachedAutoCenter(apiKey);
      if (cached) {
        console.log("📦 Using cached auto-center data:", cached);
        setMapCenter(cached.center);
        setMapZoom(cached.zoom);
        setIsDetectingCenter(false);
        return;
      }
      
      // Perform detection
      const detected = await detectAutoCenter(apiKey);
      if (detected) {
        setMapCenter(detected.center);
        setMapZoom(detected.zoom);
      } else {
        // Fallback to default
        console.log("🗺️ Using fallback center: Continental USA");
        setMapCenter([-98.5795, 39.8283]);
        setMapZoom(4);
      }
      
      setIsDetectingCenter(false);
    };
    
    performAutoCenter();
  }, [apiKey, mapCenter, mapZoom]);

  // Get cluster precision based on zoom level
  const getClusterPrecision = useCallback((zoom: number): number => {
    if (zoom <= 8) return 5; // City level - very large clusters
    if (zoom <= 10) return 8; // District level
    if (zoom <= 12) return 12; // Neighborhood level
    if (zoom <= 14) return 16; // Street level
    return 20; // Individual properties
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

      console.log(
        `🔍 Fetching clusters - zoom: ${zoom.toFixed(
          1
        )}, precision: ${precision}`
      );

      setIsLoading(true);
      setError(null);

      try {
        const url = new URL("https://api.repliers.io/listings");
        url.searchParams.set("cluster", "true");
        url.searchParams.set("clusterPrecision", precision.toString());
        url.searchParams.set("clusterLimit", "200");
        url.searchParams.set("status", "A");
        url.searchParams.set("map", JSON.stringify(boundsToPolygon(bounds)));
        url.searchParams.set("key", apiKey);

        // At high zoom levels, also get individual properties
        if (zoom >= 14) {
          url.searchParams.set("listings", "true");
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
        const clusterFeatures: ClusterFeature[] = clusters.map(
          (cluster: any, index: number) => ({
            type: "Feature" as const,
            properties: {
              count: cluster.count || 1,
              precision: cluster.precision || precision,
              id: `cluster-${index}`,
            },
            geometry: {
              type: "Point" as const,
              coordinates: [
                cluster.location?.longitude ||
                  cluster.coordinates?.lng ||
                  cluster.longitude ||
                  cluster.center?.lng,
                cluster.location?.latitude ||
                  cluster.coordinates?.lat ||
                  cluster.latitude ||
                  cluster.center?.lat,
              ],
            },
          })
        );

        // Process individual properties (at high zoom)
        const propertyFeatures: PropertyFeature[] = (data.listings || []).map(
          (listing: any) => ({
            type: "Feature" as const,
            properties: {
              mlsNumber: listing.mlsNumber,
              listPrice: listing.listPrice,
              isProperty: true as const,
            },
            geometry: {
              type: "Point" as const,
              coordinates: [
                listing.coordinates?.lng || listing.longitude,
                listing.coordinates?.lat || listing.latitude,
              ],
            },
          })
        );

        // Combine features
        const allFeatures = [...clusterFeatures, ...propertyFeatures];

        console.log("🔧 Debug info:");
        console.log("- Raw clusters from API:", clusters);
        console.log("- Processed cluster features:", clusterFeatures);
        console.log("- All features for map:", allFeatures);

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
      } finally {
        setIsLoading(false);
      }
    },
    [apiKey, getClusterPrecision, boundsToPolygon]
  );

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current || !mapCenter || mapZoom === null) return;

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
            "#51bbd6", // 0-49: Blue
            50,
            "#f1c40f", // 50-499: Yellow
            500,
            "#f28cb1", // 500-1999: Pink
            2000,
            "#e74c3c", // 2000+: Red
          ],
          "circle-radius": [
            "step",
            ["get", "count"],
            15, // 0-49
            50,
            25, // 50-499
            500,
            35, // 500-1999
            2000,
            45, // 2000+
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
            12, // 0-49
            50,
            14, // 50-499
            500,
            16, // 500-1999
            2000,
            18, // 2000+
          ],
        },
        paint: {
          "text-color": "#ffffff",
        },
      });

      // Add individual property layer
      map.current.addLayer({
        id: "properties",
        type: "circle",
        source: "listings",
        filter: ["has", "isProperty"],
        paint: {
          "circle-color": "#3b82f6",
          "circle-radius": 6,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
          "circle-opacity": 0.8,
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
        const targetZoom = Math.min(currentZoom + 2, 16);

        map.current.easeTo({
          center: coordinates,
          zoom: targetZoom,
          duration: 800,
        });
      });

      // Click handler for individual properties
      map.current.on("click", "properties", (e) => {
        if (!e.features?.[0]) return;

        const feature = e.features[0];
        const properties = feature.properties;
        const coordinates = (feature.geometry as any).coordinates;

        const popup = new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(
            `
            <div style="padding: 8px;">
              <strong>MLS: ${properties?.mlsNumber}</strong>
              ${
                properties?.listPrice
                  ? `<br>Price: $${properties.listPrice.toLocaleString()}`
                  : ""
              }
            </div>
          `
          )
          .addTo(map.current!);
      });

      // Hover cursors
      map.current.on("mouseenter", "clusters", () => {
        if (map.current) map.current.getCanvas().style.cursor = "pointer";
      });
      map.current.on("mouseleave", "clusters", () => {
        if (map.current) map.current.getCanvas().style.cursor = "";
      });
      map.current.on("mouseenter", "properties", () => {
        if (map.current) map.current.getCanvas().style.cursor = "pointer";
      });
      map.current.on("mouseleave", "properties", () => {
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
      
      {/* Auto-centering overlay */}
      {isDetectingCenter && (
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "6px",
            zIndex: 1000,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px", color: "#374151" }}>
              Detecting optimal map center...
            </div>
            <div style={{ fontSize: "14px", color: "#6b7280" }}>
              Analyzing property locations
            </div>
          </div>
        </div>
      )}

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
        {isDetectingCenter ? (
          <span style={{ color: "#6b7280" }}>Auto-centering...</span>
        ) : isLoading ? (
          <span style={{ color: "#6b7280" }}>Loading...</span>
        ) : error ? (
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
    </div>
  );
}
