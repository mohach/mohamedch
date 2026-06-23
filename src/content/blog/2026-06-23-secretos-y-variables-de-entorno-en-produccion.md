---
title: "Secretos y variables de entorno en producción"
excerpt: "Descubre cómo gestionar secretos y variables de entorno en producción para proteger tus aplicaciones y evitar filtraciones críticas."
date: "2026-06-23"
lang: "es"
slug: "secretos-y-variables-de-entorno-en-produccion"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Cuando trabajamos en producción, uno de los errores más comunes es hardcodear contraseñas, claves de API o tokens directamente en el código. Esto no solo es una mala práctica, sino que convierte tu aplicación en un blanco fácil para filtraciones. Aquí te cuento cómo gestionar secretos y variables de entorno de forma segura y práctica, basándome en mi día a día con servidores Linux y despliegues web.

## Variables de entorno: lo básico bien hecho

Las variables de entorno son el primer nivel de defensa. En sistemas Linux, las cargamos desde un archivo `.env` que nunca debe subirse al repositorio. Asegúrate de añadirlo a `.gitignore` desde el primer commit.

```bash
# .env (ejemplo seguro)
DB_PASSWORD="s3cr3t0_fu3rte"
API_KEY="sk-1234abcd"
```

Para cargarlas en tu aplicación, en Node.js usamos `dotenv`, en Python `python-dotenv`, y en scripts Bash directamente `source .env`. En producción, lo suyo es inyectarlas desde el sistema o el orquestador:

```bash
# Cargar desde systemd (ejemplo para un servicio)
[Service]
EnvironmentFile=/etc/miapp/.env
```

## Gestión con herramientas específicas

Para proyectos que escalan, las variables de entorno se quedan cortas. Aquí entran herramientas como **Vault de HashiCorp** o **SOPS**. En mi caso, para servidores pequeños uso `sops` con claves GPG o AWS KMS. Cifras el archivo y solo se descifra en el momento de ejecución:

```bash
# Cifrar con sops
sops --encrypt --pgp 1234ABCD secrets.yaml > secrets.enc.yaml

# Descifrar en producción
sops --decrypt secrets.enc.yaml | yq eval '.db_password' -
```

Si usas Docker, nunca pongas secretos en variables de entorno del `docker-compose.yml` a texto plano. Mejor usa `docker secrets` o monta archivos cifrados:

```yaml
# docker-compose.yml (ejemplo seguro)
secrets:
  db_password:
    file: ./secrets/db_password.txt

services:
  app:
    secrets:
      - db_password
```

## Automatización con CI/CD

En pipelines de CI/CD, los secretos deben venir del gestor del proveedor (GitHub Actions Secrets, GitLab CI Variables) y nunca del código. En GitHub Actions, por ejemplo:

```yaml
- name: Desplegar en producción
  env:
    DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
  run: |
    echo "$DB_PASSWORD" > /etc/miapp/.env
    ansible-playbook deploy.yml
```

Además, rota los secretos periódicamente y revoca los antiguos. Una buena práctica es usar tokens temporales (como los de AWS STS) en lugar de claves fijas.

## Buenas prácticas en el servidor

En el servidor Linux final, aplica estos principios:

- **Permisos estrictos**: `chmod 600 /etc/miapp/.env` para que solo root y el usuario del servicio puedan leerlo.
- **Logs sin secretos**: configura tu aplicación para que no imprima variables sensibles en logs. En Node.js, evita `console.log(process.env)`.
- **Auditoría**: revisa quién accede a los secretos. En sistemas con `auditd`, puedes monitorizar accesos al archivo `.env`.
- **Copia de seguridad cifrada**: si haces backup del `.env`, que sea con GPG o similar.

## Conclusión

Gestionar secretos en producción no es un lujo, es una necesidad. Empieza por lo básico: variables de entorno bien aisladas y `.gitignore`. Luego escala con herramientas como sops o Vault según tu infraestructura. Automatiza la inyección en CI/CD y mantén los permisos ajustados en el servidor. Con estos pasos, reduces el riesgo de fugas y duermes más tranquilo.
