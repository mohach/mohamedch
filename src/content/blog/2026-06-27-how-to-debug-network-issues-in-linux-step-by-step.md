---
title: "How to Debug Network Issues in Linux Step by Step"
excerpt: "A step-by-step guide to diagnosing and fixing network issues in Linux using ping, traceroute, netstat, tcpdump, and more."
date: "2026-06-27"
lang: "en"
slug: "how-to-debug-network-issues-in-linux-step-by-step"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

When your Linux machine loses connectivity or starts dropping packets, the problem could lie anywhere from a misconfigured NIC to a DNS misresolution. A methodical approach saves time and avoids chasing ghosts. Here is a step-by-step workflow I use daily to isolate network issues.

## 1. Start with Layer 1 and Layer 2: Physical and Link

Before blaming the kernel or routing, confirm the cable, Wi-Fi, or virtual interface is actually up.

Check link status and IP assignment:
```bash
ip link show
ip addr show
```
Look for `state UP` and a valid IP address. If the interface is `DOWN`, bring it up:
```bash
sudo ip link set eth0 up
```
For wireless, verify association:
```bash
iwconfig wlan0
```
If you see `Not-Associated`, your SSID or credentials may be wrong. A common pitfall: the interface is up but has no IP due to a dead DHCP server. Renew the lease:
```bash
sudo dhclient -v eth0
```

## 2. Test Local Connectivity and ARP

Once you have an IP, test reachability to your gateway. First, find the gateway:
```bash
ip route show default
```
Then ping it:
```bash
ping -c 4 192.168.1.1
```
If ping fails, check ARP resolution:
```bash
arp -n
```
If the gateway MAC is `(incomplete)`, you have a Layer 2 problem — bad cable, switch port flapping, or VLAN mismatch. On a wired connection, try:
```bash
sudo ethtool eth0
```
Look for `Link detected: yes` and check for `Speed` and `Duplex`. Mismatched duplex (half/full) causes packet loss that looks like a routing issue but is purely physical.

## 3. Validate DNS Resolution

A host that can ping an IP but not resolve names has a DNS problem. Test with a known domain:
```bash
nslookup google.com
```
Or using `dig`:
```bash
dig +short google.com
```
If resolution fails, check `/etc/resolv.conf`. It should list at least one working nameserver. Often, a misconfigured VPN or Docker network overwrites it. Temporarily override with a public DNS like `1.1.1.1`:
```bash
echo "nameserver 1.1.1.1" | sudo tee /etc/resolv.conf
```
If that fixes the issue, the problem is your local DNS server or DHCP-provided resolver. Check your router or NetworkManager settings.

## 4. Trace the Route and Check Firewall Rules

If local and DNS work but external hosts don't respond, use `traceroute` to find the break:
```bash
traceroute -n 8.8.8.8
```
A sudden `* * *` after a few hops suggests a firewall dropping your packets or a routing loop. Then inspect local firewall rules:
```bash
sudo iptables -L -n -v
```
Look for `DROP` or `REJECT` rules on `INPUT` or `FORWARD` chains. A common issue: a default `DROP` policy on `FORWARD` that blocks traffic from Docker containers or virtual machines. Temporarily disable the firewall to test:
```bash
sudo iptables -P INPUT ACCEPT
sudo iptables -P FORWARD ACCEPT
sudo iptables -P OUTPUT ACCEPT
```
If connectivity returns, re-enable rules selectively. Also check `nftables` if your distro uses it:
```bash
sudo nft list ruleset
```

## Conclusion

By moving from the physical interface up to the firewall, you avoid guesswork. Start with `ip link`, verify the gateway, confirm DNS, then trace and filter. Most issues are either a downed interface, a stale ARP entry, a misconfigured resolver, or an overzealous firewall rule. Keep this checklist handy and you'll resolve network problems in minutes, not hours.
