'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import ProviderSyncStatusWidget from './ProviderSyncStatusWidget';

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

interface MatrizPreciosProps {
  isVendedorMode?: boolean;
  title?: string;
  subtitle?: string;
  allowPermanentDelete?: boolean;
  defaultTheme?: 'bw' | 'bw-inv' | 'green' | 'amber';
}

export default function MatrizPreciosComponent({ 
  isVendedorMode = false,
  title,
  subtitle,
  allowPermanentDelete = true,
  defaultTheme = 'bw-inv'
}: MatrizPreciosProps) {
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
  const [themeMode, setThemeMode] = useState<'bw' | 'bw-inv' | 'green' | 'amber'>(defaultTheme);

  // Edit Mode & Trash Bin state
  const [isEditMode, setIsEditMode] = useState(!isVendedorMode);
  const [viewTrash, setViewTrash] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showLandingsModal, setShowLandingsModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Quick Quote state & modal
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteClient, setQuoteClient] = useState('');
  const [quotePhone, setQuotePhone] = useState('');
  const [quoteLocation, setQuoteLocation] = useState('Quito / Entrega a Domicilio');
  const [quoteProductName, setQuoteProductName] = useState('');
  const [quoteSpecs, setQuoteSpecs] = useState('');
  const [quotePrice, setQuotePrice] = useState<number>(0);
  const [quoteQty, setQuoteQty] = useState<number>(1);
  const [quoteDiscount, setQuoteDiscount] = useState<number>(0);
  const [quoteShipping, setQuoteShipping] = useState<number>(0);
  const [quoteCode, setQuoteCode] = useState('COT-2026-0001');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const openQuoteModalWithProduct = (p?: ProductMatrixItem | null) => {
    const randomCode = `COT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setQuoteCode(randomCode);
    if (p) {
      setQuoteProductName(p.name);
      setQuotePrice(p.salePrice || 0);
      setQuoteQty(1);
      setQuoteDiscount(0);
      setQuoteShipping(0);
      setQuoteSpecs(`• SKU / Código: ${p.sku || 'N/A'}\n• Categoría: ${p.category || 'General'}\n• Garantía de 1 año con soporte técnico directo ATOMIC\n• Producto 100% original con entrega garantizada`);
    } else {
      setQuoteProductName('');
      setQuotePrice(0);
      setQuoteQty(1);
      setQuoteDiscount(0);
      setQuoteShipping(0);
      setQuoteSpecs('• Garantía de 1 año con soporte técnico directo ATOMIC\n• Disponibilidad y entrega express');
    }
    setShowQuoteModal(true);
  };

  const getQuoteTotal = () => {
    const base = (Number(quotePrice) || 0) * (Number(quoteQty) || 1);
    const disc = Number(quoteDiscount) || 0;
    const ship = Number(quoteShipping) || 0;
    return Math.max(0, base - disc + ship);
  };

  const buildQuoteText = () => {
    const total = getQuoteTotal();
    return `*📄 PROFORMA OFICIAL · ATOMIC SOLUTIONS*
*Cotización N°:* ${quoteCode}
*Fecha:* ${new Date().toLocaleDateString('es-EC')}

*👤 Cliente:* ${quoteClient.trim() || 'Estimado/a Cliente'}
*📍 Ubicación:* ${quoteLocation}

*📦 PRODUCTO / EQUIPAMIENTO:*
*${quoteProductName.trim() || 'Producto por definir'}*

*📋 ESPECIFICACIONES & DETALLES:*
${quoteSpecs}

*💰 DESGLOSE ECONÓMICO:*
• Cantidad: ${quoteQty} unid.
• Precio Unitario: $${Number(quotePrice).toFixed(2)} USD
${Number(quoteDiscount) > 0 ? `• Descuento Especial: -$${Number(quoteDiscount).toFixed(2)} USD\n` : ''}${Number(quoteShipping) > 0 ? `• Envío / Instalación: +$${Number(quoteShipping).toFixed(2)} USD\n` : ''}*TOTAL A PAGAR: $${total.toFixed(2)} USD*

*🛡️ CONDICIONES Y GARANTÍA:*
• 1 Año de Garantía Directa.
• Disponibilidad Inmediata / Despacho Express 24-48h.
• Métodos de Pago: Transferencia Bancaria, Tarjeta de Crédito, Efectivo.

_¿Deseas confirmar tu pedido para coordinar el despacho inmediato?_`;
  };

  const handleSendWhatsAppQuote = () => {
    const text = buildQuoteText();
    const cleanPh = quotePhone.replace(/\D/g, '');
    let targetNum = cleanPh;
    if (!targetNum) {
      targetNum = '593969043453';
    } else if (!targetNum.startsWith('593') && targetNum.startsWith('09')) {
      targetNum = '593' + targetNum.substring(1);
    }
    const url = `https://wa.me/${targetNum}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    showNotification('📲 Abriendo WhatsApp con la proforma generada...');
  };

  const handleCopyQuoteText = () => {
    const text = buildQuoteText();
    navigator.clipboard.writeText(text);
    showNotification('📋 ¡Texto de cotización copiado al portapapeles!');
  };

  // Helper para generar el PDF Oficial con diseño prémium ATOMIC
  const generateAtomicQuotePDF = async (quoteData: {
    code: string;
    client: string;
    phone: string;
    location: string;
    productName: string;
    specs: string;
    price: number;
    qty: number;
    discount: number;
    shipping: number;
    total: number;
  }) => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // 1. Header Banner
    doc.setFillColor(15, 23, 42); // #0F172A
    doc.rect(0, 0, pageWidth, 38, 'F');

    // Accent line
    doc.setFillColor(37, 99, 235); // #2563EB
    doc.rect(0, 38, pageWidth, 2.5, 'F');

    // Company Name & Info
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('ATOMIC SOLUTIONS', 14, 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(203, 213, 225);
    doc.text('TECNOLOGÍA, ELECTRÓNICA & EQUIPAMIENTO EMPRESARIAL', 14, 24);
    doc.text('RUC / Registro Oficial · Envíos a Nivel Nacional · WhatsApp: 0969043453', 14, 29);

    // Proforma Badge
    doc.setFillColor(37, 99, 235);
    doc.roundedRect(pageWidth - 65, 10, 52, 18, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('PROFORMA OFICIAL', pageWidth - 39, 17, { align: 'center' });
    doc.setFontSize(11);
    doc.text(quoteData.code, pageWidth - 39, 24, { align: 'center' });

    // 2. Info Cards
    let y = 48;

    // Left Box: Client Info
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, y, (pageWidth - 34) / 2, 34, 2, 2, 'FD');

    doc.setTextColor(37, 99, 235);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('DATOS DEL CLIENTE', 18, y + 7);

    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(quoteData.client.trim() || 'Cliente General', 18, y + 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Tel / WhatsApp: ${quoteData.phone.trim() || 'No especificado'}`, 18, y + 20);
    doc.text(`Ubicación: ${quoteData.location.trim() || 'Quito / Entrega a Domicilio'}`, 18, y + 26);

    // Right Box: Meta Info
    const rightBoxX = 14 + (pageWidth - 34) / 2 + 6;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(rightBoxX, y, (pageWidth - 34) / 2, 34, 2, 2, 'FD');

    doc.setTextColor(37, 99, 235);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('INFORMACIÓN DE EMISIÓN', rightBoxX + 4, y + 7);

    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString('es-EC')}`, rightBoxX + 4, y + 14);
    doc.text(`Validez de Oferta: 15 días calendario`, rightBoxX + 4, y + 20);
    doc.text(`Forma de Pago: Transferencia / TC / Efectivo`, rightBoxX + 4, y + 26);

    y += 42;

    // 3. Items Table Header
    doc.setFillColor(15, 23, 42);
    doc.rect(14, y, pageWidth - 28, 8, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('DESCRIPCIÓN DEL EQUIPAMIENTO / PRODUCTO', 18, y + 5.5);
    doc.text('CANT.', pageWidth - 80, y + 5.5, { align: 'center' });
    doc.text('P. UNIT.', pageWidth - 55, y + 5.5, { align: 'center' });
    doc.text('TOTAL', pageWidth - 20, y + 5.5, { align: 'right' });

    y += 8;

    // Items Table Row
    const itemTotal = (quoteData.price * quoteData.qty);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.rect(14, y, pageWidth - 28, 20, 'FD');

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(quoteData.productName.trim() || 'Producto Seleccionado', 18, y + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('Garantía oficial 1 año · Producto 100% original con soporte técnico', 18, y + 13);

    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(`${quoteData.qty}`, pageWidth - 80, y + 10, { align: 'center' });
    doc.text(`$${quoteData.price.toFixed(2)}`, pageWidth - 55, y + 10, { align: 'center' });
    doc.text(`$${itemTotal.toFixed(2)}`, pageWidth - 20, y + 10, { align: 'right' });

    y += 26;

    // 4. Specifications Box
    if (quoteData.specs && quoteData.specs.trim()) {
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(14, y, pageWidth - 28, 28, 2, 2, 'FD');

      doc.setTextColor(37, 99, 235);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text('ESPECIFICACIONES TÉCNICAS & DETALLES ADICIONALES:', 18, y + 6);

      doc.setTextColor(51, 65, 85);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);

      const splitSpecs = doc.splitTextToSize(quoteData.specs.trim(), pageWidth - 36);
      doc.text(splitSpecs, 18, y + 12);

      y += 34;
    }

    // 5. Financial Summary Box (Right aligned)
    const summaryWidth = 80;
    const summaryX = pageWidth - 14 - summaryWidth;

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(summaryX, y, summaryWidth, 38, 2, 2, 'FD');

    let subY = y + 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Subtotal:', summaryX + 6, subY);
    doc.setTextColor(30, 41, 59);
    doc.text(`$${itemTotal.toFixed(2)}`, summaryX + summaryWidth - 6, subY, { align: 'right' });

    if (quoteData.discount > 0) {
      subY += 6;
      doc.setTextColor(220, 38, 38);
      doc.text('Descuento:', summaryX + 6, subY);
      doc.text(`-$${quoteData.discount.toFixed(2)}`, summaryX + summaryWidth - 6, subY, { align: 'right' });
    }

    if (quoteData.shipping > 0) {
      subY += 6;
      doc.setTextColor(13, 148, 136);
      doc.text('Envío / Instalación:', summaryX + 6, subY);
      doc.text(`+$${quoteData.shipping.toFixed(2)}`, summaryX + summaryWidth - 6, subY, { align: 'right' });
    }

    // Total Row Accent
    subY += 8;
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(summaryX + 3, subY - 4, summaryWidth - 6, 10, 1.5, 1.5, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('TOTAL:', summaryX + 6, subY + 2.5);
    doc.setFontSize(11);
    doc.setTextColor(52, 211, 153); // Emerald
    doc.text(`$${quoteData.total.toFixed(2)} USD`, summaryX + summaryWidth - 6, subY + 2.5, { align: 'right' });

    // 6. Guarantee & Payment Terms (Left aligned)
    const termsWidth = pageWidth - 28 - summaryWidth - 6;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, y, termsWidth, 38, 2, 2, 'FD');

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('TÉRMINOS Y CONDICIONES:', 18, y + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text('• Garantía de 1 año en defectos de fábrica con repuestos originales.', 18, y + 13);
    doc.text('• Precios expresados en Dólares Americanos (USD).', 18, y + 18);
    doc.text('• Despachos seguros a las 24 provincias mediante Servientrega / Transporte.', 18, y + 23);
    doc.text('• Soporte y asesoría técnica personalizada post-venta.', 18, y + 28);

    // 7. Footer Bar
    const footerY = pageHeight - 16;
    doc.setFillColor(15, 23, 42);
    doc.rect(0, footerY, pageWidth, 16, 'F');

    doc.setTextColor(203, 213, 225);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('ATOMIC ECUADOR · Ventas y Asesoría Directa: 0969043453 · atomiccotizador.shop', 14, footerY + 6.5);
    doc.text('Documento Electrónico Generado Automáticamente', pageWidth - 14, footerY + 6.5, { align: 'right' });

    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text('Gracias por su preferencia · Innovación, Tecnología y Respaldo Garantizado', 14, footerY + 11.5);

    const pdfBlob = doc.output('blob');
    const fileName = `Proforma_${quoteData.code}.pdf`;
    const file = new File([pdfBlob], fileName, { type: 'application/pdf' });

    return { doc, blob: pdfBlob, file, fileName };
  };

  // Handler para compartir PDF a WhatsApp / Share Sheet
  const handleSharePDFQuote = async () => {
    try {
      setIsGeneratingPDF(true);
      showNotification('⏳ Generando PDF oficial de cotización...');
      const total = getQuoteTotal();
      const pdfData = await generateAtomicQuotePDF({
        code: quoteCode,
        client: quoteClient,
        phone: quotePhone,
        location: quoteLocation,
        productName: quoteProductName,
        specs: quoteSpecs,
        price: quotePrice,
        qty: quoteQty,
        discount: quoteDiscount,
        shipping: quoteShipping,
        total: total
      });

      // Intentar compartir archivo directamente con Web Share API (WhatsApp / Móvil / Desktop soportado)
      if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [pdfData.file] })) {
        await navigator.share({
          title: `Proforma Oficial ${quoteCode} - ATOMIC`,
          text: `Hola ${quoteClient.trim() || ''}, adjunto la cotización oficial en PDF de ${quoteProductName} de ATOMIC.`,
          files: [pdfData.file]
        });
        showNotification('✅ ¡PDF compartido con éxito!');
      } else {
        // Fallback: Descargar el PDF en el dispositivo Y abrir WhatsApp con el cliente para que lo adjunte
        pdfData.doc.save(pdfData.fileName);

        const cleanPh = quotePhone.replace(/\D/g, '');
        let targetNum = cleanPh;
        if (!targetNum) {
          targetNum = '593969043453';
        } else if (!targetNum.startsWith('593') && targetNum.startsWith('09')) {
          targetNum = '593' + targetNum.substring(1);
        }

        const textMsg = `*📄 PROFORMA OFICIAL · ATOMIC SOLUTIONS*\n*Cotización N°:* ${quoteCode}\n*Cliente:* ${quoteClient.trim() || 'Estimado/a Cliente'}\n*Producto:* ${quoteProductName}\n*Total:* $${total.toFixed(2)} USD\n\n*(He descargado la proforma en PDF (${pdfData.fileName}) para adjuntártela en este chat)* 📎`;

        const waUrl = `https://wa.me/${targetNum}?text=${encodeURIComponent(textMsg)}`;
        window.open(waUrl, '_blank');
        showNotification('📥 PDF descargado y WhatsApp abierto para adjuntarlo.');
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        console.error('Error compartiendo PDF:', err);
        showNotification('⚠️ Error al compartir. Intenta descargar el PDF directamente.');
      }
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Handler para descargar PDF directamente
  const handleDownloadPDFQuote = async () => {
    try {
      setIsGeneratingPDF(true);
      showNotification('⏳ Descargando proforma PDF...');
      const total = getQuoteTotal();
      const pdfData = await generateAtomicQuotePDF({
        code: quoteCode,
        client: quoteClient,
        phone: quotePhone,
        location: quoteLocation,
        productName: quoteProductName,
        specs: quoteSpecs,
        price: quotePrice,
        qty: quoteQty,
        discount: quoteDiscount,
        shipping: quoteShipping,
        total: total
      });
      pdfData.doc.save(pdfData.fileName);
      showNotification('✅ ¡Proforma PDF descargada correctamente!');
    } catch (err) {
      console.error('Error descargando PDF:', err);
      showNotification('⚠️ Error al descargar PDF.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Handler para abrir y compartir PDF rápido de un producto de la tabla
  const handleQuickPDFForProduct = (p: ProductMatrixItem) => {
    openQuoteModalWithProduct(p);
  };

  // Table refs for intelligent scroll control
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const tableHeaderRef = useRef<HTMLTableSectionElement>(null);

  // Non-passive wheel event listener on table header for 100% reliable horizontal scroll
  useEffect(() => {
    const headerEl = tableHeaderRef.current;
    const containerEl = tableContainerRef.current;
    if (!headerEl || !containerEl) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        containerEl.scrollLeft += e.deltaY * 2;
      }
    };

    headerEl.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      headerEl.removeEventListener('wheel', onWheel);
    };
  }, []);

  const fetchMatrixData = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        search,
        provider: selectedProvider,
        categoryId: selectedCategory,
        page: page.toString(),
        limit: limit.toString(),
        showDeleted: viewTrash ? 'true' : 'false',
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
  }, [search, selectedProvider, selectedCategory, page, limit, viewTrash]);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Update handler for inline edits (sku, name, salePrice, costPrice, categoryId, stock)
  const handleUpdateProduct = async (id: string, field: 'sku' | 'name' | 'salePrice' | 'costPrice' | 'categoryId' | 'stock', value: any) => {
    setSavingId(id);
    try {
      const currentProduct = products.find(p => p.id === id);
      if (!currentProduct) return;

      const payload: any = {};
      if (field === 'sku') payload.sku = value;
      if (field === 'name') payload.name = value;
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

        const newSku = field === 'sku' ? value : p.sku;
        const newName = field === 'name' ? value : p.name;
        const newSale = field === 'salePrice' ? (parseFloat(value) || 0) : p.salePrice;
        const newCost = field === 'costPrice' ? (value === '' || value === null ? 0 : parseFloat(value)) : p.costPrice;
        const newStock = field === 'stock' ? (parseInt(value) || 0) : p.stock;
        const newCatObj = field === 'categoryId' ? categories.find(c => c.id === value) : null;
        const newCatName = newCatObj ? newCatObj.name : (field === 'categoryId' && !value ? 'Sin categoría' : p.category);

        const newMarginUsd = newSale - newCost;
        const newMarginPercent = newCost > 0 ? (newMarginUsd / newCost) * 100 : 0;

        return {
          ...p,
          sku: newSku,
          name: newName,
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

  // Move product to Trash handler (Soft delete)
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`¿Deseas mover a la Papelera de Reciclaje el producto:\n\n"${name}"?`)) {
      return;
    }
    setSavingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al enviar a papelera');

      setProducts(prev => prev.filter(p => p.id !== id));
      setTotalProducts(prev => Math.max(0, prev - 1));
      showNotification('🗑️ Producto movido a la Papelera de Reciclaje');
    } catch (err) {
      console.error(err);
      showNotification('❌ Error al mover producto a papelera');
    } finally {
      setSavingId(null);
    }
  };

  // Restore product from Trash handler
  const handleRestoreProduct = async (id: string, name: string) => {
    setSavingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDeleted: false })
      });
      if (!res.ok) throw new Error('Error al restaurar');

      setProducts(prev => prev.filter(p => p.id !== id));
      setTotalProducts(prev => Math.max(0, prev - 1));
      showNotification('♻️ Producto restaurado a la matriz activa: ' + name);
    } catch (err) {
      console.error(err);
      showNotification('❌ Error al restaurar producto');
    } finally {
      setSavingId(null);
    }
  };

  // Permanently delete product from DB handler
  const handlePermanentDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`⚠️ ¡ATENCIÓN!\n\n¿Estás completamente seguro de ELIMINAR DEFINITIVAMENTE de la base de datos el producto:\n\n"${name}"?\n\nEsta acción NO se puede deshacer.`)) {
      return;
    }
    setSavingId(id);
    try {
      const res = await fetch(`/api/products/${id}?permanent=true`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al borrar definitivamente');

      setProducts(prev => prev.filter(p => p.id !== id));
      setTotalProducts(prev => Math.max(0, prev - 1));
      showNotification('💥 Producto eliminado definitivamente de la Base de Datos');
    } catch (err) {
      console.error(err);
      showNotification('❌ Error al eliminar definitivamente');
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

  const exportToPDF = async () => {
    if (!products.length) {
      showNotification('⚠️ No hay productos para exportar');
      return;
    }
    showNotification('⏳ Generando Catálogo PDF completo...');
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const today = new Date().toLocaleDateString('es-EC');

      let currentY = 28;
      let pageNum = 1;

      const drawHeader = (pNum: number) => {
        // Banner top
        doc.setFillColor(15, 23, 42); // Slate-900
        doc.rect(0, 0, pageWidth, 20, 'F');
        doc.setFillColor(37, 99, 235); // Blue-600
        doc.rect(0, 20, pageWidth, 1.5, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('ATOMIC ECUADOR · LISTA OFICIAL DE PRECIOS & EQUIPOS', 14, 11);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(203, 213, 225);
        doc.text(`Fecha: ${today} · Total Registros: ${products.length} productos · Página ${pNum}`, 14, 16);
        doc.text('Ventas & Asesoría: 0969043453 · atomiccotizador.shop', pageWidth - 14, 16, { align: 'right' });

        // Table Header
        doc.setFillColor(30, 41, 59);
        doc.rect(14, 23, pageWidth - 28, 7, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.text('N°', 16, 27.5);
        doc.text('SKU / CÓDIGO', 24, 27.5);
        doc.text('DESCRIPCIÓN DEL PRODUCTO / EQUIPO', 62, 27.5);
        doc.text('CATEGORÍA', pageWidth - 100, 27.5);
        doc.text('STOCK', pageWidth - 50, 27.5, { align: 'center' });
        doc.text('PVP (USD)', pageWidth - 18, 27.5, { align: 'right' });
      };

      drawHeader(pageNum);
      currentY = 32;

      products.forEach((p, idx) => {
        if (currentY > pageHeight - 18) {
          // Add new page
          doc.addPage();
          pageNum++;
          drawHeader(pageNum);
          currentY = 32;
        }

        const isEven = idx % 2 === 0;
        doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
        doc.rect(14, currentY - 2, pageWidth - 28, 6.5, 'F');

        doc.setDrawColor(241, 245, 249);
        doc.line(14, currentY + 4.5, pageWidth - 14, currentY + 4.5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.text(`${idx + 1}`, 16, currentY + 2);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text((p.sku || 'N/A').substring(0, 18), 24, currentY + 2);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 41, 59);
        doc.text(p.name.substring(0, 68), 62, currentY + 2);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text((p.category || 'General').substring(0, 24), pageWidth - 100, currentY + 2);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(p.stock > 0 ? 16 : 225, p.stock > 0 ? 185 : 29, p.stock > 0 ? 129 : 72);
        doc.text(`${p.stock}`, pageWidth - 50, currentY + 2, { align: 'center' });

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(`$${p.salePrice.toFixed(2)}`, pageWidth - 18, currentY + 2, { align: 'right' });

        currentY += 6.5;
      });

      doc.save(`CATALOGO_PRECIOS_ATOMIC_${new Date().toISOString().split('T')[0]}.pdf`);
      showNotification('✅ ¡Catálogo PDF exportado con éxito!');
    } catch (err) {
      console.error('Error exportando PDF:', err);
      showNotification('❌ Error al exportar PDF');
    }
  };

  const themeClasses = {
    bw: {
      bg: 'bg-black',
      text: 'text-zinc-100',
      border: 'border-2 border-zinc-800',
      cardBg: 'bg-zinc-950',
      headerBg: 'bg-zinc-900',
      headerText: 'text-zinc-300',
      accent: 'text-white font-bold',
      highlight: 'bg-zinc-900/80',
      inputBg: 'bg-black text-white border-2 border-zinc-700 focus:border-white',
      badge: 'border-2 border-zinc-700 text-zinc-300 bg-zinc-900',
      cellInput: 'bg-zinc-900 text-white border border-zinc-700 focus:border-white',
    },
    'bw-inv': {
      bg: 'bg-slate-200',
      text: 'text-zinc-950',
      border: 'border-2 border-zinc-950',
      cardBg: 'bg-white',
      headerBg: 'bg-zinc-300',
      headerText: 'text-zinc-950 font-black',
      accent: 'text-zinc-950 font-black',
      highlight: 'bg-zinc-200/90',
      inputBg: 'bg-white text-zinc-950 border-2 border-zinc-950 focus:border-black font-bold',
      badge: 'border-2 border-zinc-950 text-zinc-950 bg-white font-bold',
      cellInput: 'bg-white text-zinc-950 border-2 border-zinc-800 focus:border-black font-bold',
    },
    green: {
      bg: 'bg-[#030d04]',
      text: 'text-emerald-400',
      border: 'border-2 border-emerald-800',
      cardBg: 'bg-[#061508]',
      headerBg: 'bg-emerald-950',
      headerText: 'text-emerald-300',
      accent: 'text-emerald-200 font-bold',
      highlight: 'bg-emerald-950/60',
      inputBg: 'bg-black text-emerald-300 border-2 border-emerald-800 focus:border-emerald-400',
      badge: 'border-2 border-emerald-800 text-emerald-400 bg-emerald-950',
      cellInput: 'bg-emerald-950 text-emerald-300 border border-emerald-800 focus:border-emerald-400',
    },
    amber: {
      bg: 'bg-[#0f0a02]',
      text: 'text-amber-400',
      border: 'border-2 border-amber-800',
      cardBg: 'bg-[#181104]',
      headerBg: 'bg-amber-950',
      headerText: 'text-amber-300',
      accent: 'text-amber-200 font-bold',
      highlight: 'bg-amber-950/60',
      inputBg: 'bg-black text-amber-300 border-2 border-amber-800 focus:border-amber-400',
      badge: 'border-2 border-amber-800 text-amber-400 bg-amber-950',
      cellInput: 'bg-amber-950 text-amber-300 border border-amber-800 focus:border-amber-400',
    },
  }[themeMode];

  return (
    <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.text} font-mono p-4 md:p-8 selection:bg-zinc-700 selection:text-white relative`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[100] px-4 py-2 bg-white border-2 border-zinc-950 text-zinc-950 text-xs font-black uppercase tracking-wider shadow-2xl animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* ================= RETRO TERMINAL HEADER ================= */}
      <div className={`border-2 ${themeClasses.border} p-6 shadow-xl mb-6 ${themeClasses.cardBg} rounded-xl`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-pulse border-2 border-zinc-950" />
              <h1 className="text-xl md:text-2xl font-black uppercase tracking-widest">
                {title || (isVendedorMode 
                  ? '[ATOMIC_SYSTEM] CATÁLOGO Y MATRIZ DE PRECIOS VENDEDORES V2.0' 
                  : '[ATOMIC_SYSTEM] DATABASE PRICING & CATEGORY MATRIX v2.0')}
              </h1>
            </div>
            <p className="text-xs font-bold opacity-80 mt-1 uppercase tracking-wider">
              {subtitle || (isVendedorMode 
                ? 'LISTA GENERAL DE PRODUCTOS' 
                : 'MATRIZ GENERAL DE PRODUCTOS · EDICIÓN DIRECTA DE CATEGORÍAS, STOCK, COSTOS Y PRECIOS EN TIEMPO REAL')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* BOTÓN HACER COTIZACIÓN / COTIZADOR RÁPIDO */}
            <button
              onClick={() => openQuoteModalWithProduct(null)}
              className="px-4 py-2.5 border-2 border-zinc-950 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase flex items-center gap-2 rounded-lg shadow-sm transition-all"
            >
              <span>📑</span>
              <span>HACER COTIZACIÓN</span>
            </button>

            {/* BOTÓN LANDING PAGES */}
            <button
              onClick={() => setShowLandingsModal(true)}
              className="px-4 py-2.5 border-2 border-zinc-950 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs uppercase flex items-center gap-2 rounded-lg shadow-sm transition-all"
            >
              <span>🚀 LANDINGS</span>
            </button>

            {/* BOTÓN PROMOCIONES */}
            <a
              href="/web"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 border-2 border-zinc-950 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-zinc-950 font-black text-xs uppercase flex items-center gap-2 rounded-lg shadow-sm transition-all"
            >
              <span>🔥 PROMOCIONES</span>
            </a>

            {/* BOTÓN ACTUALIZAR LISTA */}
            <button
              onClick={async () => {
                setIsRefreshing(true);
                await fetchMatrixData();
                setIsRefreshing(false);
                showNotification('✅ Lista de productos actualizada en tiempo real');
              }}
              disabled={isRefreshing || loading}
              className="px-4 py-2.5 border-2 border-zinc-950 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs uppercase flex items-center gap-2 rounded-lg shadow-sm transition-all"
            >
              <span className={isRefreshing ? 'animate-spin' : ''}>🔄</span>
              <span>{isRefreshing ? 'ACTUALIZANDO...' : 'ACTUALIZAR LISTA'}</span>
            </button>

            {!isVendedorMode && (
              <>
                <button
                  onClick={() => setIsEditMode(!isEditMode)}
                  className={`px-4 py-2.5 border-2 font-black text-xs uppercase transition-all rounded-lg shadow-sm ${
                    isEditMode ? 'bg-amber-400 text-zinc-950 border-zinc-950 shadow-[2px_2px_0px_rgba(0,0,0,1)]' : 'border-zinc-950 hover:bg-zinc-950 hover:text-white'
                  }`}
                >
                  {isEditMode ? '⚡ MODO EDICIÓN ACTIVO' : '✏️ HABILITAR EDICIÓN'}
                </button>

                <button
                  onClick={() => {
                    setViewTrash(!viewTrash);
                    setPage(1);
                  }}
                  className={`px-4 py-2.5 border-2 font-black text-xs uppercase transition-all flex items-center gap-2 rounded-lg shadow-sm ${
                    viewTrash
                      ? 'bg-rose-600 text-white border-zinc-950 shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                      : 'border-zinc-950 hover:bg-rose-600 hover:text-white text-rose-700'
                  }`}
                >
                  <span>{viewTrash ? '📋 MATRIZ ACTIVA' : '🗑️ PAPELERA'}</span>
                </button>
              </>
            )}

            <div className="flex items-center border-2 border-zinc-950 p-1 text-xs bg-white rounded-lg shadow-sm">
              <span className="px-2 uppercase opacity-80 text-[10px] font-black">TEMA:</span>
              <button
                onClick={() => setThemeMode('bw')}
                className={`px-3 py-1 text-xs uppercase font-black transition-colors rounded ${
                  themeMode === 'bw' ? 'bg-zinc-950 text-white' : 'hover:bg-zinc-200'
                }`}
              >
                B/N Oscuro
              </button>
              <button
                onClick={() => setThemeMode('bw-inv')}
                className={`px-3 py-1 text-xs uppercase font-black transition-colors rounded ${
                  themeMode === 'bw-inv' ? 'bg-zinc-950 text-white' : 'hover:bg-zinc-200 text-zinc-950'
                }`}
              >
                Invertido B/N
              </button>
              <button
                onClick={() => setThemeMode('green')}
                className={`px-3 py-1 text-xs uppercase font-black transition-colors rounded ${
                  themeMode === 'green' ? 'bg-emerald-600 text-white' : 'hover:bg-zinc-200'
                }`}
              >
                Verde VT100
              </button>
              <button
                onClick={() => setThemeMode('amber')}
                className={`px-3 py-1 text-xs uppercase font-black transition-colors rounded ${
                  themeMode === 'amber' ? 'bg-amber-500 text-zinc-950' : 'hover:bg-zinc-200'
                }`}
              >
                Ámbar CRT
              </button>
            </div>

            <button
              onClick={exportToCSV}
              className={`px-4 py-2.5 border-2 border-zinc-950 hover:bg-zinc-950 hover:text-white transition-all font-black text-xs uppercase flex items-center gap-2 bg-white rounded-lg shadow-sm cursor-pointer`}
              title="Descargar matriz en formato CSV Excel"
            >
              <span>💾 EXPORTAR CSV</span>
            </button>

            <button
              onClick={exportToPDF}
              className={`px-4 py-2.5 border-2 border-zinc-950 hover:bg-zinc-950 hover:text-white transition-all font-black text-xs uppercase flex items-center gap-2 bg-white rounded-lg shadow-sm cursor-pointer`}
              title="Descargar catálogo completo en documento PDF oficial"
            >
              <span>📑 EXPORTAR PDF</span>
            </button>

            <button
              onClick={() => window.print()}
              className={`px-4 py-2.5 border-2 border-zinc-950 hover:bg-zinc-950 hover:text-white transition-all font-black text-xs uppercase bg-white rounded-lg shadow-sm cursor-pointer`}
            >
              🖨️ IMPRIMIR
            </button>
          </div>
        </div>

        {/* MONITOR EN VIVO Y SINCRONIZADOR DE PROVEEDORES (SOLO MODO ADMIN) */}
        {!isVendedorMode && (
          <div className="mt-6">
            <ProviderSyncStatusWidget />
          </div>
        )}

        {/* CONTROLES DE BÚSQUEDA Y FILTROS EN RECUADROS INDEPENDIENTES */}
        <div className={`grid grid-cols-1 ${isVendedorMode ? 'md:grid-cols-3' : 'md:grid-cols-4'} gap-4 mt-6 pt-6 border-t-2 border-zinc-950`}>
          
          <div className={`${isVendedorMode ? 'md:col-span-2' : 'md:col-span-2'} space-y-1.5 p-3 border-2 border-zinc-950 bg-white/90 rounded-lg shadow-sm`}>
            <label className="text-[10px] uppercase font-black tracking-widest text-zinc-900 block">
              🔍 Escribe en el buscador y encuentra todos los productos para tus clientes
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Escribe en el buscador y encuentra todos los productos para tus clientes..."
              className={`w-full px-4 py-2 text-sm uppercase ${themeClasses.inputBg} outline-none font-mono tracking-wider rounded-md`}
            />
          </div>

          {!isVendedorMode && (
            <div className="space-y-1.5 p-3 border-2 border-zinc-950 bg-white/90 rounded-lg shadow-sm">
              <label className="text-[10px] uppercase font-black tracking-widest text-zinc-900 block">
                🏢 Filtro por Proveedor
              </label>
              <select
                value={selectedProvider}
                onChange={(e) => {
                  setSelectedProvider(e.target.value);
                  setPage(1);
                }}
                className={`w-full px-3 py-2 text-xs uppercase ${themeClasses.inputBg} outline-none font-mono cursor-pointer rounded-md`}
              >
                <option value="ALL">-- TODOS LOS PROVEEDORES --</option>
                {providers.map((pr) => (
                  <option key={pr} value={pr}>
                    {pr}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={`${isVendedorMode ? 'md:col-span-1' : ''} space-y-1.5 p-3 border-2 border-zinc-950 bg-white/90 rounded-lg shadow-sm`}>
            <label className="text-[10px] uppercase font-black tracking-widest text-zinc-900 block">
              📂 Filtro por Categoría
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className={`w-full px-3 py-2 text-xs uppercase ${themeClasses.inputBg} outline-none font-mono cursor-pointer rounded-md`}
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

        {/* SUMMARY STATS BAR EN RECUADROS INDEPENDIENTES */}
        <div className={`grid grid-cols-2 ${isVendedorMode ? 'md:grid-cols-2' : 'md:grid-cols-4'} gap-4 mt-6 pt-4 border-t-2 border-zinc-950 text-xs`}>
          <div className="p-3 border-2 border-zinc-950 bg-white rounded-lg shadow-sm">
            <span className="text-zinc-700 font-bold block text-[10px] uppercase">REGISTROS MOSTRADOS:</span>
            <span className={themeClasses.accent}>{products.length} de {totalProducts} productos</span>
          </div>
          {!isVendedorMode && (
            <div className="p-3 border-2 border-zinc-950 bg-white rounded-lg shadow-sm">
              <span className="text-zinc-700 font-bold block text-[10px] uppercase">VALOR AL COSTO (VISTA):</span>
              <span className={themeClasses.accent}>${stats.totalCostSum.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          )}
          <div className="p-3 border-2 border-zinc-950 bg-white rounded-lg shadow-sm">
            <span className="text-zinc-700 font-bold block text-[10px] uppercase">VALOR A LA VENTA (VISTA):</span>
            <span className={themeClasses.accent}>${stats.totalSaleSum.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          {!isVendedorMode && (
            <div className="p-3 border-2 border-zinc-950 bg-white rounded-lg shadow-sm">
              <span className="text-zinc-700 font-bold block text-[10px] uppercase">MARGEN PROMEDIO:</span>
              <span className="text-emerald-700 font-black">+{stats.avgMarginPercent.toFixed(2)}% (${stats.totalProfitSum.toLocaleString('en-US', { minimumFractionDigits: 2 })})</span>
            </div>
          )}
        </div>
      </div>

      {/* SCROLL GESTURE NAVIGATION BADGE */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 px-1 text-[11px] font-mono">
        <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-lg border-2 border-zinc-950 shadow-sm text-zinc-950 font-bold">
          <span className="text-amber-600 font-black">↔️ Encabezado:</span>
          <span>Desplaza el mouse por el encabezado y usa la rueda para Scroll Horizontal</span>
        </div>
        <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-lg border-2 border-zinc-950 shadow-sm text-zinc-950 font-bold">
          <span className="text-emerald-700 font-black">↕️ Filas:</span>
          <span>Desplaza el mouse por la tabla para Scroll Vertical continuo</span>
        </div>
      </div>

      {/* ================= TABLA TIPO BASE DE DATOS RETRO CON EDICIÓN ================= */}
      <div 
        ref={tableContainerRef} 
        className={`border-2 ${themeClasses.border} ${themeClasses.cardBg} overflow-x-auto overflow-y-auto max-h-[75vh] shadow-2xl relative scroll-smooth rounded-xl`}
      >
        <table className={`w-full ${isVendedorMode ? 'min-w-[1400px]' : 'min-w-[1950px]'} text-left text-xs border-collapse`}>
          <thead 
            ref={tableHeaderRef}
            className="sticky top-0 z-30 shadow-2xl bg-zinc-300 border-b-2 border-zinc-950 cursor-ew-resize select-none"
            title="Pasa el mouse sobre el encabezado y gira la rueda para Scroll Horizontal ↔"
          >
            <tr className={`${themeClasses.headerBg} ${themeClasses.headerText} uppercase font-black tracking-wider`}>
              <th className="py-3.5 px-4 border-r-2 border-zinc-950 w-12 text-center">#</th>
              <th className="py-3.5 px-4 border-r-2 border-zinc-950 w-36">
                {isVendedorMode ? 'SKU / CÓDIGO' : 'SKU / CÓDIGO (EDITABLE)'}
              </th>
              <th className="py-3.5 px-4 border-r-2 border-zinc-950">
                {isVendedorMode ? 'DESCRIPCIÓN PRODUCTO' : 'DESCRIPCIÓN PRODUCTO (EDITABLE)'}
              </th>
              {!isVendedorMode && (
                <th className="py-3.5 px-4 border-r-2 border-zinc-950 w-36">PROVEEDOR</th>
              )}
              <th className="py-3.5 px-4 border-r-2 border-zinc-950 w-44">
                {isVendedorMode ? 'CATEGORÍA' : 'CATEGORÍA (EDITABLE)'}
              </th>
              <th className="py-3.5 px-4 border-r-2 border-zinc-950 text-center w-24">
                {isVendedorMode ? 'STOCK' : 'STOCK (EDITABLE)'}
              </th>
              {!isVendedorMode && (
                <th className="py-3.5 px-4 border-r-2 border-zinc-950 text-right w-32">COSTO ($) EDITABLE</th>
              )}
              <th className="py-3.5 px-4 border-r-2 border-zinc-950 text-right w-36">
                {isVendedorMode ? 'P. VENTA ($)' : 'P. VENTA ($) EDITABLE'}
              </th>
              {!isVendedorMode && (
                <>
                  <th className="py-3.5 px-4 border-r-2 border-zinc-950 text-right w-28">MARGEN ($)</th>
                  <th className="py-3.5 px-4 border-r-2 border-zinc-950 text-right w-28">MARGEN (%)</th>
                </>
              )}
              <th className="py-3.5 px-4 border-r-2 border-zinc-950 text-right w-32 bg-amber-300 text-zinc-950 font-black">DESC. MÁX ($)</th>
              <th className="py-3.5 px-4 border-r-2 border-zinc-950 text-right w-32 bg-amber-300 text-zinc-950 font-black">DESC. MÁX (%)</th>
              <th className="py-3.5 px-4 border-r-2 border-zinc-950 text-center w-32">TIENDA EN LÍNEA</th>
              {!isVendedorMode && (
                <th className="py-3.5 px-4 text-center w-28">ACCIONES</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-400">
            {loading ? (
              <tr>
                <td colSpan={isVendedorMode ? 10 : 14} className="py-16 text-center text-sm font-black tracking-widest animate-pulse">
                  [ PROCESANDO CONSULTA DE BASE DE DATOS... CARGANDO REGISTROS ]
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={isVendedorMode ? 10 : 14} className="py-16 text-center text-sm font-bold opacity-70 tracking-widest">
                  NO SE ENCONTRARON REGISTROS QUE COINCIDAN CON LOS CRITERIOS DE BÚSQUEDA.
                </td>
              </tr>
            ) : (
              products.map((p, idx) => {
                const globalIndex = (page - 1) * limit + idx + 1;
                const isSaving = savingId === p.id;

                // Descuento máximo en USD = 50% del margen de ganancia USD (si margen > 0)
                const maxDiscountUsd = p.marginUsd > 0 ? p.marginUsd / 2 : 0;

                // Porcentaje que representa ese descuento sobre el PVP (salePrice)
                const maxDiscountPercent = p.salePrice > 0 && maxDiscountUsd > 0 ? (maxDiscountUsd / p.salePrice) * 100 : 0;

                return (
                  <tr
                    key={p.id}
                    className={`hover:${themeClasses.highlight} transition-colors border-b border-zinc-400 ${isSaving ? 'opacity-50 bg-amber-200' : ''}`}
                  >
                    <td className="py-2.5 px-4 border-r border-zinc-400 text-center font-mono font-bold opacity-70">
                      {globalIndex}
                    </td>

                    {/* SKU / CÓDIGO */}
                    <td className="py-1.5 px-2 border-r border-zinc-400 font-mono text-xs font-bold uppercase">
                      {!isVendedorMode && isEditMode ? (
                        <input
                          type="text"
                          defaultValue={p.sku || ''}
                          onBlur={(e) => {
                            const val = e.target.value.trim();
                            if (val !== p.sku) {
                              handleUpdateProduct(p.id, 'sku', val);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              (e.target as HTMLInputElement).blur();
                            }
                          }}
                          className={`w-32 px-2 py-1 text-xs font-mono font-bold border-2 ${themeClasses.cellInput} uppercase outline-none rounded`}
                        />
                      ) : (
                        <span>{p.sku}</span>
                      )}
                    </td>

                    {/* DESCRIPCIÓN DEL PRODUCTO (NOMBRE) */}
                    <td className="py-1.5 px-2 border-r border-zinc-400 font-sans text-xs">
                      {!isVendedorMode && isEditMode ? (
                        <input
                          type="text"
                          defaultValue={p.name || ''}
                          onBlur={(e) => {
                            const val = e.target.value.trim();
                            if (val && val !== p.name) {
                              handleUpdateProduct(p.id, 'name', val);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              (e.target as HTMLInputElement).blur();
                            }
                          }}
                          className={`w-full min-w-[240px] px-2 py-1 text-xs font-bold border-2 ${themeClasses.cellInput} outline-none rounded`}
                        />
                      ) : (
                        <span className="font-bold uppercase tracking-wide">{p.name}</span>
                      )}
                    </td>

                    {!isVendedorMode && (
                      <td className="py-2.5 px-4 border-r border-zinc-400 font-mono text-[11px] font-bold uppercase text-zinc-800">
                        {p.provider}
                      </td>
                    )}

                    {/* CATEGORY */}
                    <td className="py-1.5 px-2 border-r border-zinc-400 font-mono text-[11px] uppercase">
                      {!isVendedorMode && isEditMode ? (() => {
                        const matched = categories.find(c => c.id === p.categoryId || c.name.toLowerCase() === (p.category || '').toLowerCase());
                        const selVal = matched ? matched.id : (p.categoryId || '');
                        return (
                          <select
                            value={selVal}
                            onChange={(e) => handleUpdateProduct(p.id, 'categoryId', e.target.value)}
                            className={`w-full px-2 py-1 text-[11px] uppercase border-2 ${themeClasses.cellInput} cursor-pointer font-mono outline-none rounded`}
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
                        <span className="font-bold">{p.category}</span>
                      )}
                    </td>

                    {/* STOCK */}
                    <td className="py-1.5 px-2 border-r border-zinc-400 text-center font-mono font-black">
                      {!isVendedorMode && isEditMode ? (
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
                          className={`w-16 px-2 py-1 text-center text-xs font-mono font-black border-2 ${themeClasses.cellInput} ${p.stock > 0 ? 'text-emerald-700' : 'text-rose-700'} outline-none rounded`}
                        />
                      ) : (
                        <span className={p.stock > 0 ? 'text-emerald-700 font-black' : 'text-rose-700 font-black'}>
                          {p.stock}
                        </span>
                      )}
                    </td>

                    {/* COST PRICE (Solo para Admin / Jefe) */}
                    {!isVendedorMode && (
                      <td className="py-1.5 px-2 border-r border-zinc-400 text-right font-mono font-bold">
                        {isEditMode ? (
                          <div className="flex items-center justify-end gap-1">
                            <span className="opacity-70 text-[10px] font-black">$</span>
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
                              className={`w-20 px-2 py-1 text-right text-xs font-mono font-black border-2 ${themeClasses.cellInput} outline-none rounded`}
                            />
                          </div>
                        ) : (
                          <span className="font-bold">${p.costPrice.toFixed(2)}</span>
                        )}
                      </td>
                    )}

                    {/* SALE PRICE (PVP) */}
                    <td className="py-1.5 px-2 border-r border-zinc-400 text-right font-mono font-black">
                      {!isVendedorMode && isEditMode ? (
                        <div className="flex items-center justify-end gap-1">
                          <span className="opacity-70 text-[10px] font-black">$</span>
                          <input
                            type="number"
                            step="0.01"
                            defaultValue={p.salePrice.toFixed(2)}
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
                            className={`w-20 px-2 py-1 text-right text-xs font-mono font-black border-2 ${themeClasses.cellInput} outline-none rounded`}
                          />
                        </div>
                      ) : (
                        <span className="font-black text-sm text-zinc-950">${p.salePrice.toFixed(2)}</span>
                      )}
                    </td>

                    {/* MARGIN USD */}
                    {!isVendedorMode && (
                      <>
                        <td className="py-2.5 px-4 border-r border-zinc-400 text-right font-mono font-black">
                          <span className={p.marginUsd >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                            {p.marginUsd >= 0 ? `+$${p.marginUsd.toFixed(2)}` : `-$${Math.abs(p.marginUsd).toFixed(2)}`}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 border-r border-zinc-400 text-right font-mono font-black">
                          <span className={p.marginPercent >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                            {p.marginPercent >= 0 ? `+${p.marginPercent.toFixed(1)}%` : `${p.marginPercent.toFixed(1)}%`}
                          </span>
                        </td>
                      </>
                    )}

                    {/* MAX DISCOUNT USD */}
                    <td className="py-2.5 px-4 border-r border-zinc-400 text-right font-mono font-black text-amber-900 bg-amber-100/80">
                      {maxDiscountUsd > 0 ? `-$${maxDiscountUsd.toFixed(2)}` : '$0.00'}
                    </td>

                    {/* MAX DISCOUNT PERCENT */}
                    <td className="py-2.5 px-4 border-r border-zinc-400 text-right font-mono font-black text-amber-900 bg-amber-100/80">
                      {maxDiscountPercent > 0 ? `${maxDiscountPercent.toFixed(2)}%` : '0.00%'}
                    </td>

                    {/* ONLINE STORE DIRECT LINK & QUICK QUOTE */}
                    <td className="py-2.5 px-3 border-r border-zinc-400 text-center font-mono">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openQuoteModalWithProduct(p)}
                          className="border-2 border-zinc-950 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-2 py-1 text-[10px] font-black uppercase transition-all rounded shadow-sm flex items-center gap-1 cursor-pointer"
                          title="Generar cotización rápida de este producto"
                        >
                          <span>📑</span> COTIZAR
                        </button>
                        <button
                          onClick={() => handleQuickPDFForProduct(p)}
                          className="border-2 border-zinc-950 bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 text-[10px] font-black uppercase transition-all rounded shadow-sm flex items-center gap-1 cursor-pointer"
                          title="Generar y compartir proforma PDF oficial"
                        >
                          <span>📄</span> PDF
                        </button>
                        <a
                          href={`/web/product/${p.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block border-2 border-zinc-950 bg-white px-2 py-1 text-[10px] font-black uppercase hover:bg-zinc-950 hover:text-white transition-all rounded shadow-sm"
                          title="Ver en tienda web"
                        >
                          🔗 VER
                        </a>
                      </div>
                    </td>

                    {/* ACTIONS (EDIT / TRASH / RESTORE / PERMANENT DELETE) */}
                    {!isVendedorMode && (
                      <td className="py-2.5 px-2 text-center font-mono">
                        {viewTrash ? (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleRestoreProduct(p.id, p.name)}
                              title="Restaurar a matriz activa"
                              className="px-2 py-1 border-2 border-zinc-950 bg-emerald-600 text-white font-black text-[10px] hover:bg-emerald-700 rounded shadow-sm"
                            >
                              ♻️ RESTAURAR
                            </button>
                            {allowPermanentDelete && (
                              <button
                                onClick={() => handlePermanentDeleteProduct(p.id, p.name)}
                                title="Eliminar definitivamente de BD"
                                className="px-2 py-1 border-2 border-zinc-950 bg-rose-600 text-white font-black text-[10px] hover:bg-rose-700 rounded shadow-sm"
                              >
                                💥 ELIMINAR
                              </button>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            title="Mover a Papelera"
                            className="px-2 py-1 border-2 border-zinc-950 bg-white hover:bg-rose-600 hover:text-white font-black text-[10px] transition-all rounded shadow-sm"
                          >
                            🗑️
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ================= CONTROLES DE PAGINACIÓN RETRO EN RECUADRO INDEPENDIENTE ================= */}
      <div className={`border-2 ${themeClasses.border} p-4 mt-6 ${themeClasses.cardBg} flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl rounded-xl`}>
        <div className="flex items-center gap-3 text-xs font-bold">
          <span>MOSTRAR POR PÁGINA:</span>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(parseInt(e.target.value));
              setPage(1);
            }}
            className={`px-3 py-1.5 border-2 ${themeClasses.cellInput} outline-none cursor-pointer rounded-md font-black`}
          >
            <option value={50}>50 REGISTROS</option>
            <option value={100}>100 REGISTROS</option>
            <option value={150}>150 REGISTROS</option>
            <option value={300}>300 REGISTROS</option>
            <option value={500}>500 REGISTROS</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs font-black">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-4 py-2 border-2 border-zinc-950 font-black rounded-md ${page === 1 ? 'opacity-40 cursor-not-allowed bg-zinc-200' : 'bg-white hover:bg-zinc-950 hover:text-white transition-all shadow-sm'}`}
          >
            ◀ ANTERIOR
          </button>

          <span className="px-4 py-2 border-2 border-zinc-950 bg-white rounded-md shadow-sm">
            PÁGINA {page} DE {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`px-4 py-2 border-2 border-zinc-950 font-black rounded-md ${page === totalPages ? 'opacity-40 cursor-not-allowed bg-zinc-200' : 'bg-white hover:bg-zinc-950 hover:text-white transition-all shadow-sm'}`}
          >
            SIGUIENTE ▶
          </button>
        </div>
      </div>

      {/* ================= MODAL DE LANDING PAGES ACTIVAS ================= */}
      {showLandingsModal && (
        <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border-4 border-zinc-950 rounded-2xl shadow-2xl max-w-2xl w-full p-6 text-zinc-950 font-sans">
            <div className="flex items-center justify-between border-b-2 border-zinc-950 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🚀</span>
                <h3 className="text-base sm:text-lg font-black uppercase font-heading tracking-wider text-zinc-950">
                  CATÁLOGO DE LANDING PAGES ACTIVAS
                </h3>
              </div>
              <button
                onClick={() => setShowLandingsModal(false)}
                className="px-3 py-1 bg-zinc-950 text-white font-black text-xs rounded-lg uppercase hover:bg-rose-600 transition-colors cursor-pointer"
              >
                ✕ Cerrar
              </button>
            </div>

            <p className="text-xs text-zinc-600 font-bold mb-4">
              Selecciona una landing page para abrirla en una pestaña nueva y compartirla con tus clientes:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto p-1">
              {[
                { title: "Generadores Eléctricos + Paneles", path: "/web/generadores", icon: "⚡", badge: "Combos" },
                { title: "Cámaras Espía & Micro Vigilancia", path: "/web/camaras-espia", icon: "🕵️", badge: "Discreto" },
                { title: "PS4 Slim Reacondicionada $325", path: "/web/playstation-4", icon: "🎮", badge: "2 Años G." },
                { title: "Servicio Técnico Consolas", path: "/web/mantenimiento-consolas", icon: "🔧", badge: "10% OFF" },
                { title: "Parlante Smart Alto Rendimiento", path: "/web/parlante-smart", icon: "🔊", badge: "Regalo TWS" },
                { title: "Linterna Steren Potencia", path: "/web/linterna-potencia", icon: "🔦", badge: "Baterías Gratis" },
                { title: "Bot Inteligente 24/7 $99/mes", path: "/web/automatizacion", icon: "🤖", badge: "Atomic Systems" },
                { title: "Scooters Eléctricos Smart", path: "/web/scooters", icon: "🛵", badge: "Segway/Ninebot" },
                { title: "Bicicletas Eléctricas Verano", path: "/web/bicicletas-electricas", icon: "🚲", badge: "25%-40% OFF" },
                { title: "Luminarias Solares Autónomas", path: "/web/luminarias-solares", icon: "💡", badge: "Atomeca" },
                { title: "Iluminación Departamentos", path: "/web/iluminacion", icon: "✨", badge: "Diseño" },
                { title: "Servidores con Instalación", path: "/web/servidores", icon: "🖥️", badge: "Rack & IT" },
                { title: "Pizarra Smart 4K ViewBoard 75\"", path: "/web/pizarras-smart", icon: "📺", badge: "Interactivas" },
                { title: "Monitores Dahua LED", path: "/web/monitores", icon: "🖥️", badge: "Dahua" },
                { title: "Videoporteros Smart DIEL & EZVIZ", path: "/web/videoporteros", icon: "📹", badge: "Antivandálico" },
                { title: "Cámaras de Seguridad Wi-Fi", path: "/web/camaras-wifi", icon: "📡", badge: "A Batería" },
                { title: "Software Control QR & Tickets", path: "/web/software-qr", icon: "🎫", badge: "Acceso" },
                { title: "Impulsa tu Tienda en Línea", path: "/web/tienda-en-linea", icon: "🛍️", badge: "E-Commerce" },
                { title: "Cargadores Laptop Distribuidor", path: "/web/cargadores-laptop", icon: "🔌", badge: "Mayorista" },
                { title: "Ecosistema Contrataciones", path: "/web/contrataciones", icon: "👥", badge: "Empleo $450" },
                { title: "Cargadores de Autos Eléctricos", path: "/web/cargadores-electricos", icon: "🔌", badge: "3 Años G." },
                { title: "Barreras de Cerco Eléctrico", path: "/web/cercos-electricos", icon: "⚡", badge: "Perimetral" },
                { title: "Cerraduras Smart Digitales", path: "/web/cerraduras-smart", icon: "🔐", badge: "30% OFF" },
                { title: "Cámaras para Hogar 4K", path: "/web/camaras-hogar", icon: "📹", badge: "2 Años G." },
                { title: "Ecosistema Apple Oficial", path: "/web/apple", icon: "🍏", badge: "Original" },
                { title: "Laptops & Computación", path: "/web/laptops", icon: "💻", badge: "Equipos" },
                { title: "Repuestos Computadoras", path: "/web/repuestos", icon: "⚙️", badge: "Hardware" },
              ].map((l) => (
                <a
                  key={l.path}
                  href={l.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border-2 border-zinc-950 rounded-xl hover:bg-zinc-100 hover:scale-[1.02] transition-all shadow-sm group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{l.icon}</span>
                    <div>
                      <h4 className="text-xs font-black uppercase text-zinc-900 group-hover:text-blue-600 transition-colors">
                        {l.title}
                      </h4>
                      <span className="text-[10px] text-zinc-500 font-mono">{l.path}</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-zinc-200 border border-zinc-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {l.badge}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL DE COTIZADOR RÁPIDO OFICIAL ================= */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12131C] border-4 border-emerald-500 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.35)] max-w-xl w-full p-6 text-white font-sans overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                <h3 className="text-base sm:text-lg font-black uppercase font-heading tracking-wider text-white">
                  📑 COTIZADOR RÁPIDO OFICIAL
                </h3>
                <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[11px] font-mono font-black px-2.5 py-0.5 rounded-full">
                  {quoteCode}
                </span>
              </div>
              <button
                onClick={() => setShowQuoteModal(false)}
                className="px-3 py-1 bg-zinc-800 text-neutral-300 font-black text-xs rounded-lg uppercase hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
              >
                ✕ Cerrar
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase text-neutral-400 block mb-1">
                    👤 Nombre del Cliente *
                  </label>
                  <input
                    type="text"
                    value={quoteClient}
                    onChange={(e) => setQuoteClient(e.target.value)}
                    placeholder="Ej. Ing. Carlos Mendoza / Empresa ABC"
                    className="w-full bg-[#1A1C28] border border-white/15 rounded-lg px-3 py-2 text-xs font-bold text-white placeholder-neutral-500 outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase text-neutral-400 block mb-1">
                    📱 Teléfono / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={quotePhone}
                    onChange={(e) => setQuotePhone(e.target.value)}
                    placeholder="Ej. 0992823615"
                    className="w-full bg-[#1A1C28] border border-white/15 rounded-lg px-3 py-2 text-xs font-bold text-white placeholder-neutral-500 outline-none focus:border-emerald-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono font-bold uppercase text-neutral-400 block mb-1">
                  📍 Ciudad / Ubicación de Entrega
                </label>
                <input
                  type="text"
                  value={quoteLocation}
                  onChange={(e) => setQuoteLocation(e.target.value)}
                  placeholder="Ej. Quito / Guayaquil / Cuenca / Entrega Express"
                  className="w-full bg-[#1A1C28] border border-white/15 rounded-lg px-3 py-2 text-xs font-bold text-white placeholder-neutral-500 outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono font-bold uppercase text-neutral-400 block mb-1">
                  📦 Producto / Equipamiento Cotizado *
                </label>
                <input
                  type="text"
                  value={quoteProductName}
                  onChange={(e) => setQuoteProductName(e.target.value)}
                  placeholder="Nombre completo del producto..."
                  className="w-full bg-[#1A1C28] border border-white/15 rounded-lg px-3 py-2 text-xs font-black text-emerald-300 placeholder-neutral-500 outline-none focus:border-emerald-400 uppercase"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono font-bold uppercase text-neutral-400 block mb-1">
                  📋 Especificaciones / Beneficios Incluidos
                </label>
                <textarea
                  rows={3}
                  value={quoteSpecs}
                  onChange={(e) => setQuoteSpecs(e.target.value)}
                  placeholder="Detalles técnicos, garantía, accesorios..."
                  className="w-full bg-[#1A1C28] border border-white/15 rounded-lg p-2.5 text-xs text-neutral-200 placeholder-neutral-500 outline-none focus:border-emerald-400 font-mono leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase text-neutral-400 block mb-1">
                    💵 Precio Unit ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={quotePrice || ''}
                    onChange={(e) => setQuotePrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#1A1C28] border border-white/15 rounded-lg px-3 py-2 text-xs font-mono font-bold text-white outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase text-neutral-400 block mb-1">
                    🔢 Cantidad
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quoteQty || ''}
                    onChange={(e) => setQuoteQty(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#1A1C28] border border-white/15 rounded-lg px-3 py-2 text-xs font-mono font-bold text-white outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase text-amber-400 block mb-1">
                    🏷️ Desc ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={quoteDiscount || ''}
                    onChange={(e) => setQuoteDiscount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#1A1C28] border border-amber-500/40 rounded-lg px-3 py-2 text-xs font-mono font-bold text-amber-300 outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase text-cyan-400 block mb-1">
                    🚚 Envío/Instal ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={quoteShipping || ''}
                    onChange={(e) => setQuoteShipping(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#1A1C28] border border-cyan-500/40 rounded-lg px-3 py-2 text-xs font-mono font-bold text-cyan-300 outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* TOTAL DISPLAY BOX */}
              <div className="bg-gradient-to-r from-emerald-950/60 to-teal-950/60 border-2 border-emerald-500/50 rounded-xl p-3.5 flex items-center justify-between shadow-lg">
                <div>
                  <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase block">TOTAL PROFORMA:</span>
                  <span className="text-xs text-neutral-300 font-medium">Incluye IVA y garantía oficial</span>
                </div>
                <span className="text-2xl font-black font-mono text-emerald-400 tracking-tight">
                  ${getQuoteTotal().toFixed(2)} USD
                </span>
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="pt-4 mt-3 border-t border-white/10 flex flex-col gap-2 shrink-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* 1. COMPARTIR PDF A WHATSAPP */}
                <button
                  onClick={handleSharePDFQuote}
                  disabled={isGeneratingPDF}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-heading font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 cursor-pointer active:scale-98 disabled:opacity-50"
                  title="Generar y compartir proforma oficial en PDF a WhatsApp"
                >
                  {isGeneratingPDF ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>GENERANDO PDF...</span>
                    </>
                  ) : (
                    <>
                      <span>📄</span>
                      <span>COMPARTIR PDF A WHATSAPP</span>
                    </>
                  )}
                </button>

                {/* 2. DESCARGAR PDF */}
                <button
                  onClick={handleDownloadPDFQuote}
                  disabled={isGeneratingPDF}
                  className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-heading font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 cursor-pointer active:scale-98 disabled:opacity-50"
                  title="Descargar documento PDF oficial"
                >
                  <span>⬇️</span>
                  <span>DESCARGAR PDF</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* 3. ENVIAR TEXTO A WHATSAPP */}
                <button
                  onClick={handleSendWhatsAppQuote}
                  className="py-2.5 px-4 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-heading font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  title="Enviar texto de proforma por WhatsApp"
                >
                  <span>💬</span>
                  <span>ENVIAR TEXTO A WHATSAPP</span>
                </button>

                {/* 4. COPIAR TEXTO */}
                <button
                  onClick={handleCopyQuoteText}
                  className="py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-heading font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-white/10 cursor-pointer"
                  title="Copiar texto formateado al portapapeles"
                >
                  <span>📋</span>
                  <span>COPIAR TEXTO</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
