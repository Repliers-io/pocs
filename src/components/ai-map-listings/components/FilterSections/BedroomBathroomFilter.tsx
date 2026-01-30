import React from 'react';

interface BedroomBathroomFilterProps {
  bedrooms: string;
  bathrooms: string;
  onBedroomsChange: (value: string) => void;
  onBathroomsChange: (value: string) => void;
}

export function BedroomBathroomFilter({
  bedrooms,
  bathrooms,
  onBedroomsChange,
  onBathroomsChange,
}: BedroomBathroomFilterProps) {
  const bedroomOptions = ['all', '0', '1', '2', '3', '4', '5+'];
  const bathroomOptions = ['all', '1+', '2+', '3+', '4+', '5+'];

  return (
    <div>
      {/* Bedrooms */}
      <div style={{ marginBottom: '16px' }}>
        <div
          style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#6b7280',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Bedrooms
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {bedroomOptions.map((option) => (
            <button
              key={option}
              onClick={() => onBedroomsChange(option)}
              style={{
                padding: '10px 18px',
                background: bedrooms === option ? '#6366f1' : 'white',
                color: bedrooms === option ? 'white' : '#374151',
                border: `1px solid ${
                  bedrooms === option ? '#6366f1' : '#d1d5db'
                }`,
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: bedrooms === option ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 200ms ease',
                minWidth: '48px',
              }}
              onMouseEnter={(e) => {
                if (bedrooms !== option) {
                  e.currentTarget.style.background = '#f3f4f6';
                  e.currentTarget.style.borderColor = '#9ca3af';
                }
              }}
              onMouseLeave={(e) => {
                if (bedrooms !== option) {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }
              }}
            >
              {option === 'all' ? 'Any' : option}
            </button>
          ))}
        </div>
      </div>

      {/* Bathrooms */}
      <div>
        <div
          style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#6b7280',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Bathrooms
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {bathroomOptions.map((option) => (
            <button
              key={option}
              onClick={() => onBathroomsChange(option)}
              style={{
                padding: '10px 18px',
                background: bathrooms === option ? '#6366f1' : 'white',
                color: bathrooms === option ? 'white' : '#374151',
                border: `1px solid ${
                  bathrooms === option ? '#6366f1' : '#d1d5db'
                }`,
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: bathrooms === option ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 200ms ease',
                minWidth: '48px',
              }}
              onMouseEnter={(e) => {
                if (bathrooms !== option) {
                  e.currentTarget.style.background = '#f3f4f6';
                  e.currentTarget.style.borderColor = '#9ca3af';
                }
              }}
              onMouseLeave={(e) => {
                if (bathrooms !== option) {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }
              }}
            >
              {option === 'all' ? 'Any' : option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
