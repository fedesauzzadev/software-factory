#!/usr/bin/env bash
# Desinstala la NSDD Software Factory.
# Uso: ./uninstall.sh [--target <dir>]
set -euo pipefail
TARGET=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --target) TARGET="$2"; shift 2 ;;
    *) shift ;;
  esac
done
[ -z "$TARGET" ] && TARGET="$HOME/.config/opencode"
rm -rf "$TARGET/skills/software-factory" "$TARGET/agents/factory"
rm -f "$TARGET/commands/factory.md"
echo "OK: software-factory desinstalado de $TARGET"
