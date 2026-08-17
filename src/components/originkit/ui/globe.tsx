"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";

export interface GlobeProps {
  className?: string;
  direction?: "left" | "right";
  dots?: {
    color?: string;
    size?: number;
    density?: number;
    allDots?: boolean;
  };
  speed?: number;
  smoothing?: number;
  stopOnHover?: boolean;
  interactive?: boolean;
  dragSpeed?: number;
  showOutline?: boolean;
  showGrid?: boolean;
  oceanColor?: string;
  scale?: number;
  initialLatitude?: number;
  initialLongitude?: number;
}

export default function Globe({
  className = "",
  direction = "right",
  speed = 1,
  interactive = true,
  oceanColor = "#050505",
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  useEffect(() => {
    let width = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onResize = () => {
      if (canvas) {
        width = canvas.offsetWidth;
      }
    };
    window.addEventListener("resize", onResize);
    onResize();

    let currentPhi = 0;

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: width * 2 || 600,
      height: width * 2 || 600,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.08, 0.08, 0.12],
      markerColor: [0.1, 0.5, 1],
      glowColor: [0.1, 0.4, 0.9],
      markers: [
        { location: [-1.8312, -78.1834], size: 0.09 }, // Ecuador marker
        { location: [40.7128, -74.006], size: 0.05 },
        { location: [51.5074, -0.1278], size: 0.05 },
        { location: [35.6762, 139.6503], size: 0.05 },
      ],
      onRender: (state) => {
        if (!pointerInteracting.current) {
          currentPhi += 0.005 * speed * (direction === "right" ? 1 : -1);
        } else {
          currentPhi += pointerInteractionMovement.current * 0.01;
        }
        state.phi = currentPhi;
      },
    });

    setTimeout(() => {
      if (canvas) canvas.style.opacity = "1";
    }, 100);

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [direction, speed]);

  return (
    <div className={`relative mx-auto w-full max-w-[500px] aspect-square ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-0 transition-opacity duration-500 cursor-grab active:cursor-grabbing touch-none"
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
          }
        }}
      />
    </div>
  );
}
