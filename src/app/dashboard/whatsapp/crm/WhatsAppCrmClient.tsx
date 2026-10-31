"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useSession } from "next-auth/react"
import { 
    MessageSquare, Send, Search, User, Phone, CheckCheck, 
    Sparkles, Plus, ExternalLink, ShieldCheck, Tag, RefreshCw, ChevronLeft,
    Settings, Image as ImageIcon, ShoppingBag, Download, Check, Save, X, Globe, Mail, MapPin,
    Volume2, Mic, Film, FileText, Megaphone, Eye, Key, AlertCircle, Copy, Paperclip, Loader2,
    UserCheck, UserPlus, Lock, Users, Filter, CheckCircle2, Flame, Bot, Zap, Bell, Camera, Upload
} from "lucide-react"

interface ReferralData {
    sourceUrl?: string
    sourceType?: string
    sourceId?: string
    headline?: string
    body?: string
    mediaType?: string
    imageUrl?: string
    videoUrl?: string
    thumbnailUrl?: string
    ctwaClid?: string
}

interface MessageItem {
    id: string
    text: string
    sender: "me" | "them"
    time: string
    type: string
    mediaUrl?: string | null
    referral?: ReferralData | null
    status?: string
    errorMessage?: string | null
}

interface Chat {
    id: string
    name: string
    phone: string
    lastMessage: string
    time: string
    unread: number
    status: string
    isFromAd?: boolean
    adHeadline?: string
    hasFailedMessage?: boolean
    failedMessage?: {
        id: string
        body: string
        errorMessage?: string | null
        createdAt?: string
    } | null
    ownerId?: string | null
    ownerName?: string | null
    messages: MessageItem[]
}

function formatPhoneNumber(phone: string = ''): string {
    const clean = phone.replace(/\D/g, '');
    if (!clean) return phone;
    if (clean.startsWith('593') && clean.length === 12) {
        return `+593 ${clean.slice(3, 5)} ${clean.slice(5, 8)} ${clean.slice(8)}`;
    }
    if (clean.startsWith('09') && clean.length === 10) {
        return `+593 ${clean.slice(1, 3)} ${clean.slice(3, 6)} ${clean.slice(6)}`;
    }
    if (clean.length > 8) {
        return `+${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6)}`;
    }
    return clean ? `+${clean}` : phone;
}

function parseMessageBody(rawBody: string = '', rawMediaUrl?: string | null, rawType: string = 'text') {
    let cleanText = rawBody || '';
    let referral: ReferralData | null = null;
    let type = rawType || 'text';

    // 1. Extract [PAUTA_META:...]
    if (cleanText.includes('[PAUTA_META:')) {
        const match = cleanText.match(/\[PAUTA_META:([\s\S]*?)\]\n?/);
        if (match && match[1]) {
            try {
                referral = JSON.parse(match[1]);
                cleanText = cleanText.replace(match[0], '').trim();
            } catch (e) {
                // Ignore JSON parse error
            }
        }
    }

    // 2. Extract raw JSON if stored directly
    if (!referral && cleanText.startsWith('{') && cleanText.endsWith('}')) {
        try {
            const parsed = JSON.parse(cleanText);
            if (parsed.headline || parsed.sourceUrl || parsed.sourceType || parsed.imageUrl || parsed.thumbnailUrl || parsed.source_url) {
                referral = parsed;
                cleanText = parsed.body || parsed.headline || '';
            }
        } catch (e) {}
    }

    // Normalize referral keys (snake_case -> camelCase)
    if (referral) {
        if ((referral as any).image_url && !referral.imageUrl) referral.imageUrl = (referral as any).image_url;
        if ((referral as any).thumbnail_url && !referral.thumbnailUrl) referral.thumbnailUrl = (referral as any).thumbnail_url;
        if ((referral as any).source_url && !referral.sourceUrl) referral.sourceUrl = (referral as any).source_url;
        if ((referral as any).source_type && !referral.sourceType) referral.sourceType = (referral as any).source_type;
        if ((referral as any).source_id && !referral.sourceId) referral.sourceId = (referral as any).source_id;
        if ((referral as any).ctwa_clid && !referral.ctwaClid) referral.ctwaClid = (referral as any).ctwa_clid;
    }

    // 3. Normalize unsupported or empty text
    if (type === 'unsupported' || cleanText === '[Mensaje unsupported]' || cleanText.includes('[Mensaje unsupported]')) {
        cleanText = cleanText.replace(/\[Mensaje unsupported\]/g, '').trim();
        if (!cleanText) {
            cleanText = '📢 Mensaje interactivo / Botón de anuncio publicitario';
        }
    }

    // 4. If message originated from an ad referral and cleanText is blank, supply descriptive text
    if (referral && !cleanText) {
        cleanText = referral.headline 
            ? `📢 Lead de Pauta: ${referral.headline}` 
            : '📢 Lead originado de Pauta de Meta';
    }

    // 5. Default fallback if body is completely empty and no media
    if (!cleanText && !rawMediaUrl && !referral) {
        cleanText = '👋 Cliente inició la conversación';
    }

    return { cleanText, referral, mediaUrl: rawMediaUrl, type };
}

