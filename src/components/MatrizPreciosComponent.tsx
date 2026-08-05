'use client';

import { useState, useEffect, useMemo } from 'react';

interface ProductMatrixItem {
  id: string;
  sku: string;
  name: string;
  provider: string;
  category: string;
  categoryId?: string;
  stock: number;
  costPrice: number;
  salePrice: number;
  marginUsd: number;
  marginPercent: number;
}

export default function MatrizPreciosComponent() {
  const [products, setProducts] = useState<ProductMatrixItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [providers, setProviders] = useState<string[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(150);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [themeMode, setThemeMode] = useState<'bw' | 'green' | 'amber'>('bw');

  // Edit Mode state
  const [isEditMode, setIsEditMode] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchMatrixData = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        search,
        provider: selectedProvider,
        categoryId: selectedCategory,
        page: page.toString(),
        limit: limit.toString(),
      });
      const res = await fetch(`/api/public/matriz-precios?${query.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
        setTotalProducts(data.totalProducts || 0);
        setTotalPages(data.totalPages || 1);
        if (data.providers?.length) setProviders(data.providers);
        if (data.categories?.length) setCategories(data.categories);
      }
    } catch (err) {
      console.error('Error al cargar matriz de precios:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatrixData();
  }, [search, selectedProvider, selectedCategory, page, limit]);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Update handler for inline edits (salePrice, costPrice, categoryId, stock)
  const handleUpdateProduct = async (id: string, field: 'salePrice' | 'costPrice' | 'categoryId' | 'stock', value: any) => {
    setSavingId(id);
    try {
      const currentProduct = products.find(p => p.id === id);
      if (!currentProduct) return;

      const payload: any = {};
      if (field === 'salePrice') payload.price = parseFloat(value) || 0;
      if (field === 'costPrice') payload.compareAtPrice = value === '' || value === null ? null : parseFloat(value);
      if (field === 'categoryId') payload.categoryId = value;
      if (field === 'stock') payload.stock = parseInt(value) || 0;

      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Falló actualización');

      // Local optimistic update
      setProducts(prev => prev.map(p => {
        if (p.id !== id) return p;

        const newSale = field === 'salePrice' ? (parseFloat(value) || 0) : p.salePrice;
        const newCost = field === 'costPrice' ? (value === '' || value === null ? 0 : parseFloat(value)) : p.costPrice;
        const newStock = field === 'stock' ? (parseInt(value) || 0) : p.stock;
        const newCatObj = field === 'categoryId' ? categories.find(c => c.id === value) : null;
        const newCatName = newCatObj ? newCatObj.name : (field === 'categoryId' && !value ? 'Sin categoría' : p.category);

        const newMarginUsd = newSale - newCost;
        const newMarginPercent = newCost > 0 ? (newMarginUsd / newCost) * 100 : 0;

        return {
          ...p,
          salePrice: newSale,
          costPrice: newCost,
          stock: newStock,
          category: newCatName,
          categoryId: field === 'categoryId' ? value : p.categoryId,
          marginUsd: newMarginUsd,
          marginPercent: newMarginPercent
        };
      }));

      showNotification('✅ Registro actualizado correctamente');
    } catch (err) {
      console.error(err);
      showNotification('❌ Error al guardar cambios');
    } finally {
      setSavingId(null);
    }
  };

  // Delete product handler
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar permanentemente de la matriz el producto:\n\n"${name}"?`)) {
      return;
    }
    setSavingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');

      setProducts(prev => prev.filter(p => p.id !== id));
      setTotalProducts(prev => Math.max(0, prev - 1));
      showNotification('🗑️ Producto eliminado de la base de datos');
    } catch (err) {
      console.error(err);
      showNotification('❌ Error al eliminar producto');
    } finally {
      setSavingId(null);
    }
  };

  const stats = useMemo(() => {
    let totalCostSum = 0;
    let totalSaleSum = 0;

    products.forEach((p) => {
      totalCostSum += (p.costPrice || 0) * (p.stock > 0 ? p.stock : 1);
      totalSaleSum += (p.salePrice || 0) * (p.stock > 0 ? p.stock : 1);
    });

    const totalProfitSum = totalSaleSum - totalCostSum;
    const avgMarginPercent = totalCostSum > 0 ? ((totalSaleSum - totalCostSum) / totalCostSum) * 100 : 0;

    return {
      totalCostSum,
      totalSaleSum,
      totalProfitSum,
      avgMarginPercent,
    };
  }, [products]);

  const exportToCSV = () => {
    if (!products.length) return;
    const headers = ['SKU', 'NOMBRE PRODUCTO', 'PROVEEDOR', 'CATEGORIA', 'STOCK', 'COSTO ($)', 'VENTA ($)', 'MARGEN ($)', 'MARGEN (%)'];
    const rows = products.map((p) => [
      `"${p.sku}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.provider}"`,
      `"${p.category}"`,
      p.stock,
      p.costPrice.toFixed(2),
      p.salePrice.toFixed(2),
      p.marginUsd.toFixed(2),
      `${p.marginPercent.toFixed(2)}%`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `MATRIZ_PRECIOS_ATOMIC_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const themeClasses = {
    bw: {
      bg: 'bg-black',
      text: 'text-zinc-100',
      border: 'border-zinc-800',
      headerBg: 'bg-zinc-900',
      headerText: 'text-zinc-300',
      accent: 'text-white font-bold',
      highlight: 'bg-zinc-900/60',
      inputBg: 'bg-black text-white border-zinc-700 focus:border-white',
      badge: 'border border-zinc-700 text-zinc-300 bg-zinc-900',
      cellInput: 'bg-zinc-900 text-white border-zinc-700 focus:border-white',
    },
    green: {
      bg: 'bg-[#030d04]',
      text: 'text-emerald-400',
      border: 'border-emerald-900/60',
      headerBg: 'bg-emerald-950/80',
      headerText: 'text-emerald-300',
      accent: 'text-emerald-200 font-bold',
      highlight: 'bg-emerald-950/40',
      inputBg: 'bg-black text-emerald-300 border-emerald-800 focus:border-emerald-400',
      badge: 'border border-emerald-800 text-emerald-400 bg-emerald-950',
      cellInput: 'bg-emerald-950 text-emerald-300 border-emerald-800 focus:border-emerald-400',
    },
    amber: {
      bg: 'bg-[#0f0a02]',
      text: 'text-amber-400',
      border: 'border-amber-900/60',
      headerBg: 'bg-amber-950/80',
      headerText: 'text-amber-300',
      accent: 'text-amber-200 font-bold',
      highlight: 'bg-amber-950/40',
      inputBg: 'bg-black text-amber-300 border-amber-800 focus:border-amber-400',
      badge: 'border border-amber-800 text-amber-400 bg-amber-950',
      cellInput: 'bg-amber-950 text-amber-300 border-amber-800 focus:border-amber-400',
    },
  }[themeMode];

  return (
    <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.text} font-mono p-4 md:p-8 selection:bg-zinc-700 selection:text-white relative`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[100] px-4 py-2 bg-zinc-900 border border-emerald-500 text-emerald-400 text-xs font-bold uppercase tracking-wider shadow-2xl animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* ================= RETRO TERMINAL HEADER ================= */}
      <div className={`border-2 ${themeClasses.border} p-6 rounded-none shadow-2xl mb-6 bg-black/40`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-xl md:text-2xl font-black uppercase tracking-widest">
                [ATOMIC_SYSTEM] DATABASE PRICING & CATEGORY MATRIX v2.0
              </h1>
            </div>
            <p className="text-xs opacity-70 mt-1 uppercase tracking-wider">
              MATRIZ GENERAL DE PRODUCTOS · EDICIÓN DIRECTA DE CATEGORÍAS, STOCK, COSTOS Y PRECIOS EN TIEMPO REAL
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-4 py-2 border font-bold text-xs uppercase transition-all ${
                isEditMode ? 'bg-amber-500 text-black border-amber-400' : 'border-zinc-700 hover:bg-zinc-800'
              }`}
            >
              {isEditMode ? '⚡ MODO EDICIÓN ACTIVO' : '✏️ HABILITAR EDICIÓN'}
            </button>

            <div className="flex items-center border border-zinc-800 p-1 text-xs">
              <span className="px-2 uppercase opacity-60 text-[10px]">TEMA:</span>
              <button
                onClick={() => setThemeMode('bw')}
                className={`px-3 py-1 text-xs uppercase font-bold transition-colors ${
                  themeMode === 'bw' ? 'bg-white text-black' : 'hover:bg-zinc-800'
                }`}
              >
                B/N Clásico
              </button>
              <button
                onClick={() => setThemeMode('green')}
                className={`px-3 py-1 text-xs uppercase font-bold transition-colors ${
                  themeMode === 'green' ? 'bg-emerald-500 text-black' : 'hover:bg-zinc-800'
                }`}
              >
                Verde VT100
              </button>
              <button
                onClick={() => setThemeMode('amber')}
                className={`px-3 py-1 text-xs uppercase font-bold transition-colors ${
                  themeMode === 'amber' ? 'bg-amber-500 text-black' : 'hover:bg-zinc-800'
                }`}
              >
                Ámbar CRT
              </button>
            </div>

            <button
              onClick={exportToCSV}
              className={`px-4 py-2 border ${themeClasses.border} hover:bg-white hover:text-black transition-all font-bold text-xs uppercase flex items-center gap-2`}
            >
              <span>💾 EXPORTAR CSV</span>
            </button>

            <button
              onClick={() => window.print()}
              className={`px-4 py-2 border ${themeClasses.border} hover:bg-white hover:text-black transition-all font-bold text-xs uppercase`}
            >
              🖨️ IMPRIMIR
            </button>
          </div>
        </div>

        {/* CONTROLES DE BÚSQUEDA Y FILTROS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-zinc-800/80">
          
          <div className="md:col-span-2 space-y-1">
            <label className="text-[10px] uppercase tracking-widest opacity-70">
              🔍 Búsqueda Rápida (SKU, Nombre, Marca, Specs)
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Escribe para buscar instantáneamente..."
              className={`w-full px-4 py-2.5 text-sm uppercase ${themeClasses.inputBg} outline-none font-mono tracking-wider`}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest opacity-70">
              🏢 Filtro por Proveedor
            </label>
            <select
              value={selectedProvider}
              onChange={(e) => {
                setSelectedProvider(e.target.value);
                setPage(1);
              }}
              className={`w-full px-3 py-2.5 text-xs uppercase ${themeClasses.inputBg} outline-none font-mono cursor-pointer`}
            >
              <option value="ALL">-- TODOS LOS PROVEEDORES --</option>
              {providers.map((pr) => (
                <option key={pr} value={pr}>
                  {pr}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest opacity-70">
              📂 Filtro por Categoría
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className={`w-full px-3 py-2.5 text-xs uppercase ${themeClasses.inputBg} outline-none font-mono cursor-pointer`}
            >
              <option value="ALL">-- TODAS LAS CATEGORÍAS --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* SUMMARY STATS BAR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-zinc-800 text-xs">
          <div>
            <span className="opacity-60 block text-[10px] uppercase">REGISTROS MOSTRADOS:</span>
            <span className={themeClasses.accent}>{products.length} de {totalProducts} productos</span>
          </div>
          <div>
            <span className="opacity-60 block text-[10px] uppercase">VALOR AL COSTO (VISTA):</span>
            <span className={themeClasses.accent}>${stats.totalCostSum.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <div>
            <span className="opacity-60 block text-[10px] uppercase">VALOR A LA VENTA (VISTA):</span>
            <span className={themeClasses.accent}>${stats.totalSaleSum.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <div>
            <span className="opacity-60 block text-[10px] uppercase">MARGEN PROMEDIO:</span>
            <span className="text-emerald-400 font-black">+{stats.avgMarginPercent.toFixed(2)}% (${stats.totalProfitSum.toLocaleString('en-US', { minimumFractionDigits: 2 })})</span>
          </div>
        </div>
      </div>

      {/* ================= TABLA TIPO BASE DE DATOS RETRO CON EDICIÓN ================= */}
      <div className={`border-2 ${themeClasses.border} bg-black/60 overflow-x-auto shadow-2xl`}>
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className={`${themeClasses.headerBg} ${themeClasses.headerText} border-b-2 ${themeClasses.border} uppercase font-bold tracking-wider`}>
              <th className="py-3 px-4 border-r border-zinc-800 w-12 text-center">#</th>
              <th className="py-3 px-4 border-r border-zinc-800 w-36">SKU / CÓDIGO</th>
              <th className="py-3 px-4 border-r border-zinc-800">DESCRIPCIÓN DEL PRODUCTO</th>
              <th className="py-3 px-4 border-r border-zinc-800 w-36">PROVEEDOR</th>
              <th className="py-3 px-4 border-r border-zinc-800 w-44">CATEGORÍA (EDITABLE)</th>
              <th className="py-3 px-4 border-r border-zinc-800 text-center w-24">STOCK (EDITABLE)</th>
              <th className="py-3 px-4 border-r border-zinc-800 text-right w-32">COSTO ($) EDITABLE</th>
              <th className="py-3 px-4 border-r border-zinc-800 text-right w-36">P. VENTA ($) EDITABLE</th>
              <th className="py-3 px-4 border-r border-zinc-800 text-right w-28">MARGEN ($)</th>
              <th className="py-3 px-4 border-r border-zinc-800 text-right w-28">MARGEN (%)</th>
              <th className="py-3 px-4 text-center w-28">ACCIONES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {loading ? (
              <tr>
                <td colSpan={11} className="py-16 text-center text-sm tracking-widest animate-pulse">
                  [ PROCESANDO CONSULTA DE BASE DE DATOS... CARGANDO REGISTROS ]
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-16 text-center text-sm opacity-70 tracking-widest">
                  NO SE ENCONTRARON REGISTROS QUE COINCIDAN CON LOS CRITERIOS DE BÚSQUEDA.
                </td>
              </tr>
            ) : (
              products.map((p, idx) => {
                const globalIndex = (page - 1) * limit + idx + 1;
                const isSaving = savingId === p.id;
                return (
                  <tr
                    key={p.id}
                    className={`hover:${themeClasses.highlight} transition-colors border-b ${themeClasses.border} ${isSaving ? 'opacity-50 bg-amber-950/20' : ''}`}
                  >
                    <td className="py-2.5 px-4 border-r border-zinc-900 text-center font-mono opacity-50">
                      {globalIndex}
                    </td>
                    <td className="py-2.5 px-4 border-r border-zinc-900 font-mono font-bold tracking-wider uppercase">
                      {p.sku}
                    </td>
                    <td className="py-2.5 px-4 border-r border-zinc-900 font-sans text-xs font-medium uppercase tracking-wide">
                      {p.name}
                    </td>
                    <td className="py-2.5 px-4 border-r border-zinc-900 font-mono text-[11px] opacity-80 uppercase">
                      {p.provider}
                    </td>

                    {/* EDITABLE CATEGORY */}
                    <td className="py-1.5 px-2 border-r border-zinc-900 font-mono text-[11px] uppercase">
                      {isEditMode ? (() => {
                        const matched = categories.find(c => c.id === p.categoryId || c.name.toLowerCase() === (p.category || '').toLowerCase());
                        const selVal = matched ? matched.id : (p.categoryId || '');
                        return (
                          <select
                            value={selVal}
                            onChange={(e) => handleUpdateProduct(p.id, 'categoryId', e.target.value)}
                            className={`w-full px-2 py-1 text-[11px] uppercase border ${themeClasses.cellInput} cursor-pointer font-mono outline-none`}
                          >
                            <option value="">-- Sin categoría --</option>
                            {categories.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        );
                      })() : (
                        <span>{p.category}</span>
                      )}
                    </td>

                    {/* EDITABLE STOCK */}
                    <td className="py-1.5 px-2 border-r border-zinc-900 text-center font-mono font-bold">
                      {isEditMode ? (
                        <input
                          type="number"
                          defaultValue={p.stock}
                          onBlur={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val) && val !== p.stock) {
                              handleUpdateProduct(p.id, 'stock', val);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              (e.target as HTMLInputElement).blur();
                            }
                          }}
                          className={`w-16 px-2 py-1 text-center text-xs font-mono font-bold border ${themeClasses.cellInput} ${p.stock > 0 ? 'text-emerald-400' : 'text-rose-500'} outline-none`}
                        />
                      ) : (
                        <span className={p.stock > 0 ? 'text-emerald-400' : 'text-rose-500'}>
                          {p.stock}
                        </span>
                      )}
                    </td>

                    {/* EDITABLE COST PRICE */}
                    <td className="py-1.5 px-2 border-r border-zinc-900 text-right font-mono">
                      {isEditMode ? (
                        <div className="flex items-center justify-end gap-1">
                          <span className="opacity-50 text-[10px]">$</span>
                          <input
                            type="number"
                            step="0.01"
                            defaultValue={p.costPrice ? p.costPrice.toFixed(2) : '0.00'}
                            onBlur={(e) => {
                              const val = parseFloat(e.target.value);
                              if (!isNaN(val) && val !== p.costPrice) {
                                handleUpdateProduct(p.id, 'costPrice', val);
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                (e.target as HTMLInputElement).blur();
                              }
                            }}
                            className={`w-20 px-2 py-1 text-right text-xs font-mono font-bold border ${themeClasses.cellInput} outline-none`}
                          />
                        </div>
                      ) : (
                        <span className="opacity-80">${p.costPrice.toFixed(2)}</span>
                      )}
                    </td>

                    {/* EDITABLE SALE PRICE (PVP) */}
                    <td className="py-1.5 px-2 border-r border-zinc-900 text-right font-mono">
                      {isEditMode ? (
                        <div className="flex items-center justify-end gap-1">
                          <span className="opacity-50 text-[10px]">$</span>
                          <input
                            type="number"
                            step="0.01"
                            defaultValue={p.salePrice ? p.salePrice.toFixed(2) : '0.00'}
                            onBlur={(e) => {
                              const val = parseFloat(e.target.value);
                              if (!isNaN(val) && val !== p.salePrice) {
                                handleUpdateProduct(p.id, 'salePrice', val);
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                (e.target as HTMLInputElement).blur();
                              }
                            }}
                            className={`w-24 px-2 py-1 text-right text-xs font-mono font-black border ${themeClasses.cellInput} text-amber-400 outline-none`}
                          />
                        </div>
                      ) : (
                        <span className="font-black text-sm">${p.salePrice.toFixed(2)}</span>
                      )}
                    </td>

                    {/* MARGEN USD */}
                    <td className="py-2.5 px-4 border-r border-zinc-900 text-right font-mono font-bold text-emerald-400">
                      +${p.marginUsd.toFixed(2)}
                    </td>

                    {/* MARGEN PERCENT */}
                    <td className="py-2.5 px-4 border-r border-zinc-900 text-right font-mono font-bold text-emerald-400">
                      +{p.marginPercent.toFixed(1)}%
                    </td>

                    {/* ACTION BUTTON (ELIMINAR) */}
                    <td className="py-1.5 px-2 text-center font-mono">
                      <button
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        title="Eliminar producto de la matriz"
                        className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-rose-950/60 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-800 transition-colors"
                      >
                        🗑️ ELIMINAR
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINACIÓN Y CONTROL DE VISTA ================= */}
      <div className={`mt-6 p-4 border-2 ${themeClasses.border} bg-black/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono`}>
        <div className="flex items-center gap-3">
          <span className="opacity-70">REGISTROS POR PÁGINA:</span>
          {[50, 100, 250, 500].map((l) => (
            <button
              key={l}
              onClick={() => {
                setLimit(l);
                setPage(1);
              }}
              className={`px-2.5 py-1 border border-zinc-800 ${
                limit === l ? 'bg-white text-black font-bold' : 'hover:bg-zinc-800'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 border border-zinc-800 disabled:opacity-30 disabled:pointer-events-none hover:bg-white hover:text-black font-bold uppercase"
          >
            ◄ ANTERIOR
          </button>

          <span className="px-3">
            PÁGINA <strong className="text-white">{page}</strong> DE <strong className="text-white">{totalPages}</strong>
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-4 py-2 border border-zinc-800 disabled:opacity-30 disabled:pointer-events-none hover:bg-white hover:text-black font-bold uppercase"
          >
            SIGUIENTE ►
          </button>
        </div>
      </div>

    </div>
  );
}
