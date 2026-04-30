"use client"

import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";

export const SpaceBackground = () => {
  const [isMounted, setIsMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth mouse movement
  const smoothX = useSpring(mouseX, { damping: 25, stiffness: 120 });
  const smoothY = useSpring(mouseY, { damping: 25, stiffness: 120 });

  // Parallax shifts for different layers
  const nebulaX = useTransform(smoothX, [-500, 500], [30, -30]);
  const nebulaY = useTransform(smoothY, [-500, 500], [30, -30]);
  
  const starsX = useTransform(smoothX, [-500, 500], [60, -60]);
  const starsY = useTransform(smoothY, [-500, 500], [60, -60]);

  const planetsX = useTransform(smoothX, [-500, 500], [100, -100]);
  const planetsY = useTransform(smoothY, [-500, 500], [100, -100]);

  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const moveX = clientX - window.innerWidth / 2;
      const moveY = clientY - window.innerHeight / 2;
      mouseX.set(moveX);
      mouseY.set(moveY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  if (!isMounted) return <div className="fixed inset-0 bg-[#020617] z-[-1]" />;

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#020617]">
      {/* 1. Deep Nebula Layer (Slowest) */}
      <motion.div 
        style={{ x: nebulaX, y: nebulaY, scale: 1.15 }}
        className="absolute inset-[-15%] bg-nebula opacity-50 brightness-75 pointer-events-none"
      />

      {/* 2. Star Field (Medium) */}
      <motion.div 
        style={{ x: starsX, y: starsY }}
        className="absolute inset-[-20%] pointer-events-none"
      >
        {[...Array(40)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white rounded-full opacity-30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${1 + Math.random() * 1.5}px`,
              height: `${1 + Math.random() * 1.5}px`,
              boxShadow: '0 0 8px rgba(255,255,255,0.6)',
            }}
          />
        ))}
      </motion.div>

      {/* 3. Accent Glows (Interactive) */}
      <motion.div 
        style={{ x: planetsX, y: planetsY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-[20%] right-[10%] w-[30vw] h-[30vw] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] left-[5%] w-[40vw] h-[40vw] bg-pink-600/10 blur-[150px] rounded-full" />
      </motion.div>

      {/* Overlay Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)] opacity-40" />
    </div>
  );
};


