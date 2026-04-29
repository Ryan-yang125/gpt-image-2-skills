---
name: gpt-image-2-search
description: Helps users discover prompt and image examples from Image2Studio's public GPT Image 2 prompt library when they need prompt ideas, visual references, style examples, reusable image-generation prompts, or examples for a subject, scene, product shot, poster, character, UI image, social media visual, composition, lighting setup, camera style, or aesthetic direction.
---

# GPT Image 2 Search

This skill helps you discover prompt and image examples from Image2Studio's public prompt library.

## When to Use This Skill

Use this skill when the user:

- Asks for image generation prompt ideas or prompt inspiration
- Wants examples for a visual style, subject, composition, medium, or mood
- Needs reference images before writing or refining a prompt
- Asks for prompts for product shots, posters, characters, UI images, social media visuals, scenes, lighting, or camera styles
- Wants to improve, remix, or compare GPT Image 2 prompts

## What is Image2Studio Prompt Search?

Image2Studio Prompt Search is a public search API for finding prompt and image examples from Image2Studio's published prompt library.

Key command:

```bash
node scripts/search.mjs --q "cinematic portrait" --limit 8
```

Fallback API call:

```bash
curl -sS "https://api.image2studio.com/public/prompts/search?q=cinematic%20portrait&limit=8"
```

## How to Help Users Find Prompts

### Step 1: Understand What They Need

When a user asks for prompt help, identify:

1. The subject or object they want to generate
2. The visual style, medium, mood, lighting, or camera language
3. The intended output format, such as poster, product shot, portrait, icon, scene, or social media image

### Step 2: Search the Prompt Library

Convert the user's request into 2-4 concise English visual keywords, then run:

```bash
node scripts/search.mjs --q "<keywords>" --limit 8
```

Examples:

- User asks for a premium perfume campaign prompt -> `node scripts/search.mjs --q "luxury perfume ad" --limit 8`
- User asks for anime character references -> `node scripts/search.mjs --q "anime character sheet" --limit 8`
- User asks for clean app icon ideas -> `node scripts/search.mjs --q "isometric app icon" --limit 8`

If results are weak, retry once with broader or adjacent visual terms.

### Step 3: Verify Relevance Before Recommending

Do not recommend results based only on title matches. Prefer results that align with:

1. Subject and scene
2. Visual style and medium
3. Composition, lighting, camera style, or layout
4. Aspect ratio and intended use
5. Prompt quality and clarity

### Step 4: Present Useful Results

When you find relevant prompts, present them with:

1. The prompt title
2. Why it matches the user's request
3. The prompt or a concise prompt excerpt
4. The `imageUrl` for visual reference
5. The `studioUrl` for opening the prompt in Image2Studio

Do not call `useUrl` unless the user explicitly chooses or uses that prompt.

## Search Tips

Use specific visual keywords:

- `cinematic portrait`
- `minimal product poster`
- `anime character sheet`
- `luxury perfume ad`
- `isometric app icon`
- `editorial fashion photo`
- `surreal architecture`

Try alternative terms when needed:

- If `poster` is weak, try `campaign`, `editorial`, or `advertisement`
- If `portrait` is weak, try `headshot`, `fashion photo`, or `character`
- If `minimal` is weak, try `clean`, `studio`, or `modern`

## When No Prompts Are Found

If no relevant prompts are found:

1. Say that the search did not find a strong match
2. Try one broader query if useful
3. Offer to write a new prompt directly from the user's request

Read `references/api.md` only when endpoint parameters, response fields, or error behavior matter.
