# How to Use Claude Code Effectively

## Core Philosophy: Keep It Simple

The most effective way to use Claude Code is to be direct, specific, and trust Claude to understand your context. Avoid over-explaining or micro-managing.

**The Proven Workflow**: Plan with Claude Chat → Create CLAUDE.md and TODO.md → Execute small chunks with Claude Code → Commit often. This simple approach has been used to build complete SaaS products in 20 days.

## Essential Best Practices

### 1. Be Direct and Specific
- **Good**: "Fix the authentication bug in login.js"
- **Bad**: "I think there might be an issue with the authentication system, could you maybe look at the login file and see if there's a problem?"

### 2. Trust Claude's Context Understanding
- Claude can read your entire codebase
- Don't explain what every file does unless it's truly complex
- Let Claude discover patterns and conventions

### 3. Use Natural Language
- **Good**: "Add dark mode toggle to the settings page"
- **Bad**: "Create a boolean state variable called `isDarkMode` in the settings component and add a toggle button that calls `setIsDarkMode(!isDarkMode)`"

### 4. Provide Context When Needed
- Share error messages in full
- Mention specific requirements or constraints
- Reference related files or features when relevant

## Effective Communication Patterns

### Starting a New Task
```
"I need to implement user authentication with JWT tokens"
```

### Debugging Issues
```
"The payment form is throwing this error: [paste full error]"
```

### Refactoring Code
```
"This component is getting too complex, help me break it down"
```

### Code Review
```
"Review this pull request and suggest improvements"
```

## What Claude Code Excels At

### ✅ DO Use Claude For:
- Full feature implementation
- Bug fixing and debugging
- Code refactoring and optimization
- Testing strategy and implementation
- Architecture decisions
- Code reviews
- Learning new patterns/frameworks

### ❌ AVOID These Approaches:
- Step-by-step micro-management
- Over-explaining obvious context
- Asking for permission for every small change
- Breaking down simple tasks unnecessarily

## Advanced Usage Tips

### 1. Leverage Memory with CLAUDE.md
Create a CLAUDE.md file to help Claude understand your project context across sessions.

### 2. Use Batch Operations
- "Fix all TypeScript errors and update the tests"
- "Implement these 3 features: [list them]"

### 3. Trust Claude's Judgment
- Claude will follow your existing patterns
- Claude will choose appropriate tools and libraries
- Claude will maintain code quality standards

### 4. Provide Feedback Loops
- Share test results after changes
- Mention if something doesn't work as expected
- Let Claude iterate and improve

## Common Anti-Patterns to Avoid

### 1. Over-Specification
```
❌ "Create a React component called UserProfile that uses useState for managing state, useEffect for lifecycle, and props for receiving user data"

✅ "Create a UserProfile component that displays user information"
```

### 2. Unnecessary Hand-Holding
```
❌ "First, open the file. Then, find line 42. Then, replace the function..."

✅ "Update the calculateTotal function to include tax"
```

### 3. Doubt and Hesitation
```
❌ "I'm not sure if this is the right approach, but maybe we could try..."

✅ "Implement user role-based permissions"
```

## The Complete Workflow That Works

### Phase 1: Plan Like You're Talking to a Co-founder
1. **Brainstorm naturally** - Jump into Claude Chat and explain your idea like you're at a coffee shop
2. **Pick your stack** - Keep it simple:
   - Database/Auth: Supabase or Better Auth
   - Web app: Next.js
   - Mobile: React Native or Flutter
3. **Define your MVP ruthlessly** - What's the absolute minimum that proves the concept?

### Phase 2: Create Your Battle Plan
Once aligned on the vision, use this prompt in Claude Chat:
```
Create CLAUDE.md outlining everything needed to know for Claude Code agent regarding this project/idea. Then, create TODO_MVP.md outlining all phases and steps needed to bring this project to completion.
```

### Phase 3: Execute in Small Bites
1. **Initial setup** - Create your project manually, add the two .md files
2. **Bring in Claude Code** (run in planning mode):
   ```
   Read CLAUDE.md and TODO_MVP.md. Then proceed with implementing these steps from TODO_MVP.md: [copy-paste 3-5 steps max]. Mark what's done when done.
   ```
3. **Watch your context** - When context drops below 20%, start fresh:
   ```
   Read and check if we should update CLAUDE.md based on changes we've done to this project thus far. Make sure there are no uncommitted changes.
   ```
4. **Reset and repeat** - Run `/clear` and go back to step 2 with the next chunk

### Critical Success Factors
- **Don't dump 20+ tasks on Claude Code at once** - It'll lose focus by task 5
- **Don't skip the CLAUDE.md updates** - Outdated context = confused AI
- **Don't wait until 5% context to reset** - Performance degrades way before that
- **Commit often** - Small iterations, frequent commits

## Measuring Success

You're using Claude Code effectively when:
- ✅ Tasks are completed in fewer interactions
- ✅ Code quality remains high
- ✅ You spend less time explaining context
- ✅ Claude proactively catches edge cases
- ✅ Solutions align with your project patterns

## When Things Go Sideways

Claude Code stuck in a loop? Lost track of what it's doing? Just:
1. Commit whatever works
2. Update your CLAUDE.md with lessons learned  
3. Start fresh with clearer instructions

## Remember

**Stop trying to be clever.** This simple workflow has shipped more products than any complex setup. The magic isn't in the process - it's in actually starting.

**Golden Rule**: All you need is a simple discussion with AI that produces a clear plan. Then have Claude Code execute it chunk by chunk, committing small iterations along the way.