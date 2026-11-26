"use client"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Plus, Trash2, FileOutput, FileSpreadsheet, Calculator, Image as ImageIcon, 
    User, ShieldCheck, Mail, Phone, MapPin, 
    MessageSquare, History, X, ChevronRight,
    Briefcase, Save, Clock, Search, CheckCircle2,
    FileText, Zap, Building2, Tag, Percent, ShoppingCart, Wand2, Upload, AlertTriangle, Download, Sparkles,
    Send, Loader2, Share2, Copy, Check, ExternalLink, QrCode
} from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { QRCodeCanvas } from "qrcode.react"
import { calculateDiscountedPrice } from "@/lib/utils/pricing"
import { generateAtomicUnifiedProposalPDF } from "@/lib/pdf/quotePdfGenerator"
import SalesCopyManager from "@/components/tools/SalesCopyManager"

const safeParseArray = (str: any, fallback: any = []) => {
    if (!str) return fallback;
    if (Array.isArray(str)) return str;
    try {
        const parsed = JSON.parse(str);
        return Array.isArray(parsed) ? parsed : fallback;
    } catch (e) {
        return fallback;
    }
};

type QuoteItem = {
    id: string
    productId: string
    description: string
    quantity: number
    unitPrice: number
    discountPercent?: number
    customImage?: string
}

interface Product {
    id: string
    name: string
    description: string | null
    price: number
    sku: string | null
    images?: string | null
    stock?: number
}

interface QuotationClientProps {
    initialProducts: Product[]
    initialHistory: any[]
    initialClients: any[]
    nextNumber: string
    session: any
    embedded?: boolean
    onCloseModal?: () => void
}

