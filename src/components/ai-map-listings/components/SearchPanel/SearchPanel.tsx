import React, { useState, useRef, useEffect, useCallback } from "react";
import { SearchInput } from "./SearchInput";
import { ActivityLog } from "./ActivityLog";
import type { SearchPanelProps } from "./types";
import type { ActivityLogEntry } from "../../types";
import { useNLPSearch } from "../../hooks/useNLPSearch";
import { parseNLPUrl, extractNLPSummary, extractLocationFromNLP } from "../../utils/nlp-parser";
import { BedroomBathroomFilter } from "../FilterSections/BedroomBathroomFilter";
import { PropertyTypeFilter } from "../FilterSections/PropertyTypeFilter";
import { PriceRangeFilter } from "../filters/PriceRangeFilter";
import { SquareFootageFilter } from "../filters/SquareFootageFilter";
import { ChevronDown, Sparkles, Pencil, Ban } from "lucide-react";

const SAMPLE_SEARCHES = [
  "2 bedroom 2 bath condo in rosedale",
  "3+ bed house in north york close to the highway",
  "waterfront properties for rent in downtown toronto",
];

export function SearchPanel({
  filters,
  onFiltersChange,
  onSearch,
  apiKey,
  onMapUpdate,
  onPolygonChange,
  onDrawStart,
  onDrawClear,
  onCancelDraw,
  hasPolygon = false,
  isDrawing = false,
}: SearchPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  const { processSearch, isProcessing, error, resetNlpId } =
    useNLPSearch(apiKey);

  // Add log entry
  const addLogEntry = useCallback((
    type: ActivityLogEntry['type'],
    data: ActivityLogEntry['data']
  ) => {
    const entry: ActivityLogEntry = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      type,
      data,
    };
    setActivityLog((prev) => {
      // If adding an 'understood' entry, remove any 'status' (loading) entries
      const filteredLog = type === 'understood'
        ? prev.filter(e => e.type !== 'status')
        : prev;

      const newLog = [...filteredLog, entry];
      // Keep last 100 entries
      return newLog.slice(-100);
    });
  }, []);

  // Handle polygon change events from map (called by parent AIMapListings)
  useEffect(() => {
    // This effect ensures the callback stays fresh with current addLogEntry
    // The actual callback invocation happens from AIMapListings
  }, [onPolygonChange, addLogEntry]);

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

  const handleSearch = async (queryOverride?: string) => {
    const query = queryOverride || searchQuery;
    if (!query.trim()) return;

    // If using a sample search, update the input
    if (queryOverride) {
      setSearchQuery(queryOverride);
    }

    // Log the search
    addLogEntry('search', { query });

    // Log processing status with a fun message
    const funMessages = [
      'Crunching the numbers...',
      'Consulting with the property spirits...',
      'Asking the real estate gods...',
      'Searching high and low...',
      'Scouring the neighborhoods...',
    ];
    const randomMessage = funMessages[Math.floor(Math.random() * funMessages.length)];
    addLogEntry('status', { message: randomMessage });

    const nlpResponse = await processSearch(query);

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
        // Priority 1: Use map polygon from URL if available
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
        // Priority 2: Use location data from NLP response (no extra API call needed!)
        else {
          const locationData = extractLocationFromNLP(nlpResponse);

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

      // Log AI understanding
      addLogEntry('understood', {
        summary: summary || 'Search understood',
        filters: parsedFilters,
      });

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
        borderRadius: "16px",
        padding: "0",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
        zIndex: 1000,
        transition: "all 300ms ease-out",
        maxHeight: isExpanded ? "calc(100vh - 32px)" : "auto",
        overflow: isExpanded ? "hidden" : "visible",
      }}
    >
      {/* Search Input with Draw Controls */}
      <div style={{ position: "relative" }}>
        <SearchInput
          value={searchQuery}
          onChange={handleSearchQueryChange}
          onFocus={handleFocus}
          onSearch={handleSearch}
          isSearching={isProcessing}
          placeholder="Search properties..."
        />

        {/* Draw Controls - Top Right */}
        {onDrawStart && (
          <div
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              alignItems: "center",
            }}
          >
            {/* Pencil icon with Ban overlay when drawing or polygon exists */}
            <button
              onClick={isDrawing || hasPolygon ? (isDrawing ? onCancelDraw : onDrawClear) : onDrawStart}
              disabled={isDrawing || hasPolygon ? false : false}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                border: `1px solid ${isDrawing || hasPolygon ? '#fecaca' : '#e5e7eb'}`,
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 200ms",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                position: "relative",
              }}
              title={isDrawing ? "Cancel drawing" : hasPolygon ? "Clear custom search area" : "Draw custom search area on map"}
              onMouseEnter={(e) => {
                if (isDrawing || hasPolygon) {
                  e.currentTarget.style.background = "#fef2f2";
                  e.currentTarget.style.borderColor = "#f87171";
                } else {
                  e.currentTarget.style.background = "#f9fafb";
                  e.currentTarget.style.borderColor = "#6366f1";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "white";
                e.currentTarget.style.borderColor = isDrawing || hasPolygon ? "#fecaca" : "#e5e7eb";
              }}
            >
              {/* Always show pencil */}
              <Pencil size={16} color="#6366f1" />

              {/* Overlay Ban icon when drawing or polygon exists */}
              {(isDrawing || hasPolygon) && (
                <Ban
                  size={14}
                  color="#ef4444"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              )}
            </button>
          </div>
        )}
      </div>

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

      {/* Expandable Content */}
      <div
        style={{
          maxHeight: isExpanded ? "calc(100vh - 160px)" : "0",
          opacity: isExpanded ? 1 : 0,
          overflow: isExpanded ? "auto" : "hidden",
          transition: "max-height 300ms ease-out, opacity 300ms ease-out",
          marginTop: isExpanded ? "20px" : "0",
          padding: isExpanded ? "0 16px 16px 16px" : "0",
        }}
      >
        {/* Sample Searches Section - Only show before first search */}
        {!showFilters && activityLog.length === 0 && (
          <div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: "700",
                color: "#9ca3af",
                marginBottom: "12px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Sparkles size={14} />
              Try These Searches
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {SAMPLE_SEARCHES.map((sample, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(sample)}
                  disabled={isProcessing}
                  style={{
                    padding: "12px 16px",
                    background:
                      "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    fontSize: "14px",
                    color: "#374151",
                    textAlign: "left",
                    cursor: isProcessing ? "not-allowed" : "pointer",
                    transition: "all 200ms ease",
                    fontWeight: "500",
                  }}
                  onMouseEnter={(e) => {
                    if (!isProcessing) {
                      e.currentTarget.style.background =
                        "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)";
                      e.currentTarget.style.borderColor = "#c7d2fe";
                      e.currentTarget.style.transform = "translateX(4px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)";
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  {sample}
                </button>
              ))}
            </div>
            <div
              style={{
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, #e5e7eb 50%, transparent)",
                margin: "16px 0",
              }}
            />
          </div>
        )}

        {/* Activity Log - Show after search is performed */}
        {!showFilters && activityLog.length > 0 && (
          <div>
            <ActivityLog
              entries={activityLog}
              onChipClick={() => setShowFilters(true)}
            />
            <div
              style={{
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, #e5e7eb 50%, transparent)",
                margin: "16px 0",
              }}
            />
          </div>
        )}

        {/* Advanced Filters Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            width: "100%",
            padding: "12px 16px",
            background: "transparent",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: "600",
            color: "#6366f1",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transition: "all 200ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f9fafb";
            e.currentTarget.style.borderColor = "#6366f1";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "#e5e7eb";
          }}
        >
          <span>{showFilters ? "Hide" : "Show"} Advanced Filters</span>
          <ChevronDown
            size={18}
            style={{
              transform: showFilters ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 200ms ease",
            }}
          />
        </button>

        {/* Filter Sections */}
        {showFilters && (
          <div style={{ marginTop: "12px" }}>
            {/* Listing Type */}
            <div style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  onClick={() =>
                    onFiltersChange({
                      ...filters,
                      listingType: "sale",
                    })
                  }
                  style={{
                    flex: 1,
                    padding: "6px 12px",
                    backgroundColor:
                      (filters.listingType || "sale") === "sale" ? "#6366f1" : "white",
                    color:
                      (filters.listingType || "sale") === "sale" ? "white" : "#374151",
                    border: `1px solid ${
                      (filters.listingType || "sale") === "sale" ? "#6366f1" : "#d1d5db"
                    }`,
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight:
                      (filters.listingType || "sale") === "sale" ? "600" : "400",
                    cursor: "pointer",
                    transition: "all 200ms ease",
                  }}
                  onMouseEnter={(e) => {
                    if ((filters.listingType || "sale") !== "sale") {
                      e.currentTarget.style.backgroundColor = "#f9fafb";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if ((filters.listingType || "sale") !== "sale") {
                      e.currentTarget.style.backgroundColor = "white";
                    }
                  }}
                >
                  For Sale
                </button>
                <button
                  onClick={() =>
                    onFiltersChange({
                      ...filters,
                      listingType: "lease",
                    })
                  }
                  style={{
                    flex: 1,
                    padding: "6px 12px",
                    backgroundColor:
                      filters.listingType === "lease" ? "#6366f1" : "white",
                    color:
                      filters.listingType === "lease" ? "white" : "#374151",
                    border: `1px solid ${
                      filters.listingType === "lease" ? "#6366f1" : "#d1d5db"
                    }`,
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight:
                      filters.listingType === "lease" ? "600" : "400",
                    cursor: "pointer",
                    transition: "all 200ms ease",
                  }}
                  onMouseEnter={(e) => {
                    if (filters.listingType !== "lease") {
                      e.currentTarget.style.backgroundColor = "#f9fafb";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (filters.listingType !== "lease") {
                      e.currentTarget.style.backgroundColor = "white";
                    }
                  }}
                >
                  For Lease
                </button>
              </div>
            </div>

            {/* Property Type */}
            <div style={{ marginBottom: "12px" }}>
              <PropertyTypeFilter
                filters={filters}
                onFiltersChange={onFiltersChange}
                apiKey={apiKey}
              />
            </div>

            {/* Price Range */}
            <div style={{ marginBottom: "12px" }}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "#6b7280",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Price Range
              </div>
              <PriceRangeFilter
                initialMin={filters.minPrice || 0}
                initialMax={filters.maxPrice || null}
                onApply={(min, max) => {
                  onFiltersChange({
                    ...filters,
                    minPrice: min || undefined,
                    maxPrice: max || undefined,
                  });
                }}
              />
            </div>

            {/* Bedrooms & Bathrooms */}
            <div style={{ marginBottom: "12px" }}>
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

            {/* Garage/Parking */}
            <div style={{ marginBottom: "12px" }}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "#6b7280",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Garage / Parking
              </div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {["all", "1+", "2+", "3+", "4+", "5+"].map((value) => (
                  <button
                    key={value}
                    onClick={() =>
                      onFiltersChange({
                        ...filters,
                        garageSpaces: value as any,
                      })
                    }
                    style={{
                      padding: "6px 12px",
                      backgroundColor:
                        filters.garageSpaces === value ? "#6366f1" : "white",
                      color:
                        filters.garageSpaces === value ? "white" : "#374151",
                      border: `1px solid ${
                        filters.garageSpaces === value ? "#6366f1" : "#d1d5db"
                      }`,
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight:
                        filters.garageSpaces === value ? "600" : "400",
                      cursor: "pointer",
                      transition: "all 200ms ease",
                    }}
                    onMouseEnter={(e) => {
                      if (filters.garageSpaces !== value) {
                        e.currentTarget.style.backgroundColor = "#f9fafb";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.garageSpaces !== value) {
                        e.currentTarget.style.backgroundColor = "white";
                      }
                    }}
                  >
                    {value === "all" ? "All" : value}
                  </button>
                ))}
              </div>
            </div>

            {/* Square Footage */}
            <div style={{ marginBottom: "12px" }}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "#6b7280",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Square Footage
              </div>
              <SquareFootageFilter
                initialMin={filters.minSqft || 0}
                initialMax={filters.maxSqft || null}
                onApply={(min, max) => {
                  onFiltersChange({
                    ...filters,
                    minSqft: min || undefined,
                    maxSqft: max || undefined,
                  });
                }}
              />
            </div>

            {/* Open House */}
            <div style={{ marginBottom: "12px" }}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "#6b7280",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Open House
              </div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {[
                  { value: "all", label: "All" },
                  { value: "today", label: "Today" },
                  { value: "thisWeekend", label: "This Weekend" },
                  { value: "thisWeek", label: "This Week" },
                  { value: "anytime", label: "Anytime" },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() =>
                      onFiltersChange({ ...filters, openHouse: value as any })
                    }
                    style={{
                      padding: "6px 12px",
                      backgroundColor:
                        filters.openHouse === value ? "#6366f1" : "white",
                      color: filters.openHouse === value ? "white" : "#374151",
                      border: `1px solid ${
                        filters.openHouse === value ? "#6366f1" : "#d1d5db"
                      }`,
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: filters.openHouse === value ? "600" : "400",
                      cursor: "pointer",
                      transition: "all 200ms ease",
                    }}
                    onMouseEnter={(e) => {
                      if (filters.openHouse !== value) {
                        e.currentTarget.style.backgroundColor = "#f9fafb";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.openHouse !== value) {
                        e.currentTarget.style.backgroundColor = "white";
                      }
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Maintenance Fee */}
            <div style={{ marginBottom: "12px" }}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "#6b7280",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Max Maintenance Fee
              </div>
              <input
                type="number"
                placeholder="Enter max fee"
                value={filters.maxMaintenanceFee || ""}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    maxMaintenanceFee: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
            </div>

            {/* Active Listings */}
            <div style={{ marginBottom: "12px" }}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "#6b7280",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Active Listings
              </div>
              <select
                value={filters.activeListingDays || "all"}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    activeListingDays: e.target.value === "off" ? undefined : (e.target.value as any),
                  })
                }
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  background: "white",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "13px",
                  color: "#374151",
                  cursor: "pointer",
                }}
              >
                <option value="off">Off</option>
                <option value="all">All</option>
                <option value="1">Last 24 hours</option>
                <option value="3">Last 3 days</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="15+">More than 15 days</option>
                <option value="30+">More than 30 days</option>
                <option value="60+">More than 60 days</option>
                <option value="90+">More than 90 days</option>
              </select>
            </div>

            {/* Sold Listings */}
            <div style={{ marginBottom: "12px" }}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "#6b7280",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Sold Listings
              </div>
              <select
                value={filters.soldListingDays || "off"}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    soldListingDays: e.target.value === "off" ? undefined : (e.target.value as any),
                  })
                }
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  background: "white",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "13px",
                  color: "#374151",
                  cursor: "pointer",
                }}
              >
                <option value="off">Off</option>
                <option value="1">Last 24 hours</option>
                <option value="3">Last 3 days</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="180">Last 180 days</option>
                <option value="360">Last 360 days</option>
                <option value="2025">Year 2025</option>
                <option value="2024">Year 2024</option>
                <option value="2023">Year 2023</option>
                <option value="2022">Year 2022</option>
                <option value="2021">Year 2021</option>
                <option value="2020">Year 2020</option>
              </select>
            </div>

            {/* De-listed (Unavailable) Listings */}
            <div style={{ marginBottom: "12px" }}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "#6b7280",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                De-listed Listings
              </div>
              <select
                value={filters.unavailableListingDays || "off"}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    unavailableListingDays: e.target.value === "off" ? undefined : (e.target.value as any),
                  })
                }
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  background: "white",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "13px",
                  color: "#374151",
                  cursor: "pointer",
                }}
              >
                <option value="off">Off</option>
                <option value="1">Last 24 hours</option>
                <option value="3">Last 3 days</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="180">Last 180 days</option>
                <option value="360">Last 360 days</option>
                <option value="2025">Year 2025</option>
                <option value="2024">Year 2024</option>
                <option value="2023">Year 2023</option>
                <option value="2022">Year 2022</option>
                <option value="2021">Year 2021</option>
                <option value="2020">Year 2020</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
