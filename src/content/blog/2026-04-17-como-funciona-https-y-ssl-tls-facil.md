---
title: "Cómo funciona HTTPS y SSL/TLS fácil"
excerpt: "Descubre cómo HTTPS y SSL/TLS protegen tu navegación web de forma clara y sencilla."
date: "2026-04-17"
lang: "es"
slug: "como-funciona-https-y-ssl-tls-facil"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Cuando navegas por internet, es probable que veas ese candadito verde junto a la URL y las letras HTTPS. No es solo un adorno; es la diferencia entre enviar una postal abierta y una carta sellada. Vamos a desglosar cómo funciona esta tecnología que protege tu privacidad en la web.

## ¿Qué son SSL y TLS?

Para entender HTTPS, primero hay que conocer SSL (Secure Sockets Layer) y su sucesor, TLS (Transport Layer Security). Son protocolos criptográficos que crean un "túnel" seguro entre tu navegador y el servidor web. Piensa en ellos como un acuerdo de confianza y un lenguaje secreto que solo las dos partes comprenden. Hoy en día, aunque se hable coloquialmente de "certificado SSL", casi siempre se utiliza TLS. Su trabajo es garantizar tres cosas fundamentales: **confidencialidad** (los datos van cifrados), **integridad** (no se pueden alterar en tránsito) y **autenticación** (estás conectado al sitio real, no a una copia fraudulenta).

## El "apretón de manos" (Handshake) TLS

La magia ocurre en el llamado *TLS handshake*. Es un intercambio rápido de mensajes que establece la conexión segura. Simplificando mucho, estos son los pasos clave:

1.  **Cliente Hola**: Tu navegador se presenta al servidor y le dice qué versiones de TLS y métodos criptográficos soporta.
2.  **Servidor Hola**: El servidor elige la versión y el método más fuerte en común y responde enviando su **certificado SSL/TLS**. Este certificado es como su DNI digital, emitido por una autoridad de confianza (como Let's Encrypt, DigiCert, etc.).
3.  **Verificación**: Tu navegador verifica que el certificado es válido, está vigente y es emitido por una autoridad en la que confía. Esto autentica al servidor.
4.  **Clave de sesión**: El navegador genera una "clave maestra" preliminar, la cifra con la clave pública del servidor (que viene en el certificado) y la envía. Solo el servidor, con su clave privada, puede descifrarla.
5.  **Listos**: A partir de esa clave maestra, ambos generan unas mismas "claves de sesión" simétricas. ¡Listo! Ahora toda la comunicación se cifrará y descifrará con estas claves, que son mucho más eficientes.

Puedes ver este proceso en acción con un comando útil desde tu terminal:
```bash
openssl s_client -connect google.com:443 -servername google.com
```
Este comando te mostrará todos los detalles del certificado y el handshake.

## HTTPS: HTTP sobre el túnel seguro

HTTPS no es un protocolo nuevo. Literalmente significa **HTTP Secure**, es decir, HTTP normal pero viajando a través de la conexión cifrada que establece TLS. Una vez completado el *handshake*, tu navegador y el servidor usan las claves de sesión para cifrar cada petición HTTP (las páginas que pides) y cada respuesta (el contenido que te envían). Para ti, la experiencia es idéntica, pero cualquier intermediario que intercepte los paquetes solo verá un galimatías indescifrable.

En resumen, HTTPS con TLS es el guardián esencial de la web moderna. Como usuario, solo debes fijarte en que el candado esté presente, especialmente al introducir datos sensibles. Como administrador, es tu obligación implementarlo; hoy en día, con servicios gratuitos como Let's Encrypt, no hay excusa para no tener un sitio web seguro.
