---
title: "Gestión de secretos en producción: claves y variables"
excerpt: "Guía práctica para gestionar claves y variables de entorno en producción, asegurando secretos sin exponer datos sensibles."
date: "2026-04-25"
lang: "es"
slug: "gestion-de-secretos-en-produccion-claves-y-variables"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Cuando trabajamos en producción, uno de los errores más comunes es hardcodear contraseñas, claves de API o tokens directamente en el código. Esto no solo es una mala práctica de seguridad, sino que convierte el mantenimiento en una pesadilla. La gestión de secretos y variables de entorno es la solución que todo administrador de sistemas debe dominar para mantener aplicaciones seguras, portables y fáciles de auditar.

## Variables de entorno: el primer paso, pero no el definitivo

Las variables de entorno son la forma más básica y universal de separar configuración del código. En Linux, se definen en el shell o mediante archivos como `.env`. Un ejemplo típico:

```bash
export DB_PASSWORD="supersecreto123"
export API_KEY="abc123def456"
```

En aplicaciones Node.js o Python, se cargan con librerías como `dotenv` o `python-dotenv`. Pero en producción, depender solo de variables de entorno tiene un problema crítico: cualquier proceso que acceda a `/proc` o ejecute `ps aux` puede verlas. Además, si alguien obtiene acceso al servidor, tiene todas las claves.

**Consejo práctico:** nunca guardes archivos `.env` en repositorios Git. Añádelos a `.gitignore` y documenta las variables necesarias en un `.env.example`.

## Almacenamiento seguro con herramientas dedicadas

Para producción real necesitas un gestor de secretos. Las opciones más sólidas son:

- **HashiCorp Vault**: el estándar de la industria. Permite almacenar, rotar y auditar secretos. Se integra con LDAP, Kubernetes y AWS.
- **Bitwarden Secrets Manager**: más ligero, ideal para equipos pequeños. Ofrece CLI y SDK.
- **SOPS (Secrets OPerationS)**: de Mozilla, cifra archivos YAML/JSON con AWS KMS, GCP KMS o PGP. Perfecto si quieres mantener secretos en Git pero cifrados.

Ejemplo con SOPS para cifrar un archivo `.env`:

```bash
# Cifrar con clave PGP
sops --encrypt --pgp FINGERPRINT .env > .env.encrypted

# Descifrar
sops --decrypt .env.encrypted > .env
```

## Integración en el flujo de trabajo de producción

No basta con tener los secretos guardados; hay que inyectarlos correctamente en los servicios. Aquí van dos enfoques prácticos:

**Con Docker Compose**: define variables desde un archivo externo o directamente desde Vault.

```yaml
services:
  app:
    image: mi-app
    secrets:
      - db_password
    environment:
      DB_PASSWORD_FILE: /run/secrets/db_password

secrets:
  db_password:
    file: ./secrets/db_password.txt
```

**Con systemd**: usa `EnvironmentFile` para cargar un archivo de variables, pero asegúrate de que los permisos sean `600` y propietario root.

```ini
[Service]
EnvironmentFile=/etc/secrets/app.env
```

## Rotación y auditoría: no lo dejes para después

Los secretos deben rotarse periódicamente. Con Vault puedes configurar TTLs automáticos. Con SOPS, basta con regenerar el archivo cifrado. Además, registra quién accede a qué secreto. En Vault, los logs de auditoría son configurables; en Bitwarden, el historial de acceso está disponible en el panel.

**Script básico para rotar una clave en Vault:**

```bash
vault write -force secret/data/database
vault read -field=data secret/data/database
```

## Conclusión

Gestionar secretos en producción no es un lujo, es una necesidad. Empieza con variables de entorno bien protegidas, pero evoluciona hacia herramientas como Vault o SOPS. Automatiza la rotación, limita el acceso y audita cada uso. Tu futuro yo (y tu equipo de seguridad) te lo agradecerán.
