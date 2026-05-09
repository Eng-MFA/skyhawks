@echo off
echo ========================================
echo   SKYHAWKS Backend Server
echo ========================================
echo.
cd /d "%~dp0"
echo Starting backend on http://localhost:5000
echo Admin Panel: http://localhost:5000/admin
echo.
node server.js
pause
