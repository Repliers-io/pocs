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
- **Keyword Search**: Search for agents or brokerages with 3+ character minimum
- **Search Button**: Explicit search control with Enter key support (no auto-debounce)
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
   - Use search to find specific agents (3+ characters)
   - Click "Search" button or press Enter to execute search
   - Click an agent to view their detailed performance dashboard
2. **Brokerages Tab**:
   - View all brokerages extracted from member data
   - See agent count and address for each brokerage
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

The component uses the \`/members\` endpoint for efficient agent and brokerage discovery:

1. **Initial Load (Agents Tab)**: Fetches first 100 members using \`GET /members\`
2. **Search**: Uses keyword parameter \`GET /members?keywords={query}\` for targeted searches
3. **Brokerage Loading**: When a brokerage is selected, makes a fresh API call with brokerage name/officeId to fetch ALL agents from that brokerage
4. **Agent Identification**: Uses \`agentId\` (not name) as the primary identifier for all subsequent API calls

**API Endpoints Used:**
- \`GET /members\` - Load first 100 agents on mount (Agents tab)
- \`GET /members?keywords={query}\` - Search for agents or brokerages
- \`GET /members?keywords={brokerageNameOrOfficeId}\` - Load all agents for a specific brokerage
- \`GET /listings?agentId={id}&status=A&limit=1\` - Get active listings count for selected agent
- \`GET /listings?agentId={id}&status=U&limit=1\` - Get sold listings count for selected agent
- \`GET /listings?agentId={id}&status=U&listings=false&statistics=...\` - Get sold listing statistics
- \`GET /listings?agentId={id}&status=A&listings=false&statistics=...\` - Get active listing statistics
- \`GET /listings?agentId={id}&status=A&status=U&limit=100&fields=address.city\` - Get location data

**Key Implementation Details:**
- **agentId filtering**: All listing API calls use \`agentId\` parameter for precise filtering
- **Brokerage extraction**: Brokerages are built from member data (brokerage.name, officeId, address)
- **Dynamic loading**: Selecting a brokerage triggers a fresh API call to get complete agent list
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
 * - Keyword search with explicit search button
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
 *    - Use search to find specific agents (3+ characters)
 *    - Click "Search" or press Enter to execute
 *    - Click an agent card to view their dashboard
 * 2. **Brokerages Tab**:
 *    - View all brokerages with agent counts
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
   - Search for specific agents (3+ characters, click Search or press Enter)
   - Click any agent card to view their complete profile
2. **Brokerages Tab**:
   - View all brokerages extracted from member data
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
The component uses the /members endpoint for efficient discovery:
- Initial load: \`GET /members\` (first 100 members)
- Search: \`GET /members?keywords={query}\` for targeted discovery
- Brokerage agents: Fresh API call with brokerage name/officeId to get ALL agents
- Agent filtering: Uses \`agentId\` parameter (not name) for precise listing queries
- Parallel calls: Simultaneously fetches active count, sold count, and statistics on agent selection

Use the Controls panel to test with different API keys!
        `,
      },
    },
  },
};
