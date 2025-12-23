import React from "react";
import { PropertyCard } from "./PropertyCard";
import type { PropertyListing } from "../types";

export interface PropertyListingsGridProps {
  listings: PropertyListing[];
  onPropertyClick?: (property: PropertyListing) => void;
}

/**
 * PropertyListingsGrid Component
 *
 * Displays all property listings in a responsive grid layout.
 * Used in the PropertyPanel when showing "all listings" view.
 *
 * Features:
 * - Responsive grid (1-3 columns based on screen size)
 * - Clickable property cards
 * - Empty state handling
 * - Property count header
 */
export function PropertyListingsGrid({
  listings,
  onPropertyClick,
}: PropertyListingsGridProps) {
  if (!listings || listings.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No properties to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {listings.length} {listings.length === 1 ? "Property" : "Properties"}
        </h3>
      </div>

      {/* Grid */}
      <div
        className="
          grid gap-4
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >
        {listings.map((listing) => (
          <PropertyCard
            key={listing.mlsNumber}
            listing={listing}
            onViewDetails={onPropertyClick}
          />
        ))}
      </div>
    </div>
  );
}
