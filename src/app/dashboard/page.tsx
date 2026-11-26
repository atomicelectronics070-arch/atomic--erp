import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { fetchFeed, getSalesRanking } from "@/lib/actions/social"
import SocialFeedClient from "./SocialFeedClient"

export const dynamic = "force-dynamic"

export default async function SocialDashboardPage() {
    const session = await getServerSession(authOptions)
    if (!session) return null

    const email = (session.user?.email || "").toLowerCase()
    const name = (session.user?.name || "").toLowerCase()
    const role = ((session.user as any)?.role || "").toUpperCase()
    const isAdmin = role.includes("ADMIN") || role.includes("COORDINATOR") || role.includes("MANAGEMENT")
    const isStefyOrEdicion = email.includes("stefy") || name.includes("stefy") || email.includes("edicion")

    if (isStefyOrEdicion && !isAdmin) {
        redirect("/dashboard/flash")
    }

    // Fetch initial data on server for hyper-speed
    const [feedRes, rankRes] = await Promise.all([
        fetchFeed(1, 20),
        getSalesRanking()
    ])

    const initialPosts = JSON.parse(JSON.stringify(feedRes.posts || []))
    const initialRanking = JSON.parse(JSON.stringify(rankRes.ranking || []))

    return (
        <SocialFeedClient 
            initialPosts={initialPosts}
            initialRanking={initialRanking}
            session={session}
        />
    )
}
