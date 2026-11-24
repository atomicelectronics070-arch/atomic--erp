"use client"

import { Suspense } from "react"
import { SessionProvider } from "next-auth/react"
import { CartProvider } from "@/context/CartContext"
import { AppUpdateChecker } from "./AppUpdateChecker"
import { ThemeProvider } from "./ThemeProvider"
import { CapacitorBackButtonHandler } from "./CapacitorBackButtonHandler"
import PermanentSocialBar from "./PermanentSocialBar"
import TelemetryPixel from "./telemetry/TelemetryPixel"

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <CartProvider>
                <ThemeProvider />
                <CapacitorBackButtonHandler />
                <AppUpdateChecker />
                <PermanentSocialBar variant="floating" />
                <Suspense fallback={null}>
                    <TelemetryPixel />
                </Suspense>
                {children}
            </CartProvider>
        </SessionProvider>
    )
}
