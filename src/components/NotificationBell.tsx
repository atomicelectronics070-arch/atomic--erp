"use client"

import { useState, useEffect } from "react"
import { Bell, MessageSquare, Target, DollarSign, Check, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<any[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/notifications")
            if (res.ok) {
                const data = await res.json()
                setNotifications(data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchNotifications()
        const interval = setInterval(fetchNotifications, 30000) // Poll every 30s
        return () => clearInterval(interval)
    }, [])

    const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        try {
            await fetch("/api/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notificationId: id })
            })
            // Optimistic update
            setNotifications(prev => prev.filter(n => n.id !== id))
        } catch (error) {
            console.error(error)
        }
    }

    const unreadCount = notifications.length

    const handleClickNotification = async (notification: any) => {
        // Mark as read
        try {
            await fetch("/api/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notificationId: notification.id })
            })
            setNotifications(prev => prev.filter(n => n.id !== notification.id))
        } catch (error) {
            console.error(error)
        }

        setIsOpen(false)

        // Navigate based on type
        if (notification.type === "MESSAGE") {
            router.push("/dashboard/messages")
        } else if (notification.type === "TICKET") {
            router.push("/dashboard/finance")
        } else if (notification.type === "GOAL") {
            router.push("/dashboard")
        }
    }

    const getIcon = (type: string) => {
        switch (type) {
            case "MESSAGE": return <MessageSquare size={16} className="text-blue-500" />
            case "GOAL": return <Target size={16} className="text-orange-500" />
            case "TICKET": return <DollarSign size={16} className="text-green-500" />
            default: return <Bell size={16} className="text-neutral-500" />
        }
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-neutral-400 hover:text-orange-600 transition-colors rounded-full hover:bg-neutral-50"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-md border-2 border-white"></span>
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-neutral-200 shadow-xl z-50 rounded-none overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 border-b border-neutral-100">
                            <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Centro de Notificaciones</h3>
                            <span className="text-[10px] font-bold bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">{unreadCount} nuevas</span>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto">
                            {unreadCount === 0 ? (
                                <div className="p-8 text-center flex flex-col items-center">
                                    <Bell size={32} className="text-neutral-200 mb-3" />
                                    <p className="text-sm text-neutral-500 font-medium">No tienes notificaciones nuevas</p>
                                </div>
                            ) : (
                                <ul className="divide-y divide-neutral-50">
                                    {notifications.map((notif) => (
                                        <li
                                            key={notif.id}
                                            onClick={() => handleClickNotification(notif)}
                                            className="p-4 hover:bg-neutral-50 transition-colors cursor-pointer group flex gap-3"
                                        >
                                            <div className="mt-1 shrink-0 p-2 bg-white border border-neutral-100 shadow-sm rounded-none h-min">
                                                {getIcon(notif.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <p className="text-sm font-bold text-neutral-800 truncate">{notif.title}</p>
                                                    <button
                                                        onClick={(e) => handleMarkAsRead(notif.id, e)}
                                                        className="text-neutral-300 hover:text-green-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                                        title="Marcar como leída"
                                                    >
                                                        <Check size={14} />
                                                    </button>
                                                </div>
                                                <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                                                    {notif.message}
                                                </p>
                                                <p className="text-[10px] font-bold text-neutral-400 mt-2 uppercase">
                                                    {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <div className="p-2 border-t border-neutral-100 bg-neutral-50 text-center">
                                <button
                                    onClick={async () => {
                                        for (const notif of notifications) {
                                            await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ notificationId: notif.id }) })
                                        }
                                        setNotifications([])
                                    }}
                                    className="text-[10px] font-bold text-neutral-500 hover:text-orange-600 uppercase tracking-wider"
                                >
                                    Marcar todas como leídas
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
