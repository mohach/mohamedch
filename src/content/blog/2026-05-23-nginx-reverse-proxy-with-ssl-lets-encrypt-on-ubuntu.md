---
title: "Nginx Reverse Proxy with SSL & Let's Encrypt on Ubuntu"
excerpt: "Learn how to set up an Nginx reverse proxy with SSL using Let's Encrypt on Ubuntu for secure, high-performance web traffic management."
date: "2026-05-23"
lang: "en"
slug: "nginx-reverse-proxy-with-ssl-lets-encrypt-on-ubuntu"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

If you’re running multiple services on a single server, you’ve probably run into port conflicts or messy URL management. An Nginx reverse proxy solves this neatly by routing traffic based on domain names, while adding SSL with Let’s Encrypt keeps everything encrypted and trusted. This guide walks through the setup on Ubuntu, using real commands you can copy and adapt.

## Prerequisites and Installation

Start with a clean Ubuntu server (20.04 or 22.04) and a domain pointing to its public IP. You’ll need root or sudo access. First, update your system and install Nginx and Certbot:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install nginx certbot python3-certbot-nginx -y
```

Enable the firewall if it’s not active, allowing HTTP and HTTPS:

```bash
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

Verify Nginx is running: `sudo systemctl status nginx`. If it’s not active, start it with `sudo systemctl start nginx`.

## Configure Nginx as a Reverse Proxy

Create a new site configuration file for your domain. Replace `example.com` with your actual domain:

```bash
sudo nano /etc/nginx/sites-available/example.com
```

Paste the following basic proxy block. This example forwards traffic to a local service running on port 3000 (like a Node.js app):

```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Save and exit. Enable the site by creating a symbolic link:

```bash
sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/
```

Test the configuration for syntax errors:

```bash
sudo nginx -t
```

If it says “test is successful,” reload Nginx: `sudo systemctl reload nginx`.

## Obtain and Install SSL with Let’s Encrypt

With the HTTP proxy working, add SSL using Certbot. Run this command and follow the prompts:

```bash
sudo certbot --nginx -d example.com -d www.example.com
```

Certbot will automatically:
- Obtain a certificate from Let’s Encrypt
- Modify your Nginx config to include SSL settings
- Set up automatic renewal (check with `sudo certbot renew --dry-run`)

After completion, your config file will look something like this (simplified):

```nginx
server {
    listen 443 ssl;
    server_name example.com www.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://localhost:3000;
        # ... proxy headers as before
    }
}

server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$server_name$request_uri;
}
```

The second server block forces all HTTP traffic to HTTPS. Reload Nginx again: `sudo systemctl reload nginx`. Your service is now accessible over HTTPS.

## Testing and Troubleshooting

Visit `https://example.com` in your browser—you should see a padlock and your proxied app. Test renewal with `sudo certbot renew --dry-run`; it should complete without errors.

Common issues:
- **502 Bad Gateway**: Your backend service isn’t running or the port is wrong. Check `systemctl status your-service` or try `curl localhost:3000`.
- **Certificate not trusted**: Ensure your domain resolves correctly and ports 80/443 are open in your firewall and cloud provider.
- **WebSockets failing**: The `Upgrade` and `Connection` headers in the config handle this—double-check they’re present.

For multiple services, repeat the process with different `server_name` blocks and proxy_pass targets.

## Conclusion

Setting up an Nginx reverse proxy with Let’s Encrypt on Ubuntu is straightforward and gives you secure, centralized traffic management. You can now host multiple applications behind a single server, each with its own domain and automatic SSL. Adjust the proxy_pass destination to match your services, and you’re good to go.
