"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useCart } from "@/context/CartContext"
import { motion, AnimatePresence } from "framer-motion"

import { AISearchBot } from "@/components/ui/AISearchBot"
import { CartBotOverlay } from "@/components/ui/CartBotOverlay"
import { BuyerBotOverlay } from "@/components/ui/BuyerBotOverlay"

export default function WebLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const { totalItems } = useCart()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        fetch("/api/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "web" })
        }).catch(() => {})
    }, [pathname])

    return (
        <div className="min-h-screen font-sans text-slate-100 bg-[#070709] relative overflow-x-hidden selection:bg-blue-500/30">
            {/* ── MAIN CONTENT ── */}
            <AnimatePresence mode="wait">
                <motion.main
                    key={pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10 min-h-screen"
                >
                    {children}
                </motion.main>
            </AnimatePresence>

            {mounted && <AISearchBot />}
            {mounted && <CartBotOverlay />}
            {mounted && <BuyerBotOverlay />}
        </div>
    )
}
