---
title: "Cloudflare CDN for WordPress: Complete Setup Guide"
excerpt: "Learn how to set up Cloudflare CDN with WordPress step by step for faster speeds, better security, and improved performance."
date: "2026-07-15"
lang: "en"
slug: "cloudflare-cdn-for-wordpress-complete-setup-guide"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

If you run a WordPress site, adding Cloudflare is one of the most effective ways to improve speed, security, and reliability. The setup goes beyond just changing nameservers — you need to configure both Cloudflare and WordPress to work together properly. Here’s the complete, no-fluff guide I use for every site I manage.

## 1. Initial DNS and SSL Setup

First, point your domain to Cloudflare by updating your nameservers at your registrar. Once Cloudflare is active, configure your DNS records. For a standard WordPress site, you need at least two A records:

```
example.com   A    <your-server-IP>
www           A    <your-server-IP>
```

Enable the orange cloud (proxy) on both. This forces traffic through Cloudflare, hiding your real IP.

Next, set SSL/TLS to **Full (strict)**. This requires a valid SSL certificate on your origin server. If you’re using Let’s Encrypt, make sure it’s installed and auto-renewing. Cloudflare will handle the edge certificate automatically.

## 2. Restore Real Visitor IPs

Once Cloudflare proxies your traffic, WordPress sees Cloudflare’s IP instead of the visitor’s. This breaks logging, geolocation, and security plugins. Fix it by installing the **Cloudflare WordPress plugin** — it automatically detects and restores real IPs.

If you prefer manual control, add this to your `wp-config.php`:

```php
if (isset($_SERVER['HTTP_CF_CONNECTING_IP'])) {
    $_SERVER['REMOTE_ADDR'] = $_SERVER['HTTP_CF_CONNECTING_IP'];
}
```

Then verify with a simple PHP script that logs `$_SERVER['REMOTE_ADDR']`. Your access logs should now show real visitor IPs.

## 3. Cache Configuration for WordPress

Cloudflare’s default caching won’t cache HTML pages — only static assets. To cache WordPress pages, create a **Page Rule**:

- **URL:** `example.com/*`
- **Setting:** Cache Level = Standard
- **Setting:** Edge Cache TTL = 2 hours

If you use a caching plugin like WP Rocket or W3 Total Cache, set it to deliver HTML as static files. Then add this rule to bypass Cloudflare cache for logged-in users:

- **URL:** `example.com/wp-admin/*`
- **Setting:** Cache Level = Bypass
- **Setting:** Security Level = High

For dynamic content (cart pages, membership areas), exclude specific paths:

- **URL:** `example.com/checkout/*`
- **Setting:** Cache Level = Bypass

## 4. Essential Security and Performance Tweaks

In the Cloudflare dashboard, enable these under **Speed**:

- **Auto Minify:** CSS, JavaScript, and HTML — reduces file sizes by 15-30%.
- **Brotli Compression:** Better than Gzip. Enable it under Speed > Optimization.
- **Rocket Loader:** Test this carefully — it can break some themes. I usually keep it off unless the site has heavy JavaScript.

Under **Security**:

- **Bot Fight Mode:** On for most sites. Blocks scrapers and spam bots.
- **Browser Integrity Check:** On. Helps prevent common XSS attacks.
- **Rate Limiting:** Add a rule for `wp-login.php` — 10 requests per minute per IP. This kills brute force attacks.

Finally, purge your Cloudflare cache after any WordPress update (plugins, themes, content). You can do this via the dashboard or the plugin’s “Purge Cache” button.

## Conclusion

Cloudflare transforms a standard WordPress site into a fast, secure, and resilient platform. The key is proper DNS proxy, real IP restoration, and smart caching rules. Once configured, you’ll notice better load times, reduced server load, and fewer attacks. Test everything with a staging site first, then deploy — your server will thank you.
