import React, { useEffect } from "react";
import { BedDouble, Bath, Car, X } from "lucide-react";

// Reuse the ListingResult interface from autocomplete-search
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

interface PropertyPreviewModalProps {
  open: boolean;
  onClose: () => void;
  listing: ListingResult | null;
  onViewDetails?: (mlsNumber: string) => void;
}

export function PropertyPreviewModal({
  open,
  onClose,
  listing,
  onViewDetails,
}: PropertyPreviewModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scroll
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open, onClose]);

  if (!open || !listing) return null;

  // Format price helper (copied from autocomplete-search)
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format bedrooms helper (copied from autocomplete-search)
  const formatBedrooms = (details: ListingResult["details"]) => {
    if (!details) return "N/A";

    const total = details.numBedrooms;
    const plus = details.numBedroomsPlus;

    if (total && plus && plus > 0) {
      return `${total} + ${plus}`;
    }
    return total?.toString() || "N/A";
  };

  // Format bathrooms helper (copied from autocomplete-search)
  const formatBathrooms = (details: ListingResult["details"]) => {
    if (!details) return "N/A";

    const total = details.numBathrooms;
    const plus = details.numBathroomsPlus;

    if (total && plus && plus > 0) {
      return `${total} + ${plus}`;
    }
    return total?.toString() || "N/A";
  };

  // Format garage/parking helper (copied from autocomplete-search)
  const formatParking = (details: ListingResult["details"]) => {
    if (!details) return "N/A";

    return details.numGarageSpaces?.toString() || "N/A";
  };

  // Status mapping helper (copied from autocomplete-search)
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

  // Status tag component (copied from autocomplete-search)
  const StatusTag = ({
    type,
    lastStatus,
  }: {
    type?: string;
    lastStatus?: string;
  }) => {
    const label = getStatusLabel(type, lastStatus);
    if (!label) return null;

    let style = "bg-green-100 text-green-600"; // Default for active listings

    switch (label) {
      case "For Sale":
      case "For Lease":
        style = "bg-green-100 text-green-600";
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

    return (
      <span className={`text-xs px-2 py-1 rounded-md font-medium ${style}`}>
        {label}
      </span>
    );
  };

  // Format full address
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

  return (
    // Modal backdrop - same pattern as autocomplete results
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose} // Close on backdrop click
    >
      {/* Modal container - similar to autocomplete results container */}
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
        role="dialog"
        aria-labelledby="property-preview-title"
        aria-describedby="property-preview-description"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2
            id="property-preview-title"
            className="text-lg font-semibold text-gray-800"
          >
            Property Details
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Modal Content - Exact layout from autocomplete-search */}
        <div className="p-4" id="property-preview-description">
          <div className="flex items-center gap-4">
            {/* Image or Placeholder (24x16px as specified) */}
            <div className="w-24 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
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
            <div className="flex-grow min-w-0">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <h3 className="font-semibold text-base text-gray-800 truncate">
                    {listing.listPrice
                      ? formatPrice(listing.listPrice)
                      : "Price N/A"}
                  </h3>
                  <span className="text-gray-400">|</span>
                  <span className="text-sm text-gray-600 truncate">
                    {listing.mlsNumber}
                  </span>
                </div>
                <div className="flex-shrink-0 ml-2">
                  <StatusTag
                    type={listing.type}
                    lastStatus={listing.lastStatus}
                  />
                </div>
              </div>

              <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                {formatAddress(listing.address)}
              </p>

              <div className="flex items-center text-xs text-gray-500 space-x-3 flex-wrap">
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

          {/* View Details Button */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <button
              onClick={() => {
                if (onViewDetails) {
                  onViewDetails(listing.mlsNumber);
                }
                onClose();
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
            >
              View Full Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}