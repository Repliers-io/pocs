import React, { useState, useEffect } from "react";
import {
  Search,
  BedDouble,
  Bath,
  Car,
  Loader2,
  AlertCircle,
  Frown,
  MapPin,
} from "lucide-react";

// Types based on actual Repliers API responses
export interface ListingResult {
  mlsNumber: string;
  listPrice: number;
  address: {
    city?: string;
    streetDirection?: string;
    streetName?: string;
    streetNumber?: string;
    streetSuffix?: string;
    state?: string;
  };
  details?: {
    numBedrooms?: number;
    numBedroomsPlus?: number;
    numBathrooms?: number;
    numBathroomsPlus?: number;
    numGarageSpaces?: number;
    propertyType?: string;
  };
  images?: Array<string>;
  type?: string;
  lastStatus?: string;
}

// Types for location autocomplete results
export interface LocationResult {
  name: string;
  type: "city" | "neighborhood" | "area";
  state?: string;
  city?: string; // Legacy field - keeping for backward compatibility
  address?: {
    state?: string;
    city?: string;
  };
}

export interface SearchResults {
  properties: ListingResult[];
  cities: LocationResult[];
  neighborhoods: LocationResult[];
  areas: LocationResult[];
}

export interface AutocompleteSearchProps {
  /** Repliers API key - required for production use (env fallback only works in development) */
  apiKey?: string;
  /** Placeholder text for the search input */
  placeholder?: string;
}

/**
 * AutocompleteSearch Component
 *
 * @description A streamlined autocomplete search component that integrates with Repliers API
 * to search MLS listings and locations with real-time results and beautiful UI.
 *
 * Features:
 * - Hybrid search combining listings and location autocomplete
 * - Debounced search (400ms) with fuzzy matching, minimum 3 characters
 * - Skeleton loading states
 * - Error handling and no results states
 * - Mobile-responsive design
 * - Real property images and details
 * - Environment variable support for API key (NEXT_PUBLIC_REPLIERS_API_KEY) - development only
 *
 * @param props - The component props
 * @returns JSX.Element
 */
