import { useState, useCallback } from 'react';
import { EXTRACT_ENTITIES_FUNCTION } from '../components/AISearchInput/constants';

/**
 * Hook for parsing natural language queries into structured entities using OpenAI's API
 *
 * @param {string} apiKey - OpenAI API key
 * @returns {Object} - { parseQuery, entities, loading, error, clearEntities }
 *
 * @example
 * const { parseQuery, entities, loading, error } = useOpenAIParser(apiKey);
 * await parseQuery("3 bedroom condo in Toronto under $800k");
 * // entities = { location: "Toronto", bedrooms: 3, property_type: "Condo", price_max: 800 }
 */
export function useOpenAIParser(apiKey) {
  const [entities, setEntities] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Parse a natural language query into structured entities
   * @param {string} query - Natural language search query
   * @returns {Promise<Object>} - Extracted entities
   */
  const parseQuery = useCallback(async (query) => {
    console.group('🤖 OpenAI Entity Extraction');

    try {
      // Validate inputs
      if (!query || query.trim() === '') {
        console.log('⚠️ Empty query provided, skipping API call');
        setEntities({});
        console.groupEnd();
        return {};
      }

      if (!apiKey) {
        console.warn('⚠️ No OpenAI API key provided. Entity extraction will not work.');
        console.groupEnd();
        return {};
      }

      console.log('Query:', query);
      setLoading(true);
      setError(null);

      // Call OpenAI API with function calling
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a real estate search parameter extractor. Extract only the parameters that are explicitly mentioned or strongly implied in the user\'s query. Be precise with locations and property details.'
            },
            {
              role: 'user',
              content: query
            }
          ],
          tools: [
            {
              type: 'function',
              function: EXTRACT_ENTITIES_FUNCTION
            }
          ],
          tool_choice: {
            type: 'function',
            function: { name: 'extract_search_entities' }
          },
          temperature: 0.3,
          max_tokens: 200
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      // Extract entities from tool call
      const toolCalls = data.choices?.[0]?.message?.tool_calls;

      if (toolCalls && toolCalls.length > 0) {
        const functionCall = toolCalls[0];
        if (functionCall.function.name === 'extract_search_entities') {
          const extractedEntities = JSON.parse(functionCall.function.arguments);
          console.log('✅ Extracted entities:', extractedEntities);
          setEntities(extractedEntities);
          console.groupEnd();
          return extractedEntities;
        }
      }

      // No tool call found
      console.log('⚠️ No tool call in response, returning empty entities');
      setEntities({});
      console.groupEnd();
      return {};

    } catch (err) {
      const errorMessage = err.message || 'Failed to parse query';
      console.error('❌ Error:', errorMessage);
      console.error('Error details:', err);
      setError(errorMessage);
      setEntities({});
      console.groupEnd();
      return {};
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  /**
   * Clear all extracted entities
   */
  const clearEntities = useCallback(() => {
    setEntities({});
    setError(null);
  }, []);

  return {
    parseQuery,
    entities,
    loading,
    error,
    clearEntities
  };
}
