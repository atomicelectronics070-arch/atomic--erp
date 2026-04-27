import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function NewCoursePage() {
    async function createCourse(formData: FormData) {
        'use server'
        const title = formData.get('title') as string
        const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
        const description = formData.get('description') as string
        const categoryId = formData.get('categoryId') as string
        const published = formData.get('published') === 'on'

        await prisma.course.create({
            data: { title, slug, description, categoryId, published }
        })

        redirect("/dashboard/academy")
    }

    const categories = await prisma.academyCategory.findMany()

    return (
        <div className="min-h-screen bg-[#0F1923] text-white p-8">
            <div className="max-w-2xl mx-auto bg-white/5 p-8 border border-white/10">
                <h1 className="text-2xl font-black uppercase tracking-tighter mb-8 text-[#E8341A]">Crear Nuevo Curso</h1>
                
                <form action={createCourse} className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/50 block mb-2">Título del Curso</label>
                        <input name="title" required className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white focus:border-[#E8341A] outline-none" />
                    </div>
                    
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/50 block mb-2">Descripción</label>
                        <textarea name="description" required className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white focus:border-[#E8341A] outline-none h-32"></textarea>
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/50 block mb-2">Categoría</label>
                        <select name="categoryId" required className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white focus:border-[#E8341A] outline-none">
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-3 py-4">
                        <input type="checkbox" name="published" id="published" className="w-4 h-4 accent-[#E8341A]" defaultChecked />
                        <label htmlFor="published" className="text-xs font-bold uppercase tracking-widest">Publicar Inmediatamente</label>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button type="submit" className="flex-1 bg-[#E8341A] text-white py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-[#E8341A] transition-colors">Guardar Curso</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
