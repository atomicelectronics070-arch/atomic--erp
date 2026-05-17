"use client"
import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, Send, Upload, Phone, CheckCircle2, Settings, Users, Image as ImageIcon, X, Plus, Camera } from "lucide-react"

type Phase = "onboarding"|"loading_ads"|"ads_ready"|"upload_mode"|"phone_mode"

interface BotMsg { id: string; from: "bot"|"user"; text?: string; type?: "buttons"|"products"|"upload"|"phone_form"|"ad_texts"|"ad_images" }

const INITIAL_MSGS: BotMsg[] = [
  { id:"1", from:"bot", text:"\u00a1Hola! \ud83d\udc4b Bienvenido a Atomic Industries. Soy tu asistente de ruta. Estoy aqu\u00ed para asignarte tus productos estrat\u00e9gicos del d\u00eda, generar tus dise\u00f1os y darte los copys para que publiques." },
]

const safeParseArray = (str: any, fallback: any = []) => {
    if (!str || str === 'null' || str === '[]' || str === '') return fallback;
    if (Array.isArray(str)) return str.length > 0 ? str : fallback;
    if (typeof str === 'string') {
        try {
            let parsed = JSON.parse(str);
            if (Array.isArray(parsed)) return parsed;
        } catch (e) {}
        return [str];
    }
    return fallback;
};

const proxyImg = (url: string): string => {
    if (!url) return ''
    if (url.startsWith('/api/img-proxy') || url.startsWith('/') || url.startsWith('data:')) return url
    return `/api/img-proxy?url=${encodeURIComponent(url)}`
}

