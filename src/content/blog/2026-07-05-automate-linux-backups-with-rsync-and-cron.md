---
title: "Automate Linux Backups with rsync and cron"
excerpt: "Learn how to automate Linux backups using rsync and cron for reliable, scheduled data protection with minimal effort."
date: "2026-07-05"
lang: "en"
slug: "automate-linux-backups-with-rsync-and-cron"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

Automating backups is one of those tasks that sounds boring until you lose important data. On Linux, combining `rsync` with `cron` gives you a powerful, lightweight, and reliable way to schedule incremental backups without installing bloated software. Here's how I set this up on my own servers and workstations.

## Why rsync and cron?

`rsync` is not just a copy tool—it transfers only the changed parts of files, saving bandwidth and time. It also preserves permissions, timestamps, and symlinks by default. `cron` is the classic job scheduler built into every Linux system. Together, they let you run backups at fixed times (daily, hourly, weekly) with minimal overhead. No cloud dependencies, no GUI, just results.

## Setting up the rsync backup command

First, decide what to back up and where. A typical local backup to an external drive looks like this:

```bash
rsync -avh --delete /home/user/Documents/ /mnt/backup/Documents/
```

- `-a` (archive): preserves permissions, timestamps, and recursively copies directories.
- `-v` (verbose): shows progress (useful for testing, remove later for cron).
- `-h` (human-readable): shows sizes in KB/MB.
- `--delete`: removes files in the destination that no longer exist in the source (keeps backup in sync).

For remote backups over SSH, add the remote path:

```bash
rsync -avh --delete -e ssh /home/user/ user@remote-server:/backup/
```

Test the command manually first. If you see errors, fix them before scheduling. I always run `rsync --dry-run` once to see what would happen without actually copying anything.

## Creating the cron job

Open your user's crontab with:

```bash
crontab -e
```

Add a line to run the backup at a specific time. The format is: minute hour day month weekday command. For example, to run every day at 3:00 AM:

```
0 3 * * * rsync -ah --delete /home/user/Documents/ /mnt/backup/Documents/ > /dev/null 2>&1
```

I redirect output to `/dev/null` to avoid cron emailing me every time. If you want logs, redirect to a file instead:

```
0 3 * * * rsync -ah --delete /home/user/Documents/ /mnt/backup/Documents/ >> /home/user/backup.log 2>&1
```

Common schedules:
- Every hour: `0 * * * *`
- Every midnight: `0 0 * * *`
- Every Sunday at 2 AM: `0 2 * * 0`

## Practical tips for real-world use

**Use a script, not a one-liner.** When your backup grows complex, put the rsync command in a shell script and call that from cron. This makes testing and debugging easier.

```bash
#!/bin/bash
# /home/user/backup.sh
rsync -ah --delete --exclude='.cache' /home/user/ /mnt/backup/home/
```

Make it executable (`chmod +x backup.sh`) and add this to cron:

```
0 4 * * * /home/user/backup.sh
```

**Exclude unnecessary files.** Add `--exclude='.cache'` or `--exclude='*.tmp'` to skip junk. This speeds up backups and saves disk space.

**Check your backups.** A backup you don't test isn't a backup. Run `rsync --dry-run` occasionally, or restore a single file to verify integrity.

**Watch for unmounted drives.** If your backup drive isn't mounted when cron runs, rsync will create a folder on your root filesystem and fill it silently. I add a mount check in the script:

```bash
if ! mountpoint -q /mnt/backup; then
    echo "Backup drive not mounted" >> /home/user/backup.log
    exit 1
fi
```

## Conclusion

`rsync` plus `cron` is the backbone of my backup strategy. It's free, transparent, and works on any Linux machine. Start with a simple daily backup, test it, and expand as needed. Ten minutes of setup can save you from hours of regret.
