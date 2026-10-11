import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, city, requirement, email } = body;

    if (!name && !phone) {
      return NextResponse.json(
        { success: false, error: "Se requiere al menos un nombre o número de contacto" },
        { status: 400 }
      );
    }

    // Assign to active admin or first salesperson
    const salesperson = await prisma.user.findFirst({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!salesperson) {
      return NextResponse.json(
        { success: false, error: "No hay asesores comerciales configurados en el sistema" },
        { status: 500 }
      );
    }

    const cleanName = (name || "Prospecto Marketplace").trim();
    const cleanPhone = (phone || "").trim();
    const cleanCity = (city || "Quito").trim();
    const cleanReq = (requirement || "Interés en catálogo y proforma general").trim();

    const client = await prisma.client.create({
      data: {
        name: cleanName,
        phone: cleanPhone || null,
        city: cleanCity,
        requirement: cleanReq,
        email: email ? email.trim() : null,
        status: "PROSPECTO",
        source: "PORTAL_BIENVENIDA",
        category: "MARKETPLACE_WEB",
        salespersonId: salesperson.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Prospecto registrado exitosamente",
      client: {
        id: client.id,
        name: client.name,
      },
    });
  } catch (error: any) {
    console.error("Error creating bienvenida lead:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
