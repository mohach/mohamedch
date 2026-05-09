---
title: "Comandos Linux esenciales para todo técnico"
excerpt: "Domina los comandos Linux imprescindibles para diagnóstico, administración y resolución de incidencias en entornos reales de trabajo técnico."
date: "2026-05-09"
lang: "es"
slug: "comandos-linux-esenciales-para-todo-tecnico"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Como técnico, el día a día en la terminal puede marcar la diferencia entre resolver una incidencia en cinco minutos o perder una hora navegando por menús gráficos. Dominar una docena de comandos esenciales te da control total sobre el sistema, especialmente cuando trabajas sin interfaz gráfica o sobre SSH. Aquí van los que uso a diario.

## Diagnóstico rápido del sistema

Antes de tocar nada, hay que saber qué está pasando. `top` o `htop` son el primer vistazo, pero `htop` (si lo tienes instalado) es más amigable. Para ver carga media y procesos de un vistazo:

```bash
htop
```

Para memoria RAM y swap, nada como `free -h`. El `-h` humaniza las cifras:

```bash
free -h
```

Y para el disco duro, `df -h` te muestra la ocupación de las particiones. Si necesitas saber qué está ocupando espacio en una carpeta concreta, `du -sh *` dentro de ella es tu aliado:

```bash
du -sh /var/log/*
```

## Gestión de procesos y servicios

Cuando un servicio se cuelga o un proceso consume toda la CPU, hay que actuar rápido. `ps aux` te da una foto completa de los procesos. Para buscar uno concreto, encadénalo con `grep`:

```bash
ps aux | grep apache
```

Si necesitas matar un proceso por su PID, usa `kill -9 <PID>`. Para localizar el PID primero, `pgrep` te ahorra un paso:

```bash
kill -9 $(pgrep -f "nombre_del_proceso")
```

Con systemd, gestionar servicios es pan comido. Los comandos clave:

```bash
systemctl status apache2    # Ver estado
systemctl restart apache2   # Reiniciar
systemctl enable apache2    # Activar en arranque
journalctl -u apache2       # Ver logs del servicio
```

## Navegación, búsqueda y manipulación de archivos

Moverse por el sistema es básico, pero `find` es una navaja suiza. Buscar archivos por nombre, tamaño o fecha de modificación:

```bash
find /var -name "*.log" -mtime -7   # Archivos .log modificados en los últimos 7 días
```

Para buscar dentro del contenido de archivos, `grep` con `-r` (recursivo) es insustituible:

```bash
grep -r "error" /var/log/ --include="*.log"
```

Y para copiar o mover archivos entre equipos, `rsync` es mucho más eficiente que `scp` porque solo transfiere las diferencias:

```bash
rsync -avz --progress /carpeta/local/ usuario@servidor:/carpeta/remota/
```

## Red básica y conectividad

Cuando un cliente dice "no va internet", empiezo por aquí. `ping` para ver si hay conectividad básica, `traceroute` para ver la ruta, y `ss` para ver puertos abiertos:

```bash
ping -c 4 8.8.8.8
traceroute google.com
ss -tuln | grep LISTEN
```

Para resolver un nombre de dominio rápidamente, `dig` es más fiable que `nslookup`:

```bash
dig +short mohamedch.com
```

Y si necesitas saber qué proceso está usando un puerto concreto, `lsof` te lo dice:

```bash
lsof -i :80
```

## Conclusión

Estos comandos cubren el 90% de las incidencias que veo en el día a día. Con práctica, los acabas tecleando sin pensar. Mi consejo: ten siempre abierta una terminal y juega con ellos en un entorno de pruebas. La línea de comandos no muerde, y cuando dominas estos básicos, cualquier problema de sistema se vuelve manejable.
