import React, { useState, useEffect } from "react";
import {
  Search,
  BedDouble,
  Bath,
  Car,
  Loader2,
  AlertCircle,
  Frown,
} from "lucide-react";

// Types based on actual Repliers API responses
export interface ListingResult {
  mlsNumber: string;
  listPrice: number;
  address: {
    area?: string;
    city?: string;
    country?: string;
    district?: string;
    majorIntersection?: string;
    neighborhood?: string;
    streetDirection?: string;
    streetName?: string;
    streetNumber?: string;
    streetSuffix?: string;
    unitNumber?: string;
    zip?: string;
    state?: string;
  };
  details?: {
    numBedrooms?: number;
    numBedroomsPlus?: number;
    numBathrooms?: number;
    numBathroomsPlus?: number;
    numGarageSpaces?: number;
    propertyType?: string;
    sqft?: number;
  };
  status?: string;
  standardStatus?: string;
  images?: Array<string>;
  resource?: string;
  class?: string;
  type?: string;
  photoCount?: number;
}

export interface AutocompleteSearchProps {
  /** Repliers API key - if not provided, uses NEXT_PUBLIC_REPLIERS_API_KEY from environment */
  apiKey?: string;
  /** Placeholder text for the search input */
  placeholder?: string;
}

/**
 * AutocompleteSearch Component
 *
 * @description A streamlined autocomplete search component that integrates with Repliers API
 * to search MLS listings with real-time results and beautiful UI.
 *
 * Features:
 * - Debounced search (400ms) with fuzzy matching
 * - Skeleton loading states
 * - Error handling and no results states
 * - Mobile-responsive design
 * - Real property images and details
 * - Environment variable support for API key (NEXT_PUBLIC_REPLIERS_API_KEY)
 *
 * @param props - The component props
 * @returns JSX.Element
 */
