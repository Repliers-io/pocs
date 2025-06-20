import React, { useState, useMemo } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiInput } from "@/components/api-input/api-input";

// Custom Components
import { UnifiedAddressSearch } from "@/components/unified-address-search/unified-address-search";
import { ListingByAddress } from "@/components/listings/listing-by-address/listing-by-address";

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

interface ComparableProperty {
  id: string;
  address: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  pricePerSqft: number;
  yearBuilt: number;
  daysOnMarket: number;
  distance: number; // in miles
  lastSoldDate: string;
  propertyType: string;
  imageUrl?: string;
}

interface ComparableSearchData {
  numBedrooms?: number;
  numBathrooms?: number;
  lat?: number;
  long?: number;
  propertyType?: string;
  sqft?: number;
  city?: string;
  type?: string;
  // Additional search parameters
  status?: string;
  lastStatus?: string;
  minBeds?: number;
  maxBeds?: number;
  minBaths?: number;
  maxBaths?: number;
  minSqft?: number;
  maxSqft?: number;
  radius?: number;
}

interface ComparablesByAddressSearchProps {
  className?: string;
  onComparablesFound?: (comparables: ComparableProperty[]) => void;
  searchRadius?: number; // in kilometers
}

/**
 * ComparablesByAddressSearch Component
 *
 * @description A component that allows users to search for comparable properties by address using Google Places API
 * @param props - The component props
 * @returns JSX.Element
 */
