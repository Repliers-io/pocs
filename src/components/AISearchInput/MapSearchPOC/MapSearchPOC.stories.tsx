import type { Meta, StoryObj } from '@storybook/react';
import { MapSearchPOC } from './index';

const meta: Meta<typeof MapSearchPOC> = {
  title: 'pocs/AISearchInput/MapSearchPOC',
  component: MapSearchPOC,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# MapSearchPOC - AI-Powered Property Map Search

A full-screen property search experience combining natural language AI search with an interactive map.

## Features

- **Natural Language Search**: Use conversational queries like "3 bedroom condo in Toronto under $800k"
- **Real-time Map Updates**: Map automatically filters and zooms to match your search
- **Property Clustering**: Smart clustering based on zoom level for better performance
- **Active Filters Display**: See exactly what filters are applied from your search
- **Results Count**: Live count of properties matching your criteria

## How It Works

1. **Search**: Type a natural language query (e.g., "waterfront houses in Vancouver")
2. **AI Extraction**: OpenAI extracts entities (location, bedrooms, price, etc.)
3. **Map Sync**: Map zooms to the location and applies filters
4. **Clusters Display**: Properties appear as clusters that expand when clicked

## Example Searches

- "3 bedroom condos in Toronto under $800k"
- "Houses in Liberty Village with parking"
- "Waterfront properties in Vancouver"
- "4 bed detached house under $1.5M in Mississauga"

## API Requirements

This component requires three API keys:
- **OpenAI API Key**: For natural language entity extraction
- **Repliers API Key**: For property data and search
- **Mapbox Token**: For map display and interaction
        `,
      },
    },
  },
  argTypes: {
    openaiApiKey: {
      control: 'text',
      description: '🔑 OpenAI API key (get yours at: https://platform.openai.com/api-keys) - starts with "sk-"',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    repliersApiKey: {
      control: 'text',
      description: '🔑 Repliers API key - Already configured with default',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'pxI19UMy9zfw9vz5lRxoGpjJWXrMnm' },
      },
    },
    mapboxToken: {
      control: 'text',
      description: '🔑 Mapbox token - Already configured with default',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'pk.eyJ1IjoibWlsYW5zb21hIiwiYSI6ImNtZWJrODZmajBwMWQya3B3cHE1M2Y3anoifQ.HMDLOc-6V9K3-mHKeTHHxw' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MapSearchPOC>;

/**
 * Default story - Full-screen map search POC
 *
 * **📋 QUICK START - Just add your OpenAI API Key:**
 *
 * 1. ✅ **Repliers API Key** - Already configured
 * 2. ✅ **Mapbox Token** - Already configured
 * 3. ⚠️ **OpenAI API Key** - Get yours: https://platform.openai.com/api-keys (starts with "sk-")
 *
 * **Paste your OpenAI key in the Controls panel below!**
 *
 * **Test Searches to Try:**
 * - "3 bedroom condos in Toronto under $800k"
 * - "Houses in Liberty Village with parking"
 * - "Waterfront properties in Vancouver"
 * - "4 bed detached house under $1.5M in Mississauga"
 */
export const Default: Story = {
  args: {
    // ⚠️ PASTE YOUR OPENAI KEY HERE (or in Controls panel below)
    openaiApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',

    // ✅ Repliers API key (already configured)
    repliersApiKey: 'pxI19UMy9zfw9vz5lRxoGpjJWXrMnm',

    // ✅ Mapbox token (already configured)
    mapboxToken: 'pk.eyJ1IjoibWlsYW5zb21hIiwiYSI6ImNtZWJrODZmajBwMWQya3B3cHE1M2Y3anoifQ.HMDLOc-6V9K3-mHKeTHHxw',
  },
};

/**
 * 🛠️ Setup Helper - Start Here!
 *
 * **Step-by-Step Setup Guide:**
 *
 * 1. **OpenAI API Key** (Required)
 *    - Go to: https://platform.openai.com/api-keys
 *    - Click "Create new secret key"
 *    - Copy the key (starts with "sk-")
 *    - Paste it in the "openaiApiKey" field in Controls below
 *
 * 2. **Mapbox Token** ✅ Already configured!
 *    - Default token is already set
 *    - You don't need to change this
 *
 * 3. **Repliers API Key** ✅ Already configured!
 *    - Default key is already set
 *    - You don't need to change this
 *
 * Once you've pasted your OpenAI key in the Controls panel below, try searching for:
 * "3 bedroom condos in Toronto under $800k"
 */
export const SetupHelper: Story = {
  args: {
    openaiApiKey: '',  // 👈 PASTE YOUR OPENAI KEY HERE
    repliersApiKey: 'pxI19UMy9zfw9vz5lRxoGpjJWXrMnm',  // ✅ Already set
    mapboxToken: 'pk.eyJ1IjoibWlsYW5zb21hIiwiYSI6ImNtZWJrODZmajBwMWQya3B3cHE1M2Y3anoifQ.HMDLOc-6V9K3-mHKeTHHxw',  // ✅ Already set
  },
  parameters: {
    docs: {
      description: {
        story: '👆 Use the Controls panel below to paste your OpenAI API key and get started!',
      },
    },
  },
};

/**
 * Toronto Focus - Pre-configured for Toronto area searches
 */
export const TorontoFocus: Story = {
  args: {
    openaiApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
    repliersApiKey: 'pxI19UMy9zfw9vz5lRxoGpjJWXrMnm',
    mapboxToken: 'pk.eyJ1IjoibWlsYW5zb21hIiwiYSI6ImNtZWJrODZmajBwMWQya3B3cHE1M2Y3anoifQ.HMDLOc-6V9K3-mHKeTHHxw',
  },
  parameters: {
    docs: {
      description: {
        story: 'Try searching for "condos in downtown Toronto" or "houses in North York"',
      },
    },
  },
};

/**
 * Luxury Properties - For high-end property searches
 */
export const LuxuryProperties: Story = {
  args: {
    openaiApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
    repliersApiKey: 'pxI19UMy9zfw9vz5lRxoGpjJWXrMnm',
    mapboxToken: 'pk.eyJ1IjoibWlsYW5zb21hIiwiYSI6ImNtZWJrODZmajBwMWQya3B3cHE1M2Y3anoifQ.HMDLOc-6V9K3-mHKeTHHxw',
  },
  parameters: {
    docs: {
      description: {
        story: `
**Example Luxury Searches:**
- "luxury homes over $2M with waterfront"
- "5 bedroom mansion in Oakville"
- "penthouse condo with rooftop terrace in Toronto"
- "estate with pool and wine cellar"
        `,
      },
    },
  },
};
