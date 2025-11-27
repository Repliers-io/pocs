# Repliers Real Estate Chatbot PoC

A modern, AI-powered real estate chatbot widget built with **Repliers NLP API**. Features natural language property search, context-aware conversations, and beautiful property displays.

## 🎯 Overview

This chatbot component provides a production-ready chat widget that understands natural language queries and returns real property listings from Repliers API. Built with React, TypeScript, and Tailwind CSS.

**Current Status**: ✅ **Phase 1 & 2 Complete** - NLP Integration Ready
**Next Phase**: Step 3 - ChatGPT Integration for Enhanced Conversations

---

## ✨ Features

### Current Implementation (Phase 2)

- 🗣️ **Natural Language Search** - Users ask in plain English: "3 bedroom condo in Toronto"
- 🧠 **Repliers NLP Integration** - Powered by Repliers NLP API for query understanding
- 🔄 **Context-Aware Conversations** - Multi-turn refinement using nlpId
- 🎨 **Visual Search Support** - Search by aesthetics: "modern white kitchen"
- 🏠 **Beautiful Property Cards** - Images (via CDN), specs, and details
- 📊 **Property Results Display** - Responsive grid with show more/less
- 🏠 **Floating Action Button** - Animated button with position options
- 💬 **Chat Interface** - Modal panel with warm, inviting design
- 📱 **Fully Responsive** - Full-screen on mobile, panel on desktop
- 🎨 **White-Label Ready** - Customizable branding (logo, name, colors, messages)
- ♿ **Accessible** - ARIA labels, keyboard navigation, semantic HTML
- 🐛 **Error Handling** - Graceful error messages for API failures
- 📚 **Comprehensive Storybook** - 8 stories demonstrating all features

### Coming Soon (Step 3)

- 🤖 **ChatGPT Integration** - Enhanced conversational AI
- 💬 **Natural Responses** - GPT-4 powered chat responses
- 🎨 **Custom Theming** - Apply primaryColor to UI
- 📝 **Conversation Memory** - Persistent chat history

---

## 🚀 Quick Start

### View in Storybook

```bash
npm run storybook
```

Navigate to: **pocs → Chatbot → Real Estate Chatbot**

Try these queries:
- "3 bedroom condo in Toronto"
- "House under $800k with a backyard"
- "Modern apartment with white kitchen"

### Use in Your Application

```tsx
import { Chatbot } from "@/components/chatbot";

function App() {
  return (
    <div>
      {/* Your page content */}

      <Chatbot
        repliersApiKey="your_repliers_api_key"
        brokerageName="Acme Realty"
        brokerageLogo="/logo.png"
        position="bottom-right"
      />
    </div>
  );
}
```

---

## 📁 Component Structure

```
src/components/chatbot/
├── types/
│   └── index.ts                    # TypeScript interfaces (NLP, Listings, Props)
├── utils/
│   ├── constants.ts                # Default values and labels
│   └── errorHandling.ts            # Error messages, formatting, query detection
├── hooks/
│   └── useChatRuntime.ts          # Chat state + NLP integration
├── services/
│   └── repliersAPI.ts             # Repliers NLP Service class
├── components/
│   ├── FloatingButton.tsx         # Floating action button
│   ├── ChatWidget.tsx             # Main chat interface
│   ├── PropertyCard.tsx           # Single property display
│   └── PropertyResults.tsx        # Property grid with pagination
├── chatbot.tsx                     # Main component
├── chatbot.stories.tsx            # Storybook stories (8 stories)
├── index.ts                        # Public exports
└── readme.md                       # This file
```

---

## 🎨 Props & Customization

### Component Props

```typescript
interface ChatbotProps {
  // Required
  repliersApiKey: string;           // Your Repliers API key

  // Optional
  openaiApiKey?: string;            // Coming in Step 3
  brokerageName?: string;           // "Real Estate Assistant"
  brokerageLogo?: string;           // URL to logo image
  primaryColor?: string;            // "#3B82F6" (coming in Step 3)
  position?: "bottom-right" | "bottom-left";  // "bottom-right"
  welcomeMessage?: string;          // Custom greeting
  placeholder?: string;             // Input placeholder text
}
```

