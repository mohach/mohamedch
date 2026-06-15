---
title: "Cómo funciona HTTPS y SSL/TLS: explicación sencilla"
excerpt: "Descubre cómo funcionan HTTPS y SSL/TLS de forma clara y sencilla, protegiendo tu conexión y datos en internet."
date: "2026-06-15"
lang: "es"
slug: "como-funciona-https-y-ssl-tls-explicacion-sencilla"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Seguro que alguna vez has visto el candado verde en la barra de direcciones y te has preguntado qué está pasando realmente. No es magia: es HTTPS funcionando con SSL/TLS para proteger tus datos. Vamos a desmontarlo de forma práctica y sin rodeos.

## ¿Qué es HTTPS y por qué importa?

HTTP es el protocolo que usa tu navegador para pedir páginas web, pero viaja en texto plano. Cualquiera en la misma red (WiFi del café, por ejemplo) puede leerlo. HTTPS añade una capa de cifrado mediante SSL/TLS, de modo que aunque alguien intercepte los datos, solo vea basura ininteligible. En resumen: HTTPS = HTTP + cifrado.

## El apretón de manos TLS: cómo se ponen de acuerdo

Cuando visitas `https://mohamedch.com`, tu navegador y el servidor hacen un "handshake" TLS. No es físico, pero es igual de importante:

1. **Cliente saluda**: dice qué versiones de TLS soporta y genera un número aleatorio.
2. **Servidor responde**: elige la versión, envía su certificado SSL (con la clave pública) y otro número aleatorio.
3. **Cliente verifica**: comprueba que el certificado es válido (no caducado, emitido por una autoridad de confianza).
4. **Intercambio de claves**: el cliente crea una "clave premaestra", la cifra con la clave pública del servidor y la envía.
5. **Ambos generan la clave de sesión**: a partir de los números aleatorios y la clave premaestra. A partir de aquí, todo va cifrado con cifrado simétrico (más rápido).

Puedes ver este proceso en acción con `curl`:

```bash
curl -v https://mohamedch.com 2>&1 | grep -i "ssl\|tls"
```

Si usas `openssl`, puedes inspeccionar el certificado:

```bash
openssl s_client -connect mohamedch.com:443 -servername mohamedch.com
```

## Certificados SSL: el DNI del servidor

El certificado SSL es un archivo digital que asocia una identidad (dominio, empresa) con una clave pública. Lo emite una Autoridad de Certificación (CA) como Let's Encrypt, DigiCert o Cloudflare. Cuando tu navegador ve un certificado firmado por una CA de confianza, sabe que el servidor es quien dice ser.

Para generar uno con Let's Encrypt (gratuito) usando Certbot:

```bash
sudo certbot --apache -d mohamedch.com
```

Esto crea los archivos en `/etc/letsencrypt/live/mohamedch.com/`. Los certificados caducan a los 90 días, así que toca renovarlos automáticamente con un cron:

```bash
sudo certbot renew --quiet
```

## Cifrado simétrico vs asimétrico: el truco de velocidad

En el handshake TLS se usan ambos:

- **Cifrado asimétrico** (RSA, ECDSA): lento, pero perfecto para intercambiar la clave de sesión de forma segura. Usa un par de llaves (pública y privada).
- **Cifrado simétrico** (AES, ChaCha20): rapidísimo, ideal para cifrar el tráfico real de la página. Usa una única clave compartida.

El truco está en usar el asimétrico solo al principio para acordar la clave simétrica, y luego todo el tráfico va con simétrico. Así consigues seguridad sin ralentizar la navegación.

## Conclusión

HTTPS y SSL/TLS no son un misterio: son un protocolo de apretón de manos y un par de técnicas de cifrado bien combinadas. Con herramientas como `curl`, `openssl` y Certbot puedes verlo y gestionarlo tú mismo. La próxima vez que veas ese candado verde, ya sabes qué hay detrás.
