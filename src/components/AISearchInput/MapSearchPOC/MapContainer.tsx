import React, { useEffect, useRef, useState } from 'react';
import mapboxgl, { LngLatBounds } from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import type { MapContainerProps, ClusteredListingsResponse, PropertyCluster, PropertyListing } from './types';

/**
 * Get cluster precision based on zoom level
 * Lower precision = coarser clusters (city level)
 * Higher precision = finer clusters (street level)
 */
function getClusterPrecision(zoom: number): number {
  if (zoom <= 8) return 1;      // City level
  if (zoom <= 10) return 2;     // District
  if (zoom <= 12) return 3;     // Neighborhood
  if (zoom <= 14) return 4;     // Street
  return 5;                     // Individual properties
}

/**
 * Convert MapBox bounds to GeoJSON polygon for API
 */
function boundsToPolygon(bounds: LngLatBounds) {
  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();
  return {
    type: 'Polygon' as const,
    coordinates: [[
      [sw.lng, sw.lat],
      [ne.lng, sw.lat],
      [ne.lng, ne.lat],
      [sw.lng, ne.lat],
      [sw.lng, sw.lat]
    ]]
  };
}

/**
 * MapContainer - Full-screen map with property clustering
 *
 * Displays a Mapbox GL map that fetches and displays property clusters
 * from the Repliers API based on current map bounds and filters.
 */
