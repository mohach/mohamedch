---
title: "Git y GitHub para técnicos: guía desde cero"
excerpt: "Domina Git y GitHub desde cero con esta guía práctica para técnicos: comandos esenciales, flujos de trabajo y ejemplos reales."
date: "2026-07-29"
lang: "es"
slug: "git-y-github-para-tecnicos-guia-desde-cero"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Si eres técnico y aún no controlas Git, te estás perdiendo una de las herramientas más útiles del día a día. No hace falta ser desarrollador para beneficiarte del control de versiones: gestionar configuraciones, scripts o documentación técnica se vuelve mucho más ordenado. Aquí tienes una guía práctica para empezar desde cero.

## ¿Qué es Git y por qué usarlo?

Git es un sistema de control de versiones distribuido. En cristiano: guarda un historial de todos los cambios que haces en tus archivos y te permite volver atrás si algo falla. Para un técnico, esto es oro cuando modificas archivos de configuración (`/etc/nginx/nginx.conf`, por ejemplo) o scripts de automatización.

GitHub es una plataforma en la nube donde alojas tus repositorios Git. Te sirve como copia de seguridad y para compartir código con compañeros. La clave está en que trabajas en local y sincronizas cuando quieres.

## Configuración inicial y primer repositorio

Abre tu terminal y escribe estos comandos (solo la primera vez):

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

Ahora, para crear un repositorio desde una carpeta existente:

```bash
cd /ruta/a/tu/proyecto
git init
```

Esto crea una carpeta oculta `.git` que lleva el control. Si trabajas con scripts o configuraciones, este es tu punto de partida.

## El flujo básico: add, commit, push

Imagina que modificas un archivo `backup.sh`. El flujo típico es:

1. **Añadir al área de preparación (staging):**
```bash
git add backup.sh
```
O si quieres añadir todo lo modificado:
```bash
git add .
```

2. **Guardar el cambio con un mensaje descriptivo:**
```bash
git commit -m "Añadida compresión gzip al script de backup"
```

3. **Subir a GitHub (si ya tienes el repositorio remoto configurado):**
```bash
git push origin main
```

Si nunca has subido nada, primero crea un repositorio vacío en GitHub y enlázalo:
```bash
git remote add origin https://github.com/tu-usuario/tu-repo.git
git branch -M main
git push -u origin main
```

## Comandos que todo técnico debe conocer

- `git status` — Muestra qué archivos han cambiado y cuáles están en staging. Úsalo constantemente.
- `git log --oneline` — Historial de commits resumido. Ideal para ver qué has hecho.
- `git diff` — Compara cambios sin confirmar. Perfecto antes de hacer commit para revisar.
- `git checkout -- nombre_archivo` — Descarta cambios locales en un archivo. Vuelve a la versión del último commit.
- `git pull` — Trae los cambios del repositorio remoto (si trabajas con alguien más).

Para revertir un commit (sin perder los cambios locales):
```bash
git reset --soft HEAD~1
```

Si quieres eliminar los cambios por completo:
```bash
git reset --hard HEAD~1  # Cuidado: esto borra cambios
```

## Conclusión

Git no es solo para programadores. Como técnico, te da control, trazabilidad y seguridad sobre tu trabajo. Empieza con un repositorio pequeño para tus scripts o configuraciones, y en una semana lo tendrás integrado en tu flujo diario. La terminal es tu amiga, y Git la hace aún más potente.
