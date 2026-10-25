import { Metadata } from "next"
import PromptsStudioClient from "@/components/prompts/PromptsStudioClient"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: "Blog Oficial & Prompts IA | Atomic Systems",
    description: "Recursos oficiales de Atomic Systems: Guía maestra de prompts hiperrealistas para fotografía y retratos ejecutivos.",
    openGraph: {
        title: "Blog Oficial & Prompts IA | Atomic Systems",
        description: "Prompts hiperrealistas de estudio, retratos ejecutivos y PDF oficial descargable.",
        images: [
            {
                url: "/images/prompts-studio/p1_img1_5.png",
                width: 825,
                height: 1024,
                alt: "Atomic Systems Prompts Studio"
            }
        ]
    }
}

export default function BlogPromptsPage() {
    return <PromptsStudioClient />
}
