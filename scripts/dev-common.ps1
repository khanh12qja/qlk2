$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$ApiPort = 4015
$WebPort = 3015
$MongoPort = 27019

function Find-FirstExistingPath {
  param([string[]] $Paths)
  foreach ($path in $Paths) {
    if ($path -and (Test-Path $path)) {
      return (Resolve-Path $path).Path
    }
  }
  return $null
}

function Resolve-NodeBin {
  $node = Get-Command node.exe -ErrorAction SilentlyContinue
  if ($node) {
    return Split-Path $node.Source -Parent
  }

  $bundledNode = Find-FirstExistingPath @(
    "C:\Users\User\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe",
    "C:\Users\User\.cache\codex-runtimes\codex-runtime-install-PrHEqh\payload\codex-primary-runtime\dependencies\node\bin\node.exe"
  )

  if ($bundledNode) {
    return Split-Path $bundledNode -Parent
  }

  throw "Khong tim thay Node.js. Hay cai Node.js hoac them node.exe vao PATH."
}

function Resolve-Mongod {
  $mongod = Get-Command mongod.exe -ErrorAction SilentlyContinue
  if ($mongod) {
    return $mongod.Source
  }

  $installed = Get-ChildItem "C:\Program Files\MongoDB\Server" -Recurse -Filter mongod.exe -ErrorAction SilentlyContinue |
    Sort-Object FullName -Descending |
    Select-Object -First 1

  if ($installed) {
    return $installed.FullName
  }

  $local = Join-Path $Root ".local\mongodb\mongodb-win32-x86_64-windows-8.0.26\bin\mongod.exe"
  if (Test-Path $local) {
    return $local
  }

  throw "Khong tim thay mongod.exe. Hay cai MongoDB hoac them mongod.exe vao PATH."
}

function Set-DevNodePath {
  $nodeBin = Resolve-NodeBin
  $binPath = Join-Path $Root "node_modules\.bin"
  if (-not (Test-Path (Join-Path $binPath "nest.cmd"))) {
    throw "Chua thay node_modules. Hay chay npm install truoc."
  }

  $env:PATH = "$nodeBin;$binPath;" + $env:PATH
}
