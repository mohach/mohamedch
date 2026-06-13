---
title: "APIs REST desde cero: ejemplos prácticos y reales"
excerpt: "Aprende qué son las APIs REST desde cero con ejemplos prácticos y reales, ideales para desarrolladores que empiezan."
date: "2026-06-13"
lang: "es"
slug: "apis-rest-desde-cero-ejemplos-practicos-y-reales"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Hoy en día, prácticamente cualquier aplicación moderna se comunica con servidores externos para obtener datos o realizar acciones. Las APIs REST se han convertido en el estándar de facto para esta comunicación, gracias a su simplicidad y uso de protocolos web comunes. En esta guía, veremos qué son, cómo funcionan y cómo empezar a usarlas desde la línea de comandos.

## ¿Qué es una API REST?

REST (Representational State Transfer) es un estilo de arquitectura que define cómo dos sistemas pueden intercambiar información a través de HTTP. Una API REST expone recursos (como usuarios, artículos o pedidos) mediante URLs, y permite operar sobre ellos usando los métodos HTTP estándar:

- `GET` → Obtener un recurso o lista de recursos.
- `POST` → Crear un nuevo recurso.
- `PUT` o `PATCH` → Actualizar un recurso existente.
- `DELETE` → Eliminar un recurso.

La respuesta suele venir en formato JSON, aunque también puede ser XML. La gran ventaja es que no guarda estado entre peticiones: cada solicitud es independiente.

## Primeros pasos con `curl`

La herramienta más práctica para probar APIs desde la terminal es `curl`. Vamos a ver ejemplos reales usando una API pública y gratuita: JSONPlaceholder.

Para obtener una lista de usuarios:

```bash
curl https://jsonplaceholder.typicode.com/users
```

Verás un JSON con nombre, email, dirección, etc. Si quieres un usuario concreto, añades su ID:

```bash
curl https://jsonplaceholder.typicode.com/users/1
```

Para que la salida sea más legible, puedes canalizarla a `jq` (instálalo con `apt install jq` si no lo tienes):

```bash
curl -s https://jsonplaceholder.typicode.com/users/1 | jq .
```

## Crear y modificar recursos con POST y PUT

Ahora que sabemos leer, toca escribir. Para crear un nuevo recurso usamos `POST`:

```bash
curl -X POST https://jsonplaceholder.typicode.com/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Mohamed Chennani","username":"mchennani","email":"mohamed@example.com"}'
```

La API nos devolverá el objeto creado con un ID nuevo (en este caso 11). Para actualizar un recurso existente usamos `PUT`:

```bash
curl -X PUT https://jsonplaceholder.typicode.com/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Nuevo nombre","email":"nuevo@email.com"}'
```

Si solo quieres modificar un campo, `PATCH` es más eficiente. Y para eliminar:

```bash
curl -X DELETE https://jsonplaceholder.typicode.com/users/1
```

## Códigos de respuesta y buenas prácticas

Al trabajar con APIs REST, es esencial entender los códigos de estado HTTP:

- `200 OK` → Todo correcto (GET, PUT, PATCH).
- `201 Created` → Recurso creado con éxito (POST).
- `204 No Content` → Operación exitosa sin contenido en la respuesta (DELETE).
- `400 Bad Request` → La petición está mal formada.
- `401 Unauthorized` → Falta autenticación.
- `404 Not Found` → El recurso no existe.
- `500 Internal Server Error` → Error en el servidor.

Siempre comprueba el código de respuesta en tus scripts. Con `curl` puedes verlo añadiendo `-w "%{http_code}"`:

```bash
curl -s -o /dev/null -w "%{http_code}" https://jsonplaceholder.typicode.com/users/1
```

## Conclusión

Las APIs REST son el pan de cada día para cualquier administrador de sistemas o desarrollador web. Con herramientas como `curl` y un conocimiento básico de los métodos HTTP, puedes integrar servicios, automatizar tareas y depurar problemas de forma rápida. Empieza probando con APIs públicas, y cuando te sientas cómodo, lánzate a consumir APIs reales como las de Cloudflare, WordPress o servicios de streaming. La práctica es la clave.
