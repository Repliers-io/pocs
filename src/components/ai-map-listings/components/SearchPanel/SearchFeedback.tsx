import React from "react";
import { CheckCircle2, AlertCircle, MapPin, Home, Bed, Bath, DollarSign } from "lucide-react";

interface SearchFeedbackProps {
  prompt: string;
  url: string;
  summary: string;
  filters: any;
}

export function SearchFeedback({ prompt, url, summary, filters }: SearchFeedbackProps) {
  // Analyze what was captured from the prompt
  const analyzeCriteria = () => {
    const captured: Array<{ label: string; value: string; icon: React.ReactNode }> = [];
    const urlObj = new URL(url);
    const params = urlObj.searchParams;

    // Location
    if (filters.neighborhood) {
      captured.push({
        label: "Neighborhood",
        value: filters.neighborhood,
        icon: <MapPin size={14} />,
      });
    }
    if (filters.city) {
      captured.push({
        label: "City",
        value: filters.city,
        icon: <MapPin size={14} />,
      });
    }

    // Property type
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      captured.push({
        label: "Property Type",
        value: filters.propertyTypes.join(", "),
        icon: <Home size={14} />,
      });
    } else if (params.get('class')) {
      captured.push({
        label: "Property Type",
        value: params.get('class') || '',
        icon: <Home size={14} />,
      });
    }

    // Bedrooms
    if (filters.bedrooms) {
      captured.push({
        label: "Bedrooms",
        value: filters.bedrooms === '5+' ? '5+' : filters.bedrooms,
        icon: <Bed size={14} />,
      });
    } else if (params.get('minBeds')) {
      captured.push({
        label: "Bedrooms",
        value: `${params.get('minBeds')}+`,
        icon: <Bed size={14} />,
      });
    }

    // Bathrooms
    if (filters.bathrooms) {
      captured.push({
        label: "Bathrooms",
        value: filters.bathrooms,
        icon: <Bath size={14} />,
      });
    } else if (params.get('minBaths')) {
      captured.push({
        label: "Bathrooms",
        value: `${params.get('minBaths')}+`,
        icon: <Bath size={14} />,
      });
    }

    // Price
    if (filters.minPrice || filters.maxPrice) {
      const priceRange = [];
      if (filters.minPrice) priceRange.push(`$${filters.minPrice.toLocaleString()}+`);
      if (filters.maxPrice) priceRange.push(`up to $${filters.maxPrice.toLocaleString()}`);
      captured.push({
        label: "Price Range",
        value: priceRange.join(" "),
        icon: <DollarSign size={14} />,
      });
    }

    // Listing type
    if (filters.listingType) {
      captured.push({
        label: "Listing Type",
        value: filters.listingType === 'sale' ? 'For Sale' : 'For Rent',
        icon: <Home size={14} />,
      });
    }

    return captured;
  };

  const capturedCriteria = analyzeCriteria();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      {/* User Prompt */}
      <div
        style={{
          background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
          borderRadius: "12px",
          padding: "12px 16px",
          border: "1px solid #d1d5db",
        }}
      >
        <div
          style={{
            fontSize: "10px",
            fontWeight: "700",
            color: "#6b7280",
            marginBottom: "6px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Your Search
        </div>
        <div
          style={{
            fontSize: "14px",
            color: "#1f2937",
            fontWeight: "500",
          }}
        >
          "{prompt}"
        </div>
      </div>

      {/* AI Interpretation */}
      <div
        style={{
          background: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)",
          borderRadius: "12px",
          padding: "12px 16px",
          border: "1px solid #c7d2fe",
        }}
      >
        <div
          style={{
            fontSize: "10px",
            fontWeight: "700",
            color: "#6366f1",
            marginBottom: "8px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <CheckCircle2 size={12} />
          Understood As
        </div>
        <div
          style={{
            fontSize: "13px",
            color: "#4338ca",
            marginBottom: "12px",
            fontWeight: "500",
          }}
        >
          {summary}
        </div>

        {/* Captured Criteria */}
        {capturedCriteria.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
            }}
          >
            {capturedCriteria.map((criterion, idx) => (
              <div
                key={idx}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "4px 10px",
                  background: "white",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "#4338ca",
                  border: "1px solid #c7d2fe",
                }}
              >
                {criterion.icon}
                <span style={{ color: "#6b7280" }}>{criterion.label}:</span>
                <span>{criterion.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Note about additional filters */}
      <div
        style={{
          fontSize: "11px",
          color: "#6b7280",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          padding: "4px 0",
        }}
      >
        <AlertCircle size={12} />
        Use advanced filters below to refine your search further
      </div>
    </div>
  );
}
