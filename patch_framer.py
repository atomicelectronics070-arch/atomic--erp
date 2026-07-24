import os
import re

file_path = "src/app/web/PublicWebClient.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Main Background and Grid
content = content.replace(
    '<div className="min-h-screen bg-white text-black selection:bg-black/10 pb-20 font-sans relative">',
    '<div className="min-h-screen bg-[#080808] text-white selection:bg-[#0055fe]/20 pb-20 font-sans relative">'
)
content = content.replace(
    'backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px),\n                                     linear-gradient(to bottom, #000 1px, transparent 1px)`',
    'backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px),\n                                     linear-gradient(to bottom, #fff 1px, transparent 1px)`'
)
content = content.replace('opacity-[0.025]', 'opacity-[0.05]')

# 2. Hero Section Background
content = content.replace(
    '<section className="pt-24 pb-8 flex flex-col items-center justify-center text-center px-6 border-b border-zinc-100 bg-white">',
    '<section className="pt-24 pb-8 flex flex-col items-center justify-center text-center px-6 border-b border-white/5 bg-[#080808]">'
)

# 3. Hero Titles
content = content.replace(
    '<h1 className="text-4xl md:text-5xl font-black tracking-[0.15em] uppercase text-black leading-none">',
    '<h1 className="text-4xl md:text-5xl font-black tracking-[0.15em] uppercase text-white leading-none">'
)
content = content.replace(
    'ATOMIC INDUSTRIAS\n                </h1>',
    'ATOMIC <span className="text-[#0055fe]">INDUSTRIAS</span>\n                </h1>'
)

# 4. Search Bar
content = content.replace(
    'className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-4 pl-12 pr-12 text-sm uppercase tracking-widest placeholder:text-slate-400 focus:border-black focus:bg-white transition-all outline-none shadow-sm hover:shadow-md"',
    'className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 pr-12 text-sm uppercase tracking-widest placeholder:text-slate-400 text-white focus:border-[#0055fe] focus:bg-white/10 transition-all outline-none shadow-sm hover:shadow-[0_0_15px_rgba(0,85,254,0.3)]"'
)
content = content.replace(
    'className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black transition-colors"',
    'className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"'
)

# 5. Horizontal Cards (Main Categories)
content = content.replace(
    'bg-white text-black rounded-2xl w-36 h-36 border ${activeMainCategoryId === card.id ? \'border-black bg-zinc-50 scale-[1.05] shadow-2xl shadow-black/10\' : \'border-zinc-200\'}\n                                       hover:scale-[1.05] hover:shadow-2xl hover:shadow-black/10 hover:border-black hover:bg-zinc-50',
    'bg-white/5 backdrop-blur-xl text-white rounded-2xl w-36 h-36 border ${activeMainCategoryId === card.id ? \'border-[#0055fe] bg-[#0055fe]/20 scale-[1.05] shadow-2xl shadow-[#0055fe]/20\' : \'border-white/10\'}\n                                       hover:scale-[1.05] hover:shadow-2xl hover:shadow-[#0055fe]/20 hover:border-[#0055fe] hover:bg-white/10'
)
content = content.replace(
    '${activeMainCategoryId === card.id ? \'bg-black text-white border-black\' : \'bg-zinc-100 border-zinc-200 group-hover:bg-black group-hover:text-white group-hover:border-black\'}',
    '${activeMainCategoryId === card.id ? \'bg-[#0055fe] text-white border-[#0055fe]\' : \'bg-white/10 border-white/20 group-hover:bg-[#0055fe] group-hover:text-white group-hover:border-[#0055fe]\'}'
)
content = content.replace(
    'className="text-[10px] font-black uppercase tracking-[0.2em] text-black"',
    'className="text-[10px] font-black uppercase tracking-[0.2em] text-white"'
)

# 6. Subcategories Strip
content = content.replace(
    'bg-white text-black rounded-2xl w-32 h-32 border ${activeSubcategoryId === sub.id ? \'border-black bg-zinc-50 scale-[1.05] shadow-2xl shadow-black/10\' : \'border-zinc-200\'}\n                                           hover:scale-[1.05] hover:shadow-2xl hover:shadow-black/10 hover:border-black hover:bg-zinc-50',
    'bg-white/5 backdrop-blur-xl text-white rounded-2xl w-32 h-32 border ${activeSubcategoryId === sub.id ? \'border-[#0055fe] bg-[#0055fe]/20 scale-[1.05] shadow-2xl shadow-[#0055fe]/20\' : \'border-white/10\'}\n                                           hover:scale-[1.05] hover:shadow-2xl hover:shadow-[#0055fe]/20 hover:border-[#0055fe] hover:bg-white/10'
)

# 7. MiniProductCard
content = content.replace(
    'className="group flex flex-col bg-white border border-slate-200 hover:border-[black]/60 hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden"',
    'className="group flex flex-col bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#0055fe] hover:shadow-[0_0_15px_rgba(0,85,254,0.2)] transition-all duration-300 rounded-lg overflow-hidden"'
)
content = content.replace(
    'className="aspect-square relative bg-slate-50 flex items-center justify-center overflow-hidden"',
    'className="aspect-square relative bg-black/40 flex items-center justify-center overflow-hidden"'
)
content = content.replace(
    'group-hover:text-[black] transition-colors',
    'group-hover:text-white transition-colors'
)
content = content.replace(
    'className="text-[10px] font-bold text-[black]"',
    'className="text-[10px] font-bold text-[#0055fe]"'
)

# 8. Logo Color (AtomLogo)
content = content.replace(
    '<circle cx="36" cy="36" r="5" fill="#000" />\n            <ellipse cx="36" cy="36" rx="30" ry="10" stroke="#000" strokeWidth="1.5" fill="none" />\n            <ellipse cx="36" cy="36" rx="30" ry="10" stroke="#000" strokeWidth="1.5" fill="none" transform="rotate(60 36 36)" />\n            <ellipse cx="36" cy="36" rx="30" ry="10" stroke="#000" strokeWidth="1.5" fill="none" transform="rotate(120 36 36)" />\n            <circle cx="66" cy="36" r="2.5" fill="#000" />\n            <circle cx="21" cy="10.5" r="2.5" fill="#000" />\n            <circle cx="21" cy="61.5" r="2.5" fill="#000" />',
    '<circle cx="36" cy="36" r="5" fill="#0055fe" className="animate-pulse" />\n            <ellipse cx="36" cy="36" rx="30" ry="10" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />\n            <ellipse cx="36" cy="36" rx="30" ry="10" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" transform="rotate(60 36 36)" />\n            <ellipse cx="36" cy="36" rx="30" ry="10" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" transform="rotate(120 36 36)" />\n            <circle cx="66" cy="36" r="3" fill="#fff" />\n            <circle cx="21" cy="10.5" r="3" fill="#fff" />\n            <circle cx="21" cy="61.5" r="3" fill="#fff" />'
)


with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("PublicWebClient.tsx patched successfully!")
