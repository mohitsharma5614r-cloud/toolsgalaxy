@echo off
echo Starting TikTok Downloader...
echo.
echo Starting Backend Server (Port 3001)...
start cmd /k "npm run server"
timeout /t 2 /nobreak >nul
echo.
echo Starting Frontend Server (Port 3000)...
start cmd /k "npm run dev"
echo.
echo Both servers are starting...
echo Frontend: http://localhost:3000
echo Backend: http://localhost:3001
echo.
pause