function drawBanner(
  productName: string, 
  price: number, 
  imgUrl: string
): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      resolve(imgUrl);
      return;
    }

    // 1. Gradient Background
    const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
    grad.addColorStop(0, "#0B1329");
    grad.addColorStop(0.5, "#1C2541");
    grad.addColorStop(1, "#020617");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1080);

    // 2. Technological circle lines
    ctx.strokeStyle = "rgba(59, 130, 246, 0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(540, 540, 480, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(540, 540, 400, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(540, 540, 320, 0, Math.PI * 2);
    ctx.stroke();

    // 3. Grid lines
    ctx.strokeStyle = "rgba(59, 130, 246, 0.04)";
    ctx.lineWidth = 2;
    const gridSize = 60;
    for (let x = 0; x < 1080; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 1080);
      ctx.stroke();
    }
    for (let y = 0; y < 1080; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1080, y);
      ctx.stroke();
    }

    // 4. Logo / Top Header
    ctx.fillStyle = "#3B82F6";
    ctx.beginPath();
    ctx.arc(100, 90, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("ATOMIC INDUSTRIES", 125, 100);

    ctx.fillStyle = "#60A5FA";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("TECNOLOG\u00cdA Y SEGURIDAD \u00c9LITE", 125, 135);

    // 5. Ecuador Flag
    const fx = 860;
    const fy = 70;
    const fw = 120;
    const fh = 80;
    ctx.fillStyle = "#FFDD00"; // Yellow
    ctx.fillRect(fx, fy, fw, fh / 2);
    ctx.fillStyle = "#001489"; // Blue
    ctx.fillRect(fx, fy + fh / 2, fw, fh / 4);
    ctx.fillStyle = "#DA291C"; // Red
    ctx.fillRect(fx, fy + fh * 3 / 4, fw, fh / 4);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 2;
    ctx.strokeRect(fx, fy, fw, fh);

    // 6. Product image panel
    const cardX = 140;
    const cardY = 220;
    const cardW = 800;
    const cardH = 520;
    
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 24);
    ctx.fill();

    ctx.strokeStyle = "rgba(59, 130, 246, 0.3)";
    ctx.lineWidth = 4;
    ctx.stroke();

    // 7. Core bottom labels
    ctx.fillStyle = "rgba(59, 130, 246, 0.1)";
    ctx.beginPath();
    ctx.roundRect(140, 930, 240, 50, 10);
    ctx.fill();
    ctx.fillStyle = "#60A5FA";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("\ud8d8\udf2d GARANT\u00cdA OFICIAL", 260, 962);

    ctx.fillStyle = "rgba(16, 185, 129, 0.1)";
    ctx.beginPath();
    ctx.roundRect(420, 930, 240, 50, 10);
    ctx.fill();
    ctx.fillStyle = "#34D399";
    ctx.fillText("\ud83d\ude9a ENV\u00cdO A TODO EL PA\u00cdS", 540, 962);

    ctx.fillStyle = "rgba(245, 158, 11, 0.1)";
    ctx.beginPath();
    ctx.roundRect(700, 930, 240, 50, 10);
    ctx.fill();
    ctx.fillStyle = "#FBBF24";
    ctx.fillText("\u26a1 SOPORTE CONTINUO", 820, 962);

    ctx.textAlign = "left";

    // Call to Action
    ctx.fillStyle = "#94A3B8";
    ctx.font = "18px sans-serif";
    ctx.fillText("Consulta con tu asesor autorizado de confianza", 140, 1010);

    // 8. Dual-Loading Image strategy & High-Fidelity Blueprint Radar Fallback
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = proxyImg(imgUrl);

    const finishDrawing = () => {
      // Price Tag Footer Panel
      const priceTagX = 140;
      const priceTagY = 770;
      const priceTagW = 800;
      const priceTagH = 120;
      
      ctx.fillStyle = "#1E293B";
      ctx.beginPath();
      ctx.roundRect(priceTagX, priceTagY, priceTagW, priceTagH, 16);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.stroke();

      // Product Name
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 26px sans-serif";
      let displayName = productName.toUpperCase();
      if (displayName.length > 35) {
        displayName = displayName.substring(0, 32) + "...";
      }
      ctx.fillText(displayName, 170, 825);
      
      ctx.fillStyle = "#60A5FA";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("EQUIPO ESTRAT\u00c9GICO SELECCIONADO", 170, 855);

      // Price text aligned to the right
      ctx.fillStyle = "#10B981";
      ctx.font = "bold 44px sans-serif";
      ctx.textAlign = "right";
      const formattedPrice = price ? `$${price.toFixed(2)}` : "CONSULTAR";
      ctx.fillText(formattedPrice, 910, 835);

      ctx.fillStyle = "#94A3B8";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("PRECIO DE LISTA", 910, 860);
      ctx.textAlign = "left";

      try {
        resolve(canvas.toDataURL("image/jpeg", 0.9));
      } catch (err) {
        resolve(imgUrl);
      }
    };

    const drawPlaceholder = () => {
      // Draw placeholder card background (Dark Slate Blue)
      ctx.fillStyle = "#1E293B";
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 24);
      ctx.fill();

      ctx.strokeStyle = "rgba(59, 130, 246, 0.4)";
      ctx.lineWidth = 4;
      ctx.stroke();

      const cx = cardX + cardW / 2;
      const cy = cardY + cardH / 2;

      ctx.strokeStyle = "rgba(96, 165, 250, 0.35)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, 110, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "rgba(96, 165, 250, 0.12)";
      ctx.beginPath();
      ctx.arc(cx, cy, 160, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, 60, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "rgba(96, 165, 250, 0.2)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 180, cy);
      ctx.lineTo(cx + 180, cy);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx, cy - 180);
      ctx.lineTo(cx, cy + 180);
      ctx.stroke();

      ctx.fillStyle = "#60A5FA";
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#60A5FA";
      ctx.font = "bold 24px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("DISPOSITIVO DE ALTO RENDIMIENTO", cx, cy + 190);
      
      ctx.fillStyle = "#94A3B8";
      ctx.font = "bold 15px sans-serif";
      ctx.fillText("PRODUCTO EN DISPONIBILIDAD INMEDIATA", cx, cy + 220);
      ctx.textAlign = "left";

      finishDrawing();
    };

    const drawWithImage = (loadedImg: HTMLImageElement) => {
      const padding = 50;
      const fitW = cardW - padding * 2;
      const fitH = cardH - padding * 2;
      const imgW = loadedImg.width;
      const imgH = loadedImg.height;
      
      const ratio = Math.min(fitW / imgW, fitH / imgH);
      const drawW = imgW * ratio;
      const drawH = imgH * ratio;
      const drawX = cardX + (cardW - drawW) / 2;
      const drawY = cardY + (cardH - drawH) / 2;

      ctx.drawImage(loadedImg, drawX, drawY, drawW, drawH);
      finishDrawing();
    };

    const handleImageError = () => {
      // Primary proxy load failed or returned transparent 1x1. Load DIRECTLY in client browser as fallback!
      const fallbackImg = new Image();
      fallbackImg.crossOrigin = "anonymous";
      fallbackImg.src = imgUrl;

      fallbackImg.onload = () => {
        if (fallbackImg.width > 1) {
          drawWithImage(fallbackImg);
        } else {
          drawPlaceholder();
        }
      };

      fallbackImg.onerror = () => {
        drawPlaceholder();
      };
    };

    img.onload = () => {
      if (img.width <= 1 || img.height <= 1) {
        handleImageError();
        return;
      }
      drawWithImage(img);
    };

    img.onerror = () => {
      handleImageError();
    };
  });
}

