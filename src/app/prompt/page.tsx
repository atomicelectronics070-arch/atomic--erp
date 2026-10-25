import { Metadata } from "next"
import PromptsStudioClient from "@/components/prompts/PromptsStudioClient"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: "Prompts IA para Fotografía | Atomic Systems",
    description: "Recursos oficiales de Atomic Systems: Guía maestra de prompts hiperrealistas para fotografía y retratos ejecutivos.",
}

export default function PromptSinglePage() {
    return <PromptsStudioClient />
}
