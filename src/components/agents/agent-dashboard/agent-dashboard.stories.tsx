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
- **Agent Directory Loading**: Uses aggregates to load all agents from your MLS
- **Listing Counts**: Shows total listing count (active + sold) for each agent
- **Sortable Table**: Click column headers to sort by name or listing count
- **Filter/Search**: Filter agents by name in real-time
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

1. **Component Loads Automatically**: On mount, fetches all agents using aggregates
2. **View Agent List**: See all agents sorted by listing count (highest first)
3. **Sort & Filter**:
   - Click column headers to sort
   - Use search box to filter by name
4. **Select an Agent**: Click "View Details" to select an agent
5. **Test Different Keys**: Use the Controls panel to test with different API keys

## 🔑 API Key

The component requires a valid Repliers API key. You can:
- Use the default sample key (for demo data)
- Enter your own key via the Controls panel in Storybook
- Pass it as a prop when using the component

## 🛠️ Technical Details

**API Approach:**

Since the \`agents\` field is an array and cannot be aggregated directly using the aggregates parameter (attempting to do so returns a 400 error: "does not match any of the allowed types"), we use an alternative approach:

1. Fetch up to 1000 listings with \`fields=agents\` to minimize data transfer
2. Manually extract unique agents from the \`agents[]\` array in each listing
3. Count listing occurrences for each agent
4. Build the agent directory from this processed data

**API Endpoints Used:**
- \`/listings?status=A&status=U&limit=1000&fields=agents\` - Fetch listings to build agent directory
- \`/listings?agent={name}&status=A&limit=1\` - Get active listings count for selected agent
- \`/listings?agent={name}&status=U&limit=1\` - Get sold listings count for selected agent
- \`/listings?agent={name}&status=U&listings=false&statistics=...\` - Get sold listing statistics
- \`/listings?agent={name}&status=A&listings=false&statistics=...\` - Get active listing statistics
- \`/listings?agent={name}&status=A&status=U&limit=100&fields=address.city\` - Get location data

**Note:** This approach works well for MLSs with moderate listing counts. For very large datasets (10,000+ listings), consider implementing pagination or using alternative filtering strategies.

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
 * The component automatically loads all agents on mount and provides detailed
 * insights when you select an agent.
 *
 * **What's Implemented:**
 * - Agent directory with listing counts (all agents in MLS)
 * - Sortable table (by name or count)
 * - Real-time filtering
 * - Agent selection with detailed view
 * - Complete agent profile (contact info, brokerage, position)
 * - Listings breakdown (active vs sold counts)
 * - Performance metrics (prices, days on market, top locations)
 * - Auto-categorization with intelligent specialization tags
 * - Error handling for invalid API keys
 *
 * **Try these interactions:**
 * 1. Watch the agent list load automatically
 * 2. Click column headers to sort by name or listing count
 * 3. Use the search box to filter agents by name
 * 4. Click "View Details" to select an agent
 * 5. Explore the agent's complete profile with:
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

**All features are complete and fully functional.** This dashboard demonstrates the complete agent performance analytics system.

**What to test:**
1. **Agent Directory**: Component loads all agents automatically on mount
2. **Sorting & Filtering**: Click column headers to sort, use search to filter by name
3. **Agent Selection**: Click "View Details" on any agent to see their complete profile
4. **Profile Information**: View contact details, brokerage info, and position
5. **Listings Breakdown**: See active vs sold listings count with real-time data
6. **Performance Metrics**:
   - Median sale price and average list price
   - Average and median days on market
   - Price range (min/max)
   - Top 5 locations by listing count
7. **Auto-Categorization**: Watch specialization badges appear based on agent's performance data

**Auto-Categorization in Action:**
The system intelligently categorizes agents by analyzing their metrics:
- High-performing luxury agents get 💎 Luxury Specialist tag
- Agents with 20+ listings get 📊 High Volume tag
- Quick sellers (< 30 days avg) get ⚡ Fast Seller tag
- Premium market focus (> $750K avg) gets 🏆 Premium Market tag
- More active than sold gets 📈 Active Inventory Focus tag
- Geographic concentration (>60% in one city) gets 📍 City Specialist tag

**API Implementation:**
The component uses parallel API calls for optimal performance:
- Initial load: Fetches all listings to build agent directory
- On selection: Simultaneously fetches active count, sold count, and statistics
- Statistics API: Uses \`listings=false&statistics=...\` for efficient metric calculation

Use the Controls panel to test with different API keys!
        `,
      },
    },
  },
};
