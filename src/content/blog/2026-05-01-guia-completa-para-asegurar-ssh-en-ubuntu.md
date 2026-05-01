---
title: "Guía completa para asegurar SSH en Ubuntu"
excerpt: "Aprende a proteger tu servidor Ubuntu con esta guía completa para asegurar SSH: configuraciones, claves y buenas prácticas."
date: "2026-05-01"
lang: "es"
slug: "guia-completa-para-asegurar-ssh-en-ubuntu"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Asegurar un servidor SSH es una de las primeras tareas que cualquier administrador de sistemas debería realizar tras instalar Ubuntu. Por defecto, el servicio SSH viene con configuraciones poco restrictivas que pueden dejar la puerta abierta a ataques de fuerza bruta o accesos no deseados. A continuación, te muestro los pasos prácticos que sigo en mis propios servidores para reforzar la seguridad de SSH.

## Deshabilitar el acceso por contraseña y usar claves SSH

Lo primero es eliminar la autenticación por contraseña, que es vulnerable a ataques de diccionario. En su lugar, usaremos un par de claves pública/privada.

En tu máquina local, genera las claves si aún no las tienes:

```bash
ssh-keygen -t ed25519 -a 100
```

Copia la clave pública al servidor:

```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub usuario@tu-servidor
```

Ahora, edita el archivo de configuración SSH en el servidor (`/etc/ssh/sshd_config`) y cambia las siguientes líneas:

```
PasswordAuthentication no
PubkeyAuthentication yes
```

Reinicia el servicio para aplicar cambios:

```bash
sudo systemctl restart sshd
```

## Cambiar el puerto por defecto y restringir usuarios

El puerto 22 es el blanco favorito de los bots. Cambiarlo reduce drásticamente el ruido en los logs. Elige un puerto alto, por ejemplo el 2222.

Añade o modifica esta línea en `/etc/ssh/sshd_config`:

```
Port 2222
```

Además, limita qué usuarios pueden conectarse por SSH. Si solo necesitas acceso para `admin` y `backup`, añade:

```
AllowUsers admin backup
```

Si usas grupos, mejor:

```
AllowGroups ssh-users
```

Recuerda ajustar las reglas del firewall si usas `ufw`:

```bash
sudo ufw allow 2222/tcp
sudo ufw deny 22/tcp
sudo ufw reload
```

## Configurar autenticación de dos factores (opcional pero recomendado)

Si quieres una capa extra incluso con claves, instala Google Authenticator:

```bash
sudo apt install libpam-google-authenticator
```

Ejecuta el configurador para tu usuario:

```bash
google-authenticator
```

Sigue las instrucciones en pantalla y escanea el código QR con una app como Authy o Google Authenticator. Luego, edita `/etc/pam.d/sshd` y añade al principio:

```
auth required pam_google_authenticator.so
```

En `/etc/ssh/sshd_config`, cambia:

```
ChallengeResponseAuthentication yes
```

Y en la línea `AuthenticationMethods`, pon:

```
AuthenticationMethods publickey,keyboard-interactive
```

Reinicia SSH de nuevo. Ahora necesitarás tu clave SSH más el código de 6 dígitos para conectarte.

## Proteger contra fuerza bruta con fail2ban

Fail2ban analiza los logs de SSH y bloquea IPs tras varios intentos fallidos. Instálalo:

```bash
sudo apt install fail2ban
```

Crea una copia de la configuración por defecto:

```bash
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
```

Edita `jail.local` y busca la sección `[sshd]`. Actívala con:

```
[sshd]
enabled = true
port = 2222
maxretry = 3
bantime = 3600
```

Reinicia fail2ban:

```bash
sudo systemctl restart fail2ban
```

Puedes comprobar el estado con:

```bash
sudo fail2ban-client status sshd
```

## Conclusión

Con estos ajustes, tu servidor SSH quedará mucho más protegido frente a accesos no autorizados. La combinación de claves SSH, cambio de puerto, restricción de usuarios y fail2ban forma una base sólida que aplico en todos mis servidores Ubuntu. Dedica diez minutos a hacerlo y dormirás más tranquilo.
