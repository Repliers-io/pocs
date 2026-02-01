import React, { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onSearch: () => void;
  isSearching: boolean;
  placeholder?: string;
}

const TYPING_TEXT = "i'm looking for a 2 bedroom 2 bathroom condo to rent in rosedale";
const TYPING_SPEED = 50; // milliseconds per character

export function SearchInput({
  value,
  onChange,
  onFocus,
  onSearch,
  isSearching,
  placeholder,
}: SearchInputProps) {
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  // Stop typing animation when user starts typing
  useEffect(() => {
    if (value.length > 0) {
      setIsTyping(false);
    }
  }, [value]);

  useEffect(() => {
    if (!isTyping) return;

    if (typedText.length < TYPING_TEXT.length) {
      const timeout = setTimeout(() => {
        setTypedText(TYPING_TEXT.slice(0, typedText.length + 1));
      }, TYPING_SPEED);

      return () => clearTimeout(timeout);
    } else {
      // Wait 2 seconds at the end, then restart
      const timeout = setTimeout(() => {
        setTypedText("");
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [typedText, isTyping]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSearch();
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={typedText}
        rows={1}
        style={{
          width: "100%",
          height: "120px",
          padding: "20px 60px 20px 20px",
          fontSize: "16px",
          border: "2px solid #e5e7eb",
          borderRadius: "12px",
          background: "#f9fafb",
          outline: "none",
          transition: "all 200ms ease",
          resize: "none",
          fontFamily: "inherit",
          lineHeight: "1.5",
          verticalAlign: "top",
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
          right: "16px",
          bottom: "16px",
          width: "32px",
          height: "32px",
          background:
            isSearching || !value.trim()
              ? "#d1d5db"
              : "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
          border: "none",
          borderRadius: "6px",
          boxShadow: "0 2px 8px rgba(79, 70, 229, 0.3)",
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
              "0 4px 12px rgba(79, 70, 229, 0.4)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(79, 70, 229, 0.3)";
        }}
      >
        {isSearching ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Search size={14} />
        )}
      </button>
    </div>
  );
}
