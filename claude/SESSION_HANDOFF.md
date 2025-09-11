# Session Handoff Log

## Current Session: [DATE/TIME]

### Session Summary
**Context Level When Starting**: [XX%]
**Context Level Now**: [XX%]
**Session Duration**: [X hours/minutes]
**Reason for Handoff**: [Context limit/Natural break/User request]

### What Was Accomplished This Session
1. [Completed task 1 with brief description]
2. [Completed task 2 with brief description]
3. [Any partial completions or progress made]

### Current State
**Last Working Commit**: [commit hash or message]
**Branch**: [current branch name]
**Uncommitted Changes**: [Yes/No - describe if yes]

### In Progress Right Now
**Current Task**: [What task was being worked on when stopping]
**Status**: [How far along, what's left to do]
**Files Currently Modified**: [List files that are mid-edit]
**Next Immediate Step**: [The very next thing that should happen]

### Key Decisions Made This Session
1. [Decision 1 and reasoning]
2. [Decision 2 and reasoning]
3. [Any architectural or approach decisions]

### Blockers and Issues Discovered
1. [Issue 1 and its impact]
2. [Issue 2 and potential solutions discussed]
3. [Any technical debt or problems found]

### Important Context for Next Session
- **User Preferences Learned**: [Any new preferences or constraints discovered]
- **Code Patterns Found**: [New patterns or conventions discovered in the codebase]
- **Testing Notes**: [What tests were run, any failures, testing approach]
- **Performance Notes**: [Any performance issues or optimizations made]

### Files Modified This Session
```
[List all files that were changed, with brief note of what changed]
src/components/Header.tsx - Added dark mode toggle
src/styles/globals.css - Added dark theme variables
package.json - Added theme dependency
```

### Commands Run Successfully
```bash
npm install some-package
npm run test
npm run build
git commit -m "Add dark mode toggle"
```

### For the Next Claude Instance

#### Immediate Next Actions (Priority Order)
1. [Most important next task]
2. [Second priority task]
3. [Third priority task]

#### Context to Remember
- [Any important decisions or constraints to remember]
- [User communication style or preferences noted]
- [Any recurring patterns or issues in this project]

#### Questions to Ask User Next Session
1. [Any clarifications needed]
2. [Decisions user needs to make]
3. [Feedback needed on work done]

---

## Previous Sessions

### Session: [Previous DATE/TIME]
**Accomplished**: [Brief summary]
**Key Decision**: [Most important decision made]
**Handoff Reason**: [Why session ended]

### Session: [Earlier DATE/TIME]
**Accomplished**: [Brief summary]
**Key Decision**: [Most important decision made]
**Handoff Reason**: [Why session ended]

---

## Template for Quick Updates

```markdown
### Session: [DATE/TIME]
**Done**: 
**Current**: 
**Next**: 
**Issues**: 
**Modified**: 
```

---

## Instructions for Next Claude

When you start the next session:

1. **Read this entire file first**
2. **Check git status** to confirm current state matches what's documented here
3. **Review the "Immediate Next Actions"** section
4. **Ask user about any "Questions to Ask User"** items
5. **Summarize your understanding** of where we are and what needs to happen next
6. **Get approval** before starting work

**NEVER start coding immediately** - always confirm your understanding with the user first.