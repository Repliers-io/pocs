import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import type { FilterPanelProps } from "../../types";
import { PropertyTypeFilter } from "./PropertyTypeFilter";
import { PriceRangeFilter } from "./PriceRangeFilter";
import { SquareFootageFilter } from "./SquareFootageFilter";

export function FilterPanel({ filters, onFiltersChange, apiKey }: FilterPanelProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPriceFilterOpen, setIsPriceFilterOpen] = useState(false);
  const [isActiveOpen, setIsActiveOpen] = useState(false);
  const [isSoldOpen, setIsSoldOpen] = useState(false);
  const [isUnavailableOpen, setIsUnavailableOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isSqftFilterOpen, setIsSqftFilterOpen] = useState(false);
  const priceFilterRef = useRef<HTMLDivElement>(null);
  const activeFilterRef = useRef<HTMLDivElement>(null);
  const soldFilterRef = useRef<HTMLDivElement>(null);
  const unavailableFilterRef = useRef<HTMLDivElement>(null);
  const moreFiltersRef = useRef<HTMLDivElement>(null);

  const listingTypeOptions = [
    { value: "sale", label: "For Sale" },
    { value: "lease", label: "For Lease" },
  ] as const;

  const handleListingTypeChange = (value: "sale" | "lease") => {
    onFiltersChange({
      ...filters,
      listingType: value,
    });
    setIsDropdownOpen(false);
  };

  const handlePriceFilterApply = (minPrice: number, maxPrice: number | null) => {
    onFiltersChange({
      ...filters,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
    });
    setIsPriceFilterOpen(false);
  };

  const handlePriceFilterCancel = () => {
    setIsPriceFilterOpen(false);
  };

  const handleSqftFilterApply = (minSqft: number, maxSqft: number | null) => {
    onFiltersChange({
      ...filters,
      minSqft: minSqft || undefined,
      maxSqft: maxSqft || undefined,
    });
    setIsSqftFilterOpen(false);
  };

  const handleSqftFilterCancel = () => {
    setIsSqftFilterOpen(false);
  };

  // Format price display for button
  const formatPriceRange = () => {
    const hasMinPrice = filters.minPrice && filters.minPrice > 0;
    const hasMaxPrice = filters.maxPrice && filters.maxPrice !== null;

    if (!hasMinPrice && !hasMaxPrice) return "Price";

    const formatPrice = (price: number) => {
      if (price >= 1000000) {
        const millions = price / 1000000;
        return `$${millions >= 10 ? Math.round(millions) : Math.round(millions * 10) / 10}M`;
      }
      if (price >= 1000) {
        return `$${Math.round(price / 1000)}K`;
      }
      return `$${price}`;
    };

    const minText = hasMinPrice ? formatPrice(filters.minPrice!) : "$0";
    const maxText = hasMaxPrice ? formatPrice(filters.maxPrice!) : "Max";

    return `${minText} - ${maxText}`;
  };

  const selectedOption = listingTypeOptions.find(option => option.value === filters.listingType);

  // Active listing filter options
  const activeListingOptions = [
    { value: "1" as const, label: "Last 1 days" },
    { value: "3" as const, label: "Last 3 days" },
    { value: "7" as const, label: "Last 7 days" },
    { value: "30" as const, label: "Last 30 days" },
    { value: "90" as const, label: "Last 90 days" },
    { value: "all" as const, label: "Listing date - All" },
    { value: "15+" as const, label: "More than 15 days" },
    { value: "30+" as const, label: "More than 30 days" },
    { value: "60+" as const, label: "More than 60 days" },
    { value: "90+" as const, label: "More than 90 days" },
  ];

  // Format active filter label
  const formatActiveLabel = () => {
    if (filters.activeListingDays === undefined) {
      return "Off";
    }
    if (filters.activeListingDays === "all") {
      return "All";
    }
    const option = activeListingOptions.find(opt => opt.value === filters.activeListingDays);
    return option ? option.label.replace("Last ", "").replace("More than ", ">") : "All";
  };

  const isActiveFilterActive = () => {
    return filters.activeListingDays !== undefined;
  };

  // Handle active listing filter change (supports bundled searches - doesn't clear other status filters)
  const handleActiveFilterChange = (value: typeof filters.activeListingDays) => {
    onFiltersChange({ ...filters, activeListingDays: value });
    setIsActiveOpen(false);
  };

  // Handle clearing active filter (click on colored bar)
  const handleClearActiveFilter = () => {
    onFiltersChange({ ...filters, activeListingDays: undefined });
  };

  // Sold listing filter options
  const soldListingOptions = [
    { value: "1" as const, label: "Last 1 days" },
    { value: "3" as const, label: "Last 3 days" },
    { value: "7" as const, label: "Last 7 days" },
    { value: "30" as const, label: "Last 30 days" },
    { value: "90" as const, label: "Last 90 days" },
    { value: "180" as const, label: "Last 180 days" },
    { value: "360" as const, label: "Last 360 days" },
    { value: "2025" as const, label: "Year 2025" },
    { value: "2024" as const, label: "Year 2024" },
    { value: "2023" as const, label: "Year 2023" },
    { value: "2022" as const, label: "Year 2022" },
    { value: "2021" as const, label: "Year 2021" },
    { value: "2020" as const, label: "Year 2020" },
    { value: "2019" as const, label: "Year 2019" },
    { value: "2018" as const, label: "Year 2018" },
    { value: "2017" as const, label: "Year 2017" },
    { value: "2016" as const, label: "Year 2016" },
    { value: "2015" as const, label: "Year 2015" },
    { value: "2014" as const, label: "Year 2014" },
    { value: "2013" as const, label: "Year 2013" },
    { value: "2012" as const, label: "Year 2012" },
    { value: "2011" as const, label: "Year 2011" },
    { value: "2010" as const, label: "Year 2010" },
    { value: "2009" as const, label: "Year 2009" },
    { value: "2008" as const, label: "Year 2008" },
    { value: "2007" as const, label: "Year 2007" },
  ];

  // Format sold filter label
  const formatSoldLabel = () => {
    if (!filters.soldListingDays) {
      return "Off";
    }
    const option = soldListingOptions.find(opt => opt.value === filters.soldListingDays);
    return option ? option.label.replace("Last ", "").replace("Year ", "") : "Off";
  };

  const isSoldFilterActive = () => {
    return !!filters.soldListingDays;
  };

  // Handle sold listing filter change (supports bundled searches - doesn't clear other status filters)
  const handleSoldFilterChange = (value: typeof filters.soldListingDays) => {
    onFiltersChange({ ...filters, soldListingDays: value });
    setIsSoldOpen(false);
  };

  // Handle clearing sold filter (click on colored bar)
  const handleClearSoldFilter = () => {
    onFiltersChange({ ...filters, soldListingDays: undefined });
  };

  // Unavailable listing filter options (same as sold)
  const unavailableListingOptions = [
    { value: "1" as const, label: "Last 1 days" },
    { value: "3" as const, label: "Last 3 days" },
    { value: "7" as const, label: "Last 7 days" },
    { value: "30" as const, label: "Last 30 days" },
    { value: "90" as const, label: "Last 90 days" },
    { value: "180" as const, label: "Last 180 days" },
    { value: "360" as const, label: "Last 360 days" },
    { value: "2025" as const, label: "Year 2025" },
    { value: "2024" as const, label: "Year 2024" },
    { value: "2023" as const, label: "Year 2023" },
    { value: "2022" as const, label: "Year 2022" },
    { value: "2021" as const, label: "Year 2021" },
    { value: "2020" as const, label: "Year 2020" },
    { value: "2019" as const, label: "Year 2019" },
    { value: "2018" as const, label: "Year 2018" },
    { value: "2017" as const, label: "Year 2017" },
    { value: "2016" as const, label: "Year 2016" },
    { value: "2015" as const, label: "Year 2015" },
    { value: "2014" as const, label: "Year 2014" },
    { value: "2013" as const, label: "Year 2013" },
    { value: "2012" as const, label: "Year 2012" },
    { value: "2011" as const, label: "Year 2011" },
    { value: "2010" as const, label: "Year 2010" },
    { value: "2009" as const, label: "Year 2009" },
    { value: "2008" as const, label: "Year 2008" },
    { value: "2007" as const, label: "Year 2007" },
  ];

  // Format unavailable filter label
  const formatUnavailableLabel = () => {
    if (!filters.unavailableListingDays) {
      return "Off";
    }
    const option = unavailableListingOptions.find(opt => opt.value === filters.unavailableListingDays);
    return option ? option.label.replace("Last ", "").replace("Year ", "") : "Off";
  };

  const isUnavailableFilterActive = () => {
    return !!filters.unavailableListingDays;
  };

  // Handle unavailable listing filter change (supports bundled searches - doesn't clear other status filters)
  const handleUnavailableFilterChange = (value: typeof filters.unavailableListingDays) => {
    onFiltersChange({ ...filters, unavailableListingDays: value });
    setIsUnavailableOpen(false);
  };

  // Handle clearing unavailable filter (click on colored bar)
  const handleClearUnavailableFilter = () => {
    onFiltersChange({ ...filters, unavailableListingDays: undefined });
  };

  // Handle click outside to close price filter dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (priceFilterRef.current && !priceFilterRef.current.contains(event.target as Node)) {
        setIsPriceFilterOpen(false);
      }
    };

    if (isPriceFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isPriceFilterOpen]);

  // Handle click outside to close active filter dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeFilterRef.current && !activeFilterRef.current.contains(event.target as Node)) {
        setIsActiveOpen(false);
      }
    };

    if (isActiveOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isActiveOpen]);

  // Handle click outside to close sold filter dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (soldFilterRef.current && !soldFilterRef.current.contains(event.target as Node)) {
        setIsSoldOpen(false);
      }
    };

    if (isSoldOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isSoldOpen]);

  // Handle click outside to close unavailable filter dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (unavailableFilterRef.current && !unavailableFilterRef.current.contains(event.target as Node)) {
        setIsUnavailableOpen(false);
      }
    };

    if (isUnavailableOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isUnavailableOpen]);

  // Handle click outside to close more filters dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreFiltersRef.current && !moreFiltersRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };

    if (isMoreOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMoreOpen]);

  const handleClearFilters = () => {
    onFiltersChange({
      listingType: "sale",
      propertyTypes: [],
      minPrice: undefined,
      maxPrice: null,
      bedrooms: undefined,
      bathrooms: undefined,
      garageSpaces: undefined,
      minSqft: undefined,
      maxSqft: null,
      openHouse: undefined,
      maxMaintenanceFee: null,
      activeListingDays: "all",
      soldListingDays: undefined,
      unavailableListingDays: undefined,
    });
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "16px",
        left: "16px",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        padding: "12px",
        fontSize: "14px",
        fontWeight: "500",
        color: "#374151",
        zIndex: 1000,
        minWidth: "200px",
      }}
    >
      <div style={{
        marginBottom: "8px",
        fontSize: "12px",
        fontWeight: "600",
        color: "#6b7280",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span>FILTERS</span>
        <button
          onClick={handleClearFilters}
          style={{
            padding: "2px 8px",
            fontSize: "11px",
            fontWeight: "500",
            color: "#6b7280",
            backgroundColor: "transparent",
            border: "1px solid #d1d5db",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Clear
        </button>
      </div>

      {/* Listing Type Dropdown */}
      <div style={{ position: "relative", marginBottom: "12px" }}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          style={{
            width: "100%",
            padding: "8px 12px",
            backgroundColor: filters.listingType === "sale" ? "#d1fae5" : "#f3e8ff",
            border: filters.listingType === "sale" ? "1px solid #86efac" : "1px solid #d8b4fe",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#1f2937",
          }}
        >
          <span>{selectedOption?.label}</span>
          <ChevronDown
            size={16}
            style={{
              transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s"
            }}
          />
        </button>

        {isDropdownOpen && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              backgroundColor: "white",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              marginTop: "4px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              zIndex: 1001,
            }}
          >
            {listingTypeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleListingTypeChange(option.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  backgroundColor: filters.listingType === option.value ? "#f3f4f6" : "white",
                  border: "none",
                  fontSize: "14px",
                  cursor: "pointer",
                  textAlign: "left",
                  borderRadius: option === listingTypeOptions[0] ? "6px 6px 0 0" :
                            option === listingTypeOptions[listingTypeOptions.length - 1] ? "0 0 6px 6px" : "0",
                }}
                onMouseEnter={(e) => {
                  if (filters.listingType !== option.value) {
                    e.currentTarget.style.backgroundColor = "#f9fafb";
                  }
                }}
                onMouseLeave={(e) => {
                  if (filters.listingType !== option.value) {
                    e.currentTarget.style.backgroundColor = "white";
                  }
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Property Type Filter */}
      <PropertyTypeFilter
        filters={filters}
        onFiltersChange={onFiltersChange}
        apiKey={apiKey}
      />

      {/* Price Filter Button */}
      <div ref={priceFilterRef} style={{ position: "relative", marginBottom: "12px" }}>
        <button
          onClick={() => setIsPriceFilterOpen(!isPriceFilterOpen)}
          style={{
            width: "100%",
            padding: "8px 12px",
            backgroundColor: (filters.minPrice || filters.maxPrice) ? "#f3f4f6" : "white",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            textAlign: "left",
            color: (filters.minPrice || filters.maxPrice) ? "#1f2937" : "#374151",
            fontWeight: (filters.minPrice || filters.maxPrice) ? "500" : "400",
          }}
        >
          <span>{formatPriceRange()}</span>
          <ChevronDown
            size={16}
            style={{
              transform: isPriceFilterOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s"
            }}
          />
        </button>

        {/* Price Range Filter Dropdown */}
        {isPriceFilterOpen && (
          <PriceRangeFilter
            isOpen={isPriceFilterOpen}
            initialMin={filters.minPrice || 0}
            initialMax={filters.maxPrice || null}
            onApply={handlePriceFilterApply}
            onCancel={handlePriceFilterCancel}
          />
        )}
      </div>

      {/* Active Listings Filter Button */}
      <div ref={activeFilterRef} style={{ position: "relative", marginBottom: "12px" }}>
        <div
          style={{
            width: "100%",
            padding: "0",
            backgroundColor: "white",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "14px",
            display: "flex",
            overflow: "hidden",
          }}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleClearActiveFilter();
            }}
            style={{
              width: "48px",
              backgroundColor: isActiveFilterActive() ? "#10b981" : "#e5e7eb",
              flexShrink: 0,
              cursor: isActiveFilterActive() ? "pointer" : "default",
            }}
          />
          <button
            onClick={() => setIsActiveOpen(!isActiveOpen)}
            style={{
              flex: 1,
              padding: "8px 12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              textAlign: "left",
              color: "#1f2937",
              fontWeight: "500",
              cursor: "pointer",
              backgroundColor: "transparent",
              border: "none",
            }}
          >
            <span>Active: {formatActiveLabel()}</span>
            <ChevronDown
              size={16}
              style={{
                transform: isActiveOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s"
              }}
            />
          </button>
        </div>

        {/* Active Filter Dropdown */}
        {isActiveOpen && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              backgroundColor: "white",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              marginTop: "4px",
              padding: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              zIndex: 1001,
            }}
          >
            {activeListingOptions.map((option) => (
              <label
                key={option.value}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px",
                  cursor: "pointer",
                  borderRadius: "4px",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f9fafb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <input
                  type="radio"
                  name="activeListingFilter"
                  checked={filters.activeListingDays === option.value || (!filters.activeListingDays && option.value === "all")}
                  onChange={() => handleActiveFilterChange(option.value)}
                  style={{
                    marginRight: "8px",
                    width: "16px",
                    height: "16px",
                    cursor: "pointer",
                  }}
                />
                <span style={{ fontSize: "14px", color: "#374151" }}>{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Sold Listings Filter Button */}
      <div ref={soldFilterRef} style={{ position: "relative", marginBottom: "12px" }}>
        <div
          style={{
            width: "100%",
            padding: "0",
            backgroundColor: "white",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "14px",
            display: "flex",
            overflow: "hidden",
          }}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleClearSoldFilter();
            }}
            style={{
              width: "48px",
              backgroundColor: isSoldFilterActive() ? "#8b7fa8" : "#e5e7eb",
              flexShrink: 0,
              cursor: isSoldFilterActive() ? "pointer" : "default",
            }}
          />
          <button
            onClick={() => setIsSoldOpen(!isSoldOpen)}
            style={{
              flex: 1,
              padding: "8px 12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              textAlign: "left",
              color: "#1f2937",
              fontWeight: "500",
              cursor: "pointer",
              backgroundColor: "transparent",
              border: "none",
            }}
          >
            <span>Sold: {formatSoldLabel()}</span>
            <ChevronDown
              size={16}
              style={{
                transform: isSoldOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s"
              }}
            />
          </button>
        </div>

        {/* Sold Filter Dropdown */}
        {isSoldOpen && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              backgroundColor: "white",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              marginTop: "4px",
              padding: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              zIndex: 1001,
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            {soldListingOptions.map((option) => (
              <label
                key={option.value}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px",
                  cursor: "pointer",
                  borderRadius: "4px",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f9fafb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <input
                  type="radio"
                  name="soldListingFilter"
                  checked={filters.soldListingDays === option.value}
                  onChange={() => handleSoldFilterChange(option.value)}
                  style={{
                    marginRight: "8px",
                    width: "16px",
                    height: "16px",
                    cursor: "pointer",
                  }}
                />
                <span style={{ fontSize: "14px", color: "#374151" }}>{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Unavailable Listings Filter Button */}
      <div ref={unavailableFilterRef} style={{ position: "relative", marginBottom: "12px" }}>
        <div
          style={{
            width: "100%",
            padding: "0",
            backgroundColor: "white",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "14px",
            display: "flex",
            overflow: "hidden",
          }}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleClearUnavailableFilter();
            }}
            style={{
              width: "48px",
              backgroundColor: isUnavailableFilterActive() ? "#f59e0b" : "#e5e7eb",
              flexShrink: 0,
              cursor: isUnavailableFilterActive() ? "pointer" : "default",
            }}
          />
          <button
            onClick={() => setIsUnavailableOpen(!isUnavailableOpen)}
            style={{
              flex: 1,
              padding: "8px 12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              textAlign: "left",
              color: "#1f2937",
              fontWeight: "500",
              cursor: "pointer",
              backgroundColor: "transparent",
              border: "none",
            }}
          >
            <span>Unavailable: {formatUnavailableLabel()}</span>
            <ChevronDown
              size={16}
              style={{
                transform: isUnavailableOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s"
              }}
            />
          </button>
        </div>

        {/* Unavailable Filter Dropdown */}
        {isUnavailableOpen && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              backgroundColor: "white",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              marginTop: "4px",
              padding: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              zIndex: 1001,
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            {unavailableListingOptions.map((option) => (
              <label
                key={option.value}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px",
                  cursor: "pointer",
                  borderRadius: "4px",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f9fafb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <input
                  type="radio"
                  name="unavailableListingFilter"
                  checked={filters.unavailableListingDays === option.value}
                  onChange={() => handleUnavailableFilterChange(option.value)}
                  style={{
                    marginRight: "8px",
                    width: "16px",
                    height: "16px",
                    cursor: "pointer",
                  }}
                />
                <span style={{ fontSize: "14px", color: "#374151" }}>{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* More Filters Button */}
      <div ref={moreFiltersRef} style={{ position: "relative", marginBottom: "12px" }}>
        <button
          onClick={() => setIsMoreOpen(!isMoreOpen)}
          style={{
            width: "100%",
            padding: "8px 12px",
            backgroundColor: (filters.bedrooms !== "all" || filters.bathrooms !== "all" || filters.garageSpaces !== "all" || filters.minSqft || filters.maxSqft || (filters.openHouse && filters.openHouse !== "all") || filters.maxMaintenanceFee) ? "#f3f4f6" : "white",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            textAlign: "left",
            color: "#374151",
            fontWeight: (filters.bedrooms !== "all" || filters.bathrooms !== "all" || filters.garageSpaces !== "all" || filters.minSqft || filters.maxSqft || (filters.openHouse && filters.openHouse !== "all") || filters.maxMaintenanceFee) ? "500" : "400",
          }}
        >
          <span>More Filters</span>
          <ChevronDown
            size={16}
            style={{
              transform: isMoreOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s"
            }}
          />
        </button>

        {/* More Filters Dropdown */}
        {isMoreOpen && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              width: "400px",
              backgroundColor: "white",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              marginTop: "4px",
              padding: "20px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              zIndex: 1001,
            }}
          >
            {/* Bedrooms Filter */}
            <div>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#6b7280", marginBottom: "8px" }}>
                BEDROOMS
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["all", "0", "1", "2", "3", "4", "5+"].map((value) => (
                  <button
                    key={value}
                    onClick={() => onFiltersChange({ ...filters, bedrooms: value as any })}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: filters.bedrooms === value ? "#3b82f6" : "white",
                      color: filters.bedrooms === value ? "white" : "#374151",
                      border: `1px solid ${filters.bedrooms === value ? "#3b82f6" : "#d1d5db"}`,
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: filters.bedrooms === value ? "600" : "400",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (filters.bedrooms !== value) {
                        e.currentTarget.style.backgroundColor = "#f3f4f6";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.bedrooms !== value) {
                        e.currentTarget.style.backgroundColor = "white";
                      }
                    }}
                  >
                    {value === "all" ? "All" : value}
                  </button>
                ))}
              </div>
            </div>

            {/* Bathrooms Filter */}
            <div>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#6b7280", marginBottom: "8px" }}>
                BATHROOMS
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["all", "1+", "2+", "3+", "4+", "5+"].map((value) => (
                  <button
                    key={value}
                    onClick={() => onFiltersChange({ ...filters, bathrooms: value as any })}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: filters.bathrooms === value ? "#3b82f6" : "white",
                      color: filters.bathrooms === value ? "white" : "#374151",
                      border: `1px solid ${filters.bathrooms === value ? "#3b82f6" : "#d1d5db"}`,
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: filters.bathrooms === value ? "600" : "400",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (filters.bathrooms !== value) {
                        e.currentTarget.style.backgroundColor = "#f3f4f6";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.bathrooms !== value) {
                        e.currentTarget.style.backgroundColor = "white";
                      }
                    }}
                  >
                    {value === "all" ? "All" : value}
                  </button>
                ))}
              </div>
            </div>

            {/* Garage/Parking Filter */}
            <div>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#6b7280", marginBottom: "8px" }}>
                GARAGE / PARKING
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["all", "1+", "2+", "3+", "4+", "5+"].map((value) => (
                  <button
                    key={value}
                    onClick={() => onFiltersChange({ ...filters, garageSpaces: value as any })}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: filters.garageSpaces === value ? "#3b82f6" : "white",
                      color: filters.garageSpaces === value ? "white" : "#374151",
                      border: `1px solid ${filters.garageSpaces === value ? "#3b82f6" : "#d1d5db"}`,
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: filters.garageSpaces === value ? "600" : "400",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (filters.garageSpaces !== value) {
                        e.currentTarget.style.backgroundColor = "#f3f4f6";
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

            {/* Square Footage Filter */}
            <div>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#6b7280", marginBottom: "8px" }}>
                SQUARE FOOTAGE
              </div>
              <SquareFootageFilter
                isOpen={true}
                initialMin={filters.minSqft || 0}
                initialMax={filters.maxSqft || null}
                onApply={handleSqftFilterApply}
                onCancel={handleSqftFilterCancel}
              />
            </div>

            {/* Open House Filter */}
            <div>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#6b7280", marginBottom: "8px" }}>
                OPEN HOUSE
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {[
                  { value: "all", label: "All" },
                  { value: "today", label: "Today" },
                  { value: "thisWeekend", label: "This Weekend" },
                  { value: "thisWeek", label: "This Week" },
                  { value: "anytime", label: "Anytime" }
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => onFiltersChange({ ...filters, openHouse: value as any })}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: filters.openHouse === value ? "#3b82f6" : "white",
                      color: filters.openHouse === value ? "white" : "#374151",
                      border: `1px solid ${filters.openHouse === value ? "#3b82f6" : "#d1d5db"}`,
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: filters.openHouse === value ? "600" : "400",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (filters.openHouse !== value) {
                        e.currentTarget.style.backgroundColor = "#f3f4f6";
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

            {/* Maintenance Fee Filter */}
            <div>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#6b7280", marginBottom: "8px" }}>
                MAX MAINTENANCE FEE
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  type="number"
                  placeholder="Enter max fee"
                  value={filters.maxMaintenanceFee || ""}
                  onChange={(e) => {
                    const value = e.target.value ? parseInt(e.target.value) : undefined;
                    onFiltersChange({ ...filters, maxMaintenanceFee: value || null });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const value = e.currentTarget.value ? parseInt(e.currentTarget.value) : undefined;
                      onFiltersChange({ ...filters, maxMaintenanceFee: value || null });
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px",
                    color: "#374151",
                  }}
                />
                <button
                  onClick={() => {
                    // Just trigger a re-render to apply the current value
                    onFiltersChange({ ...filters });
                  }}
                  style={{
                    padding: "8px 16px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "white",
                    backgroundColor: "#3b82f6",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
