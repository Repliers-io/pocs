import{j as e}from"./jsx-runtime-xF634gn_.js";import{useMDXComponents as i}from"./index-o2KxC7bF.js";import{M as s}from"./index-Dfyw6FsB.js";import"./index-C-7etoUd.js";import"./iframe-ByaOWpFT.js";import"./index-DmZMPOxo.js";import"./index-BKjiqKB3.js";import"./index-DgH-xKnr.js";import"./index-DrFu-skq.js";function t(r){const n={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",hr:"hr",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...i(),...r.components};return e.jsxs(e.Fragment,{children:[e.jsx(s,{title:"Blog & Writing/3. Finding the Hybrid"}),`
`,e.jsx(n.h1,{id:"finding-the-hybrid-nlp-powered-map-search",children:"Finding the Hybrid: NLP-Powered Map Search"}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"January 29 - February 1, 2026"})," · 10 min read"]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.p,{children:"It was late on January 23rd when I created the rough proof-of-concept. Just the AI search input next to a map. No polish, just the two pieces side-by-side to see how they felt together."}),`
`,e.jsx(n.p,{children:"Honestly? I didn't expect much. I'd already tried conversational UI (tedious). I'd tried AI-powered search input (gimmicky). This was probably going to be another dead end."}),`
`,e.jsx(n.p,{children:'But I opened the component anyway, typed "3 bedroom condo in Liberty Village," and watched what happened.'}),`
`,e.jsx(n.p,{children:"The map moved. Centered on Liberty Village. The filters updated. Properties appeared."}),`
`,e.jsx(n.p,{children:"And I just... stared at it."}),`
`,e.jsxs(n.p,{children:['Something felt different. Not the "oh this is clever" different. The "oh, ',e.jsx(n.em,{children:"this"}),' is how it should work" different.']}),`
`,e.jsxs(n.p,{children:["But I didn't trust it yet. I'd been wrong twice before. The chatbot ",e.jsx(n.em,{children:"felt"})," right at first. The AI search input ",e.jsx(n.em,{children:"seemed"})," elegant. Why would this be any different?"]}),`
`,e.jsx(n.p,{children:"So I sat there, staring at the proof-of-concept, trying to figure out what was wrong with it."}),`
`,e.jsx(n.p,{children:"And I couldn't find anything."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"the-realization-that-i-didnt-want-to-believe",children:"The Realization (That I Didn't Want to Believe)"}),`
`,e.jsxs(n.p,{children:["Here's the thing: I didn't want to rewrite everything ",e.jsx(n.em,{children:"again"}),"."]}),`
`,e.jsx(n.p,{children:"I'd already deleted the chatbot approach. I'd already deleted 2,016 lines from the AI search input. And now I was looking at another complete rewrite?"}),`
`,e.jsx(n.p,{children:"But the proof-of-concept kept nagging at me. Every time I used it, it just... worked. Type. Map moves. Filters update. Refine visually."}),`
`,e.jsx(n.p,{children:"Fast. Intuitive. No friction."}),`
`,e.jsx(n.p,{children:"On January 29th, I gave in and committed the rewrite:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-bash",children:`feat: add AI-powered map listings component with NLP search

 46 files changed, 8626 insertions(+), 2016 deletions(-)
`})}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"8,626 lines added. 2,016 deleted."})}),`
`,e.jsx(n.p,{children:"This better be worth it."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"what-i-missed-twice",children:"What I Missed (Twice)"}),`
`,e.jsxs(n.p,{children:[`Property search is fundamentally spatial. When someone says "I want to live in Liberty Village," they're not describing a database query - they're describing a `,e.jsx(n.em,{children:"place"}),"."]}),`
`,e.jsx(n.p,{children:"And places are best understood visually."}),`
`,e.jsxs(n.p,{children:["This seems obvious now. But I'd spent three months trying to make natural language the ",e.jsx(n.em,{children:"primary"})," interface. Chat. Then AI search input. Both trying to make typing the main interaction."]}),`
`,e.jsx(n.p,{children:"I'd been solving the wrong problem."}),`
`,e.jsx(n.p,{children:"Think about how you'd actually search for a home:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Open a map"}),`
`,e.jsx(n.li,{children:"Look around a neighborhood"}),`
`,e.jsx(n.li,{children:"See what's available"}),`
`,e.jsx(n.li,{children:"Zoom in on interesting areas"}),`
`,e.jsx(n.li,{children:"Filter down to what you can afford"}),`
`]}),`
`,e.jsxs(n.p,{children:["The map isn't a ",e.jsx(n.em,{children:"result visualization"}),". It's the primary interface."]}),`
`,e.jsx(n.p,{children:"So what role does natural language play?"}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Getting you there fast."})," That's it. Not replacing the map. Not being the interface. Just... a shortcut."]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"the-new-architecture",children:"The New Architecture"}),`
`,e.jsx(n.p,{children:"Instead of forcing users to type everything, I flipped it:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`1. User TYPES intent: "3br condo in Liberty Village under 800k"
2. Repliers NLP parses it into:
   - Location: Liberty Village (lat: 43.639, lng: -79.403)
   - Filters: 3 bedrooms, Condo, Max $800k
3. Map auto-centers on Liberty Village
4. Filters auto-populate (bedrooms: 3, property type: Condo, price: $800k)
5. User REFINES visually:
   - Click a different neighborhood on the map
   - Adjust price slider
   - Toggle property types
   - Explore freely
`})}),`
`,e.jsxs(n.p,{children:["Natural language for the ",e.jsx(n.strong,{children:"initial intent"}),". Visual UI for ",e.jsx(n.strong,{children:"exploration and refinement"}),"."]}),`
`,e.jsx(n.p,{children:"Hybrid."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"the-implementation-actually-reading-the-docs",children:"The Implementation: Actually Reading the Docs"}),`
`,e.jsx(n.p,{children:"The breakthrough came from actually reading the Repliers NLP API response."}),`
`,e.jsx(n.p,{children:"I know. Embarrassing. I'd been using this API for months and apparently hadn't looked closely at what it returned."}),`
`,e.jsx(n.p,{children:"Here's what it gives you:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-json",children:`{
  "search_url": "https://api.repliers.io/listings?...",
  "summary": "3 bedroom condos in Liberty Village under $800,000",
  "locations": [
    {
      "name": "Liberty Village",
      "type": "neighborhood",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[lng, lat], ...]]
      },
      "center": [43.639, -79.403],
      "zoom": 14
    }
  ]
}
`})}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"The API already gives you lat/long, boundaries, and zoom level."})}),`
`,e.jsx(n.p,{children:"I'd been planning to add a separate Mapbox geocoding call. I'd even roughed out the code for it. But the data was already sitting there in the NLP response."}),`
`,e.jsx(n.p,{children:"How many hours had I wasted over-engineering when the solution was already there?"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`/**
 * Extract location data from Repliers NLP response
 * Returns coordinates, boundaries, and recommended zoom
 */
