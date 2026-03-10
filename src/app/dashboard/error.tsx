"use client"

import { useEffect } from "react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Dashboard Error:", error)
    }, [error])

    return (
        <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-white rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-800 mb-2">Algo salió mal</h2>
            <p className="text-sm text-neutral-500 mb-6 max-w-md">
                Hubo un problema al cargar esta sección. Puedes intentar recargar la página o volver al panel anterior.
            </p>

            <div className="flex gap-4">
                <button
                    onClick={() => reset()}
                    className="bg-orange-600 text-white px-6 py-2 rounded-none text-xs font-bold uppercase tracking-widest hover:bg-orange-700 transition-colors shadow-lg"
                >
                    Intentar de nuevo
                </button>
                <button
                    onClick={() => window.location.href = "/dashboard"}
                    className="bg-neutral-100 text-neutral-600 px-6 py-2 rounded-none text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors"
                >
                    Volver a Inicio
                </button>
            </div>

            {process.env.NODE_ENV === "development" && (
                <div className="mt-8 p-4 bg-red-50 text-red-800 text-left text-xs font-mono w-full overflow-auto max-w-2xl border border-red-100">
                    {error.message}
                </div>
            )}
        </div>
    )
}
