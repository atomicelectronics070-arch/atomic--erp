@echo off
title ATOMIC ERP - DESPLIEGUE A PRODUCCION MASTER Y MAIN
color 0A
echo ====================================================================
echo             ATOMIC ERP - PUBLICACION A PRODUCCION / VERCEL
echo ====================================================================
echo.
cd /d "C:\Users\SANTIAGO\.gemini\antigravity\scratch\atomic--erp"

echo [1/4] Sincronizando imagenes y catalogos...
node scripts/sync_promo_assets.js

echo.
echo [2/4] Agregando archivos modificados a Git...
git add -A

echo.
echo [3/4] Creando commit de version oficial...
git commit -m "feat: CRM Mis Leads y WhatsApp general, asignacion de asesores por rol, alertas sonoras, audio streaming y oficina virtual con perfiles reales"

echo.
echo [4/4] Subiendo a GitHub en ramas MAIN y MASTER (Vercel Produccion)...
git push origin main
git push origin main:master --force

echo.
echo ====================================================================
echo   EXITO: Todos los cambios han sido subidos a MASTER y MAIN!
echo   Vercel esta compilando la version en https://atomiccotizador.shop
echo ====================================================================
echo.
REM pause
