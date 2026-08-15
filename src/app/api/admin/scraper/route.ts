export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    try {
        const contacts = await prisma.coordinationScrapedContact.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ contacts });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    try {
        const { category, count, source } = await req.json();

        // Simulated extraction logic based on category
        const firstNames = ["Juan", "María", "Carlos", "Ana", "Luis", "Elena", "Pedro", "Sofía", "Miguel", "Laura"];
        const lastNames = ["García", "Rodríguez", "Martínez", "López", "González", "Pérez", "Gómez", "Sánchez", "Díaz", "Fernández"];
        const phonePrefixes = ["099", "098", "097", "096", "095", "093"];

        const generatedContacts = [];
        
        for (let i = 0; i < count; i++) {
            const isCompany = Math.random() > 0.5;
            let name = "";
            
            if (isCompany) {
                const prefixes = ["Grupo", "Inversiones", "Comercializadora", "Servicios", "Agencia", "Corporación", "Consultores", "Estudio"];
                const suffixes = ["S.A.", "Cía. Ltda.", "E.I.R.L.", "y Asociados", "Express", "Pro", "Global", "Latam"];
                name = `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${category} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
            } else {
                const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
                const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
                name = `${fName} ${lName} (${category})`;
            }

            const phone = `${phonePrefixes[Math.floor(Math.random() * phonePrefixes.length)]}${Math.floor(Math.random() * 9000000 + 1000000)}`;

            generatedContacts.push({
                name,
                phone,
                category,
                source: source || "MAPS",
                status: "PENDING"
            });
        }

        const savedContacts = [];
        for (const contact of generatedContacts) {
            const saved = await prisma.coordinationScrapedContact.create({
                data: contact
            });
            savedContacts.push(saved);
        }

        return NextResponse.json({ success: true, contacts: savedContacts });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    try {
        const { contactId, advisorId } = await req.json();

        const updated = await prisma.coordinationScrapedContact.update({
            where: { id: contactId },
            data: { 
                advisorId,
                status: "ASSIGNED"
            }
        });

        return NextResponse.json({ success: true, contact: updated });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
