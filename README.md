# Portfolio — Mohamed Chennani

Portfolio personal en castellano construido con **Astro** y **Tailwind CSS**.

## Estructura del proyecto

```
src/
├── components/
│   └── Nav.astro           # Navegación principal
├── content/
│   ├── config.ts           # Schema de la colección blog
│   └── blog/               # Artículos en Markdown
│       ├── astro-islands-lcp.md
│       ├── typescript-tipos-avanzados.md
│       └── contribuir-open-source.md
├── layouts/
│   └── Base.astro          # Layout HTML base
├── pages/
│   ├── index.astro         # Página principal (sobre mí, experiencia, proyectos, blog, contacto)
│   └── blog/
│       ├── index.astro     # Listado del blog con filtro por etiqueta
│       └── [slug].astro    # Página individual de cada post
└── styles/
    └── global.css          # Variables CSS globales (referencia)
```

## Instalación

```bash
npm install
npm run dev
```

## Añadir un nuevo post

Crea un archivo `.md` en `src/content/blog/` con este frontmatter:

```markdown
---
titulo: "Título del artículo"
descripcion: "Descripción breve que aparece en el listado."
fecha: 2025-04-01
etiqueta: typescript   # aparece como filtro en /blog
destacado: false
---

Contenido en Markdown aquí...
```

El slug de la URL se genera automáticamente a partir del nombre del archivo.

## Personalizar

- **Información personal**: edita `src/pages/index.astro` — los arrays `experiencia`, `proyectos`, `habilidades` y la sección `contacto`.
- **Tipografías**: definidas en `src/layouts/Base.astro` (Google Fonts) y en las variables `--serif`, `--mono`, `--sans`.
- **Colores**: variables CSS en `src/layouts/Base.astro` dentro del bloque `<style is:global>`. Incluye soporte automático para modo oscuro.

## Despliegue

Compatible con Vercel, Netlify y cualquier plataforma que soporte Node.js o salida estática.

```bash
npm run build    # genera la carpeta dist/
npm run preview  # previsualiza la build en local
```
