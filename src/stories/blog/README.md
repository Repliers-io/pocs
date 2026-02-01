# Blog & Writing Stories

This directory contains MDX files for blog posts and writing about the PoCs in this repository.

## Structure

### Published
- `Week1-Chatbot.mdx` - First post in the NLP Search series (chatbot phase)

### Drafts (not visible in Storybook)
- `drafts/Week2-AISearch.mdx.draft` - Second post (AI search input phase)
- `drafts/Week3-HybridMap.mdx.draft` - Third post (hybrid map solution)
- `drafts/Week4-Lessons.mdx.draft` - Synthesis post with learnings

## Planning Document

For detailed planning notes, git commit references, and brainstorming, see:

[`/.storybook/blog.md`](../../.storybook/blog.md)

## Viewing in Storybook

Run Storybook to view these posts:

```bash
npm run storybook
```

Navigate to: **Blog & Writing → Why I Built a Real Estate Chatbot...** (or any of the posts)

## Current Status

- **Published**: Week 1 (Chatbot post)
- **Drafts**: Week 2-4 (will be released later)

All posts are complete and written as narrative stories with embedded code snippets, commit references, and architectural decisions woven into the storytelling.

## Adding New Posts

1. Create a new `.mdx` file in this directory
2. Add Meta tag with appropriate title: `<Meta title="Blog & Writing/Your Post Title" />`
3. Storybook will automatically pick it up (configured in `.storybook/main.ts`)
4. Write in narrative style with code snippets and commit references

## Publishing Drafts

To publish a draft post:
1. Rename the file to remove the `.draft` extension (e.g., `Week2-AISearch.mdx.draft` → `Week2-AISearch.mdx`)
2. Move it from `drafts/` to the main `blog/` directory
3. Storybook will automatically pick it up on next build/reload
