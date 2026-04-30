"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SoftwareRedirect() {
    const router = useRouter()
    useEffect(() => {
        router.push('/web/demos')
    }, [router])
    
    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center">
            <div className="animate-pulse text-[#E8341A] font-black uppercase tracking-widest text-xs">
                Redirecting to Atomic Showcase...
            </div>
        </div>
    )
}
