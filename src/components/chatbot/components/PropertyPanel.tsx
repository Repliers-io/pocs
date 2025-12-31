"use client";

import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { PropertyListing } from "../types";
import type { PropertyPanelMode } from "../hooks/usePanelState";
import { PropertyDetailsView } from "./PropertyDetailsView";
import { PropertyListingsGrid } from "./PropertyListingsGrid";

export interface PropertyPanelProps {
  isOpen: boolean;
  onClose: () => void;
  mode: PropertyPanelMode;
  selectedProperty: PropertyListing | null;
  allListings: PropertyListing[];
  onPropertyClick?: (property: PropertyListing) => void;
  chatPanelWidth?: string;
}

/**
 * PropertyPanel Component
 *
 * Displays property information in two modes:
 * - "detail": Show detailed information for a single property
 * - "grid": Show grid of all available properties
 *
 * Slides in from the left, fills remaining space beside chat panel.
 *
 * Features:
 * - Independent close button (doesn't close chat)
 * - Two display modes
 * - Responsive: overlay on mobile, side-by-side on desktop
 */
export function PropertyPanel({
  isOpen,
  onClose,
  mode,
  selectedProperty,
  allListings,
  onPropertyClick,
  chatPanelWidth = "500px",
}: PropertyPanelProps) {
  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Property Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 h-full z-40 bg-white shadow-2xl flex flex-col overflow-hidden w-full md:w-auto"
            style={{
              // On desktop (md and up), position right edge based on chat panel width
              // On mobile, use full width (right: 0)
              right: `max(0px, min(100vw, ${chatPanelWidth}))`,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
              <h2 className="text-lg font-semibold text-gray-900">
                {mode === "detail" ? "Property Details" : "All Listings"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close property panel"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
              {mode === "detail" && selectedProperty && (
                <div className="p-6">
                  <PropertyDetailsView listing={selectedProperty} />
                </div>
              )}

              {mode === "grid" && allListings.length > 0 && (
                <div className="p-6">
                  <PropertyListingsGrid
                    listings={allListings}
                    onPropertyClick={onPropertyClick}
                  />
                </div>
              )}

              {!mode && (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400">No property selected</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
