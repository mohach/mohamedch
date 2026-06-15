---
title: "How HTTPS & SSL/TLS Work (Simple Explanation)"
excerpt: "Understand how HTTPS and SSL/TLS encrypt your online data with a simple, step-by-step explanation of secure web connections."
date: "2026-06-15"
lang: "en"
slug: "how-https-ssl-tls-work-simple-explanation"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

Ever wondered what that little padlock icon in your browser actually means? HTTPS and SSL/TLS are the invisible security layers that protect your data every time you visit a website or make an online purchase. Let's break down how they work in plain, practical terms.

## What’s the Difference Between HTTP and HTTPS?

HTTP (HyperText Transfer Protocol) is like sending a postcard through the mail—anyone handling it can read what's written. HTTPS (HTTP Secure) wraps that postcard in a sealed, tamper-proof envelope. The "S" stands for **Secure**, and it's powered by SSL/TLS.

When you connect to a site using HTTPS, your browser and the server perform a **handshake** to establish a secure connection. From that point on, all data exchanged is encrypted. You can verify this by checking the URL bar—if you see `https://` and a lock icon, your connection is protected.

## How SSL/TLS Handshakes Work (Step by Step)

The SSL/TLS handshake happens in milliseconds, but here's what actually occurs:

1. **Client Hello**: Your browser sends a list of supported encryption methods (cipher suites) and a random number.
2. **Server Hello**: The server picks a cipher suite and sends back its SSL certificate (containing the public key) plus another random number.
3. **Certificate Verification**: Your browser checks the certificate against trusted Certificate Authorities (CAs). If it's valid, the handshake continues.
4. **Session Key Creation**: Your browser generates a "pre-master secret" encrypted with the server's public key. Both sides use this to compute a symmetric session key.
5. **Secure Connection Established**: From now on, all data is encrypted with that session key.

You can inspect a server's certificate using OpenSSL:

```bash
openssl s_client -connect example.com:443 -showcerts
```

This command shows the full certificate chain, expiration dates, and the cipher being used.

## Why Certificates Matter

SSL/TLS certificates are like digital ID cards. They prove a website is who it claims to be. Without them, an attacker could impersonate your bank or email provider.

Certificates are issued by **Certificate Authorities** (like Let's Encrypt, DigiCert, or GlobalSign). Modern browsers maintain a list of trusted CAs. If a certificate is self-signed or from an unknown CA, your browser will show a warning.

To check a certificate's validity manually:

```bash
echo | openssl s_client -connect github.com:443 2>/dev/null | openssl x509 -noout -dates
```

This prints the certificate's start and expiry dates. Always verify these when debugging connection issues.

## Practical Verification with cURL

You can test HTTPS connections directly from your terminal using `curl`. This is useful for troubleshooting or scripting:

```bash
curl -v https://example.com
```

The `-v` flag shows the full handshake details, including the TLS version and cipher. To see only certificate info:

```bash
curl --cacert /etc/ssl/certs/ca-certificates.crt https://example.com
```

If you're running a web server, ensure your TLS configuration follows best practices. Avoid outdated protocols like SSLv3 or TLS 1.0. Use TLS 1.2 or 1.3.

## Conclusion

HTTPS and SSL/TLS aren't magic—they're a well-defined protocol that encrypts, authenticates, and ensures data integrity. Whether you're browsing, developing, or managing servers, understanding this handshake helps you debug issues and stay secure. Always check for the padlock, and when in doubt, use tools like `openssl` and `curl` to see exactly what's happening under the hood.
