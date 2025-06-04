import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ApiInput } from "@/components/api-input/api-input";
import { useState } from "react";
import DataDisplay from "./data-display";
import { Eye, EyeOff } from "lucide-react";

interface InventoryForecast {
  month: string;
  value: number;
}

interface ProcessedData {
  zipCode: string;
  riskLevel: string;
  location: string;
  averagePrice: number;
  priceChange: number;
  sixMonthAverage: number;
  sixMonthChange: number;
  yearOverYearAverage: number;
  yearOverYearChange: number;
  currentInventory: number;
  daysOnMarket: number;
  inventoryForecast: InventoryForecast[];
}

type LoadingStep = "idle" | "fetching-repliers" | "analyzing-data" | "complete";

function calculatePriceMetrics(repliersData: any): {
  averagePrice: number;
  priceChange: number;
  sixMonthAverage: number;
  sixMonthChange: number;
  yearOverYearAverage: number;
  yearOverYearChange: number;
} {
  const monthlyPrices = repliersData.statistics.soldPrice.mth;
  const months = Object.keys(monthlyPrices).sort();

  // Remove the last month (current month) from our calculations
  const monthsToUse = months.slice(0, -1);

  // Get the most recent complete month's data (now the last month in our filtered array)
  const previousMonth = monthsToUse[monthsToUse.length - 1];
  const twoMonthsAgo = monthsToUse[monthsToUse.length - 2];

  // Calculate previous month's average price
  const averagePrice = monthlyPrices[previousMonth].avg;

  // Calculate price change between previous month and two months ago
  const previousPrice = monthlyPrices[previousMonth].avg;
  const twoMonthsAgoPrice = monthlyPrices[twoMonthsAgo].avg;
  const priceChange = Number(
    (((previousPrice - twoMonthsAgoPrice) / twoMonthsAgoPrice) * 100).toFixed(2)
  );

  // Calculate 6-month averages
  const last6Months = monthsToUse.slice(-6); // Get last 6 complete months
  const previous6Months = monthsToUse.slice(-12, -6); // Get the 6 months before that

  const sixMonthAverage =
    last6Months.reduce((sum, month) => sum + monthlyPrices[month].avg, 0) / 6;
  const previousSixMonthAverage =
    previous6Months.reduce((sum, month) => sum + monthlyPrices[month].avg, 0) /
    6;
  const sixMonthChange = Number(
    (
      ((sixMonthAverage - previousSixMonthAverage) / previousSixMonthAverage) *
      100
    ).toFixed(2)
  );

  // Calculate year-over-year averages
  const last12Months = monthsToUse.slice(-12); // Get last 12 complete months
  const previous12Months = monthsToUse.slice(-24, -12); // Get the 12 months before that

  const yearOverYearAverage =
    last12Months.reduce((sum, month) => sum + monthlyPrices[month].avg, 0) / 12;
  const previousYearOverYearAverage =
    previous12Months.reduce((sum, month) => sum + monthlyPrices[month].avg, 0) /
    12;
  const yearOverYearChange = Number(
    (
      ((yearOverYearAverage - previousYearOverYearAverage) /
        previousYearOverYearAverage) *
      100
    ).toFixed(2)
  );

  return {
    averagePrice,
    priceChange,
    sixMonthAverage,
    sixMonthChange,
    yearOverYearAverage,
    yearOverYearChange,
  };
}

