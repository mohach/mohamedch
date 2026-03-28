---
titulo: "Cómo reduje el LCP de mi app en un 60% con Astro Islands"
descripcion: "Una exploración práctica de la arquitectura de islas y cómo aplicarla para mejorar las métricas de Core Web Vitals en proyectos reales."
fecha: 2025-03-14
etiqueta: rendimiento
destacado: true
---

La primera vez que medí el **Largest Contentful Paint** de mi aplicación, el número que apareció en Lighthouse me dejó frío: 4.2 segundos. Demasiado para cualquier estándar moderno.

## El problema

El sitio estaba construido con React puro. Cada componente hidrataba al cargar, aunque la mayoría fueran puramente estáticos: una cabecera, un pie de página, una sección de texto. El JavaScript innecesario bloqueaba el renderizado.

## La solución: arquitectura de islas

Astro propone un modelo diferente. Por defecto, **cero JavaScript** en el cliente. Solo añades interactividad donde realmente la necesitas, marcando los componentes con directivas como `client:load`, `client:idle` o `client:visible`.

```astro
<!-- Solo hidrata cuando el componente es visible en pantalla -->
<CarritoCompra client:visible />

<!-- El resto son HTML estático, sin JS -->
<Cabecera />
<SeccionHero />
<ListaProductos />
```

## Resultados

Después de migrar a Astro e identificar qué componentes necesitaban realmente hidratación (solo el carrito y el buscador), los números cambiaron drásticamente:

- **LCP**: 4.2s → 1.7s
- **TBT** (Total Blocking Time): 380ms → 0ms
- **Puntuación Lighthouse**: 61 → 98

## Lecciones aprendidas

No todo necesita ser interactivo. La mayor parte de una web de contenido puede ser HTML estático, y Astro te obliga a pensar en ello de forma explícita, que es exactamente la mentalidad correcta.
