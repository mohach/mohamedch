---
title: "Optimiza tu VPS en Hetzner: guía de rendimiento"
excerpt: "Aprende a optimizar tu VPS en Hetzner con esta guía práctica de rendimiento: ajustes, monitoreo y mejoras clave."
date: "2026-05-15"
lang: "es"
slug: "optimiza-tu-vps-en-hetzner-guia-de-rendimiento"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Si tienes un VPS en Hetzner y notas que va lento o se queda sin recursos, no siempre hace falta contratar un plan superior. Con unos ajustes básicos de sistema y configuración, puedes exprimir al máximo tu servidor sin gastar un euro más. Aquí van cuatro pasos prácticos que aplico en mis propios despliegues.

## Desactivar servicios innecesarios y ajustar el kernel

Por defecto, los VPS de Hetzner vienen con servicios que quizá no necesites. Lo primero es revisar qué está corriendo:

```bash
systemctl list-units --type=service --state=running
```

Si ves `postfix`, `apache2` (si usas Nginx), `cups` o `avahi-daemon`, desactívalos sin piedad:

```bash
sudo systemctl disable --now postfix
```

Además, ajusta parámetros del kernel para mejorar el rendimiento de red y E/S. Edita `/etc/sysctl.conf` y añade:

```
net.core.somaxconn = 1024
vm.swappiness = 10
fs.file-max = 100000
```

Aplica los cambios con `sudo sysctl -p`. El `swappiness=10` evita que el sistema use swap innecesariamente, crucial en VPS con SSD NVMe.

## Optimizar el stack web (Nginx + PHP)

Si tu VPS corre sitios web, Nginx debe estar fino. En `/etc/nginx/nginx.conf`, ajusta los `worker_processes` al número de CPUs (saca con `nproc`):

```
worker_processes auto;
events {
    worker_connections 2048;
    multi_accept on;
}
```

Para PHP-FPM, edita el pool (`/etc/php/*/fpm/pool.d/www.conf`) y pon:

```
pm = dynamic
pm.max_children = 10
pm.start_servers = 2
pm.min_spare_servers = 1
pm.max_spare_servers = 3
```

Ajusta `pm.max_children` según la RAM disponible (cada proceso PHP consume unos 30-50 MB). Un cálculo rápido: si tienes 2 GB de RAM, no pongas más de 40.

## Cachear con Redis y opcache

Redis es un salvavidas para bases de datos y sesiones. Instálalo:

```bash
sudo apt install redis-server
```

Configura en `/etc/redis/redis.conf`:

```
maxmemory 256mb
maxmemory-policy allkeys-lru
```

Para PHP, activa OpCache a tope en `/etc/php/*/cli/conf.d/10-opcache.ini`:

```
opcache.enable=1
opcache.memory_consumption=128
opcache.max_accelerated_files=10000
opcache.revalidate_freq=60
```

Si usas WordPress, añade el plugin Redis Object Cache y notarás la diferencia en las consultas a la base de datos.

## Monitorizar con herramientas ligeras

No optimices a ciegas. Usa `htop` para ver procesos en tiempo real y `iotop` para la carga de disco. Para un análisis más fino:

```bash
sudo apt install netdata
```

Netdata te da métricas en tiempo real por web (puerto 19999). También puedes usar `vmstat 1` para ver si tu CPU espera por E/S (columna `wa` alta indica problema de disco o swap excesivo).

Un truco final: programa una tarea en cron para limpiar logs viejos:

```bash
0 4 * * * find /var/log -name "*.log" -mtime +7 -delete
```

## Conclusión

Optimizar un VPS en Hetzner no es magia, es sentido común: quita lo que no usas, ajusta los servicios a tu RAM, y cachea todo lo que puedas. Con estos cambios, un CX22 (2 GB RAM, 2 vCPU) puede servir contenido estático a cientos de visitas diarias sin sudar. Pruébalo y cuéntame cómo te va.
