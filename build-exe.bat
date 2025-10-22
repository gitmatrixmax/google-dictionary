@echo off
echo ================================
echo    Building Windows Executable
echo ================================

echo.
echo 📦 Step 1: Building frontend...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo ❌ Frontend build failed!
    pause
    exit /b 1
)

echo.
echo 🔧 Step 2: Creating executable...
call pkg . --targets node18-win-x64 --out-path dist-exe
if %ERRORLEVEL% neq 0 (
    echo ❌ Executable creation failed!
    pause
    exit /b 1
)

echo.
echo 📁 Step 3: Copying files...
if exist "dist-exe\client" rmdir /s /q "dist-exe\client"
xcopy "client\dist" "dist-exe\client\dist\" /e /i /y > nul
copy ".env" "dist-exe\" > nul
copy "run-dictionary.bat" "dist-exe\" > nul

echo.
echo 📄 Step 4: Creating documentation...
echo Dictionary App executable package created successfully! > "dist-exe\README.txt"
echo. >> "dist-exe\README.txt"
echo To run the application: >> "dist-exe\README.txt"
echo 1. Double-click run-dictionary.bat >> "dist-exe\README.txt"
echo 2. Open http://localhost:4000 in your browser >> "dist-exe\README.txt"

echo.
echo ✅ Windows executable created successfully!
echo.
echo 📦 Package location: dist-exe\
echo 📋 Package contents:
dir /b "dist-exe\"
echo.
echo 🚀 To test: Run "dist-exe\run-dictionary.bat"
echo.
pause