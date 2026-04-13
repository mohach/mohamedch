---
title: "Optimiza WordPress: de 50 a 100 en PageSpeed Insights"
excerpt: "Aumenta la velocidad de tu web WordPress con ajustes clave para lograr la puntuación perfecta en PageSpeed Insights."
date: "2026-04-13"
lang: "es"
slug: "optimiza-wordpress-de-50-a-100-en-pagespeed-insights"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

¿Tu web en WordPress va lenta y PageSpeed Insights te da un suspenso? No eres el único. Pasar de una puntuación de 50 a más de 100 es un proceso técnico, pero totalmente alcanzable con las acciones correctas. Vamos a desglosar los pasos más efectivos que aplico en proyectos reales.

## 1. Auditoría y Limpieza Inicial

Antes de instalar nada, identifica los cuellos de botella. Usa **Query Monitor** para ver plugins pesados y consultas SQL lentas. Luego, limpia:
*   **Base de datos:** Elimina revisiones de posts, spam y transients. Usa un plugin como **WP-Optimize** o, por SSH:
    ```bash
    wp db optimize --yes
    ```
*   **Temas y plugins:** Desactiva y borra todo lo que no uses. Un plugin de caché mal configurado puede ralentizar más que ayudar.

## 2. Caché y CDN: El Núcleo de la Velocidad

Sin una buena caché, no hay mejora posible.
*   **Caché de página:** Configura **WP Rocket** (de pago) o **LiteSpeed Cache** (si tu hosting usa LiteSpeed). Activa la caché de página, CSS/JS minify y concatenación.
*   **CDN:** Un CDN como **Cloudflare** es imprescindible. Activa el proxy (las nubes naranjas), y en la pestaña "Speed", activa **Auto Minify** (para HTML, CSS, JS) y **Brotli Compression**. Esto sirve los activos desde servidores cercanos al usuario.

## 3. Optimización de Imágenes y "Lazy Load"

Las imágenes suelen ser el lastre principal.
*   **Comprime y redimensiona:** No subas imágenes de 4000px para un thumbnail. Usa **ShortPixel** o **WebP Express** para convertir imágenes automáticamente a WebP, un formato más ligero.
*   **"Lazy Load":** Asegúrate de que está activado en tu plugin de caché. El código solo carga las imágenes cuando el usuario hace scroll hasta ellas.

## 4. JavaScript y CSS Crítico

El "render blocking" es el enemigo de la puntuación en móvil.
*   **Diferir ("defer") JS:** En tu plugin de caché, activa la opción para diferir la carga de JavaScript. Esto evita que los scripts bloqueen la pintura inicial de la página.
*   **CSS crítico ("Above the Fold"):** Herramientas como WP Rocket pueden generar automáticamente el CSS necesario para la parte visible de la página, cargando el resto después. Si no, puedes usar servicios externos para generarlo.

Pasar de 50 a 100+ no es magia, es técnica y constancia. Empieza por una auditoría limpia, implementa una caché sólida con CDN, optimiza las imágenes a conciencia y ataca el JavaScript bloqueante. Los resultados en PageSpeed Insights mejorarán, y lo notarás sobre todo en la experiencia real de tus visitantes: menos rebotes y más conversiones.
