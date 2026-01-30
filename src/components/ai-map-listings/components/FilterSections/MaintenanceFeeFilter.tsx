import React, { useState, useEffect, useCallback, useRef } from "react";

// Note: The type definition in types/index.ts is outdated. This component uses initialMin and initialMax
export interface MaintenanceFeeFilterProps {
  isOpen: boolean;
  initialMin: number;
  initialMax: number | null;
  onApply: (min: number, max: number | null) => void;
  onCancel: () => void;
  feeBreakpoints?: number[];
}

export function MaintenanceFeeFilter({
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
