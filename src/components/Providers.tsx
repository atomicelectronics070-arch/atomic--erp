"use client"

import { SessionProvider } from "next-auth/react"
import { CartProvider } from "@/context/CartContext"
import { AppUpdateChecker } from "./AppUpdateChecker"
import { ThemeProvider } from "./ThemeProvider"
import PersonalBotBubble from "./PersonalBotBubble"

import { usePathname } from "next/navigation"

export function Providers({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isPublicInforme = pathname?.startsWith("/informes") || pathname?.startsWith("/web/informes")

    return (
        <SessionProvider>
            <CartProvider>
                <ThemeProvider />
                <AppUpdateChecker />
                {children}
                {!isPublicInforme && <PersonalBotBubble />}
            </CartProvider>
        </SessionProvider>
    )
}



