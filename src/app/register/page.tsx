"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        profileData: "",
        aspirations: "",
        availability: "",
    })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Something went wrong")
            }

            setSuccess(true)
            setTimeout(() => {
                router.push("/login")
            }, 4000)

        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white  p-4">
                <div className="w-full max-w-md bg-white  rounded-none shadow-xl p-8 text-center">
                    <div className="w-16 h-16 bg-green-100  rounded-none flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-900  mb-2">Solicitud Enviada</h2>
                    <p className="text-neutral-500  mb-6">
                        Tu solicitud ha sido recibida y está pendiente de aprobación por el administrador. Serás redirigido al inicio de sesión en breve.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white  p-4 py-12">
            <div className="w-full max-w-xl bg-white  rounded-none shadow-xl border border-neutral-100  p-8">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-neutral-900  mb-2">Únete a ATOMIC <span className="text-orange-600">INDUSTRIES</span></h1>
                    <p className="text-neutral-500 ">Envía tu solicitud para obtener acceso a la plataforma</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50  border-l-4 border-red-500 rounded-r text-red-700  text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700  mb-2">Nombre Completo</label>
                            <input type="text" name="name" required value={formData.name} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-none border border-neutral-200  bg-white  text-neutral-900  focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700  mb-2">Correo Electrónico</label>
                            <input type="email" name="email" required value={formData.email} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-none border border-neutral-200  bg-white  text-neutral-900  focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700  mb-2">Contraseña</label>
                        <input type="password" name="password" required minLength={8} value={formData.password} onChange={handleChange}
                            className="w-full px-4 py-3 rounded-none border border-neutral-200  bg-white  text-neutral-900  focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700  mb-2">Perfil / Experiencia</label>
                        <textarea name="profileData" rows={3} required value={formData.profileData} onChange={handleChange} placeholder="Describe brevemente tu perfil profesional"
                            className="w-full px-4 py-3 rounded-none border border-neutral-100  bg-neutral-50  text-neutral-900  focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-none"></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700  mb-2">Aspiraciones</label>
                        <textarea name="aspirations" rows={2} required value={formData.aspirations} onChange={handleChange} placeholder="¿Cuáles son tus metas?"
                            className="w-full px-4 py-3 rounded-none border border-neutral-200  bg-white  text-neutral-900  focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-none"></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700  mb-2">Disponibilidad de Tiempo</label>
                        <input type="text" name="availability" required value={formData.availability} onChange={handleChange} placeholder="ej. Tiempo completo, Mañanas, 20 hrs/semana"
                            className="w-full px-4 py-3 rounded-none border border-neutral-200  bg-white  text-neutral-900  focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-none font-bold transition-all disabled:opacity-50 mt-6 shadow-xl flex justify-center items-center shadow-orange-500/30">
                        {loading ? "Enviando..." : "Enviar Solicitud"}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-neutral-500 ">
                    ¿Ya tienes acceso?{" "}
                    <Link href="/login" className="text-orange-600  hover:underline font-medium">
                        Inicia Sesión aquí
                    </Link>
                </div>
            </div>
        </div>
    )
}




