# Repliers Real Estate Chatbot PoC

An intelligent real estate chatbot that acts as the first point of contact for visitors to real estate brokerage websites. Built using the Model Context Protocol (MCP) and powered by Repliers API, this proof-of-concept demonstrates how AI can naturally understand property search queries and deliver personalized listing results.

## 🎯 Project Overview

This PoC creates a conversational AI assistant similar to [Zillow's ChatGPT plugin](https://www.zillowgroup.com/news/discover-zillows-plugin-on-chatgpt/), but powered by Repliers' real-time MLS data and AI capabilities.

### Key Features

- **Natural Language Understanding**: Users describe what they're looking for in plain English
- **Intelligent Search**: Leverages Repliers NLP endpoint to extract search criteria from conversational queries
- **MCP Architecture**: Uses Model Context Protocol for standardized LLM-to-API communication
- **Real-time MLS Data**: Accesses live property listings through Repliers API
- **Multi-LLM Support**: Initially built for ChatGPT, designed to work with Claude, and other LLM providers

### Example Interaction

```
User: "I'm looking for a 3 bedroom house in Toronto under $800k"
Assistant: [Analyzes query via Repliers NLP]
           [Searches listings with extracted criteria]
           "I found several options for you! Here are 5 houses in Toronto
           with 3 bedrooms under $800k..."
```

## 🏗️ Architecture

```
User Interface (Web Chat)
         ↓
    ChatGPT API
         ↓
   MCP Server (Repliers)
         ↓
   Repliers API
    ├─ NLP Endpoint (query understanding)
    └─ Listings Endpoint (property search)
```

### Technology Stack

- **MCP Server**: Node.js-based Repliers MCP Server
- **LLM Provider**: OpenAI ChatGPT (Phase 1), expandable to Claude and others
- **Frontend**: React web application (or simple HTML/JS for PoC)
- **API**: Repliers Realtime Real Estate API
  - NLP Endpoint for natural language processing
  - Listings Search & Filter API

## 📋 Prerequisites

- Node.js v20+ (required for MCP server)
- Repliers API Key ([get yours here](https://repliers.com))
- OpenAI API Key for ChatGPT integration
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Repliers-io/pocs/real-estate-chatbot
cd real-estate-chatbot
```

### 2. Set Up MCP Server

```bash
# Clone Repliers MCP Server (if not already in monorepo)
git clone https://github.com/Repliers-io/mcp-server
cd mcp-server
npm install

# Configure environment variables
cp .env.example .env
# Edit .env and add your REPLIERS_API_KEY
```

### 3. Configure ChatGPT Integration

```bash
cd ../chatbot-frontend
npm install

# Add your OpenAI API key
echo "OPENAI_API_KEY=your_openai_key" >> .env
echo "MCP_SERVER_URL=http://localhost:3000" >> .env
```

### 4. Run the Application

**Terminal 1 - Start MCP Server:**

```bash
cd mcp-server
node mcpServer.js
```

**Terminal 2 - Start Frontend:**

```bash
cd chatbot-frontend
npm start
```

Visit `http://localhost:3001` to interact with the chatbot.

## 📁 Project Structure

```
real-estate-chatbot/
├── README.md                          # This file
├── docs/
│   ├── architecture.md                # Detailed architecture documentation
│   ├── api-integration.md             # Repliers API integration guide
│   └── mcp-protocol.md                # MCP protocol explanation
├── mcp-server/                        # Repliers MCP Server (git submodule)
│   ├── mcpServer.js                   # MCP server entry point
│   ├── tools/                         # MCP tools for Repliers API
│   ├── .env                           # Environment configuration
│   └── package.json
├── chatbot-frontend/                  # Web interface
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWidget.jsx         # Main chat interface
│   │   │   ├── PropertyCard.jsx       # Listing display component
│   │   │   └── MessageBubble.jsx      # Chat message component
│   │   ├── services/
│   │   │   ├── openaiService.js       # ChatGPT API integration
│   │   │   └── mcpClient.js           # MCP client for tool calls
│   │   ├── App.jsx
│   │   └── index.js
│   ├── public/
│   ├── .env
│   └── package.json
├── tests/                             # Test suites
│   ├── mcp-integration.test.js
│   └── e2e.test.js
└── examples/                          # Example queries and responses
    └── sample-conversations.md
```

## 🔧 Configuration

### Environment Variables

**MCP Server (.env)**

```env
REPLIERS_API_KEY=your_repliers_api_key
PORT=3000
```

**Frontend (.env)**

```env
OPENAI_API_KEY=your_openai_api_key
MCP_SERVER_URL=http://localhost:3000
REACT_APP_BOT_NAME=Repliers Assistant
```

## 🎨 Customization

### Branding

Update `chatbot-frontend/src/config/branding.js`:

```javascript
export const branding = {
  primaryColor: "#your-brand-color",
  botName: "Your Brokerage Assistant",
  welcomeMessage: "Hi! I can help you find properties...",
  logoUrl: "/path/to/logo.png",
};
```

### Conversation Flow

The chatbot behavior can be customized by modifying the system prompt in `chatbot-frontend/src/services/openaiService.js`.

## 📚 API Reference

### Repliers API Endpoints Used

1. **NLP Endpoint**: `/nlp`

   - Extracts structured search criteria from natural language
   - [Documentation](https://help.repliers.com/en/article/utilizing-ai-powered-nlp-for-real-estate-listing-searches-1fvddra/)

2. **Listings Search**: `/listings`
   - Retrieves properties based on filter criteria
   - [Documentation](https://help.repliers.com/en/article/searching-filtering-and-pagination-guide-1q1n7x0/)

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Test MCP server connection
npm run test:mcp
```

### Manual Testing Scenarios

Test the chatbot with these queries:

- "Show me 3 bedroom condos in downtown Toronto"
- "I need a house with a backyard, under $900k"
- "What's available in Leslieville with 2+ bathrooms?"
- "Find me properties near subway stations"

## 🚢 Deployment

### Deploy MCP Server

```bash
# Using Docker
cd mcp-server
docker build -t repliers-mcp-server .
docker run -p 3000:3000 -e REPLIERS_API_KEY=your_key repliers-mcp-server
```

### Deploy Frontend

```bash
# Build for production
cd chatbot-frontend
npm run build

# Deploy to Vercel/Netlify/your hosting provider
```

## 🔮 Future Enhancements

- [ ] Add Claude integration for multi-LLM support
- [ ] Implement conversation memory across sessions
- [ ] Add property comparison features
- [ ] Integrate mortgage calculator
- [ ] Support for voice input/output
- [ ] Lead capture and CRM integration
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Add market analytics and neighborhood insights

## 🤝 Contributing

This is an internal PoC. For questions or contributions, contact the development team.

## 📖 Resources

- [Repliers API Documentation](https://help.repliers.com)
- [Repliers MCP Server](https://github.com/Repliers-io/mcp-server)
- [Model Context Protocol Specification](https://modelcontextprotocol.io)
- [OpenAI Chat Completions API](https://platform.openai.com/docs/api-reference/chat)
- [Zillow ChatGPT Plugin Case Study](https://www.zillowgroup.com/news/discover-zillows-plugin-on-chatgpt/)

## 📄 License

Internal use only - Repliers Inc.

## 👥 Team

Built with ❤️ by the Repliers Innovation Team

**Project Lead**: Milan (milan@repliers.com)

---

**Status**: Proof of Concept (Active Development)
**Last Updated**: November 2025
