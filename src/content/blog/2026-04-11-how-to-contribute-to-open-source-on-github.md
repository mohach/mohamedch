---
title: "How to Contribute to Open Source on GitHub"
excerpt: "Learn to fork, clone, and submit your first pull request to contribute to open-source projects on GitHub."
date: "2026-04-11"
lang: "en"
slug: "how-to-contribute-to-open-source-on-github"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

Contributing to open source projects on GitHub can feel intimidating at first, but it's one of the most rewarding ways to grow your skills, build your portfolio, and give back to the community. The process is standardized and welcoming once you know the steps. Here’s a practical guide to making your first contribution.

## Find a Suitable Project and Issue
Start by exploring projects you already use or are interested in. GitHub's `Explore` section or topics like `good-first-issue` are great resources. Look for repositories with a clear `CONTRIBUTING.md` file and an active issue tracker. A good starter issue is well-defined, labeled (e.g., `good first issue`, `help wanted`), and has recent activity. Avoid issues that are complex or involve core architecture for your first attempt. Read all the comments to ensure it's not already being worked on.

## Fork and Clone the Repository
Once you've chosen an issue, you need your own copy of the code. Click the **Fork** button at the top right of the repository page. This creates a personal copy under your GitHub account. Next, clone your forked repository to your local machine to start working.

```bash
git clone https://github.com/YOUR-USERNAME/REPOSITORY-NAME.git
cd REPOSITORY-NAME
```

It's crucial to add the original project (often called the "upstream") as a remote to sync the latest changes.

```bash
git remote add upstream https://github.com/ORIGINAL-OWNER/REPOSITORY-NAME.git
```

## Make Your Changes and Test
Before writing any code, create a new branch for your work. This keeps your changes organized and separate from the main branch.

```bash
git checkout -b fix-typo-in-readme
```

Now, make your necessary changes. Always follow the project's coding style and conventions. If you're fixing a bug, write a test if possible. Thoroughly test your changes locally. Once satisfied, stage and commit your work with a clear, descriptive message.

```bash
git add .
git commit -m "docs: fix typo in installation section of README"
```

## Submit a Pull Request
First, push your branch to your forked repository on GitHub.

```bash
git push origin fix-typo-in-readme
```

On GitHub, you'll see a prompt to **Compare & pull request**. Click it. Write a clear title and description for your Pull Request (PR). Reference the issue number (e.g., `Fixes #123`) so it can be linked automatically. Be prepared for feedback; maintainers may request changes. This is a normal part of the collaborative process. Update your branch and push again if changes are needed.

The journey from finding an issue to a merged PR is a fantastic learning experience. Start small, be patient, and don't be discouraged by feedback. Each contribution makes you a better developer and strengthens the open-source ecosystem.
