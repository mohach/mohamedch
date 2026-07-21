---
title: "Nginx Reverse Proxy with SSL and Let's Encrypt on Ubuntu"
excerpt: "Learn how to set up Nginx as a reverse proxy with free SSL certificates from Let's Encrypt on Ubuntu for secure web traffic."
date: "2026-07-21"
lang: "en"
slug: "nginx-reverse-proxy-with-ssl-and-lets-encrypt-on-ubuntu"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

If you're running multiple services on a single server, exposing each one on a different port is messy and insecure. An Nginx reverse proxy solves this by routing traffic based on domain names, while Let's Encrypt provides free, automated SSL certificates. In this guide, I'll show you how to set up Nginx as a reverse proxy with SSL on Ubuntu, securing your services in minutes.

## Prerequisites and Installation

First, ensure your system is up to date and install Nginx:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install nginx certbot python3-certbot-nginx -y
```

You'll also need a domain name pointing to your server's public IP (e.g., `service1.yourdomain.com`). Make sure ports 80 and 443 are open in your firewall:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## Configuring Nginx as a Reverse Proxy

Create a new Nginx server block for your service. For example, to proxy a local service running on port 3000 (like a Node.js app):

```bash
sudo nano /etc/nginx/sites-available/example
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name service1.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

The `proxy_pass` directive is the core—it forwards incoming requests to your backend service. The additional headers ensure WebSockets work and the original client IP is preserved. Enable the site and test:

```bash
sudo ln -s /etc/nginx/sites-available/example /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Automating SSL with Let's Encrypt

Now, secure the site with a free SSL certificate. Certbot's Nginx plugin handles everything automatically:

```bash
sudo certbot --nginx -d service1.yourdomain.com
```

Follow the prompts—enter your email and agree to the terms. Certbot will modify your Nginx config to redirect HTTP to HTTPS and add SSL directives. After completion, your server block will look similar to this:

```nginx
server {
    listen 443 ssl;
    server_name service1.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/service1.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/service1.yourdomain.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://localhost:3000;
        # ... remaining proxy headers
    }
}

server {
    listen 80;
    server_name service1.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

Certificates renew automatically via a systemd timer. Verify renewal is active:

```bash
sudo systemctl status certbot.timer
```

## Adding Multiple Services

To proxy additional services, repeat the process with different domain names. For example, add a second service on port 8080:

```nginx
server {
    listen 443 ssl;
    server_name service2.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/service2.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/service2.yourdomain.com/privkey.pem;
    # ... SSL includes

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Run `sudo certbot --nginx -d service2.yourdomain.com` for each new domain. Certbot will handle the certificates individually.

## Conclusion

You now have a secure, centralized entry point for all your services using Nginx and Let's Encrypt. The reverse proxy not only simplifies port management but also offloads SSL termination, while automated renewals keep your certificates valid without manual intervention. For production use, consider adding rate limiting or caching to your proxy configurations.
