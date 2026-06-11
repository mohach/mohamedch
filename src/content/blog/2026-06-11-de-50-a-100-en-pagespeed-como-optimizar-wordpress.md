---
title: "De 50 a 100 en PageSpeed: Cómo optimizar WordPress"
excerpt: "Optimiza WordPress de 50 a 100 en PageSpeed con técnicas reales de caché, imágenes y plugins para acelerar tu web sin complicaciones."
date: "2026-06-11"
lang: "es"
slug: "de-50-a-100-en-pagespeed-como-optimizar-wordpress"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Empecé con un WordPress que cargaba en 4 segundos y sacaba un 50 en PageSpeed Insights. Después de tocar varias tuercas y medir cada cambio, conseguí estabilizar la nota en 95-100. Aquí van los cuatro ajustes que realmente marcaron la diferencia.

## Hosting y PHP: la base que nadie mira

No sirve de nada optimizar si el servidor va justo. Lo primero: asegúrate de tener PHP 8.1 o superior y activar la caché de opcode.

```bash
# Ver versión PHP desde terminal
php -v

# En cPanel o similar, activa OPcache desde el selector de PHP
# memory_consumption=256
# revalidate_freq=2
```

Si usas Apache, activa mod_deflate y mod_expires desde el .htaccess:

```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

## Imágenes: el cuello de botella silencioso

Las imágenes sin optimizar son la causa número 1 de puntuaciones bajas. Olvida los plugins pesados: usa WebP con fallback y lazy loading nativo.

Añade esto a tu functions.php:

```php
add_filter('wp_get_attachment_image_attributes', function($attr) {
    $attr['loading'] = 'lazy';
    return $attr;
});
```

Y en el .htaccess, sirve WebP si el navegador lo soporta:

```apache
<IfModule mod_rewrite.c>
  RewriteCond %{HTTP_ACCEPT} image/webp
  RewriteCond %{REQUEST_URI} \.(jpg|jpeg|png)$
  RewriteCond %{DOCUMENT_ROOT}/$1.webp -f
  RewriteRule ^(.*)\.(jpg|jpeg|png)$ $1.webp [T=image/webp]
</IfModule>
```

Para convertir en lote, usa la terminal:

```bash
# Instala webp si no lo tienes
sudo apt install webp

# Convierte todas las JPG
for img in *.jpg; do cwebp -q 80 "$img" -o "${img%.jpg}.webp"; done
```

## CSS y JavaScript: carga crítica y diferida

El mayor enemigo es el CSS que bloquea el renderizado. Extrae el CSS crítico y carga el resto de forma asíncrona.

En el header.php, justo antes de `</head>`:

```php
<style>
  /* Aquí va el CSS crítico: lo que ves en el primer pantallazo */
  body { font-family: sans-serif; margin: 0; }
  .header { background: #fff; padding: 1rem; }
</style>
```

Y carga el CSS completo con preload:

```php
<link rel="preload" href="/wp-content/themes/tuyo/style.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="/wp-content/themes/tuyo/style.css"></noscript>
```

Para JavaScript, añade `defer` a todos los scripts que no sean críticos. En functions.php:

```php
function defer_parsing_js($url) {
    if (is_admin()) return $url;
    if (strpos($url, 'jquery.js') !== false) return $url;
    return str_replace(' src', ' defer src', $url);
}
add_filter('script_loader_tag', 'defer_parsing_js', 10);
```

## Caché y CDN: el empujón final

Sin caché de página, todo lo anterior sirve de poco. Usa un plugin ligero como Flying Press o Cache Enabler. Configúralo así:

- Caché de página: activada
- Minificar HTML: sí
- Combinar CSS/JS: no (suele romper cosas)
- Caché del navegador: 1 semana para estáticos

Luego, pon Cloudflare delante. En el panel de Cloudflare, activa:

- Auto Minify (HTML, CSS, JS)
- Brotli compression
- Rocket Loader (modo manual si da problemas)
- Always Online (por si cae el servidor)

## Conclusión

Pasar de 50 a 100 no es magia, es método. Revisa hosting, optimiza imágenes, carga lo crítico primero y pon una buena capa de caché. Con estos cuatro pasos, mi WordPress pasó de 52 a 98 en escritorio y 96 en móvil. Pruébalo y mide el antes y después.
