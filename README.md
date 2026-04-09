# mohamedch.com — Astro Portfolio v3

Bilingual ES(default)/EN. Clean light/dark. CSS imported via frontmatter.

## URL structure
| Page    | Spanish (default) | English     |
|---------|-------------------|-------------|
| Home    | /                 | /en         |
| Work    | /work             | /en/work    |
| Contact | /contact          | /en/contact |

## Quick start
```bash
npm install && npm run dev
```

## Blog auto-generator (Gemini free)

1. Get free key → https://aistudio.google.com/app/apikey
2. `export GEMINI_API_KEY=your_key`
3. `node generate-post.mjs` — generates ES + EN markdown post in src/content/blog/
4. Cron on VPS:
   `0 8 * * * cd /path/to/site && GEMINI_API_KEY=your_key bash deploy.sh`

deploy.sh = generate post + git commit + git push → Cloudflare Pages rebuilds automatically.

## Edit content
All text is in src/i18n.ts — one file for both languages.
