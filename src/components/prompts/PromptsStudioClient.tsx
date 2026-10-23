"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
    Sparkles, Copy, Check, Download, ArrowLeft,
    Share2, Layers, Camera, Wand2, Maximize2,
    X, CheckCircle2, Zap
} from "lucide-react"

export interface PromptItem {
    id: string
    zone: string
    zoneTitle: string
    title: string
    category: string
    badge: string
    imageUrls: string[]
    description: string
    modelNote: string
    promptEn: string
    promptEs: string
    videoPromptEn?: string
    videoPromptEs?: string
    negativePromptEn?: string
    negativePromptEs?: string
    styleKeywords?: string[]
}

const PROMPT_ITEMS: PromptItem[] = [
    // ═══════════════════════════════════════════════════════════════
    // ZONA 1: RETRATOS EJECUTIVOS & STUDIO PRO (MRBEAST SERIES)
    // ═══════════════════════════════════════════════════════════════
    {
        id: "p1-armchair",
        zone: "ejecutivos",
        zoneTitle: "1. Retratos Ejecutivos & Studio Pro",
        title: "Sillón de Terciopelo, iPad & Apple Pencil",
        category: "Fotografía de Autoridad",
        badge: "Chiaroscuro 8K",
        imageUrls: ["/images/prompts-studio/p1_img1_5.png"],
        description: "Postura de 3/4 en sillón de terciopelo verde azulado, iluminación claroscuro que añade tridimensionalidad y detalles de alta gama (blazer canela sobre camiseta blanca, tablet y lápiz óptico).",
        modelNote: "Ideal para fotos de perfil en LinkedIn, portadas de podcasts o biografías ejecutivas. Reemplaza 'man resembling MrBeast' por la descripción de tu propio sujeto o usa --cref.",
        promptEn: `A professional, high-resolution portrait of a smiling man with a neat beard and short brown hair, sitting in a plush dark teal velvet armchair. He is seated at a slight three-quarter angle, body tilted toward the left while his head is turned to face the camera directly with a friendly expression. Details & Props: He is wearing a sophisticated tan or camel-colored blazer over a crisp white t-shirt. On his left wrist, a black smartwatch is visible. He is holding a sleek silver tablet in his right hand and a white stylus (Apple Pencil) in his left hand, resting them naturally on his lap. Lighting & Atmosphere: The scene features soft, cinematic side-lighting (Chiaroscuro style) that creates gentle shadows on one side of his face and body, adding depth. The background is a minimalist, solid dark charcoal grey, ensuring all focus remains on the subject. Technical Specifications: Ultra-realistic photography, 8K resolution, sharp focus on facial features, shallow depth of field, shot on a 50mm lens, professional studio lighting, clean composition, aspect ratio 4:5.`,
        promptEs: `Un retrato profesional en alta resolución de un hombre sonriente con barba cuidada y cabello castaño corto, sentado en un lujoso sillón de terciopelo verde azulado oscuro. Está sentado en un ligero ángulo de tres cuartos, con el cuerpo inclinado hacia la izquierda mientras gira la cabeza para mirar directamente a la cámara con una expresión amigable. Detalles y accesorios: Viste un blazer sofisticado color canela o camel sobre una camiseta blanca impecable. En su muñeca izquierda se aprecia un reloj inteligente negro. Sostiene una elegante tablet plateada en su mano derecha y un lápiz óptico blanco (Apple Pencil) en la mano izquierda, descansándolos con naturalidad sobre su regazo. Iluminación y atmósfera: La escena cuenta con iluminación lateral suave y cinematográfica (estilo claroscuro) que crea sombras suaves en un lado de su rostro y cuerpo, aportando profundidad. El fondo es gris carbón oscuro sólido y minimalista, asegurando que todo el foco permanezca en el sujeto. Especificaciones técnicas: Fotografía ultrarrealista, resolución 8K, enfoque nítido en rasgos faciales, profundidad de campo reducida, toma con lente de 50mm, iluminación de estudio profesional, composición limpia, relación de aspecto 4:5.`
    },
    {
        id: "p2-turtleneck",
        zone: "ejecutivos",
        zoneTitle: "1. Retratos Ejecutivos & Studio Pro",
        title: "Cuello de Tortuga Minimalista & MacBook Vertical",
        category: "Estilo Steve Jobs / Visionario",
        badge: "Fondo Negro Puro",
        imageUrls: ["/images/prompts-studio/p1_img2_7.png"],
        description: "Postura estilizada en 3/4 mirando hacia abajo, sujetando una MacBook plateada cerrada contra el torso y revisando un reloj metálico con iluminación cenital dramática.",
        modelNote: "Proyecta enfoque absoluto, introspección y liderazgo tecnológico. El fondo negro puro elimina cualquier distracción visual.",
        promptEn: `A 4:5 cinematic 8K studio portrait of a man resembling MrBeast in a black turtleneck, pure black background. Body Posture: Standing in a 3/4 profile, body angled significantly sideways away from the lens, head tilted down. Right Hand: Lowered, gripping the bottom edge of a closed silver MacBook held vertically against his torso. Left Hand: Raised and bent at the elbow across his chest, wrist turned inward to check a silver metallic watch, fingers relaxed and slightly curled. Lighting: Dramatic studio lighting from the top left. Ultra-realistic skin textures, sharp contrast, cinematic aesthetic, aspect ratio 4:5.`,
        promptEs: `Un retrato de estudio cinematográfico en 8K (formato 4:5) de un hombre parecido a MrBeast con cuello de tortuga negro y fondo negro puro. Postura corporal: De pie en perfil de 3/4, cuerpo angulado de lado alejándose del lente, cabeza ligeramente inclinada hacia abajo. Mano derecha: Hacia abajo, sujetando el borde inferior de una MacBook plateada cerrada sostenida verticalmente contra su torso. Mano izquierda: Levantada y doblada por el codo sobre el pecho, muñeca girada hacia adentro para consultar un reloj metálico plateado, dedos relajados y curvados con suavidad. Iluminación: Iluminación dramática de estudio desde la parte superior izquierda. Texturas de piel ultrarrealistas, contraste nítido, estética cinematográfica, relación de aspecto 4:5.`
    },
    {
        id: "p3-stool",
        zone: "ejecutivos",
        zoneTitle: "1. Retratos Ejecutivos & Studio Pro",
        title: "Casual Tech Founder en Taburete con Sneakers",
        category: "Emprendedor Moderno",
        badge: "Contraste Limpio",
        imageUrls: ["/images/prompts-studio/p2_img1_10.png"],
        description: "Sentado de forma relajada sobre un taburete alto de madera oscura, camisa blanca de botones, pantalones azul marino y zapatillas de cuero blanco relucientes.",
        modelNote: "Captura autenticidad, frescura y energía de Silicon Valley. La mirada hacia arriba transmite optimismo y visión de futuro.",
        promptEn: `A professional studio photograph capturing a man, resembling MrBeast, with a beard and a warm, upward gaze towards the left. He is seated casually on a dark wood bar stool, which is tilted slightly and leaning away to the right, against a dark black background. He wears a crisp white button-down shirt, dark navy trousers, and clean white leather sneakers. The man is holding a silver laptop: his right hand is positioned below the laptop base, cupping and supporting it, while his left hand rests naturally on the keyboard. His right leg is bent with the knee raised, and the left leg extends, touching the ground. The lighting is focused and direct, highlighting textures. The aspect ratio is 4:5.`,
        promptEs: `Fotografía profesional de estudio que captura a un hombre, parecido a MrBeast, con barba y una mirada cálida dirigida hacia arriba y a la izquierda. Está sentado de manera relajada en un taburete de bar de madera oscura, ligeramente inclinado hacia la derecha, contra un fondo negro oscuro. Viste una camisa blanca impecable de botones, pantalones azul marino oscuro y zapatillas de cuero blanco relucientes. El hombre sostiene una laptop plateada: su mano derecha colocada debajo de la base sosteniéndola, mientras la mano izquierda descansa con naturalidad sobre el teclado. Pierna derecha flexionada con la rodilla elevada y pierna izquierda extendida tocando el suelo. Iluminación focalizada y directa que resalta texturas. Relación de aspecto 4:5.`
    },
    {
        id: "p4-navy-blazer",
        zone: "ejecutivos",
        zoneTitle: "1. Retratos Ejecutivos & Studio Pro",
        title: "CEO en Blazer Marino & Cronógrafo de Lujo",
        category: "Alta Dirección / Forbes",
        badge: "Lente 85mm F1.4",
        imageUrls: ["/images/prompts-studio/p2_img2_11.png"],
        description: "Ángulo ligeramente contrapicado en silla blanca, blazer azul marino oscuro sobre cuello de tortuga negro, manos entrelazadas y fondo marrón texturizado con viñeta.",
        modelNote: "Excelente para portadas de revistas, conferencias magnas y presentaciones de inversión de alto calibre.",
        promptEn: `Ultra-realistic professional studio portrait of a man with short brown hair and a groomed beard, sitting at a 45-degree angle to the camera. He is wearing a dark navy blue blazer over a black turtleneck, with a small teal logo pin on his lapel and a silver luxury chronograph watch on his left wrist. He is seated on a white chair, leaning slightly forward. His hands are loosely clasped in front of him, fingers intertwined, resting near his lap. The camera is at a slight low angle, creating a powerful and professional presence. The background is a moody, dark textured brown with subtle vignetting. Cinematic lighting, soft key light on the face, high detail, 8k resolution, shot on 85mm lens. --ar 4:5`,
        promptEs: `Retrato de estudio profesional ultrarrealista de un hombre con cabello castaño corto y barba arreglada, sentado en un ángulo de 45 grados respecto a la cámara. Viste un blazer azul marino oscuro sobre un cuello de tortuga negro, con un pequeño pin de logotipo verde azulado en la solapa y un cronógrafo de lujo plateado en la muñeca izquierda. Está sentado en una silla blanca, inclinándose ligeramente hacia adelante con las manos entrelazadas con soltura cerca de su regazo. Cámara en ligero ángulo contrapicado, transmitiendo una presencia imponente y profesional. Fondo marrón oscuro texturizado con viñeteado sutil. Iluminación cinematográfica, luz principal suave sobre el rostro, alto detalle, resolución 8K, disparado con lente de 85mm. --ar 4:5`
    },

    // ═══════════════════════════════════════════════════════════════
    // ZONA 2: ARTE URBANO & CREATIVO / DOODLE POP ART
    // ═══════════════════════════════════════════════════════════════
    {
        id: "p5-doodles",
        zone: "urbano",
        zoneTitle: "2. Arte Urbano & Doodle Pop Art",
        title: "Streetwear Monocromo & Garabatos Graffiti Neón",
        category: "Estilo Gen-Z / Moda Urbana",
        badge: "Doodles Naranja & Blanco",
        imageUrls: ["/images/prompts-studio/p3_img1_15.png"],
        description: "Retrato monocromático de alta costura combinado con ilustraciones graffiti dibujadas a mano (rayos, flechas, remolinos y palabras motivacionales como PURPOSE, FAITH, FOCUS).",
        modelNote: "Ideal para portadas de YouTube, carruseles de Instagram viralizables y marcas personales ligadas a creatividad o tecnología.",
        promptEn: `Ultra-realistic black and white studio portrait, vertical 9:16. A stylish young person sitting on a simple folding chair, wearing an oversized black blazer, a black shirt and chunky sneakers. Relaxed pose, one hand resting on the chair, wearing sunglasses, confident expression. Plain white studio background with soft studio lighting, subtle shadows falling on the floor to the right. Around the subject, hand-drawn graffiti doodle illustrations in black, white, and orange: lightning bolts, zigzag lines, swirls, arrows, and motivational words: 'PURPOSE,' 'CREATE YOUR PATH,' 'FAITH,' 'FOCUS.' clean monochrome subject with bright doodle highlights. consistent facial details, and accessories. Aspect ratio 4:5`,
        promptEs: `Retrato de estudio en blanco y negro ultrarrealista, vertical 9:16. Una persona joven con mucho estilo sentada en una silla plegable simple, vistiendo un blazer negro oversized, camisa negra y zapatillas chunky. Pose relajada, una mano apoyada en la silla, gafas de sol, expresión segura. Fondo de estudio blanco liso con iluminación suave y sombras tenues en el suelo. Alrededor del sujeto, ilustraciones de garabatos graffiti dibujados a mano en negro, blanco y naranja brillante: rayos, líneas en zigzag, flechas y palabras motivacionales: 'PURPOSE', 'CREATE YOUR PATH', 'FAITH', 'FOCUS'. Sujeto monocromático nítido con reflejos doodle vibrantes. Detalles faciales consistentes y accesorios. Relación de aspecto 4:5`
    },
    {
        id: "p5-chalkboard",
        zone: "urbano",
        zoneTitle: "2. Arte Urbano & Doodle Pop Art",
        title: "Collage Mixto Chalkboard (Ronaldo AI Creator)",
        category: "Póster Mixto / Medios Híbridos",
        badge: "Efecto Tiza & Cinta Adhesiva",
        imageUrls: [],
        description: "Póster de collage estilo papel rasgado con aberración cromática cyan/roja sobre una pizarra negra arrugada, con inscripciones de tiza como 'AI CREATOR', 'TECH VISIONARY' y cinta adhesiva gris.",
        modelNote: "Puedes incorporar este prompt para lanzamientos de productos de software, infografías de IA o miniaturas de contenido viral.",
        promptEn: `Mixed-media collage poster featuring the "uploaded man" wearing a black baseball cap and oversized black pinstripe jacket over a hoodie. The man and a glowing blue circuit/gear icon feature a white torn-paper cutout border with red/cyan chromatic aberration. The background is a textured, creased black chalkboard. Large white chalk text at the top reads: "Ronaldo". Surrounding chalk text includes: "AI CREATOR", "TECH VISIONARY", "UNCLE DREW" (written sideways), "AI TOOLS", "GEN-AI EXPERT", '"DON\'T REACH YOUNG BLOOD"', and "VOTE #1 AI". The man points to the glowing blue icon, which has a piece of grey duct tape across it reading "AI POWERED". Hand-drawn chalk arrows, Xs, Os, and dotted lines are scattered throughout. Image aspect ratio 4:5`,
        promptEs: `Póster de collage en medios mixtos que presenta al 'hombre subido' con una gorra de béisbol negra y una chaqueta de rayas diplomáticas negras oversized sobre una sudadera con capucha. El hombre y un ícono de engranaje/circuito azul brillante presentan un borde recortado de papel rasgado blanco con aberración cromática roja y cian. El fondo es una pizarra negra arrugada y texturizada con textos de tiza blanca: 'AI CREATOR', 'TECH VISIONARY', 'AI TOOLS', 'GEN-AI EXPERT'. El hombre señala el ícono brillante, que tiene un trozo de cinta adhesiva gris que dice 'AI POWERED'. Flechas dibujadas a mano con tiza y líneas punteadas por todo el diseño. Relación de aspecto 4:5.`
    },

    // ═══════════════════════════════════════════════════════════════
    // ZONA 3: EFECTOS VISUALES & CONTROL DE ENERGÍA (FUEGO & MAGIA)
    // ═══════════════════════════════════════════════════════════════
    {
        id: "p6-fire-caster",
        zone: "efectos",
        zoneTitle: "3. Efectos Visuales & Control de Energía",
        title: "Llama de Poder en la Palma (Fuego Naranja & Plasma Azul)",
        category: "VFX & Fantasía Realista",
        badge: "Incluye Prompt de Video FX",
        imageUrls: ["/images/prompts-studio/p3_img2_16.png", "/images/prompts-studio/p3_img3_17.png"],
        description: "Retrato cinematográfico en vacío oscuro donde el sujeto levanta su mano y genera una llama viva hiperrealista que ilumina sus facciones. Incluye variante en fuego naranja cálido y plasma azul eléctrico, más prompt para animación en video.",
        modelNote: "Ideal para portadas épicas, avatares de superhéroe o reels de alto impacto. Funciona tanto para Midjourney como para Runway Gen-2 / Luma Dream Machine / Kling.",
        promptEn: `A hyper-realistic, cinematic portrait of the uploaded man in a dark void. He is raising his right hand in front of his chest, palm facing slightly inward and upward. His fingers are spread apart and gently curled in a relaxed, open-claw gesture, as if cradling an invisible object. A realistic, bright orange flame burns directly in the center of his palm, with tongues of fire rising through the gaps between his fingers. The warm glow of the fire highlights the texture of his hand and casts deep shadows elsewhere. He is wearing a black graphic t-shirt. High contrast, dramatic lighting, 8k resolution. Aspect ratio 4:5`,
        promptEs: `Un retrato cinematográfico hiperrealista del sujeto en un vacío oscuro. Levanta su mano derecha frente al pecho, con la palma orientada ligeramente hacia adentro y hacia arriba. Los dedos están separados y suavemente curvados en un gesto relajado, como acunando un objeto invisible. Una llama brillante y realista arde directamente en el centro de su palma, con lenguas de fuego ascendiendo entre los dedos. El cálido resplandor del fuego resalta la textura de su mano y proyecta sombras profundas. Viste una camiseta gráfica negra. Alto contraste, iluminación dramática, resolución 8K. Relación de aspecto 4:5.`,
        videoPromptEn: `4s cinematic shot, dark background. Man looks at his palm — subtle orange glow appears. Glow intensifies, transforming into controlled flame rising from his hand. He slowly rotates his hand, examining palm and back with focused expression. Fire flickers realistically, lighting his face. Final second: he looks directly into camera. Ultra-realistic fire, dramatic lighting, shallow depth of field, smooth camera, high-detail, cinematic color grading.`,
        videoPromptEs: `Toma cinematográfica de 4s, fondo oscuro. El hombre mira la palma de su mano: aparece un sutil brillo que se intensifica, transformándose en una llama controlada que surge de su mano. Gira lentamente la mano examinando la palma y el dorso con expresión concentrada. El fuego parpadea con realismo iluminando su rostro. Segundo final: mira directamente a la cámara. Fuego ultrarrealista, iluminación dramática, profundidad de campo reducida, cámara fluida, etalonaje cinematográfico.`
    },

    // ═══════════════════════════════════════════════════════════════
    // ZONA 4: SIMULACIÓN FÍSICA & LICUEFACCIÓN
    // ═══════════════════════════════════════════════════════════════
    {
        id: "p7-melting-clock",
        zone: "simulacion",
        zoneTitle: "4. Simulación Física & Licuefacción Surrealista",
        title: "Objeto Derretido / Melting Reloj Azul Líquido",
        category: "Efectos Visuales Surrealistas",
        badge: "Prompt de Imagen + Video FX",
        imageUrls: ["/images/prompts-studio/p4_img1_20.png"],
        description: "Transforma cualquier objeto sólido en un charco viscoso y brillante como helado derritiéndose bajo calor extremo, preservando el fondo y entorno 100% inalterados.",
        modelNote: "Sustituye '[object]' por cualquier producto: reloj, teléfono, zapatilla o botella. El prompt de video añade una mano fantasma que desencadena la licuefacción al tocarlo.",
        promptEn: `Image prompt: The [object] has completely liquified into a flat, shapeless, and viscous puddle, resembling ice cream melted under extreme midsummer heat. All structural traces and the silhouette of the [object] are entirely gone and unrecognizable; only a thick, glossy pool of liquid remains in its place. The liquid retains the original color of the [object] but has zero original texture or form. The background and all other environment elements remain 100% unchanged and identical to the original image, forming a soft puddle on the floor below. 8k resolution, realistic fluid dynamics.`,
        promptEs: `Prompt de imagen: El [objeto] se ha licuado por completo en un charco plano, amorfo y viscoso, asemejando helado derretido bajo el calor extremo del verano. Todos los rastros estructurales y la silueta del [objeto] han desaparecido por completo y son irreconocibles; únicamente queda en su lugar una piscina espesa y brillante de líquido. El líquido conserva el color original del [objeto] pero carece de su textura o forma original. El fondo y todos los demás elementos del entorno permanecen 100% idénticos e inalterados a la imagen original, formando un charco suave sobre la superficie. Dinámica de fluidos realista, resolución 8K.`,
        videoPromptEn: `Video prompt: Suddenly, a realistic human hand with no body visible enters the frame from the side and lightly touches the clock with its fingers. The hand instantly pulls back and disappears as soon as contact is made. The clock has completely liquified into a flat, shapeless, viscous puddle, resembling ice cream melting under extreme midsummer heat (with light fog). All structural traces and the silhouette of the clock are entirely gone; only a thick, glossy pool of liquid remains in its place, slowly spreading and forming a soft puddle on the surface below. The background and all other environment elements remain 100% unchanged and identical to the original image.`,
        videoPromptEs: `Prompt de video: De repente, una mano humana realista (sin cuerpo visible) entra en el encuadre desde el lateral y toca levemente el reloj con las yemas de sus dedos. La mano se retira al instante y desaparece en cuanto hace contacto. El reloj se licúa de inmediato en un charco plano, amorfo y viscoso, como helado derritiéndose bajo calor extremo. Toda la estructura y silueta del reloj desaparecen por completo; solo queda un charco espeso y brillante de líquido esparciéndose suavemente sobre la superficie. El fondo y entorno permanecen 100% inalterados.`
    },

    // ═══════════════════════════════════════════════════════════════
    // ZONA 5: FOTOGRAFÍA DE PRODUCTO COMERCIAL DE ALTO NIVEL
    // ═══════════════════════════════════════════════════════════════
    {
        id: "p8-perfume-wood",
        zone: "producto",
        zoneTitle: "5. Fotografía de Producto Comercial de Lujo",
        title: "Perfumería de Lujo sobre Madera Petrificada",
        category: "Commercial Product Photography",
        badge: "Detalle Macro 8K",
        imageUrls: ["/images/prompts-studio/p5_img1_23.png"],
        description: "Envase de perfume Tom Ford Wood sobre un tronco de madera petrificada gris oscuro, rodeado de virutas de madera carmesí incandescentes y vainas de vainilla negra sobre superficie reflectante.",
        modelNote: "Configuración maestra para productos de belleza, perfumería, cosmética o bebidas premium. Puedes cambiar el nombre de la botella y los colores de fondo.",
        promptEn: `A hyper-realistic professional product shot of a "TOM FORD WOOD" perfume bottle. The bottle is placed on a jagged, dark charcoal-grey petrified wood trunk. The bottle sits specifically on a small plateau of the wood, surrounded by a dense pile of bright crimson-red wood shavings and small red bark fragments that glow under the light. To the bottom left, dark, sleek vanilla pods rest on a reflective red surface. The background is a solid, deep wine-red gradient with a spotlight hitting the center. The bottle is filled with a dark garnet-colored liquid. The lighting creates sharp reflections on the glass edges and highlights the rough, cracked texture of the dark grey wood. High-end commercial aesthetic, 8k, macro detail.`,
        promptEs: `Fotografía de producto profesional hiperrealista de una botella de perfume "TOM FORD WOOD". La botella reposa sobre un tronco de madera petrificada gris carbón oscuro y escarpado, sobre una pequeña meseta rodeada por una densa pila de virutas de madera rojo carmesí brillante y fragmentos de corteza que brillan bajo la luz. A la izquierda inferior, elegantes vainas de vainilla oscura descansan sobre una superficie roja reflectante. Fondo degradado rojo vino profundo con un foco en el centro. La botella contiene un líquido color granate oscuro. La iluminación crea reflejos nítidos en los bordes del cristal y resalta la textura rugosa de la madera. Estética comercial de lujo, 8K, detalle macro.`
    },

    // ═══════════════════════════════════════════════════════════════
    // ZONA 6: ILUSTRACIÓN VECTORIAL / PÓSTER DEPORTIVO LOW-POLY
    // ═══════════════════════════════════════════════════════════════
    {
        id: "p9-low-poly-salah",
        zone: "vector",
        zoneTitle: "6. Ilustración Vectorial / Póster Deportivo Low-Poly",
        title: "Póster Poligonal Facetado (Mohamed Salah #10)",
        category: "Vector Illustration & Sports Art",
        badge: "Incluye Negative Prompt",
        imageUrls: ["/images/prompts-studio/p6_img1_26.png"],
        description: "Retrato vectorial de alta energía compuesto por planos geométricos facetados estilo low-poly, sombreado cel-shaded, luces de estadio bokeh y bandera nacional en movimiento.",
        modelNote: "Elimina la apariencia de 'render 3D sucio' o 'aerógrafo' gracias al Negative Prompt dedicado. Perfecto para posters de deportistas, merchandising y wallpapers.",
        promptEn: `A high-quality vector illustration of a smiling football player running, 3/4 angle, medium close-up (upper body), wearing a red national team jersey with thin vertical pinstripes, number "10" in white, team crest on the chest, brand logo on the other side, and a black captain armband with a "C". The face and body are rendered in a faceted low-poly / polygonal portrait style (many sharp geometric planes), with cel-shaded coloring, hard edge highlights, clean crisp outlines, high contrast, and smooth gradient shadows—no soft airbrush skin. Hair is curly and stylized, beard is bold and graphic, teeth are clean and bright. Background: a slightly blurred waving national flag behind the player, with warm stadium lights bokeh and a cinematic golden glow. Ultra clean vector finish, vibrant reds, sharp edges, professional sports poster look, 8k detail, aspect ratio 4:5.`,
        promptEs: `Ilustración vectorial de alta calidad de un futbolista sonriente corriendo, ángulo de 3/4, plano medio corto (tren superior), con camiseta roja de la selección nacional con finas rayas verticales, número "10" en blanco, escudo en el pecho, logotipo de la marca y brazalete negro de capitán con la "C". Rostro y cuerpo renderizados en estilo de retrato poligonal / low-poly facetado (muchos planos geométricos nítidos), sombreado cel-shaded, reflejos de borde duro, contornos limpios y sombras en degradado suave (sin piel difuminada con aerógrafo). Fondo: bandera nacional ondeando ligeramente desenfocada, luces cálidas de estadio bokeh y resplandor dorado cinematográfico. Acabado vectorial ultralimpio, rojos vibrantes, bordes afilados, look de póster deportivo profesional, detalle 8K, relación 4:5.`,
        negativePromptEn: `photorealistic, 3D render, clay, watercolor, oil paint, sketchy lines, messy brush strokes, soft blurry face, noisy texture, grain, bad anatomy, extra fingers, warped logo text, low resolution, flat monotone shading, washed colors.`,
        negativePromptEs: `fotorrealista, render 3D, plastilina, acuarela, pintura al óleo, líneas esbozadas, pinceladas desordenadas, rostro borroso suave, textura ruidosa, grano, mala anatomía, dedos adicionales, texto de logotipo deformado, baja resolución, sombreado monótono plano, colores deslavados.`,
        styleKeywords: [
            "low-poly vector portrait",
            "polygonal face planes",
            "hard-edge cel shading",
            "sports poster illustration",
            "clean outline / crisp strokes",
            "bokeh stadium lights background"
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // ZONA 7: RETRATOS ONÍRICOS & BURBUJAS DE CRISTAL
    // ═══════════════════════════════════════════════════════════════
    {
        id: "p10-minimal-bubble",
        zone: "burbujas",
        zoneTitle: "7. Retratos Oníricos & Burbujas de Cristal",
        title: "Burbuja de Jabón Minimalista en Vacío Negro",
        category: "Fotografía Conceptual",
        badge: "Grosor de Vidrio & Arcoíris",
        imageUrls: ["/images/prompts-studio/p7_img1_29.png"],
        description: "Burbuja transparente suspendida en un fondo negro absoluto con refracción óptica realista, grosor de cristal y destellos irisados sutiles rodeando al sujeto.",
        modelNote: "Transmite paz, introspección y exclusividad. La persona permanece nítida y perfectamente iluminada en el centro esférico.",
        promptEn: `A hyper-realistic transparent soap bubble floating in the center of a pure black background. Inside the bubble is a calm uploaded person sitting peacefully, softly lit, with natural skin tones and sharp facial details. The bubble has realistic glass-like thickness and reflections. Add subtle rainbow light reflections on the surface of the soap bubble, just like real soap bubbles, without changing the shape. The background remains completely black. Cinematic lighting, ultra-high resolution, dreamy and minimal aesthetic, professional photo-realism. 4:5 ratio.`,
        promptEs: `Burbuja de jabón transparente hiperrealista flotando en el centro de un fondo negro puro. Dentro de la burbuja, la persona subida se encuentra sentada plácidamente, suavemente iluminada, con tonos de piel naturales y detalles faciales nítidos. La burbuja tiene un grosor y reflejos realistas tipo vidrio, con sutiles destellos de arcoíris en la superficie sin alterar la forma esférica. Iluminación cinematográfica, resolución ultra alta, estética minimalista y de ensueño, fotorrealismo profesional. Proporción 4:5.`
    },
    {
        id: "p11-dream-bubble",
        zone: "burbujas",
        zoneTitle: "7. Retratos Oníricos & Burbujas de Cristal",
        title: "Microcosmos Encantado con Mariposas Luminosas",
        category: "Fantasía Cinematográfica",
        badge: "Reino Mágico Protegido",
        imageUrls: ["/images/prompts-studio/p7_img2_30.png"],
        description: "El interior de la burbuja alberga un mundo fantástico: hierba verde esmeralda, mariposas bioluminiscentes y rayos de luz dorada celestial que contrastan con un exterior oscuro y suavemente desenfocado.",
        modelNote: "Súper emotivo y poético. Puedes pedir que el sujeto sostenga una mariposa en su dedo para mayor ternura y conexión con la cámara.",
        promptEn: `A cinematic portrait of an uploaded person sitting calmly inside a large transparent soap bubble, floating in a dark minimal background. The soap bubble is ultra-realistic with glossy reflections, soft rainbow highlights, and glass-like refraction. Inside the bubble is a peaceful dream-like environment: soft green grass beneath her, tiny glowing butterflies floating around, subtle golden light rays entering from the top, and light mist inside the bubble. Outside the bubble is slightly dark and blurred, creating contrast, while inside the bubble is bright, warm, and protected. It is a small bubble... inside the person is happy like holding a butterfly on a finger looking at it happily with both hands. Cinematic lighting, shallow depth of field, ultra-detailed, photorealistic, high dynamic range, soft glow, luxury aesthetic, dreamy mood, emotional and artistic composition. Aspect ratio 4:5, ultra-high resolution, professional photography look.`,
        promptEs: `Retrato cinematográfico de una persona sentada tranquilamente dentro de una gran burbuja de jabón transparente, flotando sobre un fondo oscuro minimalista. La burbuja de jabón es ultrarrealista, con reflejos brillantes, reflejos de arcoíris suaves y refracción vítrea. Dentro de la burbuja hay un entorno onírico y apacible: césped verde suave bajo sus pies, diminutas mariposas brillantes flotando, sutiles rayos dorados descendiendo desde la parte superior y una ligera niebla. El interior es cálido, protegido y mágico. Iluminación cinematográfica, profundidad de campo reducida, fotorrealista, rango dinámico alto, resplandor suave, estética de lujo. Proporción 4:5, resolución ultra alta, look de fotografía profesional.`
    }
]

export default function PromptsStudioClient() {
    const [globalLang, setGlobalLang] = useState<"es" | "en">("es")
    const [promptLangs, setPromptLangs] = useState<Record<string, "es" | "en">>({})
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [lightboxImage, setLightboxImage] = useState<string | null>(null)
    const [activeZone, setActiveZone] = useState<string>("all")
    const [shareNotification, setShareNotification] = useState(false)

    const getLang = (id: string) => promptLangs[id] || globalLang

    const togglePromptLang = (id: string) => {
        const current = getLang(id)
        setPromptLangs(prev => ({
            ...prev,
            [id]: current === "es" ? "en" : "es"
        }))
    }

    const setAllLang = (lang: "es" | "en") => {
        setGlobalLang(lang)
        const updated: Record<string, "es" | "en"> = {}
        PROMPT_ITEMS.forEach(p => {
            updated[p.id] = lang
        })
        setPromptLangs(updated)
    }

    const handleCopy = async (id: string, text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopiedId(id)
            setTimeout(() => setCopiedId(null), 2200)
        } catch {
            const ta = document.createElement("textarea")
            ta.value = text
            document.body.appendChild(ta)
            ta.select()
            document.execCommand("copy")
            document.body.removeChild(ta)
            setCopiedId(id)
            setTimeout(() => setCopiedId(null), 2200)
        }
    }

    const handleShare = () => {
        if (typeof window !== "undefined" && navigator.share) {
            navigator.share({
                title: "Guía Oficial de Prompts IA para Fotografía | Atomic Systems",
                text: "Descubre los prompts de inteligencia artificial que usamos en Atomic Systems para fotos ejecutivas, surrealistas y de producto.",
                url: window.location.href
            }).catch(() => {})
        } else if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href)
            setShareNotification(true)
            setTimeout(() => setShareNotification(false), 2500)
        }
    }

    const zones = [
        { id: "all", name: "Todos los Prompts" },
        { id: "ejecutivos", name: "1. Retratos Ejecutivos" },
        { id: "urbano", name: "2. Arte Urbano & Doodles" },
        { id: "efectos", name: "3. Efectos Visuales & Fuego" },
        { id: "simulacion", name: "4. Licuefacción Surrealista" },
        { id: "producto", name: "5. Producto Comercial" },
        { id: "vector", name: "6. Ilustración Low-Poly" },
        { id: "burbujas", name: "7. Burbujas Oníricas" }
    ]

    const filteredPrompts = activeZone === "all"
        ? PROMPT_ITEMS
        : PROMPT_ITEMS.filter(p => p.zone === activeZone)

    return (
        <div className="min-h-screen bg-[#07090E] text-slate-100 selection:bg-cyan-500/30 font-sans relative overflow-x-hidden">
            {/* Ambient Lighting Gradients */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[160px]" />
                <div className="absolute top-[35%] right-[-10%] w-[45%] h-[45%] rounded-full bg-indigo-600/10 blur-[180px]" />
                <div className="absolute bottom-[-10%] left-[20%] w-[55%] h-[45%] rounded-full bg-orange-600/10 blur-[170px]" />
                <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
            </div>

            {/* Top Navigation Bar */}
            <nav className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#07090E]/85 backdrop-blur-xl px-4 sm:px-8 py-3.5 transition-all">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link 
                            href="/web" 
                            className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                            title="Volver a la Tienda"
                        >
                            <ArrowLeft size={16} />
                        </Link>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                            <span className="font-black text-sm tracking-wider uppercase text-white">ATOMIC <span className="text-cyan-400 font-mono text-xs">AI STUDIO</span></span>
                        </div>
                    </div>

                    {/* Quick Controls: Global Lang Toggle + Download + Share */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Global Language Toggle */}
                        <div className="flex items-center p-1 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-mono font-bold">
                            <button
                                onClick={() => setAllLang("es")}
                                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                                    globalLang === "es"
                                        ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                                        : "text-slate-400 hover:text-white"
                                }`}
                            >
                                ES
                            </button>
                            <button
                                onClick={() => setAllLang("en")}
                                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                                    globalLang === "en"
                                        ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                                        : "text-slate-400 hover:text-white"
                                }`}
                            >
                                EN
                            </button>
                        </div>

                        {/* Top Download Button */}
                        <a
                            href="/Atomic-Studio-Prompts.pdf"
                            download="Atomic-Studio-Prompts.pdf"
                            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:scale-102 cursor-pointer"
                        >
                            <Download size={14} />
                            <span>PDF Oficial</span>
                        </a>

                        {/* Share Button */}
                        <button
                            onClick={handleShare}
                            className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all cursor-pointer"
                            title="Compartir Recurso"
                        >
                            <Share2 size={15} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Share feedback toast */}
            <AnimatePresence>
                {shareNotification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-cyan-500 text-slate-950 font-bold px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-2 text-xs"
                    >
                        <Check size={14} />
                        <span>¡Enlace copiado al portapapeles! Listo para enviar por DM.</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-10 md:py-16 space-y-16">
                
                {/* ═══════════════════════════════════════════════════════════
                    HERO INTRO SECTION
                ═══════════════════════════════════════════════════════════ */}
                <section className="text-center space-y-6 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                        <Sparkles size={14} className="text-cyan-400 animate-spin-slow" />
                        <span>Atomic Systems • Inteligencia Artificial & R&D Creativo</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white leading-[1.05]">
                        La Guía Maestra de <br className="hidden sm:inline" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-orange-400">
                            Prompts IA para Fotografía
                        </span>
                    </h1>

                    <p className="text-slate-300 text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-3xl mx-auto">
                        En <strong className="text-white">Atomic Systems</strong> experimentamos de forma continua con las tecnologías de vanguardia más avanzadas para lograr resultados impecables para nuestros clientes.
                    </p>

                    <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 border border-slate-800 text-left text-sm text-slate-300 leading-relaxed space-y-3 backdrop-blur-md">
                        <p>
                            🔥 <strong className="text-white">Probados y perfeccionados en laboratorio:</strong> Hemos ejecutado estos prompts decenas de veces logrando una calidad de estudio fotográfico hiperrealista en 8K. Son los mismos patrones de composición e iluminación que utilizo personalmente para mi marca personal y que son empleados por grandes referentes internacionales (tomando como modelo de prueba a <strong>MrBeast</strong> en este documento oficial).
                        </p>
                        <p className="text-xs text-slate-400 font-mono">
                            💡 <strong className="text-cyan-300">Cómo usarlos con tu propio rostro:</strong> Simplemente copia el prompt (puedes alternar entre Español e Inglés), abre tu generador favorito (Midjourney v6, FLUX.1, Leonardo, Ideogram o DALL-E) y reemplaza <em>"uploaded person"</em> o <em>"man resembling MrBeast"</em> por tu propia referencia fotográfica (usando el comando <code className="text-cyan-400 bg-slate-950 px-1.5 py-0.5 rounded">--cref</code> en Midjourney o cargando tu retrato como input image).
                        </p>
                    </div>

                    {/* ═══════════════════════════════════════════════════════
                        TOP DOWNLOAD CARD (RECURSO DESCARGABLE 1)
                    ═══════════════════════════════════════════════════════ */}
                    <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.15)] flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-left space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold uppercase tracking-wider border border-cyan-500/30">
                                    Documento Original
                                </span>
                                <span className="text-xs font-mono text-slate-400">PDF • 23.6 MB • 8 Páginas</span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                                Atomic-Studio-Prompts.pdf
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                                Descarga el PDF completo con todas las fotos de muestra, parámetros de cámara, iluminación claroscuro y códigos listos para tus sesiones.
                            </p>
                        </div>

                        <a
                            href="/Atomic-Studio-Prompts.pdf"
                            download="Atomic-Studio-Prompts.pdf"
                            className="w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center gap-3 transition-all hover:scale-105 shrink-0 cursor-pointer"
                        >
                            <Download size={18} />
                            <span>Descargar PDF Gratis</span>
                        </a>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════
                    ZONES NAVIGATION PILLS
                ═══════════════════════════════════════════════════════════ */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <Layers size={14} className="text-cyan-400" />
                            <span>Filtrar por Zona de Contenido</span>
                        </h2>
                        <span className="text-xs font-mono text-slate-500">
                            Mostrando {filteredPrompts.length} de {PROMPT_ITEMS.length} prompts
                        </span>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
                        {zones.map(z => (
                            <button
                                key={z.id}
                                onClick={() => setActiveZone(z.id)}
                                className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                                    activeZone === z.id
                                        ? "bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.35)]"
                                        : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                                }`}
                            >
                                {z.name}
                            </button>
                        ))}
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════
                    PROMPT CARDS GRID
                ═══════════════════════════════════════════════════════════ */}
                <section className="space-y-12">
                    {filteredPrompts.map((item) => {
                        const currentLang = getLang(item.id)
                        const promptText = currentLang === "es" ? item.promptEs : item.promptEn
                        const videoPromptText = currentLang === "es" ? item.videoPromptEs : item.videoPromptEn
                        const negativePromptText = currentLang === "es" ? item.negativePromptEs : item.negativePromptEn

                        return (
                            <div
                                key={item.id}
                                id={item.id}
                                className="rounded-3xl bg-slate-900/70 border border-slate-800/90 overflow-hidden shadow-2xl hover:border-slate-700 transition-all backdrop-blur-sm"
                            >
                                {/* Card Header */}
                                <div className="px-6 sm:px-8 py-5 border-b border-slate-800/80 bg-slate-950/60 flex flex-wrap items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                                                {item.category}
                                            </span>
                                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-full">
                                                {item.badge}
                                            </span>
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                                            {item.title}
                                        </h3>
                                    </div>

                                    {/* Action Header: Language Switcher + Copy Button */}
                                    <div className="flex items-center gap-2.5">
                                        {/* Language Switcher Pill */}
                                        <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono font-bold">
                                            <button
                                                onClick={() => setPromptLangs(prev => ({ ...prev, [item.id]: "es" }))}
                                                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                                                    currentLang === "es"
                                                        ? "bg-cyan-500 text-slate-950 font-black shadow-sm"
                                                        : "text-slate-400 hover:text-white"
                                                }`}
                                            >
                                                ES
                                            </button>
                                            <button
                                                onClick={() => setPromptLangs(prev => ({ ...prev, [item.id]: "en" }))}
                                                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                                                    currentLang === "en"
                                                        ? "bg-cyan-500 text-slate-950 font-black shadow-sm"
                                                        : "text-slate-400 hover:text-white"
                                                }`}
                                            >
                                                EN
                                            </button>
                                        </div>

                                        {/* Copy Prompt Button */}
                                        <button
                                            onClick={() => handleCopy(item.id, promptText)}
                                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                                                copiedId === item.id
                                                    ? "bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                                                    : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:scale-103"
                                            }`}
                                        >
                                            {copiedId === item.id ? (
                                                <>
                                                    <Check size={14} />
                                                    <span>¡Copiado!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={14} />
                                                    <span>Copiar Prompt</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                    {/* Left Column: Image(s) Showcase */}
                                    <div className="lg:col-span-5 space-y-4">
                                        {item.imageUrls.length > 0 ? (
                                            <div className={`grid gap-4 ${item.imageUrls.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                                                {item.imageUrls.map((img, i) => (
                                                    <div 
                                                        key={i} 
                                                        className="group relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 cursor-pointer aspect-[4/5] flex items-center justify-center"
                                                        onClick={() => setLightboxImage(img)}
                                                    >
                                                        <img
                                                            src={img}
                                                            alt={`${item.title} foto de muestra ${i + 1}`}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                                                            <span className="text-[10px] font-mono font-bold text-cyan-300">
                                                                Click para ampliar
                                                            </span>
                                                            <Maximize2 size={16} className="text-white" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/60 p-8 text-center text-slate-500 font-mono text-xs flex flex-col items-center justify-center gap-2 aspect-[4/5]">
                                                <Camera size={32} className="text-slate-700" />
                                                <span>Estilo Mixto Chalkboard</span>
                                                <span className="text-[10px] text-slate-600">Referencia de diseño para collage</span>
                                            </div>
                                        )}

                                        <p className="text-xs text-slate-400 font-sans leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>

                                    {/* Right Column: Prompts, Tips & Variations */}
                                    <div className="lg:col-span-7 space-y-5">
                                        {/* Main Prompt Box */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400">
                                                <span className="flex items-center gap-1.5 text-cyan-300">
                                                    <Wand2 size={13} />
                                                    <span>Prompt Principal ({currentLang.toUpperCase()})</span>
                                                </span>
                                                <button
                                                    onClick={() => togglePromptLang(item.id)}
                                                    className="text-[11px] text-slate-400 hover:text-cyan-300 underline cursor-pointer"
                                                >
                                                    Ver en {currentLang === "es" ? "Inglés (Original)" : "Español"}
                                                </button>
                                            </div>

                                            <div className="relative group">
                                                <pre className="p-4 sm:p-5 rounded-2xl bg-[#03060B] border border-slate-800 text-slate-200 text-xs sm:text-sm font-mono whitespace-pre-wrap leading-relaxed max-h-[320px] overflow-y-auto custom-scrollbar select-all">
                                                    {promptText}
                                                </pre>
                                            </div>
                                        </div>

                                        {/* Video Prompt (If Available) */}
                                        {videoPromptText && (
                                            <div className="space-y-2 pt-2 border-t border-slate-800/80">
                                                <div className="flex items-center justify-between text-xs font-mono font-bold text-orange-400">
                                                    <span className="flex items-center gap-1.5">
                                                        <Zap size={13} />
                                                        <span>Prompt de Video Cinematográfico (Runway / Luma / Kling)</span>
                                                    </span>
                                                    <button
                                                        onClick={() => handleCopy(`${item.id}-video`, videoPromptText)}
                                                        className="text-[11px] text-slate-400 hover:text-orange-400 flex items-center gap-1 cursor-pointer"
                                                    >
                                                        {copiedId === `${item.id}-video` ? (
                                                            <span className="text-emerald-400 font-bold">¡Copiado!</span>
                                                        ) : (
                                                            <>
                                                                <Copy size={11} />
                                                                <span>Copiar Video</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>

                                                <pre className="p-4 rounded-2xl bg-orange-950/20 border border-orange-500/30 text-orange-200/90 text-xs font-mono whitespace-pre-wrap leading-relaxed select-all">
                                                    {videoPromptText}
                                                </pre>
                                            </div>
                                        )}

                                        {/* Negative Prompt (If Available) */}
                                        {negativePromptText && (
                                            <div className="space-y-2 pt-2 border-t border-slate-800/80">
                                                <div className="flex items-center justify-between text-xs font-mono font-bold text-rose-400">
                                                    <span className="flex items-center gap-1.5">
                                                        <span>🚫 Negative Prompt (Crucial para mantener el estilo)</span>
                                                    </span>
                                                    <button
                                                        onClick={() => handleCopy(`${item.id}-neg`, negativePromptText)}
                                                        className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer"
                                                    >
                                                        {copiedId === `${item.id}-neg` ? (
                                                            <span className="text-emerald-400 font-bold">¡Copiado!</span>
                                                        ) : (
                                                            <>
                                                                <Copy size={11} />
                                                                <span>Copiar Negativo</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>

                                                <pre className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-rose-200/90 text-xs font-mono whitespace-pre-wrap leading-relaxed select-all">
                                                    {negativePromptText}
                                                </pre>
                                            </div>
                                        )}

                                        {/* Style Tags (If Available) */}
                                        {item.styleKeywords && item.styleKeywords.length > 0 && (
                                            <div className="space-y-2 pt-2 border-t border-slate-800/80">
                                                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                                                    Etiquetas de Estilo Recomendadas:
                                                </span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {item.styleKeywords.map((kw, i) => (
                                                        <span
                                                            key={i}
                                                            className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-cyan-300"
                                                        >
                                                            {kw}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Recommendation Note */}
                                        <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-slate-300 space-y-1">
                                            <span className="font-bold text-cyan-300 block font-mono">
                                                Consejo de Producción Atomic:
                                            </span>
                                            <p className="leading-relaxed">
                                                {item.modelNote}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </section>

                {/* ═══════════════════════════════════════════════════════════
                    OUTRO & BOTTOM DOWNLOAD CARD (RECURSO DESCARGABLE 2)
                ═══════════════════════════════════════════════════════════ */}
                <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-[#0b1220] to-slate-900 border border-cyan-500/40 shadow-[0_0_60px_rgba(6,182,212,0.2)] text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold uppercase tracking-widest border border-cyan-500/40">
                        <Download size={14} />
                        <span>Recurso Completo Listo para Llevar</span>
                    </div>

                    <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
                        Descarga el PDF Oficial y Guarda Todos los Prompts
                    </h2>

                    <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                        Lleva contigo el compendio completo en archivo PDF de alta resolución con las referencias visuales de <strong>MrBeast</strong>, parámetros de cámara 50mm/85mm, esquemas de iluminación y configuraciones de video cinematográfico.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                        <a
                            href="/Atomic-Studio-Prompts.pdf"
                            download="Atomic-Studio-Prompts.pdf"
                            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-[0_0_35px_rgba(6,182,212,0.4)] flex items-center justify-center gap-3 transition-all hover:scale-105 cursor-pointer"
                        >
                            <Download size={18} />
                            <span>Descargar Atomic-Studio-Prompts.pdf</span>
                        </a>

                        <button
                            onClick={handleShare}
                            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                            <Share2 size={16} />
                            <span>Compartir Enlace por DM</span>
                        </button>
                    </div>

                    <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-400">
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 size={14} className="text-cyan-400" /> Compatible con Midjourney v6
                        </span>
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 size={14} className="text-cyan-400" /> Compatible con FLUX.1 & Leonardo
                        </span>
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 size={14} className="text-cyan-400" /> Prompts de Video para Runway & Luma
                        </span>
                    </div>
                </section>
            </main>

            {/* Lightbox Modal for Images */}
            <AnimatePresence>
                {lightboxImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
                        onClick={() => setLightboxImage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl p-2"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setLightboxImage(null)}
                                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-800 border border-slate-700 transition-all cursor-pointer shadow-lg"
                            >
                                <X size={18} />
                            </button>
                            <img
                                src={lightboxImage}
                                alt="Previsualización en alta resolución"
                                className="w-full max-h-[85vh] object-contain rounded-2xl mx-auto"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer */}
            <footer className="border-t border-slate-800/80 py-8 px-6 text-center text-xs font-mono text-slate-500 bg-[#04060A]">
                <p>© 2026 ATOMIC SYSTEMS • Innovación, Inteligencia Artificial & Ecosistemas Digitales.</p>
            </footer>
        </div>
    )
}
