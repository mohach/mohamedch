---
title: "Cloudflare Workers Explained with Practical Examples"
excerpt: "Learn how Cloudflare Workers work with real-world examples: serverless JavaScript at the edge for faster, scalable web apps."
date: "2026-07-17"
lang: "en"
slug: "cloudflare-workers-explained-with-practical-examples"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

Cloudflare Workers let you run serverless JavaScript directly on Cloudflare’s edge network—hundreds of data centers worldwide. Instead of spinning up a VPS or renting a server, you write a small script that runs when someone hits a URL on your domain. This means near-zero latency, no infrastructure to manage, and automatic scaling. Let’s break down how they work with practical examples.

## What Are Cloudflare Workers Under the Hood?

At its core, a Worker is a JavaScript (or TypeScript, or Wasm) function that responds to HTTP requests. You deploy it via the Cloudflare dashboard or the `wrangler` CLI. Each Worker runs in an isolated V8 isolate, not a full container, so startup is lightning fast. You can intercept, modify, or route requests before they reach your origin server—or handle them entirely on the edge.

The basic structure is a single event listener:

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  return new Response('Hello from the edge!', {
    headers: { 'content-type': 'text/plain' }
  })
}
```

That’s it. Deploy this, and every request to your route gets that response directly from Cloudflare’s closest data center.

## Practical Example 1: Rewrite URLs on the Fly

Say you run a WordPress site but want to serve static assets from a CDN without touching your server. A Worker can rewrite image URLs in responses:

```javascript
async function handleRequest(request) {
  const response = await fetch(request)
  const html = await response.text()
  const modified = html.replace(/https:\/\/yourdomain\.com\/wp-content/g, 'https://cdn.yourdomain.com/wp-content')
  return new Response(modified, {
    headers: response.headers
  })
}
```

This fetches the original page, replaces asset URLs, and returns the modified HTML. No plugin, no server config—just edge logic.

## Practical Example 2: API Rate Limiting Without a Database

Need to protect an API endpoint? Workers can check IP-based rate limits using Cloudflare’s built-in KV store or just the request IP and a counter in global state. Here’s a simple in-memory version (note: resets per Worker instance, good for demo but use KV for production):

```javascript
const rateLimit = new Map()

async function handleRequest(request) {
  const ip = request.headers.get('CF-Connecting-IP')
  const now = Date.now()
  const window = 60000 // 1 minute
  const max = 10

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, [])
  }

  const timestamps = rateLimit.get(ip).filter(t => now - t < window)
  if (timestamps.length >= max) {
    return new Response('Too Many Requests', { status: 429 })
  }

  timestamps.push(now)
  rateLimit.set(ip, timestamps)
  return fetch(request)
}
```

Deploy this as a route for `api.example.com/*` and you have instant rate limiting.

## Practical Example 3: A/B Testing at the Edge

Want to test two landing pages without extra server load? Use a Worker to split traffic:

```javascript
async function handleRequest(request) {
  const url = new URL(request.url)
  const cookie = request.headers.get('Cookie') || ''
  if (cookie.includes('variant=B')) {
    url.pathname = '/landing-b'
  } else if (Math.random() < 0.5) {
    url.pathname = '/landing-b'
  }
  return fetch(new Request(url, request))
}
```

The Worker checks for a cookie, or randomly assigns variant B to 50% of users. The origin server sees only the rewritten URL.

## Conclusion

Cloudflare Workers shift logic from your server to the network edge—faster, cheaper, and easier to scale. Whether you’re rewriting URLs, rate limiting, or running A/B tests, the pattern is the same: a small script, a `fetch` event, and zero infrastructure. Start with the free tier (100,000 requests/day) and experiment. You’ll wonder why you waited so long.
