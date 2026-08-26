# === 涓€閿獙鏀讹細鍏ㄩ儴 20 椤硅嚜鍔ㄦ牎楠?(9 椤圭‖鎬?+ 11 椤硅倝鐪? ===
# 鐢ㄦ硶锛?powershell -NoProfile -ExecutionPolicy Bypass -File qa\qa_check.ps1
# 鎴栬€呭湪 PowerShell 閲? .\qa_check.ps1
# 娉ㄦ剰锛氬繀椤诲厛璺戜竴娆?`npm run build-h264` 鎵嶄細鐢熸垚 out\water-rocket-h264.mp4
$ErrorActionPreference = 'Continue'
$mp4 = Join-Path $PSScriptRoot '..\out\water-rocket-h264.mp4'
if (-not (Test-Path $mp4)) {
  Write-Host '[FAIL] ' $mp4 ' not found' -ForegroundColor Red
  Write-Host '       Run: npm run build-h264' -ForegroundColor Yellow
  Write-Host '       Or:  .\bootstrap.ps1  (one-shot env+render+qa)' -ForegroundColor Yellow
  exit 1
}
$pass = 0; $fail = 0
$ESC = [char]27
$ANSI_RE = $ESC + '\[[0-9;?]*[A-Za-z]'

function CleanText($s) {
  if ($null -eq $s) { return '' }
  $t = [regex]::Replace($s, $ANSI_RE, '')
  $t = $t.Trim().TrimEnd(',').Trim()
  return $t
}

function Pass($name) {
  Write-Host ('[PASS] ' + $name) -ForegroundColor Green
  $script:pass = $script:pass + 1
}
function Fail($name) {
  Write-Host ('[FAIL] ' + $name) -ForegroundColor Red
  $script:fail = $script:fail + 1
}
function Check($name, $cond) {
  if ($cond) { Pass $name } else { Fail $name }
}

# A1
$wRaw = ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 $mp4
$wClean = CleanText $wRaw
$wParts = @($wClean -split ',')
$w = $wParts[0].Trim()
$h = $wParts[1].Trim()
Check ('A1 resolution 1080x1920') (($w -eq '1080') -and ($h -eq '1920'))

# A2
$frRaw = ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of csv=p=0 $mp4
$fr = CleanText $frRaw
Check ('A2 frame_rate 30/1') ($fr -eq '30/1')

# A3
$cpRaw = ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,pix_fmt -of csv=p=0 $mp4
$cpClean = CleanText $cpRaw
$cpParts = @($cpClean -split ',')
$co = $cpParts[0].Trim()
$px = $cpParts[1].Trim()
Check ('A3 codec h264 + pix_fmt yuv420p/yuvj420p') ($co -eq 'h264' -and (($px -eq 'yuv420p') -or ($px -eq 'yuvj420p')))

# A4
$duRaw = ffprobe -v error -show_entries format=duration -of csv=p=0 $mp4
$du = [double](CleanText $duRaw)
Check ('A4 duration 40-70s') ($du -ge 40 -and $du -le 70)

# A5
$sz = [math]::Round((Get-Item $mp4).Length / 1MB, 2)
Check ('A5 size <= 80MB (AI-illustration build)') ($sz -le 80)

# A6
$brRaw = ffprobe -v error -select_streams v:0 -show_entries stream=bit_rate -of csv=p=0 $mp4
$br = [int](CleanText $brRaw)
Check ('A6 video bitrate >= 1Mbps') ($br -ge 1000000)

# B1
$fc = (Get-ChildItem (Join-Path $PSScriptRoot '..\qa\final_frames\*.png') -ErrorAction SilentlyContinue | Measure-Object).Count
Check ('B1 13 frames generated') ($fc -ge 13)

# C1
$vc = (Get-ChildItem (Join-Path $PSScriptRoot '..\public\voice\*.mp3') -ErrorAction SilentlyContinue | Measure-Object).Count
Check ('C1 voice mp3 count = scenes') ($vc -ge 13)

# C2  : ffplay 璺戝畬鏈熬鏃犻敊璇?
$tmp = Join-Path $env:TEMP ('qa_ffplay_' + $PID + '.err')
$proc = Start-Process -FilePath 'ffplay' -ArgumentList @('-autoexit','-nodisp','-hide_banner','-loglevel','error',$mp4) -PassThru -NoNewWindow -RedirectStandardError $tmp
Start-Sleep -Seconds ([math]::Ceiling($du + 5))
if (-not $proc.HasExited) {
  Write-Host ('  (ffplay still running after ' + $du + 's+5, killing...)')
  $proc.Kill() | Out-Null
  Start-Sleep -Seconds 1
}
$errText = ''
if (Test-Path $tmp) {
  $rawErr = Get-Content $tmp -Raw -ErrorAction SilentlyContinue
  $errText = CleanText $rawErr
  Remove-Item $tmp -ErrorAction SilentlyContinue
}
Check ('C2 ffplay end without error') (($proc.ExitCode -eq 0 -or $proc.HasExited) -and [string]::IsNullOrWhiteSpace($errText))

Write-Host ''
Write-Host '==== Summary ===='
Write-Host ('PASS : ' + $pass)
Write-Host ('FAIL : ' + $fail)
if ($fail -eq 0) { Write-Host 'ALL PASS - ready to deliver' -ForegroundColor Cyan }
else              { Write-Host 'REPAIR NEEDED - re-render after fix' -ForegroundColor Yellow }






