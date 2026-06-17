---
title: "IPTV casera: FFmpeg y HLS paso a paso"
excerpt: "Aprende a montar tu propia IPTV casera con FFmpeg y HLS: guía paso a paso para transmitir video en tu red local."
date: "2026-06-17"
lang: "es"
slug: "iptv-casera-ffmpeg-y-hls-paso-a-paso"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Si estás buscando una solución ligera y funcional para distribuir señal de televisión en tu red local o hacia internet, montar una infraestructura IPTV con FFmpeg y HLS es una opción sólida, gratuita y con resultados profesionales. Aquí te cuento cómo hacerlo paso a paso, basado en mi experiencia real en despliegues domésticos y pequeños entornos corporativos.

## Requisitos previos y captura de señal

Lo primero es tener una fuente de vídeo. Puede ser una tarjeta sintonizadora DVB, una cámara IP, o incluso un archivo de vídeo para pruebas. En mi caso, uso un sintonizador USB DVB-T con Linux. Asegúrate de tener instalado FFmpeg y un servidor web como Nginx o Apache para servir los segmentos HLS.

```bash
sudo apt update && sudo apt install ffmpeg nginx
```

Para verificar que tu dispositivo de captura es detectado:

```bash
ffmpeg -hide_banner -sources dvb
```

## Creación del flujo HLS con FFmpeg

El protocolo HLS (HTTP Live Streaming) divide el vídeo en pequeños segmentos `.ts` y genera un archivo de lista de reproducción `.m3u8`. FFmpeg lo hace de forma sencilla. Este comando toma la señal del sintonizador DVB-T y la convierte en HLS:

```bash
ffmpeg -i dvb://canal_ejemplo -c:v libx264 -preset ultrafast -crf 23 -c:a aac -b:a 128k -f hls -hls_time 4 -hls_list_size 10 -hls_flags delete_segments /var/www/html/live/stream.m3u8
```

Explicación rápida:
- `-preset ultrafast`: reduce la carga de CPU, ideal si tienes hardware limitado.
- `-hls_time 4`: cada segmento dura 4 segundos.
- `-hls_list_size 10`: mantiene solo los últimos 10 segmentos en la lista.
- `delete_segments`: limpia segmentos antiguos para no llenar el disco.

Si tu fuente es una URL RTMP o UDP, solo cambia la entrada. Por ejemplo:

```bash
ffmpeg -i udp://@239.0.0.1:1234 -c copy -f hls -hls_time 4 /var/www/html/live/stream.m3u8
```

## Configuración del servidor web para servir HLS

Nginx necesita una configuración mínima para servir los archivos HLS correctamente. Edita `/etc/nginx/sites-available/default` y añade:

```nginx
server {
    listen 80;
    server_name tu_dominio_o_ip;

    location /live {
        types {
            application/vnd.apple.mpegurl m3u8;
            video/mp2t ts;
        }
        alias /var/www/html/live;
        add_header Cache-Control no-cache;
    }
}
```

Recarga Nginx:

```bash
sudo systemctl reload nginx
```

Ahora tu flujo es accesible desde `http://tu_ip/live/stream.m3u8`. Puedes probarlo con VLC o cualquier reproductor compatible con HLS.

## Automatización y monitorización básica

Para que el sistema funcione 24/7, te recomiendo ejecutar FFmpeg como un servicio systemd. Crea `/etc/systemd/system/iptv-stream.service`:

```ini
[Unit]
Description=IPTV HLS Stream
After=network.target

[Service]
ExecStart=/usr/bin/ffmpeg -i dvb://canal_ejemplo -c:v libx264 -preset ultrafast -crf 23 -c:a aac -b:a 128k -f hls -hls_time 4 -hls_list_size 10 -hls_flags delete_segments /var/www/html/live/stream.m3u8
Restart=always
User=www-data

[Install]
WantedBy=multi-user.target
```

Habilítalo e inícialo:

```bash
sudo systemctl enable iptv-stream.service
sudo systemctl start iptv-stream.service
```

Para monitorizar, puedes usar `journalctl -u iptv-stream -f` o integrar un script que reinicie el servicio si detecta que el archivo `m3u8` está desactualizado.

## Conclusión

Con FFmpeg, HLS y Nginx tienes una infraestructura IPTV funcional, estable y sin costes de licencia. Es ideal para distribuir señal en redes locales, probar conceptos o incluso como base para un servicio más grande. Ajusta los parámetros según tu ancho de banda y hardware, y tendrás un sistema que aguanta el día a día sin complicaciones.
