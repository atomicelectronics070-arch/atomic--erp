export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function requireSupervisionAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return null
  const role = String((session.user as any)?.role || "").toUpperCase()
  const ok =
    role.includes("ADMIN") ||
    role.includes("COORDINATOR") ||
    role.includes("MANAGEMENT") ||
    role.includes("SUPER_ADMIN")
  return ok ? session : null
}

function parseFirstImage(imgField: string | null): string | null {
  if (!imgField) return null
  const s = imgField.trim()
  if (!s || s === "[]" || s === '""') return null
  try {
    const parsed = JSON.parse(s)
    if (Array.isArray(parsed) && parsed.length > 0) return String(parsed[0] || "")
  } catch {
    /* ignore */
  }
  return s.split(",")[0].replace(/[\[\]"]/g, "").trim() || null
}

function isBrokenOrEmojiImage(img: string | null): boolean {
  if (!img) return true
  const lower = img.toLowerCase()
  return (
    lower.includes("placeholder") ||
    lower.includes("s.w.org/images/core/emoji") ||
    lower.includes("data:image/svg")
  )
}

function cleanProductNameForSearch(name: string): string {
  return name
    .replace(/\b(NOT\.|COP\.|IMP\.|VC-|AU-|ACCTPL|CAMTPL|ROUHIK|MOUXXX|IMPEPS)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80)
}

export async function GET(req: NextRequest) {
  const session = await requireSupervisionAdmin()
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const sampleSize = Math.min(60, Math.max(5, parseInt(searchParams.get("sampleSize") || "25", 10) || 25))
    const providerFilter = searchParams.get("provider")?.trim() || "ALL"

    const products = await prisma.product.findMany({
      where: { isDeleted: false, isActive: true },
      select: {
        id: true,
        sku: true,
        name: true,
        price: true,
        compareAtPrice: true,
        provider: true,
        stock: true,
        images: true,
        category: { select: { name: true } },
      },
    })

    const providerCounts: Record<string, number> = {}
    const extremeTech: any[] = []
    const compareAtGreater: any[] = []
    const suspiciousLowLaptopMonitor: any[] = []
    const brokenImages: any[] = []
    const garbageNames: any[] = []

    const tmPriceBuckets: Record<string, number> = {}

    for (const p of products) {
      const prov = p.provider || "SIN_PROVEEDOR"
      providerCounts[prov] = (providerCounts[prov] || 0) + 1

      const price = Number(p.price) || 0
      const comp = p.compareAtPrice != null ? Number(p.compareAtPrice) : null
      const catName = p.category?.name || "Sin categoría"
      const firstImg = parseFirstImage(p.images)

      if (prov.toLowerCase().includes("tecnomega")) {
        const key = String(price)
        tmPriceBuckets[key] = (tmPriceBuckets[key] || 0) + 1
      }

      const isIndustrial = /generador|robot|máquina|maquina|planta|línea de producción|linea de produccion|panel|antena|camara termica|cámara térmica|posicionadora/i.test(
        p.name
      )
      if (price > 2500 && !isIndustrial) {
        extremeTech.push({ id: p.id, sku: p.sku, name: p.name, price, compareAtPrice: comp, provider: prov, category: catName, firstImg })
      }

      if (comp != null && comp > 0 && comp > price * 1.05) {
        compareAtGreater.push({ id: p.id, sku: p.sku, name: p.name, price, compareAtPrice: comp, provider: prov, category: catName, firstImg })
      }

      if (
        price > 0 &&
        price < 120 &&
        /\b(laptop|notebook|probook|elitebook|zenbook|macbook|lg gram|monitor|tv |televisor|impresora)\b/i.test(p.name) &&
        !/bater[ií]a|cargador|teclado|ventilador|soporte|cobertor|mochila|pin de carga|bisagra|cable|flex|funda|adaptador|tinta|toner|cartucho|papel/i.test(
          p.name
        )
      ) {
        suspiciousLowLaptopMonitor.push({ id: p.id, sku: p.sku, name: p.name, price, compareAtPrice: comp, provider: prov, category: catName, firstImg })
      }

      if (isBrokenOrEmojiImage(firstImg)) {
        brokenImages.push({ id: p.id, sku: p.sku, name: p.name, price, provider: prov, category: catName, firstImg })
      }

      if (
        (p.name.includes(",") && p.name.split(",").length >= 3 && p.name.length < 55) ||
        /^(accesorios|ferreter[ií]a|promoci[oó]n)$/i.test(p.name.trim())
      ) {
        garbageNames.push({ id: p.id, sku: p.sku, name: p.name, price, provider: prov, category: catName })
      }
    }

    extremeTech.sort((a, b) => b.price - a.price)
    compareAtGreater.sort((a, b) => (b.compareAtPrice - b.price) - (a.compareAtPrice - a.price))

    // Random sample from active catalog (optionally filtered by provider)
    const pool = products.filter((p) => {
      if (providerFilter === "ALL") return true
      if (providerFilter === "SIN_PROVEEDOR") return !p.provider
      return (p.provider || "").toLowerCase() === providerFilter.toLowerCase()
    })

    // Fisher-Yates shuffle on copy
    const arr = [...pool]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const tmp = arr[i]
      arr[i] = arr[j]
      arr[j] = tmp
    }

    const randomSample = arr.slice(0, sampleSize).map((p) => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      price: Number(p.price) || 0,
      compareAtPrice: p.compareAtPrice != null ? Number(p.compareAtPrice) : null,
      provider: p.provider || "SIN_PROVEEDOR",
      category: p.category?.name || "Sin categoría",
      stock: p.stock,
      firstImage: parseFirstImage(p.images),
    }))

    const topTmBuckets = Object.entries(tmPriceBuckets)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([price, count]) => ({ price: Number(price), count }))

    return NextResponse.json({
      stats: {
        totalActive: products.length,
        extremeTechCount: extremeTech.length,
        compareAtGreaterCount: compareAtGreater.length,
        suspiciousLowLaptopMonitorCount: suspiciousLowLaptopMonitor.length,
        brokenImagesCount: brokenImages.length,
        garbageNamesCount: garbageNames.length,
      },
      topTmBuckets,
      providers: Object.entries(providerCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, count })),
      anomalies: {
        extremeTech: extremeTech.slice(0, 40),
        compareAtGreater: compareAtGreater.slice(0, 40),
        suspiciousLowLaptopMonitor: suspiciousLowLaptopMonitor.slice(0, 40),
        brokenImages: brokenImages.slice(0, 40),
        garbageNames: garbageNames.slice(0, 40),
      },
      randomSample,
    })
  } catch (error: any) {
    console.error("[PRODUCT_AUDIT_GET]", error)
    return NextResponse.json({ error: error.message || "Error al auditar productos" }, { status: 500 })
  }
}

