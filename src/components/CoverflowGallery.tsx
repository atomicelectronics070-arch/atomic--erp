"use client"

import {
    useState,
    useEffect,
    useCallback,
    useRef,
    type CSSProperties,
} from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const useIsStaticRenderer = () => false

export interface Slide {
    image?: { src?: string; srcSet?: string; alt?: string }
    title?: string
}

type AutoplayDir = "leftToRight" | "rightToLeft"
type TitleCorner = "topLeft" | "topRight" | "bottomLeft" | "bottomRight"

export interface Smooth3DSlideshowProps {
    slides?: Slide[]
    cardWidth?: number
    cardHeight?: number
    radius?: number
    tilt?: number
    sideTilt?: number
    gap?: number
    opacity?: number
    transition?: any
    autoplay?: boolean
    autoplayDirection?: AutoplayDir
    showTitle?: boolean
    titleFont?: CSSProperties
    titleColor?: string
    titlePosition?: {
        position?: TitleCorner
        paddingLeft?: number
        paddingRight?: number
        paddingTop?: number
        paddingBottom?: number
    }
    style?: CSSProperties
}

const DEFAULT_SLIDES: Slide[] = [
    {
        image: { src: "/web-banners/banner-24.jpg", alt: "Cargadores de Auto Eléctrico" },
        title: "CARGADORES DE AUTO ELÉCTRICO\nCompatibles & Potencia Ajustable 1.5 - 7 KW",
    },
    {
        image: { src: "/images/hero-3d/slide-3.jpg", alt: "Cámara de Seguridad con Luz Policial" },
        title: "CÁMARA DE SEGURIDAD CON LUZ POLICIAL\nAlertas Inteligentes Luz Rojo-Azul & Visión Nocturna",
    },
    {
        image: { src: "/web-banners/banner-17.jpg", alt: "Portero Smart para Casas y Conjuntos" },
        title: "PORTERO SMART PARA CASAS Y CONJUNTOS\nAcceso Biométrico, Tarjeta & App Celular",
    },
    {
        image: { src: "/images/hero-3d/slide-2.jpg", alt: "Kit de Cámaras de Seguridad Doble Lente" },
        title: "KIT DE CÁMARAS DE SEGURIDAD DOBLE LENTE\nVisión Nocturna 360° & Monitoreo HD",
    },
    {
        image: { src: "/images/hero-3d/slide-5.jpg", alt: "Generadores Eléctricos" },
        title: "GENERADORES ELÉCTRICOS\nEnergía Limpia & Silenciosa Ecofriendly",
    },
    {
        image: { src: "/images/hero-3d/slide-1.png", alt: "Cerraduras Smart" },
        title: "CERRADURAS SMART & ACCESO BIOMÉTRICO\nControl Total desde tu Celular",
    },
    {
        image: { src: "/images/hero-3d/slide-11.jpg", alt: "Dell 27 All-In-One" },
        title: "COMPUTADORA DELL 27\" ALL-IN-ONE\nPotencia Empresarial i7 16GB RAM",
    },
    {
        image: { src: "/images/hero-3d/slide-4.jpg", alt: "Generadores a Gasolina" },
        title: "GENERADORES A GASOLINA\nRespaldo de Energía Confiable 950W para tu Hogar",
    },
    {
        image: { src: "/images/hero-3d/slide-6.jpg", alt: "Cámara de Seguridad Un Lente" },
        title: "CÁMARA DE SEGURIDAD UN LENTE\nMonitoreo Exterior IP66 Panorámica 270°",
    },
    {
        image: { src: "/images/hero-3d/slide-7.jpg", alt: "Calefactores de Exterior" },
        title: "CALEFACTORES DE EXTERIOR\nCalidez & Confort para Hogar, Jardín y Espacios",
    },
    {
        image: { src: "/images/hero-3d/slide-9.jpg", alt: "Control de Accesos y Portero Smart" },
        title: "CONTROL DE ACCESOS Y PORTERO SMART\nSeguridad Biométrica para Conjuntos & Edificios",
    },
]

const PERSPECTIVE = 1600
const SCALE_STEP = 0.16
const MAX_VISIBLE = 2
const DEPTH = 240

function cssTransition(t: any): { dur: number; ease: string } {
    const dur = t && typeof t.duration === "number" ? t.duration : 0.6
    let ease = "cubic-bezier(0.22, 1, 0.36, 1)"
    const e = t?.ease
    if (Array.isArray(e) && e.length === 4) {
        ease = `cubic-bezier(${e[0]}, ${e[1]}, ${e[2]}, ${e[3]})`
    } else if (typeof e === "string") {
        const map: Record<string, string> = {
            linear: "linear",
            easeIn: "ease-in",
            easeOut: "ease-out",
            easeInOut: "ease-in-out",
        }
        ease = map[e] || "ease"
    }
    return { dur, ease }
}

