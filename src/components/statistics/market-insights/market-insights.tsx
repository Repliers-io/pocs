import React from "react";
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
import { ApiInput } from "@/components/api-input/api-input";
import { MLSReport } from "@/components/statistics/market-insights/mls-report";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";

// Types
type FormValues = z.infer<typeof formSchema>;

interface MarketInsightsProps {
  by: "mls#" | "address";
}

// Constants
const formSchema = z.object({
  mlsNumber: z.string().optional(),
  address: z.object({
    city: z.string(),
    streetName: z.string(),
    streetSuffix: z.string(),
    streetNumber: z.string(),
  }),
});

const initialValues: FormValues = {
  mlsNumber: "",
  address: {
    city: "toronto",
    streetName: "citation",
    streetSuffix: "dr",
    streetNumber: "77",
  },
};

const STREET_SUFFIXES = [
  "st",
  "rd",
  "ave",
  "blvd",
  "dr",
  "ln",
  "ct",
  "pl",
  "cir",
  "way",
  "ter",
  "pkwy",
  "sq",
  "hwy",
  "expy",
  "trl",
  "rdg",
  "run",
  "path",
  "pt",
  "cres",
  "crt",
  "cove",
  "grv",
  "hill",
  "hls",
  "holw",
  "isles",
  "isle",
  "jct",
  "knls",
  "knl",
  "lk",
  "lks",
  "land",
  "lndg",
  "mdws",
  "ml",
  "mews",
  "mnt",
  "mt",
  "mtn",
  "mtns",
  "orch",
  "oval",
  "park",
  "parks",
  "pass",
  "pike",
  "plaza",
  "plz",
  "prt",
  "prts",
  "radl",
  "ramp",
  "rnch",
  "row",
  "rue",
  "rvr",
  "shl",
  "shls",
  "shr",
  "shrs",
  "skwy",
  "spg",
  "spgs",
  "spur",
  "spurs",
  "sqr",
  "sqrs",
  "stn",
  "str",
  "stra",
  "strav",
  "strm",
  "strt",
  "sumit",
  "terr",
  "tpke",
  "trce",
  "trk",
  "trks",
  "trls",
  "tunl",
  "tunls",
  "turnpike",
  "un",
  "vly",
  "vlys",
  "via",
  "vis",
  "vist",
  "vsta",
  "vl",
  "vlg",
  "vlgs",
  "vlly",
  "walk",
  "walks",
  "wall",
  "way",
  "ways",
  "well",
  "wells",
  "xing",
  "xrd",
  "xrds",
]
  .sort((a, b) => a.localeCompare(b))
  .map((suffix) => ({ value: suffix, label: suffix }));

