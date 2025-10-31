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
} from "lucide-react";

// Types for agent/member data
export interface AgentMember {
  memberId: string;
  name: string;
  email?: string;
  phone?: string;
  officeId?: string;
  officeName?: string;
  brokerageName?: string;
  licenseNumber?: string;
  [key: string]: any;
}

// Type for aggregate results
export interface AgentAggregate {
  agentName: string;
  listingCount: number;
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

      // Build agent list from the listings
      const agentMap = new Map<string, number>();

      data.listings?.forEach((listing: any) => {
        if (listing.agents && Array.isArray(listing.agents)) {
          listing.agents.forEach((agent: any) => {
            if (agent.name) {
              const currentCount = agentMap.get(agent.name) || 0;
              agentMap.set(agent.name, currentCount + 1);
            }
          });
        }
      });

      console.log(`Found ${agentMap.size} unique agents`);

      // Transform map into agent list
      const agentList: AgentAggregate[] = Array.from(agentMap.entries())
        .map(([name, count]) => ({
          agentName: name,
          listingCount: count,
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
                          <TrendingUp className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            <span className="font-semibold">{agent.listingCount}</span> listings
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

          {selectedAgent && (
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
                            {agents.find((a) => a.agentName === selectedAgent)?.listingCount || 0}
                          </span>{" "}
                          total listings
                        </span>
                      </div>
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

              {/* Step 1 Complete Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-blue-900 text-sm">
                      Step 1 Complete!
                    </div>
                    <div className="text-sm text-blue-700 mt-1">
                      Agent list loaded successfully. Next steps will load detailed profile, performance metrics, and auto-categorization.
                    </div>
                  </div>
                </div>
              </div>

              {/* Placeholder for future content */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  More Details Coming Soon
                </h3>
                <p className="text-gray-500 text-sm">
                  Agent profile, performance metrics, and categorization will appear here in the next steps
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
