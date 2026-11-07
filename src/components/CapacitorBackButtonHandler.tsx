"use client"

import { useEffect, useRef } from "react"
import { App } from "@capacitor/app"
import { usePathname, useRouter } from "next/navigation"

export function CapacitorBackButtonHandler() {
  const pathname = usePathname()
  const router = useRouter()
  const pathnameRef = useRef(pathname)

  useEffect(() => {
    pathnameRef.current = pathname
  }, [pathname])

  useEffect(() => {
    // Only execute if running inside Capacitor native container (Android / iOS)
    const isCapacitor =
      typeof window !== "undefined" &&
      !!(window as any).Capacitor &&
      (window as any).Capacitor?.isNativePlatform?.()

    if (!isCapacitor) return

    let backListenerHandle: any = null

    const registerBackHandler = async () => {
      try {
        backListenerHandle = await App.addListener("backButton", ({ canGoBack }) => {
          const currentPath = pathnameRef.current || window.location.pathname

          // 1. Prioridad: Si hay modales abiertos en la vista, cerrarlos primero
          const openModals = document.querySelectorAll<HTMLElement>(
            "[data-back-close='true'], button[aria-label='Cerrar'], button[aria-label='Close'], .atomic-modal-close"
          )
          if (openModals.length > 0) {
            const topModalClose = openModals[openModals.length - 1]
            topModalClose.click()
            return
          }

          // 2. Si estamos en cualquier pantalla secundaria, hacer retroceso de historial
          const isRootScreen =
            currentPath === "/dashboard" ||
            currentPath === "/" ||
            currentPath === "/login" ||
            currentPath === "/dashboard/"

          if (!isRootScreen) {
            if (window.history.length > 1) {
              window.history.back()
            } else {
              router.push("/dashboard")
            }
          } else {
            // 3. Si ya estamos en la pantalla principal de inicio/dashboard, minimizar la app
            App.minimizeApp()
          }
        })
      } catch (err) {
        console.warn("[CapacitorBackButtonHandler] Could not register back button listener:", err)
      }
    }

    registerBackHandler()

    return () => {
      if (backListenerHandle?.remove) {
        backListenerHandle.remove()
      }
    }
  }, [router])

  return null
}
