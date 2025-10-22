@echo off
title Dictionary App

echo ================================
echo      Dictionary App v1.0
echo ================================
echo.

REM Check if .env file exists
if exist .env (
    echo ✅ Found .env file with API keys
) else (
    echo ⚠️  Warning: .env file not found
    echo Creating .env file from template...
    
    echo GOOGLE_API_KEY=your_google_api_key > .env
    echo GOOGLE_CX_ID=your_search_engine_id >> .env
    echo RAPIDAPI_KEY=your_rapidapi_key >> .env
    echo.
    echo 📝 Please edit .env file with your actual API keys
    echo    Then run this script again
    echo.
    pause
    exit /b 1
)

echo.
echo 🚀 Starting Dictionary App...
echo.
echo 🌐 Open your browser and go to: http://localhost:4000
echo.
echo 📋 Press Ctrl+C to stop the server
echo.

REM Start the executable
dictionary-app.exe

echo.
echo 👋 Dictionary App stopped
pause