"use client"
import { useState } from "react"

export function ClientImage({ src, alt, className }: { src: string, alt: string, className?: string }) {
    const [imgSrc, setImgSrc] = useState(src)

    return (
        <img 
            src={imgSrc} 
            alt={alt} 
            referrerPolicy="no-referrer"
            className={className} 
            onError={() => {
                setImgSrc("/img/panic_bar_fallback.png")
            }}
        />
    )
}