### Example Configurations

**Basic Usage:**
```tsx
<Chatbot repliersApiKey="your_key" />
```

**Custom Branding:**
```tsx
<Chatbot
  repliersApiKey="your_key"
  brokerageName="Downtown Realty"
  brokerageLogo="https://example.com/logo.png"
  welcomeMessage="Welcome! Tell me what you're looking for."
  placeholder="e.g., 2 bed condo with parking..."
/>
```

**Left Position:**
```tsx
<Chatbot
  repliersApiKey="your_key"
  position="bottom-left"
/>
```

---

## 🧠 How It Works

### Natural Language Processing Flow

```
1. User types: "3 bedroom condo in Toronto under $800k"
   ↓
2. isPropertySearchQuery() detects it's a property search
   ↓
3. RepliersNLPService.processQuery() calls NLP API
   ↓
4. NLP returns:
   - url: "api.repliers.io/listings?city=Toronto&bedrooms=3&maxPrice=800000"
   - summary: "Searching for 3 bed condo in Toronto under $800,000"
   - nlpId: "abc123" (for context)
   ↓
5. RepliersNLPService.searchListings() fetches properties
   ↓
6. PropertyResults displays cards in chat
```

### Multi-Turn Conversations

The chatbot uses **nlpId** to maintain context:

```
Turn 1: "I want a condo"           → nlpId: "abc123"
Turn 2: "3 bedrooms"               → uses nlpId "abc123" (adds to context)
Turn 3: "In Toronto"               → uses nlpId "abc123" (continues refining)
Turn 4: "Under $800k"              → uses nlpId "abc123" (final refinement)
```

Each message refines the search without losing previous context!

### Visual Search

Users can search by aesthetics:

```
User: "Condo with modern white kitchen"
  ↓
NLP extracts visual preferences
  ↓
Request includes imageSearchItems: [
  { type: "kitchen", value: "modern white", boost: 1.5 }
]
  ↓
Properties ranked by visual similarity
```

---

## 🔍 API Field Mapping & Normalization

**Important:** The Repliers Listings API returns a complex nested structure that requires normalization before display.

### Raw API Response Structure

```typescript
interface RawPropertyListing {
  mlsNumber: string;
  listPrice: number;
  address: {
    streetNumber: string;
    streetName: string;
    streetSuffix?: string;
    city: string;
    province?: string;
    postalCode?: string;
    area?: string;
    district?: string;
  };
  details: {
    numBedrooms: number;           // ⚠️ Not at root level!
    numBathrooms: number;          // ⚠️ Not at root level!
    numBedroomsPlus?: number;
    numBathroomsPlus?: number;
    propertyType: string;          // ⚠️ Not at root level!
    sqft?: string;                 // ⚠️ String, not number! "5000 +" or "1200-1400"
    description?: string;
  };
  images?: string[];               // ✅ Relative paths, need CDN prefix
  status: string;                  // ⚠️ Single letter "A" for Active
  standardStatus: string;          // ✅ Full text "Active"
  listDate?: string;
  daysOnMarket?: number;
  simpleDaysOnMarket?: number;
}
```

### Normalization Function

The `normalizeListingData()` function in `services/repliersAPI.ts` handles all field mapping:

**Field Transformations:**
1. **Bedrooms/Bathrooms**: Extract from `details.numBedrooms` → `bedrooms`
2. **Property Type**: Extract from `details.propertyType` → `propertyType`
3. **Status**: Use `standardStatus` ("Active") instead of `status` ("A")
4. **Square Feet**: Parse string `"5000 +"` or `"1200-1400"` → number
5. **Address**: Flatten nested object → simple interface
6. **Images**: Add CDN domain and size class for optimization

**Square Footage Parsing Logic:**
```typescript
// "5000 +" → 5000
// "1200-1400" → 1300 (average)
// "2500" → 2500
```

### Debugging Display Issues

