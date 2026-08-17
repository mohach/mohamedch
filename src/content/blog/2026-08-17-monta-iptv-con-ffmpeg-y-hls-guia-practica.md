---
title: "Monta IPTV con FFmpeg y HLS: Guía práctica"
excerpt: "Aprende a montar un servidor IPTV propio con FFmpeg y HLS: guía práctica paso a paso para emitir en directo desde Linux."
date: "2026-08-17"
lang: "es"
slug: "monta-iptv-con-ffmpeg-y-hls-guia-practica"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Cuando un cliente pide un sistema de televisión por IP, no siempre hace falta recurrir a plataformas de pago o soluciones cerradas. Con una máquina Linux, FFmpeg y el protocolo HLS podemos montar una infraestructura de streaming ligera, fiable y sin costes de licencia. En este artículo te explico el esquema básico que uso en despliegues reales, desde la captura hasta la publicación del canal.

## Arquitectura general y requisitos

El montaje se divide en tres bloques: la fuente de vídeo, el procesador (FFmpeg) y el servidor de entrega. La fuente puede ser una señal HDMI capturada con una tarjeta USB, una entrada SDI o incluso un stream IP ya existente. El procesador convierte esa señal en segmentos HLS (archivos `.ts` pequeños) y genera una lista de reproducción `.m3u8`. El servidor de entrega es cualquier servidor web (Nginx o Apache) que sirva esos archivos.

Para empezar necesitas un equipo con FFmpeg compilado con soporte para tu dispositivo de captura. En Debian/Ubuntu:

```bash
sudo apt update && sudo apt install ffmpeg nginx
```

## Captura y transcodificación con FFmpeg

Lo primero es identificar el dispositivo de entrada. Con una capturadora HDMI USB típica, el dispositivo aparecerá como `/dev/video0`. Probamos la señal:

```bash
ffmpeg -f v4l2 -i /dev/video0 -t 10 test.mkv
```

Si la imagen se ve correcta, pasamos al comando de streaming. Aquí tienes un ejemplo práctico que genera HLS con segmentos de 4 segundos y lista de reproducción de 6 segmentos (unos 24 segundos de retardo máximo):

```bash
ffmpeg -f v4l2 -i /dev/video0 -f alsa -i hw:0 -c:v libx264 -preset veryfast -tune zerolatency -b:v 2500k -c:a aac -b:a 128k -f hls -hls_time 4 -hls_list_size 6 -hls_flags delete_segments /var/www/hls/canal1.m3u8
```

Adapta la entrada de audio a tu hardware (`hw:0` es la primera tarjeta de sonido). Si la fuente es un stream IP, sustituye la entrada por la URL, por ejemplo `-i http://fuente.ejemplo.com:8080/stream`.

## Configuración de Nginx para servir HLS

Nginx debe servir los archivos `.m3u8` y `.ts` con los tipos MIME correctos y permitir CORS si vas a reproducir desde un reproductor web. Añade esto a tu configuración de sitio:

```nginx
location /hls/ {
    alias /var/www/hls/;
    types {
        application/vnd.apple.mpegurl m3u8;
        video/mp2t ts;
    }
    add_header Cache-Control no-cache;
    add_header Access-Control-Allow-Origin *;
}
```

Recarga Nginx y prueba la reproducción:

```bash
sudo systemctl reload nginx
```

Abre en tu navegador o en VLC la URL `http://tu-servidor/hls/canal1.m3u8`. Si todo funciona, ya tienes un canal operativo.

## Automatización y monitorización básica

Un canal no es nada sin supervisión. Lo mínimo es un script que reinicie FFmpeg si falla. Un `watchdog` sencillo con systemd es suficiente. Crea un servicio en `/etc/systemd/system/canal1.service`:

```ini
[Unit]
Description=Canal IPTV 1
After=network.target

[Service]
ExecStart=/usr/bin/ffmpeg -f v4l2 -i /dev/video0 -f alsa -i hw:0 -c:v libx264 -preset veryfast -tune zerolatency -b:v 2500k -c:a aac -b:a 128k -f hls -hls_time 4 -hls_list_size 6 -hls_flags delete_segments /var/www/hls/canal1.m3u8
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Actívalo y arráncalo:

```bash
sudo systemctl enable --now canal1.service
```

Además, te recomiendo un pequeño chequeo que verifique que el archivo `.m3u8` se actualiza. Un cron cada minuto que toque un timestamp es suficiente para detectar cortes.

## Conclusión

Con FFmpeg y HLS tienes una base sólida para montar IPTV sin depender de soluciones comerciales. El sistema escala bien: añade más canales con más servicios systemd y un `location` por canal en Nginx. Eso sí, recuerda que HLS introduce un retardo de 10-30 segundos, así que si necesitas baja latencia, tendrás que mirar protocolos como LL-HLS o SRT. Para la mayoría de casos de uso doméstico o de pequeña empresa, este montaje es más que suficiente.
