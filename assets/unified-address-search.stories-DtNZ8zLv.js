import{j as e}from"./jsx-runtime-CBjAUaf4.js";import{r as l}from"./index-CoAThXCU.js";import"./jsx-runtime-B2VJbz7C.js";const D="AIzaSyAkALV-9G0hTknIRh-EODtSxA9XYFG3buo";function C({onPlaceSelect:g,placeholder:y="Enter an address...",className:E,disabled:x=!1,displayAddressComponents:_=!1}){const c=l.useRef(null),b=l.useRef(null),[I,T]=l.useState(!1),[h,S]=l.useState(!1),[r,G]=l.useState(null);return l.useEffect(()=>((async()=>{var t,n;if((n=(t=window.google)==null?void 0:t.maps)!=null&&n.places){S(!0);return}try{const s=document.createElement("script");s.src=`https://maps.googleapis.com/maps/api/js?key=${D}&libraries=places&loading=async&v=weekly`,s.async=!0,s.defer=!0;const m=new Promise((u,o)=>{s.onload=()=>{setTimeout(()=>u(),100)},s.onerror=()=>{o(new Error("Failed to load Google Maps API"))}});document.head.appendChild(s),await m,S(!0)}catch(s){console.error("Error loading Google Maps API:",s)}})(),()=>{const t=document.querySelector('script[src*="maps.googleapis.com"]');t&&document.head.removeChild(t)}),[]),l.useEffect(()=>{if(!(!h||!c.current||b.current))try{const a=document.createElement("input");a.type="text",a.placeholder=y,a.className="w-full px-3 py-2 border rounded-md",a.disabled=x;const t=new window.google.maps.places.Autocomplete(a,{types:["address"],fields:["address_components","formatted_address","place_id","geometry"]});return c.current&&(c.current.innerHTML="",c.current.appendChild(a),b.current=t),t.addListener("place_changed",()=>{const n=t.getPlace();if(!n.address_components)return;const s={city:"",streetNumber:"",streetName:"",streetSuffix:"",state:"",postalCode:"",country:""};n.address_components.forEach(u=>{const o=u.types,d=u.long_name;if(o.includes("street_number"))s.streetNumber=d;else if(o.includes("route")){const i=d.split(" ");if(i.length>1){const k=i[i.length-1].toLowerCase();["street","st","avenue","ave","road","rd","boulevard","blvd","lane","ln","drive","dr","court","ct","circle","cir","way","place","pl","terrace","ter","trail","trl","parkway","pkwy"].includes(k)?(s.streetSuffix=i.pop()||"",s.streetName=i.join(" ")):s.streetName=d}else s.streetName=d}else o.includes("locality")?s.city=d:o.includes("administrative_area_level_1")?s.state=d:o.includes("postal_code")?s.postalCode=d:o.includes("country")&&(s.country=d)});const m={address:s,formattedAddress:n.formatted_address||"",placeId:n.place_id||"",geometry:n.geometry?{lat:n.geometry.location.lat(),lng:n.geometry.location.lng()}:void 0};G(m),g(m)}),()=>{t&&window.google.maps.event.clearInstanceListeners(t)}}catch(a){console.error("Error initializing autocomplete:",a)}},[h,g,y,x]),e.jsx("div",{className:E,children:e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{htmlFor:"address-search",className:"text-sm font-medium",children:"Search Address"}),e.jsxs("div",{className:"min-w-[400px] w-auto",children:[e.jsx("div",{ref:c,children:!h&&e.jsx("div",{className:"text-muted-foreground",children:"Loading..."})}),I&&e.jsx("div",{className:"absolute right-3 top-1/2 transform -translate-y-1/2",children:e.jsx("div",{className:"animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"})})]})]}),_&&r&&e.jsxs("div",{className:"mt-4 p-4 border rounded-lg bg-gray-50",children:[e.jsx("h3",{className:"text-sm font-medium mb-2",children:"Address Components"}),e.jsxs("dl",{className:"grid grid-cols-2 gap-2 text-sm",children:[e.jsx("dt",{className:"font-medium text-gray-600",children:"Street Number:"}),e.jsx("dd",{children:r.address.streetNumber}),e.jsx("dt",{className:"font-medium text-gray-600",children:"Street Name:"}),e.jsx("dd",{children:r.address.streetName}),e.jsx("dt",{className:"font-medium text-gray-600",children:"Street Suffix:"}),e.jsx("dd",{children:r.address.streetSuffix}),e.jsx("dt",{className:"font-medium text-gray-600",children:"City:"}),e.jsx("dd",{children:r.address.city}),e.jsx("dt",{className:"font-medium text-gray-600",children:"State:"}),e.jsx("dd",{children:r.address.state}),e.jsx("dt",{className:"font-medium text-gray-600",children:"Postal Code:"}),e.jsx("dd",{children:r.address.postalCode}),e.jsx("dt",{className:"font-medium text-gray-600",children:"Country:"}),e.jsx("dd",{children:r.address.country}),e.jsx("dt",{className:"font-medium text-gray-600",children:"Formatted Address:"}),e.jsx("dd",{className:"col-span-2",children:r.formattedAddress})]})]})]})})}C.__docgenInfo={description:`UnifiedAddressSearch Component

@description Address autocomplete component using Google Places API
@param props - The component props
@returns JSX.Element`,methods:[],displayName:"UnifiedAddressSearch",props:{onPlaceSelect:{required:!0,tsType:{name:"signature",type:"function",raw:"(place: PlaceDetails) => void",signature:{arguments:[{type:{name:"PlaceDetails"},name:"place"}],return:{name:"void"}}},description:""},placeholder:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"Enter an address..."',computed:!1}},className:{required:!1,tsType:{name:"string"},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},displayAddressComponents:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const R={title:"Components/Useful Components/Unified Address Search",component:C,parameters:{layout:"centered",docs:{description:{component:`## 👤 User Story

As a user, I want to search for and select addresses with proper validation and formatting.

This component helps users:
- Search for addresses using Google Places Autocomplete
- Get properly formatted address components (street number, name, suffix, city, state, etc.)
- View a breakdown of the selected address components

## 🚀 Quick Start

1. Ensure you have a valid Google Places API key

2. Import and use the component:
\`\`\`tsx
import { UnifiedAddressSearch } from "./components/unified-address-search";

function App() {
  const handlePlaceSelect = (place) => {
    console.log('Selected address:', place);
    // place.address contains:
    // - streetNumber
    // - streetName
    // - streetSuffix
    // - city
    // - state
    // - postalCode
    // - country
  };

  return (
    <div className="container mx-auto p-4">
      <UnifiedAddressSearch
        onPlaceSelect={handlePlaceSelect}
        displayAddressComponents={true}
      />
    </div>
  );
}
\`\`\`

## 💡 Key Features

1. **Google Places Integration** - Uses Google Places Autocomplete API for accurate address suggestions
2. **Address Component Parsing** - Automatically splits addresses into their components (street number, name, suffix, etc.)
3. **Visual Feedback** - Optional display of parsed address components below the search input
4. **TypeScript Support** - Fully typed component with proper interfaces for address data

## 🔧 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| onPlaceSelect | (place: PlaceDetails) => void | required | Callback function when an address is selected |
| placeholder | string | "Enter an address..." | Placeholder text for the search input |
| className | string | undefined | Additional CSS classes to apply to the component |
| disabled | boolean | false | Whether the search input is disabled |
| displayAddressComponents | boolean | false | Whether to show the address components breakdown below the input |

## 📦 PlaceDetails Interface

\`\`\`typescript
interface PlaceDetails {
  address: {
    streetNumber: string;
    streetName: string;
    streetSuffix: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  formattedAddress: string;
  placeId: string;
  geometry?: {
    lat: number;
    lng: number;
  };
}
\`\`\``}}},tags:["autodocs"],argTypes:{onPlaceSelect:{action:"selected",description:"Callback function when an address is selected"},placeholder:{control:"text",description:"Placeholder text for the search input"},className:{control:"text",description:"Additional CSS classes to apply to the component"},disabled:{control:"boolean",description:"Whether the search input is disabled"},displayAddressComponents:{control:"boolean",description:"Whether to show the address components breakdown below the input"}}},p={args:{placeholder:"Enter an address...",displayAddressComponents:!0}},f={args:{...p.args,disabled:!0}};var A,N,v;p.parameters={...p.parameters,docs:{...(A=p.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    placeholder: "Enter an address...",
    displayAddressComponents: true
  }
}`,...(v=(N=p.parameters)==null?void 0:N.docs)==null?void 0:v.source}}};var w,P,j;f.parameters={...f.parameters,docs:{...(w=f.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    disabled: true
  }
}`,...(j=(P=f.parameters)==null?void 0:P.docs)==null?void 0:j.source}}};const V=["Default","Disabled"];export{p as Default,f as Disabled,V as __namedExportsOrder,R as default};
