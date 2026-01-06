import React, { useState, useEffect, useCallback } from 'react';
import { ArrowForward, Bed, Bathtub, Straighten, AttachMoney } from '@mui/icons-material';

/**
 * AISearchInput - An expanded search interface with multiline input and entity chips
 *
 * @param {Object} props
 * @param {Function} props.onQueryChange - Callback fired when query changes (debounced by 500ms)
 * @param {Function} props.onSearch - Callback fired when search button is clicked
 * @param {string} props.placeholder - Placeholder text for the input
 * @param {string} props.initialValue - Initial value for the input
 * @param {Array} props.entities - Array of entity objects to display as chips (optional)
 * @param {string|number} props.width - Width of the component (default: '800px')
 */
const AISearchInput = ({
  onQueryChange,
  onSearch,
  placeholder = "Describe your dream home...",
  initialValue = "",
  entities = [],
  width = '800px'
}) => {
  const [query, setQuery] = useState(initialValue);
  const [isActive, setIsActive] = useState(false);

  // Inspiration suggestions
  const inspirationChips = [
    'blue kitchen',
    'pink everything',
    'sunken living room',
    'gothic mansion',
    'midcentury design',
    'huge mansions',
    'mountain views',
    'wine cellar'
  ];

  const searchExamples = [
    'Victorian townhouse with a freestanding bath and fireplace',
    '4 bed house with a treehouse, 1 hour commute from London',
    'Hackney warehouse conversion with exposed brick & high ceilings'
  ];

  // Debounce the query change callback
  useEffect(() => {
    if (!onQueryChange) return;

    const timeoutId = setTimeout(() => {
      onQueryChange(query);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, onQueryChange]);

  const handleInputChange = useCallback((event) => {
    setQuery(event.target.value);
  }, []);

  const handleFocus = useCallback(() => {
    setIsActive(true);
  }, []);

  const handleBlur = useCallback(() => {
    // Only deactivate if input is empty
    if (!query) {
      setIsActive(false);
    }
  }, [query]);

  const handleSearch = useCallback(() => {
    if (onSearch) {
      onSearch(query);
    }
  }, [query, onSearch]);

  const handleChipClick = useCallback((text) => {
    setQuery(text);
    setIsActive(true);
  }, []);

  // Icon mapping for entity types
  const getEntityIcon = (type) => {
    const iconClass = "text-base";
    switch (type) {
      case 'bedrooms':
        return <Bed className={iconClass} />;
      case 'bathrooms':
        return <Bathtub className={iconClass} />;
      case 'area':
        return <Straighten className={iconClass} />;
      case 'price':
        return <AttachMoney className={iconClass} />;
      default:
        return null;
    }
  };

  return (
    <div
      className="relative bg-white rounded-[32px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex flex-col transition-all duration-300"
      style={{ width }}
    >
      {/* Multiline Text Input - Fixed height */}
      <textarea
        className="w-full h-[175px] resize-none text-lg leading-relaxed text-gray-900 bg-gray-50 rounded-xl px-4 py-3
                   placeholder:text-gray-500 focus:outline-none border-0"
        value={query}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
      />

      {/* Expanded Content - Only show when active */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isActive ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}
      >
        {/* Entity Chips Section */}
        {entities.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {entities.map((entity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-[1.5px] border-purple-600 rounded-2xl
                             text-indigo-600 text-sm font-medium hover:bg-purple-50 transition-colors cursor-default"
                >
                  {getEntityIcon(entity.type)}
                  <span>{entity.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inspiration Section */}
        {entities.length === 0 && (
          <div className="pt-4 border-t border-gray-200 space-y-4">
            {/* Be inspired section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Be inspired...</h3>
              <div className="flex flex-wrap gap-2">
                {inspirationChips.map((chip, index) => (
                  <button
                    key={index}
                    onClick={() => handleChipClick(chip)}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full
                               hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Search examples section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Or try searching for...</h3>
              <div className="space-y-2">
                {searchExamples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleChipClick(example)}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg
                               hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Search Button */}
      <button
        onClick={handleSearch}
        aria-label="search"
        className="absolute -bottom-7 right-10 w-16 h-16 bg-indigo-600 text-white rounded-full
                   shadow-[0_4px_16px_rgba(79,70,229,0.3)] flex items-center justify-center z-10
                   hover:bg-indigo-700 hover:scale-105 transition-all duration-200"
      >
        <ArrowForward className="text-[28px]" />
      </button>
    </div>
  );
};

export default AISearchInput;
