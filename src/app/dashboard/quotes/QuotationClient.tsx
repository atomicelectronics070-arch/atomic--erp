"use client"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Plus, Trash2, FileOutput, Calculator, Image as ImageIcon, 
    User, ShieldCheck, Mail, Phone, MapPin, 
    MessageSquare, History, X, ChevronRight,
    Briefcase, Save, Clock, Search, CheckCircle2,
    FileText, Zap, Building2, Tag, Percent, ShoppingCart, Wand2, Upload, AlertTriangle, Download, Sparkles,
    Send, Loader2
} from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { calculateDiscountedPrice } from "@/lib/utils/pricing"
import { generateAtomicUnifiedProposalPDF } from "@/lib/pdf/quotePdfGenerator"

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
}

export default function QuotationClient({ initialProducts, initialHistory, initialClients, nextNumber, session }: QuotationClientProps) {
    const [clientName, setClientName] = useState("")
    const [clientEmail, setClientEmail] = useState("")
    const [emailNotSpecified, setEmailNotSpecified] = useState(false)
    const [clientPhone, setClientPhone] = useState("")
    const [clientCity, setClientCity] = useState("")
    const [showClientList, setShowClientList] = useState(false)
    const [isSavingClient, setIsSavingClient] = useState(false)
    const [quoteSubject, setQuoteSubject] = useState("")
    const [deliveryAddress, setDeliveryAddress] = useState("")
    const [quoteNumber, setQuoteNumber] = useState(nextNumber)

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlClient = params.get('client');
        const urlSubject = params.get('subject');
        if (urlClient) setClientName(urlClient);
        if (urlSubject) setQuoteSubject(urlSubject);
        // Fetch system users for the share modal
        fetch('/api/admin/manage-users').then(r => r.json()).then(d => { if (d.users) setSystemUsers(d.users) }).catch(() => {})
    }, []);
    const [advisorName, setAdvisorName] = useState(session.user?.name?.toUpperCase() || "ASESOR ATOMIC")

    const [items, setItems] = useState<QuoteItem[]>([
        { id: "1", productId: "", description: "", quantity: 1, unitPrice: 0 }
    ])

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
                const parsedItems = safeParseArray(q.items)
                if (parsedItems.length > 0) setItems(parsedItems)
            }
        }
        setIsHistoryOpen(false)
        setQuoteMenuOpen(null)
    }

    const handleDownloadQuotePDF = async (q: any) => {
        setQuoteMenuOpen(null)
        try {
            const parsedItems = safeParseArray(q.items)
            const itemDiscount = parsedItems.reduce((acc: number, item: any) => acc + (item.quantity * item.unitPrice * ((item.discountPercent || 0) / 100)), 0)
            const rawSubtotal = parsedItems.reduce((acc: number, item: any) => acc + (item.quantity * item.unitPrice), 0)
            const globalDisc = (rawSubtotal - itemDiscount) * ((q.discountPercent || 0) / 100)
            const taxable = rawSubtotal - itemDiscount - globalDisc
            const tax = taxable * 0.15
            await generateAtomicUnifiedProposalPDF({
                quoteNumber: q.quoteNumber,
                clientName: q.clientName || '',
                clientPhone: q.clientPhone || '',
                clientCity: q.city || '',
                clientEmail: q.clientEmail || '',
                quoteSubject: q.quoteSubject || '',
                advisorName: session?.user?.name?.toUpperCase() || 'ATOMIC',
                items: parsedItems,
                subtotal: rawSubtotal,
                tax,
                total: q.total || (taxable + tax),
                discountPercent: q.discountPercent || 0,
                totalDiscountAmount: itemDiscount + globalDisc,
                status: q.status || 'PENDIENTE',
                deliveryAddress: q.deliveryAddress || ''
            })
        } catch (e) { console.error('PDF download error:', e) }
    }

    const handleOSShareQuote = (q: any) => {
        setQuoteMenuOpen(null)
        const text = `Cotización ${q.quoteNumber} | Cliente: ${q.clientName} | Total: $${q.total?.toFixed(2)} | Estado: ${q.status}`
        if (typeof navigator !== 'undefined' && navigator.share) {
            navigator.share({ title: `Cotización ${q.quoteNumber} – Atomic`, text, url: window.location.href }).catch(() => {})
        } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => alert('📋 Copiado al portapapeles')).catch(() => {})
        }
    }

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
            const pdfData = await generateAtomicUnifiedProposalPDF({
                quoteNumber,
                clientName,
                clientPhone,
                clientEmail: finalEmail,
                clientCity,
                deliveryAddress: deliveryAddress || clientCity,
                quoteSubject,
                advisorName,
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
                validityDays: 15
            });

            pdfData.doc.save(pdfData.fileName);

            const res = await fetch("/api/quotes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    quoteNumber,
                    clientName,
                    clientEmail: finalEmail,
                    clientPhone,
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

    const handleShareQuote = async (quote: any) => {
        if (!shareTarget || isSharingQuote) return
        setIsSharingQuote(true)
        try {
            const res = await fetch('/api/quotes/share', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    quoteId: quote.id,
                    targetEmail: shareTarget,
                    senderName: session?.user?.name || 'Atomic'
                })
            })
            const data = await res.json()
            if (data.success) {
                setShareModalOpen(null)
                setShareTarget('')
            }
        } catch (e) { console.error(e) } finally { setIsSharingQuote(false) }
    }

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
                const parsedItems = safeParseArray(q.items)
                if (parsedItems.length > 0) setItems(parsedItems)
            }
        }
        setIsHistoryOpen(false)
        setQuoteMenuOpen(null)
    }

    const handleDownloadPDF = async (q: any) => {
        setQuoteMenuOpen(null)
        try {
            const parsedItems = safeParseArray(q.items)
            await generateAtomicUnifiedProposalPDF({
                quoteNumber: q.quoteNumber,
                clientName: q.clientName || '',
                clientPhone: q.clientPhone || '',
                clientCity: q.city || '',
                clientEmail: q.clientEmail || '',
                quoteSubject: q.quoteSubject || '',
                advisorName: session?.user?.name?.toUpperCase() || 'ATOMIC',
                items: parsedItems,
                subtotal: q.subtotal || q.total || 0,
                tax: q.tax || 0,
                total: q.total || 0,
                discountPercent: q.discountPercent || 0,
                totalDiscountAmount: 0,
                status: q.status || 'PENDIENTE',
                deliveryAddress: q.deliveryAddress || ''
            })
        } catch (e) { console.error('PDF Error:', e) }
    }

    const handleOSShare = (q: any) => {
        setQuoteMenuOpen(null)
        if (navigator.share) {
            navigator.share({
                title: `Cotización ${q.quoteNumber} - ${q.clientName}`,
                text: `Propuesta Comercial Atomic: ${q.quoteNumber} para ${q.clientName} | Total: $${q.total?.toFixed(2)}`,
                url: window.location.href
            }).catch(() => {})
        } else {
            navigator.clipboard.writeText(`Cotización ${q.quoteNumber} | Cliente: ${q.clientName} | Total: $${q.total?.toFixed(2)}`)
        }
    }

    return (
        <div className="min-h-screen bg-[#030712] text-slate-100 font-sans pb-32 space-y-8 p-6 lg:p-10 rounded-3xl border border-slate-800/80 shadow-2xl relative overflow-hidden">
            
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
            <div className="bg-slate-900/90 border border-slate-800/80 p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_25px_rgba(99,102,241,0.4)] shrink-0">
                        <FileText size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                            <span>Cotizador Empresarial Pro</span>
                            <span className="px-3 py-1 text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-full">
                                CYBERPUNK v4.0
                            </span>
                        </h1>
                        <p className="text-xs text-slate-400 font-medium flex items-center gap-2 mt-1">
                            Doc N°: <span className="text-cyan-400 font-bold font-mono">{quoteNumber}</span> • Emisión instantánea en PDF A4 & Ticket
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button 
                        onClick={handleFillTest}
                        className="px-4 py-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 font-mono font-bold text-xs rounded-2xl transition-all flex items-center gap-2"
                        title="Rellenar cotización genérica de prueba"
                    >
                        <Zap size={15}/> Prueba
                    </button>
                    <button 
                        onClick={() => setIsHistoryOpen(true)} 
                        className="px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-300 hover:text-white font-mono font-bold text-xs rounded-2xl transition-all flex items-center gap-2"
                    >
                        <History size={15}/> Historial
                    </button>
                    <button 
                        onClick={handleGeneratePDF}
                        className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                    >
                        <FileOutput size={15} /> Exportar PDF A4
                    </button>
                    <button 
                        onClick={handleGenerateTicket}
                        className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                    >
                        <FileOutput size={15} /> Ticket POS
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Form & Items */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Project Subject */}
                    <div className="bg-slate-900/90 border border-indigo-500/30 p-6 rounded-3xl shadow-xl space-y-2">
                        <label className="text-[10px] font-mono font-bold uppercase text-indigo-400 tracking-wider flex items-center gap-2">
                            <Briefcase size={14} /> Asunto / Tema del Proyecto
                        </label>
                        <input 
                            value={quoteSubject} 
                            onChange={e => setQuoteSubject(e.target.value)} 
                            placeholder="Ej: Implementación de Sistema de Seguridad Perimetral..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-base font-bold text-white outline-none focus:border-indigo-500/50 transition-colors placeholder:text-slate-600" 
                        />
                    </div>

                    {/* Client Info */}
                    <div className="bg-slate-900/90 border border-slate-800/80 p-6 lg:p-8 rounded-3xl space-y-6 shadow-xl relative">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                            <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                                <Building2 className="text-cyan-400" size={18} /> Datos del Cliente
                            </h2>
                            <button 
                                onClick={handleSaveClient} 
                                disabled={isSavingClient}
                                className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 px-4 py-2 rounded-2xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
                                title="Guardar como nuevo cliente en la base de datos"
                            >
                                {isSavingClient ? <span className="animate-pulse">Guardando...</span> : <><Plus size={14} /> Guardar Cliente</>}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 relative">
                                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Razón Social / Nombre</label>
                                <input 
                                    value={clientName} 
                                    onChange={e => {
                                        setClientName(e.target.value)
                                        setShowClientList(true)
                                    }} 
                                    onFocus={() => setShowClientList(true)}
                                    className="w-full bg-slate-950 border border-slate-800 text-white p-3.5 text-xs font-bold font-mono uppercase rounded-2xl outline-none focus:border-cyan-500/50 transition-colors" 
                                    placeholder="Buscar cliente existente..."
                                />
                                {showClientList && clientName && (
                                    <div className="absolute top-full left-0 w-full bg-slate-950 border border-slate-800 shadow-2xl rounded-2xl z-50 max-h-52 overflow-y-auto mt-1">
                                        <div className="flex justify-between items-center p-3 border-b border-slate-800">
                                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Coincidencias ({initialClients.filter((c: any) => c.name.toLowerCase().includes(clientName.toLowerCase())).slice(0, 20).length})</span>
                                            <button onClick={() => setShowClientList(false)} className="text-slate-400 hover:text-white"><X size={14}/></button>
                                        </div>
                                        {initialClients.filter((c: any) => c.name.toLowerCase().includes(clientName.toLowerCase())).slice(0, 20).map((c: any) => (
                                            <button 
                                                key={c.id} 
                                                onClick={() => {
                                                    setClientName(c.name)
                                                    setClientCity(c.city || "")
                                                    setClientPhone(c.phone || "")
                                                    if (c.email) {
                                                        setClientEmail(c.email)
                                                        setEmailNotSpecified(false)
                                                    } else {
                                                        setClientEmail("")
                                                        setEmailNotSpecified(true)
                                                    }
                                                    setShowClientList(false)
                                                }} 
                                                className="w-full text-left p-3 hover:bg-slate-900 border-b border-slate-800/60 flex items-center justify-between group transition-colors"
                                            >
                                                <div>
                                                    <p className="text-xs font-bold text-white uppercase">{c.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{c.city || "Sin ciudad"} • {c.phone || "Sin tel"}</p>
                                                </div>
                                                <ChevronRight size={14} className="text-slate-600 group-hover:text-cyan-400" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Ciudad / Ubicación</label>
                                <input value={clientCity} onChange={e => setClientCity(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white p-3.5 text-xs font-bold font-mono uppercase rounded-2xl outline-none focus:border-cyan-500/50 transition-colors" placeholder="Quito, Guayaquil..." />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Correo Electrónico</label>
                                    <label className="flex items-center gap-1.5 cursor-pointer group">
                                        <input type="checkbox" checked={emailNotSpecified} onChange={e => setEmailNotSpecified(e.target.checked)} className="rounded border-slate-700 bg-slate-950 text-cyan-400" />
                                        <span className="text-[9px] font-mono font-bold text-slate-400 group-hover:text-slate-200 uppercase">Sin correo</span>
                                    </label>
                                </div>
                                <input 
                                    disabled={emailNotSpecified}
                                    value={clientEmail} 
                                    onChange={e => setClientEmail(e.target.value)} 
                                    className={`w-full bg-slate-950 border border-slate-800 text-white p-3.5 text-xs font-bold font-mono rounded-2xl outline-none focus:border-cyan-500/50 transition-colors ${emailNotSpecified ? 'opacity-50 cursor-not-allowed' : ''}`} 
                                    placeholder={emailNotSpecified ? "NO ESPECIFICA" : "correo@empresa.com"}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Teléfono / Celular</label>
                                <input value={clientPhone} onChange={e => setClientPhone(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white p-3.5 text-xs font-bold font-mono rounded-2xl outline-none focus:border-cyan-500/50 transition-colors" placeholder="099..." />
                            </div>
                        </div>
                    </div>

                    {/* Products Detail */}
                    <div className="bg-slate-900/90 border border-slate-800/80 p-6 lg:p-8 rounded-3xl space-y-6 shadow-xl">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                            <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                                <ShoppingCart className="text-emerald-400" size={18} /> Detalle de Ítems
                            </h2>
                            <button onClick={handleAddItem} className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 px-4 py-2 rounded-2xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all">
                                <Plus size={14} /> Añadir Fila
                            </button>
                        </div>
                        
                        {/* Table Header */}
                        <div className="hidden md:flex items-center gap-3 px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                            <div className="w-12 text-center">Img</div>
                            <div className="w-24">SKU</div>
                            <div className="flex-1">Descripción del Producto</div>
                            <div className="w-16 text-center">Stock</div>
                            <div className="w-24 text-center">Cant.</div>
                            <div className="w-32 text-right">Precio Unit.</div>
                            <div className="w-20 text-center">Desc %</div>
                            <div className="w-28 text-right">Total</div>
                            <div className="w-10"></div>
                        </div>

                        <div className="space-y-3">
                            <AnimatePresence mode="popLayout">
                                {items.map((item) => (
                                    <motion.div 
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="flex flex-col md:flex-row items-stretch md:items-center gap-3 p-3.5 bg-slate-950 border border-slate-800 rounded-2xl group hover:border-slate-700 transition-all relative"
                                    >
                                        {/* Image */}
                                        <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center relative overflow-hidden shrink-0 mx-auto md:mx-0">
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
                                                return <ImageIcon size={16} className="text-slate-600" />;
                                            })()}
                                        </div>

                                        {/* SKU Code */}
                                        <div className="w-full md:w-24 shrink-0">
                                            <label className="md:hidden text-[9px] font-mono font-bold text-slate-400 block mb-1">CÓDIGO SKU</label>
                                            <input 
                                                value={item.productId} 
                                                readOnly 
                                                className="w-full bg-slate-900 border border-slate-800 text-cyan-300 p-2 text-xs font-mono font-bold uppercase rounded-xl text-center" 
                                                placeholder="SKU" 
                                            />
                                        </div>

                                        {/* Product Description Search */}
                                        <div className="flex-1 min-w-[220px] relative">
                                            <label className="md:hidden text-[9px] font-mono font-bold text-slate-400 block mb-1">DESCRIPCIÓN</label>
                                            <input 
                                                value={item.description} 
                                                onFocus={() => handleProductFocus(item.id, item.description)}
                                                onChange={e => handleProductSearch(item.id, e.target.value)} 
                                                className="w-full bg-slate-900 border border-slate-800 text-white p-2.5 text-xs font-bold rounded-xl outline-none focus:border-cyan-500/50 transition-colors" 
                                                placeholder="Buscar producto..."
                                            />
                                            {showProductList === item.id && (
                                                <div 
                                                    ref={searchDropdownRef}
                                                    className="absolute top-full left-0 w-full bg-slate-950 border border-slate-800 shadow-2xl rounded-2xl z-50 max-h-64 overflow-y-auto mt-1 min-w-[300px] divide-y divide-slate-800/60"
                                                >
                                                    <div className="px-3 py-1.5 bg-slate-900/90 text-[10px] font-mono font-bold text-cyan-400 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
                                                        <span>{isSearchingProducts ? "🔍 Buscando en 9,600+ productos..." : `Resultados (${searchResults.length})`}</span>
                                                        <button 
                                                            type="button" 
                                                            onMouseDown={(e) => { e.preventDefault(); setShowProductList(null); }}
                                                            className="text-slate-400 hover:text-white"
                                                        >
                                                            <X size={12}/>
                                                        </button>
                                                    </div>
                                                    {searchResults.length === 0 ? (
                                                        <div className="p-4 text-center text-xs text-slate-500 font-mono">
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
                                                                className="w-full text-left p-3 hover:bg-slate-900 border-b border-slate-800 flex items-center gap-3 transition-colors group cursor-pointer"
                                                            >
                                                                <div className="w-9 h-9 bg-slate-900 rounded-lg flex-shrink-0 overflow-hidden border border-slate-800 flex items-center justify-center">
                                                                    {p.images && safeParseArray(p.images).length > 0 ? (
                                                                        <img src={safeParseArray(p.images)[0]} className="w-full h-full object-contain" alt={p.name} />
                                                                    ) : (
                                                                        <ImageIcon size={14} className="text-slate-600" />
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-1.5">
                                                                        {p.sku && (
                                                                            <span className="text-[9px] font-mono font-bold text-cyan-300 bg-cyan-950/80 px-1 py-0.5 rounded border border-cyan-800/40 shrink-0">
                                                                                {p.sku}
                                                                            </span>
                                                                        )}
                                                                        <p className="text-xs font-bold text-white truncate group-hover:text-cyan-200">{p.name}</p>
                                                                    </div>
                                                                    <p className="text-[10px] text-cyan-400 font-mono mt-0.5">${p.price.toFixed(2)} • Stock: {p.stock || 0}</p>
                                                                </div>
                                                            </button>
                                                        ))
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Stock Badge */}
                                        <div className="w-full md:w-16 text-center shrink-0 flex md:block items-center justify-between">
                                            <span className="md:hidden text-[9px] font-mono font-bold text-slate-400">STOCK</span>
                                            <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg inline-block">
                                                {findProduct(item.productId, item.description)?.stock || 0}
                                            </span>
                                        </div>

                                        {/* Quantity Input */}
                                        <div className="w-full md:w-24 shrink-0">
                                            <label className="md:hidden text-[9px] font-mono font-bold text-slate-400 block mb-1">CANTIDAD</label>
                                            <input 
                                                type="number" 
                                                min="1"
                                                value={item.quantity === 0 ? '' : item.quantity} 
                                                onChange={e => handleItemChange(item.id, "quantity", parseInt(e.target.value) || 0)} 
                                                className="w-full bg-slate-900 border border-slate-800 text-white p-2.5 text-center rounded-xl font-mono font-black text-xs outline-none focus:border-cyan-500/50" 
                                            />
                                        </div>

                                        {/* Unit Price Input */}
                                        <div className="w-full md:w-32 shrink-0 relative">
                                            <label className="md:hidden text-[9px] font-mono font-bold text-slate-400 block mb-1">PRECIO UNIT ($)</label>
                                            <div className="relative flex items-center">
                                                <span className="absolute left-3 text-slate-500 text-xs font-bold">$</span>
                                                <input 
                                                    type="number" 
                                                    step="0.01"
                                                    value={item.unitPrice === 0 ? '' : item.unitPrice} 
                                                    onChange={e => handleItemChange(item.id, "unitPrice", parseFloat(e.target.value) || 0)} 
                                                    className="w-full bg-slate-900 border border-slate-800 p-2.5 pl-7 text-right text-emerald-400 rounded-xl font-mono font-black text-xs outline-none focus:border-emerald-500/50" 
                                                />
                                            </div>
                                        </div>

                                        {/* Discount % */}
                                        <div className="w-full md:w-20 shrink-0">
                                            <label className="md:hidden text-[9px] font-mono font-bold text-slate-400 block mb-1">DESC %</label>
                                            <input 
                                                type="number" 
                                                min="0" 
                                                max="100"
                                                value={item.discountPercent || 0} 
                                                onChange={e => handleItemChange(item.id, "discountPercent", parseFloat(e.target.value) || 0)} 
                                                className="w-full bg-slate-900 border border-slate-800 p-2.5 text-center text-pink-400 rounded-xl font-mono font-bold text-xs outline-none focus:border-pink-500/50" 
                                                title="Descuento individual (%)" 
                                            />
                                        </div>

                                        {/* Item Total */}
                                        <div className="w-full md:w-28 text-right shrink-0 flex md:block items-center justify-between">
                                            <span className="md:hidden text-[9px] font-mono font-bold text-slate-400">TOTAL</span>
                                            <span className="text-xs font-black text-emerald-400 font-mono block">
                                                ${((item.quantity * item.unitPrice) * (1 - ((item.discountPercent || 0)/100))).toFixed(2)}
                                            </span>
                                        </div>

                                        {/* Remove Action */}
                                        <div className="w-full md:w-10 flex justify-end md:justify-center shrink-0">
                                            <button 
                                                onClick={() => handleRemoveItem(item.id)} 
                                                className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                                                title="Eliminar fila"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Right Column: Totals & State */}
                <div className="lg:col-span-1 space-y-8">
                    
                    {/* Generador Rápido IA */}
                    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/70 p-6 rounded-3xl border border-indigo-500/30 shadow-xl space-y-4 relative overflow-hidden">
                        <div className="flex items-center gap-2 text-cyan-400">
                            <Sparkles size={18} />
                            <h2 className="text-xs font-mono font-bold uppercase tracking-wider">Generador Rápido con IA</h2>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                            Pega texto desordenado de WhatsApp o notas. La IA extraerá cliente, productos y valores automáticamente.
                        </p>
                        <textarea 
                            value={quickText}
                            onChange={(e) => setQuickText(e.target.value)}
                            placeholder="Ej: cotizame a juan perez 2 camaras a 15 y un dvr a 40 para quito su tel es 0999"
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-white placeholder-slate-600 outline-none focus:border-cyan-500/50 min-h-[100px] resize-none"
                        />
                        
                        {quickWarning && (
                            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2 text-amber-300">
                                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                                <p className="text-[10px] font-mono leading-tight">{quickWarning}</p>
                            </div>
                        )}

                        <div className="flex gap-2">
                            <button 
                                onClick={() => quickInputRef.current?.click()}
                                className="flex-1 flex items-center justify-center gap-1.5 bg-slate-950 border border-slate-800 text-slate-300 font-mono font-bold text-[10px] py-2.5 rounded-xl hover:bg-slate-900 transition-colors"
                            >
                                <Upload size={12} /> {quickImage ? "Imagen Lista" : "Subir 1 Imagen"}
                            </button>
                            <input type="file" accept="image/*" hidden ref={quickInputRef} onChange={handleQuickImageUpload} />
                            
                            <button 
                                onClick={handleQuickGenerate}
                                disabled={isExtracting || !quickText.trim()}
                                className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-mono font-black text-[10px] py-2.5 rounded-xl uppercase tracking-wider hover:scale-105 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50"
                            >
                                {isExtracting ? "Analizando..." : "Auto-Completar"}
                            </button>
                        </div>

                        {quickSuccess && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                                <button 
                                    onClick={handleGeneratePDF}
                                    className="w-full flex items-center justify-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-xs py-3 rounded-2xl hover:bg-emerald-500/30 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                                >
                                    <Download size={14} /> DESCARGAR COTIZACIÓN EN PDF
                                </button>
                            </motion.div>
                        )}
                    </div>

                    {/* Totals Summary */}
                    <div className="bg-slate-900/90 border border-slate-800/80 p-6 lg:p-8 rounded-3xl space-y-6 shadow-xl sticky top-24">
                        <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-4">
                            <Calculator className="text-emerald-400" size={18} /> Resumen de Totales
                        </h2>
                        
                        <div className="space-y-4 text-xs font-mono font-bold">
                            <div className="flex justify-between items-center text-slate-300">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            
                            <div className="flex justify-between items-center text-slate-300">
                                <span className="flex items-center gap-1">Descuento Global <Percent size={12}/></span>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="number" 
                                        min="0" max="100" 
                                        value={discountPercent} 
                                        onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                                        className="w-16 bg-slate-950 border border-slate-800 p-1 text-right text-pink-400 rounded-lg outline-none focus:border-pink-500/50"
                                    /> %
                                </div>
                            </div>
                            {totalDiscountAmount > 0 && (
                                <div className="flex justify-between items-center text-rose-400">
                                    <span>Valor Descontado</span>
                                    <span>-${totalDiscountAmount.toFixed(2)}</span>
                                </div>
                            )}

                            <div className="flex justify-between items-center text-slate-300">
                                <span>IVA (15%)</span>
                                <span>${taxAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-800">
                            <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">Total Liquidación</p>
                            <p className="text-4xl font-black text-emerald-400 font-mono tracking-tight" style={{ textShadow: "0 0 20px rgba(74,222,128,0.4)" }}>
                                ${total.toFixed(2)}
                            </p>
                        </div>
                        
                        <div className="pt-4 border-t border-slate-800 space-y-3">
                            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Estado Inicial</label>
                            <div className="flex flex-col gap-2">
                                {["PENDIENTE", "CERRADO", "ABANDONADO"].map(s => (
                                    <button 
                                        key={s} 
                                        onClick={() => setStatus(s as any)} 
                                        className={`py-3 px-4 text-xs font-mono font-bold uppercase tracking-wider rounded-2xl transition-all border ${
                                            status === s 
                                            ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
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
                            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50"
                            onClick={() => { setIsHistoryOpen(false); setQuoteMenuOpen(null) }}
                        />
                        <motion.div 
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full max-w-sm bg-slate-900 border-l border-slate-800 z-[60] flex flex-col shadow-2xl text-white"
                        >
                            <div className="px-6 py-5 flex justify-between items-center border-b border-slate-800 bg-slate-950">
                                <h3 className="text-sm font-mono font-black text-cyan-400 uppercase tracking-tight flex items-center gap-2">
                                    <History size={16} /> Historial de Cotizaciones
                                </h3>
                                <button onClick={() => setIsHistoryOpen(false)} className="p-2 text-slate-400 hover:text-white rounded-full"><X size={18}/></button>
                            </div>
                            <div className="p-6 overflow-y-auto h-full space-y-4 font-mono bg-slate-950">
                                {quoteHistory.map((q: any) => (
                                    <div key={q.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl hover:border-cyan-500/40 transition-all group relative">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-full">{q.quoteNumber}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] text-slate-400 font-bold">{new Date(q.createdAt).toLocaleDateString()}</span>
                                                {/* ⋮ 3-DOT MENU */}
                                                <div className="relative">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setQuoteMenuOpen(quoteMenuOpen === q.id ? null : q.id) }}
                                                        className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                            <circle cx="12" cy="5" r="2.2"/><circle cx="12" cy="12" r="2.2"/><circle cx="12" cy="19" r="2.2"/>
                                                        </svg>
                                                    </button>
                                                    {quoteMenuOpen === q.id && (
                                                        <AnimatePresence>
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.9, y: -5 }}
                                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                exit={{ opacity: 0, scale: 0.9 }}
                                                                className="absolute right-0 top-8 w-60 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <div className="px-3 py-2 border-b border-slate-800">
                                                                    <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Opciones de Cotización</p>
                                                                </div>
                                                                {[
                                                                    { icon: '⬇️', label: 'Descargar PDF', action: () => handleDownloadQuotePDF(q) },
                                                                    { icon: '📤', label: 'Compartir (apps externas)', action: () => handleOSShareQuote(q) },
                                                                    { icon: '👤', label: 'Compartir a Perfil…', action: () => { setShareModalOpen(q); setQuoteMenuOpen(null) } },
                                                                    { icon: '✏️', label: 'Editar (nombre + productos)', action: () => handleLoadQuoteMode(q, 'full') },
                                                                    { icon: '🏷️', label: 'Editar (solo nombre del cliente)', action: () => handleLoadQuoteMode(q, 'name_only') },
                                                                    { icon: '📦', label: 'Editar (solo productos)', action: () => handleLoadQuoteMode(q, 'products_only') },
                                                                ].map((opt, i) => (
                                                                    <button key={i} onClick={opt.action}
                                                                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2.5">
                                                                        <span className="text-sm">{opt.icon}</span>
                                                                        <span>{opt.label}</span>
                                                                    </button>
                                                                ))}
                                                            </motion.div>
                                                        </AnimatePresence>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-xs font-bold text-white uppercase tracking-tight line-clamp-1 mb-2 font-sans">{q.clientName}</p>
                                        <div className="flex justify-between items-end mt-4">
                                            <span className="text-[10px] font-bold px-2.5 py-1 bg-slate-950 text-slate-300 rounded-full border border-slate-800">{q.status}</span>
                                            <p className="text-base font-black text-emerald-400">${q.total?.toFixed(2)}</p>
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
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70]"
                            onClick={() => setShareModalOpen(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="fixed inset-0 z-[80] flex items-center justify-center p-4">
                            <div className="bg-[#0a0a0f] border border-slate-700 rounded-3xl p-6 shadow-2xl max-w-sm w-full">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-black text-white text-sm flex items-center gap-2">
                                        <span>👤</span> Compartir Cotización
                                    </h3>
                                    <button onClick={() => setShareModalOpen(null)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400"><X size={16}/></button>
                                </div>
                                <p className="text-[11px] font-mono text-slate-400 mb-4">
                                    Enviar <span className="text-cyan-400 font-bold">{shareModalOpen?.quoteNumber}</span> al historial de otro perfil
                                </p>
                                <div className="space-y-3 mb-5">
                                    <button onClick={() => setShareTarget('todos')}
                                        className={`w-full py-2.5 px-4 rounded-2xl text-xs font-bold transition-all border ${shareTarget === 'todos' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'}`}>
                                        📢 Enviar a TODOS los perfiles
                                    </button>
                                    <div className="border-t border-slate-800 pt-3">
                                        <p className="text-[10px] font-mono font-bold text-slate-400 mb-2 uppercase tracking-widest">O enviar a perfil específico</p>
                                        <div className="space-y-1.5 max-h-44 overflow-y-auto">
                                            {systemUsers.filter((u: any) => u.email !== session?.user?.email).map((u: any) => (
                                                <button key={u.id} onClick={() => setShareTarget(u.email)}
                                                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all border ${shareTarget === u.email ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'}`}>
                                                    <span className="text-slate-500 mr-1.5 text-[9px]">{u.role}</span>
                                                    {u.name || u.email}
                                                </button>
                                            ))}
                                            {systemUsers.length === 0 && (
                                                <p className="text-[10px] font-mono text-slate-500 py-2 text-center">Cargando perfiles...</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => handleShareQuote(shareModalOpen)} disabled={!shareTarget || isSharingQuote}
                                    className="w-full py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-black rounded-2xl text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                    {isSharingQuote ? <Loader2 size={16} className="animate-spin"/> : <Send size={16}/>}
                                    {isSharingQuote ? 'Compartiendo...' : 'Compartir Cotización'}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────────────
// Helper functions (injected into component scope via module-level)
// These are referenced inside the component via closures
// ─────────────────────────────────────────────────────────────────────────
