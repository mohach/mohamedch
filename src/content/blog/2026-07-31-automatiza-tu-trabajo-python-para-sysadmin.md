---
title: "Automatiza tu trabajo: Python para Sysadmin"
excerpt: "Descubre cómo Python simplifica las tareas diarias del sysadmin: automatiza scripts, gestiona servidores y ahorra tiempo con ejemplos prácticos."
date: "2026-07-31"
lang: "es"
slug: "automatiza-tu-trabajo-python-para-sysadmin"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

## Introducción

Si administras servidores Linux, sabes que el tiempo es oro. Repetir tareas como limpiar logs, monitorizar disco o gestionar usuarios es un gasto innecesario de horas. Python, con su sintaxis clara y su enorme biblioteca estándar, se ha convertido en mi navaja suiza para automatizar estas rutinas. No necesitas ser un programador experto; con unos pocos scripts bien planteados puedes recuperar el control de tu infraestructura.

## ## Gestión de logs: rotación y limpieza proactiva

El clásico problema de los logs que llenan el disco. Un script simple que borre archivos con más de X días es fácil, pero podemos ser más inteligentes: comprimir los antiguos y solo eliminar los que superen un tamaño total. Aquí tienes un ejemplo práctico:

```python
#!/usr/bin/env python3
import os, time, glob

LOG_DIR = "/var/log/myapp"
MAX_AGE_DAYS = 30
MAX_TOTAL_SIZE_MB = 500

now = time.time()
total_size = 0

for file_path in glob.glob(f"{LOG_DIR}/*.log"):
    stat = os.stat(file_path)
    total_size += stat.st_size
    # Elimina logs más antiguos que el límite
    if (now - stat.st_mtime) / 86400 > MAX_AGE_DAYS:
        os.remove(file_path)
        print(f"Eliminado: {file_path}")

# Si el total excede el límite, borra los más antiguos primero
if total_size / (1024 * 1024) > MAX_TOTAL_SIZE_MB:
    files = sorted(glob.glob(f"{LOG_DIR}/*.log"), key=os.path.getmtime)
    for f in files:
        if total_size / (1024 * 1024) <= MAX_TOTAL_SIZE_MB:
            break
        total_size -= os.path.getsize(f)
        os.remove(f)
        print(f"Limpieza por tamaño: {f}")
```

Puedes ejecutarlo con `cron` diariamente. Es robusto y no depende de herramientas externas como `logrotate`, que a veces no cubre todos los casos.

## ## Monitorización de recursos y alertas por correo

Detectar problemas antes de que el usuario lo haga es la clave del buen sysadmin. Este script comprueba el uso de disco y RAM, y si supera un umbral, envía un correo de alerta. Combinado con un `cron` cada 5 minutos, es un vigilante silencioso:

```python
#!/usr/bin/env python3
import shutil, smtplib, socket
from email.mime.text import MIMEText

THRESHOLD = 85  # Porcentaje de disco
hostname = socket.gethostname()

def check_disk():
    usage = shutil.disk_usage("/")
    percent = (usage.used / usage.total) * 100
    if percent > THRESHOLD:
        msg = MIMEText(f"Alerta: Disco al {percent:.1f}% en {hostname}")
        msg["Subject"] = f"[ALERTA] Disco lleno en {hostname}"
        msg["From"] = "sysadmin@tudominio.com"
        msg["To"] = "tu@correo.com"
        # Configura tu servidor SMTP (ejemplo con localhost)
        with smtplib.SMTP("localhost") as s:
            s.send_message(msg)
        print("Alerta enviada")
    else:
        print(f"Disco OK: {percent:.1f}%")

if __name__ == "__main__":
    check_disk()
```

Puedes ampliarlo fácilmente con `psutil` para monitorizar CPU o procesos concretos.

## ## Gestión de usuarios y claves SSH

Crear o desactivar usuarios manualmente es tedioso y propenso a errores. Con Python y el módulo `subprocess` podemos envolver los comandos del sistema de forma segura. Este ejemplo crea un usuario y añade su clave pública:

```python
#!/usr/bin/env python3
import subprocess, sys, os

def crear_usuario(username, public_key):
    # Crear usuario sin contraseña (bloqueado)
    subprocess.run(["useradd", "-m", "-s", "/bin/bash", username], check=True)
    # Crear directorio .ssh
    ssh_dir = f"/home/{username}/.ssh"
    os.makedirs(ssh_dir, exist_ok=True)
    # Añadir clave pública
    with open(f"{ssh_dir}/authorized_keys", "w") as f:
        f.write(public_key + "\n")
    subprocess.run(["chown", "-R", f"{username}:{username}", ssh_dir])
    subprocess.run(["chmod", "700", ssh_dir])
    subprocess.run(["chmod", "600", f"{ssh_dir}/authorized_keys"])
    print(f"Usuario {username} creado correctamente")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Uso: crea_usuario.py <nombre> <ruta_clave.pub>")
        sys.exit(1)
    with open(sys.argv[2]) as f:
        key = f.read().strip()
    crear_usuario(sys.argv[1], key)
```

Siempre usa `check=True` para que el script falle si el comando no se ejecuta bien, y valida las entradas para evitar inyecciones.

## ## Backup incremental de directorios críticos

Un backup completo diario consume mucho espacio. Con `tarfile` podemos hacer un backup incremental basado en la fecha de modificación. Es una alternativa ligera a herramientas más complejas:

```python
#!/usr/bin/env python3
import tarfile, os, time, glob

BACKUP_DIR = "/backups"
SOURCE_DIR = "/etc"
BACKUP_NAME = f"etc_backup_{time.strftime('%Y%m%d_%H%M')}.tar.gz"
# Solo archivos modificados en las últimas 24 horas
cutoff = time.time() - 86400

with tarfile.open(f"{BACKUP_DIR}/{BACKUP_NAME}", "w:gz") as tar:
    for
