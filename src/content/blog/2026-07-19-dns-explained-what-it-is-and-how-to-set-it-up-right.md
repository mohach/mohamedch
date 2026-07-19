---
title: "DNS Explained: What It Is & How to Set It Up Right"
excerpt: "Learn what DNS is, how it works, and how to configure it correctly for faster, more secure web browsing and network performance."
date: "2026-07-19"
lang: "en"
slug: "dns-explained-what-it-is-and-how-to-set-it-up-right"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

Every time you type a domain name into your browser, your device needs to translate it into an IP address. That’s where DNS comes in. It’s the phonebook of the internet, mapping human-friendly names like `google.com` to machine-readable numbers. Misconfigured DNS can lead to slow browsing, security risks, or outright downtime. Here’s how it works and how to set it up properly.

## What DNS Actually Does

DNS (Domain Name System) is a distributed database that resolves domain names to IP addresses. When you request a site, your device queries a DNS resolver—often your ISP’s—which then contacts authoritative nameservers to find the correct IP. The result is cached locally to speed up future requests. If your resolver is slow, unreliable, or insecure, your entire internet experience suffers.

## Choosing the Right DNS Servers

Your ISP’s DNS is often slow and may log your traffic. For better performance, privacy, and reliability, switch to a public DNS provider. Here are three solid options:

- **Cloudflare (1.1.1.1 / 1.0.0.1)** – Fast, privacy-focused, no logs.
- **Google (8.8.8.8 / 8.8.4.4)** – Reliable but data-hungry.
- **Quad9 (9.9.9.9)** – Blocks malware domains by default.

To test responsiveness, use `dig` on Linux or macOS:

```bash
dig @1.1.1.1 google.com | grep "Query time"
```

Or `nslookup` on Windows:

```cmd
nslookup google.com 8.8.8.8
```

Pick the fastest one for your location.

## How to Change DNS on Your Devices

You can configure DNS at the device level or router-wide. Here’s how to do it on common systems.

### On Linux (using systemd-resolved)

Edit `/etc/systemd/resolved.conf`:

```ini
[Resolve]
DNS=1.1.1.1 1.0.0.1
FallbackDNS=8.8.8.8 8.8.4.4
```

Then restart the service:

```bash
sudo systemctl restart systemd-resolved
```

### On Windows

Go to **Control Panel > Network and Sharing Center > Change adapter settings**. Right-click your connection, select **Properties**, then **Internet Protocol Version 4 (TCP/IPv4)**. Choose "Use the following DNS server addresses" and enter:

- Preferred: `1.1.1.1`
- Alternate: `1.0.0.1`

Click OK and flush the cache with `ipconfig /flushdns`.

### On Your Router

This applies DNS to every device on your network. Log into your router’s admin panel, find the DNS settings under WAN or Internet, and replace the ISP values with your chosen servers. Save and reboot the router.

## Verifying and Troubleshooting

After changing DNS, confirm it’s working:

```bash
nslookup google.com
```

The output should show your new resolver. If sites don’t load, flush your local DNS cache:

- **Linux (systemd-resolved):** `sudo resolvectl flush-caches`
- **Windows:** `ipconfig /flushdns`
- **macOS:** `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder`

For deeper issues, use `dig +trace example.com` to see the full resolution path.

## Conclusion

DNS is a small but critical piece of your network stack. Choosing fast, secure resolvers and configuring them correctly boosts speed, privacy, and reliability. Whether you tweak one device or your whole home network, the steps above take minutes and pay off daily.
