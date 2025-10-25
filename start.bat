@echo off
echo ========================================
echo   Starting AskGPT Chatbot
echo ========================================
echo.

echo [1/3] Checking if ports are available...
echo.

REM Start Backend
echo [2/3] Starting Backend Server...
cd server
start "AskGPT Backend" cmd /k "npm run dev"
cd ..

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Wait up to 15 seconds for server\.port file and update client\.env
for /l %%i in (1,1,15) do (
	if exist server\.port goto :gotport
	timeout /t 1 /nobreak >nul
)
echo Timed out waiting for server\.port, continuing...
goto :afterport

:gotport
set /p BACKEND_PORT=<server\.port
echo Detected backend port: %BACKEND_PORT%
echo Updating client\.env VITE_API_URL to use port %BACKEND_PORT%
powershell -Command "(Get-Content client\.env -ErrorAction SilentlyContinue) -replace '^VITE_API_URL=.*','VITE_API_URL=http://localhost:%BACKEND_PORT%/api' | Set-Content client\.env"

:afterport

REM Start Frontend
echo [3/3] Starting Frontend...
cd client
start "AskGPT Frontend" cmd /k "npm run dev"
cd ..

echo.
echo ========================================
echo   Both servers are starting!
echo ========================================
echo.
echo Backend will run on port 5000 (or next available)
echo Frontend will run on port 5173 (or next available)
echo.
echo Check the opened terminal windows for URLs
echo ========================================
