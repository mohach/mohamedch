---
title: "Python scripting: automatiza tareas de sysadmin"
excerpt: "Aprende a automatizar tareas de sysadmin con Python scripting: scripts prácticos para gestión de servidores, redes y más."
date: "2026-06-01"
lang: "es"
slug: "python-scripting-automatiza-tareas-de-sysadmin"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Cuando trabajamos como administradores de sistemas, la repetición de tareas como la limpieza de logs, la monitorización de discos o la gestión de usuarios puede consumir horas. Python se ha convertido en mi navaja suiza para automatizar estas rutinas, gracias a su sintaxis clara y a bibliotecas como `os`, `shutil` y `subprocess`. En este artículo comparto algunos scripts prácticos que uso a diario en servidores Linux.

## Monitorización de espacio en disco con alertas

Uno de los problemas más comunes es quedarse sin espacio en particiones críticas. Este script recorre los puntos de montaje y envía una alerta si el uso supera el 80%.

```python
import shutil
import smtplib

def check_disk_usage(threshold=80):
    partitions = shutil.disk_usage('/')
    percent = (partitions.used / partitions.total) * 100
    if percent > threshold:
        print(f"ALERTA: Disco al {percent:.2f}%")
        # Aquí iría el envío de correo o notificación

check_disk_usage()
```

Lo ejecuto con un cron cada hora: `0 * * * * /usr/bin/python3 /scripts/check_disk.py`

## Limpieza automática de logs antiguos

Los logs de aplicaciones como Nginx o Apache pueden llenar el disco rápidamente. Este script elimina archivos con más de 30 días de antigüedad en directorios específicos.

```python
import os
import time
from pathlib import Path

def clean_old_logs(directory, days=30):
    now = time.time()
    cutoff = now - (days * 86400)
    for file in Path(directory).glob('*.log*'):
        if file.stat().st_mtime < cutoff:
            file.unlink()
            print(f"Eliminado: {file}")

clean_old_logs('/var/log/nginx')
clean_old_logs('/var/log/apache2')
```

Lo integro en un script mayor que también comprime logs recientes con `gzip` antes de eliminarlos.

## Gestión masiva de usuarios desde CSV

Cuando hay que dar de alta a 20 usuarios en un servidor, hacerlo manualmente es un error. Este script lee un archivo CSV con nombres de usuario y grupos, y crea las cuentas automáticamente.

```python
import csv
import subprocess

def create_users(csv_file):
    with open(csv_file, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            username = row['username']
            group = row['group']
            subprocess.run(['useradd', '-m', '-G', group, username])
            print(f"Usuario {username} creado en grupo {group}")

create_users('usuarios.csv')
```

Uso `subprocess.run` en lugar de `os.system` por seguridad y control de errores. Siempre verifico la salida con `check=True`.

## Copias de seguridad incrementales con rsync

Aunque `rsync` es potente por sí solo, un wrapper en Python permite añadir lógica condicional y registro de actividad.

```python
import subprocess
import datetime

def backup_web(source, dest):
    log_file = f"/var/log/backup_{datetime.date.today()}.log"
    cmd = ['rsync', '-avz', '--delete', source, dest]
    with open(log_file, 'w') as f:
        result = subprocess.run(cmd, stdout=f, stderr=subprocess.STDOUT)
    if result.returncode == 0:
        print(f"Backup completado: {log_file}")
    else:
        print(f"Error en backup. Revisa {log_file}")

backup_web('/var/www/html/', 'backup@servidor:/backups/web/')
```

Este script lo combino con un chequeo previo de conectividad mediante `ping` para evitar backups fallidos.

## Conclusión

Python no reemplaza a Bash para tareas muy sencillas, pero cuando necesitas lógica condicional, manejo de errores o integración con APIs, se convierte en la herramienta ideal. Empieza con estos ejemplos, adáptalos a tu infraestructura y verás cómo reduces horas de trabajo repetitivo. Recuerda probar siempre en un entorno de staging antes de ejecutarlos en producción.
