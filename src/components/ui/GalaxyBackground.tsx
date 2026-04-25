"use client";

/**
 * GalaxyBackground — Hyper-realistic 4K interactive galactic background.
 *
 * Layers (back to front):
 *   1. Deep space gradient base (#020617 — solid, no gradient muddiness on dark)
 *   2. Nebula clouds (multi-color soft blobs, slowly breathing & drifting)
 *   3. Distant spiral galaxy core (rotating logarithmic spirals)
 *   4. Three parallax star fields (far / mid / near) — react to mouse
 *   5. Warp / shooting stars (occasional streaks)
 *   6. Click-explosion particles (interactive)
 *
 * Performance:
 *   - DPR capped (desktop ≤ 2, mobile ≤ 1.5)
 *   - Star counts halved on viewports < 768px
 *   - All in a single 2D canvas, single requestAnimationFrame loop
 */

import React, { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
  twinkle: number;
  layer: 0 | 1 | 2; // 0 far · 1 mid · 2 near
}

interface NebulaBlob {
  x: number;
  y: number;
  r: number;
  color: string;
  drift: number;
  pulse: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export const GalaxyBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const isMobile =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 768px)").matches;

    const DPR = Math.min(
      window.devicePixelRatio || 1,
      isMobile ? 1.5 : 2
    );

    let w = 0;
    let h = 0;
    let cssW = 0;
    let cssH = 0;

    // ── Mouse state (parallax) ──
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    // ── Layer parameters ──
    const STAR_PALETTE = [
      "#FFFFFF",
      "#FFF4EA",
      "#EAF4FF",
      "#FFD27D",
      "#FFB084",
      "#9AB6FF",
      "#C9B0FF",
    ];

    const NEBULA_COLORS = [
      "rgba(120, 60, 200, 0.22)", // violet
      "rgba(220, 70, 130, 0.18)", // magenta
      "rgba(50, 180, 220, 0.18)", // cyan
      "rgba(255, 140, 70, 0.14)", // amber
      "rgba(60, 80, 220, 0.20)", // deep blue
    ];

    let stars: Star[] = [];
    let nebulae: NebulaBlob[] = [];
    let warpStars: Star[] = [];
    const particles: Particle[] = [];
    const shootingStars: ShootingStar[] = [];

    let galaxyAngle = 0;
    let lastShoot = 0;

    const buildScene = () => {
      cssW = window.innerWidth;
      cssH = window.innerHeight;
      w = cssW * DPR;
      h = cssH * DPR;
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;

      const density = isMobile ? 0.45 : 1;
      const starCount = Math.floor(900 * density);
      stars = [];
      for (let i = 0; i < starCount; i++) {
        const layer = (Math.random() < 0.55
          ? 0
          : Math.random() < 0.7
          ? 1
          : 2) as 0 | 1 | 2;
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z: 0.2 + Math.random() * 0.8,
          size: layer === 2 ? 1.4 + Math.random() * 1.6 : 0.4 + Math.random() * 1.2,
          color:
            STAR_PALETTE[Math.floor(Math.random() * STAR_PALETTE.length)],
          twinkle: Math.random() * Math.PI * 2,
          layer,
        });
      }

      // Warp stars (centered, diving outward)
      const warpCount = Math.floor(220 * density);
      warpStars = [];
      for (let i = 0; i < warpCount; i++) {
        warpStars.push({
          x: Math.random() * w - w / 2,
          y: Math.random() * h - h / 2,
          z: Math.random() * w,
          size: 0.5 + Math.random() * 1.4,
          color: STAR_PALETTE[Math.floor(Math.random() * 3)],
          twinkle: 0,
          layer: 2,
        });
      }

      // Nebula blobs
      const blobCount = isMobile ? 5 : 9;
      nebulae = [];
      for (let i = 0; i < blobCount; i++) {
        nebulae.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: (Math.min(w, h) * (0.18 + Math.random() * 0.35)),
          color:
            NEBULA_COLORS[Math.floor(Math.random() * NEBULA_COLORS.length)],
          drift: Math.random() * Math.PI * 2,
          pulse: Math.random() * Math.PI * 2,
        });
      }
    };

    // ── Render passes ──

    const drawSpace = () => {
      // Solid deep-space backdrop (per design rules: solid dark, no gradients)
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, w, h);

      // Subtle radial vignette toward galaxy core
      const cx = w / 2 + (mouse.x - cssW / 2) * 0.06 * DPR;
      const cy = h / 2 + (mouse.y - cssH / 2) * 0.06 * DPR;
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.7);
      grd.addColorStop(0, "rgba(40, 25, 80, 0.55)");
      grd.addColorStop(0.45, "rgba(15, 12, 45, 0.25)");
      grd.addColorStop(1, "rgba(2, 6, 23, 0)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);
    };

    const drawNebulae = (t: number) => {
      ctx.globalCompositeOperation = "lighter";
      for (const n of nebulae) {
        const px = n.x + Math.cos(t * 0.0001 + n.drift) * 40 * DPR;
        const py = n.y + Math.sin(t * 0.00012 + n.drift) * 30 * DPR;
        const pulse = 0.85 + Math.sin(t * 0.0006 + n.pulse) * 0.15;
        const r = n.r * pulse;

        const grad = ctx.createRadialGradient(px, py, 0, px, py, r);
        grad.addColorStop(0, n.color);
        grad.addColorStop(0.4, n.color.replace(/[\d.]+\)/, "0.06)"));
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    };

    const drawSpiralGalaxy = (t: number) => {
      galaxyAngle += 0.00025;
      const cx = w * 0.7 + (mouse.x - cssW / 2) * 0.04 * DPR;
      const cy = h * 0.35 + (mouse.y - cssH / 2) * 0.04 * DPR;
      const arms = 4;
      const points = isMobile ? 800 : 1600;
      const radiusMax = Math.min(w, h) * 0.42;

      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < points; i++) {
        const t0 = i / points;
        const arm = i % arms;
        const armOffset = (Math.PI * 2 * arm) / arms;
        // Logarithmic spiral
        const angle = armOffset + t0 * Math.PI * 6 + galaxyAngle;
        const radius = Math.pow(t0, 0.7) * radiusMax;
        const jitter = (Math.random() - 0.5) * 22 * DPR * (0.4 + t0);
        const x = cx + Math.cos(angle) * radius + jitter;
        const y = cy + Math.sin(angle) * radius * 0.6 + jitter * 0.5;

        const opacity = (1 - t0) * 0.55;
        const size = (1 - t0) * 1.6 * DPR + 0.3;

        // Color shifts from hot core (white-yellow) → cool arms (blue)
        let color = "rgba(255,240,200,";
        if (t0 > 0.5) color = "rgba(180,200,255,";
        if (t0 > 0.8) color = "rgba(120,160,255,";

        ctx.fillStyle = color + opacity.toFixed(3) + ")";
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    };

    const drawStars = (t: number) => {
      // Parallax offsets per layer based on mouse position
      const dx = (mouse.x - cssW / 2) * DPR;
      const dy = (mouse.y - cssH / 2) * DPR;
      const offsets = [
        { x: dx * 0.01, y: dy * 0.01 },
        { x: dx * 0.03, y: dy * 0.03 },
        { x: dx * 0.07, y: dy * 0.07 },
      ];

      for (const s of stars) {
        const o = offsets[s.layer];
        const x = ((s.x + o.x) % w + w) % w;
        const y = ((s.y + o.y) % h + h) % h;

        const tw = 0.55 + Math.sin(t * 0.003 + s.twinkle) * 0.45;
        const opacity = tw * (0.4 + s.z * 0.6);
        ctx.globalAlpha = opacity;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(x, y, s.size * DPR * 0.7, 0, Math.PI * 2);
        ctx.fill();

        if (s.layer === 2 && s.size > 1.6) {
          // Bright glow for nearby stars
          const g = ctx.createRadialGradient(x, y, 0, x, y, s.size * DPR * 4);
          g.addColorStop(0, s.color);
          g.addColorStop(1, "rgba(255,255,255,0)");
          ctx.globalAlpha = opacity * 0.35;
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(x, y, s.size * DPR * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    const drawWarp = () => {
      const cx = w / 2;
      const cy = h / 2;
      ctx.lineCap = "round";
      for (const s of warpStars) {
        s.z -= 2.4;
        if (s.z <= 0) {
          s.z = w;
          s.x = Math.random() * w - w / 2;
          s.y = Math.random() * h - h / 2;
        }
        const k = w / s.z;
        const px = s.x * k + cx;
        const py = s.y * k + cy;
        const k2 = w / (s.z + 14);
        const ox = s.x * k2 + cx;
        const oy = s.y * k2 + cy;

        if (px < 0 || px > w || py < 0 || py > h) continue;
        const opacity = Math.min(1, (1 - s.z / w) * 1.2);
        ctx.globalAlpha = opacity * 0.7;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size * DPR * (1 - s.z / w);
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(px, py);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const drawShootingStars = (t: number) => {
      // Spawn occasionally
      if (t - lastShoot > 1800 + Math.random() * 3000) {
        lastShoot = t;
        const fromTop = Math.random() < 0.5;
        shootingStars.push({
          x: Math.random() * w,
          y: fromTop ? -20 : Math.random() * h * 0.5,
          vx: (4 + Math.random() * 4) * DPR,
          vy: (3 + Math.random() * 3) * DPR,
          life: 0,
          maxLife: 60 + Math.random() * 40,
        });
      }
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life += 1;
        const a = 1 - s.life / s.maxLife;
        if (a <= 0) {
          shootingStars.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = a;
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2 * DPR;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 8, s.y - s.vy * 8);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const drawParticles = () => {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.life += 1;
        const a = 1 - p.life / p.maxLife;
        if (a <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = a;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        // Glow
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5);
        g.addColorStop(0, p.color);
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.globalAlpha = a * 0.3;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    let raf = 0;
    const loop = (t: number) => {
      // Smooth mouse follow
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;

      drawSpace();
      drawNebulae(t);
      drawSpiralGalaxy(t);
      drawWarp();
      drawStars(t);
      drawShootingStars(t);
      drawParticles();

      raf = requestAnimationFrame(loop);
    };

    // ── Events ──
    const onResize = () => buildScene();
    const onMouseMove = (e: MouseEvent) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouse.tx = e.touches[0].clientX;
        mouse.ty = e.touches[0].clientY;
      }
    };
    const burst = (clientX: number, clientY: number) => {
      const x = clientX * DPR;
      const y = clientY * DPR;
      const count = isMobile ? 28 : 50;
      const palette = ["#FFFFFF", "#FFD27D", "#9AB6FF", "#FFB084", "#C9B0FF"];
      for (let i = 0; i < count; i++) {
        const ang = (Math.PI * 2 * i) / count + Math.random() * 0.3;
        const speed = (1.5 + Math.random() * 5) * DPR;
        particles.push({
          x,
          y,
          vx: Math.cos(ang) * speed,
          vy: Math.sin(ang) * speed,
          life: 0,
          maxLife: 60 + Math.random() * 40,
          color: palette[Math.floor(Math.random() * palette.length)],
          size: (1 + Math.random() * 2) * DPR,
        });
      }
    };
    const onClick = (e: MouseEvent) => burst(e.clientX, e.clientY);
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches[0]) burst(e.touches[0].clientX, e.touches[0].clientY);
    };

    buildScene();
    mouse.x = mouse.tx = cssW / 2;
    mouse.y = mouse.ty = cssH / 2;
    raf = requestAnimationFrame(loop);

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("click", onClick);
    window.addEventListener("touchstart", onTouchStart, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("touchstart", onTouchStart);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      data-testid="galaxy-background-canvas"
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        display: "block",
        background: "#020617",
      }}
    />
  );
};

export default GalaxyBackground;
