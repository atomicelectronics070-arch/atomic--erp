export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const NVIDIA_BASE_URL = process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";

async function callNemotron(prompt: string) {
    if (!NVIDIA_API_KEY) {
        console.warn("\u26a0\ufe0f Falta NVIDIA_API_KEY. Retornando texto de fallback.");
        return "Contenido generado en modo offline por falta de API KEY.";
    }

    try {
        const response = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${NVIDIA_API_KEY}`
            },
            body: JSON.stringify({
                model: process.env.WORKER_MODEL || "nvidia/llama-3.1-nemotron-70b-instruct", // Usando Nemotron como motor principal
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
                max_tokens: 1024
            })
        });

        if (!response.ok) {
            console.error("NVIDIA API ERROR:", await response.text());
            throw new Error(`NVIDIA API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("Error llamando a Nemotron:", error);
        return "Error al generar contenido con IA.";
    }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      text, 
      imageUrl, 
      videoUrl, 
      generateVideo, 
      targets, 
      authorId 
    } = body;

    let finalText = text || '';
    let finalImageUrl = imageUrl || '';
    let finalVideoUrl = videoUrl || '';
    let generatedTitle = '';
    let generatedHashtags = '';

    console.log('--- Iniciando Cerebro Omnicanal (NEMOTRON) ---');
    
    // 1. L\u00d3GICA DE AUTO-COMPLETADO CERCANO (AGENTE NEMOTRON)
    
    if (imageUrl && !text) {
      // SOLO IMAGEN -> IA infiere contexto gen\u00e9rico y crea copy
      console.log('Detectado: Solo Imagen. Nemotron creando texto...');
      const aiPrompt = `Act\u00faa como un experto en marketing digital. Un usuario subi\u00f3 una imagen para sus redes sociales pero no escribi\u00f3 nada. Escribe un copy atractivo y corto para acompa\u00f1ar una imagen gen\u00e9rica corporativa, crea un t\u00edtulo de 5 palabras, y 5 hashtags relevantes. Formato estricto requerido:\nTITULO: [t\u00edtulo]\nCOPY: [texto]\nHASHTAGS: [hashtags]`;
      
      const aiResponse = await callNemotron(aiPrompt);
      const parts = aiResponse.split('\n');
      generatedTitle = parts.find((p: string) => p.startsWith('TITULO:'))?.replace('TITULO:', '').trim() || "Nueva Actualizaci\u00f3n";
      finalText = parts.find((p: string) => p.startsWith('COPY:'))?.replace('COPY:', '').trim() || "\u00a1Mira nuestra nueva actualizaci\u00f3n!";
      generatedHashtags = parts.find((p: string) => p.startsWith('HASHTAGS:'))?.replace('HASHTAGS:', '').trim() || "#Actualizacion";
    } 
    else if (text && !imageUrl && !videoUrl) {
      // SOLO TEXTO -> IA mejora y extrae t\u00edtulo
      console.log('Detectado: Solo Texto. Nemotron mejorando texto y sacando t\u00edtulo...');
      const aiPrompt = `Act\u00faa como un experto en marketing. Mejora el siguiente texto para un blog: "${text}". Genera un t\u00edtulo atractivo y 5 hashtags. Formato estricto:\nTITULO: [t\u00edtulo]\nCOPY: [texto mejorado]\nHASHTAGS: [hashtags]`;
      
      const aiResponse = await callNemotron(aiPrompt);
      const parts = aiResponse.split('\n');
      generatedTitle = parts.find((p: string) => p.startsWith('TITULO:'))?.replace('TITULO:', '').trim() || "Publicaci\u00f3n de Blog";
      finalText = parts.find((p: string) => p.startsWith('COPY:'))?.replace('COPY:', '').trim() || text;
      generatedHashtags = parts.find((p: string) => p.startsWith('HASHTAGS:'))?.replace('HASHTAGS:', '').trim() || "#Blog";
      
      // La imagen aqu\u00ed tendr\u00eda que generarse con un modelo como Stable Diffusion, por ahora un placeholder
      finalImageUrl = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200"; 
    }
    else if (videoUrl && !text) {
      // SOLO VIDEO -> IA crea contexto de video
      console.log('Detectado: Solo Video. Nemotron creando copy para video...');
      const aiPrompt = `Crea un texto s\u00faper atractivo para acompa\u00f1ar la publicaci\u00f3n de un nuevo video corporativo. Genera t\u00edtulo y hashtags. Formato:\nTITULO: [t\u00edtulo]\nCOPY: [texto]\nHASHTAGS: [hashtags]`;
      const aiResponse = await callNemotron(aiPrompt);
      const parts = aiResponse.split('\n');
      generatedTitle = parts.find((p: string) => p.startsWith('TITULO:'))?.replace('TITULO:', '').trim() || "Nuevo Video";
      finalText = parts.find((p: string) => p.startsWith('COPY:'))?.replace('COPY:', '').trim() || "\u00a1No te pierdas nuestro nuevo video!";
      generatedHashtags = parts.find((p: string) => p.startsWith('HASHTAGS:'))?.replace('HASHTAGS:', '').trim() || "#Video";
    }
    else if (text && imageUrl) {
       // TIENE AMBOS -> Solo extraemos un buen t\u00edtulo y hashtags
       const aiPrompt = `Extrae un t\u00edtulo corto (max 6 palabras) y 5 hashtags relevantes del siguiente texto: "${text}". Formato:\nTITULO: [t\u00edtulo]\nHASHTAGS: [hashtags]`;
       const aiResponse = await callNemotron(aiPrompt);
       const parts = aiResponse.split('\n');
       generatedTitle = parts.find((p: string) => p.startsWith('TITULO:'))?.replace('TITULO:', '').trim() || text.substring(0, 30) + "...";
       generatedHashtags = parts.find((p: string) => p.startsWith('HASHTAGS:'))?.replace('HASHTAGS:', '').trim() || "#Atomic";
    }

    if (generateVideo) {
      console.log('\ud83e\udd16 Generaci\u00f3n de Video solicitada...');
      finalVideoUrl = "https://www.w3schools.com/html/mov_bbb.mp4"; // Dummy para UI
    }

    // 3. CONVERSI\u00d3N DE FORMATOS POR PLATAFORMA USANDO NEMOTRON
    const platformContents: any = {};
    if (targets.length > 0) {
        console.log('Generando copys espec\u00edficos para redes con Nemotron...');
        const formatsPrompt = `Adapta el siguiente texto para las redes sociales indicadas, respetando el estilo de cada una.
        TEXTO ORIGINAL: "${finalText} ${generatedHashtags}"
        REDES SOLICITADAS: ${targets.join(', ')}
        
        Devuelve el formato estricto:
        [INSTAGRAM]
        (copy con muchos emojis y formato visual)
        [/INSTAGRAM]
        [FACEBOOK]
        (copy m\u00e1s conversacional e invitando a interactuar)
        [/FACEBOOK]
        [YOUTUBE]
        (descripci\u00f3n detallada con enlaces y hashtags al final)
        [/YOUTUBE]`;

        const formatsResponse = await callNemotron(formatsPrompt);
        
        if (targets.includes('instagram')) {
            const match = formatsResponse.match(/\[INSTAGRAM\]([\s\S]*?)\[\/INSTAGRAM\]/i);
            platformContents.instagram = match ? match[1].trim() : `${finalText}\n\n${generatedHashtags}`;
        }
        if (targets.includes('facebook')) {
            const match = formatsResponse.match(/\[FACEBOOK\]([\s\S]*?)\[\/FACEBOOK\]/i);
            platformContents.facebook = match ? match[1].trim() : `Hola!\n${finalText}`;
        }
        if (targets.includes('youtube')) {
            const match = formatsResponse.match(/\[YOUTUBE\]([\s\S]*?)\[\/YOUTUBE\]/i);
            platformContents.youtube = {
                title: generatedTitle,
                description: match ? match[1].trim() : `${finalText}\n\n${generatedHashtags}`
            };
        }
    }

    // 4. GUARDAR EN LA BASE DE DATOS
    const savedBlog = await prisma.blog.create({
      data: {
        title: generatedTitle,
        excerpt: finalText.substring(0, 100),
        content: finalText,
        imageUrl: finalImageUrl,
        videoUrl: finalVideoUrl,
        published: true,
        authorId: authorId || "cmmf5qfrq0000awy12ogrxcri",
        socialTargets: JSON.stringify(targets),
        publishResults: JSON.stringify(platformContents)
      }
    });

    console.log('--- Omnicanal Procesado por Nemotron ---');

    return NextResponse.json({
      success: true,
      message: 'Contenido procesado por Nemotron y preparado para todas las redes.',
      data: {
        blogId: savedBlog.id,
        finalText,
        finalImageUrl,
        finalVideoUrl,
        generatedTitle,
        platformContents
      }
    });

  } catch (error: any) {
    console.error('Error en Omnicanal:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
