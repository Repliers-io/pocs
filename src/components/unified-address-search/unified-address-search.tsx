import React, { useEffect, useRef, useState } from "react";

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

interface GoogleAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
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

interface UnifiedAddressSearchProps {
  onPlaceSelect: (place: PlaceDetails) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  displayAddressComponents?: boolean;
}

// Declare Google Maps types
declare global {
  interface Window {
    google: any;
  }
}

// Hardcoded API key (restricted to specific domains)
const GOOGLE_PLACES_API_KEY = "AIzaSyBqlRCVfRWu5PagapW3CsV1VVba9fIdknA";

/**
 * UnifiedAddressSearch Component
 *
 * @description Address autocomplete component using Google Places API
 * @param props - The component props
 * @returns JSX.Element
 */
export function UnifiedAddressSearch({
  onPlaceSelect,
  placeholder = "Enter an address...",
  className,
  disabled = false,
  displayAddressComponents = false,
}: UnifiedAddressSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [savedAddress, setSavedAddress] = useState<PlaceDetails | null>(null);

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMapsAPI = async () => {
      if (window.google?.maps?.places?.Autocomplete) {
        setIsGoogleLoaded(true);
        return;
      }

      try {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_PLACES_API_KEY}&libraries=places&loading=async&v=weekly`;
        script.async = true;
        script.defer = true;

        const loadPromise = new Promise<void>((resolve, reject) => {
          script.onload = () => {
            // Wait for Google Maps to be fully initialized
            const checkGoogleMaps = () => {
              if (window.google?.maps?.places?.Autocomplete) {
                resolve();
              } else {
                setTimeout(checkGoogleMaps, 100);
              }
            };
            checkGoogleMaps();
          };
          script.onerror = (error) => {
            console.error("Script loading failed:", error);
            reject(new Error("Failed to load Google Maps API script"));
          };
        });

        document.head.appendChild(script);
        await loadPromise;
        setIsGoogleLoaded(true);
        setLoadingError(null);
      } catch (error) {
        console.error("Error loading Google Maps API:", error);
        setIsGoogleLoaded(false);
        setLoadingError(
          error instanceof Error
            ? error.message
            : "Failed to load Google Maps API"
        );
      }
    };

    loadGoogleMapsAPI();
  }, []);

  // Initialize autocomplete
  useEffect(() => {
    if (!isGoogleLoaded || !inputRef.current || autocompleteRef.current) {
      return;
    }

    // Double-check that Google Maps is actually available
    if (!window.google?.maps?.places?.Autocomplete) {
      console.error(
        "Google Maps Autocomplete not available even though isGoogleLoaded is true"
      );
      setIsGoogleLoaded(false);
      return;
    }

    try {
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["address"],
          fields: [
            "address_components",
            "formatted_address",
            "place_id",
            "geometry",
          ],
        }
      );

      autocompleteRef.current = autocomplete;

      const handlePlaceChanged = () => {
        const place = autocomplete.getPlace();

        if (!place.address_components) {
          return;
        }

        const addressComponents: AddressComponents = {
          city: "",
          streetNumber: "",
          streetName: "",
          streetSuffix: "",
          state: "",
          postalCode: "",
          country: "",
        };

        place.address_components.forEach(
          (component: GoogleAddressComponent) => {
            const types = component.types;
            const value = component.long_name;

            if (types.includes("street_number")) {
              addressComponents.streetNumber = value;
            } else if (types.includes("route")) {
              // Parse street name and suffix
              const parts = value.split(" ");
              if (parts.length > 1) {
                const lastPart = parts[parts.length - 1].toLowerCase();
                const commonSuffixes = [
                  "street",
                  "st",
                  "avenue",
                  "ave",
                  "road",
                  "rd",
                  "boulevard",
                  "blvd",
                  "lane",
                  "ln",
                  "drive",
                  "dr",
                  "court",
                  "ct",
                  "circle",
                  "cir",
                  "way",
                  "place",
                  "pl",
                  "terrace",
                  "ter",
                  "trail",
                  "trl",
                  "parkway",
                  "pkwy",
                  "square",
                  "sq",
                  "highway",
                  "hwy",
                ];

                if (commonSuffixes.includes(lastPart)) {
                  addressComponents.streetSuffix = parts.pop() || "";
                  addressComponents.streetName = parts.join(" ");
                } else {
                  addressComponents.streetName = value;
                }
              } else {
                addressComponents.streetName = value;
              }
            } else if (types.includes("locality")) {
              addressComponents.city = value;
            } else if (types.includes("administrative_area_level_1")) {
              addressComponents.state = value;
            } else if (types.includes("postal_code")) {
              addressComponents.postalCode = value;
            } else if (types.includes("country")) {
              addressComponents.country = value;
            }
          }
        );

        const placeDetails: PlaceDetails = {
          address: addressComponents,
          formattedAddress: place.formatted_address || "",
          placeId: place.place_id || "",
          geometry: place.geometry
            ? {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              }
            : undefined,
        };

        setSavedAddress(placeDetails);
        onPlaceSelect(placeDetails);
      };

      autocomplete.addListener("place_changed", handlePlaceChanged);

      return () => {
        if (autocompleteRef.current) {
          window.google.maps.event.clearInstanceListeners(
            autocompleteRef.current
          );
          autocompleteRef.current = null;
        }
      };
    } catch (error) {
      console.error("Error initializing autocomplete:", error);
    }
  }, [isGoogleLoaded, onPlaceSelect]);

  return (
    <div className={className}>
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="address-search" className="text-sm font-medium">
            Search Address
          </label>
          <div className="min-w-[400px] w-auto">
            {isGoogleLoaded ? (
              <input
                ref={inputRef}
                id="address-search"
                type="text"
                placeholder={placeholder}
                disabled={disabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-4 00 focus:border-blue-500"
              />
            ) : loadingError ? (
              <div className="text-red-500 text-sm p-2 border border-red-300 rounded">
                Error: {loadingError}
              </div>
            ) : (
              <div className="text-muted-foreground px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                Loading Google Maps...
              </div>
            )}
          </div>
        </div>

        {displayAddressComponents && savedAddress && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-sm font-medium mb-2">Address Components</h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="font-medium text-gray-600">Street Number:</dt>
              <dd>{savedAddress.address.streetNumber}</dd>

              <dt className="font-medium text-gray-600">Street Name:</dt>
              <dd>{savedAddress.address.streetName}</dd>

              <dt className="font-medium text-gray-600">Street Suffix:</dt>
              <dd>{savedAddress.address.streetSuffix}</dd>

              <dt className="font-medium text-gray-600">City:</dt>
              <dd>{savedAddress.address.city}</dd>

              <dt className="font-medium text-gray-600">State:</dt>
              <dd>{savedAddress.address.state}</dd>

              <dt className="font-medium text-gray-600">Postal Code:</dt>
              <dd>{savedAddress.address.postalCode}</dd>

              <dt className="font-medium text-gray-600">Country:</dt>
              <dd>{savedAddress.address.country}</dd>

              <dt className="font-medium text-gray-600">Formatted Address:</dt>
              <dd className="col-span-2">{savedAddress.formattedAddress}</dd>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
