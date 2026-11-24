export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const VAULT_SETTING_KEY = "atomic_system_credentials_vault";

// Pre-seeded passwords for official team members
const KNOWN_NAMED_PASSWORDS: Record<string, string> = {
    "kevinbarrera@atomicventas.com":      "Kevinventas2026",
    "kevinestibenbarrera@gmail.com":      "Kevinventas2026",
    "juanguzman@atomicsupervision.com":   "JuanSuper2026",
    "atomic@industrias.ec":               "JuanSuper2026",
    "juanguzman7100@gmail.com":           "JuanSuper2026",
    "nicolascarrera@atomiclabs.com":      "NicolasCarrera2026",
    "crisrivera@atomiccoordinacion.com":  "CrisRivera2026",
    "luisasabando@atomicventas.com":      "LuisaVentas2026",
    "luisasabando247@gmail.com":          "LuisaVentas2026",
    "nuryvelasco@atomicventas.com":       "NuryVentas2026",
    "nuryvelasco2005@gmail.com":          "NuryVentas2026",
    "nuryv156@gmail.com":                 "NuryVentas2026",
    "stefy@atomicedicion.com":            "StefyEdicion2026",
    "stefy14nathy@gmail.com":             "StefyEdicion2026",
    "propietario@atomic.com.ec":          "atomic2026",
    "admin@atomic.com.ec":                "atomic2026",
    "coordinacion@atomic.com.ec":         "atomic2026",
    "software@atomic.com.ec":             "atomic2026",
    "tecnico@atomic.com.ec":              "atomic2026",
    "ventas@atomic.com.ec":               "atomic2026",
};

// Check if requester is Juan Pablo or authorized director
function isAuthorizedMaster(session: any): boolean {
    if (!session?.user) return false;
    const email = String(session.user.email || "").toLowerCase();
    const name = String(session.user.name || "").toLowerCase();
    const role = String((session.user as any)?.role || "").toUpperCase();

    const isJuanPablo = 
        email.includes("juanguzman") || 
        email.includes("atomic@industrias") || 
        name.includes("juan pablo") || 
        name.includes("juan guzman");

    const isAdminOrManagement = 
        role.includes("ADMIN") || 
        role.includes("MANAGEMENT") || 
        role.includes("COORDINATOR");

    return isJuanPablo || isAdminOrManagement;
}

// GET /api/admin/system-credentials
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !isAuthorizedMaster(session)) {
            return NextResponse.json({ error: "Acceso no autorizado. Exclusivo para Juan Pablo Guzmán / Dirección." }, { status: 403 });
        }

        // 1. Fetch vault stored plaintext passwords
        const vaultSetting = await prisma.systemSetting.findUnique({
            where: { key: VAULT_SETTING_KEY }
        });

        let vault: Record<string, string> = {};
        if (vaultSetting?.value) {
            try {
                vault = JSON.parse(vaultSetting.value);
            } catch (e) {
                vault = {};
            }
        }

        // 2. Fetch all users from database
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                lastName: true,
                email: true,
                role: true,
                status: true,
                isActive: true,
                cedula: true,
                phoneNumber: true,
                createdAt: true,
                tempResetCode: true,
            },
            orderBy: [
                { role: "asc" },
                { name: "asc" }
            ]
        });

        // 3. Merge with passwords
        const result = users.map(u => {
            const emailLower = (u.email || "").toLowerCase().trim();
            const password = vault[emailLower] || 
                             vault[u.id] || 
                             KNOWN_NAMED_PASSWORDS[emailLower] || 
                             "atomic2026";

            return {
                id: u.id,
                name: u.name || "Sin Nombre",
                lastName: u.lastName || "",
                fullName: [u.name, u.lastName].filter(Boolean).join(" ") || "Sin Nombre",
                email: u.email,
                password,
                role: u.role || "SALESPERSON",
                status: u.status || "APPROVED",
                isActive: u.isActive ?? true,
                cedula: u.cedula || "",
                phoneNumber: u.phoneNumber || "",
                createdAt: u.createdAt
            };
        });

        return NextResponse.json({
            success: true,
            count: result.length,
            users: result
        });

    } catch (error: any) {
        console.error("[SYSTEM_CREDENTIALS_GET] Error:", error);
        return NextResponse.json({ error: error.message || "Error interno al obtener credenciales" }, { status: 500 });
    }
}

