---
title: "Automatiza backups y mantenimiento con Bash"
excerpt: "Aprende a crear scripts Bash para automatizar backups y tareas de mantenimiento en Linux, ahorrando tiempo y evitando errores."
date: "2026-06-03"
lang: "es"
slug: "automatiza-backups-y-mantenimiento-con-bash"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Si eres administrador de sistemas o simplemente quieres dormir tranquilo sabiendo que tus datos están a salvo, los scripts en Bash son la herramienta más directa y fiable que tienes a mano. En este artículo te muestro cómo automatizar backups y tareas de mantenimiento en servidores Linux, con ejemplos prácticos que llevo usando en mi día a día.

## Estructura básica de un script de backup

Lo primero es tener un script que empaquete y comprima los datos. Aquí tienes un ejemplo que uso para respaldar directorios críticos:

```bash
#!/bin/bash
BACKUP_DIR="/backups/servidor"
FECHA=$(date +%Y%m%d_%H%M)
ORIGEN="/var/www /etc /home"

mkdir -p "$BACKUP_DIR"
tar -czf "$BACKUP_DIR/backup_$FECHA.tar.gz" $ORIGEN
echo "Backup completado: $BACKUP_DIR/backup_$FECHA.tar.gz"
```

Recuerda dar permisos de ejecución con `chmod +x script.sh`. Este script crea un archivo comprimido con fecha y hora, lo que facilita la rotación y la búsqueda.

## Rotación automática y limpieza

No tiene sentido acumular backups de semanas enteras. Añade una función de limpieza para borrar los más antiguos:

```bash
DIAS=7
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$DIAS -delete
```

Si prefieres conservar solo los últimos N backups, puedes usar este enfoque:

```bash
MAX_BACKUPS=5
ls -1t "$BACKUP_DIR"/*.tar.gz | tail -n +$((MAX_BACKUPS + 1)) | xargs rm -f
```

La rotación evita que el disco se llene y mantiene un historial manejable.

## Mantenimiento del sistema integrado

Un buen script de mantenimiento puede incluir tareas periódicas como limpiar logs, actualizar paquetes o reiniciar servicios. Por ejemplo:

```bash
#!/bin/bash
# Limpiar logs antiguos
journalctl --vacuum-time=7d

# Actualizar paquetes (sin intervención)
apt update && apt upgrade -y

# Reiniciar servicios si es necesario
systemctl restart apache2

# Verificar espacio en disco
df -h | grep -E "^/dev/"
```

Puedes ejecutar esto semanalmente. Si trabajas con bases de datos MySQL o MariaDB, no olvides incluir un volcado:

```bash
mysqldump -u root -p'contraseña' --all-databases > /backups/bd_$FECHA.sql
```

## Automatización con cron y registro de logs

Para que todo funcione sin que te acuerdes, programa el script en cron:

```bash
crontab -e
# Añade esta línea para ejecutar cada día a las 2:00 AM
0 2 * * * /usr/local/bin/backup_total.sh >> /var/log/backup.log 2>&1
```

El redireccionamiento a un archivo de log te permite revisar si hubo errores. Además, recomiendo añadir notificaciones simples:

```bash
if [ $? -eq 0 ]; then
    echo "Backup OK" | mail -s "Backup servidor" tu@email.com
else
    echo "ERROR en backup" | mail -s "ALERTA backup" tu@email.com
fi
```

## Conclusión

Automatizar backups y mantenimiento con Bash no solo te ahorra tiempo, sino que elimina el error humano y te da visibilidad sobre el estado del sistema. Empieza con scripts pequeños, pruébalos en un entorno de pruebas y, cuando veas que funcionan, intégralos en cron. En mi experiencia, dedicar una hora a montar esto bien evita dolores de cabeza cuando menos te lo esperas.
