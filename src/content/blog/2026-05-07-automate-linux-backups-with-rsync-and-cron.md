---
title: "Automate Linux Backups with Rsync and Cron"
excerpt: "Learn how to automate Linux backups using Rsync and Cron for reliable, scheduled data protection with simple command-line tools."
date: "2026-05-07"
lang: "en"
slug: "automate-linux-backups-with-rsync-and-cron"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

If you rely on a Linux server—whether for personal projects, client sites, or a home lab—manual backups are a ticking time bomb. One forgotten run, one disk failure, and your data is gone. Automating backups with `rsync` and `cron` is the simplest, most reliable way to protect your files without thinking about it. Here’s how to set it up using real commands you can deploy today.

## Why rsync and cron Work So Well Together

`rsync` is a fast, versatile file-copying tool that only transfers changes—saving bandwidth and time. `cron` is the built-in Linux job scheduler. Combined, they give you incremental, scheduled backups that run in the background. No cloud dependency, no complex software. Just your data, copied safely to another disk or remote server.

## Step 1: The rsync Command You’ll Use

Start with a basic local backup. This command syncs `/home/user/documents` to `/mnt/backup/documents`:

```bash
rsync -avh --delete /home/user/documents/ /mnt/backup/documents/
```

- `-a` (archive): preserves permissions, timestamps, symbolic links, and recursively copies directories.
- `-v` (verbose): shows what’s being copied (omit in cron for quiet operation).
- `-h` (human-readable): sizes in KB/MB.
- `--delete`: removes files from the destination that no longer exist in the source. This keeps your backup an exact mirror.

For remote backups (e.g., to a VPS or NAS), add SSH:

```bash
rsync -avhz --delete -e ssh /home/user/documents/ user@192.168.1.100:/backup/documents/
```

The `-z` flag compresses data during transfer. Test the command manually first to confirm connectivity and paths.

## Step 2: Create a Backup Script

A dedicated script keeps your cron command clean and lets you add logic later. Create `/usr/local/bin/backup.sh`:

```bash
#!/bin/bash
SOURCE="/home/user/documents/"
DESTINATION="/mnt/backup/documents/"
LOGFILE="/var/log/backup.log"

rsync -ah --delete "$SOURCE" "$DESTINATION" >> "$LOGFILE" 2>&1

# Optional: keep only last 30 days of logs
find /var/log/backup.log* -mtime +30 -delete
```

Make it executable:

```bash
chmod +x /usr/local/bin/backup.sh
```

Using `-h` instead of `-avh` is fine in cron—you don’t need verbose output for logs. Redirect stderr to capture errors.

## Step 3: Schedule with cron

Open your user’s crontab:

```bash
crontab -e
```

Add this line to run the backup every day at 2:30 AM:

```
30 2 * * * /usr/local/bin/backup.sh
```

The five fields mean: minute (30), hour (2), day of month (*), month (*), day of week (*). For a backup every 6 hours:

```
0 */6 * * * /usr/local/bin/backup.sh
```

Want to run it as root for system files? Use `sudo crontab -e` and adjust the script’s source path (e.g., `/etc/`, `/var/www/`). Always test by checking `tail -f /var/log/backup.log` after the first run.

## Pro Tips for Real-World Use

- **Exclude unnecessary files**: Add `--exclude='.cache/' --exclude='*.tmp'` to your rsync command to skip junk.
- **Use a separate disk**: Backing up to the same drive protects against file deletion, not disk failure. Mount an external USB or network share.
- **Add email alerts**: Append `mail -s "Backup status" you@example.com < /var/log/backup.log` to your script to get notified on failures.
- **Test your restore**: Periodically copy a file from the backup back to the source to confirm integrity. A backup you never test isn’t a backup.

## Conclusion

Automated backups with `rsync` and `cron` are a no-brainer for any Linux user. Ten minutes of setup saves you from hours of recovery—or permanent data loss. Start with a simple script, schedule it, and verify it works. Your future self will thank you.
