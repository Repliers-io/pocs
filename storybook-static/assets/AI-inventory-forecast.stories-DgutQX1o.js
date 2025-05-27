import{j as e}from"./jsx-runtime-CBjAUaf4.js";import{A as Y,I as E,B as z,E as U,a as _}from"./api-input-Cs_cBeFU.js";import{r as d}from"./index-CoAThXCU.js";import"./jsx-runtime-B2VJbz7C.js";const $=({zipCode:g,riskLevel:t,location:v,averagePrice:s,priceChange:a,currentInventory:x,daysOnMarket:i,inventoryForecast:f,sixMonthAverage:m,sixMonthChange:c,yearOverYearAverage:u,yearOverYearChange:r})=>e.jsxs("div",{className:"max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow border border-gray-200",children:[e.jsxs("div",{className:"flex justify-between items-start flex-wrap gap-4",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[e.jsx("span",{className:"text-sm bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-full",children:g}),e.jsx("span",{className:"text-sm bg-yellow-100 text-yellow-700 font-semibold px-3 py-1 rounded-full",children:t})]}),e.jsx("h2",{className:"text-2xl font-bold text-gray-800",children:v}),e.jsxs("div",{className:"mt-4 space-y-4",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-gray-500",children:"Last 30 Days Average Price"}),e.jsxs("p",{className:"text-xl font-semibold text-gray-900",children:["$",s.toLocaleString()]}),e.jsxs("p",{className:`text-sm ${a>=0?"text-green-600":"text-red-600"} mt-1`,children:[a>=0?"↑":"↓"," ",Math.abs(a),"%"," ",a>=0?"up":"down"," vs previous month"]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-gray-500",children:"6-Month Average Price"}),e.jsxs("p",{className:"text-xl font-semibold text-gray-900",children:["$",m.toLocaleString()]}),e.jsxs("p",{className:`text-sm ${c>=0?"text-green-600":"text-red-600"} mt-1`,children:[c>=0?"↑":"↓"," ",Math.abs(c),"%"," ",c>=0?"up":"down"," vs previous 6 months"]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-gray-500",children:"Year Over Year"}),e.jsxs("p",{className:"text-xl font-semibold text-gray-900",children:["$",u.toLocaleString()]}),e.jsxs("p",{className:`text-sm ${r>=0?"text-green-600":"text-red-600"} mt-1`,children:[r>=0?"↑":"↓"," ",Math.abs(r),"%"," ",r>=0?"up":"down"," vs last year"]})]})]})]}),e.jsxs("div",{className:"text-right",children:[e.jsx("p",{className:"text-gray-500",children:"Current Inventory"}),e.jsxs("p",{className:"text-2xl font-bold text-gray-900",children:[x," homes"]})]})]}),e.jsx("hr",{className:"my-6 border-gray-200"}),e.jsx("div",{className:"flex justify-between items-center mb-4",children:e.jsx("h3",{className:"font-semibold text-gray-800",children:"3-Month Inventory Forecast"})}),e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-4",children:f.map((p,h)=>e.jsxs("div",{className:"bg-gray-50 rounded-xl p-4 text-center",children:[e.jsx("p",{className:"text-sm text-gray-500",children:p.month}),e.jsx("p",{className:"text-lg font-semibold text-gray-800",children:p.value})]},h))})]});$.__docgenInfo={description:"",methods:[],displayName:"AIInventoryForecast",props:{zipCode:{required:!0,tsType:{name:"string"},description:""},riskLevel:{required:!0,tsType:{name:"string"},description:""},location:{required:!0,tsType:{name:"string"},description:""},averagePrice:{required:!0,tsType:{name:"number"},description:""},priceChange:{required:!0,tsType:{name:"number"},description:""},currentInventory:{required:!0,tsType:{name:"number"},description:""},daysOnMarket:{required:!0,tsType:{name:"number"},description:""},inventoryForecast:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  month: string;
  value: number;
}`,signature:{properties:[{key:"month",value:{name:"string",required:!0}},{key:"value",value:{name:"number",required:!0}}]}}],raw:`{
  month: string;
  value: number;
}[]`},description:""},sixMonthAverage:{required:!0,tsType:{name:"number"},description:""},sixMonthChange:{required:!0,tsType:{name:"number"},description:""},yearOverYearAverage:{required:!0,tsType:{name:"number"},description:""},yearOverYearChange:{required:!0,tsType:{name:"number"},description:""}}};function J(g){const t=g.statistics.soldPrice.mth,s=Object.keys(t).sort().slice(0,-1),a=s[s.length-1],x=s[s.length-2],i=t[a].avg,f=t[a].avg,m=t[x].avg,c=Number(((f-m)/m*100).toFixed(2)),u=s.slice(-6),r=s.slice(-12,-6),p=u.reduce((l,n)=>l+t[n].avg,0)/6,h=r.reduce((l,n)=>l+t[n].avg,0)/6,C=Number(((p-h)/h*100).toFixed(2)),O=s.slice(-12),k=s.slice(-24,-12),b=O.reduce((l,n)=>l+t[n].avg,0)/12,I=k.reduce((l,n)=>l+t[n].avg,0)/12,R=Number(((b-I)/I*100).toFixed(2));return{averagePrice:i,priceChange:c,sixMonthAverage:p,sixMonthChange:C,yearOverYearAverage:b,yearOverYearChange:R}}function K(){const[g,t]=d.useState(""),[v,s]=d.useState(""),[a,x]=d.useState(!1),[i,f]=d.useState("94112"),[m,c]=d.useState(!1),[u,r]=d.useState("idle"),[p,h]=d.useState(null),[C,O]=d.useState(null),[k,b]=d.useState(null),I={zipCode:"Enter Zip Code",riskLevel:"N/A",location:"Location will appear here",averagePrice:0,priceChange:0,sixMonthAverage:0,sixMonthChange:0,yearOverYearAverage:0,yearOverYearChange:0,currentInventory:0,daysOnMarket:0,inventoryForecast:[{month:"Month 1",value:0},{month:"Month 2",value:0},{month:"Month 3",value:0}]},R=n=>{switch(n){case"fetching-repliers":return"Fetching real estate data from Repliers...";case"analyzing-data":return"Analyzing market data with AI...";case"complete":return"Analysis complete!";default:return""}},l=async n=>{n.preventDefault(),c(!0),h(null),b(null),r("fetching-repliers");try{const A={"REPLIERS-API-KEY":g,"Content-Type":"application/json",Accept:"application/json","User-Agent":"PostmanRuntime/7.43.4","Cache-Control":"no-cache",Connection:"keep-alive"},w=await fetch(`https://dev.repliers.io/listings?listings=false&statistics=cnt-available,avg-soldPrice,med-daysOnMarket,cnt-new,cnt-closed,grp-mth&type=sale&status=U&minSoldDate=2023-05-20&status=A&zip=${i}`,{method:"GET",headers:A});if(!w.ok){const o=await w.text();throw new Error(`Repliers API error! status: ${w.status}, message: ${o}`)}const j=await w.json();O(j),console.log("Repliers Response:",j),r("analyzing-data");const q=J(j),N=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${v}`},body:JSON.stringify({model:"gpt-4",messages:[{role:"system",content:"You are a helpful assistant that analyzes real estate data and returns structured insights in JSON format. Your analysis should be based on the provided Repliers data. IMPORTANT: Return ONLY the JSON object without any additional text, explanations, or markdown formatting. Use the exact field names and data types as specified."},{role:"user",content:`Analyze the following real estate data from Repliers and return ONLY a JSON object with the specified fields. The Repliers data contains these key metrics:
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
6. No explanations, no markdown, no additional text`}],temperature:.2})});if(!N.ok){const o=await N.text();throw console.error("OpenAI Error Response:",o),new Error(`OpenAI API error! status: ${N.status}, message: ${o}`)}const M=await N.json();console.log("OpenAI Response:",M);const{choices:P}=M;console.log("OpenAI Choices:",P),console.log("Raw content from OpenAI:",P[0].message.content);try{const o=P[0].message.content.replace(/```json\n?|\n?```/g,"").trim();console.log("Cleaned content:",o);const T=JSON.parse(o);console.log("Parsed Props:",T);const y={...T,...q};if(!y.zipCode||!y.riskLevel||!y.location||!Array.isArray(y.inventoryForecast)||y.inventoryForecast.length!==3)throw console.error("Invalid data structure:",y),new Error("Invalid data structure returned from OpenAI");b(y),r("complete")}catch(o){throw console.error("JSON Parse Error:",o),console.error("Failed to parse content:",P[0].message.content),new Error(`Failed to parse OpenAI response: ${o instanceof Error?o.message:"Unknown error"}`)}}catch(A){h(A instanceof Error?A.message:"An error occurred"),console.error("Error:",A),r("idle")}finally{c(!1)}};return e.jsxs("div",{className:"space-y-8",children:[e.jsxs("form",{onSubmit:l,className:"flex flex-col gap-4",children:[e.jsx(Y,{onApiKeyChange:t}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("label",{className:"text-sm font-medium",children:"OpenAI API Key"}),e.jsxs("div",{className:"flex gap-2 items-center",children:[e.jsx(E,{type:a?"text":"password",placeholder:"OpenAI API Key",className:"max-w-[300px]",value:v,onChange:n=>s(n.target.value),required:!0}),e.jsx(z,{type:"button",variant:"ghost",size:"icon",onClick:()=>x(!a),className:"h-10 w-10",children:a?e.jsx(U,{className:"h-4 w-4"}):e.jsx(_,{className:"h-4 w-4"})})]})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(E,{type:"text",placeholder:"95130",className:"max-w-[200px]",value:i,onChange:n=>f(n.target.value),required:!0}),e.jsx(z,{type:"submit",disabled:m,children:m?"Loading...":"Get Data"})]}),p&&e.jsx("div",{className:"text-red-500 text-sm",children:p})]}),u!=="idle"&&e.jsx("div",{className:`text-sm font-medium ${u==="complete"?"text-green-600":"text-blue-600"}`,children:R(u)}),e.jsx($,{...k||I})]})}K.__docgenInfo={description:"",methods:[],displayName:"AIInventoryForecast"};const G={title:"PoCs/Statistics/Statistics by Zip/AI Inventory Forecast",component:K,parameters:{layout:"centered",docs:{description:{component:`## 👤 User Story

As a real estate professional, I want to search an area by zip code and analyze the projected inventory for the next three months.

This component helps real estate professionals:
- Quickly assess market conditions in any area
- Make data-driven decisions about inventory management
- Plan for future market changes
- Identify potential investment opportunities

This component provides real-time real estate market analysis for any given zip code using Repliers API data and OpenAI's analysis capabilities.

## 🎥 Video Demo

Watch a demo of this component in action: [View Demo Video](https://www.loom.com/share/503d120372d2445786922c0a4f89cc3f?sid=e0ca72d9-0b25-46e9-9366-ac1ae3e87919)

## 🚀 Quick Start

1. Install dependencies:
\`\`\`bash
npm install openai lucide-react
\`\`\`

2. Copy the component files:
- \`AI-inventory-forecast.tsx\`
- \`data-display.tsx\`
- Required UI components from your component library

3. Add to your project:
\`\`\`tsx
import { AIInventoryForecast } from "./components/AI-inventory-forecast";

function App() {
  return (
    <div className="container mx-auto p-4">
      <AIInventoryForecast />
    </div>
  );
}
\`\`\`

## 🔑 Required API Keys

### 1. Repliers API Key
- Sign up at [Repliers Developer Portal](https://dev.repliers.io)
- Get your API key from the dashboard
- The component will prompt for this key

### 2. OpenAI API Key
- Sign up at [OpenAI Platform](https://platform.openai.com)
- Create an API key in the dashboard
- The component will prompt for this key

## 📦 Component Structure

The component consists of three main parts:

1. API Key Inputs - Handles authentication for both Repliers and OpenAI APIs
2. Zip Code Input - Allows users to enter their target location
3. Data Display - Shows the analysis results and forecasts

## 💡 Key Features

1. **Real-time Market Analysis**
   - Current inventory levels
   - Price trends
   - Days on market
   - Risk assessment

2. **AI-Powered Forecasting**
   - 3-month inventory projections
   - Market trend analysis
   - Risk level assessment

3. **Interactive UI**
   - Secure API key input
   - Real-time data updates
   - Loading states
   - Error handling

## 📊 Data Structure

The component processes and displays data in this format:

\`\`\`ts
interface ProcessedData {
  zipCode: string;
  riskLevel: string;
  location: string;
  averagePrice: number;
  priceChange: number;
  sixMonthAverage: number;
  sixMonthChange: number;
  yearOverYearAverage: number;
  yearOverYearChange: number;
  currentInventory: number;
  daysOnMarket: number;
  inventoryForecast: {
    month: string;
    value: number;
  }[];
}
\`\`\`

## 🔧 Implementation Steps

1. **Setup API Integration**
\`\`\`ts
// Configure API endpoints
const REPLIERS_API_URL = 'https://dev.repliers.io/listings';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
\`\`\`

2. **Add State Management**
\`\`\`ts
const [apiKey, setApiKey] = useState("");
const [openaiApiKey, setOpenaiApiKey] = useState("");
const [zipCode, setZipCode] = useState("");
const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
\`\`\`

3. **Implement Data Fetching**
\`\`\`ts
const fetchRepliersData = async (zipCode: string) => {
  const response = await fetch(
    \`\${REPLIERS_API_URL}?zip=\${zipCode}&statistics=cnt-available,avg-soldPrice,med-daysOnMarket\`,
    {
      headers: {
        "REPLIERS-API-KEY": apiKey,
        "Content-Type": "application/json"
      }
    }
  );
  return response.json();
};
\`\`\`

4. **Add AI Analysis**
\`\`\`ts
const analyzeWithAI = async (data: any) => {
  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Authorization": \`Bearer \${openaiApiKey}\`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Analyze real estate data and return structured insights"
        },
        {
          role: "user",
          content: JSON.stringify(data)
        }
      ]
    })
  });
  return response.json();
};
\`\`\`

## 🎨 Styling

The component uses Tailwind CSS for styling. Make sure to include these dependencies:

\`\`\`bash
npm install tailwindcss @tailwindcss/forms
\`\`\`

## 🛠️ Dependencies

Required packages:
- React
- TypeScript
- Tailwind CSS
- Lucide React (for icons)
- Repliers API Client
- OpenAI API Client

## 🔍 Error Handling

The component includes comprehensive error handling for:
- Invalid API keys
- Network errors
- Invalid zip codes
- API rate limiting
- Data processing errors

## 📝 Full Component Code

For the complete implementation of this component, including all the code and functionality, visit:
[View Full Component Code](https://github.com/Repliers-io/pocs/blob/main/src/components/statistics/statistics-by-zip/inventory-forecast/AI-inventory-forecast.tsx)`}}},tags:["autodocs"]},S={args:{}};var D,F,L;S.parameters={...S.parameters,docs:{...(D=S.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {}
}`,...(L=(F=S.parameters)==null?void 0:F.docs)==null?void 0:L.source}}};const H=["WorkingDemo"];export{S as WorkingDemo,H as __namedExportsOrder,G as default};
