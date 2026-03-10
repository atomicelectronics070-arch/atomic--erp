"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Global Error Caught:", error)
    }, [error])

    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-white p-8 text-center font-sans relative overflow-hidden">
            {/* Abstract Background Element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-50/50 rounded-full blur-3xl -z-10"></div>

            <div className="mb-8">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-orange-600 font-bold text-2xl">!</span>
                </div>
            </div>

            <h2 className="text-3xl font-black tracking-tight text-neutral-900 mb-4 uppercase">Error de Aplicación</h2>
            <p className="text-base text-neutral-500 mb-8 max-w-md">
                Se encontró un problema interno en el sistema al intentar procesar o navegar hacia esta sección.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button
                    onClick={() => reset()}
                    className="bg-orange-600 text-white px-8 py-3 rounded-none text-xs font-bold uppercase tracking-widest hover:bg-orange-700 transition-all shadow-xl shadow-orange-600/20 active:scale-95"
                >
                    Intentar Recuperar
                </button>
                <Link
                    href="/dashboard"
                    className="bg-neutral-900 text-white px-8 py-3 rounded-none text-xs font-bold uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-neutral-900/20 active:scale-95"
                >
                    Volver al Inicio
                </Link>
            </div>

            {process.env.NODE_ENV === "development" && (
                <div className="mt-12 p-6 bg-red-50 text-red-800 text-left text-xs font-mono w-full max-w-3xl border-l-4 border-red-500 overflow-x-auto">
                    <p className="font-bold mb-2">Detalles para Desarrollo:</p>
                    {error.message}
                    <br /><br />
                    {error.stack}
                </div>
            )}
        </div>
    )
}
