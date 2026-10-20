export const dynamic = 'force-dynamic'
export const revalidate = 0

import { Suspense } from "react"
import PageClient from "./PageClient"

export default function DynamicDashboardPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#070a14] flex items-center justify-center text-cyan-400 font-mono text-xs">Cargando Coordinación...</div>}>
            <PageClient />
        </Suspense>
    )
}
