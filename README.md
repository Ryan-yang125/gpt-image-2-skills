# GPT Image 2 Skills

Agent skills for Image2Studio and GPT Image 2 workflows.

## Available Skills

- `gpt-image-2-search`: search Image2Studio's public prompt and image library for prompt ideas, visual references, and reusable image generation prompts.

## Install

```bash
npx skills add ryan-yang125/gpt-image-2-skills --skill gpt-image-2-search
```

## Local Test

```bash
node skills/gpt-image-2-search/scripts/search.mjs --q "cinematic portrait" --limit 3 --markdown
```
