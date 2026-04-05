import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function run() {
    console.log("Attempting to add 'canCreateBlogs' column to the database...")
    try {
        await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "canCreateBlogs" BOOLEAN DEFAULT false;`
        console.log("Column 'canCreateBlogs' added successfully (or already existed).")
    } catch (err) {
        console.error("Failed to add column:", err)
    }
}

run().catch(err => console.error(err)).finally(() => prisma.$disconnect())
