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
with the Repliers API. The component automatically adjusts cluster precision based on zoom level:

- **Zoom 8 and below**: City-level clusters (thousands of properties)
- **Zoom 9-10**: District-level clusters  
- **Zoom 11-12**: Neighborhood-level clusters
- **Zoom 13-14**: Street-level clusters
- **Zoom 15+**: Individual properties

**Performance Features:**
- Server-side clustering reduces data transfer
- Only one API call per map movement
- Automatic precision adjustment optimizes performance
        `,
      },
    },
  },
};

/**
 * **Part 2: Alternative Dataset Comparison**
 *
 * This example uses a different API key to demonstrate how the same component
 * can display different property datasets. Perfect for comparing different
 * data sources or testing API key configurations.
 */
export const Part2_AlternativeDataset: Story = {
  args: {
    apiKey: SAMPLE_API_KEY,
    mapboxToken: SAMPLE_MAPBOX_TOKEN,
    initialCenter: [-98.5795, 39.8283], // Continental USA center
    initialZoom: 4,
    height: "100vh",
    width: "100vw",
    mapStyle: "mapbox://styles/mapbox/streets-v12",
  },
  parameters: {
    docs: {
      disable: true, // Hide from docs
    },
  },
};

/**
 * **Part 3: Custom Filters and Multi-Query Setup**
 *
 * This placeholder demonstrates how the component could be extended with
 * property filters (bedrooms, bathrooms, price range) and multi-query
 * functionality for complex search scenarios.
 */
export const Part3_FilteredSearch: Story = {
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
