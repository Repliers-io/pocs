import React, { useState, useRef, useEffect } from "react";
import { SearchInput } from "./SearchInput";
import type { SearchPanelProps } from "./types";
import { useNLPSearch } from "../../hooks/useNLPSearch";
import { parseNLPUrl, extractNLPSummary } from "../../utils/nlp-parser";
import { geocodeLocation } from "../../utils/location-geocoder";
import { BedroomBathroomFilter } from "../FilterSections/BedroomBathroomFilter";
import { PropertyTypeFilter } from "../FilterSections/PropertyTypeFilter";

export function SearchPanel({
  filters,
  onFiltersChange,
  onSearch,
  apiKey,
  onMapUpdate,
}: SearchPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  const { processSearch, isProcessing, error, resetNlpId } = useNLPSearch(apiKey);

  // Reset NLP session when user starts typing a new search
  const handleSearchQueryChange = (value: string) => {
    setSearchQuery(value);
    // Reset NLP session to start fresh (prevents mixing old/new location data)
    if (value !== searchQuery) {
      resetNlpId();
    }
  };

  // Click outside to collapse
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  // ESC key to collapse
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isExpanded) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isExpanded]);

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    const nlpResponse = await processSearch(searchQuery);

    if (nlpResponse) {
      // Parse NLP URL into filters
      const parsedFilters = parseNLPUrl(nlpResponse.request.url);

      // Merge with existing filters (NLP takes precedence for text-based filters)
      const newFilters = {
        ...filters,
        ...parsedFilters,
      };

      onFiltersChange(newFilters);

      // If location data was returned, update the map view
      if (onMapUpdate) {
        // Priority 1: Use map polygon if available
        if (parsedFilters.map) {
          const polygon = parsedFilters.map[0];
          if (polygon && polygon.length > 0) {
            // Calculate center from polygon bounds
            const lngs = polygon.map((coord) => coord[0]);
            const lats = polygon.map((coord) => coord[1]);
            const minLng = Math.min(...lngs);
            const maxLng = Math.max(...lngs);
            const minLat = Math.min(...lats);
            const maxLat = Math.max(...lats);

            const centerLng = (minLng + maxLng) / 2;
            const centerLat = (minLat + maxLat) / 2;

            onMapUpdate({
              center: [centerLng, centerLat],
              bounds: parsedFilters.map,
              zoom: 12,
            });
          }
        }
        // Priority 2: Use Locations API to geocode neighborhood/city
        else if (parsedFilters.neighborhood || parsedFilters.city) {
          const locationData = await geocodeLocation(apiKey, {
            neighborhood: parsedFilters.neighborhood,
            city: parsedFilters.city,
          });

          if (locationData) {
            onMapUpdate({
              center: locationData.center,
              bounds: locationData.bounds,
              zoom: locationData.zoom,
            });
          }
        }
      }

      // Replace input text with NLP summary
      const summary = extractNLPSummary(nlpResponse);
      if (summary) {
        setSearchQuery(summary);
      }

      // Call the optional onSearch callback
      await onSearch?.(searchQuery);
    }
  };

  return (
    <div
      ref={panelRef}
      style={{
        position: "absolute",
        top: "16px",
        left: "16px",
        width: "600px",
        maxWidth: "calc(100vw - 32px)",
        background: "white",
        borderRadius: isExpanded ? "24px" : "32px",
        padding: "0",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
        zIndex: 1000,
        transition: "all 300ms ease-out",
        maxHeight: isExpanded ? "90vh" : "auto",
        overflowY: isExpanded ? "auto" : "visible",
      }}
    >
      {/* Search Input */}
      <SearchInput
        value={searchQuery}
        onChange={handleSearchQueryChange}
        onFocus={handleFocus}
        onSearch={handleSearch}
        isSearching={isProcessing}
        placeholder="Search properties..."
      />

      {/* Error Display */}
      {error && (
        <div
          style={{
            margin: "12px 16px",
            padding: "12px 16px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            color: "#dc2626",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      {/* Expandable Filter Sections */}
      <div
        style={{
          maxHeight: isExpanded ? "600px" : "0",
          opacity: isExpanded ? 1 : 0,
          overflow: "hidden",
          transition: "max-height 300ms ease-out, opacity 300ms ease-out",
          marginTop: isExpanded ? "20px" : "0",
          padding: isExpanded ? "0 16px 16px 16px" : "0",
        }}
      >
        {/* Section Divider */}
        <div
          style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, #e5e7eb 50%, transparent)",
            margin: "16px 0",
          }}
        />

        {/* Section Header */}
        <div
          style={{
            fontSize: "11px",
            fontWeight: "700",
            color: "#9ca3af",
            marginBottom: "16px",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Refine Your Search
        </div>

        {/* Listing Type */}
        <div style={{ marginBottom: "16px" }}>
          <select
            value={filters.listingType || "sale"}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                listingType: e.target.value as "sale" | "lease",
              })
            }
            style={{
              width: "100%",
              padding: "10px 12px",
              background: "white",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "14px",
              color: "#374151",
              cursor: "pointer",
            }}
          >
            <option value="sale">For Sale</option>
            <option value="lease">For Lease</option>
          </select>
        </div>

        {/* Property Type */}
        <div style={{ marginBottom: "16px" }}>
          <PropertyTypeFilter
            filters={filters}
            onFiltersChange={onFiltersChange}
            apiKey={apiKey}
          />
        </div>

        {/* Price Range */}
        <div style={{ marginBottom: "16px" }}>
          <div
            style={{
              fontSize: "12px",
              fontWeight: "600",
              color: "#6b7280",
              marginBottom: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Price Range
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ""}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  minPrice: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              style={{
                flex: 1,
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
              }}
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ""}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  maxPrice: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              style={{
                flex: 1,
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* Bedrooms & Bathrooms */}
        <div style={{ marginBottom: "16px" }}>
          <BedroomBathroomFilter
            bedrooms={filters.bedrooms || "all"}
            bathrooms={filters.bathrooms || "all"}
            onBedroomsChange={(value) =>
              onFiltersChange({ ...filters, bedrooms: value as any })
            }
            onBathroomsChange={(value) =>
              onFiltersChange({ ...filters, bathrooms: value as any })
            }
          />
        </div>
      </div>
    </div>
  );
}
