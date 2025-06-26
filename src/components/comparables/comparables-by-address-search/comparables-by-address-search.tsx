import React, { useState, useMemo } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Custom Components
import { ListingByAddress } from "@/components/listings/listing-by-address/listing-by-address";
import { PropertyDetailsDisplay } from "@/components/listings/property-details-display";

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
  propertyTaxes?: number;
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
  maxTaxes?: number;
  minPrice?: number;
  maxPrice?: number;
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
  const [originalListings, setOriginalListings] = useState<PropertyListing[]>(
    []
  );
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

    // Extract type (sale or lease) - check multiple possible locations and normalize
    let extractedType =
      listing.type ||
      listing.listingType ||
      listing.transactionType ||
      listing.details?.type ||
      listing.details?.listingType ||
      "sale"; // Default to "sale" if no type found

    // Normalize the type to lowercase
    comparableData.type = extractedType.toLowerCase();

    return comparableData;
  };

  const handleListingSelected = (listing: PropertyListing | null) => {
    setSelectedListing(listing);

    if (listing) {
      const extractedData = extractComparableData(listing);

      // Extract property taxes for pre-filling
      let propertyTaxes = undefined;
      if (listing.taxes) {
        propertyTaxes =
          listing.taxes.annualAmount ||
          listing.taxes.annual ||
          listing.taxes.yearly ||
          listing.taxes.total ||
          listing.taxes.amount ||
          listing.taxes;
      } else if (listing.propertyTaxes) {
        propertyTaxes = listing.propertyTaxes;
      } else if (listing.annualTaxes) {
        propertyTaxes = listing.annualTaxes;
      } else if (listing.yearlyTaxes) {
        propertyTaxes = listing.yearlyTaxes;
      } else if (listing.details && listing.details.taxes) {
        propertyTaxes =
          listing.details.taxes.annualAmount ||
          listing.details.taxes.annual ||
          listing.details.taxes.yearly ||
          listing.details.taxes.total ||
          listing.details.taxes.amount ||
          listing.details.taxes;
      } else if (listing.financials && listing.financials.taxes) {
        propertyTaxes = listing.financials.taxes;
      }

      // Ensure propertyTaxes is a number if found
      if (propertyTaxes && typeof propertyTaxes !== "number") {
        const parsed = parseFloat(propertyTaxes);
        propertyTaxes = isNaN(parsed) ? undefined : parsed;
      }

      // Extract price for pre-filling (prefer sold price over list price)
      const referencePrice = listing.soldPrice || listing.listPrice;

      setComparableData(extractedData);

      const newEditableData = {
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
        // Pre-fill with values from selected property
        maxTaxes: propertyTaxes
          ? Math.ceil(propertyTaxes / 100) * 100
          : undefined, // Round up to nearest 100
        minPrice: referencePrice
          ? extractedData.type === "lease"
            ? Math.max(1000, Math.floor((referencePrice * 0.8) / 100) * 100) // 20% below reference price, rounded down to nearest $100, minimum $1000
            : Math.max(
                50000,
                Math.floor((referencePrice * 0.8) / 10000) * 10000
              ) // 20% below reference price, rounded down to nearest $10k, minimum $50k
          : extractedData.type === "lease"
          ? 1000
          : 50000, // Fallback to fixed values if no reference price
        maxPrice: referencePrice
          ? extractedData.type === "lease"
            ? Math.ceil(referencePrice / 100) * 100 // Round to nearest $100 for lease
            : Math.ceil(referencePrice / 10000) * 10000 // Round to nearest $10k for sale
          : undefined,
      };

      console.log("🔄 About to set editable data:", newEditableData);
      console.log("🔍 Key values being set:", {
        type: newEditableData.type,
        minPrice: newEditableData.minPrice,
        maxPrice: newEditableData.maxPrice,
        maxTaxes: newEditableData.maxTaxes,
        extractedType: extractedData.type,
        referencePrice: referencePrice,
        isLease: extractedData.type === "lease",
      });
      setEditableData(newEditableData);
      console.log("🏠 Listing selected:", listing);
      console.log("📊 Comparable data extracted:", extractedData);
      console.log("💰 Reference price:", referencePrice);
      console.log("🏷️ Property taxes:", propertyTaxes);
      console.log("📝 Final editable data being set:", {
        ...extractedData,
        type: extractedData.type,
        minPrice: referencePrice
          ? extractedData.type === "lease"
            ? Math.max(1000, Math.floor((referencePrice * 0.8) / 100) * 100)
            : Math.max(
                50000,
                Math.floor((referencePrice * 0.8) / 10000) * 10000
              )
          : extractedData.type === "lease"
          ? 1000
          : 50000,
        maxPrice: referencePrice
          ? extractedData.type === "lease"
            ? Math.ceil(referencePrice / 100) * 100
            : Math.ceil(referencePrice / 10000) * 10000
          : undefined,
        maxTaxes: propertyTaxes
          ? Math.ceil(propertyTaxes / 100) * 100
          : undefined,
      });
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
      if (
        editableData.maxTaxes !== undefined &&
        editableData.maxTaxes !== null &&
        !isNaN(editableData.maxTaxes)
      )
        searchParams.append("maxTaxes", editableData.maxTaxes.toString());
      if (
        editableData.minPrice !== undefined &&
        editableData.minPrice !== null &&
        !isNaN(editableData.minPrice) &&
        editableData.minPrice > 0
      )
        searchParams.append("minPrice", editableData.minPrice.toString());
      if (
        editableData.maxPrice !== undefined &&
        editableData.maxPrice !== null &&
        !isNaN(editableData.maxPrice)
      )
        searchParams.append("maxPrice", editableData.maxPrice.toString());

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
      console.log("📦 Response keys:", Object.keys(data));
      console.log("📦 Response data type:", typeof data);

      // Log data structure to understand format
      if (data.data && Array.isArray(data.data)) {
        console.log("📦 Found data.data array with", data.data.length, "items");
        if (data.data.length > 0) {
          console.log(
            "📦 First item in data.data:",
            JSON.stringify(data.data[0], null, 2)
          );
        }
      }

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

      // Debug: Log the first listing to see the data structure
      if (comparableListings.length > 0) {
        console.log(
          "🔍 First listing structure:",
          JSON.stringify(comparableListings[0], null, 2)
        );
      }

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

          // Extract the first image URL from various possible locations
          let imageUrl = undefined;

          // Debug: Log the entire listing structure for image debugging
          console.log(`🖼️ Debugging images for listing ${index}:`, {
            id: listing.mlsNumber || listing.id || listing.mls,
            imageFields: {
              images: listing.images,
              photos: listing.photos,
              media: listing.media,
              pictures: listing.pictures,
              attachments: listing.attachments,
              imageUrl: listing.imageUrl,
              image: listing.image,
              primaryPhoto: listing.primaryPhoto,
              photoUrl: listing.photoUrl,
              thumbnailUrl: listing.thumbnailUrl,
              mainImage: listing.mainImage,
              featuredImage: listing.featuredImage,
            },
          });

          // Check multiple possible locations for images
          const imageSources = [
            listing.images,
            listing.photos,
            listing.media,
            listing.pictures,
            listing.attachments,
          ];

          for (const imageArray of imageSources) {
            if (
              imageArray &&
              Array.isArray(imageArray) &&
              imageArray.length > 0
            ) {
              const firstImage = imageArray[0];
              console.log(`🖼️ Found image array with first image:`, firstImage);

              if (typeof firstImage === "string") {
                // Check if it's already a full URL or needs base URL
                if (firstImage.startsWith("http")) {
                  imageUrl = firstImage;
                } else {
                  // Use the correct CDN base URL for images with small class for faster loading
                  imageUrl = `https://cdn.repliers.io/${firstImage}?class=small`;
                }
                console.log(`🖼️ Using string image URL:`, imageUrl);
                break;
              } else if (firstImage && typeof firstImage === "object") {
                // Handle cases where image is an object with url property
                const extractedUrl =
                  firstImage.url ||
                  firstImage.src ||
                  firstImage.href ||
                  firstImage.link ||
                  firstImage.mediaUrl ||
                  firstImage.fullSizeUrl ||
                  firstImage.largePhotoUrl ||
                  firstImage.photoUrl;

                if (extractedUrl) {
                  // Check if it's already a full URL or needs base URL
                  if (extractedUrl.startsWith("http")) {
                    imageUrl = extractedUrl;
                  } else {
                    imageUrl = `https://cdn.repliers.io/${extractedUrl}?class=small`;
                  }
                }

                console.log(`🖼️ Extracted from object:`, {
                  object: firstImage,
                  extractedUrl: extractedUrl,
                  finalUrl: imageUrl,
                });

                if (imageUrl) break;
              }
            }
          }

          // If no image found in arrays, check direct properties
          if (!imageUrl) {
            const directProperties = {
              imageUrl: listing.imageUrl,
              image: listing.image,
              primaryPhoto: listing.primaryPhoto,
              photoUrl: listing.photoUrl,
              thumbnailUrl: listing.thumbnailUrl,
              mainImage: listing.mainImage,
              featuredImage: listing.featuredImage,
            };

            console.log(`🖼️ Checking direct properties:`, directProperties);

            const directImageUrl =
              listing.imageUrl ||
              listing.image ||
              listing.primaryPhoto ||
              listing.photoUrl ||
              listing.thumbnailUrl ||
              listing.mainImage ||
              listing.featuredImage;

            if (directImageUrl) {
              // Check if it's already a full URL or needs base URL
              if (directImageUrl.startsWith("http")) {
                imageUrl = directImageUrl;
              } else {
                imageUrl = `https://cdn.repliers.io/${directImageUrl}?class=small`;
              }
              console.log(`🖼️ Found direct property image:`, imageUrl);
            }
          }

          console.log(`🖼️ Final imageUrl for listing ${index}:`, imageUrl);

          // Extract property taxes from various possible locations
          let propertyTaxes = undefined;

          console.log(`💰 Debugging property taxes for listing ${index}:`, {
            id: listing.mlsNumber || listing.id,
            taxes: listing.taxes,
            propertyTaxes: listing.propertyTaxes,
            annualTaxes: listing.annualTaxes,
            yearlyTaxes: listing.yearlyTaxes,
            detailsTaxes: listing.details?.taxes,
            financialsTaxes: listing.financials?.taxes,
            allTaxFields: {
              "listing.taxes": listing.taxes,
              "listing.propertyTaxes": listing.propertyTaxes,
              "listing.annualTaxes": listing.annualTaxes,
              "listing.yearlyTaxes": listing.yearlyTaxes,
              "listing.details.taxes": listing.details?.taxes,
              "listing.financials.taxes": listing.financials?.taxes,
              "listing.details.propertyTaxes": listing.details?.propertyTaxes,
              "listing.details.annualTaxes": listing.details?.annualTaxes,
              "listing.taxInfo": listing.taxInfo,
              "listing.propertyTax": listing.propertyTax,
              "listing.tax": listing.tax,
              "listing.assessment": listing.assessment,
              "listing.assessments": listing.assessments,
            },
          });

          if (listing.taxes) {
            propertyTaxes =
              listing.taxes.annual ||
              listing.taxes.yearly ||
              listing.taxes.total ||
              listing.taxes.amount ||
              listing.taxes.annualAmount ||
              listing.taxes;
          } else if (listing.propertyTaxes) {
            propertyTaxes = listing.propertyTaxes;
          } else if (listing.annualTaxes) {
            propertyTaxes = listing.annualTaxes;
          } else if (listing.yearlyTaxes) {
            propertyTaxes = listing.yearlyTaxes;
          } else if (listing.details && listing.details.taxes) {
            propertyTaxes =
              listing.details.taxes.annual ||
              listing.details.taxes.yearly ||
              listing.details.taxes.total ||
              listing.details.taxes.amount ||
              listing.details.taxes.annualAmount ||
              listing.details.taxes;
          } else if (listing.financials && listing.financials.taxes) {
            propertyTaxes = listing.financials.taxes;
          } else if (listing.details?.propertyTaxes) {
            propertyTaxes = listing.details.propertyTaxes;
          } else if (listing.details?.annualTaxes) {
            propertyTaxes = listing.details.annualTaxes;
          } else if (listing.taxInfo) {
            propertyTaxes =
              listing.taxInfo.annual ||
              listing.taxInfo.amount ||
              listing.taxInfo;
          } else if (listing.propertyTax) {
            propertyTaxes = listing.propertyTax;
          } else if (listing.tax) {
            propertyTaxes = listing.tax;
          } else if (listing.assessment) {
            propertyTaxes =
              listing.assessment.taxes ||
              listing.assessment.propertyTax ||
              listing.assessment;
          } else if (
            listing.assessments &&
            Array.isArray(listing.assessments) &&
            listing.assessments.length > 0
          ) {
            propertyTaxes =
              listing.assessments[0].taxes ||
              listing.assessments[0].propertyTax;
          }

          // Ensure propertyTaxes is a number if found
          if (propertyTaxes && typeof propertyTaxes !== "number") {
            const parsed = parseFloat(propertyTaxes);
            propertyTaxes = isNaN(parsed) ? undefined : parsed;
          }

          console.log(
            `💰 Final property taxes for listing ${index}:`,
            propertyTaxes
          );

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
            imageUrl,
            propertyTaxes,
          };
        }
      );

      setComparables(formattedComparables);
      setOriginalListings(comparableListings);
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
    return imageUrl.replace(/\?class=\w+/, "?class=small");
  };

  const getLargeImageUrl = (imageUrl: string) => {
    return imageUrl.replace(/\?class=\w+/, "?class=large");
  };

  const openDetailedListingView = (property: ComparableProperty) => {
    // Find the original listing data
    const originalListing = originalListings.find(
      (listing) =>
        (listing.mlsNumber ||
          listing.id ||
          `comparable-${originalListings.indexOf(listing)}`) === property.id
    );

    if (!originalListing) {
      console.error(
        "Could not find original listing data for property:",
        property.id
      );
      return;
    }

    // Create a new tab with the detailed view using the PropertyDetailsDisplay component
    const detailWindow = window.open("", "_blank");
    if (!detailWindow) {
      alert("Please allow popups to view detailed property information");
      return;
    }

    // Create a minimal React app in the new tab that uses our PropertyDetailsDisplay component
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Property Details - ${formatAddress(
          originalListing.address
        )}</title>
        <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-50 p-4">
        <div id="root"></div>
        <script type="text/babel">
          const { useState } = React;
          
          // This is a simplified version of PropertyDetailsDisplay for the new tab
          function PropertyDetailsDisplay({ listing }) {
            const [selectedImage, setSelectedImage] = useState(null);

            const formatPrice = (price) => {
              return '$' + price.toLocaleString();
            };

            const formatAddress = (address) => {
              if (typeof address === "string") return address;
              if (typeof address === "object" && address !== null) {
                const parts = [];
                if (address.streetNumber) parts.push(address.streetNumber);
                if (address.streetName) parts.push(address.streetName);
                if (address.streetSuffix) parts.push(address.streetSuffix);
                if (address.city) parts.push(address.city);
                if (address.state) parts.push(address.state);
                if (address.zip || address.postalCode) parts.push(address.zip || address.postalCode);
                return parts.length > 0 ? parts.join(" ") : "Address not available";
              }
              return "Address not available";
            };

            const validFieldCount = Object.entries(listing).filter(
              ([, value]) => value !== null && value !== undefined
            ).length;

            return React.createElement('div', { className: 'max-w-6xl mx-auto' },
              React.createElement('div', { 
                className: 'border border-gray-200 rounded-lg p-6 bg-white shadow-sm' 
              },
                React.createElement('div', { 
                  className: 'flex items-start justify-between mb-4' 
                },
                  React.createElement('div', {},
                    React.createElement('h3', { 
                      className: 'text-lg font-semibold text-gray-900 mb-1' 
                    }, 'Property Details'),
                    React.createElement('p', { 
                      className: 'text-sm text-gray-500' 
                    }, formatAddress(listing.address))
                  ),
                  listing.status && React.createElement('span', { 
                    className: 'px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full' 
                  }, listing.status === "A" ? "Available" : listing.status === "U" ? "Sold" : listing.status)
                ),
                React.createElement('div', { className: 'space-y-6' },
                  React.createElement('details', { className: 'group', open: true },
                    React.createElement('summary', { 
                      className: 'cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900' 
                    }, \`🔍 Complete Property Information (Click to expand) - \${validFieldCount} fields\`),
                    React.createElement('div', { 
                      className: 'mt-4 grid grid-cols-1 md:grid-cols-2 gap-4' 
                    },
                      Object.entries(listing).map(([key, value]) => {
                        if (value === null || value === undefined) return null;
                        
                        let displayValue;
                        if (typeof value === "object") {
                          if (key === "address") {
                            displayValue = formatAddress(value);
                          } else if (Array.isArray(value)) {
                            displayValue = value.join(", ");
                          } else {
                            displayValue = JSON.stringify(value, null, 2);
                          }
                        } else if (typeof value === "number" && (key.includes("price") || key.includes("Price"))) {
                          displayValue = formatPrice(value);
                        } else if (typeof value === "number" && key.includes("sqft")) {
                          displayValue = value.toLocaleString() + " sqft";
                        } else if (typeof value === "boolean") {
                          displayValue = value ? "Yes" : "No";
                        } else {
                          displayValue = String(value);
                        }
                        
                        const displayKey = key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase());
                        
                        return React.createElement('div', { 
                          key: key, 
                          className: 'border-l-2 border-blue-200 pl-3' 
                        },
                          React.createElement('div', { 
                            className: 'text-xs font-medium text-gray-500 uppercase tracking-wide' 
                          }, displayKey),
                          React.createElement('div', { 
                            className: 'text-sm font-medium text-gray-900 mt-1 break-words' 
                          },
                            typeof value === "object" && !Array.isArray(value) && key !== "address" 
                              ? React.createElement('pre', { 
                                  className: 'text-xs bg-gray-50 p-2 rounded overflow-auto max-h-32' 
                                }, displayValue)
                              : React.createElement('span', {}, displayValue)
                          )
                        );
                      }).filter(Boolean)
                    )
                  )
                )
              )
            );
          }

          const listing = ${JSON.stringify(originalListing)};
          const root = ReactDOM.createRoot(document.getElementById('root'));
          root.render(React.createElement(PropertyDetailsDisplay, { listing: listing }));
        </script>
      </body>
      </html>
    `;

    detailWindow.document.write(htmlContent);
    detailWindow.document.close();
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
          <div
            id="selected-property-section"
            className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
          >
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

                  {selectedListing.listPrice && (
                    <div>
                      <span className="text-gray-600">List Price: </span>
                      <span className="font-medium">
                        ${selectedListing.listPrice.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {selectedListing.soldPrice && (
                    <div>
                      <span className="text-gray-600">Sold Price: </span>
                      <span className="font-bold text-md text-green-600">
                        ${selectedListing.soldPrice.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {selectedListing &&
                    (() => {
                      // Extract property taxes from the selected listing
                      let propertyTaxes = undefined;

                      if (selectedListing.taxes) {
                        propertyTaxes =
                          selectedListing.taxes.annualAmount ||
                          selectedListing.taxes.annual ||
                          selectedListing.taxes.yearly ||
                          selectedListing.taxes.total ||
                          selectedListing.taxes.amount ||
                          selectedListing.taxes;
                      } else if (selectedListing.propertyTaxes) {
                        propertyTaxes = selectedListing.propertyTaxes;
                      } else if (selectedListing.annualTaxes) {
                        propertyTaxes = selectedListing.annualTaxes;
                      } else if (selectedListing.yearlyTaxes) {
                        propertyTaxes = selectedListing.yearlyTaxes;
                      } else if (
                        selectedListing.details &&
                        selectedListing.details.taxes
                      ) {
                        propertyTaxes =
                          selectedListing.details.taxes.annualAmount ||
                          selectedListing.details.taxes.annual ||
                          selectedListing.details.taxes.yearly ||
                          selectedListing.details.taxes.total ||
                          selectedListing.details.taxes.amount ||
                          selectedListing.details.taxes;
                      } else if (
                        selectedListing.financials &&
                        selectedListing.financials.taxes
                      ) {
                        propertyTaxes = selectedListing.financials.taxes;
                      }

                      // Ensure propertyTaxes is a number if found
                      if (propertyTaxes && typeof propertyTaxes !== "number") {
                        const parsed = parseFloat(propertyTaxes);
                        propertyTaxes = isNaN(parsed) ? undefined : parsed;
                      }

                      return propertyTaxes ? (
                        <div>
                          <span className="text-gray-600">
                            Property Taxes:{" "}
                          </span>
                          <span className="font-medium">
                            ${propertyTaxes.toLocaleString()}/year
                          </span>
                        </div>
                      ) : null;
                    })()}

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
                  {/* Price/Financial Filters */}
                  <div>
                    <h5 className="text-xs font-semibold text-gray-800 uppercase tracking-wide mb-2 border-b border-gray-200 pb-1">
                      Price/Financial Filters
                    </h5>
                    <div className="space-y-2">
                      {/* Min Price */}
                      <div>
                        <label className="block text-gray-600 mb-1">
                          Min Price:
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                            $
                          </span>
                          <input
                            type="number"
                            value={editableData.minPrice || ""}
                            onChange={(e) =>
                              setEditableData({
                                ...editableData,
                                minPrice: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              })
                            }
                            className="h-8 text-sm border border-gray-300 rounded-md pl-6 pr-2 w-full"
                            min="0"
                            max="1000000000"
                            step="100"
                            placeholder="500"
                          />
                        </div>
                      </div>

                      {/* Max Price */}
                      <div>
                        <label className="block text-gray-600 mb-1">
                          Max Price:
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                            $
                          </span>
                          <input
                            type="number"
                            value={editableData.maxPrice || ""}
                            onChange={(e) =>
                              setEditableData({
                                ...editableData,
                                maxPrice: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              })
                            }
                            className="h-8 text-sm border border-gray-300 rounded-md pl-6 pr-2 w-full"
                            min="0"
                            max="1000000000"
                            step="100"
                            placeholder="1000000"
                          />
                        </div>
                      </div>

                      {/* Max Property Taxes */}
                      <div>
                        <label className="block text-gray-600 mb-1">
                          Max Property Taxes/year:
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                            $
                          </span>
                          <input
                            type="number"
                            value={editableData.maxTaxes || ""}
                            onChange={(e) =>
                              setEditableData({
                                ...editableData,
                                maxTaxes: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              })
                            }
                            className="h-8 text-sm border border-gray-300 rounded-md pl-6 pr-2 w-full"
                            min="1000"
                            max="50000"
                            step="100"
                            placeholder="9000"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

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
                          min="1"
                          max="100"
                          step="1"
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
            <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded-lg border border-blue-200">
              💡 Click on any property card to view detailed information in a
              new tab
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {comparables.map((property) => {
                // Debug property taxes in UI
                console.log(
                  `🏠 Property ${property.id} UI render - propertyTaxes:`,
                  property.propertyTaxes,
                  "Should show:",
                  !!property.propertyTaxes
                );

                return (
                  <div
                    key={property.id}
                    className="bg-white border border-gray-200 rounded p-3 hover:shadow-md transition-all duration-200 hover:border-blue-300 cursor-pointer relative group"
                    onClick={() => openDetailedListingView(property)}
                    title="Click to view detailed property information in a new tab"
                  >
                    {/* Click indicator overlay */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="bg-blue-600 text-white p-1 rounded-full">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      {/* Image Section - 40% of component width */}
                      <div className="w-2/5 flex-shrink-0">
                        <div className="w-full aspect-square rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                          {property.imageUrl ? (
                            <img
                              src={property.imageUrl}
                              alt="Property"
                              className="w-full h-full object-cover"
                              onLoad={() => {
                                console.log(
                                  `✅ Image loaded successfully for property ${property.id}:`,
                                  property.imageUrl
                                );
                              }}
                              onError={(e) => {
                                console.log(
                                  `❌ Image failed to load for property ${property.id}:`,
                                  property.imageUrl
                                );
                                // Fallback to house icon if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `
                                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                  </svg>
                                `;
                                }
                              }}
                            />
                          ) : (
                            // House icon fallback
                            <svg
                              className="w-8 h-8 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                              />
                            </svg>
                          )}
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 min-w-0">
                        {/* Price and Property Type at Top */}
                        <div className="mb-2">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-lg font-bold text-green-600">
                              {formatPrice(property.price)}
                            </p>
                            <span className="px-1.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                              {property.propertyType}
                            </span>
                          </div>
                          {/* Address below price */}
                          <h4 className="text-sm font-semibold text-gray-900 leading-tight break-words">
                            {formatAddress(property.address)}
                          </h4>
                        </div>

                        {/* Property Details */}
                        <div className="space-y-0.5 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 min-w-fit">
                              Beds/Baths:
                            </span>
                            <span className="font-medium text-gray-900">
                              {property.beds} bed, {property.baths} bath
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 min-w-fit">
                              Square Feet:
                            </span>
                            <span className="font-medium text-gray-900">
                              {property.sqft
                                ? property.sqft.toLocaleString()
                                : "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 min-w-fit">
                              Listed Date:
                            </span>
                            <span className="font-medium text-gray-900">
                              {formatDate(property.lastSoldDate)}
                            </span>
                          </div>
                          {property.propertyTaxes ? (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600 min-w-fit">
                                Property Taxes:
                              </span>
                              <span className="font-medium text-gray-900">
                                {formatPrice(property.propertyTaxes)}/yr
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600 min-w-fit">
                                Property Taxes:
                              </span>
                              <span className="font-medium text-gray-500">
                                Not available
                              </span>
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
