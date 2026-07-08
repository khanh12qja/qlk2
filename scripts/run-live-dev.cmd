@echo off
cd /d "%~dp0.."
set "NODE_EXE=C:\Users\User\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if not exist "%NODE_EXE%" set "NODE_EXE=node.exe"
echo live-start %date% %time% > dev.live.out.log
"%NODE_EXE%" scripts\dev-all.mjs >> dev.live.out.log 2>> dev.live.err.log
echo live-end %date% %time% >> dev.live.out.log
