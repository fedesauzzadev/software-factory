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

# brainloom (vendored) — memoria de la fábrica
if command -v node >/dev/null 2>&1; then
  if ! node "$SRC/vendor/brainloom/adapters/opencode/install.mjs" --config-dir "$TARGET"; then
    echo "NOTA: brainloom reportó colisiones (hay una versión distinta instalada). No se sobreescribió nada; se usa la existente."
  fi
else
  echo "AVISO: node no está en PATH — brainloom (memoria de la fábrica) NO se instaló. Instalalo y re-ejecuta."
fi

echo "OK: skill 'software-factory' + agents factory/* + comando /factory + brainloom instalados en $TARGET"
