import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Aquí irían tus integraciones reales con OpenAI y Redes
// import OpenAI from 'openai';
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

    console.log('--- Iniciando Cerebro Omnicanal ---');
    console.log('Recibido:', { hasText: !!text, hasImage: !!imageUrl, hasVideo: !!videoUrl });

    // 1. LÓGICA DE AUTO-COMPLETADO CERCANO (AGENTE)

    if (imageUrl && !text) {
      // Escenario 1: SOLO IMAGEN -> IA genera título, texto y hashtags basándose en "Visión"
      console.log('Detectado: Solo Imagen. Generando texto explicativo y SEO...');
      // Simulando llamada a OpenAI GPT-4 Vision:
      // const visionResponse = await openai.chat.completions.create({...});
      finalText = "📸 ¡Mira este increíble momento! Aquí tienes una imagen que vale más que mil palabras sobre lo que hacemos en Atomic. ¿Qué opinas? Déjanos tu comentario abajo.";
      generatedTitle = "Una imagen impactante desde Atomic";
      generatedHashtags = "#AtomicERP #Innovacion #Negocios";
    } 
    else if (text && !imageUrl && !videoUrl) {
      // Escenario 2: SOLO TEXTO -> IA genera Título e IMAGEN (DALL-E)
      console.log('Detectado: Solo Texto. Generando imagen ilustrativa (DALL-E) y título...');
      // Simulando llamada a DALL-E 3:
      // const imageResponse = await openai.images.generate({ prompt: finalText });
      finalImageUrl = "https://atomiccotizador.shop/placeholder-ai-generated.png"; 
      generatedTitle = "Reflexión del Día";
      generatedHashtags = "#Reflexion #Crecimiento";
    }
    else if (videoUrl && !text) {
      // Escenario 3: SOLO VIDEO -> IA transcribe y extrae resumen/hashtags
      console.log('Detectado: Solo Video. Extrayendo transcripción para texto y hashtags...');
      // Simulando Whisper / análisis de video
      finalText = "🎥 En este video te mostramos los detalles exactos de nuestro último desarrollo. ¡No te lo pierdas!";
      generatedTitle = "Video Exclusivo de Atomic";
      generatedHashtags = "#VideoCorto #Tendencia #AtomicERP";
    }
    else if (text && imageUrl) {
       // Tiene ambos, solo pulimos el SEO y el Título
       generatedTitle = finalText.substring(0, 30) + "...";
       generatedHashtags = "#Actualizacion #Atomic";
    }

    // 2. ¿PIDIÓ GENERAR VIDEO MÁGICO?
    if (generateVideo) {
      console.log('🤖 Checkbox de Generar Video Mágico ACTIVADO. Conectando a IA de Video...');
      // Aquí se enviaría a una API como Runway, HeyGen o Pika.
      finalVideoUrl = "https://atomiccotizador.shop/ai-video-generated.mp4";
    }

    // 3. CONVERSIÓN DE FORMATOS POR PLATAFORMA (Reescritura de Contexto)
    const platformContents: any = {};
    if (targets.includes('instagram')) {
      platformContents.instagram = `${finalText} 🚀\n\n${generatedHashtags} #InstagramReels`;
    }
    if (targets.includes('facebook')) {
      platformContents.facebook = `¡Hola comunidad! 👋\n${finalText}\n\n👉 Entra al enlace para más información.`;
    }
    if (targets.includes('youtube')) {
      platformContents.youtube = {
        title: generatedTitle,
        description: `${finalText}\n\nSiguenos en redes.\n${generatedHashtags}`
      };
    }

    // 4. GUARDAR EN LA BASE DE DATOS (HISTORIAL DE BLOG Y SOCIAL POST)
    const savedBlog = await prisma.blog.create({
      data: {
        title: generatedTitle || "Post Autogenerado",
        excerpt: finalText.substring(0, 100),
        content: finalText,
        imageUrl: finalImageUrl,
        videoUrl: finalVideoUrl,
        published: true,
        authorId: authorId || "cmmf5qfrq0000awy12ogrxcri", // Admin por defecto si no viene
        socialTargets: JSON.stringify(targets),
        publishResults: JSON.stringify(platformContents) // Guardamos qué se enviará a las redes
      }
    });

    console.log('--- Guardado y Procesado ---');

    // Aquí iría el POST real a Facebook Graph API, Instagram API, y YouTube API
    // usando los Tokens guardados en la tabla SocialSettings.

    return NextResponse.json({
      success: true,
      message: 'Contenido procesado por la IA y preparado para todas las redes compatibles.',
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
