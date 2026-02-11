import{j as e}from"./jsx-runtime-xF634gn_.js";import{useMDXComponents as r}from"./index-o2KxC7bF.js";import{M as t}from"./index-Dfyw6FsB.js";import"./index-C-7etoUd.js";import"./iframe-ByaOWpFT.js";import"./index-DmZMPOxo.js";import"./index-BKjiqKB3.js";import"./index-DgH-xKnr.js";import"./index-DrFu-skq.js";function i(s){const n={code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",hr:"hr",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...r(),...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(t,{title:"Blog & Writing/5. The Missing Pieces Problem"}),`
`,e.jsx(n.h1,{id:"the-missing-pieces-when-the-api-cant-tell-you-what-it-didnt-understand",children:"The Missing Pieces: When the API Can't Tell You What It Didn't Understand"}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"February 2026"})," · 10 min read"]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.p,{children:"The hybrid map search was working. Users could type natural language queries, watch the map center on their desired location, see filters populate automatically, then refine visually. It felt right."}),`
`,e.jsx(n.p,{children:"But something was off."}),`
`,e.jsx(n.p,{children:`I'd watch someone type "3 bedroom condo with pool in Liberty Village under 800k" and the map would move, the filters would update, and they'd just... sit there. Staring at the results with a confused look.`}),`
`,e.jsx(n.p,{children:`"Did it get everything?" they'd ask.`}),`
`,e.jsx(n.p,{children:"I'd look at the activity log. It showed what the NLP understood:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"✓ 3 bedrooms"}),`
`,e.jsx(n.li,{children:"✓ Condo"}),`
`,e.jsx(n.li,{children:"✓ Liberty Village"}),`
`,e.jsx(n.li,{children:"✓ Under $800K"}),`
`]}),`
`,e.jsx(n.p,{children:`"Yeah, looks good," I'd say.`}),`
`,e.jsx(n.p,{children:`Then they'd scroll through the results. "But some of these don't have pools?"`}),`
`,e.jsx(n.p,{children:"Oh."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"the-realization",children:"The Realization"}),`
`,e.jsx(n.p,{children:`The NLP API didn't capture "pool." And the user had no way to know that without manually comparing their original query to the chips we showed them.`}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"This is a transparency problem."})}),`
`,e.jsx(n.p,{children:"Not a UI problem. Not a UX problem. An information problem."}),`
`,e.jsxs(n.p,{children:["The client can only show what the API tells it. And the API only tells us what it ",e.jsx(n.em,{children:"understood"}),", not what it ",e.jsx(n.em,{children:"didn't understand"}),"."]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"attempt-1-the-searchfeedback-component",children:"Attempt 1: The SearchFeedback Component"}),`
`,e.jsx(n.p,{children:"My first instinct was to make the comparison easier for users:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-jsx",children:`<SearchFeedback
  prompt="3 bedroom condo with pool in Liberty Village"
  summary="3 bedroom condos in Liberty Village"
  filters={{ bedrooms: 3, propertyType: 'Condo', city: 'Liberty Village' }}
/>
`})}),`
`,e.jsx(n.p,{children:"It rendered like this:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`┌─────────────────────────────────────────────┐
│  YOUR SEARCH                                │
│  "3 bedroom condo with pool in Liberty      │
│   Village"                                  │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  UNDERSTOOD AS                              │
│  "3 bedroom condos in Liberty Village"      │
│                                             │
│  [🛏️ 3 beds] [🏠 Condo] [📍 Liberty Village]│
└─────────────────────────────────────────────┘

⚠️ Use advanced filters to refine your search further
`})}),`
`,e.jsx(n.p,{children:"Better. Users could see both the original query and what was parsed."}),`
`,e.jsx(n.p,{children:`But they still had to do the mental diff. Look at "with pool" in their query. Look at the chips. Notice it's missing. Wonder if it matters.`}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Cognitive load transferred, not eliminated."})}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"attempt-2-the-activity-log",children:"Attempt 2: The Activity Log"}),`
`,e.jsx(n.p,{children:"I tried making it more conversational:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`12:34 PM
Searching for: "3 bedroom condo with pool in Liberty Village"

12:34 PM
I was able to process the following search criteria from your
original prompt:

[🛏️ Bedrooms: 3] [🏠 Type: Condo] [📍 City: Liberty Village]
[💰 Price: Up to $800K]

Click on a parameter to fine tune your search further →
`})}),`
`,e.jsx(n.p,{children:"More natural. More polished. Better animations."}),`
`,e.jsx(n.p,{children:"Same fundamental problem."}),`
`,e.jsxs(n.p,{children:['The system was saying "I was able to process the following..." but not "I was ',e.jsx(n.em,{children:"unable"}),' to process: pool."']}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"the-client-side-ceiling",children:"The Client-Side Ceiling"}),`
`,e.jsx(n.p,{children:`Here's what I receive from the Repliers NLP API when someone searches for "3 bedroom condo with pool in Liberty Village under 800k":`}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-json",children:`{
  "request": {
    "url": "https://api.repliers.io/listings?bedrooms=3&propertyType=Condo&city=Liberty%20Village&maxPrice=800000",
    "summary": "3 bedroom condos in Liberty Village under $800,000",
    "locations": [{
      "name": "Liberty Village",
      "type": "neighborhood",
      "map": {
        "latitude": "43.639",
        "longitude": "-79.403",
        "boundary": [...]
      }
    }]
  },
  "nlpId": "abc123"
}
`})}),`
`,e.jsx(n.p,{children:"I can parse this. I can show chips for bedrooms, property type, location, and price."}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:`But I can't tell the user about "pool" because the API doesn't mention it.`})}),`
`,e.jsx(n.p,{children:`The information gap is on the server side. The NLP engine knew it couldn't parse "pool" - it just didn't tell me.`}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"the-workarounds-that-dont-work",children:"The Workarounds That Don't Work"}),`
`,e.jsx(n.h3,{id:"generic-messaging",children:e.jsx(n.strong,{children:"Generic Messaging"})}),`
`,e.jsx(n.p,{children:"I tried adding helpful hints:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:'"Use advanced filters below to refine your search further"'}),`
`,e.jsx(n.li,{children:'"Click on a parameter to fine tune your search"'}),`
`]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Problem"}),": These don't tell the user ",e.jsx(n.em,{children:"what"}),` needs refining. It's like a teacher saying "fix your essay" without marking what's wrong.`]}),`
`,e.jsx(n.h3,{id:"showing-everything",children:e.jsx(n.strong,{children:"Showing Everything"})}),`
`,e.jsxs(n.p,{children:["I considered showing ",e.jsx(n.em,{children:"all"})," possible filter options that weren't used. Bedrooms? ✓. Bathrooms? ✗. Square footage? ✗. Garage? ✗. Pool? ✗."]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Problem"}),`: This creates noise. If someone searches "2 bedroom condo in Toronto," they don't need to see that we also didn't capture bathrooms, square footage, parking, waterfront, and 47 other possible criteria.`]}),`
`,e.jsx(n.h3,{id:"parsing-the-prompt-myself",children:e.jsx(n.strong,{children:"Parsing the Prompt Myself"})}),`
`,e.jsx(n.p,{children:"Could I parse the original prompt on the client and compare it to what the API returned?"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-javascript",children:`// DON'T DO THIS
const detectMissing = (prompt, understood) => {
  const amenities = ['pool', 'gym', 'parking', 'balcony', ...];
  const missing = amenities.filter(a =>
    prompt.toLowerCase().includes(a) &&
    !understood.includes(a)
  );
  return missing;
};
`})}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Problem"}),`: Now I'm maintaining my own NLP parser to detect gaps in the real NLP parser. I'd constantly be out of sync. The API might understand "swimming pool" but I'm checking for "pool." Or vice versa.`]}),`
`,e.jsx(n.p,{children:"This is madness."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"you-cant-fix-an-information-gap-with-better-ui",children:"You Can't Fix an Information Gap with Better UI"}),`
`,e.jsx(n.p,{children:"I tried:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Better visual design ✗"}),`
`,e.jsx(n.li,{children:"More conversational copy ✗"}),`
`,e.jsx(n.li,{children:"Animated transitions ✗"}),`
`,e.jsx(n.li,{children:"Contextual hints ✗"}),`
`,e.jsx(n.li,{children:"Clickable chips ✗"}),`
`]}),`
`,e.jsxs(n.p,{children:["None of it addressed the core issue: ",e.jsx(n.strong,{children:"The client doesn't know what the API couldn't parse."})]}),`
`,e.jsx(n.p,{children:"And there's no client-side workaround that doesn't involve reimplementing NLP parsing, which defeats the entire point of using an NLP API."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"the-feature-request",children:"The Feature Request"}),`
`,e.jsx(n.p,{children:"The NLP API is the single source of truth for what was and wasn't understood. It should expose both."}),`
`,e.jsx(n.h3,{id:"what-i-want-to-receive",children:e.jsx(n.strong,{children:"What I Want to Receive"})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-json",children:`{
  "request": {
    "url": "https://api.repliers.io/listings?bedrooms=3&propertyType=Condo&city=Liberty%20Village&maxPrice=800000",
    "summary": "3 bedroom condos in Liberty Village under $800,000",
    "understood": {
      "bedrooms": 3,
      "propertyType": "Condo",
      "location": "Liberty Village",
      "maxPrice": 800000
    },
    "not_understood": [
      {
        "term": "pool",
        "phrase": "with pool",
        "reason": "unsupported_amenity",
        "suggestion": "Use advanced filters to add amenity requirements"
      }
    ],
    "locations": [...]
  },
  "nlpId": "abc123"
}
`})}),`
`,e.jsx(n.h3,{id:"what-this-enables",children:e.jsx(n.strong,{children:"What This Enables"})}),`
`,e.jsx(n.p,{children:"Now I can show explicit, actionable feedback:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`✅ UNDERSTOOD
[🛏️ 3 bedrooms] [🏠 Condo] [📍 Liberty Village] [💰 Up to $800K]

⚠️ COULDN'T CAPTURE
"pool" - This amenity isn't available in natural language search yet.
Try using the advanced filters panel to add amenity requirements.
`})}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Transparent. Honest. Actionable."})}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"why-this-matters",children:"Why This Matters"}),`
`,e.jsx(n.h3,{id:"user-trust",children:e.jsx(n.strong,{children:"User Trust"})}),`
`,e.jsx(n.p,{children:"When AI transparently admits what it doesn't understand, users trust it more."}),`
`,e.jsx(n.p,{children:"Compare these two experiences:"}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Without explicit gaps:"})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`User: *types "3 bed condo with pool in Liberty Village"*
System: *shows results, some without pools*
User: "Wait... did it understand 'pool'?"
User: *scrolls back up to re-read their query*
User: *compares to chips manually*
User: "I guess it didn't get the pool part?"
User: "Does this even work?"
`})}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"With explicit gaps:"})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`User: *types "3 bed condo with pool in Liberty Village"*
System: "✅ Got: 3 bed, condo, Liberty Village"
System: "⚠️ Couldn't capture: pool - use advanced filters"
User: "Oh, makes sense."
User: *opens advanced filters, adds pool*
`})}),`
`,e.jsx(n.p,{children:"One builds trust. The other breeds doubt."}),`
`,e.jsx(n.h3,{id:"product-intelligence",children:e.jsx(n.strong,{children:"Product Intelligence"})}),`
`,e.jsx(n.p,{children:"The NLP engine already knows what it couldn't parse. This isn't asking for new computation - it's asking to expose existing information."}),`
`,e.jsx(n.p,{children:"Somewhere in the API's processing pipeline, decisions are being made:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:'"bedrooms=3" → ✓ understood, added to query'}),`
`,e.jsx(n.li,{children:'"propertyType=Condo" → ✓ understood, added to query'}),`
`,e.jsx(n.li,{children:'"with pool" → ✗ not understood, skipped'}),`
`]}),`
`,e.jsx(n.p,{children:"That last decision is invisible to the client. Why?"}),`
`,e.jsx(n.h3,{id:"better-ux-at-every-layer",children:e.jsx(n.strong,{children:"Better UX at Every Layer"})}),`
`,e.jsx(n.p,{children:"With this information, I could:"}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"In the activity log:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Show exactly what was missed"}),`
`,e.jsx(n.li,{children:"Explain why (unsupported vs ambiguous vs unknown)"}),`
`,e.jsx(n.li,{children:"Provide specific next steps"}),`
`]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"In analytics:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Track what users commonly request that isn't supported"}),`
`,e.jsx(n.li,{children:"Prioritize feature development based on actual gaps"}),`
`,e.jsx(n.li,{children:"Measure NLP comprehension rates"}),`
`]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"In error messaging:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:'Replace generic "refine your search" with "add pool in advanced filters"'}),`
`,e.jsx(n.li,{children:"Guide users to the exact solution"}),`
`,e.jsx(n.li,{children:"Reduce frustration and abandonment"}),`
`]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"the-attempted-workarounds-ranked-by-desperation",children:"The Attempted Workarounds (Ranked by Desperation)"}),`
`,e.jsx(n.h3,{id:"level-1-hope-users-notice",children:e.jsx(n.strong,{children:"Level 1: Hope Users Notice"})}),`
`,e.jsx(n.p,{children:"Just show the chips and hope users compare manually."}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Result"}),": They don't. Or they do and get confused."]}),`
`,e.jsx(n.h3,{id:"level-2-generic-hints",children:e.jsx(n.strong,{children:"Level 2: Generic Hints"})}),`
`,e.jsx(n.p,{children:'Add copy like "Use advanced filters to refine further."'}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Result"}),": Users don't know what to refine or why."]}),`
`,e.jsx(n.h3,{id:"level-3-show-everything-that-could-exist",children:e.jsx(n.strong,{children:"Level 3: Show Everything That Could Exist"})}),`
`,e.jsx(n.p,{children:"Display all possible filters with checkmarks/Xs."}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Result"}),": Information overload. Noise drowns out signal."]}),`
`,e.jsx(n.h3,{id:"level-4-implement-my-own-nlp",children:e.jsx(n.strong,{children:"Level 4: Implement My Own NLP"})}),`
`,e.jsx(n.p,{children:"Parse the prompt client-side to detect missing terms."}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Result"}),": Now I'm maintaining two NLP engines. They drift out of sync. Chaos."]}),`
`,e.jsx(n.h3,{id:"level-5-just-ask-the-api",children:e.jsx(n.strong,{children:"Level 5: Just Ask the API"})}),`
`,e.jsx(n.p,{children:"Request that the API expose what it didn't understand."}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Result"}),": Elegant. Scalable. Actually solves the problem."]}),`
`,e.jsx(n.p,{children:"I'm on Level 5 now."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"the-implementation-if-it-existed",children:"The Implementation (If It Existed)"}),`
`,e.jsxs(n.p,{children:["If the API returned ",e.jsx(n.code,{children:"not_understood"})," items, here's what the component would look like:"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`interface NLPResponse {
  request: {
    url: string;
    summary: string;
    understood?: Record<string, any>;
    not_understood?: Array<{
      term: string;
      phrase: string;
      reason: 'unsupported_amenity' | 'ambiguous_term' |
              'unknown_location' | 'conflicting_criteria';
      suggestion?: string;
    }>;
    locations?: Location[];
  };
  nlpId: string;
}
`})}),`
`,e.jsx(n.p,{children:"And the rendering:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`function SearchResults({ nlpResponse }: { nlpResponse: NLPResponse }) {
  const { understood, not_understood } = nlpResponse.request;

  return (
    <div className="space-y-4">
      {/* Show what was understood */}
      {understood && (
        <div>
          <h3>✅ Understood</h3>
          {Object.entries(understood).map(([key, value]) => (
            <Chip key={key} label={key} value={value} />
          ))}
        </div>
      )}

      {/* Show what wasn't understood - THE MAGIC */}
      {not_understood && not_understood.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="flex items-center gap-2 text-amber-900">
            <AlertCircle size={16} />
            Couldn't Capture
          </h3>
          {not_understood.map((item, idx) => (
            <div key={idx} className="mt-2">
              <span className="font-semibold">"{item.term}"</span>
              <p className="text-sm text-amber-800 mt-1">
                {item.suggestion ||
                 \`This \${item.reason.replace('_', ' ')} isn't supported yet.\`}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
`})}),`
`,e.jsx(n.p,{children:"Clean. Clear. Honest."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"common-scenarios-this-would-solve",children:"Common Scenarios This Would Solve"}),`
`,e.jsx(n.h3,{id:"scenario-1-unsupported-amenities",children:e.jsx(n.strong,{children:"Scenario 1: Unsupported Amenities"})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`Query: "2 bed with gym and parking in downtown"
Understood: bedrooms=2, location=downtown
Not understood:
  - "gym" (reason: unsupported_amenity)
  - "parking" (reason: unsupported_amenity)
`})}),`
`,e.jsx(n.p,{children:`User sees: "Couldn't capture: gym, parking - Use advanced filters to add amenities"`}),`
`,e.jsx(n.h3,{id:"scenario-2-ambiguous-terms",children:e.jsx(n.strong,{children:"Scenario 2: Ambiguous Terms"})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`Query: "modern house in the village"
Understood: propertyType=House
Not understood:
  - "modern" (reason: ambiguous_term, "Did you mean recently built or modern style?")
  - "the village" (reason: ambiguous_term, "Multiple neighborhoods match. Try: Liberty Village, Yorkville, Annex")
`})}),`
`,e.jsx(n.p,{children:"User sees specific clarification requests, not silence."}),`
`,e.jsx(n.h3,{id:"scenario-3-unknown-locations",children:e.jsx(n.strong,{children:"Scenario 3: Unknown Locations"})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`Query: "condo in Libery Village" (typo)
Understood: propertyType=Condo
Not understood:
  - "Libery Village" (reason: unknown_location, "Did you mean Liberty Village?")
`})}),`
`,e.jsx(n.p,{children:"User gets spelling correction suggestion instead of wondering why location didn't populate."}),`
`,e.jsx(n.h3,{id:"scenario-4-conflicting-criteria",children:e.jsx(n.strong,{children:"Scenario 4: Conflicting Criteria"})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`Query: "3 bedroom studio in Toronto"
Understood: city=Toronto
Not understood:
  - "3 bedroom studio" (reason: conflicting_criteria, "Studios are typically 0 bedrooms")
`})}),`
`,e.jsx(n.p,{children:"User immediately sees the conflict instead of getting confusing results."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"the-ceiling-i-hit",children:"The Ceiling I Hit"}),`
`,e.jsx(n.p,{children:"I've built:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"✅ Activity log showing chronological search history"}),`
`,e.jsx(n.li,{children:"✅ Chips displaying understood criteria with icons"}),`
`,e.jsx(n.li,{children:'✅ Conversational messaging: "I was able to process the following..."'}),`
`,e.jsx(n.li,{children:"✅ Clickable chips that open advanced filters"}),`
`,e.jsx(n.li,{children:"✅ Visual comparison between original prompt and interpretation"}),`
`,e.jsx(n.li,{children:"✅ Smooth animations and polished UI"}),`
`]}),`
`,e.jsx(n.p,{children:"None of it solves the core problem."}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"You can't expose information the API doesn't give you."})}),`
`,e.jsx(n.p,{children:"I'm at the ceiling. The next improvement requires API changes."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"the-ask",children:"The Ask"}),`
`,e.jsx(n.p,{children:"The NLP API already does the hard work:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"✓ Parses natural language"}),`
`,e.jsx(n.li,{children:"✓ Extracts entities"}),`
`,e.jsx(n.li,{children:"✓ Maps to structured filters"}),`
`,e.jsx(n.li,{children:"✓ Generates search URLs"}),`
`]}),`
`,e.jsx(n.p,{children:"It already knows what it couldn't parse. That information exists somewhere in the processing pipeline."}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Can it be exposed in the response?"})}),`
`,e.jsx(n.p,{children:"Not as a nice-to-have. As a critical trust-building feature."}),`
`,e.jsx(n.p,{children:"Users need to know:"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsx(n.li,{children:"What worked"}),`
`,e.jsx(n.li,{children:"What didn't"}),`
`,e.jsx(n.li,{children:"Why"}),`
`,e.jsx(n.li,{children:"What to do about it"}),`
`]}),`
`,e.jsx(n.p,{children:"The API is the only source of truth for 1-3. The client can help with 4, but only if it knows 1-3."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"what-this-unlocks",children:"What This Unlocks"}),`
`,e.jsxs(n.p,{children:["With ",e.jsx(n.code,{children:"not_understood"})," in the API response:"]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"For users:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Immediate clarity on what was missed"}),`
`,e.jsx(n.li,{children:"Specific guidance on next steps"}),`
`,e.jsx(n.li,{children:"Trust through transparency"}),`
`,e.jsx(n.li,{children:"Less confusion, less abandonment"}),`
`]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"For developers:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"No need for client-side NLP parsing"}),`
`,e.jsx(n.li,{children:"Clean separation of concerns"}),`
`,e.jsx(n.li,{children:"Easy to render explicit feedback"}),`
`,e.jsx(n.li,{children:"Analytics on comprehension gaps"}),`
`]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"For the product:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Data on what users request but isn't supported"}),`
`,e.jsx(n.li,{children:"Prioritization signal for new features"}),`
`,e.jsx(n.li,{children:"Measure of NLP accuracy over time"}),`
`,e.jsx(n.li,{children:"Path to continuous improvement"}),`
`]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"the-honest-truth",children:"The Honest Truth"}),`
`,e.jsx(n.p,{children:"I spent weeks trying to work around this on the client side."}),`
`,e.jsx(n.p,{children:"Better UI. Better copy. Better animations. More transparency in what was shown."}),`
`,e.jsxs(n.p,{children:["All of it hit the same wall: ",e.jsx(n.strong,{children:"I can only show what the API tells me."})]}),`
`,e.jsx(n.p,{children:"The API knows more than it's sharing. And that information gap cascades into user confusion, eroded trust, and a suboptimal experience no amount of client-side polish can fix."}),`
`,e.jsx(n.p,{children:"This isn't a request for new functionality. It's a request to expose information that already exists."}),`
`,e.jsx(n.p,{children:"The NLP engine makes decisions about what it can and can't parse."}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Users deserve to know what those decisions were."})}),`
`,e.jsx(n.hr,{}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Commits referenced"}),": ",e.jsx(n.code,{children:"b79fe88"})," (SearchFeedback), ",e.jsx(n.code,{children:"f8eecec"})," (Activity Log)"]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Status"}),": Waiting for API support for ",e.jsx(n.code,{children:"not_understood"})," fields"]})]})}function j(s={}){const{wrapper:n}={...r(),...s.components};return n?e.jsx(n,{...s,children:e.jsx(i,{...s})}):i(s)}export{j as default};
