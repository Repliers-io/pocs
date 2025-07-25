import{j as e}from"./jsx-runtime-CBjAUaf4.js";import{r as h}from"./index-CoAThXCU.js";import{c as d}from"./createLucideIcon-DXKbrH_m.js";import"./jsx-runtime-B2VJbz7C.js";/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=[["path",{d:"M10 4 8 6",key:"1rru8s"}],["path",{d:"M17 19v2",key:"ts1sot"}],["path",{d:"M2 12h20",key:"9i4pu4"}],["path",{d:"M7 19v2",key:"12npes"}],["path",{d:"M9 5 7.621 3.621A2.121 2.121 0 0 0 4 5v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5",key:"14ym8i"}]],G=d("bath",D);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K=[["path",{d:"M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8",key:"1k78r4"}],["path",{d:"M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4",key:"fb3tl2"}],["path",{d:"M12 4v6",key:"1dcgq2"}],["path",{d:"M2 18h20",key:"ajqnye"}]],W=d("bed-double",K);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H=[["path",{d:"M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2",key:"5owen"}],["circle",{cx:"7",cy:"17",r:"2",key:"u2ysq9"}],["path",{d:"M9 17h6",key:"r8uit2"}],["circle",{cx:"17",cy:"17",r:"2",key:"axvx0g"}]],Y=d("car",H);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],V=d("circle-alert",O);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M16 16s-1.5-2-4-2-4 2-4 2",key:"epbg0q"}],["line",{x1:"9",x2:"9.01",y1:"9",y2:"9",key:"yxxnd0"}],["line",{x1:"15",x2:"15.01",y1:"9",y2:"9",key:"1p4y9e"}]],J=d("frown",X);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q=[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]],Z=d("loader-circle",Q);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ee=[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]],I=d("map-pin",ee);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const se=[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]],te=d("search",se);function T({apiKey:w,placeholder:E="Search for properties..."}){const P=w||void 0,[c,C]=h.useState(""),[o,f]=h.useState({properties:[],cities:[],neighborhoods:[],areas:[]}),[p,j]=h.useState(!1),[x,y]=h.useState(!1),[g,u]=h.useState(null);h.useEffect(()=>{if(!c.trim()){f({properties:[],cities:[],neighborhoods:[],areas:[]}),u(null),y(!1);return}if(c.trim().length<3){f({properties:[],cities:[],neighborhoods:[],areas:[]}),u(null),y(!1);return}y(!0),u(null);const s=setTimeout(async()=>{y(!1),await L(c.trim())},400);return()=>{clearTimeout(s),y(!1)}},[c]);const L=async s=>{if(!P){u("API key is required. Please provide the apiKey prop. Environment variable fallback only works in development mode.");return}j(!0),u(null);try{const t=[fetch(`https://api.repliers.io/locations/autocomplete?search=${encodeURIComponent(s)}&addContext=city`,{headers:{"REPLIERS-API-KEY":P,"Content-Type":"application/json"}}),fetch(`https://api.repliers.io/listings?search=${encodeURIComponent(s)}&searchFields=address.streetNumber,address.streetName,mlsNumber,address.city&fields=address.*,mlsNumber,listPrice,details.numBedrooms,details.numBedroomsPlus,details.numBathrooms,details.numBathroomsPlus,details.numGarageSpaces,details.propertyType,type,lastStatus,images&fuzzysearch=true&status=A&status=U`,{headers:{"REPLIERS-API-KEY":P,"Content-Type":"application/json"}})],r=await Promise.all(t);for(let i=0;i<r.length;i++){const l=r[i];if(!l.ok){const v=i===0?"locations":"listings";if(l.status===400){if(v==="locations"&&s.length<3){f({properties:[],cities:[],neighborhoods:[],areas:[]}),j(!1);return}throw new Error(`Bad request to ${v} API. Please check your search query.`)}else throw l.status===401?new Error("Invalid API key. Please check your Repliers API key."):l.status===403?new Error(`API key doesn't have permission for the ${v} endpoint.`):l.status===429?new Error("Too many requests. Please wait a moment and try again."):new Error(`${v} API Error: ${l.status}`)}}const[a,m]=await Promise.all([r[0].json(),r[1].json()]),n=a.locations||[],b=m.listings||[];f({properties:b,cities:n.filter(i=>i.type==="city"),neighborhoods:n.filter(i=>i.type==="neighborhood"),areas:n.filter(i=>i.type==="area")})}catch(t){const r=t instanceof Error?t.message:"Failed to search. Please try again.";u(r)}finally{j(!1)}},q=s=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:0,maximumFractionDigits:0}).format(s),B=s=>{if(!s)return"N/A";const t=s.numBedrooms,r=s.numBedroomsPlus;return t&&r&&r>0?`${t} + ${r}`:(t==null?void 0:t.toString())||"N/A"},_=s=>{if(!s)return"N/A";const t=s.numBathrooms,r=s.numBathroomsPlus;return t&&r&&r>0?`${t} + ${r}`:(t==null?void 0:t.toString())||"N/A"},U=s=>{var t;return s&&((t=s.numGarageSpaces)==null?void 0:t.toString())||"N/A"},$=(s,t)=>t==="New"||t==="Pc"||t==="Ext"?s==="Sale"?"For Sale":s==="Lease"?"For Lease":s||null:t?{Sus:"Suspended",Exp:"Expired",Sld:"Sold",Ter:"Terminated",Dft:"Deal Fell Through",Lsd:"Leased",Sc:"Sold Conditionally",Sce:"Sold Conditionally (Escape Clause)",Lc:"Leased Conditionally",Cs:"Coming Soon"}[t]||t:null,M=({type:s,lastStatus:t})=>{const r=$(s,t);if(!r)return null;let a="bg-green-100 text-green-600";switch(r){case"For Sale":case"For Lease":a="bg-green-100 text-green-600";break;case"Sold":a="bg-blue-100 text-blue-600";break;case"Leased":a="bg-purple-100 text-purple-600";break;case"Sold Conditionally":case"Sold Conditionally (Escape Clause)":case"Leased Conditionally":a="bg-amber-100 text-amber-600";break;case"Coming Soon":a="bg-indigo-100 text-indigo-600";break;case"Suspended":a="bg-orange-100 text-orange-600";break;case"Expired":a="bg-gray-100 text-gray-500";break;case"Terminated":case"Deal Fell Through":a="bg-red-100 text-red-600";break;default:a="bg-gray-100 text-gray-500"}return e.jsx("span",{className:`text-xs px-2 py-1 rounded-md font-medium ${a}`,children:r})},A=o.properties.length>0||o.cities.length>0||o.neighborhoods.length>0||o.areas.length>0,F=o.cities.length>0||o.neighborhoods.length>0||o.areas.length>0,z=c.trim()&&(A||p||x||g||c.trim().length>=3);return e.jsx("div",{className:"relative w-full max-w-[600px]",children:e.jsxs("div",{className:"relative flex items-center bg-gray-100 rounded-md px-4 py-2 w-full",children:[e.jsx(te,{className:"text-gray-400 w-5 h-5 mr-3"}),e.jsx("input",{type:"text",value:c,onChange:s=>C(s.target.value),placeholder:E,className:"flex-grow bg-transparent outline-none text-gray-700 placeholder-gray-500"}),p&&e.jsx(Z,{className:"w-4 h-4 animate-spin text-gray-400 mr-2"}),e.jsx("span",{className:"text-gray-800 font-semibold text-sm px-2",children:"Search"}),z&&e.jsx("div",{className:"absolute top-full left-0 w-full min-w-[500px] max-w-[600px] mt-2 bg-white rounded-xl shadow-lg z-50",children:e.jsxs("div",{className:"max-h-[500px] overflow-y-auto p-4 space-y-4",children:[g&&e.jsxs("div",{className:"flex items-center gap-2 text-red-600 mb-4",children:[e.jsx(V,{className:"w-4 h-4"}),e.jsx("span",{className:"text-sm",children:g})]}),p&&e.jsx("div",{className:"space-y-4",children:[...Array(3)].map((s,t)=>e.jsxs("div",{className:"flex items-center gap-4 animate-pulse",children:[e.jsx("div",{className:"w-24 h-16 bg-gray-200 rounded-md"}),e.jsxs("div",{className:"flex-grow",children:[e.jsxs("div",{className:"flex justify-between items-start mb-2",children:[e.jsx("div",{className:"h-6 bg-gray-200 rounded w-32"}),e.jsx("div",{className:"h-5 bg-gray-200 rounded w-16"})]}),e.jsx("div",{className:"h-4 bg-gray-200 rounded w-3/4 mb-2"}),e.jsxs("div",{className:"flex space-x-3",children:[e.jsx("div",{className:"h-4 bg-gray-200 rounded w-20"}),e.jsx("div",{className:"h-4 bg-gray-200 rounded w-16"}),e.jsx("div",{className:"h-4 bg-gray-200 rounded w-18"})]})]})]},t))}),x&&!p&&e.jsx("div",{className:"space-y-4",children:[...Array(2)].map((s,t)=>e.jsxs("div",{className:"flex items-center gap-4 animate-pulse",children:[e.jsx("div",{className:"w-24 h-16 bg-gray-100 rounded-md"}),e.jsxs("div",{className:"flex-grow",children:[e.jsxs("div",{className:"flex justify-between items-start mb-2",children:[e.jsx("div",{className:"h-6 bg-gray-100 rounded w-32"}),e.jsx("div",{className:"h-5 bg-gray-100 rounded w-16"})]}),e.jsx("div",{className:"h-4 bg-gray-100 rounded w-3/4 mb-2"}),e.jsxs("div",{className:"flex space-x-3",children:[e.jsx("div",{className:"h-4 bg-gray-100 rounded w-20"}),e.jsx("div",{className:"h-4 bg-gray-100 rounded w-16"}),e.jsx("div",{className:"h-4 bg-gray-100 rounded w-18"})]})]})]},t))}),!p&&!x&&!g&&!A&&c.trim()&&e.jsxs("div",{className:"text-center py-8",children:[e.jsx(J,{className:"w-16 h-16 text-gray-400 mx-auto mb-3"}),e.jsx("h3",{className:"text-md font-semibold text-gray-700 mb-2",children:"No results found"}),e.jsx("p",{className:"text-gray-500 mb-2",children:"There aren't any search results that match your query."}),e.jsx("p",{className:"text-gray-500",children:"Try searching for a different property."})]}),!p&&!x&&!g&&(o.cities.length>0||o.neighborhoods.length>0||o.areas.length>0)&&e.jsxs("div",{children:[e.jsx("h4",{className:"text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2",children:"Locations"}),e.jsxs("div",{className:"space-y-0",children:[o.cities.map((s,t)=>{var a;const r=((a=s.address)==null?void 0:a.state)||s.state;return e.jsxs("div",{className:"flex items-center gap-3 px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0",children:[e.jsx("div",{className:"w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0",children:e.jsx(I,{className:"w-4 h-4 text-gray-600"})}),e.jsxs("div",{className:"flex flex-col min-w-0 flex-grow",children:[e.jsx("span",{className:"font-medium text-gray-800 text-sm leading-tight",children:s.name}),e.jsxs("span",{className:"text-xs text-gray-500 leading-tight",children:["City",r&&` in ${r}`]})]})]},`city-${s.name}-${t}`)}),o.neighborhoods.map((s,t)=>{var m,n;const r=((m=s.address)==null?void 0:m.city)||s.city,a=((n=s.address)==null?void 0:n.state)||s.state;return e.jsxs("div",{className:"flex items-center gap-3 px-3 py-2 hover:bg-green-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0",children:[e.jsx("div",{className:"w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0",children:e.jsx(I,{className:"w-4 h-4 text-gray-600"})}),e.jsxs("div",{className:"flex flex-col min-w-0 flex-grow",children:[e.jsx("span",{className:"font-medium text-gray-800 text-sm leading-tight",children:s.name}),e.jsxs("span",{className:"text-xs text-gray-500 leading-tight",children:["Neighborhood",r&&` in ${r}`,r&&a&&`, ${a}`,!r&&a&&` in ${a}`]})]})]},`neighborhood-${s.name}-${t}`)}),o.areas.map((s,t)=>{var a;const r=((a=s.address)==null?void 0:a.state)||s.state;return e.jsxs("div",{className:"flex items-center gap-3 px-3 py-2 hover:bg-purple-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0",children:[e.jsx("div",{className:"w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0",children:e.jsx(I,{className:"w-4 h-4 text-gray-600"})}),e.jsxs("div",{className:"flex flex-col min-w-0 flex-grow",children:[e.jsx("span",{className:"font-medium text-gray-800 text-sm leading-tight",children:s.name}),e.jsxs("span",{className:"text-xs text-gray-500 leading-tight",children:["Area",r&&` in ${r}`]})]})]},`area-${s.name}-${t}`)})]})]}),!p&&o.properties.length>0&&e.jsxs(e.Fragment,{children:[F&&e.jsx("div",{className:"pt-2",children:e.jsx("h4",{className:"text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3",children:"Properties"})}),o.properties.map((s,t)=>{var r,a,m,n,b,i,l;return e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-24 h-16 bg-gray-100 rounded-md overflow-hidden",children:(r=s.images)!=null&&r[0]?e.jsx("img",{src:`https://cdn.repliers.io/${s.images[0]}?class=small`,alt:"Property",className:"object-cover w-full h-full"}):e.jsx("div",{className:"flex items-center justify-center h-full text-xs text-gray-400",children:"No Image"})}),e.jsxs("div",{className:"flex-grow",children:[e.jsxs("div",{className:"flex justify-between items-start",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("h3",{className:"font-semibold text-base",children:s.listPrice?q(s.listPrice):"Price N/A"}),e.jsx("span",{className:"text-gray-400",children:"|"}),e.jsx("span",{className:"text-sm text-gray-600",children:s.mlsNumber})]}),e.jsx(M,{type:s.type,lastStatus:s.lastStatus})]}),e.jsx("p",{className:"text-xs text-gray-600",children:`${((a=s.address)==null?void 0:a.streetNumber)||""} ${((m=s.address)==null?void 0:m.streetName)||""} ${((n=s.address)==null?void 0:n.streetSuffix)||""}, ${((b=s.address)==null?void 0:b.city)||""}${(i=s.address)!=null&&i.state?`, ${s.address.state}`:""}`}),e.jsxs("div",{className:"flex items-center text-xs text-gray-500 mt-1 space-x-3 flex-wrap",children:[e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(W,{className:"w-4 h-4"}),B(s.details)," Bedroom"]}),e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(G,{className:"w-4 h-4"}),_(s.details)," Bath"]}),e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(Y,{className:"w-4 h-4"}),U(s.details)," Garage"]}),((l=s.details)==null?void 0:l.propertyType)&&e.jsxs("span",{children:["| ",s.details.propertyType]})]})]})]},s.mlsNumber||t)})]})]})})]})})}T.__docgenInfo={description:`AutocompleteSearch Component

