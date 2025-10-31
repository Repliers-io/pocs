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

### Current (Step 1 - Testable)
- **Agent Directory Loading**: Uses aggregates to load all agents from your MLS
- **Listing Counts**: Shows total listing count (active + sold) for each agent
- **Sortable Table**: Click column headers to sort by name or listing count
- **Filter/Search**: Filter agents by name in real-time
- **Agent Selection**: Select an agent to view their detailed dashboard

### Coming Soon
- Agent profile card with detailed information
- Performance metrics (active vs sold, median prices, days on market)
- Auto-categorization (Luxury, Volume, Property Type specialists)
- Listings breakdown and visualizations
- Geographic focus and market insights

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
- More endpoints will be added in future steps (individual agent details, stats, etc.)

**Note:** This approach works well for MLSs with moderate listing counts. For very large datasets (10,000+ listings), consider implementing pagination or using alternative filtering strategies.

**Props:**
- \`apiKey\` (required): Your Repliers API key
- \`className\` (optional): Additional CSS classes

## 🧪 Testing Progress

- ✅ **Step 1**: Agent search with autocomplete - **READY TO TEST**
- ⏳ **Step 2**: Agent profile display
- ⏳ **Step 3**: Listings counts
- ⏳ **Step 4**: Performance metrics
- ⏳ **Step 5**: Auto-categorization
- ⏳ **Step 6**: Visualizations
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
 * **Step 1: Agent Directory with Aggregates (Currently Testable)**
 *
 * This is the main interactive demo showing the agent directory loaded using aggregates.
 * The component automatically loads all agents on mount.
 *
 * **What's Working:**
 * - Aggregates-based agent loading (all agents in MLS)
 * - Listing counts for each agent
 * - Sortable table (by name or count)
 * - Real-time filtering
 * - Agent selection
 * - Error handling for invalid API keys
 *
 * **Try these interactions:**
 * 1. Watch the agent list load automatically
 * 2. Click column headers to sort
 * 3. Use the search box to filter by name
 * 4. Click "View Details" to select an agent
 * 5. View the selected agent confirmation
 *
 * **Next Steps:**
 * Once an agent is selected, we'll load their:
 * - Full profile details (using /members endpoint)
 * - Active vs Sold listing breakdown
 * - Performance metrics (median price, days on market)
 * - Auto-generated specialization tags
 */
export const Step1_AgentDirectory: Story = {
  args: {
    apiKey: SAMPLE_API_KEY,
  },
  parameters: {
    docs: {
      description: {
        story: `
🎯 **This is the current interactive demo!**

**Step 1 is complete and ready to test.** The component uses the aggregates API to load all agents with their listing counts.

**What to test:**
1. Component loads automatically on mount
2. Agent table displays with listing counts
3. Sort by clicking column headers
4. Filter agents using the search box
5. Select an agent by clicking "View Details"
6. Verify the selected agent confirmation appears below

**API Implementation Note:**
The component fetches listings and manually extracts agents from the \`agents[]\` array since the aggregates parameter doesn't support array fields.

**What the API returns:**
Each listing contains an \`agents\` array with agent objects including:
- \`agentId\`, \`name\`, \`email\`, \`phones\`
- \`brokerage\` information (name, address)
- \`officeId\` and other metadata

The component processes this data to build the agent directory with listing counts.

Use the Controls panel to test with different API keys!
        `,
      },
    },
  },
};

/**
 * **Custom API Key**
 *
 * Use this story variant to test with your own API key.
 * Edit the apiKey prop in the Controls panel below.
 */
export const CustomAPIKey: Story = {
  args: {
    apiKey: "",
  },
  parameters: {
    docs: {
      description: {
        story: `
Use this variant to test with your own Repliers API key.

1. Open the Controls panel below
2. Enter your API key in the "apiKey" field
3. Start searching for agents

This is useful for testing with your specific MLS data.
        `,
      },
    },
  },
};
