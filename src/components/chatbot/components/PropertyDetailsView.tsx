import React, { useState, useMemo } from "react";

// Note: We're using a flexible interface that accepts any property structure
// This matches the pattern from property-details-display.tsx
interface PropertyListing {
  mlsNumber?: string;
  listPrice?: number;
  address?: any;
  price?: number;
  beds?: number;
  baths?: number;
  sqft?: number;
  yearBuilt?: number;
  propertyType?: string;
  status?: string;
  bedrooms?: number;
  bathrooms?: number;
  details?: any;
  images?: string[];
  [key: string]: any;
}

export interface PropertyDetailsViewProps {
  listing: PropertyListing;
}

/**
 * PropertyDetailsView Component
 *
 * Displays comprehensive property details in the PropertyPanel.
 * Adapted from property-details-display.tsx with cleaner UI for panel view.
 *
 * Features:
 * - Image gallery with modal view
 * - All property fields organized in sections
 * - Smart formatting for prices, dates, addresses
 * - Expandable sections for detailed data
 */
export function PropertyDetailsView({ listing }: PropertyDetailsViewProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Memoize field count
  const validFieldCount = useMemo(() => {
    if (!listing) return 0;
    return Object.entries(listing).filter(
      ([, value]) => value !== null && value !== undefined
    ).length;
  }, [listing]);

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`;
  };

  const formatAddress = (address: any) => {
    if (typeof address === "string") {
      return address;
    }

    if (typeof address === "object" && address !== null) {
      const parts = [];
      if (address.streetNumber) parts.push(address.streetNumber);
      if (address.streetName) parts.push(address.streetName);
      if (address.streetSuffix) parts.push(address.streetSuffix);
      if (address.city) parts.push(address.city);
      if (address.province || address.state)
        parts.push(address.province || address.state);
      if (address.postalCode || address.zip)
        parts.push(address.postalCode || address.zip);

      return parts.length > 0 ? parts.join(" ") : "Address not available";
    }

    return "Address not available";
  };

  const extractImages = (obj: any): string[] => {
    const images: string[] = [];

    const searchForImages = (value: any) => {
      if (typeof value === "string") {
        if (value.includes("cdn.repliers.io") && value.includes("IMG-")) {
          images.push(value);
        } else if (value.match(/^IMG-[A-Z0-9]+_\d+\.jpg$/i)) {
          const fullUrl = `https://cdn.repliers.io/${value}?class=small`;
          images.push(fullUrl);
        }
      } else if (Array.isArray(value)) {
        value.forEach(searchForImages);
      } else if (typeof value === "object" && value !== null) {
        Object.values(value).forEach(searchForImages);
      }
    };

    searchForImages(obj);
    return [...new Set(images)];
  };

  const getLargeImageUrl = (imageUrl: string) => {
    return imageUrl
      .replace(/class=\w+/, "class=large")
      .replace(/(?<!\?)class=large/, "?class=large");
  };

  const images = extractImages(listing);
  const displayPrice =
    listing.listPrice || listing.price || listing.details?.listPrice;
  const displayBeds =
    listing.bedrooms || listing.beds || listing.details?.numBedrooms;
  const displayBaths =
    listing.bathrooms || listing.baths || listing.details?.numBathrooms;

  return (
    <div className="space-y-6">
      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl max-h-full">
            <img
              src={selectedImage}
              alt="Property photo large view"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all"
            >
              <svg
                className="w-6 h-6 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Photos
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {images.slice(0, 9).map((imageUrl, index) => (
              <div
                key={index}
                className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
                onClick={() => setSelectedImage(getLargeImageUrl(imageUrl))}
              >
                <img
                  src={imageUrl}
                  alt={`Property photo ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all" />
              </div>
            ))}
          </div>
          {images.length > 9 && (
            <p className="text-xs text-gray-500">
              +{images.length - 9} more photos
            </p>
          )}
        </div>
      )}

      {/* Property Header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {displayPrice ? formatPrice(displayPrice) : "Price not available"}
          </h2>
          {listing.status && (
            <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              {listing.status}
            </span>
          )}
        </div>
        <p className="text-gray-600">{formatAddress(listing.address)}</p>
      </div>

      {/* Key Details */}
      <div className="grid grid-cols-3 gap-4">
        {displayBeds !== undefined && (
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {displayBeds}
            </div>
            <div className="text-xs text-gray-600 uppercase tracking-wide">
              Beds
            </div>
          </div>
        )}
        {displayBaths !== undefined && (
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {displayBaths}
            </div>
            <div className="text-xs text-gray-600 uppercase tracking-wide">
              Baths
            </div>
          </div>
        )}
        {(listing.sqft || listing.details?.sqft) && (
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {listing.sqft || listing.details?.sqft}
            </div>
            <div className="text-xs text-gray-600 uppercase tracking-wide">
              Sqft
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      {(listing.description || listing.details?.description) && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Description
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {listing.description || listing.details?.description}
          </p>
        </div>
      )}

      {/* All Property Data - Expandable */}
      <details className="group border border-gray-200 rounded-lg">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          Complete Property Information ({validFieldCount} fields)
        </summary>
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(listing)
              .filter(([, value]) => value !== null && value !== undefined)
              .map(([key, value]) => {
                const displayKey = key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase());

                let displayValue;
                if (typeof value === "object") {
                  if (key === "address") {
                    displayValue = formatAddress(value);
                  } else if (Array.isArray(value) && value.length > 0) {
                    displayValue = value.join(", ");
                  } else {
                    displayValue = JSON.stringify(value, null, 2);
                  }
                } else if (
                  typeof value === "number" &&
                  (key.includes("price") || key.includes("Price"))
                ) {
                  displayValue = formatPrice(value);
                } else {
                  displayValue = String(value);
                }

                return (
                  <div
                    key={key}
                    className="flex justify-between items-start gap-4 py-2 border-b border-gray-200 last:border-b-0"
                  >
                    <span className="text-xs font-medium text-gray-600 uppercase tracking-wide min-w-0">
                      {displayKey}:
                    </span>
                    <span className="text-xs text-gray-900 text-right break-words">
                      {displayValue}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      </details>

      {/* MLS Number */}
      {listing.mlsNumber && (
        <div className="text-xs text-gray-500 text-center">
          MLS® #{listing.mlsNumber}
        </div>
      )}
    </div>
  );
}
