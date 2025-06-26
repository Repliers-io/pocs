import React, { useState, useMemo, useEffect } from "react";

// UI Components
import { ApiInput } from "@/components/api-input/api-input";

// Custom Components
import { UnifiedAddressSearch } from "@/components/unified-address-search/unified-address-search";

// Types
interface AddressComponents {
  city: string;
  streetNumber: string;
  streetName: string;
  streetSuffix: string;
  state: string;
  postalCode: string;
  country: string;
}

interface PlaceDetails {
  address: AddressComponents;
  formattedAddress: string;
  placeId: string;
  geometry?: {
    lat: number;
    lng: number;
  };
}

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
  // Add other fields as returned by the API
  [key: string]: any;
}

interface ListingByAddressProps {
  className?: string;
  onListingSelected?: (listing: PropertyListing | null) => void;
  showDetails?: boolean;
}

/**
 * ListingByAddress Component
 *
 * @description A component that allows users to search for property listings by address using Google Places API
 * @param props - The component props
 * @returns JSX.Element
 */
export function ListingByAddress({
  className,
  onListingSelected,
  showDetails = true,
}: ListingByAddressProps) {
  const [selectedAddress, setSelectedAddress] = useState<PlaceDetails | null>(
    null
  );
  const [propertyListings, setPropertyListings] = useState<PropertyListing[]>(
    []
  );
  const [selectedListing, setSelectedListing] =
    useState<PropertyListing | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showOnlyRecent, setShowOnlyRecent] = useState(true);
  const [allListings, setAllListings] = useState<PropertyListing[]>([]);

  // Memoize field count to avoid render issues
  const validFieldCount = useMemo(() => {
    if (!selectedListing) return 0;
    return Object.entries(selectedListing).filter(
      ([, value]) => value !== null && value !== undefined
    ).length;
  }, [selectedListing]);

  // Update displayed listings when filter changes
  useEffect(() => {
    if (allListings.length > 0) {
      const recentListings = allListings.filter(isRecentListing);
      setPropertyListings(showOnlyRecent ? recentListings : allListings);
    }
  }, [showOnlyRecent, allListings]);

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

  const isRecentListing = (listing: PropertyListing) => {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    // Check listDate first, then soldDate as fallback
    const relevantDate = listing.listDate || listing.soldDate;
    if (!relevantDate) return false;

    try {
      const listingDate = new Date(relevantDate);
      return listingDate >= threeMonthsAgo;
    } catch {
      return false;
    }
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

  const searchPropertyListing = async (
    address: AddressComponents,
    apiKey: string
  ) => {
    const params = new URLSearchParams({
      streetName: address.streetName,
      streetNumber: address.streetNumber,
      city: address.city,
    });

    // Add status as array parameters
    params.append("status", "A");
    params.append("status", "U");

    const url = `https://api.repliers.io/listings?${params}`;
    console.log("🔍 Making API request to:", url);
    console.log("📍 Address components:", address);
    console.log(
      "🔑 API Key (first 10 chars):",
      apiKey.substring(0, 10) + "..."
    );

    const response = await fetch(url, {
      headers: {
        "REPLIERS-API-KEY": apiKey,
      },
    });

    console.log("📡 Response status:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API Error Response:", errorText);
      throw new Error(
        `API request failed: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    console.log("📦 API Response data:", data);
    console.log("📊 Data type:", typeof data, "Is array:", Array.isArray(data));

    // Debug: Log all properties of the response to see the structure
    console.log("🔍 Response properties:", Object.keys(data));
    console.log("🔍 Full response structure:", JSON.stringify(data, null, 2));

    // Extract listings from the paginated response
    let listings = [];

    // Try common property names for the listings array
    if (data.data && Array.isArray(data.data)) {
      listings = data.data;
    } else if (data.results && Array.isArray(data.results)) {
      listings = data.results;
    } else if (data.listings && Array.isArray(data.listings)) {
      listings = data.listings;
    } else if (data.items && Array.isArray(data.items)) {
      listings = data.items;
    } else if (data.properties && Array.isArray(data.properties)) {
      listings = data.properties;
    } else if (Array.isArray(data)) {
      // Maybe the response itself is the array
      listings = data;
    } else if (data.count > 0) {
      // If count > 0 but we can't find array, maybe it's a single object
      // Look for any property that might be the listing data
      for (const key of Object.keys(data)) {
        if (
          typeof data[key] === "object" &&
          data[key] !== null &&
          !["apiVersion", "page", "numPages", "pageSize", "count"].includes(key)
        ) {
          console.log(
            `🎯 Trying property '${key}' as potential listing data:`,
            data[key]
          );
          if (Array.isArray(data[key])) {
            listings = data[key];
            break;
          } else {
            // Single object that might be a listing
            listings = [data[key]];
            break;
          }
        }
      }
    }

    console.log("📋 Extracted listings:", listings);
    console.log("📋 Listings array length:", listings.length);

    // If we still don't have listings but count > 0, something is wrong
    if ((!listings || listings.length === 0) && data.count > 0) {
      console.warn(
        "⚠️ API reports",
        data.count,
        "listings but we couldn't extract them!"
      );
      console.warn("⚠️ Available properties:", Object.keys(data));
      // As a last resort, return the whole data object as a single listing
      console.warn(
        "🚨 Last resort: treating entire response as single listing"
      );
      return [data];
    }

    return listings;
  };

  const handleAddressSelect = async (place: PlaceDetails) => {
    setSelectedAddress(place);
    setPropertyListings([]);
    setAllListings([]);
    setSelectedListing(null);
    setShowOnlyRecent(true); // Reset filter to default
    setError(null);

    if (!apiKey.trim()) {
      setError("API key is required to search for property listings.");
      return;
    }

    setIsLoading(true);

    try {
      console.log("🚀 Starting property listing search...");
      const listings = await searchPropertyListing(place.address, apiKey);

      console.log("✅ Got listings response:", listings);
      console.log("📝 Listings count:", listings?.length || 0);

      if (!listings || listings.length === 0) {
        console.log("⚠️ No listings found");
        setError("No property listings found for this address.");
        setPropertyListings([]);
        setAllListings([]);
        return;
      }

      console.log("📋 All listings found:", listings);
      setAllListings(listings);

      // Filter to recent listings (last 3 months) by default
      const recentListings = listings.filter(isRecentListing);
      console.log("📋 Recent listings (last 3 months):", recentListings);

      setPropertyListings(showOnlyRecent ? recentListings : listings);
    } catch (err) {
      console.error("💥 Error in handleAddressSelect:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch property listing. Please try again."
      );
      setPropertyListings([]);
      setAllListings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleListingSelect = (listing: PropertyListing) => {
    setSelectedListing(listing);
    onListingSelected?.(listing);
    setError(null);

    // Scroll to the Selected Property section after a brief delay
    setTimeout(() => {
      const selectedPropertySection = document.querySelector(
        "#selected-property-section"
      );
      if (selectedPropertySection) {
        selectedPropertySection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  return (
    <div className={className}>
      <div className="space-y-6">
        <ApiInput onApiKeyChange={setApiKey} isEstimates={false} />

        <UnifiedAddressSearch
          onPlaceSelect={handleAddressSelect}
          placeholder="Enter the property address..."
          className="w-full"
        />

        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">
              Searching for property listing...
            </p>
          </div>
        )}

        {/* Listing Filter Status and Controls */}
        {allListings.length > 0 && !isLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            {(() => {
              const recentListings = allListings.filter(isRecentListing);
              const hasRecentListings = recentListings.length > 0;
              const hasOnlyOlderListings =
                allListings.length > 0 && recentListings.length === 0;

              if (hasOnlyOlderListings) {
                return (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="font-medium text-blue-900">
                        No Recent Listings Found
                      </span>
                    </div>
                    <p className="text-sm text-blue-700 mb-3">
                      No listings were found from the last 3 months. All
                      available listings are older than 3 months.
                    </p>
                    <button
                      onClick={() => setShowOnlyRecent(false)}
                      className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Show All Listings ({allListings.length})
                    </button>
                  </div>
                );
              } else if (showOnlyRecent && hasRecentListings) {
                return (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="font-medium text-blue-900">
                        Recent Listings
                      </span>
                    </div>
                    <p className="text-sm text-blue-700 mb-3">
                      Showing {recentListings.length} listing
                      {recentListings.length !== 1 ? "s" : ""} from the last 3
                      months.
                      {allListings.length > recentListings.length && (
                        <span>
                          {" "}
                          {allListings.length - recentListings.length} older
                          listing
                          {allListings.length - recentListings.length !== 1
                            ? "s"
                            : ""}{" "}
                          available.
                        </span>
                      )}
                    </p>
                    {allListings.length > recentListings.length && (
                      <button
                        onClick={() => setShowOnlyRecent(false)}
                        className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Show All Listings ({allListings.length})
                      </button>
                    )}
                  </div>
                );
              } else if (!showOnlyRecent) {
                return (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                      <span className="font-medium text-blue-900">
                        All Listings
                      </span>
                    </div>
                    <p className="text-sm text-blue-700 mb-3">
                      Showing all {allListings.length} listing
                      {allListings.length !== 1 ? "s" : ""} (including older
                      listings).
                      {hasRecentListings && (
                        <span>
                          {" "}
                          {recentListings.length} from the last 3 months.
                        </span>
                      )}
                    </p>
                    <button
                      onClick={() => setShowOnlyRecent(true)}
                      className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Show Only Recent Listings ({recentListings.length})
                    </button>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        )}

        {/* Listings Selection */}
        {propertyListings.length > 0 && !isLoading && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {propertyListings.length === 1
                  ? "Property Listing Found"
                  : `Multiple Listings Found (${propertyListings.length})`}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {propertyListings.length === 1
                  ? "Click to select this property listing:"
                  : "Please select the correct property listing:"}
              </p>
            </div>

            <div className="space-y-2">
              {propertyListings.map((listing, index) => {
                const isSelected = selectedListing?.id === listing.id;
                console.log(
                  `Listing ${index} (${listing.id}): isSelected = ${isSelected}, selectedListing.id = ${selectedListing?.id}`
                );

                return (
                  <div
                    key={listing.id || index}
                    className={`border border-gray-200 rounded-lg p-3 cursor-pointer transition-all duration-200 bg-white ${
                      isSelected
                        ? "ring-2 ring-green-200"
                        : "hover:border-green-400"
                    }`}
                    onClick={() => handleListingSelect(listing)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        {/* Header with address and selection indicator */}
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900 text-sm leading-tight">
                            {formatAddress(listing.address)}
                          </h4>
                          <div className="flex items-center gap-2 ml-3">
                            {/* Status badge */}
                            {listing.status && (
                              <span
                                className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                  listing.status === "A"
                                    ? "bg-green-100 text-green-700"
                                    : listing.status === "U"
                                    ? "bg-gray-100 text-gray-700"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {listing.status === "A"
                                  ? "Available"
                                  : listing.status === "U"
                                  ? "Sold"
                                  : listing.status}
                              </span>
                            )}
                            {/* Selection indicator */}
                            <div
                              className={`w-3 h-3 rounded-full border-2 transition-all ${
                                selectedListing?.id === listing.id
                                  ? "border-green-500 bg-green-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {selectedListing?.id === listing.id && (
                                <div className="w-1 h-1 bg-white rounded-full mx-auto mt-0.5"></div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Property details in compact format */}
                        <div className="space-y-1">
                          {/* Price and key details */}
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4">
                              {listing.listPrice && (
                                <span className="font-semibold text-gray-900">
                                  {formatPrice(listing.listPrice)}
                                </span>
                              )}
                              {listing.soldPrice && (
                                <span className="font-semibold text-green-600">
                                  Sold: {formatPrice(listing.soldPrice)}
                                </span>
                              )}
                            </div>
                            {listing.type && (
                              <span className="text-xs text-gray-500 capitalize">
                                {listing.type}
                              </span>
                            )}
                          </div>

                          {/* Property characteristics */}
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <div className="flex items-center gap-3">
                              {(listing.details?.numBedrooms ||
                                listing.beds) && (
                                <span>
                                  {listing.details?.numBedrooms || listing.beds}{" "}
                                  bed
                                </span>
                              )}
                              {(listing.details?.numBathrooms ||
                                listing.baths) && (
                                <span>
                                  {listing.details?.numBathrooms ||
                                    listing.baths}{" "}
                                  bath
                                </span>
                              )}
                              {(listing.details?.sqft || listing.sqft) && (
                                <span>
                                  {(
                                    listing.details?.sqft || listing.sqft
                                  ).toLocaleString()}{" "}
                                  sqft
                                </span>
                              )}
                            </div>

                            {/* Listing date */}
                            <div className="text-right">
                              {(listing.listDate || listing.soldDate) && (
                                <div>
                                  <span className="text-gray-500">
                                    {listing.listDate ? "Listed: " : "Sold: "}
                                  </span>
                                  <span className="font-medium">
                                    {formatDate(
                                      listing.listDate || listing.soldDate
                                    )}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Property type and MLS number */}
                          {(listing.details?.propertyType ||
                            listing.propertyType ||
                            listing.mlsNumber) && (
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              {(listing.details?.propertyType ||
                                listing.propertyType) && (
                                <span>
                                  {listing.details?.propertyType ||
                                    listing.propertyType}
                                </span>
                              )}
                              {listing.mlsNumber && (
                                <span>MLS# {listing.mlsNumber}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Listing Display with COMPREHENSIVE PROPERTY DATA */}
        {selectedListing && showDetails && (
          <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Selected Property
                </h3>
                <p className="text-sm text-gray-500">
                  {formatAddress(selectedListing.address)}
                </p>
              </div>
              {selectedListing.status && (
                <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  {selectedListing.status}
                </span>
              )}
            </div>

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

            {/* ALL PROPERTY DATA - Show every available field */}
            <div className="space-y-6">
              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                  🔍 Complete Property Information (Click to expand) -{" "}
                  {validFieldCount} fields
                </summary>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selectedListing).map(([key, value]) => {
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
                                `🛁 TOP-LEVEL Processing bathroom ${
                                  index + 1
                                }:`,
                                bathObj,
                                "Type:",
                                typeof bathObj
                              );

                              if (
                                typeof bathObj === "object" &&
                                bathObj !== null
                              ) {
                                const bath = bathObj as any;
                                const parts = [];

                                // Log all available properties
                                console.log(
                                  `🛁 TOP-LEVEL Bathroom ${
                                    index + 1
                                  } properties:`,
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
                                        v !== null &&
                                        v !== undefined &&
                                        v !== ""
                                    )
                                    .map(([k, v]) => {
                                      // Format property names nicely
                                      const formattedKey = k
                                        .replace(/([A-Z])/g, " $1")
                                        .replace(/^./, (str) =>
                                          str.toUpperCase()
                                        );
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
                          console.log(
                            "🔧 Handling array of objects:",
                            key,
                            value
                          );
                          const objectDescriptions = value.map((obj, index) => {
                            if (typeof obj === "object" && obj !== null) {
                              const allProps = Object.entries(obj)
                                .filter(
                                  ([, v]) => v !== null && v !== undefined
                                )
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
                                    nestedHistObj.value ||
                                      nestedHistObj.estimate
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
                                  `${histKey.toUpperCase()}: ${parts.join(
                                    ", "
                                  )}`
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
                    } else if (
                      typeof value === "number" &&
                      key.includes("sqft")
                    ) {
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
                      <div
                        key={key}
                        className="border-l-2 border-blue-200 pl-3"
                      >
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
                              {Object.entries(value).map(
                                ([subKey, subValue]) => {
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

                                  if (
                                    subValue === null ||
                                    subValue === undefined
                                  )
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
                                        formattedSubValue =
                                          nestedObj.dimensions;
                                      } else if (nestedObj.value) {
                                        formattedSubValue = nestedObj.value;
                                      } else {
                                        // Show all properties of nested object
                                        formattedSubValue = Object.entries(
                                          nestedObj
                                        )
                                          .filter(
                                            ([, v]) =>
                                              v !== null && v !== undefined
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
                                    formattedSubValue =
                                      formatTimestamp(subValue);
                                  } else if (
                                    key === "office" &&
                                    (subKey.toLowerCase().includes("phone") ||
                                      subKey.toLowerCase().includes("tel") ||
                                      subKey.toLowerCase().includes("number"))
                                  ) {
                                    // Special formatting for phone numbers
                                    formattedSubValue = String(
                                      subValue
                                    ).replace(
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
                                }
                              )}
                            </div>
                          ) : typeof value === "object" &&
                            !Array.isArray(value) &&
                            key !== "address" ? (
                            <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-32">
                              {displayValue}
                            </pre>
                          ) : displayValue === "images" &&
                            Array.isArray(value) ? (
                            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                              {value.map((imageFilename, index) => {
                                const fullUrl = `https://cdn.repliers.io/${imageFilename}?class=small`;
                                return (
                                  <div
                                    key={index}
                                    className="relative aspect-square bg-gray-100 rounded overflow-hidden cursor-pointer hover:shadow-md transition-shadow group"
                                    onClick={() =>
                                      setSelectedImage(
                                        getLargeImageUrl(fullUrl)
                                      )
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
                      {JSON.stringify(selectedListing, null, 2)}
                    </pre>
                  </div>
                </details>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
