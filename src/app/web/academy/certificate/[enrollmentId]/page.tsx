import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { notFound, redirect } from "next/navigation"
import { ShieldCheck, Award, Printer, Download, ChevronLeft } from "lucide-react"
import Link from "next/link"

export default async function CertificatePage({ params }: { params: Promise<{ enrollmentId: string }> }) {
    const { enrollmentId } = await params
    const session = await getServerSession(authOptions)
    if (!session) redirect("/login")

    const enrollment = await prisma.courseEnrollment.findUnique({
        where: { id: enrollmentId },
        include: {
            user: true,
            course: {
                include: { category: true }
            }
        }
    })

    if (!enrollment || enrollment.status !== 'COMPLETED' || enrollment.userId !== session.user.id) {
        notFound()
    }

    const completionDate = enrollment.completedAt ? new Date(enrollment.completedAt).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }) : 'Fecha no disponible'

    return (
        <div className="min-h-screen bg-[#0F1923] flex flex-col items-center justify-center p-6 md:p-20 overflow-auto">
            {/* Action Bar (Not visible when printing) */}
            <div className="fixed top-8 left-8 z-50 print:hidden">
                <Link href="/web/academy/dashboard" className="flex items-center gap-3 text-white/50 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.4em]">
                    <ChevronLeft size={16} /> Volver al Panel
                </Link>
            </div>

            <div className="fixed top-8 right-8 z-50 flex gap-4 print:hidden">
                <button 
                    onClick={() => window.print()} 
                    className="px-6 py-3 bg-white/5 border border-white/10 text-white text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3"
                >
                    <Printer size={16} /> Imprimir
                </button>
            </div>

            {/* THE CERTIFICATE */}
            <div className="w-full max-w-[1100px] aspect-[1.414/1] bg-white relative shadow-[0_80px_160px_-40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col p-20 border-[20px] border-[#0F1923]">
                {/* Background Textures */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-gradient-to-bl from-[#E8341A]/5 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-gradient-to-tr from-[#E8341A]/5 to-transparent"></div>

                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-32 h-32 border-t-[3px] border-l-[3px] border-[#E8341A] m-10"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 border-b-[3px] border-r-[3px] border-[#E8341A] m-10"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full items-center text-center">
                    <div className="mb-12">
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <div className="w-16 h-1 bg-[#0F1923]"></div>
                            <ShieldCheck size={32} className="text-[#E8341A]" />
                            <div className="w-16 h-1 bg-[#0F1923]"></div>
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.8em] text-[#0F1923] opacity-40 italic">Certificado de Excelencia Técnica</h4>
                    </div>

                    <h1 className="text-7xl font-black text-[#0F1923] tracking-tighter uppercase italic leading-none mb-10">
                        ATOMIC <span className="text-[#E8341A]">ACADEMY.</span>
                    </h1>

                    <div className="w-full h-px bg-[#0F1923]/10 mb-20 max-w-xl"></div>

                    <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-400 mb-6 italic">Por la presente se otorga a:</p>
                    
                    <h2 className="text-6xl font-black text-[#0F1923] uppercase tracking-tight mb-10 italic drop-shadow-sm">
                        {enrollment.user.name} {enrollment.user.lastName || ''}
                    </h2>

                    <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-500 max-w-2xl leading-loose mb-12">
                        Haber completado satisfactoriamente el programa intensivo de especialización en la categoría de <span className="text-[#0F1923] font-black">{enrollment.course.category.name}</span>, demostrando un dominio técnico superior en el módulo:
                    </p>

                    <div className="px-10 py-6 bg-[#0F1923] text-white inline-block mb-16 shadow-2xl skew-x-[-10deg]">
                        <h3 className="text-3xl font-black uppercase tracking-tighter italic skew-x-[10deg]">{enrollment.course.title}</h3>
                    </div>

                    <div className="mt-auto w-full grid grid-cols-3 gap-20 items-end">
                        <div className="flex flex-col items-center">
                            <div className="w-full h-px bg-[#0F1923]/20 mb-4"></div>
                            <p className="text-[8px] font-black uppercase tracking-widest text-[#0F1923]">Sello de Autenticidad</p>
                            <p className="text-[7px] font-bold text-slate-400 mt-1">ID: {enrollment.id.toUpperCase()}</p>
                        </div>
                        
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 border-[3px] border-[#E8341A] flex items-center justify-center mb-4 rotate-45">
                                <Award size={32} className="text-[#E8341A] -rotate-45" />
                            </div>
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#0F1923]">Estatus Elite</p>
                        </div>

                        <div className="flex flex-col items-center">
                            <p className="text-2xl font-black text-[#0F1923] italic mb-1">{completionDate}</p>
                            <div className="w-full h-px bg-[#0F1923]/20 mb-4"></div>
                            <p className="text-[8px] font-black uppercase tracking-widest text-[#0F1923]">Fecha de Graduación</p>
                        </div>
                    </div>
                </div>

                {/* Footer Logo */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-10">
                    <h5 className="text-[8px] font-black uppercase tracking-[1em] text-[#0F1923]">Atomic Solutions // Infrastructure Mastery</h5>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    @page { size: landscape; margin: 0; }
                    body { background: white; }
                    .print-hidden { display: none !important; }
                }
            ` }} />
        </div>
    )
}
