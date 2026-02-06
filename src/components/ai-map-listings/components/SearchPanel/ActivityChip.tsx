import React from "react";
import type { LucideIcon } from "lucide-react";

export interface ActivityChipProps {
  icon: LucideIcon;
  label?: string;
  value: string | number;
  variant?: "info" | "success" | "warning";
}

export function ActivityChip({
  icon: Icon,
  label,
  value,
  variant = "info"
}: ActivityChipProps) {
  // Variant-based styling
  const variantStyles = {
    info: "border-indigo-200 text-indigo-700 bg-white",
    success: "border-green-200 text-green-700 bg-white",
    warning: "border-amber-200 text-amber-700 bg-white",
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm border ${variantStyles[variant]}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label && <span className="text-gray-500">{label}:</span>}
      <span>{value}</span>
    </div>
  );
}
