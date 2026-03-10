import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { name, password, profileData, aspirations, availability } = body
        const email = body.email?.toLowerCase()

        if (!name || !email || !password || !profileData || !aspirations || !availability) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json({ error: "User already exists with this email" }, { status: 400 })
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                profileData,
                aspirations,
                availability,
                status: "PENDING",
                role: "SALESPERSON", // Default to salesperson
            },
        })

        return NextResponse.json({
            message: "Application submitted successfully",
            user: { id: user.id, email: user.email, name: user.name },
        }, { status: 201 })
    } catch (error: any) {
        console.error("Registration error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
