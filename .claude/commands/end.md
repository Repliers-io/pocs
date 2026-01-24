---
description: End session with quality checks, documentation, and commit prep
---

# /end - End session workflow

End-of-session workflow:

## 1. Quality Checks
Run checks if applicable for the project:
- Linting (if lint script exists)
- Build verification (if build script exists)
- Type checking (if typecheck script exists)

## 2. Session Summary
Review what was accomplished:
- Check `git diff` for all changes
- Review new files created
- Summarize key accomplishments and decisions

## 3. Feature Branch
- Create descriptive feature branch name
- Switch to new branch
- Examples: `feature/add-keyword-search`, `fix/authentication-bug`

## 4. Commit Preparation
Present properly formatted commit message:
- Clear summary line
- Detailed body explaining what and why
- Reference issues/tickets if applicable

## 5. Create & Show Commit
- Create the commit with the prepared message
- Display the full commit message to the user
- Ask if they want to make any changes to the commit

## 6. Push to Remote
- If user approves the commit message (no changes needed)
- Push the feature branch to remote
- Display the branch name and confirm push succeeded

**Note**: Only commit completed, working features that pass quality checks.
