/**
 * Product Sanitizer Utility for ATOMIC ERP
 * Enforces realistic floor pricing for Ecuadorian market and high-quality category image fallbacks.
 */

export interface SanitizedPriceResult {
    price: number
    isSanitized: boolean
    originalPrice: number
    reason?: string
}

function normalize(text: string): string {
    return (text || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
}

/**
 * Validates and sanitizes unrealistic product prices caused by corrupted scrapes or accessory miscategorization.
 */
export function sanitizeProductPrice(name: string, rawPrice: number, categoryName?: string): SanitizedPriceResult {
    const normName = normalize(name)
    const normCat = normalize(categoryName || "")
    const combined = `${normName} ${normCat}`
    const price = typeof rawPrice === "number" && !isNaN(rawPrice) ? rawPrice : 0

    // 1. Cerraduras Digitales / Smart Locks
    const isLock = combined.includes("cerradura") || combined.includes("chapa") || combined.includes("smart lock") || combined.includes("manija digital")
    if (isLock && price < 35) {
        let newPrice = 54.90
        if (combined.includes("wifi") || combined.includes("wi-fi") || combined.includes("tuya") || combined.includes("biometric") || combined.includes("facial")) {
            newPrice = 89.00
        } else if (combined.includes("manija") || combined.includes("digital") || combined.includes("clave")) {
            newPrice = 64.50
        }
        return { price: newPrice, isSanitized: true, originalPrice: price, reason: "Cerradura digital con precio inferior al costo de importación" }
    }

    // 2. Videoporteros / Citófonos / Intercomunicadores
    const isIntercom = combined.includes("videoportero") || combined.includes("video portero") || combined.includes("citofono") || combined.includes("portero") || combined.includes("intercomunicador")
    if (isIntercom && price < 25) {
        let newPrice = 48.00
        if (combined.includes("kit") || combined.includes("pantalla") || combined.includes("touch") || combined.includes("ip") || combined.includes("7")) {
            newPrice = 119.00
        } else if (combined.includes("frente") || combined.includes("camara") || combined.includes("placa")) {
            newPrice = 59.90
        } else if (combined.includes("citofono") || combined.includes("auricular")) {
            newPrice = 19.50
        }
        return { price: newPrice, isSanitized: true, originalPrice: price, reason: "Videoportero/Portero con precio inferior al mínimo de mercado" }
    }

    // 3. Cámaras de Seguridad / CCTV / DVR / NVR
    const isCCTV = combined.includes("camara") || combined.includes("cctv") || combined.includes("dvr") || combined.includes("nvr") || combined.includes("colorvu")
    if (isCCTV && price < 18) {
        let newPrice = 29.90
        if (combined.includes("kit") || combined.includes("8 ch") || combined.includes("16 ch") || combined.includes("4 ch")) {
            newPrice = 189.00
        } else if (combined.includes("ptz") || combined.includes("360") || combined.includes("solar") || combined.includes("bombilla")) {
            newPrice = 42.50
        } else if (combined.includes("ip") || combined.includes("4mp") || combined.includes("colorvu")) {
            newPrice = 36.00
        }
        return { price: newPrice, isSanitized: true, originalPrice: price, reason: "Equipo CCTV con precio anómalo inferior a $18" }
    }

    // 4. UPS & Respaldo Eléctrico
    const isUPS = combined.includes("ups") || combined.includes("regulador") || combined.includes("no-break")
    if (isUPS && price < 25) {
        let newPrice = 44.90
        if (combined.includes("online") || combined.includes("rack") || combined.includes("2000va") || combined.includes("3000va")) {
            newPrice = 340.00
        } else if (combined.includes("1000va") || combined.includes("1500va") || combined.includes("forza")) {
            newPrice = 98.00
        }
        return { price: newPrice, isSanitized: true, originalPrice: price, reason: "UPS/Regulador con precio anómalo" }
    }

    // 5. Energía Solar & Paneles
    const isSolar = combined.includes("solar") || combined.includes("panel") || combined.includes("inversor")
    if (isSolar && price < 30) {
        let newPrice = 69.00
        if (combined.includes("kit") || combined.includes("1000 w")) {
            newPrice = 490.00
        } else if (combined.includes("inversor")) {
            newPrice = 185.00
        }
        return { price: newPrice, isSanitized: true, originalPrice: price, reason: "Panel/Sistema solar con precio no viable" }
    }

    // 6. Computadores & Laptops
    const isPC = combined.includes("laptop") || combined.includes("notebook") || combined.includes("computador")
    if (isPC && price < 120) {
        return { price: 349.00, isSanitized: true, originalPrice: price, reason: "Equipo de computación con precio inferior a $120" }
    }

    // 7. Monitores
    const isMonitor = combined.includes("monitor") && !combined.includes("soporte") && !combined.includes("cable")
    if (isMonitor && price < 45) {
        return { price: 98.00, isSanitized: true, originalPrice: price, reason: "Monitor con precio anómalo inferior a $45" }
    }

    return { price, isSanitized: false, originalPrice: price }
}

/**
 * Returns a high-resolution, professional product image if original is null or empty.
 */
export function sanitizeProductImage(name: string, imagesRaw?: string | null, categoryName?: string): string {
    if (imagesRaw) {
        try {
            const parsed = JSON.parse(imagesRaw)
            if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "string" && parsed[0].startsWith("http")) {
                return parsed[0]
            } else if (typeof parsed === "string" && parsed.startsWith("http")) {
                return parsed
            }
        } catch (e) {
            if (typeof imagesRaw === "string" && imagesRaw.startsWith("http")) {
                return imagesRaw
            }
        }
    }

    const combined = `${normalize(name)} ${normalize(categoryName || "")}`

    if (combined.includes("cerradura") || combined.includes("chapa") || combined.includes("manija digital")) {
        return "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80"
    }
    if (combined.includes("videoportero") || combined.includes("portero") || combined.includes("citofono")) {
        return "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=80"
    }
    if (combined.includes("camara") || combined.includes("cctv") || combined.includes("dvr")) {
        return "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80"
    }
    if (combined.includes("ups") || combined.includes("energia") || combined.includes("regulador")) {
        return "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80"
    }
    if (combined.includes("solar") || combined.includes("panel")) {
        return "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80"
    }
    if (combined.includes("domotica") || combined.includes("foco") || combined.includes("smart home")) {
        return "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80"
    }
    if (combined.includes("laptop") || combined.includes("computador")) {
        return "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80"
    }
    if (combined.includes("monitor")) {
        return "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80"
    }
    if (combined.includes("audio") || combined.includes("parlante") || combined.includes("sonido")) {
        return "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80"
    }

    return "https://placehold.co/500x380/080d22/06b6d4?text=ATOMIC+EQUIPAMIENTO"
}
