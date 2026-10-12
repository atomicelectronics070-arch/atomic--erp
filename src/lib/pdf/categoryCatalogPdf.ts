import jsPDF from "jspdf"
import { SuicideSquadCategoryLanding, CategoryProduct } from "@/lib/data/suicideSquadCategories"

// Helper to fetch or draw company logo in PDF
let cachedLogoB64: string | null = null

async function getLogoBase64(): Promise<string | null> {
    if (cachedLogoB64) return cachedLogoB64
    if (typeof window === "undefined") return null
    try {
        const res = await fetch("/icon-192.png")
        if (res.ok) {
            const blob = await res.blob()
            const reader = new FileReader()
            const b64 = await new Promise<string>((resolve) => {
                reader.onloadend = () => resolve(reader.result as string)
                reader.readAsDataURL(blob)
            })
            if (b64) {
                cachedLogoB64 = b64
                return b64
            }
        }
    } catch (_) {}
    return null
}

function renderVectorAtom(doc: jsPDF, x: number, y: number) {
    doc.setFillColor(15, 23, 42) // Slate-900
    doc.circle(x + 9, y + 9, 8, "F")
    doc.setDrawColor(2, 108, 223) // Blue-600
    doc.setLineWidth(0.8)
    doc.ellipse(x + 9, y + 9, 7.2, 3, "S")
    doc.ellipse(x + 9, y + 9, 3, 7.2, "S")
    doc.setFillColor(234, 88, 12) // Orange-600
    doc.circle(x + 9, y + 9, 2.2, "F")
}

