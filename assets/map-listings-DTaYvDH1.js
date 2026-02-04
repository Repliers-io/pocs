import{j as e}from"./jsx-runtime-xF634gn_.js";import{useMDXComponents as i}from"./index-o2KxC7bF.js";import"./index-BqbJxbG0.js";import{M as t,P as o}from"./map-listings.stories-hK0TJn-L.js";import{M as l,C as c}from"./index-B9VInP_e.js";import"./index-C-7etoUd.js";import"./preview-DyJwRVR-.js";import"./iframe-BFm-Dita.js";import"./DocsRenderer-CFRXHY34-BzkcD5c9.js";import"./react-18-WyM8tkiX.js";import"./index-BKjiqKB3.js";import"./mapbox-gl-vCdO7wfF.js";import"./car-CJRJwKAe.js";import"./createLucideIcon-BmJP7rG3.js";import"./bath-D_6pRDEi.js";import"./x-C6fJ-1bL.js";import"./chevron-down-BzbnjZNy.js";import"./index-DmZMPOxo.js";import"./index-DgH-xKnr.js";import"./index-DrFu-skq.js";function r(s){const n={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...i(),...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(l,{of:t}),`
`,e.jsx(n.h1,{id:"configuring-maplistings-with-the-repliers-api",children:"Configuring MapListings with the Repliers API"}),`
`,e.jsx(n.p,{children:e.jsx(n.a,{href:"https://github.com/Repliers-io/pocs/blob/main/src/components/map-listings/map-listings.tsx",rel:"nofollow",children:e.jsx(n.strong,{children:"View the component code repository on GitHub"})})}),`
`,e.jsx(n.p,{children:"This tutorial focuses on building a high-performance real estate map that displays clustered property listings using the Repliers API. The component uses advanced server-side clustering and zoom-based precision for optimal performance with large datasets."}),`
`,e.jsx(n.h2,{id:"live-example",children:"Live Example"}),`
`,e.jsx(n.p,{children:"Try the component below - start by exploring the clustered listings on the map. Click clusters to zoom in and drill down to individual properties:"}),`
`,e.jsx(c,{of:o}),`
`,e.jsx(n.h3,{id:"why-server-side-clustering-matters",children:"Why Server-Side Clustering Matters"}),`
`,e.jsx(n.p,{children:"Server-side clustering is essential for real estate maps because it:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Handles massive datasets"})," - Display thousands of properties without browser performance issues"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Optimizes network requests"})," - Single API call per map view instead of fetching individual properties"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Provides hierarchical navigation"})," - Users can drill down from city-level to individual properties"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Reduces data transfer"})," - Only sends necessary cluster data based on zoom level"]}),`
`]}),`
`,e.jsx(n.h2,{id:"tech-stack-overview",children:"Tech Stack Overview"}),`
`,e.jsx(n.p,{children:"This tutorial uses:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"React 18"})," with TypeScript for type safety"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Next.js 14"})," for the development environment"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"MapBox GL JS"})," for interactive mapping"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Repliers API"})," for real estate clustering data ✨✨✨"]}),`
`]}),`
`,e.jsx(n.h2,{id:"component-architecture",children:"Component Architecture"}),`
`,e.jsx(n.p,{children:"The map listings component follows this data flow:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`Map Movement Event
    ↓
Get Current Bounds + Zoom Level
    ↓
Calculate Cluster Precision
    ↓
API Request to Repliers
    ├── Cluster data (zoom < 14)
    └── Individual properties (zoom ≥ 14)
    ↓
Process & Display Results
    ├── Render cluster circles with counts
    └── Render individual property dots
`})}),`
`,e.jsx(n.h2,{id:"api-implementation-details",children:"API Implementation Details"}),`
`,e.jsx(n.h3,{id:"core-clustering-endpoint",children:"Core Clustering Endpoint"}),`
`,e.jsx(n.p,{children:"The component makes requests to the Repliers clustering API:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-http",children:`GET https://api.repliers.io/listings
  ?cluster=true
  &clusterPrecision={dynamicPrecision}
  &clusterLimit=200
  &status=A
  &map={boundingBoxPolygon}
  &key={apiKey}
`})}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Dynamic Precision Calculation:"})}),`
`,e.jsx(n.p,{children:"The component automatically adjusts cluster precision based on zoom level:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`const getClusterPrecision = (zoom: number): number => {
  if (zoom <= 8) return 5;   // City level - very large clusters
  if (zoom <= 10) return 8;  // District level
  if (zoom <= 12) return 12; // Neighborhood level  
  if (zoom <= 14) return 16; // Street level
  return 20;                 // Individual properties
};
`})}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Key Parameters:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"cluster=true"})," - Enables server-side clustering"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"clusterPrecision"})," - Controls cluster granularity (5-20)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"clusterLimit=200"})," - Maximum clusters per response"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"status=A"})," - Only active listings"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"map"})," - Geographic bounding box as polygon coordinates"]}),`
`]}),`
`,e.jsx(n.h3,{id:"individual-property-details",children:"Individual Property Details"}),`
`,e.jsx(n.p,{children:"At high zoom levels (≥14), the component also fetches individual properties:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-http",children:`GET https://api.repliers.io/listings
  ?cluster=true
  &clusterPrecision=20
  &listings=true
  &clusterFields=mlsNumber,listPrice,coordinates
  &pageSize=200
  &map={boundingBoxPolygon}
  &key={apiKey}
