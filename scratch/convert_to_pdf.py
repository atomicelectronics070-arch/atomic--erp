import subprocess
import os
import shutil

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
desktop_path = r"C:\Users\SANTIAGO\Desktop"
public_path = r"C:\Users\SANTIAGO\.gemini\antigravity\scratch\atomic--erp\public"

scratch_dir = os.path.dirname(os.path.abspath(__file__))
vendedores_html = os.path.join(scratch_dir, "guia_ventas_vendedores_profunda.html")
clientes_html = os.path.join(scratch_dir, "catalogo_cliente_extenso.html")

pdf_vendedores_desktop = os.path.join(desktop_path, "Guia_Maestra_de_Ventas_y_Capacitacion_Bloqueras_ATOMIC.pdf")
pdf_clientes_desktop = os.path.join(desktop_path, "Catalogo_Comercial_y_Fichas_Tecnicas_Bloqueras_ATOMIC.pdf")
pdf_clientes_public = os.path.join(public_path, "catalogo-maquinas-de-bloques.pdf")

def render_pdf(html_path, pdf_output):
    cmd = [
        edge_path,
        "--headless",
        "--disable-gpu",
        "--no-pdf-header-footer",
        f"--print-to-pdf={pdf_output}",
        html_path
    ]
    print(f"Rendering {html_path} -> {pdf_output}")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(pdf_output) and os.path.getsize(pdf_output) > 0:
        print(f"SUCCESS: Generated {pdf_output} ({os.path.getsize(pdf_output)} bytes)")
        return True
    else:
        print(f"FAILED to generate {pdf_output}. Error: {res.stderr}")
        return False

# 1. Render Deep Coaching Sales Guide for Sellers -> DESKTOP
render_pdf(vendedores_html, pdf_vendedores_desktop)

# 2. Render Client Brochure & Technical Datasheet Catalog -> DESKTOP
render_pdf(clientes_html, pdf_clientes_desktop)

# 3. Copy Client Brochure & Technical Datasheet Catalog -> PUBLIC WEBSITE
if os.path.exists(pdf_clientes_desktop):
    shutil.copyfile(pdf_clientes_desktop, pdf_clientes_public)
    print(f"SUCCESS: Copied Client Catalog PDF to public directory: {pdf_clientes_public}")
