"use client"

import React from "react"

export interface AvatarProps {
    type: "carlos" | "ceo" | "coordinador" | "ventas" | "desarrollo" | "edicion" | "supervisor" | "contabilidad" | "marketing" | "investigacion" | "custom"
    size?: number
    className?: string
    showBadge?: boolean
    status?: "online" | "busy" | "waiting" | "calling"
    customConfig?: {
        gender?: "hombre" | "mujer"
        skin?: string
        hair?: string
        hairColor?: string
        clothes?: string
        glasses?: boolean
    }
}

export function RealisticAvatar({ type, size = 48, className = "", showBadge = true, status, customConfig }: AvatarProps) {
    const s = size

    // Color palettes by character
    const getAvatarTheme = () => {
        switch (type) {
            case "carlos": // Cliente VIP
                return {
                    skin: "#E0A97E",
                    hair: "#2C1D11",
                    hairStyle: "short-neat",
                    suit: "#1E293B",
                    shirt: "#F8FAFC",
                    tie: "#E11D48",
                    gender: "hombre",
                    name: "Carlos Mendoza",
                    role: "Cliente VIP"
                }
            case "ceo":
                return {
                    skin: "#E8B288",
                    hair: "#334155",
                    hairStyle: "slick",
                    suit: "#0F172A",
                    shirt: "#FFFFFF",
                    tie: "#F59E0B",
                    gender: "hombre",
                    name: "CEO Atomic",
                    role: "Dirección General"
                }
            case "coordinador":
                return {
                    skin: "#D99B6A",
                    hair: "#1E1E1E",
                    hairStyle: "parted",
                    suit: "#0D9488",
                    shirt: "#E6FFFA",
                    tie: "#115E59",
                    gender: "hombre",
                    name: "Luis G.",
                    role: "Coordinación"
                }
            case "ventas":
                return {
                    skin: "#F1C298",
                    hair: "#4A2E18",
                    hairStyle: "long-waves",
                    suit: "#059669",
                    shirt: "#ECFDF5",
                    tie: "#10B981",
                    gender: "mujer",
                    name: "Milorieta",
                    role: "Ventas & Asesoría"
                }
            case "desarrollo":
                return {
                    skin: "#E2AA7A",
                    hair: "#1F2937",
                    hairStyle: "modern-crop",
                    suit: "#0284C7",
                    shirt: "#0F172A",
                    tie: "#38BDF8",
                    gender: "hombre",
                    name: "Nicolás Dev",
                    role: "Sistemas & Devs",
                    glasses: true
                }
            case "edicion":
                return {
                    skin: "#D69766",
                    hair: "#3B1E08",
                    hairStyle: "curls",
                    suit: "#7C3AED",
                    shirt: "#18181B",
                    tie: "#A78BFA",
                    gender: "hombre",
                    name: "Ian Editor",
                    role: "Multimedia 4K",
                    headphones: true
                }
            case "supervisor":
                return {
                    skin: "#EBB990",
                    hair: "#27272A",
                    hairStyle: "crew",
                    suit: "#2563EB",
                    shirt: "#EFF6FF",
                    tie: "#1D4ED8",
                    gender: "hombre",
                    name: "Supervisor QC",
                    role: "Calidad 6:00 AM"
                }
            case "contabilidad":
                return {
                    skin: "#F3C59D",
                    hair: "#374151",
                    hairStyle: "bob",
                    suit: "#10B981",
                    shirt: "#F0FDF4",
                    tie: "#047857",
                    gender: "mujer",
                    name: "Contabilidad",
                    role: "Finanzas & Balances",
                    glasses: true
                }
            case "marketing":
                return {
                    skin: "#DB9F70",
                    hair: "#1C1917",
                    hairStyle: "pompadour",
                    suit: "#E11D48",
                    shirt: "#FFF1F2",
                    tie: "#BE123C",
                    gender: "hombre",
                    name: "Facu Ads",
                    role: "Marketing Digital"
                }
            case "investigacion":
                return {
                    skin: "#E8B58D",
                    hair: "#52525B",
                    hairStyle: "short-messy",
                    suit: "#4F46E5",
                    shirt: "#FFFFFF",
                    tie: "#4338CA",
                    gender: "hombre",
                    name: "I+D Lab",
                    role: "Investigación Smart"
                }
            case "custom":
            default:
                return {
                    skin: customConfig?.skin || "#E0A97E",
                    hair: customConfig?.hairColor || "#2C1D11",
                    hairStyle: customConfig?.hair || "parted",
                    suit: customConfig?.clothes || "#3B82F6",
                    shirt: "#FFFFFF",
                    tie: "#1D4ED8",
                    gender: customConfig?.gender || "hombre",
                    name: "Tú",
                    role: "Operador Atomic",
                    glasses: customConfig?.glasses
                }
        }
    }

    const t = getAvatarTheme()

    return (
        <div className={`relative inline-block select-none ${className}`} style={{ width: s, height: s }}>
            <svg
                viewBox="0 0 100 100"
                width={s}
                height={s}
                className="rounded-full shadow-lg overflow-hidden border border-white/20 bg-gradient-to-b from-slate-800 to-slate-950"
            >
                <defs>
                    <linearGradient id={`skinGrad-${type}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={t.skin} />
                        <stop offset="100%" stopColor={t.skin} stopOpacity="0.85" />
                    </linearGradient>
                    <linearGradient id={`suitGrad-${type}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={t.suit} />
                        <stop offset="100%" stopColor="#0B0F17" />
                    </linearGradient>
                    <filter id={`shadow-${type}`} x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="2" stdDeviation="1" floodColor="#000000" floodOpacity="0.5" />
                    </filter>
                </defs>

                {/* Background Ambient Glow */}
                <circle cx="50" cy="50" r="48" fill="#0c101d" />
                <circle cx="50" cy="30" r="30" fill={t.suit} opacity="0.2" filter="blur(8px)" />

                {/* Shoulders / Torso / Suit */}
                <path
                    d="M 15 98 C 15 76, 30 68, 50 68 C 70 68, 85 76, 85 98 Z"
                    fill={`url(#suitGrad-${type})`}
                    filter={`url(#shadow-${type})`}
                />

                {/* White Shirt / V-Neck */}
                <path d="M 38 68 L 50 86 L 62 68 Z" fill={t.shirt} />

                {/* Tie / Neck Detail */}
                {t.tie && (
                    <path d="M 47 70 L 53 70 L 54 86 L 50 92 L 46 86 Z" fill={t.tie} />
                )}

                {/* Neck */}
                <rect x="43" y="52" width="14" height="18" rx="4" fill={`url(#skinGrad-${type})`} />

                {/* Head Base */}
                <ellipse cx="50" cy="42" rx="19" ry="22" fill={`url(#skinGrad-${type})`} filter={`url(#shadow-${type})`} />

                {/* Ears */}
                <circle cx="31" cy="44" r="4.5" fill={`url(#skinGrad-${type})`} />
                <circle cx="69" cy="44" r="4.5" fill={`url(#skinGrad-${type})`} />

                {/* Eyes & Brows */}
                <circle cx="43" cy="42" r="2.2" fill="#1E293B" />
                <circle cx="57" cy="42" r="2.2" fill="#1E293B" />
                <circle cx="44" cy="41" r="0.7" fill="#FFFFFF" />
                <circle cx="58" cy="41" r="0.7" fill="#FFFFFF" />

                {/* Eyebrows */}
                <path d="M 39 37 Q 43 35 47 37" stroke={t.hair} strokeWidth="1.8" strokeLinecap="round" fill="none" />
                <path d="M 53 37 Q 57 35 61 37" stroke={t.hair} strokeWidth="1.8" strokeLinecap="round" fill="none" />

                {/* Nose */}
                <path d="M 50 42 L 48.5 48 L 51.5 48" stroke="#B87C52" strokeWidth="1.2" strokeLinecap="round" fill="none" />

                {/* Smile / Mouth */}
                <path d="M 45 54 Q 50 58 55 54" stroke="#8A4B29" strokeWidth="1.5" strokeLinecap="round" fill="none" />

                {/* Hair styles */}
                {t.gender === "mujer" || t.hairStyle === "long-waves" || t.hairStyle === "bob" ? (
                    <g fill={t.hair}>
                        {/* Female / Longer Hair */}
                        <path d="M 31 38 C 29 20, 71 20, 69 38 C 72 48, 72 62, 68 68 C 65 62, 65 42, 65 36 C 65 24, 35 24, 35 36 C 35 42, 35 62, 32 68 C 28 62, 28 48, 31 38 Z" />
                        <path d="M 34 32 Q 50 20 66 32 Q 50 26 34 32" fill={t.hair} />
                    </g>
                ) : (
                    <g fill={t.hair}>
                        {/* Male / Short Executive Hair */}
                        <path d="M 31 36 C 30 22, 42 16, 50 16 C 58 16, 70 22, 69 36 C 67 31, 62 25, 50 26 C 38 25, 33 31, 31 36 Z" />
                        <path d="M 32 36 Q 42 22 68 30 Q 52 24 32 36" fill={t.hair} opacity="0.9" />
                    </g>
                )}

                {/* Optional Glasses */}
                {(t.glasses) && (
                    <g stroke="#38BDF8" strokeWidth="1.6" fill="rgba(56, 189, 248, 0.15)">
                        <circle cx="43" cy="42" r="5" />
                        <circle cx="57" cy="42" r="5" />
                        <path d="M 48 42 L 52 42" />
                        <path d="M 38 41 L 31 40" />
                        <path d="M 62 41 L 69 40" />
                    </g>
                )}

                {/* Optional Headphones (for audio/video editor) */}
                {(t.headphones) && (
                    <g>
                        <path d="M 28 44 C 28 20, 72 20, 72 44" stroke="#A78BFA" strokeWidth="3" fill="none" strokeLinecap="round" />
                        <rect x="25" y="38" width="6" height="14" rx="3" fill="#8B5CF6" />
                        <rect x="69" y="38" width="6" height="14" rx="3" fill="#8B5CF6" />
                    </g>
                )}
            </svg>

            {/* Live Status indicator dot */}
            {showBadge && (
                <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-slate-950 shadow-md ${
                    status === "busy" ? "bg-rose-500 animate-pulse" :
                    status === "waiting" ? "bg-amber-400 animate-bounce ring-amber-400/50" :
                    status === "calling" ? "bg-cyan-400 animate-ping" :
                    "bg-emerald-400"
                }`} />
            )}
        </div>
    )
}
