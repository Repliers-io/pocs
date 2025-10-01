import React, { useRef, useEffect, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { BedDouble, Bath, Car, ChevronDown, X } from "lucide-react";

export interface MapListingsProps {
  /** Repliers API key - required */
  apiKey: string;
  /** MapBox access token - required */
  mapboxToken: string;
  /** Initial map center coordinates [lng, lat] - auto-detects if not provided */
  initialCenter?: [number, number];
  /** Initial zoom level - auto-calculates if not provided */
  initialZoom?: number;
  /** Map container height */
  height?: string;
  /** Map container width */
  width?: string;
  /** Map style */
  mapStyle?: string;
  /** Center calculation method */
  centerCalculation?: "average" | "city";
  /** Show property count display */
  showPropertyCount?: boolean;
}

interface ClusterFeature {
  type: "Feature";
  properties: {
    count: number;
    precision: number;
    id: string;
    members?: any[]; // Store actual cluster members from API
    apiCount?: number; // Original unfiltered count from API for debugging
  };
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}

interface PropertyFeature {
  type: "Feature";
  properties: {
    mlsNumber: string;
    listPrice?: number;
    propertyType?: string; // "Sale" or "Lease"
    isProperty: true;
    // Enhanced fields available at zoom 13+
    address?: {
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
    status?: string;
    class?: string;
  };
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}

interface Coordinate {
  lat: number;
  lng: number;
}

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface AutoCenterData {
  center: [number, number];
}

interface MapFilters {
  listingType: "all" | "sale" | "lease";
  propertyTypes: string[];
  minPrice?: number;
  maxPrice?: number | null; // null represents "Max" (no limit)
  bedrooms?: "all" | "0" | "1" | "2" | "3" | "4" | "5+";
  bathrooms?: "all" | "1+" | "2+" | "3+" | "4+" | "5+";
  garageSpaces?: "all" | "1+" | "2+" | "3+" | "4+" | "5+";
  minSqft?: number;
  maxSqft?: number | null; // null represents "Max" (no limit)
  openHouse?: "all" | "today" | "thisWeek" | "thisWeekend" | "anytime";
  maxMaintenanceFee?: number | null; // null represents "Max" (no limit)
}

interface ListingResult {
  mlsNumber: string;
  listPrice: number;
  address?: {
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
  status?: string;
}

interface ListingPreviewProps {
  listing: ListingResult;
  onClick?: () => void;
}

// Shared formatting utilities
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const formatBedrooms = (details: ListingResult["details"]) => {
  if (!details) return "N/A";

  const total = details.numBedrooms;
  const plus = details.numBedroomsPlus;

  if (total && plus && plus > 0) {
    return `${total} + ${plus}`;
  }
  return total?.toString() || "N/A";
};

const formatBathrooms = (details: ListingResult["details"]) => {
  if (!details) return "N/A";

  const total = details.numBathrooms;
  const plus = details.numBathroomsPlus;

  if (total && plus && plus > 0) {
    return `${total} + ${plus}`;
  }
  return total?.toString() || "N/A";
};

const formatParking = (details: ListingResult["details"]) => {
  if (!details) return "N/A";
  return details.numGarageSpaces?.toString() || "N/A";
};

const getStatusLabel = (
  type?: string,
  lastStatus?: string
): string | null => {
  if (lastStatus === "New" || lastStatus === "Pc" || lastStatus === "Ext") {
    if (type === "Sale") return "For Sale";
    if (type === "Lease") return "For Lease";
    return type || null;
  }

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

const StatusTag = ({
  type,
  lastStatus,
  size = "sm",
}: {
  type?: string;
  lastStatus?: string;
  size?: "xs" | "sm";
}) => {
  const label = getStatusLabel(type, lastStatus);
  if (!label) return null;

  let style = "bg-green-100 text-green-600"; // Default for active listings

  switch (label) {
    case "For Sale":
      style = "bg-green-100 text-green-600";
      break;
    case "For Lease":
      style = "bg-purple-100 text-purple-600";
      break;
    case "Sold":
      style = "bg-blue-100 text-blue-600";
      break;
    case "Leased":
      style = "bg-purple-100 text-purple-600";
      break;
    case "Sold Conditionally":
    case "Sold Conditionally (Escape Clause)":
    case "Leased Conditionally":
      style = "bg-amber-100 text-amber-600";
      break;
    case "Coming Soon":
      style = "bg-indigo-100 text-indigo-600";
      break;
    case "Suspended":
      style = "bg-orange-100 text-orange-600";
      break;
    case "Expired":
      style = "bg-gray-100 text-gray-500";
      break;
    case "Terminated":
    case "Deal Fell Through":
      style = "bg-red-100 text-red-600";
      break;
    default:
      style = "bg-gray-100 text-gray-500";
  }

  const sizeClass = size === "xs" ? "text-xs" : "text-sm";

  return (
    <span className={`${sizeClass} px-2 py-1 rounded-md font-medium ${style}`}>
      {label}
    </span>
  );
};

const formatAddress = (address: ListingResult["address"]) => {
  if (!address) return "Address not available";

  const parts = [
    address.streetNumber,
    address.streetDirection,
    address.streetName,
    address.streetSuffix,
  ].filter(Boolean);

  const street = parts.join(" ");
  const cityState = [address.city, address.state].filter(Boolean).join(", ");

  return [street, cityState].filter(Boolean).join(", ");
};

// ListingPreview component based on tooltip variant
function ListingPreview({ listing, onClick }: ListingPreviewProps) {
  return (
    <div
      className="p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        {/* Property Image */}
        <div className="bg-gray-100 rounded-md overflow-hidden flex-shrink-0 h-20 aspect-[4/3]">
          {listing.images?.[0] ? (
            <img
              src={`https://cdn.repliers.io/${listing.images[0]}?class=small`}
              alt="Property"
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              No Image
            </div>
          )}
        </div>

        {/* Property Info */}
        <div className="flex-grow min-w-0">
          {/* Price & MLS */}
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <h4 className="font-semibold text-gray-800 truncate text-base">
                {listing.listPrice
                  ? formatPrice(listing.listPrice)
                  : "Price N/A"}
              </h4>
              <span className="text-gray-400 text-sm">|</span>
              <span className="text-gray-600 truncate text-sm">
                {listing.mlsNumber}
              </span>
            </div>
            <div className="flex-shrink-0 ml-2">
              <StatusTag
                type={listing.type}
                lastStatus={listing.lastStatus}
                size="sm"
              />
            </div>
          </div>

          {/* Address */}
          <p className="text-gray-600 leading-relaxed text-sm mb-2">
            {formatAddress(listing.address)}
          </p>

          {/* Property Details */}
          <div className="flex items-center text-gray-500 space-x-3 flex-wrap text-sm">
            <span className="flex items-center gap-1">
              <BedDouble className="w-4 h-4" />
              {formatBedrooms(listing.details)}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              {formatBathrooms(listing.details)}
            </span>
            <span className="flex items-center gap-1">
              <Car className="w-4 h-4" />
              {formatParking(listing.details)}
            </span>
            {listing.details?.propertyType && (
              <span className="text-gray-400">| {listing.details.propertyType}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface PropertyTooltipProps {
  open: boolean;
  onClose: () => void;
  listing: ListingResult | null;
  position: {
    x: number;
    y: number;
  };
  mapContainer: HTMLElement | null;
}

interface ClusterTooltipProps {
  open: boolean;
  onClose: () => void;
  properties: ListingResult[];
  position: {
    x: number;
    y: number;
  };
  mapContainer: HTMLElement | null;
}


function PropertyTooltip({
  open,
  onClose,
  listing,
  position,
  mapContainer,
}: PropertyTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [arrowPosition, setArrowPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('bottom');
  const [isPositioned, setIsPositioned] = useState(false);

  // Reset positioned state when opening/closing
  useEffect(() => {
    setIsPositioned(false);
  }, [open]);

  // Calculate optimal tooltip position
  useEffect(() => {
    if (!open || !tooltipRef.current || !mapContainer) return;

    const tooltip = tooltipRef.current;
    const tooltipRect = tooltip.getBoundingClientRect();

    // Convert marker position to viewport coordinates
    const markerX = position.x;
    const markerY = position.y;

    // Tooltip dimensions - optimized for content
    const tooltipWidth = 450; // Optimized width for better content fit
    const tooltipHeight = tooltipRect.height || 200; // Estimated height

    // Viewport boundaries (with padding)
    const padding = 16;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate preferred position (above the marker)
    let x = markerX - tooltipWidth / 2;
    let y = markerY - tooltipHeight - 16; // 16px gap for arrow
    let arrow: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

    // Horizontal boundary checks
    if (x < padding) {
      x = padding;
    } else if (x + tooltipWidth > viewportWidth - padding) {
      x = viewportWidth - tooltipWidth - padding;
    }

    // Vertical boundary checks
    if (y < padding) {
      // Not enough space above, show below marker
      y = markerY + 32; // 32px gap for arrow + marker height
      arrow = 'top';
    }

    // Final boundary check for bottom positioning
    if (y + tooltipHeight > viewportHeight - padding) {
      // Try positioning to the side
      if (markerX > viewportWidth / 2) {
        // Show on left side
        x = markerX - tooltipWidth - 16;
        y = markerY - tooltipHeight / 2;
        arrow = 'right';
      } else {
        // Show on right side
        x = markerX + 16;
        y = markerY - tooltipHeight / 2;
        arrow = 'left';
      }

      // Vertical centering adjustments for side positioning
      if (y < padding) y = padding;
      if (y + tooltipHeight > viewportHeight - padding) {
        y = viewportHeight - tooltipHeight - padding;
      }
    }

    setTooltipPosition({ x, y });
    setArrowPosition(arrow);
    setIsPositioned(true);
  }, [open, position, mapContainer]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  if (!open || !listing) return null;

  // Arrow styles based on position
  const getArrowStyles = () => {
    const baseClasses = "absolute w-3 h-3 bg-white transform rotate-45 border";

    switch (arrowPosition) {
      case 'bottom':
        return `${baseClasses} -bottom-1.5 left-1/2 -translate-x-1/2 border-r border-b border-gray-200`;
      case 'top':
        return `${baseClasses} -top-1.5 left-1/2 -translate-x-1/2 border-l border-t border-gray-200`;
      case 'left':
        return `${baseClasses} -left-1.5 top-1/2 -translate-y-1/2 border-l border-b border-gray-200`;
      case 'right':
        return `${baseClasses} -right-1.5 top-1/2 -translate-y-1/2 border-r border-t border-gray-200`;
      default:
        return `${baseClasses} -bottom-1.5 left-1/2 -translate-x-1/2 border-r border-b border-gray-200`;
    }
  };

  return (
    <div
      ref={tooltipRef}
      className="fixed w-[450px]"
      style={{
        zIndex: 9999,
        left: `${tooltipPosition.x}px`,
        top: `${tooltipPosition.y}px`,
        visibility: isPositioned ? 'visible' : 'hidden',
        opacity: isPositioned ? 1 : 0,
        transition: 'opacity 150ms ease-in-out',
      }}
    >
      {/* Tooltip Card */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden relative">
        {/* Arrow pointer */}
        <div className={getArrowStyles()} />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white hover:bg-gray-100 transition-colors shadow-sm border border-gray-200"
          aria-label="Close"
        >
          <X size={16} className="text-gray-600" />
        </button>

        {/* Content - Use ListingPreview component */}
        <ListingPreview
          listing={listing}
          onClick={() => {
            // TODO: Replace with actual navigation to full property details page
            // Example: window.open(`/listings/${listing.mlsNumber}`, '_blank');
            // Example: router.push(`/property/${listing.mlsNumber}`);
          }}
        />
      </div>
    </div>
  );
}

function ClusterTooltip({
  open,
  onClose,
  properties,
  position,
  mapContainer,
}: ClusterTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [arrowPosition, setArrowPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('bottom');
  const [isPositioned, setIsPositioned] = useState(false);

  // Reset positioned state when opening/closing
  useEffect(() => {
    if (!open) {
      setIsPositioned(false);
      return;
    }
  }, [open]);

  // Calculate optimal tooltip position immediately when opened
  useEffect(() => {
    if (!open || !mapContainer) {
      return;
    }

    // Calculate position immediately with estimated dimensions
    const markerX = position.x;
    const markerY = position.y;

    // Tooltip dimensions - use estimates to avoid getBoundingClientRect delay
    const tooltipWidth = 480;
    const tooltipHeight = Math.min(properties.length * 120 + 80, 400); // Estimate based on property count

    // Viewport boundaries (with padding)
    const padding = 16;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate preferred position (above the marker)
    let x = markerX - tooltipWidth / 2;
    let y = markerY - tooltipHeight - 16; // 16px gap for arrow
    let arrow: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

    // Horizontal boundary checks
    if (x < padding) {
      x = padding;
    } else if (x + tooltipWidth > viewportWidth - padding) {
      x = viewportWidth - tooltipWidth - padding;
    }

    // Vertical boundary checks
    if (y < padding) {
      // Not enough space above, show below marker
      y = markerY + 32; // 32px gap for arrow + marker height
      arrow = 'top';
    }

    // Final boundary check for bottom positioning
    if (y + tooltipHeight > viewportHeight - padding) {
      // Try positioning to the side
      if (markerX > viewportWidth / 2) {
        // Show on left side
        x = markerX - tooltipWidth - 16;
        y = markerY - tooltipHeight / 2;
        arrow = 'right';
      } else {
        // Show on right side
        x = markerX + 16;
        y = markerY - tooltipHeight / 2;
        arrow = 'left';
      }

      // Vertical centering adjustments for side positioning
      if (y < padding) y = padding;
      if (y + tooltipHeight > viewportHeight - padding) {
        y = viewportHeight - tooltipHeight - padding;
      }
    }

    setTooltipPosition({ x, y });
    setArrowPosition(arrow);
    setIsPositioned(true);
  }, [open, position, mapContainer, properties.length]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  if (!open || properties.length === 0) return null;

  // Arrow styles based on position
  const getArrowStyles = () => {
    const baseClasses = "absolute w-3 h-3 bg-white transform rotate-45 border";

    switch (arrowPosition) {
      case 'bottom':
        return `${baseClasses} -bottom-1.5 left-1/2 -translate-x-1/2 border-r border-b border-gray-200`;
      case 'top':
        return `${baseClasses} -top-1.5 left-1/2 -translate-x-1/2 border-l border-t border-gray-200`;
      case 'left':
        return `${baseClasses} -left-1.5 top-1/2 -translate-y-1/2 border-l border-b border-gray-200`;
      case 'right':
        return `${baseClasses} -right-1.5 top-1/2 -translate-y-1/2 border-r border-t border-gray-200`;
      default:
        return `${baseClasses} -bottom-1.5 left-1/2 -translate-x-1/2 border-r border-b border-gray-200`;
    }
  };

  return (
    <div
      ref={tooltipRef}
      className="fixed w-[480px]"
      style={{
        zIndex: 9999,
        left: `${tooltipPosition.x}px`,
        top: `${tooltipPosition.y}px`,
        visibility: isPositioned ? 'visible' : 'hidden',
        opacity: isPositioned ? 1 : 0,
        transition: 'opacity 150ms ease-in-out',
      }}
    >
      {/* Tooltip Card */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden relative">
        {/* Arrow pointer */}
        <div className={getArrowStyles()} />

        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 relative">
          <h3 className="text-sm font-semibold text-gray-800">
            {properties.length === 1 ? '1 Property' : `${properties.length} Properties`}
          </h3>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-gray-100 transition-colors shadow-sm border border-gray-200"
            aria-label="Close"
          >
            <X size={16} className="text-gray-600" />
          </button>
        </div>

        {/* Scrollable Content - Stack ListingPreview components */}
        <div className="max-h-[400px] overflow-y-auto">
          {properties.map((listing, index) => (
            <div key={`${listing.mlsNumber}-${index}`} className="border-b border-gray-100 last:border-b-0">
              <ListingPreview
                listing={listing}
                onClick={() => {
                  // TODO: Replace with actual navigation to full property details page
                  // Example: window.open(`/listings/${listing.mlsNumber}`, '_blank');
                  // Example: router.push(`/property/${listing.mlsNumber}`);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Utility functions for auto-centering

/**
 * Extract coordinates from various API response formats
 */
const extractCoordinates = (listing: any): Coordinate | null => {
  // Try different coordinate formats
  if (listing.coordinates?.lat && listing.coordinates?.lng) {
    return { lat: listing.coordinates.lat, lng: listing.coordinates.lng };
  }
  if (listing.latitude && listing.longitude) {
    return { lat: listing.latitude, lng: listing.longitude };
  }
  if (listing.map?.latitude && listing.map?.longitude) {
    return { lat: listing.map.latitude, lng: listing.map.longitude };
  }
  // Also check cluster coordinate formats
  if (listing.location?.latitude && listing.location?.longitude) {
    return { lat: listing.location.latitude, lng: listing.location.longitude };
  }
  if (listing.center?.lat && listing.center?.lng) {
    return { lat: listing.center.lat, lng: listing.center.lng };
  }
  return null;
};

/**
 * Calculate bounds from an array of coordinates
 */
const getPolygonBounds = (coordinates: Coordinate[]): MapBounds | null => {
  if (coordinates.length === 0) return null;

  let north = coordinates[0].lat;
  let south = coordinates[0].lat;
  let east = coordinates[0].lng;
  let west = coordinates[0].lng;

  coordinates.forEach((coord) => {
    north = Math.max(north, coord.lat);
    south = Math.min(south, coord.lat);
    east = Math.max(east, coord.lng);
    west = Math.min(west, coord.lng);
  });

  return { north, south, east, west };
};

/**
 * Calculate density-weighted center from coordinates (original grid method)
 */
const calculateAverageCenter = (
  coordinates: Coordinate[],
  bounds: MapBounds
): [number, number] => {
  const { north, south, east, west } = bounds;

  // Create a density grid to find the densest area
  const gridSize = 20; // 20x20 grid for density calculation
  const latStep = (north - south) / gridSize;
  const lngStep = (east - west) / gridSize;

  // Initialize density grid
  const densityGrid: number[][] = Array(gridSize)
    .fill(0)
    .map(() => Array(gridSize).fill(0));

  // Count listings in each grid cell
  coordinates.forEach((coord) => {
    const latIndex = Math.floor((coord.lat - south) / latStep);
    const lngIndex = Math.floor((coord.lng - west) / lngStep);

    // Ensure indices are within bounds
    const safeLatIndex = Math.max(0, Math.min(gridSize - 1, latIndex));
    const safeLngIndex = Math.max(0, Math.min(gridSize - 1, lngIndex));

    densityGrid[safeLatIndex][safeLngIndex]++;
  });

  // Find the densest grid cell
  let maxDensity = 0;
  let densestLat = 0;
  let densestLng = 0;

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (densityGrid[i][j] > maxDensity) {
        maxDensity = densityGrid[i][j];
        densestLat = south + (i + 0.5) * latStep; // Center of grid cell
        densestLng = west + (j + 0.5) * lngStep;
      }
    }
  }

  // If no dense area found, fall back to geometric center
  const center: [number, number] =
    maxDensity > 0
      ? [densestLng, densestLat]
      : [(east + west) / 2, (north + south) / 2];

  return center;
};


/**
 * Cache management for auto-center data
 */
const getCachedAutoCenter = (apiKey: string): AutoCenterData | null => {
  try {
    const cached = localStorage.getItem(`mapListings-autoCenter-${apiKey}`);
    if (cached) {
      const data = JSON.parse(cached);
      // Check if cache is less than 24 hours old
      if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
        return { center: data.center };
      }
    }
  } catch (error) {
  }
  return null;
};

const setCachedAutoCenter = (apiKey: string, data: AutoCenterData): void => {
  try {
    const cacheData = {
      ...data,
      timestamp: Date.now(),
    };
    localStorage.setItem(
      `mapListings-autoCenter-${apiKey}`,
      JSON.stringify(cacheData)
    );
  } catch (error) {
  }
};

/**
 * Auto-detect optimal map center from listings data using bundled searches
 */
const detectAutoCenter = async (
  apiKey: string,
  method: "average" | "city" = "average"
): Promise<AutoCenterData | null> => {
  // Try bundled approach first, fallback to individual calls if 400 error
  try {

    // Use bundled search to get both clusters and listings in one request
    const bundledQuery = {
      queries: [
        {
          cluster: true,
          clusterPrecision: 8, // Low precision for bigger clusters
          clusterLimit: 50,
          status: "A"
        },
        {
          cluster: false,
          listings: true,
          pageSize: 500, // Get more listings for better center calculation
          status: "A"
        }
      ]
    };

    const response = await fetch("https://api.repliers.io/listings", {
      method: "POST",
      headers: {
        "REPLIERS-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bundledQuery),
    });

    if (response.status === 400) {
      return detectAutoCenterFallback(apiKey, method);
    }

    if (!response.ok) {
      throw new Error(
        `Bundled auto-center API Error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Extract clusters and listings from bundled response
    const clusterData = data[0] || {}; // First query result (clusters)
    const listingData = data[1] || {}; // Second query result (listings)

    const clusters = clusterData.aggregates?.map?.clusters || clusterData.clusters || [];
    const listings = listingData.listings || listingData.results || [];

    if (method === "city" && clusters.length > 0) {
      // Find the cluster with the most listings
      let largestCluster = null;
      let maxCount = 0;

      clusters.forEach((cluster: any) => {
        const count = cluster.count || 0;
        if (count > maxCount) {
          maxCount = count;
          largestCluster = cluster;
        }
      });

      if (largestCluster) {
        // Extract coordinates from the largest cluster
        const coordinates = [
          (largestCluster as any).location?.longitude ||
            (largestCluster as any).coordinates?.lng ||
            (largestCluster as any).longitude ||
            (largestCluster as any).center?.lng,
          (largestCluster as any).location?.latitude ||
            (largestCluster as any).coordinates?.lat ||
            (largestCluster as any).latitude ||
            (largestCluster as any).center?.lat,
        ];

        if (coordinates[0] && coordinates[1]) {
          const center: [number, number] = [coordinates[0], coordinates[1]];
          const autoCenter: AutoCenterData = { center };

          // Cache the result with method-specific key
          setCachedAutoCenter(`${apiKey}-${method}`, autoCenter);
          return autoCenter;
        }
      }

    }

    // Average method (or fallback)
    if (listings.length === 0) {
      return null;
    }

    // Extract coordinates from listings
    const coordinates: Coordinate[] = [];
    listings.forEach((listing: any) => {
      const coord = extractCoordinates(listing);
      if (coord) {
        coordinates.push(coord);
      }
    });

    if (coordinates.length === 0) {
      return null;
    }

    // Calculate bounds and center using average method
    const bounds = getPolygonBounds(coordinates);
    if (!bounds) {
      return null;
    }

    const center = calculateAverageCenter(coordinates, bounds);
    const autoCenter: AutoCenterData = { center };

    // Cache the result with method-specific key
    setCachedAutoCenter(`${apiKey}-${method}`, autoCenter);

    return autoCenter;
  } catch (error) {
    // Try fallback approach for non-400 errors too
    return detectAutoCenterFallback(apiKey, method);
  }
};

/**
 * Fallback auto-center detection using individual API calls
 */
const detectAutoCenterFallback = async (
  apiKey: string,
  method: "average" | "city" = "average"
): Promise<AutoCenterData | null> => {
  try {
    let clusters: any[] = [];
    let listings: any[] = [];

    // First, try to get clusters for city method
    if (method === "city") {
      try {
        const clusterUrl = new URL("https://api.repliers.io/listings");
        clusterUrl.searchParams.set("cluster", "true");
        clusterUrl.searchParams.set("clusterPrecision", "8");
        clusterUrl.searchParams.set("clusterLimit", "50");
        clusterUrl.searchParams.set("status", "A");

        const clusterResponse = await fetch(clusterUrl.toString(), {
          headers: {
            "REPLIERS-API-KEY": apiKey,
            "Content-Type": "application/json",
          },
        });

        if (clusterResponse.ok) {
          const clusterData = await clusterResponse.json();
          clusters = clusterData.aggregates?.map?.clusters || clusterData.clusters || [];
        }
      } catch (error) {
        // Cluster fetch failed in fallback
      }
    }

    // Get individual listings for average method or as fallback for city method
    try {
      const listingUrl = new URL("https://api.repliers.io/listings");
      listingUrl.searchParams.set("pageSize", "500");
      listingUrl.searchParams.set("status", "A");

      const listingResponse = await fetch(listingUrl.toString(), {
        headers: {
          "REPLIERS-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
      });

      if (listingResponse.ok) {
        const listingData = await listingResponse.json();
        listings = listingData.listings || listingData.results || [];
      }
    } catch (error) {
      // Listing fetch failed in fallback
    }

    // Process the same way as bundled approach
    if (method === "city" && clusters.length > 0) {
      // Find the cluster with the most listings
      let largestCluster = null;
      let maxCount = 0;

      clusters.forEach((cluster: any) => {
        const count = cluster.count || 0;
        if (count > maxCount) {
          maxCount = count;
          largestCluster = cluster;
        }
      });

      if (largestCluster) {
        // Extract coordinates from the largest cluster
        const coordinates = [
          (largestCluster as any).location?.longitude ||
            (largestCluster as any).coordinates?.lng ||
            (largestCluster as any).longitude ||
            (largestCluster as any).center?.lng,
          (largestCluster as any).location?.latitude ||
            (largestCluster as any).coordinates?.lat ||
            (largestCluster as any).latitude ||
            (largestCluster as any).center?.lat,
        ];

        if (coordinates[0] && coordinates[1]) {
          const center: [number, number] = [coordinates[0], coordinates[1]];
          const autoCenter: AutoCenterData = { center };

          // Cache the result with method-specific key
          setCachedAutoCenter(`${apiKey}-${method}`, autoCenter);
          return autoCenter;
        }
      }

    }

    // Average method (or fallback)
    if (listings.length === 0) {
      return null;
    }

    // Extract coordinates from listings
    const coordinates: Coordinate[] = [];
    listings.forEach((listing: any) => {
      const coord = extractCoordinates(listing);
      if (coord) {
        coordinates.push(coord);
      }
    });

    if (coordinates.length === 0) {
      return null;
    }

    // Calculate bounds and center using average method
    const bounds = getPolygonBounds(coordinates);
    if (!bounds) {
      return null;
    }

    const center = calculateAverageCenter(coordinates, bounds);
    const autoCenter: AutoCenterData = { center };

    // Cache the result with method-specific key
    setCachedAutoCenter(`${apiKey}-${method}`, autoCenter);

    return autoCenter;
  } catch (error) {
    return null;
  }
};


// Property Type Filter Component
interface PropertyTypeFilterProps {
  filters: MapFilters;
  onFiltersChange: (filters: MapFilters) => void;
  apiKey: string;
}

interface PriceRangeFilterProps {
  isOpen: boolean;
  initialMin: number;
  initialMax: number | null; // null represents "Max" (no limit)
  onApply: (min: number, max: number | null) => void;
  onCancel: () => void;
  priceBreakpoints?: number[]; // Optional custom breakpoints
}

function PropertyTypeFilter({ filters, onFiltersChange, apiKey }: PropertyTypeFilterProps) {
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch available property types on mount
  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        const url = new URL("https://api.repliers.io/listings");
        url.searchParams.set("aggregates", "details.propertyType");
        url.searchParams.set("listings", "false");
        url.searchParams.set("status", "A");

        const response = await fetch(url.toString(), {
          headers: {
            "REPLIERS-API-KEY": apiKey,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch property types: ${response.status}`);
        }

        const data = await response.json();
        const propertyTypeData = data.aggregates?.details?.propertyType || {};

        // Extract property type names and sort by count (descending)
        const sortedPropertyTypes = Object.entries(propertyTypeData)
          .sort(([, a], [, b]) => (b as number) - (a as number))
          .map(([propertyType]) => propertyType);

        setPropertyTypes(sortedPropertyTypes);
      } catch (error) {
        // Silently handle property type fetch errors
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyTypes();
  }, [apiKey]);

  const handlePropertyTypeToggle = (propertyType: string) => {
    const isSelected = filters.propertyTypes.includes(propertyType);
    const newPropertyTypes = isSelected
      ? filters.propertyTypes.filter(type => type !== propertyType)
      : [...filters.propertyTypes, propertyType];

    onFiltersChange({
      ...filters,
      propertyTypes: newPropertyTypes,
    });
  };

  const handleAllToggle = () => {
    const allSelected = filters.propertyTypes.length === propertyTypes.length;
    onFiltersChange({
      ...filters,
      propertyTypes: allSelected ? [] : [...propertyTypes],
    });
  };

  if (loading) {
    return (
      <div style={{ position: "relative", marginBottom: "12px" }}>
        <div style={{
          padding: "8px 12px",
          fontSize: "12px",
          color: "#6b7280",
          fontStyle: "italic"
        }}>
          Loading property types...
        </div>
      </div>
    );
  }

  const allSelected = filters.propertyTypes.length === 0 || filters.propertyTypes.length === propertyTypes.length;
  const someSelected = filters.propertyTypes.length > 0 && filters.propertyTypes.length < propertyTypes.length;

  return (
    <div style={{ position: "relative", marginBottom: "12px" }}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        style={{
          width: "100%",
          padding: "8px 12px",
          backgroundColor: "white",
          border: "1px solid #d1d5db",
          borderRadius: "6px",
          fontSize: "14px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          textAlign: "left",
        }}
      >
        <span>
          {allSelected
            ? "All property types"
            : someSelected
            ? `${filters.propertyTypes.length} selected`
            : "Select property types"}
        </span>
        <ChevronDown
          size={16}
          style={{
            transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s"
          }}
        />
      </button>

      {isDropdownOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "white",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            marginTop: "4px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            zIndex: 1002,
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          {/* All property types option */}
          <div
            onClick={handleAllToggle}
            style={{
              padding: "8px 12px",
              fontSize: "14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: allSelected ? "#f3f4f6" : "white",
              borderBottom: "1px solid #f3f4f6",
            }}
            onMouseEnter={(e) => {
              if (!allSelected) {
                e.currentTarget.style.backgroundColor = "#f9fafb";
              }
            }}
            onMouseLeave={(e) => {
              if (!allSelected) {
                e.currentTarget.style.backgroundColor = "white";
              }
            }}
          >
            <div style={{
              width: "16px",
              height: "16px",
              border: "2px solid #d1d5db",
              borderRadius: "3px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: allSelected ? "#10b981" : "white",
              borderColor: allSelected ? "#10b981" : "#d1d5db",
            }}>
              {allSelected && (
                <svg
                  width="10"
                  height="8"
                  viewBox="0 0 10 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.5 1L3.5 6L1.5 4"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            All property types
          </div>

          {/* Individual property type options */}
          {propertyTypes.map((propertyType) => {
            const isSelected = filters.propertyTypes.includes(propertyType);
            return (
              <div
                key={propertyType}
                onClick={() => handlePropertyTypeToggle(propertyType)}
                style={{
                  padding: "8px 12px",
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: isSelected ? "#f3f4f6" : "white",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = "#f9fafb";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = "white";
                  }
                }}
              >
                <div style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid #d1d5db",
                  borderRadius: "3px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: isSelected ? "#10b981" : "white",
                  borderColor: isSelected ? "#10b981" : "#d1d5db",
                }}>
                  {isSelected && (
                    <svg
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.5 1L3.5 6L1.5 4"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                {propertyType}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Price Range Filter Component
function PriceRangeFilter({
  isOpen,
  initialMin,
  initialMax,
  onApply,
  onCancel,
  priceBreakpoints = [0, 500000, 1000000, 2000000, 4000000, Infinity]
}: PriceRangeFilterProps) {
  const [tempMinPrice, setTempMinPrice] = useState(initialMin);
  const [tempMaxPrice, setTempMaxPrice] = useState(initialMax);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Reset temp values when modal opens/closes or initial values change
  useEffect(() => {
    setTempMinPrice(initialMin);
    setTempMaxPrice(initialMax);
  }, [isOpen, initialMin, initialMax]);

  // Format price for display
  const formatDisplayPrice = useCallback((price: number | null): string => {
    if (price === null || price === Infinity) return "Max";
    if (price === 0) return "$0";
    if (price >= 1000000) {
      const millions = price / 1000000;
      return millions >= 10 ? `$${Math.round(millions)}M` : `$${Math.round(millions * 10) / 10}M`;
    }
    if (price >= 1000) {
      const thousands = price / 1000;
      return `$${Math.round(thousands)}K`;
    }
    return `$${Math.round(price)}`;
  }, []);

  // Get slider position as percentage
  const getSliderPosition = useCallback((price: number | null): number => {
    if (price === null || price === Infinity) return 100;

    const maxFinitePrice = priceBreakpoints[priceBreakpoints.length - 2];
    if (price >= maxFinitePrice) return 100;
    if (price <= 0) return 0;

    // Find position between breakpoints
    for (let i = 0; i < priceBreakpoints.length - 1; i++) {
      const current = priceBreakpoints[i];
      const next = priceBreakpoints[i + 1];

      if (price >= current && price <= next) {
        const segmentSize = 100 / (priceBreakpoints.length - 1);
        const segmentStart = i * segmentSize;
        const progressInSegment = next === Infinity ? 0 : (price - current) / (next - current);
        return segmentStart + (progressInSegment * segmentSize);
      }
    }

    return 0;
  }, [priceBreakpoints]);

  // Get price from slider position
  const getPriceFromPosition = useCallback((position: number): number | null => {
    if (position >= 100) return null; // Max
    if (position <= 0) return 0;

    const segmentSize = 100 / (priceBreakpoints.length - 1);
    const segmentIndex = Math.floor(position / segmentSize);
    const progressInSegment = (position % segmentSize) / segmentSize;

    if (segmentIndex >= priceBreakpoints.length - 2) return null;

    const current = priceBreakpoints[segmentIndex];
    const next = priceBreakpoints[segmentIndex + 1];

    if (next === Infinity) return null;

    return Math.round(current + (progressInSegment * (next - current)));
  }, [priceBreakpoints]);

  // Handle mouse events for dragging
  const handleMouseDown = useCallback((handle: 'min' | 'max') => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(handle);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const position = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const newPrice = getPriceFromPosition(position);

    if (isDragging === 'min') {
      const maxValue = tempMaxPrice === null ? Infinity : tempMaxPrice;
      const constrainedPrice = newPrice === null ? maxValue : Math.min(newPrice, maxValue);
      setTempMinPrice(constrainedPrice === Infinity ? 0 : constrainedPrice);
    } else if (isDragging === 'max') {
      const constrainedPrice = newPrice === null ? null : Math.max(newPrice, tempMinPrice);
      setTempMaxPrice(constrainedPrice);
    }
  }, [isDragging, tempMinPrice, tempMaxPrice, getPriceFromPosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  // Add/remove global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Handle keyboard events for accessibility
  const handleKeyDown = useCallback((handle: 'min' | 'max') => (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const direction = e.key === 'ArrowLeft' ? -1 : 1;
      const currentPrice = handle === 'min' ? tempMinPrice : tempMaxPrice;
      const currentPos = getSliderPosition(currentPrice);
      const newPos = Math.max(0, Math.min(100, currentPos + (direction * 2)));
      const newPrice = getPriceFromPosition(newPos);

      if (handle === 'min') {
        const maxValue = tempMaxPrice === null ? Infinity : tempMaxPrice;
        const constrainedPrice = newPrice === null ? maxValue : Math.min(newPrice, maxValue);
        setTempMinPrice(constrainedPrice === Infinity ? 0 : constrainedPrice);
      } else {
        const constrainedPrice = newPrice === null ? null : Math.max(newPrice || 0, tempMinPrice);
        setTempMaxPrice(constrainedPrice);
      }
    }
  }, [tempMinPrice, tempMaxPrice, getSliderPosition, getPriceFromPosition]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const minPosition = getSliderPosition(tempMinPrice);
  const maxPosition = getSliderPosition(tempMaxPrice);

  return (
    <div
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        width: "400px", // Fixed width instead of constrained by parent
        backgroundColor: "white",
        border: "1px solid #d1d5db",
        borderRadius: "6px",
        marginTop: "4px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        zIndex: 1002,
        padding: "20px",
      }}
    >
      {/* Current Selection Display */}
      <div style={{
        textAlign: 'center',
        fontSize: '16px',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '20px',
      }}>
        {formatDisplayPrice(tempMinPrice)} - {formatDisplayPrice(tempMaxPrice)}
      </div>

      {/* Slider Container */}
      <div style={{ marginBottom: '20px' }}>
        <div
          ref={sliderRef}
          style={{
            position: 'relative',
            height: '8px',
            backgroundColor: '#e5e7eb',
            borderRadius: '4px',
            marginBottom: '16px',
          }}
        >
          {/* Active Range */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: `${minPosition}%`,
              width: `${maxPosition - minPosition}%`,
              height: '100%',
              backgroundColor: '#3b82f6',
              borderRadius: '4px',
            }}
          />

          {/* Min Handle */}
          <div
            style={{
              position: 'absolute',
              left: `${minPosition}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '20px',
              height: '20px',
              backgroundColor: 'white',
              border: '2px solid #3b82f6',
              borderRadius: '50%',
              cursor: isDragging === 'min' ? 'grabbing' : 'grab',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
            onMouseDown={handleMouseDown('min')}
            onKeyDown={handleKeyDown('min')}
            tabIndex={0}
            role="slider"
            aria-label="Minimum price"
            aria-valuemin={0}
            aria-valuemax={tempMaxPrice === null ? priceBreakpoints[priceBreakpoints.length - 2] : tempMaxPrice}
            aria-valuenow={tempMinPrice}
            aria-valuetext={formatDisplayPrice(tempMinPrice)}
          />

          {/* Max Handle */}
          <div
            style={{
              position: 'absolute',
              left: `${maxPosition}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '20px',
              height: '20px',
              backgroundColor: 'white',
              border: '2px solid #3b82f6',
              borderRadius: '50%',
              cursor: isDragging === 'max' ? 'grabbing' : 'grab',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
            onMouseDown={handleMouseDown('max')}
            onKeyDown={handleKeyDown('max')}
            tabIndex={0}
            role="slider"
            aria-label="Maximum price"
            aria-valuemin={tempMinPrice}
            aria-valuemax={priceBreakpoints[priceBreakpoints.length - 2]}
            aria-valuenow={tempMaxPrice === null ? priceBreakpoints[priceBreakpoints.length - 2] : tempMaxPrice}
            aria-valuetext={formatDisplayPrice(tempMaxPrice)}
          />
        </div>

        {/* Price Markers */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#6b7280',
        }}>
          {priceBreakpoints.slice(0, -1).map((price, index) => (
            <span key={index}>
              {formatDisplayPrice(price)}
            </span>
          ))}
          <span>Max</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end',
      }}>
        <button
          onClick={onCancel}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => onApply(tempMinPrice, tempMaxPrice)}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: '500',
            color: 'white',
            backgroundColor: '#3b82f6',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );
}

// Square Footage Filter Component
interface SquareFootageFilterProps {
  isOpen: boolean;
  initialMin: number;
  initialMax: number | null; // null represents "Max" (no limit)
  onApply: (min: number, max: number | null) => void;
  onCancel: () => void;
  sqftBreakpoints?: number[]; // Optional custom breakpoints
}

function SquareFootageFilter({
  isOpen,
  initialMin,
  initialMax,
  onApply,
  onCancel,
  sqftBreakpoints = [0, 1000, 2000, 3000, 5000, Infinity]
}: SquareFootageFilterProps) {
  const [tempMinSqft, setTempMinSqft] = useState(initialMin);
  const [tempMaxSqft, setTempMaxSqft] = useState(initialMax);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Reset temp values when modal opens/closes or initial values change
  useEffect(() => {
    setTempMinSqft(initialMin);
    setTempMaxSqft(initialMax);
  }, [isOpen, initialMin, initialMax]);

  // Format sqft for display
  const formatDisplaySqft = useCallback((sqft: number | null): string => {
    if (sqft === null || sqft === Infinity) return "Max";
    if (sqft === 0) return "0";
    if (sqft >= 1000) {
      const thousands = sqft / 1000;
      return `${Math.round(thousands * 10) / 10}K`;
    }
    return `${Math.round(sqft)}`;
  }, []);

  // Get slider position as percentage
  const getSliderPosition = useCallback((sqft: number | null): number => {
    if (sqft === null || sqft === Infinity) return 100;

    const maxFiniteSqft = sqftBreakpoints[sqftBreakpoints.length - 2];
    if (sqft >= maxFiniteSqft) return 100;
    if (sqft <= 0) return 0;

    // Find position between breakpoints
    for (let i = 0; i < sqftBreakpoints.length - 1; i++) {
      const current = sqftBreakpoints[i];
      const next = sqftBreakpoints[i + 1];

      if (sqft >= current && sqft <= next) {
        const segmentSize = 100 / (sqftBreakpoints.length - 1);
        const segmentStart = i * segmentSize;
        const progressInSegment = next === Infinity ? 0 : (sqft - current) / (next - current);
        return segmentStart + (progressInSegment * segmentSize);
      }
    }

    return 0;
  }, [sqftBreakpoints]);

  // Get sqft from slider position
  const getSqftFromPosition = useCallback((position: number): number | null => {
    if (position >= 100) return null; // Max
    if (position <= 0) return 0;

    const segmentSize = 100 / (sqftBreakpoints.length - 1);
    const segmentIndex = Math.floor(position / segmentSize);
    const progressInSegment = (position % segmentSize) / segmentSize;

    if (segmentIndex >= sqftBreakpoints.length - 2) return null;

    const current = sqftBreakpoints[segmentIndex];
    const next = sqftBreakpoints[segmentIndex + 1];

    if (next === Infinity) return null;

    return Math.round(current + (progressInSegment * (next - current)));
  }, [sqftBreakpoints]);

  // Handle mouse events for dragging
  const handleMouseDown = useCallback((handle: 'min' | 'max') => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(handle);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const position = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const newSqft = getSqftFromPosition(position);

    if (isDragging === 'min') {
      const maxValue = tempMaxSqft === null ? Infinity : tempMaxSqft;
      const constrainedSqft = newSqft === null ? maxValue : Math.min(newSqft, maxValue);
      setTempMinSqft(constrainedSqft === Infinity ? 0 : constrainedSqft);
    } else if (isDragging === 'max') {
      const constrainedSqft = newSqft === null ? null : Math.max(newSqft, tempMinSqft);
      setTempMaxSqft(constrainedSqft);
    }
  }, [isDragging, tempMinSqft, tempMaxSqft, getSqftFromPosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  // Add/remove global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Handle keyboard events for accessibility
  const handleKeyDown = useCallback((handle: 'min' | 'max') => (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const direction = e.key === 'ArrowLeft' ? -1 : 1;
      const currentSqft = handle === 'min' ? tempMinSqft : tempMaxSqft;
      const currentPos = getSliderPosition(currentSqft);
      const newPos = Math.max(0, Math.min(100, currentPos + (direction * 2)));
      const newSqft = getSqftFromPosition(newPos);

      if (handle === 'min') {
        const maxValue = tempMaxSqft === null ? Infinity : tempMaxSqft;
        const constrainedSqft = newSqft === null ? maxValue : Math.min(newSqft, maxValue);
        setTempMinSqft(constrainedSqft === Infinity ? 0 : constrainedSqft);
      } else {
        const constrainedSqft = newSqft === null ? null : Math.max(newSqft || 0, tempMinSqft);
        setTempMaxSqft(constrainedSqft);
      }
    }
  }, [tempMinSqft, tempMaxSqft, getSliderPosition, getSqftFromPosition]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const minPosition = getSliderPosition(tempMinSqft);
  const maxPosition = getSliderPosition(tempMaxSqft);

  return (
    <div
      style={{
        marginTop: "16px",
        padding: "16px",
        backgroundColor: "#f9fafb",
        borderRadius: "6px",
        border: "1px solid #e5e7eb",
      }}
    >
      {/* Current Selection Display */}
      <div style={{
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '16px',
      }}>
        {formatDisplaySqft(tempMinSqft)} - {formatDisplaySqft(tempMaxSqft)} sq ft
      </div>

      {/* Slider Container */}
      <div style={{ marginBottom: '16px' }}>
        <div
          ref={sliderRef}
          style={{
            position: 'relative',
            height: '6px',
            backgroundColor: '#e5e7eb',
            borderRadius: '3px',
            marginBottom: '12px',
          }}
        >
          {/* Active Range */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: `${minPosition}%`,
              width: `${maxPosition - minPosition}%`,
              height: '100%',
              backgroundColor: '#3b82f6',
              borderRadius: '3px',
            }}
          />

          {/* Min Handle */}
          <div
            style={{
              position: 'absolute',
              left: `${minPosition}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '18px',
              height: '18px',
              backgroundColor: 'white',
              border: '2px solid #3b82f6',
              borderRadius: '50%',
              cursor: isDragging === 'min' ? 'grabbing' : 'grab',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
            onMouseDown={handleMouseDown('min')}
            onKeyDown={handleKeyDown('min')}
            tabIndex={0}
            role="slider"
            aria-label="Minimum square footage"
            aria-valuemin={0}
            aria-valuemax={tempMaxSqft === null ? sqftBreakpoints[sqftBreakpoints.length - 2] : tempMaxSqft}
            aria-valuenow={tempMinSqft}
            aria-valuetext={formatDisplaySqft(tempMinSqft)}
          />

          {/* Max Handle */}
          <div
            style={{
              position: 'absolute',
              left: `${maxPosition}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '18px',
              height: '18px',
              backgroundColor: 'white',
              border: '2px solid #3b82f6',
              borderRadius: '50%',
              cursor: isDragging === 'max' ? 'grabbing' : 'grab',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
            onMouseDown={handleMouseDown('max')}
            onKeyDown={handleKeyDown('max')}
            tabIndex={0}
            role="slider"
            aria-label="Maximum square footage"
            aria-valuemin={tempMinSqft}
            aria-valuemax={sqftBreakpoints[sqftBreakpoints.length - 2]}
            aria-valuenow={tempMaxSqft === null ? sqftBreakpoints[sqftBreakpoints.length - 2] : tempMaxSqft}
            aria-valuetext={formatDisplaySqft(tempMaxSqft)}
          />
        </div>

        {/* Sqft Markers */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: '#6b7280',
        }}>
          {sqftBreakpoints.slice(0, -1).map((sqft, index) => (
            <span key={index}>
              {formatDisplaySqft(sqft)}
            </span>
          ))}
          <span>Max</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '8px',
        justifyContent: 'flex-end',
      }}>
        <button
          onClick={onCancel}
          style={{
            padding: '6px 12px',
            fontSize: '13px',
            fontWeight: '500',
            color: '#374151',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => onApply(tempMinSqft, tempMaxSqft)}
          style={{
            padding: '6px 12px',
            fontSize: '13px',
            fontWeight: '500',
            color: 'white',
            backgroundColor: '#3b82f6',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );
}

// Maintenance Fee Filter Component
interface MaintenanceFeeFilterProps {
  isOpen: boolean;
  initialMin: number;
  initialMax: number | null;
  onApply: (min: number, max: number | null) => void;
  onCancel: () => void;
  feeBreakpoints?: number[];
}

function MaintenanceFeeFilter({
  isOpen,
  initialMin,
  initialMax,
  onApply,
  onCancel,
  feeBreakpoints = [0, 200, 400, 600, 1000, Infinity]
}: MaintenanceFeeFilterProps) {
  const [tempMinFee, setTempMinFee] = useState(initialMin);
  const [tempMaxFee, setTempMaxFee] = useState(initialMax);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTempMinFee(initialMin);
    setTempMaxFee(initialMax);
  }, [isOpen, initialMin, initialMax]);

  const formatDisplayFee = useCallback((fee: number | null): string => {
    if (fee === null || fee === Infinity) return "Max";
    if (fee === 0) return "$0";
    return `$${Math.round(fee)}`;
  }, []);

  const getSliderPosition = useCallback((fee: number | null): number => {
    if (fee === null || fee === Infinity) return 100;
    const maxFiniteFee = feeBreakpoints[feeBreakpoints.length - 2];
    if (fee >= maxFiniteFee) return 100;
    if (fee <= 0) return 0;

    for (let i = 0; i < feeBreakpoints.length - 1; i++) {
      const current = feeBreakpoints[i];
      const next = feeBreakpoints[i + 1];
      if (fee >= current && fee <= next) {
        const segmentSize = 100 / (feeBreakpoints.length - 1);
        const segmentStart = i * segmentSize;
        const progressInSegment = next === Infinity ? 0 : (fee - current) / (next - current);
        return segmentStart + (progressInSegment * segmentSize);
      }
    }
    return 0;
  }, [feeBreakpoints]);

  const getFeeFromPosition = useCallback((position: number): number | null => {
    if (position >= 100) return null;
    if (position <= 0) return 0;

    const segmentSize = 100 / (feeBreakpoints.length - 1);
    const segmentIndex = Math.floor(position / segmentSize);
    const progressInSegment = (position % segmentSize) / segmentSize;

    if (segmentIndex >= feeBreakpoints.length - 2) return null;

    const current = feeBreakpoints[segmentIndex];
    const next = feeBreakpoints[segmentIndex + 1];

    if (next === Infinity) return null;

    return Math.round(current + (progressInSegment * (next - current)));
  }, [feeBreakpoints]);

  const handleMouseDown = useCallback((handle: 'min' | 'max') => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(handle);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const position = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const newFee = getFeeFromPosition(position);

    if (isDragging === 'min') {
      const maxValue = tempMaxFee === null ? Infinity : tempMaxFee;
      const constrainedFee = newFee === null ? maxValue : Math.min(newFee, maxValue);
      setTempMinFee(constrainedFee === Infinity ? 0 : constrainedFee);
    } else if (isDragging === 'max') {
      const constrainedFee = newFee === null ? null : Math.max(newFee, tempMinFee);
      setTempMaxFee(constrainedFee);
    }
  }, [isDragging, tempMinFee, tempMaxFee, getFeeFromPosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleKeyDown = useCallback((handle: 'min' | 'max') => (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const direction = e.key === 'ArrowLeft' ? -1 : 1;
      const currentFee = handle === 'min' ? tempMinFee : tempMaxFee;
      const currentPos = getSliderPosition(currentFee);
      const newPos = Math.max(0, Math.min(100, currentPos + (direction * 2)));
      const newFee = getFeeFromPosition(newPos);

      if (handle === 'min') {
        const maxValue = tempMaxFee === null ? Infinity : tempMaxFee;
        const constrainedFee = newFee === null ? maxValue : Math.min(newFee, maxValue);
        setTempMinFee(constrainedFee === Infinity ? 0 : constrainedFee);
      } else {
        const constrainedFee = newFee === null ? null : Math.max(newFee || 0, tempMinFee);
        setTempMaxFee(constrainedFee);
      }
    }
  }, [tempMinFee, tempMaxFee, getSliderPosition, getFeeFromPosition]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const minPosition = getSliderPosition(tempMinFee);
  const maxPosition = getSliderPosition(tempMaxFee);

  return (
    <div
      style={{
        marginTop: "16px",
        padding: "16px",
        backgroundColor: "#f9fafb",
        borderRadius: "6px",
        border: "1px solid #e5e7eb",
      }}
    >
      <div style={{
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '16px',
      }}>
        {formatDisplayFee(tempMinFee)} - {formatDisplayFee(tempMaxFee)} /month
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div
          ref={sliderRef}
          style={{
            position: 'relative',
            height: '6px',
            backgroundColor: '#e5e7eb',
            borderRadius: '3px',
            marginBottom: '12px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: `${minPosition}%`,
              width: `${maxPosition - minPosition}%`,
              height: '100%',
              backgroundColor: '#3b82f6',
              borderRadius: '3px',
            }}
          />

          <div
            style={{
              position: 'absolute',
              left: `${minPosition}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '18px',
              height: '18px',
              backgroundColor: 'white',
              border: '2px solid #3b82f6',
              borderRadius: '50%',
              cursor: isDragging === 'min' ? 'grabbing' : 'grab',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
            onMouseDown={handleMouseDown('min')}
            onKeyDown={handleKeyDown('min')}
            tabIndex={0}
            role="slider"
            aria-label="Minimum maintenance fee"
            aria-valuemin={0}
            aria-valuemax={tempMaxFee === null ? feeBreakpoints[feeBreakpoints.length - 2] : tempMaxFee}
            aria-valuenow={tempMinFee}
            aria-valuetext={formatDisplayFee(tempMinFee)}
          />

          <div
            style={{
              position: 'absolute',
              left: `${maxPosition}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '18px',
              height: '18px',
              backgroundColor: 'white',
              border: '2px solid #3b82f6',
              borderRadius: '50%',
              cursor: isDragging === 'max' ? 'grabbing' : 'grab',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
            onMouseDown={handleMouseDown('max')}
            onKeyDown={handleKeyDown('max')}
            tabIndex={0}
            role="slider"
            aria-label="Maximum maintenance fee"
            aria-valuemin={tempMinFee}
            aria-valuemax={feeBreakpoints[feeBreakpoints.length - 2]}
            aria-valuenow={tempMaxFee === null ? feeBreakpoints[feeBreakpoints.length - 2] : tempMaxFee}
            aria-valuetext={formatDisplayFee(tempMaxFee)}
          />
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: '#6b7280',
        }}>
          {feeBreakpoints.slice(0, -1).map((fee, index) => (
            <span key={index}>
              {formatDisplayFee(fee)}
            </span>
          ))}
          <span>Max</span>
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: '8px',
        justifyContent: 'flex-end',
      }}>
        <button
          onClick={onCancel}
          style={{
            padding: '6px 12px',
            fontSize: '13px',
            fontWeight: '500',
            color: '#374151',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => onApply(tempMinFee, tempMaxFee)}
          style={{
            padding: '6px 12px',
            fontSize: '13px',
            fontWeight: '500',
            color: 'white',
            backgroundColor: '#3b82f6',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );
}

// Filter Panel Component
interface FilterPanelProps {
  filters: MapFilters;
  onFiltersChange: (filters: MapFilters) => void;
  apiKey: string;
}

function FilterPanel({ filters, onFiltersChange, apiKey }: FilterPanelProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPriceFilterOpen, setIsPriceFilterOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isSqftFilterOpen, setIsSqftFilterOpen] = useState(false);
  const priceFilterRef = useRef<HTMLDivElement>(null);
  const moreFiltersRef = useRef<HTMLDivElement>(null);

  const listingTypeOptions = [
    { value: "all", label: "All" },
    { value: "sale", label: "For Sale" },
    { value: "lease", label: "For Lease" },
  ] as const;

  const handleListingTypeChange = (value: "all" | "sale" | "lease") => {
    onFiltersChange({
      ...filters,
      listingType: value,
    });
    setIsDropdownOpen(false);
  };

  const handlePriceFilterApply = (minPrice: number, maxPrice: number | null) => {
    onFiltersChange({
      ...filters,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
    });
    setIsPriceFilterOpen(false);
  };

  const handlePriceFilterCancel = () => {
    setIsPriceFilterOpen(false);
  };

  const handleSqftFilterApply = (minSqft: number, maxSqft: number | null) => {
    onFiltersChange({
      ...filters,
      minSqft: minSqft || undefined,
      maxSqft: maxSqft || undefined,
    });
    setIsSqftFilterOpen(false);
  };

  const handleSqftFilterCancel = () => {
    setIsSqftFilterOpen(false);
  };

  // Format price display for button
  const formatPriceRange = () => {
    const hasMinPrice = filters.minPrice && filters.minPrice > 0;
    const hasMaxPrice = filters.maxPrice && filters.maxPrice !== null;

    if (!hasMinPrice && !hasMaxPrice) return "Price";

    const formatPrice = (price: number) => {
      if (price >= 1000000) {
        const millions = price / 1000000;
        return `$${millions >= 10 ? Math.round(millions) : Math.round(millions * 10) / 10}M`;
      }
      if (price >= 1000) {
        return `$${Math.round(price / 1000)}K`;
      }
      return `$${price}`;
    };

    const minText = hasMinPrice ? formatPrice(filters.minPrice!) : "$0";
    const maxText = hasMaxPrice ? formatPrice(filters.maxPrice!) : "Max";

    return `${minText} - ${maxText}`;
  };

  const selectedOption = listingTypeOptions.find(option => option.value === filters.listingType);

  // Handle click outside to close price filter dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (priceFilterRef.current && !priceFilterRef.current.contains(event.target as Node)) {
        setIsPriceFilterOpen(false);
      }
    };

    if (isPriceFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isPriceFilterOpen]);

  // Handle click outside to close more filters dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreFiltersRef.current && !moreFiltersRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };

    if (isMoreOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMoreOpen]);

  return (
    <div
      style={{
        position: "absolute",
        top: "16px",
        left: "60px", // Position to the right of zoom controls
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        padding: "12px",
        fontSize: "14px",
        fontWeight: "500",
        color: "#374151",
        zIndex: 1000,
        minWidth: "200px",
      }}
    >
      <div style={{ marginBottom: "8px", fontSize: "12px", fontWeight: "600", color: "#6b7280" }}>
        FILTERS
      </div>

      {/* Listing Type Dropdown */}
      <div style={{ position: "relative", marginBottom: "12px" }}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          style={{
            width: "100%",
            padding: "8px 12px",
            backgroundColor: "white",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{selectedOption?.label}</span>
          <ChevronDown
            size={16}
            style={{
              transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s"
            }}
          />
        </button>

        {isDropdownOpen && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              backgroundColor: "white",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              marginTop: "4px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              zIndex: 1001,
            }}
          >
            {listingTypeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleListingTypeChange(option.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  backgroundColor: filters.listingType === option.value ? "#f3f4f6" : "white",
                  border: "none",
                  fontSize: "14px",
                  cursor: "pointer",
                  textAlign: "left",
                  borderRadius: option === listingTypeOptions[0] ? "6px 6px 0 0" :
                            option === listingTypeOptions[listingTypeOptions.length - 1] ? "0 0 6px 6px" : "0",
                }}
                onMouseEnter={(e) => {
                  if (filters.listingType !== option.value) {
                    e.currentTarget.style.backgroundColor = "#f9fafb";
                  }
                }}
                onMouseLeave={(e) => {
                  if (filters.listingType !== option.value) {
                    e.currentTarget.style.backgroundColor = "white";
                  }
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Property Type Filter */}
      <PropertyTypeFilter
        filters={filters}
        onFiltersChange={onFiltersChange}
        apiKey={apiKey}
      />

      {/* Price Filter Button */}
      <div ref={priceFilterRef} style={{ position: "relative", marginBottom: "12px" }}>
        <button
          onClick={() => setIsPriceFilterOpen(!isPriceFilterOpen)}
          style={{
            width: "100%",
            padding: "8px 12px",
            backgroundColor: (filters.minPrice || filters.maxPrice) ? "#f3f4f6" : "white",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            textAlign: "left",
            color: (filters.minPrice || filters.maxPrice) ? "#1f2937" : "#374151",
            fontWeight: (filters.minPrice || filters.maxPrice) ? "500" : "400",
          }}
        >
          <span>{formatPriceRange()}</span>
          <ChevronDown
            size={16}
            style={{
              transform: isPriceFilterOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s"
            }}
          />
        </button>

        {/* Price Range Filter Dropdown */}
        {isPriceFilterOpen && (
          <PriceRangeFilter
            isOpen={isPriceFilterOpen}
            initialMin={filters.minPrice || 0}
            initialMax={filters.maxPrice || null}
            onApply={handlePriceFilterApply}
            onCancel={handlePriceFilterCancel}
          />
        )}
      </div>

      {/* More Filters Button */}
      <div ref={moreFiltersRef} style={{ position: "relative", marginBottom: "12px" }}>
        <button
          onClick={() => setIsMoreOpen(!isMoreOpen)}
          style={{
            width: "100%",
            padding: "8px 12px",
            backgroundColor: (filters.bedrooms !== "all" || filters.bathrooms !== "all" || filters.garageSpaces !== "all" || filters.minSqft || filters.maxSqft || (filters.openHouse && filters.openHouse !== "all") || filters.maxMaintenanceFee) ? "#f3f4f6" : "white",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            textAlign: "left",
            color: "#374151",
            fontWeight: (filters.bedrooms !== "all" || filters.bathrooms !== "all" || filters.garageSpaces !== "all" || filters.minSqft || filters.maxSqft || (filters.openHouse && filters.openHouse !== "all") || filters.maxMaintenanceFee) ? "500" : "400",
          }}
        >
          <span>More Filters</span>
          <ChevronDown
            size={16}
            style={{
              transform: isMoreOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s"
            }}
          />
        </button>

        {/* More Filters Dropdown */}
        {isMoreOpen && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              width: "400px",
              backgroundColor: "white",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              marginTop: "4px",
              padding: "20px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              zIndex: 1001,
            }}
          >
            {/* Bedrooms Filter */}
            <div>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#6b7280", marginBottom: "8px" }}>
                BEDROOMS
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["all", "0", "1", "2", "3", "4", "5+"].map((value) => (
                  <button
                    key={value}
                    onClick={() => onFiltersChange({ ...filters, bedrooms: value as any })}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: filters.bedrooms === value ? "#3b82f6" : "white",
                      color: filters.bedrooms === value ? "white" : "#374151",
                      border: `1px solid ${filters.bedrooms === value ? "#3b82f6" : "#d1d5db"}`,
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: filters.bedrooms === value ? "600" : "400",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (filters.bedrooms !== value) {
                        e.currentTarget.style.backgroundColor = "#f3f4f6";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.bedrooms !== value) {
                        e.currentTarget.style.backgroundColor = "white";
                      }
                    }}
                  >
                    {value === "all" ? "All" : value}
                  </button>
                ))}
              </div>
            </div>

            {/* Bathrooms Filter */}
            <div>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#6b7280", marginBottom: "8px" }}>
                BATHROOMS
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["all", "1+", "2+", "3+", "4+", "5+"].map((value) => (
                  <button
                    key={value}
                    onClick={() => onFiltersChange({ ...filters, bathrooms: value as any })}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: filters.bathrooms === value ? "#3b82f6" : "white",
                      color: filters.bathrooms === value ? "white" : "#374151",
                      border: `1px solid ${filters.bathrooms === value ? "#3b82f6" : "#d1d5db"}`,
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: filters.bathrooms === value ? "600" : "400",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (filters.bathrooms !== value) {
                        e.currentTarget.style.backgroundColor = "#f3f4f6";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.bathrooms !== value) {
                        e.currentTarget.style.backgroundColor = "white";
                      }
                    }}
                  >
                    {value === "all" ? "All" : value}
                  </button>
                ))}
              </div>
            </div>

            {/* Garage/Parking Filter */}
            <div>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#6b7280", marginBottom: "8px" }}>
                GARAGE / PARKING
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["all", "1+", "2+", "3+", "4+", "5+"].map((value) => (
                  <button
                    key={value}
                    onClick={() => onFiltersChange({ ...filters, garageSpaces: value as any })}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: filters.garageSpaces === value ? "#3b82f6" : "white",
                      color: filters.garageSpaces === value ? "white" : "#374151",
                      border: `1px solid ${filters.garageSpaces === value ? "#3b82f6" : "#d1d5db"}`,
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: filters.garageSpaces === value ? "600" : "400",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (filters.garageSpaces !== value) {
                        e.currentTarget.style.backgroundColor = "#f3f4f6";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.garageSpaces !== value) {
                        e.currentTarget.style.backgroundColor = "white";
                      }
                    }}
                  >
                    {value === "all" ? "All" : value}
                  </button>
                ))}
              </div>
            </div>

            {/* Square Footage Filter */}
            <div>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#6b7280", marginBottom: "8px" }}>
                SQUARE FOOTAGE
              </div>
              <SquareFootageFilter
                isOpen={true}
                initialMin={filters.minSqft || 0}
                initialMax={filters.maxSqft || null}
                onApply={handleSqftFilterApply}
                onCancel={handleSqftFilterCancel}
              />
            </div>

            {/* Open House Filter */}
            <div>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#6b7280", marginBottom: "8px" }}>
                OPEN HOUSE
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {[
                  { value: "all", label: "All" },
                  { value: "today", label: "Today" },
                  { value: "thisWeekend", label: "This Weekend" },
                  { value: "thisWeek", label: "This Week" },
                  { value: "anytime", label: "Anytime" }
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => onFiltersChange({ ...filters, openHouse: value as any })}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: filters.openHouse === value ? "#3b82f6" : "white",
                      color: filters.openHouse === value ? "white" : "#374151",
                      border: `1px solid ${filters.openHouse === value ? "#3b82f6" : "#d1d5db"}`,
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: filters.openHouse === value ? "600" : "400",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (filters.openHouse !== value) {
                        e.currentTarget.style.backgroundColor = "#f3f4f6";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filters.openHouse !== value) {
                        e.currentTarget.style.backgroundColor = "white";
                      }
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Maintenance Fee Filter */}
            <div>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#6b7280", marginBottom: "8px" }}>
                MAX MAINTENANCE FEE
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  type="number"
                  placeholder="Enter max fee"
                  value={filters.maxMaintenanceFee || ""}
                  onChange={(e) => {
                    const value = e.target.value ? parseInt(e.target.value) : undefined;
                    onFiltersChange({ ...filters, maxMaintenanceFee: value || null });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const value = e.currentTarget.value ? parseInt(e.currentTarget.value) : undefined;
                      onFiltersChange({ ...filters, maxMaintenanceFee: value || null });
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px",
                    color: "#374151",
                  }}
                />
                <button
                  onClick={() => {
                    // Just trigger a re-render to apply the current value
                    onFiltersChange({ ...filters });
                  }}
                  style={{
                    padding: "8px 16px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "white",
                    backgroundColor: "#3b82f6",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * MapListings Component
 *
 * A high-performance real estate map component that displays property listings
 * using server-side clustering from the Repliers API. Automatically adjusts
 * cluster precision based on zoom level for optimal user experience.
 *
 * Features:
 * - Server-side clustering for optimal performance
 * - Zoom-based precision adjustment
 * - Hierarchical cluster drilling
 * - Minimal API calls
 * - Property count display
 * - Filter panel for search refinement
 */
export function MapListings({
  apiKey,
  mapboxToken,
  initialCenter,
  initialZoom,
  height = "100%",
  width = "100%",
  mapStyle = "mapbox://styles/mapbox/streets-v12",
  centerCalculation = "average",
  showPropertyCount = true,
}: MapListingsProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(
    initialCenter || null
  );
  const [mapZoom, setMapZoom] = useState<number | null>(initialZoom || null);
  const currentZoomLevel = useRef<number | null>(null);
  const lastFetchParams = useRef<{ bounds: string; zoom: number; filters: string } | null>(null);

  // Tooltip state for property preview
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Cluster tooltip state
  const [clusterTooltipOpen, setClusterTooltipOpen] = useState(false);
  const [clusterProperties, setClusterProperties] = useState<ListingResult[]>([]);
  const [clusterTooltipPosition, setClusterTooltipPosition] = useState({ x: 0, y: 0 });

  // Store price markers for cleanup
  const priceMarkers = useRef<mapboxgl.Marker[]>([]);

  // Store the latest fetchClusters function to avoid map reinitialization
  const fetchClustersRef = useRef<((bounds: mapboxgl.LngLatBounds) => void) | null>(null);

  // Filter state
  const [filters, setFilters] = useState<MapFilters>({
    listingType: "all",
    propertyTypes: [],
    bedrooms: "all",
    bathrooms: "all",
    garageSpaces: "all",
    openHouse: "all",
  });

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: MapFilters) => {
    setFilters(newFilters);
  }, []);

  // Format price based on property type
  const formatPrice = useCallback((price: number, type: string): string => {
    const formatToMaxDigits = (value: number, suffix: string): string => {
      if (value >= 100) {
        // 3 digits: 189K, 999K, 234M
        return `${Math.round(value)}${suffix}`;
      } else if (value >= 10) {
        // 2 digits + 1 decimal: 39.9K, 12.5M
        return `${Math.round(value * 10) / 10}${suffix}`;
      } else {
        // 1 digit + 2 decimals: 6.56K, 1.45M
        return `${Math.round(value * 100) / 100}${suffix}`;
      }
    };

    if (type === "Lease") {
      // Lease properties - always show as K
      if (price >= 1000) {
        const thousands = price / 1000;
        return formatToMaxDigits(thousands, 'K');
      }
      return Math.round(price).toString(); // Round small values to whole numbers
    } else {
      // Sale properties - prefer M over K when >= 1M, and handle edge cases better
      if (price >= 999500) { // Treat 999.5K+ as 1M for better UX
        const millions = price / 1000000;
        return formatToMaxDigits(millions, 'M');
      } else if (price >= 1000) {
        const thousands = price / 1000;
        return formatToMaxDigits(thousands, 'K');
      }
      return Math.round(price).toString(); // Round small values to whole numbers
    }
  }, []);

  // Create price bubble HTML element (back to simple version)
  const createPriceBubble = useCallback((price: number, type: string): HTMLElement => {
    const formattedPrice = formatPrice(price, type);
    const isLease = type === "Lease";

    const bubble = document.createElement('div');
    bubble.style.cssText = `
      background-color: ${isLease ? '#a855f7' : '#22c55e'};
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      white-space: nowrap;
      pointer-events: auto;
      cursor: pointer;
    `;
    bubble.textContent = formattedPrice;

    return bubble;
  }, [formatPrice]);

  // Clear existing price markers
  const clearPriceMarkers = useCallback(() => {
    priceMarkers.current.forEach(marker => marker.remove());
    priceMarkers.current = [];
  }, []);

  // Add price markers for properties
  const addPriceMarkers = useCallback((features: any[]) => {
    if (!map.current) return;

    clearPriceMarkers();

    features.forEach((feature) => {
      if (
        'isProperty' in feature.properties &&
        feature.properties.isProperty &&
        feature.properties.listPrice
      ) {
        const { listPrice } = feature.properties;
        const type = feature.properties.type || 'Sale';
        const [lng, lat] = feature.geometry.coordinates;

        // Validate coordinates before creating marker
        if (isNaN(lng) || isNaN(lat) || lng === null || lat === null) {
          return;
        }

        // Convert price to number if it's a string
        const numericPrice = typeof listPrice === 'string' ? parseFloat(listPrice) : listPrice;
        if (isNaN(numericPrice)) {
          return;
        }

        const bubble = createPriceBubble(numericPrice, type);

        const marker = new mapboxgl.Marker({
          element: bubble,
          anchor: 'bottom',
          offset: [0, -5]
        })
          .setLngLat([lng, lat])
          .addTo(map.current!);

        // Add click handler to bubble
        bubble.addEventListener('click', async (event) => {
          // Get click position relative to viewport
          const clickX = event.clientX;
          const clickY = event.clientY;
          setTooltipPosition({ x: clickX, y: clickY });

          // If we already have enhanced data, use it
          if (feature.properties.address && feature.properties.images) {
            const listing = {
              mlsNumber: feature.properties.mlsNumber || "N/A",
              listPrice: numericPrice,
              address: feature.properties.address,
              details: feature.properties.details,
              images: feature.properties.images,
              type: feature.properties.type,
              lastStatus: feature.properties.lastStatus,
              status: feature.properties.status,
            };
            setSelectedListing(listing);
            setTooltipOpen(true);
            return;
          }

          // Otherwise, fetch full property details
          try {
            const response = await fetch(`https://api.repliers.io/listings?mlsNumber=${feature.properties.mlsNumber}&fields=address.*,details.*,images,type,lastStatus,status,class`, {
              headers: {
                "REPLIERS-API-KEY": apiKey,
                "Content-Type": "application/json",
              },
            });

            if (!response.ok) {
              throw new Error(`Failed to fetch property details: ${response.status}`);
            }

            const data = await response.json();
            const propertyData = data.listings?.[0];

            if (propertyData) {
              const listing = {
                mlsNumber: feature.properties.mlsNumber || "N/A",
                listPrice: numericPrice,
                address: propertyData.address,
                details: propertyData.details,
                images: propertyData.images,
                type: propertyData.type || feature.properties.type,
                lastStatus: propertyData.lastStatus,
                status: propertyData.status,
              };
              setSelectedListing(listing);
              setTooltipOpen(true);
            } else {
              const listing = {
                mlsNumber: feature.properties.mlsNumber || "N/A",
                listPrice: numericPrice,
                address: feature.properties.address,
                details: feature.properties.details,
                images: feature.properties.images,
                type: feature.properties.type,
                lastStatus: feature.properties.lastStatus,
                status: feature.properties.status,
              };
              setSelectedListing(listing);
              setTooltipOpen(true);
            }
          } catch (error) {
            const listing = {
              mlsNumber: feature.properties.mlsNumber || "N/A",
              listPrice: numericPrice,
              address: feature.properties.address,
              details: feature.properties.details,
              images: feature.properties.images,
              type: feature.properties.type,
              lastStatus: feature.properties.lastStatus,
              status: feature.properties.status,
            };
            setSelectedListing(listing);
            setTooltipOpen(true);
          }
        });

        priceMarkers.current.push(marker);
      }
    });
  }, [clearPriceMarkers, createPriceBubble, apiKey]);

  // Auto-center detection effect
  useEffect(() => {
    const performAutoCenter = async () => {
      if (mapCenter && mapZoom) return; // Already have center/zoom

      // Check cache first with method-specific key
      const cached = getCachedAutoCenter(`${apiKey}-${centerCalculation}`);
      if (cached) {
        setMapCenter(cached.center);
        setMapZoom(initialZoom || 10); // Use prop or fallback
        return;
      }

      // Perform detection
      const detected = await detectAutoCenter(apiKey, centerCalculation);
      if (detected) {
        setMapCenter(detected.center);
        setMapZoom(initialZoom || 10); // Use prop or fallback
      } else {
        // Fallback to default
        setMapCenter([-98.5795, 39.8283]);
        setMapZoom(initialZoom || 10); // Use prop or fallback
      }
    };

    performAutoCenter();
  }, [apiKey, mapCenter, mapZoom, centerCalculation, initialZoom]);

  // Get cluster precision based on zoom level (more aggressive to break up large clusters)
  const getClusterPrecision = useCallback((zoom: number): number => {
    if (zoom <= 6) return 5; // Continental level (increased from 3)
    if (zoom <= 8) return 8; // State/Province level (increased from 5)
    if (zoom <= 10) return 12; // Metropolitan level (increased from 8)
    if (zoom <= 12) return 16; // City level (increased from 12)
    if (zoom <= 14) return 20; // District level (increased from 16)
    return 25; // Street level (increased from 20, max precision for fine-grained clustering)
  }, []);

  // Convert bounds to polygon format for Repliers API
  const boundsToPolygon = useCallback((bounds: mapboxgl.LngLatBounds) => {
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    return [
      [
        [sw.lng, sw.lat],
        [ne.lng, sw.lat],
        [ne.lng, ne.lat],
        [sw.lng, ne.lat],
        [sw.lng, sw.lat], // Close the polygon
      ],
    ];
  }, []);

  // Fetch clusters from Repliers API
  const fetchClusters = useCallback(
    async (bounds: mapboxgl.LngLatBounds) => {
      if (!map.current) return;

      const zoom = map.current.getZoom();
      const precision = getClusterPrecision(zoom);

      // Create bounds key for comparison
      const boundsKey = JSON.stringify(boundsToPolygon(bounds));
      const roundedZoom = Math.round(zoom * 2) / 2; // Round to 0.5 precision for optimization
      const filtersKey = JSON.stringify(filters);

      // Check if this is a duplicate request
      if (lastFetchParams.current &&
          lastFetchParams.current.bounds === boundsKey &&
          Math.abs(lastFetchParams.current.zoom - roundedZoom) < 0.5 &&
          lastFetchParams.current.filters === filtersKey) {
        return;
      }

      // Update last fetch params
      lastFetchParams.current = { bounds: boundsKey, zoom: roundedZoom, filters: filtersKey };



      currentZoomLevel.current = zoom;


      setError(null);


      try {
        const url = new URL("https://api.repliers.io/listings");
        url.searchParams.set("cluster", "true");
        url.searchParams.set("clusterPrecision", precision.toString());
        url.searchParams.set("clusterLimit", "500");
        url.searchParams.set("status", "A");
        url.searchParams.set("map", JSON.stringify(boundsToPolygon(bounds)));
        url.searchParams.set("key", apiKey);

        // Apply listing type filter
        if (filters.listingType !== "all") {
          if (filters.listingType === "sale") {
            url.searchParams.set("type", "Sale");
          } else if (filters.listingType === "lease") {
            url.searchParams.set("type", "Lease");
          }
        }

        // Apply property type filter
        if (filters.propertyTypes.length === 1) {
          // Single property type - works perfectly
          url.searchParams.set("details.propertyType", filters.propertyTypes[0]);
        } else if (filters.propertyTypes.length > 1) {
          // Multiple property types - API doesn't support this well
          // Fall back to no server-side filtering and handle client-side
        }

        // Apply price range filters
        if (filters.minPrice && filters.minPrice > 0) {
          url.searchParams.set("minPrice", filters.minPrice.toString());
        }
        if (filters.maxPrice && filters.maxPrice > 0) {
          url.searchParams.set("maxPrice", filters.maxPrice.toString());
        }

        // Apply bedrooms filter
        if (filters.bedrooms && filters.bedrooms !== "all") {
          if (filters.bedrooms === "5+") {
            url.searchParams.set("minBedrooms", "5");
          } else {
            // For specific bedroom counts (0, 1, 2, 3, 4), set exact match
            url.searchParams.set("minBedrooms", filters.bedrooms);
            url.searchParams.set("maxBedrooms", filters.bedrooms);
          }
        }

        // Apply bathrooms filter
        if (filters.bathrooms && filters.bathrooms !== "all") {
          // For "1+", "2+", etc., extract the number and set minBaths
          const minBaths = filters.bathrooms.replace("+", "");
          url.searchParams.set("minBaths", minBaths);
        }

        // Apply garage/parking filter
        if (filters.garageSpaces && filters.garageSpaces !== "all") {
          // For "1+", "2+", etc., extract the number and set minGarageSpaces
          const minGarageSpaces = filters.garageSpaces.replace("+", "");
          url.searchParams.set("minGarageSpaces", minGarageSpaces);
        }

        // Apply square footage filter
        if (filters.minSqft && filters.minSqft > 0) {
          url.searchParams.set("minSqft", filters.minSqft.toString());
        }
        if (filters.maxSqft && filters.maxSqft > 0) {
          url.searchParams.set("maxSqft", filters.maxSqft.toString());
        }

        // Apply open house filter
        if (filters.openHouse && filters.openHouse !== "all") {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          let minDate: Date | null = null;
          let maxDate: Date | null = null;

          if (filters.openHouse === "today") {
            minDate = today;
            maxDate = today;
          } else if (filters.openHouse === "thisWeekend") {
            // Find next Saturday and Sunday
            const dayOfWeek = today.getDay();
            const daysUntilSaturday = dayOfWeek === 0 ? 6 : 6 - dayOfWeek;
            const saturday = new Date(today);
            saturday.setDate(today.getDate() + daysUntilSaturday);
            const sunday = new Date(saturday);
            sunday.setDate(saturday.getDate() + 1);
            minDate = saturday;
            maxDate = sunday;
          } else if (filters.openHouse === "thisWeek") {
            minDate = today;
            const endOfWeek = new Date(today);
            endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
            maxDate = endOfWeek;
          } else if (filters.openHouse === "anytime") {
            minDate = today;
            // No max date for "anytime"
          }

          if (minDate) {
            const formatDate = (date: Date) => date.toISOString().split('T')[0];
            url.searchParams.set("minOpenHouseDate", formatDate(minDate));
            if (maxDate) {
              url.searchParams.set("maxOpenHouseDate", formatDate(maxDate));
            }
          }
        }

        // Always request cluster fields for tooltips to work
        url.searchParams.set(
          "clusterFields",
          "mlsNumber,listPrice,coordinates,type,address.*,details.numBedrooms,details.numBedroomsPlus,details.numBathrooms,details.numBathroomsPlus,details.numGarageSpaces,details.propertyType,lastStatus,images,status,class"
        );

        // At high zoom levels, also get individual properties
        if (zoom >= 14) {
          url.searchParams.set("listings", "true");
          url.searchParams.set(
            "fields",
            "address.*,mlsNumber,listPrice,details.numBedrooms,details.numBedroomsPlus,details.numBathrooms,details.numBathroomsPlus,details.numGarageSpaces,details.propertyType,type,lastStatus,images,status,class,coordinates,latitude,longitude,geo,location,map"
          );
          url.searchParams.set("pageSize", "500");
        } else {
          url.searchParams.set("listings", "false");
        }


        const response = await fetch(url.toString(), {
          headers: {
            "REPLIERS-API-KEY": apiKey,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            `API Error: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();


        // Process clusters - they're nested under aggregates.map.clusters
        const clusters = data.aggregates?.map?.clusters || data.clusters || [];
        const clusterFeatures: ClusterFeature[] = [];
        const singlePropertyFeatures: PropertyFeature[] = [];

        // Debug: Log API response structure
        const rawListings = data.listings || data.results || [];
        console.log(`\n📦 API RESPONSE DEBUG (zoom: ${zoom.toFixed(2)})`);
        console.log(`   Total clusters from API: ${clusters.length}`);
        console.log(`   Total raw listings from API: ${rawListings.length}`);

        // Check for duplicate mlsNumbers in rawListings
        const mlsNumbers = rawListings.map((l: any) => l.mlsNumber).filter(Boolean);
        const uniqueMlsNumbers = new Set(mlsNumbers);
        if (mlsNumbers.length !== uniqueMlsNumbers.size) {
          console.log(`   ⚠️ DUPLICATES DETECTED: ${mlsNumbers.length} total, ${uniqueMlsNumbers.size} unique (${mlsNumbers.length - uniqueMlsNumbers.size} duplicates)`);
        }

        if (clusters.length > 0) {
          console.log(`   First cluster structure:`, {
            count: clusters[0].count,
            propertiesLength: clusters[0].properties?.length || 0,
            mapLength: clusters[0].map?.length || 0,
            hasMembers: !!(clusters[0].properties || clusters[0].map)
          });
        }

        // Helper function to check if a property matches the selected property types
        const matchesPropertyTypeFilter = (propertyType: string | undefined) => {
          if (filters.propertyTypes.length === 0) return true; // No filter = show all
          if (!propertyType) return false; // No property type = exclude
          return filters.propertyTypes.includes(propertyType);
        };



        clusters.forEach((cluster: any, index: number) => {
          const originalCoordinates = [
            cluster.location?.longitude ||
              cluster.coordinates?.lng ||
              cluster.longitude ||
              cluster.center?.lng,
            cluster.location?.latitude ||
              cluster.coordinates?.lat ||
              cluster.latitude ||
              cluster.center?.lat,
          ];

          // If cluster has only 1 property, treat as individual property (only at zoom 14+)
          if (cluster.count === 1 && zoom >= 14) {
            // Extract price from nested listing data if available
            const listPrice = cluster.listing?.listPrice ||
                             cluster.listPrice ||
                             (cluster.map && cluster.map[0]?.listPrice);


            // Check if this single property matches the property type filter
            const clusterPropertyType = cluster.listing?.details?.propertyType || cluster.details?.propertyType;
            if (matchesPropertyTypeFilter(clusterPropertyType)) {
              singlePropertyFeatures.push({
                type: "Feature" as const,
                properties: {
                  mlsNumber: cluster.mlsNumber || cluster.listing?.mlsNumber || `single-${index}`,
                  listPrice: typeof listPrice === 'string' ? parseFloat(listPrice) : listPrice,
                  propertyType: cluster.propertyType || cluster.listing?.propertyType || cluster.status || "Sale",
                  type: cluster.listing?.type || cluster.type, // Add type for lease detection
                  isProperty: true as const,
                  // Enhanced fields from cluster data
                  address: cluster.listing?.address || cluster.address,
                  details: cluster.listing?.details || cluster.details,
                  images: cluster.listing?.images || cluster.images,
                  lastStatus: cluster.listing?.lastStatus || cluster.lastStatus,
                  status: cluster.listing?.status || cluster.status,
                  class: cluster.listing?.class || cluster.class,
                },
                geometry: {
                  type: "Point" as const,
                  coordinates: [
                    originalCoordinates[0],
                    originalCoordinates[1],
                  ] as [number, number],
                },
              });
            }
          } else if (cluster.count === 1) {
            // Single property clusters at zoom < 14: show as regular clusters
            clusterFeatures.push({
              type: "Feature" as const,
              properties: {
                count: cluster.count || 1,
                apiCount: cluster.count || 1, // Store original API count for debugging
                precision: cluster.precision || precision,
                id: `cluster-${index}`,
                members: cluster.properties || cluster.map || [],
              },
              geometry: {
                type: "Point" as const,
                coordinates: [originalCoordinates[0], originalCoordinates[1]] as [
                  number,
                  number
                ],
              },
            });
          } else {
            // For multi-property clusters, try to position bubble over densest sub-area
            let clusterCoordinates = originalCoordinates;

            // If we have sub-cluster data or property list, find densest position
            if (cluster.properties && Array.isArray(cluster.properties)) {
              const subCoords: Coordinate[] = [];
              cluster.properties.forEach((prop: any) => {
                const coord = extractCoordinates(prop);
                if (coord) subCoords.push(coord);
              });

              if (subCoords.length > 0) {
                // Find densest sub-area within this cluster using average method
                const clusterBounds = getPolygonBounds(subCoords);
                if (clusterBounds) {
                  const avgCenter = calculateAverageCenter(
                    subCoords,
                    clusterBounds
                  );
                  clusterCoordinates = avgCenter;
                }
              }
            }

            // Store the actual cluster members for tooltip display
            const clusterMembers = cluster.properties || cluster.map || [];


            clusterFeatures.push({
              type: "Feature" as const,
              properties: {
                count: cluster.count || 1,
                apiCount: cluster.count || 1, // Store original API count for debugging
                precision: cluster.precision || precision,
                id: `cluster-${index}`,
                members: clusterMembers, // Store actual cluster members
              },
              geometry: {
                type: "Point" as const,
                coordinates: [clusterCoordinates[0], clusterCoordinates[1]] as [
                  number,
                  number
                ],
              },
            });
          }
        });

        // Process individual properties (at high zoom)
        // Get mlsNumbers from singlePropertyFeatures to avoid duplicates
        const singlePropertyMlsNumbers = new Set(
          singlePropertyFeatures.map(f => f.properties.mlsNumber)
        );

        const propertyFeatures: PropertyFeature[] = rawListings
          .filter((listing: any) => {
            // Skip if this property is already in singlePropertyFeatures
            if (singlePropertyMlsNumbers.has(listing.mlsNumber)) {
              return false;
            }
            // Only include listings with valid coordinates
            const lng = listing.map?.longitude ||
                       listing.coordinates?.lng ||
                       listing.coordinates?.longitude ||
                       listing.longitude ||
                       listing.lng;
            const lat = listing.map?.latitude ||
                       listing.coordinates?.lat ||
                       listing.coordinates?.latitude ||
                       listing.latitude ||
                       listing.lat;
            const hasValidCoords = lng !== undefined && lat !== undefined && !isNaN(lng) && !isNaN(lat);

            // Apply client-side property type filter for multiple selections
            const matchesFilter = matchesPropertyTypeFilter(listing.details?.propertyType);


            return hasValidCoords && matchesFilter;
          })
          .map(
          (listing: any) => {
            const baseProperties = {
              mlsNumber: listing.mlsNumber,
              listPrice: typeof listing.listPrice === 'string' ? parseFloat(listing.listPrice) : listing.listPrice,
              propertyType: listing.propertyType || listing.details?.propertyType || listing.type || listing.status || "Sale",
              type: listing.type, // Add type for lease detection
              isProperty: true as const,
            };

            // Add enhanced fields when available (zoom 13+)
            const enhancedProperties = zoom >= 13 ? {
              address: listing.address,
              details: listing.details,
              images: listing.images,
              type: listing.type,
              lastStatus: listing.lastStatus,
              status: listing.status,
              class: listing.class,
            } : {};

            const finalProperties = { ...baseProperties, ...enhancedProperties };


            return {
              type: "Feature" as const,
              properties: finalProperties,
              geometry: {
                type: "Point" as const,
                coordinates: [
                  listing.coordinates?.lng || listing.longitude || listing.map?.longitude,
                  listing.coordinates?.lat || listing.latitude || listing.map?.latitude,
                ] as [number, number],
              },
            };
          }
        );

        // Recalculate cluster counts based on actual filtered properties
        // This ensures cluster numbers match what we're actually displaying
        const recalculateClusterCounts = (clusters: ClusterFeature[], allProperties: PropertyFeature[], singleProps: PropertyFeature[]) => {
          // Combine all available properties (both individual and single property features)
          const allAvailableProperties = [...allProperties, ...singleProps];

          return clusters.map(cluster => {
            const clusterCoords = cluster.geometry.coordinates;

            // Find properties near this cluster (within reasonable distance)
            const nearbyProperties = allAvailableProperties.filter(prop => {
              const propCoords = prop.geometry.coordinates;
              const distance = Math.sqrt(
                Math.pow(propCoords[0] - clusterCoords[0], 2) +
                Math.pow(propCoords[1] - clusterCoords[1], 2)
              );
              // Use a small distance threshold (approximately 100 meters in degrees)
              return distance < 0.001;
            });

            // If no nearby properties found, keep original count (cluster is valid but properties not loaded yet)
            const newCount = nearbyProperties.length > 0 ? nearbyProperties.length : cluster.properties.count;

            // Update count to match actual nearby filtered properties
            return {
              ...cluster,
              properties: {
                ...cluster.properties,
                count: newCount,
              }
            };
          });
        };

        // Apply recalculation only when we have any properties (individual or single)
        const hasProperties = propertyFeatures.length > 0 || singlePropertyFeatures.length > 0;
        const updatedClusterFeatures = zoom >= 14 && hasProperties
          ? recalculateClusterCounts(clusterFeatures, propertyFeatures, singlePropertyFeatures)
          : clusterFeatures;

        // Combine features - at zoom 14+, use proximity-based grouping
        let allFeatures: any[];

        if (zoom >= 14) {
          // At high zoom: use smart proximity grouping to avoid overlaps
          const allPotentialFeatures = [
            ...updatedClusterFeatures.map(f => ({...f, type: 'cluster'})),
            ...singlePropertyFeatures.map(f => ({...f, type: 'singleProperty'})),
            ...propertyFeatures.map(f => ({...f, type: 'property'}))
          ];

          // Group features by proximity (50 meter radius)
          const proximityGroups = groupFeaturesByProximity(allPotentialFeatures, 50);

          // For each proximity group, decide what to show
          allFeatures = proximityGroups.map(group => {
            const clusters = group.filter(f => f.type === 'cluster');
            const properties = group.filter(f => f.type === 'property' || f.type === 'singleProperty');

            // Calculate total properties in clusters vs individual properties
            const clusterPropertyCount = clusters.reduce((sum, c) => sum + (c.properties?.count || 0), 0);
            const individualPropertyCount = properties.length;

            // Decision logic for what to show:
            if (properties.length > 3) {
              // Too many individual bubbles would be messy → show largest cluster
              return clusters.length > 0 ? clusters.reduce((largest, current) =>
                (current.properties?.count || 0) > (largest.properties?.count || 0) ? current : largest
              ) : properties[0];
            } else if (clusterPropertyCount > individualPropertyCount && clusters.length > 0) {
              // Cluster has more complete data → show cluster
              return clusters.reduce((largest, current) =>
                (current.properties?.count || 0) > (largest.properties?.count || 0) ? current : largest
              );
            } else if (properties.length > 0) {
              // Individual properties have complete data → show all properties
              return properties;
            } else if (clusters.length > 0 && clusters[0].properties.count > 0) {
              // Fallback to cluster only if it has a valid count
              return clusters[0];
            } else {
              // No valid data to show
              return null;
            }
          }).flat().filter(Boolean);

        } else {
          // At low zoom: only clusters and single property features, but merge small clusters
          const mergedClusters = mergeSmallClusters([...clusterFeatures, ...singlePropertyFeatures], zoom);
          allFeatures = mergedClusters;
        }

        // Log the GeoJSON structure that goes to Mapbox
        const geoJsonData = {
          type: "FeatureCollection" as const,
          features: allFeatures,
        };

        // Update map source (this should not move the map)
        const source = map.current.getSource(
          "listings"
        ) as mapboxgl.GeoJSONSource;
        if (source) {
          source.setData(geoJsonData);

          // Add custom price markers (clear old ones first)
          addPriceMarkers(allFeatures);
        }

        // Update total count
        const total =
          data.count ||
          clusterFeatures.reduce(
            (sum, feature) => sum + feature.properties.count,
            0
          );
        setTotalCount(total);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load listings";
        setError(errorMessage);
      }
    },
    [apiKey, getClusterPrecision, boundsToPolygon, addPriceMarkers, filters]
  );

  // Update the ref whenever fetchClusters changes
  useEffect(() => {
    fetchClustersRef.current = fetchClusters;
  }, [fetchClusters]);

  // Helper function to calculate distance between two coordinates (in meters)
  const calculateDistance = useCallback((coord1: [number, number], coord2: [number, number]): number => {
    const [lng1, lat1] = coord1;
    const [lng2, lat2] = coord2;

    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  // Group features by proximity
  const groupFeaturesByProximity = useCallback((features: any[], radiusMeters: number): any[][] => {
    const groups: any[][] = [];
    const processed = new Set<number>();

    features.forEach((feature, index) => {
      if (processed.has(index)) return;

      const group = [feature];
      processed.add(index);

      const featureCoords = feature.geometry.coordinates as [number, number];

      // Find all other features within radius
      features.forEach((otherFeature, otherIndex) => {
        if (processed.has(otherIndex) || index === otherIndex) return;

        const otherCoords = otherFeature.geometry.coordinates as [number, number];
        const distance = calculateDistance(featureCoords, otherCoords);

        if (distance <= radiusMeters) {
          group.push(otherFeature);
          processed.add(otherIndex);
        }
      });

      groups.push(group);
    });

    return groups;
  }, [calculateDistance]);

  // Merge small clusters (blue/yellow ones) while keeping large clusters intact
  const mergeSmallClusters = useCallback((features: any[], zoom: number): any[] => {
    // Define what counts as a "small cluster" that should be merged
    // More aggressive merging at mid-zoom to reduce clutter
    const smallClusterThreshold = zoom <= 10 ? 30 : (zoom <= 12 ? 60 : (zoom <= 13 ? 100 : 30));
    const mergeRadius = zoom <= 10 ? 500 : (zoom <= 12 ? 300 : (zoom <= 13 ? 200 : 100)); // meters

    const smallClusters = features.filter(f => f.properties.count <= smallClusterThreshold);
    const largeClusters = features.filter(f => f.properties.count > smallClusterThreshold);

    if (smallClusters.length === 0) {
      return features; // No small clusters to merge
    }

    // Group small clusters by proximity for merging
    const smallClusterGroups = groupFeaturesByProximity(smallClusters, mergeRadius);

    const mergedFeatures = smallClusterGroups.map(group => {
      if (group.length === 1) {
        return group[0]; // Single cluster, no merging needed
      }

      // Merge multiple small clusters into one larger cluster
      const totalCount = group.reduce((sum, cluster) => sum + cluster.properties.count, 0);
      const avgLng = group.reduce((sum, cluster) => sum + cluster.geometry.coordinates[0], 0) / group.length;
      const avgLat = group.reduce((sum, cluster) => sum + cluster.geometry.coordinates[1], 0) / group.length;

      return {
        type: "Feature" as const,
        properties: {
          count: totalCount,
          precision: group[0].properties.precision,
          id: `merged-${group.map(c => c.properties.id).join('-')}`,
          members: [], // Could combine members if needed
        },
        geometry: {
          type: "Point" as const,
          coordinates: [avgLng, avgLat] as [number, number],
        },
      };
    });

    return [...largeClusters, ...mergedFeatures];
  }, [groupFeaturesByProximity]);

  // Find individual listings near a cluster coordinate for tooltip display
  const findNearbyListings = useCallback((clusterCoords: [number, number], radiusMeters: number, maxCount: number): any[] => {
    if (!map.current) return [];

    try {
      const source = map.current.getSource('listings') as mapboxgl.GeoJSONSource;
      if (!source || !source._data) return [];

      const sourceData = source._data as any;
      const allFeatures = sourceData.features || [];

      // Find property features (not clusters) near the cluster
      const nearbyProperties = allFeatures
        .filter((feature: any) => feature.properties?.isProperty === true)
        .map((feature: any) => {
          const featureCoords = feature.geometry.coordinates as [number, number];
          const distance = calculateDistance(clusterCoords, featureCoords);
          return { feature, distance, listing: feature.properties };
        })
        .filter((item: any) => item.distance <= radiusMeters)
        .sort((a: any, b: any) => a.distance - b.distance)
        .slice(0, maxCount)
        .map((item: any) => item.listing);

      return nearbyProperties;

    } catch (error) {
      return [];
    }
  }, [calculateDistance]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current || !mapCenter || mapZoom === null)
      return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: mapCenter,
      zoom: mapZoom,
    });

    map.current.on("load", () => {
      if (!map.current) return;

      // Add navigation controls (zoom in/out buttons)
      map.current.addControl(new mapboxgl.NavigationControl());

      // Add source for listings
      map.current.addSource("listings", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      // Add cluster layer
      map.current.addLayer({
        id: "clusters",
        type: "circle",
        source: "listings",
        filter: ["has", "count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "count"],
            "#51bbd6", // 1-29: Blue
            30,
            "#f1c40f", // 30-59: Yellow
            60,
            "#f39c12", // 60-149: Orange
            150,
            "#f28cb1", // 150-499: Pink
            500,
            "#e74c3c", // 500+: Red
          ],
          "circle-radius": [
            "step",
            ["get", "count"],
            10, // 1-29: Small (10px)
            30,
            12, // 30-59: Small-Medium (12px)
            60,
            14, // 60-149: Medium (14px)
            150,
            18, // 150-499: Large (18px)
            500,
            22, // 500+: Extra Large (22px)
          ],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
          "circle-opacity": 0.8,
        },
      });

      // Add cluster count text
      map.current.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "listings",
        filter: ["has", "count"],
        layout: {
          "text-field": ["get", "count"],
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": [
            "step",
            ["get", "count"],
            10, // 1-29: Small text (10px)
            30,
            11, // 30-59: Small-Medium text (11px)
            60,
            12, // 60-149: Medium text (12px)
            150,
            14, // 150-499: Large text (14px)
            500,
            16, // 500+: Extra large text (16px)
          ],
        },
        paint: {
          "text-color": "#ffffff",
        },
      });

      // Add individual property dots layer (small circles)
      map.current.addLayer({
        id: "property-dots",
        type: "circle",
        source: "listings",
        filter: ["has", "isProperty"],
        paint: {
          "circle-color": "#374151",
          "circle-radius": 3,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
          "circle-opacity": 0.9,
        },
      });

      // Custom price bubbles will be handled with HTML markers instead of Mapbox layers

      // Click handler for clusters
      map.current.on("click", "clusters", async (e) => {
        if (!map.current || !e.features?.[0]) return;

        const feature = e.features[0];
        const coordinates = (feature.geometry as any).coordinates;
        const clusterCount = (feature.properties as any).count;
        const apiCount = (feature.properties as any).apiCount;

        // Get click position for tooltip
        const clickX = e.originalEvent.clientX;
        const clickY = e.originalEvent.clientY;

        // Show cluster properties only at very high zoom levels
        const currentZoom = map.current.getZoom();

        console.log(`\n🎯 CLUSTER CLICKED`);
        console.log(`   Zoom Level: ${currentZoom.toFixed(2)}`);
        console.log(`   Display Count: ${clusterCount}`);
        console.log(`   API Count (unfiltered): ${apiCount || clusterCount}`);

        if (currentZoom >= 14) {
          // At high zoom, show cluster properties in tooltip using the working old method
          const source = map.current.getSource('listings') as mapboxgl.GeoJSONSource;
          if (source && source._data) {
            const sourceData = source._data as any;

            // Get ALL property features and find the closest ones
            const allPropertyFeatures = sourceData.features?.filter((f: any) => {
              return f.properties?.isProperty === true; // Only properties
            }) || [];

            console.log(`   Total Properties Available: ${allPropertyFeatures.length}`);

            // Check if allPropertyFeatures has duplicates
            const allMlsNumbers = allPropertyFeatures.map((f: any) => f.properties?.mlsNumber).filter(Boolean);
            const uniqueAllMls = new Set(allMlsNumbers);
            if (allMlsNumbers.length !== uniqueAllMls.size) {
              console.log(`   ⚠️ DUPLICATES IN MAP DATA: ${allMlsNumbers.length} total properties, ${uniqueAllMls.size} unique MLSNumbers`);
            }

            // Sort by distance to clicked coordinates and take the closest ones
            const propertiesWithDistance = allPropertyFeatures.map((f: any) => {
              const featureCoords = f.geometry.coordinates;
              const distance = Math.sqrt(
                Math.pow(featureCoords[0] - coordinates[0], 2) +
                Math.pow(featureCoords[1] - coordinates[1], 2)
              );
              return { feature: f, distance };
            }).sort((a: any, b: any) => a.distance - b.distance);

            // Take the closest properties up to the cluster count
            const closestProperties = propertiesWithDistance.slice(0, clusterCount);

            console.log(`   Actual Properties in Cluster: ${closestProperties.length}`);
            console.log(`   Discrepancy: ${clusterCount !== closestProperties.length ? `⚠️ ${clusterCount - closestProperties.length} missing` : '✅ Match'}`);

            if (closestProperties.length > 0) {
              const realProperties: ListingResult[] = closestProperties.map(({ feature }: any) => {
                const props = feature.properties;

                return {
                  mlsNumber: props.mlsNumber || 'N/A',
                  listPrice: props.listPrice || 0,
                  address: props.address || {
                    streetNumber: 'Unknown',
                    streetName: 'Address',
                    city: 'Unknown',
                    state: 'Unknown',
                  },
                  details: props.details || {
                    numBedrooms: 0,
                    numBathrooms: 0,
                    numGarageSpaces: 0,
                    propertyType: 'Unknown',
                  },
                  images: props.images || [],
                  type: props.type || 'Sale',
                  lastStatus: props.lastStatus || 'New',
                  status: props.status || 'A',
                };
              });

              // Check for duplicates in realProperties
              const mlsNumbers = realProperties.map(p => p.mlsNumber);
              const uniqueMlsNumbers = new Set(mlsNumbers);

              if (mlsNumbers.length !== uniqueMlsNumbers.size) {
                console.log(`   ⚠️ DUPLICATES IN CLUSTER TOOLTIP: ${mlsNumbers.length} total, ${uniqueMlsNumbers.size} unique`);

                // Log which ones are duplicated
                const counts = mlsNumbers.reduce((acc: Record<string, number>, mls: string) => {
                  acc[mls] = (acc[mls] || 0) + 1;
                  return acc;
                }, {});

                const duplicates = Object.entries(counts)
                  .filter(([_, count]) => count > 1)
                  .map(([mls, count]) => `${mls} (${count}x)`);

                console.log(`   Duplicate MLSNumbers:`, duplicates);
              } else {
                console.log(`   ✅ No duplicates in cluster tooltip`);
              }

              // Deduplicate by mlsNumber
              const uniqueProperties = realProperties.filter((property, index, self) =>
                index === self.findIndex(p => p.mlsNumber === property.mlsNumber)
              );

              setClusterProperties(uniqueProperties);
              setClusterTooltipPosition({ x: clickX, y: clickY });
              setClusterTooltipOpen(true);

              // Close single property tooltip if open
              setTooltipOpen(false);

              return;
            }
          }


          // Fallback: if we can't get real data, still show something useful
          const fallbackProperties: ListingResult[] = [{
            mlsNumber: `Cluster-${clusterCount}`,
            listPrice: 0,
            address: {
              streetNumber: 'Multiple',
              streetName: 'Properties',
              city: 'Available',
              state: '',
            },
            details: {
              numBedrooms: 0,
              numBathrooms: 0,
              numGarageSpaces: 0,
              propertyType: `${clusterCount} Properties in Cluster`,
            },
            images: [],
            type: 'Sale',
            lastStatus: 'Available',
            status: 'A',
          }];

          setClusterProperties(fallbackProperties);
          setClusterTooltipPosition({ x: clickX, y: clickY });
          setClusterTooltipOpen(true);

          // Close single property tooltip if open
          setTooltipOpen(false);

          return;
        }

        // Default zoom behavior for all other zoom levels
        // Zoom less aggressively at higher zoom levels
        const zoomIncrement = currentZoom >= 14 ? 2 : (currentZoom >= 12 ? 3 : 4);
        const targetZoom = Math.min(currentZoom + zoomIncrement, 16);

        map.current.easeTo({
          center: coordinates,
          zoom: targetZoom,
          duration: 1000,
          easing: (t) => t * (2 - t), // Smooth ease-out animation
        });
      });

      // Property dots are now handled by the expandable price bubbles above them
      // No separate click handler needed

      // Hover cursors
      map.current.on("mouseenter", "clusters", () => {
        if (map.current) map.current.getCanvas().style.cursor = "pointer";
      });
      map.current.on("mouseleave", "clusters", () => {
        if (map.current) map.current.getCanvas().style.cursor = "";
      });
      map.current.on("mouseenter", "property-dots", () => {
        if (map.current) map.current.getCanvas().style.cursor = "pointer";
      });
      map.current.on("mouseleave", "property-dots", () => {
        if (map.current) map.current.getCanvas().style.cursor = "";
      });

      // Initial data fetch
      const bounds = map.current.getBounds();
      if (bounds) {
        fetchClustersRef.current?.(bounds);
      }
    });

    // Update data on map move
    map.current.on("moveend", () => {
      if (!map.current) return;
      const bounds = map.current.getBounds();
      if (bounds) {
        fetchClustersRef.current?.(bounds);
      }
    });

    return () => {
      clearPriceMarkers(); // Clean up price markers
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken, mapStyle, mapCenter, mapZoom, clearPriceMarkers, addPriceMarkers]);

  // Re-fetch data when filters change (without moving map)
  useEffect(() => {
    if (map.current) {
      // Clear the last fetch params to ensure the request isn't skipped, but keep map position
      lastFetchParams.current = null;

      const bounds = map.current.getBounds();
      if (bounds) {
        // Fetch new data without changing map position/zoom
        fetchClusters(bounds);
      }
    }
  }, [filters, fetchClusters]);

  return (
    <div style={{ width, height, position: "relative" }}>
      {/* Map Container */}
      <div
        ref={mapContainer}
        style={{ width: "100%", height: "100%" }}
        className="rounded-lg overflow-hidden"
      />

      {/* Filter Panel */}
      <FilterPanel
        filters={filters}
        onFiltersChange={handleFiltersChange}
        apiKey={apiKey}
      />

      {/* Property Count Display */}
      {showPropertyCount && (
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            right: "16px",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            padding: "8px 12px",
            borderRadius: "6px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            fontSize: "14px",
            fontWeight: "600",
            color: "#374151",
          }}
        >
          {error ? (
            <span style={{ color: "#ef4444" }}>Error</span>
          ) : (
            <span>{totalCount.toLocaleString()} properties</span>
          )}
        </div>
      )}


      {/* Error Message */}
      {error && (
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            left: "16px",
            right: "16px",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "6px",
            padding: "12px",
            color: "#b91c1c",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      {/* Property Preview Tooltip */}
      <PropertyTooltip
        open={tooltipOpen}
        onClose={() => setTooltipOpen(false)}
        listing={selectedListing}
        position={tooltipPosition}
        mapContainer={mapContainer.current}
      />

      {/* Cluster Properties Tooltip */}
      <ClusterTooltip
        open={clusterTooltipOpen}
        onClose={() => setClusterTooltipOpen(false)}
        properties={clusterProperties}
        position={clusterTooltipPosition}
        mapContainer={mapContainer.current}
      />
    </div>
  );
}
