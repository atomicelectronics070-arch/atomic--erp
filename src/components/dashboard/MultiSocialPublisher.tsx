'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Share2, Plus, CheckCircle2, Upload, Image as ImageIcon, Video, 
  Send, Sparkles, Youtube, Facebook, Instagram, Trash2, Globe, RefreshCw, X, AlertCircle
} from 'lucide-react';

interface SocialAccount {
  id: string;
  platform: 'tiktok' | 'youtube' | 'instagram' | 'facebook' | 'linkedin';
  username: string;
  name: string;
  avatar: string;
  followers: string;
  status: 'CONECTADO' | 'PENDIENTE';
}

export default function MultiSocialPublisher() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([
    { id: '1', platform: 'instagram', username: '@atomic_ec', name: 'Atomic Ecuador', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200', followers: '24.5k', status: 'CONECTADO' },
    { id: '2', platform: 'facebook', username: '@atomic.solutions.ec', name: 'Atomic Corporate Page', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200', followers: '58.2k', status: 'CONECTADO' },
    { id: '3', platform: 'tiktok', username: '@atomic_official', name: 'Atomic TikTok Hub', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200', followers: '112.0k', status: 'CONECTADO' },
    { id: '4', platform: 'youtube', username: 'AtomicTechOfficial', name: 'Atomic Tech Channel', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200', followers: '89.4k', status: 'CONECTADO' }
  ]);

  // Modal New Account State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlatform, setNewPlatform] = useState<'tiktok' | 'youtube' | 'instagram' | 'facebook'>('instagram');
  const [newUsername, setNewUsername] = useState('');
  const [newName, setNewName] = useState('');

  // Publisher State
  const [postCaption, setPostCaption] = useState('');
  const [mediaFile, setMediaFile] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>(['1', '2', '3', '4']);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState<{ [id: string]: 'PENDIENTE' | 'PUBLICANDO' | 'EXITO' }>({});

  const handleAddAccount = () => {
    if (!newUsername.trim() || !newName.trim()) return;
    const newAcc: SocialAccount = {
      id: Date.now().toString(),
      platform: newPlatform,
      username: newUsername.startsWith('@') ? newUsername : `@${newUsername}`,
      name: newName,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200`,
      followers: '0',
      status: 'CONECTADO'
    };
    setAccounts([...accounts, newAcc]);
    setSelectedAccountIds([...selectedAccountIds, newAcc.id]);
    setNewUsername('');
    setNewName('');
    setShowAddModal(false);
  };

  const handleToggleSelectAccount = (id: string) => {
    if (selectedAccountIds.includes(id)) {
      setSelectedAccountIds(selectedAccountIds.filter(accId => accId !== id));
    } else {
      setSelectedAccountIds([...selectedAccountIds, id]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVid = file.type.startsWith('video');
      setMediaType(isVid ? 'video' : 'image');
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = async () => {
    if (!postCaption.trim() && !mediaFile) {
      alert('⚠️ Ingresa una descripción o sube un archivo multimedia para publicar.');
      return;
    }
    if (selectedAccountIds.length === 0) {
      alert('⚠️ Selecciona al menos una red social para publicar.');
      return;
    }

    setIsPublishing(true);
    const initialProg: { [id: string]: 'PENDIENTE' | 'PUBLICANDO' | 'EXITO' } = {};
    selectedAccountIds.forEach(id => { initialProg[id] = 'PUBLICANDO'; });
    setPublishProgress(initialProg);

    // Simulate multi-channel API deployment
    for (const id of selectedAccountIds) {
      await new Promise(r => setTimeout(r, 800));
      setPublishProgress(prev => ({ ...prev, [id]: 'EXITO' }));
    }

    setIsPublishing(false);
    alert('🚀 ¡Contenido publicado simultáneamente en todas las redes seleccionadas!');
    setPostCaption('');
    setMediaFile(null);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="text-pink-500" size={18} />;
      case 'facebook': return <Facebook className="text-blue-500" size={18} />;
      case 'youtube': return <Youtube className="text-red-500" size={18} />;
      case 'tiktok': return <span className="font-black text-emerald-400 text-xs">TikTok</span>;
      default: return <Globe className="text-indigo-400" size={18} />;
    }
  };

  return (
    <div className="w-full bg-[#050505] text-white rounded-3xl p-6 lg:p-10 border border-white/10 shadow-2xl space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-pink-500/10 border border-pink-500/30 rounded-full text-pink-400 font-mono text-[10px] font-bold uppercase tracking-widest mb-3">
            <Sparkles size={12} />
            <span>Publicador Omni-Canal v4.0</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Share2 className="text-pink-500" />
            <span>Gestor & Publicador Multi-Red Social</span>
          </h2>
          <p className="text-neutral-400 text-xs font-light mt-1">
            Conecta tus cuentas corporativas y difunde contenido simultáneo a TikTok, YouTube, Instagram y Facebook.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-[0_0_30px_rgba(236,72,153,0.3)] flex items-center justify-center space-x-2 shrink-0"
        >
          <Plus size={16} />
          <span>Conectar Nueva Cuenta</span>
        </button>
      </div>

      {/* 1. SECCIÓN DE CUENTAS CONECTADAS */}
      <div>
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400 mb-4 flex items-center gap-2">
          <span>Cuentas Sociales Conectadas ({accounts.length})</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {accounts.map((acc) => {
            const isChecked = selectedAccountIds.includes(acc.id);

            return (
              <div
                key={acc.id}
                onClick={() => handleToggleSelectAccount(acc.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center space-x-4 relative overflow-hidden ${
                  isChecked 
                    ? 'bg-white/[0.04] border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.15)]' 
                    : 'bg-neutral-900/60 border-white/5 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="relative">
                  <img src={acc.avatar} alt={acc.name} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                  <div className="absolute -bottom-1 -right-1 bg-black p-1 rounded-md border border-white/10">
                    {getPlatformIcon(acc.platform)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{acc.name}</h4>
                  <p className="text-[10px] font-mono text-neutral-400 truncate">{acc.username}</p>
                  <span className="text-[9px] font-mono text-pink-400 font-bold">{acc.followers} seguidores</span>
                </div>

                <div className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                  isChecked ? 'bg-pink-500 border-pink-500 text-black' : 'border-white/20'
                }`}>
                  {isChecked && <CheckCircle2 size={14} className="text-white" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. COMPOSITOR DE PUBLICACIÓN MULTI-RED */}
      <div className="grid lg:grid-cols-12 gap-8 items-start pt-6 border-t border-white/10">
        
        {/* Left Column: Post Creator (7 Cols) */}
        <div className="lg:col-span-7 bg-neutral-900/80 border border-white/10 p-6 lg:p-8 rounded-3xl space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Upload className="text-pink-500" size={16} /> Crear Publicación Simultánea
            </h3>
            <span className="text-[10px] font-mono text-neutral-400">
              Difundiendo a {selectedAccountIds.length} redes
            </span>
          </div>

          {/* Media Dropzone */}
          <div className="relative border-2 border-dashed border-white/10 hover:border-pink-500/50 rounded-2xl p-6 text-center bg-black/40 transition-colors cursor-pointer group">
            <input 
              type="file" 
              accept="image/*,video/*" 
              onChange={handleFileUpload} 
              className="absolute inset-0 opacity-0 cursor-pointer z-20" 
            />
            {mediaFile ? (
              <div className="relative h-64 w-full flex items-center justify-center rounded-xl overflow-hidden bg-black">
                {mediaType === 'video' ? (
                  <video src={mediaFile} controls className="max-h-full max-w-full object-contain" />
                ) : (
                  <img src={mediaFile} alt="Upload preview" className="max-h-full max-w-full object-contain" />
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); setMediaFile(null); }}
                  className="absolute top-3 right-3 bg-black/80 text-white p-2 rounded-full border border-white/20 z-30 hover:bg-red-600 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="py-8 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-pink-400 group-hover:scale-110 transition-transform">
                  <ImageIcon size={24} />
                </div>
                <p className="text-xs font-bold text-white">Haz clic o arrastra un archivo multimedia</p>
                <p className="text-[10px] text-neutral-500">Soporta Fotos (JPG, PNG) y Videos (MP4, MOV)</p>
              </div>
            )}
          </div>

          {/* Post Caption Textarea */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-mono font-bold uppercase text-neutral-400">Descripción / Caption del Post</label>
              <button 
                onClick={() => setPostCaption(prev => prev + " 🚀 ¡Descubre la nueva tecnología industrial de ATOMIC! #AtomicERP #Tecnologia #Industrial")}
                className="text-[10px] font-bold text-pink-400 hover:underline flex items-center gap-1"
              >
                <Sparkles size={10} /> Auto-Hashtags IA
              </button>
            </div>
            <textarea 
              value={postCaption}
              onChange={e => setPostCaption(e.target.value)}
              rows={4}
              placeholder="Escribe la descripción de tu publicación para TikTok, YouTube, Instagram y Facebook..."
              className="w-full bg-black/60 border border-white/10 p-4 text-xs text-white font-medium rounded-xl outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all resize-none"
            />
          </div>

          {/* Publish Action Button */}
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="w-full py-4 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-[0_0_40px_rgba(236,72,153,0.4)] disabled:opacity-50 flex items-center justify-center space-x-3"
          >
            {isPublishing ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Publicando en Redes Seleccionadas...</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Publicar Simultáneamente ({selectedAccountIds.length} Cuentas)</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Live Target Checklist & Publishing Status (5 Cols) */}
        <div className="lg:col-span-5 bg-neutral-900/80 border border-white/10 p-6 lg:p-8 rounded-3xl space-y-6">
          <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2 border-b border-white/10 pb-4">
            <CheckCircle2 className="text-emerald-400" size={16} /> Redes Seleccionadas para Envío
          </h3>

          <div className="space-y-3">
            {accounts.map(acc => {
              const isSelected = selectedAccountIds.includes(acc.id);
              const status = publishProgress[acc.id];

              return (
                <div 
                  key={acc.id}
                  onClick={() => handleToggleSelectAccount(acc.id)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    isSelected ? 'bg-white/5 border-white/20' : 'bg-black/40 border-white/5 opacity-40'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      onChange={() => {}}
                      className="accent-pink-500 rounded cursor-pointer"
                    />
                    <div className="flex items-center space-x-2">
                      {getPlatformIcon(acc.platform)}
                      <span className="text-xs font-bold text-white">{acc.name}</span>
                    </div>
                  </div>

                  <div>
                    {status === 'PUBLICANDO' && (
                      <span className="text-[10px] font-mono text-amber-400 animate-pulse">Publicando...</span>
                    )}
                    {status === 'EXITO' && (
                      <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 size={12} /> Enviado
                      </span>
                    )}
                    {!status && isSelected && (
                      <span className="text-[10px] font-mono text-neutral-500">Lista para envío</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-black/60 rounded-2xl border border-white/5 text-neutral-400 text-[11px] font-light space-y-2">
            <p className="font-bold text-white uppercase text-[10px]">💡 Automatización Omni-Canal</p>
            <p>Al hacer clic en publicar, el backend conectará automáticamente con la API de cada red social enviando la foto/video y la descripción exacta.</p>
          </div>
        </div>

      </div>

      {/* MODAL: AÑADIR NUEVA CUENTA SOCIAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-neutral-900 border border-white/10 p-8 rounded-3xl max-w-md w-full space-y-6 relative shadow-2xl"
            >
              <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 text-neutral-400 hover:text-white">
                <X size={18} />
              </button>

              <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                <Plus className="text-pink-500" /> Conectar Nueva Cuenta Social
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono uppercase font-bold text-neutral-400 block mb-2">Plataforma Social</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['instagram', 'facebook', 'tiktok', 'youtube'] as const).map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNewPlatform(p)}
                        className={`p-3 rounded-xl border text-xs font-bold uppercase flex items-center justify-center space-x-2 transition-all ${
                          newPlatform === p ? 'bg-pink-500/20 border-pink-500 text-white' : 'bg-black/40 border-white/10 text-neutral-400'
                        }`}
                      >
                        {getPlatformIcon(p)}
                        <span className="capitalize">{p}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase font-bold text-neutral-400 block mb-1">Nombre de la Cuenta / Marca</label>
                  <input
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="Ej: Atomic Tienda Oficial"
                    className="w-full bg-black/60 border border-white/10 p-3 text-xs text-white rounded-xl outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase font-bold text-neutral-400 block mb-1">Usuario / Handle (@)</label>
                  <input
                    value={newUsername}
                    onChange={e => setNewUsername(e.target.value)}
                    placeholder="Ej: @atomic_store"
                    className="w-full bg-black/60 border border-white/10 p-3 text-xs text-white rounded-xl outline-none focus:border-pink-500 font-mono"
                  />
                </div>
              </div>

              <button
                onClick={handleAddAccount}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg"
              >
                Guardar & Vincular Cuenta
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
