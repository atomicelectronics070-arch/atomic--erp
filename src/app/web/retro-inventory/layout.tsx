import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'AIC Retro — Atomic Inventory System v2.1',
    description: 'Sistema de inventario y precios internos — Atomic Industries Corp.',
    manifest: '/retro-manifest.json',
    themeColor: '#33ff33',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black',
        title: 'AIC Retro',
    },
    other: {
        'mobile-web-app-capable': 'yes',
        'msapplication-TileColor': '#0a0a0a',
    },
    icons: {
        icon: '/icons-retro/icon-192.png',
        apple: '/icons-retro/icon-192.png',
    },
    viewport: {
        width: 'device-width',
        initialScale: 1,
        minimumScale: 1,
    },
}

export default function RetroLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
        </>
    )
}
