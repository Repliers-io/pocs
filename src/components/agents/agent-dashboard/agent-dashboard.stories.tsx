import type { Meta, StoryObj } from "@storybook/react";
import { AgentDashboard } from "./agent-dashboard";

const SAMPLE_API_KEY = "pxI19UMy9zfw9vz5lRxoGpjJWXrMnm";

const meta: Meta<typeof AgentDashboard> = {
  title: "POCS/Agents/Agent Performance Dashboard",
  component: AgentDashboard,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
## 🎯 Agent Performance Dashboard

A comprehensive dashboard for viewing real estate agent performance metrics, specializations,
and auto-generated categorizations based on their listing data.

This component was built as a proof-of-concept for TrustedOnly to help them:
- Sync agent rosters and pre-provision user accounts
- Categorize agents based on their specialties (luxury, property types, performance)
- Connect vendors with the right agents based on data-driven categories
- Provide a single homogenized view of agent data across multiple MLSs

## 🚀 Features

### ✅ Complete POC - All Features Implemented
- **Two-Tab Interface**: Switch between Agents and Brokerages views
- **Agent Directory**: Browse agents with search functionality (loads first 100 by default)
- **Brokerage Directory**: View all brokerages with agent counts and addresses
- **Flexible Agent Search**: Main search uses keyword parameter for fuzzy matching
- **Exact Match Search**: Separate inputs for precise agent name and agent ID matching
- **Brokerage Search**: Uses brokerage parameter for precise filtering
- **Search Button**: Explicit search control with Enter key support (no auto-debounce)
- **Scrollable Search**: Search fields scroll with results for maximum viewing space
- **Dynamic Brokerage Loading**: Click a brokerage to load ALL its agents via fresh API call
- **Agent Selection**: Select an agent to view their detailed dashboard
- **Agent Profile Card**: Complete contact info, brokerage details, and position
- **Listings Breakdown**: Active vs sold listings count with real-time data
- **Performance Metrics**: Median sale price, average list price, days on market, price range
- **Top Locations**: Geographic analysis showing top 5 cities by listing count
- **Auto-Categorization**: Intelligent agent specialization tags:
  - 💎 Luxury Specialist (median sale > $1M)
  - 📊 High Volume (20+ listings)
  - ⚡ Fast Seller (avg days on market < 30)
  - 🏆 Premium Market (avg list price > $750K)
  - 📈 Active Inventory Focus (more active than sold)
  - 📍 Geographic Specialist (>60% in one location)

## 📖 How to Use

1. **Agents Tab**:
   - On mount, loads first 100 agents from the MLS
   - **Main Search**: Use keyword search for flexible agent matching (searches across names)
   - **Exact Match Search**: Use the dedicated fields below for precise searches:
     - Agent Name field requires exact database name
     - Agent ID field requires exact database ID
   - Click "Search" button or press Enter to execute search
   - Click an agent to view their detailed performance dashboard
2. **Brokerages Tab**:
   - View all brokerages extracted from member data
   - See agent count and address for each brokerage
   - Search for specific brokerages using precise brokerage filtering
   - Click a brokerage to dynamically load ALL agents from that brokerage
   - Then click any agent to view their dashboard
3. **Test Different Keys**: Use the Controls panel to test with different API keys

## 🔑 API Key

The component requires a valid Repliers API key. You can:
- Use the default sample key (for demo data)
- Enter your own key via the Controls panel in Storybook
- Pass it as a prop when using the component

## 🛠️ Technical Details

**API Approach:**

The component uses the \`/members\` endpoint with different parameters for different search types:

1. **Initial Load (Agents Tab)**: Fetches first 100 members using \`GET /members\`
2. **Search Parameters**:
   - Main search (Agents tab): Uses \`keyword\` parameter for flexible matching
   - Exact search (Agents tab): Uses \`agentName\` and/or \`agentId\` parameters for precise matching
   - Brokerages tab: Uses \`brokerage\` parameter for brokerage-specific filtering
3. **Brokerage Loading**: When a brokerage is selected, uses \`brokerage\` parameter to fetch ALL agents from that brokerage
4. **Agent Identification**: Uses \`agentId\` (not name) as the primary identifier for all subsequent API calls

**API Endpoints Used:**
- \`GET /members\` - Load first 100 agents on mount (Agents tab)
- \`GET /members?keyword={search}\` - Main agent search with flexible matching (Agents tab)
- \`GET /members?agentName={name}\` - Exact agent name search (Agents tab exact search section)
- \`GET /members?agentId={id}\` - Exact agent ID search (Agents tab exact search section)
- \`GET /members?brokerage={name}\` - Search by brokerage (Brokerages tab and brokerage agent loading)
- \`GET /listings?agentId={id}&status=A&limit=1\` - Get active listings count for selected agent
- \`GET /listings?agentId={id}&status=U&limit=1\` - Get sold listings count for selected agent
- \`GET /listings?agentId={id}&status=U&listings=false&statistics=...\` - Get sold listing statistics
- \`GET /listings?agentId={id}&status=A&listings=false&statistics=...\` - Get active listing statistics
- \`GET /listings?agentId={id}&status=A&status=U&limit=100&fields=address.city\` - Get location data

**Key Implementation Details:**
- **Dual search modes**: Main search uses \`keyword\` for flexible matching, separate exact search section uses \`agentName\`/\`agentId\` for precise matching
- **Tab-aware searching**: Uses \`keyword\` on Agents tab main search, \`brokerage\` on Brokerages tab
- **Exact match section**: Dedicated UI section on Agents tab with warning message about exact matching requirements
- **Scrollable UI**: Search fields and results in same scrollable container for maximum viewing space
- **agentId filtering**: All listing API calls use \`agentId\` parameter for precise filtering
- **Brokerage extraction**: Brokerages are built from member data (brokerage.name, officeId, address)
- **Dynamic loading**: Selecting a brokerage triggers a fresh API call with \`brokerage\` parameter
- **Search UX**: Explicit search button (no debounce) with Enter key support for better user control

**Props:**
- \`apiKey\` (required): Your Repliers API key
- \`className\` (optional): Additional CSS classes

## 🧪 POC Status

- ✅ **Step 1**: Agent directory with listing counts - **COMPLETE**
- ✅ **Step 2**: Agent profile display - **COMPLETE**
- ✅ **Step 3**: Listings breakdown (active/sold) - **COMPLETE**
- ✅ **Step 4**: Performance metrics - **COMPLETE**
- ✅ **Step 5**: Auto-categorization - **COMPLETE**

**🎉 Full POC is ready for testing and demonstration!**
        `,
      },
    },
  },
  argTypes: {
    apiKey: {
      control: "text",
      description: "Your Repliers API key (required)",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: SAMPLE_API_KEY },
      },
    },
    className: {
      control: "text",
      description: "Additional CSS classes for custom styling",
      table: {
        type: { summary: "string" },
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AgentDashboard>;

/**
 * **Complete Agent Performance Dashboard POC**
 *
 * This is the full interactive demo showing all implemented features.
 * The component uses the /members endpoint to provide efficient agent and brokerage discovery.
 *
 * **What's Implemented:**
 * - Two-tab interface (Agents and Brokerages)
 * - Agent directory (loads first 100 members on mount)
 * - Brokerage directory (extracted from member data with counts and addresses)
 * - Smart search with intelligent parameter selection (agentId, agentName, brokerage)
 * - Agent ID auto-detection for exact matching
 * - Tab-aware search (agentName on Agents tab, brokerage on Brokerages tab)
 * - Dynamic brokerage agent loading (click brokerage to load ALL its agents)
 * - Agent selection with detailed view
 * - Complete agent profile (contact info, brokerage, position)
 * - Listings breakdown (active vs sold counts)
 * - Performance metrics (prices, days on market, top locations)
 * - Auto-categorization with intelligent specialization tags
 * - Error handling for invalid API keys
 *
 * **Try these interactions:**
 * 1. **Agents Tab**:
 *    - Watch the first 100 agents load automatically
 *    - Use main search for flexible keyword matching (searches across agent names)
 *    - Use the exact search section below for precise matching:
 *      - Enter exact agent name from database
 *      - Enter exact agent ID from database
 *    - Click "Search" or press Enter to execute
 *    - Click an agent card to view their dashboard
 * 2. **Brokerages Tab**:
 *    - View all brokerages with agent counts
 *    - Search by brokerage name (uses brokerage parameter)
 *    - Click a brokerage to dynamically load ALL its agents
 *    - Click any agent from the brokerage to view their dashboard
 * 3. **Agent Dashboard**:
 *    - Auto-generated specialization badges
 *    - Contact information and brokerage details
 *    - Active vs sold listings breakdown
 *    - Performance metrics and statistics
 *    - Top locations where they list properties
 *
 * **Auto-Categorization Logic:**
 * The dashboard automatically assigns specialization tags based on:
 * - 💎 Luxury: Median sale price > $1M
 * - 📊 High Volume: 20+ total listings
 * - ⚡ Fast Seller: Average days on market < 30
 * - 🏆 Premium Market: Average list price > $750K
 * - 📈 Active Inventory: More active than sold listings
 * - 📍 Geographic Specialist: >60% listings in one city
 */
export const FullPOC: Story = {
  args: {
    apiKey: SAMPLE_API_KEY,
  },
  parameters: {
    docs: {
      description: {
        story: `
🎯 **Full POC - Ready for Testing & Demonstration!**

**All features are complete and fully functional.** This dashboard demonstrates the complete agent performance analytics system with efficient member-based discovery.

**What to test:**
1. **Agents Tab**:
   - Automatically loads first 100 agents on mount
   - **Main Search**: Use keyword parameter for flexible, fuzzy matching across agent names
   - **Exact Search**: Use dedicated section below for precise matching:
     - Enter exact agent name (must match database exactly)
     - Enter exact agent ID (must match database exactly)
   - Click Search or press Enter to execute
   - Click any agent card to view their complete profile
2. **Brokerages Tab**:
   - View all brokerages extracted from member data
   - Search by brokerage name (precise brokerage parameter filtering)
   - See agent count and address for each brokerage
   - Click a brokerage to dynamically load ALL its agents
   - Click any agent from the brokerage list to view their dashboard
3. **Agent Dashboard** (after selection):
   - Auto-generated specialization badges based on performance
   - Contact details, brokerage info, and position
   - Active vs sold listings breakdown with real-time data
   - Performance metrics: prices, days on market, price range
   - Top 5 locations by listing count
4. **Search Functionality**:
   - Explicit search button (no auto-debounce)
   - Enter key support for quick searches
   - Clear button to reset search

**Auto-Categorization in Action:**
The system intelligently categorizes agents by analyzing their metrics:
- High-performing luxury agents get 💎 Luxury Specialist tag
- Agents with 20+ listings get 📊 High Volume tag
- Quick sellers (< 30 days avg) get ⚡ Fast Seller tag
- Premium market focus (> $750K avg) gets 🏆 Premium Market tag
- More active than sold gets 📈 Active Inventory Focus tag
- Geographic concentration (>60% in one city) gets 📍 City Specialist tag

**API Implementation:**
The component uses the /members endpoint with dual search modes:
- Initial load: \`GET /members\` (first 100 members)
- Main search (Agents tab): Uses \`keyword\` parameter for flexible, fuzzy matching
- Exact search (Agents tab): Uses \`agentName\` and/or \`agentId\` parameters for precise matching
- Brokerage search: Uses \`brokerage\` parameter on Brokerages tab
- Brokerage agents: Uses \`brokerage\` parameter to get ALL agents from a specific brokerage
- Agent filtering: Uses \`agentId\` parameter (not name) for precise listing queries
- Parallel calls: Simultaneously fetches active count, sold count, and statistics on agent selection

Use the Controls panel to test with different API keys!
        `,
      },
    },
  },
};
