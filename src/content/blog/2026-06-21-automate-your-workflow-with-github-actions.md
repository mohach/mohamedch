---
title: "Automate Your Workflow with GitHub Actions"
excerpt: "Learn how to automate repetitive tasks, testing, and deployments using GitHub Actions with real-world workflow examples."
date: "2026-06-21"
lang: "en"
slug: "automate-your-workflow-with-github-actions"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

If you're tired of manually running tests, deploying code, or pushing files every time you make a change, GitHub Actions can take that weight off your shoulders. It's a built-in CI/CD tool that lets you automate nearly any task directly from your repository. Once set up, your workflow runs on every push, pull request, or schedule—no extra servers or third-party services required.

## Understanding the Basics: Workflows, Jobs, and Steps

A GitHub Actions workflow is a YAML file inside `.github/workflows/` in your repository. Each workflow contains one or more **jobs**, and each job has a series of **steps** (commands or actions). You define triggers—like `push` to `main` or `pull_request`—and the runner (a virtual machine) executes your instructions.

Here's the simplest example that runs `echo` on every push:

```yaml
name: Hello World
on: [push]
jobs:
  greet:
    runs-on: ubuntu-latest
    steps:
      - name: Say hello
        run: echo "Hello from GitHub Actions!"
```

## Automating Deployment to a Server

One of the most practical uses is deploying your site or app after a push. Below is a workflow that deploys a static site via SSH using `rsync`. You'll need to store your SSH key and server details as **secrets** in your repo settings.

```yaml
name: Deploy to Server
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Sync files via rsync
        uses: easingthemes/ssh-deploy@v5
        with:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_KEY }}
          ARGS: "-avz --delete"
          SOURCE: "./"
          REMOTE_HOST: ${{ secrets.HOST }}
          REMOTE_USER: ${{ secrets.USER }}
          TARGET: "/var/www/my-site/"
```

This runs automatically every time you push to `main`. No manual FTP, no forgotten updates.

## Running Tests on Every Pull Request

For developers, running tests automatically on pull requests is a lifesaver. Here's a workflow for a Node.js project that runs `npm test`:

```yaml
name: Run Tests
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
```

If the tests fail, the PR gets a red cross and you know immediately. You can extend this to linting, security scans, or even deploy previews.

## Scheduling Tasks with Cron

GitHub Actions also supports scheduled triggers via cron syntax. This is perfect for daily backups, clearing cache, or checking SSL certificate expiry.

```yaml
name: Daily Cleanup
on:
  schedule:
    - cron: '0 3 * * *'  # runs every day at 3 AM UTC
jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run cleanup script
        run: ./scripts/cleanup.sh
```

Remember that scheduled jobs may have slight delays, but for most maintenance tasks, they're more than reliable.

## Conclusion

GitHub Actions turns your repository into an automation hub. Start small—test a single job, then expand to deployments, notifications, or scheduled tasks. The YAML syntax is straightforward, and the marketplace has thousands of pre-built actions to save you time. Once you have one workflow running, you'll wonder how you ever lived without it.
