import React, { useRef, useEffect, useState } from "react";
import { X } from "lucide-react";
import { PropertyTooltipProps } from "../types";
import { ListingPreview } from "./ListingPreview";

export function PropertyTooltip({
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
