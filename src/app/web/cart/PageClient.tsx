"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Smartphone,
  Building2,
  CreditCard,
  ChevronLeft,
  Sparkles,
  Mail,
  FileText,
  CheckCircle2,
  Info,
  Download,
  X,
  Wallet,
  ShieldCheck,
  Phone,
  Lock,
  Printer
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils/pricing";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { data: session } = useSession();

  // Payment & Order State
  const [paymentMethod, setPaymentMethod] = useState<"payphone" | "transfer" | "cod" | "oc">("payphone");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [showOCForm, setShowOCForm] = useState(false);
  const [agreedToDeposit, setAgreedToDeposit] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState<any[]>([]);
  const [payphoneOrder, setPayphoneOrder] = useState<any>(null);
  const [showPayphoneModal, setShowPayphoneModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Client Details Form State
  const [ocData, setOcData] = useState({
    clientName: "",
    ruc: "",
    phone: "",
    city: "QUITO",
    address: "",
    notes: ""
  });

  // Fetch suggested cross-sell products
  useEffect(() => {
    const fetchSuggested = async () => {
      try {
        const res = await fetch("/api/products?limit=8");
        if (res.ok) {
          const data = await res.json();
          setSuggestedProducts(data.filter((p: any) => !items.some((it) => it.id === p.id)).slice(0, 4));
        }
      } catch (e) {
        console.error("Error fetching suggestions:", e);
      }
    };
    fetchSuggested();
  }, [items]);

  // Financial Calculations
  const subtotal = totalPrice;
  const isEligibleDiscount = subtotal > 150;
  const discount = isEligibleDiscount ? subtotal * 0.05 : 0; // 5% de descuento por volumen
  const finalTotal = subtotal - discount;

  // Formal PDF Quotation & Purchase Order Generator
  const handleExportPDF = () => {
    if (!ocData.clientName) {
      alert("Por favor ingresa tu Nombre o Razón Social para generar la proforma.");
      return;
    }

    const doc = new jsPDF();
    const orderId = `COT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Header Background
    doc.setFillColor(3, 7, 18);
    doc.rect(0, 0, 210, 38, "F");

    // Brand Header
    doc.setFontSize(20);
    doc.setTextColor(56, 189, 248);
    doc.text("ATOMIC INDUSTRIES ECUADOR", 14, 18);
    doc.setFontSize(9);
    doc.setTextColor(203, 213, 225);
    doc.text("Tecnología Residencial • Seguridad Electrónica • Movilidad & Energía", 14, 25);
    doc.text("RUC: 1792458921001 • Quito, Ecuador • www.atomicecuador.com", 14, 31);

    // Metadata Right Box
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(`PROFORMA / COTIZACIÓN`, 140, 16);
    doc.setFontSize(9);
    doc.setTextColor(56, 189, 248);
    doc.text(`N°: ${orderId}`, 140, 22);
    doc.setTextColor(203, 213, 225);
    doc.text(`Fecha: ${new Date().toLocaleDateString("es-EC")}`, 140, 28);
    doc.text(`Validez: 15 Días Hábiles`, 140, 33);

    // Client Info Section
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("DATOS DEL CLIENTE / PROFORMA", 14, 48);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text(`Cliente / Razón Social: ${ocData.clientName.toUpperCase()}`, 14, 55);
    doc.text(`RUC / C.I.: ${ocData.ruc || "Consumidor Final"}`, 14, 61);
    doc.text(`Teléfono / WhatsApp: ${ocData.phone || "No especificado"}`, 14, 67);
    doc.text(`Ciudad & Dirección: ${(ocData.city + " - " + (ocData.address || "Oficina / Domicilio")).toUpperCase()}`, 14, 73);

    // Items Table
    autoTable(doc, {
      startY: 82,
      head: [["Ítem / Descripción", "Cant.", "Precio Unitario", "Subtotal"]],
      body: items.map((i) => [
        i.name.toUpperCase(),
        i.quantity,
        `$${i.price.toFixed(2)} USD`,
        `$${(i.quantity * i.price).toFixed(2)} USD`
      ]),
      theme: "grid",
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [56, 189, 248],
        fontSize: 9,
        fontStyle: "bold"
      },
      styles: { fontSize: 8, textColor: [30, 41, 59] },
      columnStyles: {
        0: { cellWidth: 105 },
        1: { halign: "center", cellWidth: 20 },
        2: { halign: "right", cellWidth: 35 },
        3: { halign: "right", cellWidth: 35 }
      }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;

    // Totals Box Right
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(`Subtotal General:`, 130, finalY);
    doc.text(`$${subtotal.toFixed(2)} USD`, 195, finalY, { align: "right" });

    if (discount > 0) {
      doc.setTextColor(16, 185, 129);
      doc.text(`Descuento Especial:`, 130, finalY + 6);
      doc.text(`-$${discount.toFixed(2)} USD`, 195, finalY + 6, { align: "right" });
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(`TOTAL A LIQUIDAR:`, 130, finalY + 14);
    doc.setTextColor(2, 132, 199);
    doc.text(`$${finalTotal.toFixed(2)} USD`, 195, finalY + 14, { align: "right" });

    // Terms & Conditions Footer
    const termsY = finalY + 28;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text("TÉRMINOS COMERCIALES & GARANTÍA:", 14, termsY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text("• Precios oficiales en dólares de los Estados Unidos de América (USD).", 14, termsY + 5);
    doc.text("• Garantía oficial ATOMIC: 1 a 3 años según equipo contra defectos de fábrica.", 14, termsY + 9);
    doc.text("• Despacho nacional express vía Servientrega o entrega personalizada en Quito.", 14, termsY + 13);
    doc.text("• Cuentas bancarias autorizadas: Banco Pichincha, Guayaquil y Produbanco.", 14, termsY + 17);

    doc.save(`${orderId}_${ocData.clientName.replace(/\s+/g, "_")}.pdf`);
  };

  // Main Checkout Flow
  const handleCheckout = async () => {
    if (!email) {
      alert("Por favor ingresa tu correo electrónico para enviarte la confirmación del pedido.");
      return;
    }

    if (paymentMethod === "cod" && subtotal > 100 && !agreedToDeposit) {
      alert("Para compras mayores a $100 mediante Contra Entrega, se requiere un anticipo del 50%.");
      return;
    }

    setLoading(true);

    try {
      // 1. Crear Orden Oficial en Base de Datos vía API
      const createRes = await fetch("/api/checkout/payphone/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customerName: ocData.clientName || session?.user?.name || email.split("@")[0],
          customerEmail: email,
          customerPhone: ocData.phone || "",
          city: ocData.city,
          address: ocData.address,
          notes: ocData.notes,
          paymentMethod
        })
      });

      const orderResult = await createRes.json();

      if (!createRes.ok || !orderResult.success) {
        throw new Error(orderResult.error || "No se pudo registrar la orden en el servidor.");
      }

      // 2. Si es PayPhone o Tarjeta -> Abrir pasarela
      if (paymentMethod === "payphone") {
        setPayphoneOrder(orderResult);
        setShowPayphoneModal(true);
        setLoading(false);
        return;
      }

      // 3. Métodos Transferencia, Contra Entrega o Cotización -> Enviar a WhatsApp con número de orden
      const methodLabels: any = {
        payphone: "Tarjeta de Crédito / Débito (PayPhone 🇪🇨)",
        transfer: "Transferencia Bancaria Directa",
        cod: "Contra Entrega Nacional",
        oc: "Orden de Compra / Cotización Formal"
      };

      let message = `🛒 *NUEVO PEDIDO REGISTRADO EN ATOMIC*\n\n`;
      message += `📋 *Orden N°:* #${orderResult.orderNumber}\n`;
      message += `👤 *Cliente:* ${ocData.clientName || session?.user?.name || "Cliente Web"}\n`;
      message += `📧 *Email:* ${email}\n`;
      message += `📱 *Teléfono:* ${ocData.phone || "No especificado"}\n`;
      message += `📍 *Ubicación:* ${ocData.city} ${ocData.address ? `- ${ocData.address}` : ""}\n`;
      message += `💳 *Método de Pago:* ${methodLabels[paymentMethod] || paymentMethod}\n\n`;
      message += `📦 *DETALLE DE LOS PRODUCTOS:*\n`;

      items.forEach((it, idx) => {
        message += `${idx + 1}. ${it.quantity}x ${it.name} ➔ $${(it.price * it.quantity).toFixed(2)} USD\n`;
      });

      message += `\n💵 *Subtotal:* $${subtotal.toFixed(2)} USD\n`;
      if (discount > 0) {
        message += `🎁 *Descuento Especial:* -$${discount.toFixed(2)} USD\n`;
      }
      message += `💰 *TOTAL A PAGAR:* $${finalTotal.toFixed(2)} USD\n\n`;
      if (ocData.notes) {
        message += `📝 *Notas:* ${ocData.notes}\n\n`;
      }
      message += `_Deseo confirmar el pago y coordinar el despacho inmediato._`;

      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/593969043453?text=${encodedMessage}`, "_blank");
    } catch (err: any) {
      alert(err.message || "Error al procesar el pedido.");
    } finally {
      setLoading(false);
    }
  };

  // Empty Cart State
  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#030712] text-slate-100 font-sans flex flex-col items-center justify-center p-6 selection:bg-cyan-500/30">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.15)] text-cyan-400">
            <ShoppingBag size={44} />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-white uppercase tracking-tight">
              Tu Carrito está Vacío
            </h1>
            <p className="text-slate-400 text-sm font-light leading-relaxed">
              Explora nuestras divisiones tecnológicas y añade consolas, barreras, cargadores o smartphones a tu selección.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/web"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs font-mono uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
            >
              Explorar Tienda Oficial
            </Link>
            <Link
              href="/web/gaming"
              className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs font-mono uppercase tracking-wider transition-all"
            >
              Ver Consolas & PS5
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Active Cart State
  return (
    <main className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-white pb-24">
      {/* Lights */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[180px]" />
        <div className="absolute bottom-[-10%] right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[180px]" />
      </div>

      {/* Top Nav */}
      <nav className="relative z-20 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 px-6 py-4 flex items-center justify-between">
        <Link href="/web" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            A
          </div>
          <div>
            <span className="font-heading font-black tracking-wider text-sm text-white group-hover:text-cyan-400 transition-colors">
              ATOMIC <span className="text-cyan-400 font-mono text-xs">// CHECKOUT SEGURO</span>
            </span>
            <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest">
              Carrito de Compras Oficial
            </span>
          </div>
        </Link>

        <Link
          href="/web"
          className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={16} /> Continuar Comprando
        </Link>
      </nav>

      {/* Cart Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-12">
        {/* Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              DESPACHO NACIONAL ASEGURADO
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase text-white font-heading mt-2">
              TU CARRITO <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">DE HARDWARE</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>{items.length} producto{items.length !== 1 ? "s" : ""} seleccionado{items.length !== 1 ? "s" : ""}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Items List */}
          <div className="lg:col-span-7 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 transition-all hover:border-slate-700"
              >
                {/* Product Thumbnail */}
                <div className="w-24 h-24 rounded-xl bg-slate-950 border border-slate-800 p-2 flex items-center justify-center shrink-0 overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/gaming/ps4-slim-1tb-god-of-war.jpg";
                      }}
                    />
                  ) : (
                    <ShoppingBag size={24} className="text-slate-600" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 text-center sm:text-left space-y-1">
                  <h3 className="font-heading font-black text-sm text-white truncate">{item.name}</h3>
                  <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                    Garantía Oficial ATOMIC
                  </p>
                  <p className="text-base font-black font-mono text-white pt-1">
                    ${item.price.toFixed(2)} <span className="text-[10px] font-normal text-slate-400">USD c/u</span>
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-10 text-center text-xs font-mono font-bold text-white">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 hover:text-red-400 hover:border-red-500/30 transition-all"
                    title="Eliminar producto"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {/* Quick Actions Bar */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={clearCart}
                className="text-xs font-mono text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1.5"
              >
                <Trash2 size={13} /> Vaciar carrito
              </button>

              <button
                type="button"
                onClick={() => setShowOCForm(true)}
                className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-xl"
              >
                <Printer size={14} /> Exportar Proforma / PDF
              </button>
            </div>
          </div>

          {/* Right Column: Checkout Architecture */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
                Resumen de Orden & Liquidación
              </h2>

              {/* Price Breakdown */}
              <div className="space-y-3 pb-6 border-b border-slate-800 font-mono text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal ({items.reduce((acc, it) => acc + it.quantity, 0)} ítems):</span>
                  <span className="text-white font-bold">${subtotal.toFixed(2)} USD</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Descuento Volumen (5%):</span>
                    <span>-${discount.toFixed(2)} USD</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-400">
                  <span>Envío Express a Domicilio:</span>
                  <span className="text-emerald-400 font-bold">GRATIS (Promoción)</span>
                </div>

                <div className="flex justify-between items-baseline pt-4 border-t border-slate-800 text-sm">
                  <span className="font-heading font-black text-white text-base">TOTAL A PAGAR:</span>
                  <span className="text-3xl font-black font-mono text-cyan-400">
                    ${finalTotal.toFixed(2)} <span className="text-xs text-slate-400 font-normal">USD</span>
                  </span>
                </div>
              </div>

              {/* Customer Contact Inputs */}
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-[11px] text-slate-400 uppercase tracking-wider mb-1">
                    Correo para Comprobante *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 uppercase tracking-wider mb-1">
                      Nombre / Contacto
                    </label>
                    <input
                      type="text"
                      value={ocData.clientName}
                      onChange={(e) => setOcData({ ...ocData, clientName: e.target.value })}
                      placeholder="Juan Pérez"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 uppercase tracking-wider mb-1">
                      WhatsApp Celular
                    </label>
                    <input
                      type="text"
                      value={ocData.phone}
                      onChange={(e) => setOcData({ ...ocData, phone: e.target.value })}
                      placeholder="099..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods Tabs */}
              <div className="space-y-2">
                <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Selecciona Método de Pago
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: "payphone", icon: CreditCard, title: "Tarjeta Crédito / Débito (PayPhone 🇪🇨)", badge: "Instantáneo" },
                    { id: "transfer", icon: Building2, title: "Transferencia Bancaria (Pichincha / Guayaquil)", badge: "Cero Comisión" },
                    { id: "cod", icon: Wallet, title: "Contra Entrega a Domicilio Nacional", badge: "Anticipo 50% > $100" }
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSelected = paymentMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                          isSelected
                            ? "bg-slate-950 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                            : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={16} className={isSelected ? "text-cyan-400" : "text-slate-500"} />
                          <div>
                            <p className="font-mono text-xs font-bold text-white">{m.title}</p>
                            <p className="text-[10px] font-mono text-slate-400">{m.badge}</p>
                          </div>
                        </div>
                        <div className={`w-3 h-3 rounded-full border ${isSelected ? "border-cyan-400 bg-cyan-400" : "border-slate-700"}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* COD Disclaimer */}
              {paymentMethod === "cod" && subtotal > 100 && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono text-amber-300 space-y-2">
                  <p className="font-bold flex items-center gap-1.5">
                    <Info size={14} /> Pedidos mayores a $100:
                  </p>
                  <p className="text-[10px] text-amber-400/90 leading-tight">
                    Solicitamos un anticipo de garantía del 50% para despachar tu encomienda asegurada. El saldo se liquida al recibir en tus manos.
                  </p>
                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={agreedToDeposit}
                      onChange={(e) => setAgreedToDeposit(e.target.checked)}
                      className="accent-cyan-500"
                    />
                    <span className="text-[10px] font-bold text-white">Acepto las condiciones de despacho</span>
                  </label>
                </div>
              )}

              {/* Action Submit Button */}
              <button
                type="button"
                onClick={handleCheckout}
                disabled={loading || (paymentMethod === "cod" && subtotal > 100 && !agreedToDeposit)}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-heading font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Registrando Pedido...</span>
                ) : paymentMethod === "payphone" ? (
                  <>
                    <CreditCard size={16} />
                    <span>Pagar con Tarjeta en Línea</span>
                  </>
                ) : (
                  <>
                    <Phone size={16} />
                    <span>Confirmar Pedido por WhatsApp</span>
                  </>
                )}
              </button>

              <p className="text-[10px] font-mono text-center text-slate-500 flex items-center justify-center gap-1.5">
                <Lock size={12} /> Cifrado SSL 256 bits • Garantía oficial ATOMIC
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PayPhone Modal */}
      <AnimatePresence>
        {showPayphoneModal && payphoneOrder && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-950/85 backdrop-blur-2xl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0b1021] border border-cyan-500/40 max-w-lg w-full rounded-3xl p-8 shadow-[0_0_60px_rgba(6,182,212,0.25)] relative text-white"
            >
              <button
                type="button"
                onClick={() => setShowPayphoneModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
              >
                <X size={18} />
              </button>

              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mx-auto mb-3">
                  <CreditCard size={28} />
                </div>
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[9px] font-black uppercase tracking-widest">
                  PayPhone 🇪🇨 Pasarela Certificada
                </span>
                <h3 className="text-xl font-heading font-black uppercase tracking-tight text-white mt-2">
                  Orden #{payphoneOrder.orderNumber}
                </h3>
                <p className="text-xs text-slate-400 mt-1">Visa, Mastercard, Diners, Discover y Saldo PayPhone.</p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 mb-6 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Total Liquidar:</span>
                  <span className="text-cyan-400 font-bold text-base">
                    ${Number(payphoneOrder.total || finalTotal).toFixed(2)} USD
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setProcessingPayment(true);
                  setTimeout(() => {
                    window.location.href = `/web/checkout/confirm?orderNumber=${payphoneOrder.orderNumber}&id=PAYPHONE-TRX-${Date.now()}`;
                  }, 1200);
                }}
                disabled={processingPayment}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs uppercase font-mono tracking-wider transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
              >
                {processingPayment ? "Autorizando transacción..." : "CONFIRMAR PAGO EN LÍNEA"}
                <ArrowRight size={14} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Proforma / PDF Modal */}
      <AnimatePresence>
        {showOCForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/85 backdrop-blur-xl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-white text-base">Generar Proforma en PDF</h3>
                    <p className="text-[10px] font-mono text-slate-400">Documento formal con validez de 15 días</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowOCForm(false)}
                  className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">Nombre o Empresa *</label>
                  <input
                    type="text"
                    value={ocData.clientName}
                    onChange={(e) => setOcData({ ...ocData, clientName: e.target.value })}
                    placeholder="Empresa o Nombre Completo"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:border-cyan-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">RUC o Cédula</label>
                  <input
                    type="text"
                    value={ocData.ruc}
                    onChange={(e) => setOcData({ ...ocData, ruc: e.target.value })}
                    placeholder="179..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:border-cyan-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">Ciudad & Dirección</label>
                  <input
                    type="text"
                    value={ocData.address}
                    onChange={(e) => setOcData({ ...ocData, address: e.target.value })}
                    placeholder="Quito Norte / Av. Amazonas"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:border-cyan-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={handleExportPDF}
                  className="flex-1 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                >
                  <Download size={14} />
                  <span>Descargar PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowOCForm(false)}
                  className="px-4 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs font-mono hover:bg-slate-700"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
