---
title: "Cloudflare Workers Explained with Practical Examples"
excerpt: "Learn how Cloudflare Workers work with real-world examples including redirects, authentication, and API routing for faster serverless apps."
date: "2026-05-19"
lang: "en"
slug: "cloudflare-workers-explained-with-practical-examples"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

Cloudflare Workers let you run JavaScript (or WebAssembly) at the edge, in over 330 data centers worldwide. Instead of spinning up a server, you deploy a script that intercepts HTTP requests and returns responses directly from Cloudflare’s network. This means near-zero latency, automatic scaling, and no infrastructure to manage. Below are practical examples to show you exactly how they work.

## Your First Worker: Hello World from the Edge

To get started, you need a Cloudflare account and the `wrangler` CLI tool. Install it via npm:

```bash
npm install -g wrangler
```

Log in and create a new worker:

```bash
wrangler login
wrangler init my-first-worker
```

Inside the generated `src/index.js`, replace the content with:

```javascript
export default {
  async fetch(request) {
    return new Response("Hello from Valencia, Spain!", {
      headers: { "content-type": "text/plain" },
    });
  },
};
```

Deploy it:

```bash
wrangler deploy
```

Your worker is now live at `https://my-first-worker.<your-subdomain>.workers.dev`. Every request hits Cloudflare’s edge nearest to the user, not your origin server.

## Modifying Requests and Responses

Workers shine when you need to transform traffic on the fly. For example, add security headers to every response without touching your backend:

```javascript
export default {
  async fetch(request) {
    const response = await fetch(request);
    const newHeaders = new Headers(response.headers);
    newHeaders.set("X-Content-Type-Options", "nosniff");
    newHeaders.set("X-Frame-Options", "DENY");
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  },
};
```

This script fetches the original request, modifies headers, and returns the updated response—all in milliseconds. You can also block certain user agents, rewrite URLs, or inject scripts into HTML.

## A/B Testing with URL Rewriting

Suppose you want to route 50% of traffic to a staging server for testing. Use the `Math.random()` function:

```javascript
export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (Math.random() < 0.5) {
      url.hostname = "staging.example.com";
    }
    return fetch(url.toString(), request);
  },
};
```

Deploy this worker on `example.com/*`. Half the visitors will see your staging site without changing their browser URL. No server-side load balancer needed.

## Using Environment Variables and KV Storage

Workers can access environment variables and Cloudflare KV (key-value store) for persistent data. First, define a KV namespace in `wrangler.toml`:

```toml
name = "kv-demo"
kv_namespaces = [
  { binding = "MY_KV", id = "your-kv-id" }
]
[vars]
API_KEY = "sk-test123"
```

Then use them in your script:

```javascript
export default {
  async fetch(request, env) {
    const cached = await env.MY_KV.get("homepage");
    if (cached) {
      return new Response(cached, { headers: { "content-type": "text/html" } });
    }
    const response = await fetch("https://example.com");
    const text = await response.text();
    await env.MY_KV.put("homepage", text, { expirationTtl: 3600 });
    return new Response(text, response);
  },
};
```

This caches your homepage in KV for one hour, reducing origin load and speeding up repeat visits.

## Conclusion

Cloudflare Workers turn your edge network into a programmable layer. Whether you’re modifying headers, routing traffic, or caching content dynamically, you write code once and it runs everywhere. Start simple with a Hello World, then expand as your needs grow—no servers, no ops, just JavaScript at the edge.
