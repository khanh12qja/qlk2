$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "dev-common.ps1")

$Host.UI.RawUI.WindowTitle = "qlk2 API $ApiPort"
Set-DevNodePath
Set-Location (Join-Path $Root "apps\api")

Write-Host "API dang chay o http://localhost:$ApiPort/api"
& "nest.cmd" start --watch
