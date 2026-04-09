#!/usr/bin/env node
/**
 * generate-post.mjs
 * Generates 1 bilingual blog post (ES + EN) every 2 days via GitHub Actions.
 * Uses DeepSeek API — https://platform.deepseek.com/
 *
 * Add to GitHub repo secrets: DEEPSEEK_API_KEY
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_KEY   = process.env.DEEPSEEK_API_KEY;
const API_URL   = 'https://api.deepseek.com/chat/completions';
const OUT_DIR   = path.join(__dirname, 'src', 'content', 'blog');

const TOPICS = [
  // Linux & Sysadmin
  'cómo asegurar un servidor SSH en Ubuntu paso a paso',
  'UFW firewall en Ubuntu: configuración completa',
  'monitorizar un servidor Linux con herramientas gratuitas',
  'copias de seguridad automáticas en Linux con rsync y cron',
  'comandos Linux esenciales que todo técnico debe saber',
  'instalar y configurar fail2ban para proteger tu servidor',
  'cómo gestionar procesos en Linux con systemd',
  'optimizar el rendimiento de un servidor VPS en Hetzner',

  // Networking & Cloudflare
  'Cloudflare CDN para WordPress: configuración completa',
  'cómo funciona Cloudflare Workers con ejemplos prácticos',
  'DNS explicado: qué es y cómo configurarlo bien',
  'Nginx reverse proxy con SSL y Let\'s Encrypt en Ubuntu',
  'seguridad en redes domésticas y de pequeña empresa',
  'VPN autoalojada con WireGuard en un VPS',

  // Web Dev & Open Source
  'Astro: el framework más rápido para sitios estáticos',
  'Git y GitHub para técnicos: guía práctica desde cero',
  'Python scripting para automatizar tareas de sysadmin',
  'Bash scripting: automatizar backups y mantenimiento',
  'qué es Docker y por qué deberías aprenderlo',
  'open source: las mejores herramientas para sysadmins en 2024',
  'cómo contribuir a proyectos open source en GitHub',
  'WordPress optimización: de 50 a 100 en PageSpeed Insights',
  'introducción a las APIs REST con ejemplos reales',
  'cómo funciona HTTPS y SSL/TLS explicado de forma sencilla',

  // Streaming & IPTV
  'montar una infraestructura IPTV con FFmpeg y HLS',
  'Cloudflare Stream vs autoalojamiento: cuándo usar cada uno',

  // Dev tools & productivity
  'las mejores extensiones de VS Code para desarrollo web',
  'cómo usar GitHub Actions para automatizar tu workflow',
  'gestión de secretos y variables de entorno en producción',
];

const today   = () => new Date().toISOString().split('T')[0];
const slugify = s => s.toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const delay   = ms => new Promise(r => setTimeout(r, ms));

function pickTopic() {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const dayOfYear = Math.floor((Date.now() - start) / 86400000);
  return TOPICS[Math.floor(dayOfYear / 2) % TOPICS.length];
}

async function deepseek(system, user) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role:'system', content:system }, { role:'user', content:user }],
      temperature: 0.7,
      max_tokens:  1400,
    }),
  });
  if (!res.ok) throw new Error(`DeepSeek ${res.status}: ${await res.text()}`);
  const d = await res.json();
  return d.choices?.[0]?.message?.content?.trim() ?? '';
}

const SYSTEM = lang => `You are a technical blogger for mohamedch.com — Mohamed Chennani's personal site.
IT technician in Alaquas, Valencia, Spain. Expert in Linux, networking, WordPress, Cloudflare, streaming/IPTV, open source, web dev.
Write in ${lang === 'es' ? 'Spanish (Spain), clear and practical tone' : 'English, clear practical tone'}.
Be helpful, direct, and based on real-world experience.`;

async function genLang(topic, lang) {
  const isEs = lang === 'es';
  const lng  = isEs ? 'Spanish (Spain)' : 'English';

  const title = await deepseek(SYSTEM(lang),
    `Write a concise SEO blog title in ${lng} for the topic: "${topic}". Max 65 chars. No quotes. Return ONLY the title.`
  );
  await delay(500);

  const excerpt = await deepseek(SYSTEM(lang),
    `Write a 1-sentence meta description in ${lng} for: "${topic}". Max 155 chars. No quotes. Return ONLY the sentence.`
  );
  await delay(500);

  const body = await deepseek(SYSTEM(lang),
    `Write a practical blog post in ${lng} about: "${topic}"

Rules:
- 420-520 words
- Short intro paragraph (2-3 sentences)
- 3-4 sections with ## headings
- Include real commands, code snippets, or examples where useful
- Brief conclusion
- Do NOT include the title in the body
- Return ONLY markdown content, no preamble`
  );

  return {
    title:   title.replace(/^["']|["']$/g,'').replace(/"/g,"'"),
    excerpt: excerpt.replace(/^["']|["']$/g,'').replace(/"/g,"'"),
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
  const slug  = slugify(topic);

  console.log(`\n📝  Topic : ${topic}`);
  console.log(`📅  Date  : ${date}`);
  console.log(`🔗  Slug  : ${slug}\n`);

  for (const lang of ['es', 'en']) {
    const file = path.join(OUT_DIR, `${date}-${slug}-${lang}.md`);

    if (fs.existsSync(file)) {
      console.log(`⏭️   ${lang.toUpperCase()} already exists.`); continue;
    }

    console.log(`🌐  Generating ${lang.toUpperCase()}...`);

    try {
      const { title, excerpt, body } = await genLang(topic, lang);
      const tags = lang === 'es'
        ? '["linux", "open source", "desarrollo web", "técnico informático"]'
        : '["linux", "open source", "web development", "it technician"]';

      fs.writeFileSync(file,
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
`, 'utf8');

      console.log(`✅  Saved: src/content/blog/${date}-${slug}-${lang}.md`);
      await delay(1000);
    } catch(err) {
      console.error(`❌  Error [${lang}]: ${err.message}`);
    }
  }

  console.log('\n🎉  Done!\n');
}

run().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
