import React, { useRef, useEffect } from "react";
import { LogEntry } from "./LogEntry";
import type { ActivityLogEntry } from "../../types";

export interface ActivityLogProps {
  entries: ActivityLogEntry[];
  maxHeight?: string;
  onChipClick?: () => void;
}

export function ActivityLog({ entries, maxHeight = "400px", onChipClick }: ActivityLogProps) {
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new entries are added
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [entries]);

  if (entries.length === 0) {
    return (
      <div className="text-center py-6 text-gray-400 text-sm">
        No activity yet. Start by searching for properties above.
      </div>
    );
  }

  return (
    <div
      className="space-y-1 overflow-y-auto pr-2"
      style={{ maxHeight }}
    >
      {entries.map((entry) => (
        <LogEntry key={entry.id} entry={entry} onChipClick={onChipClick} />
      ))}
      <div ref={logEndRef} />
    </div>
  );
}
