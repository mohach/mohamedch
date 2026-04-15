---
title: "Guía práctica de APIs REST con ejemplos reales"
excerpt: "Aprende a usar APIs REST con ejemplos prácticos y claros para integrar servicios web en tus proyectos."
date: "2026-04-15"
lang: "es"
slug: "guia-practica-de-apis-rest-con-ejemplos-reales"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

En el mundo del desarrollo web y la integración de sistemas, las APIs REST se han convertido en el estándar de facto para la comunicación entre aplicaciones. Permiten que servicios y plataformas dispares intercambien datos de forma estructurada y predecible. En esta entrada, veremos sus fundamentos con ejemplos prácticos que puedes probar.

## ¿Qué es una API REST?

REST (Representational State Transfer) es un estilo arquitectónico que define un conjunto de reglas para crear servicios web. Se basa en el protocolo HTTP y utiliza sus verbos estándar para realizar operaciones sobre recursos, que son identificados mediante URLs (o endpoints). Los principios clave son una arquitectura cliente-servidor sin estado, una interfaz uniforme y la posibilidad de almacenar en caché las respuestas. En la práctica, cuando una aplicación móvil muestra el tiempo o cuando un sitio de viajes agrega vuelos de diferentes aerolíneas, casi siempre hay una API REST trabajando en segundo plano.

## Los Verbos HTTP en Acción

Cada operación en una API REST se asocia a un verbo HTTP específico. Aquí están los esenciales:

*   **GET**: Recuperar datos. No modifica el recurso.
    *   Ejemplo: `GET /api/usuarios` (lista todos los usuarios).
*   **POST**: Crear un nuevo recurso.
    *   Ejemplo: `POST /api/usuarios` (crea un usuario nuevo).
*   **PUT/PATCH**: Actualizar un recurso existente. PUT suele reemplazarlo por completo, PATCH actualiza parcialmente.
    *   Ejemplo: `PATCH /api/usuarios/123` (actualiza el email del usuario con ID 123).
*   **DELETE**: Eliminar un recurso.
    *   Ejemplo: `DELETE /api/usuarios/123` (borra al usuario con ID 123).

## Un Ejemplo Real con `curl`

La forma más directa de interactuar con una API REST es desde la terminal con `curl`. Vamos a usar la API pública JSONPlaceholder para simular operaciones.

**1. Obtener un listado (GET):**
```bash
curl -X GET https://jsonplaceholder.typicode.com/posts
```
Este comando devolverá una lista de publicaciones (posts) en formato JSON.

**2. Crear un recurso (POST):**
```bash
curl -X POST https://jsonplaceholder.typicode.com/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "Mi post", "body": "Contenido de ejemplo", "userId": 1}'
```
Aquí enviamos datos JSON en el cuerpo (`-d`) de la petición para crear una nueva publicación. La cabecera `-H` indica el tipo de contenido.

**3. Obtener un recurso específico:**
```bash
curl -X GET https://jsonplaceholder.typicode.com/posts/1
```
Accedemos a los datos de la publicación con ID 1.

## Formatos de Datos y Códigos de Estado

La información en las APIs REST moderna se intercambia casi siempre en formato **JSON** (JavaScript Object Notation), por su ligereza y fácil lectura tanto para humanos como para máquinas. Un ejemplo de respuesta sería:
```json
{
  "id": 1,
  "title": "Ejemplo",
  "completed": false
}
```

Además del cuerpo de la respuesta, es crucial fijarse en los **Códigos de Estado HTTP**. Indican si la solicitud fue exitosa o falló:
*   `200 OK`: Éxito.
*   `201 Created`: Recurso creado (tras un POST).
*   `400 Bad Request`: Error en la petición del cliente.
*   `404 Not Found`: El recurso no existe.
*   `500 Internal Server Error`: Fallo en el servidor.

Comprender estos fundamentos es el primer paso para integrar servicios externos en tus proyectos o incluso para diseñar tu propia API. La simplicidad y el uso de estándares web existentes son las claves de su éxito omnipresente.
