---
title: "10 Comandos Linux Esenciales para Técnicos"
excerpt: "Master 10 essential Linux commands every technician needs for file management, networking, and system diagnostics."
date: "2026-07-07"
lang: "en"
slug: "10-comandos-linux-esenciales-para-tecnicos"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

As a technician, you'll quickly find that a GUI is a luxury, not a necessity. The true power of Linux lies in its command line, where you can diagnose, repair, and automate with surgical precision. These are the commands I use daily, not just for convenience, but because they are often the only way to get the job done.

## File Operations and Navigation

Before you can fix anything, you need to find it. `ls -la` is your first friend, revealing hidden files and detailed permissions. For moving around, `cd -` jumps you back to your previous directory—a massive time-saver.

When you need to find a specific configuration file, `find /etc -name "*.conf"` is more powerful than any search GUI. For a real-world scenario, I often use `grep -r "Listen" /etc/apache2/` to quickly locate where a port is defined across multiple config files. Combine `grep` with `wc -l` (e.g., `grep -c "error" /var/log/syslog`) to count occurrences without scrolling through endless logs.

## Process and Resource Management

A frozen system or a runaway process is inevitable. `top` is standard, but `htop` is superior for interactive management. The real killer combo is `ps aux --sort=-%mem | head` to see the top memory consumers.

When a process hangs, you need to kill it gracefully first: `kill -15 <PID>`. If that fails, `kill -9 <PID>` is the nuclear option. For monitoring disk space, `df -h` is quick, but `du -sh * | sort -rh` inside a directory tells you exactly which folder is eating your storage. This is invaluable when `/var` fills up from logs.

## Networking Diagnostics

Network issues are the most common source of phantom problems. Forget `ifconfig`; use `ip a` to see interfaces and `ip r` for the routing table. The `ss` command has replaced `netstat`—use `ss -tulpn` to see all listening ports and the processes attached to them.

For bandwidth tests, `iperf3 -c <server>` is non-negotiable. But for quick latency checks, `ping -c 4 8.8.8.8` is standard. When DNS fails, skip the browser and test directly: `nslookup mohamedch.com 1.1.1.1`. If that works but your browser doesn't, the issue is local DNS caching, not the server.

## System Logs and Journal Control

The systemd journal is your best diagnostic tool. `journalctl -xe` shows the last few errors and their context. For a specific service, `journalctl -u nginx.service -f` follows the log in real-time—perfect for testing config reloads.

When a disk fails, `dmesg | grep -i "error\|fail"` often reveals hardware-level issues before they crash the system. Combine this with `smartctl -a /dev/sda` to check drive health proactively. I always run `journalctl --disk-usage` to ensure logs aren't filling the partition.

## Conclusion

Mastering these commands transforms you from a button-clicker into a problem-solver. The terminal isn't a barrier; it's a direct line to the machine's soul. Practice these daily, and you'll resolve issues in seconds that would take minutes (or hours) with a GUI. The command line is the technician's scalpel—sharp, precise, and indispensable.