`})}),`
`,e.jsx(n.p,{children:"This provides detailed property information for street-level viewing with popup details."}),`
`,e.jsx(n.h2,{id:"performance-optimizations",children:"Performance Optimizations"}),`
`,e.jsx(n.h3,{id:"zoom-based-data-loading",children:"Zoom-Based Data Loading"}),`
`,e.jsx(n.p,{children:"The component implements intelligent data loading:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Zoom 1-8"}),": City/regional clusters (500-5000+ properties per cluster)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Zoom 9-10"}),": District clusters (100-500 properties per cluster)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Zoom 11-12"}),": Neighborhood clusters (50-100 properties per cluster)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Zoom 13-14"}),": Street-level clusters (10-50 properties per cluster)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Zoom 15+"}),": Individual properties with full details"]}),`
`]}),`
`,e.jsx(n.h3,{id:"network-request-optimization",children:"Network Request Optimization"}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Single API Call Strategy:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Only one request per map movement"}),`
`,e.jsx(n.li,{children:"Bounds-based queries prevent over-fetching"}),`
`,e.jsx(n.li,{children:"Automatic debouncing prevents excessive calls during rapid map movements"}),`
`]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Response Data Processing:"})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`// Efficient feature processing
const clusterFeatures = clusters.map((cluster, index) => ({
  type: "Feature",
  properties: {
    count: cluster.count,
    precision: cluster.precision,
    id: \`cluster-\${index}\`
  },
  geometry: {
    type: "Point", 
    coordinates: [cluster.longitude, cluster.latitude]
  }
}));
`})}),`
`,e.jsx(n.h2,{id:"tutorial-steps",children:"Tutorial Steps"}),`
`,e.jsx(n.h3,{id:"step-1-clone-and-setup-the-repository",children:"Step 1: Clone and Setup the Repository"}),`
`,e.jsx(n.p,{children:"First, you'll need to clone this repository to your local machine:"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Fork the repository"}),' on GitHub by clicking the "Fork" button in the top right from the ',e.jsx(n.a,{href:"https://github.com/Repliers-io/pocs",rel:"nofollow",children:"POCs repo here!"})]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Clone your fork"})," locally:"]}),`
`]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-bash",children:`git clone https://github.com/{yourName}/pocs.git
cd pocs
`})}),`
`,e.jsxs(n.ol,{start:"3",children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Set up the remote"})," to track the original repository:"]}),`
`]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-bash",children:`git remote add upstream https://github.com/Repliers-io/pocs.git
`})}),`
`,e.jsxs(n.ol,{start:"4",children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Install dependencies"}),":"]}),`
`]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-bash",children:`npm install
`})}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Resources:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"https://docs.github.com/en/get-started/quickstart/fork-a-repo",rel:"nofollow",children:"GitHub's Forking Guide"})}),`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"https://git-scm.com/docs/git-clone",rel:"nofollow",children:"Git Clone Documentation"})}),`
`]}),`
`,e.jsx(n.h3,{id:"step-2-local-development-setup",children:"Step 2: Local Development Setup"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Create environment file"}),":"]}),`
`]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-bash",children:`touch .env.local
`})}),`
`,e.jsxs(n.ol,{start:"2",children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Add your Repliers API key and MapBox token"})," to ",e.jsx(n.code,{children:".env.local"}),":"]}),`
`]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-env",children:`NEXT_PUBLIC_REPLIERS_API_KEY=your_repliers_api_key_here
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
`})}),`
`,e.jsxs(n.ol,{start:"3",children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Start the development server"}),":"]}),`
`]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-bash",children:`npm run dev
`})}),`
`,e.jsxs(n.ol,{start:"4",children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Run Storybook"})," to see the component tutorials:"]}),`
`]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-bash",children:`npm run storybook
`})}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Important:"})," The component requires both a Repliers API key for property data and a MapBox access token for the map display."]}),`
`,e.jsx(n.h2,{id:"error-handling--edge-cases",children:"Error Handling & Edge Cases"}),`
`,e.jsx(n.p,{children:"The component handles various error scenarios:"}),`
`,e.jsx(n.h3,{id:"common-error-states",children:"Common Error States"}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"1. Invalid API Key:"})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-json",children:`{
  "error": "Unauthorized",
  "message": "Invalid API key provided"
}
`})}),`
`,e.jsxs(n.p,{children:[e.jsx(n.em,{children:"What happens:"})," Component shows error message in bottom overlay and stops making requests."]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"2. MapBox Token Issues:"})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-javascript",children:`// Invalid or expired MapBox token
Error: Unauthorized - Invalid token
`})}),`
`,e.jsxs(n.p,{children:[e.jsx(n.em,{children:"What happens:"})," Map fails to initialize, showing MapBox error overlay."]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"3. Network/Connection Errors:"})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-javascript",children:`// Network timeout or connection failure  
fetch: NetworkError when attempting to fetch resource
`})}),`
`,e.jsxs(n.p,{children:[e.jsx(n.em,{children:"What happens:"})," Component shows loading state, retries on next map movement."]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"4. Malformed API Response:"})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-javascript",children:`// When API returns unexpected data structure
TypeError: Cannot read property 'clusters' of undefined
`})}),`
`,e.jsxs(n.p,{children:[e.jsx(n.em,{children:"What happens:"})," Component safely handles missing data and shows empty map state."]}),`
`,e.jsx(n.h2,{id:"advanced-implementation-ideas",children:"Advanced Implementation Ideas"}),`
`,e.jsx(n.h3,{id:"property-filtering-extensions",children:"Property Filtering Extensions"}),`
`,e.jsx(n.p,{children:"The component can be extended with filter props:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`interface ExtendedMapListingsProps extends MapListingsProps {
  // Price filters
  minPrice?: number;
  maxPrice?: number;
  
  // Property characteristics  
  minBedrooms?: number;
  minBathrooms?: number;
  propertyTypes?: string[];
  
  // Location filters
  schoolDistricts?: string[];
  walkScore?: number;
}
`})}),`
`,e.jsx(n.h3,{id:"multi-query-implementation",children:"Multi-Query Implementation"}),`
`,e.jsx(n.p,{children:"For comparative analysis across regions:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`const fetchMultiRegionData = async (regions: Region[]) => {
  const promises = regions.map(region => 
    fetch(\`https://api.repliers.io/listings\`, {
      // Region-specific parameters
    })
  );
  
  const responses = await Promise.all(promises);
  return responses.map(r => r.json());
};
`})}),`
`,e.jsx(n.h3,{id:"custom-polygon-searches",children:"Custom Polygon Searches"}),`
`,e.jsx(n.p,{children:"Beyond rectangular bounds, support custom search areas:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`const customPolygon = [
  [-79.4, 43.6], [-79.3, 43.6], 
  [-79.3, 43.7], [-79.4, 43.7], 
  [-79.4, 43.6]
];

url.searchParams.set("polygon", JSON.stringify(customPolygon));
`})}),`
`,e.jsx(n.h2,{id:"production-considerations",children:"Production Considerations"}),`
`,e.jsx(n.h3,{id:"api-key-security",children:"API Key Security"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Never expose keys in client-side code"})," - Use server-side proxy endpoints"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Implement request signing"})," for sensitive operations"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Monitor usage"})," - Set up alerts for unusual activity patterns"]}),`
`]}),`
`,e.jsx(n.h3,{id:"performance-monitoring",children:"Performance Monitoring"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`// Track API response times
const startTime = performance.now();
const response = await fetch(apiUrl);
const responseTime = performance.now() - startTime;

// Log slow requests
if (responseTime > 1000) {
  console.warn(\`Slow API request: \${responseTime}ms\`);
}
`})}),`
`,e.jsx(n.h3,{id:"caching-strategies",children:"Caching Strategies"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"In-memory caching"})," for recently viewed map areas"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Local storage"})," for user preferences and saved searches"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Service worker caching"})," for offline map tiles"]}),`
`]}),`
`,e.jsx(n.h2,{id:"next-steps",children:"Next Steps"}),`
`,e.jsx(n.p,{children:"This tutorial provides a foundation for building real estate mapping applications. You can extend this by:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Adding property detail modals with more information"}),`
`,e.jsx(n.li,{children:"Implementing saved searches and user favorites"}),`
`,e.jsx(n.li,{children:"Building comparative market analysis tools"}),`
`,e.jsx(n.li,{children:"Integrating with mortgage calculators"}),`
`,e.jsx(n.li,{children:"Adding draw tools for custom search areas"}),`
`,e.jsx(n.li,{children:"Implementing real-time listing updates via WebSockets"}),`
`]}),`
`,e.jsxs(n.p,{children:["For more information, see the ",e.jsx(n.a,{href:"https://docs.repliers.io/reference/why-use-this-api",rel:"nofollow",children:"official Repliers API documentation"}),"."]})]})}function T(s={}){const{wrapper:n}={...i(),...s.components};return n?e.jsx(n,{...s,children:e.jsx(r,{...s})}):r(s)}export{T as default};
