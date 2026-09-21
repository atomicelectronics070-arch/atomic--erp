@echo off
title ATOMIC ERP - DESPLIEGUE FORZADO A VERCEL PRODUCCION
color 0A
cls
echo ====================================================================
echo        ATOMIC ERP - ACTUALIZACION INMEDIATA A PRODUCCION
echo ====================================================================
echo.
cd /d "C:\Users\SANTIAGO\.gemini\antigravity\scratch\atomic--erp"

echo [1/4] Asegurando rama main...
git checkout -B main

echo.
echo [2/4] Preparando archivos modificados en Git...
git add -A

echo.
echo [3/4] Creando commit oficial...
git commit -m "fix(build): reparacion refs git, import useState y compilacion limpia Vercel"

echo.
echo [4/4] Subiendo a GitHub en ramas MAIN y MASTER (dispara Vercel Production)...
git push origin main --force
git push origin main:master --force

echo.
echo ====================================================================
echo   EXITO: Todos los cambios han sido enviados a GitHub!
echo   Vercel esta compilando la version en vivo ahora mismo.
echo   En 60 a 90 segundos recarga tu navegador (Ctrl + F5).
echo ====================================================================
echo.
pause
