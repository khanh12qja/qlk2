@echo off
title qlk2 Web 3015
set ROOT=G:\codekeyen\qlk2
set PATH=C:\Users\User\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;%ROOT%\node_modules\.bin;%PATH%
cd /d "%ROOT%\apps\web"
set NEXT_PUBLIC_API_BASE_URL=http://localhost:4015/api
echo Web dang chay o http://localhost:3015
next.cmd dev -p 3015
pause
