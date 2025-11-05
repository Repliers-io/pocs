import React, { useState, useEffect } from "react";
import {
  Search,
  User,
  Building2,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Globe,
} from "lucide-react";

// Types for agent/member data from API
export interface AgentDetails {
  agentId: string;
  boardAgentId?: string;
  name: string;
  email?: string;
  phones?: string[];
  officeId?: string;
  boardOfficeId?: string;
  position?: string;
  website?: string;
  brokerage?: {
    name: string;
    address?: {
      address1?: string;
      address2?: string;
      city?: string;
      state?: string;
      postal?: string;
      country?: string;
    };
  };
  photo?: {
    small?: string | null;
    large?: string | null;
  };
  social?: any[];
  board?: string | null;
  updatedOn?: string;
}

// Type for aggregate results
export interface AgentAggregate {
  agentName: string;
  listingCount: number;
  agentDetails?: AgentDetails; // Store first occurrence of agent details
}

export interface AgentDashboardProps {
  /** Repliers API key - required */
  apiKey: string;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * Agent Performance Dashboard Component
 *
 * @description A comprehensive dashboard for viewing agent performance metrics,
 * specializations, and auto-generated categorizations based on their listing data.
 *
 * Features:
 * - Agent search with autocomplete
 * - Agent profile display
 * - Performance metrics calculation
 * - Auto-categorization (Luxury, Volume, Property Type specialists)
 * - Listings breakdown and visualization
 *
 * @param props - The component props
 * @returns JSX.Element
 */
export function AgentDashboard({ apiKey, className = "" }: AgentDashboardProps) {
  // Step 1: Agent List State
  const [agents, setAgents] = useState<AgentAggregate[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<AgentAggregate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  // Filter and sort state
  const [filterQuery, setFilterQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "count">("count");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Step 3: Listings breakdown state
  const [activeListingsCount, setActiveListingsCount] = useState<number | null>(null);
  const [soldListingsCount, setSoldListingsCount] = useState<number | null>(null);
  const [isLoadingListings, setIsLoadingListings] = useState(false);
  const [listingsError, setListingsError] = useState<string | null>(null);

  // Step 4: Performance metrics state
  const [medianSalePrice, setMedianSalePrice] = useState<number | null>(null);
  const [averageListPrice, setAverageListPrice] = useState<number | null>(null);
  const [averageDaysOnMarket, setAverageDaysOnMarket] = useState<number | null>(null);
  const [medianDaysOnMarket, setMedianDaysOnMarket] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [topLocations, setTopLocations] = useState<Array<{ name: string; count: number }>>([]);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
  const [metricsError, setMetricsError] = useState<string | null>(null);

  // Step 5: Auto-categorization state
  const [categories, setCategories] = useState<Array<{ name: string; color: string; icon: string }>>([]);

  // Load agents on mount
  useEffect(() => {
    if (apiKey) {
      loadAgentList();
    }
  }, [apiKey]);

  // Filter agents when search query changes
  useEffect(() => {
    if (!filterQuery.trim()) {
      setFilteredAgents(agents);
      return;
    }

    const filtered = agents.filter((agent) =>
      agent.agentName.toLowerCase().includes(filterQuery.toLowerCase())
    );
    setFilteredAgents(filtered);
  }, [filterQuery, agents]);

  // Sort agents when sort options change
  useEffect(() => {
    const sorted = [...filteredAgents].sort((a, b) => {
      if (sortBy === "name") {
        const comparison = a.agentName.localeCompare(b.agentName);
        return sortOrder === "asc" ? comparison : -comparison;
      } else {
        const comparison = a.listingCount - b.listingCount;
        return sortOrder === "asc" ? comparison : -comparison;
      }
    });
    setFilteredAgents(sorted);
  }, [sortBy, sortOrder]);

  // Load agent list using aggregates
  const loadAgentList = async () => {
    if (!apiKey) {
      setError("API key is required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Since agents is an array and can't be aggregated directly,
      // we'll fetch listings and manually build the agent list from the agents array
      console.log("Fetching listings to build agent directory...");

      const url = `https://api.repliers.io/listings?status=A&status=U&limit=1000&fields=agents`;
      const response = await fetch(url, {
        headers: {
          "REPLIERS-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Invalid API key");
        } else if (response.status === 403) {
          throw new Error("API key doesn't have permission for listings endpoint");
        } else if (response.status === 429) {
          throw new Error("Too many requests. Please wait a moment");
        } else {
          throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }
      }

      const data = await response.json();
      console.log(`Fetched ${data.listings?.length || 0} listings`);

      // Build agent list from the listings and store agent details
      const agentMap = new Map<string, { count: number; details: AgentDetails }>();

      data.listings?.forEach((listing: any) => {
        if (listing.agents && Array.isArray(listing.agents)) {
          listing.agents.forEach((agent: any) => {
            if (agent.name) {
              const existing = agentMap.get(agent.name);
              if (existing) {
                // Increment count for existing agent
                existing.count += 1;
              } else {
                // Store new agent with details
                agentMap.set(agent.name, {
                  count: 1,
                  details: agent as AgentDetails,
                });
              }
            }
          });
        }
      });

      console.log(`Found ${agentMap.size} unique agents`);

      // Transform map into agent list
      const agentList: AgentAggregate[] = Array.from(agentMap.entries())
        .map(([name, data]) => ({
          agentName: name,
          listingCount: data.count,
          agentDetails: data.details,
        }))
        .filter((agent) => agent.agentName && agent.agentName.trim() !== "");

      // Sort by listing count (descending) by default
      agentList.sort((a, b) => b.listingCount - a.listingCount);

      console.log(`Displaying ${agentList.length} agents`, agentList.slice(0, 5));

      setAgents(agentList);
      setFilteredAgents(agentList);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load agents";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch listings breakdown for selected agent
  const loadAgentListings = async (agentName: string) => {
    if (!apiKey) return;

    setIsLoadingListings(true);
    setListingsError(null);
    setActiveListingsCount(null);
    setSoldListingsCount(null);

    try {
      // Fetch active and sold listings in parallel
      const [activeResponse, soldResponse] = await Promise.all([
        fetch(
          `https://api.repliers.io/listings?agent=${encodeURIComponent(agentName)}&status=A&limit=1`,
          {
            headers: {
              "REPLIERS-API-KEY": apiKey,
              "Content-Type": "application/json",
            },
          }
        ),
        fetch(
          `https://api.repliers.io/listings?agent=${encodeURIComponent(agentName)}&status=U&limit=1`,
          {
            headers: {
              "REPLIERS-API-KEY": apiKey,
              "Content-Type": "application/json",
            },
          }
        ),
      ]);

      if (!activeResponse.ok || !soldResponse.ok) {
        throw new Error("Failed to fetch listings breakdown");
      }

      const [activeData, soldData] = await Promise.all([
        activeResponse.json(),
        soldResponse.json(),
      ]);

      // The API returns count in the response
      setActiveListingsCount(activeData.count || 0);
      setSoldListingsCount(soldData.count || 0);

      console.log(`Agent "${agentName}" - Active: ${activeData.count}, Sold: ${soldData.count}`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load listings breakdown";
      setListingsError(errorMessage);
      console.error("Error loading listings:", err);
    } finally {
      setIsLoadingListings(false);
    }
  };

  // Calculate performance metrics using statistics API
  const loadPerformanceMetrics = async (agentName: string) => {
    if (!apiKey) return;

    setIsLoadingMetrics(true);
    setMetricsError(null);
    setMedianSalePrice(null);
    setAverageListPrice(null);
    setAverageDaysOnMarket(null);
    setMedianDaysOnMarket(null);
    setPriceRange(null);
    setTopLocations([]);

    try {
      // Use statistics API for sold listings (with correct parameter names)
      const soldStatsUrl = `https://api.repliers.io/listings?agent=${encodeURIComponent(agentName)}&status=U&listings=false&statistics=med-soldPrice,min-soldPrice,max-soldPrice,avg-daysOnMarket,med-daysOnMarket`;

      // Use statistics API for active listings (with correct parameter names)
      const activeStatsUrl = `https://api.repliers.io/listings?agent=${encodeURIComponent(agentName)}&status=A&listings=false&statistics=avg-listPrice,min-listPrice,max-listPrice`;

      // Fetch location data separately
      const locationsUrl = `https://api.repliers.io/listings?agent=${encodeURIComponent(agentName)}&status=A&status=U&limit=100&fields=address.city`;

      console.log("Statistics URLs:", {
        soldStatsUrl,
        activeStatsUrl,
        locationsUrl,
        hasApiKey: !!apiKey,
      });

      const [soldStatsResponse, activeStatsResponse, locationsResponse] = await Promise.all([
        fetch(soldStatsUrl, {
          headers: {
            "REPLIERS-API-KEY": apiKey,
            "Content-Type": "application/json",
          },
        }),
        fetch(activeStatsUrl, {
          headers: {
            "REPLIERS-API-KEY": apiKey,
            "Content-Type": "application/json",
          },
        }),
        fetch(locationsUrl, {
          headers: {
            "REPLIERS-API-KEY": apiKey,
            "Content-Type": "application/json",
          },
        }),
      ]);

      // Check each response individually for better error reporting
      if (!soldStatsResponse.ok) {
        const errorText = await soldStatsResponse.text();
        console.error("Sold stats error:", soldStatsResponse.status, errorText);
        throw new Error(`Sold stats failed: ${errorText}`);
      }
      if (!activeStatsResponse.ok) {
        const errorText = await activeStatsResponse.text();
        console.error("Active stats error:", activeStatsResponse.status, errorText);
        throw new Error(`Active stats failed: ${errorText}`);
      }
      if (!locationsResponse.ok) {
        const errorText = await locationsResponse.text();
        console.error("Locations error:", locationsResponse.status, errorText);
        throw new Error(`Locations failed: ${errorText}`);
      }

      const [soldStatsData, activeStatsData, locationsData] = await Promise.all([
        soldStatsResponse.json(),
        activeStatsResponse.json(),
        locationsResponse.json(),
      ]);

      // Extract statistics from API response
      const soldStats = soldStatsData.statistics || {};
      const activeStats = activeStatsData.statistics || {};

      console.log("Statistics data:", { soldStats, activeStats });

      // Set sold price metrics (nested under soldPrice object)
      if (soldStats.soldPrice?.med) {
        setMedianSalePrice(soldStats.soldPrice.med);
      }

      // Set active price metrics (nested under listPrice object)
      if (activeStats.listPrice?.avg) {
        setAverageListPrice(activeStats.listPrice.avg);
      }

      // Set days on market metrics (nested under daysOnMarket object)
      if (soldStats.daysOnMarket?.avg) {
        setAverageDaysOnMarket(soldStats.daysOnMarket.avg);
      }
      if (soldStats.daysOnMarket?.med) {
        setMedianDaysOnMarket(soldStats.daysOnMarket.med);
      }

      // Set price range from both sold and active
      const minPrices = [soldStats.soldPrice?.min, activeStats.listPrice?.min].filter(Boolean);
      const maxPrices = [soldStats.soldPrice?.max, activeStats.listPrice?.max].filter(Boolean);

      if (minPrices.length > 0 && maxPrices.length > 0) {
        setPriceRange({
          min: Math.min(...minPrices),
          max: Math.max(...maxPrices),
        });
      }

      // Calculate top locations from listings data
      const locationMap = new Map<string, number>();
      (locationsData.listings || []).forEach((listing: any) => {
        const city = listing.address?.city;
        if (city) {
          locationMap.set(city, (locationMap.get(city) || 0) + 1);
        }
      });

      const locations = Array.from(locationMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Top 5 locations

      setTopLocations(locations);

      console.log(`Statistics for "${agentName}":`, {
        medianSalePrice: soldStats.soldPrice?.med,
        averageListPrice: activeStats.listPrice?.avg,
        averageDaysOnMarket: soldStats.daysOnMarket?.avg,
        medianDaysOnMarket: soldStats.daysOnMarket?.med,
        priceRange: minPrices.length > 0 && maxPrices.length > 0
          ? { min: Math.min(...minPrices), max: Math.max(...maxPrices) }
          : null,
        topLocations: locations,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load performance metrics";
      setMetricsError(errorMessage);
      console.error("Error loading metrics:", err);
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  // Calculate agent categories based on metrics
  const calculateCategories = () => {
    const cats: Array<{ name: string; color: string; icon: string }> = [];

    // Luxury Specialist - Median sale price > $1M
    if (medianSalePrice && medianSalePrice > 1000000) {
      cats.push({ name: "Luxury Specialist", color: "purple", icon: "💎" });
    }

    // High Volume Agent - 20+ total listings
    const totalListings = (activeListingsCount || 0) + (soldListingsCount || 0);
    if (totalListings >= 20) {
      cats.push({ name: "High Volume", color: "blue", icon: "📊" });
    }

    // Fast Seller - Average days on market < 30
    if (averageDaysOnMarket && averageDaysOnMarket < 30) {
      cats.push({ name: "Fast Seller", color: "green", icon: "⚡" });
    }

    // Premium Market - Average list price > $750K
    if (averageListPrice && averageListPrice > 750000) {
      cats.push({ name: "Premium Market", color: "orange", icon: "🏆" });
    }

    // Active Inventory Focus - More active than sold
    if (activeListingsCount && soldListingsCount && activeListingsCount > soldListingsCount) {
      cats.push({ name: "Active Inventory Focus", color: "teal", icon: "📈" });
    }

    // Geographic Specialist - >60% in top location
    if (topLocations.length > 0 && totalListings > 0) {
      const topLocationPercentage = (topLocations[0].count / totalListings) * 100;
      if (topLocationPercentage > 60) {
        cats.push({
          name: `${topLocations[0].name} Specialist`,
          color: "indigo",
          icon: "📍",
        });
      }
    }

    setCategories(cats);
  };

  // Recalculate categories when metrics change
  useEffect(() => {
    if (selectedAgent) {
      calculateCategories();
    }
  }, [
    medianSalePrice,
    averageListPrice,
    averageDaysOnMarket,
    activeListingsCount,
    soldListingsCount,
    topLocations,
  ]);

  // Load listings and metrics when agent is selected
  useEffect(() => {
    if (selectedAgent) {
      loadAgentListings(selectedAgent);
      loadPerformanceMetrics(selectedAgent);
    } else {
      // Clear categories when agent is deselected
      setCategories([]);
    }
  }, [selectedAgent, apiKey]);

  // Handle agent selection
  const handleAgentSelect = (agentName: string) => {
    setSelectedAgent(agentName);
  };

  // Toggle sort order
  const toggleSort = (field: "name" | "count") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder(field === "count" ? "desc" : "asc");
    }
  };

  return (
    <div className={`w-full h-screen flex flex-col ${className}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Agent Performance Dashboard
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          View all agents in your MLS with their listing counts and performance metrics
        </p>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Agent List */}
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
          {/* Search Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">
                Agents
              </h2>
              {!isLoading && agents.length > 0 && (
                <span className="text-sm text-gray-600 font-medium">
                  {filteredAgents.length}
                </span>
              )}
            </div>

            {/* Filter Input */}
            {!isLoading && agents.length > 0 && (
              <div className="relative flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                <Search className="text-gray-400 w-4 h-4 mr-2" />
                <input
                  type="text"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="Search agents..."
                  className="flex-grow bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                />
              </div>
            )}
          </div>

          {/* Agent List - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-3" />
                <p className="text-sm text-gray-600">Loading agents...</p>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="m-4">
                <div className="flex items-start gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-sm">Error loading agents</div>
                    <div className="text-xs mt-1">{error}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Agent Cards */}
            {!isLoading && !error && filteredAgents.length > 0 && (
              <div className="divide-y divide-gray-100">
                {filteredAgents.map((agent, index) => (
                  <button
                    key={`${agent.agentName}-${index}`}
                    onClick={() => handleAgentSelect(agent.agentName)}
                    className={`w-full p-4 text-left transition-colors hover:bg-gray-50 ${
                      selectedAgent === agent.agentName
                        ? "bg-blue-50 border-l-4 border-blue-500"
                        : "border-l-4 border-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          selectedAgent === agent.agentName
                            ? "bg-blue-500"
                            : "bg-gray-100"
                        }`}
                      >
                        <User
                          className={`w-5 h-5 ${
                            selectedAgent === agent.agentName
                              ? "text-white"
                              : "text-gray-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {agent.agentName}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs text-gray-500 font-mono">
                            ID: {agent.agentDetails?.agentId || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Empty Filter Results */}
            {!isLoading && !error && filteredAgents.length === 0 && agents.length > 0 && (
              <div className="text-center py-12 px-4">
                <Search className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-gray-700 mb-1">
                  No agents found
                </h3>
                <p className="text-xs text-gray-500">
                  Try adjusting your search
                </p>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && agents.length === 0 && (
              <div className="text-center py-12 px-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">
                  No agents available
                </h3>
                <p className="text-xs text-gray-500">
                  Check your API key
                </p>
              </div>
            )}
          </div>

          {/* Sort Controls */}
          {!isLoading && agents.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span>Sort by:</span>
                <button
                  onClick={() => toggleSort("name")}
                  className={`px-2 py-1 rounded hover:bg-gray-200 transition-colors ${
                    sortBy === "name" ? "bg-gray-200 font-medium" : ""
                  }`}
                >
                  Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
                <button
                  onClick={() => toggleSort("count")}
                  className={`px-2 py-1 rounded hover:bg-gray-200 transition-colors ${
                    sortBy === "count" ? "bg-gray-200 font-medium" : ""
                  }`}
                >
                  Count {sortBy === "count" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Agent Details */}
        <div className="flex-1 bg-gray-50 overflow-y-auto">
          {!selectedAgent && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center px-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No Agent Selected
                </h3>
                <p className="text-gray-500 max-w-sm">
                  Select an agent from the list to view their performance dashboard and metrics
                </p>
              </div>
            </div>
          )}

          {selectedAgent && (() => {
            const agentData = agents.find((a) => a.agentName === selectedAgent);
            const details = agentData?.agentDetails;

            return (
              <div className="p-6">
                {/* Agent Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {selectedAgent}
                        </h2>
                        <div className="flex items-center gap-2 mt-2">
                          <TrendingUp className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            <span className="font-semibold">
                              {agentData?.listingCount || 0}
                            </span>{" "}
                            total listings
                          </span>
                        </div>
                        {details?.agentId && (
                          <div className="text-xs text-gray-500 mt-1">
                            ID: {details.agentId}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedAgent(null)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Step 5: Auto-Categorization Tags */}
                {categories.length > 0 && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-sm border border-blue-200 p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      Agent Specializations
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category, idx) => (
                        <div
                          key={idx}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm shadow-sm transition-transform hover:scale-105 ${
                            category.color === "purple"
                              ? "bg-purple-100 text-purple-800 border border-purple-300"
                              : category.color === "blue"
                              ? "bg-blue-100 text-blue-800 border border-blue-300"
                              : category.color === "green"
                              ? "bg-green-100 text-green-800 border border-green-300"
                              : category.color === "orange"
                              ? "bg-orange-100 text-orange-800 border border-orange-300"
                              : category.color === "teal"
                              ? "bg-teal-100 text-teal-800 border border-teal-300"
                              : category.color === "indigo"
                              ? "bg-indigo-100 text-indigo-800 border border-indigo-300"
                              : "bg-gray-100 text-gray-800 border border-gray-300"
                          }`}
                        >
                          <span className="text-lg">{category.icon}</span>
                          <span>{category.name}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-xs text-gray-600 italic">
                      💡 Auto-generated based on listing data and performance metrics
                    </div>
                  </div>
                )}

                {/* Step 2: Agent Profile Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-600" />
                    Agent Profile
                  </h3>

                  <div className="space-y-4">
                    {/* Contact Information */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Contact Information</h4>
                      <div className="space-y-2">
                        {details?.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <a
                              href={`mailto:${details.email}`}
                              className="text-blue-600 hover:underline"
                            >
                              {details.email}
                            </a>
                          </div>
                        )}
                        {details?.phones && details.phones.length > 0 && (
                          <div className="flex items-start gap-2 text-sm">
                            <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div className="flex flex-col gap-1">
                              {details.phones.map((phone, idx) => (
                                <a
                                  key={idx}
                                  href={`tel:${phone}`}
                                  className="text-blue-600 hover:underline"
                                >
                                  {phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                        {details?.website && (
                          <div className="flex items-center gap-2 text-sm">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <a
                              href={details.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {details.website}
                            </a>
                          </div>
                        )}
                        {!details?.email && (!details?.phones || details.phones.length === 0) && !details?.website && (
                          <p className="text-sm text-gray-500 italic">No contact information available</p>
                        )}
                      </div>
                    </div>

                    {/* Brokerage Information */}
                    {details?.brokerage && (
                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Brokerage</h4>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2 text-sm">
                            <Building2 className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                              <div className="font-medium text-gray-900">
                                {details.brokerage.name}
                              </div>
                              {details.brokerage.address && (
                                <div className="text-gray-600 mt-1">
                                  {details.brokerage.address.address1 && (
                                    <div>{details.brokerage.address.address1}</div>
                                  )}
                                  {details.brokerage.address.address2 && (
                                    <div>{details.brokerage.address.address2}</div>
                                  )}
                                  {(details.brokerage.address.city || details.brokerage.address.state || details.brokerage.address.postal) && (
                                    <div>
                                      {details.brokerage.address.city}
                                      {details.brokerage.address.city && details.brokerage.address.state && ", "}
                                      {details.brokerage.address.state} {details.brokerage.address.postal}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          {details.officeId && (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Briefcase className="w-3 h-3" />
                              Office ID: {details.officeId}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Additional Details */}
                    {(details?.position || details?.updatedOn) && (
                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Additional Details</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          {details.position && (
                            <div>Position: <span className="font-medium">{details.position}</span></div>
                          )}
                          {details.updatedOn && (
                            <div className="text-xs text-gray-500">
                              Last updated: {new Date(details.updatedOn).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 3: Listings Breakdown */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-gray-600" />
                    Listings Breakdown
                  </h3>

                  {isLoadingListings && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                  )}

                  {listingsError && !isLoadingListings && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{listingsError}</span>
                    </div>
                  )}

                  {!isLoadingListings && !listingsError && (activeListingsCount !== null || soldListingsCount !== null) && (
                    <div className="grid grid-cols-2 gap-4">
                      {/* Active Listings Card */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-green-700">Active</span>
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="text-3xl font-bold text-green-900">
                          {activeListingsCount ?? "-"}
                        </div>
                        <div className="text-xs text-green-600 mt-1">
                          Currently on market
                        </div>
                      </div>

                      {/* Sold Listings Card */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-blue-700">Sold</span>
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="text-3xl font-bold text-blue-900">
                          {soldListingsCount ?? "-"}
                        </div>
                        <div className="text-xs text-blue-600 mt-1">
                          Successfully closed
                        </div>
                      </div>

                      {/* Total Summary */}
                      <div className="col-span-2 mt-2 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Total Listings</span>
                          <span className="font-bold text-gray-900 text-lg">
                            {(activeListingsCount ?? 0) + (soldListingsCount ?? 0)}
                          </span>
                        </div>
                        {activeListingsCount !== null && soldListingsCount !== null && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                              <span>Active Rate</span>
                              <span className="font-medium">
                                {((activeListingsCount / ((activeListingsCount + soldListingsCount) || 1)) * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-green-500 h-full transition-all"
                                style={{
                                  width: `${(activeListingsCount / ((activeListingsCount + soldListingsCount) || 1)) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 4: Performance Metrics */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-gray-600" />
                    Performance Metrics
                  </h3>

                  {isLoadingMetrics && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                  )}

                  {metricsError && !isLoadingMetrics && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{metricsError}</span>
                    </div>
                  )}

                  {!isLoadingMetrics && !metricsError && (
                    <div className="space-y-6">
                      {/* Price Metrics */}
                      <div className="grid grid-cols-2 gap-4">
                        {/* Median Sale Price */}
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <div className="text-sm font-medium text-purple-700 mb-1">
                            Median Sale Price
                          </div>
                          <div className="text-2xl font-bold text-purple-900">
                            {medianSalePrice
                              ? `$${medianSalePrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                              : "N/A"}
                          </div>
                          <div className="text-xs text-purple-600 mt-1">
                            From sold listings
                          </div>
                        </div>

                        {/* Average List Price */}
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <div className="text-sm font-medium text-orange-700 mb-1">
                            Avg List Price
                          </div>
                          <div className="text-2xl font-bold text-orange-900">
                            {averageListPrice
                              ? `$${averageListPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                              : "N/A"}
                          </div>
                          <div className="text-xs text-orange-600 mt-1">
                            From active listings
                          </div>
                        </div>
                      </div>

                      {/* Days on Market Metrics */}
                      {(averageDaysOnMarket !== null || medianDaysOnMarket !== null) && (
                        <div className="grid grid-cols-2 gap-4">
                          {/* Average Days on Market */}
                          {averageDaysOnMarket !== null && (
                            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                              <div className="text-sm font-medium text-teal-700 mb-1">
                                Avg Days on Market
                              </div>
                              <div className="text-2xl font-bold text-teal-900">
                                {Math.round(averageDaysOnMarket)}
                              </div>
                              <div className="text-xs text-teal-600 mt-1">
                                From sold listings
                              </div>
                            </div>
                          )}

                          {/* Median Days on Market */}
                          {medianDaysOnMarket !== null && (
                            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                              <div className="text-sm font-medium text-cyan-700 mb-1">
                                Median Days on Market
                              </div>
                              <div className="text-2xl font-bold text-cyan-900">
                                {Math.round(medianDaysOnMarket)}
                              </div>
                              <div className="text-xs text-cyan-600 mt-1">
                                From sold listings
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Price Range */}
                      {priceRange && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <div className="text-sm font-medium text-gray-700 mb-2">
                            Price Range
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs text-gray-500">Minimum</div>
                              <div className="text-lg font-bold text-gray-900">
                                ${priceRange.min.toLocaleString()}
                              </div>
                            </div>
                            <div className="flex-1 mx-4">
                              <div className="h-2 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full" />
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-gray-500">Maximum</div>
                              <div className="text-lg font-bold text-gray-900">
                                ${priceRange.max.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Top Locations */}
                      {topLocations.length > 0 && (
                        <div className="pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-2 mb-3">
                            <MapPin className="w-4 h-4 text-gray-600" />
                            <h4 className="text-sm font-semibold text-gray-700">
                              Top Locations
                            </h4>
                          </div>
                          <div className="space-y-2">
                            {topLocations.map((location, idx) => (
                              <div
                                key={location.name}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {idx + 1}
                                  </div>
                                  <span className="text-sm font-medium text-gray-900">
                                    {location.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="text-xs text-gray-500">
                                    {location.count} listing{location.count !== 1 ? "s" : ""}
                                  </div>
                                  <div className="w-20 bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div
                                      className="bg-blue-500 h-full transition-all"
                                      style={{
                                        width: `${(location.count / topLocations[0].count) * 100}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* No data message */}
                      {!medianSalePrice &&
                       !averageListPrice &&
                       !averageDaysOnMarket &&
                       !medianDaysOnMarket &&
                       !priceRange &&
                       topLocations.length === 0 && (
                        <div className="text-center py-6 text-gray-500 text-sm">
                          Not enough listing data to calculate metrics
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
