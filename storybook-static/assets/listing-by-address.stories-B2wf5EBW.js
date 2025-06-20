import{j as t}from"./jsx-runtime-CBjAUaf4.js";import{L as i}from"./listing-by-address-BB_rkcpP.js";import"./jsx-runtime-B2VJbz7C.js";import"./index-CoAThXCU.js";import"./api-input-Dr_LPgA6.js";import"./unified-address-search-Czsw31PV.js";const g={title:"POCS/Listings/ListingByAddress",component:i,parameters:{layout:"padded",docs:{description:{component:`
## 🏠 ListingByAddress Component

A comprehensive React component for searching and displaying property listings by address using Google Places API integration and the Repliers API.

This component helps users:
- Search for addresses using Google Places Autocomplete
- Find and display detailed property listings from Repliers API
- View comprehensive property data with smart formatting
- Browse property image galleries with CDN integration

## 🚀 Quick Start

1. Ensure you have valid API keys for both Google Places and Repliers API

2. Import and use the component:
\`\`\`tsx
import { ListingByAddress } from "./components/listings/listing-by-address";

function App() {
  const handleListingSelected = (listing) => {
    console.log('Selected listing:', listing);
    // listing contains ALL property data from the API
    // including details, images, pricing, etc.
  };

  return (
    <div className="container mx-auto p-6">
      <ListingByAddress
        onListingSelected={handleListingSelected}
        className="max-w-4xl mx-auto"
      />
    </div>
  );
}
\`\`\`

## 💡 Key Features

1. **🔍 Address Search** - Google Places integration for intelligent address autocomplete
2. **📊 Complete Data Display** - Shows ALL available data from the API response with smart formatting
3. **🖼️ Image Gallery** - Automatic CDN image detection with thumbnail grid and modal viewing
4. **📱 Responsive Design** - Works beautifully on all screen sizes
5. **⚡ Smart Selection** - Auto-selects single results, shows selection UI for multiple
6. **🎨 Enhanced UI** - Collapsible sections, loading states, and error handling

## 🔧 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| onListingSelected | (listing: PropertyListing \\| null) => void | undefined | Callback fired when a listing is selected |
| className | string | undefined | Additional CSS classes to apply to the component |

## 🖼️ Image Processing

The component automatically detects and processes images:

1. **Detection**: Scans all data for image filenames matching pattern \`IMG-[A-Z0-9]+_\\d+\\.jpg\`
2. **CDN URL Generation**: Converts filenames to full CDN URLs:
   \`\`\`
   IMG-ABC123_001.jpg → https://cdn.repliers.io/IMG-ABC123_001.jpg?class=small
   \`\`\`
3. **Gallery Display**: Creates responsive thumbnail grid (3-6 columns)
4. **Modal Viewing**: Click thumbnails to view full-size images

## 📊 Data Formatting

The component provides smart formatting for different data types:
- **Prices**: \`$1,234,567\` format
- **Dates/Timestamps**: Human-readable format with timezone
- **Phone Numbers**: \`(123) 456-7890\` format
- **Boolean Values**: "Yes"/"No" display
- **Square Footage**: \`1,234 sqft\` format
- **Nested Objects**: Organized display for complex data structures

## 🔌 API Integration

### Required Setup
1. **Repliers API Key**: Required via \`ApiInput\` component
2. **Google Places API**: Required for address search
3. **CORS Configuration**: Ensure API endpoints allow browser requests

### Endpoints Used
- **Listings Search**: \`https://api.repliers.io/listings\`
  - Parameters: \`streetName\`, \`streetNumber\`, \`city\`
  - Headers: \`REPLIERS-API-KEY\`

## 📝 Usage Examples

### Basic Implementation
\`\`\`tsx
function PropertySearchPage() {
  const [selectedProperty, setSelectedProperty] = useState(null);

  const handleListingSelected = (listing) => {
    setSelectedProperty(listing);
    console.log('Property selected:', listing);
    // The listing object contains ALL data from the API
    // Use this data however your application needs
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Property Search</h1>
      
      <ListingByAddress 
        onListingSelected={handleListingSelected}
        className="mb-8"
      />
      
      {selectedProperty && (
        <div className="mt-8 p-4 bg-gray-100 rounded">
          <h2 className="text-lg font-semibold">Selected Property</h2>
          <p>Address: {selectedProperty.address}</p>
          <p>Price: {selectedProperty.price ? \`$\${selectedProperty.price.toLocaleString()}\` : 'N/A'}</p>
          {/* Access any field from the complete API response */}
        </div>
      )}
    </div>
  );
}
\`\`\`

### Integration with Other Components
\`\`\`tsx
function RealEstateApp() {
  const handlePropertySelection = (property) => {
    // Pass the complete property data to other components
    // that need specific information
    if (property) {
      // Example: Extract what you need for your use case
      const propertyInfo = {
        address: property.address,
        bedrooms: property.details?.numBedrooms,
        bathrooms: property.details?.numBathrooms,
        price: property.price,
        // ... any other fields from the complete API response
      };
      
      // Use the data as needed in your application
      updateApplicationState(propertyInfo);
    }
  };

  return (
    <ListingByAddress onListingSelected={handlePropertySelection} />
  );
}
\`\`\`
        `}}},tags:["autodocs"]},e={args:{},decorators:[a=>t.jsx("div",{className:"container mx-auto max-w-4xl p-6",children:t.jsx(a,{})})]};var s,o,r;e.parameters={...e.parameters,docs:{...(s=e.parameters)==null?void 0:s.docs,source:{originalSource:`{
  args: {},
  decorators: [Story => <div className="container mx-auto max-w-4xl p-6">
        <Story />
      </div>]
}`,...(r=(o=e.parameters)==null?void 0:o.docs)==null?void 0:r.source}}};const u=["Default"];export{e as Default,u as __namedExportsOrder,g as default};
