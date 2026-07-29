---
title: "Git & GitHub for IT Techs: A Practical Guide"
excerpt: "Learn Git & GitHub essentials for IT techs: branching, commits, repos, and real-world workflows. Practical tips for daily use."
date: "2026-07-29"
lang: "en"
slug: "git-github-for-it-techs-a-practical-guide"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

As an IT technician, you will eventually need to track changes, collaborate on scripts, or revert a broken configuration. Git is the industry standard for version control, and GitHub is where the world hosts its code. This guide cuts through the theory and gets you using Git and GitHub immediately.

## Why Git Matters for Technicians

Forget the hype. Git solves a specific problem: you break a config file, and you need to go back to "yesterday's version." Git tracks every change you make, allowing you to roll back instantly. It also lets you clone entire repositories, work on a fix, and merge it back without touching the live production code. This is not just for developers; it is a safety net for any technical workflow.

## Your First Local Repository

You need Git installed. On Debian/Ubuntu, run `sudo apt install git`. On CentOS/RHEL, use `sudo yum install git`. Verify with `git --version`.

Navigate to your project folder and initialize a repository:

```bash
cd /home/you/scripts
git init
```

This creates a hidden `.git` folder. Now, add a file and commit it:

```bash
echo "# My Scripts" > README.md
git add README.md
git commit -m "Initial commit: added README"
```

`git add` stages the file (tells Git to watch it), and `git commit` saves a permanent snapshot with a message. This is your safety checkpoint.

## Connecting to GitHub

Create a free account on GitHub.com. Create a new repository (do *not* add a README or license). GitHub will show you the remote URL. Back in your terminal, link your local repo to GitHub:

```bash
git remote add origin https://github.com/your-username/your-repo.git
git branch -M main
git push -u origin main
```

You will be prompted for your GitHub username and password. For security, use a **Personal Access Token** (PAT) instead of your password. Generate one on GitHub under Settings > Developer settings > Personal access tokens. Use the token as your password when prompted.

After `git push`, refresh your GitHub page. Your code is now online.

## Daily Workflow: Pull, Edit, Push

Every day, you follow a three-step cycle. First, **pull** the latest changes from GitHub to ensure you are working on the current version:

```bash
git pull origin main
```

Second, make your changes locally. Add and commit them:

```bash
git add edited-file.conf
git commit -m "Fixed DNS timeout in config"
```

Third, **push** your commits to GitHub:

```bash
git push origin main
```

If another technician has pushed changes before you, Git will tell you. Run `git pull` again, resolve any conflicts (Git marks them in the file), then push again.

## Essential Commands for Emergencies

- **Check status**: `git status` – shows which files are modified or untracked.
- **View history**: `git log --oneline` – shows a compact commit history.
- **Undo last commit (keep changes)**: `git reset --soft HEAD~1`
- **Discard all local changes**: `git checkout -- .` (careful, this is irreversible).
- **Create a branch**: `git branch fix-dns` then `git checkout fix-dns` – work on fixes without breaking `main`.

## Conclusion

Git and GitHub are not optional tools for a modern technician. They provide a robust safety net for your configurations and scripts, enable seamless collaboration, and give you a complete history of your work. Start small: initialize a repo for your `bash` scripts folder today. Once you see the power of `git log` and `git checkout`, you will never work without version control again.
