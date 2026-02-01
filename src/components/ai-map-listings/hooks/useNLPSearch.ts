import { useState } from 'react';

export interface Location {
  locationId: string;
  name: string;
  type: 'neighborhood' | 'city' | 'area' | 'state' | 'country';
  map: {
    latitude: string;
    longitude: string;
    point: string;
    boundary?: number[][][];
  };
  address: {
    state?: string;
    country?: string;
    city?: string;
    area?: string;
    neighborhood?: string;
  };
}

export interface NLPResponse {
  request: {
    url: string;
    body: {
      imageSearchItems?: Array<{
        type: 'text' | 'image';
        value: string;
        boost: number;
      }>;
    } | null;
    summary: string;
    locations?: Location[];
  };
  nlpId: string;
}

interface UseNLPSearchReturn {
  processSearch: (prompt: string) => Promise<NLPResponse | null>;
  isProcessing: boolean;
  error: string | null;
  nlpId: string | null;
  resetNlpId: () => void;
}

export function useNLPSearch(apiKey: string): UseNLPSearchReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nlpId, setNlpId] = useState<string | null>(null);

  const processSearch = async (prompt: string): Promise<NLPResponse | null> => {
    if (!prompt.trim()) {
      setError('Please enter a search query');
      return null;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const requestBody = {
        prompt: prompt.trim(),
        ...(nlpId && { nlpId }),
      };

      console.log('🔍 NLP Request:', requestBody);

      const response = await fetch('https://api.repliers.io/nlp', {
        method: 'POST',
        headers: {
          'REPLIERS-API-KEY': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.status === 406) {
        throw new Error(
          'That doesn\'t seem to be a property search. Try something like "2 bedroom condo in Toronto"'
        );
      }

      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your Repliers API key.');
      }

      if (response.status === 429) {
        throw new Error('Too many requests. Please wait a moment and try again.');
      }

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status} ${response.statusText}`);
      }

      const data: NLPResponse = await response.json();

      console.log('✅ FULL NLP RESPONSE:', JSON.stringify(data, null, 2));
      console.log('📊 NLP Response Breakdown:', {
        nlpId: data.nlpId,
        url: data.request.url,
        summary: data.request.summary,
        body: data.request.body,
        imageSearchItems: data.request.body?.imageSearchItems,
        locations: data.request.locations,
        fullResponse: data,
      });

      setNlpId(data.nlpId);

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const resetNlpId = () => {
    setNlpId(null);
  };

  return {
    processSearch,
    isProcessing,
    error,
    nlpId,
    resetNlpId,
  };
}
