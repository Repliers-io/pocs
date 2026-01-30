import React from "react";
import { Search, Loader2 } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onSearch: () => void;
  isSearching: boolean;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  onFocus,
  onSearch,
  isSearching,
  placeholder = "Search properties...",
}: SearchInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        style={{
          width: "100%",
          height: "56px",
          padding: "16px 60px 16px 20px",
          fontSize: "16px",
          border: "2px solid #e5e7eb",
          borderRadius: "28px",
          background: "#f9fafb",
          outline: "none",
          transition: "all 200ms ease",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#6366f1";
          e.currentTarget.style.background = "white";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.1)";
          onFocus();
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "#e5e7eb";
          e.currentTarget.style.background = "#f9fafb";
          e.currentTarget.style.boxShadow = "none";
        }}
      />

      {/* Search Button */}
      <button
        onClick={onSearch}
        disabled={isSearching || !value.trim()}
        style={{
          position: "absolute",
          right: "4px",
          top: "4px",
          width: "48px",
          height: "48px",
          background:
            isSearching || !value.trim()
              ? "#d1d5db"
              : "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
          border: "none",
          borderRadius: "50%",
          boxShadow: "0 4px 16px rgba(79, 70, 229, 0.3)",
          cursor: isSearching || !value.trim() ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 200ms ease",
          color: "white",
        }}
        onMouseEnter={(e) => {
          if (!isSearching && value.trim()) {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow =
              "0 6px 20px rgba(79, 70, 229, 0.4)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(79, 70, 229, 0.3)";
        }}
      >
        {isSearching ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <Search size={20} />
        )}
      </button>
    </div>
  );
}
