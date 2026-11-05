"use client"

import { useEffect } from "react"

export function ThemeProvider() {
    useEffect(() => {
        const applyTheme = (theme: string) => {
            const validThemes = ["cyber-neon", "emerald-matrix", "midnight-purple", "solar-amber", "oled-black"]
            const targetTheme = validThemes.includes(theme) ? theme : "cyber-neon"
            document.documentElement.setAttribute("data-theme", targetTheme)
            try {
                localStorage.setItem("atomic_theme", targetTheme)
            } catch (e) {}
        }

        // Initialize from localStorage - default to cyber-neon (Dark Cyber Neon)
        let savedTheme = localStorage.getItem("atomic_theme") || "cyber-neon"
        if (savedTheme === "ticketmaster-white" || savedTheme === "blanco-tomate" || savedTheme === "white") {
            savedTheme = "cyber-neon"
        }
        applyTheme(savedTheme)

        // Listen for live theme changes from profile or elsewhere
        const handleThemeChange = (e: CustomEvent<string>) => {
            if (e.detail) {
                applyTheme(e.detail)
            }
        }

        window.addEventListener("theme-changed" as any, handleThemeChange as any)
        return () => {
            window.removeEventListener("theme-changed" as any, handleThemeChange as any)
        }
    }, [])

    return null
}
