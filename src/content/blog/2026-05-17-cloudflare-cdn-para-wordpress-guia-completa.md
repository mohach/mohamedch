---
title: "Cloudflare CDN para WordPress: guía completa"
excerpt: "Guía completa para configurar Cloudflare CDN en WordPress, optimizando velocidad, seguridad y rendimiento con pasos prácticos."
date: "2026-05-17"
lang: "es"
slug: "cloudflare-cdn-para-wordpress-guia-completa"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Si tu sitio WordPress recibe tráfico de varias regiones o sufres ataques DDoS, Cloudflare es una solución que no puede faltar. Te permite cachear contenido estático, proteger tu IP real y acelerar la entrega global. En esta guía práctica te explico los pasos clave para integrarlo correctamente.

## Configuración inicial de DNS y SSL

Lo primero es añadir tu dominio a Cloudflare y apuntar los DNS a sus servidores. Durante el proceso, Cloudflare escanea tus registros existentes. Asegúrate de que el registro A apunte a la IP de tu servidor (la real, no la de Cloudflare) y que el CNAME de `www` apunte a tu dominio principal.

Una vez activado, activa **SSL Flexible** (o **Full** si tienes certificado propio) en la pestaña SSL/TLS. Esto cifra la conexión entre el visitante y Cloudflare, y de Cloudflare a tu servidor. En tu `wp-config.php`, fuerza HTTPS con:

```php
if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
    $_SERVER['HTTPS'] = 'on';
}
```

## Ajustes de caché y rendimiento

Cloudflare cachea archivos estáticos (CSS, JS, imágenes) por defecto, pero para WordPress necesitas reglas específicas. Ve a **Rules > Page Rules** y crea una regla para `tudominio.com/wp-admin*` con **Cache Level: Bypass**. Esto evita que el panel de administración se cachee.

Para el resto del sitio, activa **Always Online** en **Caching > Configuration** y establece **Browser Cache TTL** a 4 horas. Si usas un plugin de caché como WP Rocket o W3 Total Cache, desactiva la opción de minificar CSS/JS desde el plugin y hazlo desde Cloudflare en **Speed > Optimization**: activa **Auto Minify** para HTML, CSS y JS, y **Brotli** para compresión.

Si tu sitio tiene mucho contenido dinámico (como WooCommerce), usa **Cache Rules** para excluir páginas de carrito y checkout:

```
Hostname equals tudominio.com
And URL path contains /carrito
-> Cache Level: Bypass
```

## Seguridad y protección contra ataques

Cloudflare filtra tráfico malicioso automáticamente, pero refuerza la seguridad con estos ajustes:

- En **Security > Settings**, activa **Bot Fight Mode** (bloquea bots maliciosos) y **Under Attack Mode** solo durante ataques activos.
- Crea un **WAF Custom Rule** para bloquear peticiones a `wp-login.php` desde IPs no permitidas:
```nginx
(http.host eq "tudominio.com" and http.request.uri.path eq "/wp-login.php" and not ip.src in {192.168.1.0/24})
```
- En **SSL/TLS > Edge Certificates**, activa **Always Use HTTPS** y **Automatic HTTPS Rewrites**.

## Plugins recomendados para sincronizar

Aunque no es obligatorio, instala el plugin **Cloudflare** oficial desde el repositorio de WordPress. Te permite:

- Purgar la caché de Cloudflare directamente desde el panel de admin.
- Activar **Automatic Platform Optimization** (APO) si tienes plan Pro o superior — reduce el tiempo de carga hasta un 70%.
- Gestionar reglas de página sin salir de WordPress.

Si no quieres instalar otro plugin, puedes usar la API de Cloudflare desde un script personalizado para purgar caché vía cron:

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/ZONE_ID/purge_cache" \
     -H "Authorization: Bearer TU_API_TOKEN" \
     -H "Content-Type: application/json" \
     --data '{"purge_everything":true}'
```

## Conclusión

Configurar Cloudflare con WordPress no es complejo, pero requiere ajustes precisos para evitar problemas de caché o seguridad. Siguiendo estos pasos —DNS, SSL, reglas de página, y protección WAF— tendrás un sitio más rápido, seguro y escalable. Si encuentras errores raros, revisa siempre los registros de Cloudflare y tu servidor: muchas veces el problema está en un plugin mal configurado.