During development, we encountered these common issues and fixes:

**Issue 1: Price showing "$28" instead of "$2,800,000"**
- **Cause**: Incorrect field access (was trying `listing.price` instead of `listing.listPrice`)
- **Fix**: Use correct field name from API: `listPrice`

**Issue 2: Bedrooms/Bathrooms showing "bed bath" without numbers**
- **Cause**: Fields were `undefined` - data is in nested `details` object
- **Fix**: Extract from `raw.details.numBedrooms` → `normalized.bedrooms`

**Issue 3: Property type showing "A" instead of "Multiplex"**
- **Cause 1**: Using `status` field (single letter) instead of `standardStatus`
- **Cause 2**: `propertyType` is in nested `details` object
- **Fix**: Use `raw.standardStatus` for status badge, `raw.details.propertyType` for type

**Issue 4: Square footage not displaying**
- **Cause**: API returns string like `"5000 +"`, not a number
- **Fix**: Parse with regex, handle ranges by averaging

### Images CDN Optimization

Images are optimized using Repliers CDN size classes:

```typescript
// Raw API returns relative path
raw.images[0] = "IMG-W12579198_1.jpg"

// Normalized to CDN URL with size class
normalized.images[0] = "https://cdn.repliers.io/IMG-W12579198_1.jpg?class=small"
```

Size classes:
- `small` - Fast loading for chat previews (default)
- `medium` - Detail views
- `large` - Full-screen galleries

### Console Logging for Debugging

The service logs both raw and normalized data for debugging:

```javascript
console.log("First listing (raw API response):", rawListings[0]);
console.log("First listing (normalized for UI):", {
  mlsNumber: normalized.mlsNumber,
  price: normalized.listPrice,
  bedrooms: normalized.bedrooms,
  bathrooms: normalized.bathrooms,
  sqft: normalized.sqft,
  propertyType: normalized.propertyType,
  status: normalized.status,
  address: `${normalized.address.streetNumber} ${normalized.address.streetName}, ${normalized.address.city}`,
});
```

**Tip**: Always check browser console when debugging property display issues!

---

## 🎨 UI Design Decisions

### PropertyCard Sizing

Cards have been optimized for chat display (20% smaller than standard):

**Image Section:**
- Height: `h-40` (160px) - Compact 16:9 ratio
- Badges: `text-[10px]` - Small but readable
- Loading spinner: `w-10 h-10` - Proportional

**Content Section:**
- Price: `text-xl` (20px) - Bold and prominent
- MLS #: `text-[10px]` - Small, below price
- Specs (bed/bath/sqft): `text-xs` with icons only
- Address: `text-xs` - Single line
- Button: `text-xs` - Compact CTA

**Design Philosophy:**
- Icons provide context (no "bed", "bath", "sq ft" labels needed)
- Vertical stacking for better mobile fit
- Consistent spacing with Tailwind scale
- Touch-friendly targets (min 44px tap areas)

### Mobile Responsiveness

**Chat Widget:**
- Mobile: Full-screen takeover
- Desktop: Panel overlay (400px width)
- Breakpoint: `md:` (768px)

**Property Grid:**
- Mobile: 1 column (stacked)
- Desktop: 2 columns
- Uses CSS Grid for responsive layout

---

## 🔧 Development

### Prerequisites