async function fetchEcuadorWebSnippets(query: string): Promise<{ snippets: string[]; urls: { title: string; url: string }[]; extractedPrices: number[] }> {
  const snippets: string[] = []
  const urls: { title: string; url: string }[] = []
  const extractedPrices: number[] = []

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 7000)
    const res = await fetch(`https://www.bing.com/search?q=${encodeURIComponent(query)}&cc=EC&setlang=es`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept-Language": "es-EC,es;q=0.9",
      },
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (res.ok) {
      const html = await res.text()
      // Extract Bing result blocks <li class="b_algo">
      const blocks = html.match(/<li class="b_algo"[\s\S]*?<\/li>/gi) || []
      for (const b of blocks.slice(0, 6)) {
        const hrefMatch = b.match(/<a[^>]+href="(https?:\/\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/i)
        const textOnly = b.replace(/<[^>]+>/g, " ").replace(/&nbsp;|&amp;|&quot;|&#39;/g, " ").replace(/\s+/g, " ").trim()
        if (textOnly) snippets.push(textOnly.slice(0, 280))
        if (hrefMatch) {
          const cleanTitle = hrefMatch[2].replace(/<[^>]+>/g, "").trim()
          if (!hrefMatch[1].includes("bing.com")) {
            urls.push({ title: cleanTitle.slice(0, 80) || hrefMatch[1], url: hrefMatch[1] })
          }
        }
        const priceMatches = textOnly.matchAll(/(?:\$|USD\s?)(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)/gi)
        for (const m of priceMatches) {
          const raw = m[1].replace(/,/g, "")
          const val = parseFloat(raw)
          if (!isNaN(val) && val >= 2 && val <= 20000) {
            extractedPrices.push(val)
          }
        }
      }
    }
  } catch {
    /* timeout or network error */
  }

  return { snippets, urls: urls.slice(0, 4), extractedPrices }
}