export default function WhatsAppCrmClient() {
    const { data: session } = useSession()
    const [chats, setChats] = useState<Chat[]>([])
    const [activeChatId, setActiveChatId] = useState<string>("")
    const [inputText, setInputText] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [loading, setLoading] = useState(true)

    // Auto-scroll refs
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const messagesContainerRef = useRef<HTMLDivElement>(null)
    const prevMessagesCountRef = useRef<number>(0)
    const hasInteractedRef = useRef<boolean>(false)

    // Synthesized Sound Alerts via Web Audio API (Zero external assets needed)
    const playIncomingSound = useCallback(() => {
        try {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
            if (!AudioCtx) return
            const ctx = new AudioCtx()
            if (ctx.state === 'suspended') {
                ctx.resume().catch(() => {})
            }

            const now = ctx.currentTime
            // Tone 1
            const osc1 = ctx.createOscillator()
            const gain1 = ctx.createGain()
            osc1.type = 'sine'
            osc1.frequency.setValueAtTime(587.33, now) // D5
            osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12) // A5
            gain1.gain.setValueAtTime(0.15, now)
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
            osc1.connect(gain1)
            gain1.connect(ctx.destination)
            osc1.start(now)
            osc1.stop(now + 0.25)

            // Tone 2 (pleasant bell chime)
            const osc2 = ctx.createOscillator()
            const gain2 = ctx.createGain()
            osc2.type = 'sine'
            osc2.frequency.setValueAtTime(1174.66, now + 0.1) // D6
            gain2.gain.setValueAtTime(0.12, now + 0.1)
            gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.35)
            osc2.connect(gain2)
            gain2.connect(ctx.destination)
            osc2.start(now + 0.1)
            osc2.stop(now + 0.35)
        } catch (e) {
            // Audio context not allowed until user interacts
        }
    }, [])

    const playOutgoingSound = useCallback(() => {
        try {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
            if (!AudioCtx) return
            const ctx = new AudioCtx()
            if (ctx.state === 'suspended') {
                ctx.resume().catch(() => {})
            }

            const now = ctx.currentTime
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.type = 'triangle'
            osc.frequency.setValueAtTime(440, now) // A4
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.15) // A5
            gain.gain.setValueAtTime(0.12, now)
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18)
            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.start(now)
            osc.stop(now + 0.18)
        } catch (e) {
            // Audio context
        }
    }, [])

    // Track user gesture to permit Web Audio autoplay
    useEffect(() => {
        const unlockAudio = () => {
            hasInteractedRef.current = true
            window.removeEventListener('click', unlockAudio)
            window.removeEventListener('keydown', unlockAudio)
        }
        window.addEventListener('click', unlockAudio)
        window.addEventListener('keydown', unlockAudio)
        return () => {
            window.removeEventListener('click', unlockAudio)
            window.removeEventListener('keydown', unlockAudio)
        }
    }, [])

    // CRM Tabs Filter: "MY_LEADS" | "ALL_WHATSAPP" | "PAUTAS" | "FAILED" | "AUTO_REGISTER"
    const [activeCrmTab, setActiveCrmTab] = useState<'MY_LEADS' | 'ALL_WHATSAPP' | 'PAUTAS' | 'FAILED' | 'AUTO_REGISTER'>('MY_LEADS')
    const [systemAdvisors, setSystemAdvisors] = useState<any[]>([])

    // Intelligent Retry & Resuscitate State
    const [isRetrying, setIsRetrying] = useState(false)
    const [retrySuccessMsg, setRetrySuccessMsg] = useState<string | null>(null)
    const [copiedPhone, setCopiedPhone] = useState(false)
    const [autoRetryCountdown, setAutoRetryCountdown] = useState<number>(15)
    const isRetryingRef = useRef(false)
    isRetryingRef.current = isRetrying

    // Karen Agent Modal & Live State
    const [karenModalOpen, setKarenModalOpen] = useState(false)
    const [karenAuditData, setKarenAuditData] = useState<any>(null)
    const [karenLoading, setKarenLoading] = useState(false)
    const [karenChatInput, setKarenChatInput] = useState("")
    const [karenChatLog, setKarenChatLog] = useState<Array<{ sender: 'karen' | 'user'; text: string }>>([
        { sender: 'karen', text: '¡Hola Juan! Soy Karen, Jefa de Mensajería y Auditoría de ATOMIC. Estoy monitoreando todos los chats en tiempo real. ¿En qué te puedo asesorar hoy?' }
    ])

    const fetchKarenAudit = useCallback(async () => {
        try {
            const res = await fetch('/api/karen/audit')
            if (res.ok) {
                const data = await res.json()
                setKarenAuditData(data)
            }
        } catch (_) {}
    }, [])

    useEffect(() => {
        fetchKarenAudit()
        const interval = setInterval(fetchKarenAudit, 30000)
        return () => clearInterval(interval)
    }, [fetchKarenAudit])

    const handleKarenCommand = async (commandText: string) => {
        if (!commandText.trim()) return
        const text = commandText.trim()
        setKarenChatLog(prev => [...prev, { sender: 'user', text }])
        setKarenChatInput("")
        setKarenLoading(true)
        try {
            const res = await fetch('/api/karen/command', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command: text })
            })
            const data = await res.json()
            if (data.reply) {
                setKarenChatLog(prev => [...prev, { sender: 'karen', text: data.reply }])
            }
            fetchKarenAudit()
        } catch (err: any) {
            setKarenChatLog(prev => [...prev, { sender: 'karen', text: 'Error de conexión al consultar con Karen.' }])
        } finally {
            setKarenLoading(false)
        }
    }

    const handleSetKarenMode = async (mode: 'AUTOMATIC' | 'MANUAL' | 'AWAITING_APPROVAL') => {
        try {
            const res = await fetch('/api/karen/command', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode })
            })
            if (res.ok) {
                fetchKarenAudit()
            }
        } catch (_) {}
    }

    // Roles permitted to assign leads: SUPERVISOR, COORDINADOR, CEO (ADMIN), JEFE TECNICO
    const userRole = (session?.user as any)?.role?.toUpperCase() || ''
    const userArea = ((session?.user as any)?.area || '').toUpperCase()
    const canAssignLeads = 
        userRole === 'ADMIN' || 
        userRole === 'SUPERVISOR' || 
        userRole === 'COORDINATOR' || 
        userRole === 'COORDINADOR' ||
        userRole === 'JEFE_TECNICO' ||
        userRole === 'JEFE TECNICO' ||
        userRole === 'TECHNICAL_CHIEF' ||
        userRole === 'TALLER' ||
        userArea.includes('SUPERVIS') ||
        userArea.includes('COORD') ||
        userArea.includes('TECNIC')

    // Advisor Assignment State
    const [assignModalOpen, setAssignModalOpen] = useState(false)
    const [chatToAssign, setChatToAssign] = useState<Chat | null>(null)
    const [advisorInput, setAdvisorInput] = useState("")
    const [assigningLoading, setAssigningLoading] = useState(false)

    // Media Zoom / Lightbox State
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
    const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null)
    const [failedMedia, setFailedMedia] = useState<Record<string, boolean>>({})

    // Media Outbound Attachment State
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [pendingAttachment, setPendingAttachment] = useState<{
        url: string;
        mediaType: 'image' | 'audio' | 'video' | 'document';
        filename: string;
        size?: number;
    } | null>(null)
    const [isUploadingAttachment, setIsUploadingAttachment] = useState(false)

    // WhatsApp Settings & Profile Modal State
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
    const [activeSettingsTab, setActiveSettingsTab] = useState<'profile' | 'credentials' | 'catalog' | 'manual'>('credentials')
    const [settingsSaving, setSettingsSaving] = useState(false)
    const [settingsMessage, setSettingsMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    
    // WhatsApp Commerce & Catalog State
    const [catalogSettings, setCatalogSettings] = useState<{
        isCatalogVisible: boolean;
        isCartEnabled: boolean;
        catalogId: string;
        totalProducts: number;
        feedUrl: string;
        metaError: string | null;
        linkedCatalogs: any[];
    }>({
        isCatalogVisible: true,
        isCartEnabled: true,
        catalogId: '',
        totalProducts: 0,
        feedUrl: 'https://atomiccotizador.shop/api/whatsapp/catalog?format=csv',
        metaError: null,
        linkedCatalogs: []
    })
    const [catalogLoading, setCatalogLoading] = useState(false)
    const [sendingCatalog, setSendingCatalog] = useState(false)

    const fetchCatalogSettings = async () => {
        try {
            setCatalogLoading(true)
            const res = await fetch('/api/whatsapp/commerce')
            if (res.ok) {
                const data = await res.json()
                setCatalogSettings({
                    isCatalogVisible: data.isCatalogVisible ?? true,
                    isCartEnabled: data.isCartEnabled ?? true,
                    catalogId: data.catalogId || '',
                    totalProducts: data.totalProducts || 0,
                    feedUrl: data.feedUrl || 'https://atomiccotizador.shop/api/whatsapp/catalog?format=csv',
                    metaError: data.metaError || null,
                    linkedCatalogs: data.linkedCatalogs || []
                })
            }
        } catch (_) {}
        finally {
            setCatalogLoading(false)
        }
    }

    const handleSaveCatalogSettings = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        setSettingsSaving(true)
        setSettingsMessage(null)
        try {
            const res = await fetch('/api/whatsapp/commerce', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    isCatalogVisible: catalogSettings.isCatalogVisible,
                    isCartEnabled: catalogSettings.isCartEnabled,
                    catalogId: catalogSettings.catalogId
                })
            })
            const data = await res.json()
            if (res.ok && data.success) {
                setSettingsMessage({
                    type: 'success',
                    text: '¡Ajustes de catálogo y carrito actualizados con éxito en Meta WhatsApp Cloud API!'
                })
                fetchCatalogSettings()
            } else {
                setSettingsMessage({
                    type: 'error',
                    text: data.error || 'Error al actualizar catálogo en Meta'
                })
            }
        } catch (err: any) {
            setSettingsMessage({ type: 'error', text: err.message || 'Error de conexión' })
        } finally {
            setSettingsSaving(false)
        }
    }

    const handleSendCatalogToClient = async () => {
        if (!activeChat) return
        if (!confirm(`¿Deseas enviar el Catálogo Oficial interactivo a ${activeChat.name}?`)) return
        setSendingCatalog(true)
        try {
            const res = await fetch('/api/whatsapp/catalog/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversationId: activeChat.id,
                    phone: activeChat.phone
                })
            })
            const data = await res.json()
            if (res.ok && data.success) {
                playOutgoingSound()
                fetchConversations()
            } else {
                alert(`⚠️ Error enviando catálogo: ${data.error || 'Verifica que la cuenta de WhatsApp tenga un catálogo conectado en Meta.'}`)
            }
        } catch (err: any) {
            alert(`⚠️ Error de red: ${err.message}`)
        } finally {
            setSendingCatalog(false)
        }
    }

    // Credentials State
    const [credPhoneId, setCredPhoneId] = useState('')
    const [credToken, setCredToken] = useState('')
    const [credStatus, setCredStatus] = useState<'IDLE' | 'TESTING' | 'SUCCESS' | 'ERROR'>('IDLE')
    const [credTestResult, setCredTestResult] = useState<string | null>(null)

    // Credentials Protection (Contraseña Maestra 123456)
    const [isCredentialsUnlocked, setIsCredentialsUnlocked] = useState(false)
    const [credentialsPinInput, setCredentialsPinInput] = useState('')
    const [credentialsPinError, setCredentialsPinError] = useState(false)

    const [profileData, setProfileData] = useState({
        about: 'Tecnología, Industria y Hogar',
        description: 'Importación y Comercialización de Equipos Tecnológicos, Industriales y de Hogar.',
        email: 'ventas@atomic.com.ec',
        websites: 'https://atomiccotizador.shop/web',
        address: 'Quito, Ecuador',
        profile_picture_url: ''
    })
    const [avatarKey, setAvatarKey] = useState(Date.now())
    const [photoPreview, setPhotoPreview] = useState<string | null>(null)
    const [photoBase64, setPhotoBase64] = useState<string | null>(null)
    const photoFileInputRef = useRef<HTMLInputElement>(null)

    const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert('⚠️ La imagen seleccionada no debe superar los 5MB.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setPhotoPreview(base64);
            setPhotoBase64(base64);
        };
        reader.readAsDataURL(file);
    };

    const [isSyncingPhoto, setIsSyncingPhoto] = useState(false);

    const handleSyncMetaPhoto = async () => {
        setIsSyncingPhoto(true);
        setSettingsMessage(null);
        try {
            const res = await fetch('/api/whatsapp/profile/sync', { method: 'POST' });
            const data = await res.json();
            if (res.ok && data.success) {
                setSettingsMessage({ 
                    type: 'success', 
                    text: data.message || '¡Foto de perfil sincronizada con éxito en Meta WhatsApp Cloud API!' 
                });
                setAvatarKey(Date.now());
                if (data.updatedProfile?.profile_picture_url) {
                    setProfileData(prev => ({ ...prev, profile_picture_url: data.updatedProfile.profile_picture_url }));
                }
            } else {
                setSettingsMessage({ 
                    type: 'error', 
                    text: data.error || 'Error al sincronizar foto con Meta Cloud API' 
                });
            }
        } catch (err: any) {
            setSettingsMessage({ type: 'error', text: err.message || 'Error de conexión con el servidor' });
        } finally {
            setIsSyncingPhoto(false);
        }
    };

    const fetchConversations = useCallback(async () => {
        try {
            const res = await fetch('/api/whatsapp/conversations')
            if (res.ok) {
                const data = await res.json()
                if (Array.isArray(data)) {
                    const formattedChats: Chat[] = data
                        .filter((conv: any) => {
                            const rawId = (conv.contact?.whatsappId || '').replace(/\D/g, '');
                            return !rawId.endsWith('969043453');
                        })
                        .map((conv: any) => {
                        const rawMessages = conv.messages || [];
                        let isFromAd = conv.status === 'LEAD_PAUTA' || Boolean(conv.isFromAd);
                        let adHeadline = conv.adHeadline || '';

                        const parsedMessages: MessageItem[] = rawMessages.map((m: any) => {
                            const { cleanText, referral, mediaUrl, type } = parseMessageBody(m.body, m.mediaUrl, m.type);
                            if (referral) {
                                isFromAd = true;
                                if (referral.headline) adHeadline = referral.headline;
                            }
                            return {
                                id: m.id,
                                text: cleanText,
                                sender: m.direction === 'OUTBOUND' ? 'me' : 'them',
                                time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                type: type || 'text',
                                mediaUrl: mediaUrl,
                                referral: referral,
                                status: m.status,
                                errorMessage: m.errorMessage || null
                            };
                        }).reverse();

                        const lastMsg = rawMessages[0];
                        const lastParsed = lastMsg ? parseMessageBody(lastMsg.body, lastMsg.mediaUrl, lastMsg.type) : null;
                        
                        let lastMessageDisplay = 'Sin mensajes';
                        if (lastParsed) {
                            if (lastParsed.type === 'image') lastMessageDisplay = '📷 Imagen' + (lastParsed.cleanText ? ': ' + lastParsed.cleanText : '');
                            else if (lastParsed.type === 'audio') lastMessageDisplay = '🎤 Nota de voz';
                            else if (lastParsed.type === 'video') lastMessageDisplay = '🎬 Video';
                            else if (lastParsed.type === 'document') lastMessageDisplay = '📄 Documento';
                            else if (lastParsed.referral) lastMessageDisplay = `📢 Pauta: ${lastParsed.referral.headline || 'Anuncio Meta'}`;
                            else lastMessageDisplay = lastParsed.cleanText || 'Mensaje';
                        }

                        const hasFailedMessage = Boolean(conv.hasFailedMessage) || parsedMessages.some(m => m.status === 'FAILED');

                        return {
                            id: conv.id,
                            name: conv.contact?.name || conv.contact?.whatsappId || 'Cliente WhatsApp',
                            phone: conv.contact?.whatsappId || '',
                            lastMessage: lastMessageDisplay,
                            time: lastMsg ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
                            unread: 0,
                            status: conv.status || 'NEW',
                            isFromAd: isFromAd || conv.status === 'LEAD_PAUTA',
                            adHeadline: adHeadline,
                            hasFailedMessage: hasFailedMessage,
                            failedMessage: conv.failedMessage || (hasFailedMessage ? parsedMessages.find(m => m.status === 'FAILED') : null),
                            ownerId: conv.ownerId || conv.owner?.id || null,
                            ownerName: conv.owner?.name || null,
                            messages: parsedMessages
                        };
                    });

                    setChats(formattedChats);
                    if (formattedChats.length > 0 && !activeChatId && window.innerWidth >= 768) {
                        setActiveChatId(formattedChats[0].id);
                    }
                }
            }
        } catch (e) {
            console.error('Error fetching conversations:', e);
        } finally {
            setLoading(false);
        }
    }, [activeChatId]);

    const fetchWhatsAppProfile = async () => {
        try {
            const res = await fetch('/api/whatsapp/profile');
            if (res.ok) {
                const data = await res.json();
                if (data.profile) {
                    setProfileData({
                        about: data.profile.about || 'Tecnología, Industria y Hogar',
                        description: data.profile.description || 'Importación y Comercialización de Equipos Tecnológicos, Industriales y de Hogar.',
                        email: data.profile.email || 'ventas@atomic.com.ec',
                        websites: Array.isArray(data.profile.websites) ? data.profile.websites.join(', ') : (data.profile.websites || 'https://atomiccotizador.shop/web'),
                        address: data.profile.address || 'Quito, Ecuador',
                        profile_picture_url: data.profile.profile_picture_url || ''
                    });
                }
            }
        } catch (e) {
            console.error('Error fetching profile:', e);
        }
    };

    const fetchCredentials = async () => {
        try {
            const res = await fetch('/api/whatsapp/config');
            if (res.ok) {
                const settings = await res.json();
                if (Array.isArray(settings)) {
                    const tokenObj = settings.find((s: any) => s.key === 'WHATSAPP_TOKEN');
                    const phoneIdObj = settings.find((s: any) => s.key === 'WHATSAPP_PHONE_NUMBER_ID');
                    if (tokenObj?.value) setCredToken(tokenObj.value);
                    if (phoneIdObj?.value) setCredPhoneId(phoneIdObj.value);
                }
            }
        } catch (e) {
            console.error('Error fetching credentials:', e);
        }
    };

    const fetchAdvisors = async () => {
        try {
            const res = await fetch('/api/whatsapp/assign');
            if (res.ok) {
                const data = await res.json();
                if (data.advisors) setSystemAdvisors(data.advisors);
            }
        } catch (e) {
            console.error('Error fetching advisors:', e);
        }
    };

    useEffect(() => {
        fetchConversations();
        fetchWhatsAppProfile();
        fetchCredentials();
        fetchAdvisors();
        fetchCatalogSettings();
        const interval = setInterval(fetchConversations, 3500);
        return () => clearInterval(interval);
    }, [fetchConversations]);

    const activeChat = chats.find(c => c.id === activeChatId) || null;

    // Auto-scroll to latest message when conversation opens or new message arrives
    useEffect(() => {
        const scrollToBottom = (behavior: ScrollBehavior = 'auto') => {
            if (messagesContainerRef.current) {
                messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
            }
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior });
            }
        };

        const currentMsgCount = activeChat?.messages?.length || 0;
        
        // If message count increased
        if (currentMsgCount > prevMessagesCountRef.current) {
            // Check if last message was inbound from client
            const lastMsg = activeChat?.messages?.[currentMsgCount - 1];
            if (prevMessagesCountRef.current > 0 && lastMsg && lastMsg.sender === 'them') {
                playIncomingSound();
            }
            scrollToBottom(prevMessagesCountRef.current === 0 ? 'auto' : 'smooth');
        } else {
            scrollToBottom('auto');
        }

        prevMessagesCountRef.current = currentMsgCount;
    }, [activeChatId, activeChat?.messages?.length, playIncomingSound]);

    // Handle chat selection and conditional advisor assignment prompt
    const handleSelectChat = (chat: Chat) => {
        setActiveChatId(chat.id);
        if (!chat.ownerName) {
            setChatToAssign(chat);
            setAdvisorInput(session?.user?.name || "");
            setAssignModalOpen(true);
        }
    };

    // Confirm advisor assignment in DB
    const handleConfirmAssign = async () => {
        if (!chatToAssign || !advisorInput.trim()) return;
        setAssigningLoading(true);
        try {
            const res = await fetch('/api/whatsapp/assign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversationId: chatToAssign.id,
                    action: 'ASSIGN',
                    advisorName: advisorInput.trim()
                })
            });
            if (res.ok) {
                setAssignModalOpen(false);
                fetchConversations();
            } else {
                alert('⚠️ Error al asignar el asesor al chat.');
            }
        } catch (e: any) {
            console.error('Error assigning chat:', e);
            alert(`⚠️ Error de red al asignar: ${e.message}`);
        } finally {
            setAssigningLoading(false);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploadingAttachment(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/whatsapp/media/upload', { method: 'POST', body: formData });
            if (res.ok) {
                const data = await res.json();
                setPendingAttachment({ url: data.url, mediaType: data.mediaType, filename: data.filename, size: data.size });
            } else {
                alert('⚠️ Error al subir el archivo. Intenta de nuevo.');
            }
        } catch (err: any) {
            alert(`⚠️ Error: ${err.message}`);
        } finally {
            setIsUploadingAttachment(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleSendMessage = async () => {
        if ((!inputText.trim() && !pendingAttachment) || !activeChat) return;
        const text = inputText;
        const attachment = pendingAttachment;
        setInputText("");
        setPendingAttachment(null);

        try {
            const body: any = { conversationId: activeChat.id };
            if (attachment) {
                body.mediaUrl = attachment.url;
                body.type = attachment.mediaType;
                body.filename = attachment.filename;
                if (text.trim()) body.text = text;
            } else {
                body.text = text;
                body.type = 'text';
            }
            const res = await fetch('/api/whatsapp/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (res.ok) {
                playOutgoingSound();
                fetchConversations();
            } else {
                const errorData = await res.json();
                const errText = errorData.error || '';
                const isAuthError = errText.toLowerCase().includes('authenticat') || 
                                    errText.toLowerCase().includes('token') || 
                                    errText.toLowerCase().includes('oauth') || 
                                    errText.toLowerCase().includes('190') ||
                                    errText.toLowerCase().includes('expired');

                if (isAuthError) {
                    alert(`⚠️ Error de Autenticación Meta WhatsApp:\n\n${errText}\n\n👉 A continuación se abrirá el panel de Configuración > Credenciales para que puedas pegar y guardar tu nuevo Token Permanente.`);
                    setActiveSettingsTab('credentials');
                    setIsSettingsModalOpen(true);
                } else {
                    alert(`⚠️ Error de entrega de Meta WhatsApp API:\n\n${errText || 'No se pudo despachar el mensaje. Verifica que el Token de WhatsApp esté activo.'}`);
                }
            }
        } catch (e: any) {
            console.error('Error sending message:', e);
            alert(`⚠️ Error de red al enviar mensaje: ${e.message}`);
        }
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSettingsSaving(true);
        setSettingsMessage(null);

        try {
            const res = await fetch('/api/whatsapp/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    about: profileData.about,
                    description: profileData.description,
                    email: profileData.email,
                    websites: profileData.websites.split(',').map(s => s.trim()),
                    address: profileData.address,
                    profile_picture_url: profileData.profile_picture_url,
                    profile_picture_base64: photoBase64 || undefined
                })
            });

            const data = await res.json();
            if (res.ok) {
                const feedbackText = data.metaPictureMessage 
                    ? `¡Perfil y foto guardados! ${data.metaPictureMessage}` 
                    : '¡Perfil de WhatsApp actualizado exitosamente en Meta!';
                setSettingsMessage({ type: 'success', text: feedbackText });
                setAvatarKey(Date.now());
                if (data.avatarUrl) {
                    setProfileData(prev => ({ ...prev, profile_picture_url: data.avatarUrl }));
                }
                setPhotoBase64(null);
                setPhotoPreview(null);
            } else {
                setSettingsMessage({ type: 'error', text: data.error || 'Error al actualizar perfil' });
            }
        } catch (err: any) {
            setSettingsMessage({ type: 'error', text: err.message || 'Error de conexión' });
        } finally {
            setSettingsSaving(false);
        }
    };

    const handleUnlockCredentials = (e: React.FormEvent) => {
        e.preventDefault();
        if (credentialsPinInput.trim() === '123456') {
            setIsCredentialsUnlocked(true);
            setCredentialsPinError(false);
            setCredentialsPinInput('');
        } else {
            setCredentialsPinError(true);
        }
    };

    const handleSaveCredentials = async () => {
        if (!isCredentialsUnlocked) {
            alert('⚠️ Debes desbloquear con la contraseña de seguridad (123456) para guardar cambios.');
            return;
        }
        setSettingsSaving(true);
        setSettingsMessage(null);
        try {
            if (credToken.trim()) {
                await fetch('/api/whatsapp/config', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key: 'WHATSAPP_TOKEN', value: credToken.trim() })
                });
            }
            if (credPhoneId.trim()) {
                await fetch('/api/whatsapp/config', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key: 'WHATSAPP_PHONE_NUMBER_ID', value: credPhoneId.trim() })
                });
            }
            setSettingsMessage({ type: 'success', text: '¡Token y Phone ID guardados correctamente en la base de datos!' });
        } catch (e: any) {
            setSettingsMessage({ type: 'error', text: e.message || 'Error guardando credenciales' });
        } finally {
            setSettingsSaving(false);
        }
    };

    const handleTestConnection = async () => {
        setCredStatus('TESTING');
        setCredTestResult(null);
        try {
            const res = await fetch('/api/whatsapp-test');
            const data = await res.json();
            if (res.ok && data.success) {
                setCredStatus('SUCCESS');
                setCredTestResult('✅ Conexión exitosa con Meta Cloud API. El token y el número están activos.');
            } else {
                setCredStatus('ERROR');
                setCredTestResult(`❌ Error de validación Meta: ${data.error || 'Token inválido o expirado'}`);
            }
        } catch (e: any) {
            setCredStatus('ERROR');
            setCredTestResult(`❌ Error de red: ${e.message}`);
        }
    };

    // ═══════════════════════════════════════════════════════════
    // INTELLIGENT RETRY & RESUSCITATE CHAT HANDLERS
    // ═══════════════════════════════════════════════════════════
    const handleCopyPhone = (phone: string) => {
        if (!navigator?.clipboard) return;
        const clean = phone.replace(/\D/g, '');
        navigator.clipboard.writeText(clean);
        setCopiedPhone(true);
        setTimeout(() => setCopiedPhone(false), 2000);
    };

    const handleRetryFailedMessage = async (messageId?: string, isAuto = false) => {
        if (!activeChat) return;
        setIsRetrying(true);
        setRetrySuccessMsg(null);
        try {
            const res = await fetch('/api/whatsapp/auto-retry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversationId: activeChat.id,
                    messageId: messageId,
                    force: true
                })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                playOutgoingSound();
                setRetrySuccessMsg('✅ ¡Envío reportado correcto por Meta WhatsApp! Mensaje entregado con éxito.');
                setTimeout(() => setRetrySuccessMsg(null), 5000);
                await fetchConversations();
            } else {
                if (!isAuto) {
                    alert(`⚠️ Error al reintentar: ${data.error || data.data?.errorMessage || 'No se pudo reenviar el mensaje.'}`);
                }
                await fetchConversations();
            }
        } catch (e: any) {
            if (!isAuto) {
                alert(`⚠️ Error de red al reintentar: ${e.message}`);
            }
        } finally {
            setIsRetrying(false);
        }
    };

    // ═══════════════════════════════════════════════════════════
    // MOTOR DE REINTENTO INTELIGENTE EN VIVO (CLIENT-SIDE DAEMON)
    // ═══════════════════════════════════════════════════════════
    useEffect(() => {
        if (!activeChat || !activeChat.hasFailedMessage) {
            return;
        }

        const failedMsg: any = activeChat.failedMessage;
        const meta = failedMsg?.retryMeta;
        
        if (meta && typeof meta.remainingSec === 'number' && meta.remainingSec > 0) {
            setAutoRetryCountdown(meta.remainingSec);
        } else {
            setAutoRetryCountdown(15);
        }

        const timer = setInterval(() => {
            setAutoRetryCountdown(prev => {
                if (prev <= 1) {
                    if (!isRetryingRef.current) {
                        console.log('[AUTO_RETRY_TICKER] Temporizador cumplido. Reintentando mensaje fallido en Meta...');
                        handleRetryFailedMessage(failedMsg?.id, true);
                    }
                    return 20; // reset mientras procesa
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [activeChatId, activeChat?.hasFailedMessage, activeChat?.failedMessage?.id]);

    // ═══════════════════════════════════════════════════════════
    // ESCÁNER GLOBAL DE FONDO: RESCATE INTELIGENTE DE TODOS LOS CHATS
    // ═══════════════════════════════════════════════════════════
    useEffect(() => {
        const globalRescueTimer = setInterval(async () => {
            const hasAnyFailed = chats.some(c => c.hasFailedMessage);
            if (!hasAnyFailed) return;

            try {
                const res = await fetch('/api/whatsapp/auto-retry', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ force: false })
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.succeeded > 0) {
                        playOutgoingSound();
                        fetchConversations();
                    }
                }
            } catch (_) {}
        }, 20000);

        return () => clearInterval(globalRescueTimer);
    }, [chats, playOutgoingSound, fetchConversations]);

    const handleResuscitateChat = async () => {
        if (!activeChat) return;
        setIsRetrying(true);
        setRetrySuccessMsg(null);
        try {
            const res = await fetch('/api/whatsapp/retry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversationId: activeChat.id,
                    action: 'resuscitate_chat'
                })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                playOutgoingSound();
                setRetrySuccessMsg('🤖 ¡Chat resucitado! La IA ha generado y enviado una respuesta inteligente al cliente.');
                setTimeout(() => setRetrySuccessMsg(null), 4000);
                await fetchConversations();
            } else {
                alert(`⚠️ Error al resucitar chat: ${data.error || 'No se pudo generar respuesta.'}`);
            }
        } catch (e: any) {
            alert(`⚠️ Error de red: ${e.message}`);
        } finally {
            setIsRetrying(false);
        }
    };

    const handleSendTemplateWindow = async (templateName: string = 'hello_world') => {
        if (!activeChat) return;
        if (!confirm(`¿Deseas enviar la plantilla oficial de Meta "${templateName}" para reabrir la ventana de conversación de 24 horas?`)) return;
        setIsRetrying(true);
        try {
            const res = await fetch('/api/whatsapp/retry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversationId: activeChat.id,
                    action: 'send_template',
                    templateName
                })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                playOutgoingSound();
                alert(`✅ Plantilla enviada con éxito. La ventana de 24h está activa nuevamente.`);
                await fetchConversations();
            } else {
                alert(`⚠️ Error al enviar plantilla: ${data.error || 'Verifica la plantilla en Meta Business Manager.'}`);
            }
        } catch (e: any) {
            alert(`⚠️ Error: ${e.message}`);
        } finally {
            setIsRetrying(false);
        }
    };

    // Current user identification for "MIS LEADS"
    const currentUserId = (session?.user as any)?.id || ''
    const currentUserName = session?.user?.name || ''

    const isMyLead = (chat: Chat) => {
        // Chat directly assigned to me
        if (chat.ownerId && chat.ownerId === currentUserId) return true
        if (chat.ownerName && currentUserName && chat.ownerName.trim().toLowerCase() === currentUserName.trim().toLowerCase()) return true
        // Or if I have replied in this chat (contains outbound message sent by me)
        const hasMyReply = chat.messages.some(m => m.sender === 'me')
        if (hasMyReply) return true
        return false
    }

    const isAutoRegister = (chat: Chat) => {
        if (chat.status === 'AUTO_REGISTER' || chat.status === 'REGISTRO_AUTOMATICO') return true
        const textDump = chat.messages.map(m => (m.text || '').toLowerCase()).join(' ')
        return (
            textDump.includes('código de verificación') ||
            textDump.includes('codigo de verificacion') ||
            textDump.includes('código de trabajador') ||
            textDump.includes('codigo de trabajador') ||
            textDump.includes('quiero registrarme') ||
            textDump.includes('ayúdame a generar') ||
            textDump.includes('ayudame a generar') ||
            textDump.includes('prop-2026-') ||
            textDump.includes('propuesta comercial generada con éxito') ||
            textDump.includes('propuesta comercial') ||
            chat.messages.some(m => m.status === 'BOT_ATOMIC_BRAIN')
        )
    }

    const isFailedChat = (chat: Chat) => {
        return Boolean(chat.hasFailedMessage) || chat.messages.some(m => m.status === 'FAILED')
    }

    const autoRegisterCount = chats.filter(c => isAutoRegister(c)).length
    const failedCount = chats.filter(c => isFailedChat(c)).length
    const pautasCount = chats.filter(c => c.isFromAd && !isAutoRegister(c)).length
    const myLeadsCount = chats.filter(c => isMyLead(c) && !isAutoRegister(c)).length
    const allWhatsAppCount = chats.filter(c => !isAutoRegister(c)).length

    const filteredChats = chats.filter(c => {
        // Tab filter
        if (activeCrmTab === 'AUTO_REGISTER') {
            if (!isAutoRegister(c)) return false
        } else if (activeCrmTab === 'MY_LEADS') {
            if (!isMyLead(c) || isAutoRegister(c)) return false
        } else if (activeCrmTab === 'PAUTAS') {
            if (!c.isFromAd || isAutoRegister(c)) return false
        } else if (activeCrmTab === 'FAILED') {
            if (!isFailedChat(c)) return false
        } else if (activeCrmTab === 'ALL_WHATSAPP') {
            if (isAutoRegister(c)) return false
        }

        // Search query filter
        const q = searchQuery.toLowerCase().trim()
        if (!q) return true
        return (
            c.name.toLowerCase().includes(q) || 
            c.phone.includes(q) ||
            (c.ownerName && c.ownerName.toLowerCase().includes(q)) ||
            (c.adHeadline && c.adHeadline.toLowerCase().includes(q)) ||
            c.messages.some(m => m.text && m.text.toLowerCase().includes(q))
        )
    });

    return (
        <div className="w-full h-[calc(100vh-4rem)] bg-[#0b141a] text-white flex flex-col font-sans">
            
            {/* Header Superior del CRM */}
            <div className="px-4 md:px-6 py-2.5 border-b border-[#202c33] bg-[#202c33] flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#00a884]" />
                    <div>
                        <h1 className="text-base md:text-lg font-black text-white flex items-center gap-2 tracking-tight">
                            WhatsApp CRM <span className="text-[10px] font-mono font-bold bg-[#00a884]/20 text-[#00a884] border border-[#00a884]/40 px-2 py-0.5 rounded-full">EN VIVO</span>
                        </h1>
                        <p className="text-[11px] text-slate-400 hidden sm:block">Atribución de pautas Facebook/Instagram Ads y mensajería en tiempo real</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                    {/* Bot Agente Karen: Jefa de Mensajería & Auditoría */}
                    <button
                        onClick={() => { setKarenModalOpen(true); fetchKarenAudit(); }}
                        className="py-1 px-3 rounded-xl bg-[#111b21] hover:bg-[#2a3942] border border-cyan-800 text-white transition-colors text-xs flex items-center gap-2 cursor-pointer"
                        title="Abrir Auditoría & Control de Karen (Jefa de Mensajería)"
                    >
                        <div className="relative">
                            <img 
                                src={`/api/karen-avatar?t=${avatarKey}`} 
                                alt="Karen" 
                                className="w-7 h-7 rounded-full object-cover border border-cyan-400" 
                            />
                            <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#111b21] ${
                                karenAuditData?.karen?.mode === 'MANUAL' ? 'bg-rose-500' :
                                karenAuditData?.karen?.mode === 'AWAITING_APPROVAL' ? 'bg-amber-400' : 'bg-emerald-400'
                            }`} />
                        </div>
                        <div className="text-left hidden sm:block">
                            <span className="font-bold text-xs text-cyan-300 block leading-tight">Karen</span>
                            <span className="text-[9px] font-mono text-slate-400 block -mt-0.5">Jefa Mensajería</span>
                        </div>
                    </button>

                    <button
                        onClick={() => setIsSettingsModalOpen(true)}
                        className="px-3 py-1.5 rounded-xl bg-[#111b21] hover:bg-[#2a3942] border border-[#2a3942] text-cyan-300 transition-colors text-xs flex items-center gap-1.5 font-bold cursor-pointer"
                    >
                        <Settings size={14} /> <span>Ajustes & Token</span>
                    </button>

                    <button
                        onClick={fetchConversations}
                        className="p-2 rounded-xl bg-[#111b21] border border-[#2a3942] hover:border-[#00a884] text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1 font-mono cursor-pointer"
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> <span className="hidden sm:inline">Actualizar</span>
                    </button>

                    {activeChat && (
                        <a
                            href={`https://wa.me/${activeChat.phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#00a884] hover:bg-[#00a884]/90 text-black font-black text-xs px-3.5 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                            <ExternalLink size={14} /> <span className="hidden md:inline">WhatsApp Web</span>
                        </a>
                    )}
                </div>
            </div>

            {/* Main Chat Interface */}
            <div className="flex-1 flex overflow-hidden relative">
                
                {/* Left Sidebar: Chat List */}
                <div className={`w-full md:w-80 lg:w-96 border-r border-[#202c33] bg-[#111b21] flex flex-col shrink-0 ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
                    
                    {/* CRM View Tabs: Selector de Filtros en Píldoras Limpias */}
                    <div className="p-2 bg-[#111b21] border-b border-[#202c33]">
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                            {/* MIS CONTACTOS */}
                            <button
                                type="button"
                                onClick={() => setActiveCrmTab('MY_LEADS')}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
                                    activeCrmTab === 'MY_LEADS'
                                        ? 'bg-[#00a884] text-black font-black'
                                        : 'bg-[#202c33] text-slate-300 hover:text-white hover:bg-[#2a3942]'
                                }`}
                                title="Mis Contactos y asignados"
                            >
                                <UserCheck size={13} />
                                <span>Mis Chats</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                                    activeCrmTab === 'MY_LEADS' ? 'bg-black/20 text-black' : 'bg-[#111b21] text-slate-400'
                                }`}>
                                    {myLeadsCount}
                                </span>
                            </button>

                            {/* ENTRANTES */}
                            <button
                                type="button"
                                onClick={() => setActiveCrmTab('ALL_WHATSAPP')}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
                                    activeCrmTab === 'ALL_WHATSAPP'
                                        ? 'bg-[#00a884] text-black font-black'
                                        : 'bg-[#202c33] text-slate-300 hover:text-white hover:bg-[#2a3942]'
                                }`}
                                title="Todos los chats entrantes"
                            >
                                <MessageSquare size={13} />
                                <span>Entrantes</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                                    activeCrmTab === 'ALL_WHATSAPP' ? 'bg-black/20 text-black' : 'bg-[#111b21] text-slate-400'
                                }`}>
                                    {allWhatsAppCount}
                                </span>
                            </button>

                            {/* PAUTAS */}
                            <button
                                type="button"
                                onClick={() => setActiveCrmTab('PAUTAS')}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
                                    activeCrmTab === 'PAUTAS'
                                        ? 'bg-blue-600 text-white font-black'
                                        : 'bg-[#202c33] text-blue-300 hover:text-white hover:bg-[#2a3942]'
                                }`}
                                title="Leads de Pautas Publicitarias Meta"
                            >
                                <Megaphone size={13} />
                                <span>Pautas</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                                    activeCrmTab === 'PAUTAS' ? 'bg-black/20 text-white' : 'bg-[#111b21] text-blue-300'
                                }`}>
                                    {pautasCount}
                                </span>
                            </button>

                            {/* FALLOS */}
                            <button
                                type="button"
                                onClick={() => setActiveCrmTab('FAILED')}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
                                    activeCrmTab === 'FAILED'
                                        ? 'bg-rose-600 text-white font-black'
                                        : failedCount > 0
                                        ? 'bg-rose-950 text-rose-300 border border-rose-600/50'
                                        : 'bg-[#202c33] text-slate-400 hover:text-white hover:bg-[#2a3942]'
                                }`}
                                title="Chats con mensajes fallidos que necesitan reintento o rescate"
                            >
                                <AlertCircle size={13} />
                                <span>Fallos</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                                    activeCrmTab === 'FAILED' ? 'bg-black/20 text-white' : failedCount > 0 ? 'bg-rose-600 text-white' : 'bg-[#111b21] text-slate-400'
                                }`}>
                                    {failedCount}
                                </span>
                            </button>

                            {/* EMPLEO */}
                            <button
                                type="button"
                                onClick={() => setActiveCrmTab('AUTO_REGISTER')}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
                                    activeCrmTab === 'AUTO_REGISTER'
                                        ? 'bg-[#00a884] text-black font-black'
                                        : 'bg-[#202c33] text-amber-300 hover:text-white hover:bg-[#2a3942]'
                                }`}
                                title="Postulantes a Empleo y Registros"
                            >
                                <Sparkles size={13} />
                                <span>Empleo</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                                    activeCrmTab === 'AUTO_REGISTER' ? 'bg-black/20 text-black' : 'bg-[#111b21] text-amber-400'
                                }`}>
                                    {autoRegisterCount}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="p-3 border-b border-[#202c33] bg-[#111b21]">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={
                                    activeCrmTab === 'MY_LEADS' ? "Buscar en Mis Contactos..." :
                                    activeCrmTab === 'PAUTAS' ? "Buscar en Pautas publicitarias..." :
                                    activeCrmTab === 'FAILED' ? "Buscar en chats con fallo..." :
                                    activeCrmTab === 'AUTO_REGISTER' ? "Buscar en Empleo..." :
                                    "Buscar en Entrantes..."
                                }
                                className="w-full bg-[#202c33] border border-[#2a3942] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#00a884] transition-colors"
                            />
                        </div>
                    </div>

                    {/* Chat List Items (Bordes Limpios, Sin Divide-Y Doble) */}
                    <div className="flex-1 overflow-y-auto bg-[#111b21]">
                        {loading && chats.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-xs font-mono">Cargando conversaciones...</div>
                        ) : filteredChats.length === 0 ? (
                            <div className="p-8 text-center space-y-2">
                                <div className="w-10 h-10 rounded-2xl bg-[#202c33] border border-slate-700/80 flex items-center justify-center mx-auto text-slate-400">
                                    {activeCrmTab === 'MY_LEADS' ? <UserCheck size={20} /> : <MessageSquare size={20} />}
                                </div>
                                <p className="text-xs text-slate-300 font-bold">
                                    {activeCrmTab === 'MY_LEADS' ? 'No tienes contactos asignados o respondidos aún' : 'No hay conversaciones registradas'}
                                </p>
                                {activeCrmTab === 'MY_LEADS' && (
                                    <p className="text-[10px] text-slate-400 max-w-[200px] mx-auto">
                                        Ve a la pestaña <strong>ENTRANTES</strong> para responder o asignarte una conversación.
                                    </p>
                                )}
                            </div>
                        ) : (
                            filteredChats.map(chat => (
                                <button
                                    key={chat.id}
                                    onClick={() => handleSelectChat(chat)}
                                    className={`w-full px-3.5 py-3 text-left transition-colors flex items-start gap-3 cursor-pointer border-b border-[#202c33] ${
                                        activeChatId === chat.id 
                                            ? 'bg-[#2a3942]' 
                                            : chat.hasFailedMessage
                                            ? 'bg-rose-950/25 hover:bg-rose-950/40'
                                            : 'hover:bg-[#202c33]'
                                    }`}
                                >
                                    {/* Avatar */}
                                    <div className="relative shrink-0">
                                        <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm border ${
                                            chat.hasFailedMessage
                                                ? 'bg-rose-900 border-rose-500 text-rose-200'
                                                : chat.isFromAd
                                                ? 'bg-blue-900 border-blue-500 text-blue-200'
                                                : 'bg-[#202c33] border-[#2a3942] text-slate-200'
                                        }`}>
                                            {chat.name.charAt(0).toUpperCase()}
                                        </div>
                                        {chat.hasFailedMessage ? (
                                            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-600 border border-[#111b21] flex items-center justify-center text-[9px]" title="Fallo de Envío">
                                                ⚠️
                                            </span>
                                        ) : chat.isFromAd ? (
                                            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue-600 border border-[#111b21] flex items-center justify-center text-[8px]" title="Lead de Pauta">
                                                📢
                                            </span>
                                        ) : null}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <h3 className="font-bold text-sm text-white truncate">
                                                {chat.name}
                                            </h3>
                                            <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-1">{chat.time}</span>
                                        </div>

                                        {/* Número de Teléfono Destacado y Claro */}
                                        <p className="text-xs font-mono font-bold text-emerald-400 truncate mb-1">
                                            {formatPhoneNumber(chat.phone)}
                                        </p>

                                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                            {chat.hasFailedMessage && (
                                                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-600/50 flex items-center gap-0.5 shrink-0" title="Motor de Reintento Inteligente en proceso">
                                                    🔄 Auto-reintentando
                                                </span>
                                            )}
                                            {chat.isFromAd && (
                                                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-700/50 truncate max-w-[140px]">
                                                    📢 {chat.adHeadline || 'Pauta Meta'}
                                                </span>
                                            )}
                                            {chat.ownerName ? (
                                                <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/50 flex items-center gap-0.5 truncate max-w-[120px]">
                                                    <UserCheck size={9} className="shrink-0" /> {chat.ownerName}
                                                </span>
                                            ) : (
                                                <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800/50 flex items-center gap-0.5 shrink-0">
                                                    ⚡ Sin Asignar
                                                </span>
                                            )}

                                            {canAssignLeads && (
                                                <span
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setChatToAssign(chat);
                                                        setAdvisorInput(chat.ownerName || "");
                                                        setAssignModalOpen(true);
                                                    }}
                                                    className="ml-auto text-[9px] font-bold text-slate-400 hover:text-cyan-300 hover:bg-[#202c33] px-1.5 py-0.5 rounded transition-colors"
                                                    title="Asignar o reasignar asesor a este lead"
                                                >
                                                    ⚙️ Asignar
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-[11px] text-slate-400 truncate">{chat.lastMessage}</p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Main Chat Area */}
                <div className={`flex-1 flex flex-col bg-[#0b141a] ${!activeChatId ? 'hidden md:flex' : 'flex'}`}>
                    
                    {activeChat ? (
                        <>
                            {/* Chat Header (MODERNO, NOMBRE Y TELÉFONO DESTACADOS) */}
                            <div className="px-4 py-3 md:px-6 md:py-3.5 border-b border-[#2a3942] bg-[#202c33] flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3.5 min-w-0">
                                    <button 
                                        onClick={() => setActiveChatId('')} 
                                        className="md:hidden p-2 rounded-xl bg-[#111b21] text-slate-300 hover:text-white cursor-pointer border border-[#2a3942]"
                                        title="Volver a chats"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    
                                    {/* Avatar */}
                                    <div className="relative shrink-0">
                                        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-black text-lg md:text-xl border-2 ${
                                            activeChat.hasFailedMessage 
                                                ? 'bg-[#3b1219] border-rose-500 text-rose-300' 
                                                : activeChat.isFromAd
                                                ? 'bg-[#0f2744] border-cyan-500 text-cyan-300'
                                                : 'bg-[#123b2b] border-[#00a884] text-[#25d366]'
                                        }`}>
                                            {activeChat.name.charAt(0).toUpperCase()}
                                        </div>
                                        {activeChat.hasFailedMessage ? (
                                            <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-rose-600 border-2 border-[#202c33] flex items-center justify-center text-[10px]" title="Fallo de Envío">
                                                ⚠️
                                            </span>
                                        ) : activeChat.isFromAd ? (
                                            <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-cyan-600 border-2 border-[#202c33] flex items-center justify-center text-[10px]" title="Lead de Pauta">
                                                📢
                                            </span>
                                        ) : null}
                                    </div>

                                    {/* Nombre & Teléfono en Formato Grande */}
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2.5 flex-wrap">
                                            <h2 className="text-lg md:text-2xl font-black text-white tracking-tight truncate">
                                                {activeChat.name}
                                            </h2>
                                            {activeChat.hasFailedMessage && (
                                                <span className="bg-[#3b1219] text-rose-300 border border-rose-500/60 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                                    <AlertCircle size={11} className="text-rose-400" /> FALLO EN ENVÍO
                                                </span>
                                            )}
                                            {activeChat.isFromAd && (
                                                <span className="bg-[#0f2744] text-cyan-300 border border-cyan-500/60 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                                    <Megaphone size={11} className="text-cyan-400" /> LEAD DE PAUTA
                                                </span>
                                            )}
                                        </div>

                                        {/* Teléfono Grande en Pill Verde con Copiar & Llamar */}
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                            <div className="inline-flex items-center gap-2 bg-[#111b21] border border-[#00a884]/60 px-3 py-1 rounded-xl">
                                                <Phone size={14} className="text-[#00a884]" />
                                                <span className="text-sm md:text-base font-mono font-black text-[#25d366] tracking-wider">
                                                    {formatPhoneNumber(activeChat.phone)}
                                                </span>
                                                <button
                                                    onClick={() => handleCopyPhone(activeChat.phone)}
                                                    className="p-1 rounded-md hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                                                    title="Copiar número telefónico"
                                                >
                                                    {copiedPhone ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                                </button>
                                                <a
                                                    href={`tel:${activeChat.phone.replace(/\D/g, '')}`}
                                                    className="p-1 rounded-md hover:bg-white/10 text-slate-300 hover:text-white transition-colors hidden sm:inline-block cursor-pointer text-xs"
                                                    title="Llamar teléfono"
                                                >
                                                    📞
                                                </a>
                                            </div>

                                            {/* Estado de Asignación */}
                                            {activeChat.ownerName ? (
                                                <div className="flex items-center gap-1.5">
                                                    <span className="bg-[#111b21] text-cyan-300 border border-cyan-500/40 text-xs font-bold px-2.5 py-1 rounded-xl flex items-center gap-1">
                                                        <UserCheck size={12} /> {activeChat.ownerName}
                                                    </span>
                                                    {canAssignLeads && (
                                                        <button
                                                            onClick={() => {
                                                                setChatToAssign(activeChat);
                                                                setAdvisorInput(activeChat.ownerName || "");
                                                                setAssignModalOpen(true);
                                                            }}
                                                            className="text-[11px] text-cyan-400 hover:text-white bg-[#111b21] hover:bg-[#2a3942] border border-cyan-500/40 px-2 py-1 rounded-lg transition-colors cursor-pointer font-bold flex items-center gap-1"
                                                            title="Reasignar asesor"
                                                        >
                                                            <Users size={12} /> Reasignar
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setChatToAssign(activeChat);
                                                        setAdvisorInput(session?.user?.name || "");
                                                        setAssignModalOpen(true);
                                                    }}
                                                    className="bg-[#2a2114] text-amber-300 border border-amber-500/50 text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1 hover:bg-[#3d301c] cursor-pointer"
                                                >
                                                    <UserPlus size={12} /> ⚡ Sin Asignar - Atender
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Acciones del Header: Reintento Rápido y WhatsApp Web */}
                                <div className="flex items-center gap-2">
                                    {activeChat.hasFailedMessage && (
                                        <button
                                            onClick={() => handleRetryFailedMessage(activeChat.failedMessage?.id, false)}
                                            disabled={isRetrying}
                                            className="bg-amber-600 hover:bg-amber-500 text-black font-black text-xs px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                                            title="Motor de reintento inteligente activo"
                                        >
                                            {isRetrying ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
                                            <span>{isRetrying ? 'Reintentando...' : `Auto-reintento en ${autoRetryCountdown}s`}</span>
                                        </button>
                                    )}

                                    <a
                                        href={`https://wa.me/${activeChat.phone.replace(/\D/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-[#00a884] hover:bg-[#02906f] text-white font-black text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <ExternalLink size={14} /> <span className="hidden sm:inline">WhatsApp Web</span>
                                    </a>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div ref={messagesContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4 scroll-smooth bg-[#0b141a]">
                                
                                {/* ⚠️ BANNER DE ALERTA DE FALLO EN EL ENVÍO & MOTOR DE REINTENTO INTELIGENTE */}
                                {activeChat.hasFailedMessage && (
                                    <div className="p-4 bg-[#1f1610] border border-amber-500/60 rounded-xl space-y-3 text-white">
                                        <div className="flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                                                    <RefreshCw size={20} className={isRetrying ? "animate-spin text-amber-300" : "text-amber-400"} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h3 className="text-sm md:text-base font-black text-amber-200 uppercase tracking-wide">
                                                            🤖 Motor de Reintento Inteligente Activo
                                                        </h3>
                                                        <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                            {isRetrying ? (
                                                                <>⚡ Conectando con Meta...</>
                                                            ) : (
                                                                <>⏱️ Auto-reintento en {autoRetryCountdown}s</>
                                                            )}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                                                        Meta rechazó o demoró la entrega. El sistema reintentará automáticamente con pausas inteligentes hasta reportar el envío correcto.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {activeChat.failedMessage?.errorMessage && (
                                            <div className="p-2.5 bg-[#111b21] border border-amber-500/40 rounded-xl text-xs font-mono text-amber-300 flex items-start justify-between gap-2">
                                                <div>
                                                    <strong className="text-amber-200">Motivo reportado:</strong> {activeChat.failedMessage.errorMessage}
                                                </div>
                                                <span className="text-[10px] text-slate-400 shrink-0">Bucle Inteligente ON</span>
                                            </div>
                                        )}

                                        <div className="flex flex-wrap items-center gap-2 pt-1">
                                            <button
                                                onClick={() => handleRetryFailedMessage(activeChat.failedMessage?.id, false)}
                                                disabled={isRetrying}
                                                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition-all flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                                                title="Forzar reintento inmediato sin esperar el temporizador"
                                            >
                                                {isRetrying ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                                                <span>⚡ Reintentar Envío Ahora</span>
                                            </button>

                                            <button
                                                onClick={handleResuscitateChat}
                                                disabled={isRetrying}
                                                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs transition-all flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                                            >
                                                {isRetrying ? <Loader2 size={14} className="animate-spin" /> : <Bot size={14} />}
                                                <span>🤖 Resucitar Chat con IA</span>
                                            </button>

                                            <button
                                                onClick={() => handleSendTemplateWindow('hello_world')}
                                                disabled={isRetrying}
                                                className="px-3.5 py-2 rounded-xl bg-[#202c33] hover:bg-[#2a3942] text-slate-200 font-bold text-xs transition-all flex items-center gap-1.5 border border-[#2a3942] cursor-pointer"
                                                title="Si la ventana de 24 horas de Meta expiró, envía una plantilla oficial para reabrirla"
                                            >
                                                <span>📲 Reabrir Ventana 24h</span>
                                            </button>
                                        </div>

                                        {retrySuccessMsg && (
                                            <div className="p-2.5 rounded-xl bg-[#0f291e] border border-emerald-500/60 text-xs font-bold text-emerald-300 shadow">
                                                {retrySuccessMsg}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {/* 📢 BANNER DESTACADO DE PAUTA PUBLICITARIA SI EL LEAD PROVIENE DE ANUNCIO */}
                                {activeChat.isFromAd && (
                                    <div className="p-3.5 bg-[#0e1d2c] border border-cyan-500/50 rounded-xl space-y-2 text-white">
                                        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                                                    <Megaphone size={14} />
                                                </div>
                                                <span className="text-[11px] font-black text-cyan-300 uppercase tracking-wider">
                                                    LEAD ORIGINADO DE PAUTA FACEBOOK / INSTAGRAM ADS
                                                </span>
                                            </div>
                                            <span className="text-[9px] font-mono bg-cyan-600/30 text-cyan-200 border border-cyan-400/40 px-2 py-0.5 rounded-full font-bold">
                                                Atribución Meta
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3 text-xs">
                                            <p className="font-bold text-white text-xs">
                                                {activeChat.adHeadline ? `Campaña: "${activeChat.adHeadline}"` : 'Campaña Click-to-WhatsApp en vivo'}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {activeChat.messages.length === 0 ? (
                                    <div className="text-center text-slate-500 text-xs py-10">No hay mensajes en este chat.</div>
                                ) : (
                                    activeChat.messages.map(msg => (
                                        <div 
                                            key={msg.id}
                                            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs space-y-2.5 ${
                                                msg.sender === 'me'
                                                    ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none shadow-md'
                                                    : 'bg-[#202c33] text-[#e9edef] border border-[#2a3942] rounded-tl-none shadow-md'
                                            }`}>
                                                
                                                {/* 📢 PREVIEW CARD: ATRIBUCIÓN DE ANUNCIO FACEBOOK ADS (CLICK TO WHATSAPP) */}
                                                {msg.referral && (
                                                    <div className="p-3 bg-[#0a1829] border border-cyan-500/50 rounded-xl space-y-2 text-white shadow-sm">
                                                        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-1.5">
                                                            <span className="flex items-center gap-1.5 text-[10px] font-black tracking-wider text-cyan-300 uppercase">
                                                                <Megaphone size={12} className="text-cyan-400" /> ANUNCIO DE ORIGEN · {msg.referral.sourceType === 'ad' ? 'FACEBOOK ADS' : 'POST META'}
                                                            </span>
                                                            {msg.referral.sourceId && (
                                                                <span className="text-[9px] font-mono text-cyan-300/80">
                                                                    ID: {msg.referral.sourceId}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="flex gap-2.5 items-start">
                                                            {(msg.referral.thumbnailUrl || msg.referral.imageUrl) ? (
                                                                <img 
                                                                    src={msg.referral.thumbnailUrl || msg.referral.imageUrl} 
                                                                    alt="Miniatura del Anuncio" 
                                                                    referrerPolicy="no-referrer"
                                                                    onError={(e) => {
                                                                        (e.target as HTMLElement).style.display = 'none';
                                                                    }}
                                                                    className="w-16 h-16 rounded-lg object-cover border border-blue-400/40 shrink-0 bg-slate-900 shadow"
                                                                />
                                                            ) : (
                                                                <div className="w-12 h-12 rounded-lg bg-blue-900/50 border border-blue-400/30 flex items-center justify-center shrink-0 text-cyan-300">
                                                                    <Megaphone size={18} />
                                                                </div>
                                                            )}
                                                            <div className="min-w-0 flex-1">
                                                                <h4 className="font-black text-xs text-white leading-snug">
                                                                    {msg.referral.headline || 'Campaña Publicitaria de Meta'}
                                                                </h4>
                                                                {msg.referral.body ? (
                                                                    <p className="text-[10px] text-slate-300 line-clamp-2 mt-0.5">
                                                                        {msg.referral.body}
                                                                    </p>
                                                                ) : (
                                                                    <p className="text-[10px] text-blue-300/80 italic mt-0.5">
                                                                        Lead captado vía Click-to-WhatsApp
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {msg.referral.sourceUrl && (
                                                            <a 
                                                                href={msg.referral.sourceUrl} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-300 hover:text-cyan-100 hover:underline pt-1"
                                                            >
                                                                <span>🔗 Ver Anuncio en Facebook</span> <ExternalLink size={10} />
                                                            </a>
                                                        )}
                                                    </div>
                                                )}

                                                {/* 📷 IMAGEN ADJUNTA */}
                                                {msg.type === 'image' && msg.mediaUrl && (
                                                    <div className="space-y-1.5">
                                                        <div 
                                                            onClick={() => setPreviewImageUrl(msg.mediaUrl || null)}
                                                            className="relative rounded-xl overflow-hidden cursor-pointer group bg-black/40 border border-white/10"
                                                        >
                                                            <img 
                                                                src={msg.mediaUrl} 
                                                                alt="Imagen enviada por cliente" 
                                                                className="max-h-72 w-full object-contain group-hover:scale-102 transition-transform duration-300"
                                                                loading="lazy"
                                                            />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                                <span className="bg-black/70 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                                                                    <Eye size={12} /> Ver en grande
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* 🎤 AUDIO / NOTA DE VOZ */}
                                                {msg.type === 'audio' && msg.mediaUrl && (
                                                    <div className="p-3 bg-black/50 border border-white/10 rounded-xl space-y-2">
                                                        <div className="flex items-center justify-between text-[10px] font-bold text-emerald-400">
                                                            <div className="flex items-center gap-1.5">
                                                                <Mic size={14} />
                                                                <span>Nota de Voz de WhatsApp</span>
                                                            </div>
                                                            <a 
                                                                href={msg.mediaUrl} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="text-slate-400 hover:text-emerald-400 transition-colors p-1 rounded hover:bg-white/5 flex items-center gap-1"
                                                                title="Descargar audio"
                                                            >
                                                                <Download size={12} />
                                                            </a>
                                                        </div>
                                                        <audio 
                                                            controls 
                                                            className="w-full h-9 rounded-lg accent-emerald-500"
                                                            preload="metadata"
                                                        >
                                                            <source src={msg.mediaUrl} type="audio/ogg; codecs=opus" />
                                                            <source src={msg.mediaUrl} type="audio/aac" />
                                                            <source src={msg.mediaUrl} type="audio/mpeg" />
                                                            Tu navegador no soporta reproducción directa de audio.
                                                        </audio>
                                                    </div>
                                                )}

                                                {/* 🎬 VIDEO INTERACTIVO CON REPRODUCTOR Y LIGHTBOX */}
                                                {msg.type === 'video' && msg.mediaUrl && (
                                                    <div className="space-y-2">
                                                        {failedMedia[msg.id] ? (
                                                            <div className="p-3 bg-amber-950/80 border border-amber-500/50 rounded-xl space-y-2 text-amber-200">
                                                                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                                                                    <AlertCircle size={15} />
                                                                    <span>Video no disponible · Token no configurado o expirado</span>
                                                                </div>
                                                                <p className="text-[10px] text-slate-300 leading-relaxed">
                                                                    Meta requiere un <strong>Token Permanente</strong> activo para descargar videos entrantes.
                                                                </p>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setActiveSettingsTab('credentials');
                                                                        setIsSettingsModalOpen(true);
                                                                    }}
                                                                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-black text-[10px] uppercase rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow"
                                                                >
                                                                    <Key size={12} /> Configurar Token Permanente
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className="relative rounded-xl overflow-hidden border border-white/15 bg-black group">
                                                                    <video 
                                                                        controls 
                                                                        playsInline
                                                                        preload="metadata"
                                                                        src={msg.mediaUrl} 
                                                                        onError={() => setFailedMedia(prev => ({ ...prev, [msg.id]: true }))}
                                                                        className="max-h-72 w-full object-contain bg-black"
                                                                    />
                                                                </div>
                                                                <div className="flex items-center gap-2 pt-1">
                                                                    <button 
                                                                        type="button"
                                                                        onClick={() => setPreviewVideoUrl(msg.mediaUrl || null)}
                                                                        className="flex-1 py-1.5 px-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px] rounded-lg flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer"
                                                                    >
                                                                        <Film size={13} /> <span>Pantalla Completa</span>
                                                                    </button>
                                                                    <a 
                                                                        href={msg.mediaUrl} 
                                                                        target="_blank" 
                                                                        rel="noopener noreferrer"
                                                                        className="py-1.5 px-3 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-[11px] rounded-lg flex items-center justify-center gap-1 transition-all shadow cursor-pointer"
                                                                        title="Descargar video original"
                                                                    >
                                                                        <Download size={13} />
                                                                    </a>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                )}

                                                {/* 📄 DOCUMENTO */}
                                                {msg.type === 'document' && msg.mediaUrl && (
                                                    <a 
                                                        href={msg.mediaUrl} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="p-3 bg-black/40 hover:bg-black/60 border border-white/15 rounded-xl flex items-center justify-between gap-3 transition-colors text-white"
                                                    >
                                                        <div className="flex items-center gap-2.5 min-w-0">
                                                            <FileText size={20} className="text-cyan-400 shrink-0" />
                                                            <div className="min-w-0">
                                                                <span className="font-bold text-xs truncate block">{msg.text || 'Documento adjunto'}</span>
                                                                <span className="text-[10px] text-slate-400">Clic para descargar / abrir</span>
                                                            </div>
                                                        </div>
                                                        <Download size={16} className="text-slate-400 shrink-0" />
                                                    </a>
                                                )}

                                                {/* TEXTO DEL MENSAJE (O CAPTION O FALLBACK) */}
                                                {msg.text && msg.type !== 'document' ? (
                                                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                                ) : !msg.mediaUrl && !msg.referral ? (
                                                    <p className="leading-relaxed text-slate-300 italic">👋 Cliente inició conversación</p>
                                                ) : null}

                                                {/* ⚠️ ALERTA INLINE Y REINTENTO SI EL MENSAJE FALLÓ */}
                                                {msg.status === 'FAILED' && (
                                                    <div className="mt-2 p-2.5 bg-[#3b1219] border border-rose-500/60 rounded-xl flex items-center justify-between gap-2 text-rose-200 shadow-sm">
                                                        <div className="flex items-center gap-1.5 text-[11px] font-bold">
                                                            <AlertCircle size={14} className="text-rose-400 shrink-0" />
                                                            <span>
                                                                Fallo temporal · Auto-reintentando en {autoRetryCountdown}s
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={() => handleRetryFailedMessage(msg.id, false)}
                                                            disabled={isRetrying}
                                                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-black rounded-lg transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                                            title="Reintentar este mensaje ahora"
                                                        >
                                                            <RefreshCw size={11} className={isRetrying ? 'animate-spin' : ''} />
                                                            <span>Reintentar ya</span>
                                                        </button>
                                                    </div>
                                                )}

                                                {/* TIMESTAMP & STATUS */}
                                                <div className={`text-[9px] font-mono flex items-center justify-end gap-1.5 ${
                                                    msg.status === 'FAILED' ? 'text-rose-400 font-bold' : msg.sender === 'me' ? 'text-emerald-200' : 'text-slate-400'
                                                }`}>
                                                    <span>{msg.time}</span>
                                                    {msg.status === 'FAILED' ? (
                                                        <span className="flex items-center gap-0.5 text-rose-400 font-black text-[9px] bg-rose-950/80 px-1.5 py-0.2 rounded border border-rose-500/30">
                                                            <AlertCircle size={10} /> Falló
                                                        </span>
                                                    ) : msg.sender === 'me' ? (
                                                        <CheckCheck size={12} />
                                                    ) : null}
                                                </div>

                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Attachment Preview Chip */}
                            {pendingAttachment && (
                                <div className="px-4 py-2 bg-[#111b21] border-t border-[#2a3942] flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {pendingAttachment.mediaType === 'image' ? (
                                            <img src={pendingAttachment.url} alt="Adjunto" className="w-9 h-9 rounded-lg object-cover border border-[#00a884]/40" />
                                        ) : (
                                            <div className="w-9 h-9 rounded-lg bg-[#00a884]/10 border border-[#00a884]/30 flex items-center justify-center text-[#25d366]">
                                                <FileText size={18} />
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-xs font-bold text-white truncate max-w-[200px]">{pendingAttachment.filename}</p>
                                            <p className="text-[10px] text-[#25d366] font-semibold uppercase">{pendingAttachment.mediaType}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setPendingAttachment(null)}
                                        className="p-1.5 rounded-lg hover:bg-[#202c33] text-slate-400 hover:text-rose-400 transition-colors"
                                        title="Quitar archivo"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            )}

                            {/* Chat Input Bar */}
                            <div className="p-3 border-t border-[#2a3942] bg-[#202c33] flex items-center gap-2">
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleFileSelect} 
                                    className="hidden" 
                                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploadingAttachment}
                                    className="p-2.5 rounded-xl bg-[#2a3942] hover:bg-[#374248] text-slate-300 hover:text-white transition-all cursor-pointer disabled:opacity-50"
                                    title="Adjuntar imagen, audio o documento"
                                >
                                    {isUploadingAttachment ? <Loader2 size={16} className="animate-spin text-cyan-400" /> : <Paperclip size={16} />}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSendCatalogToClient}
                                    disabled={sendingCatalog}
                                    className="p-2.5 rounded-xl bg-[#2a3942] hover:bg-[#374248] text-slate-300 hover:text-[#00a884] transition-all cursor-pointer disabled:opacity-50 group"
                                    title="Enviar Catálogo Oficial de Productos a este cliente por WhatsApp"
                                >
                                    {sendingCatalog ? <Loader2 size={16} className="animate-spin text-cyan-400" /> : <ShoppingBag size={16} className="group-hover:scale-110 transition-transform" />}
                                </button>
                                <input
                                    type="text"
                                    value={inputText}
                                    onClick={() => {
                                        if (!activeChat.ownerName) {
                                            setChatToAssign(activeChat);
                                            setAdvisorInput(session?.user?.name || "");
                                            setAssignModalOpen(true);
                                        }
                                    }}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (!activeChat.ownerName) {
                                            e.preventDefault();
                                            setChatToAssign(activeChat);
                                            setAdvisorInput(session?.user?.name || "");
                                            setAssignModalOpen(true);
                                            return;
                                        }
                                        if (e.key === 'Enter') handleSendMessage();
                                    }}
                                    placeholder={
                                        !activeChat.ownerName 
                                            ? "⚠️ Clic para indicar asesor que atiende y escribir..." 
                                            : (pendingAttachment ? "Añadir un pie de foto / mensaje..." : "Escribe tu mensaje a través de WhatsApp API...")
                                    }
                                    className="flex-1 bg-[#2a3942] border border-transparent focus:border-[#00a884] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none"
                                />
                                <button
                                    onClick={() => {
                                        if (!activeChat.ownerName) {
                                            setChatToAssign(activeChat);
                                            setAdvisorInput(session?.user?.name || "");
                                            setAssignModalOpen(true);
                                            return;
                                        }
                                        handleSendMessage();
                                    }}
                                    disabled={(!inputText.trim() && !pendingAttachment) || isUploadingAttachment}
                                    className="p-2.5 rounded-xl bg-[#00a884] hover:bg-[#02906f] disabled:opacity-40 text-white transition-all shadow-md cursor-pointer"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs p-6 text-center">
                            <MessageSquare size={36} className="text-slate-700 mb-2 animate-bounce" />
                            <p className="font-bold text-slate-400">Selecciona una conversación para chatear</p>
                            <p className="text-[11px] text-slate-600 mt-1">Los mensajes enviados se despachan directamente por la API de Meta</p>
                        </div>
                    )}

                </div>

            </div>

            {/* ═════════════════════════════════════════════════════════════ */}
            {/* 🔍 MODAL: LIGHTBOX / ZOOM DE IMAGEN                           */}
            {/* ═════════════════════════════════════════════════════════════ */}
            {previewImageUrl && (
                <div 
                    onClick={() => setPreviewImageUrl(null)}
                    className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
                >
                    <div className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center">
                        <button
                            onClick={() => setPreviewImageUrl(null)}
                            className="absolute -top-10 right-0 text-white hover:text-rose-400 font-bold text-xs bg-slate-800/80 px-3 py-1.5 rounded-lg flex items-center gap-1"
                        >
                            <X size={16} /> Cerrar vista previa
                        </button>
                        <img 
                            src={previewImageUrl} 
                            alt="Vista previa en alta resolución" 
                            className="max-h-[85vh] w-auto object-contain rounded-xl border border-white/20 shadow-2xl"
                        />
                        <a 
                            href={previewImageUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="mt-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg"
                        >
                            <Download size={14} /> Descargar Imagen Original
                        </a>
                    </div>
                </div>
            )}

            {/* ═════════════════════════════════════════════════════════════ */}
            {/* 🎬 MODAL: LIGHTBOX / REPRODUCTOR DE VIDEO EN ALTA DEFINICIÓN  */}
            {/* ═════════════════════════════════════════════════════════════ */}
            {previewVideoUrl && (
                <div 
                    onClick={() => setPreviewVideoUrl(null)}
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
                >
                    <div 
                        onClick={(e) => e.stopPropagation()} 
                        className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center cursor-default"
                    >
                        <button
                            onClick={() => setPreviewVideoUrl(null)}
                            className="absolute -top-10 right-0 text-white hover:text-rose-400 font-bold text-xs bg-slate-800/90 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                            <X size={16} /> Cerrar reproductor
                        </button>
                        <video 
                            controls 
                            autoPlay 
                            playsInline
                            src={previewVideoUrl} 
                            className="max-h-[75vh] w-full object-contain rounded-2xl border border-cyan-500/30 shadow-2xl bg-black"
                        />
                        <div className="mt-3 flex items-center gap-3">
                            <a 
                                href={previewVideoUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg"
                            >
                                <Download size={14} /> Descargar Video MP4
                            </a>
                            <a 
                                href={previewVideoUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 border border-slate-700 shadow-lg"
                            >
                                <ExternalLink size={14} /> Abrir en nueva pestaña
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* ═════════════════════════════════════════════════════════════ */}
            {/* ⚙️ MODAL: AJUSTES, TOKEN & PERFIL DE WHATSAPP BUSINESS       */}
            {/* ═════════════════════════════════════════════════════════════ */}
            {isSettingsModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
                    <div 
                        onClick={() => {
                            setIsSettingsModalOpen(false);
                            setIsCredentialsUnlocked(false);
                            setCredentialsPinInput('');
                            setCredentialsPinError(false);
                            setSettingsMessage(null);
                        }} 
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <div className="relative z-10 w-full max-w-2xl bg-slate-900 text-white rounded-2xl p-5 md:p-6 shadow-2xl border border-slate-700 max-h-[90vh] overflow-y-auto space-y-4">
                        
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                    <Settings size={18} />
                                </div>
                                <div>
                                    <h3 className="font-black text-sm md:text-base text-white uppercase">Ajustes & Configuración WhatsApp Cloud API</h3>
                                    <p className="text-[10px] text-slate-400">Tokens de acceso, identificadores de Meta y perfil comercial</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setIsSettingsModalOpen(false);
                                    setIsCredentialsUnlocked(false);
                                    setCredentialsPinInput('');
                                    setCredentialsPinError(false);
                                    setSettingsMessage(null);
                                }}
                                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* TABS SELECTOR */}
                        <div className="flex border-b border-slate-800 gap-2">
                            <button
                                onClick={() => setActiveSettingsTab('profile')}
                                className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                                    activeSettingsTab === 'profile'
                                        ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 rounded-t-lg'
                                        : 'border-transparent text-slate-400 hover:text-white'
                                }`}
                            >
                                🏢 Perfil Comercial
                            </button>
                            <button
                                onClick={() => setActiveSettingsTab('credentials')}
                                className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                                    activeSettingsTab === 'credentials'
                                        ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 rounded-t-lg'
                                        : 'border-transparent text-slate-400 hover:text-white'
                                }`}
                            >
                                🔑 Token & Conexión Meta
                            </button>
                            <button
                                onClick={() => { setActiveSettingsTab('catalog'); fetchCatalogSettings(); }}
                                className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                                    activeSettingsTab === 'catalog'
                                        ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10 rounded-t-lg'
                                        : 'border-transparent text-slate-400 hover:text-white'
                                }`}
                            >
                                🛍️ Catálogo & Tienda
                            </button>
                            <button
                                onClick={() => setActiveSettingsTab('manual')}
                                className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                                    activeSettingsTab === 'manual'
                                        ? 'border-amber-500 text-amber-400 bg-amber-500/10 rounded-t-lg'
                                        : 'border-transparent text-slate-400 hover:text-white'
                                }`}
                            >
                                📖 Guía Token Permanente (Meta)
                            </button>
                        </div>

                        {settingsMessage && (
                            <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                                settingsMessage.type === 'success' 
                                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30' 
                                    : 'bg-red-950/80 text-red-300 border border-red-500/30'
                            }`}>
                                {settingsMessage.type === 'success' ? <Check size={16} /> : <X size={16} />}
                                <span>{settingsMessage.text}</span>
                            </div>
                        )}

                        {/* TAB 1: PERFIL */}
                        {activeSettingsTab === 'profile' && (
                            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                                {/* SECCIÓN FOTO DE PERFIL OFICIAL WHATSAPP BUSINESS (ATOMIC) */}
                                <div className="p-4 bg-slate-900/90 rounded-2xl border border-cyan-500/30 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                                <Camera size={14} className="text-cyan-400" /> Foto Oficial de Perfil WhatsApp Business (ATOMIC)
                                            </span>
                                            <p className="text-[10px] text-slate-400">
                                                Logo oficial de ATOMIC sincronizado con Meta Cloud API (+593 96 322 6319). Esta imagen la ven tus clientes en WhatsApp.
                                            </p>
                                        </div>
                                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                                            1:1 Cuadrada • PNG / JPG
                                        </span>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                                        <div className="relative group shrink-0">
                                            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-cyan-400 shadow-md shadow-cyan-950/60 bg-slate-950 flex items-center justify-center">
                                                <img 
                                                    src={photoPreview || profileData.profile_picture_url || `/api/whatsapp-avatar?t=${avatarKey}`} 
                                                    alt="WhatsApp Profile Preview" 
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = `/api/whatsapp-avatar?t=${avatarKey}`;
                                                    }}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => photoFileInputRef.current?.click()}
                                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer"
                                                title="Cambiar foto de WhatsApp"
                                            >
                                                <Camera size={18} className="mb-0.5 text-cyan-300" />
                                                <span>Cambiar</span>
                                            </button>
                                        </div>

                                        <div className="flex-1 space-y-2 w-full">
                                            <input 
                                                type="file" 
                                                ref={photoFileInputRef} 
                                                onChange={handlePhotoFileChange} 
                                                accept="image/png,image/jpeg,image/webp" 
                                                className="hidden" 
                                            />
                                            <div className="flex flex-wrap items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => photoFileInputRef.current?.click()}
                                                    className="px-3 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                                                >
                                                    <Upload size={13} /> <span>Subir foto desde PC</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={isSyncingPhoto}
                                                    onClick={handleSyncMetaPhoto}
                                                    className="px-3 py-1.5 rounded-xl bg-emerald-600/25 hover:bg-emerald-600/40 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                                                    title="Forzar sincronización inmediata de la foto con Meta WhatsApp (+593 96 322 6319)"
                                                >
                                                    {isSyncingPhoto ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
                                                    <span>{isSyncingPhoto ? 'Sincronizando con Meta...' : '⚡ Sincronizar Foto con WhatsApp Meta Ahora'}</span>
                                                </button>
                                                {photoPreview && (
                                                    <button
                                                        type="button"
                                                        onClick={() => { setPhotoPreview(null); setPhotoBase64(null); }}
                                                        className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
                                                    >
                                                        <X size={12} /> Descartar
                                                    </button>
                                                )}
                                                {photoPreview && (
                                                    <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                                                        <Check size={11} /> Nueva imagen lista para guardar
                                                    </span>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-[10px] text-slate-400 mb-0.5 font-medium">O especificar URL directa de imagen:</label>
                                                <input 
                                                    type="url"
                                                    value={profileData.profile_picture_url}
                                                    onChange={(e) => {
                                                        setProfileData({ ...profileData, profile_picture_url: e.target.value });
                                                        if (!photoBase64) setPhotoPreview(e.target.value);
                                                    }}
                                                    placeholder="https://atomiccotizador.shop/images/logo.png"
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-600"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                                    <div>
                                        <label className="block text-[11px] text-slate-400 mb-1 font-medium">Estado / Eslogan Corto:</label>
                                        <input 
                                            type="text"
                                            value={profileData.about}
                                            onChange={(e) => setProfileData({ ...profileData, about: e.target.value })}
                                            placeholder="Tecnología, Industria y Hogar"
                                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] text-slate-400 mb-1 font-medium">Descripción Completa de la Empresa:</label>
                                        <textarea 
                                            rows={2}
                                            value={profileData.description}
                                            onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                                            placeholder="Importación y Comercialización de Equipos Tecnológicos..."
                                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[11px] text-slate-400 mb-1 font-medium">Correo de Ventas:</label>
                                            <input 
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                placeholder="ventas@atomic.com.ec"
                                                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] text-slate-400 mb-1 font-medium">Sitio Web Oficial:</label>
                                            <input 
                                                type="text"
                                                value={profileData.websites}
                                                onChange={(e) => setProfileData({ ...profileData, websites: e.target.value })}
                                                placeholder="https://atomiccotizador.shop/web"
                                                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] text-slate-400 mb-1 font-medium">Dirección Física:</label>
                                        <input 
                                            type="text"
                                            value={profileData.address}
                                            onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                            placeholder="Quito, Ecuador"
                                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                                        />
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={settingsSaving}
                                            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            <Save size={14} /> <span>Guardar en Meta WhatsApp</span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}

                        {/* TAB 2: CREDENCIALES & TOKEN (PROTEGIDO CON CONTRASEÑA 123456) */}
                        {activeSettingsTab === 'credentials' && (
                            <div className="space-y-4 text-xs">
                                {!isCredentialsUnlocked ? (
                                    <form onSubmit={handleUnlockCredentials} className="p-6 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-4 max-w-md mx-auto my-4 shadow-xl">
                                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                                            <Lock size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-white uppercase tracking-wider">Acceso Protegido con Contraseña</h4>
                                            <p className="text-[11px] text-slate-400 mt-1">
                                                Introduce la contraseña de seguridad para visualizar, cambiar o probar el Token de WhatsApp:
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <input 
                                                type="password"
                                                value={credentialsPinInput}
                                                onChange={(e) => {
                                                    setCredentialsPinInput(e.target.value);
                                                    setCredentialsPinError(false);
                                                }}
                                                placeholder="Introduce la contraseña (ej. 123456)"
                                                className={`w-full bg-slate-900 border rounded-xl px-4 py-2.5 text-center text-sm font-mono tracking-widest text-white placeholder-slate-500 focus:outline-none transition-colors ${
                                                    credentialsPinError ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800 focus:border-amber-500'
                                                }`}
                                                autoFocus
                                            />
                                            {credentialsPinError && (
                                                <p className="text-[10px] text-rose-400 font-bold">
                                                    ⚠️ Contraseña incorrecta. Acceso denegado.
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-950/40"
                                        >
                                            <Key size={14} /> <span>Desbloquear Configuración</span>
                                        </button>
                                    </form>
                                ) : (
                                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 animate-in fade-in duration-200">
                                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                            <div className="flex items-center gap-2 text-emerald-400 font-bold">
                                                <Key size={16} />
                                                <span>Configuración de Tokens & Identificador Meta (Desbloqueado)</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setIsCredentialsUnlocked(false)}
                                                className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800"
                                                title="Volver a bloquear pestaña"
                                            >
                                                <Lock size={12} /> Bloquear
                                            </button>
                                        </div>
                                        <p className="text-[11px] text-slate-400">
                                            Token Permanente de Usuario del Sistema vinculado a Meta Cloud API.
                                        </p>

                                        <div>
                                            <label className="block text-[11px] text-slate-300 font-bold mb-1">
                                                📱 WHATSAPP PHONE NUMBER ID:
                                            </label>
                                            <input 
                                                type="text"
                                                value={credPhoneId}
                                                onChange={(e) => setCredPhoneId(e.target.value)}
                                                placeholder="Ej. 1215685301622232"
                                                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[11px] text-slate-300 font-bold mb-1">
                                                🔑 WHATSAPP ACCESS TOKEN (Bearer Token):
                                            </label>
                                            <textarea 
                                                rows={3}
                                                value={credToken}
                                                onChange={(e) => setCredToken(e.target.value)}
                                                placeholder="EAA..."
                                                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-emerald-300"
                                            />
                                        </div>

                                        <div className="flex flex-wrap gap-2 pt-2">
                                            <button
                                                type="button"
                                                onClick={handleSaveCredentials}
                                                disabled={settingsSaving}
                                                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                                            >
                                                <Save size={14} /> <span>Guardar Credenciales</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={handleTestConnection}
                                                disabled={credStatus === 'TESTING'}
                                                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                                            >
                                                <RefreshCw size={14} className={credStatus === 'TESTING' ? 'animate-spin' : ''} />
                                                <span>Probar Conexión</span>
                                            </button>
                                        </div>

                                        {credTestResult && (
                                            <div className={`p-3 rounded-xl text-xs font-mono font-bold ${
                                                credStatus === 'SUCCESS' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                                            }`}>
                                                {credTestResult}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB: CATÁLOGO DE PRODUCTOS & TIENDA WHATSAPP CLOUD API */}
                        {activeSettingsTab === 'catalog' && (
                            <div className="space-y-4 text-xs">
                                {/* Banner de Estado General */}
                                <div className="p-4 bg-gradient-to-r from-slate-950 via-cyan-950/30 to-slate-950 rounded-2xl border border-cyan-500/30 space-y-2">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                                                <ShoppingBag size={18} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-white uppercase tracking-wider">
                                                    Catálogo & Tienda Oficial en WhatsApp
                                                </h4>
                                                <p className="text-[11px] text-slate-300">
                                                    Muestra el icono de tienda 🛍️ en el perfil de WhatsApp (+593 96 322 6319) y sincroniza los productos con Meta.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-bold border ${
                                                catalogSettings.isCatalogVisible
                                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                            }`}>
                                                {catalogSettings.isCatalogVisible ? '● Catálogo Visible en WhatsApp' : '○ Catálogo Oculto'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Formulario de Activación en Meta */}
                                <form onSubmit={handleSaveCatalogSettings} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                                    <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
                                        <div>
                                            <h5 className="font-bold text-white text-xs uppercase flex items-center gap-1.5">
                                                <Zap size={14} className="text-cyan-400" /> Control de Comercio en Meta Cloud API
                                            </h5>
                                            <p className="text-[10px] text-slate-400 mt-0.5">
                                                Configura el endpoint oficial <code className="text-cyan-300 font-mono">whatsapp_commerce_settings</code> de Meta.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={fetchCatalogSettings}
                                            disabled={catalogLoading}
                                            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-[10px] font-mono flex items-center gap-1 cursor-pointer"
                                        >
                                            <RefreshCw size={11} className={catalogLoading ? 'animate-spin' : ''} /> Consultar Meta
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {/* Switch Visibilidad Catálogo */}
                                        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-white text-xs">Visibilidad del Catálogo</span>
                                                    <span className="text-[10px] font-mono text-cyan-400">is_catalog_visible</span>
                                                </div>
                                                <p className="text-[10px] text-slate-400 mt-1">
                                                    Muestra el icono de tienda (Storefront) en el perfil de WhatsApp de ATOMIC y en la barra superior de los chats.
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setCatalogSettings(prev => ({ ...prev, isCatalogVisible: !prev.isCatalogVisible }))}
                                                className={`w-full py-2 px-3 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                                    catalogSettings.isCatalogVisible
                                                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950'
                                                        : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                                                }`}
                                            >
                                                {catalogSettings.isCatalogVisible ? <Check size={14} /> : <X size={14} />}
                                                <span>{catalogSettings.isCatalogVisible ? 'Catálogo Visible (Activo)' : 'Hacer Visible'}</span>
                                            </button>
                                        </div>

                                        {/* Switch Carrito de Compras */}
                                        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-white text-xs">Carrito de Compras</span>
                                                    <span className="text-[10px] font-mono text-cyan-400">is_cart_enabled</span>
                                                </div>
                                                <p className="text-[10px] text-slate-400 mt-1">
                                                    Permite a los clientes armar pedidos y enviarte carritos de compra directamente desde el chat de WhatsApp.
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setCatalogSettings(prev => ({ ...prev, isCartEnabled: !prev.isCartEnabled }))}
                                                className={`w-full py-2 px-3 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                                    catalogSettings.isCartEnabled
                                                        ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-950'
                                                        : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                                                }`}
                                            >
                                                {catalogSettings.isCartEnabled ? <Check size={14} /> : <X size={14} />}
                                                <span>{catalogSettings.isCartEnabled ? 'Carrito Habilitado' : 'Habilitar Carrito'}</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Input Catalog ID de Meta */}
                                    <div className="space-y-1.5 pt-1">
                                        <label className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                                            <span>Meta Commerce Catalog ID (Opcional):</span>
                                            <span className="text-[10px] font-mono text-slate-500">Facebook Business Manager</span>
                                        </label>
                                        <div className="flex gap-2">
                                            <input 
                                                type="text"
                                                value={catalogSettings.catalogId}
                                                onChange={(e) => setCatalogSettings(prev => ({ ...prev, catalogId: e.target.value }))}
                                                placeholder="Ej: ID del Catálogo creado en Meta Commerce Manager"
                                                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                                            />
                                        </div>
                                        <p className="text-[10px] text-slate-500">
                                            Si tienes un catálogo creado en Meta Commerce Manager, pega su ID aquí para vincularlo directamente con este número.
                                        </p>
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={settingsSaving}
                                            className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-950/40"
                                        >
                                            {settingsSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                            <span>⚡ Guardar y Activar en Meta Cloud API (+593 96 322 6319)</span>
                                        </button>
                                    </div>
                                </form>

                                {/* Sección: Sincronización Automática de Productos con el ERP */}
                                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                        <div className="flex items-center gap-2 font-bold text-emerald-400">
                                            <ShoppingBag size={16} />
                                            <span>Data Feed Automático de Productos (Desde el ERP)</span>
                                        </div>
                                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                            {catalogSettings.totalProducts} Productos Activos
                                        </span>
                                    </div>

                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                        Meta Commerce Manager requiere una fuente de datos (Data Feed) para cargar los productos automáticamente a WhatsApp con fotos, precios y stock.
                                    </p>

                                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                                        <label className="text-[10px] uppercase font-bold text-slate-400 block">
                                            URL del Feed CSV para Meta Commerce Manager:
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="text" 
                                                readOnly 
                                                value={catalogSettings.feedUrl}
                                                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-cyan-300 select-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(catalogSettings.feedUrl);
                                                    alert('📋 URL del Feed de Productos copiada al portapapeles');
                                                }}
                                                className="px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                                            >
                                                <Copy size={12} /> Copiar
                                            </button>
                                            <a
                                                href="/api/whatsapp/catalog?format=csv"
                                                download="whatsapp-catalog-meta-feed.csv"
                                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                                            >
                                                <Download size={12} /> CSV
                                            </a>
                                        </div>
                                    </div>

                                    {/* Pasos para conectar en Meta */}
                                    <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                                        <span className="text-[10px] uppercase font-bold text-amber-300 block">
                                            📌 Pasos para conectar tus productos en Meta Commerce Manager:
                                        </span>
                                        <ol className="text-[11px] text-slate-400 space-y-1.5 list-decimal pl-4">
                                            <li>Abre <a href="https://business.facebook.com/commerce_manager" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline font-medium">Meta Commerce Manager</a> y selecciona o crea un Catálogo de Productos.</li>
                                            <li>En el menú lateral, ve a <strong>Catálogo &gt; Fuentes de datos &gt; Data feed</strong>.</li>
                                            <li>Selecciona <strong>Usar una URL</strong>, pega el enlace de arriba (<code className="text-cyan-300 font-mono">/api/whatsapp/catalog?format=csv</code>) y programa sincronización automática.</li>
                                            <li>Meta importará automáticamente tus <strong>{catalogSettings.totalProducts} productos</strong> con fotos, precios y enlaces a WhatsApp.</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: GUÍA PASO A PASO PARA TOKEN PERMANENTE */}
                        {activeSettingsTab === 'manual' && (
                            <div className="space-y-4 text-xs">
                                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
                                    <div className="flex items-center gap-2 text-amber-400 font-bold border-b border-slate-800 pb-2">
                                        <Megaphone size={16} />
                                        <span>Manual Paso a Paso: Cómo Generar el Token Permanente (Sin Expiración) en Meta</span>
                                    </div>

                                    <div className="space-y-3 text-slate-300">
                                        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
                                            <div className="flex items-center gap-2 font-bold text-cyan-300">
                                                <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-[10px] text-cyan-300">1</span>
                                                <span>Ingresar a Meta for Developers</span>
                                            </div>
                                            <p className="text-[11px] text-slate-400 pl-7">
                                                Abre <a href="https://business.facebook.com/settings/system-users" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline font-bold">Meta Business Suite &gt; Configuración del Negocio &gt; Usuarios del Sistema</a>.
                                            </p>
                                        </div>

                                        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
                                            <div className="flex items-center gap-2 font-bold text-cyan-300">
                                                <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-[10px] text-cyan-300">2</span>
                                                <span>Crear un Usuario del Sistema</span>
                                            </div>
                                            <p className="text-[11px] text-slate-400 pl-7">
                                                Haz clic en <strong>Agregar</strong>, ponle de nombre <code className="bg-slate-950 px-1 py-0.5 rounded text-amber-300 font-mono">Atomic ERP Bot</code> y asígnale el rol de <strong>Administrador</strong>.
                                            </p>
                                        </div>

                                        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
                                            <div className="flex items-center gap-2 font-bold text-cyan-300">
                                                <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-[10px] text-cyan-300">3</span>
                                                <span>Asignar Activos a la App de WhatsApp</span>
                                            </div>
                                            <p className="text-[11px] text-slate-400 pl-7">
                                                Haz clic en <strong>Asignar activos</strong>, selecciona <strong>Apps</strong> &gt; tu App de WhatsApp Cloud &gt; activa <strong>Control Total / Administrar App</strong> y guarda.
                                            </p>
                                        </div>

                                        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
                                            <div className="flex items-center gap-2 font-bold text-cyan-300">
                                                <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-[10px] text-cyan-300">4</span>
                                                <span>Generar Token Permanente</span>
                                            </div>
                                            <p className="text-[11px] text-slate-400 pl-7">
                                                Haz clic en el botón <strong>Generar nuevo token</strong>, selecciona tu App y marca estrictamente los siguientes permisos:
                                            </p>
                                            <div className="flex flex-wrap gap-1.5 pl-7 pt-1">
                                                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-mono text-[10px]">whatsapp_business_management</span>
                                                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-mono text-[10px]">whatsapp_business_messaging</span>
                                            </div>
                                        </div>

                                        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
                                            <div className="flex items-center gap-2 font-bold text-cyan-300">
                                                <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-[10px] text-cyan-300">5</span>
                                                <span>Copiar y Pegar en la pestaña Token</span>
                                            </div>
                                            <p className="text-[11px] text-slate-400 pl-7">
                                                Copia el token generado (<code className="bg-slate-950 px-1 py-0.5 rounded text-emerald-400 font-mono">EAA...</code>) y pégalo en la pestaña <strong>Token & Conexión Meta</strong>. Este token nunca caduca y mantendrá activas todas las fotos, videos, audios y atribución de pautas de forma permanente.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            )}

            {/* ═════════════════════════════════════════════════════════════ */}
            {/* 👤 MODAL: ASIGNACIÓN DE ASESOR A LA CONVERSACIÓN            */}
            {/* ═════════════════════════════════════════════════════════════ */}
            {assignModalOpen && chatToAssign && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div 
                        onClick={() => setAssignModalOpen(false)} 
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    <div className="relative z-10 w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4 text-white">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div className="flex items-center gap-2 text-cyan-400 font-black text-sm">
                                <UserCheck size={18} />
                                <span>Asignar Asesor para Atención</span>
                            </div>
                            <button 
                                onClick={() => setAssignModalOpen(false)}
                                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                            Para responder a <span className="font-bold text-white">{chatToAssign.name}</span> ({chatToAssign.phone}), indica o edita el nombre del asesor responsable de esta atención:
                        </p>

                        <div className="space-y-3">
                            {/* Selector rápido si existen asesores registrados en el sistema */}
                            {systemAdvisors.length > 0 && (
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center justify-between">
                                        <span>Seleccionar Asesor del Equipo</span>
                                        <span className="text-[9px] text-slate-500 font-normal">({systemAdvisors.length} disponibles)</span>
                                    </label>
                                    <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-950 rounded-xl border border-slate-800">
                                        {systemAdvisors.map((adv: any) => {
                                            const isSelected = advisorInput.trim().toLowerCase() === (adv.name || adv.email).trim().toLowerCase()
                                            return (
                                                <button
                                                    key={adv.id}
                                                    type="button"
                                                    onClick={() => setAdvisorInput(adv.name || adv.email)}
                                                    className={`p-2 rounded-lg text-left text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                                                        isSelected
                                                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200'
                                                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                                                    }`}
                                                >
                                                    <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[9px] text-cyan-400 shrink-0 font-bold">
                                                        {(adv.name || 'A').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate leading-tight">{adv.name || adv.email}</p>
                                                        <p className="text-[8px] text-slate-500 font-mono truncate">{adv.role || 'VENTAS'}</p>
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    O escribe el nombre manualmente
                                </label>
                                <input
                                    type="text"
                                    value={advisorInput}
                                    onChange={(e) => setAdvisorInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleConfirmAssign()}
                                    placeholder="Ej: Carlos Mendoza / Stefany Álvarez"
                                    className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none font-medium"
                                    autoFocus
                                />
                                <p className="text-[10px] text-slate-500 leading-snug">
                                    💡 Este chat quedará registrado y en los demás perfiles se mostrará la etiqueta <strong>"Asignado a: {advisorInput || '...'}"</strong> en tiempo real.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2.5 pt-2">
                            <button
                                type="button"
                                onClick={() => setAssignModalOpen(false)}
                                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                            >
                                Cancelar / Solo Ver
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmAssign}
                                disabled={!advisorInput.trim() || assigningLoading}
                                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-cyan-950/50 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                            >
                                {assigningLoading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                <span>{canAssignLeads ? 'Asignar Lead' : 'Confirmar y Atender'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL KAREN: JEFA DE MENSAJERÍA & AUDITORÍA EN VIVO */}
            {karenModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-200">
                    <div className="bg-slate-950 border border-cyan-500/30 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden">
                        
                        {/* Header */}
                        <div className="p-4 md:p-6 bg-gradient-to-r from-slate-950 via-cyan-950/40 to-slate-950 border-b border-cyan-500/20 flex items-center justify-between">
                            <div className="flex items-center gap-3.5">
                                <div className="relative group">
                                    <img 
                                        src={`/api/karen-avatar?t=${avatarKey}`} 
                                        alt="Karen" 
                                        className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-400 shadow-lg shadow-cyan-950/50" 
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActiveSettingsTab('profile');
                                            setIsSettingsModalOpen(true);
                                        }}
                                        className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-cyan-300 cursor-pointer"
                                        title="Cambiar foto de perfil en Ajustes"
                                    >
                                        <Camera size={16} />
                                    </button>
                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-950 ${
                                        karenAuditData?.karen?.mode === 'MANUAL' ? 'bg-rose-500' :
                                        karenAuditData?.karen?.mode === 'AWAITING_APPROVAL' ? 'bg-amber-400' : 'bg-emerald-400'
                                    }`} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-lg md:text-xl font-black text-white tracking-tight flex items-center gap-2">
                                            Karen <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">Jefa de Mensajería & IA</span>
                                        </h2>
                                    </div>
                                    <p className="text-xs text-slate-300 mt-0.5">Auditoría inteligente en vivo, discernimiento de leads y enlace directo con Juan (0969043453)</p>
                                </div>
                            </div>

                            <button 
                                onClick={() => setKarenModalOpen(false)}
                                className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body Container */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
                            
                            {/* Semáforo de Control */}
                            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                                            <Zap size={16} />
                                        </div>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Semáforo de Operación de Karen</h3>
                                    </div>
                                    <span className="text-[11px] font-mono text-slate-400">
                                        Estado actual: <span className="font-bold text-white uppercase">{karenAuditData?.karen?.mode || 'AUTOMATIC'}</span>
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                    <button
                                        type="button"
                                        onClick={() => handleSetKarenMode('AUTOMATIC')}
                                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                                            karenAuditData?.karen?.mode === 'AUTOMATIC' || !karenAuditData?.karen?.mode
                                                ? 'bg-[#0c2a1e] border-2 border-emerald-500 text-emerald-200'
                                                : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-400'
                                        }`}
                                    >
                                        <span className="text-2xl">🟢</span>
                                        <div>
                                            <div className="text-xs font-black text-white">Automático</div>
                                            <div className="text-[10px] text-slate-400 leading-tight">Karen responde, filtra y atiende en tiempo real</div>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleSetKarenMode('AWAITING_APPROVAL')}
                                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                                            karenAuditData?.karen?.mode === 'AWAITING_APPROVAL'
                                                ? 'bg-[#2a2114] border-2 border-amber-500 text-amber-200'
                                                : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-400'
                                        }`}
                                    >
                                        <span className="text-2xl">🟡</span>
                                        <div>
                                            <div className="text-xs font-black text-white">Autorización</div>
                                            <div className="text-[10px] text-slate-400 leading-tight">Consulta contexto y pide OK a Juan antes de enviar</div>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleSetKarenMode('MANUAL')}
                                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                                            karenAuditData?.karen?.mode === 'MANUAL'
                                                ? 'bg-[#3b1219] border-2 border-rose-500 text-rose-200'
                                                : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-400'
                                        }`}
                                    >
                                        <span className="text-2xl">🔴</span>
                                        <div>
                                            <div className="text-xs font-black text-white">Manual</div>
                                            <div className="text-[10px] text-slate-400 leading-tight">WhatsApp 100% humano, bot silenciado</div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Métricas Auditoría & Discernimiento */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Chats Auditados</span>
                                    <span className="text-xl md:text-2xl font-black text-white block mt-1">{chats.length}</span>
                                    <span className="text-[9px] text-emerald-400 font-medium">100% en vigilancia</span>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-cyan-500/20 text-center">
                                    <span className="text-[10px] font-mono uppercase text-cyan-300 block">Registro Automático</span>
                                    <span className="text-xl md:text-2xl font-black text-cyan-400 block mt-1">{autoRegisterCount}</span>
                                    <span className="text-[9px] text-slate-400 font-medium">Cotiz. y postulaciones</span>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-amber-500/20 text-center">
                                    <span className="text-[10px] font-mono uppercase text-amber-300 block">Chats Sin Catalogar</span>
                                    <span className="text-xl md:text-2xl font-black text-amber-400 block mt-1">
                                        {karenAuditData?.karen?.uncatalogedChats?.length || 0}
                                    </span>
                                    <span className="text-[9px] text-slate-400 font-medium">Identificados por Karen</span>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-rose-500/20 text-center">
                                    <span className="text-[10px] font-mono uppercase text-rose-300 block">Oportunidades Hot</span>
                                    <span className="text-xl md:text-2xl font-black text-rose-400 block mt-1 flex items-center justify-center gap-1">
                                        <Flame size={18} className="text-rose-500" />
                                        {karenAuditData?.karen?.hotOpportunities?.length || 0}
                                    </span>
                                    <span className="text-[9px] text-slate-400 font-medium">Alta probabilidad</span>
                                </div>
                            </div>

                            {/* Alerta de Inactividad y Despacho a Juan */}
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-cyan-950/30 to-slate-900 border border-blue-500/30 flex items-start gap-3">
                                <div className="p-2 rounded-xl bg-blue-500/20 text-cyan-300 shrink-0 mt-0.5">
                                    <Bell size={18} />
                                </div>
                                <div className="space-y-1">
                                    <div className="text-xs font-black text-white flex items-center gap-2">
                                        Línea de Auditoría Directa con Juan (WhatsApp: 0969043453)
                                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] px-2 py-0.2 rounded-full font-bold">Activo</span>
                                    </div>
                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                        • <strong>Alerta de Inactividad:</strong> Si pasan 2 horas sin mensajes entrantes, Karen escribe automáticamente al WhatsApp de Juan: <em>&quot;Juan, activa las pautas Juan, no hay mensajes en las últimas horas.&quot;</em><br />
                                        • <strong>Alerta de Ráfagas:</strong> Cada 5 minutos con mensajes continuos, Karen reporta el desglose de leads atendidos (contratación, registro, ventas).<br />
                                        • <strong>Oportunidades Hot:</strong> Notifica de inmediato ante intención firme de compra.
                                    </p>
                                </div>
                            </div>

                            {/* Chat Directo & Consola de Órdenes con Karen */}
                            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Bot size={16} className="text-cyan-400" />
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-white">Consola y Diálogo Ejecutivo con Karen</h3>
                                    </div>
                                    <span className="text-[10px] font-mono text-cyan-400">Motor LLM de Discernimiento</span>
                                </div>

                                {/* Chat Logs */}
                                <div className="h-52 overflow-y-auto bg-slate-950/70 rounded-xl p-3 space-y-2.5 border border-slate-800/80">
                                    {karenChatLog.map((log, idx) => (
                                        <div 
                                            key={idx} 
                                            className={`flex gap-2.5 ${log.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            {log.sender === 'karen' && (
                                                <img 
                                                    src={`/api/karen-avatar?t=${avatarKey}`} 
                                                    alt="Karen" 
                                                    className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5 border border-cyan-400" 
                                                />
                                            )}
                                            <div className={`p-2.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                                                log.sender === 'user'
                                                    ? 'bg-cyan-600 text-white rounded-br-none'
                                                    : 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-bl-none'
                                            }`}>
                                                {log.text}
                                            </div>
                                        </div>
                                    ))}
                                    {karenLoading && (
                                        <div className="flex items-center gap-2 text-cyan-400 text-xs py-1">
                                            <Loader2 size={14} className="animate-spin" />
                                            <span>Karen está analizando el CRM...</span>
                                        </div>
                                    )}
                                </div>

                                {/* Quick command chips */}
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => handleKarenCommand("¿Cómo van los mensajes y el flujo de leads hoy?")}
                                        className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                                    >
                                        📊 ¿Cómo van los mensajes hoy?
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleKarenCommand("¿De qué trata ese chat sin catalogar?")}
                                        className="text-[10px] bg-amber-950/50 hover:bg-amber-900/60 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-500/30 transition-colors cursor-pointer"
                                    >
                                        🔍 ¿De qué trata el chat sin catalogar?
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleKarenCommand("Dame las sugerencias estratégicas y promo de esta semana")}
                                        className="text-[10px] bg-cyan-950/50 hover:bg-cyan-900/60 text-cyan-300 px-2.5 py-1 rounded-lg border border-cyan-500/30 transition-colors cursor-pointer"
                                    >
                                        💡 Recomendación y Promo semanal
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleKarenCommand("🟢")}
                                        className="text-[10px] bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/30 transition-colors cursor-pointer"
                                    >
                                        🟢 Auto
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleKarenCommand("🟡")}
                                        className="text-[10px] bg-amber-950/50 hover:bg-amber-900/60 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-500/30 transition-colors cursor-pointer"
                                    >
                                        🟡 Pedir autorización
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleKarenCommand("🔴")}
                                        className="text-[10px] bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 px-2.5 py-1 rounded-lg border border-rose-500/30 transition-colors cursor-pointer"
                                    >
                                        🔴 Manual
                                    </button>
                                </div>

                                {/* Form Input */}
                                <form 
                                    onSubmit={(e) => {
                                        e.preventDefault()
                                        handleKarenCommand(karenChatInput)
                                    }}
                                    className="flex gap-2"
                                >
                                    <input 
                                        type="text"
                                        value={karenChatInput}
                                        onChange={(e) => setKarenChatInput(e.target.value)}
                                        placeholder="Escribe una instrucción a Karen (ej: 'envía tal mensaje a tal persona', '¿cómo van las pautas?', etc.)"
                                        className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!karenChatInput.trim() || karenLoading}
                                        className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-950"
                                    >
                                        <Send size={13} />
                                        <span>Enviar</span>
                                    </button>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* BOTÓN FLOTANTE KAREN: JEFA DE MENSAJERÍA & AUDITORÍA EN VIVO */}
            <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
                {/* Badge informativo / Tooltip visible */}
                <div 
                    onClick={() => { setKarenModalOpen(true); fetchKarenAudit(); }}
                    className="hidden sm:flex items-center gap-2 bg-slate-950/90 border border-cyan-500/40 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer hover:border-cyan-400 transition-all hover:scale-105"
                >
                    <span className="relative flex h-2.5 w-2.5">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                            karenAuditData?.karen?.mode === 'MANUAL' ? 'bg-rose-400' :
                            karenAuditData?.karen?.mode === 'AWAITING_APPROVAL' ? 'bg-amber-400' : 'bg-emerald-400'
                        }`} />
                        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                            karenAuditData?.karen?.mode === 'MANUAL' ? 'bg-rose-500' :
                            karenAuditData?.karen?.mode === 'AWAITING_APPROVAL' ? 'bg-amber-400' : 'bg-emerald-400'
                        }`} />
                    </span>
                    <span className="text-[11px] font-black text-white tracking-wide">
                        Karen <span className="text-cyan-400 font-mono text-[10px] font-normal">• Jefa de Mensajería</span>
                    </span>
                </div>

                {/* Avatar Flotante Interactivo */}
                <button
                    type="button"
                    onClick={() => { setKarenModalOpen(true); fetchKarenAudit(); }}
                    className="relative group p-1 rounded-full bg-slate-950/95 border-2 border-cyan-400 hover:border-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.45)] hover:shadow-[0_0_35px_rgba(6,182,212,0.7)] transition-all cursor-pointer hover:scale-110 active:scale-95"
                    title="Abrir Asistente Karen (Jefa de Mensajería & Auditoría)"
                >
                    <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-full overflow-hidden border border-cyan-500/50">
                        <img 
                            src={`/api/karen-avatar?t=${avatarKey}`} 
                            alt="Karen Jefa de Mensajería" 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                        />
                    </div>
                    
                    {/* Indicador de Estado Semáforo */}
                    <span className={`absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full border-2 border-slate-950 shadow-md ${
                        karenAuditData?.karen?.mode === 'MANUAL' ? 'bg-rose-500' :
                        karenAuditData?.karen?.mode === 'AWAITING_APPROVAL' ? 'bg-amber-400' : 'bg-emerald-400'
                    }`} />
                </button>
            </div>
        </div>
    )
}
