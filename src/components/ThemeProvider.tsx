"use client"

import { useEffect } from "react"

export function ThemeProvider() {
    useEffect(() => {
        const applyTheme = (theme: string) => {
            document.documentElement.setAttribute("data-theme", theme)
            try {
                localStorage.setItem("atomic_theme", theme)
            } catch (e) {}
        }

        // Initialize from localStorage
        const savedTheme = localStorage.getItem("atomic_theme") || "cyber-neon"
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
