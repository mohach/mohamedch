---
title: "VPN autoalojada con WireGuard en VPS"
excerpt: "Aprende a montar tu propia VPN segura y rápida con WireGuard en un VPS, paso a paso y sin complicaciones."
date: "2026-05-27"
lang: "es"
slug: "vpn-autoalojada-con-wireguard-en-vps"
tags: ["linux", "open source", "desarrollo web", "tecnico informatico"]
author: "Mohamed Chennani"
---

Si buscas privacidad real sin depender de terceros ni pagar suscripciones mensuales, montar tu propia VPN con WireGuard en un VPS es la solución más limpia, rápida y segura. WireGuard es ligero, moderno y está integrado en el kernel Linux desde la versión 5.6. Aquí te explico cómo ponerlo en marcha en pocos pasos.

## Requisitos y preparación del VPS

Necesitas un VPS con Ubuntu 22.04 o superior (o Debian 11+), acceso root y al menos 512 MB de RAM. Conéctate por SSH y actualiza el sistema:

```bash
sudo apt update && sudo apt upgrade -y
```

Asegúrate de que el firewall permita el tráfico UDP en el puerto que usaremos. Por defecto, WireGuard usa el puerto 51820. Si usas UFW:

```bash
sudo ufw allow 51820/udp
sudo ufw enable
```

## Instalación y configuración del servidor

WireGuard suele venir incluido, pero si no, instálalo:

```bash
sudo apt install wireguard -y
```

Ahora genera las claves del servidor (como root o con sudo):

```bash
wg genkey | sudo tee /etc/wireguard/server.key
sudo chmod 600 /etc/wireguard/server.key
sudo cat /etc/wireguard/server.key | wg pubkey | sudo tee /etc/wireguard/server.pub
```

Crea el archivo de configuración `/etc/wireguard/wg0.conf`:

```ini
[Interface]
Address = 10.0.0.1/24
ListenPort = 51820
PrivateKey = <contenido_de_server.key>
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
```

Cambia `eth0` por la interfaz de red de tu VPS (puedes verificarla con `ip a`). También habilita el forwarding IP:

```bash
echo "net.ipv4.ip_forward=1" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

Inicia el servicio:

```bash
sudo systemctl enable wg-quick@wg0
sudo systemctl start wg-quick@wg0
```

## Configurar un cliente (tu ordenador o móvil)

En tu máquina local (por ejemplo, un portátil con Linux), instala WireGuard y genera sus claves:

```bash
sudo apt install wireguard -y
wg genkey | tee client.key
cat client.key | wg pubkey | tee client.pub
```

Crea el archivo `/etc/wireguard/wg0.conf` en el cliente:

```ini
[Interface]
Address = 10.0.0.2/24
PrivateKey = <contenido_de_client.key>
DNS = 1.1.1.1

[Peer]
PublicKey = <contenido_de_server.pub>
Endpoint = <IP_DEL_VPS>:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
```

`AllowedIPs = 0.0.0.0/0` redirige todo el tráfico a través de la VPN. Si solo quieres rutas específicas, pon `10.0.0.0/24` o la subred que necesites.

Ahora añade este cliente al servidor. En el VPS, edita `/etc/wireguard/wg0.conf` y agrega al final:

```ini
[Peer]
PublicKey = <contenido_de_client.pub>
AllowedIPs = 10.0.0.2/32
```

Reinicia WireGuard en el servidor:

```bash
sudo systemctl restart wg-quick@wg0
```

En el cliente, levanta la interfaz:

```bash
sudo wg-quick up wg0
```

Para comprobar que funciona, haz un `ping 10.0.0.1` desde el cliente. Si responde, ya estás dentro.

## Consejos finales y seguridad extra

- Cambia el puerto por defecto si tu VPS está en una red pública muy escaneada.
- Añade más clientes repitiendo el proceso: genera claves, añade un `[Peer]` en el servidor con una IP distinta (10.0.0.3/32, etc.) y configura su archivo local.
- Para parar la VPN en el cliente: `sudo wg-quick down wg0`.
- Puedes usar `wg show` en cualquier momento para ver el estado de los peers.

WireGuard es tan eficiente que apenas consume recursos. Con este montaje tienes una VPN propia, sin logs, sin límites de velocidad y con el control total en tus manos.
