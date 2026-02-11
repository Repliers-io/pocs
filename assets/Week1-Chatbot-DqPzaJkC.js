import{j as e}from"./jsx-runtime-xF634gn_.js";import{useMDXComponents as r}from"./index-o2KxC7bF.js";import{M as i}from"./index-Dfyw6FsB.js";import"./index-C-7etoUd.js";import"./iframe-ByaOWpFT.js";import"./index-DmZMPOxo.js";import"./index-BKjiqKB3.js";import"./index-DgH-xKnr.js";import"./index-DrFu-skq.js";function s(t){const n={a:"a",blockquote:"blockquote",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",hr:"hr",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...r(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(i,{title:"Blog & Writing/1. Why I Built a Real Estate Chatbot"}),`
`,e.jsx(n.h1,{id:"why-i-built-a-real-estate-chatbot-and-why-it-was-just-ok",children:"Why I Built a Real Estate Chatbot (And Why It Was Just OK)"}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"November 24 - December 23, 2025"})," · 8 min read"]}),`
`,e.jsx(n.hr,{}),`
`,e.jsxs(n.p,{children:["It was late November when I opened a new branch and typed: ",e.jsx(n.code,{children:"git checkout -b feature/chatbot-poc-shell"}),". ChatGPT had just gone viral again, everyone was building conversational interfaces, and I thought: ",e.jsx(n.em,{children:"why not bring this to property search?"})]}),`
`,e.jsx(n.p,{children:'Imagine typing "I want a 3 bedroom condo in Toronto under $800k" and having a natural conversation about your perfect home. No filters, no dropdowns, just... talking.'}),`
`,e.jsx(n.p,{children:"Seemed perfect. Seemed obvious."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"the-seduction-of-conversational-ui",children:"The Seduction of Conversational UI"}),`
`,e.jsx(n.p,{children:"The appeal was undeniable. In 2025, every user knows how to chat with an AI. The pattern is familiar, almost second nature. Why make users click through price sliders and bedroom checkboxes when they could just... ask?"}),`
`,e.jsx(n.p,{children:"I started simple. A floating button. A chat widget. Message bubbles. The commit from November 24th shows my initial optimism:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-bash",children:`feat(chatbot): add initial chatbot PoC shell component
`})}),`
`,e.jsx(n.p,{children:"Within two days, I had the Repliers NLP API integrated. Users could type natural language queries, and the API would parse them into structured property searches. It worked beautifully:"}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"User"}),`: "3 bedroom house in Leslieville"
`,e.jsx(n.strong,{children:"System"}),`: → Searches for 3br properties in Leslieville
`,e.jsx(n.strong,{children:"Result"}),": 47 properties displayed"]}),`
`,e.jsx(n.p,{children:"Magic. Or so I thought."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"going-deep-the-mcp-integration",children:"Going Deep: The MCP Integration"}),`
`,e.jsx(n.p,{children:"But here's where I went off the deep end. I discovered the Model Context Protocol (MCP) - a standardized way for AI models to interact with external tools and services. On December 2nd, I committed what might be the most technically ambitious (and ultimately misguided) code of the project:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-bash",children:`feat(chatbot): Add MCP server integration with embedded server
and ChatGPT orchestration

Dependencies Added:
- @modelcontextprotocol/sdk v1.0.4
- zod v3.24.1 (peer dependency)
- 88 packages for embedded MCP server
`})}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"88 packages."})," Embedded directly into the component. I even wrote in the commit message: ",e.jsx(n.em,{children:'"Enable Storybook showcase without external dependencies."'})]}),`
`,e.jsx(n.p,{children:"The architecture was beautiful:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`/**
 * Chat Runtime Hook with ChatGPT + Repliers NLP Integration
 *
 * ARCHITECTURE:
 * 1. ChatGPT handles ALL conversation and extracts search parameters
 * 2. When ChatGPT identifies a property search, it returns a query
 * 3. Repliers NLP API parses the query and executes the search
 * 4. Results are shown to user AND sent back to ChatGPT
 *
 * Flow:
 * User: "I want a 3 bedroom condo in Toronto under $800k"
 *   → ChatGPT creates query via function calling
 *   → NLP API parses and searches
 *   → Results displayed to user
 *   → ChatGPT discusses: "I found 12 condos matching your criteria..."
 */
`})}),`
`,e.jsx(n.p,{children:"ChatGPT would handle conversation. Function calling would extract search parameters. The MCP server would execute searches. Everything would flow naturally, like talking to a knowledgeable real estate agent."}),`
`,e.jsx(n.p,{children:"I spent weeks perfecting this. By December 23rd, I had a full UI redesign - modern, Claude/ChatGPT-style interface with smooth animations, typing indicators, the works."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"the-problem-emerges",children:"The Problem Emerges"}),`
`,e.jsx(n.p,{children:"Here's what actually happened when users tried it:"}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"User"}),`: "I'm looking for something in Toronto"
`,e.jsx(n.strong,{children:"Chatbot"}),`: "What type of property are you interested in?"
`,e.jsx(n.strong,{children:"User"}),`: "A condo"
`,e.jsx(n.strong,{children:"Chatbot"}),`: "How many bedrooms?"
`,e.jsx(n.strong,{children:"User"}),`: "3"
`,e.jsx(n.strong,{children:"Chatbot"}),`: "What's your budget?"
`,e.jsx(n.strong,{children:"User"}),": ",e.jsx(n.em,{children:"sighs and types"}),` "Under 800k"
`,e.jsx(n.strong,{children:"Chatbot"}),': "Let me search for you..."']}),`
`,e.jsx(n.p,{children:"Compare this to a traditional interface where they could have:"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsx(n.li,{children:'Typed "Toronto" in a search box'}),`
`,e.jsx(n.li,{children:'Clicked "3 bedrooms"'}),`
`,e.jsx(n.li,{children:"Set price slider to 800k"}),`
`,e.jsx(n.li,{children:'Clicked "Search"'}),`
`]}),`
`,e.jsx(n.p,{children:"Done in 10 seconds instead of this tedious back-and-forth."}),`
`,e.jsxs(n.p,{children:["The chat interface was ",e.jsx(n.strong,{children:"making simple tasks harder"}),"."]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"the-technical-excellence-trap",children:"The Technical Excellence Trap"}),`
`,e.jsx(n.p,{children:"The code was pristine. The architecture was sound. From my commit message:"}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:'"Key Design Decision: MCP is completely optional. The chatbot works perfectly without any MCP setup using the direct NLP API fallback, providing zero-setup Storybook demos while still showcasing the full MCP architecture for users who want it."'}),`
`]}),`
`,e.jsx(n.p,{children:"I was proud of this. Optional MCP. Graceful fallbacks. Production-ready error handling. Clean separation of concerns."}),`
`,e.jsx(n.p,{children:"But I was solving the wrong problem."}),`
`,e.jsxs(n.p,{children:["The issue wasn't that the implementation was bad - it was that ",e.jsx(n.strong,{children:"conversational UI was the wrong tool for property search"}),"."]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"why-chat-fails-for-real-estate",children:"Why Chat Fails for Real Estate"}),`
`,e.jsx(n.p,{children:"Here's what I learned after watching a few people actually try to use it:"}),`
`,e.jsx(n.h3,{id:"1-property-search-is-exploratory-not-transactional",children:"1. Property search is exploratory, not transactional"}),`
`,e.jsx(n.p,{children:"Chat is amazing for:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:'"Book me a flight to NYC"'}),`
`,e.jsx(n.li,{children:`"What's the weather tomorrow?"`}),`
`,e.jsx(n.li,{children:'"Explain quantum physics"'}),`
`]}),`
`,e.jsx(n.p,{children:"These are linear, goal-oriented tasks. But property search? That's:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:`"Let me see what's available..."`}),`
`,e.jsx(n.li,{children:'"Actually, can I look at this neighborhood instead?"'}),`
`,e.jsx(n.li,{children:'"Wait, show me houses too, not just condos"'}),`
`,e.jsx(n.li,{children:'"Hmm, what if I went up to 850k?"'}),`
`]}),`
`,e.jsxs(n.p,{children:["Users don't know exactly what they want. They want to ",e.jsx(n.strong,{children:"explore spatially"})," and ",e.jsx(n.strong,{children:"refine visually"}),". Chat forces them to articulate preferences they haven't formed yet."]}),`
`,e.jsx(n.h3,{id:"2-typing-is-tedious",children:"2. Typing is tedious"}),`
`,e.jsx(n.p,{children:"Every refinement required typing. Want to exclude properties with maintenance fees over $500? Type it out. Want to see only houses built after 2010? Type it out."}),`
`,e.jsx(n.p,{children:"Meanwhile, a slider or checkbox would take half a second."}),`
`,e.jsx(n.h3,{id:"3-chat-lacks-spatial-context",children:"3. Chat lacks spatial context"}),`
`,e.jsx(n.p,{children:'Real estate is inherently spatial. "Show me properties near the subway" means nothing without seeing a map. "Is this neighborhood good?" requires visual context.'}),`
`,e.jsx(n.p,{children:"My beautiful chat interface was trying to describe geography through text. It was like playing Battleship with your eyes closed."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"the-moment-of-clarity",children:"The Moment of Clarity"}),`
`,e.jsxs(n.p,{children:["On January 6th, I started a new branch: ",e.jsx(n.code,{children:"feature/ai-search-input"}),"."]}),`
`,e.jsx(n.p,{children:"I wasn't ready to abandon the idea entirely - maybe the problem was just the multi-turn conversation. Maybe a simpler approach would work."}),`
`,e.jsx(n.p,{children:"But in my heart, I knew. The commit message from December 4th had already told me:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-bash",children:`refactor(chatbot): Consolidate to NLP-only API,
fix UX issues, and improve Storybook docs
`})}),`
`,e.jsx(n.p,{children:`"Fix UX issues." The issues weren't bugs. They were fundamental to the interaction model.`}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"what-id-do-differently",children:"What I'd Do Differently"}),`
`,e.jsx(n.p,{children:"If I could go back and talk to November Milan, I'd say:"}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Don't build the chatbot."})," Not because it's technically wrong - the code was good. But because it solves a problem users don't have."]}),`
`,e.jsxs(n.p,{children:["Build the thing users actually need: a map they can explore visually, with an ",e.jsx(n.em,{children:"optional"})," natural language input for expressing complex criteria quickly."]}),`
`,e.jsx(n.p,{children:"ChatGPT is amazing. MCP is powerful. Function calling is elegant."}),`
`,e.jsx(n.p,{children:"But none of that matters if the user experience makes simple tasks harder."}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"the-silver-lining",children:"The Silver Lining"}),`
`,e.jsx(n.p,{children:"This wasn't wasted time. The chatbot taught me:"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Technical excellence ≠ product success"}),". Clean architecture and elegant code don't matter if the UX is wrong."]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Question the trend"}),". Everyone was building chatbots in late 2025. That didn't mean every problem needed one."]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Watch users, not metrics"}),". The chatbot ",e.jsx(n.em,{children:"worked"})," technically. But watching someone actually use it revealed the friction."]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Sunk cost fallacy is real"}),". After 88 packages and weeks of work, admitting it was the wrong direction was hard. But necessary."]}),`
`]}),`
`]}),`
`,e.jsxs(n.p,{children:["Plus, I now had a working Repliers NLP integration I could use for the ",e.jsx(n.em,{children:"right"})," interface."]}),`
`,e.jsx(n.p,{children:"Which brings me to Week 2, where I tried something simpler..."}),`
`,e.jsx(n.hr,{}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Try the chatbot"}),": ",e.jsx(n.a,{href:"/?path=/story/pocs-chatbot-real-estate-chatbot--default",children:"Chatbot Component in Storybook"})]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Commits referenced"}),": ",e.jsx(n.code,{children:"d581bf3"}),", ",e.jsx(n.code,{children:"7fc228e"}),", ",e.jsx(n.code,{children:"6f5fe87"}),", ",e.jsx(n.code,{children:"8df334a"}),", ",e.jsx(n.code,{children:"5c537ed"})]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Next"}),": Week 2: The AI Search Input - A Beautiful Failure →"]})]})}function m(t={}){const{wrapper:n}={...r(),...t.components};return n?e.jsx(n,{...t,children:e.jsx(s,{...t})}):s(t)}export{m as default};
