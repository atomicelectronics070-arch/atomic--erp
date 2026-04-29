import { Code2, Zap, Layout, Settings, PlayCircle, Layers, Cpu, Globe } from "lucide-react"
import { CyberCard, NeonButton, GlassPanel } from "@/components/ui/CyberUI"
import Link from "next/link"

export default function SoftwareLandingPage() {
    return (
        <div className="space-y-16 pb-32 relative z-10">
            {/* Neural Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-[#00F0FF]/5 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] bg-[#E8341A]/5 blur-[100px] animate-pulse" style={{ animationDelay: '3s' }} />
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/5 pb-16 relative z-10">
                <div className="space-y-4">
                    <div className="flex items-center space-x-4 text-[#00F0FF] neon-text">
                        <Code2 size={24} />
                        <span className="text-[10px] uppercase font-black tracking-[0.6em] italic">LABORATORIO DE DESARROLLO // ATOMIC DEV</span>
                    </div>
                    <h1 className="text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
                        SOFTWARE <span className="text-[#00F0FF] neon-text">FORGE</span>
                    </h1>
                    <p className="text-white/40 font-bold text-xs uppercase tracking-[0.3em] max-w-xl italic leading-relaxed">
                        Ingeniería de software a medida, automatización industrial y ecosistemas e-commerce de alto rendimiento.
                    </p>
                </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                <CyberCard className="!p-10 space-y-6">
                    <div className="w-14 h-14 bg-[#00F0FF]/10 flex items-center justify-center border border-[#00F0FF]/20">
                        <Globe size={24} className="text-[#00F0FF]" />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">E-COMMERCE PRO</h3>
                    <p className="text-xs text-white/40 font-medium italic leading-relaxed">Arquitecturas basadas en Shopify y Next.js para una velocidad de carga inigualable y conversión masiva.</p>
                </CyberCard>
                <CyberCard className="!p-10 space-y-6">
                    <div className="w-14 h-14 bg-[#E8341A]/10 flex items-center justify-center border border-[#E8341A]/20">
                        <Cpu size={24} className="text-[#E8341A]" />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">AI AUTOMATION</h3>
                    <p className="text-xs text-white/40 font-medium italic leading-relaxed">Integración de cerebros de IA para automatizar ventas, soporte y gestión de inventarios 24/7.</p>
                </CyberCard>
                <CyberCard className="!p-10 space-y-6">
                    <div className="w-14 h-14 bg-white/5 flex items-center justify-center border border-white/10">
                        <Layers size={24} className="text-white" />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">CUSTOM ERP</h3>
                    <p className="text-xs text-white/40 font-medium italic leading-relaxed">Sistemas de gestión empresarial diseñados específicamente para el flujo de trabajo de tu industria.</p>
                </CyberCard>
            </div>

            {/* CTA Section */}
            <div className="relative z-10 py-20">
                <GlassPanel className="!p-20 text-center border-white/5 bg-white/[0.02]">
                    <div className="max-w-2xl mx-auto space-y-10">
                        <div className="flex justify-center">
                            <PlayCircle size={64} className="text-[#00F0FF] animate-pulse" />
                        </div>
                        <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-tight">
                            ¿Listo para ver tu <span className="text-[#00F0FF] neon-text">Futuro Digital</span> en acción?
                        </h2>
                        <p className="text-sm text-white/40 font-bold uppercase tracking-widest italic leading-relaxed">
                            Nuestro constructor de demos IA generará un prototipo funcional de tu próxima plataforma en menos de 2 minutos.
                        </p>
                        <div className="pt-8">
                            <Link href="/dashboard/software/demo-builder">
                                <NeonButton variant="primary" className="!px-20 !py-6 !text-lg">HAZ TU DEMO AQUÍ</NeonButton>
                            </Link>
                        </div>
                    </div>
                </GlassPanel>
            </div>
        </div>
    )
}
