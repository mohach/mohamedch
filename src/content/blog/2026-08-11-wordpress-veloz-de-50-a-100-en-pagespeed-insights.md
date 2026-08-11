---
title: "WordPress veloz: de 50 a 100 en PageSpeed Insights"
excerpt: "Aprende a optimizar WordPress y pasa tu web de 50 a 100 en PageSpeed Insights con técnicas prácticas y efectivas."
date: "2026-08-11"
lang: "es"
slug: "wordpress-veloz-de-50-a-100-en-pagespeed-insights"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Cuando un cliente te dice que su WordPress "va lento", lo primero que hago es abrir PageSpeed Insights y prepararme para ver números rojos. Pero la buena noticia es que, en la mayoría de los casos, no hace falta cambiar de hosting ni rehacer la web: basta con aplicar una serie de ajustes quirúrgicos. Te cuento el proceso exacto que me llevó de un 50 a un 100 en rendimiento, con trucos que puedes replicar hoy mismo.

## 1. Diagnóstico inicial: atacar lo que realmente pesa

Antes de tocar nada, ejecuta un análisis con `curl` para ver el tiempo de respuesta del servidor y el peso de la página:

```bash
curl -o /dev/null -s -w "Tiempo total: %{time_total}s\nTamaño: %{size_download} bytes\n" https://tudominio.com
```

Si el tiempo supera 1 segundo, el problema es el servidor o el tema. Si el tamaño supera 2 MB, son los recursos. En mi caso, el culpable era el tema: arrastraba jQuery, fuentes de Google y decenas de hojas de estilo que no usaba. Cambié a un tema ligero (GeneratePress o Kadence) y el peso bajó de 3,2 MB a 800 KB solo con eso.

## 2. Caché y optimización de recursos: el 80% del trabajo

Aquí es donde se gana la partida. Instala un plugin de caché completo, pero configúralo bien, no lo dejes por defecto. Mis ajustes clave con WP Rocket o LiteSpeed Cache:

- **Caché de página**: activada para usuarios no registrados.
- **Minificación**: combina y minifica CSS y JS. Cuidado con el orden: prueba siempre en incógnito.
- **Carga diferida (lazy load)**: para imágenes y vídeos, pero excluye la imagen destacada si quieres mantener el LCP alto.
- **Precarga de fuentes**: si usas fuentes locales (recomendado), añade esto al `functions.php`:

```php
add_action('wp_head', function() {
    echo '<link rel="preload" as="font" href="' . get_template_directory_uri() . '/fonts/mi-fuente.woff2" crossorigin>';
}, 1);
```

Y elimina el CSS de bloques que no usas. Con el plugin "Asset CleanUp" o "Perfmatters" puedes desactivar scripts por página. En mi caso, quité el CSS de Elementor de las entradas que no usaban widgets, y el ahorro fue de 0,4 segundos en el renderizado.

## 3. Imágenes: el formato y el tamaño importan (y mucho)

Las imágenes mal optimizadas son la causa nº1 de un LCP bajo. No basta con comprimir: hay que servir el formato correcto. Con WebP y AVIF, el peso se reduce hasta un 60% sin pérdida visible.

Instala "Imagify" o "ShortPixel" y configura:

- **Conversión automática a WebP**.
- **Redimensionado** a un máximo de 1920px de ancho.
- **Compresión agresiva** para imágenes de fondo.

Además, en el `.htaccess` puedes forzar la versión WebP si el servidor lo soporta:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{HTTP_ACCEPT} image/webp
    RewriteCond %{REQUEST_URI} \.(jpg|jpeg|png)$
    RewriteCond %{DOCUMENT_ROOT}/$1.webp -f
    RewriteRule ^(.+)\.(jpe?g|png)$ $1.webp [T=image/webp,E=REQUEST_image]
</IfModule>
```

¿Resultado? El LCP pasó de 4,2 segundos a 1,1 segundos solo con esto.

## 4. Servidor y base de datos: el ajuste fino

Si ya tienes caché e imágenes optimizadas pero sigues en 70-80, toca mirar el servidor. Con PHP-FPM, asegúrate de tener PHP 8.2+ y configura `opcache`:

```ini
opcache.enable=1
opcache.memory_consumption=128
opcache.max_accelerated_files=10000
opcache.revalidate_freq=60
```

Y limpia la base de datos. Con WP-Optimize o un simple comando SQL:

```sql
DELETE FROM wp_postmeta WHERE meta_key = '_wp_old_slug';
OPTIMIZE TABLE wp_posts;
```

Esto reduce las consultas y el tiempo de respuesta del servidor. Además, desactiva los "cron jobs" de WordPress en el frontend y ejecútalos por sistema:

```php
define('DISABLE_WP_CRON', true);
```

Y añade en el crontab:

```bash
*/5 * * * * wget -q -O - https://tudominio.com/wp-cron.php
```

## Conclusión

No hay magia: es método y constancia. Con estos cuatro pasos —tema ligero, caché bien configurada, imágenes en WebP y servidor ajustado— pasé de 50 a 100 en PageSpeed Insights sin tocar el diseño visible para el usuario. La clave está en medir, ajustar y repetir. Cada web es un mundo, pero estos son los pilares que siempre funcionan. ¿Te animas a probarlo?
