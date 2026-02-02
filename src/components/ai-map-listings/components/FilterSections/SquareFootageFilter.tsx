import React, { useState, useEffect, useCallback, useRef } from "react";
import type { SquareFootageFilterProps } from "../../types";

export function SquareFootageFilter({
  initialMin,
  initialMax,
  onApply,
  sqftBreakpoints = [0, 1000, 2000, 3000, 5000, Infinity]
}: SquareFootageFilterProps) {
  const [tempMinSqft, setTempMinSqft] = useState(initialMin);
  const [tempMaxSqft, setTempMaxSqft] = useState(initialMax);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset temp values when initial values change
  useEffect(() => {
    setTempMinSqft(initialMin);
    setTempMaxSqft(initialMax);
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
      const finalSqft = constrainedSqft === Infinity ? 0 : constrainedSqft;
      setTempMinSqft(finalSqft);
      debouncedApply(finalSqft, tempMaxSqft);
    } else if (isDragging === 'max') {
      const constrainedSqft = newSqft === null ? null : Math.max(newSqft, tempMinSqft);
      setTempMaxSqft(constrainedSqft);
      debouncedApply(tempMinSqft, constrainedSqft);
    }
  }, [isDragging, tempMinSqft, tempMaxSqft, getSqftFromPosition, debouncedApply]);

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
        const finalSqft = constrainedSqft === Infinity ? 0 : constrainedSqft;
        setTempMinSqft(finalSqft);
        debouncedApply(finalSqft, tempMaxSqft);
      } else {
        const constrainedSqft = newSqft === null ? null : Math.max(newSqft || 0, tempMinSqft);
        setTempMaxSqft(constrainedSqft);
        debouncedApply(tempMinSqft, constrainedSqft);
      }
    }
  }, [tempMinSqft, tempMaxSqft, getSliderPosition, getSqftFromPosition, debouncedApply]);

  const minPosition = getSliderPosition(tempMinSqft);
  const maxPosition = getSliderPosition(tempMaxSqft);

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
        {formatDisplaySqft(tempMinSqft)} - {formatDisplaySqft(tempMaxSqft)} sq ft
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
          fontSize: '10px',
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
    </div>
  );
}
