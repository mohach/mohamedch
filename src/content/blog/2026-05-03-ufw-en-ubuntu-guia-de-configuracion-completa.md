---
title: "UFW en Ubuntu: guía de configuración completa"
excerpt: "Aprende a configurar UFW en Ubuntu desde cero: reglas, perfiles, logs y ejemplos prácticos para proteger tu servidor."
date: "2026-05-03"
lang: "es"
slug: "ufw-en-ubuntu-guia-de-configuracion-completa"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Si gestionas un servidor Ubuntu, ya sea en casa o en producción, el firewall es tu primera línea de defensa. `ufw` (Uncomplicated Firewall) simplifica enormemente la gestión de iptables, permitiéndote definir reglas de tráfico de forma clara y eficiente. Aquí tienes una guía práctica para dominarlo.

## Instalación y estado inicial

Ubuntu suele incluir `ufw` por defecto, pero si no es el caso, instálalo con:

```bash
sudo apt update && sudo apt install ufw -y
```

Antes de activarlo, verifica su estado:

```bash
sudo ufw status
```

Verás `Status: inactive`. Es importante comprobar que no hay reglas previas que puedan bloquear tu conexión actual, sobre todo si accedes por SSH.

## Configuración de reglas básicas

Lo primero es establecer una política por defecto restrictiva y luego abrir solo lo necesario. Configura el comportamiento base:

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
```

Con esto, bloqueamos todo el tráfico entrante y permitimos el saliente. Ahora, habilita servicios específicos.

Para SSH (puerto 22), esencial si administras el servidor remotamente:

```bash
sudo ufw allow ssh
```

O si usas un puerto personalizado:

```bash
sudo ufw allow 2222/tcp
```

Para un servidor web, abre HTTP y HTTPS:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

También puedes usar nombres de servicio directamente:

```bash
sudo ufw allow 'Apache Full'
```

## Gestión avanzada: puertos, rangos y logs

A veces necesitas más control. Por ejemplo, permitir un rango de puertos para una aplicación:

```bash
sudo ufw allow 6000:6007/tcp
```

O limitar conexiones SSH para evitar ataques de fuerza bruta (rate limiting):

```bash
sudo ufw limit ssh
```

Esta regla rechaza conexiones si un IP hace más de 6 intentos en 30 segundos.

Para registrar los intentos bloqueados, activa el log:

```bash
sudo ufw logging on
```

Los logs se almacenan en `/var/log/ufw.log`. Son muy útiles para depurar problemas de conectividad.

## Activar, verificar y eliminar reglas

Una vez configurado, activa el firewall. **Importante**: asegúrate de que SSH está permitido antes de ejecutar esto:

```bash
sudo ufw enable
```

Confirma que todo funciona:

```bash
sudo ufw status verbose
```

Verás algo como:

```
Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing)
New profiles: skip

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW IN    Anywhere
80/tcp                     ALLOW IN    Anywhere
443/tcp                    ALLOW IN    Anywhere
```

Si necesitas eliminar una regla, puedes usar el número de línea (sácalo con `sudo ufw status numbered`):

```bash
sudo ufw delete 3
```

O por nombre:

```bash
sudo ufw delete allow 80/tcp
```

Para desactivar temporalmente el firewall (por ejemplo, durante pruebas):

```bash
sudo ufw disable
```

## Conclusión

`ufw` es una herramienta potente y sencilla que te permite asegurar tu Ubuntu sin complicaciones. Con estas reglas básicas y avanzadas, tendrás el tráfico bajo control y podrás detectar intentos de acceso no deseados. Dedica unos minutos a revisar los logs periódicamente; te ahorrará más de un disgusto.
