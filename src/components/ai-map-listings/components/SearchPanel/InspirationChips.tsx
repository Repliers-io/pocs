import React from 'react';

interface InspirationChipsProps {
  onChipClick: (text: string) => void;
}

export function InspirationChips({ onChipClick }: InspirationChipsProps) {
  // Placeholder - will be fully implemented in Day 3
  return (
    <div
      style={{
        marginTop: '20px',
        paddingTop: '16px',
        borderTop: '1px solid #e5e7eb',
      }}
    >
      <div
        style={{
          fontSize: '12px',
          fontWeight: '600',
          color: '#6b7280',
          marginBottom: '10px',
        }}
      >
        Be inspired... ✨
      </div>
      <div style={{ fontSize: '13px', color: '#9ca3af' }}>
        Inspiration chips will appear here
      </div>
    </div>
  );
}
