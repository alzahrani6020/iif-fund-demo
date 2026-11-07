#!/usr/bin/env bash
# SCC380 VPS INCIDENT DIAGNOSTIC (read-only) — captured verbatim from incident response runbook.
set -u

echo "=================================================="
echo " SCC380 VPS INCIDENT DIAGNOSTIC"
echo " TIME: $(date -Is)"
echo " HOST: $(hostname)"
echo "=================================================="

echo
echo "=== 1. SYSTEM / UPTIME ==="
uname -a
uptime
who -b 2>/dev/null || true

echo
echo "=== 2. MEMORY / SWAP ==="
free -h
echo
swapon --show 2>/dev/null || true

echo
echo "=== 3. DISK ==="
df -hT
echo
df -i

echo
echo "=== 4. LOAD / TOP MEMORY PROCESSES ==="
ps -eo pid,ppid,user,%mem,%cpu,rss,vsz,comm,args \
  --sort=-rss | head -25

echo
echo "=== 5. DOCKER STATUS ==="
systemctl is-active docker 2>/dev/null || true
systemctl status docker --no-pager -l 2>/dev/null | tail -40 || true

echo
echo "=== 6. CONTAINERS ==="
docker ps -a --no-trunc 2>/dev/null || true

echo
echo "=== 7. CONTAINER RESOURCE SNAPSHOT ==="
docker stats --no-stream 2>/dev/null || true

echo
echo "=== 8. PREVIOUS BOOT KERNEL OOM EVIDENCE ==="
journalctl -b -1 -k --no-pager 2>/dev/null \
  | grep -Ei 'out of memory|oom|killed process|memory cgroup|invoked oom-killer' \
  | tail -100 || true

echo
echo "=== 9. CURRENT BOOT KERNEL OOM EVIDENCE ==="
journalctl -b 0 -k --no-pager 2>/dev/null \
  | grep -Ei 'out of memory|oom|killed process|memory cgroup|invoked oom-killer' \
  | tail -100 || true

echo
echo "=== 10. PREVIOUS BOOT INCIDENT EVENTS ==="
journalctl -b -1 --no-pager 2>/dev/null \
  | grep -Ei 'rsync|oom|out of memory|killed process|docker|containerd|shutdown|reboot|power|watchdog|segfault|i/o error|no space left|read-only file system' \
  | tail -200 || true

echo
echo "=== 11. CURRENT BOOT INCIDENT EVENTS ==="
journalctl -b 0 --no-pager 2>/dev/null \
  | grep -Ei 'rsync|oom|out of memory|killed process|docker|containerd|shutdown|reboot|power|watchdog|segfault|i/o error|no space left|read-only file system' \
  | tail -200 || true

echo
echo "=== 12. REBOOT / SHUTDOWN HISTORY ==="
last -x 2>/dev/null | head -30 || true

echo
echo "=== 13. FAILED SERVICES ==="
systemctl --failed --no-pager 2>/dev/null || true

echo
echo "=== 14. RSYNC PROCESSES STILL RUNNING ==="
pgrep -a rsync 2>/dev/null || echo "NO_RSYNC_PROCESS"

echo
echo "=== 15. SCC CONTAINERS QUICK CHECK ==="
docker ps -a --format 'table {{.Names}}\t{{.Status}}\t{{.Image}}' 2>/dev/null \
  | grep -Ei 'scc|api|caddy|postgres|redis' || true

echo
echo "=================================================="
echo " DIAGNOSTIC COMPLETE"
echo " DO NOT RESTART / DEPLOY / RSYNC YET"
echo "=================================================="
