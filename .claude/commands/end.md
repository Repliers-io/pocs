---
description: End session with quality checks, commit, and push
---

# /end - End session workflow

## 1. Quality Checks
Run checks if applicable (skip any that don't exist in the project):
- Linting
- Build verification
- Type checking

If checks fail, fix the issues before proceeding.

## 2. Session Summary
- Run `git diff` to review all changes
- Provide a concise summary of what was accomplished

## 3. Branch
- If already on a feature branch, stay on it
- If on main, create a descriptive branch and switch to it (e.g. `feature/add-keyword-search`, `fix/authentication-bug`)

## 4. Stage & Present Commit
- Stage the relevant files
- Present the proposed commit message to the user
- **Wait for explicit approval before committing**
- If the user requests changes to the message, revise and present again

## 5. Commit & Push
After user approves:
- Create the commit
- Push the branch to remote with `-u` flag
- Output the GitHub PR creation URL: `https://github.com/<owner>/<repo>/compare/<branch>?expand=1`

**Never merge to main. Never push to main.**
