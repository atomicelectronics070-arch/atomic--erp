@echo off
echo ========================================================
echo  DESPLIEGUE A PRODUCCION - ATOMIC ERP
echo ========================================================
echo.

echo [1/4] Copiando plantilla Excel maestra...
node scripts\copy_template.js
if %ERRORLEVEL% NEQ 0 (
    echo Error al copiar la plantilla. Abortando.
    exit /b %ERRORLEVEL%
)

echo.
echo [2/4] Agregando archivos a Git...
git add .

echo.
echo [3/4] Creando commit de produccion...
git commit -m "feat(quotes): exportador excel con logo oficial, verificacion QR en PDF y compartir nativo con enlace permanente"

echo.
echo [4/4] Subiendo a Produccion (GitHub / Vercel)...
git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo Error al subir cambios a GitHub.
    exit /b %ERRORLEVEL%
)

echo.
echo ========================================================
echo  DESPLIEGUE ENVIADO CON EXITO A VERCEL / PRODUCCION
echo  El sitio https://atomiccotizador.shop se actualizara en 1-2 minutos.
echo ========================================================