export default function QuotationClient({ initialProducts, initialHistory, initialClients, nextNumber, session, embedded = false, onCloseModal }: QuotationClientProps) {
    const [clientName, setClientName] = useState("")
    const [clientCedula, setClientCedula] = useState("")
    const [clientEmail, setClientEmail] = useState("")
    const [emailNotSpecified, setEmailNotSpecified] = useState(false)
    const [clientPhone, setClientPhone] = useState("")
    const [clientCity, setClientCity] = useState("")
    const [showClientList, setShowClientList] = useState(false)
    const [isSavingClient, setIsSavingClient] = useState(false)
    const [isExportingExcel, setIsExportingExcel] = useState(false)
    const [isNativeSharing, setIsNativeSharing] = useState(false)
    const [externalShareModalData, setExternalShareModalData] = useState<any | null>(null)
    const [postPdfSharePrompt, setPostPdfSharePrompt] = useState<any | null>(null)
    const [isCopiedShare, setIsCopiedShare] = useState(false)
    const [quoteSubject, setQuoteSubject] = useState("")
    const [deliveryAddress, setDeliveryAddress] = useState("")
    const [quoteNumber, setQuoteNumber] = useState(nextNumber)

    const getOnlineQuoteUrl = (qNum: string) => {
        const cleanNum = qNum?.startsWith("PROP") ? qNum : `PROP-${(qNum || "").replace(/^[A-Z]+-/, "")}`;
        return `https://atomiccotizador.shop/c/${cleanNum}`;
    };

    const getQuoteShareText = (qNum: string) => {
        const url = getOnlineQuoteUrl(qNum);
        return `Te compartimos aquí la cotización correspondiente a tu petición. Recuerda solicitar un descuento a tu asesor y consultar tu cotización para siempre aquí:\n${url}`;
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlClient = params.get('client');
        const urlSubject = params.get('subject');
        if (urlClient) setClientName(urlClient);
        if (urlSubject) setQuoteSubject(urlSubject);
        // Fetch system users for the share modal
        fetch('/api/admin/manage-users').then(r => r.json()).then(d => { if (d.users) setSystemUsers(d.users) }).catch(() => {})
    }, []);
    const [advisorName, setAdvisorName] = useState(session?.user?.name?.toUpperCase() || "ASESOR ATOMIC")

    const [items, setItems] = useState<QuoteItem[]>([
        { id: "1", productId: "", description: "", quantity: 1, unitPrice: 0 }
    ])

    // Load pre-selected quote items from Suicide Squad or catalog tools
    useEffect(() => {
        try {
            const saved = localStorage.getItem('atomic_quote_items');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    const validItems = parsed.filter((it: any) => it.description || it.unitPrice > 0);
                    if (validItems.length > 0) {
                        setItems(validItems);
                    }
                }
            }
        } catch (e) {
            console.error("Error loading atomic_quote_items", e);
        }
    }, []);

    const [productPool, setProductPool] = useState<Product[]>(initialProducts || [])
    const [searchResults, setSearchResults] = useState<Product[]>((initialProducts || []).slice(0, 25))
    const [isSearchingProducts, setIsSearchingProducts] = useState(false)
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const searchDropdownRef = useRef<HTMLDivElement | null>(null)

    // Fast O(1) product lookup map for SKU, ID, and Name
    const productMap = useMemo(() => {
        const map = new Map<string, Product>();
        productPool.forEach((p: Product) => {
            if (p.id) map.set(p.id, p);
            if (p.sku) map.set(p.sku, p);
            if (p.name) map.set(p.name, p);
        });
        return map;
    }, [productPool]);

    const findProduct = useCallback((productId?: string, description?: string) => {
        if (productId && productMap.has(productId)) return productMap.get(productId);
        if (description && productMap.has(description)) return productMap.get(description);
        return undefined;
    }, [productMap]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchDropdownRef.current && !searchDropdownRef.current.contains(e.target as Node)) {
                setShowProductList(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleProductSearch = (itemId: string, query: string) => {
        handleItemChange(itemId, "description", query);
        setShowProductList(itemId);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        const trimmed = query.trim();
        if (!trimmed) {
            setSearchResults(productPool.slice(0, 25));
            return;
        }

        // Fast immediate local filter
        const localMatches = productPool.filter(p => 
            p.name.toLowerCase().includes(trimmed.toLowerCase()) || 
            (p.sku && p.sku.toLowerCase().includes(trimmed.toLowerCase()))
        );
        if (localMatches.length > 0) {
            setSearchResults(localMatches.slice(0, 25));
        }

        // Debounced API search on entire 9,600+ database
        setIsSearchingProducts(true);
        searchTimeoutRef.current = setTimeout(async () => {
            try {
                const res = await fetch(`/api/products/search?q=${encodeURIComponent(trimmed)}&limit=25`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && Array.isArray(data.products)) {
                        setSearchResults(data.products);
                        setProductPool(prev => {
                            const map = new Map(prev.map(p => [p.id, p]));
                            data.products.forEach((p: Product) => map.set(p.id, p));
                            return Array.from(map.values());
                        });
                    }
                }
            } catch (err) {
                console.error("Search error:", err);
            } finally {
                setIsSearchingProducts(false);
            }
        }, 180);
    };

    const handleProductFocus = (itemId: string, currentVal: string) => {
        setShowProductList(itemId);
        const trimmed = (currentVal || "").trim();
        if (!trimmed) {
            setSearchResults(productPool.slice(0, 25));
        } else {
            handleProductSearch(itemId, currentVal);
        }
    };

    const [discountPercent, setDiscountPercent] = useState(0)
    const [status, setStatus] = useState<"PENDIENTE" | "CERRADO" | "ABANDONADO">("PENDIENTE")
    const [quoteHistory, setQuoteHistory] = useState(initialHistory)
    const [isHistoryOpen, setIsHistoryOpen] = useState(false)
    const [showProductList, setShowProductList] = useState<string | null>(null)

    // 3-dot context menu & share modal state
    const [quoteMenuOpen, setQuoteMenuOpen] = useState<string | null>(null)
    const [shareModalOpen, setShareModalOpen] = useState<any>(null)
    const [shareTarget, setShareTarget] = useState<string>('')
    const [systemUsers, setSystemUsers] = useState<any[]>([])
    const [shareMessage, setShareMessage] = useState<string>('')
    const [isSharingQuote, setIsSharingQuote] = useState(false)
    const [showSalesCopyModal, setShowSalesCopyModal] = useState(false)

    // Quick Generator States
    const [quickText, setQuickText] = useState("")
    const [quickImage, setQuickImage] = useState<string | null>(null)
    const [quickWarning, setQuickWarning] = useState<string | null>(null)
    const [isExtracting, setIsExtracting] = useState(false)
    const [quickSuccess, setQuickSuccess] = useState(false)
    const quickInputRef = useRef<HTMLInputElement>(null)

    const taxRate = 0.15 
    const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0)
    const itemDiscountAmount = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice * ((item.discountPercent || 0) / 100)), 0)
    const globalDiscountAmount = (subtotal - itemDiscountAmount) * (discountPercent / 100)
    const totalDiscountAmount = itemDiscountAmount + globalDiscountAmount
    const taxableAmount = subtotal - totalDiscountAmount
    const taxAmount = taxableAmount * taxRate
    const total = taxableAmount + taxAmount

    // Load system users for quote sharing
    useEffect(() => {
        fetch('/api/admin/manage-users')
            .then(r => r.json())
            .then(d => { if (d.users) setSystemUsers(d.users) })
            .catch(() => {})
    }, [])

    // ── QUOTE 3-DOT MENU HELPERS ────────────────────────────────────────
    const handleLoadQuoteMode = (q: any, mode: 'full' | 'name_only' | 'products_only') => {
        if (mode === 'full' || mode === 'name_only') {
            setClientName(q.clientName || '')
            setClientCity(q.city || '')
            setClientPhone(q.clientPhone || '')
            setClientEmail(q.clientEmail || '')
            setEmailNotSpecified(!q.clientEmail || q.clientEmail === 'no@especifica.com')
            setQuoteSubject(q.quoteSubject || '')
            setDeliveryAddress(q.deliveryAddress || '')
            setDiscountPercent(q.discountPercent || 0)
        }
        if (mode === 'full' || mode === 'products_only') {
            if (q.items) {
                const parsedItems = safeParseArray(q.items || q.itemsData)
                if (parsedItems.length > 0) setItems(parsedItems)
            }
        }
        setIsHistoryOpen(false)
        setQuoteMenuOpen(null)
    }

    const handleDownloadQuotePDF = async (q: any) => {
        setQuoteMenuOpen(null)
        try {
            const parsedItems = safeParseArray(q.items || q.itemsData)
            const itemDiscount = parsedItems.reduce((acc: number, item: any) => acc + (item.quantity * item.unitPrice * ((item.discountPercent || 0) / 100)), 0)
            const rawSubtotal = parsedItems.reduce((acc: number, item: any) => acc + (item.quantity * item.unitPrice), 0)
            const globalDisc = (rawSubtotal - itemDiscount) * ((q.discountPercent || 0) / 100)
            const taxable = rawSubtotal - itemDiscount - globalDisc
            const tax = taxable * 0.15
            const onlineUrl = getOnlineQuoteUrl(q.quoteNumber);
            const qrCanvas = (document.getElementById(`atomic-quote-qr-${q.quoteNumber}`) ||
                              document.getElementById("atomic-quote-qr-canvas")) as HTMLCanvasElement;
            const qrDataUri = qrCanvas ? qrCanvas.toDataURL("image/png") : undefined;

            const pdfData = await generateAtomicUnifiedProposalPDF({
                quoteNumber: q.quoteNumber,
                clientName: q.clientName || '',
                clientCedula: q.client?.cedula || q.clientCedula || '',
                clientPhone: q.clientPhone || '',
                clientCity: q.city || '',
                clientEmail: q.clientEmail || '',
                quoteSubject: q.quoteSubject || '',
                advisorName: q.advisorName || session?.user?.name?.toUpperCase() || 'ATOMIC',
                advisorPhone: q.salesperson?.phone || '0999047979',
                items: parsedItems,
                subtotal: rawSubtotal,
                taxAmount: tax,
                taxPercent: 15,
                discountAmount: itemDiscount + globalDisc,
                total: q.total || (taxable + tax),
                deliveryAddress: q.deliveryAddress || '',
                qrCodeUrl: onlineUrl,
                qrDataUri
            })
            pdfData.doc.save(pdfData.fileName);

            setPostPdfSharePrompt({
                quoteNumber: q.quoteNumber,
                clientName: q.clientName,
                onlineUrl,
                pdfData
            });
        } catch (e) { console.error('PDF download error:', e) }
    }

    const handleShareQuoteNative = async (quoteDataOverride?: any) => {
        const effClientName = quoteDataOverride ? quoteDataOverride.clientName : clientName;
        if (!effClientName?.trim()) {
            alert("⚠️ Por favor ingresa el nombre del cliente para compartir.");
            return;
        }

        const effQuoteNumber = quoteDataOverride ? quoteDataOverride.quoteNumber : quoteNumber;
        const onlineUrl = getOnlineQuoteUrl(effQuoteNumber);
        const shareText = getQuoteShareText(effQuoteNumber);

        setIsNativeSharing(true);
        try {
            const qrCanvas = (document.getElementById(`atomic-quote-qr-${effQuoteNumber}`) ||
                              document.getElementById("atomic-quote-qr-canvas")) as HTMLCanvasElement;
            const qrDataUri = qrCanvas ? qrCanvas.toDataURL("image/png") : undefined;

            let pdfData: any = null;
            if (quoteDataOverride) {
                const parsedItems = safeParseArray(quoteDataOverride.items);
                const itemDiscount = parsedItems.reduce((acc: number, item: any) => acc + (item.quantity * item.unitPrice * ((item.discountPercent || 0) / 100)), 0);
                const rawSubtotal = parsedItems.reduce((acc: number, item: any) => acc + (item.quantity * item.unitPrice), 0);
                const globalDisc = (rawSubtotal - itemDiscount) * ((quoteDataOverride.discountPercent || 0) / 100);
                const taxable = rawSubtotal - itemDiscount - globalDisc;
                const tax = taxable * 0.15;
                pdfData = await generateAtomicUnifiedProposalPDF({
                    quoteNumber: quoteDataOverride.quoteNumber,
                    clientName: quoteDataOverride.clientName || 'Cliente',
                    clientCedula: quoteDataOverride.client?.cedula || quoteDataOverride.clientCedula || '',
                    clientPhone: quoteDataOverride.clientPhone || '',
                    clientCity: quoteDataOverride.city || 'Quito',
                    clientEmail: quoteDataOverride.clientEmail || '',
                    quoteSubject: quoteDataOverride.quoteSubject || quoteDataOverride.specs || 'PROPUESTA COMERCIAL',
                    advisorName: quoteDataOverride.advisorName || session?.user?.name?.toUpperCase() || 'ATOMIC',
                    advisorPhone: quoteDataOverride.salesperson?.phone || '0999047979',
                    items: parsedItems,
                    subtotal: rawSubtotal,
                    taxAmount: tax,
                    taxPercent: 15,
                    discountAmount: itemDiscount + globalDisc,
                    total: quoteDataOverride.total || (taxable + tax),
                    deliveryAddress: quoteDataOverride.deliveryAddress || '',
                    qrCodeUrl: onlineUrl,
                    qrDataUri
                });
            } else {
                const finalEmail = emailNotSpecified ? "no@especifica.com" : clientEmail;
                pdfData = await generateAtomicUnifiedProposalPDF({
                    quoteNumber,
                    clientName,
                    clientCedula,
                    clientPhone,
                    clientEmail: finalEmail,
                    clientCity,
                    deliveryAddress: deliveryAddress || clientCity,
                    quoteSubject: quoteSubject || "PROPUESTA TÉCNICA COMERCIAL",
                    advisorName,
                    advisorPhone: session?.user?.phone || '0999047979',
                    items: items.map(i => {
                        const sub = i.quantity * i.unitPrice;
                        const desc = sub * ((i.discountPercent || 0) / 100);
                        return {
                            sku: i.productId || "SKU-GEN",
                            productId: i.productId,
                            name: i.description,
                            description: i.description,
                            quantity: i.quantity,
                            unitPrice: i.unitPrice,
                            discountPercent: i.discountPercent,
                            discountAmount: desc,
                            total: sub - desc,
                            customImage: i.customImage
                        };
                    }),
                    specs: quoteSubject,
                    warrantyComments: "Garantía oficial de 1 año con soporte técnico y repuestos originales",
                    subtotal,
                    taxAmount,
                    discountAmount: totalDiscountAmount,
                    total,
                    validityDays: 15,
                    qrCodeUrl: onlineUrl,
                    qrDataUri
                });
            }

            const pdfFile = new File([pdfData.blob], pdfData.fileName, { type: "application/pdf" });

            if (typeof navigator !== "undefined" && navigator.share) {
                let shared = false;
                if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
                    try {
                        await navigator.share({
                            title: `Cotización ${effQuoteNumber} · ATOMIC Solutions`,
                            text: shareText,
                            files: [pdfFile]
                        });
                        shared = true;
                        return;
                    } catch (err: any) {
                        if (err.name === "AbortError") return;
                        console.warn("Share files failed/cancelled", err);
                    }
                }

                if (!shared) {
                    try {
                        await navigator.share({
                            title: `Cotización ${effQuoteNumber} · ATOMIC Solutions`,
                            text: shareText,
                            url: onlineUrl
                        });
                        return;
                    } catch (err: any) {
                        if (err.name === "AbortError") return;
                        console.warn("Share url failed/cancelled", err);
                    }
                }
            }

            setExternalShareModalData({
                quoteNumber: effQuoteNumber,
                clientName: effClientName,
                onlineUrl,
                shareText,
                pdfBlob: pdfData.blob,
                fileName: pdfData.fileName
            });
        } catch (e) {
            console.error("Error al preparar compartir:", e);
            setExternalShareModalData({
                quoteNumber: effQuoteNumber,
                clientName: effClientName,
                onlineUrl,
                shareText
            });
        } finally {
            setIsNativeSharing(false);
        }
    };

    const handleDownloadQuoteExcel = async (q: any) => {
        setQuoteMenuOpen(null)
        try {
            const parsedItems = safeParseArray(q.items || q.itemsData)
            const itemDiscount = parsedItems.reduce((acc: number, item: any) => acc + (item.quantity * item.unitPrice * ((item.discountPercent || 0) / 100)), 0)
            const rawSubtotal = parsedItems.reduce((acc: number, item: any) => acc + (item.quantity * item.unitPrice), 0)
            const globalDisc = (rawSubtotal - itemDiscount) * ((q.discountPercent || 0) / 100)
            const taxable = rawSubtotal - itemDiscount - globalDisc
            const tax = taxable * 0.15
            await handleGenerateExcel({
                quoteNumber: q.quoteNumber,
                clientName: q.clientName || '',
                clientCedula: q.client?.cedula || '',
                clientPhone: q.clientPhone || '',
                clientCity: q.city || '',
                clientEmail: q.clientEmail || '',
                quoteSubject: q.quoteSubject || q.specs || '',
                advisorName: q.advisorName || session?.user?.name?.toUpperCase() || 'ATOMIC',
                items: parsedItems.map((item: any) => ({
                    id: item.id || item.productId,
                    sku: item.sku || item.productId,
                    description: item.description || item.name || '',
                    quantity: Number(item.quantity || 1),
                    unitPrice: Number(item.unitPrice || 0),
                    discountPercent: Number(item.discountPercent || 0),
                    total: Number(item.total || (item.quantity * item.unitPrice))
                })),
                subtotal: rawSubtotal,
                taxAmount: tax,
                discountAmount: itemDiscount + globalDisc,
                total: q.total || (taxable + tax)
            })
        } catch (e) {
            console.error('Excel download error:', e)
        }
    }

    const handleOSShareQuote = (q: any) => {
        setQuoteMenuOpen(null);
        handleShareQuoteNative(q);
    };

    const handleShareQuote = async (quote: any) => {
        if (!shareTarget || isSharingQuote) return
        setIsSharingQuote(true)
        try {
            const res = await fetch('/api/quotes/share', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quoteId: quote.id, targetEmail: shareTarget, senderName: session?.user?.name || 'Atomic' })
            })
            const data = await res.json()
            if (data.success) {
                setShareModalOpen(null)
                setShareTarget('')
            }
        } catch (e) { console.error(e) } finally { setIsSharingQuote(false) }
    }


    const handleAddItem = () => {
        setItems([...items, { id: Date.now().toString(), productId: "", description: "", quantity: 1, unitPrice: 0 }])
    }

    const handleRemoveItem = (id: string) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id))
        }
    }

    const handleItemChange = (id: string, field: keyof QuoteItem, value: string | number) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item))
    }

    const selectProduct = (itemId: string, product: Product) => {
        setItems(items.map(item => item.id === itemId ? {
            ...item,
            productId: product.sku || product.id.substring(0, 6),
            description: product.name,
            unitPrice: product.price,
            customImage: product.images ? safeParseArray(product.images)[0] : undefined
        } : item))
        setShowProductList(null)
    }

    const handleImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setItems(items.map(item => item.id === id ? { ...item, customImage: reader.result as string } : item))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleFillTest = () => {
        setClientName("Empresa de Prueba S.A.")
        setClientCity("Quito, Ecuador")
        setClientPhone("0991234567")
        setEmailNotSpecified(true)
        setQuoteSubject("Suministro de Equipos de Prueba para Proyecto Alpha")
        setDiscountPercent(0)
        setItems([
            { id: "1", productId: "SKU-001", description: "Cámara Domo IP 4MP Avanzada", quantity: 5, unitPrice: 120.50, discountPercent: 5 },
            { id: "2", productId: "SKU-002", description: "Grabador NVR 16 Canales 4K", quantity: 1, unitPrice: 350.00, discountPercent: 0 },
            { id: "3", productId: "SRV-001", description: "Instalación y Configuración del Sistema", quantity: 1, unitPrice: 150.00, discountPercent: 10 }
        ])
    }

    const handleSaveClient = async () => {
        if (!clientName.trim() || !clientPhone.trim() || !clientCity.trim()) {
            alert("⚠️ Por favor completa Nombre, Ciudad y Teléfono para guardar al cliente.");
            return;
        }
        setIsSavingClient(true);
        try {
            const res = await fetch("/api/crm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: clientName,
                    city: clientCity,
                    phone: clientPhone,
                    email: emailNotSpecified ? "no@especifica.com" : clientEmail,
                    status: "PROSPECTO",
                    source: "MANUAL"
                })
            });
            if (res.ok) {
                alert("✅ Cliente guardado correctamente en la base de datos.");
            } else {
                alert("❌ Error al guardar el cliente.");
            }
        } catch (e) {
            alert("❌ Error de red al intentar guardar el cliente.");
        } finally {
            setIsSavingClient(false);
        }
    }

    const handleQuickImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setQuickImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleQuickGenerate = async () => {
        if (!quickText.trim()) return;
        setIsExtracting(true)
        setQuickWarning(null)
        setQuickSuccess(false)
        try {
            const res = await fetch("/api/quotes/extract", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: quickText })
            })
            const json = await res.json()
            if (json.success && json.data) {
                const data = json.data
                if (data.clientName) setClientName(data.clientName)
                if (data.clientCity) setClientCity(data.clientCity)
                if (data.clientPhone) setClientPhone(data.clientPhone)
                if (data.quoteSubject) setQuoteSubject(data.quoteSubject)
                
                if (data.items && data.items.length > 0) {
                    const newItems = data.items.map((i: any, index: number) => ({
                        id: `quick-${Date.now()}-${index}`,
                        productId: `GEN-${Math.floor(Math.random() * 1000)}`,
                        description: i.description || "Producto Genérico",
                        quantity: i.quantity || 1,
                        unitPrice: i.unitPrice || 0,
                        customImage: index === 0 && quickImage ? quickImage : undefined
                    }))
                    setItems(newItems)
                }
                
                if (data.missingInfo) {
                    setQuickWarning(data.missingInfo)
                } else {
                    setQuickSuccess(true)
                }
            } else {
                setQuickWarning("Error extrayendo datos. Intenta de nuevo.")
            }
        } catch (e) {
            setQuickWarning("Error de red al conectar con Jarvis.")
        } finally {
            setIsExtracting(false)
        }
    }

    const handleGeneratePDF = async () => {
        const finalEmail = emailNotSpecified ? "no@especifica.com" : clientEmail;
        
        if (!clientName.trim() || !clientPhone.trim() || !clientCity.trim() || !quoteSubject.trim()) {
            alert("⚠️ CAMPOS OBLIGATORIOS: Nombre, Ciudad, Teléfono y Tema de la Cotización.");
            return
        }
        if (!emailNotSpecified && !clientEmail.includes("@")) {
            alert("⚠️ Correo electrónico inválido.");
            return
        }

        try {
            const onlineUrl = getOnlineQuoteUrl(quoteNumber);
            const qrCanvas = (document.getElementById(`atomic-quote-qr-${quoteNumber}`) ||
                              document.getElementById("atomic-quote-qr-canvas")) as HTMLCanvasElement;
            const qrDataUri = qrCanvas ? qrCanvas.toDataURL("image/png") : undefined;

            const pdfData = await generateAtomicUnifiedProposalPDF({
                quoteNumber,
                clientName,
                clientCedula,
                clientPhone,
                clientEmail: finalEmail,
                clientCity,
                deliveryAddress: deliveryAddress || clientCity,
                quoteSubject,
                advisorName,
                advisorPhone: session?.user?.phone || '0999047979',
                items: items.map(i => {
                    const sub = i.quantity * i.unitPrice;
                    const desc = sub * ((i.discountPercent || 0) / 100);
                    const tot = sub - desc;
                    return {
                        sku: i.productId || "SKU-GEN",
                        productId: i.productId,
                        name: i.description,
                        description: i.description,
                        quantity: i.quantity,
                        unitPrice: i.unitPrice,
                        discountPercent: i.discountPercent,
                        discountAmount: desc,
                        total: tot,
                        customImage: i.customImage
                    };
                }),
                specs: quoteSubject,
                warrantyComments: "Garantía oficial de 1 año con soporte técnico y repuestos originales",
                subtotal,
                taxAmount,
                discountAmount: totalDiscountAmount,
                total,
                validityDays: 15,
                qrCodeUrl: onlineUrl,
                qrDataUri
            });

            pdfData.doc.save(pdfData.fileName);

            // Enable immediate sharing option for WhatsApp / mobile apps
            setPostPdfSharePrompt({
                quoteNumber,
                clientName,
                onlineUrl,
                pdfData
            });

            const res = await fetch("/api/quotes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    quoteNumber,
                    clientName,
                    clientEmail: finalEmail,
                    clientPhone,
                    clientCedula,
                    clientCity,
                    city: clientCity,
                    quoteSubject,
                    subtotal,
                    discountPercent,
                    discountAmount: totalDiscountAmount,
                    taxAmount,
                    total,
                    items,
                    status,
                    advisorName,
                    specs: quoteSubject
                })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.nextQuoteNumber) setQuoteNumber(data.nextQuoteNumber);
                if (data.history) setQuoteHistory(data.history);
            }
        } catch (e) {
            console.error("PDF generation or save error:", e);
            alert("Error al generar o guardar la cotización.");
        }
    }

    const handleGenerateExcel = async (quoteDataOverride?: any) => {
        const effClientName = quoteDataOverride ? quoteDataOverride.clientName : clientName;
        if (!effClientName?.trim()) {
            alert("⚠️ Por favor ingresa el nombre del cliente.");
            return;
        }

        const validItems = quoteDataOverride ? quoteDataOverride.items : items.filter(i => i.description.trim() || i.unitPrice > 0);
        if (validItems.length === 0) {
            alert("⚠️ Debes añadir al menos 1 producto para exportar a Excel.");
            return;
        }

        setIsExportingExcel(true);
        try {
            const finalEmail = emailNotSpecified ? "no@especifica.com" : clientEmail;
            const payload = quoteDataOverride || {
                quoteNumber,
                clientName,
                clientCedula,
                clientEmail: finalEmail,
                clientPhone,
                clientCity,
                deliveryAddress: deliveryAddress || clientCity,
                quoteSubject: quoteSubject || "SUMINISTRO E INSTALACIÓN DE EQUIPOS DE SEGURIDAD",
                advisorName,
                items: validItems.map((i: any) => {
                    const sub = i.quantity * i.unitPrice;
                    const desc = sub * ((i.discountPercent || 0) / 100);
                    return {
                        id: i.id,
                        productId: i.productId,
                        sku: i.productId || "SKU-GEN",
                        description: i.description,
                        quantity: Number(i.quantity || 1),
                        unitPrice: Number(i.unitPrice || 0),
                        discountPercent: Number(i.discountPercent || 0),
                        discountAmount: desc,
                        total: sub - desc
                    };
                }),
                subtotal,
                taxAmount,
                discountAmount: totalDiscountAmount,
                total
            };

            const response = await fetch("/api/quotes/export-excel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || "Error al exportar cotización a Excel");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            const contentDisposition = response.headers.get("content-disposition");
            let filename = `${payload.quoteNumber || "PROP"}_${(payload.clientName || "Cliente").replace(/\s+/g, "_")}.xlsx`;
            if (contentDisposition && contentDisposition.includes("filename=")) {
                const match = contentDisposition.match(/filename="?([^"]+)"?/);
                if (match && match[1]) filename = match[1];
            }
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            // Guardar en base de datos si es una nueva emisión
            if (!quoteDataOverride) {
                const res = await fetch("/api/quotes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        quoteNumber,
                        clientName,
                        clientEmail: finalEmail,
                        clientPhone,
                        clientCedula,
                        clientCity,
                        city: clientCity,
                        quoteSubject,
                        subtotal,
                        discountPercent,
                        discountAmount: totalDiscountAmount,
                        taxAmount,
                        total,
                        items,
                        status,
                        advisorName,
                        specs: quoteSubject
                    })
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.nextQuoteNumber) setQuoteNumber(data.nextQuoteNumber);
                    if (data.history) setQuoteHistory(data.history);
                }
            }
        } catch (e: any) {
            console.error("Excel generation error:", e);
            alert(`Error al generar o descargar el archivo Excel: ${e?.message || e}`);
        } finally {
            setIsExportingExcel(false);
        }
    };

    const handleGenerateTicket = async () => {
        if (!clientName.trim() || !clientPhone.trim()) {
            alert("⚠️ CAMPOS OBLIGATORIOS PARA TICKET: Nombre y Teléfono.");
            return
        }

        const doc = new jsPDF({
            unit: "mm",
            format: [80, 200]
        })

        const primaryColor = [15, 23, 42];

        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text("ATOMIC INDUSTRIES", 40, 10, { align: "center" });

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text("Soluciones Tecnológicas e Industriales", 40, 14, { align: "center" });
        doc.text("Quito, Ecuador", 40, 18, { align: "center" });
        
        doc.setFont("helvetica", "bold");
        doc.text("------------------------------------------------------------------", 40, 22, { align: "center" });
        
        doc.text(`TICKET DE ENTREGA`, 40, 26, { align: "center" });
        doc.setFont("helvetica", "normal");
        doc.text(`Doc No.: ${quoteNumber}`, 40, 30, { align: "center" });
        doc.text(`Fecha: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 40, 34, { align: "center" });
        
        doc.setFont("helvetica", "bold");
        doc.text("------------------------------------------------------------------", 40, 38, { align: "center" });
        
        doc.text("CLIENTE:", 5, 43);
        doc.setFont("helvetica", "normal");
        const clientNameLines = doc.splitTextToSize(clientName.toUpperCase(), 70);
        doc.text(clientNameLines, 5, 47);
        let currY = 47 + (clientNameLines.length * 4);
        doc.text(`Telf: ${clientPhone || 'N/A'}`, 5, currY);
        
        currY += 4;
        doc.setFont("helvetica", "bold");
        doc.text("------------------------------------------------------------------", 40, currY, { align: "center" });
        currY += 5;
        
        doc.setFontSize(7);
        doc.text("CANT DESCRIPCION           P.UNIT   TOTAL", 5, currY);
        currY += 4;
        doc.text("---------------------------------------------------------------------------", 40, currY, { align: "center" });
        currY += 4;
        
        doc.setFont("helvetica", "normal");
        items.forEach(item => {
            const itemSub = item.quantity * item.unitPrice;
            const itemDesc = itemSub * ((item.discountPercent || 0) / 100);
            const itemTotal = itemSub - itemDesc;

            doc.text(item.quantity.toString(), 5, currY);
            
            const descLines = doc.splitTextToSize(item.description, 35);
            doc.text(descLines, 15, currY);
            
            doc.text(`$${item.unitPrice.toFixed(2)}`, 55, currY);
            doc.text(`$${itemTotal.toFixed(2)}`, 75, currY, { align: "right" });
            
            currY += (descLines.length * 3) + 1;
            
            if (itemDesc > 0) {
                doc.text(`  Desc: -$${itemDesc.toFixed(2)}`, 15, currY);
                currY += 3;
            }
        });
        
        doc.setFont("helvetica", "bold");
        currY += 1;
        doc.text("------------------------------------------------------------------", 40, currY, { align: "center" });
        currY += 5;
        
        doc.setFontSize(8);
        doc.text("SUBTOTAL:", 35, currY);
        doc.setFont("helvetica", "normal");
        doc.text(`$${subtotal.toFixed(2)}`, 75, currY, { align: "right" });
        currY += 4;

        doc.setFont("helvetica", "bold");
        doc.text("IVA (15%):", 35, currY);
        doc.setFont("helvetica", "normal");
        doc.text(`$${taxAmount.toFixed(2)}`, 75, currY, { align: "right" });
        currY += 4;
        
        if (totalDiscountAmount > 0) {
            doc.setFont("helvetica", "bold");
            doc.text("DESCUENTO:", 35, currY);
            doc.setFont("helvetica", "normal");
            doc.text(`-$${totalDiscountAmount.toFixed(2)}`, 75, currY, { align: "right" });
            currY += 4;
        }

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("TOTAL USD:", 35, currY);
        doc.text(`$${total.toFixed(2)}`, 75, currY, { align: "right" });
        currY += 8;
        
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.text("Gracias por su confianza.", 40, currY, { align: "center" });
        currY += 4;
        doc.text("Este documento es una representacion", 40, currY, { align: "center" });
        currY += 3;
        doc.text("impresa de un comprobante de entrega.", 40, currY, { align: "center" });

        doc.save(`TICKET_${quoteNumber}_${clientName.replace(/\s+/g, "_")}.pdf`)
    }



    return (
        <div className={`${embedded ? "p-4 sm:p-6" : "min-h-screen p-4 sm:p-6 lg:p-8 pb-28"} bg-[#09090b] text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white space-y-5 relative`}>
            
            {/* ── TOP EXECUTIVE COMMAND BAR HEADER (ESTILO PORTAL MAESTRO) ── */}
            <header className="bg-zinc-950/90 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Brand Lockup */}
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-orange-400/40 flex items-center justify-center shadow-inner shrink-0">
                            <span className="text-orange-300 font-mono font-bold text-xs tracking-tight">AT</span>
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-semibold tracking-tight text-white">ATOMIC</span>
                                <span className="text-zinc-600">/</span>
                                <span className="text-xs font-mono uppercase tracking-widest text-orange-300 font-semibold">Cotizador Pro</span>
                                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-full">
                                    {quoteNumber}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                <span className="text-[11px] text-zinc-400">
                                    Formato Oficial ATOMIC · PDF A4, Excel (.xlsx), Ticket POS & Link Online
                                </span>
                            </div>
                        </div>
                    </div>

                    {onCloseModal && (
                        <button
                            type="button"
                            onClick={onCloseModal}
                            className="self-end md:self-auto px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-medium text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                            <X size={14} />
                            <span>Cerrar Cotizador</span>
                        </button>
                    )}
                </div>

                {/* ── BARRA DE ACCIONES EN RECUADRO NARANJA CLARO (MISMO ESTILO QUE PRECIOS VENDEDOR) ── */}
                <div className="p-1.5 rounded-xl bg-zinc-900/70 border border-orange-400/70 shadow-[0_0_15px_rgba(251,146,60,0.08)] flex flex-wrap items-center gap-1.5">
                    <button
                        type="button"
                        onClick={handleGeneratePDF}
                        className="px-3.5 py-2 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-200 border border-orange-400/50 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Exportar cotización en PDF con el formato corporativo oficial idéntico al Excel"
                    >
                        <FileOutput size={14} className="text-orange-400" />
                        <span>Exportar PDF Oficial</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleGenerateExcel()}
                        disabled={isExportingExcel}
                        className="px-3.5 py-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-200 border border-emerald-500/35 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                        title="Exportar formato exacto Excel (.xlsx) con Logo Superior A1:D4 y fórmulas"
                    >
                        {isExportingExcel ? <Loader2 size={14} className="animate-spin text-emerald-400" /> : <FileSpreadsheet size={14} className="text-emerald-400" />}
                        <span>{isExportingExcel ? "Generando..." : "Excel (.xlsx)"}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleShareQuoteNative()}
                        disabled={isNativeSharing}
                        className="px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.09] text-zinc-200 border border-white/[0.08] text-xs font-medium flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                        title="Compartir cotización directamente a WhatsApp, Messenger, Facebook u otras apps"
                    >
                        {isNativeSharing ? <Loader2 size={14} className="animate-spin" /> : <Share2 size={14} className="text-zinc-400" />}
                        <span>{isNativeSharing ? "Preparando..." : "Compartir"}</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleGenerateTicket}
                        className="px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.09] text-zinc-200 border border-white/[0.08] text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                        <FileText size={14} className="text-zinc-400" />
                        <span>Ticket POS</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsHistoryOpen(true)}
                        className="px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.09] text-zinc-200 border border-white/[0.08] text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                        <History size={14} className="text-zinc-400" />
                        <span>Historial ({quoteHistory.length})</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowSalesCopyModal(true)}
                        className="px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.09] text-zinc-200 border border-white/[0.08] text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Abrir mensajes y scripts de bienvenida para Marketplace y WhatsApp"
                    >
                        <MessageSquare size={14} className="text-zinc-400" />
                        <span>Mensajes</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleFillTest}
                        className="ml-auto px-3 py-2 rounded-lg bg-zinc-950/70 hover:bg-zinc-800 text-zinc-400 hover:text-orange-300 border border-white/[0.06] text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Rellenar cotización genérica de prueba"
                    >
                        <Zap size={13} className="text-orange-400" />
                        <span>Prueba</span>
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                
                {/* Left Column: Subject, Client & Items */}
                <div className="lg:col-span-2 space-y-5">
                    
                    {/* Project Subject */}
                    <div className="bg-zinc-900/60 border border-white/[0.08] p-5 rounded-2xl space-y-2 backdrop-blur-sm">
                        <label className="text-[11px] font-mono font-semibold uppercase text-orange-300 tracking-wider flex items-center gap-2">
                            <Briefcase size={13} className="text-orange-400" />
                            <span>Asunto / Tema del Proyecto</span>
                        </label>
                        <input 
                            value={quoteSubject} 
                            onChange={e => setQuoteSubject(e.target.value)} 
                            placeholder="Ej: Implementación de Sistema de Seguridad Perimetral o Equipos..."
                            className="w-full bg-zinc-950/90 border border-white/[0.08] rounded-xl px-4 py-3 text-sm font-medium text-white outline-none focus:border-orange-400/70 transition-colors placeholder:text-zinc-600" 
                        />
                    </div>

                    {/* Client Info */}
                    <div className="bg-zinc-900/60 border border-white/[0.08] p-5 rounded-2xl space-y-4 backdrop-blur-sm relative">
                        <div className="flex flex-wrap justify-between items-center border-b border-white/[0.06] pb-3.5 gap-2">
                            <h2 className="text-xs font-mono font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                                <Building2 className="text-orange-400" size={15} />
                                <span>Datos del Cliente</span>
                            </h2>
                            <button 
                                type="button"
                                onClick={handleSaveClient} 
                                disabled={isSavingClient}
                                className="bg-zinc-950 hover:bg-zinc-800 border border-white/10 text-zinc-200 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                                title="Guardar como nuevo cliente en la base de datos"
                            >
                                {isSavingClient ? <span className="animate-pulse">Guardando...</span> : <><Plus size={13} className="text-emerald-400" /> Guardar Cliente</>}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                            <div className="space-y-1.5 relative">
                                <label className="text-[11px] font-medium text-zinc-400">Razón Social / Nombre *</label>
                                <input 
                                    value={clientName} 
                                    onChange={e => {
                                        setClientName(e.target.value)
                                        setShowClientList(true)
                                    }} 
                                    onFocus={() => setShowClientList(true)}
                                    className="w-full bg-zinc-950/90 border border-white/[0.08] text-white px-3.5 py-2.5 text-xs font-semibold uppercase rounded-xl outline-none focus:border-orange-400/70 transition-colors placeholder:text-zinc-600" 
                                    placeholder="Buscar cliente o escribir nombre..."
                                />
                                {showClientList && clientName && initialClients.length > 0 && (
                                    <div className="absolute top-full left-0 w-full bg-zinc-950 border border-white/15 shadow-2xl rounded-xl z-50 max-h-52 overflow-y-auto mt-1">
                                        <div className="flex justify-between items-center px-3 py-2 border-b border-white/[0.08]">
                                            <span className="text-[10px] font-mono text-zinc-400 uppercase">Coincidencias ({initialClients.filter((c: any) => c.name.toLowerCase().includes(clientName.toLowerCase())).slice(0, 20).length})</span>
                                            <button type="button" onClick={() => setShowClientList(false)} className="text-zinc-400 hover:text-white"><X size={13}/></button>
                                        </div>
                                        {initialClients.filter((c: any) => c.name.toLowerCase().includes(clientName.toLowerCase())).slice(0, 20).map((c: any) => (
                                            <button 
                                                key={c.id} 
                                                type="button"
                                                onClick={() => {
                                                    setClientName(c.name)
                                                    setClientCity(c.city || "")
                                                    setClientPhone(c.phone || "")
                                                    if (c.cedula) setClientCedula(c.cedula)
                                                    if (c.email) {
                                                        setClientEmail(c.email)
                                                        setEmailNotSpecified(false)
                                                    } else {
                                                        setClientEmail("")
                                                        setEmailNotSpecified(true)
                                                    }
                                                    setShowClientList(false)
                                                }} 
                                                className="w-full text-left px-3 py-2.5 hover:bg-zinc-900 border-b border-white/[0.05] flex items-center justify-between group transition-colors cursor-pointer"
                                            >
                                                <div>
                                                    <p className="text-xs font-semibold text-white uppercase">{c.name}</p>
                                                    <p className="text-[10px] text-zinc-400 font-mono mt-0.5">{c.city || "Sin ciudad"} • {c.phone || "Sin tel"}{c.cedula ? ` • CI: ${c.cedula}` : ''}</p>
                                                </div>
                                                <ChevronRight size={13} className="text-zinc-600 group-hover:text-orange-400" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-medium text-zinc-400">Ciudad / Ubicación *</label>
                                <input value={clientCity} onChange={e => setClientCity(e.target.value)} className="w-full bg-zinc-950/90 border border-white/[0.08] text-white px-3.5 py-2.5 text-xs font-semibold uppercase rounded-xl outline-none focus:border-orange-400/70 transition-colors placeholder:text-zinc-600" placeholder="Quito, Guayaquil..." />
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-[11px] font-medium text-zinc-400">Correo Electrónico</label>
                                    <label className="flex items-center gap-1.5 cursor-pointer group">
                                        <input type="checkbox" checked={emailNotSpecified} onChange={e => setEmailNotSpecified(e.target.checked)} className="rounded border-zinc-700 bg-zinc-950 accent-orange-500" />
                                        <span className="text-[10px] text-zinc-400 group-hover:text-zinc-200">Sin correo</span>
                                    </label>
                                </div>
                                <input 
                                    disabled={emailNotSpecified}
                                    value={clientEmail} 
                                    onChange={e => setClientEmail(e.target.value)} 
                                    className={`w-full bg-zinc-950/90 border border-white/[0.08] text-white px-3.5 py-2.5 text-xs font-mono rounded-xl outline-none focus:border-orange-400/70 transition-colors placeholder:text-zinc-600 ${emailNotSpecified ? 'opacity-45 cursor-not-allowed' : ''}`} 
                                    placeholder={emailNotSpecified ? "NO ESPECIFICA" : "correo@empresa.com"}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-medium text-zinc-400">Teléfono / Celular *</label>
                                <input value={clientPhone} onChange={e => setClientPhone(e.target.value)} className="w-full bg-zinc-950/90 border border-white/[0.08] text-white px-3.5 py-2.5 text-xs font-mono rounded-xl outline-none focus:border-orange-400/70 transition-colors placeholder:text-zinc-600" placeholder="099..." />
                            </div>

                            <div className="space-y-1.5 md:col-span-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-[11px] font-medium text-zinc-400">CI / RUC (Identificación)</label>
                                    <span className="text-[10px] font-mono text-zinc-500">Excel Col E7</span>
                                </div>
                                <input 
                                    value={clientCedula} 
                                    onChange={e => setClientCedula(e.target.value)} 
                                    className="w-full bg-zinc-950/90 border border-white/[0.08] text-white px-3.5 py-2.5 text-xs font-mono rounded-xl outline-none focus:border-orange-400/70 transition-colors placeholder:text-zinc-600" 
                                    placeholder="17XXXXXXXX o RUC 13 dígitos" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Products Detail */}
                    <div className="bg-zinc-900/60 border border-white/[0.08] p-5 rounded-2xl space-y-4 backdrop-blur-sm">
                        <div className="flex justify-between items-center border-b border-white/[0.06] pb-3.5">
                            <h2 className="text-xs font-mono font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                                <ShoppingCart className="text-emerald-400" size={15} />
                                <span>Detalle de Ítems ({items.length})</span>
                            </h2>
                            <button
                                type="button"
                                onClick={handleAddItem}
                                className="bg-orange-500/15 hover:bg-orange-500/25 border border-orange-400/40 text-orange-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                                <Plus size={13} /> Añadir Fila
                            </button>
                        </div>
                        
                        {/* Table Header */}
                        <div className="hidden md:flex items-center gap-2.5 px-3.5 py-2.5 bg-zinc-950/90 border border-white/[0.08] rounded-xl text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-wider">
                            <div className="w-11 text-center">Img</div>
                            <div className="w-24">SKU</div>
                            <div className="flex-1">Descripción del Producto</div>
                            <div className="w-14 text-center">Stock</div>
                            <div className="w-20 text-center">Cant.</div>
                            <div className="w-28 text-right">Precio Unit.</div>
                            <div className="w-16 text-center">Desc %</div>
                            <div className="w-24 text-right">Total</div>
                            <div className="w-9"></div>
                        </div>

                        <div className="space-y-2.5">
                            <AnimatePresence mode="popLayout">
                                {items.map((item) => (
                                    <motion.div 
                                        key={item.id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -16 }}
                                        className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5 p-3 bg-zinc-950/80 border border-white/[0.08] rounded-xl group hover:border-orange-400/30 transition-all relative"
                                    >
                                        {/* Image */}
                                        <div className="w-11 h-11 bg-zinc-900 border border-white/[0.08] rounded-lg flex items-center justify-center relative overflow-hidden shrink-0 mx-auto md:mx-0">
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                                title="Añadir/Cambiar imagen"
                                                onChange={(e) => handleImageUpload(item.id, e)}
                                            />
                                            {(() => {
                                                if (item.customImage) {
                                                    return <img src={item.customImage} className="w-full h-full object-contain" alt="preview" />;
                                                }
                                                const product = findProduct(item.productId, item.description);
                                                const images = product?.images;
                                                if (images && images !== 'null') {
                                                    const parsedImages = safeParseArray(images);
                                                    if (parsedImages.length > 0) {
                                                        return <img src={parsedImages[0]} className="w-full h-full object-contain" alt="preview" />;
                                                    }
                                                }
                                                return <ImageIcon size={15} className="text-zinc-600" />;
                                            })()}
                                        </div>

                                        {/* SKU Code */}
                                        <div className="w-full md:w-24 shrink-0">
                                            <label className="md:hidden text-[10px] text-zinc-400 block mb-1">SKU</label>
                                            <input 
                                                value={item.productId} 
                                                readOnly 
                                                className="w-full bg-zinc-900 border border-white/[0.06] text-orange-300 px-2 py-2 text-[11px] font-mono font-semibold uppercase rounded-lg text-center" 
                                                placeholder="SKU" 
                                            />
                                        </div>

                                        {/* Product Description Search */}
                                        <div className="flex-1 min-w-[200px] relative">
                                            <label className="md:hidden text-[10px] text-zinc-400 block mb-1">Descripción</label>
                                            <input 
                                                value={item.description} 
                                                onFocus={() => handleProductFocus(item.id, item.description)}
                                                onChange={e => handleProductSearch(item.id, e.target.value)} 
                                                className="w-full bg-zinc-900 border border-white/[0.08] text-white px-3 py-2 text-xs font-medium rounded-lg outline-none focus:border-orange-400/60 transition-colors" 
                                                placeholder="Buscar producto en catálogo..."
                                            />
                                            {showProductList === item.id && (
                                                <div 
                                                    ref={searchDropdownRef}
                                                    className="absolute top-full left-0 w-full bg-zinc-950 border border-white/15 shadow-2xl rounded-xl z-50 max-h-64 overflow-y-auto mt-1 min-w-[300px] divide-y divide-white/[0.06]"
                                                >
                                                    <div className="px-3 py-1.5 bg-zinc-900 text-[10px] font-mono text-orange-300 flex items-center justify-between sticky top-0 z-10">
                                                        <span>{isSearchingProducts ? "Buscando en catálogo..." : `Resultados (${searchResults.length})`}</span>
                                                        <button 
                                                            type="button" 
                                                            onMouseDown={(e) => { e.preventDefault(); setShowProductList(null); }}
                                                            className="text-zinc-400 hover:text-white"
                                                        >
                                                            <X size={12}/>
                                                        </button>
                                                    </div>
                                                    {searchResults.length === 0 ? (
                                                        <div className="p-4 text-center text-xs text-zinc-500">
                                                            {isSearchingProducts ? "Buscando productos..." : "No se encontraron coincidencias"}
                                                        </div>
                                                    ) : (
                                                        searchResults.slice(0, 25).map((p: Product) => (
                                                            <button 
                                                                key={p.id} 
                                                                type="button"
                                                                onMouseDown={(e) => {
                                                                    e.preventDefault();
                                                                    selectProduct(item.id, p);
                                                                }} 
                                                                className="w-full text-left p-2.5 hover:bg-zinc-900 flex items-center gap-3 transition-colors group cursor-pointer"
                                                            >
                                                                <div className="w-9 h-9 bg-zinc-900 rounded-lg flex-shrink-0 overflow-hidden border border-white/[0.08] flex items-center justify-center">
                                                                    {p.images && safeParseArray(p.images).length > 0 ? (
                                                                        <img src={safeParseArray(p.images)[0]} className="w-full h-full object-contain" alt={p.name} />
                                                                    ) : (
                                                                        <ImageIcon size={14} className="text-zinc-600" />
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-1.5">
                                                                        {p.sku && (
                                                                            <span className="text-[9px] font-mono font-semibold text-orange-300 bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/30 shrink-0">
                                                                                {p.sku}
                                                                            </span>
                                                                        )}
                                                                        <p className="text-xs font-medium text-white truncate group-hover:text-orange-200">{p.name}</p>
                                                                    </div>
                                                                    <p className="text-[10px] text-emerald-400 font-mono mt-0.5">${p.price.toFixed(2)} • Stock: {p.stock || 0}</p>
                                                                </div>
                                                            </button>
                                                        ))
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Stock Badge */}
                                        <div className="w-full md:w-14 text-center shrink-0 flex md:block items-center justify-between">
                                            <span className="md:hidden text-[10px] text-zinc-400">Stock</span>
                                            <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 border border-white/[0.06] px-2 py-1 rounded-lg inline-block">
                                                {findProduct(item.productId, item.description)?.stock || 0}
                                            </span>
                                        </div>

                                        {/* Quantity Input */}
                                        <div className="w-full md:w-20 shrink-0">
                                            <label className="md:hidden text-[10px] text-zinc-400 block mb-1">Cantidad</label>
                                            <input 
                                                type="number" 
                                                min="1"
                                                value={item.quantity === 0 ? '' : item.quantity} 
                                                onChange={e => handleItemChange(item.id, "quantity", parseInt(e.target.value) || 0)} 
                                                className="w-full bg-zinc-900 border border-white/[0.08] text-white px-2 py-2 text-center rounded-lg font-mono font-semibold text-xs outline-none focus:border-orange-400/60" 
                                            />
                                        </div>

                                        {/* Unit Price Input */}
                                        <div className="w-full md:w-28 shrink-0 relative">
                                            <label className="md:hidden text-[10px] text-zinc-400 block mb-1">Precio Unit ($)</label>
                                            <div className="relative flex items-center">
                                                <span className="absolute left-2.5 text-zinc-500 text-xs font-mono">$</span>
                                                <input 
                                                    type="number" 
                                                    step="0.01"
                                                    value={item.unitPrice === 0 ? '' : item.unitPrice} 
                                                    onChange={e => handleItemChange(item.id, "unitPrice", parseFloat(e.target.value) || 0)} 
                                                    className="w-full bg-zinc-900 border border-white/[0.08] py-2 pr-2.5 pl-6 text-right text-emerald-400 rounded-lg font-mono font-semibold text-xs outline-none focus:border-emerald-500/50" 
                                                />
                                            </div>
                                        </div>

                                        {/* Discount % */}
                                        <div className="w-full md:w-16 shrink-0">
                                            <label className="md:hidden text-[10px] text-zinc-400 block mb-1">Desc %</label>
                                            <input 
                                                type="number" 
                                                min="0" 
                                                max="100"
                                                value={item.discountPercent || 0} 
                                                onChange={e => handleItemChange(item.id, "discountPercent", parseFloat(e.target.value) || 0)} 
                                                className="w-full bg-zinc-900 border border-white/[0.08] px-2 py-2 text-center text-orange-300 rounded-lg font-mono font-semibold text-xs outline-none focus:border-orange-400/60" 
                                                title="Descuento individual (%)" 
                                            />
                                        </div>

                                        {/* Item Total */}
                                        <div className="w-full md:w-24 text-right shrink-0 flex md:block items-center justify-between">
                                            <span className="md:hidden text-[10px] text-zinc-400">Total</span>
                                            <span className="text-xs font-bold text-white font-mono block">
                                                ${((item.quantity * item.unitPrice) * (1 - ((item.discountPercent || 0)/100))).toFixed(2)}
                                            </span>
                                        </div>

                                        {/* Remove Action */}
                                        <div className="w-full md:w-9 flex justify-end md:justify-center shrink-0">
                                            <button 
                                                type="button"
                                                onClick={() => handleRemoveItem(item.id)} 
                                                className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                                                title="Eliminar fila"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Right Column: AI Generator & Totals */}
                <div className="lg:col-span-1 space-y-5">
                    
                    {/* Generador Rápido IA */}
                    <div className="bg-zinc-900/60 p-5 rounded-2xl border border-white/[0.08] space-y-3.5 backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-orange-300">
                            <Sparkles size={15} className="text-orange-400" />
                            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider">Generador Rápido con IA</h2>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                            Pega texto desordenado de WhatsApp o notas y auto-completa cliente, productos y valores.
                        </p>
                        <textarea 
                            value={quickText}
                            onChange={(e) => setQuickText(e.target.value)}
                            placeholder="Ej: cotizame a juan perez 2 camaras a 15 y un dvr a 40 para quito su tel es 0999"
                            className="w-full bg-zinc-950/90 border border-white/[0.08] rounded-xl p-3 text-xs text-white placeholder-zinc-600 outline-none focus:border-orange-400/60 min-h-[88px] resize-none"
                        />
                        
                        {quickWarning && (
                            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2 text-amber-300">
                                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                                <p className="text-[11px] leading-tight">{quickWarning}</p>
                            </div>
                        )}

                        <div className="flex gap-2">
                            <button 
                                type="button"
                                onClick={() => quickInputRef.current?.click()}
                                className="flex-1 flex items-center justify-center gap-1.5 bg-zinc-950 border border-white/[0.08] text-zinc-300 text-xs font-medium py-2 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
                            >
                                <Upload size={13} /> {quickImage ? "Imagen Lista" : "Subir Imagen"}
                            </button>
                            <input type="file" accept="image/*" hidden ref={quickInputRef} onChange={handleQuickImageUpload} />
                            
                            <button 
                                type="button"
                                onClick={handleQuickGenerate}
                                disabled={isExtracting || !quickText.trim()}
                                className="flex-1 flex items-center justify-center gap-1.5 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-400/50 text-orange-200 font-semibold text-xs py-2 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                            >
                                {isExtracting ? "Analizando..." : "Auto-Completar"}
                            </button>
                        </div>

                        {quickSuccess && (
                            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2 pt-1">
                                <button 
                                    type="button"
                                    onClick={handleGeneratePDF}
                                    className="w-full flex items-center justify-center gap-2 bg-emerald-500/15 border border-emerald-500/35 text-emerald-200 font-semibold text-xs py-2.5 rounded-xl hover:bg-emerald-500/25 transition-all cursor-pointer"
                                >
                                    <Download size={14} /> Descargar PDF Oficial
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => handleGenerateExcel()}
                                    disabled={isExportingExcel}
                                    className="w-full flex items-center justify-center gap-2 bg-zinc-950 border border-white/10 text-zinc-200 font-semibold text-xs py-2.5 rounded-xl hover:bg-zinc-800 transition-all disabled:opacity-50 cursor-pointer"
                                >
                                    {isExportingExcel ? <Loader2 size={14} className="animate-spin" /> : <FileSpreadsheet size={14} className="text-emerald-400" />}
                                    Descargar Excel (.xlsx)
                                </button>
                            </motion.div>
                        )}
                    </div>

                    {/* Totals Summary */}
                    <div className="bg-zinc-900/75 border border-orange-400/40 p-5 rounded-2xl space-y-5 shadow-xl sticky top-4">
                        <h2 className="text-xs font-mono font-semibold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/[0.06] pb-3.5">
                            <Calculator className="text-orange-400" size={15} />
                            <span>Resumen de Totales</span>
                        </h2>
                        
                        <div className="space-y-3 text-xs">
                            <div className="flex justify-between items-center text-zinc-300">
                                <span>Subtotal</span>
                                <span className="font-mono font-semibold text-white">${subtotal.toFixed(2)}</span>
                            </div>
                            
                            <div className="flex justify-between items-center text-zinc-300">
                                <span className="flex items-center gap-1">Descuento Global <Percent size={12} className="text-zinc-500"/></span>
                                <div className="flex items-center gap-1.5 font-mono">
                                    <input 
                                        type="number" 
                                        min="0" max="100" 
                                        value={discountPercent} 
                                        onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                                        className="w-16 bg-zinc-950 border border-white/[0.08] px-2 py-1 text-right text-orange-300 rounded-lg outline-none focus:border-orange-400/60"
                                    />
                                    <span className="text-zinc-400">%</span>
                                </div>
                            </div>
                            {totalDiscountAmount > 0 && (
                                <div className="flex justify-between items-center text-rose-400 font-mono">
                                    <span>Descontado</span>
                                    <span>-${totalDiscountAmount.toFixed(2)}</span>
                                </div>
                            )}

                            <div className="flex justify-between items-center text-zinc-300">
                                <span>IVA (15%)</span>
                                <span className="font-mono font-semibold text-white">${taxAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/[0.08] flex items-end justify-between">
                            <div>
                                <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Total Liquidación</p>
                                <p className="text-3xl font-bold text-emerald-400 font-mono tracking-tight mt-0.5">
                                    ${total.toFixed(2)}
                                </p>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-300">USD</span>
                        </div>
                        
                        <div className="pt-4 border-t border-white/[0.08] space-y-2.5">
                            <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">Estado Inicial</label>
                            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-zinc-950 border border-white/[0.08]">
                                {["PENDIENTE", "CERRADO", "ABANDONADO"].map(s => (
                                    <button 
                                        key={s} 
                                        type="button"
                                        onClick={() => setStatus(s as any)} 
                                        className={`py-2 px-2 text-[10px] font-mono font-semibold uppercase rounded-lg transition-all cursor-pointer ${
                                            status === s 
                                            ? 'bg-orange-500/20 border border-orange-400/50 text-orange-200' 
                                            : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Sidebar History (Slide-over) */}
            <AnimatePresence>
                {isHistoryOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50"
                            onClick={() => { setIsHistoryOpen(false); setQuoteMenuOpen(null) }}
                        />
                        <motion.div 
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 220 }}
                            className="fixed top-0 right-0 h-full w-full max-w-sm bg-zinc-950 border-l border-white/10 z-[60] flex flex-col shadow-2xl text-zinc-100"
                        >
                            <div className="px-5 py-4 flex justify-between items-center border-b border-white/[0.08] bg-zinc-950">
                                <h3 className="text-xs font-mono font-semibold text-orange-300 uppercase tracking-wider flex items-center gap-2">
                                    <History size={15} className="text-orange-400" /> Historial de Cotizaciones
                                </h3>
                                <button type="button" onClick={() => setIsHistoryOpen(false)} className="p-1.5 text-zinc-400 hover:text-white rounded-lg"><X size={16}/></button>
                            </div>
                            <div className="p-4 overflow-y-auto h-full space-y-3 bg-[#09090b]">
                                {quoteHistory.length === 0 ? (
                                    <p className="text-xs text-zinc-500 text-center py-12">Sin cotizaciones recientes en tu historial.</p>
                                ) : quoteHistory.map((q: any) => (
                                    <div key={q.id} className="p-4 bg-zinc-900/70 border border-white/[0.08] rounded-xl hover:border-orange-400/40 transition-all group relative">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-mono font-semibold text-orange-300 bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 rounded-full">{q.quoteNumber}</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[10px] text-zinc-400 font-mono">{new Date(q.createdAt).toLocaleDateString()}</span>
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); handleOSShareQuote(q); }}
                                                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                                                    title="Compartir"
                                                >
                                                    <Share2 size={12} />
                                                </button>
                                                <div className="relative">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); setQuoteMenuOpen(quoteMenuOpen === q.id ? null : q.id) }}
                                                        className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                                                    >
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                                            <circle cx="12" cy="5" r="2.2"/><circle cx="12" cy="12" r="2.2"/><circle cx="12" cy="19" r="2.2"/>
                                                        </svg>
                                                    </button>
                                                    {quoteMenuOpen === q.id && (
                                                        <AnimatePresence>
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.9, y: -5 }}
                                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                exit={{ opacity: 0, scale: 0.9 }}
                                                                className="absolute right-0 top-8 w-56 bg-zinc-950 border border-white/15 rounded-xl shadow-2xl z-50 overflow-hidden"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <div className="px-3 py-2 border-b border-white/[0.08]">
                                                                    <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">Opciones</p>
                                                                </div>
                                                                {[
                                                                    { icon: '⬇️', label: 'Descargar PDF', action: () => handleDownloadQuotePDF(q) },
                                                                    { icon: '📗', label: 'Descargar Excel (.xlsx)', action: () => handleDownloadQuoteExcel(q) },
                                                                    { icon: '📲', label: 'Compartir (WhatsApp / Apps)', action: () => handleOSShareQuote(q) },
                                                                    { icon: '👤', label: 'Compartir a Perfil…', action: () => { setShareModalOpen(q); setQuoteMenuOpen(null) } },
                                                                    { icon: '✏️', label: 'Editar (nombre + productos)', action: () => handleLoadQuoteMode(q, 'full') },
                                                                    { icon: '🏷️', label: 'Editar (solo cliente)', action: () => handleLoadQuoteMode(q, 'name_only') },
                                                                    { icon: '📦', label: 'Editar (solo productos)', action: () => handleLoadQuoteMode(q, 'products_only') },
                                                                ].map((opt, i) => (
                                                                    <button key={i} type="button" onClick={opt.action}
                                                                        className="w-full text-left px-3.5 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white transition-colors flex items-center gap-2">
                                                                        <span className="text-xs">{opt.icon}</span>
                                                                        <span>{opt.label}</span>
                                                                    </button>
                                                                ))}
                                                            </motion.div>
                                                        </AnimatePresence>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-xs font-semibold text-white uppercase tracking-tight line-clamp-1 mb-2">{q.clientName}</p>
                                        <div className="flex justify-between items-end mt-3">
                                            <span className="text-[10px] font-mono px-2 py-0.5 bg-zinc-950 text-zinc-300 rounded-full border border-white/[0.08]">{q.status}</span>
                                            <p className="text-sm font-bold font-mono text-emerald-400">${q.total?.toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Share Quote Modal */}
            <AnimatePresence>
                {shareModalOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[70]"
                            onClick={() => setShareModalOpen(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed inset-0 z-[80] flex items-center justify-center p-4">
                            <div className="bg-zinc-950 border border-white/15 rounded-2xl p-5 shadow-2xl max-w-sm w-full">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                                        <span>👤</span> Compartir Cotización
                                    </h3>
                                    <button type="button" onClick={() => setShareModalOpen(null)} className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400"><X size={15}/></button>
                                </div>
                                <p className="text-xs text-zinc-400 mb-4">
                                    Enviar <span className="text-orange-300 font-mono font-semibold">{shareModalOpen?.quoteNumber}</span> al historial de otro perfil
                                </p>
                                <div className="space-y-3 mb-4">
                                    <button type="button" onClick={() => setShareTarget('todos')}
                                        className={`w-full py-2 px-3.5 rounded-xl text-xs font-medium transition-all border ${shareTarget === 'todos' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-zinc-900 border-white/10 text-zinc-300 hover:border-white/20'}`}>
                                        📢 Enviar a TODOS los perfiles
                                    </button>
                                    <div className="border-t border-white/[0.08] pt-3">
                                        <p className="text-[10px] font-mono text-zinc-400 mb-2 uppercase tracking-wider">O enviar a perfil específico</p>
                                        <div className="space-y-1.5 max-h-44 overflow-y-auto">
                                            {systemUsers.filter((u: any) => u.email !== session?.user?.email).map((u: any) => (
                                                <button key={u.id} type="button" onClick={() => setShareTarget(u.email)}
                                                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all border ${shareTarget === u.email ? 'bg-orange-500/20 border-orange-400/50 text-orange-200' : 'bg-zinc-900 border-white/[0.06] text-zinc-300 hover:border-white/15'}`}>
                                                    <span className="text-zinc-500 mr-1.5 text-[10px] font-mono">{u.role}</span>
                                                    {u.name || u.email}
                                                </button>
                                            ))}
                                            {systemUsers.length === 0 && (
                                                <p className="text-[11px] text-zinc-500 py-2 text-center">Cargando perfiles...</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button type="button" onClick={() => handleShareQuote(shareModalOpen)} disabled={!shareTarget || isSharingQuote}
                                    className="w-full py-2.5 bg-orange-500 hover:bg-orange-400 text-zinc-950 font-bold rounded-xl text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors">
                                    {isSharingQuote ? <Loader2 size={14} className="animate-spin"/> : <Send size={14}/>}
                                    {isSharingQuote ? 'Compartiendo...' : 'Compartir Cotización'}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Prompt de Compartición Rápida después de Generar PDF */}
            <AnimatePresence>
                {postPdfSharePrompt && (
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.95 }}
                        className="fixed bottom-6 right-6 z-[95] max-w-sm w-full bg-zinc-950/95 border border-orange-400/50 backdrop-blur-xl p-5 rounded-2xl shadow-2xl flex flex-col gap-3"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                                    <CheckCircle2 size={18} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-white">¡PDF Generado con Éxito!</h4>
                                    <p className="text-[11px] font-mono text-zinc-300">
                                        Cotización <span className="text-orange-300 font-semibold">{postPdfSharePrompt.quoteNumber}</span>
                                    </p>
                                </div>
                            </div>
                            <button 
                                type="button"
                                onClick={() => setPostPdfSharePrompt(null)}
                                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                            >
                                <X size={15} />
                            </button>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                            ¿Deseas compartirla directamente a WhatsApp, Messenger o aplicaciones de tu teléfono?
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                            <button
                                type="button"
                                onClick={() => {
                                    const target = postPdfSharePrompt;
                                    setPostPdfSharePrompt(null);
                                    handleShareQuoteNative({ quoteNumber: target.quoteNumber, clientName: target.clientName });
                                }}
                                className="flex-1 py-2 px-4 bg-orange-500 hover:bg-orange-400 text-zinc-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
                            >
                                <Share2 size={14} /> Compartir Ahora
                            </button>
                            <button
                                type="button"
                                onClick={() => setPostPdfSharePrompt(null)}
                                className="py-2 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-xs rounded-xl transition-all"
                            >
                                Listo
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal de Compartición Multipropósito (WhatsApp, Messenger, Facebook, Telegram) */}
            <AnimatePresence>
                {externalShareModalData && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
                            onClick={() => setExternalShareModalData(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 16 }}
                            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
                        >
                            <div className="bg-zinc-950 border border-white/15 rounded-2xl p-6 shadow-2xl max-w-md w-full pointer-events-auto flex flex-col gap-4 text-white max-h-[90vh] overflow-y-auto">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-orange-300">
                                            <Share2 size={18} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-white">Compartir Cotización Oficial</h3>
                                            <p className="text-xs text-orange-300 font-mono">
                                                {externalShareModalData.quoteNumber} • {externalShareModalData.clientName}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setExternalShareModalData(null)}
                                        className="p-1.5 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="bg-zinc-900/70 border border-white/[0.08] rounded-xl p-4 text-xs space-y-2.5">
                                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <Sparkles size={12} className="text-orange-400" /> Mensaje Oficial Configurado:
                                    </span>
                                    <p className="text-zinc-300 whitespace-pre-line leading-relaxed italic bg-zinc-950 p-3 rounded-lg border border-white/[0.06]">
                                        "{externalShareModalData.shareText}"
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            navigator.clipboard.writeText(externalShareModalData.shareText);
                                            setIsCopiedShare(true);
                                            setTimeout(() => setIsCopiedShare(false), 2500);
                                        }}
                                        className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs rounded-lg flex items-center justify-center gap-2 transition-colors border border-white/10"
                                    >
                                        {isCopiedShare ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                        {isCopiedShare ? "¡Mensaje y Link Copiados!" : "Copiar Mensaje y Enlace Oficial"}
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                                        Escoger Aplicación de Envío:
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <a
                                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(externalShareModalData.shareText)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-emerald-300 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
                                        >
                                            <span>💬</span> WhatsApp
                                        </a>
                                        <a
                                            href={`https://www.facebook.com/dialog/send?link=${encodeURIComponent(externalShareModalData.onlineUrl)}&app_id=291494419107518&redirect_uri=${encodeURIComponent(externalShareModalData.onlineUrl)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2.5 bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/35 text-blue-300 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
                                        >
                                            <span>⚡</span> Messenger
                                        </a>
                                        <a
                                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(externalShareModalData.onlineUrl)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2.5 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/35 text-indigo-300 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
                                        >
                                            <span>📘</span> Facebook
                                        </a>
                                        <a
                                            href={`https://t.me/share/url?url=${encodeURIComponent(externalShareModalData.onlineUrl)}&text=${encodeURIComponent(externalShareModalData.shareText)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2.5 bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/35 text-sky-300 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
                                        >
                                            <span>✈️</span> Telegram
                                        </a>
                                    </div>
                                </div>

                                <div className="border-t border-white/[0.08] pt-3 flex items-center gap-2">
                                    <a
                                        href={externalShareModalData.onlineUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 py-2 px-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-medium text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-white/10"
                                    >
                                        <ExternalLink size={14} /> Ver en Línea
                                    </a>
                                    {externalShareModalData.pdfBlob && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const url = window.URL.createObjectURL(externalShareModalData.pdfBlob);
                                                const a = document.createElement("a");
                                                a.href = url;
                                                a.download = externalShareModalData.fileName || `Cotizacion_${externalShareModalData.quoteNumber}.pdf`;
                                                document.body.appendChild(a);
                                                a.click();
                                                window.URL.revokeObjectURL(url);
                                                document.body.removeChild(a);
                                            }}
                                            className="flex-1 py-2 px-3 bg-orange-500 hover:bg-orange-400 text-zinc-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
                                        >
                                            <Download size={14} /> Descargar PDF
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Modal de Mensajes para Copiar y Pegar (Scripts Marketplace & WhatsApp) */}
            <AnimatePresence>
                {showSalesCopyModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowSalesCopyModal(false)}
                            className="fixed inset-0 bg-black/75 backdrop-blur-md z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-4 sm:inset-8 md:inset-12 lg:inset-16 max-w-5xl mx-auto my-auto bg-white rounded-2xl z-50 overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]"
                        >
                            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-center text-orange-600">
                                        <MessageSquare size={16} />
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                                        Scripts de Ventas & Marketplace (ATOMIC ERP)
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowSalesCopyModal(false)}
                                    className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-white">
                                <SalesCopyManager onClose={() => setShowSalesCopyModal(false)} />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Elementos canvas ocultos para generación y extracción instantánea de QR */}
            <div 
                aria-hidden="true" 
                style={{ position: 'fixed', left: '-9999px', top: '-9999px', opacity: 0, pointerEvents: 'none' }}
            >
                <QRCodeCanvas
                    id="atomic-quote-qr-canvas"
                    value={getOnlineQuoteUrl(quoteNumber)}
                    size={256}
                    level="M"
                    marginSize={1}
                />
                <QRCodeCanvas
                    id={`atomic-quote-qr-${quoteNumber}`}
                    value={getOnlineQuoteUrl(quoteNumber)}
                    size={256}
                    level="M"
                    marginSize={1}
                />
                {quoteHistory.map((q: any) => (
                    <QRCodeCanvas
                        key={q.quoteNumber || q.id}
                        id={`atomic-quote-qr-${q.quoteNumber}`}
                        value={getOnlineQuoteUrl(q.quoteNumber)}
                        size={256}
                        level="M"
                        marginSize={1}
                    />
                ))}
            </div>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────────────
// Helper functions (injected into component scope via module-level)
// These are referenced inside the component via closures
// ─────────────────────────────────────────────────────────────────────────
