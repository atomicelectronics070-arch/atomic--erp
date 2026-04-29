import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import QuotationClient from "./QuotationClient"

export const dynamic = "force-dynamic"

export default async function QuotationPage() {
    const session = await getServerSession(authOptions)
    if (!session) return null

    // Fetch initial data on server
    const [products, history, lastQuote] = await Promise.all([
        prisma.product.findMany({ 
            where: { isDeleted: false }, 
            select: { id: true, name: true, price: true, sku: true, description: true } 
        }),
        prisma.quote.findMany({ 
            orderBy: { createdAt: 'desc' },
            take: 20
        }),
        prisma.quote.findFirst({
            orderBy: { createdAt: 'desc' },
            select: { quoteNumber: true }
        })
    ])

    // Generate next number logic on server
    let nextNum = "PROP-00-001"
    if (lastQuote?.quoteNumber) {
        const match = lastQuote.quoteNumber.match(/PROP-(\d+)-(\d+)/)
        if (match) {
            const sequence = parseInt(match[2]) + 1
            nextNum = `PROP-00-${sequence.toString().padStart(3, '0')}`
        }
    }

    return (
        <QuotationClient 
            initialProducts={JSON.parse(JSON.stringify(products))}
            initialHistory={JSON.parse(JSON.stringify(history))}
            nextNumber={nextNum}
            session={session}
        />
    )
}
