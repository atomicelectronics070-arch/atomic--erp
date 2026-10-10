import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateQuoteExcelBuffer, QuoteExcelData } from "@/lib/excel/quoteExcelGenerator";

export const dynamic = "force-dynamic";

function sanitizeFilename(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_\-\.]/g, "_")
    .replace(/_+/g, "_");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      quoteNumber,
      clientName,
      clientCedula,
      clientRuc,
      clientPhone,
      clientEmail,
      clientCity,
      deliveryAddress,
      quoteSubject,
      advisorName,
      advisorPhone,
      items,
      subtotal,
      taxAmount,
      discountAmount,
      total,
      emissionDate
    } = body;

    const excelData: QuoteExcelData = {
      quoteNumber: quoteNumber || "PROP-09-71",
      clientName: clientName || "CLIENTE GENERAL",
      clientCedula: clientCedula || "",
      clientRuc: clientRuc || "",
      clientPhone: clientPhone || "",
      clientEmail: clientEmail || "",
      clientCity: clientCity || "Quito",
      deliveryAddress: deliveryAddress || "",
      quoteSubject: quoteSubject || "SUMINISTRO E INSTALACIÓN DE EQUIPOS DE SEGURIDAD",
      advisorName: advisorName || "ASESOR ATOMIC",
      advisorPhone: advisorPhone || "0999047979",
      items: Array.isArray(items) ? items : [],
      subtotal: Number(subtotal || 0),
      taxAmount: Number(taxAmount || 0),
      discountAmount: Number(discountAmount || 0),
      total: Number(total || 0),
      emissionDate
    };

    const buffer = generateQuoteExcelBuffer(excelData);

    const safeClient = sanitizeFilename(excelData.clientName || "Cliente");
    const safeNum = sanitizeFilename(excelData.quoteNumber || "PROP");
    const filename = `${safeNum}_${safeClient}.xlsx`;

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, max-age=0"
      }
    });
  } catch (error: any) {
    console.error("Excel Export Error (POST):", error);
    return NextResponse.json(
      { error: "Error al generar archivo Excel de cotización", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const quoteNumber = searchParams.get("quoteNumber");

    if (!id && !quoteNumber) {
      return NextResponse.json({ error: "Parámetro 'id' o 'quoteNumber' requerido" }, { status: 400 });
    }

    const quote = await prisma.quote.findFirst({
      where: id ? { id } : { quoteNumber: quoteNumber! },
      include: {
        client: true,
        salesperson: true
      }
    });

    if (!quote) {
      return NextResponse.json({ error: "Cotización no encontrada" }, { status: 404 });
    }

    let parsedItems: any[] = [];
    if (typeof quote.items === "string") {
      try {
        parsedItems = JSON.parse(quote.items);
      } catch (e) {
        parsedItems = [];
      }
    } else if (Array.isArray(quote.items)) {
      parsedItems = quote.items;
    }

    const excelData: QuoteExcelData = {
      quoteNumber: quote.quoteNumber,
      clientName: quote.client?.name || quote.clientName || "CLIENTE",
      clientCedula: quote.client?.cedula || "",
      clientPhone: quote.client?.phone || quote.clientPhone || "",
      clientEmail: quote.client?.email || quote.clientEmail || "",
      clientCity: quote.city || quote.client?.city || "Quito",
      deliveryAddress: quote.deliveryAddress || "",
      quoteSubject: quote.quoteSubject || quote.specs || "PROPUESTA TÉCNICA COMERCIAL",
      advisorName: quote.advisorName || quote.salesperson?.name || "ASESOR ATOMIC",
      advisorPhone: quote.salesperson?.phone || "0999047979",
      items: parsedItems.map((item: any) => ({
        id: item.id || item.productId,
        sku: item.sku || item.productId,
        description: item.description || item.name || "",
        quantity: Number(item.quantity || 1),
        unitPrice: Number(item.unitPrice || 0),
        discountPercent: Number(item.discountPercent || 0),
        discountAmount: Number(item.discountAmount || 0),
        total: Number(item.total || (item.quantity * item.unitPrice))
      })),
      subtotal: Number(quote.subtotal || 0),
      taxAmount: Number(quote.taxAmount || 0),
      discountAmount: Number(quote.discountAmount || 0),
      total: Number(quote.total || 0)
    };

    const buffer = generateQuoteExcelBuffer(excelData);

    const safeClient = sanitizeFilename(excelData.clientName || "Cliente");
    const safeNum = sanitizeFilename(excelData.quoteNumber || "PROP");
    const filename = `${safeNum}_${safeClient}.xlsx`;

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, max-age=0"
      }
    });
  } catch (error: any) {
    console.error("Excel Export Error (GET):", error);
    return NextResponse.json(
      { error: "Error al exportar cotización a Excel", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
