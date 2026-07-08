@echo off
title qlk2 MongoDB 27019
set ROOT=G:\codekeyen\qlk2
set MONGO=
for /f "delims=" %%i in ('where mongod.exe 2^>nul') do if not defined MONGO set MONGO=%%i
if not defined MONGO if exist "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" set MONGO=C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe
if not defined MONGO if exist "%ROOT%\.local\mongodb\mongodb-win32-x86_64-windows-8.0.26\bin\mongod.exe" set MONGO=%ROOT%\.local\mongodb\mongodb-win32-x86_64-windows-8.0.26\bin\mongod.exe
set DB=%ROOT%\.local\mongodb\data\dev-light-27019
set LOG=%ROOT%\.local\mongodb\logs\mongod-27019.log

if not defined MONGO (
  echo Khong tim thay mongod.exe. Hay cai MongoDB hoac them mongod vao PATH.
  pause
  exit /b 1
)

if not exist "%DB%" mkdir "%DB%"
echo MongoDB dang chay o mongodb://localhost:27019/aluminium_glass_erp
"%MONGO%" --dbpath "%DB%" --bind_ip 127.0.0.1 --port 27019 --wiredTigerCacheSizeGB 0.25 --setParameter diagnosticDataCollectionEnabled=false --logpath "%LOG%" --logappend
pause
