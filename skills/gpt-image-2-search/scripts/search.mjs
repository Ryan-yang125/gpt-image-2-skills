#!/usr/bin/env node

const DEFAULT_API_BASE = "https://api.image2studio.com";
const DEFAULT_LIMIT = 8;
const MAX_LIMIT = 20;

function printHelp() {
  console.log(`Usage:
  node scripts/search.mjs --q "cinematic portrait" [options]

Options:
  --q, -q <query>           Search keywords. Required.
  --limit <number>          Results per page. Default: 8, max: 20.
  --page <number>           Page number. Default: 1.
  --category <category>     Filter by category.
  --language <language>     Filter by prompt language.
  --featured <true|false>   Filter featured prompts.
  --api-base <url>          Override API base URL.
  --markdown                Print a compact Markdown summary.
  --help, -h                Show this help.`);
}

function readValue(args, index, flag) {
  const value = args[index + 1];
  if (!value || value.startsWith("-")) {
    throw new Error(`${flag} requires a value`);
  }
  return value;
}

function parsePositiveInteger(value, name, fallback, max) {
  if (value === undefined) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    throw new Error(`${name} must be a positive integer`);
  }
  return max ? Math.min(parsed, max) : parsed;
}

function parseArgs(args) {
  const options = {
    apiBase: DEFAULT_API_BASE,
    limit: DEFAULT_LIMIT,
    page: 1,
    markdown: false,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else if (arg === "--markdown") {
      options.markdown = true;
    } else if (arg === "--q" || arg === "-q") {
      options.q = readValue(args, i, arg);
      i += 1;
    } else if (arg === "--limit") {
      options.limit = parsePositiveInteger(readValue(args, i, arg), "limit", DEFAULT_LIMIT, MAX_LIMIT);
      i += 1;
    } else if (arg === "--page") {
      options.page = parsePositiveInteger(readValue(args, i, arg), "page", 1);
      i += 1;
    } else if (arg === "--category") {
      options.category = readValue(args, i, arg);
      i += 1;
    } else if (arg === "--language") {
      options.language = readValue(args, i, arg);
      i += 1;
    } else if (arg === "--featured") {
      options.featured = readValue(args, i, arg);
      i += 1;
    } else if (arg === "--api-base") {
      options.apiBase = readValue(args, i, arg).replace(/\/+$/, "");
      i += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function normalizeResponse(raw) {
  if (raw && raw.ok === false) {
    const message = raw.error?.message || raw.message || "Search API returned an error";
    throw new Error(message);
  }
  return raw?.data ?? raw;
}

function buildUrl(options) {
  const url = new URL("/public/prompts/search", options.apiBase);
  url.searchParams.set("q", options.q);
  url.searchParams.set("limit", String(options.limit));
  url.searchParams.set("page", String(options.page));

  if (options.category) url.searchParams.set("category", options.category);
  if (options.language) url.searchParams.set("language", options.language);
  if (options.featured !== undefined) url.searchParams.set("featured", options.featured);

  return url;
}

function trimPrompt(prompt, maxLength = 520) {
  if (!prompt || prompt.length <= maxLength) return prompt || "";
  return `${prompt.slice(0, maxLength).trim()}...`;
}

function formatQuery(query) {
  if (!query) return "";
  if (typeof query === "string") return query;
  if (typeof query.q === "string") return query.q;
  return JSON.stringify(query);
}

function formatCategories(categories) {
  if (!Array.isArray(categories) || categories.length === 0) return "";
  return categories
    .map((category) => {
      if (typeof category === "string") return category;
      return category.title || category.slug || JSON.stringify(category);
    })
    .join(", ");
}

function toMarkdown(payload) {
  const results = Array.isArray(payload.results) ? payload.results : [];
  const lines = [
    "# GPT Image 2 Prompt Search",
    "",
    `Query: ${formatQuery(payload.query)}`,
    `Results: ${results.length}${typeof payload.total === "number" ? ` of ${payload.total}` : ""}`,
    "",
  ];

  if (results.length === 0) {
    lines.push("No matching prompts found.");
    return lines.join("\n");
  }

  for (const [index, result] of results.entries()) {
    lines.push(`## ${index + 1}. ${result.title || result.id || "Untitled"}`);
    if (result.description) lines.push(`Description: ${result.description}`);
    if (result.model) lines.push(`Model: ${result.model}`);
    if (result.aspectRatio) lines.push(`Aspect ratio: ${result.aspectRatio}`);
    const categories = formatCategories(result.categories);
    if (categories) lines.push(`Categories: ${categories}`);
    if (result.imageUrl) lines.push(`Image: ${result.imageUrl}`);
    if (result.studioUrl) lines.push(`Studio: ${result.studioUrl}`);
    if (result.prompt) {
      lines.push(`Prompt: ${trimPrompt(result.prompt)}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }

  if (!options.q || !options.q.trim()) {
    throw new Error('Missing required query. Use --q "cinematic portrait".');
  }

  if (typeof fetch !== "function") {
    throw new Error("This script requires Node.js 18+ with global fetch support.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(buildUrl(options), {
      headers: {
        Accept: "application/json",
        "User-Agent": "gpt-image-2-search-skill/1.0",
      },
      signal: controller.signal,
    });

    const text = await response.text();
    let raw;
    try {
      raw = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(`Search API returned non-JSON response (${response.status})`);
    }

    if (!response.ok) {
      const message = raw?.error?.message || raw?.message || response.statusText;
      throw new Error(`Search API request failed (${response.status}): ${message}`);
    }

    const payload = normalizeResponse(raw);
    console.log(options.markdown ? toMarkdown(payload) : JSON.stringify(payload, null, 2));
  } finally {
    clearTimeout(timeout);
  }
}

main().catch((error) => {
  console.error(`gpt-image-2-search: ${error.message}`);
  process.exit(1);
});
