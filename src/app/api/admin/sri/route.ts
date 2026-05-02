import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const p = prisma as any;
        const settings = await p.sriSettings?.findFirst() || await p.sRISettings?.findFirst();
        return NextResponse.json(settings || {});
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch SRI settings" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = await request.json();
        const { ruc, businessName, environment, establishment, emissionPoint, password } = data;

        const p = prisma as any;
        let updated;
        if (p.sriSettings) {
            updated = await p.sriSettings.upsert({
                where: { ruc: ruc || "" },
                update: { businessName, environment, establishment, emissionPoint, password },
                create: { ruc, businessName, environment, establishment, emissionPoint, password }
            });
        } else {
            updated = await p.sRISettings.upsert({
                where: { ruc: ruc || "" },
                update: { businessName, environment, establishment, emissionPoint, password },
                create: { ruc, businessName, environment, establishment, emissionPoint, password }
            });
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error("[SRI_API_ERROR]", error);
        return NextResponse.json({ error: "Failed to update SRI settings" }, { status: 500 });
    }
}
