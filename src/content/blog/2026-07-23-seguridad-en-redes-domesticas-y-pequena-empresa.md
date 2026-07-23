---
title: "Seguridad en redes domésticas y pequeña empresa"
excerpt: "Consejos prácticos para proteger tu red doméstica o de pequeña empresa frente a amenazas comunes, con configuraciones esenciales y buenas prácticas."
date: "2026-07-23"
lang: "es"
slug: "seguridad-en-redes-domesticas-y-pequena-empresa"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

La seguridad en redes domésticas y de pequeña empresa es un tema que muchos descuidan hasta que ocurre un incidente. Con dispositivos IoT, trabajo remoto y datos sensibles en juego, un router mal configurado puede ser la puerta de entrada para ciberataques. Aquí te comparto pasos prácticos para blindar tu red sin necesidad de ser un experto.

## Cambia la configuración por defecto del router

El primer error común es dejar las credenciales de fábrica. Un atacante puede acceder a tu router en segundos si usas "admin/admin". Accede a la interfaz web (normalmente `192.168.1.1` o `192.168.0.1`) y cambia:

- **Nombre de usuario y contraseña**: usa una contraseña robusta, de al menos 12 caracteres con mayúsculas, números y símbolos.
- **SSID**: evita nombres que revelen el modelo del router o tu dirección. Algo neutro como "RedCasa" basta.
- **Cifrado WPA3**: si tu router lo soporta, actívalo. Si no, usa WPA2-AES. Olvida WEP o WPA-TKIP.

Además, desactiva WPS (Wi-Fi Protected Setup), ya que es vulnerable a ataques de fuerza bruta. En muchos routers, esto se hace desde la sección de seguridad inalámbrica.

## Segmenta la red con VLANs o redes de invitados

En una pequeña empresa o incluso en casa, separar dispositivos críticos de los menos seguros es clave. Por ejemplo, no quieres que una cámara IoT tenga acceso a tu servidor de archivos.

Si tu router lo permite, crea una **red de invitados** para visitas o dispositivos IoT. En routers más avanzados (como los que soportan OpenWrt o pfSense), puedes configurar **VLANs**:

```bash
# Ejemplo en OpenWrt: crear VLAN 10 para invitados
uci set network.guests=interface
uci set network.guests.proto='static'
uci set network.guests.ipaddr='192.168.10.1'
uci set network.guests.netmask='255.255.255.0'
uci set network.guests.device='eth0.10'
uci commit network
/etc/init.d/network restart
```

Luego, aplica reglas de firewall para aislar esa VLAN de la red principal. Así, si un dispositivo se infecta, no compromete el resto.

## Actualiza el firmware y desactiva servicios innecesarios

Los fabricantes lanzan parches de seguridad periódicamente. Revisa cada 2-3 meses si hay actualizaciones para tu router. En modelos como los de TP-Link o Asus, suele estar en "Administración > Actualización de firmware".

También desactiva servicios que no uses: acceso remoto (WAN), UPnP, Telnet o SSH si no lo necesitas. Por ejemplo, en routers con interfaz web, busca la opción "Remote Management" y ponla en "Disabled". Si necesitas acceso remoto, usa una VPN en lugar de exponer el router directamente.

## Usa un firewall y monitoriza el tráfico

Un firewall bien configurado bloquea intentos de escaneo y accesos no autorizados. En Linux, puedes usar `iptables` para reglas básicas:

```bash
# Bloquear todo el tráfico entrante excepto el establecido
iptables -P INPUT DROP
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
# Permitir SSH solo desde LAN
iptables -A INPUT -p tcp --dport 22 -s 192.168.1.0/24 -j ACCEPT
```

Para monitorizar, herramientas como `nmap` te ayudan a ver puertos abiertos:

```bash
nmap -sT -p 1-1000 192.168.1.1
```

Si ves puertos extraños (como 23, 445 o 3389) abiertos hacia afuera, revísalos de inmediato.

## Conclusión

Proteger tu red doméstica o de pequeña empresa no requiere invertir en equipos caros. Con cambios básicos de configuración, actualizaciones periódicas y un poco de segmentación, reduces drásticamente el riesgo. Dedica una tarde a revisar estos puntos: tu tranquilidad y tus datos te lo agradecerán.
