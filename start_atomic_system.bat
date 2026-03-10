@echo off
TITLE ATOMIC ERP - Sistema de Inicio Automatico
echo ==========================================
echo   INICIANDO SISTEMA ATOMIC CONTIGO
echo ==========================================

:: Configuración de Rutas
set PROJECT_DIR=C:\Users\HP I7\.gemini\antigravity\scratch\atomic-erp
set CLOUDFLARED_EXE="C:\Users\HP I7\Downloads\cloudflared-windows-amd64.exe"

:: Limpiar procesos previos si existen
echo [0/2] Limpiando procesos antiguos...
taskkill /F /IM node.exe /T >nul 2>&1
taskkill /F /IM cloudflared.exe /T >nul 2>&1

echo [1/2] Iniciando Servidor Next.js en puerto 3000...
cd /d "%PROJECT_DIR%"
:: Iniciamos el servidor en una nueva ventana minimizada
:: Cloudflare espera el puerto 3000 por defecto según su configuración interna
start "Atomic Server" /min cmd /c "npm run dev -- -p 3000"

echo [2/2] Iniciando Tunel de Cloudflare...
:: Esperamos 10 segundos para que el servidor levante
timeout /t 10 /nobreak > nul

echo Conectando app.atomiccotizador.shop...
:: Ejecutamos el túnel.
%CLOUDFLARED_EXE% tunnel run ed3713af-488c-4438-91ae-31760111735a

echo ==========================================
echo   SISTEMA EN LINEA
echo ==========================================
pause
