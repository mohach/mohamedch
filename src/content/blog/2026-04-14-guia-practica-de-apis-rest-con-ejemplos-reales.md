---
title: "Guía práctica de APIs REST con ejemplos reales"
excerpt: "Aprende a usar APIs REST con ejemplos prácticos y casos reales para integrar servicios web."
date: "2026-04-14"
lang: "es"
slug: "guia-practica-de-apis-rest-con-ejemplos-reales"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

En el mundo del desarrollo web y la integración de sistemas, las APIs REST se han convertido en el estándar de facto para la comunicación entre aplicaciones. Permiten que servicios y plataformas dispares intercambien datos de forma estructurada y predecible. En esta entrada, veremos sus fundamentos con ejemplos prácticos que puedes probar.

## ¿Qué es una API REST?

REST (Representational State Transfer) es un estilo arquitectónico que define un conjunto de reglas para crear servicios web. Se basa en principios clave como la arquitectura cliente-servidor, la comunicación sin estado y el uso de los métodos estándar HTTP. En la práctica, una API REST expone recursos (como usuarios, productos o artículos) a través de URLs (endpoints). Cada operación sobre ese recurso se realiza mediante un verbo HTTP específico: GET para leer, POST para crear, PUT para actualizar y DELETE para eliminar. Esta simplicidad es una de las claves de su éxito.

## Los Verbos HTTP en Acción

Imaginemos una API hipotética para gestionar una biblioteca (`https://api.biblioteca.com/libros`). Así interactuaríamos:

*   **GET /libros**: Recupera la lista de todos los libros.
*   **GET /libros/123**: Obtiene los detalles del libro con ID 123.
*   **POST /libros**: Crea un nuevo libro. Debes enviar los datos (por ejemplo, en JSON) en el cuerpo de la petición.
*   **PUT /libros/123**: Actualiza por completo el libro con ID 123.
*   **DELETE /libros/123**: Elimina el libro con ID 123.

Esta estructura es intuitiva y hace que la API sea fácil de entender y consumir.

## Un Ejemplo Real con `curl`

Vamos a usar un servicio público de pruebas como JSONPlaceholder. Abre tu terminal y prueba estos comandos:

1.  **Obtener posts (GET):**
    ```bash
    curl https://jsonplaceholder.typicode.com/posts
    ```
    La API devolverá una lista de publicaciones en formato JSON.

2.  **Crear un post (POST):**
    ```bash
    curl -X POST https://jsonplaceholder.typicode.com/posts \
    -H "Content-Type: application/json" \
    -d '{"title": "Mi artículo", "body": "Contenido de ejemplo", "userId": 1}'
    ```
    Nota el uso de las cabeceras (`-H`) para especificar el formato de los datos y el cuerpo (`-d`) con la información del nuevo recurso.

3.  **Eliminar un post (DELETE):**
    ```bash
    curl -X DELETE https://jsonplaceholder.typicode.com/posts/1
    ```
    Este comando solicitaría borrar el recurso con ID 1.

## Características Clave y Buenas Prácticas

Para que una API sea verdaderamente RESTful, debe seguir ciertas convenciones:
*   **Stateless (Sin estado):** Cada petición del cliente debe contener toda la información necesaria para ser procesada. El servidor no guarda el contexto de la sesión.
*   **Recursos en JSON:** Aunque se puede usar XML, JSON es el formato de intercambio de datos más común por su ligereza y legibilidad.
*   **Códigos de Estado HTTP:** Se usan para indicar el resultado: `200` (OK), `201` (Creado), `400` (Petición errónea), `404` (No encontrado), `500` (Error interno del servidor).
*   **Endpoints intuitivos:** Los nombres de los recursos suelen ser sustantivos en plural (`/usuarios`, `/pedidos`).

En resumen, las APIs REST son la columna vertebral de la web moderna, permitiendo la interoperabilidad entre aplicaciones. Comprender sus principios básicos—verbos HTTP, recursos y stateless—es el primer paso para integrar servicios o construir tus propias APIs. La mejor forma de aprender es practicar con APIs públicas y experimentar con herramientas como `curl` o clientes GUI como Postman.
