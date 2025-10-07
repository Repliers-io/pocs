import React, { useState, useEffect, useCallback, useRef } from "react";
import type { PriceRangeFilterProps } from "../../types";

export function PriceRangeFilter({
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
