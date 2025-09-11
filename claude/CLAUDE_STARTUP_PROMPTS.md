# Startup Prompts for Claude Code Sessions

## For You to Use When Starting a New Session

Copy and paste these prompts to get Claude oriented quickly in your project:

---

## 🚀 New Session Startup (Primary Prompt)

**Copy this exactly:**

```
Review this project and contextualize yourself. In the claude folder, Read CLAUDE_INSTRUCTIONS.md first to understand how to operate, then read CLAUDE.md, WORK_LOG.md, and SESSION_HANDOFF.md to fully understand the project.

After reading everything, prove you understand by summarizing:
1. What this project is and its current development phase
2. What was accomplished recently and current state
3. What you understand I want to achieve this session
4. Your specific plan (3-5 concrete actions)

Wait for my approval before starting any work.
```

**What this does**: Forces Claude to read all context files and demonstrate understanding before acting.

---

## 🔄 Mid-Project Session Restart

```
I'm starting a new Claude Code session for this project. Please:

1. Read CLAUDE_INSTRUCTIONS.md for your operating guidelines
2. Review CLAUDE.md, WORK_LOG.md, and SESSION_HANDOFF.md for current context
3. Check git status to understand current state
4. Summarize where we left off and what should happen next
5. Present your plan for this session and wait for my approval

Do not start coding immediately.
```

---

## 🚨 Context Reset (When Previous Session Hit Limits)

```
The previous Claude session hit context limits and had to hand off. Please:

1. Read CLAUDE_INSTRUCTIONS.md for your guidelines
2. Read all context files (CLAUDE.md, WORK_LOG.md, SESSION_HANDOFF.md)
3. Pay special attention to the "Current Session" section in SESSION_HANDOFF.md
4. Check git status and verify the current state matches what's documented
5. Review the "Immediate Next Actions" and "Questions to Ask User" sections
6. Summarize your understanding and ask any clarifying questions before proceeding

The previous Claude was working on: [briefly describe what they were doing]
```

---

## 🐛 Debug Session Startup

```
I'm having issues with [describe the problem]. Please:

1. Read the project context files to understand the setup
2. Check git status and recent commits
3. Review WORK_LOG.md for any known issues or recent changes that might be related
4. Summarize what you understand about the problem
5. Propose a debugging approach

Focus on understanding the issue first before jumping into fixes.
```

---

## 🔧 Feature Addition Session

```
I want to add a new feature: [describe the feature]. Please:

1. Review the project context files to understand current architecture
2. Check WORK_LOG.md for completed features and current patterns
3. Look at the existing codebase to understand conventions
4. Summarize your understanding of:
   - How this feature fits into the current architecture
   - What files/components will likely need changes
   - Any potential conflicts with existing features
5. Propose an implementation approach

Wait for approval before starting implementation.
```

---

## 📝 Code Review Session

```
I want you to review recent changes. Please:

1. Read the project context files to understand coding standards and conventions
2. Check recent commits or specific files I'll point you to
3. Review against the project's established patterns (documented in CLAUDE.md and WORK_LOG.md)
4. Provide feedback on:
   - Code quality and adherence to project conventions
   - Potential issues or improvements
   - Test coverage if applicable
   - Documentation needs

Focus on constructive feedback aligned with the project's established practices.
```

---

## 🧪 Testing and Validation Session

```
I need help with testing and validation. Please:

1. Review project context to understand the testing strategy
2. Check WORK_LOG.md for current test coverage and approaches
3. Look at recent changes that need testing
4. Propose a testing plan that includes:
   - What should be tested
   - How to test it (unit, integration, e2e)
   - What test commands to run
5. Execute the testing plan and report results

Make sure to follow the project's established testing patterns.
```

---

## Quick Reference for Common Instructions

### When Claude Asks What to Do:

```
Follow your CLAUDE_INSTRUCTIONS.md - read the context files first, then summarize and propose a plan.
```

### When Context Gets Low:

```
Follow the handoff protocol in CLAUDE_INSTRUCTIONS.md - stop work, commit changes, update SESSION_HANDOFF.md, and prepare for transition.
```

### When Claude Seems Lost:

```
Re-read CLAUDE_INSTRUCTIONS.md and the project context files. Summarize what you understand and ask specific questions about what's unclear.
```

---

## Tips for Better Sessions

1. **Always use the primary startup prompt** for new sessions
2. **Be specific about what you want to accomplish** in each session
3. **Reference the context reset prompt** when previous Claude hit limits
4. **Keep sessions focused** - don't try to do too many things at once
5. **End sessions proactively** when context gets low rather than letting Claude hit the limit

---

## Example of Perfect Session Start

**Your message:**

```
Review this project and get oriented. Read CLAUDE_INSTRUCTIONS.md first for how to operate, then read CLAUDE.md, WORK_LOG.md, and SESSION_HANDOFF.md to understand the project context.

Today I want to add user authentication to the app. After reading everything, summarize back to me what you understand and propose your implementation plan.
```

**Expected Claude response:**

- Reads all context files
- Summarizes project understanding
- Explains current state
- Proposes specific steps for adding authentication
- Waits for your approval before coding

This ensures every session starts efficiently and maintains context continuity.
