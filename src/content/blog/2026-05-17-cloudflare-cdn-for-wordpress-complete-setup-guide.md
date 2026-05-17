---
title: "Cloudflare CDN for WordPress: Complete Setup Guide"
excerpt: "Learn how to configure Cloudflare CDN for WordPress with this complete setup guide to boost speed, security, and performance."
date: "2026-05-17"
lang: "en"
slug: "cloudflare-cdn-for-wordpress-complete-setup-guide"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

If you run a WordPress site, you already know speed matters. Cloudflare’s CDN can cut load times drastically, but a sloppy setup will break plugins, forms, or even your admin panel. Here’s the exact configuration I use on production sites after years of trial and error.

## DNS and Proxy Setup

First, point your domain’s nameservers to Cloudflare. Once that propagates, go to the **DNS** tab and ensure each A/AAAA record for your domain (and `www`) has the orange cloud icon — that enables the CDN proxy.

```bash
# Example dig output after propagation
dig +short example.com
# Should return Cloudflare IPs like 104.21.x.x
```

Don’t forget CNAME records for any subdomains you use. If you run a staging site, leave that record grey (DNS only) to avoid caching issues.

## SSL/TLS and HTTPS Rewrites

In the **SSL/TLS** section:
- Set encryption mode to **Full (strict)** — this requires a valid SSL certificate on your origin server (Let’s Encrypt works fine).
- Enable **Always Use HTTPS** and **Automatic HTTPS Rewrites**.

On your WordPress server, force HTTPS in `wp-config.php`:

```php
define('FORCE_SSL_ADMIN', true);
```

If you use a reverse proxy like Nginx, also add:

```php
if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
    $_SERVER['HTTPS'] = 'on';
}
```

## Page Rules for Critical Caching

Cloudflare’s default caching is too aggressive for WordPress. Create these page rules under **Rules > Page Rules**:

1. **`example.com/wp-admin*`** — Set **Cache Level: Bypass** and **Security Level: High** (stops caching admin pages).
2. **`example.com/*.php`** — Set **Cache Level: Bypass** (prevents caching dynamic AJAX handlers).
3. **`example.com/wp-content/uploads/*`** — Set **Cache Level: Standard** and **Edge Cache TTL: 1 month** (static assets get a long TTL).

For the front page, add a rule: `example.com/` → **Cache Level: Standard** with **Edge Cache TTL: 4 hours**. This improves TTFB for visitors without stale content.

## Real IP and Plugin Integration

Cloudflare proxies requests, so WordPress logs their IPs instead of yours. Install the official **Cloudflare** plugin — it automatically restores visitor IPs and works with caching plugins like WP Rocket or W3 Total Cache.

If you prefer manual setup, add this to your theme’s `functions.php`:

```php
if (isset($_SERVER['HTTP_CF_CONNECTING_IP'])) {
    $_SERVER['REMOTE_ADDR'] = $_SERVER['HTTP_CF_CONNECTING_IP'];
}
```

Also, under **Speed > Optimization** in Cloudflare dashboard, enable **Rocket Loader** (set to Automatic) and **Mirage** for image optimization. Turn **Brotli** on for better compression.

## Firewall and Performance Tweaks

Under **Security > WAF**, enable the **Cloudflare Managed Ruleset** — it blocks common WordPress exploits (SQLi, XSS) without false positives. Add a rate-limiting rule for `/wp-login.php`:

- **URL**: `example.com/wp-login.php`
- **Requests**: 10 per minute
- **Action**: Block

For performance, go to **Speed > Optimization** and enable **Auto Minify** for HTML, CSS, and JavaScript. Don’t minify via both Cloudflare and a WordPress plugin — pick one to avoid broken layouts.

## Conclusion

A properly configured Cloudflare CDN turns a sluggish WordPress site into a snappy one. The key is balancing caching for static assets while keeping dynamic pages (admin, checkout) uncached. Test with a tool like GTmetrix after each change — you should see Time to First Byte drop below 300ms.
