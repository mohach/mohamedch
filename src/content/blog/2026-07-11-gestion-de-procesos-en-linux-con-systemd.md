---
title: "Gestión de procesos en Linux con systemd"
excerpt: "Aprende a gestionar servicios y procesos en Linux con systemd: iniciar, detener, habilitar y monitorizar desde terminal."
date: "2026-07-11"
lang: "es"
slug: "gestion-de-procesos-en-linux-con-systemd"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Si trabajas con Linux, tarde o temprano necesitarás lanzar, detener o supervisar servicios. `systemd` es el sistema de inicio y gestor de servicios estándar en la mayoría de distribuciones modernas (Ubuntu, Debian, Fedora, Arch). Conocer sus comandos básicos te ahorrará tiempo y te dará control total sobre los procesos de tu servidor o equipo de escritorio.

## Ver el estado de los servicios

Lo primero es saber qué está corriendo. Con `systemctl` puedes listar todas las unidades activas:

```bash
systemctl list-units --type=service --state=running
```

Para ver un servicio concreto, por ejemplo `nginx`:

```bash
systemctl status nginx
```

Este comando te muestra si está activo, su PID, memoria, y las últimas líneas de log. Si algo falla, aquí verás el error rápidamente.

## Arrancar, parar y reiniciar servicios

El control básico se hace con `systemctl` seguido de la acción y el nombre del servicio:

```bash
# Iniciar un servicio
sudo systemctl start apache2

# Detenerlo
sudo systemctl stop apache2

# Reiniciarlo (corta y vuelve a arrancar)
sudo systemctl restart apache2

# Recargar configuración sin interrumpir el servicio
sudo systemctl reload apache2
```

La diferencia entre `restart` y `reload` es importante: `restart` detiene el proceso y lo levanta de nuevo (pérdida momentánea de conexiones), mientras que `reload` aplica cambios en caliente (ideal para servidores web).

## Habilitar o deshabilitar servicios al arranque

No todos los servicios deben iniciarse automáticamente al encender el sistema. Con `systemctl` puedes controlarlo:

```bash
# Habilitar para que arranque con el sistema
sudo systemctl enable nginx

# Deshabilitar (no arrancará automáticamente)
sudo systemctl disable nginx

# Verificar si está habilitado
systemctl is-enabled nginx
```

Si necesitas que un servicio arranque solo una vez, puedes usar `systemctl enable --now nombre` que lo habilita y lo inicia en un solo paso.

## Crear tu propia unidad de servicio

Si tienes un script o aplicación que quieres gestionar como servicio, crea un archivo `.service` en `/etc/systemd/system/`. Por ejemplo, para un bot de Python:

```ini
[Unit]
Description=Mi bot de Telegram
After=network.target

[Service]
ExecStart=/usr/bin/python3 /home/usuario/bot.py
Restart=always
User=usuario
WorkingDirectory=/home/usuario

[Install]
WantedBy=multi-user.target
```

Guarda el archivo como `mibot.service` y luego:

```bash
sudo systemctl daemon-reload
sudo systemctl start mibot
sudo systemctl enable mibot
```

A partir de ese momento, tu script se comporta como un servicio más: puedes ver su estado, logs con `journalctl -u mibot`, y se reiniciará automáticamente si falla.

## Conclusión

`systemd` simplifica enormemente la gestión de procesos en Linux. Con solo cuatro o cinco comandos puedes controlar cualquier servicio, desde un servidor web hasta un script casero. Aprender a crear tus propias unidades te dará flexibilidad total para automatizar tareas y mantener tus aplicaciones funcionando sin intervención manual.