export function AIInventoryForecast() {
  const [apiKey, setApiKey] = useState("");
  const [openaiApiKey, setOpenaiApiKey] = useState("");
  const [showOpenaiApiKey, setShowOpenaiApiKey] = useState(false);
  const [zipCode, setZipCode] = useState("94112");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<LoadingStep>("idle");
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(
    null
  );

  // Placeholder data for when no API response is available
  const placeholderData: ProcessedData = {
    zipCode: "Enter Zip Code",
    riskLevel: "N/A",
    location: "Location will appear here",
    averagePrice: 0,
    priceChange: 0,
    sixMonthAverage: 0,
    sixMonthChange: 0,
    yearOverYearAverage: 0,
    yearOverYearChange: 0,
    currentInventory: 0,
    daysOnMarket: 0,
    inventoryForecast: [
      { month: "Month 1", value: 0 },
      { month: "Month 2", value: 0 },
      { month: "Month 3", value: 0 },
    ],
  };

  const getStatusMessage = (step: LoadingStep) => {
    switch (step) {
      case "fetching-repliers":
        return "Fetching real estate data from Repliers...";
      case "analyzing-data":
        return "Analyzing market data with AI...";
      case "complete":
        return "Analysis complete!";
      default:
        return "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setProcessedData(null);
    setLoadingStep("fetching-repliers");

    try {
      // First API call to Repliers
      const repliersHeaders = {
        "REPLIERS-API-KEY": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "PostmanRuntime/7.43.4",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      };

      const repliersResponse = await fetch(
        `https://dev.repliers.io/listings?listings=false&statistics=cnt-available,avg-soldPrice,med-daysOnMarket,cnt-new,cnt-closed,grp-mth&type=sale&status=U&minSoldDate=2023-05-20&status=A&zip=${zipCode}`,
        {
          method: "GET",
          headers: repliersHeaders,
        }
      );

      if (!repliersResponse.ok) {
        const errorText = await repliersResponse.text();
        throw new Error(
          `Repliers API error! status: ${repliersResponse.status}, message: ${errorText}`
        );
      }

      const repliersData = await repliersResponse.json();
      setResponse(repliersData);
      console.log("Repliers Response:", repliersData);

      setLoadingStep("analyzing-data");

      // Calculate price metrics from Repliers data
      const priceMetrics = calculatePriceMetrics(repliersData);

      // Second API call to OpenAI for remaining analysis
      const openaiResponse = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful assistant that analyzes real estate data and returns structured insights in JSON format. Your analysis should be based on the provided Repliers data. IMPORTANT: Return ONLY the JSON object without any additional text, explanations, or markdown formatting. Use the exact field names and data types as specified.",
              },
              {
                role: "user",
                content:
                  `Analyze the following real estate data from Repliers and return ONLY a JSON object with the specified fields. The Repliers data contains these key metrics:\n` +
                  `- cnt-available: Number of listings available at the end of each month\n` +
                  `- cnt-closed: Number of listings sold in each month\n` +
                  `- cnt-new: Number of new listings added in each month\n` +
                  `- avg-soldPrice: Average sold price for each month\n` +
                  `- med-daysOnMarket: Median time to sell\n\n` +
                  `Target Zip Code: ${zipCode}\n\n` +
                  `Repliers Data: ${JSON.stringify(
                    repliersData,
                    null,
                    2
                  )}\n\n` +
                  `Return a JSON object with these exact fields and types:\n` +
                  `{\n` +
                  `  "zipCode": "string - use the provided zip code: ${zipCode}",\n` +
                  `  "riskLevel": "string - calculate based on trends in cnt-closed and avg-soldPrice",\n` +
                  `  "location": "string - city and state based on zip code ${zipCode}",\n` +
                  `  "currentInventory": "number - use the most recent cnt-available",\n` +
                  `  "daysOnMarket": "number - use the most recent med-daysOnMarket",\n` +
                  `  "inventoryForecast": [\n` +
                  `    {"month": "string - next month abbreviation", "value": "number - project based on cnt-new and cnt-closed trends"},\n` +
                  `    {"month": "string - month after next abbreviation", "value": "number - project based on cnt-new and cnt-closed trends"},\n` +
                  `    {"month": "string - third month abbreviation", "value": "number - project based on cnt-new and cnt-closed trends"}\n` +
                  `  ]\n` +
                  `}\n\n` +
                  `IMPORTANT:\n` +
                  `1. Return ONLY the JSON object with actual values\n` +
                  `2. Use the exact field names and types as shown above\n` +
                  `3. Calculate riskLevel based on trends in sales and prices\n` +
                  `4. For inventoryForecast, use trends in cnt-new and cnt-closed to project future inventory\n` +
                  `5. Use the provided zip code ${zipCode} for the zipCode and location fields\n` +
                  `6. No explanations, no markdown, no additional text`,
              },
            ],
            temperature: 0.2,
          }),
        }
      );

      if (!openaiResponse.ok) {
        const errorText = await openaiResponse.text();
        console.error("OpenAI Error Response:", errorText);
        throw new Error(
          `OpenAI API error! status: ${openaiResponse.status}, message: ${errorText}`
        );
      }

      const openaiData = await openaiResponse.json();
      console.log("OpenAI Response:", openaiData);

      const { choices } = openaiData;
      console.log("OpenAI Choices:", choices);
      console.log("Raw content from OpenAI:", choices[0].message.content);

      try {
        // First try to clean the response in case there are any markdown code blocks
        const cleanedContent = choices[0].message.content
          .replace(/```json\n?|\n?```/g, "")
          .trim();
        console.log("Cleaned content:", cleanedContent);

        const parsedProps = JSON.parse(cleanedContent);
        console.log("Parsed Props:", parsedProps);

        // Combine OpenAI analysis with our calculated price metrics
        const processedData: ProcessedData = {
          ...parsedProps,
          ...priceMetrics,
        };

        // Validate the processed data
        if (
          !processedData.zipCode ||
          !processedData.riskLevel ||
          !processedData.location ||
          !Array.isArray(processedData.inventoryForecast) ||
          processedData.inventoryForecast.length !== 3
        ) {
          console.error("Invalid data structure:", processedData);
          throw new Error("Invalid data structure returned from OpenAI");
        }

        setProcessedData(processedData);
        setLoadingStep("complete");
      } catch (parseError: unknown) {
        console.error("JSON Parse Error:", parseError);
        console.error("Failed to parse content:", choices[0].message.content);
        throw new Error(
          `Failed to parse OpenAI response: ${
            parseError instanceof Error ? parseError.message : "Unknown error"
          }`
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error:", err);
      setLoadingStep("idle");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <ApiInput onApiKeyChange={setApiKey} />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">OpenAI API Key</label>
          <div className="flex gap-2 items-center">
            <Input
              type={showOpenaiApiKey ? "text" : "password"}
              placeholder="OpenAI API Key"
              className="max-w-[300px]"
              value={openaiApiKey}
              onChange={(e) => setOpenaiApiKey(e.target.value)}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowOpenaiApiKey(!showOpenaiApiKey)}
              className="h-10 w-10"
            >
              {showOpenaiApiKey ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="95130"
            className="max-w-[200px]"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            required
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Get Data"}
          </Button>
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}
      </form>

      {loadingStep !== "idle" && (
        <div
          className={`text-sm font-medium ${
            loadingStep === "complete" ? "text-green-600" : "text-blue-600"
          }`}
        >
          {getStatusMessage(loadingStep)}
        </div>
      )}

      <DataDisplay {...(processedData || placeholderData)} />
    </div>
  );
}
