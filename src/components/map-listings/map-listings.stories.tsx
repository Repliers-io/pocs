import type { Meta, StoryObj } from "@storybook/react";
import { MapListings } from "./map-listings";

const meta: Meta<typeof MapListings> = {
  title:
    "Tutorials/Configuring the MapListings Component with the Repliers API (WIP)",
  component: MapListings,
  parameters: {
    layout: "fullscreen",
    docs: {
      page: () => null, // Use MDX file instead
    },
  },
  argTypes: {
    apiKey: {
      control: "text",
      description: "Repliers API key (required)",
    },
    mapboxToken: {
      control: "text",
      description: "MapBox access token (required)",
    },
    initialCenter: {
      control: "object",
      description: "Initial map center coordinates [lng, lat]",
    },
    initialZoom: {
      control: { type: "range", min: 1, max: 20, step: 1 },
      description: "Initial zoom level",
    },
    height: {
      control: "text",
      description: "Map container height",
    },
    width: {
      control: "text",
      description: "Map container width",
    },
    mapStyle: {
      control: "select",
      options: [
        "mapbox://styles/mapbox/streets-v12",
        "mapbox://styles/mapbox/light-v11",
        "mapbox://styles/mapbox/dark-v11",
        "mapbox://styles/mapbox/satellite-v9",
        "mapbox://styles/mapbox/satellite-streets-v12",
      ],
      description: "MapBox map style",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE_API_KEY = "pxI19UMy9zfw9vz5lRxoGpjJWXrMnm";
const SAMPLE_MAPBOX_TOKEN =
  "pk.eyJ1IjoibWlsYW5zb21hIiwiYSI6ImNtZWJrODZmajBwMWQya3B3cHE1M2Y3anoifQ.HMDLOc-6V9K3-mHKeTHHxw";

/**
 * **Part 1: Basic Map Listings Display**
 *
 * This example shows the core functionality of displaying clustered real estate
 * listings on a map. Different API keys will show different datasets.
 *
 * **Try this:**
 * 1. Notice the large cluster numbers (hundreds/thousands of properties)
 * 2. Click any cluster to zoom in and see it break into smaller sub-clusters
 * 3. Continue drilling down until you reach individual blue property dots
 * 4. Click individual properties to see basic listing details
 * 5. Watch the property count update in the top-right corner
 */
export const Part1_BasicListings: Story = {
  args: {
    apiKey: SAMPLE_API_KEY,
    mapboxToken: SAMPLE_MAPBOX_TOKEN,
    initialZoom: 8,
    height: "100vh",
    width: "100vw",
    mapStyle: "mapbox://styles/mapbox/streets-v12",
  },
  parameters: {
    docs: {
      description: {
        story: `
🎯 **This is the main interactive demo!** This example demonstrates server-side clustering
with the Repliers API using the default 'average' center calculation method.

**Cluster Precision Levels:**
- **Zoom 6 and below**: Continental-level clusters (precision 3)
- **Zoom 7-8**: State/Province-level clusters (precision 5)
- **Zoom 9-10**: Metropolitan-level clusters (precision 8)
- **Zoom 11-12**: City-level clusters (precision 12)
- **Zoom 13-14**: District-level clusters (precision 16)
- **Zoom 15+**: Street-level clusters (precision 20)

**Center Calculation:**
Uses the largest cluster method to find the area with the most listings and centers the map on it.

**Performance Features:**
- Server-side clustering reduces data transfer
- Only one API call per map movement
- Cluster limit reduced to 100 for better distribution
        `,
      },
    },
  },
};

/**
 * **Part 2: Largest Cluster Center Calculation**
 *
 * This example demonstrates the largest cluster center calculation method, which
 * finds the cluster with the most listings and centers the map on it.
 * This provides optimal viewing of the most active areas.
 */
export const Part2_LargestClusterCenter: Story = {
  args: {
    apiKey: SAMPLE_API_KEY,
    mapboxToken: SAMPLE_MAPBOX_TOKEN,
    initialZoom: 10,
    height: "100vh",
    width: "100vw",
    mapStyle: "mapbox://styles/mapbox/streets-v12",
  },
  parameters: {
    docs: {
      description: {
        story: `
🏆 **Largest Cluster Center Calculation**

This method finds the largest cluster of listings and centers the map on it for optimal viewing.

**How it works:**
- Calls the clustering API with low precision to get the biggest clusters
- Identifies the cluster with the highest number of listings
- Centers the map on that cluster's location

**Best for:**
- Focusing on the most active area in your dataset
- Automatic centering on the densest listing concentration
- Quick identification of market hotspots

**Console output:** \`🏆 Largest cluster: 24938 listings at [-79.3832, 43.6532]\`
        `,
      },
    },
  },
};

/**
 * **Part 3: Different Map Styles**
 *
 * This example demonstrates different map styles available with the MapListings component.
 * You can choose from various MapBox styles to match your application's design.
 */
export const Part3_MapStyles: Story = {
  args: {
    apiKey: SAMPLE_API_KEY,
    mapboxToken: SAMPLE_MAPBOX_TOKEN,
    initialZoom: 10,
    height: "100vh",
    width: "100vw",
    mapStyle: "mapbox://styles/mapbox/dark-v11",
  },
  parameters: {
    docs: {
      description: {
        story: `
🎨 **Map Style Customization**

This example showcases the dark theme map style, demonstrating how you can customize
the visual appearance of your MapListings component.

**Available styles:**
- \`mapbox://styles/mapbox/streets-v12\` - Default streets view
- \`mapbox://styles/mapbox/light-v11\` - Light theme
- \`mapbox://styles/mapbox/dark-v11\` - Dark theme (shown here)
- \`mapbox://styles/mapbox/satellite-v9\` - Satellite imagery
- \`mapbox://styles/mapbox/satellite-streets-v12\` - Satellite with street labels

**Best for:**
- Matching your application's design theme
- Providing user choice for map appearance
- Better visibility in different lighting conditions

**Note:** The clustering and listing functionality remains the same across all styles.
        `,
      },
    },
  },
};

/**
 * **Part 4: Custom Filters and Multi-Query Setup**
 *
 * This placeholder demonstrates how the component could be extended with
 * property filters (bedrooms, bathrooms, price range) and multi-query
 * functionality for complex search scenarios.
 */
export const Part4_FilteredSearch: Story = {
  args: {
    apiKey: SAMPLE_API_KEY,
    mapboxToken: SAMPLE_MAPBOX_TOKEN,
    initialCenter: [-98.5795, 39.8283], // Continental USA center
    initialZoom: 4,
    height: "100vh",
    width: "100vw",
    mapStyle: "mapbox://styles/mapbox/streets-v12",
    // Note: These are placeholder props for future filter implementation
    // minBedrooms: 2,
    // maxPrice: 800000,
    // propertyTypes: ['residential', 'condo']
  },
  parameters: {
    docs: {
      disable: true, // Hide from docs
    },
  },
};
