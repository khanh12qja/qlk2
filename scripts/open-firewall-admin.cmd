@echo off
net session >nul 2>&1
if %errorlevel% neq 0 (
  echo Vui long bam chuot phai file nay va chon "Run as administrator".
  pause
  exit /b 1
)

netsh advfirewall firewall add rule name="qlkhokeyen2 web 3005" dir=in action=allow protocol=TCP localport=3005
netsh advfirewall firewall add rule name="qlkhokeyen2 api 4005" dir=in action=allow protocol=TCP localport=4005

echo Da mo firewall cho web 3005 va API 4005.
pause