const COMPONENT_DEFAULTS = {
    slides: DEFAULT_SLIDES,
    cardWidth: 480,
    cardHeight: 360,
    radius: 12,
    tilt: 12,
    sideTilt: 8,
    gap: 8,
    opacity: 60,
    autoplay: true,
    autoplayDirection: "rightToLeft" as AutoplayDir,
    transition: {
        type: "tween",
        duration: 0.6,
        delay: 3.5,
        ease: [0.22, 1, 0.36, 1],
    },
    showTitle: true,
    titleFont: {
        fontFamily: "system-ui",
        variant: "Bold",
        fontSize: "22px",
        letterSpacing: "-0.01em",
        lineHeight: "1.2em",
    } as any,
    titleColor: "#ffffff",
    titlePosition: {
        position: "bottomLeft" as TitleCorner,
        paddingLeft: 22,
        paddingRight: 22,
        paddingTop: 24,
        paddingBottom: 24,
    },
}

export default function CoverflowGallery(props: Smooth3DSlideshowProps) {
    props = { ...COMPONENT_DEFAULTS, ...props }
    const {
        slides = DEFAULT_SLIDES,
        cardWidth = 480,
        cardHeight = 360,
        radius = 12,
        tilt = 12,
        sideTilt = 8,
        gap = 8,
        opacity = 60,
        transition,
        autoplay = true,
        autoplayDirection = "rightToLeft",
        showTitle = true,
        titleFont,
        titleColor = "#ffffff",
        titlePosition,
        style,
    } = props

    const tp = titlePosition || {}
    const corner: TitleCorner = tp.position || "bottomLeft"
    const isTop = corner === "topLeft" || corner === "topRight"
    const isRight = corner === "topRight" || corner === "bottomRight"
    const padLeft = tp.paddingLeft ?? 22
    const padRight = tp.paddingRight ?? 22
    const padTop = tp.paddingTop ?? 24
    const padBottom = tp.paddingBottom ?? 24

    const isStatic = useIsStaticRenderer()
    const list = slides && slides.length ? slides : DEFAULT_SLIDES
    const n = list.length

    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])

    const loop = true
    const [active, setActive] = useState(0)

    const moveDur =
        transition && typeof transition.duration === "number"
            ? transition.duration
            : 0.6
    const lockRef = useRef(false)
    const lock = useCallback(() => {
        lockRef.current = true
        window.setTimeout(
            () => {
                lockRef.current = false
            },
            Math.max(50, moveDur * 1000)
        )
    }, [moveDur])

    const step = useCallback(
        (dir: number) => {
            if (lockRef.current) return
            lock()
            setActive((a) => (((a + dir) % n) + n) % n)
        },
        [n, lock]
    )

    const handleCardClick = useCallback(
        (i: number) => {
            if (isStatic || autoplay || lockRef.current) return
            lock()
            setActive((a) => (i === a ? (a + 1) % n : i))
        },
        [isStatic, autoplay, n, lock]
    )

    const delay =
        transition && typeof transition.delay === "number"
            ? transition.delay
            : 3.5
    useEffect(() => {
        if (isStatic || !autoplay || n < 2) return
        const ms = Math.max(0.3, delay) * 1000
        const dir = autoplayDirection === "leftToRight" ? -1 : 1
        const id = window.setInterval(() => step(dir), ms)
        return () => window.clearInterval(id)
    }, [isStatic, autoplay, autoplayDirection, delay, n, step])

    const onKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "ArrowRight") {
                e.preventDefault()
                step(1)
            } else if (e.key === "ArrowLeft") {
                e.preventDefault()
                step(-1)
            }
        },
        [step]
    )

    if (!mounted) {
        return (
            <div className="w-full h-[380px] flex items-center justify-center bg-[#090e1a]">
                <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    const { dur, ease } = cssTransition(transition)
    const transitionCss = `transform ${dur}s ${ease}, opacity ${dur}s ${ease}`

    const effectiveRadius =
        (Math.max(0, Math.min(20, radius)) / 20) *
        (Math.min(cardWidth, cardHeight) / 2)
    const dim = 1 - Math.max(0, Math.min(100, opacity)) / 100

    const rootStyle: CSSProperties = {
        ...(style || {}),
        position: "relative",
        width: "100%",
        height: "100%",
        minWidth: 320,
        minHeight: 400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: `${PERSPECTIVE}px`,
        overflow: "hidden",
        outline: "none",
    }

    return (
        <div
            style={rootStyle}
            tabIndex={0}
            role="group"
            aria-roledescription="carousel"
            onKeyDown={isStatic ? undefined : onKeyDown}
            className="select-none py-6 group relative"
        >
            {/* MANUAL LEFT NAVIGATION BUTTON */}
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation()
                    step(-1)
                }}
                className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-2xl bg-neutral-950/80 hover:bg-blue-600/90 border border-white/20 hover:border-blue-400 text-white flex items-center justify-center shadow-[0_0_25px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all duration-200 active:scale-90 hover:scale-110 cursor-pointer"
                aria-label="Diapositiva Anterior"
            >
                <ChevronLeft size={24} className="text-white" />
            </button>

            {/* MANUAL RIGHT NAVIGATION BUTTON */}
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation()
                    step(1)
                }}
                className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-2xl bg-neutral-950/80 hover:bg-blue-600/90 border border-white/20 hover:border-blue-400 text-white flex items-center justify-center shadow-[0_0_25px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all duration-200 active:scale-90 hover:scale-110 cursor-pointer"
                aria-label="Siguiente Diapositiva"
            >
                <ChevronRight size={24} className="text-white" />
            </button>

            <div
                style={{
                    position: "relative",
                    width: cardWidth,
                    height: cardHeight,
                    transformStyle: "preserve-3d",
                }}
            >
                {list.map((slide, i) => {
                    let rel = i - active
                    if (loop) {
                        if (rel > n / 2) rel -= n
                        if (rel < -n / 2) rel += n
                    }
                    const ax = Math.abs(rel)
                    const visible = ax <= MAX_VISIBLE
                    const isActive = rel === 0
                    const sc = Math.max(0.4, 1 - ax * SCALE_STEP)
                    const tx = rel * (gap * 30)
                    const tz = -ax * DEPTH
                    const ry = -rel * tilt
                    const rz = rel * sideTilt
                    const src = slide.image?.src || ""

                    const cardStyle: CSSProperties = {
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: cardWidth,
                        height: cardHeight,
                        borderRadius: effectiveRadius,
                        overflow: "hidden",
                        transformStyle: "preserve-3d",
                        transformOrigin: "center center",
                        transform: `translate(-50%, -50%) translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${sc})`,
                        transition: transitionCss,
                        opacity: visible ? 1 : 0,
                        cursor: autoplay || isActive ? "default" : "pointer",
                        pointerEvents:
                            visible && !isStatic && !autoplay ? "auto" : "none",
                        backgroundColor: "#09090b",
                        boxShadow: isActive ? "0 25px 50px -12px rgba(0, 0, 0, 0.7)" : "0 10px 25px -5px rgba(0, 0, 0, 0.4)",
                        border: "2px solid rgba(255, 255, 255, 0.15)",
                    }

                    return (
                        <div
                            key={i}
                            style={cardStyle}
                            onClick={
                                isStatic ? undefined : () => handleCardClick(i)
                            }
                            aria-label={slide.title}
                            aria-hidden={!visible}
                        >
                            {src ? (
                                <img
                                    src={src}
                                    alt={slide.image?.alt || slide.title || ""}
                                    draggable={false}
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        display: "block",
                                        userSelect: "none",
                                    }}
                                />
                            ) : null}

                            {showTitle && (
                                <>
                                    <div
                                        style={{
                                            position: "absolute",
                                            inset: 0,
                                            background: isTop
                                                ? "linear-gradient(0deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.85) 100%)"
                                                : "linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.85) 100%)",
                                            pointerEvents: "none",
                                        }}
                                    />

                                    <div
                                        style={{
                                            position: "absolute",
                                            left: padLeft,
                                            right: padRight,
                                            [isTop ? "top" : "bottom"]: isTop
                                                ? padTop
                                                : padBottom,
                                            textAlign: isRight
                                                ? "right"
                                                : "left",
                                            pointerEvents: "none",
                                        }}
                                    >
                                        <span
                                            style={{
                                                color: titleColor,
                                                fontSize: 22,
                                                fontWeight: 800,
                                                lineHeight: "1.2em",
                                                letterSpacing: "-0.01em",
                                                whiteSpace: "pre-line",
                                                textShadow:
                                                    "0 2px 10px rgba(0,0,0,0.8)",
                                                fontFamily: "var(--font-sans, system-ui)",
                                                ...(titleFont || {}),
                                            }}
                                        >
                                            {slide.title}
                                        </span>
                                    </div>
                                </>
                            )}

                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    background: "#000000",
                                    opacity: isActive ? 0 : dim,
                                    transition: `opacity ${dur}s ${ease}`,
                                    pointerEvents: "none",
                                }}
                            />
                        </div>
                    )
                })}
            </div>

            {/* SLIDE INDICATOR DOTS */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
                {list.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActive(idx)}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                            idx === active
                                ? "w-6 bg-blue-400"
                                : "w-2 bg-white/30 hover:bg-white/60"
                        }`}
                        aria-label={`Ir a diapositiva ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}
