export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const maxDuration = 30;

async function fetchWithTimeout(url: string, options: any, timeoutMs = 12000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: "El mensaje es requerido" }, { status: 400 });
    }

    const systemPrompt = `Eres ECOSISTEMA TOMC, el Núcleo de Inteligencia Central del Ecosistema TOMC y plataforma ATOMIC.
Tu misión es actuar como el cerebro maestro conversacional, proporcionando respuestas precisas, estratégicas, de arquitectura de software, gestión operativa y desarrollo de proyectos.

Principios de operación de ECOSISTEMA TOMC:
1. Identidad: Te presentas como "Núcleo Ecosistema TOMC". Tu tono es ejecutivo, firme, de alta ingeniería y resolución inmediata.
2. Formato: Utiliza Markdown fluido con listas estructuradas, negritas y bloques de código cuando sea relevante.
3. Contexto: Tienes conocimiento total de la plataforma ATOMIC, ERP, cotizadores, catálogo de productos, módulos de logística y arquitecturas multi-tenant.
4. Eficiencia: Respuestas concisas pero exhaustivas. Sin rodeos.

Responde al usuario directamente en español.`;

    const GOOGLE_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;
    const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;

    let aiResponseText = "";
    let providerUsed = "";

    // 1. Intentar con Gemini
    if (GOOGLE_API_KEY && GOOGLE_API_KEY !== "your_gemini_api_key_here") {
      try {
        const contents = [
          { role: "user", parts: [{ text: `[SYSTEM INSTRUCTION]\n${systemPrompt}` }] },
          { role: "model", parts: [{ text: "Comprendido. Núcleo ECOSISTEMA TOMC inicializado y en línea." }] }
        ];

        if (Array.isArray(history)) {
          history.slice(-6).forEach((h: { role: string; content: string }) => {
            contents.push({
              role: h.role === "user" ? "user" : "model",
              parts: [{ text: h.content }]
            });
          });
        }

        contents.push({
          role: "user",
          parts: [{ text: message }]
        });

        const res = await fetchWithTimeout(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents })
          },
          12000
        );

        if (res.ok) {
          const data = await res.json();
          aiResponseText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
          if (aiResponseText) providerUsed = "Gemini 2.5 Flash Core";
        }
      } catch (err) {
        console.warn("Gemini query failed in Ecosistema TOMC:", err);
      }
    }

    // 2. Fallback a Nvidia NIM Llama 3.3
    if (!aiResponseText && NVIDIA_API_KEY) {
      try {
        const messagesArr = [
          { role: "system", content: systemPrompt }
        ];

        if (Array.isArray(history)) {
          history.slice(-6).forEach((h: { role: string; content: string }) => {
            messagesArr.push({
              role: h.role === "user" ? "user" : "assistant",
              content: h.content
            });
          });
        }

        messagesArr.push({ role: "user", content: message });

        const res = await fetchWithTimeout(
          "https://integrate.api.nvidia.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${NVIDIA_API_KEY}`
            },
            body: JSON.stringify({
              model: "nvidia/llama-3.3-nemotron-super-49b-v1.5",
              messages: messagesArr,
              max_tokens: 1500
            })
          },
          15000
        );

        if (res.ok) {
          const json = await res.json();
          aiResponseText = json.choices?.[0]?.message?.content || "";
          if (aiResponseText) providerUsed = "Nvidia Llama 3.3 Nemotron Core";
        }
      } catch (err) {
        console.warn("Nvidia query failed in Ecosistema TOMC:", err);
      }
    }

    // 3. Fallback estático en caso de desconexión total de llaves de API
    if (!aiResponseText) {
      aiResponseText = `### ⚙️ Núcleo ECOSISTEMA TOMC
Recibido mensaje: "${message}"

El Núcleo **ECOSISTEMA TOMC** está activo y procesando requerimientos en modo de contingencia local. 

Para habilitar la síntesis neuronal avanzada en tiempo real, verifica las claves de entorno \`GEMINI_API_KEY\` o \`NVIDIA_API_KEY\` en la plataforma.`;
      providerUsed = "Núcleo Standalone local";
    }

    return NextResponse.json({
      success: true,
      nucleus: "ECOSISTEMA TOMC",
      response: aiResponseText,
      provider: providerUsed,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("Ecosistema TOMC Chat Error:", error);
    return NextResponse.json({ error: error.message || "Error procesando solicitud en Núcleo TOMC" }, { status: 500 });
  }
}
