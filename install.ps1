# Instala la NSDD Software Factory en la config global de OpenCode.
# Uso:  .\install.ps1 [-Target <dir>]
# Bootstrap (sin clonar):  irm <repo>/install.ps1 | iex
param([string]$Target = "")

$ErrorActionPreference = "Stop"
$RepoUrl = "https://github.com/fedesauzzadev/software-factory.git"
if (-not $Target) { $Target = Join-Path $env:USERPROFILE ".config\opencode" }

$src = $PSScriptRoot
# Bootstrap: si el script corre suelto (pipe), clona el kit primero
if (-not (Test-Path (Join-Path $src "skills\software-factory"))) {
  $tmp = New-Item -ItemType Directory -Force (Join-Path $env:TEMP "nsdd-factory-install")
  if (Test-Path (Join-Path $tmp ".git")) { Remove-Item -Recurse -Force $tmp; $tmp = New-Item -ItemType Directory -Force (Join-Path $env:TEMP "nsdd-factory-install") }
  git clone --depth 1 $RepoUrl $tmp
  $src = $tmp
}

# Skill
$skillsDir = Join-Path $Target "skills"
New-Item -ItemType Directory -Force $skillsDir | Out-Null
Copy-Item -Recurse -Force (Join-Path $src "skills\software-factory") (Join-Path $skillsDir "software-factory")

# Agents
$agentsDir = Join-Path $Target "agents\factory"
New-Item -ItemType Directory -Force $agentsDir | Out-Null
Copy-Item -Force (Join-Path $src "agents\factory\*.md") $agentsDir

# Comando /factory
$cmdsDir = Join-Path $Target "commands"
New-Item -ItemType Directory -Force $cmdsDir | Out-Null
Copy-Item -Force (Join-Path $src "commands\factory.md") $cmdsDir

# brainloom (vendored) - memoria de la fabrica. Upgrade solo hacia adelante:
# actualiza si la vendida es mas nueva; nunca pisa una instalada mas nueva.
$blInstaller = Join-Path $src "vendor\brainloom\adapters\opencode\install.mjs"
if (Get-Command node -ErrorAction SilentlyContinue) {
  $vendored = (Get-Content (Join-Path $src "vendor\brainloom\VERSION") -Raw).Trim()
  $manifest = Join-Path $Target "brainloom.kit.json"
  $vNew = [version]$vendored; $vOld = $null
  if (Test-Path $manifest) { try { $vOld = [version]((Get-Content $manifest -Raw | ConvertFrom-Json).kit_version) } catch {} }
  if ($vOld -and $vOld -gt $vNew) {
    Write-Host "brainloom instalada ($vOld) es mas nueva que la vendida ($vendored); se conserva la tuya."
  } else {
    $blArgs = @("--config-dir", $Target)
    if ($vOld -and $vOld -lt $vNew) { $blArgs += "--force"; Write-Host "Actualizando brainloom $vOld -> $vendored" }
    node $blInstaller @blArgs
    if ($LASTEXITCODE -ne 0) { Write-Host "NOTA: brainloom reporto colisiones (archivos locales modificados). No se sobreescribio nada; node $blInstaller --force si queres pisarlos." }
  }
} else {
  Write-Host "AVISO: node no esta en PATH - brainloom (memoria de la fabrica) NO se instalo. Instalalo y re-ejecuta."
}

Write-Host "OK: skill 'software-factory' + agents factory/* + comando /factory + brainloom instalados en $Target"