export function extractLocationFromNLP(response: NLPResponse) {
  const location = response.locations?.[0];

  if (!location) return null;

  return {
    center: location.center, // [lat, lng]
    boundaries: location.geometry, // GeoJSON polygon
    zoom: location.zoom || 14, // Recommended zoom level
    name: location.name, // "Liberty Village"
    type: location.type, // "neighborhood"
  };
}
`})}),`
`,e.jsx(n.p,{children:"One API call. Everything you need to center the map perfectly."}),`
`,e.jsx(n.p,{children:"I could have saved myself a week of work if I'd just read the API response carefully from the start."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"building-searchfeedback-showing-your-work",children:"Building SearchFeedback: Showing Your Work"}),`
`,e.jsx(n.p,{children:"Here's the thing about AI-powered features: users don't trust them unless you show what the AI understood."}),`
`,e.jsx(n.p,{children:"I learned this the hard way. The initial version didn't have the SearchFeedback component. Users would type something, the map would move, and they'd just... sit there, confused."}),`
`,e.jsx(n.p,{children:`"Did it work? What's it searching for? Why am I seeing these results?"`}),`
`,e.jsx(n.p,{children:"Right. Show your work."}),`
`,e.jsx(n.p,{children:"So I built a SearchFeedback component that displays the interpretation:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`export function SearchFeedback({ prompt, url, summary, filters }) {
  // Analyze what was captured from the user's prompt
  const captured = [
    { label: "Neighborhood", value: "Liberty Village", icon: <MapPin /> },
    { label: "Bedrooms", value: "3", icon: <Bed /> },
    { label: "Property Type", value: "Condo", icon: <Home /> },
    { label: "Price", value: "Under $800,000", icon: <DollarSign /> },
  ];

  return (
    <div className="search-feedback">
      <div className="prompt">You searched: "{prompt}"</div>

      <div className="interpretation">{summary}</div>

      <div className="captured-criteria">
        {captured.map((item) => (
          <div className="criterion">
            {item.icon} {item.label}: {item.value}
          </div>
        ))}
      </div>
    </div>
  );
}
`})}),`
`,e.jsx(n.p,{children:"The UI shows:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`You searched: "3br condo in Liberty Village under 800k"

