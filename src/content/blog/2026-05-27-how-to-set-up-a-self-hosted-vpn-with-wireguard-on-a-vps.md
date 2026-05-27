---
title: "How to Set Up a Self-Hosted VPN with WireGuard on a VPS"
excerpt: "Learn how to set up a fast, secure self-hosted VPN using WireGuard on a VPS with this step-by-step guide for Linux users."
date: "2026-05-27"
lang: "en"
slug: "how-to-set-up-a-self-hosted-vpn-with-wireguard-on-a-vps"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

If you rely on commercial VPNs for privacy or access, you're trusting a third party with your traffic. Hosting your own VPN on a cheap VPS gives you full control, better performance, and no logging concerns. WireGuard makes this incredibly simple — it's modern, fast, and auditable. Here's how I set up a self-hosted WireGuard VPN on a Debian VPS in under 10 minutes.

## Initial Server Setup

First, spin up a minimal Debian 12 VPS (1 GB RAM is plenty). Update the system and install WireGuard:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install wireguard -y
```

Enable IP forwarding so your VPS can route traffic for your devices:

```bash
echo "net.ipv4.ip_forward = 1" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

## Generate Keys and Configure the Server

WireGuard uses asymmetric key pairs. Generate a key pair for the server:

```bash
wg genkey | sudo tee /etc/wireguard/server.key
sudo chmod 600 /etc/wireguard/server.key
sudo cat /etc/wireguard/server.key | wg pubkey | sudo tee /etc/wireguard/server.pub
```

Now create the server configuration file at `/etc/wireguard/wg0.conf`:

```ini
[Interface]
Address = 10.0.0.1/24
ListenPort = 51820
PrivateKey = <server-private-key>

# Enable NAT for client traffic
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
```

Replace `<server-private-key>` with the content of `/etc/wireguard/server.key`. Adjust `eth0` if your main interface has a different name (check with `ip link`).

## Add a Client (Your Laptop or Phone)

On your local machine, generate a client key pair:

```bash
wg genkey | tee client.key
cat client.key | wg pubkey | tee client.pub
```

Add a peer section to the server config (`/etc/wireguard/wg0.conf`):

```ini
[Peer]
PublicKey = <client-public-key>
AllowedIPs = 10.0.0.2/32
```

Then create the client config (e.g., `client.conf`):

```ini
[Interface]
PrivateKey = <client-private-key>
Address = 10.0.0.2/24
DNS = 1.1.1.1

[Peer]
PublicKey = <server-public-key>
Endpoint = your-vps-ip:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
```

The `AllowedIPs = 0.0.0.0/0` routes all traffic through the VPN. For split tunneling (only route specific traffic), use `AllowedIPs = 10.0.0.0/24, your-company-internal-ip/32`.

## Start WireGuard and Firewall Rules

On the server, start the interface:

```bash
sudo systemctl enable wg-quick@wg0
sudo systemctl start wg-quick@wg0
```

Allow WireGuard through the firewall:

```bash
sudo ufw allow 51820/udp
sudo ufw enable
```

Check the connection status:

```bash
sudo wg show
```

You should see your client as a peer with a recent handshake time. Import the `client.conf` file into the WireGuard app on your phone or laptop, toggle it on, and test with `curl ifconfig.me` — your public IP should now be your VPS.

## Conclusion

Self-hosting WireGuard on a VPS is a weekend project that pays off in privacy and control. You avoid third-party logs, get full throughput (WireGuard runs in kernel space), and can easily add or revoke clients by editing the config. For under $5/month, you have a personal VPN that's faster and more trustworthy than most commercial services.
