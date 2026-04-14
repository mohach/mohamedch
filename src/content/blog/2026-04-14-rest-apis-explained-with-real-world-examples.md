---
title: "REST APIs Explained with Real-World Examples"
excerpt: "Learn how REST APIs work with practical examples that show their role in modern web and app development."
date: "2026-04-14"
lang: "en"
slug: "rest-apis-explained-with-real-world-examples"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

In today's interconnected digital world, APIs, particularly REST APIs, are the silent workhorses powering everything from weather apps to social media feeds. Understanding them is a fundamental skill for modern IT work. Let's break down what they are and how they work with practical, real-world examples.

## What is a REST API?

REST (Representational State Transfer) is an architectural style for designing networked applications. It uses standard HTTP methods to perform operations on resources, which are identified by URLs (endpoints). Think of it as a waiter in a restaurant: you (the client) give an order (a request) using a specific verb ("GET me the menu"), and the kitchen (the server) returns what you asked for (a response). The core HTTP methods are:
*   **GET:** Retrieve data.
*   **POST:** Create new data.
*   **PUT/PATCH:** Update existing data.
*   **DELETE:** Remove data.

## A Real-World Example: JSONPlaceholder

The best way to learn is by doing. Let's use `JSONPlaceholder`, a free fake API for testing. We'll interact with it using `curl`, a command-line tool available on Linux, macOS, and Windows.

To **fetch** a list of posts (like you would see on a blog), we use a GET request:
```bash
curl -X GET https://jsonplaceholder.typicode.com/posts
```
This returns a JSON array of post objects, each with an `id`, `title`, and `body`.

To **create** a new post, we send a POST request with data:
```bash
curl -X POST https://jsonplaceholder.typicode.com/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "My New Post", "body": "This is the content", "userId": 1}'
```
The `-H` flag sets the header (telling the server we're sending JSON), and `-d` contains the actual data payload.

## Key Concepts: Endpoints, Status Codes, and JSON

Every API interaction revolves around a few key components.

1.  **Endpoints:** These are the specific URLs for resources. In our example, `/posts` is the endpoint for blog posts. To get a single post, you would use `/posts/1`.
2.  **Status Codes:** The server's response includes a code that tells you what happened. Common ones are `200 OK` (success), `201 Created` (POST success), `404 Not Found` (resource doesn't exist), and `500 Internal Server Error`.
3.  **JSON:** This is the universal language for data exchange in modern REST APIs. It's lightweight and easy for both humans and machines to read. The response from our GET request is a perfect example of a JSON array containing objects.

## Practical Use Case: Automating a Task

Imagine you need to monitor the status of a web service. You can write a simple Bash script that uses a REST API's health endpoint.
```bash
#!/bin/bash
response=$(curl -s -o /dev/null -w "%{http_code}" https://api.example.com/health)
if [ "$response" -eq 200 ]; then
    echo "Service is UP. Status: $response"
else
    echo "ALERT: Service may be DOWN. Status: $response"
fi
```
This script sends a silent (`-s`) GET request, captures only the HTTP status code (`-w "%{http_code}"`), and logs a message based on the result—a simple but powerful automation.

REST APIs are less about complex theory and more about practical, standardized communication. By understanding the basic verbs, how to structure a request, and how to interpret responses, you can integrate, automate, and troubleshoot a vast array of services, making them an indispensable tool in your IT toolkit.