Showing: 3 bedroom condos in Liberty Village under $800,000

Captured criteria:
📍 Neighborhood: Liberty Village
🛏️ Bedrooms: 3
🏠 Property Type: Condo
💰 Price: Under $800,000
`})}),`
`,e.jsx(n.p,{children:"This builds trust. Users see exactly what the AI understood, and they can immediately spot if something was missed or misinterpreted."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"the-filter-parser-url-to-state",children:"The Filter Parser: URL to State"}),`
`,e.jsx(n.p,{children:"The Repliers NLP API returns a ready-to-use search URL with all the parameters:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`https://api.repliers.io/listings?propertyType=Condo%20Apt&minBeds=3&
maxPrice=800000&city=Toronto&neighborhood=Liberty%20Village
`})}),`
`,e.jsx(n.p,{children:"I needed to parse this back into my component's filter state:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`export function parseNLPUrl(url: string): Partial<MapFilters> {
  const urlObj = new URL(url);
  const params = urlObj.searchParams;

  const filters: Partial<MapFilters> = {};

  // Property Type
  const propertyType = params.get("propertyType");
  if (propertyType) {
    filters.propertyTypes = propertyType.split(",").map((t) => t.trim());
  }

  // Bedrooms
  const minBeds = params.get("minBeds");
  if (minBeds) {
    const value = parseInt(minBeds);
    filters.bedrooms = value >= 5 ? "5+" : value.toString();
  }

  // Price Range
  const maxPrice = params.get("maxPrice");
  if (maxPrice) filters.maxPrice = parseInt(maxPrice);

  return filters;
}
`})}),`
`,e.jsx(n.p,{children:"Now when the NLP search completes:"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsx(n.li,{children:"Parse the URL into filter state"}),`
`,e.jsx(n.li,{children:"Update the UI filters to match"}),`
`,e.jsx(n.li,{children:"User sees exactly what criteria are active"}),`
`,e.jsx(n.li,{children:"User can adjust any filter with traditional UI"}),`
`]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"the-search-panel-chat-like-but-not-chat",children:"The Search Panel: Chat-Like but Not Chat"}),`
`,e.jsx(n.p,{children:"I kept the familiar chat interface pattern for the input, but made it clear this isn't a conversation:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`<SearchPanel>
  {!hasSearched && (
    <InspirationChips>
      Try: "3br condo in Liberty Village" Or: "House under 800k near Queen West"
    </InspirationChips>
  )}

  <SearchInput
    placeholder="Try: '3br condo in Liberty Village under 800k'"
    onSearch={handleNLPSearch}
    loading={searching}
  />

  {hasSearched && (
    <SearchFeedback
      prompt={lastQuery}
      url={nlpResponse.search_url}
      summary={nlpResponse.summary}
      filters={parsedFilters}
    />
  )}
</SearchPanel>
`})}),`
`,e.jsx(n.p,{children:`Before searching: show inspiration chips with examples.
After searching: show what was understood.`}),`
`,e.jsx(n.p,{children:"Each search is independent - no conversation history. Because property search is exploratory, not conversational."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"february-1st-the-embarrassing-optimization",children:"February 1st: The Embarrassing Optimization"}),`
`,e.jsx(n.p,{children:"The initial implementation worked, but I was still calling the Locations API separately for geocoding."}),`
`,e.jsx(n.p,{children:"Let me say that again: I'd already discovered the NLP response contained location data. I'd extracted it. I'd used it to center the map."}),`
`,e.jsxs(n.p,{children:["And I was ",e.jsx(n.em,{children:"still"})," making a separate geocoding call out of habit."]}),`
`,e.jsx(n.p,{children:"On February 1st, I finally noticed:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-bash",children:`feat: optimize NLP response usage and add search feedback UI

Changes:
- Enhanced NLP response handling to use location data directly,
  eliminating unnecessary calls to /locations endpoint
- Added Location and NLPResponse TypeScript interfaces
- Created extractLocationFromNLP() utility function
- Implemented SearchFeedback component with chat-like UI
- Added comprehensive console logging for debugging

