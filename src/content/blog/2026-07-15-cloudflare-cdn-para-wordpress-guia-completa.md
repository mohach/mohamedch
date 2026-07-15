---
title: "Cloudflare CDN para WordPress: guía completa"
excerpt: "Guía completa para configurar Cloudflare CDN en WordPress: optimiza velocidad, seguridad y rendimiento de tu sitio web."
date: "2026-07-15"
lang: "es"
slug: "cloudflare-cdn-para-wordpress-guia-completa"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Cuando habilitas Cloudflare CDN en WordPress, el rendimiento y la seguridad mejoran de forma inmediata. Sin embargo, una configuración incorrecta puede romper plugins de caché, formularios o la IP real de los visitantes. Aquí te explico paso a paso cómo hacerlo bien desde cero, basado en mi experiencia en despliegues reales.

## Configuración inicial en Cloudflare

Antes de tocar WordPress, debes apuntar tu dominio a Cloudflare. En tu panel de Cloudflare, ve a **DNS > Records** y asegúrate de que todos los registros A y CNAME tengan el icono naranja (proxy habilitado). Si usas un subdominio como `www`, también debe estar en naranja.

Luego, en **SSL/TLS > Overview**, selecciona **Full (strict)** si tienes un certificado SSL válido en tu servidor (recomendado). Si no, usa **Flexible**, pero ten en cuenta que el tráfico entre Cloudflare y tu servidor irá sin cifrar. Para la mayoría de sitios WordPress con Let's Encrypt, Full (strict) es la opción correcta.

## Restaurar la IP real del visitante

Cloudflare actúa como proxy, por lo que tu servidor verá la IP de Cloudflare en lugar de la del usuario. Esto rompe logs, geolocalización y plugins de seguridad. Para solucionarlo, instala el plugin oficial **Cloudflare** desde el repositorio de WordPress. Actívalo y ve a **Settings > Cloudflare**. Autentica con tu cuenta y el plugin ajustará automáticamente las cabeceras.

Si prefieres no usar el plugin, puedes añadir este código a tu `wp-config.php` justo antes de la línea `/* That's all, stop editing! */`:

```php
if (isset($_SERVER['HTTP_CF_CONNECTING_IP'])) {
    $_SERVER['REMOTE_ADDR'] = $_SERVER['HTTP_CF_CONNECTING_IP'];
}
```

Esto es útil en entornos sin acceso al plugin o cuando usas configuraciones minimalistas.

## Ajustes de caché y rendimiento

Cloudflare cachea contenido estático por defecto, pero WordPress genera páginas dinámicas. Para cachear HTML sin romper la lógica del sitio, activa **Caching > Configuration > Standard** y luego crea una regla de página en **Rules > Page Rules**:

- **URL**: `tudominio.com/*`
- **Setting**: Cache Level: **Standard**
- **Setting**: Edge Cache TTL: **4 hours**

Si usas un plugin de caché como WP Rocket o W3 Total Cache, desactiva la compresión Gzip en el plugin (Cloudflare la aplica automáticamente) y activa la opción "Separate cache for logged-in users" para evitar servir páginas cacheadas a administradores.

Para purgar la caché rápidamente tras actualizar contenido, usa la API de Cloudflare desde un plugin como **WP Cloudflare Super Page Cache** o simplemente el botón "Purge Everything" en el panel de Cloudflare.

## Solución de problemas comunes

El error más frecuente es el bucle de redirección (ERR_TOO_MANY_REDIRECTS). Suele ocurrir si tienes SSL configurado tanto en Cloudflare como en tu servidor. Ve a **SSL/TLS > Edge Certificates** y asegúrate de que **Always Use HTTPS** esté en ON. Luego, en tu servidor, desactiva cualquier redirección forzada a HTTPS en `.htaccess` o en la configuración de Nginx.

Otro problema típico: formularios que no envían datos o plugins que fallan. Verifica que **Security > Settings > Challenge Passage** no esté en un valor demasiado bajo (5 minutos es razonable). Si usas WooCommerce, añade una regla de página para `/wp-admin/*` con **Security Level: High** para proteger el acceso, pero **Cache Level: Bypass** para evitar problemas con sesiones.

## Conclusión

Configurar Cloudflare CDN en WordPress no es complicado si sigues estos pasos: apunta los DNS con proxy, restaura la IP real, ajusta la caché con una regla de página y resuelve los errores típicos de SSL. Con esto, tu sitio cargará más rápido, estará mejor protegido y mantendrás la funcionalidad completa de plugins y formularios. Si tienes un sitio con mucho tráfico, considera activar Argo Smart Routing o las optimizaciones automáticas de Cloudflare para exprimir aún más el rendimiento.
