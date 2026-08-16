"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SoftwareRedirect() {
    const router = useRouter()
    useEffect(() => {
        router.push('/web/software-portfolio')
    }, [router])
    
    return (
        <div className="min-h-screen bg-[#060610] flex items-center justify-center">
            <div className="animate-pulse text-indigo-400 font-black uppercase tracking-widest text-xs">
                Cargando Software Portfolio...
            </div>
        </div>
    )
}
