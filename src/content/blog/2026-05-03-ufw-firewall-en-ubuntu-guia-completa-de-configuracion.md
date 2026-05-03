---
title: "UFW Firewall en Ubuntu: Guía Completa de Configuración"
excerpt: "Aprende a configurar UFW en Ubuntu paso a paso: reglas, perfiles, logs y mejores prácticas para asegurar tu servidor Linux."
date: "2026-05-03"
lang: "en"
slug: "ufw-firewall-en-ubuntu-guia-completa-de-configuracion"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

If you manage Ubuntu servers, the Uncomplicated Firewall (UFW) is your go-to tool for controlling traffic without the complexity of raw iptables. It’s pre-installed on most Ubuntu systems and gives you a clean, command-line interface to define rules quickly. Whether you’re locking down a web server or a home lab, this guide covers a complete setup from installation to advanced rules.

## Initial Setup and Basic Rules

First, ensure UFW is installed and enabled. Most Ubuntu installations include it, but you can install it with:

```bash
sudo apt update && sudo apt install ufw -y
```

Before enabling the firewall, set a default policy to deny all incoming traffic and allow all outgoing. This is the safest starting point:

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
```

Now, allow essential services. For SSH (port 22), HTTP (80), and HTTPS (443), run:

```bash
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

Enable UFW with:

```bash
sudo ufw enable
```

Check the status and rules with:

```bash
sudo ufw status verbose
```

You should see a numbered list of rules. Always confirm SSH is allowed before enabling—locking yourself out is a common mistake.

## Advanced Rules and Application Profiles

UFW supports application profiles for common services. List available profiles:

```bash
sudo ufw app list
```

For example, to allow OpenSSH using its profile:

```bash
sudo ufw allow 'OpenSSH'
```

You can also allow traffic from specific IP addresses. To allow SSH only from your home IP 192.168.1.100:

```bash
sudo ufw allow from 192.168.1.100 to any port 22
```

For a web server that needs database access from a specific subnet, allow MySQL (port 3306) from 10.0.0.0/24:

```bash
sudo ufw allow from 10.0.0.0/24 to any port 3306
```

Rate limiting helps block brute-force attacks. Limit SSH connections to 6 per 30 seconds from a single IP:

```bash
sudo ufw limit ssh
```

## Logging, Deleting, and Resetting Rules

Enable logging to monitor denied packets:

```bash
sudo ufw logging on
```

Logs go to `/var/log/ufw.log`. Check them with:

```bash
sudo tail -f /var/log/ufw.log
```

To delete a rule, list rules with numbers first:

```bash
sudo ufw status numbered
```

Then delete by number (e.g., rule 3):

```bash
sudo ufw delete 3
```

If you need to start fresh, reset everything:

```bash
sudo ufw reset
```

This disables UFW and removes all rules—use it carefully, especially on remote servers.

## Practical Example: Securing a Web Server

Here’s a real-world scenario for a basic LAMP or WordPress server:

```bash
# Defaults
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH from your office IP
sudo ufw allow from 203.0.113.50 to any port 22

# Allow web traffic
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow MySQL from app server subnet (if separate)
sudo ufw allow from 10.0.1.0/24 to any port 3306

# Rate limit SSH
sudo ufw limit ssh

# Enable
sudo ufw enable
```

This setup blocks everything except SSH from your office, web traffic, and internal database access. It’s tight, practical, and easy to audit.

## Conclusion

UFW gives you powerful firewall control without the iptables headache. Start with defaults, allow what you need, and use logging to spot issues. Always test rules locally or via a secondary SSH session before locking yourself out. With these commands, you can secure any Ubuntu server in minutes.
