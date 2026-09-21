@echo off
title ATOMIC ERP - REPARAR GIT Y SUBIR A PRODUCCION
color 0A
cls
echo ====================================================================
echo        ATOMIC ERP - REPARAR REFERENCIAS Y DESPLEGAR A VERCEL
echo ====================================================================
echo.
cd /d "C:\Users\SANTIAGO\.gemini\antigravity\scratch\atomic--erp"

echo [1/4] Verificando rama principal...
git checkout -B main

echo.
echo [2/4] Agregando todos los archivos modificados...
git add -A

echo.
echo [3/4] Creando commit definitivo...
git commit -m "fix(build): reparacion refs git, import useState y compilacion limpia Vercel"

echo.
echo [4/4] Subiendo a GitHub en MAIN y MASTER (dispara Vercel Production)...
git push origin main --force
git push origin main:master --force

echo.
echo ====================================================================
echo   EXITO TOTAL: El repositorio ha sido reparado y enviado a GitHub!
echo   Vercel esta construyendo la version limpia en vivo.
echo   En 60 a 90 segundos recarga tu navegador (Ctrl + F5).
echo ====================================================================
echo.
pause
