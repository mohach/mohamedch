---
title: "Guía para optimizar el rendimiento de tu VPS en Hetzner"
excerpt: "Descubre cómo mejorar la velocidad y estabilidad de tu VPS en Hetzner con consejos prácticos de configuración, monitorización y ajustes del sistema."
date: "2026-07-13"
lang: "es"
slug: "guia-para-optimizar-el-rendimiento-de-tu-vps-en-hetzner"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Cuando contratas un VPS en Hetzner, te llevas una máquina con muy buena relación calidad-precio, pero como cualquier servidor en la nube, necesita un mínimo de cariño para exprimir su potencial. Sin una configuración inicial adecuada, esos recursos se quedan en nada. Aquí te cuento los pasos que aplico en mis despliegues para que tu VPS vuele.

## Configuración del sistema operativo y el kernel

Lo primero es elegir bien la imagen. En Hetzner, yo siempre opto por **Debian 12** o **Ubuntu 22.04 LTS** (minimal si es posible). Nada de paneles con bloatware. Una vez instalado, actualiza todo:
```bash
apt update && apt upgrade -y
```

Luego, instala herramientas básicas de monitorización y rendimiento:
```bash
apt install htop iotop sysstat curl wget -y
```

Un truco que me funciona: desactivar servicios innecesarios. Revisa con `systemctl list-units --type=service --state=running` y para lo que no uses (por ejemplo, `cups`, `avahi-daemon`), haz `systemctl disable --now nombre_servicio`.

## Ajustes de red y firewall

Hetzner te da un ancho de banda generoso, pero si no configuras bien la red, lo pierdes. Empieza por optimizar los parámetros del kernel. Edita `/etc/sysctl.conf` y añade:
```
net.core.rmem_max = 134217728
net.core.wmem_max = 134217728
net.ipv4.tcp_rmem = 4096 87380 134217728
net.ipv4.tcp_wmem = 4096 65536 134217728
net.ipv4.tcp_congestion_control = bbr
net.core.default_qdisc = fq
```
Aplica con `sysctl -p`. El algoritmo BBR es clave para conexiones rápidas y estables, sobre todo si sirves contenido web o streaming.

Luego, un firewall simple pero efectivo. Yo uso `ufw` por su sencillez:
```bash
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw enable
```

## Optimización del almacenamiento y la memoria

Hetzner monta discos NVMe en sus VPS, pero el sistema de archivos por defecto no siempre está optimizado. Asegúrate de que las particiones usen `noatime` en `/etc/fstab`. Por ejemplo:
```
/dev/sda1 / ext4 defaults,noatime,nodiratime 0 1
```
Esto evita escrituras innecesarias en cada lectura.

Para la memoria, configura una swap adecuada. Si tu VPS tiene 2 GB de RAM o menos, crea un archivo swap de 1-2 GB:
```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```
Ajusta el `swappiness` a 10 para que use RAM antes que swap: `sysctl vm.swappiness=10`.

## Monitorización y mantenimiento continuo

No vale con optimizar una vez y olvidarse. Instala `netdata` para tener métricas en tiempo real:
```bash
bash <(curl -Ss https://my-netdata.io/kickstart.sh)
```
Accede por `http://tu-ip:19999`. Te avisará si algo va mal (CPU al 90%, disco lleno, etc.).

Programa tareas de limpieza con cron. Por ejemplo, para logs viejos:
```bash
0 3 * * * find /var/log -name "*.log" -mtime +30 -delete
```

Y no olvides configurar backups automáticos. Hetzner ofrece snapshots desde su panel, pero un script con `rsync` a otro servidor o a un bucket S3 nunca está de más.

## Conclusión

Optimizar un VPS en Hetzner no es magia, es sentido común: sistema ligero, red afinada con BBR, almacenamiento sinatime y monitorización activa. Dedica una hora a estos ajustes y notarás la diferencia en carga de página, estabilidad y consumo de recursos. Tu servidor —y tus visitas— te lo agradecerán.
