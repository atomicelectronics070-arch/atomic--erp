import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    minimumScale: 1,
    themeColor: '#33ff33',
}

export const metadata: Metadata = {
    title: 'AIC Retro — Atomic Inventory System v2.1',
    description: 'Sistema de inventario y precios internos — Atomic Industries Corp.',
    manifest: '/retro-manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black',
        title: 'AIC Retro',
    },
    icons: {
        icon: '/icons-retro/icon-192.png',
        apple: '/icons-retro/icon-192.png',
    },
}

export default function PreciosLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
