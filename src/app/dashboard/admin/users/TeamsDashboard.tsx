"use client"

import { useState, useEffect } from "react"
import { Users, Plus, Shield, Hash, Save, X, Globe, Lock } from "lucide-react"

interface Team {
    id: string
    name: string
    members: string[]
    published: boolean
}

const INITIAL_TEAMS: Team[] = [
    { id: "1", name: "FUERZA DE VENTAS ALFA", members: ["Carlos Mendoza", "Ana Lucía Ortiz"], published: true },
    { id: "2", name: "OPERACIONES LOGÍSTICAS", members: ["Jorge Ramos", "Marta Silva"], published: true },
]

export default function TeamsDashboard({ isAdmin = false }: { isAdmin?: boolean }) {
    const [teams, setTeams] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState<Partial<Team>>({ name: "", members: [] })
    const [newMember, setNewMember] = useState("")

    // Fetch teams from API
    useEffect(() => {
        fetchTeams()
    }, [])

    const fetchTeams = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/admin/teams")
            const data = await res.json()
            setTeams(Array.isArray(data) ? data : [])
        } catch (e) {
            console.error("Error loading teams", e)
        } finally {
            setLoading(false)
        }
    }

    const handleAddTeam = async () => {
        if (!formData.name) return
        try {
            const res = await fetch("/api/admin/teams", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            if (res.ok) {
                fetchTeams()
                setIsModalOpen(false)
                setFormData({ name: "", members: [] })
            }
        } catch (e) {
            console.error("Error creating team", e)
        }
    }

    const handleDeleteTeam = async (id: string) => {
        if (confirm("¿Está seguro de eliminar este equipo permanentemente?")) {
            try {
                const res = await fetch(`/api/admin/teams/${id}`, { method: "DELETE" })
                if (res.ok) fetchTeams()
            } catch (e) {
                console.error("Error deleting team", e)
            }
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <Shield className="text-orange-600" size={24} />
                    <h2 className="text-xl font-bold uppercase tracking-tight">Estructura de Equipos</h2>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-neutral-900 text-white px-6 py-3 font-bold uppercase tracking-widest text-[10px] flex items-center space-x-2 hover:bg-orange-600 transition-all"
                    >
                        <Plus size={16} />
                        <span>Crear Grupo</span>
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team) => (
                    <div key={team.id} className="bg-white border border-neutral-100 p-8 shadow-sm relative group hover:border-orange-600 transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-neutral-50 text-neutral-400 group-hover:bg-orange-50 group-hover:text-orange-600 transition-all">
                                <Users size={20} />
                            </div>
                            <div className="flex items-center space-x-2">
                                {team.published ? (
                                    <span className="flex items-center text-[9px] font-bold text-green-600 bg-green-50 px-2 py-1 uppercase tracking-widest"><Globe size={10} className="mr-1" /> Público</span>
                                ) : (
                                    <span className="flex items-center text-[9px] font-bold text-neutral-400 bg-neutral-50 px-2 py-1 uppercase tracking-widest"><Lock size={10} className="mr-1" /> Privado</span>
                                )}
                            </div>
                        </div>

                        <h3 className="text-sm font-bold text-neutral-900 mb-4 uppercase tracking-tighter leading-tight">{team.name}</h3>

                        <div className="space-y-3 pt-4 border-t border-neutral-50">
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center">
                                <Hash size={12} className="mr-1" /> Integrantes ({team.members.length})
                            </p>
                            <div className="space-y-1">
                                {team.members.map((member: string, i: number) => (
                                    <p key={i} className="text-xs font-medium text-neutral-600">{member}</p>
                                ))}
                            </div>
                        </div>

                        {isAdmin && (
                            <div className="absolute bottom-4 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleDeleteTeam(team.id)}
                                    className="text-[10px] font-bold text-neutral-300 hover:text-red-600 uppercase tracking-widest underline decoration-neutral-200 underline-offset-4"
                                >
                                    Eliminar Grupo
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-white/80 backdrop-blur-sm p-6">
                    <div className="bg-white w-full max-w-md border border-neutral-200 shadow-2xl p-10">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-lg font-bold uppercase tracking-tight">Nueva Configuración de Equipo</h3>
                            <button onClick={() => setIsModalOpen(false)}><X size={24} className="text-neutral-400" /></button>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Nombre del Grupo</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-neutral-50 border border-neutral-100 p-4 text-sm font-bold outline-none focus:border-orange-600 transition-all uppercase"
                                    placeholder="EJ: OPERACIONES ESPECIALES"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Añadir Integrante</label>
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={newMember}
                                        onChange={(e) => setNewMember(e.target.value)}
                                        className="flex-1 bg-neutral-50 border border-neutral-100 p-4 text-sm font-medium outline-none"
                                        placeholder="Nombre del colaborador..."
                                    />
                                    <button
                                        onClick={() => {
                                            if (newMember) {
                                                setFormData({ ...formData, members: [...(formData.members || []), newMember] })
                                                setNewMember("")
                                            }
                                        }}
                                        className="bg-neutral-900 text-white px-4 font-bold"
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {formData.members?.map((m: string, i: number) => (
                                        <span key={i} className="bg-orange-50 text-orange-600 text-[10px] font-bold px-3 py-1 uppercase border border-orange-100 flex items-center">
                                            {m} <button onClick={() => setFormData({ ...formData, members: formData.members?.filter((x: string) => x !== m) })}><X size={10} className="ml-2" /></button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleAddTeam}
                                className="w-full bg-orange-600 text-white font-bold py-5 mt-6 uppercase tracking-widest text-xs flex items-center justify-center space-x-2"
                            >
                                <Save size={18} />
                                <span>Publicar Equipo</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