export default function BotRutaPage() {
  const { data: session } = useSession()
  const role = (session?.user as any)?.role
  const isAdmin = role === "ADMIN" || role === "MANAGEMENT"
  const [adminView, setAdminView] = useState(false)
  const [phase, setPhase] = useState<Phase>("onboarding")
  const [messages, setMessages] = useState<BotMsg[]>(INITIAL_MSGS)
  const [input, setInput] = useState("")
  const [screenshots, setScreenshots] = useState<string[]>([])
  const [phones, setPhones] = useState<string[]>([])
  const [phoneInput, setPhoneInput] = useState("")
  const [products, setProducts] = useState<any[]>([])
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactForm, setContactForm] = useState({ name:"", phone:"", city:"", email:"", requirement:"" })
  const [rewardConfig, setRewardConfig] = useState({ start:"", end:"", goal:"5 capturas + 3 contactos" })
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedGoal = localStorage.getItem('atomic_weekly_goal')
      const savedStart = localStorage.getItem('atomic_weekly_start')
      const savedEnd = localStorage.getItem('atomic_weekly_end')
      if (savedGoal || savedStart || savedEnd) {
        setRewardConfig({
          goal: savedGoal || "5 capturas + 3 contactos",
          start: savedStart || "",
          end: savedEnd || ""
        })
      }
    }
  }, [])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }) }, [messages])

  const [generatedAds, setGeneratedAds] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/web/products?pageSize=100")
      .then(r => r.json())
      .then(d => {
        const all = d.products || []
        
        // Filter products with real images
        const withImages = all.filter((p: any) => {
          const imgs = safeParseArray(p.images)
          return imgs && imgs.length > 0 && imgs[0] !== ''
        })
        
        // Select strategic cutoff price
        let cutoff = 30
        let pool = withImages.filter((p: any) => p.price >= cutoff)
        if (pool.length < 3) {
          cutoff = 10
          pool = withImages.filter((p: any) => p.price >= cutoff)
        }
        if (pool.length < 3) {
          pool = withImages
        }

        const priorities = ["portero", "campana", "barrera", "antena", "cerradura", "motor", "espia"]
        const matched = pool.filter((p: any) => priorities.some(pr => p.name.toLowerCase().includes(pr)))
        const others = pool.filter((p: any) => !priorities.some(pr => p.name.toLowerCase().includes(pr)))
        
        const shuffledMatched = matched.sort(() => Math.random() - 0.5)
        const sortedOthersByPrice = others.sort((a: any, b: any) => b.price - a.price)
        
        let selected: any[] = []
        if (shuffledMatched.length >= 2) {
          selected = [...shuffledMatched.slice(0, 2)]
          if (sortedOthersByPrice.length >= 1) {
            selected.push(sortedOthersByPrice[0])
          } else if (shuffledMatched.length >= 3) {
            selected.push(shuffledMatched[2])
          }
        } else {
          selected = [...shuffledMatched, ...sortedOthersByPrice.slice(0, 3 - shuffledMatched.length)]
        }
        
        setProducts(selected.slice(0, 3))
      })
      .catch((err) => {
        console.error("Failed to fetch products on mount:", err)
      })
  }, [])

  const addBotMsg = (text: string, type?: BotMsg["type"]) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), from:"bot", text, type }])
  }

  const handleDownloadPDF = () => {
    const htmlContent = `
      <html><head><title>Material Publicitario</title><style>body{font-family:sans-serif;padding:40px;color:#333;line-height:1.6} h1{color:#1E3A8A} .ad-box{border:2px dashed #CBD5E1;padding:20px;border-radius:10px;margin-bottom:20px;background:#F8FAFC} pre{white-space:pre-wrap;font-family:inherit;margin:0}</style></head>
      <body>
        <h1>Material Publicitario - Atomic Industries</h1>
        <p>Querido asesor a continuaci\u00f3n se sit\u00faan los textos que podr\u00e1s usar para desarrollar tus publicaciones. Es importante que no te saltes estas indicaciones:</p>
        <p>1. <b>T\u00edtulo:</b> Colocar\u00e1s el t\u00edtulo que te proporcionamos pero puedes modificar a tu gusto. Es ley que tenga alg\u00fan emoji.<br/>2. <b>Precio:</b> Colocaremos el precio exacto.<br/>3. <b>Descripci\u00f3n:</b> Copia y pega la descripci\u00f3n, o personal\u00edzala para tener mejores resultados.<br/>4. <b>Ubicaci\u00f3n:</b> Lugares sugeridos para posicionar tu anuncio en clientes de tecnolog\u00eda residencial.<br/>5. <b>Palabras claves:</b> Copiar y pegar.<br/>6. <b>SKU:</b> No pondremos nada.</p>
        <hr/>
        ${generatedAds.map(ad => `<div class="ad-box"><pre>${ad.text}</pre></div>`).join("")}
        <script>window.print();</script>
      </body></html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const startAdGeneration = async () => {
    setMessages(prev => [...prev, { id: Date.now().toString(), from:"user", text:"Comenzar mi d\u00eda de trabajo" }])
    setPhase("loading_ads")
    
    await new Promise(r => setTimeout(r, 500))
    addBotMsg("Buscando productos estrat\u00e9gicos y generando dise\u00f1os publicitarios con Inteligencia Artificial. Esto tomar\u00e1 unos segundos... \u23f3")
    
    let poolProducts = products
    if (!poolProducts || poolProducts.length === 0) {
      try {
        const res = await fetch("/api/web/products?pageSize=100")
        const d = await res.json()
        const all = d.products || []
        const withImages = all.filter((p: any) => {
          const imgs = safeParseArray(p.images)
          return imgs && imgs.length > 0 && imgs[0] !== ''
        })
        let pool = withImages.filter((p: any) => p.price >= 30)
        if (pool.length < 3) pool = withImages.filter((p: any) => p.price >= 10)
        if (pool.length < 3) pool = withImages

        const priorities = ["portero", "campana", "barrera", "antena", "cerradura", "motor", "espia"]
        const matched = pool.filter((p: any) => priorities.some(pr => p.name.toLowerCase().includes(pr)))
        const others = pool.filter((p: any) => !priorities.some(pr => p.name.toLowerCase().includes(pr)))
        const shuffledMatched = matched.sort(() => Math.random() - 0.5)
        const sortedOthersByPrice = others.sort((a: any, b: any) => b.price - a.price)
        
        let selected: any[] = []
        if (shuffledMatched.length >= 2) {
          selected = [...shuffledMatched.slice(0, 2)]
          if (sortedOthersByPrice.length >= 1) selected.push(sortedOthersByPrice[0])
          else if (shuffledMatched.length >= 3) selected.push(shuffledMatched[2])
        } else {
          selected = [...shuffledMatched, ...sortedOthersByPrice.slice(0, 3 - shuffledMatched.length)]
        }
        poolProducts = selected.slice(0, 3)
        setProducts(poolProducts)
      } catch (err) {
        console.error("Failed loading fallback products:", err)
      }
    }

    if (!poolProducts || poolProducts.length === 0) {
      addBotMsg("\u26a0\ufe0f Lo siento, no pudimos cargar los productos de tu inventario. Por favor aseg\u00farate de tener productos registrados en el sistema.")
      setPhase("onboarding")
      return
    }

    const locations = ["Cumbay\u00e1, Quito", "Samborond\u00f3n, Guayaquil", "La Carolina, Quito", "Valle de los Tumbaco", "Urdesa, Guayaquil"]
    
    // Asynchronously draw gorgeous custom banners for each product
    const ads = await Promise.all(poolProducts.map(async (p: any) => {
      const randomLocation = locations[Math.floor(Math.random() * locations.length)]
      const priceStr = p.price ? `$${p.price.toFixed(2)}` : "Consultar precio"
      
      const parsedImgs = safeParseArray(p.images)
      const rawImgUrl = parsedImgs[0] || "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=500"
      
      // Draw canvas-based premium advertising banner
      const generatedBannerDataUrl = await drawBanner(p.name, p.price || 0, rawImgUrl)
      
      return {
        id: p.id,
        img: generatedBannerDataUrl,
        text: `**T\u00edtulo:** \ud83c\udf1f \u00a1S\u00faper Oferta! ${p.name} \ud83d\ude80\n**Precio:** ${priceStr}\n**Descripci\u00f3n:** Mejora la seguridad y comodidad de tu hogar o negocio con este equipo de alto rendimiento. Calidad certificada, garant\u00eda autorizada de Atomic Industries y soporte de por vida. \u00a1Aprovecha hoy!\n**Ubicaci\u00f3n:** ${randomLocation}\n**SKU:**\n**Palabras claves:** #tecnologia #seguridad #ecuador #atomicindustries #hogar #innovacion`
      }
    }))
    
    setGeneratedAds(ads)
    
    addBotMsg("\u00a1Publicidad Estrat\u00e9gica Generada! \u2728 Hemos seleccionado 3 de los mejores productos reales de tu inventario (descartando cables y mouses de bajo valor) y generado dise\u00f1os premium con branding oficial, bandera de Ecuador y precios reales de tu cat\u00e1logo.")
    
    await new Promise(r => setTimeout(r, 1000))
    addBotMsg("Querido asesor a continuaci\u00f3n se sit\u00faan los textos que podr\u00e1s usar para desarrollar tus publicaciones. Es importante que no te saltes estas indicaciones:\n\n1. En **T\u00edtulo** usa uno llamativo con emojis.\n2. En **Precio** usa el indicado.\n3. En **Descripci\u00f3n** puedes copiarla o mejorarla para personalizarla.\n4. En **Ubicaci\u00f3n** usa nuestras sugerencias estrat\u00e9gicas.\n5. En **Palabras claves** p\u00e9galas tal cual.\n6. En **SKU** no pongas nada.")
    
    await new Promise(r => setTimeout(r, 1000))
    addBotMsg("", "ad_texts")
    
    await new Promise(r => setTimeout(r, 1000))
    addBotMsg("Aqu\u00ed tienes los dise\u00f1os publicitarios en alta resoluci\u00f3n generados especialmente para ti, listos para descargar y publicar:", "ad_images")
    setPhase("ads_ready")
  }

  const handleUserReply = (text: string) => {
    // Custom logic if user types something
    setMessages(prev => [...prev, { id: Date.now().toString(), from:"user", text }])
    if (phase === "onboarding") {
        startAdGeneration()
    } else if (phase === "ads_ready") {
        setPhase("upload_mode")
        addBotMsg("\u00a1Excelente! Ahora procede a publicar estos anuncios. Cuando termines, sube tus evidencias aqu\u00ed mismo.", "upload")
    } else {
        addBotMsg("Recibido. Usa los botones correspondientes a tu fase actual o sube tus capturas/tel\u00e9fonos.")
    }
  }

  const handleSend = () => {
    if (!input.trim()) return
    const text = input.trim()
    setInput("")
    if (phase === "phone_mode") {
      setMessages(prev => [...prev, { id: Date.now().toString(), from:"user", text }])
      if (/\d{7,}/.test(text)) {
        setPhones(prev => [...prev, text])
        setTimeout(() => {
          addBotMsg(`\u2705 \u00a1Perfecto! Ya van ${phones.length + 1} n\u00famero(s) registrado(s). Es vital intentar siempre obtener los datos de tus clientes, aunque no son obligatorios si no desean d\u00e1rlos. \u00bfDeseas a\u00f1adir este contacto al historial completo?`)
          setShowContactForm(true)
        }, 500)
      } else {
        setTimeout(() => addBotMsg("Por favor ingresa un n\u00famero de tel\u00e9fono v\u00e1lido (m\u00ednimo 7 d\u00edgitos)."), 500)
      }
      return
    }
    handleUserReply(text)
  }

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setScreenshots(prev => {
          const next = [...prev, reader.result as string]
          setTimeout(() => addBotMsg(`\ud83d\udcf8 \u00a1Genial! Vamos en **${next.length} captura(s)**. Recuerda que cada captura debe mostrar una publicaci\u00f3n independiente. \u00a1Sigue as\u00ed!`), 300)
          return next
        })
      }
      reader.readAsDataURL(file)
    })
  }

  const handleSaveContact = async () => {
    try {
      await fetch("/api/crm/historicos", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ ...contactForm, source: "BOT_RUTA" })
      })
    } catch {}
    setShowContactForm(false)
    setContactForm({ name:"", phone:"", city:"", email:"", requirement:"" })
    setTimeout(() => addBotMsg("\u2705 Contacto guardado en el historial. \u00a1Excelente trabajo! Recuerda que cada dato que obtienes de tus clientes es oro para tus futuras ventas."), 300)
  }

  if (isAdmin && adminView) {
    return (
      <div className="space-y-8 pb-32 font-sans animate-in fade-in duration-500">
        <div className="flex justify-between items-center border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-black text-[#0F172A] flex items-center gap-3"><Settings className="text-indigo-600"/> Admin \u00b7 Bot Ruta</h1>
            <p className="text-sm text-slate-500 mt-1">Configura el per\u00edodo de recompensa y monitorea la actividad de asesores.</p>
          </div>
          <button onClick={() => setAdminView(false)} className="bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 shadow-sm">
            Ver como Asesor
          </button>
        </div>

        {/* Reward Config */}
        <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
          <h2 className="text-lg font-black text-[#0F172A] mb-6 flex items-center gap-2"><CheckCircle2 className="text-emerald-500" size={20}/> Configuraci\u00f3n de Recompensa Semanal</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Fecha de Inicio</label>
              <input type="date" value={rewardConfig.start} onChange={e => setRewardConfig(p => ({...p, start:e.target.value}))} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg text-sm font-bold text-[#0F172A] outline-none focus:border-indigo-500"/>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Fecha de Cierre</label>
              <input type="date" value={rewardConfig.end} onChange={e => setRewardConfig(p => ({...p, end:e.target.value}))} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg text-sm font-bold text-[#0F172A] outline-none focus:border-indigo-500"/>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Meta de la Semana</label>
              <input type="text" value={rewardConfig.goal} onChange={e => setRewardConfig(p => ({...p, goal:e.target.value}))} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg text-sm font-bold text-[#0F172A] outline-none focus:border-indigo-500"/>
            </div>
          </div>
          <button onClick={() => alert("Configuraci\u00f3n guardada. El bot usar\u00e1 estos datos.")} className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-sm">
            Guardar Configuraci\u00f3n
          </button>
        </div>

        {/* Advisor Stats */}
        <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
          <h2 className="text-lg font-black text-[#0F172A] mb-6 flex items-center gap-2"><Users className="text-indigo-600" size={20}/> Actividad de Asesores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { label:"Capturas subidas esta semana", value: screenshots.length, color:"text-emerald-600", bg:"bg-emerald-50" },
              { label:"Contactos capturados", value: phones.length, color:"text-blue-600", bg:"bg-blue-50" },
              { label:"Meta semanal", value: rewardConfig.goal || "Sin configurar", color:"text-indigo-600", bg:"bg-indigo-50" },
            ].map((s,i) => (
              <div key={i} className={`${s.bg} p-5 rounded-xl border border-slate-100`}>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{s.label}</p>
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
          {screenshots.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Capturas Subidas</p>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {screenshots.map((src,i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                    <img src={src} alt={`Cap ${i+1}`} className="w-full h-full object-cover"/>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] bg-slate-50 font-sans">
      {/* Main Chat */}
      <div className="flex-1 flex flex-col bg-white border-r border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100">
              <Bot size={22} className="text-indigo-600"/>
            </div>
            <div>
              <h1 className="text-base font-black text-[#0F172A]">Bot Ruta \u00b7 Atomic</h1>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"/>
                <p className="text-xs font-bold text-slate-500">En l\u00ednea \u00b7 {rewardConfig.start ? `Semana: ${rewardConfig.start} \u2192 ${rewardConfig.end}` : "Gu\u00eda de incorporaci\u00f3n"}</p>
              </div>
            </div>
          </div>
          {isAdmin && (
            <button onClick={() => setAdminView(true)} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors">
              <Settings size={14}/> Admin
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map(msg => {
            if (msg.type === "ad_texts") {
              return (
                  <div key={msg.id} className="max-w-2xl space-y-4">
                      {generatedAds.map((ad, i) => (
                          <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm font-sans text-sm text-slate-700 whitespace-pre-wrap">
                              {ad.text.split('\n').map((line: string, idx: number) => {
                                  const isBold = line.startsWith('**') && line.includes('**', 2);
                                  if (isBold) {
                                      const parts = line.split('**');
                                      return <p key={idx} className="mb-1"><strong>{parts[1]}</strong>{parts.slice(2).join('')}</p>
                                  }
                                  return <p key={idx} className="mb-1">{line}</p>
                              })}
                          </div>
                      ))}
                      <button onClick={handleDownloadPDF} className="mt-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-bold text-xs hover:bg-indigo-200 transition-colors">
                          \ud83d\udcc4 Descargar Textos en PDF
                      </button>
                  </div>
              )
            }
            if (msg.type === "ad_images") {
                return (
                  <div key={msg.id} className="max-w-2xl mt-2">
                      <p className="text-sm font-medium text-slate-600 mb-3">{msg.text}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {generatedAds.map((ad, i) => (
                              <div key={i} className="rounded-xl overflow-hidden shadow-md border border-slate-200 bg-white flex flex-col">
                                  <div className="relative aspect-square">
                                      <img src={ad.img} className="w-full h-full object-cover animate-in fade-in zoom-in duration-300" alt="Publicidad Generada" />
                                  </div>
                                  <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-center">
                                      <a href={ad.img} download={`publicidad_atomic_${ad.id}.jpg`} className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-colors w-full justify-center text-center shadow-sm">
                                          📥 Descargar Imagen
                                      </a>
                                  </div>
                              </div>
                          ))}
                      </div>
                      {phase==="ads_ready" && (
                        <div className="flex gap-2 mt-4">
                          <button onClick={() => { setPhase("upload_mode"); addBotMsg("\u00a1Excelente! Ahora procede a publicar. Cuando termines, sube tus evidencias.", "upload") }} className="bg-emerald-500 text-white px-5 py-3 rounded-lg text-sm font-bold hover:bg-emerald-600 transition-colors w-full shadow-sm">
                              \ud83d\udcf8 Ya publiqu\u00e9, subir evidencias
                          </button>
                        </div>
                      )}
                  </div>
                )
            }
            if (msg.type === "upload") {
              return (
                <div key={msg.id} className="max-w-md">
                  <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 space-y-3">
                    <p className="text-sm font-bold text-indigo-700">\ud83d\udcf8 Sube tus evidencias</p>
                    <p className="text-xs text-slate-600 font-medium">Recuerda que cada captura debe mostrar una publicaci\u00f3n independiente en tus redes.</p>
                    <label className="flex items-center gap-2 bg-white border border-indigo-200 text-indigo-700 px-4 py-2.5 rounded-lg font-bold text-sm cursor-pointer hover:bg-indigo-50 transition-colors w-full justify-center">
                      <Camera size={16}/> Seleccionar Im\u00e1genes
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handleScreenshotUpload}/>
                    </label>
                    {screenshots.length > 0 && (
                      <p className="text-xs font-black text-emerald-600">\u2705 {screenshots.length} captura(s) subida(s)</p>
                    )}
                  </div>
                </div>
              )
            }
            return (
              <motion.div key={msg.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className={`flex ${msg.from==="user" ? "justify-end" : "justify-start"}`}>
                {msg.from==="bot" && (
                  <div className="w-8 h-8 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center mr-2 shrink-0 mt-1">
                    <Bot size={16} className="text-indigo-600"/>
                  </div>
                )}
                <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm font-medium shadow-sm ${msg.from==="bot" ? "bg-slate-50 border border-slate-200 text-[#0F172A] rounded-tl-sm whitespace-pre-wrap" : "bg-indigo-600 text-white rounded-tr-sm"}`}>
                  {msg.text?.split("**").map((part, i) => i%2===1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>)}
                  {phase==="onboarding" && msg.id==="1" && (
                    <div className="flex gap-2 mt-4">
                      <button onClick={startAdGeneration} className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors w-full shadow-sm">\ud83d\ude80 Comenzar mi d\u00eda de trabajo</button>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
          <div ref={bottomRef}/>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-200 bg-white">
          {phase==="phone_mode" ? (
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input value={phoneInput} onChange={e => setPhoneInput(e.target.value)} placeholder="Ingresa n\u00famero de tel\u00e9fono..." className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-xl text-sm font-medium text-[#0F172A] outline-none focus:border-indigo-500"/>
              </div>
              <button onClick={() => { setInput(phoneInput); setPhoneInput(""); setTimeout(handleSend, 50) }} className="bg-indigo-600 text-white px-5 rounded-xl font-bold hover:bg-indigo-700 transition-colors">A\u00f1adir</button>
            </div>
          ) : (
            <div className="flex gap-3">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter" && handleSend()} placeholder="Escribe tu respuesta..." className="flex-1 bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm font-medium text-[#0F172A] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"/>
              <button onClick={handleSend} disabled={!input.trim()} className="bg-indigo-600 text-white w-12 rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-50">
                <Send size={18}/>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Summary */}
      <div className="w-72 bg-white border-l border-slate-200 flex flex-col overflow-y-auto">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-sm font-black text-[#0F172A] uppercase tracking-wider">Resumen de Actividad</h2>
          <p className="text-xs text-slate-500 font-medium mt-1">{session?.user?.name}</p>
        </div>

        <div className="p-5 space-y-4">
          {/* \ud83c\udfaf META SEMANAL EDITOR (ADMIN ONLY) */}
          {isAdmin && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-2">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Meta Semanal</span>
                <span className="text-[10px] font-black text-indigo-600">Admin</span>
              </div>
              <div className="p-4 space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Objetivo</label>
                  <input
                    type="text"
                    value={rewardConfig.goal}
                    onChange={e => {
                      const newGoal = e.target.value;
                      setRewardConfig(p => ({...p, goal: newGoal}));
                      localStorage.setItem('atomic_weekly_goal', newGoal);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-bold text-[#0F172A] outline-none focus:border-indigo-500"
                    placeholder="Ej: 5 capturas + 3 contactos"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Inicio</label>
                    <input
                      type="date"
                      value={rewardConfig.start}
                      onChange={e => {
                        const newStart = e.target.value;
                        setRewardConfig(p => ({...p, start: newStart}));
                        localStorage.setItem('atomic_weekly_start', newStart);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 px-2 py-2 rounded-lg text-[10px] font-bold text-[#0F172A] outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Cierre</label>
                    <input
                      type="date"
                      value={rewardConfig.end}
                      onChange={e => {
                        const newEnd = e.target.value;
                        setRewardConfig(p => ({...p, end: newEnd}));
                        localStorage.setItem('atomic_weekly_end', newEnd);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 px-2 py-2 rounded-lg text-[10px] font-bold text-[#0F172A] outline-none"
                    />
                  </div>
                </div>
                <div className="pt-1">
                  <p className="text-[9px] text-emerald-600 font-bold">\u2705 Sincronizado con Dashboard</p>
                </div>
              </div>
            </div>
          )}

          {/* Captures counter */}
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Capturas Subidas</p>
            <p className="text-3xl font-black text-emerald-600">{screenshots.length}</p>
            <p className="text-xs text-slate-500 mt-1">Meta: {rewardConfig.goal || "5 capturas"}</p>
            {screenshots.length > 0 && (
              <div className="grid grid-cols-3 gap-1.5 mt-3">
                {screenshots.slice(-6).map((src,i) => (
                  <div key={i} className="aspect-square rounded-md overflow-hidden border border-slate-200">
                    <img src={src} className="w-full h-full object-cover" alt=""/>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contacts counter */}
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tel\u00e9fonos Capturados</p>
            <p className="text-3xl font-black text-blue-600">{phones.length}</p>
            {phones.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {phones.slice(-5).map((ph,i) => (
                  <p key={i} className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-100">{ph}</p>
                ))}
              </div>
            )}
          </div>

          {/* Reminder */}
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs font-medium text-amber-800 space-y-1.5">
            <p className="font-black text-amber-900">\ud83d\udcc5 Recordatorios</p>
            <p>\ud83d\udd35 <strong>Lunes:</strong> Revisa chats del fin de semana</p>
            <p>\ud83d\udfe1 <strong>Mi\u00e9rcoles:</strong> Env\u00eda promoci\u00f3n a clientes</p>
            <p>\ud83d\udfe2 <strong>Viernes:</strong> Anota contactos nuevos</p>
          </div>

          {/* Phone mode toggle */}
          {phase==="upload_mode" || phase==="phone_mode" ? (
            <button onClick={() => { setPhase("phone_mode"); addBotMsg("\u00a1Perfecto! Ingresa el n\u00famero de tel\u00e9fono de tu cliente y lo registraremos. Recuerda: es muy importante intentar obtener los datos, aunque no son obligatorios si el cliente no desea proporcionarlos.") }} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors">
              <Phone size={16}/> Registrar Tel\u00e9fono
            </button>
          ) : null}
        </div>
      </div>

      {/* Contact Form Modal */}
      <AnimatePresence>
        {showContactForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowContactForm(false)}/>
            <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.95 }} className="bg-white p-8 max-w-md w-full rounded-2xl shadow-xl relative z-10 border border-slate-200">
              <button onClick={() => setShowContactForm(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg"><X size={18}/></button>
              <h3 className="text-lg font-black text-[#0F172A] mb-2">A\u00f1adir a Historial</h3>
              <p className="text-xs text-slate-500 font-medium mb-6">Es vital intentar obtener los datos del cliente. Los campos opcionales puedes dejarlos vac\u00edos si el cliente no desea compartirlos.</p>
              <div className="space-y-3">
                {[
                  { key:"name", label:"Nombre", required:true, placeholder:"Nombre del cliente" },
                  { key:"phone", label:"Tel\u00e9fono", required:true, placeholder:"N\u00famero registrado" },
                  { key:"city", label:"Ciudad (opcional)", required:false, placeholder:"Ciudad" },
                  { key:"email", label:"Correo (opcional)", required:false, placeholder:"email@ejemplo.com" },
                  { key:"requirement", label:"Inter\u00e9s / Requerimiento (opcional)", required:false, placeholder:"\u00bfQu\u00e9 producto le interesa?" },
                ].map(field => (
                  <div key={field.key} className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 ml-1 flex items-center gap-1.5">
                      {field.label}
                      {field.required ? <span className="text-rose-500">*</span> : <span className="text-slate-400 text-[10px]">(opcional)</span>}
                    </label>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={(contactForm as any)[field.key]}
                      onChange={e => setContactForm(p => ({...p, [field.key]: e.target.value}))}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-sm font-medium text-[#0F172A] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowContactForm(false)} className="flex-1 bg-slate-50 border border-slate-200 text-slate-600 py-3 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors">Omitir</button>
                <button onClick={handleSaveContact} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-sm">Guardar</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
