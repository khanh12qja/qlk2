$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "dev-common.ps1")

$Host.UI.RawUI.WindowTitle = "qlk2 Web $WebPort"
Set-DevNodePath
$env:NEXT_PUBLIC_API_BASE_URL = "http://localhost:$ApiPort/api"
Set-Location (Join-Path $Root "apps\web")

Write-Host "Web dang chay o http://localhost:$WebPort"
& "next.cmd" dev -p $WebPort