export function ComparablesByAddressSearch({
  className,
  onComparablesFound,
  searchRadius = 2.0,
}: ComparablesByAddressSearchProps) {
  const [selectedListing, setSelectedListing] =
    useState<PropertyListing | null>(null);
  const [comparableData, setComparableData] =
    useState<ComparableSearchData | null>(null);
  const [comparables, setComparables] = useState<ComparableProperty[]>([]);
  const [isLoadingComparables, setIsLoadingComparables] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editableData, setEditableData] = useState<ComparableSearchData>({
    radius: searchRadius,
  });
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [isLoadingPropertyTypes, setIsLoadingPropertyTypes] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch property types from aggregates API
  const fetchPropertyTypes = async () => {
    const apiInput = document.querySelector(
      'input[placeholder*="API"]'
    ) as HTMLInputElement;
    const apiKey = apiInput?.value?.trim();

    if (!apiKey) {
      return; // Don't fetch if no API key
    }

    setIsLoadingPropertyTypes(true);
    try {
      const response = await fetch(
        "https://api.repliers.io/listings?aggregates=details.propertyType",
        {
          headers: {
            "REPLIERS-API-KEY": apiKey,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("📊 Property types aggregates response:", data);

        if (data.aggregates?.details?.propertyType) {
          // Extract property types and sort by count (descending)
          const propertyTypeData = data.aggregates.details.propertyType;
          const sortedTypes = Object.entries(propertyTypeData)
            .sort(([, a], [, b]) => (b as number) - (a as number))
            .map(([type]) => type);

          setPropertyTypes(sortedTypes);
          console.log("🏠 Property types loaded:", sortedTypes);
        }
      } else {
        console.warn("❌ Failed to fetch property types aggregates");
      }
    } catch (error) {
      console.warn("❌ Error fetching property types:", error);
    } finally {
      setIsLoadingPropertyTypes(false);
    }
  };

  // Fetch property types when component mounts or API key becomes available
  React.useEffect(() => {
    const handleApiKeyChange = () => {
      if (propertyTypes.length === 0) {
        fetchPropertyTypes();
      }
    };

    // Try to fetch immediately
    handleApiKeyChange();

    // Also listen for API key input changes
    const apiInput = document.querySelector('input[placeholder*="API"]');
    if (apiInput) {
      apiInput.addEventListener("blur", handleApiKeyChange);
      return () => apiInput.removeEventListener("blur", handleApiKeyChange);
    }
  }, [propertyTypes.length]);

  const extractComparableData = (
    listing: PropertyListing
  ): ComparableSearchData => {
    const comparableData: ComparableSearchData = {};

    // Extract details.numBedrooms
    if (listing.details?.numBedrooms) {
      comparableData.numBedrooms = listing.details.numBedrooms;
    }

    // Extract details.numBathrooms
    if (listing.details?.numBathrooms) {
      comparableData.numBathrooms = listing.details.numBathrooms;
    }

    // Extract map coordinates - handle both lat/long and latitude/longitude
    if (listing.map?.lat) {
      comparableData.lat = listing.map.lat;
    } else if (listing.map?.latitude) {
      comparableData.lat = listing.map.latitude;
    }

    if (listing.map?.long) {
      comparableData.long = listing.map.long;
    } else if (listing.map?.longitude) {
      comparableData.long = listing.map.longitude;
    }

    // Extract details.propertyType
    if (listing.details?.propertyType) {
      comparableData.propertyType = listing.details.propertyType;
    }

    // Extract details.sqft
    if (listing.details?.sqft) {
      comparableData.sqft = listing.details.sqft;
    }

    // Extract address.city
    if (
      typeof listing.address === "object" &&
      listing.address !== null &&
      "city" in listing.address
    ) {
      comparableData.city = (listing.address as any).city;
    } else if (typeof listing.address === "string") {
      // If address is a string, try to extract city from it
      // This is a fallback since we might not have structured address data
      const addressParts = listing.address.split(",");
      if (addressParts.length >= 2) {
        comparableData.city = addressParts[addressParts.length - 2].trim();
      }
    }

    // Extract type (sale or lease)
    if (listing.type) {
      comparableData.type = listing.type;
    }

    return comparableData;
  };

  const handleListingSelected = (listing: PropertyListing | null) => {
    setSelectedListing(listing);

    if (listing) {
      const extractedData = extractComparableData(listing);
      setComparableData(extractedData);
      setEditableData({
        ...extractedData,
        radius: searchRadius,
        // Set default search parameters
        status: "A", // Search for available properties by default
        lastStatus: undefined, // Don't set lastStatus for available properties
        type: extractedData.type, // Use the original property's listing type
        minBeds: extractedData.numBedrooms,
        maxBeds: extractedData.numBedrooms,
        minBaths: extractedData.numBathrooms,
        maxBaths: extractedData.numBathrooms,
        minSqft: extractedData.sqft ? extractedData.sqft - 100 : undefined,
        maxSqft: extractedData.sqft ? extractedData.sqft + 100 : undefined,
      });
      console.log("🏠 Listing selected:", listing);
      console.log("📊 Comparable data extracted:", extractedData);
    } else {
      setComparableData(null);
      setEditableData({ radius: searchRadius });
    }

    setComparables([]);
    setError(null);
    setHasSearched(false);
  };

  const handleFindComparables = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedListing || !editableData) {
      setError("Please select a property listing first.");
      return;
    }

    // Check if we have an API key
    const apiInput = document.querySelector(
      'input[placeholder*="API"]'
    ) as HTMLInputElement;
    const apiKey = apiInput?.value?.trim();

    if (!apiKey) {
      setError("API key is required to search for comparable properties.");
      return;
    }

    setIsLoadingComparables(true);
    setError(null);
    setHasSearched(true);

    try {
      // Build search parameters from editableData
      const searchParams = new URLSearchParams();

      // Status/Type Filters
      if (editableData.status && editableData.status.trim())
        searchParams.append("status", editableData.status);
      // Only include lastStatus if status is not "A" (Available)
      if (
        editableData.lastStatus &&
        editableData.lastStatus.trim() &&
        editableData.status !== "A"
      )
        searchParams.append("lastStatus", editableData.lastStatus);
      if (editableData.type && editableData.type.trim())
        searchParams.append("type", editableData.type);

      // Property Characteristics
      if (editableData.propertyType && editableData.propertyType.trim())
        searchParams.append("propertyType", editableData.propertyType);
      if (
        editableData.minBeds !== undefined &&
        editableData.minBeds !== null &&
        !isNaN(editableData.minBeds)
      )
        searchParams.append("minBeds", editableData.minBeds.toString());
      if (
        editableData.maxBeds !== undefined &&
        editableData.maxBeds !== null &&
        !isNaN(editableData.maxBeds)
      )
        searchParams.append("maxBeds", editableData.maxBeds.toString());
      if (
        editableData.minBaths !== undefined &&
        editableData.minBaths !== null &&
        !isNaN(editableData.minBaths)
      )
        searchParams.append("minBaths", editableData.minBaths.toString());
      if (
        editableData.maxBaths !== undefined &&
        editableData.maxBaths !== null &&
        !isNaN(editableData.maxBaths)
      )
        searchParams.append("maxBaths", editableData.maxBaths.toString());
      if (
        editableData.minSqft !== undefined &&
        editableData.minSqft !== null &&
        !isNaN(editableData.minSqft)
      )
        searchParams.append("minSqft", editableData.minSqft.toString());
      if (
        editableData.maxSqft !== undefined &&
        editableData.maxSqft !== null &&
        !isNaN(editableData.maxSqft)
      )
        searchParams.append("maxSqft", editableData.maxSqft.toString());

      // Location Parameters
      if (editableData.city && editableData.city.trim())
        searchParams.append("city", editableData.city);
      if (
        editableData.lat !== undefined &&
        editableData.lat !== null &&
        !isNaN(editableData.lat)
      )
        searchParams.append("lat", editableData.lat.toString());
      if (
        editableData.long !== undefined &&
        editableData.long !== null &&
        !isNaN(editableData.long)
      )
        searchParams.append("long", editableData.long.toString());
      if (
        editableData.radius !== undefined &&
        editableData.radius !== null &&
        !isNaN(editableData.radius)
      )
        searchParams.append("radius", editableData.radius.toString());

      const url = `https://api.repliers.io/listings?${searchParams.toString()}`;
      console.log("🔍 Making comparables API request to:", url);
      console.log("📊 Search parameters:", Object.fromEntries(searchParams));

      const response = await fetch(url, {
        headers: {
          "REPLIERS-API-KEY": apiKey,
        },
      });

      console.log(
        "📡 Comparables response status:",
        response.status,
        response.statusText
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Comparables API Error:", errorText);
        throw new Error(
          `API request failed: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const data = await response.json();
      console.log("📦 Comparables API Response:", data);

      // Extract listings from the response (same logic as ListingByAddress)
      let comparableListings = [];

      if (data.data && Array.isArray(data.data)) {
        comparableListings = data.data;
      } else if (data.results && Array.isArray(data.results)) {
        comparableListings = data.results;
      } else if (data.listings && Array.isArray(data.listings)) {
        comparableListings = data.listings;
      } else if (data.items && Array.isArray(data.items)) {
        comparableListings = data.items;
      } else if (data.properties && Array.isArray(data.properties)) {
        comparableListings = data.properties;
      } else if (Array.isArray(data)) {
        comparableListings = data;
      } else if (data.count > 0) {
        // Look for any property that might be the listing data
        for (const key of Object.keys(data)) {
          if (
            typeof data[key] === "object" &&
            data[key] !== null &&
            !["apiVersion", "page", "numPages", "pageSize", "count"].includes(
              key
            )
          ) {
            if (Array.isArray(data[key])) {
              comparableListings = data[key];
              break;
            } else {
              comparableListings = [data[key]];
              break;
            }
          }
        }
      }

      console.log("📋 Extracted comparable listings:", comparableListings);
      console.log("📋 Comparable listings count:", comparableListings.length);

      // Convert to ComparableProperty format for display
      const formattedComparables: ComparableProperty[] = comparableListings.map(
        (listing: any, index: number) => {
          // Calculate days on market from list date
          const listDate =
            listing.listDate || listing.soldDate || listing.closingDate;
          let daysOnMarket = null;

          if (listDate) {
            try {
              const listedDate = new Date(listDate);
              const today = new Date();
              const timeDiff = today.getTime() - listedDate.getTime();
              daysOnMarket = Math.floor(timeDiff / (1000 * 3600 * 24));
              // Ensure it's not negative
              if (daysOnMarket < 0) daysOnMarket = 0;
            } catch (error) {
              console.warn("Error calculating days on market:", error);
              daysOnMarket =
                listing.daysOnMarket ||
                listing.dom ||
                listing.daysonmarket ||
                null;
            }
          } else {
            // Fallback to API provided value
            daysOnMarket =
              listing.daysOnMarket ||
              listing.dom ||
              listing.daysonmarket ||
              null;
          }

          return {
            id:
              listing.mlsNumber ||
              listing.id ||
              listing.mls ||
              `comparable-${index}`,
            address: formatAddress(listing.address),
            price: listing.listPrice || listing.price || listing.soldPrice || 0,
            beds: listing.details?.numBedrooms || listing.beds || 0,
            baths: listing.details?.numBathrooms || listing.baths || 0,
            sqft: listing.details?.sqft || listing.sqft || 0,
            pricePerSqft:
              listing.listPrice && listing.details?.sqft
                ? Math.round(listing.listPrice / listing.details.sqft)
                : 0,
            yearBuilt: listing.details?.yearBuilt || listing.yearBuilt || null,
            daysOnMarket,
            distance: 0, // Would need to calculate based on coordinates
            lastSoldDate:
              listing.soldDate ||
              listing.listDate ||
              listing.closingDate ||
              new Date().toISOString(),
            propertyType:
              listing.details?.propertyType ||
              listing.propertyType ||
              "Unknown",
            imageUrl: undefined, // Could extract from listing data if available
          };
        }
      );

      setComparables(formattedComparables);
      onComparablesFound?.(formattedComparables);

      if (formattedComparables.length === 0) {
        setError(
          "No comparable properties found with the current search criteria. Try adjusting your filters."
        );
      } else {
        // Scroll to results section after a brief delay to allow DOM update
        setTimeout(() => {
          const resultsSection = document.querySelector("#comparable-results");
          if (resultsSection) {
            resultsSection.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 100);
      }
    } catch (err) {
      console.error("💥 Error in handleFindComparables:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch comparable properties. Please try again."
      );
    } finally {
      setIsLoadingComparables(false);
    }
  };

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
    // Handle cases where address might be an object or string
    if (typeof address === "string") {
      return address;
    }

    if (typeof address === "object" && address !== null) {
      // Try to construct a formatted address from the object
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

  return (
    <div className={className}>
      <form onSubmit={handleFindComparables} className="space-y-6">
        {/* Listing Search Component */}
        <ListingByAddress
          onListingSelected={handleListingSelected}
          showDetails={false}
          className="mb-6"
        />

        {/* Selected Listing Details Display */}
        {selectedListing && comparableData && (
          <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Selected Property for Comparable Search
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Read-only Display */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Property Details
                </h4>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="text-gray-600">Address: </span>
                    <span className="font-medium">
                      {formatAddress(selectedListing.address)}
                    </span>
                  </div>

                  {comparableData.numBedrooms && (
                    <div>
                      <span className="text-gray-600">Bedrooms: </span>
                      <span className="font-medium">
                        {comparableData.numBedrooms}
                      </span>
                    </div>
                  )}

                  {comparableData.numBathrooms && (
                    <div>
                      <span className="text-gray-600">Bathrooms: </span>
                      <span className="font-medium">
                        {comparableData.numBathrooms}
                      </span>
                    </div>
                  )}

                  {comparableData.sqft && (
                    <div>
                      <span className="text-gray-600">Square Footage: </span>
                      <span className="font-medium">
                        {comparableData.sqft.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {comparableData.propertyType && (
                    <div>
                      <span className="text-gray-600">Property Type: </span>
                      <span className="font-medium">
                        {comparableData.propertyType}
                      </span>
                    </div>
                  )}

                  {comparableData.city && (
                    <div>
                      <span className="text-gray-600">City: </span>
                      <span className="font-medium">{comparableData.city}</span>
                    </div>
                  )}

                  {comparableData.type && (
                    <div>
                      <span className="text-gray-600">Listing Type: </span>
                      <span className="font-medium capitalize">
                        {comparableData.type}
                      </span>
                    </div>
                  )}

                  {comparableData.lat && (
                    <div>
                      <span className="text-gray-600">Latitude: </span>
                      <span className="font-medium">
                        {comparableData.lat.toFixed(6)}
                      </span>
                    </div>
                  )}

                  {comparableData.long && (
                    <div>
                      <span className="text-gray-600">Longitude: </span>
                      <span className="font-medium">
                        {comparableData.long.toFixed(6)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Editable Input Fields */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Search Parameters
                </h4>
                <div className="space-y-4 text-sm">
                  {/* Status/Type Filters */}
                  <div>
                    <h5 className="text-xs font-semibold text-gray-800 uppercase tracking-wide mb-2 border-b border-gray-200 pb-1">
                      Status/Type Filters
                    </h5>
                    <div className="space-y-2">
                      {/* Status */}
                      <div>
                        <label className="block text-gray-600 mb-1">
                          Status:
                        </label>
                        <select
                          value={editableData.status || "A"}
                          onChange={(e) => {
                            const newStatus = e.target.value || undefined;
                            setEditableData({
                              ...editableData,
                              status: newStatus,
                              // Clear lastStatus when switching to Available
                              lastStatus:
                                newStatus === "A"
                                  ? undefined
                                  : editableData.lastStatus,
                            });
                          }}
                          className="h-8 text-sm border border-gray-300 rounded-md px-2 w-full"
                        >
                          <option value="A">A - Available</option>
                          <option value="U">
                            U - Unavailable (Sold/Leased)
                          </option>
                        </select>
                      </div>

                      {/* Last Status */}
                      <div>
                        <label className="block text-gray-600 mb-1">
                          Last Status:
                        </label>
                        <select
                          value={editableData.lastStatus || ""}
                          onChange={(e) =>
                            setEditableData({
                              ...editableData,
                              lastStatus: e.target.value || undefined,
                            })
                          }
                          disabled={editableData.status === "A"}
                          className={`h-8 text-sm border border-gray-300 rounded-md px-2 w-full ${
                            editableData.status === "A"
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <option value="">Select Last Status</option>
                          <option value="Sld">Sld - Sold</option>
                          <option value="Lsd">Lsd - Leased</option>
                        </select>
                      </div>

                      {/* Listing Type */}
                      <div>
                        <label className="block text-gray-600 mb-1">
                          Listing Type:
                        </label>
                        <select
                          value={editableData.type || "sale"}
                          onChange={(e) =>
                            setEditableData({
                              ...editableData,
                              type: e.target.value || undefined,
                            })
                          }
                          className="h-8 text-sm border border-gray-300 rounded-md px-2 w-full"
                        >
                          <option value="sale">Sale</option>
                          <option value="lease">Lease</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Property Characteristics */}
                  <div>
                    <h5 className="text-xs font-semibold text-gray-800 uppercase tracking-wide mb-2 border-b border-gray-200 pb-1">
                      Property Characteristics
                    </h5>
                    <div className="space-y-2">
                      {/* Property Type */}
                      <div>
                        <label className="block text-gray-600 mb-1">
                          Property Type:
                        </label>
                        <select
                          value={editableData.propertyType || ""}
                          onChange={(e) =>
                            setEditableData({
                              ...editableData,
                              propertyType: e.target.value || undefined,
                            })
                          }
                          disabled={isLoadingPropertyTypes}
                          className={`h-8 text-sm border border-gray-300 rounded-md px-2 w-full ${
                            isLoadingPropertyTypes
                              ? "bg-gray-100 text-gray-400"
                              : ""
                          }`}
                        >
                          <option value="">
                            {isLoadingPropertyTypes
                              ? "Loading..."
                              : "Select Property Type"}
                          </option>
                          {propertyTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Bedroom Range */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-gray-600 mb-1">
                            Min Beds:
                          </label>
                          <Input
                            type="number"
                            value={editableData.minBeds || ""}
                            onChange={(e) =>
                              setEditableData({
                                ...editableData,
                                minBeds: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              })
                            }
                            className="h-8 text-sm"
                            min="0"
                            max="20"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-600 mb-1">
                            Max Beds:
                          </label>
                          <Input
                            type="number"
                            value={editableData.maxBeds || ""}
                            onChange={(e) =>
                              setEditableData({
                                ...editableData,
                                maxBeds: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              })
                            }
                            className="h-8 text-sm"
                            min="0"
                            max="20"
                          />
                        </div>
                      </div>

                      {/* Bathroom Range */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-gray-600 mb-1">
                            Min Baths:
                          </label>
                          <Input
                            type="number"
                            value={editableData.minBaths || ""}
                            onChange={(e) =>
                              setEditableData({
                                ...editableData,
                                minBaths: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              })
                            }
                            className="h-8 text-sm"
                            min="0"
                            max="20"
                            step="0.5"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-600 mb-1">
                            Max Baths:
                          </label>
                          <Input
                            type="number"
                            value={editableData.maxBaths || ""}
                            onChange={(e) =>
                              setEditableData({
                                ...editableData,
                                maxBaths: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              })
                            }
                            className="h-8 text-sm"
                            min="0"
                            max="20"
                            step="0.5"
                          />
                        </div>
                      </div>

                      {/* Square Footage Range */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-gray-600 mb-1">
                            Min Sqft:
                          </label>
                          <Input
                            type="number"
                            value={editableData.minSqft || ""}
                            onChange={(e) =>
                              setEditableData({
                                ...editableData,
                                minSqft: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              })
                            }
                            className="h-8 text-sm"
                            min="0"
                            max="50000"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-600 mb-1">
                            Max Sqft:
                          </label>
                          <Input
                            type="number"
                            value={editableData.maxSqft || ""}
                            onChange={(e) =>
                              setEditableData({
                                ...editableData,
                                maxSqft: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              })
                            }
                            className="h-8 text-sm"
                            min="0"
                            max="50000"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location Parameters */}
                  <div>
                    <h5 className="text-xs font-semibold text-gray-800 uppercase tracking-wide mb-2 border-b border-gray-200 pb-1">
                      Location Parameters
                    </h5>
                    <div className="space-y-2">
                      {/* City */}
                      <div>
                        <label className="block text-gray-600 mb-1">
                          City:
                        </label>
                        <Input
                          type="text"
                          value={editableData.city || ""}
                          onChange={(e) =>
                            setEditableData({
                              ...editableData,
                              city: e.target.value || undefined,
                            })
                          }
                          className="h-8 text-sm"
                        />
                      </div>

                      {/* Coordinates */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-gray-600 mb-1">
                            Latitude:
                          </label>
                          <Input
                            type="number"
                            value={
                              editableData.lat !== undefined
                                ? editableData.lat.toFixed(6)
                                : ""
                            }
                            onChange={(e) =>
                              setEditableData({
                                ...editableData,
                                lat: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              })
                            }
                            className="h-8 text-sm"
                            step="0.000001"
                            min="-90"
                            max="90"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-600 mb-1">
                            Longitude:
                          </label>
                          <Input
                            type="number"
                            value={
                              editableData.long !== undefined
                                ? editableData.long.toFixed(6)
                                : ""
                            }
                            onChange={(e) =>
                              setEditableData({
                                ...editableData,
                                long: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              })
                            }
                            className="h-8 text-sm"
                            step="0.000001"
                            min="-180"
                            max="180"
                          />
                        </div>
                      </div>

                      {/* Search Radius */}
                      <div>
                        <label className="block text-gray-600 mb-1">
                          Search Radius (km):
                        </label>
                        <Input
                          type="number"
                          value={editableData.radius || ""}
                          onChange={(e) =>
                            setEditableData({
                              ...editableData,
                              radius: e.target.value
                                ? Number(e.target.value)
                                : undefined,
                            })
                          }
                          className="h-8 text-sm"
                          min="0.1"
                          max="10"
                          step="0.1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Controls */}
        {selectedListing && editableData && (
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isLoadingComparables}
              className="px-8 py-2"
            >
              {isLoadingComparables ? "Searching..." : "Find Comparables"}
            </Button>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State for Comparables */}
        {isLoadingComparables && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">
              Searching for comparable properties...
            </p>
          </div>
        )}

        {/* Results */}
        {comparables.length > 0 && !isLoadingComparables && (
          <div id="comparable-results" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                Comparable Properties ({comparables.length})
              </h3>
              <p className="text-sm text-gray-600">
                Within {editableData.radius || searchRadius} km
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {comparables.map((property) => (
                <div
                  key={property.id}
                  className="bg-white border border-gray-200 rounded p-3 hover:shadow-sm transition-all duration-200 hover:border-gray-300"
                >
                  {/* Header with Address and Price */}
                  <div className="mb-2">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1 leading-tight">
                      {formatAddress(property.address)}
                    </h4>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-green-600">
                        {formatPrice(property.price)}
                      </p>
                      <span className="px-1.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {property.propertyType}
                      </span>
                    </div>
                  </div>

                  {/* Property Details Grid */}
                  <div className="grid grid-cols-4 gap-1.5 mb-2">
                    <div className="text-center p-1.5 bg-gray-50 rounded text-xs">
                      <div className="text-sm font-bold text-gray-900">
                        {property.beds}
                      </div>
                      <div className="text-xs text-gray-600">Beds</div>
                    </div>
                    <div className="text-center p-1.5 bg-gray-50 rounded text-xs">
                      <div className="text-sm font-bold text-gray-900">
                        {property.baths}
                      </div>
                      <div className="text-xs text-gray-600">Baths</div>
                    </div>
                    <div className="text-center p-1.5 bg-gray-50 rounded text-xs">
                      <div className="text-sm font-bold text-gray-900">
                        {property.sqft || "N/A"}
                      </div>
                      <div className="text-xs text-gray-600">Sq Ft</div>
                    </div>
                    <div className="text-center p-1.5 bg-gray-50 rounded text-xs">
                      <div className="text-sm font-bold text-gray-900">
                        {property.yearBuilt || "N/A"}
                      </div>
                      <div className="text-xs text-gray-600">Built</div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="space-y-0.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">MLS #:</span>
                      <span className="font-medium text-gray-900">
                        {property.id}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Days on Market:</span>
                      <span className="font-medium text-gray-900">
                        {property.daysOnMarket || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Listed Date:</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(property.lastSoldDate)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results - only show after a search has been performed */}
        {comparables.length === 0 &&
          !isLoadingComparables &&
          selectedListing &&
          hasSearched &&
          error === null && (
            <div className="text-center py-8">
              <p className="text-gray-600">
                No comparable properties found within{" "}
                {editableData.radius || searchRadius} km. Try increasing the
                search radius.
              </p>
            </div>
          )}
      </form>
    </div>
  );
}
