---
title: "REST APIs Guide: Real-World Examples"
excerpt: "Learn REST APIs through real-world examples, practical code snippets, and clear explanations for developers building modern web applications."
date: "2026-06-13"
lang: "en"
slug: "rest-apis-guide-real-world-examples"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

Ever wondered how apps like Spotify, Twitter, or your favorite weather service share data between devices? The magic often lies behind a REST API. As an IT technician, I've found that understanding REST is like having a universal remote for the internet—it lets you control and interact with countless services programmatically. This guide will strip away the jargon and show you how REST APIs work with real-world examples you can try today.

## What Exactly is a REST API?

REST stands for Representational State Transfer. Think of it as a set of rules for building web services that allow different software to talk to each other over HTTP. An API (Application Programming Interface) is the messenger that takes your request, tells a server what you want, and then brings the response back to you. In practice, when you type a URL into your browser, you're making a request—but with REST APIs, you're doing it programmatically, often without a graphical interface.

The core idea is simple: every resource (like a user, a post, or a product) has a unique URL, and you interact with it using standard HTTP methods: GET (read), POST (create), PUT/PATCH (update), and DELETE (remove). The response is usually in JSON or XML format, making it easy for any programming language to parse.

## Real Command: Fetching Data with GET

Let's start with the most common operation: reading data. You can test a public REST API right from your terminal using `curl`. Here's a real example using the JSONPlaceholder service, a fake online REST API for testing.

```bash
curl https://jsonplaceholder.typicode.com/posts/1
```

This sends a GET request to retrieve the post with ID 1. The server responds with JSON:

```json
{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
  "body": "quia et suscipit..."
}
```

You just made your first REST API call. The URL is the endpoint, the method is GET, and the response is a resource. Try changing the number or omitting it entirely to get all posts.

## Creating Data with POST

Now, let's create something new. POST requests send data to the server to create a resource. Using the same API, here's how you'd add a new post:

```bash
curl -X POST https://jsonplaceholder.typicode.com/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "My New Post", "body": "This is the content.", "userId": 1}'
```

The `-X POST` specifies the method, `-H` sets the header (telling the server we're sending JSON), and `-d` is the data payload. The server will respond with the created resource, including a new ID (typically 101 for this fake API). In a real application, this might represent a new blog entry or a new customer record.

## Updating and Deleting Resources

APIs wouldn't be complete without the ability to modify or remove data. For updates, we use PUT (full replacement) or PATCH (partial update). Here's a PATCH example to change just the title of post 1:

```bash
curl -X PATCH https://jsonplaceholder.typicode.com/posts/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title"}'
```

Deleting is even simpler. To remove post 1, just send a DELETE request:

```bash
curl -X DELETE https://jsonplaceholder.typicode.com/posts/1
```

The server will usually respond with a 200 OK or 204 No Content status, confirming the deletion. These operations mirror how you'd manage records in a database, but over the network.

## Conclusion

REST APIs are the backbone of modern web and mobile applications. By understanding the four basic HTTP methods—GET, POST, PUT/PATCH, and DELETE—you can interact with countless services, automate tasks, and build integrations. The real power comes when you combine these calls with authentication (like API keys) and handle responses in your own scripts. Start experimenting with public APIs today, and you'll quickly see how this simple pattern unlocks a world of programmatic control.
