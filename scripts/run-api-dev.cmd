@echo off
title qlk2 API 4015
set ROOT=G:\codekeyen\qlk2
set PATH=C:\Users\User\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;%ROOT%\node_modules\.bin;%PATH%
cd /d "%ROOT%\apps\api"
echo API dang chay o http://localhost:4015/api
nest.cmd start --watch
pause
