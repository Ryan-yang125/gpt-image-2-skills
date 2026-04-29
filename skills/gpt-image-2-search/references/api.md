# Image2Studio Prompt Search API

Use this reference only when endpoint details or response fields matter.

## Endpoint

```http
GET https://api.image2studio.com/public/prompts/search
```

## Query Parameters

| Parameter | Required | Notes |
| --- | --- | --- |
| `q` | No | Search keywords. Keep them short and visual. |
| `page` | No | Page number. Defaults to `1`. |
| `limit` | No | Results per page. Defaults to `8`; maximum is `20`. |
| `category` | No | Category filter. |
| `language` | No | Prompt language filter. |
| `featured` | No | Boolean featured filter. |

## Response Shape

The API returns a JSON success envelope. The useful payload is in `data`:

```json
{
  "ok": true,
  "data": {
    "query": {
      "q": "cinematic portrait",
      "category": null,
      "language": null,
      "featured": null
    },
    "results": [
      {
        "id": "prompt-id",
        "title": "Prompt title",
        "description": "Short description",
        "prompt": "Full prompt text",
        "promptLanguage": "en",
        "model": "gpt-image-2",
        "aspectRatio": "1:1",
        "categories": [
          {
            "slug": "portrait-selfie",
            "title": "Portrait Selfie"
          }
        ],
        "image": {
          "url": "https://...",
          "width": 800,
          "height": 1200,
          "mimeType": "image/jpeg"
        },
        "imageUrl": "https://...",
        "source": {
          "platform": "twitter",
          "url": "https://...",
          "authorName": "Author",
          "authorUrl": "https://..."
        },
        "stats": {
          "views": 0,
          "likes": 0,
          "saves": 0,
          "uses": 0
        },
        "libraryUrl": "https://image2studio.com/prompts",
        "studioUrl": "https://image2studio.com/create?prompt=...",
        "useUrl": "https://api.image2studio.com/prompt-library/items/.../use",
        "publishedAt": "2026-01-01 00:00:00"
      }
    ],
    "page": 1,
    "limit": 8,
    "total": 100
  }
}
```

## Field Usage

- `prompt`: use as the main reusable prompt text.
- `imageUrl`: use to inspect or show the matching reference image.
- `studioUrl`: use when the user wants to open the prompt in Image2Studio.
- `useUrl`: do not call during search. Call only when the user explicitly chooses or uses the prompt.
- `stats`: use as a weak popularity signal, never as the only ranking criterion.

## Search Behavior

Start with 2-4 English visual keywords. If the result set is weak, retry once with broader terms such as the medium, genre, subject, lighting, camera style, or layout.
