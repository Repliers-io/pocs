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
  "pk.eyJ1IjoibWlsYW5zb21hIiwiYSI6ImNtZWJrODZmajBwMWQya3B3cHE1M2Y3anoifQ.HMDLOc-6V9K3-mHKeTHHxw";

export const Default: Story = {
  args: {
    apiKey: SAMPLE_API_KEY,
    mapboxToken: SAMPLE_MAPBOX_TOKEN,
    height: "100vh",
    width: "100vw",
    mapStyle: "mapbox://styles/mapbox/streets-v12",
    centerCalculation: "city"
  },
};
