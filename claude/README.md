# Claude Code Session Management System

This folder contains templates and instructions for managing Claude Code sessions effectively across long-term projects.

## Quick Start

1. **Copy these files** to any project where you want effective Claude Code sessions
2. **Fill out CLAUDE.md** with your specific project details
3. **Use a startup prompt** from `CLAUDE_STARTUP_PROMPTS.md` to begin each session
4. **Claude will automatically** read context and summarize understanding before working

## Files Overview

| File | Purpose |
|------|---------|
| **CLAUDE_INSTRUCTIONS.md** | Operating manual for Claude - how to behave in sessions |
| **CLAUDE.md** | Project context template - fill this out for your project |
| **WORK_LOG.md** | Progress tracking template - Claude updates this as work is completed |
| **SESSION_HANDOFF.md** | Context transition template - for seamless session handoffs |
| **CLAUDE_STARTUP_PROMPTS.md** | Ready-to-use prompts for different session types |
| **CLAUDE_CODE_GUIDE.md** | Usage guide for you - how to work effectively with Claude Code |

## Benefits

✅ **No lost context** between sessions  
✅ **Consistent behavior** from every Claude instance  
✅ **Always get approval** before Claude starts work  
✅ **Proactive communication** about context limits  
✅ **Comprehensive progress tracking**

## How to Initialize a Project

When ready to use this system in a specific project:

```bash
# Copy the templates to your project
cp -r /Users/milan/workspace/claude/* /path/to/your/project/

# Fill out the project-specific details in CLAUDE.md
# Start your first session with the primary prompt from CLAUDE_STARTUP_PROMPTS.md
```

This system implements the proven workflow: **Plan → Context → Execute in chunks → Commit often**