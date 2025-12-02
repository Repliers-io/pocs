# Quick Start Guide

## 🚀 Try It in 30 Seconds (Storybook)

```bash
npm run storybook
```

Navigate to: **"With ChatGPT + MCP Architecture (Step 4 Complete!)"**

1. **Add OpenAI API key** in controls
2. **Start chatting**:
   - "Hi!"
   - "I want a 3 bedroom condo in Toronto under $800k"
   - "Tell me about the first one"

**That's it!** Uses NLP API fallback - no MCP setup needed.

---

## 💻 Use in Your App

### Basic Usage (Recommended)

```tsx
import { Chatbot } from "@/components/chatbot";

<Chatbot
  repliersApiKey="your_repliers_api_key"
  openaiApiKey="your_openai_api_key"
  brokerageName="Your Brokerage"
/>
```

✅ Works perfectly - uses ChatGPT + NLP API

### With MCP (Optional)

```tsx
<Chatbot
  repliersApiKey="your_repliers_api_key"
  openaiApiKey="your_openai_api_key"
  mcpConfig={{
    enabled: true,
    nodePath: "/path/to/node",        // which node
    serverPath: "/path/to/mcpServer.js"
  }}
/>
```

Setup MCP server first:
```bash
cd src/components/chatbot/mcp-server
echo "REPLIERS_API_KEY=your-key" > .env
```

---

## 🎯 What You Get

- ✅ **Natural Conversation** - ChatGPT handles all dialogue
- ✅ **Smart Search** - Extracts parameters from conversation
- ✅ **Property Results** - Beautiful cards with images
- ✅ **Works Anywhere** - Mobile + desktop responsive
- ✅ **No MCP Required** - Direct API fallback

---

## 📖 Full Documentation

- [Complete README](./readme.md)
- [Step 4 Summary](./STEP-4-SUMMARY.md)
- [MCP Integration Guide](./mcp-server/INTEGRATION.md)

---

**Need Help?** Check the README or Storybook stories for examples!