export function AutocompleteSearch({
  apiKey,
  placeholder = "Search for properties...",
}: AutocompleteSearchProps) {
  // Use provided apiKey or fallback to environment variable (development only)
  const effectiveApiKey =
    apiKey ||
    (process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_REPLIERS_API_KEY
      : undefined);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({
    properties: [],
    cities: [],
    neighborhoods: [],
    areas: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, setIsPending] = useState(false); // Track debounce state
  const [error, setError] = useState<string | null>(null);

  // Debounced search effect
  useEffect(() => {
    if (!query.trim()) {
      setResults({
        properties: [],
        cities: [],
        neighborhoods: [],
        areas: [],
      });
      setError(null);
      setIsPending(false);
      return;
    }

    // Require minimum 3 characters for both locations and listings
    if (query.trim().length < 3) {
      setResults({
        properties: [],
        cities: [],
        neighborhoods: [],
        areas: [],
      });
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

  // Perform hybrid API search (both listings and locations)
  const performSearch = async (searchQuery: string) => {
    if (!effectiveApiKey) {
      setError(
        "API key is required. Please provide the apiKey prop. Environment variable fallback only works in development mode."
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Prepare API calls - both endpoints require minimum 3 characters
      const apiCalls = [
        // Search locations with city context
        fetch(
          `https://dev.repliers.io/locations/autocomplete?search=${encodeURIComponent(
            searchQuery
          )}&addContext=city`,
          {
            headers: {
              "REPLIERS-API-KEY": effectiveApiKey,
              "Content-Type": "application/json",
            },
          }
        ),
        // Search listings
        fetch(
          `https://dev.repliers.io/listings?search=${encodeURIComponent(
            searchQuery
          )}&searchFields=address.streetNumber,address.streetName,mlsNumber,address.city&fields=address.*,mlsNumber,listPrice,details.numBedrooms,details.numBedroomsPlus,details.numBathrooms,details.numBathroomsPlus,details.numGarageSpaces,details.propertyType,type,lastStatus,images&fuzzysearch=true&status=A&status=U`,
          {
            headers: {
              "REPLIERS-API-KEY": effectiveApiKey,
              "Content-Type": "application/json",
            },
          }
        ),
      ];

      // Execute searches concurrently
      const responses = await Promise.all(apiCalls);

      // Handle API errors with specific endpoint identification
      for (let i = 0; i < responses.length; i++) {
        const response = responses[i];
        if (!response.ok) {
          const endpointName = i === 0 ? "locations" : "listings";

          if (response.status === 400) {
            // For locations endpoint, check if it requires minimum 3 characters
            if (endpointName === "locations" && searchQuery.length < 3) {
              // Set empty location results and continue without showing error to user
              setResults({
                properties: [],
                cities: [],
                neighborhoods: [],
                areas: [],
              });
              setIsLoading(false);
              return;
            }
            throw new Error(
              `Bad request to ${endpointName} API. Please check your search query.`
            );
          } else if (response.status === 401) {
            throw new Error(
              "Invalid API key. Please check your Repliers API key."
            );
          } else if (response.status === 403) {
            throw new Error(
              `API key doesn't have permission for the ${endpointName} endpoint.`
            );
          } else if (response.status === 429) {
            throw new Error(
              "Too many requests. Please wait a moment and try again."
            );
          } else {
            throw new Error(`${endpointName} API Error: ${response.status}`);
          }
        }
      }

      // Parse responses
      const [locationsData, listingsData] = await Promise.all([
        responses[0].json(),
        responses[1].json(),
      ]);

      // Categorize and set results
      const locations = locationsData.locations || [];
      const properties = listingsData.listings || [];

      // Set results - neighborhoods now include city information from addContext=city
      setResults({
        properties,
        cities: locations.filter((loc: LocationResult) => loc.type === "city"),
        neighborhoods: locations.filter(
          (loc: LocationResult) => loc.type === "neighborhood"
        ),
        areas: locations.filter((loc: LocationResult) => loc.type === "area"),
      });
    } catch (err) {
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
  const getStatusLabel = (
    type?: string,
    lastStatus?: string
  ): string | null => {
    // If lastStatus is "New", "Pc" (Price Change), or "Ext" (Extension), show the type value
    if (lastStatus === "New" || lastStatus === "Pc" || lastStatus === "Ext") {
      if (type === "Sale") return "For Sale";
      if (type === "Lease") return "For Lease";
      return type || null;
    }

    // For any other lastStatus, show the mapped lastStatus value
    if (!lastStatus) return null;

    const lastStatusMap: Record<string, string> = {
      Sus: "Suspended",
      Exp: "Expired",
      Sld: "Sold",
      Ter: "Terminated",
      Dft: "Deal Fell Through",
      Lsd: "Leased",
      Sc: "Sold Conditionally",
      Sce: "Sold Conditionally (Escape Clause)",
      Lc: "Leased Conditionally",
      Cs: "Coming Soon",
    };

    return lastStatusMap[lastStatus] || lastStatus;
  };

  // Status tag component
  const StatusTag = ({
    type,
    lastStatus,
  }: {
    type?: string;
    lastStatus?: string;
  }) => {
    const label = getStatusLabel(type, lastStatus);
    if (!label) return null;

    // Define styling based on status with comprehensive color coding
    let style = "bg-green-100 text-green-600"; // Default for active listings

    switch (label) {
      // Active listings - green
      case "For Sale":
      case "For Lease":
        style = "bg-green-100 text-green-600";
        break;

      // Sold/Completed - blue
      case "Sold":
        style = "bg-blue-100 text-blue-600";
        break;

      // Leased - purple
      case "Leased":
        style = "bg-purple-100 text-purple-600";
        break;

      // Conditional/Pending - yellow/amber
      case "Sold Conditionally":
      case "Sold Conditionally (Escape Clause)":
      case "Leased Conditionally":
        style = "bg-amber-100 text-amber-600";
        break;

      // Coming Soon - indigo
      case "Coming Soon":
        style = "bg-indigo-100 text-indigo-600";
        break;

      // Suspended - orange
      case "Suspended":
        style = "bg-orange-100 text-orange-600";
        break;

      // Expired - gray
      case "Expired":
        style = "bg-gray-100 text-gray-500";
        break;

      // Terminated/Failed - red
      case "Terminated":
      case "Deal Fell Through":
        style = "bg-red-100 text-red-600";
        break;

      // Default fallback
      default:
        style = "bg-gray-100 text-gray-500";
    }

    return (
      <span className={`text-xs px-2 py-1 rounded-md font-medium ${style}`}>
        {label}
      </span>
    );
  };

  const hasResults =
    results.properties.length > 0 ||
    results.cities.length > 0 ||
    results.neighborhoods.length > 0 ||
    results.areas.length > 0;
  const hasLocationResults =
    results.cities.length > 0 ||
    results.neighborhoods.length > 0 ||
    results.areas.length > 0;
  const showResults =
    query.trim() &&
    (hasResults || isLoading || isPending || error || query.trim().length >= 3);

  return (
    <div className="relative w-full">
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
        <span className="text-gray-800 font-semibold text-sm px-2">Search</span>

        {/* Results Container */}
        {showResults && (
          <div className="absolute top-full left-0 w-full min-w-[500px] max-w-lg mt-2 bg-white rounded-xl shadow-lg z-50">
            <div className="max-h-[500px] overflow-y-auto p-4 space-y-4">
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
                    <h3 className="text-md font-semibold text-gray-700 mb-2">
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

              {/* Location Results */}
              {!isLoading &&
                !isPending &&
                !error &&
                (results.cities.length > 0 ||
                  results.neighborhoods.length > 0 ||
                  results.areas.length > 0) && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                      Locations
                    </h4>

                    <div className="space-y-0">
                      {/* Cities */}
                      {results.cities.map((city, idx) => {
                        // Get state from the address object or fallback to legacy state field
                        const state = city.address?.state || city.state;

                        return (
                          <div
                            key={`city-${city.name}-${idx}`}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                              <MapPin className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="flex flex-col min-w-0 flex-grow">
                              <span className="font-medium text-gray-800 text-sm leading-tight">
                                {city.name}
                              </span>
                              <span className="text-xs text-gray-500 leading-tight">
                                City{state && ` in ${state}`}
                              </span>
                            </div>
                          </div>
                        );
                      })}

                      {/* Neighborhoods */}
                      {results.neighborhoods.map((neighborhood, idx) => {
                        // Get city from the new address object or fallback to legacy city field
                        const city =
                          neighborhood.address?.city || neighborhood.city;
                        const state =
                          neighborhood.address?.state || neighborhood.state;

                        return (
                          <div
                            key={`neighborhood-${neighborhood.name}-${idx}`}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-green-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                              <MapPin className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="flex flex-col min-w-0 flex-grow">
                              <span className="font-medium text-gray-800 text-sm leading-tight">
                                {neighborhood.name}
                              </span>
                              <span className="text-xs text-gray-500 leading-tight">
                                Neighborhood{city && ` in ${city}`}
                                {city && state && `, ${state}`}
                                {!city && state && ` in ${state}`}
                              </span>
                            </div>
                          </div>
                        );
                      })}

                      {/* Areas */}
                      {results.areas.map((area, idx) => {
                        // Get state from the address object or fallback to legacy state field
                        const state = area.address?.state || area.state;

                        return (
                          <div
                            key={`area-${area.name}-${idx}`}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-purple-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                              <MapPin className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="flex flex-col min-w-0 flex-grow">
                              <span className="font-medium text-gray-800 text-sm leading-tight">
                                {area.name}
                              </span>
                              <span className="text-xs text-gray-500 leading-tight">
                                Area{state && ` in ${state}`}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              {/* Listing Results */}
              {!isLoading && results.properties.length > 0 && (
                <>
                  {/* Properties Section Header (only show if there are also locations) */}
                  {hasLocationResults && (
                    <div className="pt-2">
                      <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
                        Properties
                      </h4>
                    </div>
                  )}

                  {results.properties.map((listing, idx) => (
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
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-base">
                              {listing.listPrice
                                ? formatPrice(listing.listPrice)
                                : "Price N/A"}
                            </h3>
                            <span className="text-gray-400">|</span>
                            <span className="text-sm text-gray-600">
                              {listing.mlsNumber}
                            </span>
                          </div>
                          <StatusTag
                            type={listing.type}
                            lastStatus={listing.lastStatus}
                          />
                        </div>
                        <p className="text-xs text-gray-600">
                          {`${listing.address?.streetNumber || ""} ${
                            listing.address?.streetName || ""
                          } ${listing.address?.streetSuffix || ""}, ${
                            listing.address?.city || ""
                          }${
                            listing.address?.state
                              ? `, ${listing.address.state}`
                              : ""
                          }`}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 mt-1 space-x-3 flex-wrap">
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
          </div>
        )}
      </div>
    </div>
  );
}
