---
description: Start new session with project context and status review
---

# /start - Begin new session

Session startup routine:

1. Read `.claude/CLAUDE.md` for project context
2. Check `git status` for uncommitted changes
3. Review recent `git log` to see latest work
4. Provide concise session summary:
   - Current project state
   - Recent accomplishments (from commits)
   - Any uncommitted work
   - Relevant context from previous session
5. Ask what to work on this session
