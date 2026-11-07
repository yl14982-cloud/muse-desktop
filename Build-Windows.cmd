@echo off
setlocal
cd /d "%~dp0"
where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo Node.js LTS is not installed or not on PATH.
  echo Install it from https://nodejs.org/ and reopen this file.
  pause
  exit /b 1
)
echo [1/3] Installing dependencies ...
call npm.cmd ci --foreground-scripts --ignore-scripts=false
if errorlevel 1 goto failed
echo [2/3] Running checks ...
call npm.cmd run check
if errorlevel 1 goto failed
call npm.cmd test
if errorlevel 1 goto failed
echo [3/3] Building Windows EXE files ...
call npm.cmd run dist:win
if errorlevel 1 goto failed
echo.
echo Build complete. Check the dist folder.
pause
exit /b 0
:failed
echo.
echo Build failed. Please save the last error lines for debugging.
pause
exit /b 1
