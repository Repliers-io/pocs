import{j as e}from"./jsx-runtime-xF634gn_.js";import{useMDXComponents as i}from"./index-o2KxC7bF.js";import"./index-BqbJxbG0.js";import{A as t,W as l}from"./autocomplete-search.stories-DkjUq-t9.js";import{M as o,C as c}from"./index-B9VInP_e.js";import"./index-C-7etoUd.js";import"./preview-DyJwRVR-.js";import"./iframe-BFm-Dita.js";import"./DocsRenderer-CFRXHY34-BzkcD5c9.js";import"./react-18-WyM8tkiX.js";import"./index-BKjiqKB3.js";import"./search-CpmvFUy8.js";import"./createLucideIcon-BmJP7rG3.js";import"./loader-circle-x9Fu845P.js";import"./car-CJRJwKAe.js";import"./bath-D_6pRDEi.js";import"./index-DmZMPOxo.js";import"./index-DgH-xKnr.js";import"./index-DrFu-skq.js";function r(n){const s={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...i(),...n.components};return e.jsxs(e.Fragment,{children:[e.jsx(o,{of:t}),`
`,e.jsx(s.h1,{id:"configuring-autocompletesearch-with-the-repliers-api",children:"Configuring AutocompleteSearch with the Repliers API"}),`
`,e.jsx(s.p,{children:e.jsx(s.a,{href:"https://github.com/Repliers-io/pocs/blob/main/src/components/autocomplete-search/autocomplete-search.tsx",rel:"nofollow",children:e.jsx(s.strong,{children:"View the component code repository on GitHub"})})}),`
`,e.jsx(s.p,{children:"This tutorial focuses on understanding the API calls, requests, and responses involved in building a real estate autocomplete search. The UI component is already fully designed and coded out for you—feel free to use or adapt it in your own projects!"}),`
`,e.jsx(s.h2,{id:"live-example",children:"Live Example"}),`
`,e.jsx(s.p,{children:"Try the component below - start typing a city name, address, or MLS number to see the autocomplete in action. This demo uses real API data:"}),`
`,e.jsx(c,{of:l}),`
`,e.jsx(s.h2,{id:"why-autocomplete-search-matters",children:"Why Autocomplete Search Matters"}),`
`,e.jsx(s.p,{children:"Autocomplete search is essential for real estate applications because it:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Searches the database of listings"})," - Users can find specific properties by address, MLS number, or partial matches"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Helps with regional searches"})," - When users want to browse listings in a certain area but don't know exact addresses, location autocomplete provides cities, neighborhoods, and areas"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Improves user experience"})," - Reduces typing, prevents errors, and provides instant feedback"]}),`
`]}),`
`,e.jsx(s.h2,{id:"tech-stack-overview",children:"Tech Stack Overview"}),`
`,e.jsx(s.p,{children:"This tutorial uses:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"React 18"})," with TypeScript for type safety"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Next.js 14"})," for the development environment"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Tailwind CSS"})," for styling"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Lucide React"})," for icons"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Repliers API"})," for real estate data ✨✨✨"]}),`
`]}),`
`,e.jsx(s.h2,{id:"component-architecture",children:"Component Architecture"}),`
`,e.jsx(s.p,{children:"The autocomplete search follows this flow:"}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{children:`User Input (3+ chars)
    ↓
Debounce (400ms)
    ↓
Concurrent API Calls
    ├── Listings API (/listings)
    └── Locations API (/locations/autocomplete)
    ↓
Promise.all() Resolution
    ↓
Results Categorization
    ├── Properties
    ├── Cities
    ├── Neighborhoods
    └── Areas
    ↓
UI Update with Results
`})}),`
`,e.jsx(s.h2,{id:"api-implementation",children:"API Implementation"}),`
`,e.jsx(s.p,{children:"The component makes concurrent API calls to two Repliers endpoints:"}),`
`,e.jsx(s.h3,{id:"1-listings-endpoint",children:"1. Listings Endpoint"}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-http",children:`GET https://csr-api.repliers.io/listings
  ?search={query}
  &searchFields=address.streetNumber,address.streetName,mlsNumber,address.city
  &fields=address.*,mlsNumber,listPrice,details.numBedrooms,details.numBedroomsPlus,details.numBathrooms,details.numBathroomsPlus,details.numGarageSpaces,details.propertyType,type,lastStatus,images
  &status=A
  &status=U
  &fuzzysearch=true
`})}),`
`,e.jsx(s.p,{children:e.jsx(s.strong,{children:"What we're requesting:"})}),`
`,e.jsx(s.p,{children:e.jsx(s.em,{children:"Search Fields"})}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{children:`  &searchFields=address.streetNumber,address.streetName,mlsNumber,address.city
`})}),`
`,e.jsx(s.p,{children:"We want our search query to only search within the street number, street name, city and MLS number. This will allow listings to be returned when the user types an MLS number like 'CX9924729742', an adress like '123 Main St' or a city like 'Houston'."}),`
`,e.jsx(s.p,{children:e.jsx(s.em,{children:"Returned Fields"})}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{children:`fields=address.*,mlsNumber,listPrice,details.numBedrooms,details.numBedroomsPlus,details.numBathrooms,details.numBathroomsPlus,details.numGarageSpaces,details.propertyType,type,lastStatus,images
`})}),`
`,e.jsx("div",{style:{textAlign:"center",margin:"2rem 0"},children:e.jsx("img",{src:"./images/autocomplete-listings.jpg",alt:"Demo of autocomplete search results for listings",style:{display:"block",margin:"auto",maxWidth:"600px",width:"100%",height:"auto",borderRadius:"8px",boxShadow:"0 4px 6px rgba(0, 0, 0, 0.1)"}})}),`
`,e.jsx(s.p,{children:"We want to the results to match perfectly with our UI - we use the fields parameter to ensure only the necessary data is retuned:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"address.*"})," - the complete address"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"mlsNumber"})," - the MLS number"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"listPrice"})," - the list price"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"details.numBedrooms"})," - number of bedrooms"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"details.numBedroomsPlus"})," - indicates a den or a room that does not fit the legal requirements to be classified as a full bedroom"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"details.numBathrooms"})," - number of bathrooms"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"details.numBathroomsPlus"})," - number of half bathrooms"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"details.numGarageSpaces"})," - number of garage spaces"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"details.propertyType"})," - the property type (residential, condo, etc)"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"type"})," - the listing type (for sale, for lease)"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"lastStatus"})," - what is the last status of the listing (sold, leased, expired, terminated)"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"images"})," - the images, we will use the title image to populate the component"]}),`
`]}),`
`,e.jsx(s.p,{children:e.jsx(s.em,{children:"Search Optimization"})}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{children:`&status=A
&status=U
&fuzzysearch=true
`})}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"status=A"})," means we will search through all active listing"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"status=U"})," means we will search through all unlisted listings"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"fuzzysearch=true"})," means we want to the search squery to be loose, so a search for 'Mian St' will still return 'Main St'"]}),`
`]}),`
`,e.jsx(s.h3,{id:"2-locations-autocomplete-endpoint",children:"2. Locations Autocomplete Endpoint"}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-http",children:`GET https://csr-api.repliers.io/locations/autocomplete
  ?search={query}
`})}),`
`,e.jsx(s.p,{children:e.jsx(s.strong,{children:"What we're requesting:"})}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:"Search for cities, neighborhoods, and areas - anything we deem to be a 'Location'"}),`
`,e.jsx(s.li,{children:"We will take the results along with city and state data to display the results in this UI:"}),`
`]}),`
`,e.jsx("div",{style:{textAlign:"center",margin:"2rem 0"},children:e.jsx("img",{src:"./images/autocomplete-locations.jpg",alt:"Demo of autocomplete search results for locations",style:{display:"block",margin:"auto",maxWidth:"600px",width:"100%",height:"auto",borderRadius:"8px",boxShadow:"0 4px 6px rgba(0, 0, 0, 0.1)"}})}),`
`,e.jsxs(s.p,{children:["Both requests execute simultaneously using ",e.jsx(s.code,{children:"Promise.all()"})," with a 400ms debounce to prevent excessive API calls."]}),`
`,e.jsx(s.h2,{id:"tutorial-steps",children:"Tutorial Steps"}),`
`,e.jsx(s.h3,{id:"step-1-clone-and-setup-the-repository",children:"Step 1: Clone and Setup the Repository"}),`
`,e.jsx(s.p,{children:"First, you'll need to clone this repository to your local machine:"}),`
`,e.jsxs(s.ol,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Fork the repository"}),' on GitHub by clicking the "Fork" button in the top right from the ',e.jsx(s.a,{href:"https://github.com/Repliers-io/pocs",rel:"nofollow",children:"POCs repo here!"})]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Clone your fork"})," locally:"]}),`
`]}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-bash",children:`git clone https://github.com/{yourName}/pocs.git
cd pocs
`})}),`
`,e.jsxs(s.ol,{start:"3",children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Set up the remote"})," to track the original repository:"]}),`
`]}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-bash",children:`git remote add upstream https://github.com/{yourName}/pocs.git
`})}),`
`,e.jsxs(s.ol,{start:"4",children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Install dependencies"}),":"]}),`
`]}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-bash",children:`npm install
`})}),`
`,e.jsx(s.p,{children:e.jsx(s.strong,{children:"Resources:"})}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://docs.github.com/en/get-started/quickstart/fork-a-repo",rel:"nofollow",children:"GitHub's Forking Guide"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://git-scm.com/docs/git-clone",rel:"nofollow",children:"Git Clone Documentation"})}),`
`]}),`
`,e.jsx(s.h3,{id:"step-2-local-development-setup",children:"Step 2: Local Development Setup"}),`
`,e.jsxs(s.ol,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Create environment file"}),":"]}),`
`]}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-bash",children:`touch .env.local
`})}),`
`,e.jsxs(s.ol,{start:"2",children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Add your Repliers API key"})," to ",e.jsx(s.code,{children:".env.local"}),":"]}),`
`]}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-env",children:`NEXT_PUBLIC_REPLIERS_API_KEY=your_api_key_here
`})}),`
`,e.jsxs(s.ol,{start:"3",children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Start the development server"}),":"]}),`
`]}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-bash",children:`npm run dev
`})}),`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"Important:"})," The component automatically looks for the API key in ",e.jsx(s.code,{children:"NEXT_PUBLIC_REPLIERS_API_KEY"})," environment variable during development."]}),`
`,e.jsx(s.p,{children:"The local deployment should deploy in the shell listing site I built out for you:"}),`
`,e.jsx("div",{style:{textAlign:"center",margin:"2rem 0"},children:e.jsx("img",{src:"./images/autocomplete-local.jpg",alt:"Demo of autocomplete search example in local deployment",style:{display:"block",margin:"auto",maxWidth:"800px",width:"100%",height:"auto",borderRadius:"8px",boxShadow:"0 4px 6px rgba(0, 0, 0, 0.1)"}})}),`
`,e.jsx(s.h2,{id:"error-handling--edge-cases",children:"Error Handling & Edge Cases"}),`
`,e.jsx(s.p,{children:"The component handles various error scenarios that you should be aware of:"}),`
`,e.jsx(s.h3,{id:"common-error-states",children:"Common Error States"}),`
`,e.jsx(s.p,{children:e.jsx(s.strong,{children:"1. Invalid API Key:"})}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-json",children:`{
  "error": "Unauthorized",
  "message": "Invalid API key provided"
}
`})}),`
`,e.jsxs(s.p,{children:[e.jsx(s.em,{children:"What happens:"}),' Component shows "Failed to load results" message and logs error to console.']}),`
`,e.jsx(s.p,{children:e.jsx(s.strong,{children:"2. Network/Connection Errors:"})}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-javascript",children:`// Network timeout or connection failure
fetch: NetworkError when attempting to fetch resource
`})}),`
`,e.jsxs(s.p,{children:[e.jsx(s.em,{children:"What happens:"})," Graceful fallback with error message, search remains functional for retry."]}),`
`,e.jsx(s.p,{children:e.jsx(s.strong,{children:"3. Rate Limiting (429 Too Many Requests):"})}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-json",children:`{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Try again in 60 seconds.",
  "retryAfter": 60
}
`})}),`
`,e.jsxs(s.p,{children:[e.jsx(s.em,{children:"What happens:"})," Component displays rate limit message and suggests retry timing."]}),`
`,e.jsx(s.p,{children:e.jsx(s.strong,{children:"4. Malformed Query Response:"})}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-javascript",children:`// When API returns unexpected data structure
TypeError: Cannot read property 'listings' of undefined
`})}),`
`,e.jsxs(s.p,{children:[e.jsx(s.em,{children:"What happens:"}),' Component safely handles missing data and shows "No results found" instead of crashing.']}),`
`,e.jsx(s.h3,{id:"error-handling-implementation",children:"Error Handling Implementation"}),`
`,e.jsx(s.p,{children:"The component uses try-catch blocks and validates API responses:"}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-typescript",children:`try {
  const [listingsResponse, locationsResponse] = await Promise.all([
    fetch(listingsUrl, { headers }),
    fetch(locationsUrl, { headers }),
  ]);

  // Check for HTTP errors
  if (!listingsResponse.ok || !locationsResponse.ok) {
    throw new Error("API request failed");
  }

  const [listingsData, locationsData] = await Promise.all([
    listingsResponse.json(),
    locationsResponse.json(),
  ]);

  // Validate response structure
  const listings = listingsData?.listings || [];
  const locations = locationsData?.locations || [];
} catch (error) {
  console.error("Search error:", error);
  // Show user-friendly error message
  setError("Failed to load results. Please try again.");
}
`})}),`
`,e.jsx(s.h2,{id:"performance-considerations",children:"Performance Considerations"}),`
`,e.jsx(s.h3,{id:"why-400ms-debounce",children:"Why 400ms Debounce?"}),`
`,e.jsx(s.p,{children:"The component uses a 400ms debounce delay, which is carefully chosen based on:"}),`
`,e.jsx(s.p,{children:e.jsx(s.strong,{children:"User Experience Research:"})}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Too fast (< 200ms)"}),": Creates excessive API calls as users type quickly"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Too slow (> 600ms)"}),": Feels unresponsive and sluggish to users"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Sweet spot (300-500ms)"}),": Balances responsiveness with API efficiency"]}),`
`]}),`
`,e.jsx(s.p,{children:e.jsx(s.strong,{children:"Technical Benefits:"})}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Reduces API costs"}),": Prevents calls on every keystroke"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Improves performance"}),": Fewer network requests = better browser performance"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Respects rate limits"}),": Helps stay within API quotas"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Battery friendly"}),": Fewer network requests on mobile devices"]}),`
`]}),`
`,e.jsx(s.p,{children:e.jsx(s.strong,{children:"Real-world Impact:"})}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-javascript",children:`// Without debouncing: User types "toronto"
// Triggers 7 API calls: t, to, tor, toro, toron, toront, toronto

