import type { Meta, StoryObj } from "@storybook/react";
import { AIMapListings } from "./ai-map-listings";

const meta: Meta<typeof AIMapListings> = {
  title: "POCS/AI-MapListings",
  component: AIMapListings,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE_API_KEY = "pxI19UMy9zfw9vz5lRxoGpjJWXrMnm";
const SAMPLE_MAPBOX_TOKEN =
  "pk.eyJ1IjoicmVwbGllcnMiLCJhIjoiY21veDUxZ2U3MDd5NzQ4b2EzZnRrY3lzbCJ9.JNV9nyXhJVwMsSbG4I7KnA";

export const Default: Story = {
  args: {
    apiKey: SAMPLE_API_KEY,
    mapboxToken: SAMPLE_MAPBOX_TOKEN,
    height: "100vh",
    width: "100vw",
    mapStyle: "mapbox://styles/mapbox/streets-v12",
    centerCalculation: "city",
  },
};

export const NlpTest: Story = {
  args: {
    apiKey: SAMPLE_API_KEY,
    mapboxToken: SAMPLE_MAPBOX_TOKEN,
    height: "100vh",
    width: "100vw",
    mapStyle: "mapbox://styles/mapbox/streets-v12",
    centerCalculation: "city",
    expandDirection: "up",
    expandedHeight: "100%",
  },
};
