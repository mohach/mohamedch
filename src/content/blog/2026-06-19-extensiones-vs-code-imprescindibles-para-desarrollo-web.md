---
title: "Extensiones VS Code imprescindibles para desarrollo web"
excerpt: "Descubre las extensiones de VS Code imprescindibles para desarrollo web que mejoran tu productividad, código y flujo de trabajo."
date: "2026-06-19"
lang: "es"
slug: "extensiones-vs-code-imprescindibles-para-desarrollo-web"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Si eres desarrollador web, probablemente pases gran parte del día frente a VS Code. Este editor es ligero, rápido y, sobre todo, extensible. Con las extensiones adecuadas, puedes transformarlo en un entorno de desarrollo casi perfecto, ahorrando tiempo y evitando dolores de cabeza. Aquí van las que uso a diario y considero imprescindibles.

## ESLint y Prettier: el dúo dinámico del código limpio

Mantener un código consistente y sin errores es básico. ESLint analiza tu JavaScript/TypeScript en busca de problemas, mientras que Prettier formatea automáticamente el código según reglas predefinidas.

Instálalos y configura un `settings.json` como este para que se ejecuten al guardar:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

Con esto, cada vez que guardes un archivo, el código se limpia y formatea solo. Olvídate de discusiones sobre puntos y comas.

## Live Server: ver cambios al instante

Cuando trabajas con HTML, CSS y JavaScript plano, recargar el navegador manualmente es tedioso. Live Server levanta un servidor local con recarga automática.

Haz clic derecho en tu `index.html` y selecciona "Open with Live Server". Se abrirá tu navegador en `http://127.0.0.1:5500`. Cualquier cambio en tus archivos se refleja al instante. Ideal para prototipado rápido o cuando no usas un framework con HMR (Hot Module Replacement).

## Tailwind CSS IntelliSense: si usas Tailwind, no hay excusa

Tailwind CSS es potente, pero recordar todas las clases puede ser un caos. Esta extensión te ofrece autocompletado, resaltado de sintaxis y vista previa de colores directamente en tu CSS o HTML.

Por ejemplo, al escribir `bg-blue-` te sugerirá todas las variantes disponibles: `bg-blue-500`, `bg-blue-700`, etc. También detecta clases personalizadas definidas en tu `tailwind.config.js`. Si trabajas con Tailwind, es casi obligatoria.

## Error Lens: errores y warnings donde duelen

Por defecto, VS Code marca errores con un subrayado rojo, pero tienes que pasar el ratón para ver el mensaje. Error Lens muestra el error, warning o sugerencia directamente en la línea de código, junto a ella.

Esto acelera la depuración porque ves el problema sin mover el cursor. Por ejemplo, si tienes una variable no definida, verás algo como:

```
const x = y; // [eslint] 'y' is not defined. (no-undef)
```

Directo y sin rodeos.

## GitLens: el historial de tu código al detalle

Para proyectos con control de versiones, GitLens es una pasada. Te muestra quién escribió cada línea, cuándo y en qué commit. También permite explorar el historial de archivos y ramas sin salir del editor.

Haz clic en una línea y verás un tooltip con el autor y el mensaje del commit. Para revisiones de código o cuando te preguntas "¿quién puso esto aquí?", es oro puro.

## Conclusión

Estas cinco extensiones cubren lo esencial: calidad de código, feedback visual, recarga en vivo, estilado con Tailwind y control de versiones. No hace falta instalar treinta extensiones; con estas, tu flujo de trabajo diario será más rápido y con menos fricción. Pruébalas y ajusta la configuración a tu gusto.
