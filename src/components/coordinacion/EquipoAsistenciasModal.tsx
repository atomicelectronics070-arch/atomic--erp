"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import EquipoAsistenciasView from "./EquipoAsistenciasView"

interface EquipoAsistenciasModalProps {
    isOpen: boolean
    onClose: () => void
    preselectedAdvisorId?: string
}

export default function EquipoAsistenciasModal({
    isOpen,
    onClose,
    preselectedAdvisorId
}: EquipoAsistenciasModalProps) {
    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] overflow-y-auto p-2 sm:p-4 md:p-6 flex justify-center items-start custom-scrollbar">
                {/* Single Clean Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/85 backdrop-blur-sm cursor-pointer"
                />

                {/* Modal Container - No mask clipping, fully scrollable */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 20 }}
                    className="relative w-full max-w-6xl z-10 shadow-2xl my-4 sm:my-8"
                >
                    <EquipoAsistenciasView
                        preselectedAdvisorId={preselectedAdvisorId}
                        isModal={true}
                        onClose={onClose}
                    />
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
