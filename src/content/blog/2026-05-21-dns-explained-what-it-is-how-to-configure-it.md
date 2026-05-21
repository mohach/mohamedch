---
title: "DNS Explained: What It Is & How to Configure It"
excerpt: "Learn what DNS is, how it works, and step-by-step instructions to configure it for faster, more secure browsing."
date: "2026-05-21"
lang: "en"
slug: "dns-explained-what-it-is-how-to-configure-it"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

If you type a website address into your browser and nothing loads, the problem is often not your internet connection but your DNS. DNS, or Domain Name System, is the phonebook of the internet, translating human-friendly names like `google.com` into machine-readable IP addresses. Getting your DNS configuration right can drastically improve speed, security, and reliability.

## What DNS Actually Does

Every time you visit a site, your device asks a DNS server: "What is the IP address for this domain?" The server responds with the correct IP, and your browser connects. By default, your Internet Service Provider (ISP) assigns you a DNS server, but these are often slow, unreliable, or even sell your browsing data. Switching to a better DNS provider is one of the easiest performance tweaks you can make.

## How to Check Your Current DNS

Before changing anything, see what you are using. On Linux or macOS, run:

```bash
# Linux (systemd-resolved)
resolvectl status

# macOS
scutil --dns | grep 'nameserver\[[0-9]*\]'
```

On Windows, open a command prompt and type:

```cmd
ipconfig /all | findstr "DNS Servers"
```

You will likely see your router's IP (like `192.168.1.1`) or your ISP's server. If it is your router, that router is forwarding queries to an upstream provider — often a slow one.

## Configuring Better DNS Servers

For most home users, the best approach is changing DNS on your router. This applies the setting to every device on your network. Log into your router's admin panel (usually `192.168.1.1` or `192.168.0.1`), find the DHCP or WAN settings, and replace the DNS fields.

Here are three reliable public providers:

- **Cloudflare**: `1.1.1.1` and `1.0.0.1` — fastest and privacy-focused
- **Google**: `8.8.8.8` and `8.8.4.4` — fast but logs some data
- **Quad9**: `9.9.9.9` — blocks malware domains automatically

Example router configuration:

| Setting | Primary DNS | Secondary DNS |
|---------|-------------|---------------|
| Cloudflare | `1.1.1.1` | `1.0.0.1` |
| Google | `8.8.8.8` | `8.8.4.4` |

If you cannot access your router, change DNS on your computer. On Linux with NetworkManager:

```bash
nmcli con mod "YourConnectionName" ipv4.dns "1.1.1.1 1.0.0.1"
nmcli con up "YourConnectionName"
```

## Testing and Verifying the Change

After updating, confirm it works. Visit [dnsleaktest.com](https://dnsleaktest.com) or run a quick command:

```bash
nslookup google.com
```

The response should show your new DNS server address. For a speed comparison, use `dig` to measure response times:

```bash
dig @1.1.1.1 google.com | grep "Query time"
dig @8.8.8.8 google.com | grep "Query time"
```

If you notice pages loading faster or fewer timeouts, the change was successful.

## Conclusion

DNS is a small but critical part of your internet setup. By switching from your ISP's default to a faster, more private resolver like Cloudflare or Quad9, you gain speed, security, and control. Configure it at the router level for system-wide benefits, and verify with a simple test. It takes five minutes and makes a real difference.
