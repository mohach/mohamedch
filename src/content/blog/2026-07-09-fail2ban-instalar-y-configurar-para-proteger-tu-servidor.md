---
title: "Fail2ban: Instalar y Configurar para Proteger tu Servidor"
excerpt: "Learn how to install and configure Fail2ban to protect your Linux server from brute-force attacks with this practical step-by-step guide."
date: "2026-07-09"
lang: "en"
slug: "fail2ban-instalar-y-configurar-para-proteger-tu-servidor"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

If you run any kind of internet-facing server, you’ve probably seen the logs: endless failed SSH attempts, bots probing for WordPress login pages, or repeated HTTP scans. Fail2ban is the first line of defense, automatically blocking IPs that show malicious behavior. Here’s how to install, configure, and fine-tune it on a typical Linux server.

## Instalación básica

Fail2ban is available in most distro repositories. On Debian/Ubuntu, run:

```bash
sudo apt update
sudo apt install fail2ban -y
```

For CentOS/RHEL 8+ or Fedora:

```bash
sudo dnf install epel-release
sudo dnf install fail2ban -y
```

Once installed, enable and start the service:

```bash
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## Configuración inicial: protege SSH primero

Fail2ban uses `.local` files to override defaults. Never edit `/etc/fail2ban/jail.conf` directly — it gets overwritten on updates. Instead, create `/etc/fail2ban/jail.local`:

```ini
[DEFAULT]
# Ban IP after 5 failed attempts
maxretry = 5
# Ban for 10 minutes (600 seconds)
bantime = 600
# Find failures within 10 minutes
findtime = 600

# Ignore your own IP (add multiple with spaces)
ignoreip = 127.0.0.1/8 192.168.1.100

[sshd]
enabled = true
port = ssh
logpath = %(sshd_log)s
```

Restart to apply:

```bash
sudo systemctl restart fail2ban
```

Check status with:

```bash
sudo fail2ban-client status sshd
```

You should see a list of currently banned IPs and total failures.

## Agregar protecciones adicionales

Fail2ban ships with many jail templates. Here are two practical ones for a web server:

### Proteger Nginx/Apache (ataques HTTP)

Create or edit `/etc/fail2ban/jail.local` and add:

```ini
[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 3
bantime = 3600
```

For Apache:

```ini
[apache-auth]
enabled = true
port = http,https
logpath = /var/log/apache2/error.log
maxretry = 3
bantime = 3600
```

### Proteger WordPress contra fuerza bruta

If you use WordPress, add a custom filter. Create `/etc/fail2ban/filter.d/wordpress.conf`:

```
[Definition]
failregex = ^<HOST> .* "POST /wp-login.php
ignoreregex =
```

Then add to `jail.local`:

```ini
[wordpress]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
filter = wordpress
maxretry = 5
bantime = 1800
```

## Monitoreo y ajuste fino

Use these commands daily:

- `sudo fail2ban-client status` — list all active jails
- `sudo fail2ban-client status sshd` — detailed stats for SSH
- `sudo fail2ban-client set sshd unbanip 192.168.1.50` — manually unban an IP (useful if you lock yourself out)

**Pro tip:** Set `bantime = -1` in a jail to permanently ban repeat offenders (use with caution). For production, keep `bantime` between 10-60 minutes to avoid locking out legitimate users.

## Conclusión

Fail2ban is a lightweight, effective tool that every server admin should deploy. It takes ten minutes to set up and immediately reduces noise from bots and brute-force attacks. Start with SSH, add web services as needed, and check the logs weekly — your server will thank you.
