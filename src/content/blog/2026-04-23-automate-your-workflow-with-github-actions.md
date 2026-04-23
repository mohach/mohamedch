---
title: "Automate Your Workflow with GitHub Actions"
excerpt: "Learn how to automate repetitive tasks, testing, and deployments using GitHub Actions to streamline your development workflow."
date: "2026-04-23"
lang: "en"
slug: "automate-your-workflow-with-github-actions"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

If you're tired of manually deploying code, running tests, or copying files to a server every time you push a change, GitHub Actions can handle that for you. It’s a built-in CI/CD tool that lets you automate almost any task directly from your repository. In this post, I’ll show you the practical steps to set up a basic workflow that runs on every push.

## What You Need to Get Started

Before diving into code, make sure your repository is on GitHub. You don’t need any external services—Actions runs on GitHub’s infrastructure. You’ll also need a basic understanding of YAML, since workflows are defined in `.yml` files. Create a directory called `.github/workflows` in your repo root; that’s where all your automation files live.

## Creating Your First Workflow

Let’s build a simple workflow that runs a linting check on every push. Create a file named `lint.yml` inside `.github/workflows/`. Here’s a minimal example:

```yaml
name: Lint Check
on: [push]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install dependencies
        run: npm install
      - name: Run linter
        run: npm run lint
```

This workflow triggers on every push to any branch. It checks out your code, installs dependencies, and runs a lint script. If the linter fails, the workflow fails, and you get a red X on your commit. Replace `npm run lint` with your actual lint command—works for Python, PHP, or any language.

## Automating Deployment with Secrets

Now let’s automate deployment to a server. You’ll need to store sensitive data like SSH keys or API tokens as repository secrets. Go to your repo settings → Secrets and variables → Actions → New repository secret. Add something like `DEPLOY_KEY` with your private SSH key.

Here’s a deployment workflow example:

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
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.DEPLOY_KEY }}
          script: |
            cd /var/www/my-site
            git pull origin main
            npm install
            pm2 restart my-app
```

This workflow only runs when you push to the main branch. It connects to your server via SSH, pulls the latest code, installs dependencies, and restarts your app. The `appleboy/ssh-action` is a popular third-party action that handles the SSH connection securely.

## Running Tests on Pull Requests

You can also enforce quality checks before merging. Add a workflow that runs tests on pull requests:

```yaml
name: Test PR
on:
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Run tests
        run: pytest
```

This ensures no broken code gets merged into main. You can adapt it for Node.js, Go, or any other language by changing the setup step.

## Conclusion

GitHub Actions turns your repo into a powerful automation engine. Start with a simple lint check, then add deployment and test workflows as you get comfortable. The key is to keep workflows focused on single tasks and store secrets safely. Once you see that green checkmark on every push, you’ll wonder how you worked without it.
