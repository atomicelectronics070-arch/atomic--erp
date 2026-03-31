@echo off
TITLE ATOMIC ERP - Sistema de Inicio Automatico
echo ==========================================
echo   INICIANDO SISTEMA ATOMIC CONTIGO
echo ==========================================

:: Configuración de Rutas
set PROJECT_DIR=%~dp0
set CLOUDFLARED_EXE="%PROJECT_DIR%cloudflared.exe"
if not exist %CLOUDFLARED_EXE% set CLOUDFLARED_EXE="C:\Users\SANTIAGO\Downloads\cloudflared-windows-amd64.exe"
if not exist %CLOUDFLARED_EXE% set CLOUDFLARED_EXE="C:\Users\HP I7\Downloads\cloudflared-windows-amd64.exe"
if not exist %CLOUDFLARED_EXE% set CLOUDFLARED_EXE="C:\cloudflared\cloudflared-windows-amd64.exe"
if not exist %CLOUDFLARED_EXE% set CLOUDFLARED_EXE=cloudflared.exe

:: Limpiar procesos previos si existen
echo [0/2] Limpiando procesos antiguos...
taskkill /F /IM node.exe /T >nul 2>&1
taskkill /F /IM cloudflared.exe /T >nul 2>&1

echo [1/3] Iniciando Servidor Next.js en puerto 3000...
cd /d "%PROJECT_DIR%"
:: Iniciamos el servidor en una nueva ventana minimizada
start "Atomic Server" /min cmd /c "npm run dev"

echo [2/3] Iniciando Servidor Scraper Pro en puerto 5005...
cd /d "%PROJECT_DIR%..\..\scraper-pro\server"
start "Scraper Server" /min cmd /c "node index.js"

echo [3/3] Iniciando Tunel de Cloudflare...
:: Esperamos 15 segundos para que los servidores levanten
timeout /t 15 /nobreak > nul

echo Conectando app.atomiccotizador.shop...
:: Ejecutamos el túnel.
%CLOUDFLARED_EXE% tunnel run ed3713af-488c-4438-91ae-31760111735a

echo ==========================================
echo   SISTEMA EN LINEA
echo ==========================================
pause
