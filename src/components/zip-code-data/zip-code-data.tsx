import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ApiInput } from "@/components/api-input/api-input";
import { useState } from "react";

interface Address {
  area: string;
  city: string;
  country: string;
  streetName: string;
  streetNumber: string;
  streetSuffix: string;
  zip: string;
  state: string;
}

interface PriceHistory {
  listPrice: number;
  listDate: string;
  originalPrice: number;
  soldPrice: number | null;
  soldDate: string | null;
}

interface Estimate {
  high: number;
  low: number;
  value: number;
  date: string;
  confidence: number;
  history: {
    mth: {
      [key: string]: {
        value: number;
      };
    };
  };
}

interface FilteredListing {
  address: Address;
  priceHistory: PriceHistory;
  estimate?: Estimate;
}

export function ZipCodeData() {
  const [apiKey, setApiKey] = useState("");
  const [zipCode, setZipCode] = useState("M1P3C2");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<FilteredListing[]>([]);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(response, null, 2));
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const filterResponse = (data: any): FilteredListing[] => {
    if (!data.listings) return [];

    return data.listings.map((listing: any) => ({
      address: {
        area: listing.address.area,
        city: listing.address.city,
        country: listing.address.country,
        streetName: listing.address.streetName,
        streetNumber: listing.address.streetNumber,
        streetSuffix: listing.address.streetSuffix,
        zip: listing.address.zip,
        state: listing.address.state,
      },
      priceHistory: {
        listPrice: listing.listPrice,
        listDate: listing.listDate,
        originalPrice: listing.originalPrice,
        soldPrice: listing.soldPrice,
        soldDate: listing.soldDate,
      },
      estimate: listing.estimate
        ? {
            high: listing.estimate.high,
            low: listing.estimate.low,
            value: listing.estimate.value,
            date: listing.estimate.date,
            confidence: listing.estimate.confidence,
            history: listing.estimate.history,
          }
        : undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const headers = {
        "REPLIERS-API-KEY": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "PostmanRuntime/7.43.4",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      };

      const response = await fetch(`https://dev.repliers.io/listings`, {
        method: "POST",
        headers,
        body: JSON.stringify({ zipCode }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const result = await response.json();
      const filteredData = filterResponse(result);
      setResponse(filteredData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-CA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

      {response.length > 0 && (
        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Property Listings</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
              {copySuccess ? "Copied!" : "Copy Response"}
            </Button>
          </div>
          <div className="space-y-6">
            {response.map((listing, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <div className="mb-2">
                  <h3 className="font-medium text-gray-700">Address</h3>
                  <p className="text-sm text-gray-600">
                    {listing.address.streetNumber} {listing.address.streetName}{" "}
                    {listing.address.streetSuffix}
                    <br />
                    {listing.address.city}, {listing.address.state}{" "}
                    {listing.address.zip}
                    <br />
                    {listing.address.country}
                  </p>
                </div>
                <div className="mb-2">
                  <h3 className="font-medium text-gray-700">Price History</h3>
                  <div className="text-sm text-gray-600">
                    <p>
                      List Price:{" "}
                      {formatCurrency(listing.priceHistory.listPrice)}
                    </p>
                    <p>
                      Original Price:{" "}
                      {formatCurrency(listing.priceHistory.originalPrice)}
                    </p>
                    <p>
                      List Date: {formatDate(listing.priceHistory.listDate)}
                    </p>
                    {listing.priceHistory.soldPrice && (
                      <>
                        <p>
                          Sold Price:{" "}
                          {formatCurrency(listing.priceHistory.soldPrice)}
                        </p>
                        <p>
                          Sold Date:{" "}
                          {formatDate(listing.priceHistory.soldDate!)}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                {listing.estimate && (
                  <div>
                    <h3 className="font-medium text-gray-700">
                      Property Estimate
                    </h3>
                    <div className="text-sm text-gray-600">
                      <p>
                        Current Estimate:{" "}
                        {formatCurrency(listing.estimate.value)}
                      </p>
                      <p>
                        Estimate Range: {formatCurrency(listing.estimate.low)} -{" "}
                        {formatCurrency(listing.estimate.high)}
                      </p>
                      <p>
                        Confidence:{" "}
                        {(listing.estimate.confidence * 100).toFixed(1)}%
                      </p>
                      <p>Last Updated: {formatDate(listing.estimate.date)}</p>
                      <div className="mt-2">
                        <h4 className="font-medium text-gray-600">
                          Complete Price History
                        </h4>
                        <div className="space-y-1">
                          {Object.entries(listing.estimate.history.mth)
                            .sort(
                              ([dateA], [dateB]) =>
                                new Date(dateB).getTime() -
                                new Date(dateA).getTime()
                            )
                            .map(([date, data]) => (
                              <p key={date} className="text-sm">
                                {new Date(date).toLocaleDateString("en-CA", {
                                  year: "numeric",
                                  month: "short",
                                })}
                                : {formatCurrency(data.value)}
                              </p>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
