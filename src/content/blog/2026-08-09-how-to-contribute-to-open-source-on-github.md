---
title: "How to Contribute to Open Source on GitHub"
excerpt: "Learn how to contribute to open source on GitHub with a step-by-step guide for beginners, from forking to submitting your first pull request."
date: "2026-08-09"
lang: "en"
slug: "how-to-contribute-to-open-source-on-github"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

Contributing to open source can feel intimidating at first, but it’s one of the most rewarding ways to improve your skills, build a portfolio, and give back to the tools you use daily. The secret is to start small and follow a clear workflow. Here’s a practical, step-by-step approach to making your first pull request on GitHub without the fear.

## Start with the Right Mindset and Repository

Don’t begin with a massive framework. Look for projects you already use or that match your skill level. Filter GitHub searches with `label:good first issue` and `label:hacktoberfest` to find beginner-friendly tasks. Also, check the project’s `CONTRIBUTING.md` file—it usually explains coding standards, how to run tests, and where to ask questions.

Before writing any code, read the `README.md` and existing issues. If an issue is unclear, leave a comment asking for clarification. Maintainers appreciate that you’re checking before diving in, and it prevents wasted effort.

## Fork, Clone, and Branch Like a Pro

Once you’ve found an issue, fork the repository to your GitHub account. Then clone it locally and set up the upstream remote:

```bash
git clone https://github.com/your-username/project.git
cd project
git remote add upstream https://github.com/original-owner/project.git
git checkout -b fix/descriptive-branch-name
```

Never commit directly to `main` or `master`. Always create a new branch. This keeps your changes isolated and makes it easy to update your fork later:

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

## Make Small, Tested Changes

Write your fix or feature, but keep it minimal. If you’re fixing a bug, reproduce it first. If you’re adding documentation, check for consistency with existing pages. Run the project’s test suite before committing:

```bash
npm test
# or
pytest
# or
make test
```

If the project doesn’t have tests, at least verify your change doesn’t break the build. Commit with a clear message that references the issue number:

```bash
git add .
git commit -m "Fix typo in installation docs (fixes #123)"
git push origin fix/descriptive-branch-name
```

## Open a Pull Request That Gets Merged

Go to your fork on GitHub and click “Compare & pull request.” Write a concise description that includes:

- What the change does
- How you tested it
- Any screenshots or logs

Example PR body:

```
## Summary
Fixed the broken link in the README installation section.

## Test Plan
- Ran `npm test` — all 42 tests pass.
- Manually verified the new URL loads without a 404.

Closes #123
```

Be responsive to feedback. If a maintainer asks for changes, update your branch and push again—the PR updates automatically. Don’t take criticism personally; it’s part of the process.

## Conclusion

Open source contribution is a skill like any other. Start with small documentation fixes or single-line bug patches, and build up from there. The key is consistency: one solid PR a month beats a dozen abandoned branches. Before long, you’ll have a track record that speaks for itself, and you’ll have helped make the software ecosystem a little better for everyone.
