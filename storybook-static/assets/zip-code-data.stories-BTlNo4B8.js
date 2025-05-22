import{j as e}from"./jsx-runtime-CBjAUaf4.js";import{A as M,I,B as L}from"./api-input-B7xzUR3Y.js";import{r as a}from"./index-CoAThXCU.js";import"./jsx-runtime-B2VJbz7C.js";const O=({zipCode:y,riskLevel:x,location:l,averagePrice:f,priceChange:t,currentInventory:v,daysOnMarket:d,inventoryForecast:p})=>e.jsxs("div",{className:"max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow border border-gray-200",children:[e.jsxs("div",{className:"flex justify-between items-start flex-wrap gap-4",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[e.jsx("span",{className:"text-sm bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-full",children:y}),e.jsx("span",{className:"text-sm bg-yellow-100 text-yellow-700 font-semibold px-3 py-1 rounded-full",children:x})]}),e.jsx("h2",{className:"text-2xl font-bold text-gray-800",children:l}),e.jsxs("div",{className:"mt-4",children:[e.jsx("p",{className:"text-gray-500",children:"Average Price"}),e.jsxs("p",{className:"text-xl font-semibold text-gray-900",children:["$",f.toLocaleString()]}),e.jsxs("p",{className:`text-sm ${t>=0?"text-green-600":"text-red-600"} mt-1`,children:[t>=0?"↑":"↓"," ",Math.abs(t),"%"," ",t>=0?"up":"down"]})]})]}),e.jsxs("div",{className:"text-right",children:[e.jsx("p",{className:"text-gray-500",children:"Current Inventory"}),e.jsxs("p",{className:"text-2xl font-bold text-gray-900",children:[v," homes"]})]})]}),e.jsx("div",{className:"mt-6 flex flex-col sm:flex-row justify-between gap-6",children:e.jsxs("div",{children:[e.jsx("p",{className:"text-gray-500",children:"Days on Market"}),e.jsxs("p",{className:"text-xl font-bold text-gray-900",children:[d," days"]}),e.jsx("p",{className:"text-sm text-gray-500",children:"median time to sell"})]})}),e.jsx("hr",{className:"my-6 border-gray-200"}),e.jsx("div",{className:"flex justify-between items-center mb-4",children:e.jsx("h3",{className:"font-semibold text-gray-800",children:"3-Month Inventory Forecast"})}),e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-4",children:p.map((o,i)=>e.jsxs("div",{className:"bg-gray-50 rounded-xl p-4 text-center",children:[e.jsx("p",{className:"text-sm text-gray-500",children:o.month}),e.jsx("p",{className:"text-lg font-semibold text-gray-800",children:o.value})]},i))})]});O.__docgenInfo={description:"",methods:[],displayName:"ZipCodeData",props:{zipCode:{required:!0,tsType:{name:"string"},description:""},riskLevel:{required:!0,tsType:{name:"string"},description:""},location:{required:!0,tsType:{name:"string"},description:""},averagePrice:{required:!0,tsType:{name:"number"},description:""},priceChange:{required:!0,tsType:{name:"number"},description:""},currentInventory:{required:!0,tsType:{name:"number"},description:""},daysOnMarket:{required:!0,tsType:{name:"number"},description:""},inventoryForecast:{required:!0,tsType:{name:"Array",elements:[{name:"InventoryForecast"}],raw:"InventoryForecast[]"},description:""}}};function k(){const[y,x]=a.useState(""),[l,f]=a.useState(""),[t,v]=a.useState("94112"),[d,p]=a.useState(!1),[o,i]=a.useState("idle"),[w,j]=a.useState(null),[$,R]=a.useState(null),[T,N]=a.useState(null),D={zipCode:"Enter Zip Code",riskLevel:"N/A",location:"Location will appear here",averagePrice:0,priceChange:0,currentInventory:0,daysOnMarket:0,inventoryForecast:[{month:"Month 1",value:0},{month:"Month 2",value:0},{month:"Month 3",value:0}]},z=r=>{switch(r){case"fetching-repliers":return"Fetching real estate data from Repliers...";case"analyzing-data":return"Analyzing market data with AI...";case"complete":return"Analysis complete!";default:return""}},E=async r=>{r.preventDefault(),p(!0),j(null),N(null),i("fetching-repliers");try{const c={"REPLIERS-API-KEY":y,"Content-Type":"application/json",Accept:"application/json","User-Agent":"PostmanRuntime/7.43.4","Cache-Control":"no-cache",Connection:"keep-alive"},m=await fetch(`https://dev.repliers.io/listings?listings=false&statistics=cnt-available,avg-soldPrice,med-daysOnMarket,cnt-new,cnt-closed,grp-mth&type=sale&status=U&minSoldDate=2023-05-20&status=A&zip=${t}`,{method:"GET",headers:c});if(!m.ok){const n=await m.text();throw new Error(`Repliers API error! status: ${m.status}, message: ${n}`)}const b=await m.json();R(b),console.log("Repliers Response:",b),i("analyzing-data");const u=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${l}`},body:JSON.stringify({model:"gpt-4",messages:[{role:"system",content:"You are a helpful assistant that analyzes real estate data and returns structured insights in JSON format. Your analysis should be based on the provided Repliers data. IMPORTANT: Return ONLY the JSON object without any additional text, explanations, or markdown formatting. Use the exact field names and data types as specified."},{role:"user",content:`Analyze the following real estate data from Repliers and return ONLY a JSON object with the specified fields. The Repliers data contains these key metrics:
- cnt-available: Number of listings available at the end of each month
- cnt-closed: Number of listings sold in each month
- cnt-new: Number of new listings added in each month
- avg-soldPrice: Average sold price for each month
- med-daysOnMarket: Median time to sell