export async function generateCategoryCatalogPDF(category: SuicideSquadCategoryLanding): Promise<boolean> {
    try {
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        })

        const pageWidth = doc.internal.pageSize.getWidth() // 210mm
        const pageHeight = doc.internal.pageSize.getHeight() // 297mm
        const marginLeft = 14
        const marginRight = 14
        const contentWidth = pageWidth - marginLeft - marginRight // 182mm
        const today = new Date().toLocaleDateString("es-EC", {
            day: "numeric",
            month: "long",
            year: "numeric"
        })

        const logoB64 = await getLogoBase64()

        // ── 1. CABECERA CORPORATIVA EJECUTIVA ──
        // Top accent band
        doc.setFillColor(15, 23, 42) // Dark Navy Slate-900
        doc.rect(0, 0, pageWidth, 28, "F")

        doc.setFillColor(234, 88, 12) // Orange Tomate ATOMIC
        doc.rect(0, 28, pageWidth, 2, "F")

        // Draw logo
        if (logoB64) {
            try {
                doc.addImage(logoB64, "PNG", marginLeft, 4, 20, 20)
            } catch {
                renderVectorAtom(doc, marginLeft, 5)
            }
        } else {
            renderVectorAtom(doc, marginLeft, 5)
        }

        // Typography Header
        doc.setTextColor(255, 255, 255)
        doc.setFont("helvetica", "bold")
        doc.setFontSize(15)
        doc.text("ATOMIC SOLUTIONS ECUADOR", marginLeft + 24, 11)

        doc.setFont("helvetica", "normal")
        doc.setFontSize(8)
        doc.setTextColor(226, 232, 240) // Slate-200
        doc.text("CATÁLOGO OFICIAL Y LISTA DE PRECIOS 2026 · VENTA AL PÚBLICO (PVP)", marginLeft + 24, 16)
        doc.text("RUC: 1723948291001 · Matriz: Quito, Ecuador · Despachos a 24 Provincias Servientrega", marginLeft + 24, 21)
        doc.text("Garantía Oficial 1 Año · Factura SRI con 15% de IVA Desglosado", marginLeft + 24, 25)

        // Right side badge
        doc.setFillColor(234, 88, 12)
        doc.roundedRect(pageWidth - marginRight - 42, 6, 42, 16, 2, 2, "F")
        doc.setTextColor(255, 255, 255)
        doc.setFont("helvetica", "bold")
        doc.setFontSize(7.5)
        doc.text("LÍNEA OFICIAL", pageWidth - marginRight - 21, 11, { align: "center" })
        doc.setFontSize(8.5)
        doc.text(category.squadCode, pageWidth - marginRight - 21, 15, { align: "center" })
        doc.setFontSize(6.5)
        doc.text("VERIFICADO 2026", pageWidth - marginRight - 21, 19, { align: "center" })

        let currentY = 36

        // ── 2. HERO DE LA CATEGORÍA ──
        doc.setFillColor(248, 250, 252) // Slate-50
        doc.setDrawColor(226, 232, 240)
        doc.roundedRect(marginLeft, currentY, contentWidth, 26, 3, 3, "FD")

        // Title
        doc.setTextColor(15, 23, 42)
        doc.setFont("helvetica", "bold")
        doc.setFontSize(14)
        doc.text(category.name.toUpperCase(), marginLeft + 4, currentY + 7)

        // Subtitle / Badge
        doc.setFontSize(8)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(234, 88, 12)
        doc.text(`${category.badge} · ${category.squadName}`, marginLeft + 4, currentY + 12)

        // Description
        doc.setFont("helvetica", "normal")
        doc.setFontSize(7.5)
        doc.setTextColor(71, 85, 105)
        const wrappedDesc = doc.splitTextToSize(category.heroPitch, contentWidth - 8)
        doc.text(wrappedDesc.slice(0, 2), marginLeft + 4, currentY + 17)

        // Price indicator pill inside hero
        doc.setFillColor(234, 88, 12)
        doc.setTextColor(255, 255, 255)
        doc.setFont("helvetica", "bold")
        doc.setFontSize(7)
        const pricePillText = `Rango Comercial: $${category.priceRange.min} - $${category.priceRange.max} USD (IVA inc.)`
        doc.text(pricePillText, marginLeft + 4, currentY + 23)

        currentY += 31

        // ── 3. ALCANCES Y APLICACIONES ──
        if (category.scopes && category.scopes.length > 0) {
            doc.setFillColor(241, 245, 249) // Slate-100
            doc.rect(marginLeft, currentY, contentWidth, 5.5, "F")
            doc.setTextColor(15, 23, 42)
            doc.setFont("helvetica", "bold")
            doc.setFontSize(7.5)
            doc.text("APLICACIONES Y ALCANCE DE LA SOLUCIÓN:", marginLeft + 3, currentY + 4)
            currentY += 7.5

            doc.setFont("helvetica", "normal")
            doc.setFontSize(7)
            doc.setTextColor(51, 65, 85)

            const scopeColWidth = contentWidth / Math.min(category.scopes.length, 4)
            category.scopes.slice(0, 4).forEach((sc, i) => {
                const scX = marginLeft + (i * scopeColWidth)
                doc.setFont("helvetica", "bold")
                doc.setTextColor(15, 23, 42)
                doc.text(`• ${sc.title}`, scX + 2, currentY)
                doc.setFont("helvetica", "normal")
                doc.setTextColor(71, 85, 105)
                const scopeShortDesc = doc.splitTextToSize(sc.description, scopeColWidth - 4)
                doc.text(scopeShortDesc.slice(0, 2), scX + 2, currentY + 3.5)
            })

            currentY += 12
        }

        // ── 4. TABLA DE PRODUCTOS Y EQUIPOS ──
        // Table Header
        doc.setFillColor(15, 23, 42) // Dark Navy
        doc.rect(marginLeft, currentY, contentWidth, 7, "F")

        doc.setTextColor(255, 255, 255)
        doc.setFont("helvetica", "bold")
        doc.setFontSize(7)

        const colX = {
            num: marginLeft + 2,
            sku: marginLeft + 10,
            name: marginLeft + 38,
            specs: marginLeft + 105,
            stock: marginLeft + 148,
            price: marginLeft + 165
        }

        doc.text("N°", colX.num, currentY + 4.8)
        doc.text("CÓDIGO / SKU", colX.sku, currentY + 4.8)
        doc.text("PRODUCTO / MODELO OFICIAL", colX.name, currentY + 4.8)
        doc.text("CARACTERÍSTICAS TÉCNICAS", colX.specs, currentY + 4.8)
        doc.text("STOCK", colX.stock, currentY + 4.8)
        doc.text("PVP (IVA INC.)", colX.price, currentY + 4.8)

        currentY += 7

        // Products list
        const products = category.featuredProducts || []

        products.forEach((prod, index) => {
            // Check if page overflow
            if (currentY > pageHeight - 55) {
                doc.addPage()
                currentY = 20

                // Mini header for next pages
                doc.setFillColor(15, 23, 42)
                doc.rect(marginLeft, currentY, contentWidth, 6, "F")
                doc.setTextColor(255, 255, 255)
                doc.setFont("helvetica", "bold")
                doc.setFontSize(7)
                doc.text("N°", colX.num, currentY + 4)
                doc.text("CÓDIGO / SKU", colX.sku, currentY + 4)
                doc.text("PRODUCTO / MODELO OFICIAL", colX.name, currentY + 4)
                doc.text("CARACTERÍSTICAS TÉCNICAS", colX.specs, currentY + 4)
                doc.text("STOCK", colX.stock, currentY + 4)
                doc.text("PVP (IVA INC.)", colX.price, currentY + 4)
                currentY += 6
            }

            const isEven = index % 2 === 0
            const rowHeight = 12

            doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252)
            doc.setDrawColor(241, 245, 249)
            doc.rect(marginLeft, currentY, contentWidth, rowHeight, "FD")

            // Index
            doc.setTextColor(100, 116, 139)
            doc.setFont("helvetica", "normal")
            doc.setFontSize(7)
            doc.text(String(index + 1), colX.num, currentY + 5)

            // SKU
            doc.setFont("helvetica", "bold")
            doc.setFontSize(6.5)
            doc.setTextColor(15, 23, 42)
            doc.text(prod.sku || prod.id, colX.sku, currentY + 5)
            if (prod.tag) {
                doc.setFontSize(5.5)
                doc.setTextColor(234, 88, 12)
                doc.text(`[${prod.tag}]`, colX.sku, currentY + 9)
            }

            // Name
            doc.setFont("helvetica", "bold")
            doc.setFontSize(7.5)
            doc.setTextColor(15, 23, 42)
            const splitName = doc.splitTextToSize(prod.name, 64)
            doc.text(splitName.slice(0, 2), colX.name, currentY + 4.5)

            // Specs
            doc.setFont("helvetica", "normal")
            doc.setFontSize(6)
            doc.setTextColor(71, 85, 105)
            const specsSummary = (prod.specs || []).slice(0, 2).join(" • ") || prod.description
            const splitSpecs = doc.splitTextToSize(specsSummary, 40)
            doc.text(splitSpecs.slice(0, 2), colX.specs, currentY + 4.5)

            // Stock
            doc.setFont("helvetica", "bold")
            doc.setFontSize(6.5)
            doc.setTextColor(16, 185, 129) // Emerald-500
            doc.text("✓ DISPONIBLE", colX.stock, currentY + 5.5)

            // Price
            doc.setFont("helvetica", "bold")
            doc.setFontSize(9)
            doc.setTextColor(234, 88, 12) // Orange-600
            doc.text(`$${prod.price.toFixed(2)}`, colX.price, currentY + 5.5)

            if (prod.comparePrice && prod.comparePrice > prod.price) {
                doc.setFontSize(6)
                doc.setTextColor(148, 163, 184)
                doc.text(`Antes $${prod.comparePrice.toFixed(2)}`, colX.price, currentY + 9.5)
            }

            currentY += rowHeight
        })

        currentY += 4

        // ── 5. GARANTÍA Y FORMAS DE PAGO ──
        if (currentY > pageHeight - 50) {
            doc.addPage()
            currentY = 20
        }

        doc.setFillColor(241, 245, 249)
        doc.setDrawColor(203, 213, 225)
        doc.roundedRect(marginLeft, currentY, contentWidth, 18, 2, 2, "FD")

        doc.setFont("helvetica", "bold")
        doc.setFontSize(7.5)
        doc.setTextColor(15, 23, 42)
        doc.text("CONDICIONES COMERCIALES & BENEFICIOS OFICIALES ATOMIC:", marginLeft + 4, currentY + 5)

        doc.setFont("helvetica", "normal")
        doc.setFontSize(6.5)
        doc.setTextColor(51, 65, 85)
        doc.text("• Envíos Diarios Asegurados: Servientrega Express a las 24 provincias con número de guía inmediato.", marginLeft + 4, currentY + 9)
        doc.text("• Garantía Real de 1 Año: Servicio técnico local en Quito y cobertura directa contra defectos de fábrica.", marginLeft + 4, currentY + 12.5)
        doc.text("• Facturación Legal SRI: Precios incluyen IVA desglosado para deducción tributaria. Aceptamos transferencias y tarjetas de crédito.", marginLeft + 4, currentY + 16)

        currentY += 22

        // ── 6. ENLACES OFICIALES Y REDES SOCIALES (DATOS EXACTOS) ──
        if (currentY > pageHeight - 35) {
            doc.addPage()
            currentY = 20
        }

        doc.setFillColor(15, 23, 42)
        doc.roundedRect(marginLeft, currentY, contentWidth, 24, 2, 2, "F")

        doc.setTextColor(255, 255, 255)
        doc.setFont("helvetica", "bold")
        doc.setFontSize(8)
        doc.text("CANALES DE CONTACTO DIRECTO & DEMOSTRACIONES EN VIVO", marginLeft + 4, currentY + 5)

        doc.setFont("helvetica", "normal")
        doc.setFontSize(6.5)
        doc.setTextColor(226, 232, 240)

        // Column 1: WhatsApp y Tienda
        doc.text("• WhatsApp Cotizaciones: +593 96 322 6319 / +593 99 904 7979", marginLeft + 4, currentY + 10)
        doc.text("• Tienda & Catálogo Web: atomiccotizador.shop/bienvenida", marginLeft + 4, currentY + 14)
        doc.text("• YouTube Capacitaciones: youtube.com/@atomicmenquantum", marginLeft + 4, currentY + 18)

        // Column 2: TikTok e Instagram
        const midX = marginLeft + (contentWidth / 2) + 4
        doc.text("• TikTok Jefe Técnico: tiktok.com/@santiagoguzman216", midX, currentY + 10)
        doc.text("• Instagram Industrias: instagram.com/atomic_industries_26", midX, currentY + 14)
        doc.text("• TikTok Atomic Home Unboxing: tiktok.com/@juanguzman35886", midX, currentY + 18)

        currentY += 27

        // ── 7. PIE DE PÁGINA FINAL ──
        doc.setTextColor(148, 163, 184)
        doc.setFont("helvetica", "normal")
        doc.setFontSize(6.5)
        doc.text(`Documento generado el ${today} · ATOMIC Solutions Ecuador · Válido para proformas institucionales y compras directas.`, marginLeft, pageHeight - 8)
        doc.text("Página 1", pageWidth - marginRight, pageHeight - 8, { align: "right" })

        // Trigger PDF Download
        const fileName = `ATOMIC_Catalogo_2026_${category.slug}.pdf`
        doc.save(fileName)
        return true
    } catch (err) {
        console.error("Error generating category catalog PDF:", err)
        return false
    }
}
