@echo off
title ATOMIC ERP - ACTUALIZACION INMEDIATA A PRODUCCION
color 0B
cls
echo ====================================================================
echo             ATOMIC ERP - SUBIENDO A VERCEL PRODUCCION
echo ====================================================================
echo.
cd /d "C:\Users\SANTIAGO\.gemini\antigravity\scratch\atomic--erp"

echo [PASO 1/3] Sincronizando recursos y catalogo...
node scripts/sync_promo_assets.js

echo.
echo [PASO 2/3] Preparando commit con mejoras CRM, Asignacion y Oficina...
git add -A
git commit -m "feat: CRM tabs Mis Leads + WhatsApp, asignacion asesores, alertas sonoras, audio 206 y oficina virtual 2026-09-07"

echo.
echo [PASO 3/3] Enviando a Vercel Produccion (main y master)...
git push origin main
git push origin main:master --force

echo.
echo ====================================================================
echo   DESPLIEGUE ENVIADO CON EXITO!
echo   Vercel esta compilando en https://atomiccotizador.shop
echo ====================================================================
echo.
timeout /t 5
