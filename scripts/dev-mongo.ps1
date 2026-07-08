$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "dev-common.ps1")

$Host.UI.RawUI.WindowTitle = "qlk2 MongoDB $MongoPort"
$mongod = Resolve-Mongod
$mongoDb = Join-Path $Root ".local\mongodb\data\dev-27019"
$mongoLog = Join-Path $Root ".local\mongodb\logs\mongod-27019.log"

New-Item -ItemType Directory -Force -Path $mongoDb | Out-Null
New-Item -ItemType Directory -Force -Path (Split-Path $mongoLog -Parent) | Out-Null

Write-Host "MongoDB dang chay o mongodb://localhost:$MongoPort/aluminium_glass_erp"
& $mongod --dbpath $mongoDb --bind_ip 127.0.0.1 --port $MongoPort --wiredTigerCacheSizeGB 0.25 --setParameter diagnosticDataCollectionEnabled=false --logpath $mongoLog --logappend
