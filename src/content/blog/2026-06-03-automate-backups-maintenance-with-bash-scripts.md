---
title: "Automate Backups & Maintenance with Bash Scripts"
excerpt: "Learn how to automate backups and system maintenance using simple bash scripts to save time and prevent data loss."
date: "2026-06-03"
lang: "en"
slug: "automate-backups-maintenance-with-bash-scripts"
tags: ["linux", "open source", "web development", "it technician"]
author: "Mohamed Chennani"
---

As an IT technician, I've learned that manual maintenance is a recipe for disaster. Whether you're managing a single VPS or a small home server, automating routine tasks with Bash scripts saves time and prevents costly errors. Here's how I handle backups and system upkeep using simple, reliable scripts.

## Structuring Your Backup Script

A solid backup script needs three things: a timestamp, a destination, and a rotation policy. Start by defining variables at the top for easy modification.

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/mysite"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
RETENTION_DAYS=7
```

Then, create a compressed archive of your critical data. I always exclude cache directories to keep archives lean.

```bash
tar -czf "$BACKUP_DIR/site_$TIMESTAMP.tar.gz" \
  --exclude="wp-content/cache" \
  /var/www/mysite
```

Finally, purge backups older than your retention period. This keeps storage usage predictable.

```bash
find "$BACKUP_DIR" -name "site_*.tar.gz" -mtime +$RETENTION_DAYS -delete
```

## Automating Database Dumps

WordPress or any CMS relies on a database. A separate script for database dumps ensures you can restore the content independently.

```bash
#!/bin/bash
DB_USER="wpuser"
DB_PASS="securepassword"
DB_NAME="wordpress"
BACKUP_DIR="/var/backups/db"
mysqldump -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" | gzip > "$BACKUP_DIR/db_$(date +%Y%m%d).sql.gz"
```

For security, store the database password in a restricted `.my.cnf` file instead of hardcoding it. Set permissions to 600 and reference it with `--defaults-extra-file`.

## Scheduling Maintenance Tasks with Cron

Backups are useless if they don't run consistently. I schedule both scripts with cron to run at off-peak hours.

```bash
# Backup site files every night at 2 AM
0 2 * * * /usr/local/bin/backup_site.sh

# Dump database every 6 hours
0 */6 * * * /usr/local/bin/backup_db.sh

# Run system updates weekly on Sunday at 4 AM
0 4 * * 0 /usr/local/bin/update_system.sh
```

For the update script, I use a non-interactive approach to avoid hanging on prompts:

```bash
#!/bin/bash
apt update && apt upgrade -y
apt autoremove -y
apt autoclean
```

Add logging to see what happened:

```bash
LOGFILE="/var/log/system_maintenance.log"
echo "$(date) - Updates completed" >> "$LOGFILE"
```

## Adding Error Handling and Notifications

A silent failure is worse than no backup. I wrap critical commands with error checks.

```bash
if tar -czf "$BACKUP_DIR/site_$TIMESTAMP.tar.gz" /var/www/mysite; then
    echo "Backup succeeded: $TIMESTAMP"
else
    echo "Backup failed: $TIMESTAMP" | mail -s "Backup Alert" admin@example.com
    exit 1
fi
```

For disk space warnings, add a check before the backup runs:

```bash
AVAILABLE=$(df /var/backups | awk 'NR==2 {print $4}')
if [ "$AVAILABLE" -lt 500000 ]; then
    echo "Warning: Low disk space on backups volume" | mail -s "Disk Alert" admin@example.com
fi
```

## Conclusion

Automating backups and maintenance with Bash scripts is a small investment that pays off immediately. Start with a simple backup script, add database dumps, schedule them with cron, and layer in error handling. Within an hour, you'll have a system that runs reliably while you sleep. Test your restore process monthly — a backup you can't restore is just a file.
