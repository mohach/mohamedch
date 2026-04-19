---
title: "Monta tu IPTV con FFmpeg y HLS"
excerpt: "Aprende a crear tu propio servidor IPTV usando FFmpeg y el protocolo HLS para streaming de vídeo."
date: "2026-04-19"
lang: "es"
slug: "monta-tu-iptv-con-ffmpeg-y-hls"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Montar tu propia infraestructura IPTV te da control total sobre tus flujos de vídeo. Con herramientas como FFmpeg y el protocolo HLS, puedes crear un sistema robusto para emitir contenido en tiempo real o bajo demanda de forma accesible y eficiente.

## Requisitos previos y concepto básico

Necesitarás un servidor Linux (Ubuntu/Debian es ideal) con buena conectividad de red y FFmpeg instalado. El concepto es sencillo: FFmpeg recibe una fuente de vídeo (un archivo, una señal de una tarjeta capturadora o un flujo de red como RTMP), la transcodifica a las resoluciones y bitrates deseados, y empaqueta el resultado en segmentos de vídeo (.ts) y listas de reproducción (.m3u8) compatibles con HLS. Estos archivos se sirven a través de un servidor web común (como Nginx) para que los clientes los consuman.

## Instalación y configuración de FFmpeg

Primero, instala FFmpeg con soporte completo en tu servidor:
```bash
sudo apt update
sudo apt install ffmpeg
```
Verifica la instalación con `ffmpeg -version`. Para un flujo básico, necesitarás conocer los parámetros clave de codificación. Un buen punto de partida es usar el codec `libx264` para vídeo y `aac` para audio, que ofrecen una gran compatibilidad.

## Comando FFmpeg para generar HLS en tiempo real

Imagina que quieres emitir un archivo de vídeo local (`entrada.mp4`) como un canal de IPTV en vivo, generando dos calidades. El comando sería similar a este:

```bash
ffmpeg -re -i entrada.mp4 \
-map 0:v:0 -map 0:a:0 \
-c:v libx264 -crf 23 -preset veryfast -g 50 -sc_threshold 0 \
-b:v:0 2500k -maxrate:0 2500k -bufsize:0 5000k \
-filter:v:0 "scale=-2:720" \
-c:a aac -b:a 128k \
-f hls \
-hls_time 4 \
-hls_playlist_type event \
-hls_segment_filename "stream_720p_%03d.ts" \
-master_pl_name "master.m3u8" \
-var_stream_map "v:0,a:0,name:720p" stream_720p.m3u8
```

Explicación rápida:
* `-re`: Lee la entrada a velocidad real (simula una emisión en directo).
* `-map`: Selecciona las pistas de vídeo y audio.
* `-c:v` / `-c:a`: Define los codecs.
* `-b:v:0` y `filter:v:0`: Establecen el bitrate y escalan a 720p para esta variante.
* `-f hls`: Formato de salida HLS.
* `-hls_time 4`: Duración de cada segmento (.ts) en segundos.
* `-master_pl_name`: Crea una lista maestra (útil para múltiples calidades).

Los archivos de salida (`.ts` y `.m3u8`) se generan en el directorio de trabajo.

## Servir los archivos y consumir el stream

Coloca todos los archivos generados (`*.ts`, `*.m3u8`) en el directorio de un servidor web, por ejemplo, `/var/www/html/stream/`. Asegúrate de que Nginx o Apache estén correctamente configurados para servir archivos con las extensiones `.m3u8` (tipo MIME `application/vnd.apple.mpegurl`) y `.ts` (tipo MIME `video/MP2T`).

Los usuarios finales podrán abrir el enlace a la lista de reproducción en cualquier reproductor compatible con HLS (VLC, MPV, apps en móviles) o usar un frontend IPTV como Tivimate introduciendo la URL: `http://tudominio.com/stream/master.m3u8`.

Con estos pasos tendrás un canal de IPTV funcional. El sistema es escalable: puedes añadir más calidades al `-var_stream_map`, implementar DVR con `-hls_flags append_list`, o usar un origen de vídeo real (como `-i rtsp://camara_ip`) para una emisión genuinamente en vivo.