@description A streamlined autocomplete search component that integrates with Repliers API
to search MLS listings and locations with real-time results and beautiful UI.

Features:
- Hybrid search combining listings and location autocomplete
- Debounced search (400ms) with fuzzy matching, minimum 3 characters
- Skeleton loading states
- Error handling and no results states
- Mobile-responsive design
- Real property images and details
- Environment variable support for API key (NEXT_PUBLIC_REPLIERS_API_KEY) - development only

@param props - The component props
@returns JSX.Element`,methods:[],displayName:"AutocompleteSearch",props:{apiKey:{required:!1,tsType:{name:"string"},description:"Repliers API key - required for production use (env fallback only works in development)"},placeholder:{required:!1,tsType:{name:"string"},description:"Placeholder text for the search input",defaultValue:{value:'"Search for properties..."',computed:!1}}}};const ne={title:"Tutorials/Configuring the Autocomplete Search Component with Repliers API",component:T,parameters:{layout:"fullscreen",docs:{title:"Tutorial",description:{component:`
# Autocomplete Search Component Tutorial

[**View the full code repository on GitHub**](https://github.com/repliersio/pocs)

This tutorial focuses on understanding the API calls, requests, and responses involved in building a real estate autocomplete search. The UI component is already fully designed and coded out for you—feel free to use or adapt it in your own projects!

## Why Autocomplete Search Matters

Autocomplete search is essential for real estate applications because it:

- **Searches the database of listings** - Users can find specific properties by address, MLS number, or partial matches
- **Helps with regional searches** - When users want to browse listings in a certain area but don't know exact addresses, location autocomplete provides cities, neighborhoods, and areas
- **Improves user experience** - Reduces typing, prevents errors, and provides instant feedback

## Tech Stack Overview

This tutorial uses:

- **React 18** with TypeScript for type safety
- **Next.js 14** for the development environment
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Repliers API** for real estate data ✨✨✨

## Component Architecture

The autocomplete search follows this flow:

\`\`\`
User Input (3+ chars)
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
\`\`\`

### Key Design Decisions

- **Debouncing**: Prevents excessive API calls while user is typing
- **Concurrent requests**: Both APIs called simultaneously for better performance
- **Minimum query length**: 3 characters ensures meaningful search results
- **Categorized display**: Groups results by type for better UX

## API Implementation

The component makes concurrent API calls to two Repliers endpoints:

### 1. Listings Endpoint

\`\`\`http
GET https://api.repliers.io/listings?search={query}&searchFields=address.streetNumber,address.streetName,mlsNumber,address.city&fields=address.*,mlsNumber,listPrice,details.numBedrooms,details.numBedroomsPlus,details.numBathrooms,details.numBathroomsPlus,details.numGarageSpaces,details.propertyType,type,lastStatus,images&fuzzysearch=true&status=A&status=U
\`\`\`

**Formatted for readability:**

\`\`\`http
GET https://api.repliers.io/listings
  ?search={query}
  &searchFields=address.streetNumber,address.streetName,mlsNumber,address.city
  &fields=address.*,mlsNumber,listPrice,details.numBedrooms,details.numBedroomsPlus,details.numBathrooms,details.numBathroomsPlus,details.numGarageSpaces,details.propertyType,type,lastStatus,images
  &fuzzysearch=true
  &status=A
  &status=U
\`\`\`

**What we're requesting:**

- Search across street numbers, street names, MLS numbers, and cities
- Return only active (A) and under contract (U) listings
- Include property details, garage info (number of garage spaces), images, and status information
- Use fuzzy search for better matching

### 2. Locations Autocomplete Endpoint

\`\`\`http
GET https://api.repliers.io/locations/autocomplete?search={query}&addContext=city
\`\`\`

**Formatted for readability:**

\`\`\`http
GET https://api.repliers.io/locations/autocomplete
  ?search={query}
  &addContext=city
\`\`\`

**What we're requesting:**

- Search for cities, neighborhoods, and areas
- Include city context for neighborhoods to show "Neighborhood in City, State" format
- Return geographic coordinates for mapping

Both requests execute simultaneously using \`Promise.all()\` with a 400ms debounce to prevent excessive API calls.

## Tutorial Steps

### Step 1: Clone and Setup the Repository

First, you'll need to clone this repository to your local machine:

1. **Fork the repository** on GitHub by clicking the "Fork" button in the top right
2. **Clone your fork** locally:

\`\`\`bash
git clone https://github.com/YOUR_USERNAME/pocs.git
cd pocs
\`\`\`

3. **Set up the remote** to track the original repository:

\`\`\`bash
git remote add upstream https://github.com/ORIGINAL_OWNER/pocs.git
\`\`\`

4. **Install dependencies**:

\`\`\`bash
npm install
\`\`\`

**Resources:**
- [GitHub's Forking Guide](https://docs.github.com/en/get-started/quickstart/fork-a-repo)
- [Git Clone Documentation](https://git-scm.com/docs/git-clone)

### Step 2: Local Development Setup

1. **Create environment file**:

\`\`\`bash
cp .env.example .env.local
\`\`\`

2. **Add your Repliers API key** to \`.env.local\`:

\`\`\`env
NEXT_PUBLIC_REPLIERS_API_KEY=your_api_key_here
\`\`\`

3. **Start the development server**:

\`\`\`bash
npm run dev
\`\`\`

**Important:** The component automatically looks for the API key in \`NEXT_PUBLIC_REPLIERS_API_KEY\` environment variable during development. This is a convenience feature for local development only - in production, you should always pass the API key as a prop.

### Step 3: Understanding the API Calls

Let's examine the actual API requests and responses:

#### Listings API Request

\`\`\`typescript
const listingsResponse = await fetch(
  \`https://api.repliers.io/listings?search=\${encodeURIComponent(query)}&searchFields=address.streetNumber,address.streetName,mlsNumber,address.city&fields=address.*,mlsNumber,listPrice,details.numBedrooms,details.numBedroomsPlus,details.numBathrooms,details.numBathroomsPlus,details.numGarageSpaces,details.propertyType,type,lastStatus,images&fuzzysearch=true&status=A&status=U\`,
  {
    headers: {
      "REPLIERS-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
  }
);
\`\`\`

**Parameters explained:**

- \`search\`: The user's input query
- \`searchFields\`: Which fields to search within (street numbers, names, MLS numbers, cities)
- \`fields\`: Which fields to return (optimized for performance, including \`details.numGarageSpaces\` for garage info)
- \`fuzzysearch=true\`: Enables fuzzy matching for better results
- \`status=A&status=U\`: A means active listings, U means unlisted listings (sold, terminated, etc. live)

#### Locations API Request

\`\`\`typescript
const locationsResponse = await fetch(
  \`https://api.repliers.io/locations/autocomplete?search=\${encodeURIComponent(query)}&addContext=city\`,
  {
    headers: {
      "REPLIERS-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
  }
);
\`\`\`

**Parameters explained:**

- \`search\`: The user's input query
- \`addContext=city\`: Include city information for neighborhoods

#### Example Responses

**Listings Response:**

\`\`\`json
{
  "listings": [
    {
      "mlsNumber": "X12151945",
      "listPrice": 1250000,
      "address": {
        "streetNumber": "13",
        "streetName": "Fire Route 123",
        "city": "Trent Lakes",
        "state": "Ontario"
      },
      "details": {
        "numBedrooms": 3,
        "numBathrooms": 2,
        "numGarageSpaces": 2,
        "propertyType": "Single Family"
      },
      "type": "Sale",
      "lastStatus": "New"
    }
  ]
}
\`\`\`

**Locations Response:**

\`\`\`json
{
  "locations": [
    {
      "name": "Toronto",
      "type": "city",
      "address": {
        "state": "ON",
        "city": "Toronto"
      }
    },
    {
      "name": "Toronto Gore Rural Estate",
      "type": "neighborhood",
      "address": {
        "state": "ON",
        "city": "Brampton"
      }
    }
  ]
}
\`\`\`

## Error Handling & Edge Cases

The component handles various error scenarios that you should be aware of:

### Common Error States

**1. Invalid API Key:**

\`\`\`json
{
  "error": "Unauthorized",
  "message": "Invalid API key provided"
}
\`\`\`

*What happens:* Component shows "Failed to load results" message and logs error to console.

**2. Network/Connection Errors:**

\`\`\`javascript
// Network timeout or connection failure
fetch: NetworkError when attempting to fetch resource
\`\`\`

*What happens:* Graceful fallback with error message, search remains functional for retry.

**3. Rate Limiting (429 Too Many Requests):**

\`\`\`json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Try again in 60 seconds.",
  "retryAfter": 60
}
\`\`\`

*What happens:* Component displays rate limit message and suggests retry timing.

**4. Malformed Query Response:**

\`\`\`javascript
// When API returns unexpected data structure
TypeError: Cannot read property 'listings' of undefined
\`\`\`

*What happens:* Component safely handles missing data and shows "No results found" instead of crashing.

### Error Handling Implementation

The component uses try-catch blocks and validates API responses:

\`\`\`typescript
try {
  const [listingsResponse, locationsResponse] = await Promise.all([
    fetch(listingsUrl, { headers }),
    fetch(locationsUrl, { headers })
  ]);
  
  // Check for HTTP errors
  if (!listingsResponse.ok || !locationsResponse.ok) {
    throw new Error('API request failed');
  }
  
  const [listingsData, locationsData] = await Promise.all([
    listingsResponse.json(),
    locationsResponse.json()
  ]);
  
  // Validate response structure
  const listings = listingsData?.listings || [];
  const locations = locationsData?.locations || [];
  
} catch (error) {
  console.error('Search error:', error);
  // Show user-friendly error message
  setError('Failed to load results. Please try again.');
}
\`\`\`

## Performance Considerations

### Why 400ms Debounce?

The component uses a 400ms debounce delay, which is carefully chosen based on:

**User Experience Research:**

- **Too fast (< 200ms)**: Creates excessive API calls as users type quickly
- **Too slow (> 600ms)**: Feels unresponsive and sluggish to users
- **Sweet spot (300-500ms)**: Balances responsiveness with API efficiency

**Technical Benefits:**

- **Reduces API costs**: Prevents calls on every keystroke
- **Improves performance**: Fewer network requests = better browser performance  
- **Respects rate limits**: Helps stay within API quotas
- **Battery friendly**: Fewer network requests on mobile devices

**Real-world Impact:**

\`\`\`javascript
// Without debouncing: User types "toronto"
// Triggers 7 API calls: t, to, tor, toro, toron, toront, toronto

// With 400ms debouncing: User types "toronto"  
// Triggers 1 API call: toronto (only after user stops typing)
\`\`\`

### API Rate Limiting Guidelines

**Repliers API Limits:**

- **Development**: 1,000 requests/hour per API key
- **Production**: Contact support for higher limits
- **Burst limit**: 10 requests/second maximum

**Best Practices:**

- Implement exponential backoff for rate limit errors
- Cache results locally for repeated searches
- Use fuzzy search to reduce need for multiple queries
- Monitor usage with analytics to optimize debounce timing

**Rate Limit Handling:**

\`\`\`typescript
if (response.status === 429) {
  const retryAfter = response.headers.get('Retry-After');
  // Wait before retrying, show user feedback
  setTimeout(() => retrySearch(), (retryAfter || 60) * 1000);
}
\`\`\`

### Production Security Best Practices

**API Key Management:**

- **Never expose keys in client-side code** - Use server-side proxy endpoints
- **Use environment variables** - Keep keys out of version control
- **Implement key rotation** - Regularly update API keys
- **Monitor usage** - Set up alerts for unusual activity

**Recommended Architecture for Production:**

\`\`\`
Client App → Your API Server → Repliers API
    ↓              ↓              ↓
No API key    Has API key    Validates key
\`\`\`

**Implementation Example:**

\`\`\`typescript
// Instead of direct API calls from client:
// ❌ fetch('https://api.repliers.io/listings', { 
//     headers: { 'REPLIERS-API-KEY': exposedKey }
//   })

// ✅ Use your own API endpoint:
fetch('/api/search', {
  method: 'POST',
  body: JSON.stringify({ query }),
  headers: { 'Authorization': 'Bearer ' + userToken }
})
\`\`\`

**Additional Security Measures:**

- Implement request signing for sensitive operations
- Use HTTPS everywhere (never HTTP)
- Validate and sanitize all user inputs
- Set up CORS policies appropriately
- Log and monitor API usage patterns

## Key Implementation Details

- **Debouncing**: 400ms delay prevents excessive API calls
- **Minimum query length**: 3 characters required for both endpoints
- **Error handling**: Comprehensive error states for API failures
- **Loading states**: Skeleton loaders during API calls
- **Categorized results**: Properties, Cities, Neighborhoods, Areas
- **Mobile responsive**: Works on all device sizes

## Next Steps

This tutorial provides a foundation for building real estate search features. You can extend this by:

- Adding click handlers for result selection
- Implementing search history
- Adding filters for price range, property type, etc.
- Integrating with mapping services
- Building saved searches functionality

For more information, see the [official Repliers API documentation](https://help.repliers.com/en/article/building-an-autocomplete-search-feature-with-repliers-apis-1eaoxyl/).
        `}}},tags:["autodocs"],argTypes:{apiKey:{control:"text",description:"Your Repliers API key (required)",table:{type:{summary:"string"},defaultValue:{summary:"required"}}},placeholder:{control:"text",description:"Placeholder text for the search input",table:{type:{summary:"string"},defaultValue:{summary:"Search for properties, cities, or neighborhoods..."}}}}},N={args:{placeholder:"Search for properties, cities, or neighborhoods..."},decorators:[w=>e.jsx("div",{style:{display:"flex",justifyContent:"center",paddingTop:"30px",paddingBottom:"530px"},children:e.jsx(w,{})})],parameters:{docs:{description:{story:"This is the working autocomplete search component you'll build in this tutorial. **Note:** You need a valid Repliers API key in your `.env.local` file for this to work with real data."}}}};var k,S,R;N.parameters={...N.parameters,docs:{...(k=N.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    placeholder: "Search for properties, cities, or neighborhoods..."
  },
  decorators: [Story => <div style={{
    display: "flex",
    justifyContent: "center",
    paddingTop: "30px",
    paddingBottom: "530px"
  }}>
        <Story />
      </div>],
  parameters: {
    docs: {
      description: {
        story: "This is the working autocomplete search component you'll build in this tutorial. **Note:** You need a valid Repliers API key in your \`.env.local\` file for this to work with real data."
      }
    }
  }
}`,...(R=(S=N.parameters)==null?void 0:S.docs)==null?void 0:R.source}}};const le=["WorkingExample"];export{N as WorkingExample,le as __namedExportsOrder,ne as default};
