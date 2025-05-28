import React, { ChangeEvent, useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// UI Components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiInput } from "@/components/api-input/api-input";

// Types
type FormValues = z.infer<typeof formSchema>;

// Constants
const formSchema = z.object({
  address: z.object({
    city: z.string(),
    streetName: z.string(),
    streetNumber: z.string(),
    zip: z.string(),
  }),
  details: z.object({
    basement1: z.string(),
    driveway: z.string(),
    exteriorConstruction1: z.string(),
    exteriorConstruction2: z.string(),
    extras: z.array(z.string()),
    heating: z.string(),
    numBathrooms: z.number(),
    numBedrooms: z.number(),
    numFireplaces: z.number(),
    numGarageSpaces: z.number(),
    numParkingSpaces: z.number(),
    propertyType: z.string(),
    sqft: z.number(),
    style: z.string(),
    swimmingPool: z.string(),
    yearBuilt: z.string(),
  }),
  lot: z.object({
    depth: z.number(),
    width: z.number(),
  }),
  taxes: z.object({
    annualAmount: z.number(),
  }),
});

const initialValues: FormValues = {
  address: {
    city: "King City",
    streetName: "Clearview Heights",
    streetNumber: "106",
    zip: "L7B 1H6",
  },
  details: {
    basement1: "Finished",
    driveway: "private",
    exteriorConstruction1: "Brick",
    exteriorConstruction2: "Brick",
    extras: [
      "Large Open Concept Principal Rooms. Master Bedroom Features Hardwood Floors, 6Pc Ensuite And Walkout To Balcony Overlooking Beautiful And Peaceful Backyard. Walkout From Dining Room To Private Deck For Entertaining.",
    ],
    heating: "gas forced air open",
    numBathrooms: 2,
    numBedrooms: 4,
    numFireplaces: 1,
    numGarageSpaces: 2,
    numParkingSpaces: 6,
    propertyType: "Detached",
    sqft: 2000,
    style: "1 1/2 Storey",
    swimmingPool: "inground",
    yearBuilt: "51-99",
  },
  lot: {
    depth: 132,
    width: 100,
  },
  taxes: {
    annualAmount: 8000,
  },
};

// Dropdown options
const DROPDOWN_OPTIONS = {
  "details.propertyType": [
    "Detached",
    "Condo Apt",
    "Att/Row/Twnhouse",
    "Office",
    "Condo Townhouse",
    "Commercial/Retail",
    "Vacant Land",
    "Industrial",
    "Semi-Detached",
    "Sale Of Business",
    "Land",
    "Multiplex",
    "Investment",
    "Duplex",
    "Farm",
    "Comm Element Condo",
    "Other",
    "Triplex",
    "Store W/Apt/Office",
    "Mobile/Trailer",
    "Rural Resid",
    "Lower Level",
    "Fourplex",
    "Co-Op Apt",
    "Link",
    "Parking Space",
    "Upper Level",
    "Det Condo",
    "Modular Home",
    "Vacant Land Condo",
    "Semi-Det Condo",
    "Leasehold Condo",
    "Co-Ownership Apt",
    "Room",
    "Locker",
    "Time Share",
    "Shared Room",
    "Phased Condo",
  ],
  "details.basement1": [
    "None",
    "Finished",
    "Full",
    "Unfinished",
    "Fin W/O",
    "Apartment",
    "Sep Entrance",
    "Part Fin",
    "Crawl Space",
    "Part Bsmt",
    "W/O",
    "Other",
    "Unknown",
    "Walk-Up",
    "Development Potential",
    "Half",
    "Exposed Rock",
  ],
  "details.driveway": [
    "private",
    "pvt double",
    "available",
    "none",
    "front yard",
    "private triple",
    "lane",
    "mutual",
    "other",
    "circular",
    "inside entry",
    "pvt double, other",
    "unknown",
    "available, private",
    "private, other",
    "private, pvt double",
    "inside entry, pvt double",
    "pvt double, inside entry",
    "street only",
    "front yard, private",
    "inside entry, private",
    "circular, private",
    "available, pvt double",
    "lane, private",
    "front yard, pvt double",
    "reserved/assigned",
  ],
  "details.exteriorConstruction1": [
    "Brick",
    "Concrete",
    "Vinyl Siding",
    "Stone",
    "Alum Siding",
    "Stucco/Plaster",
    "Brick Front",
    "Wood",
    "Other",
    "Board & Batten",
    "Metal/Side",
    "Brick Veneer",
    "Unknown",
    "Concrete Block",
    "Concrete Poured",
    "Log",
    "Hardboard",
    "Shingle",
    "Cedar",
    "Insulbrick",
    "Asbestos Siding",
  ],
  "details.exteriorConstruction2": [
    "Vinyl Siding",
    "Stone",
    "Brick",
    "Stucco/Plaster",
    "Concrete",
    "Other",
    "Wood",
    "Alum Siding",
    "Metal/Side",
    "Brick Front",
    "Shingle",
    "Board & Batten",
    "Brick Veneer",
    "Concrete Block",
    "Concrete Poured",
    "Hardboard",
    "Cedar",
    "Log",
    "Insulbrick",
    "Asbestos Siding",
  ],
  "details.heating": [
    "forced air",
    "gas forced air open",
    "gas forced air closd",
    "baseboard",
    "heat pump",
    "radiant",
    "other",
    "fan coil",
    "unknown",
    "water",
    "elec forced air",
    "gas hot water",
    "none",
    "propane gas",
    "water radiators",
    "oil forced air",
    "elec hot water",
    "oil hot water",
    "solar",
    "woodburning",
  ],
  "details.style": [
    "2-Storey",
    "Apartment",
    "Bungalow",
    "Office",
    "Other",
    "3-Storey",
    "Retail",
    "Bungalow-Raised",
    "1 1/2 Storey",
    "1 Storey/Apt",
    "Without Property",
    "Multi-Unit",
    "Designated",
    "Free Standing",
    "Multi-Use",
    "Stacked Townhouse",
    "2 1/2 Storey",
    "Unknown",
    "Bungaloft",
    "Industrial Condo",
    "Backsplit 4",
    "Commercial Condo",
    "Backsplit 3",
    "Multi-Level",
    "Sidesplit 4",
    "Store With Apt/Office",
    "Agricultural",
    "Sidesplit 3",
    "Sidesplit",
    "Loft",
    "With Property",
    "Service",
    "Bachelor/Studio",
    "Backsplit 5",
    "Highway Commercial",
    "Raw (Outside Official Plan)",
    "Accommodation",
    "Sidesplit 5",
    "Chalet",
    "Institutional",
    "Log",
    "Recreational",
    "Industrial",
    "Contemporary",
    "Garden House",
    "Industrial Loft",
    "Food Related",
    "Mixed",
  ],
  "details.swimmingPool": [
    "none",
    "inground",
    "abv grnd",
    "inground, salt",
    "community",
    "indoor",
    "other",
    "on ground",
    "inground, outdoor",
    "community, inground",
    "salt, inground",
    "outdoor",
    "community, indoor",
    "abv grnd, outdoor",
    "abv grnd, salt",
    "community, outdoor",
    "indoor, inground",
    "inground, outdoor, salt",
    "salt",
    "community, inground, outdoor",
    "community, outdoor",
    "inground, salt, outdoor",
    "none, abv grnd",
    "none, on ground",
    "indoor, salt",
    "outdoor, inground",
    "inground, community, outdoor",
    "none, other",
    "community, indoor, outdoor",
    "community, inground, indoor",
    "community, inground, indoor, outdoor",
    "community, salt",
    "community, outdoor, inground",
    "indoor, outdoor",
    "outdoor, salt, inground",
    "community, inground, salt",
    "none, inground",
    "other, none",
    "outdoor, salt",
    "abv grnd, on ground",
    "community, indoor, inground",
    "community, indoor, inground, outdoor",
    "community, indoor, salt",
    "inground, indoor",
    "outdoor, abv grnd",
    "outdoor, inground, salt",
  ],
  "details.yearBuilt": [
    "0-5",
    "new",
    "31-50",
    "16-30",
    "51-99",
    "6-15",
    "100+",
    "6-10",
    "11-15",
  ],
} as const;

export function EstimatesForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [apiKey, setApiKey] = useState("");
  const responseRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (response && responseRef.current) {
      responseRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [response]);

  async function onSubmit(data: FormValues) {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`https://api.repliers.io/estimates`, {
        method: "POST",
        headers: {
          "REPLIERS-API-KEY": apiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "PostmanRuntime/7.43.4",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "Invalid API key. Please check your key and try again."
          );
        } else if (response.status === 403) {
          throw new Error(
            "Your API key doesn't have access to the estimates feature. Please upgrade your plan or contact Repliers support to request a trial."
          );
        }
        throw new Error(`HTTP error! status: ${response.status}`);
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
  }

  const renderNumberInput = (
    field: {
      name:
        | `details.${keyof FormValues["details"]}`
        | `lot.${keyof FormValues["lot"]}`
        | `taxes.${keyof FormValues["taxes"]}`;
    },
    label: string
  ) => (
    <FormField
      control={form.control}
      name={field.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="number"
              {...field}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                field.onChange(Number(e.target.value))
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const renderSelectInput = (
    fieldName: keyof typeof DROPDOWN_OPTIONS,
    label: string
  ) => (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="max-h-60 overflow-y-auto">
              {DROPDOWN_OPTIONS[fieldName]?.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <ApiInput onApiKeyChange={setApiKey} isEstimates={true} />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Address Information</h2>
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="address.streetNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address.streetName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address.zip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ZIP Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Property Details</h2>
          <div className="grid grid-cols-2 gap-4">
            {renderSelectInput("details.propertyType", "Property Type")}
            {renderSelectInput("details.basement1", "Basement")}
            {renderSelectInput("details.driveway", "Driveway")}
            {renderSelectInput(
              "details.exteriorConstruction1",
              "Exterior Construction 1"
            )}
            {renderSelectInput(
              "details.exteriorConstruction2",
              "Exterior Construction 2"
            )}
            {renderSelectInput("details.heating", "Heating")}
            {renderNumberInput(
              { name: "details.numBathrooms" },
              "Number of Bathrooms"
            )}
            {renderNumberInput(
              { name: "details.numBedrooms" },
              "Number of Bedrooms"
            )}
            {renderNumberInput(
              { name: "details.numFireplaces" },
              "Number of Fireplaces"
            )}
            {renderNumberInput(
              { name: "details.numGarageSpaces" },
              "Number of Garage Spaces"
            )}
            {renderNumberInput(
              { name: "details.numParkingSpaces" },
              "Number of Parking Spaces"
            )}
            {renderNumberInput({ name: "details.sqft" }, "Square Footage")}
            {renderSelectInput("details.style", "Style")}
            {renderSelectInput("details.swimmingPool", "Swimming Pool")}
            {renderSelectInput("details.yearBuilt", "Year Built")}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Lot Information</h2>
          <div className="grid grid-cols-2 gap-4">
            {renderNumberInput({ name: "lot.depth" }, "Depth")}
            {renderNumberInput({ name: "lot.width" }, "Width")}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Tax Information</h2>
          <div className="grid grid-cols-2 gap-4">
            {renderNumberInput(
              { name: "taxes.annualAmount" },
              "Annual Tax Amount"
            )}
          </div>
        </div>

        <div className="space-y-4">
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Loading..." : "Submit"}
          </Button>

          {error && (
            <div className="p-4 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
              <h3 className="font-semibold mb-2">Error</h3>
              {error}
            </div>
          )}

          {response && (
            <div
              ref={responseRef}
              className="p-6 bg-white rounded-lg shadow-md"
            >
              <h3 className="text-xl font-semibold mb-4">Property Estimate</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">
                      Estimated Value
                    </p>
                    <p className="text-2xl font-bold text-blue-700">
                      ${Math.round(response.estimate).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">
                      Estimate Quality
                    </p>
                    <p className="text-2xl font-bold text-green-700">
                      {response.confidence <= 0.1
                        ? "Excellent"
                        : response.confidence <= 0.15
                        ? "Good"
                        : response.confidence <= 0.25
                        ? "Fair"
                        : "Poor"}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Error range: ±{(response.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 font-medium mb-2">
                    Value Range
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500">Low</p>
                      <p className="text-lg font-semibold text-gray-700">
                        ${Math.round(response.estimateLow).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-gray-400">→</div>
                    <div>
                      <p className="text-xs text-gray-500">High</p>
                      <p className="text-lg font-semibold text-gray-700">
                        ${Math.round(response.estimateHigh).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </Form>
  );
}
