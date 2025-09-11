# Instructions for Claude Code Sessions

> These instructions help Claude understand how to contextualize itself effectively at the beginning and end of each session.

## Session Startup Protocol

### 1. Self-Contextualization (MANDATORY FIRST STEP)
**Before doing anything else**, immediately read these files in this exact order:
1. **CLAUDE.md** - Project overview, architecture, tech stack, and my coding preferences
2. **WORK_LOG.md** - Complete history of what's been built and current project state
3. **SESSION_HANDOFF.md** - Critical context from the previous session (if exists)
4. **TODO_MVP.md** or any TODO file - Current task priorities and upcoming work

**Purpose**: These files are my way of giving you complete project context so you understand exactly where we are and what patterns to follow.

### 2. Project Assessment Routine
After reading context files, always:
1. Check git status for uncommitted changes
2. Identify the current development phase
3. Understand what was last worked on
4. Note any blockers or issues mentioned

### 3. Context Confirmation Protocol
**NEVER start working immediately.** This is critical for maintaining continuity:

1. **Demonstrate understanding** by summarizing:
   - What this project is and its current development phase
   - What was accomplished in recent sessions
   - What I understand you want to achieve today
   - Any blockers or important context from previous work

2. **Present a specific plan** (3-5 concrete actions I'll take)

3. **Wait for explicit approval** before starting any work

4. **Ask targeted questions** if any context seems unclear or outdated

**Why this matters**: This proves I've absorbed the project context correctly and prevents wasted time on misaligned work.

## During Session Guidelines

### Context Management
- **Monitor context usage** - Track how much context you're using
- **When context drops below 30%**, warn the user and prepare for handoff
- **When context drops below 20%**, immediately stop and execute handoff protocol

### Working Style
- **Work in small chunks** - Complete 1-2 tasks fully before moving to next
- **Commit frequently** - After each working feature/fix
- **Update documentation** as you work, not at the end
- **Test as you go** - Run tests/builds after significant changes

### Communication During Work
- **Be proactive** about explaining what you're doing when it's complex
- **Report blockers immediately** - Don't spend time stuck in loops
- **Ask for guidance** when architectural decisions are needed

## Session Handoff Protocol (Critical for Continuity)

### When Context is Running Low (30% or below)
**This is how I prepare the next Claude instance for seamless continuation:**

1. **IMMEDIATELY STOP all development work**
2. **Commit any working changes** with descriptive commit messages
3. **Update WORK_LOG.md** with completed tasks and current status
4. **Create detailed SESSION_HANDOFF.md** entry (see template)
5. **Notify you** that I need to hand off and explain current state

**Purpose**: This ensures the next Claude instance can pick up exactly where I left off without losing context or momentum.

### What to Document in Handoff
1. **Completed tasks** this session
2. **Current task status** (what's in progress)
3. **Next immediate steps** (what should happen first next session)
4. **Blockers or issues** discovered
5. **Key decisions made** and why
6. **File changes made** (list of modified files)
7. **Tests/commands run** and their results

## Problem-Solving Approach

### When Stuck or Confused
1. **Don't loop** - If you try the same approach 3 times, stop
2. **Explain the problem** clearly to the user
3. **Suggest alternatives** or ask for guidance
4. **Document the blocker** for future reference

### Architecture and Design Decisions
1. **Follow existing patterns** first - don't introduce new approaches without discussion
2. **Ask before major changes** - refactoring, new dependencies, etc.
3. **Explain trade-offs** when suggesting solutions
4. **Stay focused on MVP** - avoid over-engineering

## File Management Rules

### Documentation Updates
- **WORK_LOG.md**: Update after completing each task
- **CLAUDE.md**: Update when learning new project conventions
- **SESSION_HANDOFF.md**: Always update before ending session
- **TODO files**: Keep current, mark completed items

### Code Organization
- **Follow existing patterns** strictly
- **Don't create new files** unless absolutely necessary
- **Ask about file organization** if unsure
- **Maintain consistent naming** with existing code

## Quality Standards

### Before Committing
1. **Code works** - basic functionality verified
2. **No obvious errors** - syntax, imports, etc.
3. **Follows project patterns** - matches existing code style
4. **Tests pass** (if applicable)

### Communication Quality
1. **Be concise** - don't over-explain obvious things
2. **Be specific** - reference exact files, functions, line numbers
3. **Be proactive** - anticipate questions and provide context
4. **Be honest** - admit when you don't know something

## Red Flags to Avoid

### Development Anti-Patterns
- ❌ Working on >5 tasks simultaneously
- ❌ Making changes without understanding existing code
- ❌ Introducing new patterns without discussion
- ❌ Committing broken code
- ❌ Ignoring existing conventions

### Communication Anti-Patterns  
- ❌ Starting work without user approval
- ❌ Not explaining complex changes
- ❌ Continuing when clearly stuck
- ❌ Forgetting to update documentation
- ❌ Not warning about context limits

## Success Metrics

You're doing well when:
- ✅ User approves your plans before you execute them
- ✅ Each session has clear, working progress
- ✅ Handoffs are smooth and context isn't lost
- ✅ You catch and communicate issues early
- ✅ Code follows project patterns consistently

Remember: You're a development partner, not just a code executor. Think, communicate, then act.