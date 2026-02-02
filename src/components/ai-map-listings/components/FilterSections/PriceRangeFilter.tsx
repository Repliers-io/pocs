import React, { useState, useEffect, useCallback, useRef } from "react";
import type { PriceRangeFilterProps } from "../../types";

export function PriceRangeFilter({
  initialMin,
  initialMax,
  onApply,
  priceBreakpoints = [0, 500000, 1000000, 2000000, 4000000, Infinity]
}: PriceRangeFilterProps) {
  const [tempMinPrice, setTempMinPrice] = useState(initialMin);
  const [tempMaxPrice, setTempMaxPrice] = useState(initialMax);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset temp values when initial values change
  useEffect(() => {
    setTempMinPrice(initialMin);
    setTempMaxPrice(initialMax);
  }, [initialMin, initialMax]);

  // Debounced auto-apply
  const debouncedApply = useCallback((min: number, max: number | null) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      onApply(min, max);
    }, 300);
  }, [onApply]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

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
      const finalPrice = constrainedPrice === Infinity ? 0 : constrainedPrice;
      setTempMinPrice(finalPrice);
      debouncedApply(finalPrice, tempMaxPrice);
    } else if (isDragging === 'max') {
      const constrainedPrice = newPrice === null ? null : Math.max(newPrice, tempMinPrice);
      setTempMaxPrice(constrainedPrice);
      debouncedApply(tempMinPrice, constrainedPrice);
    }
  }, [isDragging, tempMinPrice, tempMaxPrice, getPriceFromPosition, debouncedApply]);

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
        const finalPrice = constrainedPrice === Infinity ? 0 : constrainedPrice;
        setTempMinPrice(finalPrice);
        debouncedApply(finalPrice, tempMaxPrice);
      } else {
        const constrainedPrice = newPrice === null ? null : Math.max(newPrice || 0, tempMinPrice);
        setTempMaxPrice(constrainedPrice);
        debouncedApply(tempMinPrice, constrainedPrice);
      }
    }
  }, [tempMinPrice, tempMaxPrice, getSliderPosition, getPriceFromPosition, debouncedApply]);

  const minPosition = getSliderPosition(tempMinPrice);
  const maxPosition = getSliderPosition(tempMaxPrice);

  return (
    <div
      style={{
        marginTop: "6px",
        padding: "12px",
        backgroundColor: "#f9fafb",
        borderRadius: "6px",
        border: "1px solid #e5e7eb",
      }}
    >
      {/* Current Selection Display */}
      <div style={{
        textAlign: 'center',
        fontSize: '13px',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '12px',
      }}>
        {formatDisplayPrice(tempMinPrice)} - {formatDisplayPrice(tempMaxPrice)}
      </div>

      {/* Slider Container */}
      <div>
        <div
          ref={sliderRef}
          style={{
            position: 'relative',
            height: '6px',
            backgroundColor: '#e5e7eb',
            borderRadius: '3px',
            marginBottom: '10px',
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
              width: '16px',
              height: '16px',
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
              width: '16px',
              height: '16px',
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
          fontSize: '10px',
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
    </div>
  );
}
