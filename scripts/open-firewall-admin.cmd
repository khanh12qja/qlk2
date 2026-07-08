@echo off
net session >nul 2>&1
if %errorlevel% neq 0 (
  echo Vui long bam chuot phai file nay va chon "Run as administrator".
  pause
  exit /b 1
)

netsh advfirewall firewall add rule name="qlk2 web 3015" dir=in action=allow protocol=TCP localport=3015
netsh advfirewall firewall add rule name="qlk2 api 4015" dir=in action=allow protocol=TCP localport=4015

echo Da mo firewall cho web 3015 va API 4015.
pause
