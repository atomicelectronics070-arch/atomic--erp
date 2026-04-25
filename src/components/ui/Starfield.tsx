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
    
    // Configuración de estrellas
    const stars: {x: number, y: number, z: number, px: number, py: number}[] = [];
    const count = 400;

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
          px: 0,
          py: 0
        });
      }
    };

    const animate = () => {
      // Fondo negro absoluto para asegurar visibilidad
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < count; i++) {
        let s = stars[i];
        s.z -= 1.5; // Velocidad
        
        if (s.z <= 0) {
          s.z = w;
          s.x = Math.random() * w - w / 2;
          s.y = Math.random() * h - h / 2;
          s.px = 0;
          s.py = 0;
        }

        const x = (s.x / s.z) * w + w / 2;
        const y = (s.y / s.z) * h + h / 2;

        if (s.px !== 0) {
          const size = (1 - s.z / w) * 2.5;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${1 - s.z / w})`;
          ctx.lineWidth = size;
          ctx.lineCap = 'round';
          ctx.moveTo(x, y);
          ctx.lineTo(s.px, s.py);
          ctx.stroke();
        }

        s.px = x;
        s.py = y;
      }

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
        background: '#020617',
        pointerEvents: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        display: 'block'
      }}
    />
  );
};
