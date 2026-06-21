---
title: "Automatiza tu workflow con GitHub Actions"
excerpt: "Aprende a automatizar tus tareas repetitivas en GitHub Actions con ejemplos prácticos para desarrolladores."
date: "2026-06-21"
lang: "es"
slug: "automatiza-tu-workflow-con-github-actions"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Si eres desarrollador y aún no has probado GitHub Actions, te estás perdiendo una de las herramientas más útiles para ahorrar tiempo y evitar errores manuales. Con esta funcionalidad integrada en GitHub, puedes automatizar tareas repetitivas como tests, despliegues o notificaciones directamente desde tu repositorio. Lo mejor: no necesitas infraestructura externa.

## ¿Qué es un workflow y cómo se estructura?

Un workflow es un proceso automatizado que se define en un archivo YAML dentro de la carpeta `.github/workflows/`. Cada workflow se activa por eventos concretos: un `push`, un `pull request`, o incluso un schedule programado.

La estructura básica incluye:

- **name**: nombre descriptivo del workflow.
- **on**: evento que lo dispara.
- **jobs**: tareas que se ejecutan, cada una con sus `steps`.

Ejemplo mínimo:

```yaml
name: CI básico
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: echo "Workflow ejecutado correctamente"
```

## Automatizar tests con cada push

Uno de los usos más comunes es lanzar tests automáticos cada vez que subes código. Así evitas que algo roto llegue a producción. Para un proyecto Node.js, el workflow sería:

```yaml
name: Tests Node.js
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
```

Si algún test falla, GitHub lo marca en rojo y puedes configurar notificaciones por correo o Slack.

## Desplegar en producción con un solo merge

GitHub Actions también te permite desplegar automáticamente cuando haces merge a la rama principal. Aquí tienes un ejemplo para subir archivos por FTP a un servidor clásico:

```yaml
name: Deploy a producción
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Subir archivos por FTP
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USER }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./dist/
```

Los secretos los guardas en **Settings > Secrets and variables > Actions** de tu repositorio. Así nunca expones credenciales en el código.

## Programar tareas periódicas

¿Necesitas ejecutar un script cada día a las 8 de la mañana? Usa la sintaxis cron:

```yaml
name: Limpieza diaria
on:
  schedule:
    - cron: '0 8 * * *'
jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - run: curl -X POST https://tuservidor.com/api/cleanup
```

Esto es perfecto para borrar logs antiguos, renovar certificados o enviar informes automáticos.

## Conclusión

GitHub Actions te quita trabajo repetitivo de encima y hace que tu flujo sea más fiable. Empieza con algo sencillo, como lanzar tests al hacer push, y ve añadiendo más pasos según necesites. En mi día a día como técnico en Alaquas, esta herramienta me ha salvado de más de un despliegue nocturno con errores. Pruébalo y verás cómo tu productividad sube sin apenas esfuerzo.
