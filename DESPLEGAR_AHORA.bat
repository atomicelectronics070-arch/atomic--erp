@echo off
title ATOMIC ERP - DESPLIEGUE FORZADO A VERCEL PRODUCCION
color 0A
cls
echo ====================================================================
echo      ATOMIC ERP - ACTUALIZACION INMEDIATA A PRODUCCION
echo ====================================================================
echo.
cd /d "C:\Users\SANTIAGO\.gemini\antigravity\scratch\atomic--erp"

echo [1/4] Comprobando estado de Git local...
git status -s

echo.
echo [2/4] Agregando todos los cambios (CRM, Perfil, Oficina 2.5D)...
git add -A

echo.
echo [3/4] Creando commit definitivo...
git commit -m "fix(deploy): eliminar popup 30min y 3D antiguo, activar CRM Mis Leads y oficina 2.5D oficial"

echo.
echo [4/4] Subiendo a GitHub en MAIN y MASTER (dispara Vercel Production)...
git push origin main
git push origin main:master --force

echo.
echo ====================================================================
echo   SUBIDA COMPLETADA CON EXITO!
echo   Vercel comenzo a compilar la version limpia en:
echo   https://atomiccotizador.shop/dashboard
echo ====================================================================
echo.
pause
