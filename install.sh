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

# brainloom (vendored) — memoria de la fábrica. Upgrade solo hacia adelante:
# actualiza si la vendida es más nueva; nunca pisa una instalada más nueva.
if command -v node >/dev/null 2>&1; then
  vendored="$(cat "$SRC/vendor/brainloom/VERSION")"
  IFS='|' read -r installed cmp <<< "$(node -e '
    const fs = require("fs");
    let v = "";
    try { v = (JSON.parse(fs.readFileSync(process.argv[1] + "/brainloom.kit.json", "utf8")) || {}).kit_version || ""; } catch {}
    const c = (a, b) => {
      const p = s => s.split(".").map(Number); const x = p(a), y = p(b);
      for (let i = 0; i < Math.max(x.length, y.length); i++) {
        const d = (x[i] || 0) - (y[i] || 0); if (d) return d < 0 ? -1 : 1;
      } return 0;
    };
    console.log((v || "none") + "|" + (v ? c(v, process.argv[2]) : "none"));
  ' "$TARGET" "$vendored")"
  if [ "$cmp" = "1" ]; then
    echo "brainloom instalada ($installed) es más nueva que la vendida ($vendored); se conserva la tuya."
  else
    bl_args=( )
    if [ "$cmp" = "-1" ]; then bl_args=( --force ); echo "Actualizando brainloom $installed → $vendored"; fi
    if ! node "$SRC/vendor/brainloom/adapters/opencode/install.mjs" --config-dir "$TARGET" ${bl_args[@]+"${bl_args[@]}"}; then
      echo "NOTA: brainloom reportó colisiones (archivos locales modificados). No se sobrescribió nada; se usa la existente."
    fi
  fi
else
  echo "AVISO: node no está en PATH — brainloom (memoria de la fábrica) NO se instaló. Instalalo y re-ejecuta."
fi

echo "OK: skill 'software-factory' + agents factory/* + comando /factory + brainloom instalados en $TARGET"
