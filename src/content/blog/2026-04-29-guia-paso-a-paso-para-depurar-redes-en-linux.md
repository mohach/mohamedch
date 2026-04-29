---
title: "Guía paso a paso para depurar redes en Linux"
excerpt: "Aprende a diagnosticar problemas de red en Linux con esta guía práctica paso a paso usando comandos esenciales y herramientas de depuración."
date: "2026-04-29"
lang: "es"
slug: "guia-paso-a-paso-para-depurar-redes-en-linux"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Cuando algo falla en red, el primer impulso es reiniciar el router o dar palos de ciego con comandos. Pero en Linux, depurar problemas de red es cuestión de seguir un orden lógico. Aquí te dejo una guía paso a paso con comandos reales que uso a diario en mi trabajo como técnico en Alaquas.

## 1. Comprobar conectividad básica con `ping` y `traceroute`

El clásico `ping` sigue siendo la primera herramienta. No solo para ver si llegas a un host, sino para detectar pérdida de paquetes o latencia anómala.

```bash
ping -c 4 8.8.8.8
```

Si no hay respuesta, prueba con una IP de tu propia red (ej. `ping 192.168.1.1`). Si eso funciona pero lo externo falla, el problema está en el router o en la configuración de puerta de enlace.

Para ver el camino que siguen los paquetes:

```bash
traceroute -n 8.8.8.8
```

Si ves saltos con asteriscos o tiempos muy altos, ahí tienes el cuello de botella.

## 2. Revisar configuración IP y tabla de rutas

Un error típico es tener una IP mal asignada o una puerta de enlace incorrecta. Usa estos comandos para verificar:

```bash
ip addr show
ip route show
```

La salida de `ip route` debe mostrar una línea como `default via 192.168.1.1 dev wlp2s0`. Si no aparece, añádela con:

```bash
sudo ip route add default via 192.168.1.1
```

También comprueba el DNS con `resolvectl status` o `cat /etc/resolv.conf`. Un fallo común es que el servidor DNS no responda. Prueba con `nslookup google.com` o `dig google.com`.

## 3. Diagnosticar con `ss`, `nmap` y logs del sistema

Si el problema es que un servicio no responde, mira qué puertos están escuchando:

```bash
ss -tlnp
```

Para ver conexiones activas en tiempo real, añade `-u` para UDP. Si sospechas de un cortafuegos, comprueba las reglas de `iptables` o `nftables`:

```bash
sudo iptables -L -n -v
```

A veces el firewall local bloquea todo. Un `sudo iptables -F` (cuidado, borra todas las reglas) puede ser la prueba definitiva.

Los logs del sistema son oro puro:

```bash
sudo journalctl -xe | grep -i network
```

O directamente el log del kernel:

```bash
dmesg | grep -i network
```

Ahí suelen aparecer errores de driver, desconexiones de cable o problemas con la interfaz.

## 4. Verificar la capa física y el driver

No todo es software. Un cable suelto o un driver mal cargado dan síntomas raros. Mira el estado de la interfaz:

```bash
ip link show
```

Si ves `state DOWN`, levántala con `sudo ip link set wlp2s0 up`. Para interfaces inalámbricas, `iwconfig` o `iw dev wlp2s0 link` te mostrarán la calidad de la señal.

Si el problema persiste, revisa los módulos del kernel:

```bash
lsmod | grep -E "r8169|iwlwifi|e1000"
```

Un `sudo modprobe -r nombre_driver && sudo modprobe nombre_driver` puede reiniciar el driver sin reiniciar el equipo.

## Conclusión

Depurar red en Linux no es magia: es seguir una escalera lógica desde lo más básico hasta lo más específico. Con estos comandos y un poco de paciencia, la mayoría de los problemas se resuelven sin tocar el router. Si nada funciona, recuerda que `tcpdump` y `wireshark` son tus mejores amigos para análisis profundos.
