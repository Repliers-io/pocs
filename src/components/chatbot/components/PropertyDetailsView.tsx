import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Note: We're using a flexible interface that accepts any property structure
interface PropertyListing {
  mlsNumber?: string;
  listPrice?: number;
  address?: any;
  price?: number;
  beds?: number;
  baths?: number;
  sqft?: number | string;
  yearBuilt?: number;
  propertyType?: string;
  status?: string;
  standardStatus?: string;
  bedrooms?: number;
  bathrooms?: number;
  details?: any;
  images?: string[];
  daysOnMarket?: number;
  simpleDaysOnMarket?: number;
  listDate?: string;
  description?: string;
  condominium?: any;
  office?: any;
  taxes?: any;
  timestamps?: any;
  nearby?: any;
  [key: string]: any;
}

export interface PropertyDetailsViewProps {
  listing: PropertyListing;
}

/**
 * PropertyDetailsView Component
 *
 * Beautiful property details display with hero gallery, organized sections,
 * and comprehensive property information following Repliers best practices.
 */
export function PropertyDetailsView({ listing }: PropertyDetailsViewProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Helper functions
  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`;
  };

  const formatAddress = (address: any) => {
    if (typeof address === "string") return address;
    if (!address || typeof address !== "object") return "Address not available";

    const parts = [];
    if (address.unitNumber) parts.push(`#${address.unitNumber}`);
    if (address.streetNumber) parts.push(address.streetNumber);
    if (address.streetName) parts.push(address.streetName);
    if (address.streetSuffix) parts.push(address.streetSuffix);

    const streetAddress = parts.join(" ");
    const city = address.city || "";
    const province = address.state || address.province || "";
    const zip = address.zip || address.postalCode || "";

    return `${streetAddress}${city ? `, ${city}` : ""}${province ? `, ${province}` : ""}${zip ? ` ${zip}` : ""}`;
  };

  // Extract and format images using Repliers CDN
  // Per https://help.repliers.com/en/article/listing-images-implementation-guide-198p8u8/
  const getImageUrl = (imagePath: string, size: "small" | "medium" | "large" = "medium") => {
    if (imagePath.includes("cdn.repliers.io")) return imagePath;
    // Images array contains the full path (e.g., "area/IMG-N8418368_1.jpg")
    // Just prepend CDN base and append size class
    return `https://cdn.repliers.io/${imagePath}?class=${size}`;
  };

  // Navigation
  const images = listing.images || [];
  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  // Extract data
  const displayPrice = listing.listPrice || listing.price;
  const displayBeds = listing.details?.numBedrooms || listing.bedrooms || listing.beds;
  const displayBaths = listing.details?.numBathrooms || listing.bathrooms || listing.baths;
  const displaySqft = listing.sqft || listing.details?.sqft;
  const displayYearBuilt = listing.details?.yearBuilt || listing.yearBuilt;
  const daysOnMarket = listing.simpleDaysOnMarket || listing.daysOnMarket;
  const propertyStatus = listing.standardStatus || listing.status;
  const description = listing.details?.description || listing.description;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Hero Image Gallery */}
      {images.length > 0 && (
        <div className="relative bg-gray-900 flex" style={{ height: "400px" }}>
          {/* Main Image */}
          <div className="flex-1 relative">
            <img
              src={getImageUrl(images[currentImageIndex], "large")}
              alt={`Property photo ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6 text-gray-800" />
                </button>
              </>
            )}

            {/* Photo Counter */}
            <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>

          {/* Thumbnail Column */}
          <div className="w-32 bg-gray-900 overflow-y-auto">
            {images.slice(0, 12).map((imageUrl, index) => (
              <div
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`cursor-pointer border-2 ${
                  index === currentImageIndex ? "border-blue-500" : "border-transparent"
                } hover:border-blue-300 transition-all`}
              >
                <img
                  src={getImageUrl(imageUrl, "small")}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full aspect-square object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-4xl">
          {/* Property Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {displayPrice ? formatPrice(displayPrice) : "Price on request"}
              </h1>
              {propertyStatus && (
                <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                  {propertyStatus}
                </span>
              )}
            </div>
            <p className="text-xl text-gray-700">{formatAddress(listing.address)}</p>

            {/* Key Stats - 2 Column Grid */}
            <div className="grid grid-cols-2 gap-6 mt-6">
              {displayBeds !== undefined && (
                <div className="flex flex-col">
                  <div className="text-gray-900 font-semibold text-xl">{displayBeds}</div>
                  <div className="text-gray-600 text-xs tracking-wide uppercase">Bedrooms</div>
                </div>
              )}
              {displayBaths !== undefined && (
                <div className="flex flex-col">
                  <div className="text-gray-900 font-semibold text-xl">{displayBaths}</div>
                  <div className="text-gray-600 text-xs tracking-wide uppercase">Bathrooms</div>
                </div>
              )}
              {displaySqft && (
                <div className="flex flex-col">
                  <div className="text-gray-900 font-semibold text-xl">{displaySqft}</div>
                  <div className="text-gray-600 text-xs tracking-wide uppercase">Square Feet</div>
                </div>
              )}
              {displayYearBuilt && (
                <div className="flex flex-col">
                  <div className="text-gray-900 font-semibold text-xl">{displayYearBuilt}</div>
                  <div className="text-gray-600 text-xs tracking-wide uppercase">Year Built</div>
                </div>
              )}
              {listing.taxes?.annualAmount && (
                <div className="flex flex-col">
                  <div className="text-gray-900 font-semibold text-xl">{formatPrice(listing.taxes.annualAmount)}</div>
                  <div className="text-gray-600 text-xs tracking-wide uppercase">Annual Tax</div>
                </div>
              )}
              {listing.condominium?.fees?.maintenance && (
                <div className="flex flex-col">
                  <div className="text-gray-900 font-semibold text-xl">{formatPrice(listing.condominium.fees.maintenance)}/mo</div>
                  <div className="text-gray-600 text-xs tracking-wide uppercase">Condo Fees</div>
                </div>
              )}
              {daysOnMarket && (
                <div className="flex flex-col">
                  <div className="text-gray-900 font-semibold text-xl">{daysOnMarket}</div>
                  <div className="text-gray-600 text-xs tracking-wide uppercase">Days on Market</div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {description && (
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-3 border-b-2 border-gray-200">
                About This Property
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{description}</p>
            </div>
          )}

          {/* Property Details - All Sections Open */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-3 border-b-2 border-gray-200">
              Property Details
            </h2>
            <div className="bg-gray-50 rounded-xl overflow-hidden">

              {/* Overview */}
              <details className="border-b border-gray-200" open>
                <summary className="px-7 py-6 bg-white text-lg font-semibold text-gray-800 cursor-pointer hover:bg-gray-50 transition-colors flex justify-between items-center">
                  <span>Overview</span>
                  <span className="text-xs text-gray-500">▼</span>
                </summary>
                <div className="px-7 py-6 bg-white">
                  <div className="grid grid-cols-2 gap-6">
                    {propertyStatus && (
                      <div className="flex flex-col">
                        <div className="text-gray-900 font-semibold text-base">{propertyStatus}</div>
                        <div className="text-gray-600 text-xs tracking-wide uppercase">Status</div>
                      </div>
                    )}
                    {(listing.details?.propertyType || listing.propertyType) && (
                      <div className="flex flex-col">
                        <div className="text-gray-900 font-semibold text-base">{listing.details?.propertyType || listing.propertyType}</div>
                        <div className="text-gray-600 text-xs tracking-wide uppercase">Property Type</div>
                      </div>
                    )}
                    {listing.details?.style && (
                      <div className="flex flex-col">
                        <div className="text-gray-900 font-semibold text-base">{listing.details.style}</div>
                        <div className="text-gray-600 text-xs tracking-wide uppercase">Style</div>
                      </div>
                    )}
                    {listing.listDate && (
                      <div className="flex flex-col">
                        <div className="text-gray-900 font-semibold text-base">
                          {new Date(listing.listDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="text-gray-600 text-xs tracking-wide uppercase">List Date</div>
                      </div>
                    )}
                    {(listing.timestamps?.listingUpdated || listing.updatedOn) && (
                      <div className="flex flex-col">
                        <div className="text-gray-900 font-semibold text-base">
                          {new Date(listing.timestamps?.listingUpdated || listing.updatedOn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="text-gray-600 text-xs tracking-wide uppercase">Last Updated</div>
                      </div>
                    )}
                  </div>
                </div>
              </details>

              {/* Interior Features */}
              <details className="border-b border-gray-200" open>
                <summary className="px-7 py-6 bg-white text-lg font-semibold text-gray-800 cursor-pointer hover:bg-gray-50 transition-colors flex justify-between items-center">
                  <span>Interior Features</span>
                  <span className="text-xs text-gray-500">▼</span>
                </summary>
                <div className="px-7 py-6 bg-white">
                  <div className="grid grid-cols-2 gap-6">
                    {displayBeds !== undefined && (
                      <div className="flex flex-col">
                        <div className="text-gray-900 font-semibold text-base">{displayBeds}</div>
                        <div className="text-gray-600 text-xs tracking-wide uppercase">Total Bedrooms</div>
                      </div>
                    )}
                    {displayBaths !== undefined && (
                      <div className="flex flex-col">
                        <div className="text-gray-900 font-semibold text-base">{displayBaths}</div>
                        <div className="text-gray-600 text-xs tracking-wide uppercase">Total Bathrooms</div>
                      </div>
                    )}
                    {listing.details?.numBedroomsPlus !== undefined && listing.details.numBedroomsPlus > 0 && (
                      <div className="flex flex-col">
                        <div className="text-gray-900 font-semibold text-base">{listing.details.numBedroomsPlus}</div>
                        <div className="text-gray-600 text-xs tracking-wide uppercase">Additional Rooms</div>
                      </div>
                    )}
                    {listing.details?.numFireplaces && (
                      <div className="flex flex-col">
                        <div className="text-gray-900 font-semibold text-base">
                          {listing.details.numFireplaces === "N" ? "No" : listing.details.numFireplaces}
                        </div>
                        <div className="text-gray-600 text-xs tracking-wide uppercase">Fireplaces</div>
                      </div>
                    )}
                    {listing.details?.basement1 && (
                      <div className="flex flex-col">
                        <div className="text-gray-900 font-semibold text-base">{listing.details.basement1}</div>
                        <div className="text-gray-600 text-xs tracking-wide uppercase">Basement</div>
                      </div>
                    )}
                  </div>
                </div>
              </details>

              {/* Heating & Cooling */}
              {(listing.details?.heating || listing.details?.airConditioning) && (
                <details className="border-b border-gray-200" open>
                  <summary className="px-7 py-6 bg-white text-lg font-semibold text-gray-800 cursor-pointer hover:bg-gray-50 transition-colors flex justify-between items-center">
                    <span>Heating & Cooling</span>
                    <span className="text-xs text-gray-500">▼</span>
                  </summary>
                  <div className="px-7 py-6 bg-white">
                    <div className="grid grid-cols-2 gap-6">
                      {listing.details?.heating && (
                        <div className="flex flex-col">
                          <div className="text-gray-900 font-semibold text-base">{listing.details.heating}</div>
                          <div className="text-gray-600 text-xs tracking-wide uppercase">Heating Type</div>
                        </div>
                      )}
                      {listing.details?.airConditioning && (
                        <div className="flex flex-col">
                          <div className="text-gray-900 font-semibold text-base">{listing.details.airConditioning}</div>
                          <div className="text-gray-600 text-xs tracking-wide uppercase">Air Conditioning</div>
                        </div>
                      )}
                    </div>
                  </div>
                </details>
              )}

              {/* Parking & Garage */}
              {(listing.details?.numGarageSpaces || listing.details?.numParkingSpaces) && (
                <details className="border-b border-gray-200" open>
                  <summary className="px-7 py-6 bg-white text-lg font-semibold text-gray-800 cursor-pointer hover:bg-gray-50 transition-colors flex justify-between items-center">
                    <span>Parking & Garage</span>
                    <span className="text-xs text-gray-500">▼</span>
                  </summary>
                  <div className="px-7 py-6 bg-white">
                    <div className="grid grid-cols-2 gap-6">
                      {listing.details?.numParkingSpaces !== undefined && (
                        <div className="flex flex-col">
                          <div className="text-gray-900 font-semibold text-base">{listing.details.numParkingSpaces}</div>
                          <div className="text-gray-600 text-xs tracking-wide uppercase">Total Parking Spaces</div>
                        </div>
                      )}
                      {listing.details?.numGarageSpaces !== undefined && (
                        <div className="flex flex-col">
                          <div className="text-gray-900 font-semibold text-base">{listing.details.numGarageSpaces}</div>
                          <div className="text-gray-600 text-xs tracking-wide uppercase">Garage Spaces</div>
                        </div>
                      )}
                    </div>
                  </div>
                </details>
              )}

              {/* Exterior & Lot */}
              <details className="border-b border-gray-200" open>
                <summary className="px-7 py-6 bg-white text-lg font-semibold text-gray-800 cursor-pointer hover:bg-gray-50 transition-colors flex justify-between items-center">
                  <span>Exterior & Lot</span>
                  <span className="text-xs text-gray-500">▼</span>
                </summary>
                <div className="px-7 py-6 bg-white">
                  <div className="grid grid-cols-2 gap-6">
                    {displayYearBuilt && (
                      <div className="flex flex-col">
                        <div className="text-gray-900 font-semibold text-base">{displayYearBuilt}</div>
                        <div className="text-gray-600 text-xs tracking-wide uppercase">Year Built</div>
                      </div>
                    )}
                    {listing.details?.roofMaterial && (
                      <div className="flex flex-col">
                        <div className="text-gray-900 font-semibold text-base">{listing.details.roofMaterial}</div>
                        <div className="text-gray-600 text-xs tracking-wide uppercase">Roof Material</div>
                      </div>
                    )}
                    {(listing.details?.exteriorConstruction1 || listing.details?.exteriorConstruction2) && (
                      <div className="flex flex-col">
                        <div className="text-gray-900 font-semibold text-base">
                          {[listing.details?.exteriorConstruction1, listing.details?.exteriorConstruction2].filter(Boolean).join(", ")}
                        </div>
                        <div className="text-gray-600 text-xs tracking-wide uppercase">Exterior</div>
                      </div>
                    )}
                    {listing.lot?.size && (
                      <div className="flex flex-col">
                        <div className="text-gray-900 font-semibold text-base">{listing.lot.size}</div>
                        <div className="text-gray-600 text-xs tracking-wide uppercase">Lot Size</div>
                      </div>
                    )}
                  </div>

                  {/* Building/Nearby Amenities */}
                  {(listing.condominium?.amenities?.length > 0 || listing.nearby?.amenities?.length > 0) && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      {listing.condominium?.amenities?.length > 0 && (
                        <div className="mb-4">
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                            BUILDING AMENITIES
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {listing.condominium.amenities.map((amenity: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-700 font-medium"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {listing.nearby?.amenities?.length > 0 && (
                        <div>
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                            NEARBY
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {listing.nearby.amenities.map((amenity: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-sm text-green-700 font-medium"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </details>

              {/* Listing Information */}
              <details className="border-b-0" open>
                <summary className="px-7 py-6 bg-white text-lg font-semibold text-gray-800 cursor-pointer hover:bg-gray-50 transition-colors flex justify-between items-center">
                  <span>Listing Information</span>
                  <span className="text-xs text-gray-500">▼</span>
                </summary>
                <div className="px-7 py-6 bg-white">
                  <div className="grid grid-cols-2 gap-6">
                    {listing.office?.brokerageName && (
                      <div className="flex flex-col">
                        <div className="text-gray-900 font-semibold text-base">{listing.office.brokerageName}</div>
                        <div className="text-gray-600 text-xs tracking-wide uppercase">Brokerage</div>
                      </div>
                    )}
                    {listing.mlsNumber && (
                      <div className="flex flex-col">
                        <div className="text-gray-900 font-semibold text-base">{listing.mlsNumber}</div>
                        <div className="text-gray-600 text-xs tracking-wide uppercase">MLS® Number</div>
                      </div>
                    )}
                    {listing.taxes?.annualAmount && (
                      <div className="flex flex-col">
                        <div className="text-gray-900 font-semibold text-base">{formatPrice(listing.taxes.annualAmount)}</div>
                        <div className="text-gray-600 text-xs tracking-wide uppercase">Annual Property Tax ({listing.taxes.assessmentYear})</div>
                      </div>
                    )}
                    {listing.condominium?.fees?.maintenance && (
                      <div className="flex flex-col">
                        <div className="text-gray-900 font-semibold text-base">{formatPrice(listing.condominium.fees.maintenance)}/mo</div>
                        <div className="text-gray-600 text-xs tracking-wide uppercase">Condo Fees</div>
                      </div>
                    )}
                    {listing.condominium?.propertyMgr && (
                      <div className="flex flex-col">
                        <div className="text-gray-900 font-semibold text-base">{listing.condominium.propertyMgr}</div>
                        <div className="text-gray-600 text-xs tracking-wide uppercase">Property Manager</div>
                      </div>
                    )}
                  </div>
                </div>
              </details>

            </div>
          </div>

          {/* Sale & Tax History - Timeline */}
          {(listing.listDate || daysOnMarket) && (
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-3 border-b-2 border-gray-200">
                Sale & Tax History
              </h2>
              <div className="relative pl-10">
                {/* Timeline Line */}
                <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200"></div>

                {/* Current Status */}
                {daysOnMarket && (
                  <div className="relative pb-8">
                    <div className="absolute left-[-30px] top-[10px] w-[18px] h-[18px] bg-green-500 border-[3px] border-white rounded-full shadow-[0_0_0_3px_#c6f6d5]"></div>
                    <div className="pl-5">
                      <div className="text-xs text-gray-400 mb-1 font-medium">Currently</div>
                      <div className="text-base text-gray-900 font-semibold mb-1">Active Listing</div>
                      <div className="text-sm text-gray-600">{daysOnMarket} days on market</div>
                    </div>
                  </div>
                )}

                {/* Last Updated */}
                {(listing.timestamps?.listingUpdated || listing.updatedOn) && (
                  <div className="relative pb-8">
                    <div className="absolute left-[-30px] top-[10px] w-[18px] h-[18px] bg-blue-500 border-[3px] border-white rounded-full shadow-[0_0_0_3px_#e2e8f0]"></div>
                    <div className="pl-5">
                      <div className="text-xs text-gray-400 mb-1 font-medium">
                        {new Date(listing.timestamps?.listingUpdated || listing.updatedOn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="text-base text-gray-900 font-semibold mb-1">Status Update</div>
                      <div className="text-sm text-gray-600">Listed as {propertyStatus || 'Active'}</div>
                    </div>
                  </div>
                )}

                {/* Original List Date */}
                {listing.listDate && (
                  <div className="relative">
                    <div className="absolute left-[-30px] top-[10px] w-[18px] h-[18px] bg-blue-500 border-[3px] border-white rounded-full shadow-[0_0_0_3px_#e2e8f0]"></div>
                    <div className="pl-5">
                      <div className="text-xs text-gray-400 mb-1 font-medium">
                        {new Date(listing.listDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="text-base text-gray-900 font-semibold mb-1">Listed For Sale</div>
                      {displayPrice && (
                        <div className="text-sm text-gray-600">{formatPrice(displayPrice)}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
