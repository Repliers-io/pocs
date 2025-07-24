import{j as e}from"./jsx-runtime-CBjAUaf4.js";import{r as u}from"./index-CoAThXCU.js";import{c as d}from"./createLucideIcon-DXKbrH_m.js";import"./jsx-runtime-B2VJbz7C.js";/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z=[["path",{d:"M10 4 8 6",key:"1rru8s"}],["path",{d:"M17 19v2",key:"ts1sot"}],["path",{d:"M2 12h20",key:"9i4pu4"}],["path",{d:"M7 19v2",key:"12npes"}],["path",{d:"M9 5 7.621 3.621A2.121 2.121 0 0 0 4 5v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5",key:"14ym8i"}]],U=d("bath",z);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y=[["path",{d:"M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8",key:"1k78r4"}],["path",{d:"M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4",key:"fb3tl2"}],["path",{d:"M12 4v6",key:"1dcgq2"}],["path",{d:"M2 18h20",key:"ajqnye"}]],G=d("bed-double",Y);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V=[["path",{d:"M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2",key:"5owen"}],["circle",{cx:"7",cy:"17",r:"2",key:"u2ysq9"}],["path",{d:"M9 17h6",key:"r8uit2"}],["circle",{cx:"17",cy:"17",r:"2",key:"axvx0g"}]],H=d("car",V);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],J=d("circle-alert",X);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M16 16s-1.5-2-4-2-4 2-4 2",key:"epbg0q"}],["line",{x1:"9",x2:"9.01",y1:"9",y2:"9",key:"yxxnd0"}],["line",{x1:"15",x2:"15.01",y1:"9",y2:"9",key:"1p4y9e"}]],Q=d("frown",O);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W=[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]],Z=d("loader-circle",W);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ee=[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]],k=d("map-pin",ee);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const se=[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]],te=d("search",se);function I({apiKey:$,placeholder:_="Search for properties..."}){const v=$||void 0,[c,C]=u.useState(""),[o,y]=u.useState({properties:[],cities:[],neighborhoods:[],areas:[]}),[m,w]=u.useState(!1),[f,x]=u.useState(!1),[g,h]=u.useState(null);u.useEffect(()=>{if(!c.trim()){y({properties:[],cities:[],neighborhoods:[],areas:[]}),h(null),x(!1);return}if(c.trim().length<3){y({properties:[],cities:[],neighborhoods:[],areas:[]}),h(null),x(!1);return}x(!0),h(null);const s=setTimeout(async()=>{x(!1),await T(c.trim())},400);return()=>{clearTimeout(s),x(!1)}},[c]);const T=async s=>{if(!v){h("API key is required. Please provide the apiKey prop. Environment variable fallback only works in development mode.");return}w(!0),h(null);try{const t=[fetch(`https://dev.repliers.io/locations/autocomplete?search=${encodeURIComponent(s)}&addContext=city`,{headers:{"REPLIERS-API-KEY":v,"Content-Type":"application/json"}}),fetch(`https://dev.repliers.io/listings?search=${encodeURIComponent(s)}&searchFields=address.streetNumber,address.streetName,mlsNumber,address.city&fields=address.*,mlsNumber,listPrice,details.numBedrooms,details.numBedroomsPlus,details.numBathrooms,details.numBathroomsPlus,details.numGarageSpaces,details.propertyType,type,lastStatus,images&fuzzysearch=true&status=A&status=U`,{headers:{"REPLIERS-API-KEY":v,"Content-Type":"application/json"}})],r=await Promise.all(t);for(let n=0;n<r.length;n++){const l=r[n];if(!l.ok){const N=n===0?"locations":"listings";if(l.status===400){if(N==="locations"&&s.length<3){y({properties:[],cities:[],neighborhoods:[],areas:[]}),w(!1);return}throw new Error(`Bad request to ${N} API. Please check your search query.`)}else throw l.status===401?new Error("Invalid API key. Please check your Repliers API key."):l.status===403?new Error(`API key doesn't have permission for the ${N} endpoint.`):l.status===429?new Error("Too many requests. Please wait a moment and try again."):new Error(`${N} API Error: ${l.status}`)}}const[a,p]=await Promise.all([r[0].json(),r[1].json()]),i=a.locations||[],b=p.listings||[];y({properties:b,cities:i.filter(n=>n.type==="city"),neighborhoods:i.filter(n=>n.type==="neighborhood"),areas:i.filter(n=>n.type==="area")})}catch(t){const r=t instanceof Error?t.message:"Failed to search. Please try again.";h(r)}finally{w(!1)}},R=s=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:0,maximumFractionDigits:0}).format(s),L=s=>{if(!s)return"N/A";const t=s.numBedrooms,r=s.numBedroomsPlus;return t&&r&&r>0?`${t} + ${r}`:(t==null?void 0:t.toString())||"N/A"},q=s=>{if(!s)return"N/A";const t=s.numBathrooms,r=s.numBathroomsPlus;return t&&r&&r>0?`${t} + ${r}`:(t==null?void 0:t.toString())||"N/A"},M=s=>{var t;return s&&((t=s.numGarageSpaces)==null?void 0:t.toString())||"N/A"},B=(s,t)=>t==="New"||t==="Pc"||t==="Ext"?s==="Sale"?"For Sale":s==="Lease"?"For Lease":s||null:t?{Sus:"Suspended",Exp:"Expired",Sld:"Sold",Ter:"Terminated",Dft:"Deal Fell Through",Lsd:"Leased",Sc:"Sold Conditionally",Sce:"Sold Conditionally (Escape Clause)",Lc:"Leased Conditionally",Cs:"Coming Soon"}[t]||t:null,F=({type:s,lastStatus:t})=>{const r=B(s,t);if(!r)return null;let a="bg-green-100 text-green-600";switch(r){case"For Sale":case"For Lease":a="bg-green-100 text-green-600";break;case"Sold":a="bg-blue-100 text-blue-600";break;case"Leased":a="bg-purple-100 text-purple-600";break;case"Sold Conditionally":case"Sold Conditionally (Escape Clause)":case"Leased Conditionally":a="bg-amber-100 text-amber-600";break;case"Coming Soon":a="bg-indigo-100 text-indigo-600";break;case"Suspended":a="bg-orange-100 text-orange-600";break;case"Expired":a="bg-gray-100 text-gray-500";break;case"Terminated":case"Deal Fell Through":a="bg-red-100 text-red-600";break;default:a="bg-gray-100 text-gray-500"}return e.jsx("span",{className:`text-xs px-2 py-1 rounded-md font-medium ${a}`,children:r})},S=o.properties.length>0||o.cities.length>0||o.neighborhoods.length>0||o.areas.length>0,D=o.cities.length>0||o.neighborhoods.length>0||o.areas.length>0,K=c.trim()&&(S||m||f||g||c.trim().length>=3);return e.jsx("div",{className:"relative w-full",children:e.jsxs("div",{className:"relative flex items-center bg-gray-100 rounded-md px-4 py-2 w-full",children:[e.jsx(te,{className:"text-gray-400 w-5 h-5 mr-3"}),e.jsx("input",{type:"text",value:c,onChange:s=>C(s.target.value),placeholder:_,className:"flex-grow bg-transparent outline-none text-gray-700 placeholder-gray-500"}),m&&e.jsx(Z,{className:"w-4 h-4 animate-spin text-gray-400 mr-2"}),e.jsx("span",{className:"text-gray-800 font-semibold text-sm px-2",children:"Search"}),K&&e.jsx("div",{className:"absolute top-full left-0 w-full min-w-[500px] max-w-lg mt-2 bg-white rounded-xl shadow-lg z-50",children:e.jsxs("div",{className:"max-h-[500px] overflow-y-auto p-4 space-y-4",children:[g&&e.jsxs("div",{className:"flex items-center gap-2 text-red-600 mb-4",children:[e.jsx(J,{className:"w-4 h-4"}),e.jsx("span",{className:"text-sm",children:g})]}),m&&e.jsx("div",{className:"space-y-4",children:[...Array(3)].map((s,t)=>e.jsxs("div",{className:"flex items-center gap-4 animate-pulse",children:[e.jsx("div",{className:"w-24 h-16 bg-gray-200 rounded-md"}),e.jsxs("div",{className:"flex-grow",children:[e.jsxs("div",{className:"flex justify-between items-start mb-2",children:[e.jsx("div",{className:"h-6 bg-gray-200 rounded w-32"}),e.jsx("div",{className:"h-5 bg-gray-200 rounded w-16"})]}),e.jsx("div",{className:"h-4 bg-gray-200 rounded w-3/4 mb-2"}),e.jsxs("div",{className:"flex space-x-3",children:[e.jsx("div",{className:"h-4 bg-gray-200 rounded w-20"}),e.jsx("div",{className:"h-4 bg-gray-200 rounded w-16"}),e.jsx("div",{className:"h-4 bg-gray-200 rounded w-18"})]})]})]},t))}),f&&!m&&e.jsx("div",{className:"space-y-4",children:[...Array(2)].map((s,t)=>e.jsxs("div",{className:"flex items-center gap-4 animate-pulse",children:[e.jsx("div",{className:"w-24 h-16 bg-gray-100 rounded-md"}),e.jsxs("div",{className:"flex-grow",children:[e.jsxs("div",{className:"flex justify-between items-start mb-2",children:[e.jsx("div",{className:"h-6 bg-gray-100 rounded w-32"}),e.jsx("div",{className:"h-5 bg-gray-100 rounded w-16"})]}),e.jsx("div",{className:"h-4 bg-gray-100 rounded w-3/4 mb-2"}),e.jsxs("div",{className:"flex space-x-3",children:[e.jsx("div",{className:"h-4 bg-gray-100 rounded w-20"}),e.jsx("div",{className:"h-4 bg-gray-100 rounded w-16"}),e.jsx("div",{className:"h-4 bg-gray-100 rounded w-18"})]})]})]},t))}),!m&&!f&&!g&&!S&&c.trim()&&e.jsxs("div",{className:"text-center py-8",children:[e.jsx(Q,{className:"w-16 h-16 text-gray-400 mx-auto mb-3"}),e.jsx("h3",{className:"text-md font-semibold text-gray-700 mb-2",children:"No results found"}),e.jsx("p",{className:"text-gray-500 mb-2",children:"There aren't any search results that match your query."}),e.jsx("p",{className:"text-gray-500",children:"Try searching for a different property."})]}),!m&&!f&&!g&&(o.cities.length>0||o.neighborhoods.length>0||o.areas.length>0)&&e.jsxs("div",{children:[e.jsx("h4",{className:"text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2",children:"Locations"}),e.jsxs("div",{className:"space-y-0",children:[o.cities.map((s,t)=>{var a;const r=((a=s.address)==null?void 0:a.state)||s.state;return e.jsxs("div",{className:"flex items-center gap-3 px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0",children:[e.jsx("div",{className:"w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0",children:e.jsx(k,{className:"w-4 h-4 text-gray-600"})}),e.jsxs("div",{className:"flex flex-col min-w-0 flex-grow",children:[e.jsx("span",{className:"font-medium text-gray-800 text-sm leading-tight",children:s.name}),e.jsxs("span",{className:"text-xs text-gray-500 leading-tight",children:["City",r&&` in ${r}`]})]})]},`city-${s.name}-${t}`)}),o.neighborhoods.map((s,t)=>{var p,i;const r=((p=s.address)==null?void 0:p.city)||s.city,a=((i=s.address)==null?void 0:i.state)||s.state;return e.jsxs("div",{className:"flex items-center gap-3 px-3 py-2 hover:bg-green-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0",children:[e.jsx("div",{className:"w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0",children:e.jsx(k,{className:"w-4 h-4 text-gray-600"})}),e.jsxs("div",{className:"flex flex-col min-w-0 flex-grow",children:[e.jsx("span",{className:"font-medium text-gray-800 text-sm leading-tight",children:s.name}),e.jsxs("span",{className:"text-xs text-gray-500 leading-tight",children:["Neighborhood",r&&` in ${r}`,r&&a&&`, ${a}`,!r&&a&&` in ${a}`]})]})]},`neighborhood-${s.name}-${t}`)}),o.areas.map((s,t)=>{var a;const r=((a=s.address)==null?void 0:a.state)||s.state;return e.jsxs("div",{className:"flex items-center gap-3 px-3 py-2 hover:bg-purple-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0",children:[e.jsx("div",{className:"w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0",children:e.jsx(k,{className:"w-4 h-4 text-gray-600"})}),e.jsxs("div",{className:"flex flex-col min-w-0 flex-grow",children:[e.jsx("span",{className:"font-medium text-gray-800 text-sm leading-tight",children:s.name}),e.jsxs("span",{className:"text-xs text-gray-500 leading-tight",children:["Area",r&&` in ${r}`]})]})]},`area-${s.name}-${t}`)})]})]}),!m&&o.properties.length>0&&e.jsxs(e.Fragment,{children:[D&&e.jsx("div",{className:"pt-2",children:e.jsx("h4",{className:"text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3",children:"Properties"})}),o.properties.map((s,t)=>{var r,a,p,i,b,n,l;return e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-24 h-16 bg-gray-100 rounded-md overflow-hidden",children:(r=s.images)!=null&&r[0]?e.jsx("img",{src:`https://cdn.repliers.io/${s.images[0]}?class=small`,alt:"Property",className:"object-cover w-full h-full"}):e.jsx("div",{className:"flex items-center justify-center h-full text-xs text-gray-400",children:"No Image"})}),e.jsxs("div",{className:"flex-grow",children:[e.jsxs("div",{className:"flex justify-between items-start",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("h3",{className:"font-semibold text-base",children:s.listPrice?R(s.listPrice):"Price N/A"}),e.jsx("span",{className:"text-gray-400",children:"|"}),e.jsx("span",{className:"text-sm text-gray-600",children:s.mlsNumber})]}),e.jsx(F,{type:s.type,lastStatus:s.lastStatus})]}),e.jsx("p",{className:"text-xs text-gray-600",children:`${((a=s.address)==null?void 0:a.streetNumber)||""} ${((p=s.address)==null?void 0:p.streetName)||""} ${((i=s.address)==null?void 0:i.streetSuffix)||""}, ${((b=s.address)==null?void 0:b.city)||""}${(n=s.address)!=null&&n.state?`, ${s.address.state}`:""}`}),e.jsxs("div",{className:"flex items-center text-xs text-gray-500 mt-1 space-x-3 flex-wrap",children:[e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(G,{className:"w-4 h-4"}),L(s.details)," Bedroom"]}),e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(U,{className:"w-4 h-4"}),q(s.details)," Bath"]}),e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(H,{className:"w-4 h-4"}),M(s.details)," Garage"]}),((l=s.details)==null?void 0:l.propertyType)&&e.jsxs("span",{children:["| ",s.details.propertyType]})]})]})]},s.mlsNumber||t)})]})]})})]})})}I.__docgenInfo={description:`AutocompleteSearch Component

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
@returns JSX.Element`,methods:[],displayName:"AutocompleteSearch",props:{apiKey:{required:!1,tsType:{name:"string"},description:"Repliers API key - required for production use (env fallback only works in development)"},placeholder:{required:!1,tsType:{name:"string"},description:"Placeholder text for the search input",defaultValue:{value:'"Search for properties..."',computed:!1}}}};const ie={title:"Tutorials/Autocomplete Search",component:I,parameters:{layout:"centered",docs:{description:{component:`
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
        `}}},tags:["autodocs"],argTypes:{apiKey:{control:"text",description:"Your Repliers API key (required)",table:{type:{summary:"string"},defaultValue:{summary:"required"}}},placeholder:{control:"text",description:"Placeholder text for the search input",table:{type:{summary:"string"},defaultValue:{summary:"Search for properties, cities, or neighborhoods..."}}}}},j={args:{placeholder:"Search for properties, cities, or neighborhoods..."},parameters:{docs:{description:{story:"The default autocomplete search component. **Note:** You need a valid Repliers API key for this to work with real data."}}}};var P,A,E;j.parameters={...j.parameters,docs:{...(P=j.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    placeholder: "Search for properties, cities, or neighborhoods..."
  },
  parameters: {
    docs: {
      description: {
        story: "The default autocomplete search component. **Note:** You need a valid Repliers API key for this to work with real data."
      }
    }
  }
}`,...(E=(A=j.parameters)==null?void 0:A.docs)==null?void 0:E.source}}};const le=["Default"];export{j as Default,le as __namedExportsOrder,ie as default};
