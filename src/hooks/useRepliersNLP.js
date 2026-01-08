import { useState, useRef, useCallback } from 'react';

/**
 * useRepliersNLP - React hook for executing property searches using Repliers NLP and Listings APIs
 *
 * This hook provides a complete search flow:
 * 1. Send natural language query to NLP endpoint
 * 2. Get optimized search URL and parameters
 * 3. Execute search against Listings API
 * 4. Maintain conversation context for multi-turn refinement
 *
 * @param {string} apiKey - Repliers API key
 * @returns {Object} Search functionality and state
 *
 * @example
 * const { executeSearch, results, loading, error, resetConversation } = useRepliersNLP(apiKey);
 *
 * // First search
 * await executeSearch("3 bedroom condo in Toronto");
 * // results: { listings: [...], summary: "...", nlpId: "...", count: 10 }
 *
 * // Refine search (maintains context)
 * await executeSearch("under $800k");
 * // Uses previous nlpId for contextual refinement
 */
export function useRepliersNLP(apiKey) {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use ref to persist nlpId across renders without causing re-renders
  const nlpIdRef = useRef(null);

  const BASE_URL = 'https://api.repliers.io';

  /**
   * Execute complete search flow: NLP processing + Listings search
   *
   * @param {string} naturalLanguageQuery - User's search query
   * @returns {Promise<Object>} Search results with listings, summary, nlpId, count
   */
  const executeSearch = useCallback(async (naturalLanguageQuery) => {
    console.group('🧠 Repliers NLP Search');

    try {
      setLoading(true);
      setError(null);

      // Validation
      if (!naturalLanguageQuery || naturalLanguageQuery.trim() === '') {
        const errorMsg = 'Query is required';
        console.error('❌', errorMsg);
        setError(errorMsg);
        console.groupEnd();
        return;
      }

      if (!apiKey) {
        const errorMsg = 'Repliers API key not provided';
        console.error('❌', errorMsg);
        setError(errorMsg);
        console.groupEnd();
        return;
      }

      console.log('Query:', naturalLanguageQuery);
      console.log('Current nlpId:', nlpIdRef.current || 'none (new conversation)');

      // STEP 1: NLP Processing
      const nlpRequestBody = {
        prompt: naturalLanguageQuery,
        ...(nlpIdRef.current && { nlpId: nlpIdRef.current })
      };

      console.log('📤 NLP Request:', JSON.stringify(nlpRequestBody, null, 2));

      const nlpResponse = await fetch(`${BASE_URL}/nlp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'repliers-api-key': apiKey
        },
        body: JSON.stringify(nlpRequestBody)
      });

      console.log('NLP Response status:', nlpResponse.status);

      // Handle 406 - irrelevant query
      if (nlpResponse.status === 406) {
        const errorMsg = "This query doesn't seem to be about property search. Please try asking about homes, condos, or real estate.";
        console.error('❌ Query not relevant (406)');
        setError(errorMsg);
        console.groupEnd();
        return;
      }

      if (!nlpResponse.ok) {
        console.error(`❌ NLP API error: ${nlpResponse.status}`);
        setError('Search failed. Please try again.');
        console.groupEnd();
        return;
      }

      const nlpData = await nlpResponse.json();

      // Store nlpId for next query (conversation context)
      nlpIdRef.current = nlpData.nlpId;

      console.log('✅ NLP Response:');
      console.log('  - nlpId:', nlpData.nlpId);
      console.log('  - summary:', nlpData.summary);
      console.log('  - url:', nlpData.request.url);
      if (nlpData.request.body) {
        console.log('  - body:', JSON.stringify(nlpData.request.body, null, 2));
      }

      // STEP 2: Listings Search
      // Add select=* to get all fields from API
      const searchUrl = nlpData.request.url.includes('?')
        ? `${nlpData.request.url}&select=*`
        : `${nlpData.request.url}?select=*`;

      const hasBody = nlpData.request.body && Object.keys(nlpData.request.body).length > 0;
      const searchMethod = hasBody ? 'POST' : 'GET';

      console.log(`📤 Listings ${searchMethod}:`, searchUrl);
      if (hasBody) {
        console.log('  - body:', JSON.stringify(nlpData.request.body, null, 2));
      }

      const listingsResponse = await fetch(searchUrl, {
        method: searchMethod,
        headers: {
          'Content-Type': 'application/json',
          'repliers-api-key': apiKey
        },
        ...(hasBody && { body: JSON.stringify(nlpData.request.body) })
      });

      console.log('Listings Response status:', listingsResponse.status);

      if (!listingsResponse.ok) {
        console.error(`❌ Listings API error: ${listingsResponse.status}`);
        setError('Search failed. Please try again.');
        console.groupEnd();
        return;
      }

      const listingsData = await listingsResponse.json();
      const listings = listingsData.listings || [];

      console.log(`✅ Found ${listings.length} properties`);

      // Build results object
      const searchResults = {
        listings,
        summary: nlpData.summary,
        nlpId: nlpData.nlpId,
        count: listings.length
      };

      setResults(searchResults);
      console.groupEnd();

      return searchResults;

    } catch (err) {
      console.error('❌ Search error:', err);
      setError('Search failed. Please try again.');
      console.groupEnd();
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  /**
   * Reset conversation context and clear results
   * Call this to start a fresh conversation
   */
  const resetConversation = useCallback(() => {
    console.log('🔄 Resetting conversation context');
    nlpIdRef.current = null;
    setResults(null);
    setError(null);
  }, []);

  return {
    executeSearch,
    results,
    loading,
    error,
    conversationId: nlpIdRef.current,
    resetConversation
  };
}