export function MapContainer({ filters, onMapLoad, onResultsUpdate, mapboxToken, repliersApiKey }: MapContainerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const drawRef = useRef<MapboxDraw | null>(null);
  const customPolygonRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [customPolygon, setCustomPolygon] = useState<any>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapboxgl.accessToken = mapboxToken;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-79.3832, 43.6532], // Toronto by default
      zoom: 11
    });

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Initialize draw control
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      },
      styles: [
        // Polygon fill
        {
          id: 'gl-draw-polygon-fill',
          type: 'fill',
          filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
          paint: {
            'fill-color': '#667eea',
            'fill-outline-color': '#667eea',
            'fill-opacity': 0.2
          }
        },
        // Polygon outline stroke
        {
          id: 'gl-draw-polygon-stroke-active',
          type: 'line',
          filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': '#667eea',
            'line-width': 3
          }
        },
        // Vertex point halos
        {
          id: 'gl-draw-polygon-and-line-vertex-halo-active',
          type: 'circle',
          filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point']],
          paint: {
            'circle-radius': 7,
            'circle-color': '#FFF'
          }
        },
        // Vertex points
        {
          id: 'gl-draw-polygon-and-line-vertex-active',
          type: 'circle',
          filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point']],
          paint: {
            'circle-radius': 5,
            'circle-color': '#667eea'
          }
        }
      ]
    });

    map.addControl(draw, 'top-left');
    drawRef.current = draw;

    // Handle draw create event
    map.on('draw.create', () => {
      const data = draw.getAll();
      if (data.features.length > 0) {
        const polygon = data.features[0].geometry;
        customPolygonRef.current = polygon;
        setCustomPolygon(polygon);
        setIsDrawing(false);

        // Fetch with custom polygon
        if (mapRef.current) {
          fetchAndRenderClusters(mapRef.current);
        }
      }
    });

    // Handle draw update event
    map.on('draw.update', () => {
      const data = draw.getAll();
      if (data.features.length > 0) {
        const polygon = data.features[0].geometry;
        customPolygonRef.current = polygon;
        setCustomPolygon(polygon);

        // Fetch with updated polygon
        if (mapRef.current) {
          fetchAndRenderClusters(mapRef.current);
        }
      }
    });

    // Handle draw delete event
    map.on('draw.delete', () => {
      customPolygonRef.current = null;
      setCustomPolygon(null);
      setIsDrawing(false);

      // Fetch with map bounds
      if (mapRef.current) {
        fetchAndRenderClusters(mapRef.current);
      }
    });

    // Wait for map to load
    map.on('load', () => {
      console.log('Map loaded');
      mapRef.current = map;
      onMapLoad(map);

      // Fetch clusters on initial load
      fetchAndRenderClusters(map);
    });

    // Fetch clusters when map moves or zooms (only if no custom polygon)
    map.on('moveend', () => {
      if (mapRef.current && !customPolygonRef.current) {
        fetchAndRenderClusters(mapRef.current);
      }
    });

    // Cleanup
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [mapboxToken, onMapLoad]);

  // Re-fetch clusters when filters change
  useEffect(() => {
    if (mapRef.current) {
      console.log('Filters changed, fetching new clusters');
      fetchAndRenderClusters(mapRef.current);
    }
  }, [filters]);

  /**
   * Fetch clustered listings from Repliers API and render markers
   */
  const fetchAndRenderClusters = async (map: mapboxgl.Map) => {
    setLoading(true);

    try {
      const zoom = map.getZoom();
      const precision = getClusterPrecision(zoom);

      // Use custom polygon if drawn, otherwise use map bounds
      const mapPolygon = customPolygonRef.current || boundsToPolygon(map.getBounds());

      // Build API URL
      const url = new URL('https://api.repliers.io/listings');
      url.searchParams.set('cluster', 'true');
      url.searchParams.set('precision', precision.toString());
      url.searchParams.set('map', JSON.stringify(mapPolygon));

      // Apply filters from AI search
      if (filters.city && filters.city.length > 0) {
        url.searchParams.set('city', filters.city.join(','));
      }
      if (filters.bedrooms) {
        url.searchParams.set('bedrooms', filters.bedrooms.toString());
      }
      if (filters.bathrooms) {
        url.searchParams.set('bathrooms', filters.bathrooms.toString());
      }
      if (filters.priceMin) {
        url.searchParams.set('priceMin', filters.priceMin.toString());
      }
      if (filters.priceMax) {
        url.searchParams.set('priceMax', filters.priceMax.toString());
      }
      if (filters.sqftMin) {
        url.searchParams.set('sqftMin', filters.sqftMin.toString());
      }
      if (filters.sqftMax) {
        url.searchParams.set('sqftMax', filters.sqftMax.toString());
      }
      if (filters.propertyTypes && filters.propertyTypes.length > 0) {
        url.searchParams.set('propertyType', filters.propertyTypes.join(','));
      }
      if (filters.parkingSpaces) {
        url.searchParams.set('parkingSpaces', filters.parkingSpaces.toString());
      }
      if (filters.waterfront !== undefined) {
        url.searchParams.set('waterfront', filters.waterfront.toString());
      }

      console.log('Fetching clusters:', url.toString());

      // Fetch from API
      const response = await fetch(url.toString(), {
        headers: {
          'repliers-api-key': repliersApiKey
        }
      });

      if (!response.ok) {
        console.error('Listings API error:', response.status);
        return;
      }

      const data: ClusteredListingsResponse = await response.json();

      // Clear existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Render clusters or individual listings
      if (precision < 5 && data.clusters) {
        // Render clusters
        console.log(`Rendering ${data.clusters.length} clusters`);

        let totalCount = 0;
        data.clusters.forEach((cluster: PropertyCluster) => {
          totalCount += cluster.count;
          const marker = createClusterMarker(cluster, map);
          markersRef.current.push(marker);
        });

        onResultsUpdate(totalCount);
      } else if (data.listings) {
        // Render individual properties
        console.log(`Rendering ${data.listings.length} properties`);

        data.listings.forEach((listing: PropertyListing) => {
          const marker = createPropertyMarker(listing);
          markersRef.current.push(marker);
        });

        onResultsUpdate(data.listings.length);
      }

    } catch (error) {
      console.error('Error fetching clusters:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a marker for a property cluster
   */
  const createClusterMarker = (cluster: PropertyCluster, map: mapboxgl.Map): mapboxgl.Marker => {
    const el = document.createElement('div');
    el.className = 'cluster-marker';
    el.style.cssText = `
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border: 3px solid white;
      transition: transform 0.2s;
    `;
    el.textContent = cluster.count.toString();

    el.addEventListener('mouseenter', () => {
      el.style.transform = 'scale(1.1)';
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'scale(1)';
    });

    // Zoom in on click
    el.addEventListener('click', () => {
      map.flyTo({
        center: [cluster.longitude, cluster.latitude],
        zoom: map.getZoom() + 2,
        duration: 1000
      });
    });

    return new mapboxgl.Marker(el)
      .setLngLat([cluster.longitude, cluster.latitude])
      .addTo(map);
  };

  /**
   * Create a marker for an individual property
   */
  const createPropertyMarker = (listing: PropertyListing): mapboxgl.Marker => {
    const el = document.createElement('div');
    el.className = 'property-marker';
    el.style.cssText = `
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 16px;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      border: 2px solid white;
    `;
    el.textContent = '$';

    // Create popup with property details
    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
      <div style="padding: 8px; min-width: 200px;">
        <div style="font-weight: bold; margin-bottom: 4px;">${listing.address || 'Property'}</div>
        <div style="font-size: 14px; color: #666;">
          ${listing.bedrooms || '?'} bed • ${listing.bathrooms || '?'} bath
          ${listing.sqft ? ` • ${listing.sqft.toLocaleString()} sqft` : ''}
        </div>
        <div style="font-size: 16px; font-weight: bold; color: #4F46E5; margin-top: 8px;">
          ${listing.price ? `$${listing.price.toLocaleString()}` : 'Price N/A'}
        </div>
      </div>
    `);

    return new mapboxgl.Marker(el)
      .setLngLat([listing.longitude, listing.latitude])
      .setPopup(popup)
      .addTo(mapRef.current!);
  };

  /**
   * Start drawing mode
   */
  const startDrawing = () => {
    if (drawRef.current && mapRef.current) {
      // Clear existing polygons
      drawRef.current.deleteAll();
      // Start polygon drawing
      drawRef.current.changeMode('draw_polygon');
      setIsDrawing(true);
      customPolygonRef.current = null;
      setCustomPolygon(null);
    }
  };

  /**
   * Clear the drawn polygon
   */
  const clearDrawing = () => {
    if (drawRef.current) {
      drawRef.current.deleteAll();
      customPolygonRef.current = null;
      setCustomPolygon(null);
      setIsDrawing(false);

      // Fetch with map bounds
      if (mapRef.current) {
        fetchAndRenderClusters(mapRef.current);
      }
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Draw controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {!customPolygon && !isDrawing && (
          <button
            onClick={startDrawing}
            className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            Draw Search Area
          </button>
        )}

        {isDrawing && (
          <div className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
            <div className="animate-pulse w-2 h-2 bg-white rounded-full"></div>
            Drawing... Click to add points
          </div>
        )}

        {customPolygon && !isDrawing && (
          <button
            onClick={clearDrawing}
            className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear Search Area
          </button>
        )}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-lg px-4 py-2 shadow-lg z-10">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
            <span>Loading properties...</span>
          </div>
        </div>
      )}
    </div>
  );
}
