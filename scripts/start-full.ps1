$ErrorActionPreference = "Stop"

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$node = "node.exe"
$bundledNode = "C:\Users\User\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if (Test-Path $bundledNode) {
  $node = $bundledNode
}

Set-Location $root
& $node (Join-Path $PSScriptRoot "dev-all.mjs")
