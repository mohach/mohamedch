---
title: "Copias de seguridad automáticas en Linux con rsync y cron"
excerpt: "Aprende a configurar copias de seguridad automáticas en Linux usando rsync y cron para proteger tus datos de forma eficiente y sin complicaciones."
date: "2026-05-07"
lang: "es"
slug: "copias-de-seguridad-automaticas-en-linux-con-rsync-y-cron"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Si estás leyendo esto, seguramente ya sabes que perder datos no es una opción. En Linux, la combinación de `rsync` y `cron` te permite montar un sistema de copias de seguridad automáticas, eficientes y sin depender de software de terceros. Te explico cómo hacerlo paso a paso, con comandos reales que uso en mi día a día.

## ¿Por qué rsync y cron?

`rsync` es una herramienta de sincronización de archivos que solo transfiere las diferencias entre el origen y el destino. Esto la hace rapidísima para copias incrementales. Por su parte, `cron` es el programador de tareas de Linux. Juntos, forman un dúo imbatible para automatizar backups sin complicaciones.

## Configuración básica de rsync

El comando básico para una copia local sería:

```bash
rsync -avh --delete /ruta/origen/ /ruta/destino/
```

- `-a`: modo archivo (preserva permisos, propietarios, etc.)
- `-v`: verbose (muestra lo que hace)
- `-h`: legible para humanos
- `--delete`: elimina en destino los archivos que ya no están en origen

Para copias remotas a través de SSH (muy útil si tienes un servidor en casa o en la nube):

```bash
rsync -avhz --delete -e ssh /ruta/origen/ usuario@servidor:/ruta/destino/
```

Si quieres excluir carpetas temporales o innecesarias, añade `--exclude`:

```bash
rsync -avh --delete --exclude='.cache' --exclude='node_modules' /ruta/origen/ /ruta/destino/
```

## Automatizando con cron

Primero, escribe un script sencillo. Crea un archivo, por ejemplo `~/scripts/backup.sh`:

```bash
#!/bin/bash
rsync -avh --delete /home/usuario/Documentos/ /mnt/disco_externo/Backups/
```

Hazlo ejecutable:

```bash
chmod +x ~/scripts/backup.sh
```

Ahora, abre tu crontab con:

```bash
crontab -e
```

Y añade una línea como esta para ejecutar el script cada día a las 3 de la madrugada:

```
0 3 * * * /home/usuario/scripts/backup.sh
```

Los cinco campos son: minuto, hora, día del mes, mes, día de la semana. Algunos ejemplos prácticos:

- Cada hora: `0 * * * *`
- Cada domingo a las 2: `0 2 * * 0`
- Cada 15 minutos: `*/15 * * * *`

## Trucos prácticos para evitar sustos

1. **Registra lo que pasa**: Añade logging a tu script para detectar fallos:
   ```bash
   rsync -avh --delete /origen/ /destino/ >> ~/logs/backup.log 2>&1
   ```

2. **Notificaciones**: Si algo sale mal, que te avise. Puedes añadir al final del script:
   ```bash
   if [ $? -ne 0 ]; then
       echo "Error en backup del $(date)" | mail -s "Fallo backup" tu@email.com
   fi
   ```

3. **Prueba antes de automatizar**: Ejecuta el comando manualmente primero. Un `rsync` mal configurado puede borrar datos si pones mal las rutas. Siempre revisa que `--delete` esté apuntando al destino correcto.

4. **Cifrado opcional**: Si el backup va a un servidor remoto, considera usar `rsync` sobre SSH con claves, o añadir cifrado con `gpg` para datos sensibles.

## Conclusión

Con `rsync` y `cron` tienes un sistema de backups automáticos, ligero y fiable, sin necesidad de instalar nada extra. Dedica 10 minutos a configurarlo y olvídate de perder datos por descuido. Yo lo uso para mis proyectos personales y servidores, y te aseguro que no hay vuelta atrás.
