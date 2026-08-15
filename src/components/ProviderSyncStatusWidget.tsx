"use client";

import { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, AlertTriangle, PackagePlus, Zap } from 'lucide-react';

export default function ProviderSyncStatusWidget() {
  const [syncing, setSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<any>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  const runSync = async (force: boolean = false) => {
    setSyncing(true);
    try {
      const res = await fetch(`/api/cron/sync-provider-inventory?force=${force ? 'true' : 'false'}`);
      const data = await res.json();
      if (data.success) {
        setLastSyncResult(data.summary);
        setLastSyncTime(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error('Error al ejecutar sincronización:', err);
    } finally {
      setSyncing(false);
    }
  };

  // Auto-sync on component mount (silent background sync)
  useEffect(() => {
    runSync(false);
    const interval = setInterval(() => {
      runSync(false);
    }, 15 * 60 * 1000); // Auto sync cada 15 minutos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 border-2 border-slate-950 p-4 rounded-xl shadow-xl text-white font-sans mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Title & Info */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
              MONITOR DE INVENTARIO Y PROVEEDORES EN VIVO
            </span>
          </div>
          <p className="text-[11px] text-slate-300 font-medium">
            Detecta automáticamente productos descontinuados (marca AGOTADO) e importa nuevos ítems de proveedores.
          </p>
        </div>

        {/* Sync Controls & Last Time */}
        <div className="flex items-center gap-3">
          {lastSyncTime && (
            <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1.5 rounded border border-slate-800">
              Último escaneo: <strong className="text-white">{lastSyncTime}</strong>
            </span>
          )}

          <button
            onClick={() => runSync(true)}
            disabled={syncing}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg border-2 border-amber-400 bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all flex items-center gap-2 shadow-lg ${
              syncing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Escaneando Proveedores...' : '⚡ Sincronizar Ahora'}</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      {lastSyncResult && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-800 text-xs font-mono">
          <div className="bg-slate-950 p-2.5 rounded border border-slate-800 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[9px] text-slate-400 block uppercase">Analizados</span>
              <span className="font-bold text-white">{lastSyncResult.totalProductosAnalizados} ítems</span>
            </div>
          </div>

          <div className="bg-slate-950 p-2.5 rounded border border-slate-800 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <div>
              <span className="text-[9px] text-slate-400 block uppercase">Agotados Detectados</span>
              <span className="font-bold text-rose-300">{lastSyncResult.productosAgotadosActualizados} marcados</span>
            </div>
          </div>

          <div className="bg-slate-950 p-2.5 rounded border border-slate-800 flex items-center space-x-2">
            <PackagePlus className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <span className="text-[9px] text-slate-400 block uppercase">Nuevos Importados</span>
              <span className="font-bold text-cyan-300">+{lastSyncResult.nuevosProductosDescubiertos} nuevos</span>
            </div>
          </div>

          <div className="bg-slate-950 p-2.5 rounded border border-slate-800 flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-[9px] text-slate-400 block uppercase">Reactivados</span>
              <span className="font-bold text-amber-300">{lastSyncResult.productosReactivadosConStock} en stock</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
