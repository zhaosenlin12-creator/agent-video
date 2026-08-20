#Requires -Version 5.1
<#
.SYNOPSIS
  Agent Video 一键环境准备 + 渲染示例
.DESCRIPTION
  自动安装 npm + pip 依赖，验证 ffmpeg 可用，然后渲染示例视频。
  失败会立即停下并给出修复建议。
.NOTES
  用法: powershell -NoProfile -ExecutionPolicy Bypass -File .\bootstrap.ps1
#>

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
if (-not $root) { $root = (Get-Location).Path }
Write-Host ""
Write-Host "=== Agent Video Bootstrap ===" -ForegroundColor Cyan
Write-Host "Root: $root"
Write-Host ""

# 1. 检查 Node / npm / python / ffmpeg
function Require($name, $cmd, $minVer) {
  Write-Host -NoNewline "[CHECK] $name ... "
  try {
    $ver = & $cmd 2>&1 | Select-Object -First 1
    if ($ver) { Write-Host "OK ($ver)" -ForegroundColor Green; return $true }
    else       { Write-Host "FAIL" -ForegroundColor Red; return $false }
  } catch {
    Write-Host "FAIL (not found)" -ForegroundColor Red; return $false
  }
}

$ok = $true
$ok = (Require "Node.js (>=20)" { node --version }) -and $ok
$ok = (Require "npm"            { npm --version }) -and $ok
$ok = (Require "Python (>=3.10)" { python --version }) -and $ok
$ok = (Require "ffmpeg"          { ffmpeg -version }) -and $ok
$ok = (Require "ffprobe"         { ffprobe -version }) -and $ok
$ok = (Require "ffplay"          { ffplay -version }) -and $ok

if (-not $ok) {
  Write-Host ""
  Write-Host "Some prerequisites missing. Install them first:" -ForegroundColor Red
  Write-Host "  Node 20+   : https://nodejs.org/"
  Write-Host "  Python 3.10+: https://www.python.org/"
  Write-Host "  ffmpeg 6.x : https://www.gyan.dev/ffmpeg/builds/ (add to PATH)"
  exit 1
}

# 2. 安装 Python 包
Write-Host ""
Write-Host "[STEP] pip install pillow edge-tts" -ForegroundColor Cyan
pip install --quiet pillow edge-tts 2>&1 | Select-Object -Last 5

# 3. npm install
Write-Host ""
Write-Host "[STEP] npm install (Remotion + React 19)" -ForegroundColor Cyan
Push-Location $root
try {
  npm install 2>&1 | Select-Object -Last 10
} finally {
  Pop-Location
}

# 4. 渲染示例
Write-Host ""
Write-Host "[STEP] npm run build-h264 (示例: 水火箭)" -ForegroundColor Cyan
Write-Host "    This takes ~85 seconds for the h264 final render." -ForegroundColor Yellow
Push-Location $root
try {
  npm run build-h264 2>&1 | Select-Object -Last 20
} finally {
  Pop-Location
}

# 5. 一键验收
Write-Host ""
Write-Host "[STEP] qa/qa_check.ps1 (一键验收)" -ForegroundColor Cyan
& "$root\qa\qa_check.ps1"

Write-Host ""
Write-Host "=== Bootstrap complete ===" -ForegroundColor Cyan
Write-Host "Sample MP4: $root\out\water-rocket-h264.mp4"
Write-Host "Edit src\data.ts to make your own video, then re-run:  npm run build-h264"
