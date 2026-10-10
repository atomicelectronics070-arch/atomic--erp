import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import QuotePublicViewer from "./QuotePublicViewer";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PublicQuotePage({ params }: PageProps) {
  const { id } = await params;
  if (!id) notFound();

  const normalizedId = decodeURIComponent(id).trim();

  const quote = await prisma.quote.findFirst({
    where: {
      OR: [
        { id: normalizedId },
        { quoteNumber: normalizedId },
        { quoteNumber: normalizedId.startsWith("PROP-") ? normalizedId : `PROP-${normalizedId}` },
        { quoteNumber: normalizedId.replace(/^PROP-/, "") },
        { quoteNumber: `PROP-2026-${normalizedId}` },
        { quoteNumber: `PROP-00-${normalizedId}` }
      ]
    },
    include: {
      client: true,
      salesperson: true
    }
  });

  if (!quote) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-6 font-mono">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto text-rose-400 text-2xl font-black">
            !
          </div>
          <h1 className="text-lg font-black uppercase text-white">Cotización No Encontrada</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            No se encontró ninguna cotización con el identificador <span className="text-cyan-400 font-bold">{normalizedId}</span> o el documento ha expirado.
          </p>
          <div className="pt-4 flex flex-col gap-2">
            <a 
              href="/web" 
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-black text-xs uppercase rounded-xl"
            >
              Ir al Catálogo de Productos
            </a>
            <a 
              href="https://api.whatsapp.com/send?phone=593969043453&text=Hola,%20deseo%20consultar%20sobre%20una%20cotizaci%C3%B3n"
              target="_blank"
              rel="noopener noreferrer" 
              className="px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs uppercase rounded-xl"
            >
              Contactar Soporte por WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  let items: any[] = [];
  if (typeof quote.items === "string") {
    try {
      items = JSON.parse(quote.items);
    } catch (e) {
      items = [];
    }
  } else if (Array.isArray(quote.items)) {
    items = quote.items;
  }

  return <QuotePublicViewer quote={JSON.parse(JSON.stringify(quote))} items={items} />;
}
