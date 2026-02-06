import React from "react";
import { Pentagon, Trash2 } from "lucide-react";

export interface MapDrawControlsProps {
  onDrawStart: () => void;
  onDrawClear: () => void;
  hasPolygon: boolean;
  isDrawing?: boolean;
}

export function MapDrawControls({
  onDrawStart,
  onDrawClear,
  hasPolygon,
  isDrawing = false,
}: MapDrawControlsProps) {
  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
      {/* Draw Polygon Button */}
      <button
        onClick={onDrawStart}
        disabled={isDrawing || hasPolygon}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg
          font-medium text-sm transition-all duration-200
          ${
            isDrawing || hasPolygon
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-xl"
          }
        `}
        title={hasPolygon ? "Clear existing polygon first" : "Draw custom search area"}
      >
        <Pentagon className="w-4 h-4" />
        <span>{isDrawing ? "Drawing..." : "Draw Area"}</span>
      </button>

      {/* Clear Polygon Button - Only show when polygon exists */}
      {hasPolygon && (
        <button
          onClick={onDrawClear}
          className="flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg
            bg-red-600 text-white font-medium text-sm
            hover:bg-red-700 hover:shadow-xl transition-all duration-200"
          title="Clear custom search area"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear Area</span>
        </button>
      )}
    </div>
  );
}
