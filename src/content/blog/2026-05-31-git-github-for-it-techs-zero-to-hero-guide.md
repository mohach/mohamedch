---
title: "Git & GitHub for IT Techs: Zero-to-Hero Guide"
excerpt: "Learn Git and GitHub from scratch with this practical zero-to-hero guide for IT techs, covering commands, workflows, and real-world tips."
date: "2026-05-31"
lang: "en"
slug: "git-github-for-it-techs-zero-to-hero-guide"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

If you work in IT, you've likely heard about Git and GitHub, but maybe you haven't had the chance to use them hands-on. This guide is for technicians who want a no-fluff, practical introduction to version control using real commands and workflows you'll actually use on the job.

## Why Git Matters for Technicians

Git is a distributed version control system that tracks changes in files, making it essential for collaboration and rollback. Whether you're managing configuration files, deploying scripts, or maintaining a WordPress site, Git gives you a safety net. GitHub is a cloud platform that hosts Git repositories, enabling team collaboration, issue tracking, and CI/CD pipelines. Together, they let you experiment without fear—and revert mistakes in seconds.

## Setting Up and Your First Repository

First, install Git on your Linux machine:

```bash
sudo apt update && sudo apt install git -y   # Debian/Ubuntu
```

Configure your identity (required for commits):

```bash
git config --global user.name "Mohamed Chennani"
git config --global user.email "mohamed@example.com"
```

Now create a local repository for a project, say a collection of server scripts:

```bash
mkdir server-tools
cd server-tools
git init
```

Add a file and make your first commit:

```bash
echo "# Server Tools" > README.md
git add README.md
git commit -m "Initial commit: add README"
```

The `git add` stages changes, and `git commit` saves them with a message. Always write clear, concise commit messages—your future self will thank you.

## Branching and Basic Workflow

Branches let you work on features or fixes without breaking the main codebase. The default branch is usually `main` or `master`.

Create a new branch for a backup script:

```bash
git checkout -b feature/backup-script
```

Edit or create files, then stage and commit:

```bash
echo '#!/bin/bash' > backup.sh
echo 'rsync -av /data /backup' >> backup.sh
chmod +x backup.sh
git add backup.sh
git commit -m "Add basic backup script"
```

When the feature is stable, merge it back into `main`:

```bash
git checkout main
git merge feature/backup-script
```

Delete the branch after merging to keep things tidy:

```bash
git branch -d feature/backup-script
```

## Pushing to GitHub and Collaborating

Create a new repository on GitHub (empty, no README or .gitignore). Then connect your local repo:

```bash
git remote add origin https://github.com/yourusername/server-tools.git
git branch -M main
git push -u origin main
```

Now your code is online. To collaborate, others can clone it:

```bash
git clone https://github.com/yourusername/server-tools.git
```

When you make changes locally, push them:

```bash
git add .
git commit -m "Fix rsync destination path"
git push
```

If you're working with a team, always pull before you push to avoid conflicts:

```bash
git pull origin main
```

Resolve any merge conflicts manually in the affected files, then commit the resolution.

## Conclusion

Git and GitHub are not just for developers. As an IT technician, they give you control, traceability, and the ability to revert mistakes in seconds. Start small: version your scripts, configuration files, or documentation. Once you master `add`, `commit`, `push`, `pull`, and `branch`, you'll wonder how you ever worked without them.