- Node.js v20+
- npm or yarn
- Repliers API key ([get yours here](https://repliers.com))

### Install Dependencies

```bash
npm install
```

Already includes:
- `@assistant-ui/react` - Chat UI primitives (for Step 3)
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

### Type Check

```bash
npx tsc --noEmit
```

---

## 🧪 Testing

### Storybook Stories

1. **BasicPropertySearch** - Core NLP functionality
2. **CustomBranding** - White-label demo
3. **LeftPositioned** - Button positioning
4. **MultiTurnConversation** - Context-aware refinement
5. **VisualSearch** - Aesthetic property search
6. **MobileView** - Mobile responsive design
7. **InContext** - Embedded in mock website
8. **ErrorHandling** - Error handling demo

### Manual Testing Checklist

**Basic Search:**
- [ ] Click floating button to open chat
- [ ] Type: "3 bedroom condo in Toronto"
- [ ] Verify loading message appears
- [ ] Verify property cards display
- [ ] Check console for NLP logs

**Multi-Turn Conversation:**
- [ ] Type: "I want a condo"
- [ ] Type: "3 bedrooms"
- [ ] Type: "In Toronto"
- [ ] Check console - same nlpId across messages

**Visual Search:**
- [ ] Type: "Condo with modern white kitchen"
- [ ] Check console for imageSearchItems
- [ ] Verify results prioritize visual match

**Error Handling:**
- [ ] Change API key to invalid in Storybook
- [ ] Try a search
- [ ] Verify friendly error message (no crash)

**Non-Property Queries:**
- [ ] Type: "What's the weather?"
- [ ] Verify helpful guidance message

**Mobile:**
- [ ] Switch to mobile viewport
- [ ] Chat should be full-screen
- [ ] Property cards should stack
- [ ] Touch interactions work

---

## 🔑 API Integration

### Repliers NLP Endpoint

**POST** `https://api.repliers.io/nlp`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "repliers-api-key": "your_api_key"
}
```

**Request Body:**
```json
{
  "prompt": "3 bedroom condo in Toronto",
  "nlpId": "optional_context_id"
}
```

**Response:**
```json
{
  "request": {
    "url": "https://api.repliers.io/listings?city=Toronto&bedrooms=3",
    "body": {
      "imageSearchItems": [
        { "type": "kitchen", "value": "modern", "boost": 1.5 }
      ]
    }
  },
  "nlpId": "abc123",
  "summary": "Searching for 3 bed condo in Toronto"
}
```

### Repliers Listings Endpoint

The NLP response includes the full URL with query parameters.

**Example:**
```
GET https://api.repliers.io/listings?city=Toronto&bedrooms=3&maxPrice=800000
```

**Headers:**
```json
{
  "repliers-api-key": "your_api_key"
}
```

**Response:**
```json
{
  "listings": [
    {
      "mlsNumber": "C1234567",
      "listPrice": 749000,
      "bedrooms": 3,
      "bathrooms": 2,
      "sqft": 1200,
      "address": {
        "streetNumber": "123",
        "streetName": "Main",
        "streetSuffix": "St",
        "city": "Toronto",
        "province": "ON"
      },
      "images": ["https://cdn.repliers.com/image1.jpg"],
      "propertyType": "Condo",
      "status": "Active"
    }
  ]
}
```

### Image CDN

Property images use Repliers CDN with size classes:

```typescript
// Original
"https://cdn.repliers.com/image.jpg"

// With 'small' class for chat previews (faster loading)
"https://cdn.repliers.com/image.jpg?class=small"
```

See: [Listing Images Implementation Guide](https://help.repliers.com/en/article/listing-images-implementation-guide-198p8u8/)

---

## 🐛 Error Handling

The chatbot handles these error scenarios gracefully:

### 1. Irrelevant Query (406)
```
User: "What's the weather?"
Response: "I can help you find properties! Try asking about homes, condos,
or apartments for sale. For example: '3 bedroom condo in Toronto'..."
```

### 2. API Error (401, 403, 5xx)
```
Response: "Sorry, I'm having trouble connecting to the property search
service. Please try again in a moment."
```

### 3. No Results Found
```
Response: "I couldn't find any properties matching those criteria.
Try adjusting your search."
```

### 4. Invalid API Key
```
Response: "There's an issue with the API configuration.
Please contact support."
```

All errors are logged to console with full context for debugging.

---

## 📊 Architecture

### Current (Phase 2 - NLP Integration)

```
React Component (Chatbot)
    ├── FloatingButton
    └── ChatWidget
        └── useChatRuntime
            └── RepliersNLPService
                ├─ NLP API (query understanding)
                └─ Listings API (property search)
```

### Future (Step 3 - ChatGPT Integration)

```
React Component (Chatbot)
    ├── FloatingButton
    └── ChatWidget
        └── useChatRuntime
            ├─ RepliersNLPService (property search)
            └─ OpenAI ChatGPT (conversation)
```

### Future (Step 4 - MCP Server)

```
React Component (Chatbot)
    ├── FloatingButton
    └── ChatWidget
        └── useChatRuntime
            └── MCP Client
                └── Repliers MCP Server
                    ├─ NLP Tool
                    ├─ Listings Tool
                    └─ ChatGPT Integration
```

---

## 🔮 Roadmap

### ✅ Phase 1: UI Foundation (Complete)
- [x] Floating action button component
- [x] Chat widget modal/panel
- [x] Responsive design (mobile + desktop)
- [x] Customizable branding
- [x] Mock runtime for testing
- [x] Storybook stories
- [x] TypeScript types
- [x] Accessibility features

### ✅ Phase 2: NLP Integration (Complete)
- [x] Repliers NLP Service class
- [x] Property search integration
- [x] API field normalization (`RawPropertyListing` → `PropertyListing`)
- [x] PropertyCard component (optimized sizing)
- [x] PropertyResults component
- [x] Multi-turn conversations (nlpId)
- [x] Visual search support
- [x] Error handling
- [x] Comprehensive Storybook demos (8 stories)
- [x] Debug and fix display issues (price, beds, baths, sqft)
- [x] Images CDN integration with size classes
- [x] Square footage string parsing
- [x] UI polish (20% size reduction, label removal)

### 🚧 Step 3: ChatGPT Integration (Next)
- [ ] OpenAI API integration
- [ ] Natural conversation responses
- [ ] Combine NLP + GPT intelligently
- [ ] Custom theming (primaryColor)
- [ ] Conversation memory

### 📋 Step 4: MCP Server (Future)
- [ ] Connect to Repliers MCP Server
- [ ] Replace direct API calls with MCP tools
- [ ] Standardized tool interface
- [ ] Better error handling
- [ ] Tool call logging

### 🎨 Step 5: Enhanced Features (Future)
- [ ] Save favorite properties
- [ ] Share conversation links
- [ ] Property comparison view
- [ ] Agent handoff for human support
- [ ] Analytics and tracking
- [ ] Mortgage calculator
- [ ] Neighborhood insights

---

## 💡 Tips

**For Developers:**
- Check browser console for detailed NLP logs
- All API calls use `console.group()` for organized logging
- Look for `// TODO:` comments for integration points
- Mock runtime is in `hooks/useChatRuntime.ts`
- All styling uses Tailwind - easy to customize
- Component designed as singleton (one per page)

**For Designers:**
- Customize colors in component files (search for `blue-600`, `blue-700`)
- Adjust spacing, shadows via Tailwind classes
- Logo displays at 40x40px in header
- Mobile breakpoint is `md:` (768px)
- Property cards use 16:9 image ratio

**For QA:**
- Test with sample key: `pxI19UMy9zfw9vz5lRxoGpjJWXrMnm`
- Check console for API errors
- Test keyboard navigation (Tab, Enter, Escape)
- Verify mobile full-screen behavior
- Test with slow network (throttling)

---

## 📚 Resources

- [Repliers API Documentation](https://help.repliers.com)
- [Repliers NLP Endpoint Guide](https://help.repliers.com/en/article/utilizing-ai-powered-nlp-for-real-estate-listing-searches-1fvddra/)
- [Repliers Listings API Guide](https://help.repliers.com/en/article/searching-filtering-and-pagination-guide-1q1n7x0/)
- [Repliers Image CDN Guide](https://help.repliers.com/en/article/listing-images-implementation-guide-198p8u8/)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [@assistant-ui/react](https://www.assistant-ui.com/)

---

## 👥 Team

Built by the Repliers Innovation Team

**Project Lead**: Milan (milan@repliers.com)

---

**Status**: ✅ Phase 2 Complete - NLP Integration Live & Debugged
**Last Updated**: November 27, 2025
**Version**: 2.1.0 (NLP Integration + Field Normalization)
