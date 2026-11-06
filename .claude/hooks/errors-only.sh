#!/usr/bin/env bash
# Usage: errors-only.sh <base64-of-command>
# Runs the command with bash, keeps only error lines (<=100) on failure, one OK line on success.
# Exit code of the original command is preserved.
set -u
cmd=$(python3 -c 'import base64,sys; sys.stdout.write(base64.b64decode(sys.argv[1]).decode())' "${1:-}") || exit 2
log=$(mktemp "${TMPDIR:-/tmp}/claude-cmd.XXXXXX")
bash -c "$cmd" >"$log" 2>&1
rc=$?
python3 - "$log" "$rc" <<'PY'
import re, sys
log, rc = sys.argv[1], int(sys.argv[2])
lines = open(log, errors="replace").read().splitlines()
if rc == 0:
    print(f"OK ({len(lines)} lines of output suppressed)")
    sys.exit(0)
pat = re.compile(r"Traceback|Error|ERROR|FAILED|FAIL\b|✗|×|AssertionError|^E {3}|error TS|ERROR in|error:|Exception")
keep = set()
for i, l in enumerate(lines):
    if pat.search(l):
        keep.update(range(max(0, i - 1), min(len(lines), i + 2)))
out, prev = [], -2
for i in sorted(keep):
    if i != prev + 1 and out:
        out.append("--")
    out.append(lines[i][:300])
    prev = i
if not out:
    out = [l[:300] for l in lines[-20:]]
cap = 97
if len(out) > cap:
    out = out[:cap - 1] + [f"... ({len(out) - cap + 1} more filtered lines truncated)"]
out.append(f"exit status: {rc}")
out.append(f"[full log: {log}]")
print("\n".join(out))
PY
exit "$rc"
