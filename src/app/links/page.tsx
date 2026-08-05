'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DynamicBlogLink {
  id: string;
  title: string;
  slug?: string;
  category?: string;
  createdAt?: string;
}

export default function DirectoryLinksPage() {
  const [search, setSearch] = useState('');
  const [dynamicBlogs, setDynamicBlogs] = useState<DynamicBlogLink[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  useEffect(() => {
    fetch('/api/blogs')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDynamicBlogs(data);
        } else if (data.blogs && Array.isArray(data.blogs)) {
          setDynamicBlogs(data.blogs);
        }
      })
      .catch((err) => console.error('Error al cargar blogs:', err))
      .finally(() => setLoadingBlogs(false));
  }, []);

  // Categorías fijas de Landings, Banners y Presentaciones principales
  const staticSections = [
    {
      category: '🏗️ MAQUINARIA PESADA & BLOQUERAS',
      items: [
        {
          title: 'Guía Definitiva & Landing de Máquinas de Hacer Bloques',
          url: '/web/blogs/guia-maquinas-de-bloques',
          desc: 'Landing completa con Masterclass, comparativa 2x2, simulador ROI y apoyo operativo.',
        },
        {
          title: 'PDF Catálogo Comercial & Fichas Técnicas para Cliente',
          url: '/catalogo-maquinas-de-bloques.pdf',
          desc: 'Documento PDF oficial descargable con especificaciones técnicas completas.',
        },
      ],
    },
    {
      category: '📊 MATRICES DE PRECIOS & GESTIÓN DE BASE DE DATOS',
      items: [
        {
          title: 'Matriz General de Precios (Edición Directa en Tiempo Real)',
          url: '/web/matriz-precios',
          desc: 'Interfaz para editar categorías, stock, costo y precio de venta de productos.',
        },
        {
          title: 'Terminal Retro CRT Green (Precios Internos)',
          url: '/precios-internos',
          desc: 'Vista estilo terminal VT100 CRT con atajos [F1] Productos y [F2] Proveedores.',
        },
        {
          title: 'Inventario Retro CRT (Dashboard)',
          url: '/web/retro-inventory',
          desc: 'Terminal de consulta rápida de inventario de base de datos.',
        },
      ],
    },
    {
      category: '🚀 LANDINGS DE PRODUCTOS ESPECIALES & PRESENTACIONES',
      items: [
        {
          title: 'Honor Magic 7 - Landing Especial',
          url: '/web/honor-magic-7',
          desc: 'Página de presentación de smartphones Honor Magic 7.',
        },
        {
          title: 'Barreras Antipánico Industrial',
          url: '/web/barreras-antipanico',
          desc: 'Landing page de barreras de seguridad y control de acceso.',
        },
        {
          title: 'Calefactores de Ambiente',
          url: '/web/calefactores',
          desc: 'Página de presentación de sistemas de calefacción.',
        },
        {
          title: 'Cargadores Eléctricos EV',
          url: '/web/cargadores-electricos',
          desc: 'Landing page de cargadores para vehículos eléctricos.',
        },
        {
          title: 'SharkDeck - Presentación',
          url: '/web/sharkdeck',
          desc: 'Página de presentación comercial de SharkDeck.',
        },
        {
          title: 'The Economist 2026 - Presentación',
          url: '/web/the-economist-2026',
          desc: 'Análisis y landings especiales de publicación 2026.',
        },
        {
          title: 'Tarjetas & Tecnología NFC',
          url: '/web/nfc',
          desc: 'Presentación de soluciones de tecnología NFC.',
        },
        {
          title: 'Conjuntos Smart - Automatización',
          url: '/web/conjuntos-smart',
          desc: 'Sistemas de automatización y conjuntos inteligentes.',
        },
        {
          title: 'Sistemas de Intercomunicación',
          url: '/web/intercomunicacion',
          desc: 'Página de soluciones de intercomunicación y voz.',
        },
      ],
    },
    {
      category: '📱 CATÁLOGOS WEB Y SECCIONES PRINCIPALES',
      items: [
        {
          title: 'Catálogo de Teléfonos & Smartwatches',
          url: '/web/phones',
          desc: 'Listado completo de smartphones y gadgets.',
        },
        {
          title: 'Laptops & Equipos de Cómputo (Blog Especial)',
          url: '/web/laptops-blog',
          desc: 'Catálogo especializado de laptops y blogs técnicos.',
        },
        {
          title: 'Catálogo General de Repuestos',
          url: '/web/repuestos',
          desc: 'Inventario de repuestos y accesorios.',
        },
        {
          title: 'Lanzamientos & Campañas de Marketing',
          url: '/web/campanas',
          desc: 'Visualización de campañas publicitarias de la tienda.',
        },
        {
          title: 'Demostraciones de Software & Demos',
          url: '/web/demos',
          desc: 'Módulos interactivos de demostración de software.',
        },
        {
          title: 'Academia Digital & Cursos',
          url: '/web/academy',
          desc: 'Plataforma educativa y capacitaciones digitales.',
        },
      ],
    },
  ];

  const searchFilter = search.toLowerCase().trim();

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-mono p-4 md:p-8">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto border-2 border-zinc-800 p-6 bg-zinc-950/80 mb-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-xl md:text-2xl font-black uppercase tracking-widest text-white">
                [ATOMIC] DIRECTORIO GENERAL DE LANDINGS Y LINKS
              </h1>
            </div>
            <p className="text-xs text-zinc-400 mt-1 uppercase">
              AGRUPADOR CENTRALIZADO DE ENLACES CLICKEABLES, LANDINGS, PRESENTACIONES Y BLOGS
            </p>
          </div>

          <div className="w-full md:w-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Buscar link o palabra clave..."
              className="w-full md:w-80 px-4 py-2.5 bg-black border border-zinc-700 text-white text-xs font-mono outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* SECCIONES ESTÁTICAS */}
        {staticSections.map((sec, sidx) => {
          const filteredItems = sec.items.filter(
            (item) =>
              !searchFilter ||
              item.title.toLowerCase().includes(searchFilter) ||
              item.url.toLowerCase().includes(searchFilter) ||
              item.desc.toLowerCase().includes(searchFilter)
          );

          if (filteredItems.length === 0) return null;

          return (
            <div key={sidx} className="border border-zinc-800 bg-zinc-950/60 p-6 shadow-xl">
              <h2 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-4 border-b border-zinc-800 pb-2">
                {sec.category} ({filteredItems.length})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.map((item, iidx) => (
                  <div
                    key={iidx}
                    className="p-4 border border-zinc-800/80 bg-black/60 hover:border-amber-500/60 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <h3 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors uppercase mb-1">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-zinc-400 font-sans mb-3 line-clamp-2">
                        {item.desc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-900 text-[10px]">
                      <span className="text-zinc-500 font-mono truncate max-w-[200px]">{item.url}</span>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-zinc-900 hover:bg-amber-500 hover:text-black text-amber-400 font-bold uppercase transition-all flex items-center gap-1 border border-zinc-800"
                      >
                        <span>ABRIR LINK</span>
                        <span>↗</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* SECCIÓN DINÁMICA DE BLOGS PUBLICADOS EN LA BBDD */}
        <div className="border border-zinc-800 bg-zinc-950/60 p-6 shadow-xl">
          <h2 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-4 border-b border-zinc-800 pb-2 flex items-center justify-between">
            <span>📝 ARTÍCULOS DE BLOGS Y PRESENTACIONES EN BASE DE DATOS ({dynamicBlogs.length})</span>
            {loadingBlogs && <span className="text-xs text-zinc-500 animate-pulse">Cargando blogs...</span>}
          </h2>

          {dynamicBlogs.length === 0 ? (
            <p className="text-xs text-zinc-500 py-4">No se encontraron artículos de blogs adicionales.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dynamicBlogs
                .filter(
                  (b) =>
                    !searchFilter ||
                    b.title.toLowerCase().includes(searchFilter) ||
                    (b.slug && b.slug.toLowerCase().includes(searchFilter))
                )
                .map((b) => {
                  const blogUrl = b.slug ? `/web/blogs/${b.slug}` : `/web/blogs/${b.id}`;
                  return (
                    <div
                      key={b.id}
                      className="p-4 border border-zinc-800/80 bg-black/60 hover:border-amber-500/60 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <span className="text-[9px] text-amber-500/80 uppercase font-mono block mb-1">
                          {b.category || 'Blog General'}
                        </span>
                        <h3 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors uppercase mb-2">
                          {b.title}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-zinc-900 text-[10px]">
                        <span className="text-zinc-500 font-mono truncate max-w-[200px]">{blogUrl}</span>
                        <a
                          href={blogUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-zinc-900 hover:bg-amber-500 hover:text-black text-amber-400 font-bold uppercase transition-all flex items-center gap-1 border border-zinc-800"
                        >
                          <span>ABRIR BLOG</span>
                          <span>↗</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
