---
title: "How to Secure an SSH Server on Ubuntu Step by Step"
excerpt: "Learn to harden your Ubuntu SSH server with this step-by-step guide covering key authentication, firewall rules, and security best practices."
date: "2026-05-01"
lang: "en"
slug: "how-to-secure-an-ssh-server-on-ubuntu-step-by-step"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

SSH is the backbone of remote server management, but a default installation is a wide-open door for bots and attackers. Hardening your SSH configuration on Ubuntu is one of the most effective ways to protect your server. Here’s a practical, step-by-step guide to lock it down.

## 1. Update and Install a Firewall

Before tweaking SSH itself, ensure your system is up to date and your firewall is active. Run:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install ufw -y
```

Configure UFW to allow only SSH (on a non-standard port, which we’ll set later) and any other services you need:

```bash
sudo ufw allow 2222/tcp  # Change 2222 to your custom port
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

Verify with `sudo ufw status`. This blocks everything except what you explicitly allow.

## 2. Change the Default SSH Port and Disable Root Login

Edit the SSH daemon config file:

```bash
sudo nano /etc/ssh/sshd_config
```

Make these critical changes:

- **Change the port** from 22 to something higher (e.g., 2222):
  ```
  Port 2222
  ```
- **Disable root login** (use `sudo` instead):
  ```
  PermitRootLogin no
  ```
- **Disable password authentication** if you use SSH keys (recommended):
  ```
  PasswordAuthentication no
  ```
- **Enable public key authentication**:
  ```
  PubkeyAuthentication yes
  ```

Save and restart SSH:

```bash
sudo systemctl restart sshd
```

**Important**: Before disabling password auth, ensure your SSH key is in place (see next step). Keep a second terminal session open to test changes without locking yourself out.

## 3. Set Up SSH Key Authentication

Generate an SSH key pair on your local machine (not the server):

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

Copy the public key to your server:

```bash
ssh-copy-id -p 2222 your_user@server_ip
```

If `ssh-copy-id` isn’t available, manually append the public key to `~/.ssh/authorized_keys` on the server. Test login with the new port:

```bash
ssh -p 2222 your_user@server_ip
```

Once it works, disable password authentication as shown above.

## 4. Add Extra Hardening Measures

Still in `/etc/ssh/sshd_config`, add these lines for additional security:

- **Limit user access**: Only allow specific users or groups:
  ```
  AllowUsers your_user another_user
  ```
- **Set idle timeout** to auto-disconnect inactive sessions:
  ```
  ClientAliveInterval 300
  ClientAliveCountMax 2
  ```
- **Disable X11 forwarding** if not needed:
  ```
  X11Forwarding no
  ```
- **Use a strong cipher suite** (modern Ubuntu defaults are fine, but you can restrict further):
  ```
  KexAlgorithms curve25519-sha256@libssh.org,diffie-hellman-group16-sha512
  ```

Restart SSH again. Finally, install `fail2ban` to block repeated failed attempts:

```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
```

Configure it for SSH by editing `/etc/fail2ban/jail.local` with a `[sshd]` section setting `bantime = 3600` and `maxretry = 5`.

## Conclusion

Securing SSH is not a one-time task but a baseline practice for any Ubuntu server. By changing the port, disabling root login, enforcing key-based authentication, and adding fail2ban, you drastically reduce your attack surface. Always test changes in a separate session to avoid accidental lockouts, and keep your system updated regularly. Your server will thank you.
