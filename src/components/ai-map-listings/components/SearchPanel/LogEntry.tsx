import React from "react";
import {
  MapPin,
  Home,
  Bed,
  Bath,
  DollarSign,
  Building2,
  Loader2,
} from "lucide-react";
import { ActivityChip } from "./ActivityChip";
import type { ActivityLogEntry, MapFilters } from "../../types";

export interface LogEntryProps {
  entry: ActivityLogEntry;
  onChipClick?: () => void;
}

// Format time as HH:MM AM/PM
function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, "0");
  return `${displayHours}:${displayMinutes} ${ampm}`;
}

// Generate chips from filters
function generateChips(filters?: Partial<MapFilters>, onChipClick?: () => void) {
  if (!filters) return null;

  const chips: React.ReactNode[] = [];

  // Neighborhood
  if (filters.neighborhood) {
    chips.push(
      <button
        key="neighborhood"
        onClick={onChipClick}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-indigo-200 rounded-full text-sm font-medium shadow-sm border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition-colors cursor-pointer"
      >
        <MapPin className="w-3.5 h-3.5" />
        <span className="text-gray-500">Neighborhood:</span>
        <span>{filters.neighborhood}</span>
      </button>
    );
  }

  // City
  if (filters.city) {
    chips.push(
      <button
        key="city"
        onClick={onChipClick}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-indigo-200 rounded-full text-sm font-medium shadow-sm border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition-colors cursor-pointer"
      >
        <Building2 className="w-3.5 h-3.5" />
        <span className="text-gray-500">City:</span>
        <span>{filters.city}</span>
      </button>
    );
  }

  // Property Types
  if (filters.propertyTypes && filters.propertyTypes.length > 0) {
    chips.push(
      <button
        key="propertyTypes"
        onClick={onChipClick}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-indigo-200 rounded-full text-sm font-medium shadow-sm border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition-colors cursor-pointer"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="text-gray-500">Type:</span>
        <span>{filters.propertyTypes.join(", ")}</span>
      </button>
    );
  }

  // Bedrooms
  if (filters.bedrooms && filters.bedrooms !== "all") {
    chips.push(
      <button
        key="bedrooms"
        onClick={onChipClick}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-indigo-200 rounded-full text-sm font-medium shadow-sm border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition-colors cursor-pointer"
      >
        <Bed className="w-3.5 h-3.5" />
        <span className="text-gray-500">Bedrooms:</span>
        <span>{filters.bedrooms}</span>
      </button>
    );
  }

  // Bathrooms
  if (filters.bathrooms && filters.bathrooms !== "all") {
    chips.push(
      <button
        key="bathrooms"
        onClick={onChipClick}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-indigo-200 rounded-full text-sm font-medium shadow-sm border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition-colors cursor-pointer"
      >
        <Bath className="w-3.5 h-3.5" />
        <span className="text-gray-500">Bathrooms:</span>
        <span>{filters.bathrooms}</span>
      </button>
    );
  }

  // Price Range
  if (filters.minPrice || filters.maxPrice) {
    const minPrice = filters.minPrice
      ? `$${(filters.minPrice / 1000).toFixed(0)}K`
      : "$0";
    const maxPrice = filters.maxPrice
      ? `$${(filters.maxPrice / 1000).toFixed(0)}K`
      : "Max";
    chips.push(
      <button
        key="price"
        onClick={onChipClick}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-indigo-200 rounded-full text-sm font-medium shadow-sm border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition-colors cursor-pointer"
      >
        <DollarSign className="w-3.5 h-3.5" />
        <span className="text-gray-500">Price:</span>
        <span>{`${minPrice} - ${maxPrice}`}</span>
      </button>
    );
  }

  // Listing Type
  if (filters.listingType) {
    chips.push(
      <button
        key="listingType"
        onClick={onChipClick}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-indigo-200 rounded-full text-sm font-medium shadow-sm border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition-colors cursor-pointer"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="text-gray-500">For:</span>
        <span>{filters.listingType === "sale" ? "Sale" : "Lease"}</span>
      </button>
    );
  }

  return chips.length > 0 ? (
    <div className="flex flex-wrap gap-2 mt-2">{chips}</div>
  ) : null;
}

export function LogEntry({ entry, onChipClick }: LogEntryProps) {
  const { type, timestamp, data } = entry;

  // Search entry
  if (type === "search") {
    return (
      <div className="mb-2 animate-fadeIn">
        <div className="text-xs text-gray-400 mb-1">{formatTime(timestamp)}</div>
        <div className="text-sm text-gray-600">
          Searching for: <span className="font-semibold text-gray-800">&quot;{data.query}&quot;</span>
        </div>
      </div>
    );
  }

  // Status/Loading entry
  if (type === "status") {
    return (
      <div className="mb-3 animate-fadeIn">
        <div className="text-xs text-gray-400 mb-1">{formatTime(timestamp)}</div>
        <div className="flex items-center gap-2 text-sm text-indigo-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="italic">{data.message || "Processing..."}</span>
        </div>
      </div>
    );
  }

  // Understood entry - main result
  if (type === "understood") {
    return (
      <div className="mb-4 animate-fadeIn">
        <div className="text-xs text-gray-400 mb-1">{formatTime(timestamp)}</div>
        <div className="text-sm text-gray-700 mb-2 leading-relaxed">
          I was able to process the following search criteria from your original prompt:
        </div>
        <div className="text-sm text-gray-800 font-medium mb-2">
          {data.summary || "Search understood"}
        </div>
        {generateChips(data.filters, onChipClick)}
        {data.filters && (
          <div className="mt-3">
            <button
              onClick={onChipClick}
              className="text-xs text-indigo-600 hover:text-indigo-700 hover:underline font-medium"
            >
              Click on a parameter to fine tune your search further →
            </button>
          </div>
        )}
      </div>
    );
  }

  // Update entry
  if (type === "update") {
    return (
      <div className="mb-3 animate-fadeIn">
        <div className="text-xs text-gray-400 mb-1">{formatTime(timestamp)}</div>
        <div className="text-sm text-gray-700 mb-1">{data.message}</div>
        {generateChips(data.filters, onChipClick)}
      </div>
    );
  }

  // Polygon entry
  if (type === "polygon") {
    return (
      <div className="mb-3 animate-fadeIn">
        <div className="text-xs text-gray-400 mb-1">{formatTime(timestamp)}</div>
        <div className="text-sm text-gray-700">{data.message}</div>
      </div>
    );
  }

  return null;
}
