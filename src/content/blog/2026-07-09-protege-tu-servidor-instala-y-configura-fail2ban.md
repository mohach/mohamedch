---
title: "Protege tu servidor: instala y configura Fail2ban"
excerpt: "Aprende a instalar y configurar Fail2ban para proteger tu servidor Linux contra ataques de fuerza bruta y accesos no autorizados."
date: "2026-07-09"
lang: "es"
slug: "protege-tu-servidor-instala-y-configura-fail2ban"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Si gestionas un servidor Linux, sabes que los intentos de acceso no autorizado son constantes. Fail2ban es una herramienta esencial que analiza logs del sistema y bloquea direcciones IP tras detectar comportamientos sospechosos, como múltiples intentos fallidos de SSH o WordPress. En esta guía práctica te mostraré cómo instalarlo y configurarlo para reforzar la seguridad de tu servidor.

## Instalación de Fail2ban

En la mayoría de distribuciones basadas en Debian/Ubuntu, la instalación es directa desde los repositorios oficiales:

```bash
sudo apt update
sudo apt install fail2ban -y
```

Para sistemas CentOS/RHEL/Fedora:

```bash
sudo dnf install epel-release -y
sudo dnf install fail2ban -y
```

Una vez instalado, habilitamos el servicio para que arranque con el sistema:

```bash
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

Verifica que está activo con `sudo systemctl status fail2ban`.

## Configuración básica: proteger SSH

Fail2ban trabaja con archivos de configuración en `/etc/fail2ban/`. La configuración principal está en `jail.conf`, pero **nunca edites ese archivo directamente**, ya que se sobrescribe con cada actualización. En su lugar, crea un archivo `jail.local` que sobrescribe las opciones:

```bash
sudo nano /etc/fail2ban/jail.local
```

Añade esta configuración básica para proteger SSH:

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = ssh
logpath = %(sshd_log)s
```

Explicación:
- `bantime`: tiempo de bloqueo en segundos (3600 = 1 hora).
- `findtime`: ventana de tiempo en segundos donde se cuentan los intentos.
- `maxretry`: número de fallos permitidos antes del bloqueo.

Guarda el archivo y reinicia Fail2ban:

```bash
sudo systemctl restart fail2ban
```

## Proteger WordPress de ataques de fuerza bruta

Si tienes WordPress, los ataques al `wp-login.php` son pan de cada día. Fail2ban puede bloquearlos fácilmente. Primero, crea un filtro personalizado:

```bash
sudo nano /etc/fail2ban/filter.d/wordpress.conf
```

Pega esto:

```ini
[Definition]
failregex = ^<HOST> .* "POST /wp-login.php HTTP/.*" 200
ignoreregex =
```

Ahora añade la jail en `jail.local`:

```ini
[wordpress]
enabled = true
port = http,https
filter = wordpress
logpath = /var/log/apache2/access.log
maxretry = 5
bantime = 3600
```

Si usas Nginx, cambia `logpath` por `/var/log/nginx/access.log`. Reinicia Fail2ban y la protección estará activa.

## Monitoreo y gestión de baneos

Para ver el estado de las jails activas:

```bash
sudo fail2ban-client status
```

Para ver detalles de una jail específica (por ejemplo, SSH):

```bash
sudo fail2ban-client status sshd
```

Si necesitas desbloquear manualmente una IP:

```bash
sudo fail2ban-client set sshd unbanip 192.168.1.100
```

Y para comprobar si una IP está baneada:

```bash
sudo fail2ban-client status sshd | grep "Banned IP list"
```

## Conclusión

Fail2ban es una herramienta ligera pero potentísima que, con una configuración mínima, puede ahorrarte muchos dolores de cabeza. Te recomiendo empezar protegiendo SSH y WordPress, y luego explorar jails adicionales para servicios como vsftpd, Postfix o Nginx. Recuerda siempre probar los cambios en un entorno de pruebas antes de aplicarlos en producción. La seguridad de tu servidor te lo agradecerá.
