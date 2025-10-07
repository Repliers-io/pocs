import React from "react";
import { BedDouble, Bath, Car } from "lucide-react";
import { ListingPreviewProps } from "../types";
import { formatPrice, formatBedrooms, formatBathrooms, formatParking, formatAddress } from "../helper-functions/formatters";
import { StatusTag } from "./StatusTag";

export function ListingPreview({ listing, onClick }: ListingPreviewProps) {
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
