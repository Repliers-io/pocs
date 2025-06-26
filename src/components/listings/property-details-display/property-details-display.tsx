import React, { useState, useMemo } from "react";

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

  // Memoize field count to avoid render issues
  const validFieldCount = useMemo(() => {
    if (!listing) return 0;
    return Object.entries(listing).filter(
      ([, value]) => value !== null && value !== undefined
    ).length;
  }, [listing]);

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return "Not available";

    try {
      let date: Date;

      // Handle different timestamp formats
      if (typeof timestamp === "number") {
        // Unix timestamp (seconds or milliseconds)
        date =
          timestamp > 1000000000000
            ? new Date(timestamp)
            : new Date(timestamp * 1000);
      } else if (typeof timestamp === "string") {
        // ISO string or other date string
        date = new Date(timestamp);
      } else {
        return String(timestamp);
      }

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return String(timestamp);
      }

      // Format as human-readable date
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

  const extractImages = (obj: any): string[] => {
    const images: string[] = [];

    const searchForImages = (value: any) => {
      if (typeof value === "string") {
        // Check if it's a full Repliers CDN image URL
        if (value.includes("cdn.repliers.io") && value.includes("IMG-")) {
          images.push(value);
        }
        // Check if it's just an image filename (IMG-*.jpg)
        else if (value.match(/^IMG-[A-Z0-9]+_\d+\.jpg$/i)) {
          // Convert filename to full CDN URL
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
    return [...new Set(images)]; // Remove duplicates
  };

  const getSmallImageUrl = (imageUrl: string) => {
    // Convert to small thumbnail version
    return imageUrl
      .replace(/class=\w+/, "class=small")
      .replace(/(?<!\?)class=small/, "?class=small");
  };

  const getLargeImageUrl = (imageUrl: string) => {
    // Convert to large version
    return imageUrl
      .replace(/class=\w+/, "class=large")
      .replace(/(?<!\?)class=large/, "?class=large");
  };

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

      {/* Main Content - EXACT COPY FROM ListingByAddress */}
      <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Selected Property
            </h3>
            <p className="text-sm text-gray-500">
              {formatAddress(listing.address)}
            </p>
          </div>
          {listing.status && (
            <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              {listing.status}
            </span>
          )}
        </div>

        {/* ALL PROPERTY DATA - Show every available field (EXACT COPY FROM ListingByAddress) */}
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
                    // Debug logging for arrays
                    console.log(
                      "🔍 Array detected:",
                      key,
                      "Length:",
                      value.length,
                      "First item type:",
                      typeof value[0]
                    );

                    // Check bathroom arrays FIRST (before generic array handling)
                    if (
                      key.toLowerCase() === "bathrooms" ||
                      (key.toLowerCase().includes("bathroom") &&
                        key.toLowerCase() !== "numbathrooms" &&
                        key.toLowerCase() !== "numbathroomsplus" &&
                        key.toLowerCase() !== "numbathroomshalf") ||
                      (key.toLowerCase().includes("bath") &&
                        key.toLowerCase() !== "numbathrooms" &&
                        key.toLowerCase() !== "numbathroomsplus" &&
                        key.toLowerCase() !== "numbathroomshalf")
                    ) {
                      console.log(
                        "🛁 TOP-LEVEL Bathroom array detected:",
                        key,
                        "Length:",
                        value.length,
                        "First item:",
                        value[0]
                      );
                      // Handle bathroom arrays at top level with enhanced logic
                      const bathroomDescriptions = value.map(
                        (bathObj, index) => {
                          console.log(
                            `🛁 TOP-LEVEL Processing bathroom ${index + 1}:`,
                            bathObj,
                            "Type:",
                            typeof bathObj
                          );

                          if (typeof bathObj === "object" && bathObj !== null) {
                            const bath = bathObj as any;
                            const parts = [];

                            // Log all available properties
                            console.log(
                              `🛁 TOP-LEVEL Bathroom ${index + 1} properties:`,
                              Object.keys(bath)
                            );

                            // Try various property names that might exist
                            if (
                              bath.type ||
                              bath.bathroom_type ||
                              bath.bathroomType
                            ) {
                              parts.push(
                                bath.type ||
                                  bath.bathroom_type ||
                                  bath.bathroomType
                              );
                            }
                            if (
                              bath.location ||
                              bath.floor ||
                              bath.room ||
                              bath.area
                            ) {
                              parts.push(
                                `(${
                                  bath.location ||
                                  bath.floor ||
                                  bath.room ||
                                  bath.area
                                })`
                              );
                            }
                            if (bath.size || bath.dimensions || bath.sqft) {
                              parts.push(
                                bath.size || bath.dimensions || bath.sqft
                              );
                            }
                            if (
                              bath.features ||
                              bath.amenities ||
                              bath.fixtures
                            ) {
                              const featureList =
                                bath.features ||
                                bath.amenities ||
                                bath.fixtures;
                              if (Array.isArray(featureList)) {
                                parts.push(
                                  `Features: ${featureList.join(", ")}`
                                );
                              } else if (featureList) {
                                parts.push(`Features: ${featureList}`);
                              }
                            }
                            if (bath.description) {
                              parts.push(bath.description);
                            }

                            // If no meaningful data found, show all properties
                            if (parts.length === 0) {
                              const allProps = Object.entries(bath)
                                .filter(
                                  ([, v]) =>
                                    v !== null && v !== undefined && v !== ""
                                )
                                .map(([k, v]) => {
                                  // Format property names nicely
                                  const formattedKey = k
                                    .replace(/([A-Z])/g, " $1")
                                    .replace(/^./, (str) => str.toUpperCase());
                                  return `${formattedKey}: ${v}`;
                                })
                                .join(", ");

                              const result =
                                allProps || `Bathroom ${index + 1}`;
                              console.log(
                                `🛁 TOP-LEVEL Bathroom ${
                                  index + 1
                                } final result (fallback):`,
                                result
                              );
                              return result;
                            }

                            const result = parts.join(" ");
                            console.log(
                              `🛁 TOP-LEVEL Bathroom ${
                                index + 1
                              } final result:`,
                              result
                            );
                            return result;
                          }

                          const result = String(bathObj);
                          console.log(
                            `🛁 TOP-LEVEL Bathroom ${
                              index + 1
                            } final result (not object):`,
                            result
                          );
                          return result;
                        }
                      );
                      displayValue = bathroomDescriptions.join(" | ");
                      console.log(
                        "🛁 TOP-LEVEL Final formatted bathroom value:",
                        displayValue
                      );
                    } else if (
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
                      // Handle any array of objects with detailed formatting
                      console.log("🔧 Handling array of objects:", key, value);
                      const objectDescriptions = value.map((obj, index) => {
                        if (typeof obj === "object" && obj !== null) {
                          const allProps = Object.entries(obj)
                            .filter(([, v]) => v !== null && v !== undefined)
                            .map(([k, v]) => {
                              // Format key name nicely
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
                  } else if (
                    typeof value === "object" &&
                    value !== null &&
                    key.toLowerCase().includes("history")
                  ) {
                    // Handle history objects at top level
                    const historyObj = value as any;
                    const historyParts: string[] = [];

                    Object.entries(historyObj).forEach(
                      ([histKey, histValue]) => {
                        if (
                          typeof histValue === "object" &&
                          histValue !== null
                        ) {
                          const nestedHistObj = histValue as any;
                          const parts = [];
                          if (nestedHistObj.date)
                            parts.push(
                              `Date: ${formatTimestamp(nestedHistObj.date)}`
                            );
                          if (nestedHistObj.value || nestedHistObj.estimate)
                            parts.push(
                              `Value: ${formatPrice(
                                nestedHistObj.value || nestedHistObj.estimate
                              )}`
                            );
                          if (nestedHistObj.confidence)
                            parts.push(
                              `Confidence: ${nestedHistObj.confidence}%`
                            );
                          if (nestedHistObj.source)
                            parts.push(`Source: ${nestedHistObj.source}`);
                          if (nestedHistObj.change)
                            parts.push(`Change: ${nestedHistObj.change}`);
                          if (parts.length > 0) {
                            historyParts.push(
                              `${histKey.toUpperCase()}: ${parts.join(", ")}`
                            );
                          } else {
                            historyParts.push(
                              `${histKey}: ${JSON.stringify(histValue)}`
                            );
                          }
                        } else {
                          historyParts.push(`${histKey}: ${histValue}`);
                        }
                      }
                    );

                    displayValue =
                      historyParts.length > 0
                        ? historyParts.join(" | ")
                        : JSON.stringify(value, null, 2);
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
                  // Handle timestamp strings at top level
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
                            // Debug: Log all details subkeys to see what we're processing
                            if (key === "details") {
                              console.log(
                                "🔍 DETAILS Processing subKey:",
                                subKey,
                                "Type:",
                                typeof subValue,
                                "Is Array:",
                                Array.isArray(subValue)
                              );
                            }

                            if (subValue === null || subValue === undefined)
                              return null;

                            // Format the sub-key for display
                            const formattedSubKey = subKey
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase());

                            // Format the sub-value for display
                            let formattedSubValue;
                            if (
                              typeof subValue === "object" &&
                              subValue !== null
                            ) {
                              if (Array.isArray(subValue)) {
                                formattedSubValue = subValue.join(", ");
                              } else {
                                // Handle nested objects
                                const nestedObj = subValue as any;
                                if (nestedObj.count || nestedObj.number) {
                                  formattedSubValue =
                                    nestedObj.count || nestedObj.number;
                                } else if (nestedObj.dimensions) {
                                  formattedSubValue = nestedObj.dimensions;
                                } else if (nestedObj.value) {
                                  formattedSubValue = nestedObj.value;
                                } else {
                                  // Show all properties of nested object
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
                                subKey.includes("Price") ||
                                subKey.includes("cost") ||
                                subKey.includes("Cost") ||
                                subKey.includes("value") ||
                                subKey.includes("Value"))
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
                              subKey.toLowerCase().includes("time") ||
                              subKey.toLowerCase().includes("created") ||
                              subKey.toLowerCase().includes("updated") ||
                              subKey.toLowerCase().includes("modified") ||
                              subKey.toLowerCase().includes("stamp") ||
                              subKey.toLowerCase().includes("list") ||
                              subKey.toLowerCase() === "updated on" ||
                              subKey.toLowerCase() === "updatedon" ||
                              subKey.toLowerCase() === "listdate"
                            ) {
                              // Special formatting for timestamps
                              formattedSubValue = formatTimestamp(subValue);
                            } else if (
                              key === "office" &&
                              (subKey.toLowerCase().includes("phone") ||
                                subKey.toLowerCase().includes("tel") ||
                                subKey.toLowerCase().includes("number"))
                            ) {
                              // Special formatting for phone numbers
                              formattedSubValue = String(subValue).replace(
                                /(\d{3})(\d{3})(\d{4})/,
                                "($1) $2-$3"
                              );
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
