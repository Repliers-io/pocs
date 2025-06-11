import{j as s}from"./jsx-runtime-CBjAUaf4.js";import{I,B as w}from"./input-51wNWQmB.js";import{r as n}from"./index-CoAThXCU.js";/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),P=t=>t.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,a,r)=>r?r.toUpperCase():a.toLowerCase()),f=t=>{const e=P(t);return e.charAt(0).toUpperCase()+e.slice(1)},g=(...t)=>t.filter((e,a,r)=>!!e&&e.trim()!==""&&r.indexOf(e)===a).join(" ").trim(),j=t=>{for(const e in t)if(e.startsWith("aria-")||e==="role"||e==="title")return!0};/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var C={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=n.forwardRef(({color:t="currentColor",size:e=24,strokeWidth:a=2,absoluteStrokeWidth:r,className:p="",children:o,iconNode:h,...d},m)=>n.createElement("svg",{ref:m,...C,width:e,height:e,stroke:t,strokeWidth:r?Number(a)*24/Number(e):a,className:g("lucide",p),...!o&&!j(d)&&{"aria-hidden":"true"},...d},[...h.map(([u,i])=>n.createElement(u,i)),...Array.isArray(o)?o:[o]]));/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=(t,e)=>{const a=n.forwardRef(({className:r,...p},o)=>n.createElement(E,{ref:o,iconNode:e,className:g(`lucide-${v(f(t))}`,`lucide-${t}`,r),...p}));return a.displayName=f(t),a};/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]],b=x("eye-off",N);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],R=x("eye",K);function _({onApiKeyChange:t,className:e,isEstimates:a}){const[r,p]=n.useState(""),[o,h]=n.useState(!1),[d,m]=n.useState(!1),[u,i]=n.useState(null),A=async y=>{if(y){m(!0),i(null);try{const l=await fetch(a?"https://api.repliers.io/estimates":"https://api.repliers.io/listings?area=toronto",{method:"HEAD",headers:{"REPLIERS-API-KEY":y,Accept:"application/json"}});console.log("API Response Status:",l.status),console.log("API Response Headers:",Object.fromEntries(l.headers.entries())),l.status===401?i("Invalid API key. Please check your key and try again."):l.status===403?i(a?"Your API key doesn't have access to the estimates feature. Please upgrade your plan or contact Repliers support to request a trial.":"Your API key doesn't have access to the listings feature. Please upgrade your plan or contact Repliers support to request a trial."):l.ok||i("Failed to validate API key. Please try again.")}catch(c){console.error("API Error:",c),i("Failed to validate API key. Please try again.")}finally{m(!1)}}},k=y=>{const c=y.target.value;p(c),t(c),u&&i(null);const l=setTimeout(()=>{A(c)},500);return()=>clearTimeout(l)};return s.jsxs("div",{className:`flex flex-col gap-2 ${e}`,children:[s.jsx("label",{htmlFor:"api-key",className:"text-sm font-medium",children:"Repliers API Key"}),s.jsxs("div",{className:"flex gap-2 items-center",children:[s.jsx(I,{id:"api-key",type:o?"text":"password",placeholder:"Enter your API key...",className:"max-w-[300px]",value:r,onChange:k,required:!0}),s.jsx(w,{type:"button",variant:"ghost",size:"icon",onClick:()=>h(!o),className:"h-10 w-10",children:o?s.jsx(b,{className:"h-4 w-4"}):s.jsx(R,{className:"h-4 w-4"})})]}),d&&s.jsx("p",{className:"text-sm text-gray-500",children:"Validating API key..."}),u&&s.jsx("p",{className:"text-sm text-red-500",children:u}),s.jsxs("p",{className:"text-sm text-gray-500",children:["Don't have a Repliers API key?"," ",s.jsx("a",{href:"https://repliers.com/",target:"_blank",rel:"noopener noreferrer",className:"text-blue-600 hover:text-blue-800 underline",children:"Get one here"})]})]})}_.__docgenInfo={description:"",methods:[],displayName:"ApiInput",props:{onApiKeyChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(apiKey: string) => void",signature:{arguments:[{type:{name:"string"},name:"apiKey"}],return:{name:"void"}}},description:""},className:{required:!1,tsType:{name:"string"},description:""},isEstimates:{required:!1,tsType:{name:"boolean"},description:""}}};export{_ as A,b as E,R as a,x as c};
