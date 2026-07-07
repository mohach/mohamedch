---
title: "Comandos Linux esenciales para técnicos"
excerpt: "Descubre los comandos Linux imprescindibles para técnicos: gestión de archivos, redes, procesos y diagnóstico del sistema."
date: "2026-07-07"
lang: "es"
slug: "comandos-linux-esenciales-para-tecnicos"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Cada día me encuentro con sistemas Linux en mantenimiento de servidores, resolución de incidencias de red o configuraciones de WordPress. Saber moverte por la terminal con soltura marca la diferencia entre perder diez minutos o resolver en treinta segundos. Aquí van los comandos que uso a diario y que considero imprescindibles para cualquier técnico.

## Navegación y gestión de archivos

Lo básico, pero ejecutado con eficiencia. `ls -la` te muestra permisos, propietarios y archivos ocultos. Para moverte rápido, `cd -` vuelve al directorio anterior. Cuando necesitas buscar algo, `find /ruta -name "*.log" -type f` es tu aliado. Y para inspeccionar archivos sin abrirlos al completo:

```bash
head -n 20 archivo.log   # primeras 20 líneas
tail -f archivo.log      # sigue la salida en tiempo real
grep "error" archivo.log # filtra por patrón
```

## Monitorización del sistema

Antes de tocar nada, hay que saber qué está pasando. `top` o `htop` (si lo tienes instalado) te dan una foto del consumo de CPU y RAM. Para ver procesos que consumen más memoria:

```bash
ps aux --sort=-%mem | head -10
```

El espacio en disco es crítico: `df -h` muestra particiones montadas y su uso. Cuando un disco está al 100%, `du -sh * | sort -rh` dentro del directorio sospechoso te descubre qué carpeta se está comiendo todo. Y no olvides `uptime` para saber hace cuánto que el sistema no se reinicia.

## Red y conectividad

En el día a día con servidores y streaming, estos comandos son obligatorios. `ping` para latencia básica, pero `mtr` (traceroute combinado) da mucha más información sobre caídas intermedias. Para ver puertos en escucha:

```bash
ss -tlnp   # sockets TCP en escucha con PID
```

Si trabajas con Cloudflare o servicios web, `curl -I https://dominio.com` te devuelve las cabeceras HTTP, ideal para depurar redirecciones o certificados SSL. Y para resolver DNS manualmente:

```bash
dig +short dominio.com
nslookup dominio.com
```

## Diagnóstico de procesos y servicios

Cuando un servicio no arranca, `systemctl status servicio` es lo primero. Si necesitas logs concretos, `journalctl -u servicio --since "1 hour ago"` te ahorra buscar a mano. Para matar un proceso que se ha vuelto loco:

```bash
kill -9 PID   # último recurso, forzar cierre
pkill -f "nombre" # mata por patrón
```

Y un truco que uso a menudo: `lsof -i :8080` te dice qué proceso está ocupando el puerto 8080, esencial cuando despliegas aplicaciones web.

Para cerrar, dominar estos comandos te da autonomía real en cualquier servidor Linux. No hace falta memorizar cien flags, sino saber qué herramientas tienes y cuándo usarlas. La práctica constante es la clave.
