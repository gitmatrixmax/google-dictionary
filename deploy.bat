@echo off
REM Dictionary App Docker Deployment Script for Windows

echo 🐳 Dictionary App Docker Deployment
echo ==================================

REM Build the Docker image
echo 📦 Building Docker image...
docker build -t dictionary-app:latest .

if %ERRORLEVEL% neq 0 (
    echo ❌ Build failed!
    exit /b 1
)

echo ✅ Build complete!

REM Check if .env file exists
if not exist .env (
    echo ⚠️  Warning: .env file not found. Creating from example...
    copy .env.example .env
    echo 📝 Please edit .env file with your API keys before running the container.
    exit /b 1
)

REM Run the container
echo 🚀 Starting container...
docker run -d --name dictionary-app --restart unless-stopped -p 4000:4000 --env-file .env dictionary-app:latest

if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to start container!
    exit /b 1
)

echo ✅ Container started successfully!
echo 🌐 Application available at: http://localhost:4000
echo.
echo 📋 Useful commands:
echo   View logs: docker logs dictionary-app
echo   Stop app:  docker stop dictionary-app
echo   Remove:    docker rm dictionary-app