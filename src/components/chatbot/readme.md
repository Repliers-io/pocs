# Repliers Real Estate Chatbot PoC

A modern, interactive real estate chatbot widget built as a Storybook component. Features a floating chat button and conversational interface designed for property search assistance on brokerage websites.

## 🎯 Overview

This PoC provides a production-ready chat widget component that can be embedded into any real estate website. Built with React, TypeScript, and Tailwind CSS, it offers a warm, inviting interface for visitors to search properties through natural conversation.

**Current Status**: UI Foundation Complete (Phase 1)
**Next Phase**: MCP Integration for live property search

## ✨ Features

### Current Implementation (v1.0)

- 🏠 **Floating Action Button** - Animated button with smooth hover effects and position options
- 💬 **Chat Interface** - Modal panel with professional, warm design
- 📱 **Fully Responsive** - Full-screen on mobile, elegant panel on desktop
- 🎨 **White-Label Ready** - Customizable branding (logo, name, colors, messages)
- ♿ **Accessible** - ARIA labels, keyboard navigation, semantic HTML
- ⚡ **Mock Runtime** - Simulated responses for testing (MCP integration ready)
- 📚 **Storybook Stories** - Multiple demos showcasing different configurations

### Coming Soon (Phase 2 - MCP Integration)

- 🔗 **Repliers MCP Server** - Connect to real-time MLS data
- 🧠 **Natural Language Processing** - Repliers NLP API for query understanding
- 🏡 **Property Search** - Live listing results based on conversation
- 💾 **Conversation Memory** - Persistent chat history across sessions
- 📊 **Property Cards** - Rich listing display with images and details

## 🚀 Quick Start

### View in Storybook

```bash
npm run storybook
```

Navigate to: **pocs → Chatbot → Real Estate Chatbot**

### Use in Your Application

```tsx
import { Chatbot } from "@/components/chatbot";

function App() {
  return (
    <div>
      {/* Your page content */}

      <Chatbot
        brokerageName="Acme Realty"
        brokerageLogo="/logo.png"
        position="bottom-right"
        welcomeMessage="Hi! I'm here to help you find your perfect home."
      />
    </div>
  );
}
```

## 📁 Component Structure

```
src/components/chatbot/
├── types/
│   └── index.ts                    # TypeScript interfaces
├── utils/
│   └── constants.ts                # Default values and labels
├── hooks/
│   └── useChatRuntime.ts          # Mock runtime (MCP integration point)
├── components/
│   ├── FloatingButton.tsx         # Floating action button
│   └── ChatWidget.tsx             # Main chat interface
├── chatbot.tsx                     # Main component
├── chatbot.stories.tsx            # Storybook stories
├── index.ts                        # Public exports
└── readme.md                       # This file
```

## 🎨 Customization

### Component Props

```typescript
interface ChatbotProps {
  brokerageName?: string;           // "Real Estate Assistant"
  brokerageLogo?: string;           // URL to logo image
  primaryColor?: string;            // "#3B82F6" (future feature)
  position?: "bottom-right" | "bottom-left";  // "bottom-right"
  welcomeMessage?: string;          // Custom greeting
  placeholder?: string;             // Input placeholder text
}
```

### Example Configurations

**Basic Usage:**
```tsx
<Chatbot />
```

**Custom Branding:**
```tsx
<Chatbot
  brokerageName="Downtown Realty"
  brokerageLogo="https://example.com/logo.png"
  welcomeMessage="Welcome! Tell me what you're looking for."
  placeholder="e.g., 2 bed condo with parking..."
/>
```

**Left Position:**
```tsx
<Chatbot position="bottom-left" />
```

## 🏗️ Architecture

### Current (Phase 1 - UI Foundation)

```
React Component (Chatbot)
    ├── FloatingButton
    └── ChatWidget
        └── useChatRuntime (mock)
            └── Mock responses
```

### Future (Phase 2 - MCP Integration)

```
React Component (Chatbot)
    ├── FloatingButton
    └── ChatWidget
        └── useChatRuntime
            └── MCP Server (Repliers)
                └── Repliers API
                    ├─ NLP Endpoint (query understanding)
                    └─ Listings Endpoint (property search)
```

