import React, { useEffect } from 'react';
import PropertyCard from './PropertyCard';
import { ENTITY_CONFIG } from './constants';

const ResultsPanel = ({
  isOpen,
  onClose,
  results,
  onPropertyClick,
  onRefineSearch
}) => {
  // ESC key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Don't render if no results
  if (!results) return null;

  const hasResults = results.results && results.results.length > 0;
  const resultsCount = results.results ? results.results.length : 0;

  // Animation classes
  const overlayClasses = `
    fixed inset-0 bg-black/50
    transition-opacity duration-300
    ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
    z-40
  `;

  const panelClasses = `
    fixed bottom-0 left-0 right-0
    h-[85vh] bg-white rounded-t-3xl shadow-2xl
    transform transition-transform duration-300 ease-out
    ${isOpen ? 'translate-y-0' : 'translate-y-full'}
    z-50 flex flex-col
  `;

  const handleRefine = () => {
    if (onRefineSearch) {
      onRefineSearch();
    }
    onClose();
  };

  const handlePropertyClick = (property) => {
    if (onPropertyClick) {
      onPropertyClick(property);
    }
  };

  // Render entity chips
  const renderEntityChips = () => {
    if (!results.entities || Object.keys(results.entities).length === 0) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {Object.entries(results.entities).map(([key, value]) => {
          const config = ENTITY_CONFIG[key];
          if (!config || !value) return null;

          // Format the display value
          let displayValue = value;
          if (key === 'price_min' || key === 'price_max') {
            displayValue = `$${value.toLocaleString()}`;
          }

          return (
            <div
              key={key}
              className="px-3 py-1 bg-gray-100 border border-gray-300 rounded-full text-sm flex items-center gap-1"
            >
              <span>{config.icon}</span>
              <span className="text-gray-700">
                {config.label}: {displayValue}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={overlayClasses}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className={panelClasses}>
        {/* Drag Handle */}
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mt-3" />

        {/* Header Section */}
        <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close results panel"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Title */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🏠</span>
            <h2 className="text-xl font-semibold text-gray-900">Search Results</h2>
          </div>

          {/* Summary */}
          {results.summary && (
            <p className="text-sm text-gray-600 mb-2">
              {results.summary}
            </p>
          )}

          {/* Results Count */}
          <p className="text-sm font-medium text-gray-700">
            Found {resultsCount} {resultsCount === 1 ? 'property' : 'properties'}
          </p>

          {/* Entity Chips and Refine Button */}
          <div className="flex flex-wrap items-center gap-3 mt-3">
            {renderEntityChips()}
            <button
              onClick={handleRefine}
              className="px-4 py-1.5 border border-indigo-600 text-indigo-600 rounded-full text-sm font-medium hover:bg-indigo-50 transition-colors"
            >
              Refine Search
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {hasResults ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.results.map((property) => (
                <PropertyCard
                  key={property.mlsNumber}
                  property={property}
                  onClick={handlePropertyClick}
                />
              ))}
            </div>
          ) : (
            // Empty State
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <span className="text-6xl mb-4">🏠</span>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No properties found
              </h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search criteria
              </p>
              <button
                onClick={handleRefine}
                className="px-6 py-2 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors"
              >
                Refine Search
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ResultsPanel;
