---
title: "Cloudflare Workers: guía práctica con ejemplos"
excerpt: "Descubre cómo usar Cloudflare Workers con ejemplos prácticos: despliega funciones serverless, optimiza tu web y automatiza tareas sin servidores."
date: "2026-05-19"
lang: "es"
slug: "cloudflare-workers-guia-practica-con-ejemplos"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Si alguna vez has necesitado ejecutar código en el borde de la red sin mantener un servidor tradicional, Cloudflare Workers es la respuesta. Se trata de un entorno serverless que corre sobre la infraestructura global de Cloudflare, permitiéndote modificar respuestas HTTP, redirigir tráfico o crear APIs en milisegundos. Lo mejor: pagas solo por lo que usas y se despliega en segundos.

## ¿Qué es un Worker y cómo funciona?

Un Worker es básicamente una función de JavaScript (o TypeScript) que se ejecuta en el *edge* de Cloudflare, en más de 330 ciudades. Cuando un usuario hace una petición a tu dominio, Cloudflare intercepta la solicitud y ejecuta tu código antes de que llegue al origen. Esto te permite manipular la request, la response, o incluso devolver contenido directamente desde el Worker sin tocar tu servidor.

El ciclo es sencillo: `fetch event` → ejecuta tu lógica → devuelve una respuesta. Todo corre sobre V8, el motor de Chrome, con tiempos de arranque prácticamente nulos.

## Ejemplo práctico: Redirigir tráfico por país

Imagina que tienes un blog y quieres redirigir a usuarios de España a una versión en español. Con un Worker lo haces en cuatro líneas:

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const country = request.cf.country
  if (country === 'ES') {
    return Response.redirect('https://mohamedch.com/es/', 302)
  }
  return fetch(request)
}
```

Solo necesitas subir este script desde el panel de Cloudflare Workers (o con Wrangler CLI). El objeto `request.cf` contiene datos geográficos y de red que Cloudflare añade automáticamente. No necesitas APIs externas ni configurar GeoIP.

## Ejemplo práctico: API ligera sin servidor

Supón que quieres servir datos de configuración para tus clientes de IPTV sin montar un backend. Un Worker puede leer de un KV store (base de datos clave-valor) y devolver JSON:

```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const user = url.searchParams.get('user')
    if (!user) return new Response('Falta usuario', { status: 400 })

    const config = await env.IPTV_CONFIG.get(user)
    if (!config) return new Response('No encontrado', { status: 404 })

    return new Response(config, {
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
```

Aquí `env.IPTV_CONFIG` es un namespace de Workers KV que has vinculado al Worker. Puedes escribir datos desde el panel o mediante API. La latencia es mínima porque el KV se replica globalmente.

## Despliegue rápido con Wrangler

Para llevar tu Worker a producción, usa Wrangler, la CLI oficial. Instálala con npm:

```bash
npm install -g wrangler
wrangler login
wrangler init mi-worker
# Edita src/index.js con tu código
wrangler publish
```

En segundos tendrás tu Worker corriendo en `mi-worker.mohamedch.workers.dev`. Luego puedes asignarle un dominio personalizado desde el panel de Cloudflare.

## Conclusión

Cloudflare Workers te permite ejecutar lógica en el borde con una simplicidad brutal. Desde redirecciones condicionales hasta APIs completas, eliminas la necesidad de mantener servidores y reduces la latencia para tus usuarios. Si ya usas Cloudflare como DNS, es el siguiente paso natural para optimizar tus proyectos.
