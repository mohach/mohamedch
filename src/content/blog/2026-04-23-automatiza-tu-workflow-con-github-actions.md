---
title: "Automatiza tu workflow con GitHub Actions"
excerpt: "Descubre cómo GitHub Actions automatiza tests, despliegues y tareas repetitivas en tu flujo de trabajo DevOps de forma sencilla."
date: "2026-04-23"
lang: "es"
slug: "automatiza-tu-workflow-con-github-actions"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Cuando trabajamos con repositorios en GitHub, es fácil caer en la rutina de hacer pruebas, builds y despliegues manualmente. GitHub Actions nos permite automatizar todo ese proceso directamente desde el repositorio, ahorrando tiempo y reduciendo errores humanos. En este artículo verás cómo configurar un flujo de trabajo básico pero funcional para tu día a día.

## Conceptos básicos de GitHub Actions

GitHub Actions se basa en *workflows* (flujos de trabajo) definidos en archivos YAML dentro de la carpeta `.github/workflows/`. Cada workflow se activa por eventos (push, pull request, schedule, etc.) y ejecuta uno o varios *jobs* en máquinas virtuales (runners). Los *steps* dentro de cada job pueden ejecutar comandos, scripts o acciones predefinidas de la comunidad.

Para empezar, necesitas tener un repositorio con al menos un archivo YAML en `.github/workflows/`. Por ejemplo, `main.yml`.

## Creando tu primer workflow de integración continua

Vamos a crear un workflow que ejecute pruebas automáticas cada vez que hagas push a la rama `main`. Crea el archivo `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Configurar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
```

Este workflow:
- Se activa en push a `main`.
- Usa el runner `ubuntu-latest`.
- Hace checkout del código, configura Node 18, instala dependencias y ejecuta los tests.

Puedes adaptarlo a cualquier lenguaje: cambia `setup-node` por `setup-python`, `setup-java`, etc.

## Desplegando automáticamente a un servidor

Una vez que los tests pasan, podemos desplegar el código a un servidor remoto vía SSH. Aquí tienes un ejemplo que copia los archivos mediante rsync:

```yaml
deploy:
  needs: test
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Desplegar por rsync
      uses: burnett01/rsync-deployments@7.0.1
      with:
        switches: -avz --delete
        path: ./
        remote_path: /var/www/miweb/
        remote_host: ${{ secrets.HOST }}
        remote_user: ${{ secrets.USER }}
        remote_key: ${{ secrets.SSH_KEY }}
```

Guarda las credenciales (HOST, USER, SSH_KEY) como *secrets* en tu repositorio: *Settings > Secrets and variables > Actions*. Nunca escribas contraseñas directamente en el YAML.

## Ejecutando tareas programadas con cron

GitHub Actions también permite lanzar workflows en intervalos regulares. Por ejemplo, para hacer una copia de seguridad de tu base de datos cada día a las 3:00 AM:

```yaml
name: Backup diario

on:
  schedule:
    - cron: '0 3 * * *'

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - name: Ejecutar backup
        run: |
          curl -X POST https://tuapi.com/backup \
            -H "Authorization: Bearer ${{ secrets.API_TOKEN }}"
```

El formato cron es estándar: minuto, hora, día del mes, mes, día de la semana. Puedes usar [crontab.guru](https://crontab.guru) para generarlos fácilmente.

## Conclusión

GitHub Actions transforma tu repositorio en un centro de automatización potente y gratuito para proyectos públicos. Con solo unos pocos archivos YAML puedes tener integración continua, despliegues automáticos y tareas programadas sin depender de servicios externos. Empieza con un workflow simple y ve añadiendo complejidad según lo necesites. Tu yo del futuro te lo agradecerá.
