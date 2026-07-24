import os

file_path = "src/app/web/PublicWebClient.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Main background wrapper removal (since layout.tsx now handles bg)
content = content.replace(
    '<div className="min-h-screen bg-[#080808] text-white selection:bg-[#0055fe]/20 pb-20 font-sans relative">',
    '<div className="w-full pb-20">' # Removed background, layout handles it
)
content = content.replace(
    'backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px),\n                                     linear-gradient(to bottom, #fff 1px, transparent 1px)`',
    'backgroundImage: "none"' # Remove local grid
)

# 2. Hero Section
content = content.replace(
    '<section className="pt-24 pb-8 flex flex-col items-center justify-center text-center px-6 border-b border-white/5 bg-[#080808]">',
    '<section className="pt-12 pb-16 flex flex-col items-center justify-center text-center px-6">'
)

# 3. Hero Titles (Massive typography)
content = content.replace(
    '<h1 className="text-4xl md:text-5xl font-black tracking-[0.15em] uppercase text-white leading-none">',
    '<h1 className="text-[10vw] md:text-[6vw] font-black tracking-tighter uppercase text-black leading-[0.85] mb-6">'
)

# 4. Search Bar
content = content.replace(
    'className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 pr-12 text-sm uppercase tracking-widest placeholder:text-slate-400 text-white focus:border-[#0055fe] focus:bg-white/10 transition-all outline-none shadow-sm hover:shadow-[0_0_15px_rgba(0,85,254,0.3)]"',
    'className="w-full bg-black/5 border border-black/10 rounded-full p-6 pl-14 pr-12 text-sm font-bold uppercase tracking-widest placeholder:text-black/30 text-black focus:border-[#0055fe] focus:bg-white transition-all outline-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"'
)
content = content.replace(
    'text-slate-400 hover:text-white',
    'text-black/40 hover:text-black'
)

# 5. Category Cards
content = content.replace(
    'bg-white/5 backdrop-blur-xl text-white rounded-2xl w-36 h-36 border ${activeMainCategoryId === card.id ? \'border-[#0055fe] bg-[#0055fe]/20 scale-[1.05] shadow-2xl shadow-[#0055fe]/20\' : \'border-white/10\'}\n                                       hover:scale-[1.05] hover:shadow-2xl hover:shadow-[#0055fe]/20 hover:border-[#0055fe] hover:bg-white/10',
    'bg-white text-black rounded-3xl w-36 h-36 border ${activeMainCategoryId === card.id ? \'border-[#0055fe] shadow-[0_10px_40px_rgba(0,85,254,0.15)] scale-[1.05]\' : \'border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.03)]\'}\n                                       hover:scale-[1.05] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-black/20 transition-all duration-500'
)
content = content.replace(
    '${activeMainCategoryId === card.id ? \'bg-[#0055fe] text-white border-[#0055fe]\' : \'bg-white/10 border-white/20 group-hover:bg-[#0055fe] group-hover:text-white group-hover:border-[#0055fe]\'}',
    '${activeMainCategoryId === card.id ? \'bg-[#0055fe] text-white\' : \'bg-black/5 group-hover:bg-black group-hover:text-white\'}'
)
content = content.replace(
    'className="text-[10px] font-black uppercase tracking-[0.2em] text-white"',
    'className="text-[10px] font-black uppercase tracking-[0.2em] text-black"'
)

# 6. MiniProductCard
content = content.replace(
    'className="group flex flex-col bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#0055fe] hover:shadow-[0_0_15px_rgba(0,85,254,0.2)] transition-all duration-300 rounded-lg overflow-hidden"',
    'className="group flex flex-col bg-white border border-black/5 hover:border-black/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 rounded-2xl overflow-hidden"'
)
content = content.replace(
    'className="aspect-square relative bg-black/40 flex items-center justify-center overflow-hidden"',
    'className="aspect-square relative bg-black/5 flex items-center justify-center overflow-hidden"'
)
content = content.replace(
    'group-hover:text-white transition-colors',
    'group-hover:text-black transition-colors text-black/80'
)
content = content.replace(
    'className="text-2xl font-bold text-white"',
    'className="text-2xl font-black text-black tracking-tight"'
)
content = content.replace(
    'className="text-[10px] font-black text-white/40 uppercase tracking-widest"',
    'className="text-[10px] font-black text-black/40 uppercase tracking-widest"'
)
content = content.replace(
    'className="text-xs text-white/50"',
    'className="text-xs text-black/50"'
)
content = content.replace(
    'className="mt-1 text-sm text-white/70 line-clamp-2"',
    'className="mt-1 text-sm text-black/60 line-clamp-2"'
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("PublicWebClient.tsx patched successfully for Light Theme!")
