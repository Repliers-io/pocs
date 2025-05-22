import React, { ChangeEvent, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ApiInput } from "@/components/api-input/api-input";

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
    numFireplaces: z.string(),
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

type FormValues = z.infer<typeof formSchema>;

const initialValues: FormValues = {
  address: {
    city: "King City",
    streetName: "Clearview Heights",
    streetNumber: "106",
    zip: "L7B 1H6",
  },
  details: {
    basement1: "Finished",
    driveway: "Private",
    exteriorConstruction1: "Brick",
    exteriorConstruction2: "Brick",
    extras: [
      "Large Open Concept Principal Rooms. Master Bedroom Features Hardwood Floors, 6Pc Ensuite And Walkout To Balcony Overlooking Beautiful And Peaceful Backyard. Walkout From Dining Room To Private Deck For Entertaining.",
    ],
    heating: "gas forced air open",
    numBathrooms: 2,
    numBedrooms: 4,
    numFireplaces: "y",
    numGarageSpaces: 2,
    numParkingSpaces: 6,
    propertyType: "detached",
    sqft: 2000,
    style: "1 1/2 Storey",
    swimmingPool: "Inground",
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

export function EstimatesForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [apiKey, setApiKey] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <ApiInput onApiKeyChange={setApiKey} />

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
            <FormField
              control={form.control}
              name="details.basement1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Basement</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="details.driveway"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Driveway</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="details.exteriorConstruction1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exterior Construction 1</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="details.exteriorConstruction2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exterior Construction 2</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="details.heating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Heating</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="details.numBathrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Bathrooms</FormLabel>
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
            <FormField
              control={form.control}
              name="details.numBedrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Bedrooms</FormLabel>
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
            <FormField
              control={form.control}
              name="details.numFireplaces"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Fireplaces</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="details.numGarageSpaces"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Garage Spaces</FormLabel>
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
            <FormField
              control={form.control}
              name="details.numParkingSpaces"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Parking Spaces</FormLabel>
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
            <FormField
              control={form.control}
              name="details.propertyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Type</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="details.sqft"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Square Footage</FormLabel>
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
            <FormField
              control={form.control}
              name="details.style"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Style</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="details.swimmingPool"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Swimming Pool</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="details.yearBuilt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year Built</FormLabel>
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
          <h2 className="text-lg font-semibold">Lot Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="lot.depth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Depth</FormLabel>
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
            <FormField
              control={form.control}
              name="lot.width"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Width</FormLabel>
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
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Tax Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="taxes.annualAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Annual Tax Amount</FormLabel>
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
            <div className="p-6 bg-white rounded-lg shadow-md">
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
                      Confidence Level
                    </p>
                    <p className="text-2xl font-bold text-green-700">
                      {(response.confidence * 100).toFixed(1)}%
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
