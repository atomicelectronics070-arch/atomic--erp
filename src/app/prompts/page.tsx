import { Metadata } from "next"
import PromptsStudioClient from "@/components/prompts/PromptsStudioClient"

export const metadata: Metadata = {
    title: "Guía Maestra de Prompts IA para Fotografía | Atomic Systems",
    description: "Colección exclusiva de prompts de inteligencia artificial probados en Atomic Systems para retratos ejecutivos, estilo MrBeast, efectos visuales y fotografía comercial de producto en 8K.",
    openGraph: {
        title: "Guía Maestra de Prompts IA para Fotografía | Atomic Systems",
        description: "Prompts hiperrealistas de estudio, retratos ejecutivos, simulación física y arte conceptual. Incluye PDF descargable gratuito.",
        images: [
            {
                url: "/images/prompts-studio/p1_img1_5.png",
                width: 825,
                height: 1024,
                alt: "Atomic Systems AI Prompts Studio"
            }
        ]
    },
    twitter: {
        card: "summary_large_image",
        title: "Guía Maestra de Prompts IA para Fotografía | Atomic Systems",
        description: "Descubre los prompts de inteligencia artificial que usamos en Atomic Systems para fotos ejecutivas, surrealistas y de producto.",
        images: ["/images/prompts-studio/p1_img1_5.png"]
    }
}

export default function PromptsPage() {
    return <PromptsStudioClient />
}
