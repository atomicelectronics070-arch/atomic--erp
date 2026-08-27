"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Lock, User, Key, ArrowRight, ShieldCheck, Briefcase } from "lucide-react"

export default function LoginContratacionesPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    // Redirect to general portal or show status
    setTimeout(() => {
      window.location.href = "/login"
    }, 800)
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/3 w-[450px] h-[450px] rounded-full bg-cyan-600/15 blur-[150px]" />
      </div>

      {/* Header */}
      <header className="p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/web/contrataciones" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Briefcase className="text-white" size={20} />
            </div>
            <span className="text-lg font-black tracking-tight text-white">ATOMIC <span className="text-cyan-400">TALENT</span></span>
          </Link>
          <Link href="/web/contrataciones" className="text-xs text-slate-400 hover:text-white font-bold transition-colors">
            ← Volver a Convocatorias
          </Link>
        </div>
      </header>

      {/* Center Card */}
      <main className="relative z-10 max-w-md w-full mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 sm:p-10 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-2xl shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-4">
              <Lock size={26} />
            </div>
            <h1 className="text-2xl font-black text-white">Portal de Contrataciones</h1>
            <p className="text-slate-400 text-xs mt-1">Acceso para postulantes, colaboradores y evaluadores.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Correo Electrónico</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-3.5 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@atomic.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Contraseña</label>
              <div className="relative">
                <Key size={16} className="absolute left-4 top-3.5 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl bg-cyan-500 text-slate-950 font-black text-sm hover:bg-cyan-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <span>{loading ? "Validando credenciales..." : "Ingresar al Portal"}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-slate-400">
              ¿Aún no te has postulado?{" "}
              <Link href="/web/contrataciones#formulario-postulacion" className="text-cyan-400 hover:underline font-bold">
                Postular Aquí
              </Link>
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-slate-600 text-xs">
        Atomic Industries HR Portal © 2026
      </footer>
    </div>
  )
}
