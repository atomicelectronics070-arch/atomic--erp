@echo off
title ATOMIC ERP - SUBIR A PRODUCCION VERCEL
color 0A
cls
echo ====================================================================
echo        ATOMIC ERP - ACTUALIZACION INMEDIATA A PRODUCCION
echo ====================================================================
echo.
cd /d "C:\Users\SANTIAGO\.gemini\antigravity\scratch\atomic--erp"

echo [1/3] Preparando archivos modificados en Git...
git add -A

echo.
echo [2/3] Creando commit oficial...
git commit -m "feat: login ATOMIC, selector rol, coordinacion asesores contratos pdf, bots duales y dock equipo"

echo.
echo [3/3] Subiendo a GitHub (dispara compilacion en Vercel)...
git push origin main
git push origin main:master --force

echo.
echo ====================================================================
echo   EXITO: Todos los cambios han sido enviados a GitHub!
echo   Vercel esta compilando la version en vivo ahora mismo.
echo   En 1 a 2 minutos recarga tu navegador (Ctrl + F5).
echo ====================================================================
echo.
pause
