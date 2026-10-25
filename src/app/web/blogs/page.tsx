import Link from "next/link"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
import { ArrowLeft, Clock, User, ChevronRight, Sparkles, Download } from "lucide-react"

export default async function BlogsGallery() {
  const blogs = await prisma.blog.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } } }
  })

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-pink-600/10 blur-[150px] rounded-none animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-600/10 blur-[150px] rounded-none animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[#030712]/80 backdrop-blur-[1px]"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '24px 24px' }}></div>
      </div>

      <nav className="relative z-10 p-6 md:p-10 flex items-center justify-between pointer-events-auto">
          <Link href="/web" className="group flex items-center space-x-2 text-white/50 hover:text-white transition-colors">
              <div className="w-8 h-8 rounded-none border border-white/10 flex items-center justify-center bg-slate-900/50 backdrop-blur-xl border-slate-700/50/5 group-hover:bg-slate-900/50 backdrop-blur-xl border-slate-700/50/10 transition-colors">
                  <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Volver a Tienda</span>
          </Link>
          <div className="text-[10px] uppercase font-black tracking-[0.3em] text-indigo-400">Atomic Corporate</div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
          {/* Header */}
          <div className="text-center mb-24 pt-10">
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-6">
                Corporate <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500 italic">Blog.</span>
              </h1>
              <p className="text-white/50 max-w-2xl mx-auto text-lg">
                  Explora las últimas novedades corporativas, guías operativas e inteligencia de mercado.
              </p>
          </div>

          {/* Floating Gallery */}
          <div className="flex items-center gap-4 overflow-x-auto pb-4 mb-12 scrollbar-hide">
            <Link href="/web/blogs" className="px-6 py-2 rounded-full border border-indigo-500 bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-widest whitespace-nowrap">
              Todos los Blogs
            </Link>
            <Link href="/prompts" className="px-6 py-2 rounded-full border border-cyan-500/60 bg-cyan-500/15 text-cyan-300 hover:text-white hover:bg-cyan-500/25 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Guía Prompts IA (MrBeast) 🔥</span>
            </Link>
            <Link href="/web/laptops-blog" className="px-6 py-2 rounded-full border border-white/10 hover:border-indigo-500/50 bg-slate-900/50 text-white/70 hover:text-white text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all">
              Catálogo Laptops
            </Link>
            <Link href="/recursos" className="px-6 py-2 rounded-full border border-white/10 hover:border-emerald-500/50 bg-slate-900/50 text-white/70 hover:text-emerald-400 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all">
              Recursos MIT & Harvard
            </Link>
            <Link href="/post-4" className="px-6 py-2 rounded-full border border-white/10 hover:border-purple-500/50 bg-slate-900/50 text-white/70 hover:text-purple-400 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all">
              9 Cursos Gratuitos
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-32">
              {/* Featured AI Prompts Guide Card */}
              <Link 
                  href="/prompts"
                  className="group relative flex flex-col h-[520px] overflow-hidden bg-slate-900/60 backdrop-blur-xl border-2 border-cyan-500/40 hover:border-cyan-400 transition-all duration-500 hover:shadow-[0_0_50px_rgba(6,182,212,0.25)] rounded-2xl"
              >
                  {/* Image Container */}
                  <div className="relative w-full h-[55%] overflow-hidden bg-neutral-900 border-b border-white/10 shrink-0">
                      <img 
                          src="/images/prompts-studio/p1_img1_5.png" 
                          alt="Guía Maestra Prompts IA MrBeast" 
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700" 
                      />
                      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#030712] to-transparent pointer-events-none" />
                      <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/80 backdrop-blur-md border border-cyan-500/50 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-cyan-300 shadow-lg">
                          <Sparkles size={12} className="text-cyan-400" />
                          <span>Recurso Oficial • PDF + ES/EN</span>
                      </div>
                  </div>

                  {/* Content */}
                  <div className="relative p-7 flex-1 flex flex-col bg-[#030712] group-hover:bg-[#030712]/90 transition-colors">
                      <div className="flex items-center space-x-3 mb-3 text-[9px] font-black uppercase tracking-[0.2em] text-cyan-400">
                          <div className="flex items-center space-x-1 border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 rounded">
                              <Clock size={10} />
                              <span>Actualizado 2026</span>
                          </div>
                          <div className="flex items-center space-x-1 text-white/40">
                              <User size={10} />
                              <span>Atomic AI Lab</span>
                          </div>
                      </div>
                      <h2 className="text-xl md:text-2xl font-black text-white leading-tight mb-2 group-hover:text-cyan-200 transition-all line-clamp-2">
                          Guía Maestra: 12 Prompts Hiperrealistas para Midjourney & FLUX (Caso MrBeast)
                      </h2>
                      <p className="text-xs text-white/60 line-clamp-2 mb-4 font-normal">
                          Retratos ejecutivos, doodle graffiti, explosiones VFX y arte conceptual. Con botones para copiar y PDF descargable.
                      </p>
                      
                      {/* Animated Action */}
                      <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-cyan-400 group-hover:text-cyan-300 transition-colors">
                          <span className="flex items-center gap-1.5">
                            <Download size={12} />
                            <span>Explorar Prompts & PDF</span>
                          </span>
                          <div className="w-8 h-px bg-cyan-500/30 group-hover:w-12 group-hover:bg-cyan-400 transition-all duration-500 relative">
                            <ChevronRight size={12} className="absolute -right-2 -top-1.5 opacity-0 group-hover:opacity-100 transition-opacity delay-100" />
                          </div>
                      </div>
                  </div>
              </Link>

              {/* Database Blogs */}
              {blogs.map((blog, idx) => (
                  <Link 
                      href={`/web/blogs/${blog.id}`}
                      key={blog.id} 
                      className="group relative flex flex-col h-[520px] overflow-hidden bg-slate-900/50 backdrop-blur-xl border border-white/10 hover:border-indigo-500/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(99,102,241,0.1)] rounded-2xl"
                      style={{
                          transform: `translateY(${idx % 2 === 0 ? '0px' : '20px'})`
                      }}
                  >
                      {/* Image Container */}
                      <div className="relative w-full h-[55%] overflow-hidden bg-neutral-900 border-b border-white/10 shrink-0">
                          {blog.imageUrl ? (
                              <img 
                                  src={blog.imageUrl} 
                                  alt={blog.title} 
                                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700" 
                              />
                          ) : (
                              <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-neutral-800" />
                          )}
                          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#030712] to-transparent pointer-events-none" />
                      </div>

                      {/* Content */}
                      <div className="relative p-7 flex-1 flex flex-col bg-[#030712] group-hover:bg-[#030712]/90 transition-colors">
                          <div className="flex items-center space-x-4 mb-4 text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400">
                              <div className="flex items-center space-x-1 border border-indigo-500/30 bg-indigo-500/10 px-2 py-1 rounded-none">
                                  <Clock size={10} />
                                  <span>{new Date(blog.createdAt).toLocaleDateString('es-CO')}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-white/40">
                                  <User size={10} />
                                  <span>{blog.author?.name?.split(' ')[0] || 'Admin'}</span>
                              </div>
                          </div>
                          <h2 className="text-xl md:text-2xl font-black text-white leading-tight mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-indigo-200 transition-all line-clamp-3">
                              {blog.title}
                          </h2>
                          
                          {/* Animated Arrow */}
                          <div className="mt-auto pt-6 flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-white/50 group-hover:text-indigo-400 transition-colors">
                              <span>Leer Artículo</span>
                              <div className="w-8 h-px bg-slate-900/50 backdrop-blur-xl border-slate-700/50/20 group-hover:w-12 group-hover:bg-indigo-500 transition-all duration-500 relative">
                                <ChevronRight size={12} className="absolute -right-2 -top-1.5 opacity-0 group-hover:opacity-100 transition-opacity delay-100" />
                              </div>
                          </div>
                      </div>
                  </Link>
              ))}
          </div>

          {/* Historial Section */}
          <div className="mt-20 border-t border-white/5 pt-16">
              <div className="flex items-center justify-between mb-10">
                  <div>
                      <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Historial de <span className="text-indigo-400">Publicaciones</span></h2>
                      <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-2">Registro cronológico de actividad editorial</p>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent mx-10 hidden md:block"></div>
                  <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">{blogs.length + 1} Entradas</div>
              </div>

              <div className="space-y-4">
                  {/* Featured prompt entry */}
                  <Link 
                      href="/prompts"
                      className="group flex items-center justify-between p-6 bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-400/50 transition-all rounded-xl"
                  >
                      <div className="flex items-center space-x-6">
                          <div className="text-[10px] font-black text-cyan-400 uppercase w-24">
                              Destacado
                          </div>
                          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                          <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors uppercase tracking-tight">
                              Guía Maestra: 12 Prompts Hiperrealistas para Midjourney & FLUX (Caso MrBeast) • Recurso Oficial
                          </h3>
                      </div>
                      <div className="flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">Abrir Estudio</span>
                          <ArrowLeft size={14} className="rotate-180 text-cyan-400" />
                      </div>
                  </Link>

                  {blogs.map((blog) => (
                      <Link 
                          href={`/web/blogs/${blog.id}`}
                          key={`hist-${blog.id}`}
                          className="group flex items-center justify-between p-6 bg-slate-900/50 backdrop-blur-xl border border-white/5 hover:border-white/10 transition-all rounded-xl"
                      >
                          <div className="flex items-center space-x-6">
                              <div className="text-[10px] font-black text-white/20 uppercase w-24">
                                  {new Date(blog.createdAt).toLocaleDateString('es-CO', { month: 'short', day: '2-digit', year: 'numeric' })}
                              </div>
                              <div className="w-2 h-2 rounded-none bg-indigo-500/50 group-hover:bg-indigo-500 transition-colors"></div>
                              <h3 className="text-sm font-bold text-white/70 group-hover:text-white transition-colors uppercase tracking-tight">{blog.title}</h3>
                          </div>
                          <div className="flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Ver Detalles</span>
                              <ArrowLeft size={14} className="rotate-180 text-indigo-400" />
                          </div>
                      </Link>
                  ))}
              </div>
          </div>
      </main>
    </div>
  )
}
