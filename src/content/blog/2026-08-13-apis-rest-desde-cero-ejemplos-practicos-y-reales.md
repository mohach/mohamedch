---
title: "APIs REST desde cero: ejemplos prácticos y reales"
excerpt: "Aprende APIs REST desde cero con ejemplos prácticos y reales: métodos HTTP, JSON, autenticación y consumo paso a paso."
date: "2026-08-13"
lang: "es"
slug: "apis-rest-desde-cero-ejemplos-practicos-y-reales"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

## Introducción

Si llevas tiempo en esto del desarrollo o la administración de sistemas, seguro que has oído hablar de las APIs REST hasta la saciedad. Pero más allá de la teoría, lo que realmente importa es saber cómo funcionan en el día a día, cómo consumirlas y cómo sacarles partido para automatizar tareas. Hoy vamos a ver qué son, cómo se comportan y, sobre todo, cómo usarlas con ejemplos prácticos que te servirán desde ya.

## ¿Qué es una API REST y por qué te importa?

Una API REST (Representational State Transfer) es, en esencia, un conjunto de reglas que permite a dos aplicaciones comunicarse a través de HTTP. La clave está en que cada recurso (un usuario, un pedido, un vídeo) tiene una URL única, y las acciones sobre ese recurso se definen con los verbos HTTP estándar: `GET`, `POST`, `PUT`, `DELETE`.

Para un técnico, esto significa que puedes interactuar con servicios externos (o con tus propios sistemas) sin necesidad de interfaces gráficas. Por ejemplo, si gestionas un servidor en la nube, puedes crear o eliminar máquinas virtuales con una simple petición `curl`. Eso es poder, y también ahorro de tiempo.

La mayoría de las APIs modernas devuelven los datos en JSON, que es ligero y legible. Aquí tienes un ejemplo de respuesta típica:

```json
{
  "id": 123,
  "nombre": "Servidor web",
  "estado": "activo",
  "ip": "192.168.1.50"
}
```

## Los verbos HTTP y su uso práctico

No hay que memorizar una lista infinita, con cuatro verbos tienes el 95% de los casos cubiertos:

- **GET**: para obtener datos. Es seguro y no modifica nada.
- **POST**: para crear un recurso nuevo.
- **PUT**: para actualizar un recurso existente (o crearlo si no existe).
- **DELETE**: para eliminar un recurso.

Vamos a verlos en acción con un ejemplo real. Imagina que tienes una API de gestión de incidencias (tipo Jira o Redmine). Para listar las incidencias abiertas, harías:

```bash
curl -X GET "https://api.tuempresa.com/v1/incidencias?estado=abierta" \
     -H "Authorization: Bearer TU_TOKEN_API"
```

Y para crear una nueva incidencia, usarías `POST` con un cuerpo JSON:

```bash
curl -X POST "https://api.tuempresa.com/v1/incidencias" \
     -H "Authorization: Bearer TU_TOKEN_API" \
     -H "Content-Type: application/json" \
     -d '{"titulo": "El servidor de Alaquas no responde", "prioridad": "alta"}'
```

La respuesta, con un código `201 Created`, te confirmará que se ha creado correctamente.

## Códigos de estado: el lenguaje silencioso

Saber interpretar los códigos de respuesta HTTP es fundamental para depurar cualquier integración. No es solo que "funcione" o "no funcione", sino entender el porqué:

- **200 OK**: Todo correcto, la petición se procesó bien.
- **201 Created**: Perfecto para `POST`, el recurso se ha creado.
- **204 No Content**: Típico en `DELETE` cuando la operación fue exitosa pero no hay nada que devolver.
- **400 Bad Request**: La petición está mal formada, revisa el JSON o los parámetros.
- **401 Unauthorized**: Falta autenticación o el token ha expirado.
- **403 Forbidden**: Estás autenticado, pero no tienes permisos para esa acción.
- **404 Not Found**: El recurso no existe, revisa la URL.
- **429 Too Many Requests**: Has superado el límite de peticiones por minuto. Muy típico en APIs públicas.
- **500 Internal Server Error**: El problema es del servidor, no tuyo.

Un truco que uso siempre: añade `-i` a tus peticiones `curl` para ver las cabeceras y el código de estado en la respuesta.

```bash
curl -i -X DELETE "https://api.tuempresa.com/v1/incidencias/123" \
     -H "Authorization: Bearer TU_TOKEN_API"
```

Si ves `204`, perfecto. Si ves `404`, la incidencia no existía.

## Autenticación y buenas prácticas

La mayoría de las APIs usan **token Bearer** o **API Keys**. El token se envía en la cabecera `Authorization`, como en los ejemplos anteriores. Nunca lo pongas en la URL, porque quedaría registrado en los logs del servidor.

Otras prácticas que te ahorrarán dolores de cabeza:

- **Usa HTTPS siempre**: si la API no lo ofrece, desconfía.
- **Respeta el rate limiting**: si te dan un límite de 100 peticiones/minuto, no lo superes o te bloquearán la IP.
- **Lee la documentación**: cada API tiene sus peculiaridades, como paginación (`?page=1&limit=50`) o filtros específicos.
- **Maneja los errores**: en tu script, captura los códigos 4xx y 5xx para mostrar mensajes útiles, no un simple "fallo".

## Conclusión

Las APIs REST no son magia, son HTTP bien aplicado. Con saber usar `curl`, interpretar los códigos de estado y gestionar tu token de autenticación, ya tienes la base para integrarte con casi cualquier servicio moderno. Empieza con una API pública (como la de GitHub o la de tu proveedor de hosting) y practica con peticiones sencillas. En menos de lo que piensas, estarás automatizando tareas que antes hacías a mano desde el panel de control.
