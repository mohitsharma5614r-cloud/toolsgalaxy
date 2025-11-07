@echo off
echo ========================================
echo   Starting All ToolsGalaxy Servers
echo ========================================
echo.
echo Starting Backend Servers...
echo.
echo [1/3] TikTok Proxy Server (Port 3001)
start "TikTok Server" cmd /k "npm run server"
timeout /t 2 /nobreak >nul
echo.
echo [2/3] YouTube Proxy Server (Port 3002)
start "YouTube Server" cmd /k "npm run youtube-server"
timeout /t 2 /nobreak >nul
echo.
echo [3/3] Frontend Server (Port 3000)
start "Frontend" cmd /k "npm run dev"
echo.
echo ========================================
echo   All Servers Started!
echo ========================================
echo.
echo Frontend:  http://localhost:3000
echo TikTok:    http://localhost:3001
echo YouTube:   http://localhost:3002
echo.
echo Press any key to exit...
pause >nul
