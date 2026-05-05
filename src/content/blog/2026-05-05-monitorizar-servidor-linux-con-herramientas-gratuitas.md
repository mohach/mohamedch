---
title: "Monitorizar Servidor Linux con Herramientas Gratuitas"
excerpt: "Learn how to monitor your Linux server for free using open-source tools like htop, Netdata, and Nagios for real-time performance insights."
date: "2026-05-05"
lang: "en"
slug: "monitorizar-servidor-linux-con-herramientas-gratuitas"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

When you run a Linux server—whether for a personal project, a client's website, or a home lab—knowing what's happening under the hood is essential. Downtime, resource exhaustion, or silent failures can turn into major headaches. The good news: you don't need expensive enterprise tools to keep an eye on things. Here's a practical guide to monitoring your Linux server with free, battle-tested utilities.

## Start with Built-in Tools: `htop`, `iotop`, and `iftop`

Before installing anything else, master the classics. These lightweight tools give you instant visibility into CPU, memory, disk I/O, and network usage.

- **`htop`** is an interactive process viewer. Install it with `sudo apt install htop` (Debian/Ubuntu) or `sudo dnf install htop` (RHEL/Fedora). Run `htop` and you'll see real-time CPU cores, memory bars, and a sorted process list. Press `F6` to sort by memory or CPU—great for spotting runaway processes.

- **`iotop`** shows per-process disk read/write speeds. Install it (`sudo apt install iotop`) and run `sudo iotop -o` to see only active processes. If your server feels sluggish and the disk LED is solid, this will pinpoint the culprit.

- **`iftop`** displays network bandwidth usage per connection. Run `sudo iftop -i eth0` (replace `eth0` with your interface). It's invaluable for catching unexpected traffic spikes or identifying which IP is hogging your pipe.

Example one-liner to check top memory consumers:
```bash
ps aux --sort=-%mem | head -10
```

## Monitor System Logs with `journalctl` and `logwatch`

Logs are your server's memory. But raw logs are noisy. Use `journalctl` (systemd's logger) to filter efficiently.

- Check recent kernel messages: `journalctl -k -n 50`
- See SSH login attempts: `journalctl -u ssh -n 20 --no-pager`
- Follow new logs in real time: `journalctl -f`

For daily summaries, install **`logwatch`** (`sudo apt install logwatch`). It generates a concise email report of the previous day's activity (SSH failures, disk errors, package updates). Run it manually to test:
```bash
sudo logwatch --detail High --mailto you@example.com --service All --range yesterday
```
Set it as a daily cron job, and you'll wake up to a clean digest instead of drowning in logs.

## Track Disk Health and Usage with `ncdu` and `smartctl`

Running out of disk space is the most common cause of "mystery" outages. Two free tools keep you ahead.

- **`ncdu`** (NCurses Disk Usage) gives an interactive, navigable view of disk usage. Install it (`sudo apt install ncdu`), then run `sudo ncdu /`. You can browse directories, delete files with `d`, and instantly see what's eating space. No more `du -sh *` guesswork.

- **`smartctl`** (from `smartmontools`) checks your disk's physical health. Install it, then run:
```bash
sudo smartctl -H /dev/sda
```
Look for `SMART overall-health: PASSED`. Also check pending sectors: `sudo smartctl -a /dev/sda | grep -i pending`. A non-zero value means your disk is failing—replace it before data loss.

## Set Up Alerts with `netdata` or `monit`

Real-time monitoring is great, but you need alerts when you're not staring at the screen.

- **`netdata`** is a stunningly detailed, web-based monitoring dashboard. Install with a one-liner: `bash <(curl -Ss https://my-netdata.io/kickstart.sh)`. It auto-detects hundreds of metrics (CPU, RAM, disk, network, processes) and shows them in real-time charts. Access it at `http://your-server-ip:19999`. It includes configurable alarms—like CPU above 90% or disk space below 10%.

- **`monit`** is a lighter, more traditional alternative. Install it (`sudo apt install monit`), then edit `/etc/monit/monitrc` to define checks. Example to restart a web server if it stops responding:
```
check process nginx with pidfile /var/run/nginx.pid
  start program = "/usr/sbin/service nginx start"
  stop program = "/usr/sbin/service nginx stop"
  if failed port 80 protocol http then restart
  if 5 restarts within 5 cycles then alert
```
Monit also monitors system resources and can send email alerts.

## Conclusion

You don't need a budget or a dedicated DevOps team to keep your Linux server healthy. Built-in tools like `htop` and `journalctl` give you instant insight, while `ncdu` and `smartctl` prevent disk disasters. For proactive alerting, `netdata` provides a gorgeous dashboard, and `monit` offers robust automation. Pick the tools that match your workflow, set them up once, and let them work for you. Your future self—woken by a midnight outage—will thank you.
