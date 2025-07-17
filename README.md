# POCs

This repository contains proof-of-concept (POC) components and features.

## Getting Started

1. Create a `.env.local` file in the root directory of the project:

```bash
touch .env.local
```

2. Add your Repliers API key to the `.env.local` file:

```env
NEXT_PUBLIC_REPLIERS_API_KEY=your_api_key_here
```

⚠️ **SECURITY WARNING**: Environment variables prefixed with `NEXT_PUBLIC_` are bundled into client-side code and become publicly accessible. Only use them for non-sensitive configuration. For production applications, always pass API keys as props to components rather than using environment variables.

This setup is intended for local development only. Never commit real API keys to version control.

### Running the Next.js Development Server

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Running Storybook

To run Storybook locally:

```bash
npm run storybook
# or
yarn storybook
# or
pnpm storybook
# or
bun storybook
```

This will start Storybook on [http://localhost:6006](http://localhost:6006) where you can view and interact with your components in isolation.

## Creating New Components

This project includes a component generation script that automatically creates new components following the established organizational pattern.

### Quick Start

```bash
# Create a component in the root components directory
npm run create-component MyNewComponent

# Create a component in a specific subdirectory
npm run create-component MyNewComponent statistics
npm run create-component MyNewComponent estimates
```

### What Gets Created

The script automatically generates:

1. **Component Directory**: `src/components/[path]/component-name/`
2. **Component File**: `component-name.tsx` with TypeScript template
3. **Storybook Story**: `component-name.stories.tsx` with comprehensive documentation

### Examples

```bash
# Creates: src/components/user-profile/
npm run create-component UserProfile

# Creates: src/components/statistics/sales-report/
npm run create-component SalesReport statistics

# Creates: src/components/estimates/price-calculator/
npm run create-component PriceCalculator estimates
```

### Generated Structure

```
src/components/my-component/
├── my-component.tsx           # Main component file
└── my-component.stories.tsx   # Storybook documentation
```

Each generated component includes:

- ✅ TypeScript interface and proper typing
- ✅ JSDoc documentation
- ✅ Basic component structure with UI components
- ✅ Comprehensive Storybook story with user stories, setup guide, and examples
- ✅ Multiple story variants (Default, WithCustomClass, Example)

### Component Organization Pattern

Components follow a **component-per-directory** structure where each component has:

- Main component file (`component-name.tsx`)
- Storybook story file (`component-name.stories.tsx`)
- Any additional helper files as needed

This ensures consistency, discoverability, and maintainability across the codebase.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
