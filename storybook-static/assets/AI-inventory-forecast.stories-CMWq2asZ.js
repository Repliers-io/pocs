import{j as e}from"./jsx-runtime-CBjAUaf4.js";import{A as Y,I as E,B as z,E as J,a as U}from"./api-input-Cs_cBeFU.js";import{r as d}from"./index-CoAThXCU.js";import"./jsx-runtime-B2VJbz7C.js";const $=({zipCode:y,riskLevel:n,location:x,averagePrice:s,priceChange:r,currentInventory:v,daysOnMarket:i,inventoryForecast:f,sixMonthAverage:m,sixMonthChange:c,yearOverYearAverage:u,yearOverYearChange:a})=>e.jsxs("div",{className:"max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow border border-gray-200",children:[e.jsxs("div",{className:"flex justify-between items-start flex-wrap gap-4",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[e.jsx("span",{className:"text-sm bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-full",children:y}),e.jsx("span",{className:"text-sm bg-yellow-100 text-yellow-700 font-semibold px-3 py-1 rounded-full",children:n})]}),e.jsx("h2",{className:"text-2xl font-bold text-gray-800",children:x}),e.jsxs("div",{className:"mt-4 space-y-4",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-gray-500",children:"Last 30 Days Average Price"}),e.jsxs("p",{className:"text-xl font-semibold text-gray-900",children:["$",s.toLocaleString()]}),e.jsxs("p",{className:`text-sm ${r>=0?"text-green-600":"text-red-600"} mt-1`,children:[r>=0?"↑":"↓"," ",Math.abs(r),"%"," ",r>=0?"up":"down"," vs previous month"]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-gray-500",children:"6-Month Average Price"}),e.jsxs("p",{className:"text-xl font-semibold text-gray-900",children:["$",m.toLocaleString()]}),e.jsxs("p",{className:`text-sm ${c>=0?"text-green-600":"text-red-600"} mt-1`,children:[c>=0?"↑":"↓"," ",Math.abs(c),"%"," ",c>=0?"up":"down"," vs previous 6 months"]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-gray-500",children:"Year Over Year"}),e.jsxs("p",{className:"text-xl font-semibold text-gray-900",children:["$",u.toLocaleString()]}),e.jsxs("p",{className:`text-sm ${a>=0?"text-green-600":"text-red-600"} mt-1`,children:[a>=0?"↑":"↓"," ",Math.abs(a),"%"," ",a>=0?"up":"down"," vs last year"]})]})]})]}),e.jsxs("div",{className:"text-right",children:[e.jsx("p",{className:"text-gray-500",children:"Current Inventory"}),e.jsxs("p",{className:"text-2xl font-bold text-gray-900",children:[v," homes"]})]})]}),e.jsx("hr",{className:"my-6 border-gray-200"}),e.jsx("div",{className:"flex justify-between items-center mb-4",children:e.jsx("h3",{className:"font-semibold text-gray-800",children:"3-Month Inventory Forecast"})}),e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-4",children:f.map((p,h)=>e.jsxs("div",{className:"bg-gray-50 rounded-xl p-4 text-center",children:[e.jsx("p",{className:"text-sm text-gray-500",children:p.month}),e.jsx("p",{className:"text-lg font-semibold text-gray-800",children:p.value})]},h))})]});$.__docgenInfo={description:"",methods:[],displayName:"AIInventoryForecast",props:{zipCode:{required:!0,tsType:{name:"string"},description:""},riskLevel:{required:!0,tsType:{name:"string"},description:""},location:{required:!0,tsType:{name:"string"},description:""},averagePrice:{required:!0,tsType:{name:"number"},description:""},priceChange:{required:!0,tsType:{name:"number"},description:""},currentInventory:{required:!0,tsType:{name:"number"},description:""},daysOnMarket:{required:!0,tsType:{name:"number"},description:""},inventoryForecast:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  month: string;
  value: number;
}`,signature:{properties:[{key:"month",value:{name:"string",required:!0}},{key:"value",value:{name:"number",required:!0}}]}}],raw:`{
  month: string;
  value: number;
}[]`},description:""},sixMonthAverage:{required:!0,tsType:{name:"number"},description:""},sixMonthChange:{required:!0,tsType:{name:"number"},description:""},yearOverYearAverage:{required:!0,tsType:{name:"number"},description:""},yearOverYearChange:{required:!0,tsType:{name:"number"},description:""}}};function _(y){const n=y.statistics.soldPrice.mth,s=Object.keys(n).sort().slice(0,-1),r=s[s.length-1],v=s[s.length-2],i=n[r].avg,f=n[r].avg,m=n[v].avg,c=Number(((f-m)/m*100).toFixed(2)),u=s.slice(-6),a=s.slice(-12,-6),p=u.reduce((l,t)=>l+n[t].avg,0)/6,h=a.reduce((l,t)=>l+n[t].avg,0)/6,T=Number(((p-h)/h*100).toFixed(2)),S=s.slice(-12),k=s.slice(-24,-12),b=S.reduce((l,t)=>l+n[t].avg,0)/12,w=k.reduce((l,t)=>l+n[t].avg,0)/12,C=Number(((b-w)/w*100).toFixed(2));return{averagePrice:i,priceChange:c,sixMonthAverage:p,sixMonthChange:T,yearOverYearAverage:b,yearOverYearChange:C}}function q(){const[y,n]=d.useState(""),[x,s]=d.useState(""),[r,v]=d.useState(!1),[i,f]=d.useState("94112"),[m,c]=d.useState(!1),[u,a]=d.useState("idle"),[p,h]=d.useState(null),[T,S]=d.useState(null),[k,b]=d.useState(null),w={zipCode:"Enter Zip Code",riskLevel:"N/A",location:"Location will appear here",averagePrice:0,priceChange:0,sixMonthAverage:0,sixMonthChange:0,yearOverYearAverage:0,yearOverYearChange:0,currentInventory:0,daysOnMarket:0,inventoryForecast:[{month:"Month 1",value:0},{month:"Month 2",value:0},{month:"Month 3",value:0}]},C=t=>{switch(t){case"fetching-repliers":return"Fetching real estate data from Repliers...";case"analyzing-data":return"Analyzing market data with AI...";case"complete":return"Analysis complete!";default:return""}},l=async t=>{t.preventDefault(),c(!0),h(null),b(null),a("fetching-repliers");try{const A={"REPLIERS-API-KEY":y,"Content-Type":"application/json",Accept:"application/json","User-Agent":"PostmanRuntime/7.43.4","Cache-Control":"no-cache",Connection:"keep-alive"},I=await fetch(`https://dev.repliers.io/listings?listings=false&statistics=cnt-available,avg-soldPrice,med-daysOnMarket,cnt-new,cnt-closed,grp-mth&type=sale&status=U&minSoldDate=2023-05-20&status=A&zip=${i}`,{method:"GET",headers:A});if(!I.ok){const o=await I.text();throw new Error(`Repliers API error! status: ${I.status}, message: ${o}`)}const j=await I.json();S(j),console.log("Repliers Response:",j),a("analyzing-data");const K=_(j),N=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${x}`},body:JSON.stringify({model:"gpt-4",messages:[{role:"system",content:"You are a helpful assistant that analyzes real estate data and returns structured insights in JSON format. Your analysis should be based on the provided Repliers data. IMPORTANT: Return ONLY the JSON object without any additional text, explanations, or markdown formatting. Use the exact field names and data types as specified."},{role:"user",content:`Analyze the following real estate data from Repliers and return ONLY a JSON object with the specified fields. The Repliers data contains these key metrics:
- cnt-available: Number of listings available at the end of each month
- cnt-closed: Number of listings sold in each month
- cnt-new: Number of new listings added in each month
- avg-soldPrice: Average sold price for each month
- med-daysOnMarket: Median time to sell

Target Zip Code: ${i}

Repliers Data: ${JSON.stringify(j,null,2)}

Return a JSON object with these exact fields and types:
{
  "zipCode": "string - use the provided zip code: ${i}",
  "riskLevel": "string - calculate based on trends in cnt-closed and avg-soldPrice",
  "location": "string - city and state based on zip code ${i}",
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
5. Use the provided zip code ${i} for the zipCode and location fields
6. No explanations, no markdown, no additional text`}],temperature:.2})});if(!N.ok){const o=await N.text();throw console.error("OpenAI Error Response:",o),new Error(`OpenAI API error! status: ${N.status}, message: ${o}`)}const M=await N.json();console.log("OpenAI Response:",M);const{choices:O}=M;console.log("OpenAI Choices:",O),console.log("Raw content from OpenAI:",O[0].message.content);try{const o=O[0].message.content.replace(/```json\n?|\n?```/g,"").trim();console.log("Cleaned content:",o);const R=JSON.parse(o);console.log("Parsed Props:",R);const g={...R,...K};if(!g.zipCode||!g.riskLevel||!g.location||!Array.isArray(g.inventoryForecast)||g.inventoryForecast.length!==3)throw console.error("Invalid data structure:",g),new Error("Invalid data structure returned from OpenAI");b(g),a("complete")}catch(o){throw console.error("JSON Parse Error:",o),console.error("Failed to parse content:",O[0].message.content),new Error(`Failed to parse OpenAI response: ${o instanceof Error?o.message:"Unknown error"}`)}}catch(A){h(A instanceof Error?A.message:"An error occurred"),console.error("Error:",A),a("idle")}finally{c(!1)}};return e.jsxs("div",{className:"space-y-8",children:[e.jsxs("form",{onSubmit:l,className:"flex flex-col gap-4",children:[e.jsx(Y,{onApiKeyChange:n}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("label",{className:"text-sm font-medium",children:"OpenAI API Key"}),e.jsxs("div",{className:"flex gap-2 items-center",children:[e.jsx(E,{type:r?"text":"password",placeholder:"OpenAI API Key",className:"max-w-[300px]",value:x,onChange:t=>s(t.target.value),required:!0}),e.jsx(z,{type:"button",variant:"ghost",size:"icon",onClick:()=>v(!r),className:"h-10 w-10",children:r?e.jsx(J,{className:"h-4 w-4"}):e.jsx(U,{className:"h-4 w-4"})})]})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(E,{type:"text",placeholder:"95130",className:"max-w-[200px]",value:i,onChange:t=>f(t.target.value),required:!0}),e.jsx(z,{type:"submit",disabled:m,children:m?"Loading...":"Get Data"})]}),p&&e.jsx("div",{className:"text-red-500 text-sm",children:p})]}),u!=="idle"&&e.jsx("div",{className:`text-sm font-medium ${u==="complete"?"text-green-600":"text-blue-600"}`,children:C(u)}),e.jsx($,{...k||w})]})}q.__docgenInfo={description:"",methods:[],displayName:"AIInventoryForecast"};const H={title:"PoCs/Statistics by Zip Code/AI Inventory Forecast",component:q,parameters:{layout:"centered",docs:{description:{component:`A React component that provides real estate market analysis for a given zip code. It fetches data from Repliers API and uses OpenAI to analyze market trends.

## Video Demo

Watch a demo of this component in action: [View Demo Video](https://www.loom.com/share/503d120372d2445786922c0a4f89cc3f?sid=e0ca72d9-0b25-46e9-9366-ac1ae3e87919)

## Complete Code

You can find the complete working code for this component in the Repliers POCs repository:
[View on GitHub](https://github.com/Repliers-io/pocs/blob/main/src/components/statistics-by-zip-code/AI-inventory-forecast.tsx)

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
import { AIInventoryForecast } from "./AI-inventory-forecast";

function App() {
  return (
    <div className="container mx-auto p-4">
      <AIInventoryForecast />
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
- ./data-display`}}},tags:["autodocs"]},P={args:{}};var F,D,L;P.parameters={...P.parameters,docs:{...(F=P.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {}
}`,...(L=(D=P.parameters)==null?void 0:D.docs)==null?void 0:L.source}}};const W=["WorkingDemo"];export{P as WorkingDemo,W as __namedExportsOrder,H as default};
