import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { GraduationCap, ChevronLeft, Plus } from "lucide-react"

function generateSlug(title: string): string {
    return title.toLowerCase()
        .replace(/[áàäâ]/g, "a").replace(/[éèëê]/g, "e")
        .replace(/[íìïî]/g, "i").replace(/[óòöô]/g, "o")
        .replace(/[úùüû]/g, "u").replace(/[ñ]/g, "n")
        .replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-")
}

export default async function NewCoursePage() {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MANAGEMENT")) {
        redirect("/dashboard")
    }

    async function createCourse(formData: FormData) {
        "use server"
        const title = formData.get("title") as string
        const description = formData.get("description") as string
        const categoryId = formData.get("categoryId") as string
        const imageUrl = formData.get("imageUrl") as string
        const published = formData.get("published") === "on"
        const slug = generateSlug(title) + "-" + Date.now().toString(36)

        const course = await prisma.course.create({
            data: {
                title,
                slug,
                description: description || null,
                imageUrl: imageUrl || null,
                categoryId,
                published
            }
        })
        redirect(`/dashboard/academy/course/${course.id}`)
    }

    const categories = await prisma.academyCategory.findMany({ orderBy: { name: "asc" } })

    return (
        <div className="space-y-12 pb-32 relative">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] bg-[#E8341A]/5 blur-[120px] animate-pulse" />
            </div>

            {/* Header */}
            <div className="border-b border-white/5 pb-10 relative z-10">
                <Link
                    href="/dashboard/academy"
                    className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-[#E8341A] transition-colors italic mb-6 w-fit"
                >
                    <ChevronLeft size={12} /> Volver a Academia
                </Link>
                <div className="flex items-center gap-3 text-[#E8341A] mb-3">
                    <GraduationCap size={18} />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] italic">Nuevo Curso</span>
                </div>
                <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
                    CREAR <span className="text-[#E8341A]">CURSO</span>
                </h1>
            </div>

            {/* Form */}
            <div className="relative z-10 max-w-3xl">
                <form action={createCourse} className="space-y-8">
                    <div className="border border-white/[0.06] bg-white/[0.02] p-8 space-y-8">
                        <h2 className="text-xs font-black uppercase italic tracking-widest text-white border-b border-white/5 pb-4">
                            Información del Curso
                        </h2>

                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-white/30 italic block">
                                Título del Curso *
                            </label>
                            <input
                                name="title"
                                required
                                placeholder="Ej: Fundamentos de Redes Cisco"
                                className="w-full bg-white/[0.03] border border-white/10 px-5 py-4 text-sm text-white font-medium outline-none focus:border-[#E8341A]/50 transition-all placeholder-white/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-white/30 italic block">
                                Descripción
                            </label>
                            <textarea
                                name="description"
                                rows={4}
                                placeholder="Describe el contenido y objetivo del curso..."
                                className="w-full bg-white/[0.03] border border-white/10 px-5 py-4 text-sm text-white font-medium outline-none focus:border-[#E8341A]/50 transition-all resize-none placeholder-white/20"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-white/30 italic block">
                                    Categoría *
                                </label>
                                <select
                                    name="categoryId"
                                    required
                                    className="w-full bg-[#0a0a0a] border border-white/10 px-5 py-4 text-sm text-white font-medium outline-none focus:border-[#E8341A]/50 transition-all"
                                >
                                    <option value="" className="bg-black">Seleccionar categoría...</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id} className="bg-black">{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-white/30 italic block">
                                    Imagen de Portada (URL)
                                </label>
                                <input
                                    name="imageUrl"
                                    type="url"
                                    placeholder="https://..."
                                    className="w-full bg-white/[0.03] border border-white/10 px-5 py-4 text-sm text-white font-medium outline-none focus:border-[#E8341A]/50 transition-all placeholder-white/20"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-5 border border-white/5 bg-white/[0.01]">
                            <input
                                type="checkbox"
                                name="published"
                                id="published"
                                defaultChecked
                                className="w-4 h-4 accent-[#E8341A] cursor-pointer"
                            />
                            <label htmlFor="published" className="text-xs font-black uppercase tracking-widest text-white/60 italic cursor-pointer">
                                Publicar inmediatamente (visible en Academia pública)
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="flex items-center gap-3 px-10 py-5 bg-[#E8341A] text-white text-[10px] font-black uppercase tracking-widest italic hover:shadow-[0_0_30px_rgba(232,52,26,0.5)] transition-all hover:-translate-y-0.5"
                        >
                            <Plus size={16} />
                            Crear Curso
                        </button>
                        <Link
                            href="/dashboard/academy"
                            className="flex items-center gap-3 px-8 py-5 border border-white/10 text-white/40 hover:text-white hover:border-white/30 text-[10px] font-black uppercase tracking-widest italic transition-all"
                        >
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
