import{j as e}from"./jsx-runtime-CBjAUaf4.js";import{r as d}from"./index-CoAThXCU.js";import{c as n}from"./createLucideIcon-DXKbrH_m.js";import"./jsx-runtime-B2VJbz7C.js";/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=[["path",{d:"M10 4 8 6",key:"1rru8s"}],["path",{d:"M17 19v2",key:"ts1sot"}],["path",{d:"M2 12h20",key:"9i4pu4"}],["path",{d:"M7 19v2",key:"12npes"}],["path",{d:"M9 5 7.621 3.621A2.121 2.121 0 0 0 4 5v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5",key:"14ym8i"}]],F=n("bath",C);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B=[["path",{d:"M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8",key:"1k78r4"}],["path",{d:"M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4",key:"fb3tl2"}],["path",{d:"M12 4v6",key:"1dcgq2"}],["path",{d:"M2 18h20",key:"ajqnye"}]],D=n("bed-double",B);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=[["path",{d:"M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2",key:"5owen"}],["circle",{cx:"7",cy:"17",r:"2",key:"u2ysq9"}],["path",{d:"M9 17h6",key:"r8uit2"}],["circle",{cx:"17",cy:"17",r:"2",key:"axvx0g"}]],z=n("car",U);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],Y=n("circle-alert",K);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M16 16s-1.5-2-4-2-4 2-4 2",key:"epbg0q"}],["line",{x1:"9",x2:"9.01",y1:"9",y2:"9",key:"yxxnd0"}],["line",{x1:"15",x2:"15.01",y1:"9",y2:"9",key:"1p4y9e"}]],V=n("frown",G);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H=[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]],J=n("loader-circle",H);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O=[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]],Q=n("search",O);function A({apiKey:y,placeholder:P="Search for properties..."}){const[o,I]=d.useState(""),[x,p]=d.useState([]),[l,g]=d.useState(!1),[f,m]=d.useState(!1),[u,i]=d.useState(null);d.useEffect(()=>{if(!o.trim()){p([]),i(null),m(!1);return}if(o.trim().length<3){p([]),i(null),m(!1);return}m(!0),i(null);const s=setTimeout(async()=>{m(!1),await T(o.trim())},400);return()=>{clearTimeout(s),m(!1)}},[o]);const T=async s=>{if(!y){i("API key is required");return}g(!0),i(null);try{const t=await fetch(`https://dev.repliers.io/listings?search=${encodeURIComponent(s)}&searchFields=address.streetNumber,address.streetName,mlsNumber,address.city&fuzzysearch=true`,{headers:{"REPLIERS-API-KEY":y,"Content-Type":"application/json"}});if(!t.ok){const a=await t.text();throw t.status===401?new Error("Invalid API key. Please check your Repliers API key."):t.status===403?new Error("API key doesn't have permission for this endpoint."):t.status===429?new Error("Too many requests. Please wait a moment and try again."):new Error(`API Error (${t.status}): ${a}`)}const r=await t.json();p(r.listings||[])}catch(t){if(console.error("Search error:",t),t instanceof TypeError&&t.message.includes("fetch"))try{const a=await fetch(`https://dev.repliers.io/listings?search=${encodeURIComponent(s)}&searchFields=address.streetNumber,address.streetName,mlsNumber,address.city&fields=address.*,mlsNumber,listPrice`,{headers:{"REPLIERS-API-KEY":y,"Content-Type":"application/json"}});if(a.ok){const c=await a.json();p(c.listings||c.data||c.results||[]);return}}catch(a){console.error("Fallback also failed:",a)}const r=t instanceof Error?t.message:"Failed to search. Please try again.";i(r)}finally{g(!1)}},E=s=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:0,maximumFractionDigits:0}).format(s),R=s=>{if(!s)return"N/A";const t=s.numBedrooms,r=s.numBedroomsPlus;return t&&r&&r>0?`${t} + ${r}`:(t==null?void 0:t.toString())||"N/A"},_=s=>{if(!s)return"N/A";const t=s.numBathrooms,r=s.numBathroomsPlus;return t&&r&&r>0?`${t} + ${r}`:(t==null?void 0:t.toString())||"N/A"},$=s=>{var t;return s&&((t=s.numGarageSpaces)==null?void 0:t.toString())||"N/A"},q=s=>s?{A:"For Sale",Active:"For Sale",S:"Sold",Sold:"Sold",L:"Leased",Lease:"Leased",Leased:"Leased",T:"Terminated",Terminated:"Terminated",Expired:"Terminated",Cancelled:"Terminated"}[s]||s:null,L=({status:s})=>{const t=q(s);if(!t)return null;let r="bg-green-100 text-green-600";return t==="Sold"?r="bg-blue-100 text-blue-600":t==="Leased"?r="bg-purple-100 text-purple-600":t==="Terminated"&&(r="bg-gray-100 text-gray-500"),e.jsx("span",{className:`text-xs px-2 py-1 rounded-md font-medium ${r}`,children:t})},N=x.length>0,M=o.trim()&&(N||l||f||u||o.trim().length>=3);return e.jsx("div",{className:"flex",children:e.jsx("div",{className:"relative flex items-center justify-end gap-1 py-0 lg:py-4",children:e.jsx("div",{className:"flex-1 duration-400 transition-[min-width] delay-100 ease-in min-w-[600px]",children:e.jsxs("div",{className:"p-6 flex flex-col items-center w-full",children:[e.jsxs("div",{className:"flex items-center bg-gray-100 rounded-md px-4 py-2 w-full mb-4",children:[e.jsx(Q,{className:"text-gray-400 w-5 h-5 mr-3"}),e.jsx("input",{type:"text",value:o,onChange:s=>I(s.target.value),placeholder:P,className:"flex-grow bg-transparent outline-none text-gray-700 placeholder-gray-500"}),l&&e.jsx(J,{className:"w-4 h-4 animate-spin text-gray-400 mr-2"}),e.jsx("span",{className:"text-gray-800 font-semibold text-sm px-2",children:"Search"})]}),M&&e.jsxs("div",{className:"space-y-4 w-full max-h-[500px] overflow-y-auto bg-white p-4 rounded-xl shadow",children:[u&&e.jsxs("div",{className:"flex items-center gap-2 text-red-600 mb-4",children:[e.jsx(Y,{className:"w-4 h-4"}),e.jsx("span",{className:"text-sm",children:u})]}),l&&e.jsx("div",{className:"space-y-4",children:[...Array(3)].map((s,t)=>e.jsxs("div",{className:"flex items-center gap-4 animate-pulse",children:[e.jsx("div",{className:"w-24 h-16 bg-gray-200 rounded-md"}),e.jsxs("div",{className:"flex-grow",children:[e.jsxs("div",{className:"flex justify-between items-start mb-2",children:[e.jsx("div",{className:"h-6 bg-gray-200 rounded w-32"}),e.jsx("div",{className:"h-5 bg-gray-200 rounded w-16"})]}),e.jsx("div",{className:"h-4 bg-gray-200 rounded w-3/4 mb-2"}),e.jsxs("div",{className:"flex space-x-3",children:[e.jsx("div",{className:"h-4 bg-gray-200 rounded w-20"}),e.jsx("div",{className:"h-4 bg-gray-200 rounded w-16"}),e.jsx("div",{className:"h-4 bg-gray-200 rounded w-18"})]})]})]},t))}),f&&!l&&e.jsx("div",{className:"space-y-4",children:[...Array(2)].map((s,t)=>e.jsxs("div",{className:"flex items-center gap-4 animate-pulse",children:[e.jsx("div",{className:"w-24 h-16 bg-gray-100 rounded-md"}),e.jsxs("div",{className:"flex-grow",children:[e.jsxs("div",{className:"flex justify-between items-start mb-2",children:[e.jsx("div",{className:"h-6 bg-gray-100 rounded w-32"}),e.jsx("div",{className:"h-5 bg-gray-100 rounded w-16"})]}),e.jsx("div",{className:"h-4 bg-gray-100 rounded w-3/4 mb-2"}),e.jsxs("div",{className:"flex space-x-3",children:[e.jsx("div",{className:"h-4 bg-gray-100 rounded w-20"}),e.jsx("div",{className:"h-4 bg-gray-100 rounded w-16"}),e.jsx("div",{className:"h-4 bg-gray-100 rounded w-18"})]})]})]},t))}),!l&&!f&&!u&&!N&&o.trim()&&e.jsxs("div",{className:"text-center py-8",children:[e.jsx(V,{className:"w-16 h-16 text-gray-400 mx-auto mb-3"}),e.jsx("h3",{className:"text-lg font-semibold text-gray-700 mb-2",children:"No results found"}),e.jsx("p",{className:"text-gray-500 mb-2",children:"There aren't any search results that match your query."}),e.jsx("p",{className:"text-gray-500",children:"Try searching for a different property."})]}),!l&&x.length>0&&e.jsx(e.Fragment,{children:x.map((s,t)=>{var r,a,c,j,b,w;return e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-24 h-16 bg-gray-100 rounded-md overflow-hidden",children:(r=s.images)!=null&&r[0]?e.jsx("img",{src:`https://cdn.repliers.io/${s.images[0]}?class=small`,alt:"Property",className:"object-cover w-full h-full"}):e.jsx("div",{className:"flex items-center justify-center h-full text-xs text-gray-400",children:"No Image"})}),e.jsxs("div",{className:"flex-grow",children:[e.jsxs("div",{className:"flex justify-between items-start",children:[e.jsx("h3",{className:"font-semibold text-lg",children:s.listPrice?E(s.listPrice):"Price N/A"}),e.jsx(L,{status:s.status})]}),e.jsxs("p",{className:"text-sm text-gray-600",children:[`${((a=s.address)==null?void 0:a.streetNumber)||""} ${((c=s.address)==null?void 0:c.streetName)||""} ${((j=s.address)==null?void 0:j.streetSuffix)||""}, ${((b=s.address)==null?void 0:b.city)||""}`," ","| ",s.mlsNumber]}),e.jsxs("div",{className:"flex items-center text-sm text-gray-500 mt-1 space-x-3 flex-wrap",children:[e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(D,{className:"w-4 h-4"}),R(s.details)," Bedroom"]}),e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(F,{className:"w-4 h-4"}),_(s.details)," Bath"]}),e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(z,{className:"w-4 h-4"}),$(s.details)," Garage"]}),((w=s.details)==null?void 0:w.propertyType)&&e.jsxs("span",{children:["| ",s.details.propertyType]})]})]})]},s.mlsNumber||t)})})]})]})})})})}A.__docgenInfo={description:`AutocompleteSearch Component

@description A streamlined autocomplete search component that integrates with Repliers API
to search MLS listings with real-time results and beautiful UI.

Features:
- Debounced search (400ms) with fuzzy matching
- Skeleton loading states
- Error handling and no results states
- Mobile-responsive design
- Real property images and details

@param props - The component props
@returns JSX.Element`,methods:[],displayName:"AutocompleteSearch",props:{apiKey:{required:!0,tsType:{name:"string"},description:"Repliers API key - required for API calls"},placeholder:{required:!1,tsType:{name:"string"},description:"Placeholder text for the search input",defaultValue:{value:'"Search for properties..."',computed:!1}}}};const se={title:"Components/Useful Components/AutocompleteSearch",component:A,parameters:{layout:"centered",docs:{description:{component:`
## Autocomplete Search Using Repliers API

A production-ready React component that implements the [Repliers API autocomplete search pattern](https://help.repliers.com/en/article/building-an-autocomplete-search-feature-with-repliers-apis-1eaoxyl/).

## API Implementation

This component follows the official Repliers guide and implements concurrent API calls to:

### 1. Listings Endpoint
\`\`\`
GET /listings?q={query}&limit={maxResults}&fields=mls_id,list_price,address,property_details,listing_status,photos
\`\`\`

### 2. Locations Autocomplete Endpoint  
\`\`\`
GET /locations/autocomplete?q={query}&limit={maxResults}
\`\`\`

Both requests are executed simultaneously using \`Promise.all()\` for optimal performance, with a 400ms debounce to prevent excessive API calls.

## Quick Start

\`\`\`tsx
import { AutocompleteSearch } from "./components/autocomplete-search";

function App() {
  return (
    <AutocompleteSearch 
      apiKey="your-repliers-api-key"
      onListingSelect={(listing) => console.log('Selected:', listing)}
      onLocationSelect={(location) => console.log('Selected:', location)}
    />
  );
}
\`\`\`

## Key Features

- Debounced search with concurrent API calls
- Categorized results (Properties, Cities, Neighborhoods, Areas)
- Error handling and loading states
- Mobile responsive design
- TypeScript support with full type definitions
        `}}},tags:["autodocs"],argTypes:{apiKey:{control:"text",description:"Your Repliers API key (required)",table:{type:{summary:"string"},defaultValue:{summary:"required"}}},placeholder:{control:"text",description:"Placeholder text for the search input",table:{type:{summary:"string"},defaultValue:{summary:"Search for properties, cities, or neighborhoods..."}}}}},h={args:{apiKey:"your-repliers-api-key-here",placeholder:"Search for properties, cities, or neighborhoods..."},parameters:{docs:{description:{story:"The default autocomplete search component. **Note:** You need a valid Repliers API key for this to work with real data."}}}};var v,S,k;h.parameters={...h.parameters,docs:{...(v=h.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    apiKey: "your-repliers-api-key-here",
    placeholder: "Search for properties, cities, or neighborhoods..."
  },
  parameters: {
    docs: {
      description: {
        story: "The default autocomplete search component. **Note:** You need a valid Repliers API key for this to work with real data."
      }
    }
  }
}`,...(k=(S=h.parameters)==null?void 0:S.docs)==null?void 0:k.source}}};const te=["Default"];export{h as Default,te as __namedExportsOrder,se as default};
