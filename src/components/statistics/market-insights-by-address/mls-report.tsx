import React from "react";
import { Button } from "@/components/ui/button";

interface MLSReportProps {
  listingData: any; // We can type this more specifically if needed
}

export function MLSReport({ listingData }: MLSReportProps) {
  return (
    <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">MLS Report</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(
                JSON.stringify(listingData, null, 2)
              );
            }}
          >
            Copy Formatted
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(listingData));
            }}
          >
            Copy Raw JSON
          </Button>
        </div>
      </div>
      <div className="space-y-6">
        {/* Property Overview */}
        <div className="bg-white p-4 rounded border">
          <h4 className="text-lg font-semibold mb-3">Property Overview</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">MLS Number</p>
              <p className="font-medium">{listingData.mlsNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">List Price</p>
              <p className="font-medium">
                ${listingData.listPrice.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Property Type</p>
              <p className="font-medium">{listingData.details.propertyType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Style</p>
              <p className="font-medium">{listingData.details.style}</p>
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="bg-white p-4 rounded border">
          <h4 className="text-lg font-semibold mb-3">Location Details</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-medium">
                {listingData.address.streetNumber}{" "}
                {listingData.address.streetName}{" "}
                {listingData.address.streetSuffix}
              </p>
              <p className="font-medium">
                {listingData.address.city}, {listingData.address.state}{" "}
                {listingData.address.zip}
              </p>
              {listingData.map?.latitude && listingData.map?.longitude && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Coordinates</p>
                  <p className="font-medium">
                    {listingData.map.latitude.toFixed(6)},{" "}
                    {listingData.map.longitude.toFixed(6)}
                  </p>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-600">Neighborhood</p>
              <p className="font-medium">{listingData.address.neighborhood}</p>
              <p className="text-sm text-gray-600 mt-2">Major Intersection</p>
              <p className="font-medium">
                {listingData.address.majorIntersection}
              </p>
            </div>
          </div>
        </div>

        {/* Property Specifications */}
        <div className="bg-white p-4 rounded border">
          <h4 className="text-lg font-semibold mb-3">
            Property Specifications
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Bedrooms</p>
              <p className="font-medium">
                {listingData.details.numBedrooms} +{" "}
                {listingData.details.numBedroomsPlus}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Bathrooms</p>
              <p className="font-medium">{listingData.details.numBathrooms}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Square Footage</p>
              <p className="font-medium">{listingData.details.sqft}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Garage Spaces</p>
              <p className="font-medium">
                {listingData.details.numGarageSpaces}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Year Built</p>
              <p className="font-medium">{listingData.details.yearBuilt}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Lot Size</p>
              <p className="font-medium">
                {listingData.lot.width}' x {listingData.lot.depth}'
              </p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-white p-4 rounded border">
          <h4 className="text-lg font-semibold mb-3">Key Features</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <ul className="list-disc list-inside space-y-1">
                <li>Air Conditioning: {listingData.details.airConditioning}</li>
                <li>Heating: {listingData.details.heating}</li>
                <li>Basement: {listingData.details.basement1}</li>
                <li>Central Vacuum: {listingData.details.centralVac}</li>
                <li>Fireplaces: {listingData.details.numFireplaces}</li>
              </ul>
            </div>
            <div>
              <ul className="list-disc list-inside space-y-1">
                <li>Garage Type: {listingData.details.garage}</li>
                <li>Exterior: {listingData.details.exteriorConstruction1}</li>
                <li>Foundation: {listingData.details.foundationType}</li>
                <li>Roof: {listingData.details.roofMaterial}</li>
                <li>Water Source: {listingData.details.waterSource}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Market History */}
        <div className="bg-white p-4 rounded border">
          <h4 className="text-lg font-semibold mb-3">Market History</h4>
          <div className="space-y-6">
            {listingData.history.map((entry: any, index: number) => (
              <div
                key={index}
                className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h5 className="font-semibold text-lg">
                      {entry.lastStatus === "Sold" ? "Sold" : "Listed"} on{" "}
                      {new Date(entry.listDate).toLocaleDateString()}
                    </h5>
                    <p className="text-sm text-gray-600">
                      MLS #{entry.mlsNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      ${entry.listPrice.toLocaleString()}
                    </p>
                    {entry.lastStatus === "Sold" && entry.soldPrice && (
                      <p className="text-sm text-gray-600">
                        Sold for ${entry.soldPrice.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-medium">{entry.lastStatus}</p>
                  </div>
                  {entry.dom && (
                    <div>
                      <p className="text-sm text-gray-600">Days on Market</p>
                      <p className="font-medium">{entry.dom}</p>
                    </div>
                  )}
                  {entry.soldDate && (
                    <div>
                      <p className="text-sm text-gray-600">Sold Date</p>
                      <p className="font-medium">
                        {new Date(entry.soldDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {entry.originalPrice &&
                    entry.originalPrice !== entry.listPrice && (
                      <div>
                        <p className="text-sm text-gray-600">Original Price</p>
                        <p className="font-medium">
                          ${entry.originalPrice.toLocaleString()}
                        </p>
                      </div>
                    )}
                </div>

                {entry.description && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="text-sm mt-1">{entry.description}</p>
                  </div>
                )}

                {entry.latitude && entry.longitude && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Latitude</p>
                      <p className="font-medium">{entry.latitude}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Longitude</p>
                      <p className="font-medium">{entry.longitude}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
