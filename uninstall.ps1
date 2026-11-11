# Desinstala la NSDD Software Factory de la config de OpenCode.
# Uso: .\uninstall.ps1 [-Target <dir>]
param([string]$Target = "")
$ErrorActionPreference = "Stop"
if (-not $Target) { $Target = Join-Path $env:USERPROFILE ".config\opencode" }
Remove-Item -Recurse -Force (Join-Path $Target "skills\software-factory") -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force (Join-Path $Target "agents\factory") -ErrorAction SilentlyContinue
Remove-Item -Force (Join-Path $Target "commands\factory.md") -ErrorAction SilentlyContinue
Write-Host "OK: software-factory desinstalado de $Target"
