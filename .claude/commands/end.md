---
description: End session with documentation updates and commit preparation
---

Complete the end-of-session workflow:

## 1. Code Quality Check
Run quality checks to ensure code is in good state:
- Run `npm run lint` to check linting
- Run `npm run build` to verify build succeeds
- Note: If typecheck script exists, run it too

## 2. Gather Session Context
Review what was accomplished this session:
- Check git diff to see all changes
- Review any new files created
- Summarize key accomplishments and decisions

## 3. Update `.claude/SESSION_HANDOFF.md`
Update with current session information:
- **Session Summary**: Duration, focus area, overall status
- **What Was Accomplished**: Specific completed tasks
- **Current State**: Ready for production? Any issues?
- **Next Session Goals**: What should be tackled next
- **Key Learnings**: Important patterns or decisions made

## 4. Update `.claude/WORK_LOG.md`
Add new session entry:
- Date and session duration
- Focus area for this session
- Completed tasks (detailed list)
- Issues found and decisions made
- Next session recommendations

## 5. Create Feature Branch
- Create descriptive feature branch name for the completed work
- Switch to the new branch
- Example: `feature/add-keyword-search` or `fix/authentication-bug`

## 6. Prepare Commit Message
Present a properly formatted commit message to the user:
- Clear, descriptive summary line
- Detailed body explaining what and why
- Reference any issues/tickets if applicable
- **DO NOT use quotes** - write commit messages in plain text without quotation marks

**IMPORTANT**: Do NOT commit automatically - present the commit message and let the user commit manually.

**Note**: Only suggest commits for completed, working features that have been tested and pass quality checks.
