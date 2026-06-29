---
title: "How to Secure SSH Server on Ubuntu Step by Step"
excerpt: "Learn how to secure your Ubuntu SSH server step by step with key hardening tips to prevent unauthorized access and cyber threats."
date: "2026-06-29"
lang: "en"
slug: "how-to-secure-ssh-server-on-ubuntu-step-by-step"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

If you're running a Linux server, SSH is your primary gateway. Unfortunately, it's also the first thing bots probe. A default Ubuntu SSH installation is functional but far from secure. Here's a practical, step-by-step guide to harden your SSH server against automated attacks and unauthorized access.

## 1. Disable Root Login and Password Authentication

The single most effective change is to prevent direct root login and disable password-based authentication. This forces users to authenticate with SSH keys, which are virtually immune to brute-force attacks.

First, generate an SSH key pair on your local machine if you haven't already:
```bash
ssh-keygen -t ed25519 -a 100
```
Copy the public key to your server:
```bash
ssh-copy-id youruser@your-server-ip
```

Now, edit the SSH daemon configuration:
```bash
sudo nano /etc/ssh/sshd_config
```
Set or add these lines:
```
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
ChallengeResponseAuthentication no
```
Restart SSH to apply changes:
```bash
sudo systemctl restart sshd
```
**Warning**: Keep your current terminal session open until you test the new configuration in a separate window. You don't want to lock yourself out.

## 2. Change the Default Port and Limit Users

Bots scan port 22 relentlessly. Moving SSH to a non-standard port instantly reduces noise. Choose a port above 1024 to avoid conflicts.

In `/etc/ssh/sshd_config`, add:
```
Port 2222
```
Also restrict which users can SSH. If only one user needs access, specify them:
```
AllowUsers youruser
```
If you have multiple users, list them separated by spaces. This prevents any other local account from being used for SSH access.

Update your firewall to allow the new port and block the old one:
```bash
sudo ufw allow 2222/tcp
sudo ufw deny 22/tcp
sudo ufw reload
```

## 3. Implement Fail2ban for Automatic Blocking

Fail2ban monitors authentication logs and temporarily bans IPs after repeated failed attempts. It's your second line of defense.

Install it:
```bash
sudo apt update && sudo apt install fail2ban -y
```
Create a local configuration file:
```bash
sudo nano /etc/fail2ban/jail.local
```
Add:
```
[sshd]
enabled = true
port = 2222
maxretry = 3
bantime = 3600
findtime = 600
```
This bans an IP for one hour after three failed attempts within ten minutes. Restart Fail2ban:
```bash
sudo systemctl restart fail2ban
```

## 4. Enable Two-Factor Authentication (Optional but Recommended)

For critical servers, add a second factor. Install Google Authenticator PAM module:
```bash
sudo apt install libpam-google-authenticator -y
```
Run the setup for your user:
```bash
google-authenticator
```
Follow the prompts and scan the QR code with an authenticator app.

Then edit PAM configuration for SSH:
```bash
sudo nano /etc/pam.d/sshd
```
Add at the top:
```
auth required pam_google_authenticator.so
```
In `/etc/ssh/sshd_config`, set:
```
KbdInteractiveAuthentication yes
AuthenticationMethods publickey,keyboard-interactive
```
Restart SSH again. Now users need both their SSH key and a time-based one-time password.

## Conclusion

These steps will transform your Ubuntu SSH server from an open door to a fortified gate. Start with disabling root login and password authentication—that alone stops most attacks. Then add port change, Fail2ban, and optionally 2FA for maximum protection. Test each change incrementally, and always keep a backup session alive until you verify everything works. Your server will thank you.
