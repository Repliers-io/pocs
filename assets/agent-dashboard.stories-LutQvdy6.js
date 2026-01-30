import{j as e}from"./jsx-runtime-xF634gn_.js";import{r as n}from"./index-C-7etoUd.js";import{S as fe}from"./search-DVhWTIqa.js";import{L as oe}from"./loader-circle-x9Fu845P.js";import{C as le,M as gt}from"./map-pin-DKxHnLO8.js";import{U as I}from"./user-C6hR_9u6.js";import{c as T}from"./createLucideIcon-BmJP7rG3.js";/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mt=[["path",{d:"M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16",key:"jecpp"}],["rect",{width:"20",height:"14",x:"2",y:"6",rx:"2",key:"i6l2r4"}]],ht=T("briefcase",mt);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xt=[["path",{d:"M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z",key:"1b4qmf"}],["path",{d:"M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2",key:"i71pzd"}],["path",{d:"M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2",key:"10jefs"}],["path",{d:"M10 6h4",key:"1itunk"}],["path",{d:"M10 10h4",key:"tcdvrf"}],["path",{d:"M10 14h4",key:"kelpxr"}],["path",{d:"M10 18h4",key:"1ulq68"}]],q=T("building-2",xt);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ut=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]],pt=T("globe",ut);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bt=[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]],ft=T("mail",bt);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yt=[["path",{d:"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",key:"9njp5v"}]],vt=T("phone",yt);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jt=[["polyline",{points:"22 7 13.5 15.5 8.5 10.5 2 17",key:"126l90"}],["polyline",{points:"16 7 22 7 22 13",key:"kwv8wd"}]],ye=T("trending-up",jt);function Ke({apiKey:c,className:Xe=""}){const[l,ve]=n.useState("agents"),[$,je]=n.useState([]),[D,ce]=n.useState([]),[h,V]=n.useState(!1),[j,N]=n.useState(null),[u,Y]=n.useState(null),[W,Je]=n.useState([]),[H,Ze]=n.useState([]),[v,K]=n.useState(null),[U,de]=n.useState([]),[B,ke]=n.useState(!1),[Q,ge]=n.useState(null),[X,Ne]=n.useState(""),[R,et]=n.useState(""),[F,tt]=n.useState(""),[w,st]=n.useState("count"),[E,we]=n.useState("desc"),[p,Ae]=n.useState(null),[f,Se]=n.useState(null),[me,Ie]=n.useState(!1),[he,Ee]=n.useState(null),[P,Pe]=n.useState(null),[C,Ce]=n.useState(null),[A,Le]=n.useState(null),[J,Me]=n.useState(null),[Z,Te]=n.useState(null),[k,$e]=n.useState([]),[xe,De]=n.useState(!1),[ue,Ue]=n.useState(null),[Be,Re]=n.useState([]);n.useEffect(()=>{c&&l==="agents"&&ee()},[c,l]),n.useEffect(()=>{const s=[...D].sort((t,a)=>{if(w==="name"){const r=t.agentName.localeCompare(a.agentName);return E==="asc"?r:-r}else{const r=(t.listingCount||0)-(a.listingCount||0);return E==="asc"?r:-r}});ce(s)},[w,E]);const ee=async s=>{var t;if(!c){N("API key is required");return}V(!0),N(null);try{console.log("Fetching members from /members endpoint...");let a="https://api.repliers.io/members";if(s&&s.trim()){const o=s.trim();l==="agents"?(console.log(`Agents tab: using keyword parameter: ${o}`),a+=`?keyword=${encodeURIComponent(o)}`):l==="brokerages"&&(console.log(`Brokerages tab: using brokerage parameter: ${o}`),a+=`?brokerage=${encodeURIComponent(o)}`)}const r=await fetch(a,{headers:{"REPLIERS-API-KEY":c,"Content-Type":"application/json"}});if(!r.ok)throw r.status===401?new Error("Invalid API key"):r.status===403?new Error("API key doesn't have permission for members endpoint"):r.status===429?new Error("Too many requests. Please wait a moment"):new Error(`API Error: ${r.status} - ${r.statusText}`);const g=await r.json();console.log(`Fetched ${((t=g.members)==null?void 0:t.length)||0} members`);const d=(g.members||[]).map(o=>({agentId:o.agentId||o.id,agentName:o.name||"Unknown",agentDetails:o})).filter(o=>o.agentId&&o.agentName.trim()!=="");d.sort((o,m)=>o.agentName.localeCompare(m.agentName)),console.log(`Displaying ${d.length} agents`,d.slice(0,5)),je(d),ce(d);const i=new Map;(g.members||[]).forEach(o=>{var z,O;const m=(z=o.brokerage)==null?void 0:z.name;if(m&&m.trim()){const G=i.get(m);G?G.count+=1:i.set(m,{count:1,details:{officeId:o.officeId,address:(O=o.brokerage)==null?void 0:O.address}})}});const y=Array.from(i.entries()).map(([o,m])=>({brokerageName:o,officeId:m.details.officeId,agentCount:m.count,address:m.details.address})).sort((o,m)=>m.agentCount-o.agentCount);console.log(`Found ${y.length} unique brokerages`,y.slice(0,5)),Je(y),Ze(y)}catch(a){const r=a instanceof Error?a.message:"Failed to load members";N(r)}finally{V(!1)}},Fe=()=>{if(!X.trim()){ee();return}ee(X.trim())},pe=async()=>{var s;if(!c){N("API key is required");return}if(!R.trim()&&!F.trim()){N("Please enter either an agent name or agent ID");return}V(!0),N(null);try{console.log("Fetching members with exact match...");let t="https://api.repliers.io/members?";const a=[];R.trim()&&a.push(`agentName=${encodeURIComponent(R.trim())}`),F.trim()&&a.push(`agentId=${encodeURIComponent(F.trim())}`),t+=a.join("&");const r=await fetch(t,{headers:{"REPLIERS-API-KEY":c,"Content-Type":"application/json"}});if(!r.ok)throw r.status===401?new Error("Invalid API key"):r.status===403?new Error("API key doesn't have permission for members endpoint"):r.status===429?new Error("Too many requests. Please wait a moment"):new Error(`API Error: ${r.status} - ${r.statusText}`);const g=await r.json();console.log(`Fetched ${((s=g.members)==null?void 0:s.length)||0} members with exact match`);const d=(g.members||[]).map(i=>({agentId:i.agentId||i.id,agentName:i.name||"Unknown",agentDetails:i})).filter(i=>i.agentId&&i.agentName.trim()!=="");d.sort((i,y)=>i.agentName.localeCompare(y.agentName)),console.log(`Displaying ${d.length} agents from exact search`,d.slice(0,5)),je(d),ce(d)}catch(t){const a=t instanceof Error?t.message:"Failed to load members";N(a)}finally{V(!1)}},at=async s=>{var t;if(c){ke(!0),ge(null),de([]);try{console.log(`Fetching agents for brokerage: ${s}`);const a=`https://api.repliers.io/members?brokerage=${encodeURIComponent(s)}`,r=await fetch(a,{headers:{"REPLIERS-API-KEY":c,"Content-Type":"application/json"}});if(!r.ok)throw r.status===401?new Error("Invalid API key"):r.status===403?new Error("API key doesn't have permission for members endpoint"):r.status===429?new Error("Too many requests. Please wait a moment"):new Error(`API Error: ${r.status} - ${r.statusText}`);const g=await r.json();console.log(`Fetched ${((t=g.members)==null?void 0:t.length)||0} agents for brokerage`);const d=(g.members||[]).map(i=>({agentId:i.agentId||i.id,agentName:i.name||"Unknown",agentDetails:i})).filter(i=>i.agentId&&i.agentName.trim()!=="");d.sort((i,y)=>i.agentName.localeCompare(y.agentName)),console.log(`Displaying ${d.length} agents for ${s}`),de(d)}catch(a){const r=a instanceof Error?a.message:"Failed to load brokerage agents";ge(r),console.error("Error loading brokerage agents:",a)}finally{ke(!1)}}},rt=async s=>{if(c){Ie(!0),Ee(null),Ae(null),Se(null);try{const[t,a]=await Promise.all([fetch(`https://api.repliers.io/listings?agentId=${encodeURIComponent(s)}&status=A&limit=1`,{headers:{"REPLIERS-API-KEY":c,"Content-Type":"application/json"}}),fetch(`https://api.repliers.io/listings?agentId=${encodeURIComponent(s)}&status=U&limit=1`,{headers:{"REPLIERS-API-KEY":c,"Content-Type":"application/json"}})]);if(!t.ok||!a.ok)throw new Error("Failed to fetch listings breakdown");const[r,g]=await Promise.all([t.json(),a.json()]);Ae(r.count||0),Se(g.count||0),console.log(`Agent ID "${s}" - Active: ${r.count}, Sold: ${g.count}`)}catch(t){const a=t instanceof Error?t.message:"Failed to load listings breakdown";Ee(a),console.error("Error loading listings:",t)}finally{Ie(!1)}}},nt=async s=>{var t,a,r,g,d,i,y,o,m,z,O,G;if(c){De(!0),Ue(null),Pe(null),Ce(null),Le(null),Me(null),Te(null),$e([]);try{const L=`https://api.repliers.io/listings?agentId=${encodeURIComponent(s)}&status=U&listings=false&statistics=med-soldPrice,min-soldPrice,max-soldPrice,avg-daysOnMarket,med-daysOnMarket`,te=`https://api.repliers.io/listings?agentId=${encodeURIComponent(s)}&status=A&listings=false&statistics=avg-listPrice,min-listPrice,max-listPrice`,Oe=`https://api.repliers.io/listings?agentId=${encodeURIComponent(s)}&status=A&status=U&limit=100&fields=address.city`;console.log("Statistics URLs:",{soldStatsUrl:L,activeStatsUrl:te,locationsUrl:Oe,hasApiKey:!!c});const[se,ae,re]=await Promise.all([fetch(L,{headers:{"REPLIERS-API-KEY":c,"Content-Type":"application/json"}}),fetch(te,{headers:{"REPLIERS-API-KEY":c,"Content-Type":"application/json"}}),fetch(Oe,{headers:{"REPLIERS-API-KEY":c,"Content-Type":"application/json"}})]);if(!se.ok){const x=await se.text();throw console.error("Sold stats error:",se.status,x),new Error(`Sold stats failed: ${x}`)}if(!ae.ok){const x=await ae.text();throw console.error("Active stats error:",ae.status,x),new Error(`Active stats failed: ${x}`)}if(!re.ok){const x=await re.text();throw console.error("Locations error:",re.status,x),new Error(`Locations failed: ${x}`)}const[lt,ct,dt]=await Promise.all([se.json(),ae.json(),re.json()]),b=lt.statistics||{},M=ct.statistics||{};console.log("Statistics data:",{soldStats:b,activeStats:M}),(t=b.soldPrice)!=null&&t.med&&Pe(b.soldPrice.med),(a=M.listPrice)!=null&&a.avg&&Ce(M.listPrice.avg),(r=b.daysOnMarket)!=null&&r.avg&&Le(b.daysOnMarket.avg),(g=b.daysOnMarket)!=null&&g.med&&Me(b.daysOnMarket.med);const ne=[(d=b.soldPrice)==null?void 0:d.min,(i=M.listPrice)==null?void 0:i.min].filter(Boolean),ie=[(y=b.soldPrice)==null?void 0:y.max,(o=M.listPrice)==null?void 0:o.max].filter(Boolean);ne.length>0&&ie.length>0&&Te({min:Math.min(...ne),max:Math.max(...ie)});const be=new Map;(dt.listings||[]).forEach(x=>{var qe;const S=(qe=x.address)==null?void 0:qe.city;S&&be.set(S,(be.get(S)||0)+1)});const Ge=Array.from(be.entries()).map(([x,S])=>({name:x,count:S})).sort((x,S)=>S.count-x.count).slice(0,5);$e(Ge),console.log(`Statistics for agent ID "${s}":`,{medianSalePrice:(m=b.soldPrice)==null?void 0:m.med,averageListPrice:(z=M.listPrice)==null?void 0:z.avg,averageDaysOnMarket:(O=b.daysOnMarket)==null?void 0:O.avg,medianDaysOnMarket:(G=b.daysOnMarket)==null?void 0:G.med,priceRange:ne.length>0&&ie.length>0?{min:Math.min(...ne),max:Math.max(...ie)}:null,topLocations:Ge})}catch(L){const te=L instanceof Error?L.message:"Failed to load performance metrics";Ue(te),console.error("Error loading metrics:",L)}finally{De(!1)}}},it=()=>{const s=[];P&&P>1e6&&s.push({name:"Luxury Specialist",color:"purple",icon:"💎"});const t=(p||0)+(f||0);t>=20&&s.push({name:"High Volume",color:"blue",icon:"📊"}),A&&A<30&&s.push({name:"Fast Seller",color:"green",icon:"⚡"}),C&&C>75e4&&s.push({name:"Premium Market",color:"orange",icon:"🏆"}),p&&f&&p>f&&s.push({name:"Active Inventory Focus",color:"teal",icon:"📈"}),k.length>0&&t>0&&k[0].count/t*100>60&&s.push({name:`${k[0].name} Specialist`,color:"indigo",icon:"📍"}),Re(s)};n.useEffect(()=>{u&&it()},[P,C,A,p,f,k]),n.useEffect(()=>{u?(rt(u),nt(u)):Re([])},[u,c]),n.useEffect(()=>{v?at(v):(de([]),ge(null))},[v,c]);const ot=s=>{Y(s),K(null)},ze=s=>{w===s?we(E==="asc"?"desc":"asc"):(st(s),we(s==="count"?"desc":"asc"))};return e.jsxs("div",{className:`w-full h-screen flex flex-col ${Xe}`,children:[e.jsxs("div",{className:"bg-white border-b border-gray-200 px-6 py-4",children:[e.jsx("h1",{className:"text-2xl font-bold text-gray-900",children:"Agent Performance Dashboard"}),e.jsx("p",{className:"text-sm text-gray-600 mt-1",children:"View all agents in your MLS with their listing counts and performance metrics"})]}),e.jsxs("div",{className:"flex-1 flex overflow-hidden",children:[e.jsxs("div",{className:"w-96 bg-white border-r border-gray-200 flex flex-col",children:[e.jsxs("div",{className:"flex border-b border-gray-200",children:[e.jsx("button",{onClick:()=>ve("agents"),className:`flex-1 px-4 py-3 text-sm font-medium transition-colors ${l==="agents"?"text-blue-600 border-b-2 border-blue-600 bg-blue-50":"text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`,children:"Agents"}),e.jsx("button",{onClick:()=>ve("brokerages"),className:`flex-1 px-4 py-3 text-sm font-medium transition-colors ${l==="brokerages"?"text-blue-600 border-b-2 border-blue-600 bg-blue-50":"text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`,children:"Brokerages"})]}),e.jsxs("div",{className:"flex-1 overflow-y-auto",children:[e.jsxs("div",{className:"p-4 border-b border-gray-200 bg-white",children:[e.jsxs("div",{className:"flex items-center justify-between mb-3",children:[e.jsx("h2",{className:"text-lg font-semibold text-gray-900",children:l==="agents"?"Agents":"Brokerages"}),!h&&(l==="agents"?$.length>0:W.length>0)&&e.jsx("span",{className:"text-sm text-gray-600 font-medium",children:l==="agents"?D.length:H.length})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"relative flex items-center bg-gray-50 rounded-lg border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all",children:[e.jsx(fe,{className:"text-gray-400 w-4 h-4 ml-3"}),e.jsx("input",{type:"text",value:X,onChange:s=>Ne(s.target.value),onKeyDown:s=>{s.key==="Enter"&&Fe()},placeholder:`Search ${l==="agents"?"agents":"brokerages"}...`,className:"flex-grow bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 px-3 py-2"}),X&&e.jsx("button",{onClick:()=>{Ne(""),ee()},className:"text-gray-400 hover:text-gray-600 px-2",children:"✕"})]}),e.jsx("button",{onClick:Fe,disabled:h,className:"w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors",children:h?"Searching...":"Search"}),l==="agents"&&e.jsxs("div",{className:"mt-4 pt-4 border-t border-gray-200",children:[e.jsxs("div",{className:"mb-3 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800",children:[e.jsx("strong",{children:"Exact Match Search:"})," Enter the exact agent name or ID from the database to find a precise match."]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("input",{type:"text",value:R,onChange:s=>et(s.target.value),onKeyDown:s=>{s.key==="Enter"&&pe()},placeholder:"Agent Name (exact match)",className:"w-full bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm text-gray-700 placeholder-gray-400 px-3 py-2 transition-all"}),e.jsx("input",{type:"text",value:F,onChange:s=>tt(s.target.value),onKeyDown:s=>{s.key==="Enter"&&pe()},placeholder:"Agent ID (exact match)",className:"w-full bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm text-gray-700 placeholder-gray-400 px-3 py-2 transition-all"}),e.jsx("button",{onClick:pe,disabled:h||!R.trim()&&!F.trim(),className:"w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors",children:h?"Searching...":"Search Exact"})]})]})]})]}),h&&e.jsxs("div",{className:"flex flex-col items-center justify-center py-12 px-4",children:[e.jsx(oe,{className:"w-10 h-10 animate-spin text-blue-500 mb-3"}),e.jsxs("p",{className:"text-sm text-gray-600",children:["Loading ",l,"..."]})]}),j&&!h&&e.jsx("div",{className:"m-4",children:e.jsxs("div",{className:"flex items-start gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3",children:[e.jsx(le,{className:"w-4 h-4 mt-0.5 flex-shrink-0"}),e.jsxs("div",{children:[e.jsxs("div",{className:"font-semibold text-sm",children:["Error loading ",l]}),e.jsx("div",{className:"text-xs mt-1",children:j})]})]})}),l==="agents"&&!h&&!j&&D.length>0&&e.jsx("div",{className:"divide-y divide-gray-100",children:D.map((s,t)=>e.jsx("button",{onClick:()=>ot(s.agentId),className:`w-full p-4 text-left transition-colors hover:bg-gray-50 ${u===s.agentId?"bg-blue-50 border-l-4 border-blue-500":"border-l-4 border-transparent"}`,children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx("div",{className:`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${u===s.agentId?"bg-blue-500":"bg-gray-100"}`,children:e.jsx(I,{className:`w-5 h-5 ${u===s.agentId?"text-white":"text-gray-600"}`})}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsx("div",{className:"font-medium text-gray-900 truncate",children:s.agentName}),e.jsx("div",{className:"flex items-center gap-1 mt-1",children:e.jsxs("span",{className:"text-xs text-gray-500 font-mono",children:["ID: ",s.agentId]})})]})]})},`${s.agentId}-${t}`))}),l==="brokerages"&&!h&&!j&&H.length>0&&e.jsx("div",{className:"divide-y divide-gray-100",children:H.map((s,t)=>{var a;return e.jsx("button",{onClick:()=>{K(s.brokerageName),Y(null)},className:`w-full p-4 text-left transition-colors hover:bg-gray-50 ${v===s.brokerageName?"bg-blue-50 border-l-4 border-blue-500":"border-l-4 border-transparent"}`,children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx("div",{className:`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${v===s.brokerageName?"bg-blue-500":"bg-gray-100"}`,children:e.jsx(q,{className:`w-5 h-5 ${v===s.brokerageName?"text-white":"text-gray-600"}`})}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsx("div",{className:"font-medium text-gray-900 truncate",children:s.brokerageName}),e.jsx("div",{className:"flex items-center gap-1 mt-1",children:e.jsxs("span",{className:"text-xs text-gray-500",children:[s.agentCount," agent",s.agentCount!==1?"s":""]})}),((a=s.address)==null?void 0:a.city)&&e.jsxs("div",{className:"text-xs text-gray-400 mt-0.5",children:[s.address.city,s.address.state&&`, ${s.address.state}`]})]})]})},`${s.brokerageName}-${t}`)})}),l==="agents"&&!h&&!j&&D.length===0&&$.length>0&&e.jsxs("div",{className:"text-center py-12 px-4",children:[e.jsx(fe,{className:"w-10 h-10 text-gray-400 mx-auto mb-3"}),e.jsx("h3",{className:"text-sm font-semibold text-gray-700 mb-1",children:"No agents found"}),e.jsx("p",{className:"text-xs text-gray-500",children:"Try adjusting your search"})]}),l==="brokerages"&&!h&&!j&&H.length===0&&W.length>0&&e.jsxs("div",{className:"text-center py-12 px-4",children:[e.jsx(fe,{className:"w-10 h-10 text-gray-400 mx-auto mb-3"}),e.jsx("h3",{className:"text-sm font-semibold text-gray-700 mb-1",children:"No brokerages found"}),e.jsx("p",{className:"text-xs text-gray-500",children:"Try adjusting your search"})]}),l==="agents"&&!h&&!j&&$.length===0&&e.jsxs("div",{className:"text-center py-12 px-4",children:[e.jsx("div",{className:"w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3",children:e.jsx(I,{className:"w-6 h-6 text-gray-400"})}),e.jsx("h3",{className:"text-sm font-semibold text-gray-700 mb-1",children:"No agents available"}),e.jsx("p",{className:"text-xs text-gray-500",children:"Search to find agents"})]}),l==="brokerages"&&!h&&!j&&W.length===0&&e.jsxs("div",{className:"text-center py-12 px-4",children:[e.jsx("div",{className:"w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3",children:e.jsx(q,{className:"w-6 h-6 text-gray-400"})}),e.jsx("h3",{className:"text-sm font-semibold text-gray-700 mb-1",children:"No brokerages available"}),e.jsx("p",{className:"text-xs text-gray-500",children:"Search to find brokerages"})]})]}),!h&&$.length>0&&e.jsx("div",{className:"p-3 border-t border-gray-200 bg-gray-50",children:e.jsxs("div",{className:"flex items-center gap-2 text-xs text-gray-600",children:[e.jsx("span",{children:"Sort by:"}),e.jsxs("button",{onClick:()=>ze("name"),className:`px-2 py-1 rounded hover:bg-gray-200 transition-colors ${w==="name"?"bg-gray-200 font-medium":""}`,children:["Name ",w==="name"&&(E==="asc"?"↑":"↓")]}),e.jsxs("button",{onClick:()=>ze("count"),className:`px-2 py-1 rounded hover:bg-gray-200 transition-colors ${w==="count"?"bg-gray-200 font-medium":""}`,children:["Count ",w==="count"&&(E==="asc"?"↑":"↓")]})]})})]}),e.jsxs("div",{className:"flex-1 bg-gray-50 overflow-y-auto",children:[!u&&!v&&e.jsx("div",{className:"flex items-center justify-center h-full",children:e.jsxs("div",{className:"text-center px-4",children:[e.jsx("div",{className:"w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4",children:l==="agents"?e.jsx(I,{className:"w-10 h-10 text-gray-400"}):e.jsx(q,{className:"w-10 h-10 text-gray-400"})}),e.jsx("h3",{className:"text-lg font-semibold text-gray-700 mb-2",children:l==="agents"?"No Agent Selected":"No Brokerage Selected"}),e.jsx("p",{className:"text-gray-500 max-w-sm",children:l==="agents"?"Select an agent from the list to view their performance dashboard and metrics":"Select a brokerage to view agents from that brokerage"})]})}),v&&!u&&(()=>{const s=W.find(t=>t.brokerageName===v);return e.jsxs("div",{className:"p-6",children:[e.jsx("div",{className:"bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6",children:e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{className:"flex items-start gap-4",children:[e.jsx("div",{className:"w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0",children:e.jsx(q,{className:"w-8 h-8 text-white"})}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-bold text-gray-900",children:v}),e.jsxs("div",{className:"flex items-center gap-2 mt-2",children:[e.jsx(I,{className:"w-4 h-4 text-gray-400"}),e.jsxs("span",{className:"text-sm text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:B?"...":U.length})," ","agents"]})]}),(s==null?void 0:s.address)&&e.jsxs("div",{className:"text-xs text-gray-500 mt-1",children:[s.address.address1&&`${s.address.address1}, `,s.address.city&&`${s.address.city}, `,s.address.state&&`${s.address.state} `,s.address.postal]})]})]}),e.jsx("button",{onClick:()=>K(null),className:"text-gray-400 hover:text-gray-600 transition-colors",children:e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]})}),e.jsxs("div",{className:"bg-white rounded-lg shadow-sm border border-gray-200 p-6",children:[e.jsxs("h3",{className:"text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2",children:[e.jsx(I,{className:"w-5 h-5 text-gray-600"}),"Agents in this Brokerage"]}),B&&e.jsx("div",{className:"flex items-center justify-center py-12",children:e.jsx(oe,{className:"w-8 h-8 animate-spin text-blue-500"})}),Q&&!B&&e.jsxs("div",{className:"flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-sm",children:[e.jsx(le,{className:"w-4 h-4"}),e.jsx("span",{children:Q})]}),!B&&!Q&&U.length>0&&e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-3",children:U.map(t=>e.jsxs("button",{onClick:()=>{Y(t.agentId),K(null)},className:"p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left",children:[e.jsx("div",{className:"font-medium text-gray-900",children:t.agentName}),e.jsxs("div",{className:"text-xs text-gray-500 mt-1",children:["ID: ",t.agentId]})]},t.agentId))}),!B&&!Q&&U.length===0&&e.jsx("p",{className:"text-sm text-gray-500 text-center py-6",children:"No agents found for this brokerage"})]})]})})(),u&&(()=>{const s=$.find(a=>a.agentId===u)||U.find(a=>a.agentId===u),t=s==null?void 0:s.agentDetails;return e.jsxs("div",{className:"p-6",children:[e.jsx("div",{className:"bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6",children:e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{className:"flex items-start gap-4",children:[e.jsx("div",{className:"w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0",children:e.jsx(I,{className:"w-8 h-8 text-white"})}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-bold text-gray-900",children:(s==null?void 0:s.agentName)||"Unknown Agent"}),e.jsxs("div",{className:"flex items-center gap-2 mt-2",children:[e.jsx(ye,{className:"w-4 h-4 text-gray-400"}),e.jsxs("span",{className:"text-sm text-gray-600",children:[e.jsx("span",{className:"font-semibold",children:(p||0)+(f||0)})," ","total listings"]})]}),(s==null?void 0:s.agentId)&&e.jsxs("div",{className:"text-xs text-gray-500 mt-1",children:["ID: ",s.agentId]})]})]}),e.jsx("button",{onClick:()=>Y(null),className:"text-gray-400 hover:text-gray-600 transition-colors",children:e.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]})}),Be.length>0&&e.jsxs("div",{className:"bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-sm border border-blue-200 p-6 mb-6",children:[e.jsxs("h3",{className:"text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2",children:[e.jsx("svg",{className:"w-5 h-5 text-gray-600",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"})}),"Agent Specializations"]}),e.jsx("div",{className:"flex flex-wrap gap-2",children:Be.map((a,r)=>e.jsxs("div",{className:`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm shadow-sm transition-transform hover:scale-105 ${a.color==="purple"?"bg-purple-100 text-purple-800 border border-purple-300":a.color==="blue"?"bg-blue-100 text-blue-800 border border-blue-300":a.color==="green"?"bg-green-100 text-green-800 border border-green-300":a.color==="orange"?"bg-orange-100 text-orange-800 border border-orange-300":a.color==="teal"?"bg-teal-100 text-teal-800 border border-teal-300":a.color==="indigo"?"bg-indigo-100 text-indigo-800 border border-indigo-300":"bg-gray-100 text-gray-800 border border-gray-300"}`,children:[e.jsx("span",{className:"text-lg",children:a.icon}),e.jsx("span",{children:a.name})]},r))}),e.jsx("div",{className:"mt-4 text-xs text-gray-600 italic",children:"💡 Auto-generated based on listing data and performance metrics"})]}),e.jsxs("div",{className:"bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6",children:[e.jsxs("h3",{className:"text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2",children:[e.jsx(I,{className:"w-5 h-5 text-gray-600"}),"Agent Profile"]}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-semibold text-gray-700 mb-2",children:"Contact Information"}),e.jsxs("div",{className:"space-y-2",children:[(t==null?void 0:t.email)&&e.jsxs("div",{className:"flex items-center gap-2 text-sm",children:[e.jsx(ft,{className:"w-4 h-4 text-gray-400"}),e.jsx("a",{href:`mailto:${t.email}`,className:"text-blue-600 hover:underline",children:t.email})]}),(t==null?void 0:t.phones)&&t.phones.length>0&&e.jsxs("div",{className:"flex items-start gap-2 text-sm",children:[e.jsx(vt,{className:"w-4 h-4 text-gray-400 mt-0.5"}),e.jsx("div",{className:"flex flex-col gap-1",children:t.phones.map((a,r)=>e.jsx("a",{href:`tel:${a}`,className:"text-blue-600 hover:underline",children:a.replace(/(\d{3})(\d{3})(\d{4})/,"($1) $2-$3")},r))})]}),(t==null?void 0:t.website)&&e.jsxs("div",{className:"flex items-center gap-2 text-sm",children:[e.jsx(pt,{className:"w-4 h-4 text-gray-400"}),e.jsx("a",{href:t.website,target:"_blank",rel:"noopener noreferrer",className:"text-blue-600 hover:underline",children:t.website})]}),!(t!=null&&t.email)&&(!(t!=null&&t.phones)||t.phones.length===0)&&!(t!=null&&t.website)&&e.jsx("p",{className:"text-sm text-gray-500 italic",children:"No contact information available"})]})]}),(t==null?void 0:t.brokerage)&&e.jsxs("div",{className:"pt-4 border-t border-gray-200",children:[e.jsx("h4",{className:"text-sm font-semibold text-gray-700 mb-2",children:"Brokerage"}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"flex items-start gap-2 text-sm",children:[e.jsx(q,{className:"w-4 h-4 text-gray-400 mt-0.5"}),e.jsxs("div",{children:[e.jsx("div",{className:"font-medium text-gray-900",children:t.brokerage.name}),t.brokerage.address&&e.jsxs("div",{className:"text-gray-600 mt-1",children:[t.brokerage.address.address1&&e.jsx("div",{children:t.brokerage.address.address1}),t.brokerage.address.address2&&e.jsx("div",{children:t.brokerage.address.address2}),(t.brokerage.address.city||t.brokerage.address.state||t.brokerage.address.postal)&&e.jsxs("div",{children:[t.brokerage.address.city,t.brokerage.address.city&&t.brokerage.address.state&&", ",t.brokerage.address.state," ",t.brokerage.address.postal]})]})]})]}),t.officeId&&e.jsxs("div",{className:"flex items-center gap-2 text-xs text-gray-500",children:[e.jsx(ht,{className:"w-3 h-3"}),"Office ID: ",t.officeId]})]})]}),((t==null?void 0:t.position)||(t==null?void 0:t.updatedOn))&&e.jsxs("div",{className:"pt-4 border-t border-gray-200",children:[e.jsx("h4",{className:"text-sm font-semibold text-gray-700 mb-2",children:"Additional Details"}),e.jsxs("div",{className:"space-y-1 text-sm text-gray-600",children:[t.position&&e.jsxs("div",{children:["Position: ",e.jsx("span",{className:"font-medium",children:t.position})]}),t.updatedOn&&e.jsxs("div",{className:"text-xs text-gray-500",children:["Last updated: ",new Date(t.updatedOn).toLocaleDateString()]})]})]})]})]}),e.jsxs("div",{className:"bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6",children:[e.jsxs("h3",{className:"text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2",children:[e.jsx(ye,{className:"w-5 h-5 text-gray-600"}),"Listings Breakdown"]}),me&&e.jsx("div",{className:"flex items-center justify-center py-8",children:e.jsx(oe,{className:"w-8 h-8 animate-spin text-blue-500"})}),he&&!me&&e.jsxs("div",{className:"flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-sm",children:[e.jsx(le,{className:"w-4 h-4"}),e.jsx("span",{children:he})]}),!me&&!he&&(p!==null||f!==null)&&e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs("div",{className:"bg-green-50 border border-green-200 rounded-lg p-4",children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsx("span",{className:"text-sm font-medium text-green-700",children:"Active"}),e.jsx("div",{className:"w-8 h-8 bg-green-500 rounded-full flex items-center justify-center",children:e.jsx("svg",{className:"w-4 h-4 text-white",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M5 13l4 4L19 7"})})})]}),e.jsx("div",{className:"text-3xl font-bold text-green-900",children:p??"-"}),e.jsx("div",{className:"text-xs text-green-600 mt-1",children:"Currently on market"})]}),e.jsxs("div",{className:"bg-blue-50 border border-blue-200 rounded-lg p-4",children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsx("span",{className:"text-sm font-medium text-blue-700",children:"Sold"}),e.jsx("div",{className:"w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center",children:e.jsx("svg",{className:"w-4 h-4 text-white",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"})})})]}),e.jsx("div",{className:"text-3xl font-bold text-blue-900",children:f??"-"}),e.jsx("div",{className:"text-xs text-blue-600 mt-1",children:"Successfully closed"})]}),e.jsxs("div",{className:"col-span-2 mt-2 pt-4 border-t border-gray-200",children:[e.jsxs("div",{className:"flex items-center justify-between text-sm",children:[e.jsx("span",{className:"text-gray-600",children:"Total Listings"}),e.jsx("span",{className:"font-bold text-gray-900 text-lg",children:(p??0)+(f??0)})]}),p!==null&&f!==null&&e.jsxs("div",{className:"mt-2",children:[e.jsxs("div",{className:"flex items-center justify-between text-xs text-gray-500 mb-1",children:[e.jsx("span",{children:"Active Rate"}),e.jsxs("span",{className:"font-medium",children:[(p/(p+f||1)*100).toFixed(1),"%"]})]}),e.jsx("div",{className:"w-full bg-gray-200 rounded-full h-2 overflow-hidden",children:e.jsx("div",{className:"bg-green-500 h-full transition-all",style:{width:`${p/(p+f||1)*100}%`}})})]})]})]})]}),e.jsxs("div",{className:"bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6",children:[e.jsxs("h3",{className:"text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2",children:[e.jsx(ye,{className:"w-5 h-5 text-gray-600"}),"Performance Metrics"]}),xe&&e.jsx("div",{className:"flex items-center justify-center py-8",children:e.jsx(oe,{className:"w-8 h-8 animate-spin text-blue-500"})}),ue&&!xe&&e.jsxs("div",{className:"flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-sm",children:[e.jsx(le,{className:"w-4 h-4"}),e.jsx("span",{children:ue})]}),!xe&&!ue&&e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs("div",{className:"bg-purple-50 border border-purple-200 rounded-lg p-4",children:[e.jsx("div",{className:"text-sm font-medium text-purple-700 mb-1",children:"Median Sale Price"}),e.jsx("div",{className:"text-2xl font-bold text-purple-900",children:P?`$${P.toLocaleString(void 0,{maximumFractionDigits:0})}`:"N/A"}),e.jsx("div",{className:"text-xs text-purple-600 mt-1",children:"From sold listings"})]}),e.jsxs("div",{className:"bg-orange-50 border border-orange-200 rounded-lg p-4",children:[e.jsx("div",{className:"text-sm font-medium text-orange-700 mb-1",children:"Avg List Price"}),e.jsx("div",{className:"text-2xl font-bold text-orange-900",children:C?`$${C.toLocaleString(void 0,{maximumFractionDigits:0})}`:"N/A"}),e.jsx("div",{className:"text-xs text-orange-600 mt-1",children:"From active listings"})]})]}),(A!==null||J!==null)&&e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[A!==null&&e.jsxs("div",{className:"bg-teal-50 border border-teal-200 rounded-lg p-4",children:[e.jsx("div",{className:"text-sm font-medium text-teal-700 mb-1",children:"Avg Days on Market"}),e.jsx("div",{className:"text-2xl font-bold text-teal-900",children:Math.round(A)}),e.jsx("div",{className:"text-xs text-teal-600 mt-1",children:"From sold listings"})]}),J!==null&&e.jsxs("div",{className:"bg-cyan-50 border border-cyan-200 rounded-lg p-4",children:[e.jsx("div",{className:"text-sm font-medium text-cyan-700 mb-1",children:"Median Days on Market"}),e.jsx("div",{className:"text-2xl font-bold text-cyan-900",children:Math.round(J)}),e.jsx("div",{className:"text-xs text-cyan-600 mt-1",children:"From sold listings"})]})]}),Z&&e.jsxs("div",{className:"bg-gray-50 border border-gray-200 rounded-lg p-4",children:[e.jsx("div",{className:"text-sm font-medium text-gray-700 mb-2",children:"Price Range"}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("div",{className:"text-xs text-gray-500",children:"Minimum"}),e.jsxs("div",{className:"text-lg font-bold text-gray-900",children:["$",Z.min.toLocaleString()]})]}),e.jsx("div",{className:"flex-1 mx-4",children:e.jsx("div",{className:"h-2 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full"})}),e.jsxs("div",{className:"text-right",children:[e.jsx("div",{className:"text-xs text-gray-500",children:"Maximum"}),e.jsxs("div",{className:"text-lg font-bold text-gray-900",children:["$",Z.max.toLocaleString()]})]})]})]}),k.length>0&&e.jsxs("div",{className:"pt-4 border-t border-gray-200",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[e.jsx(gt,{className:"w-4 h-4 text-gray-600"}),e.jsx("h4",{className:"text-sm font-semibold text-gray-700",children:"Top Locations"})]}),e.jsx("div",{className:"space-y-2",children:k.map((a,r)=>e.jsxs("div",{className:"flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold",children:r+1}),e.jsx("span",{className:"text-sm font-medium text-gray-900",children:a.name})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs("div",{className:"text-xs text-gray-500",children:[a.count," listing",a.count!==1?"s":""]}),e.jsx("div",{className:"w-20 bg-gray-200 rounded-full h-2 overflow-hidden",children:e.jsx("div",{className:"bg-blue-500 h-full transition-all",style:{width:`${a.count/k[0].count*100}%`}})})]})]},a.name))})]}),!P&&!C&&!A&&!J&&!Z&&k.length===0&&e.jsx("div",{className:"text-center py-6 text-gray-500 text-sm",children:"Not enough listing data to calculate metrics"})]})]})]})})()]})]})]})}Ke.__docgenInfo={description:`Agent Performance Dashboard Component

@description A comprehensive dashboard for viewing agent performance metrics,
specializations, and auto-generated categorizations based on their listing data.

Features:
- Agent search with autocomplete
- Agent profile display
- Performance metrics calculation
- Auto-categorization (Luxury, Volume, Property Type specialists)
- Listings breakdown and visualization

@param props - The component props
@returns JSX.Element`,methods:[],displayName:"AgentDashboard",props:{apiKey:{required:!0,tsType:{name:"string"},description:"Repliers API key - required"},className:{required:!1,tsType:{name:"string"},description:"Optional className for custom styling",defaultValue:{value:'""',computed:!1}}}};const Qe="pxI19UMy9zfw9vz5lRxoGpjJWXrMnm",Pt={title:"POCS/Agents/Agent Performance Dashboard",component:Ke,parameters:{layout:"fullscreen",docs:{description:{component:`
## 🎯 Agent Performance Dashboard

A comprehensive dashboard for viewing real estate agent performance metrics, specializations,
and auto-generated categorizations based on their listing data.

This component was built as a proof-of-concept for TrustedOnly to help them:
- Sync agent rosters and pre-provision user accounts
- Categorize agents based on their specialties (luxury, property types, performance)
- Connect vendors with the right agents based on data-driven categories
- Provide a single homogenized view of agent data across multiple MLSs

## 🚀 Features

### ✅ Complete POC - All Features Implemented
- **Two-Tab Interface**: Switch between Agents and Brokerages views
- **Agent Directory**: Browse agents with search functionality (loads first 100 by default)
- **Brokerage Directory**: View all brokerages with agent counts and addresses
- **Flexible Agent Search**: Main search uses keyword parameter for fuzzy matching
- **Exact Match Search**: Separate inputs for precise agent name and agent ID matching
- **Brokerage Search**: Uses brokerage parameter for precise filtering
- **Search Button**: Explicit search control with Enter key support (no auto-debounce)
- **Scrollable Search**: Search fields scroll with results for maximum viewing space
- **Dynamic Brokerage Loading**: Click a brokerage to load ALL its agents via fresh API call
- **Agent Selection**: Select an agent to view their detailed dashboard
- **Agent Profile Card**: Complete contact info, brokerage details, and position
- **Listings Breakdown**: Active vs sold listings count with real-time data
- **Performance Metrics**: Median sale price, average list price, days on market, price range
- **Top Locations**: Geographic analysis showing top 5 cities by listing count
- **Auto-Categorization**: Intelligent agent specialization tags:
  - 💎 Luxury Specialist (median sale > $1M)
  - 📊 High Volume (20+ listings)
  - ⚡ Fast Seller (avg days on market < 30)
  - 🏆 Premium Market (avg list price > $750K)
  - 📈 Active Inventory Focus (more active than sold)
  - 📍 Geographic Specialist (>60% in one location)

## 📖 How to Use

1. **Agents Tab**:
   - On mount, loads first 100 agents from the MLS
   - **Main Search**: Use keyword search for flexible agent matching (searches across names)
   - **Exact Match Search**: Use the dedicated fields below for precise searches:
     - Agent Name field requires exact database name
     - Agent ID field requires exact database ID
   - Click "Search" button or press Enter to execute search
   - Click an agent to view their detailed performance dashboard
2. **Brokerages Tab**:
   - View all brokerages extracted from member data
   - See agent count and address for each brokerage
   - Search for specific brokerages using precise brokerage filtering
   - Click a brokerage to dynamically load ALL agents from that brokerage
   - Then click any agent to view their dashboard
3. **Test Different Keys**: Use the Controls panel to test with different API keys

## 🔑 API Key

The component requires a valid Repliers API key. You can:
- Use the default sample key (for demo data)
- Enter your own key via the Controls panel in Storybook
- Pass it as a prop when using the component

## 🛠️ Technical Details

**API Approach:**

The component uses the \`/members\` endpoint with different parameters for different search types:

1. **Initial Load (Agents Tab)**: Fetches first 100 members using \`GET /members\`
2. **Search Parameters**:
   - Main search (Agents tab): Uses \`keyword\` parameter for flexible matching
   - Exact search (Agents tab): Uses \`agentName\` and/or \`agentId\` parameters for precise matching
   - Brokerages tab: Uses \`brokerage\` parameter for brokerage-specific filtering
3. **Brokerage Loading**: When a brokerage is selected, uses \`brokerage\` parameter to fetch ALL agents from that brokerage
4. **Agent Identification**: Uses \`agentId\` (not name) as the primary identifier for all subsequent API calls

**API Endpoints Used:**
- \`GET /members\` - Load first 100 agents on mount (Agents tab)
- \`GET /members?keyword={search}\` - Main agent search with flexible matching (Agents tab)
- \`GET /members?agentName={name}\` - Exact agent name search (Agents tab exact search section)
- \`GET /members?agentId={id}\` - Exact agent ID search (Agents tab exact search section)
- \`GET /members?brokerage={name}\` - Search by brokerage (Brokerages tab and brokerage agent loading)
- \`GET /listings?agentId={id}&status=A&limit=1\` - Get active listings count for selected agent
- \`GET /listings?agentId={id}&status=U&limit=1\` - Get sold listings count for selected agent
- \`GET /listings?agentId={id}&status=U&listings=false&statistics=...\` - Get sold listing statistics
- \`GET /listings?agentId={id}&status=A&listings=false&statistics=...\` - Get active listing statistics
- \`GET /listings?agentId={id}&status=A&status=U&limit=100&fields=address.city\` - Get location data

**Key Implementation Details:**
- **Dual search modes**: Main search uses \`keyword\` for flexible matching, separate exact search section uses \`agentName\`/\`agentId\` for precise matching
- **Tab-aware searching**: Uses \`keyword\` on Agents tab main search, \`brokerage\` on Brokerages tab
- **Exact match section**: Dedicated UI section on Agents tab with warning message about exact matching requirements
- **Scrollable UI**: Search fields and results in same scrollable container for maximum viewing space
- **agentId filtering**: All listing API calls use \`agentId\` parameter for precise filtering
- **Brokerage extraction**: Brokerages are built from member data (brokerage.name, officeId, address)
- **Dynamic loading**: Selecting a brokerage triggers a fresh API call with \`brokerage\` parameter
- **Search UX**: Explicit search button (no debounce) with Enter key support for better user control

**Props:**
- \`apiKey\` (required): Your Repliers API key
- \`className\` (optional): Additional CSS classes

## 🧪 POC Status

- ✅ **Step 1**: Agent directory with listing counts - **COMPLETE**
- ✅ **Step 2**: Agent profile display - **COMPLETE**
- ✅ **Step 3**: Listings breakdown (active/sold) - **COMPLETE**
- ✅ **Step 4**: Performance metrics - **COMPLETE**
- ✅ **Step 5**: Auto-categorization - **COMPLETE**

**🎉 Full POC is ready for testing and demonstration!**
        `}}},argTypes:{apiKey:{control:"text",description:"Your Repliers API key (required)",table:{type:{summary:"string"},defaultValue:{summary:Qe}}},className:{control:"text",description:"Additional CSS classes for custom styling",table:{type:{summary:"string"}}}},tags:["autodocs"]},_={args:{apiKey:Qe},parameters:{docs:{description:{story:`
🎯 **Full POC - Ready for Testing & Demonstration!**

**All features are complete and fully functional.** This dashboard demonstrates the complete agent performance analytics system with efficient member-based discovery.

**What to test:**
1. **Agents Tab**:
   - Automatically loads first 100 agents on mount
   - **Main Search**: Use keyword parameter for flexible, fuzzy matching across agent names
   - **Exact Search**: Use dedicated section below for precise matching:
     - Enter exact agent name (must match database exactly)
     - Enter exact agent ID (must match database exactly)
   - Click Search or press Enter to execute
   - Click any agent card to view their complete profile
2. **Brokerages Tab**:
   - View all brokerages extracted from member data
   - Search by brokerage name (precise brokerage parameter filtering)
   - See agent count and address for each brokerage
   - Click a brokerage to dynamically load ALL its agents
   - Click any agent from the brokerage list to view their dashboard
3. **Agent Dashboard** (after selection):
   - Auto-generated specialization badges based on performance
   - Contact details, brokerage info, and position
   - Active vs sold listings breakdown with real-time data
   - Performance metrics: prices, days on market, price range
   - Top 5 locations by listing count
4. **Search Functionality**:
   - Explicit search button (no auto-debounce)
   - Enter key support for quick searches
   - Clear button to reset search

**Auto-Categorization in Action:**
The system intelligently categorizes agents by analyzing their metrics:
- High-performing luxury agents get 💎 Luxury Specialist tag
- Agents with 20+ listings get 📊 High Volume tag
- Quick sellers (< 30 days avg) get ⚡ Fast Seller tag
- Premium market focus (> $750K avg) gets 🏆 Premium Market tag
- More active than sold gets 📈 Active Inventory Focus tag
- Geographic concentration (>60% in one city) gets 📍 City Specialist tag

**API Implementation:**
The component uses the /members endpoint with dual search modes:
- Initial load: \`GET /members\` (first 100 members)
- Main search (Agents tab): Uses \`keyword\` parameter for flexible, fuzzy matching
- Exact search (Agents tab): Uses \`agentName\` and/or \`agentId\` parameters for precise matching
- Brokerage search: Uses \`brokerage\` parameter on Brokerages tab
- Brokerage agents: Uses \`brokerage\` parameter to get ALL agents from a specific brokerage
- Agent filtering: Uses \`agentId\` parameter (not name) for precise listing queries
- Parallel calls: Simultaneously fetches active count, sold count, and statistics on agent selection

Use the Controls panel to test with different API keys!
        `}}}};var _e,Ve,Ye,We,He;_.parameters={..._.parameters,docs:{...(_e=_.parameters)==null?void 0:_e.docs,source:{originalSource:`{
  args: {
    apiKey: SAMPLE_API_KEY
  },
  parameters: {
    docs: {
      description: {
        story: \`
🎯 **Full POC - Ready for Testing & Demonstration!**

**All features are complete and fully functional.** This dashboard demonstrates the complete agent performance analytics system with efficient member-based discovery.

**What to test:**
1. **Agents Tab**:
   - Automatically loads first 100 agents on mount
   - **Main Search**: Use keyword parameter for flexible, fuzzy matching across agent names
   - **Exact Search**: Use dedicated section below for precise matching:
     - Enter exact agent name (must match database exactly)
     - Enter exact agent ID (must match database exactly)
   - Click Search or press Enter to execute
   - Click any agent card to view their complete profile
2. **Brokerages Tab**:
   - View all brokerages extracted from member data
   - Search by brokerage name (precise brokerage parameter filtering)
   - See agent count and address for each brokerage
   - Click a brokerage to dynamically load ALL its agents
   - Click any agent from the brokerage list to view their dashboard
3. **Agent Dashboard** (after selection):
   - Auto-generated specialization badges based on performance
   - Contact details, brokerage info, and position
   - Active vs sold listings breakdown with real-time data
   - Performance metrics: prices, days on market, price range
   - Top 5 locations by listing count
4. **Search Functionality**:
   - Explicit search button (no auto-debounce)
   - Enter key support for quick searches
   - Clear button to reset search

**Auto-Categorization in Action:**
The system intelligently categorizes agents by analyzing their metrics:
- High-performing luxury agents get 💎 Luxury Specialist tag
- Agents with 20+ listings get 📊 High Volume tag
- Quick sellers (< 30 days avg) get ⚡ Fast Seller tag
- Premium market focus (> $750K avg) gets 🏆 Premium Market tag
- More active than sold gets 📈 Active Inventory Focus tag
- Geographic concentration (>60% in one city) gets 📍 City Specialist tag

**API Implementation:**
The component uses the /members endpoint with dual search modes:
- Initial load: \\\`GET /members\\\` (first 100 members)
- Main search (Agents tab): Uses \\\`keyword\\\` parameter for flexible, fuzzy matching
- Exact search (Agents tab): Uses \\\`agentName\\\` and/or \\\`agentId\\\` parameters for precise matching
- Brokerage search: Uses \\\`brokerage\\\` parameter on Brokerages tab
- Brokerage agents: Uses \\\`brokerage\\\` parameter to get ALL agents from a specific brokerage
- Agent filtering: Uses \\\`agentId\\\` parameter (not name) for precise listing queries
- Parallel calls: Simultaneously fetches active count, sold count, and statistics on agent selection

Use the Controls panel to test with different API keys!
        \`
      }
    }
  }
}`,...(Ye=(Ve=_.parameters)==null?void 0:Ve.docs)==null?void 0:Ye.source},description:{story:`**Complete Agent Performance Dashboard POC**

This is the full interactive demo showing all implemented features.
The component uses the /members endpoint to provide efficient agent and brokerage discovery.

**What's Implemented:**
- Two-tab interface (Agents and Brokerages)
- Agent directory (loads first 100 members on mount)
- Brokerage directory (extracted from member data with counts and addresses)
- Smart search with intelligent parameter selection (agentId, agentName, brokerage)
- Agent ID auto-detection for exact matching
- Tab-aware search (agentName on Agents tab, brokerage on Brokerages tab)
- Dynamic brokerage agent loading (click brokerage to load ALL its agents)
- Agent selection with detailed view
- Complete agent profile (contact info, brokerage, position)
- Listings breakdown (active vs sold counts)
- Performance metrics (prices, days on market, top locations)
- Auto-categorization with intelligent specialization tags
- Error handling for invalid API keys

**Try these interactions:**
1. **Agents Tab**:
   - Watch the first 100 agents load automatically
   - Use main search for flexible keyword matching (searches across agent names)
   - Use the exact search section below for precise matching:
     - Enter exact agent name from database
     - Enter exact agent ID from database
   - Click "Search" or press Enter to execute
   - Click an agent card to view their dashboard
2. **Brokerages Tab**:
   - View all brokerages with agent counts
   - Search by brokerage name (uses brokerage parameter)
   - Click a brokerage to dynamically load ALL its agents
   - Click any agent from the brokerage to view their dashboard
3. **Agent Dashboard**:
   - Auto-generated specialization badges
   - Contact information and brokerage details
   - Active vs sold listings breakdown
   - Performance metrics and statistics
   - Top locations where they list properties

**Auto-Categorization Logic:**
The dashboard automatically assigns specialization tags based on:
- 💎 Luxury: Median sale price > $1M
- 📊 High Volume: 20+ total listings
- ⚡ Fast Seller: Average days on market < 30
- 🏆 Premium Market: Average list price > $750K
- 📈 Active Inventory: More active than sold listings
- 📍 Geographic Specialist: >60% listings in one city`,...(He=(We=_.parameters)==null?void 0:We.docs)==null?void 0:He.description}}};const Ct=["FullPOC"];export{_ as FullPOC,Ct as __namedExportsOrder,Pt as default};
