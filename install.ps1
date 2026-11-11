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

Write-Host "OK: skill 'software-factory' + agents factory/* + comando /factory instalados en $Target"
Write-Host "Nota: la fábrica usa brainloom (skills init-brain/triage/memory-update). Sin brainloom no hay memoria."
