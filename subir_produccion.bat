@echo off
echo ========================================================
echo   ATOMIC ERP - DESPLIEGUE AUTOMATICO A PRODUCCION / VERCEL
echo ========================================================
echo.
echo 1. Sincronizando imagenes y catalogos...
node scripts/sync_promo_assets.js

echo.
echo 2. Agregando archivos al control de versiones...
git add -A

echo.
echo 3. Guardando version oficial (commit)...
git commit -m "feat: release oficial produccion 21 landings y portada completa"

echo.
echo 4. Subiendo a GitHub / Vercel (push)...
git push origin main

echo.
echo ========================================================
echo   DESPLIEGUE ENVIADO CON EXITO A VERCEL / PRODUCCION
echo ========================================================
pause
