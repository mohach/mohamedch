---
title: "Guía práctica para depurar red en Linux paso a paso"
excerpt: "Guía práctica para depurar red en Linux paso a paso: comandos esenciales, diagnóstico de conexiones y solución de problemas reales."
date: "2026-06-27"
lang: "es"
slug: "guia-practica-para-depurar-red-en-linux-paso-a-paso"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Cuando algo falla en la red, el administrador Linux suele sentirse como un detective forense. No pasa nada: con las herramientas adecuadas y un enfoque metódico, puedes localizar y resolver la mayoría de incidencias sin volverte loco. Aquí tienes una guía práctica para depurar problemas de red en Linux paso a paso.

## 1. Verificar conectividad básica con `ping` y `traceroute`

Lo primero es confirmar si el equipo tiene conectividad con el exterior o con otros dispositivos de la red. Usa `ping` para probar un host conocido:

```bash
ping -c 4 8.8.8.8
```

Si no obtienes respuesta, el problema está en la capa de red o inferior. Si el ping a IPs funciona pero falla con nombres de dominio, el problema es de DNS. Para ver la ruta que siguen los paquetes:

```bash
traceroute -n 8.8.8.8
```

Si ves asteriscos o saltos que no responden desde tu gateway, probablemente haya un cortafuegos o un router mal configurado.

## 2. Revisar configuración IP y tabla de rutas con `ip`

El comando `ip` ha reemplazado a `ifconfig` y `route`. Para ver tus interfaces y direcciones IP:

```bash
ip addr show
```

¿Tu interfaz tiene una IP válida? Si ves `169.254.x.x`, no has recibido IP del DHCP. Para renovar la concesión:

```bash
sudo dhclient -v eth0
```

Ahora revisa la tabla de rutas:

```bash
ip route show
```

Debe aparecer una ruta por defecto (default via ...). Sin ella, no podrás salir a Internet. Si falta, añádela:

```bash
sudo ip route add default via 192.168.1.1 dev eth0
```

## 3. Diagnosticar resolución DNS con `dig` y `nslookup`

Un problema muy común es que el DNS no funcione bien. Comprueba qué servidores DNS tienes configurados:

```bash
cat /etc/resolv.conf
```

Prueba la resolución directamente contra un servidor público:

```bash
dig @8.8.8.8 google.com
```

Si no responde, revisa que no haya un cortafuegos bloqueando el puerto 53 (UDP). También puedes probar con `nslookup`:

```bash
nslookup google.com
```

Si la resolución falla, edita `/etc/resolv.conf` o, mejor, revisa la configuración de tu gestor de red (NetworkManager o systemd-resolved).

## 4. Analizar tráfico y puertos con `tcpdump` y `netstat`

Cuando el problema es más fino (una aplicación no se conecta, un puerto está cerrado), necesitas mirar más allá. Para ver qué puertos están escuchando en tu máquina:

```bash
sudo netstat -tulpn | grep LISTEN
```

Si esperas que un servicio esté en el puerto 80 y no aparece, el servicio no está corriendo. Para capturar tráfico en tiempo real:

```bash
sudo tcpdump -i eth0 -n port 80
```

Esto te muestra los paquetes que entran y salen por el puerto 80. Si ves paquetes SYN enviados pero no SYN-ACK recibidos, el destino está bloqueando o caído.

## Conclusión

Depurar red en Linux es cuestión de seguir una secuencia lógica: conectividad, configuración IP, rutas, DNS y por último tráfico a nivel de aplicación. Con estos comandos y un poco de paciencia, resolverás el 90% de los incidentes cotidianos. Guarda esta guía, que siempre vuelve a hacer falta.