## 🔧 Development

### Prerequisites

- Node.js v20+
- npm or yarn
- This POCs repository

### Install Dependencies

```bash
npm install
```

Already includes:
- `@assistant-ui/react` - Chat UI primitives
- `lucide-react` - Icons
- `tailwindcss` - Styling

### Run Storybook

```bash
npm run storybook
```

### Build

```bash
npm run build
```

## 🧪 Testing

### Storybook Stories

1. **Default** - Standard chatbot with default settings
2. **Custom Branding** - Example with brokerage name and logo
3. **Left Positioned** - Button on bottom-left
4. **Alternative Branding** - Different styling example
5. **Mobile View** - Mobile viewport demonstration
6. **In Context** - Embedded in mock real estate website

### Manual Testing Checklist

- [ ] Floating button appears in correct position
- [ ] Button animates on hover (scale effect)
- [ ] Click button to open chat widget
- [ ] Widget opens with smooth animation
- [ ] Welcome message displays correctly
- [ ] Type and send a message
- [ ] Mock response appears after 1 second
- [ ] Loading indicator shows while waiting
- [ ] Close button (X) closes the widget
- [ ] Test on mobile viewport (full-screen mode)
- [ ] Test keyboard navigation (Tab, Enter, Escape)

### Test Queries (for future MCP integration)

```
- "Show me 3 bedroom condos in downtown Toronto"
- "I need a house with a backyard, under $900k"
- "What's available in Leslieville with 2+ bathrooms?"
- "Find me properties near subway stations"
- "2 bed 2 bath condo with parking under $700k"
```

## 🔮 Roadmap

### Phase 1: UI Foundation ✅ COMPLETE
- [x] Floating action button component
- [x] Chat widget modal/panel
- [x] Responsive design (mobile + desktop)
- [x] Customizable branding
- [x] Mock runtime for testing
- [x] Storybook stories
- [x] TypeScript types
- [x] Accessibility features

### Phase 2: MCP Integration (Next)
- [ ] Connect to Repliers MCP Server
- [ ] Integrate Repliers NLP API
- [ ] Real property search functionality
- [ ] Property card components
- [ ] Handle listing results display
- [ ] Error handling and loading states

### Phase 3: Enhanced Features
- [ ] Conversation memory/history
- [ ] Property comparison
- [ ] Favorite/save properties
- [ ] Share conversation via email
- [ ] Agent handoff for human support
- [ ] Analytics and tracking
- [ ] Custom theming (primaryColor support)

### Phase 4: Advanced
- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Mortgage calculator integration
- [ ] Neighborhood insights
- [ ] School district information
- [ ] Lead capture and CRM integration

## 📚 Resources

- [Repliers API Documentation](https://help.repliers.com)
- [Repliers MCP Server](https://github.com/Repliers-io/mcp-server)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [@assistant-ui/react](https://www.assistant-ui.com/)
- [Zillow ChatGPT Plugin Case Study](https://www.zillowgroup.com/news/discover-zillows-plugin-on-chatgpt/)

## 🐛 Known Issues

- `primaryColor` prop is accepted but not yet applied (planned for Phase 3)
- Mock runtime always returns same response (will be replaced with MCP)

## 💡 Tips

**For Developers:**
- Look for `// TODO:` comments in code for MCP integration points
- Mock runtime is in `hooks/useChatRuntime.ts`
- All styling uses Tailwind - customize in component files
- Component is designed to work as a singleton (one per page)

**For Designers:**
- Customize colors in component files (search for `blue-600`, `blue-700`)
- Adjust spacing, shadows, and rounded corners via Tailwind classes
- Logo displays at 40x40px in header
- Mobile breakpoint is `md:` (768px)

## 👥 Team

Built by the Repliers Innovation Team

**Project Lead**: Milan (milan@repliers.com)

---

**Status**: Phase 1 Complete - UI Foundation Ready
**Last Updated**: November 2025
**Version**: 1.0.0
