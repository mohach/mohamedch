---
title: "Linux Network Troubleshooting: Step-by-Step Guide"
excerpt: "Master Linux network troubleshooting with this step-by-step guide to diagnose and fix connectivity issues using essential command-line tools."
date: "2026-04-29"
lang: "en"
slug: "linux-network-troubleshooting-step-by-step-guide"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

Debugging network issues on Linux can feel like a guessing game if you don't have a structured approach. Whether you're dealing with a dropped connection, slow speeds, or DNS failures, following a logical step-by-step process will save you time and frustration. Here’s a practical guide I use daily as an IT technician.

## 1. Check Physical and Link Layer Connectivity

Start with the basics. If you're using Ethernet, verify the cable is plugged in and the link lights are active. For Wi-Fi, ensure the interface isn't soft-blocked.

Use `ip link` to list all network interfaces and their states. Look for `state UP` or `state DOWN`.

```bash
ip link show
```

If an interface is down, bring it up with:

```bash
sudo ip link set <interface> up
```

For wireless, check if the radio is blocked:

```bash
rfkill list
```

If soft-blocked, unblock it:

```bash
rfkill unblock wifi
```

## 2. Verify IP Configuration and Routing

Once the link is up, confirm your interface has an IP address. Use `ip addr` to see assigned addresses:

```bash
ip addr show <interface>
```

If you're on DHCP and have no IP, renew the lease:

```bash
sudo dhclient -v <interface>
```

Next, check your routing table. A missing default gateway is a common culprit.

```bash
ip route show
```

You should see a default route like `default via 192.168.1.1 dev <interface>`. If missing, add one:

```bash
sudo ip route add default via <gateway_ip> dev <interface>
```

## 3. Test DNS Resolution

Often, the network appears "connected" but DNS fails. Test with `nslookup` or `dig`:

```bash
nslookup google.com
```

If it fails, check your DNS servers in `/etc/resolv.conf`. If empty or wrong, you can temporarily test with a public DNS like Cloudflare's `1.1.1.1`:

```bash
echo "nameserver 1.1.1.1" | sudo tee /etc/resolv.conf
```

For persistent changes, edit your NetworkManager connection or `/etc/systemd/resolved.conf` depending on your setup.

## 4. Diagnose Connectivity and Packet Loss

Now test actual connectivity to an external host. Start with a simple ping:

```bash
ping -c 4 8.8.8.8
```

If that works but `ping google.com` fails, it's a DNS issue. If ping fails entirely, use `traceroute` to see where packets drop:

```bash
traceroute -n 8.8.8.8
```

For deeper inspection, `mtr` combines ping and traceroute in real-time:

```bash
mtr -n 8.8.8.8
```

If you see packet loss at the first hop, check your local network or cable. Loss later in the path points to your ISP or upstream.

Finally, inspect firewall rules with `iptables` or `nftables`:

```bash
sudo iptables -L -n -v
```

A blocking rule like a dropped `OUTPUT` chain can silently kill all traffic.

## Conclusion

Network debugging doesn't have to be a guessing game. By moving from physical checks to IP config, DNS, and then routing/firewall inspection, you isolate the problem efficiently. Keep these commands handy, and you'll resolve most issues in minutes.
