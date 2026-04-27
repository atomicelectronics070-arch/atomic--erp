import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export default function NewCategoryPage() {
    async function createCategory(formData: FormData) {
        'use server'
        const name = formData.get('name') as string
        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
        const description = formData.get('description') as string

        await prisma.academyCategory.create({
            data: { name, slug, description }
        })

        redirect("/dashboard/academy")
    }

    return (
        <div className="min-h-screen bg-[#0F1923] text-white p-8">
            <div className="max-w-2xl mx-auto bg-white/5 p-8 border border-white/10">
                <h1 className="text-2xl font-black uppercase tracking-tighter mb-8 text-[#2563EB]">Crear Nueva Categoría</h1>
                
                <form action={createCategory} className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/50 block mb-2">Nombre de la Categoría</label>
                        <input name="name" required className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white focus:border-[#2563EB] outline-none" />
                    </div>
                    
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/50 block mb-2">Descripción</label>
                        <textarea name="description" required className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white focus:border-[#2563EB] outline-none h-32"></textarea>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button type="submit" className="flex-1 bg-[#2563EB] text-white py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-[#2563EB] transition-colors">Guardar Categoría</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
