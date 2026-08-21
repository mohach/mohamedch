---
title: "Automate Your Workflow with GitHub Actions"
excerpt: "Learn how to automate builds, tests, and deployments with GitHub Actions, streamlining your dev workflow from commit to production."
date: "2026-08-21"
lang: "en"
slug: "automate-your-workflow-with-github-actions"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

If you're still manually deploying code, running tests on your laptop, or SSH-ing into servers to pull changes, you're wasting time. GitHub Actions lets you automate the entire pipeline—from commit to production—directly from your repository. Here's how to set up a practical workflow that actually saves you hours each week.

## The Basics: Your First Workflow File

GitHub Actions lives in `.github/workflows/` as YAML files. Every push, pull request, or schedule can trigger a workflow. Start with a simple one that runs tests on every push:

```yaml
name: CI
on: [push]
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

Save this as `.github/workflows/ci.yml`. That's it—your tests now run automatically on every commit. No more "works on my machine."

## Automating Deployment with SSH

The most common real-world use case: deploy to your own VPS or shared hosting. Instead of manual SSH commands, let the workflow handle it. Here's a deployment job that runs after tests pass:

```yaml
deploy:
  needs: test
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Deploy via SSH
      uses: appleboy/ssh-action@v1.0.3
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          cd /var/www/mysite
          git pull origin main
          composer install --no-dev
          sudo systemctl reload nginx
```

Store `SERVER_HOST`, `SERVER_USER`, and `SSH_PRIVATE_KEY` in your repository settings under **Settings → Secrets and variables → Actions**. Never hardcode credentials in the YAML file.

## Conditional Triggers: Don't Waste Resources

Running everything on every push is wasteful. Use path filters to run only what's needed:

```yaml
name: Deploy WordPress Plugin
on:
  push:
    branches: [main]
    paths:
      - 'plugin/**'
      - '!plugin/readme.txt'  # skip docs-only changes
  workflow_dispatch:  # manual trigger
```

For scheduled tasks—like nightly backups or database cleanups—use cron syntax:

```yaml
on:
  schedule:
    - cron: '0 3 * * *'  # every day at 3 AM
```

## Reusable Workflows and Caching

Don't repeat yourself across multiple projects. Create a reusable workflow in a central repo:

```yaml
# .github/workflows/deploy.yml (in your shared repo)
on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying to ${{ inputs.environment }}"
```

Then call it from any other repo:

```yaml
jobs:
  deploy-prod:
    uses: yourorg/shared-workflows/.github/workflows/deploy.yml@main
    with:
      environment: production
```

Also cache dependencies to speed things up:

```yaml
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

## Conclusion

GitHub Actions turns your repository into a CI/CD server with zero infrastructure costs. Start with one workflow—automate your tests first, then add deployment. Check the Actions tab after each push to see logs and fix failures. Within a week, you'll wonder how you ever deployed manually. The key is to start small and iterate.
