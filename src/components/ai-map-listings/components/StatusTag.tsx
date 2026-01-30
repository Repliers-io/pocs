import React from "react";
import { getStatusLabel } from "../helper-functions/formatters";

interface StatusTagProps {
  type?: string;
  lastStatus?: string;
  size?: "xs" | "sm";
}

export const StatusTag = ({
  type,
  lastStatus,
  size = "sm",
}: StatusTagProps) => {
  const label = getStatusLabel(type, lastStatus);
  if (!label) return null;

  let style = "bg-green-100 text-green-600"; // Default for active listings

  switch (label) {
    case "For Sale":
      style = "bg-green-100 text-green-600";
      break;
    case "For Lease":
      style = "bg-purple-100 text-purple-600";
      break;
    case "Sold":
      style = "bg-blue-100 text-blue-600";
      break;
    case "Leased":
      style = "bg-purple-100 text-purple-600";
      break;
    case "Sold Conditionally":
    case "Sold Conditionally (Escape Clause)":
    case "Leased Conditionally":
      style = "bg-amber-100 text-amber-600";
      break;
    case "Coming Soon":
      style = "bg-indigo-100 text-indigo-600";
      break;
    case "Suspended":
      style = "bg-orange-100 text-orange-600";
      break;
    case "Expired":
      style = "bg-gray-100 text-gray-500";
      break;
    case "Terminated":
    case "Deal Fell Through":
      style = "bg-red-100 text-red-600";
      break;
    default:
      style = "bg-gray-100 text-gray-500";
  }

  const sizeClass = size === "xs" ? "text-xs" : "text-sm";

  return (
    <span className={`${sizeClass} px-2 py-1 rounded-md font-medium ${style}`}>
      {label}
    </span>
  );
};
