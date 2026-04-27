@echo off
TITLE Restaurador de Productos ATOMIC
echo ==========================================
echo   RESTAURADOR DE PRODUCTOS - ATOMIC ERP
echo ==========================================
echo.
echo Esto va a revisar si tus 3000 productos se borraron
echo por accidente y los volvera a mostrar en la pagina web.
echo.
cd /d "%~dp0"
echo Ejecutando...
npx ts-node restaurar_productos.ts || npx tsx restaurar_productos.ts || node -v
echo.
echo Proceso finalizado. Puedes volver a revisar la pagina web de Atomic.
pause