Benefits:
- Reduced API calls by using NLP response data directly
- Improved user understanding of AI interpretation
- Better UX with visual feedback on applied filters
`})}),`
`,e.jsx(n.p,{children:"From two API calls (NLP + Locations) down to one (NLP only)."}),`
`,e.jsx(n.p,{children:"Sometimes the best optimization is just... reading the response more carefully."}),`
`,e.jsx(n.p,{children:"Or, you know, reading it at all."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"the-components-clean-separation",children:"The Components: Clean Separation"}),`
`,e.jsx(n.p,{children:"The final structure:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`ai-map-listings/
├── ai-map-listings.tsx (1,453 lines - main component)
├── components/
│   ├── SearchPanel/
│   │   ├── SearchPanel.tsx (326 lines)
│   │   ├── SearchInput.tsx (103 lines)
│   │   ├── SearchFeedback.tsx (231 lines)
│   │   └── InspirationChips.tsx
│   └── FilterSections/
│       ├── BedroomBathroomFilter.tsx
│       ├── PriceRangeFilter.tsx
│       └── PropertyTypeFilter.tsx
├── hooks/
│   └── useNLPSearch.ts (108 lines)
└── utils/
    ├── nlp-parser.ts (116 lines)
    └── location-geocoder.ts (99 lines)
