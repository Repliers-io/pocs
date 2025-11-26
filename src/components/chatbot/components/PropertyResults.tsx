import React, { useState } from "react";
import { ChevronDown, ChevronUp, Home } from "lucide-react";
import { PropertyCard } from "./PropertyCard";
import type { PropertyResultsProps } from "../types";

/**
 * PropertyResults Component
 *
 * Displays a grid of property cards with pagination controls.
 *
 * Features:
 * - Responsive grid (1 col mobile, 2 col desktop)
 * - Show 5 properties initially, "Show more" for rest
 * - Empty state with helpful message
 * - Staggered fade-in animations
 * - Property count header
 */
export function PropertyResults({
  listings,
  onViewDetails,
}: PropertyResultsProps) {
  const [showAll, setShowAll] = useState(false);
  const INITIAL_DISPLAY = 5;

  // Handle empty results
  if (!listings || listings.length === 0) {
    return (
      <div className="mt-4 p-6 bg-gray-50 rounded-xl border border-gray-200 text-center space-y-3">
        <div className="flex justify-center">
          <div className="p-3 bg-white rounded-full shadow-sm">
            <Home className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-gray-700 font-medium">No properties found</p>
          <p className="text-sm text-gray-500">
            Try adjusting your search criteria or exploring different
            neighborhoods.
          </p>
        </div>
      </div>
    );
  }

  const displayedListings = showAll
    ? listings
    : listings.slice(0, INITIAL_DISPLAY);
  const hasMore = listings.length > INITIAL_DISPLAY;

  return (
    <div className="mt-4 space-y-4">
      {/* Header with count */}
      <div className="flex items-center justify-between px-1">
        <p className="text-sm font-semibold text-gray-700">
          Found {listings.length} {listings.length === 1 ? "property" : "properties"}
        </p>
        {/* Optional: Add "New search" button here in future */}
      </div>

      {/* Property Grid */}
      <div
        className="
          grid grid-cols-1 md:grid-cols-2 gap-4
          animate-fadeIn
        "
      >
        {displayedListings.map((listing, index) => (
          <div
            key={listing.mlsNumber}
            className="animate-slideUp"
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <PropertyCard listing={listing} onViewDetails={onViewDetails} />
          </div>
        ))}
      </div>

      {/* Show More / Show Less Button */}
      {hasMore && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setShowAll(!showAll)}
            className="
              flex items-center gap-2 px-6 py-2
              bg-white border-2 border-gray-300
              text-gray-700 font-medium text-sm
              rounded-lg
              hover:border-blue-500 hover:text-blue-600
              active:scale-95
              transition-all duration-200
            "
            aria-label={showAll ? "Show fewer properties" : "Show all properties"}
          >
            {showAll ? (
              <>
                Show Less
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Show {listings.length - INITIAL_DISPLAY} More
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// Add CSS animations via style tag (if not already in global styles)
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fadeIn {
      animation: fadeIn 0.5s ease-out;
    }

    .animate-slideUp {
      opacity: 0;
      animation: slideUp 0.4s ease-out forwards;
    }
  `;
  if (!document.head.querySelector('style[data-property-animations]')) {
    style.setAttribute('data-property-animations', 'true');
    document.head.appendChild(style);
  }
}
