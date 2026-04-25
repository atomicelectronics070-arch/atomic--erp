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
    const stars: Star[] = [];
    const starCount = 400;

    class Star {
      x: number;
      y: number;
      z: number;
      px: number;
      py: number;

      constructor() {
        this.x = Math.random() * w - w / 2;
        this.y = Math.random() * h - h / 2;
        this.z = Math.random() * w;
        this.px = 0;
        this.py = 0;
      }

      update() {
        this.z -= 0.8; // Velocidad de movimiento hacia la cámara
        if (this.z <= 0) {
          this.z = w;
          this.x = Math.random() * w - w / 2;
          this.y = Math.random() * h - h / 2;
        }
      }

      draw() {
        const x = (this.x / this.z) * w + w / 2;
        const y = (this.y / this.z) * h + h / 2;

        if (this.px !== 0) {
          const size = (1 - this.z / w) * 2;
          const opacity = (1 - this.z / w);
          
          ctx!.beginPath();
          ctx!.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx!.lineWidth = size;
          ctx!.lineCap = 'round';
          ctx!.moveTo(x, y);
          ctx!.lineTo(this.px, this.py);
          ctx!.stroke();
        }

        this.px = x;
        this.py = y;
      }
    }

    const init = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;

      for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
      }
    };

    const animate = () => {
      // Fondo negro profundo con un toque de azul
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, w, h);

      stars.forEach(star => {
        star.update();
        star.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };

    init();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 bg-slate-950"
      style={{ pointerEvents: 'none' }}
    />
  );
};
