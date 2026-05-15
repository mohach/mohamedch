---
title: "Hetzner VPS Performance Optimization Guide"
excerpt: "Optimize your Hetzner VPS with proven Linux tweaks, network tuning, and resource management tips for faster, more reliable performance."
date: "2026-05-15"
lang: "en"
slug: "hetzner-vps-performance-optimization-guide"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

When you rent a cheap VPS from Hetzner, you’re getting solid hardware for the price. But out of the box, the default configuration is often bloated and not tuned for your specific workload. Whether you run a WordPress site, a VPN, or a small application server, a few practical tweaks can cut memory usage in half and improve latency.

## Disable Unused Services and Kernel Modules

Hetzner’s default images (especially Ubuntu and Debian) enable many services you do not need. The first thing I do is audit what is running.

```bash
systemctl list-units --type=service --state=running
```

Common candidates for disabling on a minimal VPS: `unattended-upgrades`, `cron`, `rsyslog`, and `postfix` (if you don’t need mail). For example:

```bash
sudo systemctl disable --now postfix
```

Also, remove unnecessary kernel modules. Create a blacklist file for modules like `bluetooth`, `pcspkr`, or `firewire`:

```bash
echo "blacklist pcspkr" | sudo tee /etc/modprobe.d/blacklist-extra.conf
```

This alone can free 100–200 MB of RAM on a 2 GB VPS.

## Tune the Linux Kernel for Low Latency

Hetzner uses standard kernels. For a web server or database, you want to reduce swappiness and tweak the VM subsystem.

Edit `/etc/sysctl.conf` and add:

```ini
vm.swappiness=10
vm.vfs_cache_pressure=50
net.core.somaxconn=1024
```

Apply with `sudo sysctl -p`. The `swappiness=10` tells the kernel to avoid swapping unless absolutely necessary. `vfs_cache_pressure=50` keeps directory and inode caches longer, which helps repeated access patterns.

For network-heavy workloads (like streaming or API servers), also add:

```ini
net.ipv4.tcp_fastopen=3
net.ipv4.tcp_slow_start_after_idle=0
```

These reduce connection setup latency and keep TCP congestion windows open.

## Optimize I/O with Noop or None Scheduler

Hetzner VPS instances use virtualized storage (SSD-based). The default I/O scheduler is often `kyber` or `mq-deadline`, but for a VPS, the `none` (or `noop`) scheduler performs best because the hypervisor handles ordering.

Check your current scheduler:

```bash
cat /sys/block/sda/queue/scheduler
```

To set `none` permanently, create a udev rule:

```bash
echo 'ACTION=="add|change", KERNEL=="sd*", ATTR{queue/scheduler}="none"' | sudo tee /etc/udev/rules.d/60-iosched.rules
```

Reboot or run `sudo udevadm trigger` to apply immediately. You should see lower I/O wait and more predictable disk performance.

## Use Lightweight Web Server and PHP Configuration

If you run a web stack, ditch Apache for Nginx or Caddy. On Hetzner’s smallest VPS (2 vCPU, 2 GB RAM), Nginx with PHP-FPM uses half the memory of Apache.

For PHP-FPM, adjust `pm.max_children` based on your RAM. A safe formula: `(Total RAM - 512 MB) / 50 MB`. For 2 GB:

```ini
pm.max_children = 30
pm.start_servers = 4
pm.min_spare_servers = 2
pm.max_spare_servers = 8
```

Also enable OpCache:

```ini
opcache.enable=1
opcache.memory_consumption=64
opcache.max_accelerated_files=4000
```

This reduces PHP execution time by up to 70% for repeated requests.

## Conclusion

Optimizing a Hetzner VPS is not about overclocking—it’s about removing bloat and aligning the system with your actual workload. Disable what you don’t use, tune the kernel for your memory and network profile, and choose lightweight services. These changes cost nothing but deliver a noticeably faster, more responsive server.
