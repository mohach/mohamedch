---
title: "Cómo asegurar un servidor SSH en Ubuntu paso a paso"
excerpt: "Aprende paso a paso a proteger tu servidor SSH en Ubuntu con medidas clave contra accesos no autorizados y ataques externos."
date: "2026-06-29"
lang: "es"
slug: "como-asegurar-un-servidor-ssh-en-ubuntu-paso-a-paso"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

La seguridad de SSH es uno de los primeros pasos que cualquier administrador debe abordar al montar un servidor Ubuntu. Un servicio SSH mal configurado es una puerta abierta a ataques de fuerza bruta y accesos no autorizados. Aquí te dejo una guía práctica y directa para blindarlo.

## Cambiar el puerto por defecto y deshabilitar root login

El puerto 22 es el primero que escanean los bots. Cambiarlo reduce el ruido de ataques automáticos. Edita el archivo de configuración:

```bash
sudo nano /etc/ssh/sshd_config
```

Busca y modifica estas líneas:

```
Port 2222
PermitRootLogin no
```

Elige un puerto alto (por ejemplo, 2222, 9022 o 10022). Luego, reinicia el servicio:

```bash
sudo systemctl restart sshd
```

No olvides abrir ese puerto en tu firewall si usas UFW:

```bash
sudo ufw allow 2222/tcp
```

## Usar autenticación con clave pública y deshabilitar contraseñas

Las contraseñas son vulnerables a fuerza bruta. La autenticación por clave RSA/Ed25519 es mucho más segura. En tu máquina local genera un par de claves:

```bash
ssh-keygen -t ed25519 -a 100
```

Luego copia la clave pública al servidor:

```bash
ssh-copy-id -p 2222 usuario@tu-servidor
```

Una vez confirmes que puedes acceder sin contraseña, deshabilita el login por contraseña en `/etc/ssh/sshd_config`:

```
PasswordAuthentication no
ChallengeResponseAuthentication no
```

Reinicia SSH y prueba la conexión antes de cerrar la sesión actual.

## Limitar usuarios y usar AllowUsers

Para mayor control, restringe qué usuarios pueden conectarse por SSH. En el mismo archivo de configuración añade:

```
AllowUsers usuario1 usuario2
```

Si solo necesitas acceso para un usuario, ponlo directamente. También puedes usar grupos con `AllowGroups`. Esto evita que cuentas del sistema o invitados tengan acceso SSH aunque tengan contraseña.

## Configurar autenticación en dos pasos (2FA) con Google Authenticator

Para un nivel adicional de seguridad, añade un código temporal. Instala el paquete:

```bash
sudo apt install libpam-google-authenticator
```

Ejecuta la configuración para tu usuario:

```bash
google-authenticator
```

Sigue las instrucciones en pantalla: escanea el código QR con tu app de autenticación y guarda los códigos de respaldo. Luego edita `/etc/pam.d/sshd` y añade al inicio:

```
auth required pam_google_authenticator.so
```

Finalmente, en `/etc/ssh/sshd_config` cambia:

```
ChallengeResponseAuthentication yes
```

Y añade al final:

```
AuthenticationMethods publickey,keyboard-interactive
```

Reinicia SSH. Ahora necesitarás tu clave privada y el código 2FA para conectarte.

## Conclusión

Asegurar SSH no lleva más de 10 minutos y marca una gran diferencia. Cambiar el puerto, usar claves, limitar usuarios y añadir 2FA son medidas sencillas pero efectivas. Aplica estos pasos y tu servidor Ubuntu estará mucho más protegido frente a accesos no deseados.
