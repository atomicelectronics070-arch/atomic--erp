with open('src/app/web/PublicWebClient.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('    return (\n        <div className="min-h-screen bg-white text-black')

new_return = """    return (
        <div className="min-h-screen bg-white text-black selection:bg-black/10 pb-20 font-sans relative">
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.025]"
                style={{
                    backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px),
                                     linear-gradient(to bottom, #000 1px, transparent 1px)`,
                    backgroundSize: `80px 80px`
                }}
            />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="relative z-10">

                <MinimalStoreHero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

                {/* PRODUCTOS */}
                <section className="w-full max-w-7xl mx-auto px-6 py-8" id="productos">
                    {searchQuery ? (
                        filteredProducts.length === 0 ? (
                            <div className="py-20 text-center border border-dashed border-slate-200 rounded-none">
                                <p className="text-slate-400 text-[10px] uppercase tracking-[0.3em] font-black">No se encontraron productos para "{searchQuery}"</p>
                                <button onClick={() => setSearchQuery("")} className="mt-4 text-[black] text-[10px] font-black uppercase tracking-widest hover:underline">Limpiar Búsqueda</button>
                            </div>
                        ) : (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {filteredProducts.map((p: any, i: number) => (
                                        <MiniProductCard key={p.id} product={p} userRole={userRole} delay={i * 0.02} />
                                    ))}
                                </div>
                        )
                    ) : (
                        <InfiniteProductScroll products={filteredProducts} userRole={userRole} />
                    )}
                </section>
            </motion.div>
        </div>
    )
}

function MinimalStoreHero({ searchQuery, setSearchQuery }: { searchQuery: string, setSearchQuery: (val: string) => void }) {
    const cards = [
        { id: 'electronica', label: 'Electrónica', icon: <Cpu size={24} /> },
        { id: 'hogar', label: 'Hogar', icon: <Home size={24} /> },
        { id: 'residencial', label: 'Residencial', icon: <Building size={24} /> },
        { id: 'industrial', label: 'Industrial', icon: <Factory size={24} /> },
        { id: 'software', label: 'Software', icon: <Code size={24} /> }
    ];

    const scrollDown = () => {
        document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="pt-24 pb-8 flex flex-col items-center justify-center text-center px-6 border-b border-zinc-100 bg-white">
            {/* ATOM LOGO & TITLE */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mb-6 flex flex-col items-center"
            >
                <AtomLogo />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-2"
            >
                <h1 className="text-4xl md:text-5xl font-black tracking-[0.15em] uppercase text-black leading-none">
                    ATOMIC INDUSTRIAS
                </h1>
            </motion.div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="text-xs font-bold tracking-[0.4em] uppercase text-zinc-400 mb-12"
            >
                Tienda en Línea
            </motion.p>

            {/* SEARCH BAR */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="w-full max-w-2xl mx-auto mb-12 relative group"
            >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-black transition-colors" size={18} />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por nombre, marca o categoría..."
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-4 pl-12 pr-12 text-sm uppercase tracking-widest placeholder:text-slate-400 focus:border-black focus:bg-white transition-all outline-none shadow-sm hover:shadow-md"
                />
                {searchQuery && (
                    <button 
                        onClick={() => setSearchQuery("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black transition-colors"
                    >
                        <X size={16} />
                    </button>
                )}
            </motion.div>

            {/* HORIZONTAL CARDS */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="w-full max-w-5xl overflow-x-auto pb-4 scrollbar-hide"
            >
                <div className="flex items-center justify-center gap-4 min-w-max mx-auto px-4">
                    {cards.map((card, i) => (
                        <button
                            key={card.id}
                            onClick={() => {
                                setSearchQuery(card.label);
                                scrollDown();
                            }}
                            className="group flex flex-col items-center justify-center gap-4 bg-white text-black rounded-2xl w-36 h-36 border border-zinc-200
                                       hover:scale-[1.05] hover:shadow-2xl hover:shadow-black/10 hover:border-black hover:bg-zinc-50
                                       active:scale-[0.98] transition-all duration-300 ease-out"
                        >
                            <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-300">
                                {card.icon}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black">
                                {card.label}
                            </span>
                        </button>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}

function AtomLogo() {
    return (
        <svg width="64" height="64" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="36" cy="36" r="5" fill="#000" />
            <ellipse cx="36" cy="36" rx="30" ry="10" stroke="#000" strokeWidth="1.5" fill="none" />
            <ellipse cx="36" cy="36" rx="30" ry="10" stroke="#000" strokeWidth="1.5" fill="none" transform="rotate(60 36 36)" />
            <ellipse cx="36" cy="36" rx="30" ry="10" stroke="#000" strokeWidth="1.5" fill="none" transform="rotate(120 36 36)" />
            <circle cx="66" cy="36" r="2.5" fill="#000" />
            <circle cx="21" cy="10.5" r="2.5" fill="#000" />
            <circle cx="21" cy="61.5" r="2.5" fill="#000" />
        </svg>
    )
}
"""

with open('src/app/web/PublicWebClient.tsx', 'w', encoding='utf-8') as f:
    f.write(text[:start] + new_return)
