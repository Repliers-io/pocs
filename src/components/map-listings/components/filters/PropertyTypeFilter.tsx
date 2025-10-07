import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import type { PropertyTypeFilterProps } from "../../types";

export function PropertyTypeFilter({ filters, onFiltersChange, apiKey }: PropertyTypeFilterProps) {
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch available property types on mount
  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        const url = new URL("https://api.repliers.io/listings");
        url.searchParams.set("aggregates", "details.propertyType");
        url.searchParams.set("listings", "false");
        url.searchParams.set("status", "A");

        const response = await fetch(url.toString(), {
          headers: {
            "REPLIERS-API-KEY": apiKey,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch property types: ${response.status}`);
        }

        const data = await response.json();
        const propertyTypeData = data.aggregates?.details?.propertyType || {};

        // Extract property type names and sort by count (descending)
        const sortedPropertyTypes = Object.entries(propertyTypeData)
          .sort(([, a], [, b]) => (b as number) - (a as number))
          .map(([propertyType]) => propertyType);

        setPropertyTypes(sortedPropertyTypes);
      } catch (error) {
        // Silently handle property type fetch errors
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyTypes();
  }, [apiKey]);

  const handlePropertyTypeToggle = (propertyType: string) => {
    const isSelected = filters.propertyTypes.includes(propertyType);
    const newPropertyTypes = isSelected
      ? filters.propertyTypes.filter(type => type !== propertyType)
      : [...filters.propertyTypes, propertyType];

    onFiltersChange({
      ...filters,
      propertyTypes: newPropertyTypes,
    });
  };

  const handleAllToggle = () => {
    const allSelected = filters.propertyTypes.length === propertyTypes.length;
    onFiltersChange({
      ...filters,
      propertyTypes: allSelected ? [] : [...propertyTypes],
    });
  };

  if (loading) {
    return (
      <div style={{ position: "relative", marginBottom: "12px" }}>
        <div style={{
          padding: "8px 12px",
          fontSize: "12px",
          color: "#6b7280",
          fontStyle: "italic"
        }}>
          Loading property types...
        </div>
      </div>
    );
  }

  const allSelected = filters.propertyTypes.length === 0 || filters.propertyTypes.length === propertyTypes.length;
  const someSelected = filters.propertyTypes.length > 0 && filters.propertyTypes.length < propertyTypes.length;

  return (
    <div style={{ position: "relative", marginBottom: "12px" }}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        style={{
          width: "100%",
          padding: "8px 12px",
          backgroundColor: "white",
          border: "1px solid #d1d5db",
          borderRadius: "6px",
          fontSize: "14px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          textAlign: "left",
        }}
      >
        <span>
          {allSelected
            ? "All property types"
            : someSelected
            ? `${filters.propertyTypes.length} selected`
            : "Select property types"}
        </span>
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
            zIndex: 1002,
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          {/* All property types option */}
          <div
            onClick={handleAllToggle}
            style={{
              padding: "8px 12px",
              fontSize: "14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: allSelected ? "#f3f4f6" : "white",
              borderBottom: "1px solid #f3f4f6",
            }}
            onMouseEnter={(e) => {
              if (!allSelected) {
                e.currentTarget.style.backgroundColor = "#f9fafb";
              }
            }}
            onMouseLeave={(e) => {
              if (!allSelected) {
                e.currentTarget.style.backgroundColor = "white";
              }
            }}
          >
            <div style={{
              width: "16px",
              height: "16px",
              border: "2px solid #d1d5db",
              borderRadius: "3px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: allSelected ? "#10b981" : "white",
              borderColor: allSelected ? "#10b981" : "#d1d5db",
            }}>
              {allSelected && (
                <svg
                  width="10"
                  height="8"
                  viewBox="0 0 10 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.5 1L3.5 6L1.5 4"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            All property types
          </div>

          {/* Individual property type options */}
          {propertyTypes.map((propertyType) => {
            const isSelected = filters.propertyTypes.includes(propertyType);
            return (
              <div
                key={propertyType}
                onClick={() => handlePropertyTypeToggle(propertyType)}
                style={{
                  padding: "8px 12px",
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: isSelected ? "#f3f4f6" : "white",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = "#f9fafb";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = "white";
                  }
                }}
              >
                <div style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid #d1d5db",
                  borderRadius: "3px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: isSelected ? "#10b981" : "white",
                  borderColor: isSelected ? "#10b981" : "#d1d5db",
                }}>
                  {isSelected && (
                    <svg
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.5 1L3.5 6L1.5 4"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                {propertyType}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