`})}),`
`,e.jsx(n.p,{children:"Each piece has a clear responsibility:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"SearchPanel"}),": Handles NLP input and feedback"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"FilterSections"}),": Traditional filter UI"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"useNLPSearch"}),": Manages NLP API calls and state"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"nlp-parser"}),": Converts NLP URLs to filter state"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"location-geocoder"}),": Extracts location data from responses"]}),`
`]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"what-makes-it-work-i-think",children:"What Makes It Work (I Think)"}),`
`,e.jsx(n.p,{children:"Looking back, I can identify four decisions that mattered. Though honestly, half of these were accidents:"}),`
`,e.jsx(n.h3,{id:"1-nlp-is-enhancement-not-replacement",children:"1. NLP Is Enhancement, Not Replacement"}),`
`,e.jsx(n.p,{children:"The map works perfectly without any NLP search. Users can:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Pan around the map"}),`
`,e.jsx(n.li,{children:"Click filters"}),`
`,e.jsx(n.li,{children:"Explore visually"}),`
`]}),`
`,e.jsx(n.p,{children:"NLP is just a faster way to express initial intent."}),`
`,e.jsx(n.h3,{id:"2-each-search-starts-fresh",children:"2. Each Search Starts Fresh"}),`
`,e.jsx(n.p,{children:"No conversation history. No nlpId persistence between searches."}),`
`,e.jsx(n.p,{children:"Why? Because users want to try different things:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:'"3br in Liberty Village" → see results'}),`
`,e.jsx(n.li,{children:'"Actually, show me High Park" → fresh search'}),`
`,e.jsx(n.li,{children:'"What about 2br?" → fresh search'}),`
`]}),`
`,e.jsx(n.p,{children:"Exploration is non-linear. Don't force it into a conversational flow."}),`
`,e.jsx(n.h3,{id:"3-show-the-interpretation",children:"3. Show the Interpretation"}),`
`,e.jsx(n.p,{children:"The SearchFeedback component is crucial. It answers:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Did the AI understand correctly?"}),`
`,e.jsx(n.li,{children:"What criteria are active?"}),`
`,e.jsx(n.li,{children:"What got missed?"}),`
`]}),`
`,e.jsx(n.p,{children:"Transparency builds trust."}),`
`,e.jsx(n.h3,{id:"4-visual-refinement--typed-refinement",children:"4. Visual Refinement > Typed Refinement"}),`
`,e.jsx(n.p,{children:"After the initial NLP search, users refine with:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Price sliders"}),`
`,e.jsx(n.li,{children:"Bedroom buttons"}),`
`,e.jsx(n.li,{children:"Property type checkboxes"}),`
`,e.jsx(n.li,{children:"Map panning/zooming"}),`
`]}),`
`,e.jsx(n.p,{children:'Not by typing "actually make it 850k" into a search box.'}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"the-user-experience",children:"The User Experience"}),`
`,e.jsx(n.p,{children:"Here's the full flow:"}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"User types"}),': "3 bedroom condo in Liberty Village under 800k"']}),`
`,e.jsx(n.p,{children:e.jsx(n.em,{children:"[500ms later, NLP parses]"})}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Map"}),`: Smoothly centers on Liberty Village
`,e.jsx(n.strong,{children:"Filters"}),`: Update to 3 beds, Condo, $800k max
`,e.jsx(n.strong,{children:"SearchFeedback"}),": Shows interpretation"]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"User sees 12 properties on the map"})}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"User"}),`: Clicks price slider, adjusts to $850k
`,e.jsx(n.strong,{children:"Map"}),": Updates immediately with 4 more properties"]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"User"}),`: Pans map west to see nearby neighborhoods
`,e.jsx(n.strong,{children:"Map"}),": Shows properties in adjacent areas"]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"User"}),`: Types new search: "house near Queen West"
`,e.jsx(n.strong,{children:"Map"}),`: Centers on Queen West, clears condo filter
`,e.jsx(n.strong,{children:"SearchFeedback"}),": Shows new interpretation"]}),`
`,e.jsx(n.p,{children:"Fast. Visual. Exploratory."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"the-metrics-that-matter",children:"The Metrics That Matter"}),`
`,e.jsx(n.p,{children:"After deploying to Storybook, I watched the console logs (yes, I left debugging logs in on purpose):"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`NLP Request: "3br condo liberty village under 800k"
NLP Response time: 847ms
Location extracted: Liberty Village (43.639, -79.403)
Filters parsed: {bedrooms: 3, propertyTypes: ['Condo'], maxPrice: 800000}
Map centered: [43.639, -79.403], zoom: 14
Results loaded: 12 properties
`})}),`
`,e.jsx(n.p,{children:"Under a second from typing to seeing results on a centered map."}),`
`,e.jsx(n.p,{children:"No separate geocoding call. One API request. Clean."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"what-i-learned-the-hard-way",children:"What I Learned (The Hard Way)"}),`
`,e.jsx(n.h3,{id:"maps--chat-for-spatial-tasks",children:"Maps > Chat for Spatial Tasks"}),`
`,e.jsx(n.p,{children:"Property search is inherently spatial. Took me three months and two failed approaches to figure that out."}),`
`,e.jsx(n.h3,{id:"read-the-api-response-seriously-read-it",children:"Read the API Response (Seriously, Read It)"}),`
`,e.jsx(n.p,{children:"I almost added a separate Locations API call for geocoding. The data was already in the NLP response, staring me in the face."}),`
`,e.jsx(n.p,{children:"RTFM isn't just for beginners."}),`
`,e.jsx(n.h3,{id:"show-your-work",children:"Show Your Work"}),`
`,e.jsx(n.p,{children:"The SearchFeedback component wasn't in my original plan. Users were confused without it. Another thing I should have anticipated but didn't."}),`
`,e.jsx(n.h3,{id:"hybrid-beats-pure",children:"Hybrid Beats Pure"}),`
`,e.jsx(n.p,{children:"Not AI-only. Not traditional-only. Both. Turns out users don't want to be forced into a single interaction model. Who knew? (Everyone. Everyone knew this.)"}),`
`,e.jsx(n.h3,{id:"delete-without-guilt",children:"Delete Without Guilt"}),`
`,e.jsx(n.p,{children:"Those 2,016 deleted lines from the AI Search Input? They taught me what doesn't work, which informed what does."}),`
`,e.jsx(n.p,{children:"Still hurt to delete them though."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"try-it-yourself",children:"Try It Yourself"}),`
`,e.jsx(n.p,{children:e.jsx(n.a,{href:"/?path=/story/pocs-ai-map-listings--default",children:"AI Map Listings Component"})}),`
`,e.jsx(n.p,{children:"Try these searches:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:'"3 bedroom condo in Liberty Village"'}),`
`,e.jsx(n.li,{children:'"House under 800k in Leslieville"'}),`
`,e.jsx(n.li,{children:'"2br apartment near Queen West"'}),`
`]}),`
`,e.jsx(n.p,{children:"Watch how the map centers and filters populate. Then refine visually."}),`
`,e.jsx(n.hr,{}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Commits referenced"}),": ",e.jsx(n.code,{children:"0bfe16e"}),", ",e.jsx(n.code,{children:"a359e03"}),", ",e.jsx(n.code,{children:"b79fe88"})]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Next"}),": Week 4: Lessons from 3 Months of NLP Experimentation →"]})]})}function m(r={}){const{wrapper:n}={...i(),...r.components};return n?e.jsx(n,{...r,children:e.jsx(t,{...r})}):t(r)}export{m as default};
