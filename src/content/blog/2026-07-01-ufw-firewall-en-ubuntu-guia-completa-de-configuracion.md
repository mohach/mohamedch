---
title: "UFW Firewall en Ubuntu: Guía Completa de Configuración"
excerpt: "Learn how to install, configure, and manage UFW firewall on Ubuntu with practical examples for secure server protection."
date: "2026-07-01"
lang: "en"
slug: "ufw-firewall-en-ubuntu-guia-completa-de-configuracion"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

UFW (Uncomplicated Firewall) is the default frontend for iptables on Ubuntu, designed to make firewall management simple and secure. While it’s easy to enable and disable, a proper configuration ensures your server only allows necessary traffic, blocking everything else by default. Here’s a complete guide to setting up UFW for real-world use.

## Basic Setup and Default Policies

Start by checking UFW status and setting default rules to deny incoming traffic while allowing outgoing. This is the most secure baseline.

```bash
sudo ufw status
sudo ufw default deny incoming
sudo ufw default allow outgoing
```

Now enable UFW with:

```bash
sudo ufw enable
```

Always enable SSH *before* enabling the firewall, or you’ll lock yourself out. If SSH is already running, add its rule first:

```bash
sudo ufw allow ssh
```

Or specify the port explicitly:

```bash
sudo ufw allow 22/tcp
```

## Allowing Specific Services and Ports

For a typical web server, you’ll need HTTP and HTTPS. Use service names or port numbers:

```bash
sudo ufw allow http
sudo ufw allow https
# Equivalent to:
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

For custom services like a Node.js app on port 3000:

```bash
sudo ufw allow 3000/tcp
```

You can also allow from specific IP ranges. For example, restrict SSH to your office network:

```bash
sudo ufw allow from 192.168.1.0/24 to any port 22
```

This is far safer than leaving SSH open to the world.

## Advanced Rules: Rate Limiting and Logging

Protect against brute-force attacks by rate-limiting SSH connections. UFW supports this natively:

```bash
sudo ufw limit ssh
```

This blocks an IP if it attempts more than 6 connections in 30 seconds. It’s lightweight and effective.

Enable logging to monitor blocked attempts:

```bash
sudo ufw logging on
```

Logs go to `/var/log/ufw.log`. Check them with:

```bash
sudo tail -f /var/log/ufw.log
```

For more granular control, edit the rules file directly (`/etc/ufw/before.rules`) but use `sudo ufw reload` after. Example: blocking all traffic from a specific IP:

```bash
sudo ufw deny from 203.0.113.5
```

## Managing Rules and Checking Status

View all active rules with numbered output:

```bash
sudo ufw status numbered
```

To delete a rule by number (e.g., rule #3):

```bash
sudo ufw delete 3
```

Or delete by full specification:

```bash
sudo ufw delete allow 80/tcp
```

Reset everything to factory defaults (careful—this removes all rules):

```bash
sudo ufw reset
```

Then reapply your rules from scratch.

## Conclusion

UFW gives you a powerful, readable firewall without the complexity of raw iptables. Start with deny-incoming, allow-outgoing defaults, then explicitly permit only the services you need. Use rate limiting for SSH, enable logging, and regularly review your rules. This approach keeps your Ubuntu server secure while staying manageable—exactly what production environments require.