// With 400ms debouncing: User types "toronto"
// Triggers 1 API call: toronto (only after user stops typing)
`})}),`
`,e.jsx(s.h3,{id:"api-rate-limiting-guidelines",children:"API Rate Limiting Guidelines"}),`
`,e.jsx(s.p,{children:e.jsx(s.strong,{children:"Repliers API Limits:"})}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Development"}),": 1,000 requests/hour per API key"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Production"}),": Contact support for higher limits"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Burst limit"}),": 10 requests/second maximum"]}),`
`]}),`
`,e.jsx(s.p,{children:e.jsx(s.strong,{children:"Best Practices:"})}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:"Implement exponential backoff for rate limit errors"}),`
`,e.jsx(s.li,{children:"Cache results locally for repeated searches"}),`
`,e.jsx(s.li,{children:"Use fuzzy search to reduce need for multiple queries"}),`
`,e.jsx(s.li,{children:"Monitor usage with analytics to optimize debounce timing"}),`
`]}),`
`,e.jsx(s.p,{children:e.jsx(s.strong,{children:"Rate Limit Handling:"})}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-typescript",children:`if (response.status === 429) {
  const retryAfter = response.headers.get("Retry-After");
  // Wait before retrying, show user feedback
  setTimeout(() => retrySearch(), (retryAfter || 60) * 1000);
}
`})}),`
`,e.jsx(s.h3,{id:"production-security-best-practices",children:"Production Security Best Practices"}),`
`,e.jsx(s.p,{children:e.jsx(s.strong,{children:"API Key Management:"})}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Never expose keys in client-side code"})," - Use server-side proxy endpoints"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Use environment variables"})," - Keep keys out of version control"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Implement key rotation"})," - Regularly update API keys"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Monitor usage"})," - Set up alerts for unusual activity"]}),`
`]}),`
`,e.jsx(s.p,{children:e.jsx(s.strong,{children:"Recommended Architecture for Production:"})}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{children:`Client App → Your API Server → Repliers API
    ↓              ↓              ↓
