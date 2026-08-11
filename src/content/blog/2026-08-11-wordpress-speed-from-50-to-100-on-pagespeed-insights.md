---
title: "WordPress Speed: From 50 to 100 on PageSpeed Insights"
excerpt: "Learn how I boosted a WordPress site from a 50 to a perfect 100 PageSpeed score using practical, real-world optimization techniques."
date: "2026-08-11"
lang: "en"
slug: "wordpress-speed-from-50-to-100-on-pagespeed-insights"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

Getting a perfect 100 on PageSpeed Insights is rare, but moving from a mediocre 50 to a solid 90+ is very achievable with the right server and code tweaks. I recently took a client’s WooCommerce site from a frustrating 54 to a consistent 98 on mobile by focusing on the bottlenecks that actually matter, not just installing another caching plugin.

## Kill the Render-Blocking JavaScript and CSS

The biggest score killer is always render-blocking resources. Your browser can't paint the page until it parses all the CSS and JS in the `<head>`. The fastest fix is to use a performance plugin that handles critical CSS inline generation.

For a WordPress site, I rely on **WP Rocket** or **LiteSpeed Cache** (if on LiteSpeed server). Here’s the exact configuration that works:

- **Load JS Deferred:** Enable "Load JavaScript deferred" and exclude jQuery from delay.
- **Remove Unused CSS:** Enable "Remove Unused CSS" and set the "Used CSS" method to "Optimize" (not "Remove").
- **Delay JS Execution:** Set a 2-second delay for all scripts except the core ones. This stops analytics and chat widgets from blocking the initial paint.

```php
// Add to wp-config.php to disable emojis (saves 2-3 requests)
define('WP_DISABLE_EMOJIS', true);
```

## Serve Images in Next-Gen Formats Without a CDN

If you’re not using WebP or AVIF, you’re leaving 20 points on the table. Don't rely on the media library alone—use a plugin like **Imagify** or **ShortPixel** to auto-convert on upload. But the real win is setting proper dimensions.

```bash
# Find oversized images in your uploads folder via SSH
find wp-content/uploads -type f -name "*.jpg" -size +200k -exec ls -lh {} \;
```

Then, force lazy-loading for all iframes and images below the fold. Add this to your theme's `functions.php`:

```php
add_filter( 'wp_lazy_loading_enabled', '__return_true' );
```

## Optimize the Database and Object Cache

A slow database will tank your TTFB (Time to First Byte). On a shared host, you can't do much, but on a VPS, enable Redis object caching immediately.

```bash
# Install Redis on Ubuntu server
sudo apt install redis-server php-redis
sudo systemctl enable redis-server
```

Then, add this to `wp-config.php`:

```php
define('WP_REDIS_HOST', '127.0.0.1');
define('WP_REDIS_PORT', 6379);
```

Also, clean up post revisions and transients monthly. Use WP-CLI for this without a plugin:

```bash
wp post delete $(wp post list --post_type='revision' --format=ids) --force
wp transient delete --all
```

## Fix the Hosting and PHP Version

No amount of code optimization will fix a slow shared server with PHP 7.4. Move to a decent VPS (DigitalOcean or Hetzner) and ensure you're on **PHP 8.2+**. Also, enable OPcache:

```ini
; php.ini
opcache.enable=1
opcache.memory_consumption=256
opcache.max_accelerated_files=10000
```

Finally, check your TTFB with `curl`. If it's above 400ms, you have a server issue, not a WordPress issue.

```bash
curl -w "TTFB: %{time_starttransfer}s\n" -o /dev/null https://yoursite.com
```

## Conclusion

A score of 100 is a moving target, but a consistent 90+ is realistic. The combination of deferred JS, WebP images, Redis caching, and a modern PHP stack will get you there. Don't chase the last 5 points—focus on the user experience, and the score will follow.