export async function POST(req: NextRequest) {
  const session = await requireSupervisionAdmin()
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { productId, name, sku, storedPrice, compareAtPrice, category, provider } = body

    if (!name || storedPrice == null) {
      return NextResponse.json({ error: "Faltan datos del producto" }, { status: 400 })
    }

    const searchQuery = `${cleanProductNameForSearch(name)} ${sku && !sku.includes(" ") ? sku : ""} precio Ecuador`
    const webData = await fetchEcuadorWebSnippets(searchQuery)

    const nvidiaKey = process.env.NVIDIA_API_KEY
    const nvidiaBase = (process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1").replace(/\/+$/, "")
    const model = process.env.WORKER_MODEL || "meta/llama-3.1-70b-instruct"

    let aiResult: any = null

    if (nvidiaKey) {
      try {
        const prompt = `Eres un auditor experto de precios del mercado tecnológico y ferretero de Ecuador (precios en USD con IVA incluido).
Analiza este producto de nuestra base de datos:
- Nombre: ${name}
- SKU: ${sku || "N/A"}
- Categoría BD: ${category || "N/A"}
- Proveedor: ${provider || "N/A"}
- Precio guardado en BD (PVP): $${Number(storedPrice).toFixed(2)} USD
- compareAtPrice en BD: ${compareAtPrice != null ? `$${Number(compareAtPrice).toFixed(2)}` : "N/A"}

Resultados encontrados en internet (Ecuador):
${webData.snippets.length > 0 ? webData.snippets.map((s, i) => `${i + 1}. ${s}`).join("\n") : "Sin snippets directos; usa tu conocimiento técnico actualizado del mercado Ecuador/USA+importación."}
Precios numéricos extraídos de snippets: ${webData.extractedPrices.length > 0 ? webData.extractedPrices.map((x) => `$${x}`).join(", ") : "ninguno"}

Responde ÚNICAMENTE con un JSON válido (sin markdown, sin texto extra) con esta estructura exacta:
{
  "minMarketUsd": number,
  "maxMarketUsd": number,
  "recommendedPvpUsd": number,
  "verdict": "OK" | "SOBREPRECIO_CRITICO" | "SUBPRECIO_PERDIDA" | "REVISAR",
  "confidence": "ALTA" | "MEDIA" | "BAJA",
  "categoryError": boolean,
  "reason": "Explicación breve en español de máximo 22 palabras indicando si el precio BD es real o tiene error (ej. punto decimal faltante, precio de lote, etc.)."
}`

        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 14000)
        const aiRes = await fetch(`${nvidiaBase}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${nvidiaKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.15,
            max_tokens: 350,
          }),
          signal: controller.signal,
        })
        clearTimeout(timeout)

        if (aiRes.ok) {
          const aiJson = await aiRes.json()
          const content = aiJson?.choices?.[0]?.message?.content || ""
          const jsonMatch = content.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            aiResult = JSON.parse(jsonMatch[0])
          }
        }
      } catch (e) {
        console.error("[PRODUCT_AUDIT_AI_ERR]", e)
      }
    }

    // Fallback if AI call failed
    if (!aiResult) {
      const prices = [...webData.extractedPrices].sort((a, b) => a - b)
      const median = prices.length > 0 ? prices[Math.floor(prices.length / 2)] : Number(storedPrice)
      const minP = prices.length > 0 ? prices[0] : median * 0.8
      const maxP = prices.length > 0 ? prices[prices.length - 1] : median * 1.25
      let verdict = "REVISAR"
      if (prices.length > 0) {
        const ratio = Number(storedPrice) / median
        if (ratio > 1.65) verdict = "SOBREPRECIO_CRITICO"
        else if (ratio < 0.55) verdict = "SUBPRECIO_PERDIDA"
        else verdict = "OK"
      }
      aiResult = {
        minMarketUsd: Number(minP.toFixed(2)),
        maxMarketUsd: Number(maxP.toFixed(2)),
        recommendedPvpUsd: Number(median.toFixed(2)),
        verdict,
        confidence: prices.length >= 2 ? "MEDIA" : "BAJA",
        categoryError: false,
        reason: prices.length > 0 ? "Comparación directa contra precios extraídos de la web en Ecuador." : "Sin resultados numéricos suficientes en web; requiere revisión manual.",
      }
    }

    return NextResponse.json({
      productId,
      storedPrice: Number(storedPrice),
      searchQuery,
      sources: webData.urls,
      extractedPrices: webData.extractedPrices,
      ...aiResult,
    })
  } catch (error: any) {
    console.error("[PRODUCT_AUDIT_POST]", error)
    return NextResponse.json({ error: error.message || "Error validando en internet" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const session = await requireSupervisionAdmin()
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { productId, price, compareAtPrice, isActive } = body
    if (!productId) {
      return NextResponse.json({ error: "productId requerido" }, { status: 400 })
    }

    const updateData: any = {}
    if (price !== undefined && !isNaN(Number(price)) && Number(price) >= 0) {
      updateData.price = Math.round(Number(price) * 100) / 100
    }
    if (compareAtPrice !== undefined) {
      updateData.compareAtPrice = compareAtPrice === null ? null : Math.round(Number(compareAtPrice) * 100) / 100
    }
    if (typeof isActive === "boolean") {
      updateData.isActive = isActive
    }

    const updated = await prisma.product.update({
      where: { id: productId },
      data: updateData,
      select: { id: true, name: true, price: true, compareAtPrice: true, isActive: true },
    })

    return NextResponse.json({ success: true, product: updated })
  } catch (error: any) {
    console.error("[PRODUCT_AUDIT_PATCH]", error)
    return NextResponse.json({ error: error.message || "Error actualizando producto" }, { status: 500 })
  }
}