export function MarketInsights({ by }: MarketInsightsProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [apiKey, setApiKey] = React.useState("");
  const [listingData, setListingData] = React.useState<any>(null);
  const [nearbyListings, setNearbyListings] = React.useState<any[]>([]);
  const [showNearbyListings, setShowNearbyListings] = React.useState(false);
  const [totalNearbyCount, setTotalNearbyCount] = React.useState<number>(0);
  const [recentListings, setRecentListings] = React.useState<any[]>([]);
  const [showRecentListings, setShowRecentListings] = React.useState(false);
  const [recentSoldListings, setRecentSoldListings] = React.useState<any[]>([]);
  const [showRecentSoldListings, setShowRecentSoldListings] =
    React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const isWithinLastWeek = (dateString: string) => {
    const listingDate = new Date(dateString);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return listingDate >= oneWeekAgo;
  };

  const calculateDaysOnMarket = (listDate: string, soldDate: string) => {
    const list = new Date(listDate);
    const sold = new Date(soldDate);
    const diffTime = Math.abs(sold.getTime() - list.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const fetchNearbyListings = async (lat: number, long: number) => {
    try {
      // Fetch active listings
      const activeResponse = await fetch(
        `https://api.repliers.io/listings?lat=${lat}&long=${long}&radius=1&status=A`,
        {
          headers: {
            "REPLIERS-API-KEY": apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      if (!activeResponse.ok) {
        throw new Error(
          `API request failed with status ${activeResponse.status}`
        );
      }

      const activeData = await activeResponse.json();
      const listings = activeData.listings || [];
      setNearbyListings(listings);
      setTotalNearbyCount(activeData.count || 0);

      // Filter recent listings
      const recent = listings.filter((listing: any) =>
        isWithinLastWeek(listing.listDate)
      );
      setRecentListings(recent);

      // Fetch sold listings
      const soldResponse = await fetch(
        `https://api.repliers.io/listings?lat=${lat}&long=${long}&radius=1&status=U`,
        {
          headers: {
            "REPLIERS-API-KEY": apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      if (!soldResponse.ok) {
        throw new Error(
          `API request failed with status ${soldResponse.status}`
        );
      }

      const soldData = await soldResponse.json();
      const soldListings = soldData.listings || [];

      // Filter recent sold listings
      const recentSold = soldListings.filter(
        (listing: any) => listing.soldDate && isWithinLastWeek(listing.soldDate)
      );
      setRecentSoldListings(recentSold);
    } catch (err) {
      console.error("Error fetching nearby listings:", err);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      setError(null);
      setNearbyListings([]);
      setShowNearbyListings(false);
      setTotalNearbyCount(0);
      setRecentListings([]);
      setShowRecentListings(false);
      setRecentSoldListings([]);
      setShowRecentSoldListings(false);

      let response;
      if (by === "mls#") {
        response = await fetch(
          `https://api.repliers.io/listings/${data.mlsNumber}`,
          {
            headers: {
              "REPLIERS-API-KEY": apiKey,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        const params = new URLSearchParams({
          city: data.address.city,
          streetNumber: data.address.streetNumber,
          streetName: data.address.streetName,
          streetSuffix: data.address.streetSuffix,
        });
        response = await fetch(
          `https://api.repliers.io/listings?${params.toString()}`,
          {
            headers: {
              "REPLIERS-API-KEY": apiKey,
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Full API Response:", responseData);

      // Handle both response formats
      let listingData;
      if (by === "mls#") {
        listingData = responseData;
      } else {
        // For address search, get the first listing from the array
        if (!responseData.listings?.[0]) {
          throw new Error("No listing found with the provided information");
        }
        listingData = responseData.listings[0];
      }

      // Check if we got a valid listing
      if (!listingData || !listingData.listPrice) {
        throw new Error("No listing found with the provided information");
      }

      console.log("Final Listing Data:", listingData);
      setListingData(listingData);

      // Fetch nearby listings if we have coordinates
      console.log("Checking coordinates:", listingData?.map);
      if (listingData?.map?.latitude && listingData?.map?.longitude) {
        await fetchNearbyListings(
          listingData.map.latitude,
          listingData.map.longitude
        );
      } else {
        console.log("No coordinates available for nearby listings");
      }

      console.log("Form submitted:", data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <ApiInput onApiKeyChange={setApiKey} isEstimates={false} />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Property Information</h2>
          <div className="grid grid-cols-1 gap-4">
            {by === "mls#" ? (
              <FormField
                control={form.control}
                name="mlsNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>MLS Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter MLS number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <>
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
                <div className="grid grid-cols-2 gap-4">
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
                    name="address.streetSuffix"
                    render={({ field }) => {
                      console.log("Current field value:", field.value);
                      return (
                        <FormItem>
                          <FormLabel>Street Suffix</FormLabel>
                          <FormControl>
                            <Combobox
                              options={STREET_SUFFIXES}
                              value={field.value}
                              onValueChange={(value) => {
                                console.log("Combobox onValueChange:", value);
                                field.onChange(value);
                              }}
                              placeholder="Select street suffix"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
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
              </>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Loading..." : "Search"}
          </Button>

          {error && (
            <div className="p-4 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
              <h3 className="font-semibold mb-2">Error</h3>
              {error}
            </div>
          )}

          {listingData && <MLSReport listingData={listingData} />}

          {recentSoldListings.length > 0 && !showRecentSoldListings && (
            <div className="p-4 bg-purple-50 rounded-md border border-purple-200">
              <p className="text-sm text-purple-700 mb-2">
                Found {recentSoldListings.length} properties sold in the last 7
                days within 1km radius
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRecentSoldListings(true)}
                className="text-purple-700 hover:text-purple-800"
              >
                Show Recent Sales
              </Button>
            </div>
          )}

          {showRecentSoldListings && recentSoldListings.length > 0 && (
            <div className="p-4 bg-white rounded-md border">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-semibold">Recent Sales (Last 7 Days)</h3>
                  <p className="text-sm text-gray-500">
                    Within 1km radius of the property
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRecentSoldListings(false)}
                >
                  Hide
                </Button>
              </div>
              <div className="space-y-2">
                {recentSoldListings.map((listing, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-md hover:bg-gray-100"
                  >
                    <p className="font-medium">
                      {listing.address.streetNumber}{" "}
                      {listing.address.streetName}{" "}
                      {listing.address.streetSuffix}
                    </p>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div>
                        <p className="text-sm text-gray-600">List Price</p>
                        <p className="font-medium text-gray-700">
                          ${listing.listPrice.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Sold Price</p>
                        <p className="font-medium text-green-600">
                          ${listing.soldPrice.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Days on Market</p>
                        <p className="font-medium text-gray-700">
                          {calculateDaysOnMarket(
                            listing.listDate,
                            listing.soldDate
                          )}{" "}
                          days
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      Sold: {new Date(listing.soldDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recentListings.length > 0 && !showRecentListings && (
            <div className="p-4 bg-green-50 rounded-md border border-green-200">
              <p className="text-sm text-green-700 mb-2">
                Found {recentListings.length} new listings in the last 7 days
                within 1km radius
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRecentListings(true)}
                className="text-green-700 hover:text-green-800"
              >
                Show Recent Listings
              </Button>
            </div>
          )}

          {showRecentListings && recentListings.length > 0 && (
            <div className="p-4 bg-white rounded-md border">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-semibold">
                    Recent Listings (Last 7 Days)
                  </h3>
                  <p className="text-sm text-gray-500">
                    Within 1km radius of the property
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRecentListings(false)}
                >
                  Hide
                </Button>
              </div>
              <div className="space-y-2">
                {recentListings.map((listing, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-md hover:bg-gray-100"
                  >
                    <p className="font-medium">
                      {listing.address.streetNumber}{" "}
                      {listing.address.streetName}{" "}
                      {listing.address.streetSuffix}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-gray-600">
                        ${listing.listPrice.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Listed:{" "}
                        {new Date(listing.listDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {nearbyListings.length > 0 && !showNearbyListings && (
            <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
              <p className="text-sm text-blue-700 mb-2">
                Found {totalNearbyCount} active listings within 1km radius
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNearbyListings(true)}
                className="text-blue-700 hover:text-blue-800"
              >
                Show Nearby Listings
              </Button>
            </div>
          )}

          {showNearbyListings && nearbyListings.length > 0 && (
            <div className="p-4 bg-white rounded-md border">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-semibold">Nearby Active Listings</h3>
                  <p className="text-sm text-gray-500">
                    All active listings within 1km radius
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNearbyListings(false)}
                >
                  Hide
                </Button>
              </div>
              <div className="space-y-2">
                {nearbyListings.map((listing, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-md hover:bg-gray-100"
                  >
                    <p className="font-medium">
                      {listing.address.streetNumber}{" "}
                      {listing.address.streetName}{" "}
                      {listing.address.streetSuffix}
                    </p>
                    <p className="text-sm text-gray-600">
                      ${listing.listPrice.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </form>
    </Form>
  );
}
