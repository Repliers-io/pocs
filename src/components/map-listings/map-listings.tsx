import React, { useRef, useEffect, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Type imports
import type {
  MapListingsProps,
  ClusterFeature,
  PropertyFeature,
  Coordinate,
  MapFilters,
  ListingResult,
} from "./types";

// Component imports
import { PropertyTooltip } from "./components/PropertyTooltip";
import { ClusterTooltip } from "./components/ClusterTooltip";
import { FilterPanel } from "./components/filters/FilterPanel";

// Utility imports
import { createPriceBubble } from "./helper-functions/map-utils";
import {
  detectAutoCenter,
  getCachedAutoCenter,
  extractCoordinates,
  getPolygonBounds,
  calculateAverageCenter,
} from "./helper-functions/auto-center";

// Re-export types for external use
export type { MapListingsProps };

export function MapListings({
  apiKey,
  mapboxToken,
  initialCenter,
  initialZoom,
  height = "100%",
  width = "100%",
  mapStyle = "mapbox://styles/mapbox/streets-v12",
  centerCalculation = "average",
  showPropertyCount = true,
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
  const lastFetchParams = useRef<{ bounds: string; zoom: number; filters: string } | null>(null);

  // Tooltip state for property preview
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Cluster tooltip state
  const [clusterTooltipOpen, setClusterTooltipOpen] = useState(false);
  const [clusterProperties, setClusterProperties] = useState<ListingResult[]>([]);
  const [clusterTooltipPosition, setClusterTooltipPosition] = useState({ x: 0, y: 0 });

  // Store price markers for cleanup
  const priceMarkers = useRef<mapboxgl.Marker[]>([]);

  // Store the latest fetchClusters function to avoid map reinitialization
  const fetchClustersRef = useRef<((bounds: mapboxgl.LngLatBounds) => void) | null>(null);

  // Filter state
  const [filters, setFilters] = useState<MapFilters>({
    listingType: "sale",
    propertyTypes: [],
    bedrooms: "all",
    bathrooms: "all",
    garageSpaces: "all",
    openHouse: "all",
    // activeListingDays is undefined by default, will auto-default to "all" Active if no status filters selected
  });

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: MapFilters) => {
    setFilters(newFilters);
  }, []);

  // Clear existing price markers
  const clearPriceMarkers = useCallback(() => {
    priceMarkers.current.forEach(marker => marker.remove());
    priceMarkers.current = [];
  }, []);

  // Add price markers for properties
  const addPriceMarkers = useCallback((features: any[]) => {
    if (!map.current) return;

    clearPriceMarkers();

    features.forEach((feature) => {
      if (
        'isProperty' in feature.properties &&
        feature.properties.isProperty &&
        feature.properties.listPrice
      ) {
        const { listPrice } = feature.properties;
        const type = feature.properties.type || 'Sale';
        const [lng, lat] = feature.geometry.coordinates;

        // Validate coordinates before creating marker
        if (isNaN(lng) || isNaN(lat) || lng === null || lat === null) {
          return;
        }

        // Convert price to number if it's a string
        const numericPrice = typeof listPrice === 'string' ? parseFloat(listPrice) : listPrice;
        if (isNaN(numericPrice)) {
          return;
        }

        const bubble = createPriceBubble(numericPrice, type);

        const marker = new mapboxgl.Marker({
          element: bubble,
          anchor: 'bottom',
          offset: [0, -5]
        })
          .setLngLat([lng, lat])
          .addTo(map.current!);

        // Add click handler to bubble
        bubble.addEventListener('click', async (event) => {
          // Get click position relative to viewport
          const clickX = event.clientX;
          const clickY = event.clientY;
          setTooltipPosition({ x: clickX, y: clickY });

          // If we already have enhanced data, use it
          if (feature.properties.address && feature.properties.images) {
            const listing = {
              mlsNumber: feature.properties.mlsNumber || "N/A",
              listPrice: numericPrice,
              address: feature.properties.address,
              details: feature.properties.details,
              images: feature.properties.images,
              type: feature.properties.type,
              lastStatus: feature.properties.lastStatus,
              status: feature.properties.status,
            };
            setSelectedListing(listing);
            setTooltipOpen(true);
            return;
          }

          // Otherwise, fetch full property details
          try {
            const response = await fetch(`https://api.repliers.io/listings?mlsNumber=${feature.properties.mlsNumber}&fields=address.*,details.*,images,type,lastStatus,status,class`, {
              headers: {
                "REPLIERS-API-KEY": apiKey,
                "Content-Type": "application/json",
              },
            });

            if (!response.ok) {
              throw new Error(`Failed to fetch property details: ${response.status}`);
            }

            const data = await response.json();
            const propertyData = data.listings?.[0];

            if (propertyData) {
              const listing = {
                mlsNumber: feature.properties.mlsNumber || "N/A",
                listPrice: numericPrice,
                address: propertyData.address,
                details: propertyData.details,
                images: propertyData.images,
                type: propertyData.type || feature.properties.type,
                lastStatus: propertyData.lastStatus,
                status: propertyData.status,
              };
              setSelectedListing(listing);
              setTooltipOpen(true);
            } else {
              const listing = {
                mlsNumber: feature.properties.mlsNumber || "N/A",
                listPrice: numericPrice,
                address: feature.properties.address,
                details: feature.properties.details,
                images: feature.properties.images,
                type: feature.properties.type,
                lastStatus: feature.properties.lastStatus,
                status: feature.properties.status,
              };
              setSelectedListing(listing);
              setTooltipOpen(true);
            }
          } catch (error) {
            const listing = {
              mlsNumber: feature.properties.mlsNumber || "N/A",
              listPrice: numericPrice,
              address: feature.properties.address,
              details: feature.properties.details,
              images: feature.properties.images,
              type: feature.properties.type,
              lastStatus: feature.properties.lastStatus,
              status: feature.properties.status,
            };
            setSelectedListing(listing);
            setTooltipOpen(true);
          }
        });

        priceMarkers.current.push(marker);
      }
    });
  }, [clearPriceMarkers, apiKey]);

  // Auto-center detection effect
  useEffect(() => {
    const performAutoCenter = async () => {
      if (mapCenter && mapZoom) return; // Already have center/zoom

      // Check cache first with method-specific key
      const cached = getCachedAutoCenter(`${apiKey}-${centerCalculation}`);
      if (cached) {
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

  // Helper: Build query parameters for a specific status type (for bundled searches)
  const buildStatusQueryParams = useCallback((
    statusType: 'active' | 'sold' | 'unavailable',
    statusValue: string,
    zoom: number
  ): Record<string, any> => {
    const params: Record<string, any> = {};

    // Status-specific filters
    if (statusType === 'active') {
      params.status = 'A';

      // Apply listing date filter
      if (statusValue !== 'all') {
        const now = new Date();
        if (statusValue.endsWith('+')) {
          const days = parseInt(statusValue.replace('+', ''));
          const date = new Date(now);
          date.setDate(date.getDate() - days);
          params.maxListDate = date.toISOString().split('T')[0];
        } else {
          const days = parseInt(statusValue);
          const date = new Date(now);
          date.setDate(date.getDate() - days);
          params.minListDate = date.toISOString().split('T')[0];
        }
      }
    } else if (statusType === 'sold') {
      params.status = 'U';
      // For POST requests, try both Sld and Sc as separate parameters would work in GET,
      // but for JSON body we'll just use the primary one
      params.lastStatus = 'Sld';

      // Apply sold date filter
      const numValue = parseInt(statusValue);
      if (numValue >= 2007 && numValue <= 2025) {
        params.minSoldDate = `${statusValue}-01-01`;
        params.maxSoldDate = `${statusValue}-12-31`;
      } else {
        const now = new Date();
        const minDate = new Date(now);
        minDate.setDate(minDate.getDate() - numValue);
        params.minSoldDate = minDate.toISOString().split('T')[0];
        params.maxSoldDate = now.toISOString().split('T')[0];
      }
    } else if (statusType === 'unavailable') {
      params.status = 'U';
      // Unavailable listings: Don't specify lastStatus to get all U listings
      // The unavailableDate filter should help differentiate from Sold listings
      // Note: This will include Sold listings that have unavailableDate set
      // If we need to exclude Sold, we may need a different API approach

      // Apply unavailable date filter
      const numValue = parseInt(statusValue);
      if (numValue >= 2007 && numValue <= 2025) {
        params.minUnavailableDate = `${statusValue}-01-01`;
        params.maxUnavailableDate = `${statusValue}-12-31`;
      } else {
        const now = new Date();
        const minDate = new Date(now);
        minDate.setDate(minDate.getDate() - numValue);
        params.minUnavailableDate = minDate.toISOString().split('T')[0];
        params.maxUnavailableDate = now.toISOString().split('T')[0];
      }
    }

    // Common filters that apply to all status types
    if (filters.listingType === 'sale') {
      params.type = 'Sale';
    } else if (filters.listingType === 'lease') {
      params.type = 'Lease';
    }

    if (filters.propertyTypes.length === 1) {
      params['details.propertyType'] = filters.propertyTypes[0];
    }

    if (filters.minPrice && filters.minPrice > 0) {
      params.minPrice = filters.minPrice;
    }
    if (filters.maxPrice && filters.maxPrice > 0) {
      params.maxPrice = filters.maxPrice;
    }

    if (filters.bedrooms && filters.bedrooms !== 'all') {
      if (filters.bedrooms === '5+') {
        params.minBedrooms = 5;
      } else {
        params.minBedrooms = parseInt(filters.bedrooms);
        params.maxBedrooms = parseInt(filters.bedrooms);
      }
    }

    if (filters.bathrooms && filters.bathrooms !== 'all') {
      params.minBaths = parseInt(filters.bathrooms.replace('+', ''));
    }

    if (filters.garageSpaces && filters.garageSpaces !== 'all') {
      params.minGarageSpaces = parseInt(filters.garageSpaces.replace('+', ''));
    }

    if (filters.minSqft && filters.minSqft > 0) {
      params.minSqft = filters.minSqft;
    }
    if (filters.maxSqft && filters.maxSqft > 0) {
      params.maxSqft = filters.maxSqft;
    }

    if (filters.openHouse && filters.openHouse !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let minDate: Date | null = null;
      let maxDate: Date | null = null;

      if (filters.openHouse === 'today') {
        minDate = today;
        maxDate = today;
      } else if (filters.openHouse === 'thisWeekend') {
        const dayOfWeek = today.getDay();
        const daysUntilSaturday = dayOfWeek === 0 ? 6 : 6 - dayOfWeek;
        const saturday = new Date(today);
        saturday.setDate(today.getDate() + daysUntilSaturday);
        const sunday = new Date(saturday);
        sunday.setDate(saturday.getDate() + 1);
        minDate = saturday;
        maxDate = sunday;
      } else if (filters.openHouse === 'thisWeek') {
        minDate = today;
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
        maxDate = endOfWeek;
      } else if (filters.openHouse === 'anytime') {
        minDate = today;
      }

      if (minDate) {
        params.minOpenHouseDate = minDate.toISOString().split('T')[0];
        if (maxDate) {
          params.maxOpenHouseDate = maxDate.toISOString().split('T')[0];
        }
      }
    }

    return params;
  }, [filters]);

  // Helper function to calculate distance between two coordinates (in meters)
  const calculateDistance = useCallback((coord1: [number, number], coord2: [number, number]): number => {
    const [lng1, lat1] = coord1;
    const [lng2, lat2] = coord2;

    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  // Group features by proximity
  const groupFeaturesByProximity = useCallback((features: any[], radiusMeters: number): any[][] => {
    const groups: any[][] = [];
    const processed = new Set<number>();

    features.forEach((feature, index) => {
      if (processed.has(index)) return;

      const group = [feature];
      processed.add(index);

      const featureCoords = feature.geometry.coordinates as [number, number];

      // Find all other features within radius
      features.forEach((otherFeature, otherIndex) => {
        if (processed.has(otherIndex) || index === otherIndex) return;

        const otherCoords = otherFeature.geometry.coordinates as [number, number];
        const distance = calculateDistance(featureCoords, otherCoords);

        if (distance <= radiusMeters) {
          group.push(otherFeature);
          processed.add(otherIndex);
        }
      });

      groups.push(group);
    });

    return groups;
  }, [calculateDistance]);

  // Merge small clusters (blue/yellow ones) while keeping large clusters intact
  const mergeSmallClusters = useCallback((features: any[], zoom: number): any[] => {
    // Define what counts as a "small cluster" that should be merged
    // More aggressive merging at mid-zoom to reduce clutter
    const smallClusterThreshold = zoom <= 10 ? 30 : (zoom <= 12 ? 60 : (zoom <= 13 ? 100 : 30));
    const mergeRadius = zoom <= 10 ? 500 : (zoom <= 12 ? 300 : (zoom <= 13 ? 200 : 100)); // meters

    const smallClusters = features.filter(f => f.properties.count <= smallClusterThreshold);
    const largeClusters = features.filter(f => f.properties.count > smallClusterThreshold);

    if (smallClusters.length === 0) {
      return features; // No small clusters to merge
    }

    // Group small clusters by proximity for merging
    const smallClusterGroups = groupFeaturesByProximity(smallClusters, mergeRadius);

    const mergedFeatures = smallClusterGroups.map(group => {
      if (group.length === 1) {
        return group[0]; // Single cluster, no merging needed
      }

      // Merge multiple small clusters into one larger cluster
      const totalCount = group.reduce((sum, cluster) => sum + cluster.properties.count, 0);
      const avgLng = group.reduce((sum, cluster) => sum + cluster.geometry.coordinates[0], 0) / group.length;
      const avgLat = group.reduce((sum, cluster) => sum + cluster.geometry.coordinates[1], 0) / group.length;

      return {
        type: "Feature" as const,
        properties: {
          count: totalCount,
          precision: group[0].properties.precision,
          id: `merged-${group.map(c => c.properties.id).join('-')}`,
          members: [], // Could combine members if needed
        },
        geometry: {
          type: "Point" as const,
          coordinates: [avgLng, avgLat] as [number, number],
        },
      };
    });

    return [...largeClusters, ...mergedFeatures];
  }, [groupFeaturesByProximity]);

  // Fetch clusters from Repliers API
  const fetchClusters = useCallback(
    async (bounds: mapboxgl.LngLatBounds) => {
      if (!map.current) return;

      const zoom = map.current.getZoom();
      const precision = getClusterPrecision(zoom);

      // Create bounds key for comparison
      const boundsKey = JSON.stringify(boundsToPolygon(bounds));
      const roundedZoom = Math.round(zoom * 2) / 2; // Round to 0.5 precision for optimization
      const filtersKey = JSON.stringify(filters);

      // Check if this is a duplicate request
      if (lastFetchParams.current &&
          lastFetchParams.current.bounds === boundsKey &&
          Math.abs(lastFetchParams.current.zoom - roundedZoom) < 0.5 &&
          lastFetchParams.current.filters === filtersKey) {
        return;
      }

      // Update last fetch params
      lastFetchParams.current = { bounds: boundsKey, zoom: roundedZoom, filters: filtersKey };

      currentZoomLevel.current = zoom;
      setError(null);

      try {
        // Detect which status filters are active
        const activeStatuses: Array<{type: 'active' | 'sold' | 'unavailable', value: string}> = [];

        if (filters.activeListingDays !== undefined) {
          activeStatuses.push({ type: 'active', value: filters.activeListingDays });
        }
        if (filters.soldListingDays !== undefined) {
          activeStatuses.push({ type: 'sold', value: filters.soldListingDays });
        }
        if (filters.unavailableListingDays !== undefined) {
          activeStatuses.push({ type: 'unavailable', value: filters.unavailableListingDays });
        }

        // Default to active if no status filters are set
        if (activeStatuses.length === 0) {
          activeStatuses.push({ type: 'active', value: 'all' });
        }

        // Check if we need bundled search (multiple status types)
        const needsBundledSearch = activeStatuses.length > 1;

        let data: any;

        if (needsBundledSearch) {
          // BUNDLED SEARCH: Multiple status types active
          console.log(`[Bundled Search] Multiple status filters active:`, activeStatuses.map(s => s.type));

          // Build queries array (only include search filters, not cluster/listings params)
          const queries = activeStatuses.map(({ type, value }) => {
            const queryParams = buildStatusQueryParams(type, value, zoom);

            // Add the map polygon to each query
            queryParams.map = boundsToPolygon(bounds);

            return queryParams;
          });

          // Build URL with global parameters (cluster settings go in query string, not body)
          const url = new URL('https://api.repliers.io/listings');
          url.searchParams.set('cluster', 'true');
          url.searchParams.set('clusterPrecision', precision.toString());
          url.searchParams.set('clusterLimit', '500');
          url.searchParams.set('clusterFields', 'mlsNumber,listPrice,coordinates,type,address.*,details.numBedrooms,details.numBedroomsPlus,details.numBathrooms,details.numBathroomsPlus,details.numGarageSpaces,details.propertyType,lastStatus,images,status,class');

          // At high zoom, request individual listings (global params)
          if (zoom >= 14) {
            url.searchParams.set('listings', 'true');
            url.searchParams.set('fields', 'address.*,mlsNumber,listPrice,details.numBedrooms,details.numBedroomsPlus,details.numBathrooms,details.numBathroomsPlus,details.numGarageSpaces,details.propertyType,type,lastStatus,images,status,class,coordinates,latitude,longitude,geo,location,map');
            url.searchParams.set('pageSize', '500');
          } else {
            url.searchParams.set('listings', 'false');
          }

          // Make POST request with bundled queries
          const requestBody = { queries };
          console.log(`[Bundled Search] POST Request Body:`, JSON.stringify(requestBody, null, 2));
          console.log(`[Bundled Search] POST URL:`, url.toString());

          const response = await fetch(url.toString(), {
            method: 'POST',
            headers: {
              'REPLIERS-API-KEY': apiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`[Bundled Search] Error Response:`, errorText);
            throw new Error(`Bundled API Error: ${response.status} ${response.statusText} - ${errorText}`);
          }

          data = await response.json();

          // The bundled search API automatically merges results from all queries
          // Response structure is identical to single search (aggregates.map.clusters, listings, etc.)
          const clusters = data.aggregates?.map?.clusters || [];
          const listings = data.listings || [];
          console.log(`[Bundled Search] API returned ${clusters.length} clusters and ${listings.length} listings (already merged)`);

        } else {
          // SINGLE SEARCH: Only one status type active (original GET request logic)
          const { type: statusType, value: statusValue } = activeStatuses[0];
          console.log(`[Single Search] Status: ${statusType}, Value: ${statusValue}`);

          const url = new URL("https://api.repliers.io/listings");
          url.searchParams.set("cluster", "true");
          url.searchParams.set("clusterPrecision", precision.toString());
          url.searchParams.set("clusterLimit", "500");

          // Build query params for single status
          const queryParams = buildStatusQueryParams(statusType, statusValue, zoom);

          // Add all params to URL
          Object.entries(queryParams).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach(v => url.searchParams.append(key, v.toString()));
            } else {
              url.searchParams.set(key, value.toString());
            }
          });

          // Add common parameters
          url.searchParams.set("map", JSON.stringify(boundsToPolygon(bounds)));
          url.searchParams.set("key", apiKey);
          url.searchParams.set(
            "clusterFields",
            "mlsNumber,listPrice,coordinates,type,address.*,details.numBedrooms,details.numBedroomsPlus,details.numBathrooms,details.numBathroomsPlus,details.numGarageSpaces,details.propertyType,lastStatus,images,status,class"
          );

          // At high zoom levels, also get individual properties
          if (zoom >= 14) {
            url.searchParams.set("listings", "true");
            url.searchParams.set(
              "fields",
              "address.*,mlsNumber,listPrice,details.numBedrooms,details.numBedroomsPlus,details.numBathrooms,details.numBathroomsPlus,details.numGarageSpaces,details.propertyType,type,lastStatus,images,status,class,coordinates,latitude,longitude,geo,location,map"
            );
            url.searchParams.set("pageSize", "500");
          } else {
            url.searchParams.set("listings", "false");
          }

          console.log(`[API Call] ${url.toString()}`);

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

          data = await response.json();
        }


        // Process clusters - they're nested under aggregates.map.clusters
        const clusters = data.aggregates?.map?.clusters || data.clusters || [];
        const clusterFeatures: ClusterFeature[] = [];
        const singlePropertyFeatures: PropertyFeature[] = [];

        // Debug: Log API response structure
        const rawListings = data.listings || data.results || [];
        console.log(`\n📦 API RESPONSE DEBUG (zoom: ${zoom.toFixed(2)})`);
        console.log(`   Total clusters from API: ${clusters.length}`);
        console.log(`   Total raw listings from API: ${rawListings.length}`);

        // Check for duplicate mlsNumbers in rawListings
        const mlsNumbers = rawListings.map((l: any) => l.mlsNumber).filter(Boolean);
        const uniqueMlsNumbers = new Set(mlsNumbers);
        if (mlsNumbers.length !== uniqueMlsNumbers.size) {
          console.log(`   ⚠️ DUPLICATES DETECTED: ${mlsNumbers.length} total, ${uniqueMlsNumbers.size} unique (${mlsNumbers.length - uniqueMlsNumbers.size} duplicates)`);
        }

        if (clusters.length > 0) {
          console.log(`   First cluster structure:`, {
            count: clusters[0].count,
            propertiesLength: clusters[0].properties?.length || 0,
            mapLength: clusters[0].map?.length || 0,
            hasMembers: !!(clusters[0].properties || clusters[0].map)
          });
        }

        // Helper function to check if a property matches the selected property types
        const matchesPropertyTypeFilter = (propertyType: string | undefined) => {
          if (filters.propertyTypes.length === 0) return true; // No filter = show all
          if (!propertyType) return false; // No property type = exclude
          return filters.propertyTypes.includes(propertyType);
        };



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

          // If cluster has only 1 property, treat as individual property (only at zoom 14+)
          if (cluster.count === 1 && zoom >= 14) {
            // Extract price from nested listing data if available
            const listPrice = cluster.listing?.listPrice ||
                             cluster.listPrice ||
                             (cluster.map && cluster.map[0]?.listPrice);


            // Check if this single property matches the property type filter
            const clusterPropertyType = cluster.listing?.details?.propertyType || cluster.details?.propertyType;
            if (matchesPropertyTypeFilter(clusterPropertyType)) {
              singlePropertyFeatures.push({
                type: "Feature" as const,
                properties: {
                  mlsNumber: cluster.mlsNumber || cluster.listing?.mlsNumber || `single-${index}`,
                  listPrice: typeof listPrice === 'string' ? parseFloat(listPrice) : listPrice,
                  propertyType: cluster.propertyType || cluster.listing?.propertyType || cluster.status || "Sale",
                  type: cluster.listing?.type || cluster.type, // Add type for lease detection
                  isProperty: true as const,
                  // Enhanced fields from cluster data
                  address: cluster.listing?.address || cluster.address,
                  details: cluster.listing?.details || cluster.details,
                  images: cluster.listing?.images || cluster.images,
                  lastStatus: cluster.listing?.lastStatus || cluster.lastStatus,
                  status: cluster.listing?.status || cluster.status,
                  class: cluster.listing?.class || cluster.class,
                },
                geometry: {
                  type: "Point" as const,
                  coordinates: [
                    originalCoordinates[0],
                    originalCoordinates[1],
                  ] as [number, number],
                },
              });
            }
          } else if (cluster.count === 1) {
            // Single property clusters at zoom < 14: show as regular clusters
            clusterFeatures.push({
              type: "Feature" as const,
              properties: {
                count: cluster.count || 1,
                apiCount: cluster.count || 1, // Store original API count for debugging
                precision: cluster.precision || precision,
                id: `cluster-${index}`,
                members: cluster.properties || cluster.map || [],
              },
              geometry: {
                type: "Point" as const,
                coordinates: [originalCoordinates[0], originalCoordinates[1]] as [
                  number,
                  number
                ],
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
                }
              }
            }

            // Store the actual cluster members for tooltip display
            const clusterMembers = cluster.properties || cluster.map || [];


            clusterFeatures.push({
              type: "Feature" as const,
              properties: {
                count: cluster.count || 1,
                apiCount: cluster.count || 1, // Store original API count for debugging
                precision: cluster.precision || precision,
                id: `cluster-${index}`,
                members: clusterMembers, // Store actual cluster members
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
        // Get mlsNumbers from singlePropertyFeatures to avoid duplicates
        const singlePropertyMlsNumbers = new Set(
          singlePropertyFeatures.map(f => f.properties.mlsNumber)
        );

        const propertyFeatures: PropertyFeature[] = rawListings
          .filter((listing: any) => {
            // Skip if this property is already in singlePropertyFeatures
            if (singlePropertyMlsNumbers.has(listing.mlsNumber)) {
              return false;
            }
            // Only include listings with valid coordinates
            const lng = listing.map?.longitude ||
                       listing.coordinates?.lng ||
                       listing.coordinates?.longitude ||
                       listing.longitude ||
                       listing.lng;
            const lat = listing.map?.latitude ||
                       listing.coordinates?.lat ||
                       listing.coordinates?.latitude ||
                       listing.latitude ||
                       listing.lat;
            const hasValidCoords = lng !== undefined && lat !== undefined && !isNaN(lng) && !isNaN(lat);

            // Apply client-side property type filter for multiple selections
            const matchesFilter = matchesPropertyTypeFilter(listing.details?.propertyType);


            return hasValidCoords && matchesFilter;
          })
          .map(
          (listing: any) => {
            const baseProperties = {
              mlsNumber: listing.mlsNumber,
              listPrice: typeof listing.listPrice === 'string' ? parseFloat(listing.listPrice) : listing.listPrice,
              propertyType: listing.propertyType || listing.details?.propertyType || listing.type || listing.status || "Sale",
              type: listing.type, // Add type for lease detection
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

            const finalProperties = { ...baseProperties, ...enhancedProperties };


            return {
              type: "Feature" as const,
              properties: finalProperties,
              geometry: {
                type: "Point" as const,
                coordinates: [
                  listing.coordinates?.lng || listing.longitude || listing.map?.longitude,
                  listing.coordinates?.lat || listing.latitude || listing.map?.latitude,
                ] as [number, number],
              },
            };
          }
        );

        // Recalculate cluster counts based on actual filtered properties
        // This ensures cluster numbers match what we're actually displaying
        const recalculateClusterCounts = (clusters: ClusterFeature[], allProperties: PropertyFeature[], singleProps: PropertyFeature[]) => {
          // Combine all available properties (both individual and single property features)
          const allAvailableProperties = [...allProperties, ...singleProps];

          return clusters.map(cluster => {
            const clusterCoords = cluster.geometry.coordinates;

            // Find properties near this cluster (within reasonable distance)
            const nearbyProperties = allAvailableProperties.filter(prop => {
              const propCoords = prop.geometry.coordinates;
              const distance = Math.sqrt(
                Math.pow(propCoords[0] - clusterCoords[0], 2) +
                Math.pow(propCoords[1] - clusterCoords[1], 2)
              );
              // Use a small distance threshold (approximately 100 meters in degrees)
              return distance < 0.001;
            });

            // If no nearby properties found, keep original count (cluster is valid but properties not loaded yet)
            const newCount = nearbyProperties.length > 0 ? nearbyProperties.length : cluster.properties.count;

            // Update count to match actual nearby filtered properties
            return {
              ...cluster,
              properties: {
                ...cluster.properties,
                count: newCount,
              }
            };
          });
        };

        // Apply recalculation only when we have any properties (individual or single)
        const hasProperties = propertyFeatures.length > 0 || singlePropertyFeatures.length > 0;
        const updatedClusterFeatures = zoom >= 14 && hasProperties
          ? recalculateClusterCounts(clusterFeatures, propertyFeatures, singlePropertyFeatures)
          : clusterFeatures;

        // Combine features - at zoom 14+, use proximity-based grouping
        let allFeatures: any[];

        if (zoom >= 14) {
          // At high zoom: use smart proximity grouping to avoid overlaps
          const allPotentialFeatures = [
            ...updatedClusterFeatures.map(f => ({...f, type: 'cluster'})),
            ...singlePropertyFeatures.map(f => ({...f, type: 'singleProperty'})),
            ...propertyFeatures.map(f => ({...f, type: 'property'}))
          ];

          // Group features by proximity (50 meter radius)
          const proximityGroups = groupFeaturesByProximity(allPotentialFeatures, 50);

          // For each proximity group, decide what to show
          allFeatures = proximityGroups.map(group => {
            const clusters = group.filter(f => f.type === 'cluster');
            const properties = group.filter(f => f.type === 'property' || f.type === 'singleProperty');

            // Calculate total properties in clusters vs individual properties
            const clusterPropertyCount = clusters.reduce((sum, c) => sum + (c.properties?.count || 0), 0);
            const individualPropertyCount = properties.length;

            // Decision logic for what to show:
            if (properties.length > 3) {
              // Too many individual bubbles would be messy → show largest cluster
              return clusters.length > 0 ? clusters.reduce((largest, current) =>
                (current.properties?.count || 0) > (largest.properties?.count || 0) ? current : largest
              ) : properties[0];
            } else if (clusterPropertyCount > individualPropertyCount && clusters.length > 0) {
              // Cluster has more complete data → show cluster
              return clusters.reduce((largest, current) =>
                (current.properties?.count || 0) > (largest.properties?.count || 0) ? current : largest
              );
            } else if (properties.length > 0) {
              // Individual properties have complete data → show all properties
              return properties;
            } else if (clusters.length > 0 && clusters[0].properties.count > 0) {
              // Fallback to cluster only if it has a valid count
              return clusters[0];
            } else {
              // No valid data to show
              return null;
            }
          }).flat().filter(Boolean);

        } else {
          // At low zoom: only clusters and single property features, but merge small clusters
          const mergedClusters = mergeSmallClusters([...clusterFeatures, ...singlePropertyFeatures], zoom);
          allFeatures = mergedClusters;
        }

        // Log the GeoJSON structure that goes to Mapbox
        const geoJsonData = {
          type: "FeatureCollection" as const,
          features: allFeatures,
        };

        // Update map source (this should not move the map)
        const source = map.current.getSource(
          "listings"
        ) as mapboxgl.GeoJSONSource;
        if (source) {
          source.setData(geoJsonData);

          // Add custom price markers (clear old ones first)
          addPriceMarkers(allFeatures);
        }

        // Update total count
        const total =
          data.count ||
          clusterFeatures.reduce(
            (sum, feature) => sum + feature.properties.count,
            0
          );
        setTotalCount(total);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load listings";
        setError(errorMessage);
      }
    },
    [apiKey, getClusterPrecision, boundsToPolygon, addPriceMarkers, filters, buildStatusQueryParams, groupFeaturesByProximity, mergeSmallClusters]
  );

  // Update the ref whenever fetchClusters changes
  useEffect(() => {
    fetchClustersRef.current = fetchClusters;
  }, [fetchClusters]);

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

      // Add navigation controls (zoom in/out buttons)
      map.current.addControl(new mapboxgl.NavigationControl());

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
            "#51bbd6", // 1-29: Blue
            30,
            "#f1c40f", // 30-59: Yellow
            60,
            "#f39c12", // 60-149: Orange
            150,
            "#f28cb1", // 150-499: Pink
            500,
            "#e74c3c", // 500+: Red
          ],
          "circle-radius": [
            "step",
            ["get", "count"],
            10, // 1-29: Small (10px)
            30,
            12, // 30-59: Small-Medium (12px)
            60,
            14, // 60-149: Medium (14px)
            150,
            18, // 150-499: Large (18px)
            500,
            22, // 500+: Extra Large (22px)
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
            10, // 1-29: Small text (10px)
            30,
            11, // 30-59: Small-Medium text (11px)
            60,
            12, // 60-149: Medium text (12px)
            150,
            14, // 150-499: Large text (14px)
            500,
            16, // 500+: Extra large text (16px)
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

      // Custom price bubbles will be handled with HTML markers instead of Mapbox layers

      // Click handler for clusters
      map.current.on("click", "clusters", async (e) => {
        if (!map.current || !e.features?.[0]) return;

        const feature = e.features[0];
        const coordinates = (feature.geometry as any).coordinates;
        const clusterCount = (feature.properties as any).count;
        const apiCount = (feature.properties as any).apiCount;

        // Get click position for tooltip
        const clickX = e.originalEvent.clientX;
        const clickY = e.originalEvent.clientY;

        // Show cluster properties only at very high zoom levels
        const currentZoom = map.current.getZoom();

        console.log(`\n🎯 CLUSTER CLICKED`);
        console.log(`   Zoom Level: ${currentZoom.toFixed(2)}`);
        console.log(`   Display Count: ${clusterCount}`);
        console.log(`   API Count (unfiltered): ${apiCount || clusterCount}`);

        if (currentZoom >= 14) {
          // At high zoom, show cluster properties in tooltip using the working old method
          const source = map.current.getSource('listings') as mapboxgl.GeoJSONSource;
          if (source && source._data) {
            const sourceData = source._data as any;

            // Get ALL property features and find the closest ones
            const allPropertyFeatures = sourceData.features?.filter((f: any) => {
              return f.properties?.isProperty === true; // Only properties
            }) || [];

            console.log(`   Total Properties Available: ${allPropertyFeatures.length}`);

            // Check if allPropertyFeatures has duplicates
            const allMlsNumbers = allPropertyFeatures.map((f: any) => f.properties?.mlsNumber).filter(Boolean);
            const uniqueAllMls = new Set(allMlsNumbers);
            if (allMlsNumbers.length !== uniqueAllMls.size) {
              console.log(`   ⚠️ DUPLICATES IN MAP DATA: ${allMlsNumbers.length} total properties, ${uniqueAllMls.size} unique MLSNumbers`);
            }

            // Sort by distance to clicked coordinates and take the closest ones
            const propertiesWithDistance = allPropertyFeatures.map((f: any) => {
              const featureCoords = f.geometry.coordinates;
              const distance = Math.sqrt(
                Math.pow(featureCoords[0] - coordinates[0], 2) +
                Math.pow(featureCoords[1] - coordinates[1], 2)
              );
              return { feature: f, distance };
            }).sort((a: any, b: any) => a.distance - b.distance);

            // Take the closest properties up to the cluster count
            const closestProperties = propertiesWithDistance.slice(0, clusterCount);

            console.log(`   Actual Properties in Cluster: ${closestProperties.length}`);
            console.log(`   Discrepancy: ${clusterCount !== closestProperties.length ? `⚠️ ${clusterCount - closestProperties.length} missing` : '✅ Match'}`);

            if (closestProperties.length > 0) {
              const realProperties: ListingResult[] = closestProperties.map(({ feature }: any) => {
                const props = feature.properties;

                return {
                  mlsNumber: props.mlsNumber || 'N/A',
                  listPrice: props.listPrice || 0,
                  address: props.address || {
                    streetNumber: 'Unknown',
                    streetName: 'Address',
                    city: 'Unknown',
                    state: 'Unknown',
                  },
                  details: props.details || {
                    numBedrooms: 0,
                    numBathrooms: 0,
                    numGarageSpaces: 0,
                    propertyType: 'Unknown',
                  },
                  images: props.images || [],
                  type: props.type || 'Sale',
                  lastStatus: props.lastStatus || 'New',
                  status: props.status || 'A',
                };
              });

              // Check for duplicates in realProperties
              const mlsNumbers = realProperties.map(p => p.mlsNumber);
              const uniqueMlsNumbers = new Set(mlsNumbers);

              if (mlsNumbers.length !== uniqueMlsNumbers.size) {
                console.log(`   ⚠️ DUPLICATES IN CLUSTER TOOLTIP: ${mlsNumbers.length} total, ${uniqueMlsNumbers.size} unique`);

                // Log which ones are duplicated
                const counts = mlsNumbers.reduce((acc: Record<string, number>, mls: string) => {
                  acc[mls] = (acc[mls] || 0) + 1;
                  return acc;
                }, {});

                const duplicates = Object.entries(counts)
                  .filter(([_, count]) => count > 1)
                  .map(([mls, count]) => `${mls} (${count}x)`);

                console.log(`   Duplicate MLSNumbers:`, duplicates);
              } else {
                console.log(`   ✅ No duplicates in cluster tooltip`);
              }

              // Deduplicate by mlsNumber
              const uniqueProperties = realProperties.filter((property, index, self) =>
                index === self.findIndex(p => p.mlsNumber === property.mlsNumber)
              );

              setClusterProperties(uniqueProperties);
              setClusterTooltipPosition({ x: clickX, y: clickY });
              setClusterTooltipOpen(true);

              // Close single property tooltip if open
              setTooltipOpen(false);

              return;
            }
          }


          // Fallback: if we can't get real data, still show something useful
          const fallbackProperties: ListingResult[] = [{
            mlsNumber: `Cluster-${clusterCount}`,
            listPrice: 0,
            address: {
              streetNumber: 'Multiple',
              streetName: 'Properties',
              city: 'Available',
              state: '',
            },
            details: {
              numBedrooms: 0,
              numBathrooms: 0,
              numGarageSpaces: 0,
              propertyType: `${clusterCount} Properties in Cluster`,
            },
            images: [],
            type: 'Sale',
            lastStatus: 'Available',
            status: 'A',
          }];

          setClusterProperties(fallbackProperties);
          setClusterTooltipPosition({ x: clickX, y: clickY });
          setClusterTooltipOpen(true);

          // Close single property tooltip if open
          setTooltipOpen(false);

          return;
        }

        // Default zoom behavior for all other zoom levels
        // Zoom less aggressively at higher zoom levels
        const zoomIncrement = currentZoom >= 14 ? 2 : (currentZoom >= 12 ? 3 : 4);
        const targetZoom = Math.min(currentZoom + zoomIncrement, 16);

        map.current.easeTo({
          center: coordinates,
          zoom: targetZoom,
          duration: 1000,
          easing: (t) => t * (2 - t), // Smooth ease-out animation
        });
      });

      // Property dots are now handled by the expandable price bubbles above them
      // No separate click handler needed

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

      // Initial data fetch
      const bounds = map.current.getBounds();
      if (bounds) {
        fetchClustersRef.current?.(bounds);
      }
    });

    // Update data on map move
    map.current.on("moveend", () => {
      if (!map.current) return;
      const bounds = map.current.getBounds();
      if (bounds) {
        fetchClustersRef.current?.(bounds);
      }
    });

    return () => {
      clearPriceMarkers(); // Clean up price markers
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken, mapStyle, mapCenter, mapZoom, clearPriceMarkers, addPriceMarkers]);

  // Re-fetch data when filters change (without moving map)
  useEffect(() => {
    if (map.current) {
      // Clear the last fetch params to ensure the request isn't skipped, but keep map position
      lastFetchParams.current = null;

      const bounds = map.current.getBounds();
      if (bounds) {
        // Fetch new data without changing map position/zoom
        fetchClusters(bounds);
      }
    }
  }, [filters, fetchClusters]);

  return (
    <div style={{ width, height, position: "relative" }}>
      {/* Map Container */}
      <div
        ref={mapContainer}
        style={{ width: "100%", height: "100%" }}
        className="rounded-lg overflow-hidden"
      />

      {/* Filter Panel */}
      <FilterPanel
        filters={filters}
        onFiltersChange={handleFiltersChange}
        apiKey={apiKey}
      />

      {/* Property Count Display */}
      {showPropertyCount && (
        <div
          style={{
            position: "absolute",
            bottom: "16px",
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
      )}


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

      {/* Property Preview Tooltip */}
      <PropertyTooltip
        open={tooltipOpen}
        onClose={() => setTooltipOpen(false)}
        listing={selectedListing}
        position={tooltipPosition}
        mapContainer={mapContainer.current}
      />

      {/* Cluster Properties Tooltip */}
      <ClusterTooltip
        open={clusterTooltipOpen}
        onClose={() => setClusterTooltipOpen(false)}
        properties={clusterProperties}
        position={clusterTooltipPosition}
        mapContainer={mapContainer.current}
      />
    </div>
  );
}
