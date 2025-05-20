import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ApiInput } from "@/components/api-input/api-input";
import { useState } from "react";

export function ZipCodeData() {
  const [apiKey, setApiKey] = useState("");
  const [zipCode, setZipCode] = useState("M1P3C2");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log("Raw API Key value:", apiKey);
      console.log("API Key length:", apiKey.length);
      console.log("API Key type:", typeof apiKey);

      const headers = {
        "REPLIERS-API-KEY": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "PostmanRuntime/7.43.4",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      };

      console.log("Request headers:", headers);

      const response = await fetch(`https://dev.repliers.io/listings`, {
        method: "POST",
        headers,
        body: JSON.stringify({ zipCode }),
      });

      console.log("Response status:", response.status);
      console.log("Response status text:", response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error response body:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const result = await response.json();
      setResponse(result);
      console.log("API Response:", result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <ApiInput onApiKeyChange={setApiKey} />

        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="M1P3C2"
            className="max-w-[200px]"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            required
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}
      </form>

      {response && (
        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Response Data</h2>
          <div className="space-y-4">
            {Object.entries(response).map(([key, value]) => (
              <div key={key} className="border-b pb-2 last:border-b-0">
                <h3 className="font-medium text-gray-700 capitalize">{key}</h3>
                <pre className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">
                  {typeof value === "object"
                    ? JSON.stringify(value, null, 2)
                    : String(value)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