Target Zip Code: ${t}

Repliers Data: ${JSON.stringify(b,null,2)}

Return a JSON object with these exact fields and types:
{
  "zipCode": "string - use the provided zip code: ${t}",
  "riskLevel": "string - calculate based on trends in cnt-closed and avg-soldPrice",
  "location": "string - city and state based on zip code ${t}",
  "averagePrice": "number - use the most recent avg-soldPrice",
  "priceChange": "number - calculate percentage change in avg-soldPrice between most recent and previous month",
  "currentInventory": "number - use the most recent cnt-available",
  "daysOnMarket": "number - use the most recent med-daysOnMarket",
  "inventoryForecast": [
    {"month": "string - next month abbreviation", "value": "number - project based on cnt-new and cnt-closed trends"},
    {"month": "string - month after next abbreviation", "value": "number - project based on cnt-new and cnt-closed trends"},
    {"month": "string - third month abbreviation", "value": "number - project based on cnt-new and cnt-closed trends"}
  ]
}

IMPORTANT:
1. Return ONLY the JSON object with actual values
2. Use the exact field names and types as shown above
3. Calculate riskLevel based on trends in sales and prices
4. For inventoryForecast, use trends in cnt-new and cnt-closed to project future inventory
5. Use the provided zip code ${t} for the zipCode and location fields
6. No explanations, no markdown, no additional text`}],temperature:.2})});if(!u.ok){const n=await u.text();throw console.error("OpenAI Error Response:",n),new Error(`OpenAI API error! status: ${u.status}, message: ${n}`)}const A=await u.json();console.log("OpenAI Response:",A);const{choices:h}=A;console.log("OpenAI Choices:",h),console.log("Raw content from OpenAI:",h[0].message.content);try{const n=h[0].message.content.replace(/```json\n?|\n?```/g,"").trim();console.log("Cleaned content:",n);const s=JSON.parse(n);if(console.log("Parsed Props:",s),!s.zipCode||!s.riskLevel||!s.location||!Array.isArray(s.inventoryForecast)||s.inventoryForecast.length!==3)throw console.error("Invalid data structure:",s),new Error("Invalid data structure returned from OpenAI");N(s),i("complete")}catch(n){throw console.error("JSON Parse Error:",n),console.error("Failed to parse content:",h[0].message.content),new Error(`Failed to parse OpenAI response: ${n instanceof Error?n.message:"Unknown error"}`)}}catch(c){j(c instanceof Error?c.message:"An error occurred"),console.error("Error:",c),i("idle")}finally{p(!1)}};return e.jsxs("div",{className:"space-y-8",children:[e.jsxs("form",{onSubmit:E,className:"flex flex-col gap-4",children:[e.jsx(M,{onApiKeyChange:x}),e.jsx("div",{className:"flex gap-2",children:e.jsx(I,{type:"password",placeholder:"OpenAI API Key",className:"max-w-[300px]",value:l,onChange:r=>f(r.target.value),required:!0})}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(I,{type:"text",placeholder:"95130",className:"max-w-[200px]",value:t,onChange:r=>v(r.target.value),required:!0}),e.jsx(L,{type:"submit",disabled:d,children:d?"Loading...":"Get Data"})]}),w&&e.jsx("div",{className:"text-red-500 text-sm",children:w})]}),o!=="idle"&&e.jsx("div",{className:`text-sm font-medium ${o==="complete"?"text-green-600":"text-blue-600"}`,children:z(o)}),e.jsx(O,{...T||D})]})}k.__docgenInfo={description:"",methods:[],displayName:"ZipCodeData"};const J={title:"Components/ZipCodeData",component:k,parameters:{layout:"centered",docs:{description:{component:`# ZipCodeData Component

