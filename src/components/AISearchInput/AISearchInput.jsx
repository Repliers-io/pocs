import React, { useState, useEffect, useCallback } from 'react';
import { ArrowForward } from '@mui/icons-material';
import { INSPIRATION_CHIPS, SEARCH_EXAMPLES } from './constants';
import { useOpenAIParser } from '../../hooks/useOpenAIParser';
import { useRepliersNLP } from '../../hooks/useRepliersNLP';

/**
 * AISearchInput - An expanded search interface with multiline input and inspiration chips
 *
 * @param {Object} props
 * @param {Function} props.onQueryChange - Callback fired when query changes (debounced by 500ms)
 * @param {Function} props.onSearch - Callback fired when search button is clicked (deprecated, use onSearchComplete)
 * @param {string} props.placeholder - Placeholder text for the input
 * @param {string} props.initialValue - Initial value for the input
 * @param {string|number} props.width - Width of the component (default: '800px')
 * @param {string} props.openaiApiKey - OpenAI API key for entity extraction
 * @param {string} props.repliersApiKey - Repliers API key for property search
 * @param {Function} props.onSearchComplete - Callback with results: { query, entities, results, summary, conversationId }
 */
const AISearchInput = ({
  onQueryChange,
  onSearch,
  placeholder = "Describe your dream home...",
  initialValue = "",
  width = '800px',
  openaiApiKey,
  repliersApiKey,
  onSearchComplete
}) => {
  const [query, setQuery] = useState(initialValue);
  const [isActive, setIsActive] = useState(false);
  const [keyErrors, setKeyErrors] = useState({ openai: null, repliers: null });
  const [cursorLine, setCursorLine] = useState(1);

  // Initialize hooks
  const { parseQuery, entities: parsedEntities, loading: parsing, error: parsingError } = useOpenAIParser(openaiApiKey);
  const { executeSearch, results, loading: searching, error: searchError } = useRepliersNLP(repliersApiKey);

  // Validate API keys on mount and when they change
  useEffect(() => {
    const errors = { openai: null, repliers: null };

    if (!openaiApiKey) {
      errors.openai = 'OpenAI API key is missing';
    } else if (!openaiApiKey.startsWith('sk-')) {
      errors.openai = 'OpenAI API key appears invalid (should start with "sk-")';
    }

    if (!repliersApiKey) {
      errors.repliers = 'Repliers API key is missing';
    }

    setKeyErrors(errors);
  }, [openaiApiKey, repliersApiKey]);

  // Monitor parsing errors from the hook
  useEffect(() => {
    if (parsingError) {
      setKeyErrors(prev => ({
        ...prev,
        openai: parsingError.includes('API key')
          ? 'OpenAI API key is invalid or unauthorized'
          : prev.openai
      }));
    }
  }, [parsingError]);

  // Monitor search errors from the hook
  useEffect(() => {
    if (searchError) {
      setKeyErrors(prev => ({
        ...prev,
        repliers: searchError.includes('API key') || searchError.includes('Repliers API key')
          ? 'Repliers API key is invalid or unauthorized'
          : prev.repliers
      }));
    }
  }, [searchError]);

  // Debounce the query change callback and trigger entity parsing
  useEffect(() => {
    if (!onQueryChange) return;

    const timeoutId = setTimeout(() => {
      onQueryChange(query);

      // Trigger entity parsing when user types
      if (query && query.trim()) {
        parseQuery(query);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, onQueryChange, parseQuery]);

  const handleInputChange = useCallback((event) => {
    const value = event.target.value;
    const target = event.target;
    setQuery(value);

    // Calculate cursor line position
    const textBeforeCursor = value.substring(0, target.selectionStart);
    const lineNumber = (textBeforeCursor.match(/\n/g) || []).length + 1;
    setCursorLine(lineNumber);
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

  const handleKeyUp = useCallback((event) => {
    // Update cursor line on arrow keys and clicks
    const target = event.target;
    const textBeforeCursor = target.value.substring(0, target.selectionStart);
    const lineNumber = (textBeforeCursor.match(/\n/g) || []).length + 1;
    setCursorLine(lineNumber);
  }, []);

  const handleClick = useCallback((event) => {
    // Update cursor line on clicks
    const target = event.target;
    const textBeforeCursor = target.value.substring(0, target.selectionStart);
    const lineNumber = (textBeforeCursor.match(/\n/g) || []).length + 1;
    setCursorLine(lineNumber);
  }, []);

  /**
   * Generate AI-assisted suggestions based on parsed entities
   * Returns natural language suggestions for "Be inspired" and search examples
   */
  const getAISuggestions = useCallback(() => {
    if (!parsedEntities || Object.keys(parsedEntities).length === 0) {
      return {
        inspirations: INSPIRATION_CHIPS,
        examples: SEARCH_EXAMPLES,
        hasAIAssist: false
      };
    }

    // Generate inspiration chips based on style preferences and amenities
    const inspirations = [];

    if (parsedEntities.style_preferences?.length > 0) {
      inspirations.push(...parsedEntities.style_preferences.slice(0, 3));
    }

    if (parsedEntities.amenities?.length > 0) {
      inspirations.push(...parsedEntities.amenities.slice(0, 3));
    }

    // Fill remaining with original inspiration chips
    while (inspirations.length < 8) {
      const remaining = INSPIRATION_CHIPS.filter(chip => !inspirations.includes(chip));
      if (remaining.length === 0) break;
      inspirations.push(remaining[Math.floor(Math.random() * remaining.length)]);
    }

    // Generate search examples based on extracted entities
    const examples = [];

    // Build example queries from entities
    const parts = [];

    if (parsedEntities.bedrooms) {
      parts.push(`${parsedEntities.bedrooms} bed`);
    }

    if (parsedEntities.property_type) {
      parts.push(parsedEntities.property_type.toLowerCase());
    } else {
      parts.push('house');
    }

    if (parsedEntities.amenities?.length > 0) {
      parts.push(`with ${parsedEntities.amenities.slice(0, 2).join(' & ')}`);
    }

    if (parsedEntities.location) {
      parts.push(`in ${parsedEntities.location}`);
    }

    if (parts.length >= 2) {
      examples.push(parts.join(' '));
    }

    // Fill remaining with original examples
    const remaining = SEARCH_EXAMPLES.filter(ex => !examples.includes(ex));
    examples.push(...remaining.slice(0, 3 - examples.length));

    return {
      inspirations: inspirations.slice(0, 8),
      examples: examples.slice(0, 3),
      hasAIAssist: true
    };
  }, [parsedEntities]);

  const { inspirations, examples, hasAIAssist } = getAISuggestions();

  const handleSearch = useCallback(async () => {
    if (!query || !query.trim()) return;

    // Execute search with natural language query
    const searchResultsData = await executeSearch(query);

    // Call parent callback with results
    if (searchResultsData && onSearchComplete) {
      const resultsData = {
        query,
        entities: parsedEntities,
        results: searchResultsData.listings,
        summary: searchResultsData.summary,
        conversationId: searchResultsData.nlpId
      };

      onSearchComplete(resultsData);
    }

    // Keep backward compatibility with onSearch callback
    if (onSearch) {
      onSearch(query);
    }
  }, [query, executeSearch, onSearchComplete, onSearch, parsedEntities]);

  const handleChipClick = useCallback((text) => {
    setQuery(text);
    setIsActive(true);
  }, []);

  // Calculate line height for error positioning (text-lg = 1.125rem, leading-relaxed = 1.625)
  const lineHeight = 1.125 * 1.625; // rem units
  const paddingTop = 0.75; // py-3 = 0.75rem

  return (
    <div
      className="relative bg-white rounded-[32px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex flex-col transition-all duration-300"
      style={{ width }}
    >
      {/* Textarea Container with Overlay */}
      <div className="relative">
        {/* Multiline Text Input - Fixed height */}
        <textarea
          className="w-full h-[175px] resize-none text-lg leading-relaxed text-gray-900 bg-gray-50 rounded-xl px-4 py-3
                     placeholder:text-gray-500 focus:outline-none border-0 relative z-10"
          style={{ background: 'transparent' }}
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyUp={handleKeyUp}
          onClick={handleClick}
          placeholder={placeholder}
        />

        {/* Background layer for textarea */}
        <div className="absolute inset-0 bg-gray-50 rounded-xl pointer-events-none z-0" />

        {/* Inline Error Messages Overlay */}
        {!searching && (keyErrors.openai || keyErrors.repliers) && (
          <div
            className="absolute left-0 right-0 px-4 pointer-events-none z-20"
            style={{
              top: `${paddingTop + (cursorLine * lineHeight)}rem`,
              transition: 'top 0.15s ease-out'
            }}
          >
            <div className="space-y-0.5">
              {keyErrors.openai && (
                <div className="flex items-center gap-1.5 text-xs text-red-600 opacity-75">
                  <span className="font-medium">⚠️</span>
                  <span>{keyErrors.openai}</span>
                </div>
              )}
              {keyErrors.repliers && (
                <div className="flex items-center gap-1.5 text-xs text-red-600 opacity-75">
                  <span className="font-medium">⚠️</span>
                  <span>{keyErrors.repliers}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Searching State Message */}
      {searching && (
        <div className="mt-2">
          <div className="flex items-center gap-2 text-sm text-indigo-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
            <span className="font-medium">Searching properties...</span>
          </div>
        </div>
      )}

      {/* Parsing indicator - subtle */}
      {parsing && query && (
        <div className="absolute top-2 right-2 text-xs text-gray-400 animate-pulse">
          Analyzing...
        </div>
      )}

      {/* Expanded Content - Only show when active */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isActive ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}
      >
        {/* Inspiration Section - Show when active */}
        {isActive && (
          <div className="pt-4 border-t border-gray-200 space-y-4">
            {/* Be inspired section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                Be inspired...
                {hasAIAssist && (
                  <span className="text-xs opacity-50">✨</span>
                )}
              </h3>
              <div className="flex flex-wrap gap-2">
                {inspirations.map((chip, index) => (
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
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                Or try searching for...
                {hasAIAssist && (
                  <span className="text-xs opacity-50">✨</span>
                )}
              </h3>
              <div className="space-y-2">
                {examples.map((example, index) => (
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
        disabled={searching || !query || keyErrors.openai || keyErrors.repliers}
        aria-label="search"
        title={
          keyErrors.openai || keyErrors.repliers
            ? 'Please provide valid API keys'
            : !query
            ? 'Enter a search query'
            : 'Search properties'
        }
        className="absolute -bottom-7 right-10 w-16 h-16 bg-indigo-600 text-white rounded-full
                   shadow-[0_4px_16px_rgba(79,70,229,0.3)] flex items-center justify-center z-10
                   hover:bg-indigo-700 hover:scale-105 transition-all duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {searching ? (
          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-white"></div>
        ) : (
          <ArrowForward className="text-[28px]" />
        )}
      </button>
    </div>
  );
};

export default AISearchInput;
