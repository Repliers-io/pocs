import { ListingResult } from "../types";

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatBedrooms = (details: ListingResult["details"]) => {
  if (!details) return "N/A";

  const total = details.numBedrooms;
  const plus = details.numBedroomsPlus;

  if (total && plus && plus > 0) {
    return `${total} + ${plus}`;
  }
  return total?.toString() || "N/A";
};

export const formatBathrooms = (details: ListingResult["details"]) => {
  if (!details) return "N/A";

  const total = details.numBathrooms;
  const plus = details.numBathroomsPlus;

  if (total && plus && plus > 0) {
    return `${total} + ${plus}`;
  }
  return total?.toString() || "N/A";
};

export const formatParking = (details: ListingResult["details"]) => {
  if (!details) return "N/A";
  return details.numGarageSpaces?.toString() || "N/A";
};

export const getStatusLabel = (
  type?: string,
  lastStatus?: string
): string | null => {
  if (lastStatus === "New" || lastStatus === "Pc" || lastStatus === "Ext") {
    if (type === "Sale") return "For Sale";
    if (type === "Lease") return "For Lease";
    return type || null;
  }

  if (!lastStatus) return null;

  const lastStatusMap: Record<string, string> = {
    Sus: "Suspended",
    Exp: "Expired",
    Sld: "Sold",
    Ter: "Terminated",
    Dft: "Deal Fell Through",
    Lsd: "Leased",
    Sc: "Sold Conditionally",
    Sce: "Sold Conditionally (Escape Clause)",
    Lc: "Leased Conditionally",
    Cs: "Coming Soon",
  };

  return lastStatusMap[lastStatus] || lastStatus;
};

export const formatAddress = (address: ListingResult["address"]) => {
  if (!address) return "Address not available";

  const parts = [
    address.streetNumber,
    address.streetDirection,
    address.streetName,
    address.streetSuffix,
  ].filter(Boolean);

  const street = parts.join(" ");
  const cityState = [address.city, address.state].filter(Boolean).join(", ");

  return [street, cityState].filter(Boolean).join(", ");
};
