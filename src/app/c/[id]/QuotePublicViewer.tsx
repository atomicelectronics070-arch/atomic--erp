"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  FileText, Download, Share2, MessageCircle, ShieldCheck, 
  CheckCircle2, Clock, MapPin, Phone, Mail, User, 
  Building2, Sparkles, ArrowLeft, Copy, Check, FileSpreadsheet
} from "lucide-react";
import { generateAtomicUnifiedProposalPDF } from "@/lib/pdf/quotePdfGenerator";
import { QRCodeCanvas } from "qrcode.react";

interface PublicQuoteViewerProps {
  quote: any;
  items: any[];
}

export default function QuotePublicViewer({ quote, items }: PublicQuoteViewerProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const formattedDate = new Date(quote.createdAt).toLocaleDateString("es-EC", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const quoteUrl = typeof window !== "undefined" ? window.location.href : `https://atomiccotizador.shop/c/${quote.quoteNumber}`;

  const shareText = `Te compartimos aquí la cotización correspondiente a tu petición.\nRecuerda solicitar un descuento a tu asesor y consultar tu cotización para siempre aquí:\n${quoteUrl}`;

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `Cotización ${quote.quoteNumber} · ATOMIC Solutions`,
          text: shareText,
          url: quoteUrl
        });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    }
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const qrCanvas = document.getElementById("atomic-quote-public-qr-canvas") as HTMLCanvasElement;
      const qrDataUri = qrCanvas ? qrCanvas.toDataURL("image/png") : undefined;

      const pdfData = await generateAtomicUnifiedProposalPDF({
        quoteNumber: quote.quoteNumber,
        clientName: quote.client?.name || quote.clientName || "Cliente",
        clientCedula: quote.client?.cedula || quote.clientCedula || "",
        clientPhone: quote.client?.phone || quote.clientPhone || "",
        clientEmail: quote.client?.email || quote.clientEmail || "",
        clientCity: quote.city || quote.client?.city || "Quito",
        deliveryAddress: quote.deliveryAddress || "",
        quoteSubject: quote.quoteSubject || quote.specs || "PROPUESTA TÉCNICA COMERCIAL",
        advisorName: quote.advisorName || quote.salesperson?.name || "ASESOR ATOMIC",
        advisorPhone: quote.salesperson?.phone || "0999047979",
        items: items.map((i: any) => ({
          sku: i.sku || i.productId || "SKU-GEN",
          productId: i.productId,
          name: i.description || i.name,
          description: i.description || i.name,
          quantity: Number(i.quantity || 1),
          unitPrice: Number(i.unitPrice || 0),
          discountPercent: Number(i.discountPercent || 0),
          discountAmount: Number(i.discountAmount || 0),
          total: Number(i.total || (i.quantity * i.unitPrice))
        })),
        specs: quote.quoteSubject || quote.specs || "",
        subtotal: Number(quote.subtotal || 0),
        taxAmount: Number(quote.taxAmount || 0),
        taxPercent: 15,
        discountAmount: Number(quote.discountAmount || 0),
        total: Number(quote.total || 0),
        qrCodeUrl: quoteUrl,
        qrDataUri
      });

      pdfData.doc.save(pdfData.fileName);
    } catch (e) {
      console.error("Error al generar PDF:", e);
      alert("Error al descargar el PDF de la cotización.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadExcel = () => {
    window.location.href = `/api/quotes/export-excel?quoteNumber=${encodeURIComponent(quote.quoteNumber)}`;
  };

  const advisorPhoneClean = (quote.salesperson?.phone || "0969043453").replace(/\D/g, "");
  const whatsappUrl = `https://api.whatsapp.com/send?phone=593${advisorPhoneClean.replace(/^0/, "")}&text=${encodeURIComponent(
    `Hola ${quote.advisorName || "Asesor"}, tengo la cotización oficial ${quote.quoteNumber} a nombre de ${quote.clientName || "Cliente"}. Deseo consultar disponibilidad y solicitar mi descuento especial.`
  )}`;

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-white pb-24">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 px-4 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Link 
            href="/web" 
            className="flex items-center gap-2.5 text-xs font-mono font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Volver a Tienda
          </Link>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono font-bold rounded-full">
              <ShieldCheck size={14} /> Documento Oficial y Verificado
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 pt-8 space-y-6">
        
        {/* Header Hero Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/50 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest mb-1.5">
                <Sparkles size={14} /> ATOMIC Solutions · Ecuador
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Propuesta Técnica Comercial
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-1 capitalize">
                {formattedDate}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Número de Proforma</span>
              <span className="text-xl sm:text-2xl font-black text-cyan-400 font-mono tracking-wider bg-cyan-950/40 border border-cyan-500/30 px-3.5 py-1 rounded-2xl inline-block mt-0.5">
                {quote.quoteNumber}
              </span>
            </div>
          </div>

          {/* Quick Actions Row */}
          <div className="flex flex-wrap items-center gap-3 pt-6">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex-1 sm:flex-initial px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.35)] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download size={15} />
              {isGeneratingPdf ? "Generando PDF..." : "Descargar PDF A4"}
            </button>

            <button
              onClick={handleDownloadExcel}
              className="flex-1 sm:flex-initial px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
              title="Descargar versión Excel idéntica a plantilla oficial con Logo superior"
            >
              <FileSpreadsheet size={15} /> Descargar Excel (.xlsx)
            </button>

            <button
              onClick={handleShare}
              className="flex-1 sm:flex-initial px-5 py-3 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 font-mono font-bold text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              {isCopied ? <Check size={15} className="text-emerald-400" /> : <Share2 size={15} />}
              {isCopied ? "¡Enlace Copiado!" : "Compartir Cotización"}
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-5 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-bold text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle size={15} /> Solicitar Descuento
            </a>
          </div>
        </div>

        {/* Client & Project Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-3xl space-y-3">
            <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <User size={13} /> Información del Cliente
            </p>
            <div>
              <p className="text-base font-black text-white uppercase">{quote.clientName || "Cliente General"}</p>
              {quote.client?.cedula && (
                <p className="text-xs font-mono text-slate-400 mt-0.5">•CI/•RUC: <span className="text-slate-200 font-bold">{quote.client.cedula}</span></p>
              )}
            </div>
            <div className="pt-2 border-t border-slate-800 text-xs font-mono text-slate-400 space-y-1">
              <p className="flex items-center gap-2"><Phone size={13} className="text-slate-500"/> {quote.clientPhone || "Sin teléfono"}</p>
              <p className="flex items-center gap-2"><MapPin size={13} className="text-slate-500"/> {quote.city || quote.deliveryAddress || "Quito, Ecuador"}</p>
              {quote.clientEmail && quote.clientEmail !== "no@especifica.com" && (
                <p className="flex items-center gap-2"><Mail size={13} className="text-slate-500"/> {quote.clientEmail}</p>
              )}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-3xl space-y-3">
            <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Building2 size={13} /> Asesor & Proyecto
            </p>
            <div>
              <p className="text-base font-black text-white uppercase">{quote.advisorName || "Asesor Comercial"}</p>
              <p className="text-xs font-mono text-slate-400 mt-0.5">Representante Técnico Comercial ATOMIC</p>
            </div>
            <div className="pt-2 border-t border-slate-800 text-xs font-mono text-slate-300">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tema / Asunto:</p>
              <p className="font-bold text-white bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                {quote.quoteSubject || quote.specs || "Suministro e Instalación de Equipos"}
              </p>
            </div>
          </div>
        </div>

        {/* Items Table Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <FileText size={16} className="text-cyan-400" /> Detalle de Productos y Servicios ({items.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase font-bold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Descripción del Ítem</th>
                  <th className="py-3 px-4 w-20 text-center">Cant.</th>
                  <th className="py-3 px-4 w-28 text-right">P. Unit</th>
                  <th className="py-3 px-4 w-28 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {items.map((item: any, idx: number) => {
                  const lineTotal = item.total !== undefined ? Number(item.total) : (Number(item.quantity || 1) * Number(item.unitPrice || 0));
                  return (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 text-center font-bold text-slate-400">{idx + 1}</td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-white">{item.description || item.name}</p>
                        {item.sku && item.sku !== "SKU-GEN" && (
                          <span className="text-[10px] text-cyan-400/80 font-mono">SKU: {item.sku}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-white">{item.quantity}</td>
                      <td className="py-3.5 px-4 text-right">${Number(item.unitPrice).toFixed(2)}</td>
                      <td className="py-3.5 px-4 text-right font-black text-cyan-300">${lineTotal.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Financial Summary */}
          <div className="bg-slate-950 p-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-1.5 text-xs text-slate-400 font-mono">
              <p className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-400"/> Garantía oficial de 1 año con soporte técnico</p>
              <p className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-400"/> Precios en Dólares Americanos (USD)</p>
              <p className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-400"/> Envíos seguros y despachos a todo el Ecuador</p>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span>${Number(quote.subtotal || quote.total).toFixed(2)}</span>
              </div>
              {quote.discountAmount && Number(quote.discountAmount) > 0 && (
                <div className="flex justify-between text-rose-400">
                  <span>Descuento:</span>
                  <span>-${Number(quote.discountAmount).toFixed(2)}</span>
                </div>
              )}
              {quote.taxAmount && Number(quote.taxAmount) > 0 && (
                <div className="flex justify-between text-slate-400">
                  <span>IVA (15%):</span>
                  <span>${Number(quote.taxAmount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-3 border-t border-slate-800 text-sm font-black">
                <span className="text-white uppercase">Total Liquidación:</span>
                <span className="text-2xl text-emerald-400 font-mono tracking-tight" style={{ textShadow: "0 0 20px rgba(74,222,128,0.4)" }}>
                  ${Number(quote.total).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Share & Notice Box */}
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl text-center space-y-3">
          <p className="text-xs font-mono text-slate-300">
            ¿Deseas guardar o compartir esta cotización?
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={handleShare}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-2"
            >
              <Share2 size={14} /> Compartir por WhatsApp o Redes
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-slate-950 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-xs rounded-xl hover:bg-slate-900 transition-all flex items-center gap-2"
            >
              <MessageCircle size={14} /> Hablar con Asesor
            </a>
          </div>
          <p className="text-[10px] text-slate-500 font-mono">
            Documento emitido electrónicamente por ATOMIC Ecuador · www.atomiccotizador.shop
          </p>
        </div>

        {/* Canvas oculto para generación de QR en exportación de PDF */}
        <div aria-hidden="true" style={{ position: "fixed", left: "-9999px", top: "-9999px", opacity: 0, pointerEvents: "none" }}>
          <QRCodeCanvas id="atomic-quote-public-qr-canvas" value={quoteUrl} size={256} level="M" marginSize={1} />
        </div>

      </main>
    </div>
  );
}
