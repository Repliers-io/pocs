import React, { useState } from "react";
import { Home, Bed, Bath, Maximize2 } from "lucide-react";
import type { PropertyCardProps } from "../types";
import {
  formatPrice,
  formatAddress,
  formatSqft,
  getImageUrl,
  getPropertySummary,
} from "../utils/errorHandling";

/**
 * PropertyCard Component
 *
 * Displays a single property listing in a beautiful, responsive card format.
 * Includes image, price, specs (bed/bath/sqft), and address.
 *
 * Features:
 * - Lazy-loaded images with placeholder
 * - Responsive design (full width mobile, fixed width desktop)
 * - Hover effects
 * - Accessible with ARIA labels
 */
export function PropertyCard({ listing, onViewDetails }: PropertyCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageUrl = getImageUrl(listing.images?.[0]);
  const showImage = imageUrl && !imageError;
  const propertySummary = getPropertySummary(listing);

  const handleClick = () => {
    if (onViewDetails) {
      onViewDetails(listing);
    } else {
      // Default action: show alert with MLS number
      alert(`Property details:\nMLS #${listing.mlsNumber}\n\nFull details view coming soon!`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className="
        bg-white rounded-xl shadow-md overflow-hidden
        hover:shadow-xl hover:scale-[1.02]
        transition-all duration-300 ease-out
        cursor-pointer
        focus-within:ring-2 focus-within:ring-blue-500
      "
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${propertySummary}`}
    >
      {/* Property Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {showImage ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
              </div>
            )}
            <img
              src={imageUrl}
              alt={`Property at ${formatAddress(listing.address)}`}
              className={`
                w-full h-full object-cover
                transition-opacity duration-300
                ${imageLoaded ? "opacity-100" : "opacity-0"}
              `}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              loading="lazy"
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <Home className="w-16 h-16 text-gray-400" />
          </div>
        )}

        {/* Property Type Badge */}
        {listing.propertyType && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-md">
            {listing.propertyType}
          </div>
        )}

        {/* Status Badge */}
        {listing.status && (
          <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
            {listing.status}
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="p-4 space-y-3">
        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice(listing.listPrice)}
          </span>
          <span className="text-sm text-gray-500">
            MLS #{listing.mlsNumber}
          </span>
        </div>

        {/* Specs: Bedrooms, Bathrooms, Sqft */}
        <div className="flex items-center gap-4 text-gray-600">
          <div className="flex items-center gap-1.5" title="Bedrooms">
            <Bed className="w-4 h-4" />
            <span className="text-sm font-medium">
              {listing.bedrooms} bed
            </span>
          </div>
          <div className="flex items-center gap-1.5" title="Bathrooms">
            <Bath className="w-4 h-4" />
            <span className="text-sm font-medium">
              {listing.bathrooms} bath
            </span>
          </div>
          {listing.sqft && (
            <div className="flex items-center gap-1.5" title="Square footage">
              <Maximize2 className="w-4 h-4" />
              <span className="text-sm font-medium">
                {formatSqft(listing.sqft)}
              </span>
            </div>
          )}
        </div>

        {/* Address */}
        <div className="text-sm text-gray-700 pt-1 border-t border-gray-100">
          {formatAddress(listing.address)}
        </div>

        {/* View Details Button */}
        <button
          className="
            w-full mt-2 py-2 px-4
            bg-gradient-to-r from-blue-600 to-blue-700
            text-white text-sm font-semibold rounded-lg
            hover:from-blue-700 hover:to-blue-800
            active:scale-95
            transition-all duration-200
            flex items-center justify-center gap-2
          "
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          aria-label={`View full details for ${propertySummary}`}
        >
          View Details
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
