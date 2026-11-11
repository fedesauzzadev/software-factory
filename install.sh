#!/usr/bin/env bash
# Instala la NSDD Software Factory en la config de OpenCode.
# Uso:  ./install.sh [--target <dir>]
# Bootstrap (sin clonar):  curl -fsSL <repo>/install.sh | bash
set -euo pipefail

REPO_URL="https://github.com/fedesauzzadev/software-factory.git"
TARGET=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --target) TARGET="$2"; shift 2 ;;
    *) shift ;;
  esac
done
[ -z "$TARGET" ] && TARGET="$HOME/.config/opencode"

SRC="$(cd "$(dirname "$0")" && pwd)"
# Bootstrap: si el script corre suelto (pipe), clona el kit primero
if [ ! -d "$SRC/skills/software-factory" ]; then
  TMP="$(mktemp -d)"
  git clone --depth 1 "$REPO_URL" "$TMP/kit"
  SRC="$TMP/kit"
fi

mkdir -p "$TARGET/skills" "$TARGET/agents/factory" "$TARGET/commands"
cp -r "$SRC/skills/software-factory" "$TARGET/skills/software-factory"
cp "$SRC"/agents/factory/*.md "$TARGET/agents/factory/"
cp "$SRC/commands/factory.md" "$TARGET/commands/"

echo "OK: skill 'software-factory' + agents factory/* + comando /factory instalados en $TARGET"
echo "Nota: la fábrica usa brainloom (skills init-brain/triage/memory-update). Sin brainloom no hay memoria."
