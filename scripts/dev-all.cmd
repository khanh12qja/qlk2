@echo off
cd /d "%~dp0.."
set NODE_EXE=node.exe
if exist "C:\Users\User\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" set NODE_EXE=C:\Users\User\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe
"%NODE_EXE%" "%~dp0dev-all.mjs"
pause
