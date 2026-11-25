export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export interface BankAccountItem {
    id: string
    bankName: string
    accountType: "AHORROS" | "CORRIENTE"
    accountNumber: string
    holderName: string
    holderId: string
    email?: string
    isDefault: boolean
    createdAt: string
    updatedAt: string
}

const getSettingKey = (userId: string) => `user_bank_accounts_${userId}`

async function readAccounts(userId: string): Promise<BankAccountItem[]> {
    const setting = await prisma.systemSetting.findUnique({
        where: { key: getSettingKey(userId) }
    })
    if (!setting?.value) return []
    try {
        const parsed = JSON.parse(setting.value)
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

async function writeAccounts(userId: string, accounts: BankAccountItem[]) {
    await prisma.systemSetting.upsert({
        where: { key: getSettingKey(userId) },
        update: {
            value: JSON.stringify(accounts),
            description: `Cuentas bancarias registradas para recepción de pagos (${userId})`
        },
        create: {
            key: getSettingKey(userId),
            value: JSON.stringify(accounts),
            description: `Cuentas bancarias registradas para recepción de pagos (${userId})`
        }
    })
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const requestedUserId = searchParams.get("userId")
        const role = String((session.user as any).role || "").toUpperCase()
        const isAdmin = role.includes("ADMIN") || role.includes("MANAGEMENT")

        const targetUserId = requestedUserId && isAdmin ? requestedUserId : session.user.id
        const accounts = await readAccounts(targetUserId)

        return NextResponse.json({ accounts })
    } catch (error) {
        console.error("GET /api/user/bank-accounts error:", error)
        return NextResponse.json({ error: "Error al cargar cuentas bancarias" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const bankName = String(body.bankName || "").trim()
        const accountType = String(body.accountType || "AHORROS").toUpperCase() === "CORRIENTE" ? "CORRIENTE" : "AHORROS"
        const accountNumber = String(body.accountNumber || "").trim()
        const holderName = String(body.holderName || "").trim()
        const holderId = String(body.holderId || "").trim()
        const email = String(body.email || session.user.email || "").trim()
        const isDefault = Boolean(body.isDefault)
        const editId = body.id ? String(body.id) : null

        if (!bankName || !accountNumber || !holderName || !holderId) {
            return NextResponse.json(
                { error: "Completa banco, número de cuenta, titular y cédula/RUC" },
                { status: 400 }
            )
        }

        let accounts = await readAccounts(session.user.id)
        const now = new Date().toISOString()

        if (isDefault || accounts.length === 0) {
            accounts = accounts.map(acc => ({ ...acc, isDefault: false }))
        }

        if (editId) {
            const idx = accounts.findIndex(a => a.id === editId)
            if (idx === -1) {
                return NextResponse.json({ error: "Cuenta bancaria no encontrada" }, { status: 404 })
            }
            accounts[idx] = {
                ...accounts[idx],
                bankName,
                accountType,
                accountNumber,
                holderName,
                holderId,
                email,
                isDefault: isDefault || accounts.length === 1 ? true : accounts[idx].isDefault,
                updatedAt: now
            }
        } else {
            const newAccount: BankAccountItem = {
                id: `bank_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
                bankName,
                accountType,
                accountNumber,
                holderName,
                holderId,
                email,
                isDefault: isDefault || accounts.length === 0,
                createdAt: now,
                updatedAt: now
            }
            accounts.push(newAccount)
        }

        // Guarantee at least one default account
        if (accounts.length > 0 && !accounts.some(a => a.isDefault)) {
            accounts[0].isDefault = true
        }

        await writeAccounts(session.user.id, accounts)

        // Notify Admins when a user registers a new bank account
        if (!editId) {
            const admins = await prisma.user.findMany({
                where: { role: { contains: "ADMIN" } },
                select: { id: true }
            }).catch(() => [])

            const userName = session.user.name || session.user.email || "Colaborador"
            for (const admin of admins) {
                if (admin.id === session.user.id) continue
                await prisma.notification.create({
                    data: {
                        userId: admin.id,
                        title: "🏦 Cuenta Bancaria Registrada para Pagos",
                        message: `${userName} registró una cuenta en ${bankName} (${accountType} #${accountNumber}) para recepción de pagos y bonificaciones.`,
                        type: "BANK_ACCOUNT",
                        relatedId: session.user.id
                    }
                }).catch(() => {})
            }
        }

        return NextResponse.json({ success: true, accounts })
    } catch (error) {
        console.error("POST /api/user/bank-accounts error:", error)
        return NextResponse.json({ error: "Error al guardar cuenta bancaria" }, { status: 500 })
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const id = String(body.id || "")
        if (!id) {
            return NextResponse.json({ error: "Falta id de cuenta" }, { status: 400 })
        }

        let accounts = await readAccounts(session.user.id)
        if (!accounts.some(a => a.id === id)) {
            return NextResponse.json({ error: "Cuenta no encontrada" }, { status: 404 })
        }

        accounts = accounts.map(acc => ({
            ...acc,
            isDefault: acc.id === id,
            updatedAt: acc.id === id ? new Date().toISOString() : acc.updatedAt
        }))

        await writeAccounts(session.user.id, accounts)
        return NextResponse.json({ success: true, accounts })
    } catch (error) {
        console.error("PATCH /api/user/bank-accounts error:", error)
        return NextResponse.json({ error: "Error al actualizar cuenta principal" }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")
        if (!id) {
            return NextResponse.json({ error: "Falta id de cuenta" }, { status: 400 })
        }

        let accounts = await readAccounts(session.user.id)
        accounts = accounts.filter(a => a.id !== id)

        if (accounts.length > 0 && !accounts.some(a => a.isDefault)) {
            accounts[0].isDefault = true
        }

        await writeAccounts(session.user.id, accounts)
        return NextResponse.json({ success: true, accounts })
    } catch (error) {
        console.error("DELETE /api/user/bank-accounts error:", error)
        return NextResponse.json({ error: "Error al eliminar cuenta bancaria" }, { status: 500 })
    }
}
