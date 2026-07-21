---
title: "Cómo configurar Nginx reverse proxy con SSL y Let's Encrypt"
excerpt: "Aprende a configurar Nginx como proxy inverso con SSL y Let's Encrypt paso a paso, asegurando y optimizando tu servidor web."
date: "2026-07-21"
lang: "es"
slug: "como-configurar-nginx-reverse-proxy-con-ssl-y-lets-encrypt"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Si gestionas varios servicios web en un mismo servidor, sabrás que abrir múltiples puertos o lidiar con certificados por separado puede volverse un caos. Usar Nginx como proxy inverso no solo centraliza el tráfico, sino que además te permite añadir SSL de forma limpia con Let's Encrypt. Aquí te explico cómo hacerlo paso a paso en Ubuntu.

## Requisitos previos

Antes de empezar, necesitas tener:
- Un servidor Ubuntu (20.04 o 22.04) con Nginx instalado.
- Un dominio apuntando a la IP pública del servidor (por ejemplo, `servicio1.mohamedch.com`).
- Acceso root o sudo.
- Puerto 80 y 443 abiertos en el firewall.

Si no tienes Nginx, instálalo:

```bash
sudo apt update
sudo apt install nginx -y
```

## Configurar el proxy inverso básico

Vamos a crear un archivo de configuración para un servicio que corre, por ejemplo, en `localhost:3000`. Crea un archivo en `/etc/nginx/sites-available/`:

```bash
sudo nano /etc/nginx/sites-available/mi-servicio
```

Pega esto (ajusta el `server_name` y `proxy_pass` según tu caso):

```nginx
server {
    listen 80;
    server_name servicio1.mohamedch.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Habilita el sitio y recarga Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/mi-servicio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Prueba a acceder por HTTP. Si ves tu servicio, el proxy funciona.

## Añadir SSL con Let's Encrypt

Usaremos Certbot, la herramienta oficial de Let's Encrypt. Instálala:

```bash
sudo apt install certbot python3-certbot-nginx -y
```

Ejecuta Certbot para obtener el certificado automáticamente. El flag `--nginx` modifica la configuración por ti:

```bash
sudo certbot --nginx -d servicio1.mohamedch.com
```

Sigue el asistente: introduce tu email, acepta los términos y elige si redirigir HTTP a HTTPS (recomiendo que sí). Certbot se encargará de:
- Obtener el certificado.
- Modificar tu archivo de configuración para añadir el bloque `listen 443 ssl`.
- Configurar la renovación automática.

Para verificar que la renovación automática está activa:

```bash
sudo systemctl status certbot.timer
```

## Verificación y ajustes finales

Comprueba que tu sitio carga por HTTPS. Mira el archivo de configuración final, debería verse similar a esto:

```nginx
server {
    listen 443 ssl;
    server_name servicio1.mohamedch.com;

    ssl_certificate /etc/letsencrypt/live/servicio1.mohamedch.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/servicio1.mohamedch.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name servicio1.mohamedch.com;
    return 301 https://$server_name$request_uri;
}
```

Si tienes varios servicios, repite el proceso: crea un archivo por subdominio en `sites-available`, enlázalo, y ejecuta Certbot con `-d` para cada uno. Puedes incluso añadir varios dominios en un solo certificado: `sudo certbot --nginx -d servicio1.mohamedch.com -d servicio2.mohamedch.com`.

## Conclusión

Con Nginx como proxy inverso y Let's Encrypt, tienes una solución gratuita, segura y fácil de mantener. Centralizas el tráfico, los certificados se renuevan solos y cada servicio corre aislado en su puerto interno. Ideal para entornos de producción pequeños o medianos donde no quieres complicarte con configuraciones manuales de SSL.
