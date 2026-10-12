"use client"

import { SessionProvider } from "next-auth/react"
import { CartProvider } from "@/context/CartContext"
import { AppUpdateChecker } from "./AppUpdateChecker"
import { ThemeProvider } from "./ThemeProvider"
import PersonalBotBubble from "./PersonalBotBubble"

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <CartProvider>
                <ThemeProvider />
                <AppUpdateChecker />
                {children}
                <PersonalBotBubble />
            </CartProvider>
        </SessionProvider>
    )
}