export function AutocompleteSearch({
  apiKey,
  placeholder = "Search for properties...",
}: AutocompleteSearchProps) {
  // Use provided apiKey or fallback to environment variable
  const effectiveApiKey = apiKey || process.env.NEXT_PUBLIC_REPLIERS_API_KEY;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ListingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, setIsPending] = useState(false); // Track debounce state
  const [error, setError] = useState<string | null>(null);

  // Debounced search effect
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setError(null);
      setIsPending(false);
      return;
    }

    // Require minimum 3 characters as per API requirement
    if (query.trim().length < 3) {
      setResults([]);
      setError(null);
      setIsPending(false);
      return;
    }

    // Set pending immediately when query changes
    setIsPending(true);
    setError(null);

    const timeoutId = setTimeout(async () => {
      setIsPending(false); // Clear pending when search actually starts
      await performSearch(query.trim());
    }, 400);

    return () => {
      clearTimeout(timeoutId);
      setIsPending(false);
    };
  }, [query]);

  // Perform API search
  const performSearch = async (searchQuery: string) => {
    if (!effectiveApiKey) {
      setError(
        "API key is required. Please provide apiKey prop or set NEXT_PUBLIC_REPLIERS_API_KEY in your environment."
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Make API request to search listings
      const response = await fetch(
        `https://dev.repliers.io/listings?search=${encodeURIComponent(
          searchQuery
        )}&searchFields=address.streetNumber,address.streetName,mlsNumber,address.city&fields=address.*,mlsNumber,listPrice,details.numBedrooms,details.numBedroomsPlus,details.numBathrooms,details.numBathroomsPlus,details.numGarageSpaces,details.propertyType,status,images&fuzzysearch=true`,
        {
          headers: {
            "REPLIERS-API-KEY": effectiveApiKey,
            "Content-Type": "application/json",
          },
        }
      );

      // Handle API errors
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "Invalid API key. Please check your Repliers API key."
          );
        } else if (response.status === 403) {
          throw new Error("API key doesn't have permission for this endpoint.");
        } else if (response.status === 429) {
          throw new Error(
            "Too many requests. Please wait a moment and try again."
          );
        } else {
          throw new Error(`API Error: ${response.status}`);
        }
      }

      // Parse and set results
      const data = await response.json();
      setResults(data.listings || []);
    } catch (err) {
      console.error("Search error:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to search. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Format price helper
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format bedrooms helper
  const formatBedrooms = (details: ListingResult["details"]) => {
    if (!details) return "N/A";

    // Use actual API field names
    const total = details.numBedrooms;
    const plus = details.numBedroomsPlus;

    if (total && plus && plus > 0) {
      return `${total} + ${plus}`;
    }
    return total?.toString() || "N/A";
  };

  // Format bathrooms helper
  const formatBathrooms = (details: ListingResult["details"]) => {
    if (!details) return "N/A";

    const total = details.numBathrooms;
    const plus = details.numBathroomsPlus;

    if (total && plus && plus > 0) {
      return `${total} + ${plus}`;
    }
    return total?.toString() || "N/A";
  };

  // Format garage/parking helper
  const formatParking = (details: ListingResult["details"]) => {
    if (!details) return "N/A";

    return details.numGarageSpaces?.toString() || "N/A";
  };

  // Status mapping helper
  const getStatusLabel = (status?: string): string | null => {
    if (!status) return null;

    const statusMap: Record<string, string> = {
      A: "For Sale",
      Active: "For Sale",
      S: "Sold",
      Sold: "Sold",
      L: "Leased",
      Lease: "Leased",
      Leased: "Leased",
      T: "Terminated",
      Terminated: "Terminated",
      Expired: "Terminated",
      Cancelled: "Terminated",
    };

    return statusMap[status] || status;
  };

  // Status tag component
  const StatusTag = ({ status }: { status?: string }) => {
    const label = getStatusLabel(status);
    if (!label) return null;

    // Define styling based on status
    let style = "bg-green-100 text-green-600"; // Default for "For Sale"

    if (label === "Sold") {
      style = "bg-blue-100 text-blue-600";
    } else if (label === "Leased") {
      style = "bg-purple-100 text-purple-600";
    } else if (label === "Terminated") {
      style = "bg-gray-100 text-gray-500";
    }

    return (
      <span className={`text-xs px-2 py-1 rounded-md font-medium ${style}`}>
        {label}
      </span>
    );
  };

  const hasResults = results.length > 0;
  const showResults =
    query.trim() &&
    (hasResults || isLoading || isPending || error || query.trim().length >= 3);

  return (
    <div className={`flex`}>
      <div className="relative flex items-center justify-end gap-1 py-0 lg:py-4">
        <div className="flex-1 duration-400 transition-[min-width] delay-100 ease-in min-w-[600px]">
          <div className="p-6 flex flex-col items-center w-full">
            {/* Search Bar */}
            <div className="relative flex items-center bg-gray-100 rounded-md px-4 py-2 w-full">
              <Search className="text-gray-400 w-5 h-5 mr-3" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="flex-grow bg-transparent outline-none text-gray-700 placeholder-gray-500"
              />
              {isLoading && (
                <Loader2 className="w-4 h-4 animate-spin text-gray-400 mr-2" />
              )}
              <span className="text-gray-800 font-semibold text-sm px-2">
                Search
              </span>

              {/* Results Container */}
              {showResults && (
                <div className="absolute top-full left-0 right-0 mt-2 space-y-4 w-full max-h-[500px] overflow-y-auto bg-white p-4 rounded-xl shadow-lg z-50 mt-4">
                  {/* Error State */}
                  {error && (
                    <div className="flex items-center gap-2 text-red-600 mb-4">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}

                  {/* Loading State */}
                  {isLoading && (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 animate-pulse"
                        >
                          {/* Image Skeleton */}
                          <div className="w-24 h-16 bg-gray-200 rounded-md"></div>

                          {/* Content Skeleton */}
                          <div className="flex-grow">
                            <div className="flex justify-between items-start mb-2">
                              <div className="h-6 bg-gray-200 rounded w-32"></div>
                              <div className="h-5 bg-gray-200 rounded w-16"></div>
                            </div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="flex space-x-3">
                              <div className="h-4 bg-gray-200 rounded w-20"></div>
                              <div className="h-4 bg-gray-200 rounded w-16"></div>
                              <div className="h-4 bg-gray-200 rounded w-18"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pending State */}
                  {isPending && !isLoading && (
                    <div className="space-y-4">
                      {[...Array(2)].map((_, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 animate-pulse"
                        >
                          {/* Image Skeleton */}
                          <div className="w-24 h-16 bg-gray-100 rounded-md"></div>

                          {/* Content Skeleton */}
                          <div className="flex-grow">
                            <div className="flex justify-between items-start mb-2">
                              <div className="h-6 bg-gray-100 rounded w-32"></div>
                              <div className="h-5 bg-gray-100 rounded w-16"></div>
                            </div>
                            <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                            <div className="flex space-x-3">
                              <div className="h-4 bg-gray-100 rounded w-20"></div>
                              <div className="h-4 bg-gray-100 rounded w-16"></div>
                              <div className="h-4 bg-gray-100 rounded w-18"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* No Results */}
                  {!isLoading &&
                    !isPending &&
                    !error &&
                    !hasResults &&
                    query.trim() && (
                      <div className="text-center py-8">
                        <Frown className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                          No results found
                        </h3>
                        <p className="text-gray-500 mb-2">
                          There aren't any search results that match your query.
                        </p>
                        <p className="text-gray-500">
                          Try searching for a different property.
                        </p>
                      </div>
                    )}

                  {/* Listing Results */}
                  {!isLoading && results.length > 0 && (
                    <>
                      {results.map((listing, idx) => (
                        <div
                          key={listing.mlsNumber || idx}
                          className="flex items-center gap-4"
                        >
                          {/* Image or Placeholder */}
                          <div className="w-24 h-16 bg-gray-100 rounded-md overflow-hidden">
                            {listing.images?.[0] ? (
                              <img
                                src={`https://cdn.repliers.io/${listing.images[0]}?class=small`}
                                alt="Property"
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-xs text-gray-400">
                                No Image
                              </div>
                            )}
                          </div>

                          {/* Listing Info */}
                          <div className="flex-grow">
                            <div className="flex justify-between items-start">
                              <h3 className="font-semibold text-lg">
                                {listing.listPrice
                                  ? formatPrice(listing.listPrice)
                                  : "Price N/A"}
                              </h3>
                              <StatusTag status={listing.status} />
                            </div>
                            <p className="text-sm text-gray-600">
                              {`${listing.address?.streetNumber || ""} ${
                                listing.address?.streetName || ""
                              } ${listing.address?.streetSuffix || ""}, ${
                                listing.address?.city || ""
                              }`}{" "}
                              | {listing.mlsNumber}
                            </p>
                            <div className="flex items-center text-sm text-gray-500 mt-1 space-x-3 flex-wrap">
                              <span className="flex items-center gap-1">
                                <BedDouble className="w-4 h-4" />
                                {formatBedrooms(listing.details)} Bedroom
                              </span>
                              <span className="flex items-center gap-1">
                                <Bath className="w-4 h-4" />
                                {formatBathrooms(listing.details)} Bath
                              </span>
                              <span className="flex items-center gap-1">
                                <Car className="w-4 h-4" />
                                {formatParking(listing.details)} Garage
                              </span>
                              {listing.details?.propertyType && (
                                <span>| {listing.details.propertyType}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
