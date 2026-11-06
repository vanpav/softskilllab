#!/usr/bin/env python3
"""PreToolUse hook (matcher: Bash). Rewrites test/build commands to run through errors-only.sh.

Emits hookSpecificOutput.updatedInput and NO permissionDecision, so the normal
permission flow still applies (to the rewritten command). Prints nothing and
exits 0 when the command is not rewritten.
Set CLAUDE_ERRORS_ONLY_DECISION=allow|ask to also emit a permissionDecision.
"""
import base64, json, os, re, sys

CMD = re.compile(r"""^(
    (uv\s+run\s+|poetry\s+run\s+)?(python3?\s+-m\s+)?(pytest|mypy|tox|ruff)\b |
    (npx\s+|bunx\s+|pnpm\s+(exec\s+)?|yarn\s+)?(vitest|jest|tsc|oxlint|eslint|webpack)\b |
    (npx\s+|bunx\s+|pnpm\s+(exec\s+)?|yarn\s+)?playwright\s+test\b |
    (npm|pnpm|yarn|bun)\s+(run\s+)?(test|build|lint|typecheck|check)\b |
    pnpm\s+(-r\s+|--filter\s+\S+\s+)+(run\s+)?(test|build|lint|typecheck)\b |
    make\s+(test|build|lint|check)[\w-]*\b |
    go\s+(test|build|vet)\b | cargo\s+(test|build|check|clippy)\b |
    (\./)?(gradlew|mvnw)\b | mvn\b | gradle\b |
    dotnet\s+(build|test)\b | swift\s+(build|test)\b | xcodebuild\b |
    bundle\s+exec\s+(rspec|rake)\b | rspec\b | phpunit\b |
    docker\s+compose\s+build\b | docker-compose\s+build\b | docker\s+build\b
)""", re.X)
ENV = re.compile(r"^(\w+=\S*\s+)+")
UNSAFE = re.compile(r"[\n;|`&<>]|\$\(")  # checked after removing '&&' and '2>&1'


def wanted(cmd: str) -> bool:
    if "# full-output" in cmd or os.environ.get("CLAUDE_FULL_OUTPUT") == "1":
        return False
    if "errors-only.sh" in cmd:
        return False
    flat = cmd.replace("&&", " ").replace("2>&1", " ")
    if UNSAFE.search(flat):
        return False
    hit = False
    for seg in (s.strip() for s in cmd.split("&&")):
        seg = ENV.sub("", seg)
        if re.match(r"cd\s+\S+$", seg):
            continue
        if CMD.match(seg):
            hit = True
        else:
            return False
    return hit


def main() -> None:
    try:
        data = json.load(sys.stdin)
    except Exception:
        return
    if data.get("tool_name") != "Bash":
        return
    tool_input = data.get("tool_input") or {}
    cmd = tool_input.get("command", "")
    if not cmd or not wanted(cmd):
        return
    b64 = base64.b64encode(cmd.encode()).decode()
    script = os.path.join(os.environ.get("CLAUDE_PROJECT_DIR") or data.get("cwd", "."), ".claude/hooks/errors-only.sh")
    out = {"hookEventName": "PreToolUse", "updatedInput": {**tool_input, "command": f'"{script}" {b64}'}}
    decision = os.environ.get("CLAUDE_ERRORS_ONLY_DECISION")
    if decision in ("allow", "ask"):
        out["permissionDecision"] = decision
    print(json.dumps({"hookSpecificOutput": out}))


main()
