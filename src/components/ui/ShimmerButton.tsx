"use client";

import React from "react";

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    shimmerColor?: string;
    shimmerSize?: string;
    borderRadius?: string;
    shimmerDuration?: string;
    background?: string;
    className?: string;
    children?: React.ReactNode;
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
    (
        {
            shimmerColor = "#06b6d4",
            shimmerSize = "0.1em",
            shimmerDuration = "2.5s",
            borderRadius = "14px",
            background = "rgba(15, 23, 42, 0.9)",
            className = "",
            children,
            ...props
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                style={
                    {
                        "--spread": "90deg",
                        "--shimmer-color": shimmerColor,
                        "--radius": borderRadius,
                        "--speed": shimmerDuration,
                        "--cut": shimmerSize,
                        "--bg": background,
                    } as React.CSSProperties
                }
                className={`group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/10 px-6 py-3 text-white [background:var(--bg)] [border-radius:var(--radius)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${className}`}
                {...props}
            >
                {/* Spark / Shimmer rotation */}
                <div className="absolute inset-0 -z-30 overflow-visible [container-type:size]">
                    <div className="absolute inset-0 h-[100cqh] animate-shimmer-slide [aspect-ratio:1] [border-radius:0] [mask:none]">
                        <div className="animate-spin-around absolute -inset-full w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
                    </div>
                </div>

                {/* Inner background highlight */}
                <div className="absolute inset-[1px] -z-20 rounded-[calc(var(--radius)-1px)] bg-slate-950/90 transition-colors group-hover:bg-slate-900/90" />

                {/* Content */}
                <div className="relative z-10 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white">
                    {children}
                </div>
            </button>
        );
    }
);

ShimmerButton.displayName = "ShimmerButton";

export default ShimmerButton;
