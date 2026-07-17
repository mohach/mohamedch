---
title: "Cloudflare Workers: ejemplos prácticos y cómo funcionan"
excerpt: "Descubre ejemplos prácticos y el funcionamiento de Cloudflare Workers, una potente herramienta para ejecutar código en el edge y optimizar tu web."
date: "2026-07-17"
lang: "es"
slug: "cloudflare-workers-ejemplos-practicos-y-como-funcionan"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Los desarrolladores que gestionan servidores saben lo tedioso que puede ser escalar una aplicación o modificar respuestas HTTP a nivel de borde. Cloudflare Workers ofrece una solución elegante: ejecutar código JavaScript en el edge de su red, sin gestionar infraestructura. Vamos a ver cómo funciona y algunos ejemplos prácticos que puedes implementar hoy mismo.

## ¿Qué es un Worker y cómo se ejecuta?

Un Worker es básicamente un script JavaScript que se ejecuta en los servidores de Cloudflare, distribuidos en más de 300 ciudades. Cuando un usuario hace una solicitud a tu dominio, Cloudflare intercepta la petición y ejecuta tu Worker antes de que llegue al servidor de origen. Esto permite modificar, redirigir o incluso responder sin llegar a tu backend.

El modelo es similar al de service workers del navegador, pero del lado del servidor. Cada Worker recibe un objeto `Request` y debe devolver un objeto `Response`. El tiempo de ejecución está limitado a 50ms de CPU en el plan gratuito, pero para la mayoría de casos es más que suficiente.

## Primer ejemplo: redirigir tráfico con reglas simples

Imagina que necesitas redirigir todas las peticiones HTTP a HTTPS, o cambiar una URL antigua a una nueva. Con un Worker lo haces en pocas líneas:

```javascript
export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // Redirigir HTTP a HTTPS
    if (url.protocol === 'http:') {
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }
    
    // Redirigir /blog/old-post a /blog/new-post
    if (url.pathname === '/blog/old-post') {
      url.pathname = '/blog/new-post';
      return Response.redirect(url.toString(), 301);
    }
    
    // Si no hay redirección, pasar la petición al origen
    return fetch(request);
  }
}
```

Para desplegarlo, usa `wrangler`, la CLI oficial. Instálala con `npm install -g wrangler`, luego ejecuta `wrangler init my-worker`, pega el código en `src/index.js` y despliega con `wrangler publish`. En menos de un minuto tu Worker está activo.

## Segundo ejemplo: modificar cabeceras y respuestas

Supón que quieres añadir una cabecera de seguridad o modificar el HTML antes de servirlo. Con Workers puedes hacerlo sin tocar tu servidor:

```javascript
export default {
  async fetch(request) {
    const response = await fetch(request);
    
    // Clonar la respuesta para poder modificarla
    const newResponse = new Response(response.body, response);
    
    // Añadir cabeceras de seguridad
    newResponse.headers.set('X-Content-Type-Options', 'nosniff');
    newResponse.headers.set('X-Frame-Options', 'DENY');
    
    // Si es HTML, modificar el contenido
    if (response.headers.get('content-type')?.includes('text/html')) {
      const text = await response.text();
      const modified = text.replace('</body>', '<footer>© Mohamed Chennani</footer></body>');
      return new Response(modified, newResponse);
    }
    
    return newResponse;
  }
}
```

Este patrón es muy útil para inyectar scripts de analytics, banners de cookies o simplemente añadir cabeceras sin modificar la configuración del servidor web.

## Tercer ejemplo: API Gateway con Workers

Un uso avanzado es crear un gateway de API que distribuya peticiones a distintos servicios. Por ejemplo, si tienes `/api/users` en un servidor y `/api/orders` en otro:

```javascript
export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    const routes = {
      '/api/users': 'https://users.internal.example.com',
      '/api/orders': 'https://orders.internal.example.com',
      '/api/products': 'https://products.internal.example.com'
    };
    
    for (const [path, target] of Object.entries(routes)) {
      if (url.pathname.startsWith(path)) {
        url.hostname = new URL(target).hostname;
        return fetch(url.toString(), request);
      }
    }
    
    // Ruta por defecto al servidor principal
    return fetch(request);
  }
}
```

Esto elimina la necesidad de un proxy inverso tradicional y escala automáticamente con la red de Cloudflare.

## Conclusión

Cloudflare Workers permite ejecutar lógica personalizada en el edge con mínimo esfuerzo de configuración. Desde redirecciones simples hasta gateways de API, los ejemplos que hemos visto cubren casos de uso cotidianos que cualquier administrador de sistemas puede implementar. Lo mejor es que no necesitas gestionar servidores ni preocuparte por el escalado: Cloudflare lo hace por ti.