// POST or PUT /api/admin/system-credentials (Inline edit or create)
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !isAuthorizedMaster(session)) {
            return NextResponse.json({ error: "Acceso no autorizado. Exclusivo para Juan Pablo Guzmán / Dirección." }, { status: 403 });
        }

        const body = await req.json();
        const { action = "update", id, name, lastName, email, password, role, isActive, cedula, phoneNumber } = body;

        // 1. Fetch current vault
        const vaultSetting = await prisma.systemSetting.findUnique({
            where: { key: VAULT_SETTING_KEY }
        });

        let vault: Record<string, string> = {};
        if (vaultSetting?.value) {
            try {
                vault = JSON.parse(vaultSetting.value);
            } catch (e) {
                vault = {};
            }
        }

        if (action === "create") {
            if (!email || !password) {
                return NextResponse.json({ error: "Email y contraseña son obligatorios." }, { status: 400 });
            }

            const cleanEmail = email.trim().toLowerCase();
            const cleanPassword = password.trim();
            const passwordHash = await bcrypt.hash(cleanPassword, 10);

            const newUser = await prisma.user.create({
                data: {
                    email: cleanEmail,
                    passwordHash,
                    name: name || "Nuevo Colaborador",
                    lastName: lastName || "",
                    role: role || "SALESPERSON",
                    isActive: isActive ?? true,
                    status: "APPROVED",
                    cedula: cedula || null,
                    phoneNumber: phoneNumber || null,
                }
            });

            // Update vault with plaintext
            vault[cleanEmail] = cleanPassword;
            vault[newUser.id] = cleanPassword;

            await prisma.systemSetting.upsert({
                where: { key: VAULT_SETTING_KEY },
                update: { value: JSON.stringify(vault), updatedAt: new Date() },
                create: { key: VAULT_SETTING_KEY, value: JSON.stringify(vault) }
            });

            return NextResponse.json({
                success: true,
                message: `Usuario ${cleanEmail} creado exitosamente con contraseña activa.`,
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    lastName: newUser.lastName,
                    fullName: [newUser.name, newUser.lastName].filter(Boolean).join(" "),
                    email: newUser.email,
                    password: cleanPassword,
                    role: newUser.role,
                    status: newUser.status,
                    isActive: newUser.isActive,
                    cedula: newUser.cedula,
                    phoneNumber: newUser.phoneNumber,
                }
            });
        }

        // Action === "update" (Inline edit)
        if (!id) {
            return NextResponse.json({ error: "Falta el ID del usuario a modificar." }, { status: 400 });
        }

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (lastName !== undefined) updateData.lastName = lastName;
        if (role !== undefined) updateData.role = role;
        if (isActive !== undefined) updateData.isActive = isActive;
        if (cedula !== undefined) updateData.cedula = cedula;
        if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;

        let cleanPassword = password ? String(password).trim() : null;
        if (cleanPassword) {
            updateData.passwordHash = await bcrypt.hash(cleanPassword, 10);
        }

        if (email) {
            updateData.email = String(email).trim().toLowerCase();
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData
        });

        // If password was edited, persist plaintext into vault
        if (cleanPassword) {
            const userEmail = updatedUser.email.toLowerCase();
            vault[userEmail] = cleanPassword;
            vault[updatedUser.id] = cleanPassword;

            await prisma.systemSetting.upsert({
                where: { key: VAULT_SETTING_KEY },
                update: { value: JSON.stringify(vault), updatedAt: new Date() },
                create: { key: VAULT_SETTING_KEY, value: JSON.stringify(vault) }
            });
        }

        return NextResponse.json({
            success: true,
            message: `Credenciales de ${updatedUser.name || updatedUser.email} actualizadas correctamente.`,
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                lastName: updatedUser.lastName,
                fullName: [updatedUser.name, updatedUser.lastName].filter(Boolean).join(" "),
                email: updatedUser.email,
                password: cleanPassword || vault[updatedUser.email.toLowerCase()] || vault[updatedUser.id] || "atomic2026",
                role: updatedUser.role,
                status: updatedUser.status,
                isActive: updatedUser.isActive,
                cedula: updatedUser.cedula,
                phoneNumber: updatedUser.phoneNumber
            }
        });

    } catch (error: any) {
        console.error("[SYSTEM_CREDENTIALS_POST] Error:", error);
        return NextResponse.json({ error: error.message || "Error al actualizar credenciales" }, { status: 500 });
    }
}
