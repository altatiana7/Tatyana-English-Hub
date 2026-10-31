@echo off
chcp 65001 >nul
cd /d "%~dp0"

if not exist "planner.html" (
  echo Не найден planner.html рядом с этим файлом.
  echo Распакуйте архив целиком, не по одному файлу.
  pause
  exit /b 1
)

echo Запускаю планнер...
start "" powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
ping -n 3 127.0.0.1 >nul
start "" "http://127.0.0.1:8765/"

echo.
echo Открылся браузер. Чёрное окно закрывать нельзя, пока работаете.
echo Закончили — закройте это окно.
timeout /t 4 >nul
