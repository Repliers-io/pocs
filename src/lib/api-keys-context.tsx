"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ApiKeysContextType {
  repliersApiKey: string;
  setRepliersApiKey: (key: string) => void;
  clearRepliersApiKey: () => void;
}

const ApiKeysContext = createContext<ApiKeysContextType | null>(null);

const STORAGE_KEY = "repliers-api-key";

export function ApiKeysProvider({ children }: { children: React.ReactNode }) {
  const [repliersApiKey, setRepliersApiKeyState] = useState("");

  // Load API key from sessionStorage on mount
  useEffect(() => {
    const storedRepliersKey = sessionStorage.getItem(STORAGE_KEY);

    if (storedRepliersKey) {
      setRepliersApiKeyState(storedRepliersKey);
    }
  }, []);

  const setRepliersApiKey = (key: string) => {
    setRepliersApiKeyState(key);
    if (key) {
      sessionStorage.setItem(STORAGE_KEY, key);
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  };

  const clearRepliersApiKey = () => {
    setRepliersApiKeyState("");
    sessionStorage.removeItem(STORAGE_KEY);
  };

  return (
    <ApiKeysContext.Provider
      value={{
        repliersApiKey,
        setRepliersApiKey,
        clearRepliersApiKey,
      }}
    >
      {children}
    </ApiKeysContext.Provider>
  );
}

export function useApiKeys() {
  const context = useContext(ApiKeysContext);
  if (!context) {
    throw new Error("useApiKeys must be used within an ApiKeysProvider");
  }
  return context;
}

// For backward compatibility and clearer usage
export const useRepliersApiKey = useApiKeys;
