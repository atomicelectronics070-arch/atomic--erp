import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const NVIDIA_BASE_URL = process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";

async function callNemotron(prompt: string) {
    if (!NVIDIA_API_KEY) {
        console.warn("⚠️ Falta NVIDIA_API_KEY. Retornando texto de fallback.");
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
    
    // 1. LÓGICA DE AUTO-COMPLETADO CERCANO (AGENTE NEMOTRON)
    
    if (imageUrl && !text) {
      // SOLO IMAGEN -> IA infiere contexto genérico y crea copy
      console.log('Detectado: Solo Imagen. Nemotron creando texto...');
      const aiPrompt = `Actúa como un experto en marketing digital. Un usuario subió una imagen para sus redes sociales pero no escribió nada. Escribe un copy atractivo y corto para acompañar una imagen genérica corporativa, crea un título de 5 palabras, y 5 hashtags relevantes. Formato estricto requerido:\nTITULO: [título]\nCOPY: [texto]\nHASHTAGS: [hashtags]`;
      
      const aiResponse = await callNemotron(aiPrompt);
      const parts = aiResponse.split('\n');
      generatedTitle = parts.find((p: string) => p.startsWith('TITULO:'))?.replace('TITULO:', '').trim() || "Nueva Actualización";
      finalText = parts.find((p: string) => p.startsWith('COPY:'))?.replace('COPY:', '').trim() || "¡Mira nuestra nueva actualización!";
      generatedHashtags = parts.find((p: string) => p.startsWith('HASHTAGS:'))?.replace('HASHTAGS:', '').trim() || "#Actualizacion";
    } 
    else if (text && !imageUrl && !videoUrl) {
      // SOLO TEXTO -> IA mejora y extrae título
      console.log('Detectado: Solo Texto. Nemotron mejorando texto y sacando título...');
      const aiPrompt = `Actúa como un experto en marketing. Mejora el siguiente texto para un blog: "${text}". Genera un título atractivo y 5 hashtags. Formato estricto:\nTITULO: [título]\nCOPY: [texto mejorado]\nHASHTAGS: [hashtags]`;
      
      const aiResponse = await callNemotron(aiPrompt);
      const parts = aiResponse.split('\n');
      generatedTitle = parts.find((p: string) => p.startsWith('TITULO:'))?.replace('TITULO:', '').trim() || "Publicación de Blog";
      finalText = parts.find((p: string) => p.startsWith('COPY:'))?.replace('COPY:', '').trim() || text;
      generatedHashtags = parts.find((p: string) => p.startsWith('HASHTAGS:'))?.replace('HASHTAGS:', '').trim() || "#Blog";
      
      // La imagen aquí tendría que generarse con un modelo como Stable Diffusion, por ahora un placeholder
      finalImageUrl = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200"; 
    }
    else if (videoUrl && !text) {
      // SOLO VIDEO -> IA crea contexto de video
      console.log('Detectado: Solo Video. Nemotron creando copy para video...');
      const aiPrompt = `Crea un texto súper atractivo para acompañar la publicación de un nuevo video corporativo. Genera título y hashtags. Formato:\nTITULO: [título]\nCOPY: [texto]\nHASHTAGS: [hashtags]`;
      const aiResponse = await callNemotron(aiPrompt);
      const parts = aiResponse.split('\n');
      generatedTitle = parts.find((p: string) => p.startsWith('TITULO:'))?.replace('TITULO:', '').trim() || "Nuevo Video";
      finalText = parts.find((p: string) => p.startsWith('COPY:'))?.replace('COPY:', '').trim() || "¡No te pierdas nuestro nuevo video!";
      generatedHashtags = parts.find((p: string) => p.startsWith('HASHTAGS:'))?.replace('HASHTAGS:', '').trim() || "#Video";
    }
    else if (text && imageUrl) {
       // TIENE AMBOS -> Solo extraemos un buen título y hashtags
       const aiPrompt = `Extrae un título corto (max 6 palabras) y 5 hashtags relevantes del siguiente texto: "${text}". Formato:\nTITULO: [título]\nHASHTAGS: [hashtags]`;
       const aiResponse = await callNemotron(aiPrompt);
       const parts = aiResponse.split('\n');
       generatedTitle = parts.find((p: string) => p.startsWith('TITULO:'))?.replace('TITULO:', '').trim() || text.substring(0, 30) + "...";
       generatedHashtags = parts.find((p: string) => p.startsWith('HASHTAGS:'))?.replace('HASHTAGS:', '').trim() || "#Atomic";
    }

    if (generateVideo) {
      console.log('🤖 Generación de Video solicitada...');
      finalVideoUrl = "https://www.w3schools.com/html/mov_bbb.mp4"; // Dummy para UI
    }

    // 3. CONVERSIÓN DE FORMATOS POR PLATAFORMA USANDO NEMOTRON
    const platformContents: any = {};
    if (targets.length > 0) {
        console.log('Generando copys específicos para redes con Nemotron...');
        const formatsPrompt = `Adapta el siguiente texto para las redes sociales indicadas, respetando el estilo de cada una.
        TEXTO ORIGINAL: "${finalText} ${generatedHashtags}"
        REDES SOLICITADAS: ${targets.join(', ')}
        
        Devuelve el formato estricto:
        [INSTAGRAM]
        (copy con muchos emojis y formato visual)
        [/INSTAGRAM]
        [FACEBOOK]
        (copy más conversacional e invitando a interactuar)
        [/FACEBOOK]
        [YOUTUBE]
        (descripción detallada con enlaces y hashtags al final)
        [/YOUTUBE]`;

        const formatsResponse = await callNemotron(formatsPrompt);
        
        if (targets.includes('instagram')) {
            const match = formatsResponse.match(/\[INSTAGRAM\]([\s\S]*?)\[\/INSTAGRAM\]/i);
            platformContents.instagram = match ? match[1].trim() : `${finalText} 🚀\n\n${generatedHashtags}`;
        }
        if (targets.includes('facebook')) {
            const match = formatsResponse.match(/\[FACEBOOK\]([\s\S]*?)\[\/FACEBOOK\]/i);
            platformContents.facebook = match ? match[1].trim() : `¡Hola! 👋\n${finalText}`;
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
