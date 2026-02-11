import{j as e}from"./jsx-runtime-xF634gn_.js";import{useMDXComponents as r}from"./index-o2KxC7bF.js";import{M as s}from"./index-Dfyw6FsB.js";import"./index-C-7etoUd.js";import"./iframe-ByaOWpFT.js";import"./index-DmZMPOxo.js";import"./index-BKjiqKB3.js";import"./index-DgH-xKnr.js";import"./index-DrFu-skq.js";function i(t){const n={a:"a",blockquote:"blockquote",code:"code",em:"em",h1:"h1",h2:"h2",hr:"hr",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...r(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(s,{title:"Blog & Writing/4. Pondering on NLP Experimentation"}),`
`,e.jsx(n.h1,{id:"pondering-on-nlp-experimentation",children:"Pondering on NLP Experimentation"}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"November 2024 - February 2026"})," · 12 min read"]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.p,{children:"Three months. Three major approaches. Two complete rewrites. 2,016 lines of deleted code."}),`
`,e.jsx(n.p,{children:"And one working solution."}),`
`,e.jsx(n.p,{children:"I opened my git history the other day to write this post. Scrolling through the commits felt like reading a diary of bad decisions:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-bash",children:`Nov 24: feat(chatbot): add initial chatbot PoC shell component
Dec 2:  feat(chatbot): Add MCP server integration (88 packages)
Dec 23: refactor(chatbot): Complete UI redesign
Jan 6:  feat(components): Add AISearchInput component
Jan 8:  feat(ai-search): Add complete AI-powered property search
Jan 14: feat: refactor AISearchInput for subtle AI-assisted suggestions
Jan 23: poc update: AISearch + Map
Jan 29: feat: add AI-powered map listings (8,626 insertions, 2,016 deletions)
Feb 1:  feat: optimize NLP response usage and add search feedback UI
`})}),`
`,e.jsx(n.p,{children:"Each commit message so confident. So sure this time would work."}),`
`,e.jsx(n.p,{children:"Spoiler: most of them didn't."}),`
`,e.jsx(n.p,{children:"But I learned more from what failed than what succeeded. Here's what three months of experimentation taught me."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"the-technology-trap",children:"The Technology Trap"}),`
`,e.jsx(n.p,{children:"I spent the first month building a chatbot because ChatGPT was everywhere in late 2025. Everyone was adding conversational UI. It seemed like the future."}),`
`,e.jsx(n.p,{children:`I didn't ask "do users need this?" I asked "how can I use this cool tech?"`}),`
`,e.jsx(n.p,{children:"Wrong question."}),`
`,e.jsxs(n.p,{children:["The real question should have been: ",e.jsx(n.strong,{children:"How do people actually search for homes?"})]}),`
`,e.jsxs(n.p,{children:["They don't want to have a conversation. They want to see a map, explore visually, and refine spatially. Property search is about ",e.jsx(n.em,{children:"place"}),", not dialogue."]}),`
`,e.jsx(n.p,{children:"But I was so excited about the technology - ChatGPT, MCP Server integration, function calling - that I let it dictate the interface. I built what was technically impressive instead of what was actually useful."}),`
`,e.jsx(n.p,{children:"The hybrid map solution worked because I finally asked what users needed first, then chose technology to support that. Not the other way around."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"when-i-finally-understood-intent",children:"When I Finally Understood Intent"}),`
`,e.jsx(n.p,{children:'"Book a flight to NYC next Thursday."'}),`
`,e.jsx(n.p,{children:"That's a good use case for conversational UI. It's linear. Goal-oriented. You know what you want."}),`
`,e.jsx(n.p,{children:"But property search?"}),`
`,e.jsx(n.p,{children:'"I want a 3 bedroom condo in Liberty Village under $800k. Actually, maybe High Park? Or what if I went up to $850k? Wait, show me houses too."'}),`
`,e.jsx(n.p,{children:`That's not a conversation. That's exploration. Discovery. "I'll know it when I see it."`}),`
`,e.jsx(n.p,{children:"I tried to force exploratory tasks into a conversational model. It's like shopping for clothes over the phone - technically possible, but why would you want to?"}),`
`,e.jsx(n.p,{children:`The chatbot made me type out every refinement. "Actually, can you show me 2 bedrooms instead?" The AI search input still required articulating preferences I hadn't formed yet.`}),`
`,e.jsx(n.p,{children:"The map let me just... look. Pan around. See what's available. Adjust on the fly."}),`
`,e.jsx(n.p,{children:"Different tasks need different interaction models. Took me three months to figure that out."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"88-packages-and-a-month-ill-never-get-back",children:"88 Packages and a Month I'll Never Get Back"}),`
`,e.jsx(n.p,{children:"December 2nd. I hit commit on the MCP server integration."}),`
`,e.jsx(n.p,{children:"88 packages. Full orchestration between ChatGPT, function calling, and the Repliers API. The architecture was beautiful. Optional MCP. Graceful fallbacks. Zero-setup Storybook demos."}),`
`,e.jsx(n.p,{children:"I remember writing the commit message with genuine pride."}),`
`,e.jsx(n.p,{children:"And then users started actually trying it."}),`
`,e.jsx(n.p,{children:"The feedback was clear: the chatbot was tedious. The back-and-forth conversation slowed them down. They'd rather just click dropdowns."}),`
`,e.jsxs(n.p,{children:["But I'd invested weeks. 88 packages. All that architecture. Surely I could ",e.jsx(n.em,{children:"fix"})," the UX without throwing it all away?"]}),`
`,e.jsx(n.p,{children:"So I spent another month trying to make the chatbot paradigm work. Better prompts. Smarter conversation flow. UI tweaks."}),`
`,e.jsx(n.p,{children:"It took until January 6th - over a month later - to even try a different approach."}),`
`,e.jsx(n.p,{children:"The code was good. The architecture was sound. But I was solving the wrong problem, and all the clean code in the world couldn't fix that."}),`
`,e.jsx(n.p,{children:"Sunk cost fallacy is real. And I fell for it completely."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"the-moment-i-actually-watched-someone-use-it",children:"The Moment I Actually Watched Someone Use It"}),`
`,e.jsx(n.p,{children:'I tested the AI search input extensively. Worked great. Type "3 bedroom condo," entity chips appear, click search, done. Smooth!'}),`
`,e.jsx(n.p,{children:"Then I showed it to someone."}),`
`,e.jsx(n.p,{children:'They typed "3 bedroom condo Liberty Village." The entity chips appeared.'}),`
`,e.jsx(n.p,{children:"They stared at the chips."}),`
`,e.jsx(n.p,{children:'"Now what?"'}),`
`,e.jsx(n.p,{children:'"Click search!"'}),`
`,e.jsx(n.p,{children:'"Why? I could have just clicked dropdowns for bedrooms and property type. This seems like extra steps."'}),`
`,e.jsx(n.p,{children:"Oh."}),`
`,e.jsx(n.p,{children:"I'd been testing by using the components myself. And because I built them, I knew exactly how they were supposed to work. The interaction model made perfect sense to me."}),`
`,e.jsx(n.p,{children:`But watching someone else revealed all the friction I'd been blind to. The confusion. The impatience. The "why am I typing when clicking is faster?"`}),`
`,e.jsx(n.p,{children:"The components worked technically. But users didn't need what they provided."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"that-commit-message-i-wish-i-could-delete",children:"That Commit Message I Wish I Could Delete"}),`
`,e.jsx(n.p,{children:"January 14th. I was refactoring the AI search input for the second time."}),`
`,e.jsx(n.p,{children:"The entity chips felt jarring. They'd pop in suddenly, changing the whole UI. Users said it was distracting."}),`
`,e.jsx(n.p,{children:'So I rewrote it to be "subtle." The commit message said:'}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:'"Benefits: AI feels naturally integrated, not bolted on. Users may not even notice AI is helping (good design)."'}),`
`]}),`
`,e.jsxs(n.p,{children:['I wrote that. Actually wrote "users may not even notice AI is helping" and thought it was a ',e.jsx(n.em,{children:"good thing"}),"."]}),`
`,e.jsx(n.p,{children:"If users don't notice the AI is helping... what's the point of the AI?"}),`
`,e.jsx(n.p,{children:"I was fighting my own UI, trying to make something fundamentally flawed feel natural through clever design tricks. Removing the jarring transitions. Making it subtle. Hiding the AI."}),`
`,e.jsx(n.p,{children:`When you're optimizing for "users won't notice your feature exists," you're not fixing a UX problem. You're admitting the feature shouldn't exist.`}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"the-data-that-was-there-all-along",children:"The Data That Was There All Along"}),`
`,e.jsx(n.p,{children:"I was planning my implementation. Three API calls:"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsx(n.li,{children:"NLP API to parse the query"}),`
`,e.jsx(n.li,{children:'Locations API to geocode "Liberty Village"'}),`
`,e.jsx(n.li,{children:"Listings API to get properties"}),`
`]}),`
`,e.jsx(n.p,{children:"Straightforward. Standard. I'd even started writing the geocoding logic."}),`
`,e.jsx(n.p,{children:"Then I actually looked at the NLP API response:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-json",children:`{
  "search_url": "https://api.repliers.io/listings?...",
  "summary": "3 bedroom condos in Liberty Village under $800,000",
  "locations": [
    {
      "name": "Liberty Village",
      "center": [43.639, -79.403],
      "zoom": 14,
      "geometry": { "type": "Polygon", "coordinates": [...] }
    }
  ]
}
`})}),`
`,e.jsx(n.p,{children:"Wait."}),`
`,e.jsx(n.p,{children:"It already returns coordinates. And zoom level. And boundaries."}),`
`,e.jsx(n.p,{children:"I'd been using this API for months and somehow missed that the location data was right there."}),`
`,e.jsx(n.p,{children:"One API call instead of three. The smooth map-centering that makes the hybrid approach work? Only possible because the API design included everything needed."}),`
`,e.jsx(n.p,{children:"If the NLP response had only returned a search URL, I'd have needed that geocoding step. More latency. More complexity. Worse UX."}),`
`,e.jsx(n.p,{children:"Good API design enables good user experience. I just wish I'd read the documentation more carefully from the start."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"the-component-i-almost-didnt-build",children:"The Component I Almost Didn't Build"}),`
`,e.jsx(n.p,{children:"The hybrid map was working. Type a query, map centers, filters populate. Done."}),`
`,e.jsx(n.p,{children:"I showed it to someone."}),`
`,e.jsx(n.p,{children:'They typed "3br condo in Liberty Village." The map moved. Properties appeared.'}),`
`,e.jsx(n.p,{children:"They stared at the screen."}),`
`,e.jsx(n.p,{children:'"Did it work?"'}),`
`,e.jsx(n.p,{children:'"Yeah, see the map moved to Liberty Village."'}),`
`,e.jsx(n.p,{children:'"Oh. I thought it was just loading."'}),`
`,e.jsx(n.p,{children:"Right. They had no idea what the AI understood. No feedback. No transparency. Just... stuff happened."}),`
`,e.jsx(n.p,{children:"So I added the SearchFeedback component. Almost as an afterthought, on February 1st after the main implementation."}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`<SearchFeedback
  prompt="3br condo in Liberty Village under 800k"
  summary="3 bedroom condos in Liberty Village under $800,000"
  captured={[...]}
/>
`})}),`
`,e.jsx(n.p,{children:"Shows what the AI parsed. What criteria it captured. What it might have missed."}),`
`,e.jsx(n.p,{children:"The reaction changed immediately."}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Before:"}),` "Did it work? What's it searching for?"`]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"After:"}),' "Oh, it got everything. Cool."']}),`
`,e.jsx(n.p,{children:"One small component. Changed the entire perception of the feature."}),`
`,e.jsx(n.p,{children:"Transparency builds trust. Especially with AI."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"why-hybrid-worked-when-pure-didnt",children:"Why Hybrid Worked When Pure Didn't"}),`
`,e.jsx(n.p,{children:"The chatbot was pure conversational. Failed."}),`
`,e.jsx(n.p,{children:"The AI search input was pure natural language. Failed."}),`
`,e.jsx(n.p,{children:"The hybrid map is... both. And it works."}),`
`,e.jsx(n.p,{children:'Users can type "3br in Liberty Village" if they know what they want. Or they can just pan around the map exploring neighborhoods. Or they can click price sliders and property type filters. Or all three.'}),`
`,e.jsx(n.p,{children:'No forced workflow. No "you must use the AI" or "you must use traditional filters."'}),`
`,e.jsx(n.p,{children:'I spent two months trying to make users interact with my interface the "right way." Conversational. Then natural language. Each time, forcing a single path.'}),`
`,e.jsx(n.p,{children:"The hybrid approach finally gave up on forcing anything. Want to type? Type. Want to click? Click. Want to explore visually? Explore."}),`
`,e.jsx(n.p,{children:"Turns out users like having options. Who knew?"}),`
`,e.jsx(n.p,{children:"(Everyone. Again, everyone knew this.)"}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"how-three-months-feels-both-long-and-short",children:"How Three Months Feels Both Long and Short"}),`
`,e.jsx(n.p,{children:"Three months to get it right feels like forever when you're in it."}),`
`,e.jsx(n.p,{children:"But looking back, the pace wasn't actually slow. Each failed approach taught me something:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Chatbot taught me: conversational UI is wrong for exploratory tasks"}),`
`,e.jsx(n.li,{children:"AI search input taught me: text-based is still too tedious"}),`
`,e.jsx(n.li,{children:"Hybrid map taught me: maps first, NLP second"}),`
`]}),`
`,e.jsx(n.p,{children:"Without the failures, I wouldn't have known what to build."}),`
`,e.jsx(n.p,{children:"Storybook helped. Being able to rapidly deploy and test components meant I could fail faster. Git history became my design diary - every commit a decision, a pivot, or a realization."}),`
`,e.jsx(n.p,{children:"Still. Three months. Two complete rewrites. A lot of deleted code."}),`
`,e.jsx(n.p,{children:"Could I have gotten there faster? Maybe. But I'm not sure how."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"2016-lines-ill-never-get-back-but-dont-regret",children:"2,016 Lines I'll Never Get Back (But Don't Regret)"}),`
`,e.jsx(n.p,{children:"January 29th. The commit that deleted everything."}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:` 46 files changed, 8,626 insertions(+), 2,016 deletions(-)
`})}),`
`,e.jsx(n.p,{children:"2,016 lines gone. The AI Search Input. The entity extraction. The progressive enhancement logic. The subtle suggestions refactor. All those hours of careful work."}),`
`,e.jsx(n.p,{children:"I hovered over the commit button for a while."}),`
`,e.jsx(n.p,{children:"Then I clicked it."}),`
`,e.jsx(n.p,{children:"It hurt. Not gonna lie. All that code. All those careful design decisions. The clever debouncing. The entity chip animations. Gone."}),`
`,e.jsx(n.p,{children:"But those 2,016 lines taught me things I needed to know:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Entity chips feel gimmicky (learned it)"}),`
`,e.jsx(n.li,{children:"Text-based search is tedious (learned it)"}),`
`,e.jsx(n.li,{children:"No spatial context is a dealbreaker (learned it)"}),`
`]}),`
`,e.jsx(n.p,{children:"Failed code is successful learning. Even if it doesn't feel that way when you're hitting delete."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"the-simplicity-i-couldnt-see-at-first",children:"The Simplicity I Couldn't See at First"}),`
`,e.jsx(n.p,{children:"The chatbot had:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"ChatGPT orchestration"}),`
`,e.jsx(n.li,{children:"MCP Server integration (88 packages!)"}),`
`,e.jsx(n.li,{children:"Function calling"}),`
`,e.jsx(n.li,{children:"OpenAI API"}),`
`,e.jsx(n.li,{children:"Repliers NLP API"}),`
`]}),`
`,e.jsx(n.p,{children:"The AI Search Input had:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"OpenAI entity extraction"}),`
`,e.jsx(n.li,{children:"Repliers NLP"}),`
`,e.jsx(n.li,{children:"Entity chips"}),`
`,e.jsx(n.li,{children:"Debounced parsing"}),`
`]}),`
`,e.jsx(n.p,{children:"The hybrid map has:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Repliers NLP (one API)"}),`
`,e.jsx(n.li,{children:"Map interface (already existed)"}),`
`,e.jsx(n.li,{children:"SearchFeedback component"}),`
`]}),`
`,e.jsx(n.p,{children:"The final solution is simpler. Fewer moving parts. Fewer dependencies. Fewer things to break."}),`
`,e.jsx(n.p,{children:"But I couldn't have started there. I had to go through the complexity to learn what to remove. Each failed experiment stripped away something unnecessary."}),`
`,e.jsx(n.p,{children:`88 packages → one API.
Multiple interaction models → one hybrid approach.
Forced workflows → user choice.`}),`
`,e.jsx(n.p,{children:"Sometimes you have to build the complicated thing to learn how to build the simple thing."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"what-id-tell-someone-starting-this-journey",children:"What I'd Tell Someone Starting This Journey"}),`
`,e.jsx(n.p,{children:"If you're building NLP into a product, here are the questions I wish I'd asked earlier:"}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"What's the user's mental model?"})}),`
`,e.jsx(n.p,{children:"I assumed property search was conversational because ChatGPT was hot. It's not. It's exploratory and spatial. I could have saved two months by asking this first."}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"What's the primary interface without AI?"})}),`
`,e.jsx(n.p,{children:"For property search, it's a map. Always has been. The AI should enhance that, not replace it. I kept trying to make AI the primary interface when it should have been secondary."}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Are you showing your work?"})}),`
`,e.jsx(n.p,{children:"The SearchFeedback component changed everything. Users need to see what the AI understood. Transparency builds trust. I almost didn't build it."}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Are you actually reading the API response?"})}),`
`,e.jsx(n.p,{children:"I almost added a separate geocoding API because I didn't notice the NLP response already contained coordinates. Read the full response. Seriously."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"what-id-want-my-pm-to-know",children:"What I'd Want My PM to Know"}),`
`,e.jsx(n.p,{children:"If you're working with someone building AI features, here's what would have helped me:"}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Question the interaction model early."})," Just because ChatGPT works as chat doesn't mean every product needs chat. I chased the trend instead of the user need."]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:'"Fighting the UI" is a warning sign.'}),` When I wrote that commit about making the AI "feel natural" and "users won't notice," that was me admitting the approach was wrong. I just didn't realize it yet.`]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Budget for pivots."})," First iterations usually solve for the wrong thing. I needed three attempts. That's not failure - that's learning. But it takes time."]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Deleted code is progress."})," Those 2,016 deleted lines represented weeks of work. But they enabled the right solution. That's valuable, even if it doesn't look like progress in a sprint review."]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"the-artifacts",children:"The Artifacts"}),`
`,e.jsx(n.p,{children:"All three approaches are in the codebase:"}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:e.jsx(n.a,{href:"/?path=/story/pocs-chatbot-real-estate-chatbot--default",children:"Chatbot Component"})})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"The conversational approach"}),`
`,e.jsx(n.li,{children:"MCP Server integration"}),`
`,e.jsx(n.li,{children:"ChatGPT orchestration"}),`
`,e.jsx(n.li,{children:"Beautiful, but tedious"}),`
`]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:e.jsx(n.a,{href:"/?path=/story/pocs-ai-map-listings--default",children:"AI Map Listings Component"})})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"The hybrid solution"}),`
`,e.jsx(n.li,{children:"NLP + map interface"}),`
`,e.jsx(n.li,{children:"SearchFeedback component"}),`
`,e.jsx(n.li,{children:"Actually works"}),`
`]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:e.jsx(n.a,{href:"/?path=/story/pocs-map-listings--default",children:"Map Listings Component"})})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"The proven foundation"}),`
`,e.jsx(n.li,{children:"Traditional map interface"}),`
`,e.jsx(n.li,{children:"What I built the hybrid on top of"}),`
`]}),`
`,e.jsx(n.p,{children:"Try them all. See the evolution. Learn from the failures."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"what-i-still-want-to-explore",children:"What I Still Want to Explore"}),`
`,e.jsx(n.p,{children:"These posts documented the journey. But there are deeper technical dives I'm curious about:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"MCP Server integration (even if I ended up not using it)"}),`
`,e.jsx(n.li,{children:"OpenAI function calling patterns"}),`
`,e.jsx(n.li,{children:"Natural language parsing into structured queries"}),`
`,e.jsx(n.li,{children:"Building user trust in AI features"}),`
`]}),`
`,e.jsx(n.p,{children:"Maybe I'll write about those. Or maybe I'll build something else and make completely different mistakes."}),`
`,e.jsx(n.p,{children:"Either way, I'll probably learn something."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"the-thing-i-should-have-known-from-the-start",children:"The Thing I Should Have Known From the Start"}),`
`,e.jsx(n.p,{children:"Three months. Three complete rewrites. 2,016 deleted lines."}),`
`,e.jsx(n.p,{children:"And the lesson is embarrassingly simple:"}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Technology should serve the user's mental model, not the other way around."})}),`
`,e.jsx(n.p,{children:"ChatGPT is amazing. NLP is powerful. Entity extraction is elegant."}),`
`,e.jsx(n.p,{children:"But property search is spatial and exploratory. Has been forever. Maps are the right interface. NLP should enhance that, not replace it."}),`
`,e.jsx(n.p,{children:"I knew this. Somewhere, I knew this. But I got so excited about the technology that I forgot to ask what users actually needed."}),`
`,e.jsx(n.p,{children:"Won't make that mistake again."}),`
`,e.jsx(n.p,{children:"(Probably will make completely different mistakes instead.)"}),`
`,e.jsx(n.hr,{}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Previous"}),": ",e.jsx(n.a,{href:"#",children:"← Week 3: Finding the Hybrid"})]})]})}function m(t={}){const{wrapper:n}={...r(),...t.components};return n?e.jsx(n,{...t,children:e.jsx(i,{...t})}):i(t)}export{m as default};
