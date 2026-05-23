---
title: "Configura Nginx como proxy inverso con SSL y Let's Encrypt"
excerpt: "Aprende a configurar Nginx como proxy inverso con SSL gratuito de Let's Encrypt paso a paso, seguro y optimizado."
date: "2026-05-23"
lang: "es"
slug: "configura-nginx-como-proxy-inverso-con-ssl-y-lets-encrypt"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Si usas Nginx para servir aplicaciones web o APIs, sabes que exponer puertos directamente no es lo más elegante ni seguro. Un *reverse proxy* te permite redirigir tráfico hacia servicios internos (como Node.js, Python o Docker) usando un único punto de entrada. Y si encima lo blindas con SSL gratis vía Let’s Encrypt, tienes una configuración profesional en pocos minutos.

Vamos al grano: configurar Nginx como proxy inverso con certificados SSL automáticos en Ubuntu.

## Requisitos previos

Antes de empezar, asegúrate de tener:
- Un servidor Ubuntu 22.04 o 24.04 con Nginx instalado (`sudo apt install nginx`).
- Un dominio apuntando a la IP pública de tu servidor (ejemplo: `miapp.mohamedch.com`).
- Puertos 80 y 443 abiertos en el firewall (UFW: `sudo ufw allow 80/tcp && sudo ufw allow 443/tcp`).

## Configurar el sitio como proxy inverso

Crea un archivo de configuración para tu dominio en `/etc/nginx/sites-available/`:

```bash
sudo nano /etc/nginx/sites-available/miapp
```

Pega este bloque básico (ajusta `server_name` y `proxy_pass` a tu caso). Aquí redirigimos a un servicio local en el puerto 3000:

```nginx
server {
    listen 80;
    server_name miapp.mohamedch.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Habilita el sitio y prueba la sintaxis:

```bash
sudo ln -s /etc/nginx/sites-available/miapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Si tu servicio corre en `localhost:3000`, ya deberías verlo accediendo vía HTTP. Ahora toca el SSL.

## Instalar y configurar Certbot para SSL automático

Usaremos Certbot con el plugin de Nginx, que modifica la configuración automáticamente:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d miapp.mohamedch.com
```

Sigue el asistente: introduce tu email, acepta términos y elige si redirigir HTTP a HTTPS (recomiendo sí). Certbot hará lo siguiente:
- Obtendrá el certificado de Let’s Encrypt.
- Modificará el bloque `server` para añadir `listen 443 ssl` y las rutas a los archivos `.pem`.
- Añadirá un bloque `server` para redirigir HTTP a HTTPS si se lo pides.

Puedes verificar que la renovación automática funciona:

```bash
sudo certbot renew --dry-run
```

Si todo sale bien, tu sitio ya sirve contenido por HTTPS.

## Buenas prácticas y ajustes finales

Para que el proxy sea más robusto, añade estas cabeceras de seguridad dentro del bloque `location`:

```nginx
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
proxy_read_timeout 86400;
```

Si tu servicio usa WebSockets (por ejemplo, con Node.js o Django Channels), las dos primeras líneas son imprescindibles.

Además, puedes forzar HTTPS a nivel de Nginx añadiendo en el bloque `server` que escucha en el puerto 80:

```nginx
return 301 https://$server_name$request_uri;
```

Recuerda comprobar los logs si algo falla: `tail -f /var/log/nginx/error.log`.

## Conclusión

Con Nginx como proxy inverso y Let's Encrypt gestionado por Certbot, tienes una solución sólida, segura y gratuita para exponer tus aplicaciones. En apenas diez minutos has montado un sistema que escala, se renueva solo y te ahorra problemas de puertos y certificados caducados. Para entornos de producción, añade rate limiting y monitorización, pero esta base ya te cubre lo esencial.
