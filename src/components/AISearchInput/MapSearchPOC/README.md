# MapSearchPOC - AI-Powered Property Map Search

A proof-of-concept component that combines AI-powered natural language search with a full-screen interactive property map.

## Overview

This component demonstrates the integration of:
- **AISearchInput**: Natural language query interface with OpenAI entity extraction
- **MapContainer**: Full-screen Mapbox map with property clustering
- **Real-time sync**: Search results instantly update the map view and filters

## Quick Start

```tsx
import { MapSearchPOC } from './components/AISearchInput/MapSearchPOC';

function App() {
  return (
    <MapSearchPOC
      openaiApiKey="sk-..."
      repliersApiKey="your-repliers-key"
      mapboxToken="pk...."
    />
  );
}
```

## Features

### 🤖 AI-Powered Search
- Natural language query processing
- Automatic entity extraction (location, bedrooms, price, etc.)
- Context-aware search refinement

### 🗺️ Interactive Map
- Full-screen Mapbox GL map
- Smart property clustering based on zoom level
- Click clusters to zoom in and explore
- Smooth animations and transitions

### 🔄 Real-time Sync
- Map automatically pans to searched location
- Filters applied instantly to visible properties
- Live results count
- Active filters display

### 📊 Property Clustering
- Zoom-based precision levels:
  - Zoom 1-8: City level
  - Zoom 9-10: District level
  - Zoom 11-12: Neighborhood level
  - Zoom 13-14: Street level
  - Zoom 15+: Individual properties

## Example Searches

Try these natural language queries:

- "3 bedroom condos in Toronto under $800k"
- "Houses in Liberty Village with parking"
- "Waterfront properties in Vancouver"
- "4 bed detached house under $1.5M in Mississauga"
- "Luxury homes over $2M with pool"

## Component Structure

```
MapSearchPOC/
├── index.tsx              # Main component - orchestrates everything
├── MapContainer.tsx       # Map with clustering logic
├── types.ts              # TypeScript type definitions
├── hooks/
│   ├── useMapFilters.ts  # Converts AI entities → API filters
│   └── useMapSync.ts     # Syncs map location with search
├── MapSearchPOC.stories.tsx  # Storybook stories
└── README.md             # This file
```

## API Requirements

### 1. OpenAI API Key
Required for natural language entity extraction.

```bash
NEXT_PUBLIC_OPENAI_API_KEY="sk-..."
```

Get your key at: https://platform.openai.com/api-keys

### 2. Repliers API Key
Required for property data and geocoding.

```bash
NEXT_PUBLIC_REPLIERS_API_KEY="your-key"
```

### 3. Mapbox Token
Required for map display.

```bash
NEXT_PUBLIC_MAPBOX_TOKEN="pk...."
```

Get your token at: https://account.mapbox.com/access-tokens/

## Development

### Run Storybook

```bash
npm run storybook
```

Navigate to `pocs/AISearchInput/MapSearchPOC` to see the component.

### Test Locally

```bash
npm run dev
```

Import and use the component in your Next.js pages.

## How It Works

### 1. User Types Query
```
"3 bedroom condo in Toronto under $800k"
```

### 2. OpenAI Extracts Entities
```json
{
  "location": "Toronto",
  "bedrooms": 3,
  "property_type": "Condo",
  "price_max": 800
}
```

### 3. Map Filters Applied
- City: Toronto
- Bedrooms: 3+
- Property Type: Condo
- Max Price: $800,000

### 4. Map Updates
- Zooms to Toronto
- Fetches clusters with filters
- Displays matching properties

## Customization

### Adjust Default Map Center

Edit [MapContainer.tsx](./MapContainer.tsx#L70):

```tsx
center: [-79.3832, 43.6532], // Toronto by default
```

### Change Cluster Colors

Edit [MapContainer.tsx](./MapContainer.tsx#L205):

```tsx
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Modify Zoom Precision Levels

Edit [MapContainer.tsx](./MapContainer.tsx#L12):

```tsx
function getClusterPrecision(zoom: number): number {
  // Adjust these thresholds
  if (zoom <= 8) return 1;
  // ...
}
```

## Troubleshooting

### Map Not Loading
- Check that `NEXT_PUBLIC_MAPBOX_TOKEN` is set
- Verify the token starts with `pk.`
- Check browser console for errors

### Search Not Working
- Verify `NEXT_PUBLIC_OPENAI_API_KEY` starts with `sk-`
- Check `NEXT_PUBLIC_REPLIERS_API_KEY` is valid
- Open browser console to see API request logs

### No Properties Showing
- Try a broader search (e.g., just "Toronto")
- Check that filters aren't too restrictive
- Zoom out to see more clusters

### Clusters Not Clicking
- Ensure map has finished loading
- Check browser console for JavaScript errors
- Try refreshing the page

## Technical Details

### State Management
- Uses React hooks (`useState`, `useEffect`, `useMemo`)
- No external state management library
- Map instance stored in ref for performance

### API Calls
- OpenAI: Entity extraction (GPT-4o-mini)
- Repliers NLP: Search context and query optimization
- Repliers Listings: Clustered property data
- Repliers Locations: Geocoding for map sync

### Performance Optimizations
- Clusters rendered based on zoom level
- Debounced search input
- Memoized filter transformations
- Map bounds-based fetching

## Future Improvements

- [ ] Property detail popups with images
- [ ] Save favorite searches
- [ ] Draw custom search areas
- [ ] Compare properties side-by-side
- [ ] Mobile-optimized layout
- [ ] Property type filtering UI
- [ ] Price range slider
- [ ] Sort by distance/price/newest

## License

Part of the Repliers POC repository.

## Questions?

Check the main [AISearchInput documentation](../AISearchInput.jsx) or reach out to the Repliers team.
