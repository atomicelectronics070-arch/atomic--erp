"use client";

import React, { useEffect, useRef } from 'react';

export const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let w: number, h: number;
    
    // Hyper-realistic star configuration
    const stars: {
      x: number, 
      y: number, 
      z: number, 
      size: number, 
      color: string, 
      twinkle: number, 
      px: number, 
      py: number
    }[] = [];
    const count = 550; // Más densidad para que se sienta infinito

    const colors = [
      '#FFFFFF', // Blanca pura
      '#FFF4EA', // Blanco cálido
      '#EAF4FF', // Blanco azulado
      '#FFD27D', // Gigante naranja (rara)
      '#8FADFF'  // Enana azul (rara)
    ];

    const init = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      stars.length = 0;
      
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w - w / 2,
          y: Math.random() * h - h / 2,
          z: Math.random() * w,
          size: Math.random() * 1.5 + 0.5,
          color: colors[Math.floor(Math.random() * (i % 10 === 0 ? colors.length : 3))],
          twinkle: Math.random(),
          px: 0,
          py: 0
        });
      }
    };

    const animate = () => {
      // Fondo negro espacial profundo con un gradiente radial sutil para simular el centro de la galaxia
      const gradient = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w);
      gradient.addColorStop(0, '#040b1a'); // Centro un poco más azulado
      gradient.addColorStop(1, '#020617'); // Bordes negros totales
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < count; i++) {
        let s = stars[i];
        
        // Movimiento hiper-fluido
        s.z -= 1.2; 
        
        if (s.z <= 0) {
          s.z = w;
          s.x = Math.random() * w - w / 2;
          s.y = Math.random() * h - h / 2;
          s.px = 0;
          s.py = 0;
        }

        // Perspectiva 3D real
        const x = (s.x / s.z) * w + w / 2;
        const y = (s.y / s.z) * h + h / 2;

        if (s.px !== 0) {
          // Opacidad basada en cercanía y centelleo (twinkle)
          const baseOpacity = (1 - s.z / w);
          const twinkleFactor = 0.5 + Math.sin(Date.now() * 0.005 + s.twinkle * 100) * 0.5;
          const opacity = baseOpacity * twinkleFactor;
          
          const size = s.size * (1 - s.z / w) * 2;
          
          ctx.beginPath();
          ctx.strokeStyle = s.color;
          ctx.globalAlpha = opacity;
          ctx.lineWidth = size;
          ctx.lineCap = 'round';
          
          // Efecto de estela (trail) sutil
          ctx.moveTo(x, y);
          ctx.lineTo(s.px, s.py);
          ctx.stroke();
          
          // Núcleo brillante (Glow) para las estrellas más cercanas
          if (s.z < w * 0.3) {
            ctx.beginPath();
            ctx.arc(x, y, size * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = s.color;
            ctx.globalAlpha = opacity * 0.3;
            ctx.fill();
          }
        }

        s.px = x;
        s.py = y;
      }
      
      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => init();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="starfield-canvas"
      className="fixed inset-0 w-full h-full"
      style={{ 
        zIndex: 0, 
        pointerEvents: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        display: 'block'
      }}
    />
  );
};


