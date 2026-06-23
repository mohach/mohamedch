---
title: "Production Secrets & Environment Variables Management"
excerpt: "Learn how to securely manage environment variables across production, staging, and dev environments using proven DevOps practices."
date: "2026-06-23"
lang: "en"
slug: "production-secrets-environment-variables-management"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

In any production environment, hardcoding passwords, API keys, or database credentials is a security risk that can lead to catastrophic breaches. Managing secrets and environment variables properly is not just a best practice—it's a fundamental requirement for any serious deployment. This post covers practical, battle-tested methods to keep your sensitive data safe without slowing down your workflow.

## Why Environment Variables Aren't Enough

Many developers start by throwing secrets into `.env` files or exporting them directly in shell sessions. While environment variables are a step up from hardcoding, they have serious flaws in production:

- **Leakage via logs or error messages** — a crash dump can expose your entire environment.
- **Shared access** — anyone with SSH access to the server can run `printenv` or read `/proc/1/environ`.
- **No rotation or audit trail** — changing a secret means restarting the entire process.

For example, never do this in a production startup script:

```bash
export DB_PASSWORD="supersecret123"
```

Instead, treat environment variables as a delivery mechanism, not a storage solution. Use a dedicated secrets manager to inject them at runtime.

## Using a Secrets Manager: HashiCorp Vault

For multi-service or cloud-native setups, a secrets manager like Vault is the gold standard. It stores secrets encrypted at rest and provides dynamic, short-lived credentials.

Basic workflow:

1. Start Vault in dev mode (never in production):
   ```bash
   vault server -dev
   ```
2. Store a secret:
   ```bash
   vault kv put secret/myapp DB_PASSWORD="$(openssl rand -base64 32)"
   ```
3. Retrieve it in your app using the Vault API or a sidecar agent:
   ```bash
   export DB_PASSWORD=$(vault kv get -field=DB_PASSWORD secret/myapp)
   ```

For production, use Vault Agent to automatically fetch and renew secrets into a temporary file or environment variable without exposing the master token.

## Practical Approaches for Smaller Setups

Not everyone runs Kubernetes or Vault. For a single VPS or a small cluster, these methods work well:

**1. Encrypted `.env` files with `sops` (SOPS by Mozilla)**  
Encrypt only the values, decrypt on the fly:
```bash
# Encrypt
sops --encrypt .env > .env.enc
# Decrypt to environment
source <(sops --decrypt .env.enc)
```
Keep `.env.enc` in your repo, but never the plaintext `.env`.

**2. Systemd service with a secure environment file**  
Set permissions to 600 and point your service to it:
```ini
[Service]
EnvironmentFile=/etc/myapp/secrets
User=myapp
```
```bash
chmod 600 /etc/myapp/secrets
chown myapp:myapp /etc/myapp/secrets
```

**3. Docker secrets (Swarm or Compose)**  
Mount secrets as files, never as environment variables:
```yaml
secrets:
  db_password:
    file: ./db_password.txt

services:
  app:
    secrets:
      - db_password
```
Read them in your app from `/run/secrets/db_password`.

## Automating Rotation and Auditing

Secrets should expire and be replaced regularly. For database credentials, use dynamic secrets:

- **Vault + PostgreSQL**: Generate a 24-hour password that auto-revokes.
- **AWS Secrets Manager**: Set automatic rotation with Lambda.

Add a cron job or systemd timer to rotate static secrets weekly:
```bash
# Rotate DB password and update app config
NEW_PASS=$(openssl rand -base64 32)
vault kv put secret/myapp DB_PASSWORD="$NEW_PASS"
systemctl reload myapp
```

Always log secret access events (who accessed what and when) to a SIEM or central log server.

## Conclusion

Managing secrets in production doesn't require enterprise tools, but it does require discipline. Start with encrypted files and strict permissions for small deployments, then graduate to Vault or cloud-native secret stores as you scale. Never hardcode, never commit plaintext secrets, and always rotate credentials automatically. Your future self—and your users—will thank you.
