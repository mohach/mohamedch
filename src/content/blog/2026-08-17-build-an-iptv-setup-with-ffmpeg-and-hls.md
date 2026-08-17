---
title: "Build an IPTV Setup with FFmpeg and HLS"
excerpt: "Learn to build a complete IPTV setup using FFmpeg and HLS, covering live stream transcoding, segmenting, and playlist generation for multi-device playback."
date: "2026-08-17"
lang: "en"
slug: "build-an-iptv-setup-with-ffmpeg-and-hls"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

When it comes to delivering live video to multiple devices, IPTV infrastructure often sounds like it requires expensive, proprietary hardware. The truth is, with a solid understanding of FFmpeg and the HLS (HTTP Live Streaming) protocol, you can build a robust, scalable streaming pipeline using only open-source tools. I have used this exact setup in production environments to handle live channels and event streams without breaking the bank.

## Understanding the Core Pipeline

The architecture is simpler than you might think. You have a **source** (a satellite feed, an IP camera, or a remote stream), a **transcoder** (FFmpeg), and a **web server** (Nginx or Apache) to distribute the HLS segments. The magic of HLS is that it breaks your continuous stream into small, 2-6 second `.ts` files and an index file (`.m3u8`) that tells the player which segments to fetch next.

## Step 1: Ingesting and Transcoding with FFmpeg

The first challenge is getting the source into a clean, uniform format. Most IPTV sources are either UDP multicast or RTMP. Here is a reliable FFmpeg command to pull a UDP multicast feed and prepare it for HLS:

```bash
ffmpeg -i udp://@239.1.1.1:1234 \
  -c:v libx264 -preset veryfast -tune zerolatency \
  -b:v 2500k -maxrate 2500k -bufsize 5000k \
  -c:a aac -b:a 128k -ac 2 \
  -f hls -hls_time 4 -hls_list_size 10 \
  -hls_flags delete_segments+append_list \
  /var/www/hls/channel1/playlist.m3u8
```

**Key flags explained:**
- `-hls_time 4`: Creates a new segment every 4 seconds.
- `-hls_list_size 10`: Keeps only the last 10 segments in the playlist (40 seconds of "live" window).
- `-hls_flags delete_segments`: Automatically removes old `.ts` files to prevent disk overflow.
- `-preset veryfast`: Balances CPU load and compression efficiency.

If your source is an RTMP stream (e.g., from OBS), simply replace the input with `-i rtmp://localhost/live/input`.

## Step 2: Serving the Stream with Nginx

FFmpeg handles the heavy lifting, but you need a web server to serve those files. Nginx is perfect for this due to its low memory footprint and high concurrency. Create a simple location block:

```nginx
server {
    listen 8080;
    root /var/www/hls;

    location /hls {
        types {
            application/vnd.apple.mpegurl m3u8;
            video/mp2t ts;
        }
        add_header Cache-Control no-cache;
        add_header Access-Control-Allow-Origin *;
    }
}
```

The `Access-Control-Allow-Origin` header is crucial if you plan to embed the player in a web page from a different domain.

## Step 3: Automating Restart with a Systemd Service

A stream encoder will eventually crash or hang. You don't want to manually restart it at 3 AM. Create a systemd service file (`/etc/systemd/system/channel1.service`):

```ini
[Unit]
Description=HLS Transcoder Channel 1
After=network.target

[Service]
ExecStart=/usr/bin/ffmpeg -i udp://@239.1.1.1:1234 -c:v libx264 -preset veryfast -tune zerolatency -b:v 2500k -f hls -hls_time 4 -hls_list_size 10 -hls_flags delete_segments /var/www/hls/channel1/playlist.m3u8
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Enable it with `systemctl enable --now channel1.service`. For multiple channels, just duplicate the service file and adjust the input and output paths.

## Conclusion

This stack—FFmpeg for encoding, HLS for packaging, and Nginx for delivery—is battle-tested and can handle hundreds of concurrent viewers with modest hardware. The key is tuning your segment size and bitrate to match your target audience's bandwidth. Start with one channel, monitor your CPU usage, and scale horizontally by adding more Nginx nodes or a CDN in front when you outgrow a single server. It is not magic; it is just cleverly applied standard tools.
