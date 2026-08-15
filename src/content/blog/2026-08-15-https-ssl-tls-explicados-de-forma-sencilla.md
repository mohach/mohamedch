---
title: "HTTPS y SSL/TLS explicados de forma sencilla"
excerpt: "Descubre qué es HTTPS y SSL/TLS de forma sencilla: cómo funcionan, por qué protegen tus datos y cómo afectan a tu web."
date: "2026-08-15"
lang: "es"
slug: "https-ssl-tls-explicados-de-forma-sencilla"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Cuando escribes la dirección de un sitio web en tu navegador, rara vez piensas en lo que ocurre entre tu equipo y el servidor. Pero esa pequeña diferencia entre `http://` y `https://` es la que separa una conversación privada de un grito en mitad de una plaza llena de gente. Vamos a desmontar qué es realmente SSL/TLS y por qué tu WordPress, tu tienda online o tu API no deberían funcionar sin ello.

## El problema que resuelve: el intermediario invisible

Imagina que envías una postal con tu contraseña del banco escrita. Cualquiera que la manipule en el camino puede leerla. Eso es HTTP: texto plano viajando por la red. Cualquier router, ISP o atacante en una WiFi pública puede capturar los paquetes y leer su contenido.

HTTPS no es más que HTTP metido dentro de un túnel cifrado. Ese túnel lo construye el protocolo TLS (Transport Layer Security), que es el sucesor moderno del antiguo SSL. Cuando ves el candado en el navegador, significa que se ha establecido una conexión cifrada y que el servidor ha demostrado su identidad mediante un certificado digital.

## El apretón de manos: cómo se crea el túnel

El proceso para establecer una conexión segura se llama *handshake* y dura milisegundos. En esencia, funciona así:

1. Tu navegador saluda al servidor y le dice qué versiones de TLS soporta.
2. El servidor responde con su certificado (que contiene su clave pública) y elige la versión de TLS.
3. El navegador verifica que el certificado es válido y pertenece al dominio correcto.
4. Ambas partes acuerdan una "clave de sesión" mediante criptografía asimétrica.
5. A partir de ahí, toda la comunicación se cifra con cifrado simétrico, mucho más rápido.

Puedes verlo en acción con `curl`:

```bash
curl -v https://mohamedch.com 2>&1 | grep "SSL connection"
```

La salida te mostrará algo como `SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384`. Ahí tienes la versión del protocolo y el cifrado usado.

## El certificado: la tarjeta de identidad del servidor

Un certificado SSL/TLS es un archivo firmado por una Autoridad de Certificación (CA) que vincula una clave pública con un dominio. Cuando tu navegador lo recibe, comprueba que la firma es de una CA de confianza (Let's Encrypt, DigiCert, etc.) y que el dominio coincide.

Para generar uno con Let's Encrypt usando Certbot, el proceso es tan simple como:

```bash
sudo apt install certbot python3-certbot-apache
sudo certbot --apache -d mohamedch.com -d www.mohamedch.com
```

El certificado se renueva automáticamente. Si usas Cloudflare como proxy, puedes activar el modo "Flexible", "Full" o "Full (strict)" según si tu servidor de origen tiene o no certificado propio.

## Verificación práctica: ¿qué está pasando realmente?

Una de las herramientas más útiles para inspeccionar la cadena de certificados es `openssl`. Con este comando puedes ver el certificado que presenta un servidor sin necesidad de navegador:

```bash
openssl s_client -connect mohamedch.com:443 -showcerts
```

En la salida verás la cadena completa: el certificado del servidor, los intermedios y la raíz. Si el servidor presenta certificados caducados o mal configurados, aquí lo verás antes de que lo haga cualquier usuario.

También puedes comprobar la fecha de expiración de tu propio certificado de forma rápida:

```bash
echo | openssl s_client -servername mohamedch.com -connect mohamedch.com:443 2>/dev/null | openssl x509 -noout -dates
```

## Conclusión

HTTPS y TLS no son magia, sino criptografía bien aplicada. Entender el *handshake* y la verificación de certificados te ayuda a diagnosticar problemas de conexión, configurar correctamente tu servidor y explicar a un cliente por qué su web "da error de seguridad". La regla de oro: si no hay HTTPS, no hay confianza. Y en 2025, no tenerlo es simplemente negligencia.
