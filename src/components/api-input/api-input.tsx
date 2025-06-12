import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface ApiInputProps {
  onApiKeyChange: (apiKey: string) => void;
  className?: string;
  isEstimates?: boolean;
}

export function ApiInput({
  onApiKeyChange,
  className,
  isEstimates,
}: ApiInputProps) {
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateApiKey = async (key: string) => {
    if (!key) return;

    setIsValidating(true);
    setValidationError(null);

    try {
      const endpoint = isEstimates
        ? "https://api.repliers.io/estimates"
        : "https://api.repliers.io/listings?area=toronto";

      const response = await fetch(endpoint, {
        method: "HEAD",
        headers: {
          "REPLIERS-API-KEY": key,
          Accept: "application/json",
        },
      });

      console.log("API Response Status:", response.status);
      console.log(
        "API Response Headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (response.status === 401) {
        setValidationError(
          "Invalid API key. Please check your key and try again."
        );
      } else if (response.status === 403) {
        setValidationError(
          isEstimates
            ? "Your API key doesn't have access to the estimates feature. Please upgrade your plan or contact Repliers support to request a trial."
            : "Your API key doesn't have access to the listings feature. Please upgrade your plan or contact Repliers support to request a trial."
        );
      } else if (!response.ok) {
        setValidationError("Failed to validate API key. Please try again.");
      }
    } catch (error) {
      console.error("API Error:", error);
      setValidationError("Failed to validate API key. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setApiKey(newValue);
    onApiKeyChange(newValue);

    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError(null);
    }

    // Validate after a short delay to avoid too many requests
    const timeoutId = setTimeout(() => {
      validateApiKey(newValue);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor="api-key" className="text-sm font-medium">
        Repliers API Key
      </label>
      <div className="flex gap-2 items-center">
        <Input
          id="api-key"
          type={showApiKey ? "text" : "password"}
          placeholder="Enter your API key..."
          className="max-w-[300px]"
          value={apiKey}
          onChange={handleChange}
          required
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setShowApiKey(!showApiKey)}
          className="h-10 w-10"
        >
          {showApiKey ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>

      {isValidating && (
        <p className="text-sm text-gray-500">Validating API key...</p>
      )}

      {validationError && (
        <p className="text-sm text-red-500">{validationError}</p>
      )}

      <p className="text-sm text-gray-500">
        Don't have a Repliers API key?{" "}
        <a
          href="https://repliers.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Get one here
        </a>
      </p>
    </div>
  );
}

// Google Places API Input Component
interface GooglePlacesApiInputProps {
  onApiKeyChange: (apiKey: string) => void;
  className?: string;
}

export function GooglePlacesApiInput({
  onApiKeyChange,
  className,
}: GooglePlacesApiInputProps) {
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateApiKey = async (key: string) => {
    if (!key) return;

    setIsValidating(true);
    setValidationError(null);

    try {
      // Test the API key by loading the Google Maps JavaScript API
      // This is the proper way to validate a client-side Google Maps API key
      const testPromise = new Promise<void>((resolve, reject) => {
        // Remove any existing test script
        const existingScript = document.querySelector(
          "script[data-test-google-api]"
        );
        if (existingScript) {
          existingScript.remove();
        }

        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&callback=__googleMapsApiTestCallback`;
        script.async = true;
        script.defer = true;
        script.setAttribute("data-test-google-api", "true");

        // Set up success callback
        (window as any).__googleMapsApiTestCallback = () => {
          // Clean up
          delete (window as any).__googleMapsApiTestCallback;
          script.remove();
          resolve();
        };

        // Handle script errors (invalid API key, quota exceeded, etc.)
        script.onerror = () => {
          // Clean up
          delete (window as any).__googleMapsApiTestCallback;
          script.remove();
          reject(
            new Error(
              "Failed to load Google Maps API - Invalid API key or configuration"
            )
          );
        };

        document.head.appendChild(script);

        // Timeout after 10 seconds
        setTimeout(() => {
          if ((window as any).__googleMapsApiTestCallback) {
            delete (window as any).__googleMapsApiTestCallback;
            script.remove();
            reject(new Error("Google Maps API validation timeout"));
          }
        }, 10000);
      });

      await testPromise;

      // If we get here, the API key is valid
      setValidationError(null);
    } catch (error) {
      console.error("Google Places API validation error:", error);

      if (error instanceof Error) {
        if (error.message.includes("Invalid API key")) {
          setValidationError(
            "Invalid Google Places API key. Please check your key and try again."
          );
        } else if (error.message.includes("timeout")) {
          setValidationError(
            "API key validation timed out. Please check your internet connection."
          );
        } else {
          setValidationError(
            "Failed to validate Google Places API key. Please ensure the key is valid and Places API is enabled."
          );
        }
      } else {
        setValidationError(
          "Failed to validate Google Places API key. Please check your key and try again."
        );
      }
    } finally {
      setIsValidating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setApiKey(newValue);
    onApiKeyChange(newValue);

    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError(null);
    }

    // Validate after a short delay to avoid too many requests
    const timeoutId = setTimeout(() => {
      validateApiKey(newValue);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor="google-places-api-key" className="text-sm font-medium">
        Google Places API Key
      </label>
      <div className="flex gap-2 items-center">
        <Input
          id="google-places-api-key"
          type={showApiKey ? "text" : "password"}
          placeholder="Enter your Google Places API key..."
          className="max-w-[300px]"
          value={apiKey}
          onChange={handleChange}
          required
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setShowApiKey(!showApiKey)}
          className="h-10 w-10"
        >
          {showApiKey ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>

      {isValidating && (
        <p className="text-sm text-gray-500">
          Validating Google Places API key...
        </p>
      )}

      {validationError && (
        <p className="text-sm text-red-500">{validationError}</p>
      )}

      <p className="text-sm text-gray-500">
        Don't have a Google Places API key?{" "}
        <a
          href="https://console.cloud.google.com/apis/credentials"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Get one here
        </a>{" "}
        (Enable Places API in Google Cloud Console)
      </p>
    </div>
  );
}
