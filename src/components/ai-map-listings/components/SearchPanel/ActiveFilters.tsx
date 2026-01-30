import React from 'react';
import type { FilterState } from './types';

interface ActiveFiltersProps {
  filters: Partial<FilterState>;
  onRemoveFilter: (key: keyof FilterState) => void;
}

export function ActiveFilters({ filters, onRemoveFilter }: ActiveFiltersProps) {
  // Placeholder - will be fully implemented in Day 2
  return (
    <div
      style={{
        padding: '0 24px 12px 24px',
        paddingTop: '12px',
        borderTop: '1px solid #e5e7eb',
        fontSize: '13px',
        color: '#6b7280',
      }}
    >
      {/* Active filter chips will be displayed here */}
    </div>
  );
}
