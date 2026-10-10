Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " DESPLIEGUE A PRODUCCION - ATOMIC ERP" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan

Write-Host "`n[1/4] Copiando plantilla Excel maestra..." -ForegroundColor Yellow
node scripts/copy_template.js
if ($LASTEXITCODE -ne 0) {
    Write-Error "Error al copiar la plantilla. Abortando."
    exit 1
}

Write-Host "`n[2/4] Agregando archivos a Git..." -ForegroundColor Yellow
git add .

Write-Host "`n[3/4] Creando commit de produccion..." -ForegroundColor Yellow
git commit -m "feat(quotes): exportador excel con logo oficial, verificacion QR en PDF y compartir nativo con enlace permanente"

Write-Host "`n[4/4] Subiendo a Produccion (GitHub / Vercel)..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Error "Error al subir cambios a GitHub."
    exit 1
}

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host " DESPLIEGUE ENVIADO CON EXITO A VERCEL / PRODUCCION" -ForegroundColor Green
Write-Host " El sitio https://atomiccotizador.shop se actualizara en 1-2 minutos." -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
