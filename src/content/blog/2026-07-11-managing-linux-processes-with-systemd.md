---
title: "Managing Linux Processes with systemd"
excerpt: "Learn how to manage Linux processes efficiently using systemd, covering service control, monitoring, and automation with practical commands."
date: "2026-07-11"
lang: "en"
slug: "managing-linux-processes-with-systemd"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

If you work with Linux long enough, you will inevitably need to stop, start, or troubleshoot a service. While old-school SysVinit scripts still exist in some corners, modern Linux distributions rely on **systemd** to manage processes. Understanding a few core commands will save you time and prevent headaches when something breaks.

## Checking the Status of a Service

The first thing you do when something feels off is ask systemd what is happening. The `systemctl status` command gives you a snapshot of any service, including its current state, recent logs, and the process ID.

```bash
systemctl status nginx
```

This will show you whether the service is active (running), inactive (stopped), or in a failed state. If the service has crashed, you will see the exit code and the last few lines of its journal output. This is often enough to spot a misconfiguration or a missing dependency.

For a quick overview of all active services, use:

```bash
systemctl list-units --type=service --state=running
```

This filters out everything except running services, which is handy when you have dozens of daemons loaded.

## Starting, Stopping, and Restarting Processes

Managing a service is straightforward once you know the syntax. The commands are intuitive and follow the same pattern:

```bash
sudo systemctl start apache2   # Start a service
sudo systemctl stop apache2    # Stop it immediately
sudo systemctl restart apache2 # Stop then start again
sudo systemctl reload apache2  # Reload config without dropping connections
```

The `reload` command is especially useful for web servers or proxies where you want to apply configuration changes without interrupting active connections. Not all services support reload, but many do. Check the service's documentation or run `systemctl reload` and see if it returns an error.

## Enabling and Disabling Services at Boot

A common mistake is starting a service manually and assuming it will survive a reboot. Systemd separates the concept of *starting now* from *starting on boot*. To make a service start automatically when the machine boots, you must **enable** it:

```bash
sudo systemctl enable postgresql
```

To remove that behavior:

```bash
sudo systemctl disable postgresql
```

You can combine both actions in one command:

```bash
sudo systemctl enable --now postgresql   # Enable and start immediately
sudo systemctl disable --now postgresql  # Disable and stop immediately
```

The `--now` flag is a time-saver I use daily. It avoids the extra step of running `start` or `stop` separately.

## Viewing Logs with journalctl

Systemd centralizes logging through `journald`. Instead of hunting for log files in `/var/log/`, you can query the journal directly. To see logs for a specific service:

```bash
journalctl -u sshd
```

This shows all log entries for the SSH daemon, from oldest to newest. To watch logs in real time (like `tail -f`), add the `-f` flag:

```bash
journalctl -u nginx -f
```

If you need to see logs since the last boot, use `-b`:

```bash
journalctl -u mariadb -b
```

For troubleshooting a failed service, combine `-u` with `--no-pager` and `-n` to limit output:

```bash
journalctl -u fail2ban --no-pager -n 30
```

This prints the last 30 lines directly to your terminal without a pager, which is useful in scripts or when you want to copy the output quickly.

## Conclusion

Systemd is not just an init system—it is the backbone of process management on modern Linux. Mastering `systemctl` and `journalctl` will let you handle services confidently, whether you are deploying a new application or fixing a crash. Keep these commands handy, and you will spend less time guessing and more time solving real problems.
