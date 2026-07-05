---
title: "Copias de seguridad en Linux con rsync y cron"
excerpt: "Aprende a automatizar copias de seguridad en Linux usando rsync y cron con ejemplos prácticos y comandos listos para usar."
date: "2026-07-05"
lang: "es"
slug: "copias-de-seguridad-en-linux-con-rsync-y-cron"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Si estás leyendo esto, seguramente ya sabes que perder datos no es una opción. En Linux, hacer copias de seguridad automáticas es más sencillo de lo que parece combinando `rsync` con `cron`. Te voy a mostrar cómo montar un sistema fiable para proteger tus archivos sin tener que acordarte de hacerlo manualmente.

## ¿Por qué rsync y cron?

`rsync` es una herramienta increíblemente eficiente para sincronizar archivos y directorios. Solo transfiere las diferencias, lo que ahorra tiempo y ancho de banda. Por otro lado, `cron` es el clásico programador de tareas de Linux. Juntos forman un dúo imbatible: `rsync` hace el trabajo pesado y `cron` se encarga de que se ejecute cuando tú quieras.

## Configuración básica de rsync

Lo primero es tener claro qué quieres copiar y dónde. Un ejemplo típico sería respaldar tu directorio personal en un disco externo o en un servidor remoto.

Para una copia local, el comando básico es:

```bash
rsync -avh --delete /ruta/origen/ /ruta/destino/
```

Explicación rápida de las opciones:
- `-a`: modo archivo, preserva permisos, propietarios, etc.
- `-v`: verbose, para ver qué está pasando.
- `-h`: legible para humanos.
- `--delete`: elimina en el destino los archivos que ya no están en el origen. Útil para mantener una copia exacta.

Si quieres copiar a un servidor remoto por SSH:

```bash
rsync -avhz --delete /ruta/origen/ usuario@servidor:/ruta/destino/
```

La `z` añade compresión, ideal para conexiones lentas.

## Programar con cron

Ahora toca automatizar. Abre tu crontab con:

```bash
crontab -e
```

Aquí defines cuándo se ejecutará el comando. Por ejemplo, para una copia diaria a las 3 de la madrugada:

```
0 3 * * * rsync -avh --delete /home/tu_usuario/Documentos/ /mnt/disco_externo/Backups/
```

Si prefieres una copia remota, simplemente cambia la ruta de destino. No olvides configurar claves SSH para evitar tener que meter contraseñas.

## Buenas prácticas y consejos

Un par de detalles que marcan la diferencia:

- **Excluye lo innecesario**: usa `--exclude='*.tmp'` o crea un archivo con `--exclude-from=lista.txt` para ignorar carpetas como `.cache` o descargas temporales.
- **Registra lo que pasa**: añade `>> /var/log/backup.log 2>&1` al final del comando en cron. Así puedes revisar si todo fue bien.
- **Prueba antes de automatizar**: ejecuta el comando manualmente con `--dry-run` para simular la copia sin tocar nada.
- **Notificaciones**: si algo falla, que cron te envíe un correo. Asegúrate de tener un MTA configurado o usa scripts que envíen alertas.

## Conclusión

Con `rsync` y `cron` tienes un sistema de copias de seguridad automáticas potente, ligero y sin depender de software第三方. Dedica diez minutos a configurarlo y olvídate de sustos. Tus datos te lo agradecerán.
