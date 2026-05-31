---
title: "Git y GitHub para técnicos: guía desde cero"
excerpt: "Aprende Git y GitHub desde cero con esta guía práctica para técnicos: control de versiones, comandos esenciales y flujo de trabajo real."
date: "2026-05-31"
lang: "es"
slug: "git-y-github-para-tecnicos-guia-desde-cero"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Si has trabajado con código o configuraciones sin un sistema de control de versiones, sabes lo rápido que se convierte en un caos. Git te permite llevar un historial limpio de cada cambio, y GitHub actúa como el repositorio remoto donde colaborar o tener una copia de seguridad. Vamos a ver lo esencial para empezar desde cero.

## Primeros pasos: instalar y configurar Git

Lo primero es instalar Git. En Debian/Ubuntu:

```bash
sudo apt update && sudo apt install git -y
```

En CentOS/RHEL:

```bash
sudo yum install git
```

Verifica la instalación:

```bash
git --version
```

Ahora configura tu identidad (cada commit llevará estos datos):

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

Para confirmar la configuración:

```bash
git config --list
```

## Crear tu primer repositorio y hacer commits

Navega a tu proyecto e inicializa Git:

```bash
cd /ruta/a/tu/proyecto
git init
```

Esto crea una carpeta oculta `.git`. Añade archivos al área de staging (preparación):

```bash
git add index.html script.js
```

O añade todo de golpe:

```bash
git add .
```

Haz tu primer commit:

```bash
git commit -m "Primer commit: estructura inicial del proyecto"
```

Consulta el estado en cualquier momento:

```bash
git status
```

## Conectar con GitHub y subir el proyecto

Crea un repositorio vacío en GitHub (sin README, .gitignore ni licencia). Copia la URL SSH o HTTPS. Enlázalo con tu local:

```bash
git remote add origin https://github.com/tu-usuario/tu-repo.git
```

Sube tu código:

```bash
git push -u origin main
```

Si tu rama se llama `master`, usa `git push -u origin master`. La opción `-u` vincula tu rama local con la remota para futuros `git push` sin especificarla.

## Comandos esenciales para el día a día

Para bajar cambios del remoto:

```bash
git pull origin main
```

Para ver el historial de commits:

```bash
git log --oneline --graph --all
```

Si has modificado algo y quieres deshacerlo antes del commit:

```bash
git checkout -- archivo_modificado.txt
```

Para crear y cambiarte a una rama nueva (ideal para probar cambios sin romper nada):

```bash
git branch feature-nueva
git checkout feature-nueva
```

O en un solo paso:

```bash
git checkout -b feature-nueva
```

Cuando termines, fusiona con la rama principal:

```bash
git checkout main
git merge feature-nueva
```

## Conclusión

Con Git y GitHub tienes control total sobre tu código: puedes experimentar sin miedo, colaborar con otros técnicos y mantener un historial impecable. Empieza con proyectos pequeños, practica los comandos básicos y verás cómo en poco tiempo se convierte en una herramienta imprescindible en tu día a día.
