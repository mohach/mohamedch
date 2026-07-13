---
title: "Optimize Hetzner VPS Performance: Key Tips"
excerpt: "Boost your Hetzner VPS speed and reliability with essential tips on kernel tuning, storage optimization, and network configuration."
date: "2026-07-13"
lang: "en"
slug: "optimize-hetzner-vps-performance-key-tips"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

If you’ve just spun up a Hetzner VPS, you’re already getting excellent value. But out of the box, the default configuration is often geared toward general compatibility, not peak performance. A few targeted tweaks can reduce latency, improve I/O, and squeeze more throughput from your instance without spending a cent more.

## Tune the Network Stack for Lower Latency

Hetzner’s network is solid, but the default kernel settings are conservative. Start by adjusting TCP buffer sizes and congestion control to match modern internet conditions. Create or edit `/etc/sysctl.d/99-netoptimize.conf`:

```ini
net.core.rmem_max = 134217728
net.core.wmem_max = 134217728
net.ipv4.tcp_rmem = 4096 87380 134217728
net.ipv4.tcp_wmem = 4096 65536 134217728
net.ipv4.tcp_congestion_control = bbr
net.core.default_qdisc = fq
net.ipv4.tcp_fastopen = 3
net.ipv4.tcp_slow_start_after_idle = 0
```

Apply with `sysctl -p /etc/sysctl.d/99-netoptimize.conf`. The BBR congestion algorithm is especially effective on Hetzner’s network, often cutting latency by 20-30% for long-lived connections. The `tcp_fastopen` and `slow_start` tweaks help burst traffic and repeat connections.

## Optimize Disk I/O with I/O Scheduler and Mount Options

Hetzner VPS instances typically use NVMe or SSD storage, but the default I/O scheduler is often `none` or `mq-deadline`. For virtualized NVMe, switch to `none` (already optimal) but verify:

```bash
cat /sys/block/sda/queue/scheduler
```

If it shows `[none]`, you’re good. Next, remount your filesystem with `noatime` and `nodiratime` to eliminate unnecessary writes:

```bash
# Edit /etc/fstab for the root partition
UUID=your-uuid / ext4 defaults,noatime,nodiratime 0 1
```

Then remount: `mount -o remount /`. This alone can reduce disk I/O by 10-15% on busy web servers.

## Disable Unnecessary Services and Tune Swappiness

A fresh Hetzner VPS often runs services you don’t need (e.g., postfix, avahi-daemon, snapd). List running services with `systemctl list-units --type=service --state=running` and disable anything non-essential:

```bash
systemctl disable --now postfix.service snapd.service avahi-daemon.service
```

Also reduce swappiness to avoid swapping under light memory pressure:

```bash
echo "vm.swappiness=10" >> /etc/sysctl.d/99-memory.conf
sysctl -p /etc/sysctl.d/99-memory.conf
```

A value of 10 tells the kernel to only swap when memory is truly tight, keeping your applications in RAM where they belong.

## Profile and Benchmark Your Changes

Don’t guess—measure. Use `htop` for real-time resource monitoring and `iperf3` to test throughput between your VPS and a nearby Hetzner test server (e.g., `iperf3.hetzner.com`). For disk speed, run:

```bash
fio --randrepeat=1 --ioengine=libaio --direct=1 --gtod_reduce=1 --name=test --bs=4k --iodepth=64 --size=1G --readwrite=randrw --rwmixread=75
```

Compare results before and after your tweaks. A 15-20% improvement in random I/O and lower ping under load is realistic.

## Conclusion

These adjustments take less than 15 minutes but deliver measurable gains: faster page loads, lower latency, and more efficient resource usage. Hetzner hardware is capable—don’t let default settings hold it back. Apply these tweaks, benchmark, and watch your VPS punch well above its weight class.
