#!/usr/bin/env node
/**
 * generate-post.mjs
 * Generates 1 bilingual blog post (ES + EN) every 2 days via GitHub Actions.
 * Uses DeepSeek API — https://platform.deepseek.com/
 * Slugs are generated from the title in the correct language (ES slug for ES, EN slug for EN).
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_KEY   = process.env.DEEPSEEK_API_KEY;
const API_URL   = 'https://api.deepseek.com/chat/completions';
const OUT_DIR   = path.join(__dirname, 'src', 'content', 'blog');

const TOPICS = [
  'cómo asegurar un servidor SSH en Ubuntu paso a paso',
  'UFW firewall en Ubuntu: configuración completa',
  'monitorizar un servidor Linux con herramientas gratuitas',
  'copias de seguridad automáticas en Linux con rsync y cron',
  'comandos Linux esenciales que todo técnico debe saber',
  'instalar y configurar fail2ban para proteger tu servidor',
  'cómo gestionar procesos en Linux con systemd',
  'optimizar el rendimiento de un servidor VPS en Hetzner',
  'Cloudflare CDN para WordPress: configuración completa',
  'cómo funciona Cloudflare Workers con ejemplos prácticos',
  'DNS explicado: qué es y cómo configurarlo bien',
  'Nginx reverse proxy con SSL y Let\'s Encrypt en Ubuntu',
  'seguridad en redes domésticas y de pequeña empresa',
  'VPN autoalojada con WireGuard en un VPS',
  'Astro: el framework más rápido para sitios estáticos',
  'Git y GitHub para técnicos: guía práctica desde cero',
  'Python scripting para automatizar tareas de sysadmin',
  'Bash scripting: automatizar backups y mantenimiento',
  'qué es Docker y por qué deberías aprenderlo',
  'open source: las mejores herramientas para sysadmins',
  'cómo contribuir a proyectos open source en GitHub',
  'WordPress optimización: de 50 a 100 en PageSpeed Insights',
  'introducción a las APIs REST con ejemplos reales',
  'cómo funciona HTTPS y SSL/TLS explicado de forma sencilla',
  'montar una infraestructura IPTV con FFmpeg y HLS',
  'las mejores extensiones de VS Code para desarrollo web',
  'cómo usar GitHub Actions para automatizar tu workflow',
  'gestión de secretos y variables de entorno en producción',
  'Bash vs Python: cuándo usar cada uno en automatización',
  'cómo depurar problemas de red en Linux paso a paso',
];

const today = () => new Date().toISOString().split('T')[0];

// Slugify any language — removes accents, special chars, spaces → hyphens
const slugify = str =>
  str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[áàâä]/g,'a').replace(/[éèêë]/g,'e')
    .replace(/[íìîï]/g,'i').replace(/[óòôö]/g,'o')
    .replace(/[úùûü]/g,'u').replace(/ñ/g,'n').replace(/ç/g,'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const delay = ms => new Promise(r => setTimeout(r, ms));

function pickTopic() {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const dayOfYear = Math.floor((Date.now() - start) / 86400000);
  return TOPICS[Math.floor(dayOfYear / 2) % TOPICS.length];
}

async function deepseek(system, user) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: system },
        { role: 'user',   content: user   },
      ],
      temperature: 0.7,
      max_tokens:  1400,
    }),
  });
  if (!res.ok) throw new Error(`DeepSeek ${res.status}: ${await res.text()}`);
  const d = await res.json();
  return d.choices?.[0]?.message?.content?.trim() ?? '';
}

const SYSTEM = lang =>
  `You are a technical blogger for mohamedch.com — Mohamed Chennani's personal site.
IT technician in Alaquas, Valencia, Spain. Expert in Linux, networking, WordPress, Cloudflare, streaming/IPTV, open source, web dev.
Write in ${lang === 'es' ? 'Spanish (Spain), clear and practical tone' : 'English, clear practical tone'}.
Be helpful, direct, and based on real-world experience.`;

async function genLang(topic, lang) {
  const lng = lang === 'es' ? 'Spanish (Spain)' : 'English';

  // 1. Title
  const title = await deepseek(SYSTEM(lang),
    `Write a concise SEO blog title in ${lng} for the topic: "${topic}".
Max 65 characters. No quotes. Return ONLY the title, nothing else.`
  );
  await delay(600);

  // 2. Slug — derived from the title in the correct language
  const slugRaw = await deepseek(SYSTEM(lang),
    `Convert this blog title to a URL slug in ${lng}: "${title}"
Rules:
- Lowercase only
- Use hyphens instead of spaces
- No accents, no special characters
- No quotes
- Return ONLY the slug, nothing else
Example: "How to Secure SSH on Ubuntu" → "how-to-secure-ssh-on-ubuntu"`
  );
  await delay(600);

  // 3. Excerpt
  const excerpt = await deepseek(SYSTEM(lang),
    `Write a 1-sentence meta description in ${lng} for a blog post titled: "${title}"
Max 155 characters. No quotes. Return ONLY the sentence.`
  );
  await delay(600);

  // 4. Body
  const body = await deepseek(SYSTEM(lang),
    `Write a practical blog post in ${lng} about: "${topic}"

Rules:
- 420-520 words
- Short intro paragraph (2-3 sentences)
- 3-4 sections with ## headings
- Include real commands, code snippets, or examples where useful
- Brief conclusion
- Do NOT include the title in the body
- Return ONLY the markdown content, no preamble or explanation`
  );

  const clean = s => s.replace(/^["'`]|["'`]$/g,'').replace(/"/g,"'").trim();

  return {
    title:   clean(title),
    slug:    slugify(clean(slugRaw)),
    excerpt: clean(excerpt),
    body,
  };
}

async function run() {
  if (!API_KEY) {
    console.error('❌  DEEPSEEK_API_KEY not set. Get a key at https://platform.deepseek.com/');
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const topic = pickTopic();
  const date  = today();

  console.log(`\n📝  Topic : ${topic}`);
  console.log(`📅  Date  : ${date}\n`);

  for (const lang of ['es', 'en']) {
    console.log(`🌐  Generating ${lang.toUpperCase()}...`);

    try {
      const { title, slug, excerpt, body } = await genLang(topic, lang);
      const filename = `${date}-${slug}.md`;
      const file = path.join(OUT_DIR, filename);

      if (fs.existsSync(file)) {
        console.log(`⏭️   Already exists: ${filename}`);
        continue;
      }

      const tags = lang === 'es'
        ? '["linux", "open source", "desarrollo web", "tecnico informatico"]'
        : '["linux", "open source", "web development", "it technician"]';

      const content =
`---
title: "${title}"
excerpt: "${excerpt}"
date: "${date}"
lang: "${lang}"
slug: "${slug}"
tags: ${tags}
author: "Mohamed Chennani"
---

${body}
`;

      fs.writeFileSync(file, content, 'utf8');
      console.log(`✅  Saved: src/content/blog/${filename}`);
      console.log(`    Title : ${title}`);
      console.log(`    Slug  : ${slug}\n`);

      await delay(1000);
    } catch(err) {
      console.error(`❌  Error [${lang}]: ${err.message}`);
    }
  }

  console.log('🎉  Done!\n');
}

run().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
