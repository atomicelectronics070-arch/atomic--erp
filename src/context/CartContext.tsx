"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
    image?: string
}

interface CartContextType {
    items: CartItem[]
    addToCart: (item: CartItem) => void
    removeFromCart: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    totalItems: number
    totalPrice: number
    lastAction: string | null
    showBotPrompt: boolean
    setShowBotPrompt: (show: boolean) => void
    markCartCheckout: (status?: "COTIZADO" | "COMPRADO", clientInfo?: { name?: string, email?: string, phone?: string }) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [lastAction, setLastAction] = useState<string | null>(null)
    const [showBotPrompt, setShowBotPrompt] = useState(false)

    // Load cart from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('atomic_cart')
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart))
            } catch (e) {
                console.error("Failed to load cart from localStorage", e)
            }
        }
    }, [])

    // Save cart to localStorage
    useEffect(() => {
        localStorage.setItem('atomic_cart', JSON.stringify(items))
    }, [items])

    const addToCart = (item: CartItem) => {
        setItems(prev => {
            const existing = prev.find(i => i.id === item.id)
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i)
            }
            return [...prev, item]
        })
        setLastAction(`Añadiste ${item.name}`)
        setShowBotPrompt(true)
    }

    const removeFromCart = (id: string) => {
        setItems(prev => prev.filter(i => i.id !== id))
    }

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(id)
            return
        }
        setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i))
    }

    const clearCart = () => {
        setItems([])
    }

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    // Sincronización automática de telemetría de carritos (Detección de carritos casi comprados / abandonados)
    useEffect(() => {
        if (typeof window === "undefined") return
        const vid = localStorage.getItem("atomic_vid") || "anon_" + Date.now()
        
        const timer = setTimeout(() => {
            fetch("/api/telemetry/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    visitorId: vid,
                    items: items,
                    totalAmount: totalPrice,
                    itemsCount: totalItems,
                    sourceUrl: window.location.pathname,
                    status: items.length > 0 ? "ABANDONADO" : "EN_PROCESO",
                    lastAction: lastAction || (items.length > 0 ? `Artículos en carrito (${totalItems})` : "Carrito vacío")
                }),
                keepalive: true
            }).catch(() => {})
        }, 1200)

        return () => clearTimeout(timer)
    }, [items, totalPrice, totalItems, lastAction])

    const markCartCheckout = (status: "COTIZADO" | "COMPRADO" = "COTIZADO", clientInfo?: { name?: string, email?: string, phone?: string }) => {
        if (typeof window === "undefined") return
        const vid = localStorage.getItem("atomic_vid") || "anon_" + Date.now()
        fetch("/api/telemetry/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                visitorId: vid,
                items: items,
                totalAmount: totalPrice,
                itemsCount: totalItems,
                sourceUrl: window.location.pathname,
                status,
                userName: clientInfo?.name,
                userEmail: clientInfo?.email,
                userPhone: clientInfo?.phone,
                lastAction: status === "COTIZADO" ? "Cotización solicitada" : "Compra concretada"
            }),
            keepalive: true
        }).catch(() => {})
    }

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalItems,
            totalPrice,
            lastAction,
            showBotPrompt,
            setShowBotPrompt,
            markCartCheckout
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        return {
            items: [],
            addToCart: () => {},
            removeFromCart: () => {},
            updateQuantity: () => {},
            clearCart: () => {},
            totalItems: 0,
            totalPrice: 0,
            lastAction: null,
            showBotPrompt: false,
            setShowBotPrompt: () => {},
            markCartCheckout: () => {}
        }
    }
    return context
}
