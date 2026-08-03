---
title: "Automate Backups & Maintenance with Bash Scripting"
excerpt: "Learn to automate Linux backups and system maintenance with practical Bash scripts for reliable, hands-off server administration."
date: "2026-08-03"
lang: "en"
slug: "automate-backups-maintenance-with-bash-scripting"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

If you’re still logging into servers to run updates or copy files by hand, you’re wasting time and risking mistakes. A few well-written Bash scripts can handle backups, clean logs, and keep your system healthy while you sleep. Here’s how to build a practical maintenance toolkit that works on any Linux box.

## 1. The Backup Script: Simple and Reliable

Start with a script that rotates backups, so you keep a week’s worth without filling the disk. Use `tar` with compression and a timestamp, then prune old files.

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/mysite"
SOURCE="/var/www/html"
DATE=$(date +%Y-%m-%d)
KEEP=7

mkdir -p "$BACKUP_DIR"
tar -czf "$BACKUP_DIR/site-$DATE.tar.gz" "$SOURCE"

# Delete backups older than KEEP days
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$KEEP -delete
```

Add a second line to copy the archive off-site — `rsync` to a remote host or an S3 bucket via `aws s3 cp`. That turns a local backup into a real disaster recovery plan. Always test the restore path, not just the backup.

## 2. Log Rotation and Disk Cleanup

Logs grow silently and kill your disk. The built-in `logrotate` handles most services, but for custom app logs or temp files, a small script works wonders.

```bash
#!/bin/bash
LOG_DIR="/var/log/myapp"
DAYS=30

find "$LOG_DIR" -name "*.log" -mtime +$DAYS -delete
find /tmp -type f -atime +7 -delete 2>/dev/null

# Warn if disk usage crosses 80%
usage=$(df / | awk 'NR==2 {print $5}' | tr -d '%')
if [ "$usage" -gt 80 ]; then
    echo "Disk at ${usage}% on $(hostname)" | mail -s "Disk Warning" admin@mydomain.com
fi
```

Run this daily via cron. The disk check gives you early warning before a full partition takes down your site or database.

## 3. Automating System Maintenance

Updates and package cleanup are perfect for scripting. Create a script that runs `apt` or `dnf` non-interactively, then cleans orphaned packages and restarts services if needed.

```bash
#!/bin/bash
# Debian/Ubuntu
apt update && apt upgrade -y
apt autoremove -y
apt autoclean

# Restart web server if config changed (example)
if [ -f /etc/nginx/nginx.conf ]; then
    nginx -t && systemctl reload nginx
fi
```

For cron, use `@daily /usr/local/bin/maintenance.sh`. If you’re worried about a bad update, add a simple check: after upgrading, verify key services are active with `systemctl is-active --quiet nginx || systemctl restart nginx`. That way, a failed package install doesn’t leave you offline.

## 4. Putting It All Together with Cron and Logging

You don’t want scripts running silently — you need output when things break. Wrap everything with logging and use cron to schedule.

```bash
#!/bin/bash
LOG="/var/log/backup-maintenance.log"
exec >> "$LOG" 2>&1
echo "=== $(date) ==="
/usr/local/bin/backup.sh
/usr/local/bin/cleanup.sh
/usr/local/bin/update.sh
echo "Done."
```

Add this to crontab:

```
# Run at 2 AM every day
0 2 * * * /usr/local/bin/run-all.sh
```

Set `MAILTO="you@example.com"` at the top of your crontab to receive any errors. Check the log weekly — a silent script is often a broken script.

## Conclusion

Bash scripting turns repetitive server chores into a set-and-forget routine. Start with the backup script, add log cleanup, then automate updates. Test each script manually first, log everything, and let cron handle the schedule. Within an hour, you’ll have a maintenance system that saves you time and prevents the “I forgot to back up” panic.
