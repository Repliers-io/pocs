import{j as e}from"./jsx-runtime-xF634gn_.js";import{useMDXComponents as s}from"./index-o2KxC7bF.js";import{M as r}from"./index-B9VInP_e.js";import"./index-C-7etoUd.js";import"./iframe-BFm-Dita.js";import"./index-DmZMPOxo.js";import"./index-BKjiqKB3.js";import"./index-DgH-xKnr.js";import"./index-DrFu-skq.js";function i(t){const n={code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",hr:"hr",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...s(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(r,{title:"Blog & Writing/The AI Search Input"}),`
`,e.jsx(n.h1,{id:"the-ai-search-input",children:"The AI Search Input"}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"January 6-14, 2026"})," · 7 min read"]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.p,{children:"After the chatbot, I needed something simpler. Less conversation, more action. The problem wasn't NLP - the Repliers API worked great. The problem was making users type out every detail in a chat conversation."}),`
`,e.jsx(n.p,{children:"So on January 6th, I stripped it all down to the essence: a search input that auto-parses what you type."}),`
`,e.jsx(n.p,{children:'Type "3 bedroom condo in Liberty Village" and the AI would extract:'}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"🛏️ Bedrooms: 3"}),`
`,e.jsx(n.li,{children:"🏠 Type: Condo"}),`
`,e.jsx(n.li,{children:"📍 Location: Liberty Village"}),`
`]}),`
`,e.jsx(n.p,{children:"Then search automatically. No chat. No back-and-forth. The approach felt straightforward."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"the-vision-auto-magical-search",children:"The Vision: Auto-Magical Search"}),`
`,e.jsx(n.p,{children:"The idea was elegant. Users already know how to use a search box. You don't need to teach them anything new. Just type naturally and let AI do the parsing."}),`
`,e.jsx(n.p,{children:"I started with the component shell on January 6th:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-jsx",children:`/**
 * AISearchInput - An expanded search interface with multiline input
 * and entity chips
 *
 * User types naturally, AI extracts structured data, displays as chips
 */
const AISearchInput = ({
  openaiApiKey,
  repliersApiKey,
  onSearchComplete
}) => {
  const [query, setQuery] = useState('');
  const { parseQuery, entities, loading } = useOpenAIParser(openaiApiKey);
  const { executeSearch, results } = useRepliersNLP(repliersApiKey);

  // Auto-parse with 500ms debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) parseQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);
`})}),`
`,e.jsx(n.p,{children:"The flow was beautiful in my mind:"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsx(n.li,{children:"User types"}),`
`,e.jsx(n.li,{children:"After 500ms pause, OpenAI extracts entities"}),`
`,e.jsx(n.li,{children:"Entities appear as colorful chips"}),`
`,e.jsx(n.li,{children:"User clicks search"}),`
`,e.jsx(n.li,{children:"Repliers NLP executes the search"}),`
`]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"january-8th-the-complete-implementation",children:'January 8th: The "Complete" Implementation'}),`
`,e.jsx(n.p,{children:"Two days later, I pushed the commit I thought was the finished product:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-bash",children:`feat(ai-search): Add complete AI-powered property search integration

Features:
- useRepliersNLP hook for two-step property search (NLP → Listings API)
- Auto-parsing with OpenAI entity extraction (500ms debounce)
- Dynamic entity chips with emoji icons and priority sorting
- Conversation context management with nlpId persistence
- Multiple loading states (analyzing, searching) with user feedback
- Comprehensive API key validation (format + runtime auth detection)
- Error UI with helpful messages and disabled states
`})}),`
`,e.jsx(n.p,{children:"I was proud of this. Real-time entity extraction. Smart debouncing. Beautiful error handling. API key validation."}),`
`,e.jsx(n.p,{children:"The UI would show:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`┌─────────────────────────────────────────────┐
│  "3 bedroom condo in Liberty Village"      │
└─────────────────────────────────────────────┘

✨ AI Search detected:
┌────────────┬────────────┬──────────────────┐
│ 🛏️ 3 beds  │ 🏠 Condo   │ 📍 Liberty V...  │
└────────────┴────────────┴──────────────────┘

Be inspired:
[Modern kitchen] [Near subway] [Pet friendly]

Or try searching for:
[3br condo downtown] [House with backyard]
`})}),`
`,e.jsx(n.p,{children:"It looked polished. It felt futuristic. Then I watched people actually use it."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"the-problems-start-to-surface",children:"The Problems Start to Surface"}),`
`,e.jsx(n.p,{children:"I showed it to a few people. Here's what happened:"}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Attempt 1:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:'User types: "3 bedroom condo Liberty Village"'}),`
`,e.jsx(n.li,{children:"Chips appear: 🛏️ 3 beds | 🏠 Condo | 📍 Liberty Village"}),`
`,e.jsx(n.li,{children:'User: "Cool... now what do I do with these chips?"'}),`
`,e.jsx(n.li,{children:'Me: "Click search!"'}),`
`,e.jsx(n.li,{children:'User: "I could have just clicked dropdowns for bedrooms and property type..."'}),`
`]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Attempt 2:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:'User types: "3 bedroom"'}),`
`,e.jsx(n.li,{children:"Chips appear: 🛏️ 3 beds"}),`
`,e.jsx(n.li,{children:'User types more: "condo"'}),`
`,e.jsx(n.li,{children:"Chips update: 🛏️ 3 beds | 🏠 Condo"}),`
`,e.jsx(n.li,{children:`User: "Why is it updating while I'm typing? That's distracting"`}),`
`,e.jsxs(n.li,{children:["Me: ",e.jsx(n.em,{children:"adjusts debounce timing"})]}),`
`]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Attempt 3:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:'User types: "house with pool under 800k"'}),`
`,e.jsx(n.li,{children:"OpenAI extracts: 🏠 House | 💰 Under $800k"}),`
`,e.jsx(n.li,{children:"Missing: pool"}),`
`,e.jsx(n.li,{children:`User: "It didn't catch 'pool'"`}),`
`,e.jsx(n.li,{children:'Me: "Oh, let me add pool to the entity extraction..."'}),`
`]}),`
`,e.jsx(n.p,{children:"I was playing whack-a-mole with edge cases."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"january-14th-another-approach",children:"January 14th: Another Approach"}),`
`,e.jsx(n.p,{children:"Something felt off. I'd invested a week in the entity chips approach. Maybe the issue was the presentation?"}),`
`,e.jsx(n.p,{children:"The entity chips felt jarring - they'd pop in suddenly, changing the whole UI. So I tried a different approach:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-bash",children:`feat: refactor AISearchInput for subtle AI-assisted suggestions

Changes:
- Remove AI Search ✨ entity chips section (indigo chips with borders)
- Keep same "Be inspired" and "Or try searching for" sections
- Dynamically update suggestion content based on parsed entities
- Add subtle sparkle indicator (50% opacity) when AI-enhanced
- Replace getEntityChips() with getAISuggestions() function

Benefits:
- More elegant UX without jarring transitions
- AI feels naturally integrated, not bolted on
- Progressive enhancement with graceful fallbacks
- Users may not even notice AI is helping (good design)
`})}),`
`,e.jsx(n.p,{children:'I rewrote the rendering logic to be "subtle":'}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-jsx",children:`const getAISuggestions = useCallback(() => {
  if (!parsedEntities || Object.keys(parsedEntities).length === 0) {
    return {
      inspirations: INSPIRATION_CHIPS,
      examples: SEARCH_EXAMPLES,
      hasAIAssist: false
    };
  }

  // Dynamically generate suggestions based on parsed entities
  // Make it feel natural, not forced
  // Users shouldn't even notice the AI...
`})}),`
`,e.jsx(n.p,{children:"I wrote that last line and paused."}),`
`,e.jsx(n.p,{children:e.jsx(n.em,{children:`"Users shouldn't even notice the AI"`})}),`
`,e.jsx(n.p,{children:"If the AI is so subtle users don't notice it's helping... is it actually adding value?"}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"the-realization",children:"The Realization"}),`
`,e.jsx(n.p,{children:"I opened the codebase stats:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`src/components/AISearchInput/
├── AISearchInput.jsx (391 lines)
├── constants.js (156 lines)
├── MapSearchPOC/ (1,211 lines)
└── hooks/
    └── useOpenAIParser.js (143 lines)
`})}),`
`,e.jsx(n.p,{children:"Nearly 2,000 lines of code for a search input that:"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsx(n.li,{children:"Still required typing (tedious)"}),`
`,e.jsxs(n.li,{children:["Had no spatial context (where ",e.jsx(n.em,{children:"is"})," Liberty Village?)"]}),`
`,e.jsx(n.li,{children:"Needed a map anyway (to show results)"}),`
`,e.jsx(n.li,{children:"Added OpenAI API calls (extra latency, extra cost)"}),`
`,e.jsx(n.li,{children:'Could miss entities ("pool" not detected)'}),`
`,e.jsx(n.li,{children:"Required two API keys (OpenAI + Repliers)"}),`
`]}),`
`,e.jsx(n.p,{children:"Meanwhile, my existing map-listings component had:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Visual map exploration"}),`
`,e.jsx(n.li,{children:"Click-to-filter"}),`
`,e.jsx(n.li,{children:"Immediate feedback"}),`
`,e.jsx(n.li,{children:"Single API (Repliers only)"}),`
`]}),`
`,e.jsx(n.p,{children:"The AI Search Input was solving a problem that didn't exist by introducing problems that did."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"the-shift",children:"The Shift"}),`
`,e.jsx(n.p,{children:"January 23rd, I opened my editor and typed:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-bash",children:`poc update: AISearch + Map
`})}),`
`,e.jsx(n.p,{children:"I created a rough proof-of-concept combining the AI input with a map. Something clicked:"}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"The map was the interface."})," Not the search box."]}),`
`,e.jsx(n.p,{children:"Users wanted to:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["See ",e.jsx(n.em,{children:"where"})," properties are"]}),`
`,e.jsxs(n.li,{children:["Explore ",e.jsx(n.em,{children:"visually"})]}),`
`,e.jsxs(n.li,{children:["Refine ",e.jsx(n.em,{children:"spatially"})]}),`
`]}),`
`,e.jsxs(n.p,{children:["The search box should ",e.jsx(n.em,{children:"enhance"})," the map, not replace it."]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"january-29th-the-commit",children:"January 29th: The Commit"}),`
`,e.jsx(n.p,{children:"When I committed the hybrid map-listings component, the diff told the story:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-bash",children:`feat: add AI-powered map listings component with NLP search

 src/components/AISearchInput/AISearchInput.jsx     | 391 ------
 src/components/AISearchInput/constants.js          | 156 ---
 src/components/AISearchInput/MapSearchPOC/...      | 1211 ----

 46 files changed, 8626 insertions(+), 2016 deletions(-)
`})}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"2,016 lines deleted."})}),`
`,e.jsx(n.p,{children:"Everything I'd built in the AISearchInput - gone. The OpenAI integration - gone. The entity chips - gone. The subtle suggestions - gone."}),`
`,e.jsx(n.p,{children:"The code cleared. The path forward became visible."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"what-i-learned",children:"What I Learned"}),`
`,e.jsx(n.h3,{id:"1-better-presentation-doesnt-fix-a-mismatch-in-interface",children:"1. Better Presentation Doesn't Fix a Mismatch in Interface"}),`
`,e.jsx(n.p,{children:"I tried two major refactors:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"January 8th: Make it complete and robust"}),`
`,e.jsx(n.li,{children:"January 14th: Make it subtle and elegant"}),`
`]}),`
`,e.jsx(n.p,{children:"Both focused on presentation. The deeper question was whether text-based search matched the spatial, exploratory nature of finding a home."}),`
`,e.jsx(n.h3,{id:"2-when-youre-fighting-the-ui-listen",children:"2. When You're Fighting the UI, Listen"}),`
`,e.jsxs(n.p,{children:["When I wrote ",e.jsx(n.em,{children:'"AI feels naturally integrated, not bolted on"'})," in my commit message, I was working hard to justify the approach."]}),`
`,e.jsx(n.p,{children:"If integration feels forced, that's signal worth paying attention to."}),`
`,e.jsx(n.h3,{id:"3-two-apis-are-worse-than-one",children:"3. Two APIs Are Worse Than One"}),`
`,e.jsx(n.p,{children:"The architecture required:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"OpenAI for entity extraction"}),`
`,e.jsx(n.li,{children:"Repliers NLP for search"}),`
`]}),`
`,e.jsxs(n.p,{children:["But Repliers NLP ",e.jsx(n.em,{children:"already does entity extraction"}),". I was adding complexity for no benefit."]}),`
`,e.jsx(n.p,{children:"Later, I'd discover that Repliers NLP even returns lat/long coordinates. I could have saved myself a week of work by just... reading the API response more carefully."}),`
`,e.jsx(n.h3,{id:"4-deleted-code-is-progress",children:"4. Deleted Code Is Progress"}),`
`,e.jsx(n.p,{children:"Those 2,016 deleted lines weren't wasted effort. They taught me:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"What doesn't work"}),`
`,e.jsx(n.li,{children:"Why it doesn't work"}),`
`,e.jsx(n.li,{children:"What would work instead"}),`
`]}),`
`,e.jsx(n.p,{children:"The hybrid map I built next was informed by this exploration."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"the-bridge-forward",children:"The Bridge Forward"}),`
`,e.jsx(n.p,{children:"The AI Search Input had one good idea buried in all the complexity:"}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Natural language can express intent faster than clicking through filters."})}),`
`,e.jsx(n.p,{children:'"3 bedroom condo in Liberty Village under 800k" captures everything in one line. But that intent needs to translate into a spatial interface, not stay in a text box.'}),`
`,e.jsx(n.p,{children:"Which brings us to Week 3: the hybrid approach that actually worked."}),`
`,e.jsx(n.hr,{}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Commits referenced"}),": ",e.jsx(n.code,{children:"58445b9"}),", ",e.jsx(n.code,{children:"4ac6366"}),", ",e.jsx(n.code,{children:"d833e38"}),", ",e.jsx(n.code,{children:"b0cccf7"}),", ",e.jsx(n.code,{children:"0bfe16e"}),", ",e.jsx(n.code,{children:"a359e03"})]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Next"}),": Week 3: Finding the Hybrid - NLP-Powered Map Search →"]})]})}function j(t={}){const{wrapper:n}={...s(),...t.components};return n?e.jsx(n,{...t,children:e.jsx(i,{...t})}):i(t)}export{j as default};
