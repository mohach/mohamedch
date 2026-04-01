# mohamedch.com — Astro Portfolio v3

Bilingual (EN/ES) personal portfolio for Mohamed Chennani.
Clean light/dark minimal design. Built with Astro. CSS imported correctly via frontmatter.

## Quick start

```bash
npm install
npm run dev      # http://localhost:4321
npm run build
npm run preview
```

## URL structure

| Page    | English     | Spanish        |
|---------|-------------|----------------|
| Home    | /           | /es            |
| Work    | /work       | /es/work       |
| Blog    | /blog       | /es/blog       |
| Contact | /contact    | /es/contact    |

Language switcher in nav switches between EN ↔ ES on every page.

## Files

```
src/
├── i18n.ts                     ← ALL content + translations in one file
├── styles/global.css           ← Design tokens, imported via BaseLayout
├── layouts/BaseLayout.astro    ← Nav (lang switch + theme toggle), footer
├── components/
│   ├── ProjectPost.astro       ← Blog-post style project card
│   └── SectionHeader.astro
└── pages/
    ├── index.astro             ← EN home
    ├── work.astro              ← EN projects
    ├── blog.astro              ← EN blog
    ├── contact.astro           ← EN contact
    ├── 404.astro
    └── es/
        ├── index.astro         ← ES home
        ├── work.astro          ← ES projects
        ├── blog.astro          ← ES blog
        └── contact.astro       ← ES contact
```

## Customise

All content lives in `src/i18n.ts`:
- `personal` — name, email, phone, location
- `projects.en` / `projects.es` — project data in both languages
- `ui.en` / `ui.es` — all UI strings
- `skills`, `langs`, `certs` — shared data used by both languages

Update your real GitHub/LinkedIn links in `BaseLayout.astro` footer.

## Deploy

```bash
npx vercel
```
