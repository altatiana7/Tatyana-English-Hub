@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Планнер
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
echo.
echo Сервер остановлен. Если планнер не открылся — текст ошибки выше.
pause
