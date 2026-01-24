import React, { useState } from 'react';
import type { Map as MapboxMap } from 'mapbox-gl';
import AISearchInput from '../AISearchInput';
import { MapContainer } from './MapContainer';
import { useMapFilters } from './hooks/useMapFilters';
import { useMapSync } from './hooks/useMapSync';
import type { MapSearchPOCProps, ExtractedEntities, SearchCompletionData } from './types';

/**
 * MapSearchPOC - Full-screen map with AI-powered natural language search
 *
 * This component combines:
 * - AISearchInput for natural language queries with OpenAI entity extraction
 * - MapContainer for full-screen property map with clustering
 * - Real-time sync between search filters and map display
 *
 * @example
 * <MapSearchPOC
 *   openaiApiKey="sk-..."
 *   repliersApiKey="..."
 *   mapboxToken="pk...."
 * />
 */
export function MapSearchPOC({
  openaiApiKey,
  repliersApiKey,
  mapboxToken
}: MapSearchPOCProps) {
  const [entities, setEntities] = useState<ExtractedEntities>({});
  const [map, setMap] = useState<MapboxMap | null>(null);
  const [resultsCount, setResultsCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Convert entities to map filters
  const mapFilters = useMapFilters(entities);

  // Sync map location with search
  useMapSync(map, entities.location, repliersApiKey);

  /**
   * Handle search completion from AISearchInput
   */
  const handleSearchComplete = (data: SearchCompletionData) => {
    console.group('Search Complete');
    console.log('Query:', data.query);
    console.log('Entities:', data.entities);
    console.log('Results:', data.results.length);
    console.log('Summary:', data.summary);
    console.groupEnd();

    setSearchQuery(data.query);
    setEntities(data.entities);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Full-screen map */}
      <MapContainer
        filters={mapFilters}
        onMapLoad={setMap}
        onResultsUpdate={setResultsCount}
        mapboxToken={mapboxToken}
        repliersApiKey={repliersApiKey}
      />

      {/* Floating search at top-left */}
      <div className="absolute top-6 left-6 z-50 w-full max-w-[600px]">
        <AISearchInput
          openaiApiKey={openaiApiKey}
          repliersApiKey={repliersApiKey}
          onSearchComplete={handleSearchComplete}
          onQueryChange={() => {}} // Required but not used - using onSearchComplete instead
          onSearch={() => {}} // Required but deprecated - using onSearchComplete instead
          initialValue=""
          width="100%"
          placeholder="Search for properties... (e.g., '3 bedroom condo in Toronto under $800k')"
        />
      </div>

      {/* Results count bottom-left */}
      {resultsCount > 0 && (
        <div className="absolute bottom-6 left-6 bg-white rounded-lg px-4 py-2 shadow-lg z-10">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-900">
              {resultsCount.toLocaleString()} {resultsCount === 1 ? 'property' : 'properties'}
            </span>
            {searchQuery && (
              <span className="text-xs text-gray-500 truncate max-w-[200px]">
                {searchQuery}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Active filters display - bottom-right */}
      {Object.keys(entities).length > 0 && (
        <div className="absolute bottom-6 right-6 bg-white rounded-lg px-4 py-3 shadow-lg z-10 max-w-[300px]">
          <div className="text-xs font-semibold text-gray-700 mb-2">Active Filters</div>
          <div className="flex flex-wrap gap-2">
            {entities.location && (
              <div className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs">
                {entities.location}
              </div>
            )}
            {entities.bedrooms && (
              <div className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs">
                {entities.bedrooms}+ bed
              </div>
            )}
            {entities.bathrooms && (
              <div className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs">
                {entities.bathrooms}+ bath
              </div>
            )}
            {entities.property_type && (
              <div className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs">
                {entities.property_type}
              </div>
            )}
            {entities.price_max && (
              <div className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs">
                Under ${entities.price_max}k
              </div>
            )}
            {entities.price_min && (
              <div className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs">
                Over ${entities.price_min}k
              </div>
            )}
            {entities.sqft_min && (
              <div className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs">
                {entities.sqft_min}+ sqft
              </div>
            )}
            {entities.waterfront && (
              <div className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs">
                Waterfront
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MapSearchPOC;
