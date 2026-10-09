export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { url } = body;

        if (!url || typeof url !== 'string') {
            return NextResponse.json({ error: 'Debes proporcionar un enlace válido' }, { status: 400 });
        }

        const cleanUrl = url.trim();

        // 1. YouTube Detection (Regular, Shorts, youtu.be, live)
        const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/;
        const ytMatch = cleanUrl.match(ytRegex);

        if (ytMatch && ytMatch[1]) {
            const videoId = ytMatch[1];
            let title = `YouTube Video - ${videoId}`;
            let author = 'YouTube Creator';
            let thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

            // Try fetching oembed title and thumbnail
            try {
                const oembedRes = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`, {
                    next: { revalidate: 3600 }
                });
                if (oembedRes.ok) {
                    const oembedData = await oembedRes.json();
                    if (oembedData.title) title = oembedData.title;
                    if (oembedData.author_name) author = oembedData.author_name;
                    if (oembedData.thumbnail_url) thumbnail = oembedData.thumbnail_url;
                }
            } catch (e) {
                // Keep default metadata
            }

            // High-resolution thumbnail options
            const thumbnailOptions = [
                { label: 'Miniatura MaxRes HD (1080p)', url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` },
                { label: 'Miniatura Estándar (HQ)', url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` }
            ];

            // Build downloadable options with reliable mirrors & cobalt/stream helpers
            const formats = [
                {
                    quality: '1080p Full HD',
                    label: 'Video MP4 (1080p HD)',
                    type: 'video',
                    url: `https://www.y2mate.com/youtube/${videoId}`,
                    downloadUrl: `https://yt.cdn.media-resolver.workers.dev/dl?id=${videoId}&type=mp4&q=1080`,
                    fallbackUrl: `https://ssyoutube.com/watch?v=${videoId}`
                },
                {
                    quality: '720p HD',
                    label: 'Video MP4 (720p Rápido)',
                    type: 'video',
                    url: `https://ssyoutube.com/watch?v=${videoId}`,
                    downloadUrl: `https://yt.cdn.media-resolver.workers.dev/dl?id=${videoId}&type=mp4&q=720`,
                    fallbackUrl: `https://www.y2mate.com/youtube/${videoId}`
                },
                {
                    quality: '320kbps MP3',
                    label: 'Audio MP3 (Música / Voz)',
                    type: 'audio',
                    url: `https://www.y2mate.com/youtube-mp3/${videoId}`,
                    downloadUrl: `https://yt.cdn.media-resolver.workers.dev/dl?id=${videoId}&type=mp3`,
                    fallbackUrl: `https://ssyoutube.com/watch?v=${videoId}`
                },
                {
                    quality: 'Original JPG',
                    label: 'Foto de Portada HD (Miniatura)',
                    type: 'image',
                    url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                    downloadUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                    isDirectImage: true
                }
            ];

            return NextResponse.json({
                success: true,
                platform: 'youtube',
                videoId,
                title,
                author,
                thumbnail,
                thumbnailOptions,
                formats,
                shareUrl: `https://youtu.be/${videoId}`
            });
        }

        // 2. TikTok Detection
        const isTikTok = cleanUrl.includes('tiktok.com');
        if (isTikTok) {
            return NextResponse.json({
                success: true,
                platform: 'tiktok',
                title: 'Video de TikTok',
                author: 'TikTok Creator',
                thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80',
                formats: [
                    {
                        quality: 'HD Sin Marca de Agua',
                        label: 'Video MP4 (Sin Marca de Agua)',
                        type: 'video',
                        url: `https://snaptik.app/es?url=${encodeURIComponent(cleanUrl)}`,
                        downloadUrl: `https://snaptik.app/es?url=${encodeURIComponent(cleanUrl)}`
                    },
                    {
                        quality: 'Audio Original',
                        label: 'Audio MP3',
                        type: 'audio',
                        url: `https://musicaldown.com/es?url=${encodeURIComponent(cleanUrl)}`,
                        downloadUrl: `https://musicaldown.com/es?url=${encodeURIComponent(cleanUrl)}`
                    }
                ]
            });
        }

        // 3. Instagram Detection
        const isInstagram = cleanUrl.includes('instagram.com');
        if (isInstagram) {
            return NextResponse.json({
                success: true,
                platform: 'instagram',
                title: 'Reel / Post de Instagram',
                author: 'Instagram Creator',
                thumbnail: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=800&q=80',
                formats: [
                    {
                        quality: 'Alta Calidad Original',
                        label: 'Descargar Reel / Video MP4',
                        type: 'video',
                        url: `https://saveig.app/es?url=${encodeURIComponent(cleanUrl)}`,
                        downloadUrl: `https://saveig.app/es?url=${encodeURIComponent(cleanUrl)}`
                    },
                    {
                        quality: 'Foto / Carrusel HD',
                        label: 'Descargar Foto HD (JPG)',
                        type: 'image',
                        url: `https://saveig.app/es?url=${encodeURIComponent(cleanUrl)}`,
                        downloadUrl: `https://saveig.app/es?url=${encodeURIComponent(cleanUrl)}`
                    }
                ]
            });
        }

        // 4. Facebook / General Social Media Detection
        const isFacebook = cleanUrl.includes('facebook.com') || cleanUrl.includes('fb.watch');
        if (isFacebook) {
            return NextResponse.json({
                success: true,
                platform: 'facebook',
                title: 'Video / Publicación de Facebook',
                author: 'Facebook Creator',
                thumbnail: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80',
                formats: [
                    {
                        quality: 'HD 1080p/720p',
                        label: 'Descargar Video MP4 (Facebook)',
                        type: 'video',
                        url: `https://fdown.net/download.php?url=${encodeURIComponent(cleanUrl)}`,
                        downloadUrl: `https://fdown.net/download.php?url=${encodeURIComponent(cleanUrl)}`
                    }
                ]
            });
        }

        // 5. Fallback Universal Extractor
        return NextResponse.json({
            success: true,
            platform: 'universal',
            title: 'Contenido Multimedia Enlazado',
            author: 'Enlace Web',
            thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
            formats: [
                {
                    quality: 'Original',
                    label: 'Descargador Universal de Redes',
                    type: 'video',
                    url: `https://cobalt.tools/#${encodeURIComponent(cleanUrl)}`,
                    downloadUrl: `https://cobalt.tools/#${encodeURIComponent(cleanUrl)}`
                }
            ]
        });

    } catch (error: any) {
        console.error('Error in media downloader:', error);
        return NextResponse.json({ error: error.message || 'Error procesando enlace' }, { status: 500 });
    }
}
