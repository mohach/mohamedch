---
title: "HTTPS and SSL/TLS Explained Simply"
excerpt: "Understand HTTPS and SSL/TLS in plain terms—what they do, how they secure your data, and why every website needs them."
date: "2026-08-15"
lang: "en"
slug: "https-and-ssl-tls-explained-simply"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

When you type a URL into your browser, a lot happens behind the scenes before the page loads. Most of that invisible work is focused on one thing: making sure the data you send and receive is private and untampered with. That’s the job of HTTPS, which is just HTTP wrapped in a security layer called SSL/TLS. Let’s strip away the jargon and see exactly how that handshake works, using real tools you can run yourself.

## The Core Idea: Encryption, Authentication, and Integrity

Think of SSL/TLS as a secure tunnel between your browser and a server. It solves three problems: **encryption** (no one can read the data), **authentication** (you’re talking to the real site, not an impostor), and **integrity** (data isn’t altered in transit). The protocol uses two types of cryptography: asymmetric (public/private keys) to establish a shared secret, and symmetric (a single session key) for the fast, bulk encryption that follows.

## Step 1: The TLS Handshake (Simplified)

The handshake is the negotiation phase. Here’s the condensed version:

1. **Client Hello** – Your browser sends its supported TLS versions and cipher suites.
2. **Server Hello + Certificate** – The server picks a cipher suite and sends its SSL certificate, which contains its public key.
3. **Certificate Verification** – Your browser checks the certificate against a list of trusted Certificate Authorities (CAs). This is where a valid, non-expired cert matters.
4. **Key Exchange** – Your browser generates a random "pre-master secret," encrypts it with the server’s public key, and sends it over.
5. **Session Keys** – Both sides use that secret to derive the same symmetric session key.
6. **Done** – From now on, all data is encrypted with that session key.

You can see this in action with `curl`:

```bash
curl -v https://mohamedch.com 2>&1 | grep -E "SSL|TLS|subject|issuer"
```

You’ll see lines like `SSL connection using TLSv1.3` and the certificate’s subject and issuer. That’s the handshake log.

## Step 2: What’s Actually in a Certificate?

A certificate is a public key plus metadata, signed by a CA. You can inspect one directly with `openssl`:

```bash
echo | openssl s_client -connect mohamedch.com:443 -servername mohamedch.com 2>/dev/null | openssl x509 -noout -text
```

Look for `Subject`, `Issuer`, and `Validity`. The magic is in the signature: the CA’s private key signed a hash of the certificate’s contents. Your browser knows the CA’s public key, so it can verify the signature. If the domain matches and the date is valid, you’re good.

## Step 3: TLS 1.3 vs Older Versions

TLS 1.3, the current standard, is faster and safer. It reduces the handshake to one round trip (1-RTT) and removes insecure legacy ciphers. You can check what your server supports:

```bash
openssl s_client -connect mohamedch.com:443 -tls1_3 -brief 2>/dev/null
```

If you see `Protocol version: TLSv1.3`, you’re golden. If not, it’s time to update your server (Apache, Nginx, or whatever you run). On Nginx, you’d set:

```nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers HIGH:!aNULL:!MD5;
```

## Step 4: Why You Should Care (and How to Test)

HTTPS isn’t optional anymore. Browsers mark plain HTTP as "Not Secure," and Google uses it as a ranking signal. Beyond that, without TLS, a coffee-shop attacker can sniff your passwords or inject fake content. Test your own site with:

```bash
curl -sI https://yourdomain.com | grep -i strict
```

Look for the `Strict-Transport-Security` header. If it’s missing, add it to your server config. That header forces browsers to always use HTTPS, even if the user types `http://`.

## Conclusion

SSL/TLS is not magic—it’s a well-designed protocol that combines asymmetric and symmetric cryptography to give you privacy and trust. The handshake is fast, the certificates are verifiable, and TLS 1.3 makes it even better. Run the commands above, inspect your own certificates, and you’ll move from "it works" to "I know why it works." That knowledge is what separates a user from an administrator.
