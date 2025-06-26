import React, { useState } from "react";

// Types
interface PropertyListing {
  id: string;
  address: string;
  price?: number;
  beds?: number;
  baths?: number;
  sqft?: number;
  yearBuilt?: number;
  propertyType?: string;
  status?: string;
  [key: string]: any;
}

interface PropertyDetailsDisplayProps {
  listing: PropertyListing;
  className?: string;
}

export function PropertyDetailsDisplay({
  listing,
  className = "",
}: PropertyDetailsDisplayProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`;
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return "Not available";

    try {
      let date: Date;

      if (typeof timestamp === "number") {
        date =
          timestamp > 1000000000000
            ? new Date(timestamp)
            : new Date(timestamp * 1000);
      } else if (typeof timestamp === "string") {
        date = new Date(timestamp);
      } else {
        return String(timestamp);
      }

      if (isNaN(date.getTime())) {
        return String(timestamp);
      }

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      });
    } catch (error) {
      return String(timestamp);
    }
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
      if (address.state) parts.push(address.state);
      if (address.zip || address.postalCode)
        parts.push(address.zip || address.postalCode);

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

  const getSmallImageUrl = (imageUrl: string) => {
    return imageUrl.replace(/\?class=\w+/, "?class=small");
  };

  const getLargeImageUrl = (imageUrl: string) => {
    return imageUrl.replace(/\?class=\w+/, "?class=large");
  };

  const allImages = extractImages(listing);
  const validFieldCount = Object.entries(listing).filter(
    ([, value]) => value !== null && value !== undefined
  ).length;

  return (
    <div className={className}>
      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
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
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded text-sm">
              Click anywhere to close
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Property Details
            </h3>
            <p className="text-sm text-gray-500">
              {formatAddress(listing.address)}
            </p>
          </div>
          {listing.status && (
            <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              {listing.status === "A"
                ? "Available"
                : listing.status === "U"
                ? "Sold"
                : listing.status}
            </span>
          )}
        </div>

        {/* ALL PROPERTY DATA - Show every available field */}
        <div className="space-y-6">
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
              🔍 Complete Property Information (Click to expand) -{" "}
              {validFieldCount} fields
            </summary>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(listing).map(([key, value]) => {
                // Skip null/undefined values
                if (value === null || value === undefined) return null;

                // Format the value for display
                let displayValue;
                if (typeof value === "object") {
                  if (key === "address") {
                    displayValue = formatAddress(value);
                  } else if (Array.isArray(value)) {
                    // Check if it's an image array
                    if (
                      value.every(
                        (item) =>
                          typeof item === "string" &&
                          item.match(/^IMG-[A-Z0-9]+_\d+\.jpg$/i)
                      )
                    ) {
                      displayValue = "images"; // Special marker for image arrays
                    } else if (
                      value.length > 0 &&
                      typeof value[0] === "object" &&
                      value[0] !== null
                    ) {
                      // Handle array of objects
                      const objectDescriptions = value.map((obj, index) => {
                        if (typeof obj === "object" && obj !== null) {
                          const allProps = Object.entries(obj)
                            .filter(([, v]) => v !== null && v !== undefined)
                            .map(([k, v]) => {
                              const formattedKey = k
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) => str.toUpperCase());
                              return `${formattedKey}: ${v}`;
                            })
                            .join(", ");
                          return allProps || `Item ${index + 1}`;
                        }
                        return String(obj);
                      });
                      displayValue = objectDescriptions.join(" | ");
                    } else {
                      displayValue = value.join(", ");
                    }
                  } else if (
                    [
                      "map",
                      "details",
                      "lot",
                      "rooms",
                      "brokerage",
                      "taxes",
                      "timestamps",
                      "estimate",
                      "office",
                      "nearby",
                      "openHouse",
                      "open_house",
                      "openhouse",
                    ].includes(key) &&
                    value !== null
                  ) {
                    // Handle special objects with human-readable display
                    displayValue = null; // We'll handle this specially below
                  } else {
                    displayValue = JSON.stringify(value, null, 2);
                  }
                } else if (
                  typeof value === "number" &&
                  (key.includes("price") ||
                    key.includes("Price") ||
                    key.includes("cost") ||
                    key.includes("Cost") ||
                    key.includes("value") ||
                    key.includes("Value"))
                ) {
                  displayValue = formatPrice(value);
                } else if (typeof value === "number" && key.includes("sqft")) {
                  displayValue = value.toLocaleString() + " sqft";
                } else if (typeof value === "boolean") {
                  displayValue = value ? "Yes" : "No";
                } else if (
                  typeof value === "string" &&
                  (key.toLowerCase().includes("date") ||
                    key.toLowerCase().includes("time") ||
                    key.toLowerCase() === "listdate" ||
                    key.toLowerCase() === "list date") &&
                  (value.includes("T") ||
                    value.includes("-") ||
                    !isNaN(Date.parse(value)))
                ) {
                  displayValue = formatTimestamp(value);
                } else {
                  displayValue = String(value);
                }

                // Format the key name for display
                const displayKey = key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase());

                return (
                  <div key={key} className="border-l-2 border-blue-200 pl-3">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {displayKey}
                    </div>
                    <div className="text-sm font-medium text-gray-900 mt-1 break-words">
                      {[
                        "map",
                        "details",
                        "lot",
                        "rooms",
                        "brokerage",
                        "taxes",
                        "timestamps",
                        "estimate",
                        "office",
                        "nearby",
                        "openHouse",
                        "open_house",
                        "openhouse",
                      ].includes(key) &&
                      typeof value === "object" &&
                      value !== null ? (
                        <div className="space-y-1">
                          {Object.entries(value).map(([subKey, subValue]) => {
                            if (subValue === null || subValue === undefined)
                              return null;

                            const formattedSubKey = subKey
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase());

                            let formattedSubValue;
                            if (
                              typeof subValue === "object" &&
                              subValue !== null
                            ) {
                              if (Array.isArray(subValue)) {
                                formattedSubValue = subValue.join(", ");
                              } else {
                                const nestedObj = subValue as any;
                                if (nestedObj.count || nestedObj.number) {
                                  formattedSubValue =
                                    nestedObj.count || nestedObj.number;
                                } else {
                                  formattedSubValue = Object.entries(nestedObj)
                                    .filter(
                                      ([, v]) => v !== null && v !== undefined
                                    )
                                    .map(([k, v]) => `${k}: ${v}`)
                                    .join(", ");
                                }
                              }
                            } else if (
                              typeof subValue === "number" &&
                              (subKey.includes("price") ||
                                subKey.includes("Price"))
                            ) {
                              formattedSubValue = formatPrice(subValue);
                            } else if (
                              typeof subValue === "number" &&
                              subKey.includes("sqft")
                            ) {
                              formattedSubValue =
                                subValue.toLocaleString() + " sqft";
                            } else if (typeof subValue === "boolean") {
                              formattedSubValue = subValue ? "Yes" : "No";
                            } else if (
                              key === "timestamps" ||
                              subKey.toLowerCase().includes("date") ||
                              subKey.toLowerCase().includes("time")
                            ) {
                              formattedSubValue = formatTimestamp(subValue);
                            } else {
                              formattedSubValue = String(subValue);
                            }

                            return (
                              <div
                                key={subKey}
                                className="flex justify-between items-start py-0.5 border-b border-gray-100 last:border-b-0"
                              >
                                <span className="text-xs text-gray-600 font-medium min-w-0 mr-2">
                                  {formattedSubKey}:
                                </span>
                                <span className="text-xs text-gray-900 text-right break-words">
                                  {formattedSubValue}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ) : typeof value === "object" &&
                        !Array.isArray(value) &&
                        key !== "address" ? (
                        <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-32">
                          {displayValue}
                        </pre>
                      ) : displayValue === "images" && Array.isArray(value) ? (
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                          {value.map((imageFilename, index) => {
                            const fullUrl = `https://cdn.repliers.io/${imageFilename}?class=small`;
                            return (
                              <div
                                key={index}
                                className="relative aspect-square bg-gray-100 rounded overflow-hidden cursor-pointer hover:shadow-md transition-shadow group"
                                onClick={() =>
                                  setSelectedImage(getLargeImageUrl(fullUrl))
                                }
                              >
                                <img
                                  src={fullUrl}
                                  alt={`Photo ${index + 1}`}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white bg-opacity-90 rounded-full p-1">
                                    <svg
                                      className="w-3 h-3 text-gray-800"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                      />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <span>{displayValue}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </details>

          {/* Raw JSON Data for debugging */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <details className="group">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                🔍 Raw JSON Data (Click to expand)
              </summary>
              <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                <pre className="text-xs text-gray-600 overflow-auto max-h-96 whitespace-pre-wrap">
                  {JSON.stringify(listing, null, 2)}
                </pre>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
