"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { App } from "@capacitor/app"
import { Download, X, Sparkles, RefreshCw, ChevronDown, ChevronUp } from "lucide-react"
import { LATEST_APK_VERSION } from "@/lib/apkVersion"

interface UpdateInfo {
  latestVersion: string
  updateAvailable: boolean
  downloadUrl: string
  changelog: string[]
}

export function AppUpdateChecker() {
  const [mounted, setMounted] = useState(false)
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null)
  const [dismissed, setDismissed] = useState(true) // Inicialmente true para evitar destello
  const [downloading, setDownloading] = useState(false)
  const [showChangelog, setShowChangelog] = useState(false)
  const [currentVersion, setCurrentVersion] = useState<string>("0.0.0")

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    // Comprobar si ya fue desestimada esta versión en el dispositivo
    const isDismissed = localStorage.getItem(`update_dismissed_${LATEST_APK_VERSION}`) === "true"
    if (isDismissed) {
      return
    }
    setDismissed(false) // Si no está desestimada, permitimos que se muestre si hay update

    // Solo correr en Capacitor (Android/iOS nativo), nunca en browser de escritorio
    const isCapacitor =
      typeof window !== "undefined" &&
      !!(window as any).Capacitor &&
      (window as any).Capacitor?.isNativePlatform?.()

    if (!isCapacitor) return

    const checkForUpdates = async () => {
      try {
        // Obtener versión real del APK instalado vía plugin nativo
        let version = "1.0.0"
        try {
          const appInfo = await App.getInfo()
          version = appInfo.version || "1.0.0"
        } catch {
          // Si falla, usamos la versión por defecto
        }
        setCurrentVersion(version)

        // Preguntar al servidor si hay una versión más nueva
        const res = await fetch(`/api/app-version?v=${version}`, {
          signal: AbortSignal.timeout(5000), // timeout de 5s
        })
        if (!res.ok) return
        const data = await res.json()

        if (data.updateAvailable) {
          // Esperar 3 segundos tras el inicio antes de mostrar la notificación
          setTimeout(() => setUpdateInfo(data), 3000)
        }
      } catch (err) {
        // Silencioso — no queremos molestar al usuario con errores de red
        console.warn("[AppUpdateChecker] No se pudo verificar actualizaciones:", err)
      }
    }

    checkForUpdates()
  }, [])

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem(`update_dismissed_${LATEST_APK_VERSION}`, "true")
  }

  const handleUpdate = async () => {
    if (!updateInfo) return
    setDownloading(true)

    try {
      // Abrir la URL de descarga del APK — Android abrirá el instalador automáticamente
      const downloadUrl = `http://192.168.0.105:3000${updateInfo.downloadUrl}`
      window.open(downloadUrl, "_system")

      // Mostrar mensaje de espera
      setTimeout(() => {
        setDownloading(false)
        handleDismiss()
      }, 3000)
    } catch (err) {
      console.error("Error al descargar actualización:", err)
      setDownloading(false)
    }
  }

  if (!mounted || !updateInfo || dismissed) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -120, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed top-0 left-0 right-0 z-[9999] px-4 pt-3 pb-2"
        style={{ pointerEvents: "none" }}
      >
        <div
          className="relative max-w-lg mx-auto rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background: "linear-gradient(135deg, #0A0A0A 0%, #1a1a1a 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            pointerEvents: "all",
          }}
        >
          {/* Glow accent top bar */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background: "linear-gradient(90deg, #60a5fa, #818cf8, #c084fc)",
            }}
          />

          {/* Animated shimmer */}
          <motion.div
            animate={{ x: ["−100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
            className="absolute inset-0 opacity-[0.04]"
            style={{
              background: "linear-gradient(105deg, transparent 40%, white 50%, transparent 60%)",
            }}
          />

          <div className="relative p-4">
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  <Sparkles size={18} className="text-white" />
                </motion.div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-white font-black text-sm leading-tight">
                      Nueva versión disponible
                    </p>
                    <p className="text-white/40 text-[10px] font-medium mt-0.5 tracking-wide uppercase">
                      v{currentVersion} → v{updateInfo.latestVersion}
                    </p>
                  </div>
                  <button
                    onClick={handleDismiss}
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Changelog toggle */}
                <button
                  onClick={() => setShowChangelog(!showChangelog)}
                  className="flex items-center gap-1 text-white/40 hover:text-white/70 text-[10px] font-bold uppercase tracking-wider mt-2 transition-colors"
                >
                  {showChangelog ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  {showChangelog ? "Ocultar" : "Ver"} cambios
                </button>

                <AnimatePresence>
                  {showChangelog && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden mt-2 space-y-1"
                    >
                      {updateInfo.changelog.map((item, i) => (
                        <li
                          key={i}
                          className="text-white/60 text-[11px] font-medium leading-tight"
                        >
                          {item}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>

                {/* Action buttons */}
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={handleUpdate}
                    disabled={downloading}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider text-white transition-all"
                    style={{
                      background: downloading
                        ? "rgba(255,255,255,0.1)"
                        : "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                      boxShadow: downloading ? "none" : "0 4px 15px rgba(59,130,246,0.4)",
                    }}
                  >
                    {downloading ? (
                      <>
                        <RefreshCw size={13} className="animate-spin" />
                        Descargando...
                      </>
                    ) : (
                      <>
                        <Download size={13} />
                        Actualizar ahora
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDismiss}
                    className="px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
                  >
                    Después
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