A React component that provides real estate market analysis for a given zip code. It fetches data from Repliers API and uses OpenAI to analyze market trends.

## Complete Code

You can find the complete working code for this component in the Repliers POCs repository:
[View on GitHub](https://github.com/Repliers-io/pocs/blob/main/src/components/zip-code-data/zip-code-data.tsx)

## Tech Stack
- React
- TypeScript
- Tailwind CSS
- Repliers API
- OpenAI API

## Required API Keys

This component requires two API keys:

1. **Repliers API Key**
   - Sign up at [Repliers Developer Portal](https://dev.repliers.io)
   - Navigate to your dashboard to obtain your API key
   - Enter the key in the Repliers API Key input field

2. **OpenAI API Key**
   - Sign up at [OpenAI Platform](https://platform.openai.com)
   - Navigate to API Keys section to create a new key
   - Enter the key in the OpenAI API Key input field

## Component Structure

The component consists of:
- Zip code input field
- Data display section showing:
  - Location and risk level
  - Average price and price change
  - Current inventory
  - Days on market
  - 3-month inventory forecast

## Usage Example

\`\`\`tsx
import { ZipCodeData } from "./zip-code-data";

function App() {
  return (
    <div className="container mx-auto p-4">
      <ZipCodeData />
    </div>
  );
}
\`\`\`

## Data Interface

The component processes and displays the following data structure:

\`\`\`typescript
interface ProcessedData {
  zipCode: string;
  riskLevel: string;
  location: string;
  averagePrice: number;
  priceChange: number;
  currentInventory: number;
  daysOnMarket: number;
  inventoryForecast: {
    month: string;
    value: number;
  }[];
}
\`\`\`

## Error Handling

The component includes error handling for:
- Invalid API keys
- Network errors
- Invalid zip codes
- API rate limiting

## Styling

The component uses Tailwind CSS for styling. Make sure your project has Tailwind CSS configured.

## Dependencies

Required components:
- @/components/ui/input
- @/components/ui/button
- @/components/api-input/api-input
- ./data-display`}}},tags:["autodocs"]},g={args:{}};var C,P,S;g.parameters={...g.parameters,docs:{...(C=g.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {}
}`,...(S=(P=g.parameters)==null?void 0:P.docs)==null?void 0:S.source}}};const U=["Default"];export{g as Default,U as __namedExportsOrder,J as default};
