export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const SETTING_KEY = "atomic_managed_accounts";

export interface ManagedAccount {
    id: string;
    platform: string;          // Facebook Marketplace, Google Maps, TikTok, WhatsApp Empresa, Instagram, Correo Corporativo, etc.
    cedula: string;            // Cédula / Identificación vinculada
    email: string;             // Correo electrónico de la cuenta
    password: string;          // Contraseña
    isAssigned: boolean;       // Si está designada a un usuario
    assignedUserId?: string;   // ID del usuario asignado
    assignedUserName?: string; // Nombre del usuario asignado
    assignedUserEmail?: string;// Correo del usuario asignado
    notes?: string;            // Notas adicionales
    createdAt: string;
    updatedAt: string;
}

// GET /api/admin/managed-accounts
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const userRole = String((session.user as any)?.role || "").toUpperCase();
        const isAdminOrCoord = userRole.includes("ADMIN") || userRole.includes("COORDINATOR") || userRole.includes("MANAGEMENT");

        if (!isAdminOrCoord) {
            return NextResponse.json({ error: "Permisos insuficientes" }, { status: 403 });
        }

        // Fetch stored accounts
        const setting = await prisma.systemSetting.findUnique({
            where: { key: SETTING_KEY }
        });

        let accounts: ManagedAccount[] = [];
        if (setting?.value) {
            try {
                accounts = JSON.parse(setting.value);
            } catch (e) {
                accounts = [];
            }
        }

        // Fetch users list to populate dropdown
        const users = await prisma.user.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
                lastName: true,
                email: true,
                role: true
            },
            orderBy: [{ role: "asc" }, { name: "asc" }]
        });

        return NextResponse.json({
            success: true,
            accounts,
            users
        });

    } catch (error: any) {
        console.error("[MANAGED_ACCOUNTS_GET] Error:", error);
        return NextResponse.json({ error: error.message || "Error interno" }, { status: 500 });
    }
}

// POST /api/admin/managed-accounts
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const userRole = String((session.user as any)?.role || "").toUpperCase();
        const isAdminOrCoord = userRole.includes("ADMIN") || userRole.includes("COORDINATOR") || userRole.includes("MANAGEMENT");

        if (!isAdminOrCoord) {
            return NextResponse.json({ error: "Permisos insuficientes" }, { status: 403 });
        }

        const body = await req.json();
        const { action } = body;

        // Fetch existing accounts
        const setting = await prisma.systemSetting.findUnique({
            where: { key: SETTING_KEY }
        });

        let accounts: ManagedAccount[] = [];
        if (setting?.value) {
            try {
                accounts = JSON.parse(setting.value);
            } catch (e) {
                accounts = [];
            }
        }

        // 1. ACTION: CREATE ACCOUNT
        if (action === "create") {
            const { platform, cedula, email, password, isAssigned, assignedUserId, notes } = body;

            if (!platform || !email || !password) {
                return NextResponse.json({ error: "Plataforma, correo y contraseña son obligatorios" }, { status: 400 });
            }

            let assignedUserName = "";
            let assignedUserEmail = "";

            if (isAssigned && assignedUserId) {
                const assignedUser = await prisma.user.findUnique({
                    where: { id: assignedUserId },
                    select: { name: true, lastName: true, email: true }
                });
                if (assignedUser) {
                    assignedUserName = `${assignedUser.name || ""} ${assignedUser.lastName || ""}`.trim();
                    assignedUserEmail = assignedUser.email;
                }
            }

            const newAccount: ManagedAccount = {
                id: `acc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                platform: String(platform).trim(),
                cedula: String(cedula || "").trim(),
                email: String(email).trim(),
                password: String(password).trim(),
                isAssigned: Boolean(isAssigned),
                assignedUserId: isAssigned ? assignedUserId : undefined,
                assignedUserName: isAssigned ? assignedUserName : undefined,
                assignedUserEmail: isAssigned ? assignedUserEmail : undefined,
                notes: notes ? String(notes).trim() : "",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            accounts.unshift(newAccount);

            await prisma.systemSetting.upsert({
                where: { key: SETTING_KEY },
                update: { value: JSON.stringify(accounts) },
                create: { key: SETTING_KEY, value: JSON.stringify(accounts) }
            });

            return NextResponse.json({
                success: true,
                message: "Cuenta creada y registrada con éxito.",
                account: newAccount
            });
        }

        // 2. ACTION: DELETE ACCOUNT
        if (action === "delete") {
            const { accountId } = body;
            if (!accountId) {
                return NextResponse.json({ error: "accountId es requerido" }, { status: 400 });
            }

            accounts = accounts.filter(a => a.id !== accountId);

            await prisma.systemSetting.upsert({
                where: { key: SETTING_KEY },
                update: { value: JSON.stringify(accounts) },
                create: { key: SETTING_KEY, value: JSON.stringify(accounts) }
            });

            return NextResponse.json({
                success: true,
                message: "Cuenta eliminada del gestor."
            });
        }

        // 3. ACTION: UPDATE / REASSIGN ACCOUNT
        if (action === "update") {
            const { accountId, platform, cedula, email, password, isAssigned, assignedUserId, notes } = body;
            if (!accountId) {
                return NextResponse.json({ error: "accountId es requerido" }, { status: 400 });
            }

            const index = accounts.findIndex(a => a.id === accountId);
            if (index === -1) {
                return NextResponse.json({ error: "Cuenta no encontrada" }, { status: 404 });
            }

            let assignedUserName = "";
            let assignedUserEmail = "";

            if (isAssigned && assignedUserId) {
                const assignedUser = await prisma.user.findUnique({
                    where: { id: assignedUserId },
                    select: { name: true, lastName: true, email: true }
                });
                if (assignedUser) {
                    assignedUserName = `${assignedUser.name || ""} ${assignedUser.lastName || ""}`.trim();
                    assignedUserEmail = assignedUser.email;
                }
            }

            accounts[index] = {
                ...accounts[index],
                platform: platform ? String(platform).trim() : accounts[index].platform,
                cedula: cedula !== undefined ? String(cedula).trim() : accounts[index].cedula,
                email: email ? String(email).trim() : accounts[index].email,
                password: password ? String(password).trim() : accounts[index].password,
                isAssigned: Boolean(isAssigned),
                assignedUserId: isAssigned ? assignedUserId : undefined,
                assignedUserName: isAssigned ? assignedUserName : undefined,
                assignedUserEmail: isAssigned ? assignedUserEmail : undefined,
                notes: notes !== undefined ? String(notes).trim() : accounts[index].notes,
                updatedAt: new Date().toISOString()
            };

            await prisma.systemSetting.upsert({
                where: { key: SETTING_KEY },
                update: { value: JSON.stringify(accounts) },
                create: { key: SETTING_KEY, value: JSON.stringify(accounts) }
            });

            return NextResponse.json({
                success: true,
                message: "Cuenta actualizada con éxito.",
                account: accounts[index]
            });
        }

        return NextResponse.json({ error: "Acción no reconocida" }, { status: 400 });

    } catch (error: any) {
        console.error("[MANAGED_ACCOUNTS_POST] Error:", error);
        return NextResponse.json({ error: error.message || "Error interno" }, { status: 500 });
    }
}
