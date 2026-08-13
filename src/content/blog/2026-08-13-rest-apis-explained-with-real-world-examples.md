---
title: "REST APIs Explained with Real-World Examples"
excerpt: "Learn REST APIs through practical examples like ordering coffee, checking weather, and booking flights—simple, real-world scenarios that make API concepts easy to understand."
date: "2026-08-13"
lang: "en"
slug: "rest-apis-explained-with-real-world-examples"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

APIs are the glue of the modern internet, and REST is the most common pattern you’ll encounter. If you’ve ever connected a WordPress site to a payment gateway or pulled data from Cloudflare’s API, you’ve used REST. This guide cuts through the theory and shows you how to interact with REST APIs using real commands you can run today.

## What REST Actually Means

REST (Representational State Transfer) is an architectural style, not a protocol. It relies on standard HTTP methods to perform operations on resources, which are identified by URLs. Think of it as a waiter: you (the client) send a request (an order), and the server (the kitchen) returns a response (the dish).

The core verbs are:

- `GET` — Retrieve data (safe, no side effects)
- `POST` — Create a new resource
- `PUT` / `PATCH` — Update an existing resource
- `DELETE` — Remove a resource

The magic is that everything is stateless. Each request carries all the information the server needs, usually via headers and a JSON body.

## Your First Request: GET with cURL

Let’s start with a public API that needs no authentication. I’ll use the JSONPlaceholder fake API, perfect for testing.

```bash
curl https://jsonplaceholder.typicode.com/posts/1
```

You’ll get a JSON response like this:

```json
{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
  "body": "quia et suscipit..."
}
```

That’s it. You made a `GET` request and received a resource. Notice the response includes a `Content-Type: application/json` header — that’s how you know the server speaks JSON.

## Sending Data: POST and PUT

To create a new resource, use `POST` with a JSON body. Here’s how to add a new post:

```bash
curl -X POST https://jsonplaceholder.typicode.com/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "My New Post", "body": "Learning REST in practice", "userId": 1}'
```

The server should return a `201 Created` status code with the new resource (including an `id`). For updates, `PUT` replaces the whole resource, while `PATCH` does a partial update:

```bash
curl -X PATCH https://jsonplaceholder.typicode.com/posts/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title Only"}'
```

## Handling Authentication and Headers

Most real-world APIs (like Cloudflare or WordPress REST API) require authentication. The common pattern is an `Authorization` header with a Bearer token:

```bash
curl -X GET "https://api.cloudflare.com/client/v4/zones" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json"
```

For WordPress, you’d use Application Passwords. The key point: always check the API docs for the exact header format. A `401 Unauthorized` response means your credentials are wrong; `403 Forbidden` means you lack permissions.

## Reading Responses and Errors

Don’t just look at the data — check the HTTP status code. A successful `GET` returns `200 OK`, a created resource returns `201`. Common errors:

- `400 Bad Request` — Your JSON is malformed or missing fields
- `404 Not Found` — The URL is wrong
- `429 Too Many Requests` — You hit the rate limit

Use `-i` with cURL to see the headers, or `-v` for verbose output. This is your debugging superpower:

```bash
curl -i https://jsonplaceholder.typicode.com/posts/999999
```

You’ll see `HTTP/1.1 404 Not Found` in the response headers, followed by an empty JSON body.

## Conclusion

REST APIs are predictable once you understand the four verbs, JSON formatting, and status codes. Start with public APIs like JSONPlaceholder, then move to authenticated ones like Cloudflare’s. Practice with cURL before writing code — it forces you to understand the request/response cycle. Once you master this, consuming any REST API becomes a matter of reading the documentation and adjusting your headers.
