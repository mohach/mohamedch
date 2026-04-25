---
title: "Managing Secrets & Environment Variables in Production"
excerpt: "Learn best practices for managing secrets and environment variables in production, including tools, security tips, and real-world Linux deployment strategies."
date: "2026-04-25"
lang: "en"
slug: "managing-secrets-environment-variables-in-production"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

Every time I see credentials hardcoded in a config file or, worse, committed to a Git repository, I cringe. Managing secrets like API keys, database passwords, and tokens is one of the most overlooked aspects of deploying applications. In production, a leak means a breach. Let me show you how to handle environment variables and secrets properly, based on what actually works in the real world.

## Why .env Files Are Not Enough for Production

The `.env` file is great for local development, but it’s a liability in production. Sourcing a file on the server means the secrets exist as plain text on disk, accessible to anyone who compromises the machine. Worse, if the file ends up in your version control history, those secrets are exposed forever. Instead, treat production secrets as ephemeral—never stored in files, never in code.

## Injecting Secrets Through the Environment

The simplest and most secure method is to inject secrets directly into the environment at runtime. On Linux, you can use systemd service files to pass variables securely. Here’s an example for a Node.js app:

```ini
[Service]
Environment=DB_PASSWORD=your_secure_password
Environment=API_KEY=abc123def
ExecStart=/usr/bin/node /opt/app/server.js
```

Set the file permissions to 600 and owned by root. For Docker containers, use the `--env` flag or an environment file passed at runtime, but never bake secrets into the image. Example:

```bash
docker run -e DB_PASSWORD='supersecret' -e API_KEY='xyz' myapp:latest
```

This keeps secrets out of the image layers.

## Using a Secrets Manager for Centralized Control

For multi-service setups or team environments, a secrets manager is a game-changer. HashiCorp Vault is the industry standard, but for smaller setups, I often rely on Bitwarden Secrets Manager or even a simple encrypted file with `sops` (Mozilla SOPS). Here’s how to fetch a secret from Vault using the CLI:

```bash
export DB_PASSWORD=$(vault kv get -field=password secret/myapp/db)
```

Then run your application. The secret never touches disk. For Docker Swarm or Kubernetes, use built-in secret stores. In Kubernetes:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-password
type: Opaque
data:
  password: c3VwZXJzZWNyZXQ= # base64 encoded
```

Mount it as a volume or an environment variable. The key point: secrets are encrypted at rest and never logged.

## Automating Secret Rotation Without Downtime

Static secrets are a ticking bomb. Automate rotation with a cron job or a CI/CD pipeline. For example, with a PostgreSQL database, you can generate a new password every 30 days and update your application’s environment without restarting. If your app supports hot-reload, send a SIGHUP signal:

```bash
kill -HUP $(pgrep -f myapp)
```

Or use a tool like `consul-template` to watch Vault and rewrite config files on the fly. Here’s a simple script to rotate a secret in Vault and update a systemd service:

```bash
#!/bin/bash
NEW_PASS=$(openssl rand -base64 32)
vault kv put secret/myapp/db password=$NEW_PASS
systemctl set-environment DB_PASSWORD=$NEW_PASS
systemctl restart myapp
```

Run this via cron and you’re covered.

## Conclusion

Managing secrets in production isn’t complicated, but it requires discipline. Ditch the `.env` files, inject secrets at runtime, use a secrets manager for scale, and automate rotation. Your future self—and your users—will thank you when the next breach attempt fails.
