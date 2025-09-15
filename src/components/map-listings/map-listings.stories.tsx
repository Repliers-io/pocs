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
    centerCalculation: {
      control: "select",
      options: ["average", "city"],
      description:
        "Center calculation method: 'average' uses density-weighted center, 'city' finds busiest city",
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
    centerCalculation: "average",
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
Uses 'average' method by default - finds the densest area using a 20x20 grid analysis
of 500 sample listings. Try switching the \`centerCalculation\` control to 'city' to
compare with the busiest city method.

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
 * **Part 2: Average Center Calculation (Density-Weighted)**
 *
 * This example demonstrates the 'average' center calculation method, which uses
 * a density grid approach to find the area with the highest concentration of
 * listings. This method is ideal for finding hotspots that might be between cities.
 */
export const Part2_AverageCenter: Story = {
  args: {
    apiKey: "9F9oOgiUJylmCyRFzb8YkfLOpdcwkp",
    mapboxToken: SAMPLE_MAPBOX_TOKEN,
    centerCalculation: "city",
    initialZoom: 10,
    height: "100vh",
    width: "100vw",
    mapStyle: "mapbox://styles/mapbox/streets-v12",
  },
  parameters: {
    docs: {
      description: {
        story: `
🎯 **Average Center Calculation**

This method uses a 20x20 density grid to analyze 500 sample listings and finds the
geographic area with the highest concentration of properties.

**How it works:**
- Fetches 500 sample listings from your API key's dataset
- Divides the area into a 400-cell grid (20x20)
- Counts listings in each grid cell
- Centers the map on the densest grid cell

**Best for:**
- Finding hotspots between multiple cities
- Density-based centering regardless of city boundaries
- When you want to focus on listing concentration patterns

**Console output:** \`📍 Density-weighted center: [-79.3832, 43.6532] (density: 0.42)\`
        `,
      },
    },
  },
};

/**
 * **Part 3: City Center Calculation (Busiest City)**
 *
 * This example demonstrates the 'city' center calculation method, which uses
 * city aggregates to find the actual city with the most listings and centers
 * the map on that specific city location.
 */
export const Part3_CityCenter: Story = {
  args: {
    apiKey: SAMPLE_API_KEY,
    mapboxToken: SAMPLE_MAPBOX_TOKEN,
    centerCalculation: "city",
    initialZoom: 10,
    height: "100vh",
    width: "100vw",
    mapStyle: "mapbox://styles/mapbox/streets-v12",
  },
  parameters: {
    docs: {
      description: {
        story: `
🏙️ **City Center Calculation**

This method uses the Repliers API city aggregates to identify the actual city
with the most listings and centers the map precisely on that city.

**How it works:**
- Calls \`/listings?aggregates=address.city\` to get city listing counts
- Identifies the city with the highest number of listings
- Calls \`/listings?address.city=BusiestCity\` to get coordinates
- Centers the map on that city's location

**Best for:**
- Focusing on actual city centers with most activity
- When you want to avoid centering between cities
- Clear city-based geographic targeting

**Example process:**
1. 🏆 Busiest city: Toronto with 24,938 listings
2. 🎯 City center for Toronto: [-79.3832, 43.6532]

**Console output:** \`🏆 Busiest city: Toronto with 24938 listings\` → \`🎯 City center for Toronto: [-79.3832, 43.6532]\`
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
    centerCalculation: "average",
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
