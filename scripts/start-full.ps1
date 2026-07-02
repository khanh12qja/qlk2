$ErrorActionPreference = "Stop"

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location $root
$nodeExe = "C:\Program Files\nodejs\node.exe"
$npmCmd = "C:\Program Files\nodejs\npm.cmd"

Write-Host "Dang mo MongoDB..."
$mongoExe = Join-Path $root ".local\mongodb\mongodb-win32-x86_64-windows-8.0.26\bin\mongod.exe"
$mongoDb = Join-Path $root ".local\mongodb\data\db"
New-Item -ItemType Directory -Force -Path $mongoDb | Out-Null

Start-Process `
  -FilePath $mongoExe `
  -ArgumentList @("--dbpath", $mongoDb, "--bind_ip", "127.0.0.1", "--port", "27017") `
  -WorkingDirectory $root

Start-Sleep -Seconds 8

Write-Host "Dang nap du lieu demo..."
& $nodeExe scripts\seed-ptk992-demo.mjs

Write-Host ""
Write-Host "Dang mo API..."
Start-Process `
  -FilePath $npmCmd `
  -ArgumentList @("run", "dev") `
  -WorkingDirectory (Join-Path $root "apps\api")

Start-Sleep -Seconds 12

Write-Host ""
Write-Host "Dang mo Web..."
Write-Host "Web tren may nay: http://localhost:3005"
Write-Host "Web cung mang:    http://192.168.1.15:3005"
Write-Host "API:              http://192.168.1.15:4005/api"
Write-Host ""
Write-Host "Cho den khi thay chu Ready roi hay mo link. Dung dong cua so nay khi dang su dung."
& $npmCmd run dev -w @erp/web
