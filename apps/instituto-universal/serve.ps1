# serve.ps1 — Levanta el IMPERIO EDUCATIVO local
# Uso: .\serve.ps1  →  http://localhost:8000  (Instituto Universal)
[CmdletBinding()]
param([int]$Port = 8000)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$py = Get-Command python -ErrorAction SilentlyContinue

if (-not $py) {
  Write-Host "[X] Python no encontrado. Instalalo o usa: npx http-server"
  exit 1
}

Write-Host "[+] Instituto Universal -> http://localhost:$Port"
Write-Host "[+] Para JUDAS EXPERIENCE: http://localhost:$Port/judas"
Write-Host "[+] Ctrl+C para apagar"

$judas = "C:\Users\USER\Documents\01_PROYECTOS\judas-experience\docs"
$link = Join-Path $root "judas"
if ((Test-Path $judas) -and -not (Test-Path $link)) {
  New-Item -ItemType Junction -Path $link -Target $judas -ErrorAction SilentlyContinue | Out-Null
}

Set-Location $root
python -m http.server $Port
