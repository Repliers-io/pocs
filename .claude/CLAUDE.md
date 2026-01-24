# Claude Code Project Context

## Project Overview
**What**: Component library and tutorial system for Repliers API - building production-ready real estate components with comprehensive tutorials
**Why**: Provides developers with ready-to-use, well-documented real estate components that integrate seamlessly with the Repliers API
**MVP Focus**: Working components + tutorials pattern - each component must be production-ready with clear integration guides

## Architecture & Tech Stack
- **Language**: TypeScript/JavaScript
- **Framework**: Next.js with Storybook for component development
- **UI Library**: shadcn/ui components with Tailwind CSS
- **Maps**: Mapbox for property mapping and clustering
- **API Integration**: Repliers API for property data
- **Key Libraries**: 
  - Storybook for component documentation
  - Vite/Vitest for testing
  - Tailwind CSS for styling 

## Code Conventions & Patterns
<!-- Document your preferred coding style and patterns -->

### Naming Conventions
- Variables: camelCase
- Functions: camelCase
- Files: kebab-case for components (e.g., `autocomplete-search.tsx`)
- Components: PascalCase (e.g., `AutocompleteSearch`) 

### Code Organization
- Each component gets its own folder in `/src/components/[feature]/[component-name]/`
- Component structure: `component.tsx`, `component.stories.tsx`, `component.mdx`, `index.ts`
- Shared UI components in `/src/components/ui/`
- Tutorials written as MDX files alongside components

### Testing Strategy
- **Test Framework**: Vitest
- **Test Command**: `npm test` or `npm run test`
- **Test Location**: Alongside components or in `__tests__` folders 

## Development Workflow

### Essential Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start Storybook
npm run storybook

# Build Storybook
npm run build-storybook

# Run tests
npm test

# Build for production
npm run build

# Type checking
npm run typecheck
```

### Git Workflow
<!-- Describe your branching strategy, commit conventions, etc. -->

## Important Context for Claude

### What Claude Should Know
- Current development phase: Building map-listings component with Mapbox integration
- Pattern: Each component must be production-ready with Storybook stories and MDX tutorials
- Focus on making components easily extractable for developers to use in their own projects
- Tutorial quality is as important as component functionality

### Preferred Approaches
- **Error Handling**: Error boundaries for components, try/catch for API calls
- **State Management**: React hooks (useState, useContext) for component state
- **API Integration**: Direct integration with Repliers API
- **Component Structure**: Self-contained components with clear prop interfaces, stories, and documentation

### Project-Specific Rules
- Every component needs: .tsx file, .stories.tsx, .mdx tutorial, index.ts export
- Components must be easily extractable for use in other projects
- Always include Storybook stories demonstrating all component states
- Write comprehensive MDX tutorials showing integration steps
- Follow existing autocomplete-search pattern for new components
- Focus on production-ready, developer-friendly components

### Third-Party Integrations
- **APIs**: Repliers API for property data, listings, comparables, market insights
- **Services**: Mapbox for mapping and geocoding
- **Tools**: Storybook for component development and documentation

## Common Tasks & Patterns

### Frequent Operations
<!-- Document common tasks Claude might need to perform -->
1. Adding new features
2. Fixing bugs
3. Updating dependencies
4. Writing tests

### Code Templates
<!-- Provide templates for common code structures -->

### Debugging Tips
<!-- Share project-specific debugging approaches -->

## Files & Folders to Understand

### Critical Files
- `package.json` - Dependencies and scripts
- `src/components/autocomplete-search/` - Reference pattern for new components
- `src/components/ui/` - Shared UI components
- `src/lib/api-keys-context.tsx` - API key management
- Storybook configuration files

### Key Directories
- `/src/components/` - All component implementations organized by feature
- `/src/components/ui/` - Shared shadcn/ui components
- `/src/lib/` - Utility functions and shared context
- `/public/images/` - Tutorial screenshots and assets
- `/storybook-static/` - Built Storybook for deployment 

## Performance & Optimization
<!-- Document performance considerations and optimization strategies -->

## Security Considerations
<!-- Note any security requirements or sensitive areas -->

## Deployment & Infrastructure
<!-- Information about how the project is deployed -->

---

## Context Management for Claude Code Sessions

### When Starting a New Session
1. Always read both CLAUDE.md and TODO_MVP.md (if exists)
2. Check git status for uncommitted changes
3. Only work on 3-5 tasks at a time maximum
4. Watch context usage - reset when below 20%

### Before Context Reset
1. Commit all working changes
2. Update this CLAUDE.md with any new learnings
3. Update TODO files with current progress

## Notes for Future Sessions
<!-- Add any additional context that would be helpful -->
- Key learnings from recent development
- Patterns that work well for this project
- Things to avoid or watch out for

**Last Updated**: 2025-08-26
**Version**: 1.1 - Configured for Repliers API tutorial components