No API key    Has API key    Validates key
`})}),`
`,e.jsx(s.p,{children:e.jsx(s.strong,{children:"Implementation Example:"})}),`
`,e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-typescript",children:`// Instead of direct API calls from client:
// ❌ fetch('https://api.repliers.io/listings', {
//     headers: { 'REPLIERS-API-KEY': exposedKey }
//   })

// ✅ Use your own API endpoint:
fetch("/api/search", {
  method: "POST",
  body: JSON.stringify({ query }),
  headers: { Authorization: "Bearer " + userToken },
});
`})}),`
`,e.jsx(s.p,{children:e.jsx(s.strong,{children:"Additional Security Measures:"})}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:"Implement request signing for sensitive operations"}),`
`,e.jsx(s.li,{children:"Use HTTPS everywhere (never HTTP)"}),`
`,e.jsx(s.li,{children:"Validate and sanitize all user inputs"}),`
`,e.jsx(s.li,{children:"Set up CORS policies appropriately"}),`
`,e.jsx(s.li,{children:"Log and monitor API usage patterns"}),`
`]}),`
`,e.jsx(s.h2,{id:"key-implementation-details",children:"Key Implementation Details"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Debouncing"}),": 400ms delay prevents excessive API calls"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Minimum query length"}),": 3 characters required for both endpoints"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Error handling"}),": Comprehensive error states for API failures"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Loading states"}),": Skeleton loaders during API calls"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Categorized results"}),": Properties, Cities, Neighborhoods, Areas"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Mobile responsive"}),": Works on all device sizes"]}),`
`]}),`
`,e.jsx(s.h2,{id:"next-steps",children:"Next Steps"}),`
`,e.jsx(s.p,{children:"This tutorial provides a foundation for building real estate search features. You can extend this by:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:"Adding click handlers for result selection"}),`
`,e.jsx(s.li,{children:"Implementing search history"}),`
`,e.jsx(s.li,{children:"Adding filters for price range, property type, etc."}),`
`,e.jsx(s.li,{children:"Integrating with mapping services"}),`
`,e.jsx(s.li,{children:"Building saved searches functionality"}),`
`]}),`
`,e.jsxs(s.p,{children:["For more information, see the ",e.jsx(s.a,{href:"https://docs.repliers.io/reference/why-use-this-api",rel:"nofollow",children:"official Repliers API documentation"}),"."]})]})}function R(n={}){const{wrapper:s}={...i(),...n.components};return s?e.jsx(s,{...n,children:e.jsx(r,{...n})}):r(n)}export{R as default};
