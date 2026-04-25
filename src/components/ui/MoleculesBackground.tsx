"use client";

/**
 * MoleculesBackground — Interactive black metaballs on a luminous white surface.
 *
 * Features:
 *   - 3D-looking glossy black spheres with white specular highlight + soft drop shadow
 *   - Spheres organized in chains (molecules) with stem connectors
 *   - Constant gentle drift (each molecule has its own velocity)
 *   - Mouse parallax across depth layers
 *   - Mouse repel: cursor pushes nearby spheres outward
 *   - Click bursts a new free-floating sphere into the scene
 *   - DPR-aware crisp rendering (≤2 desktop, ≤1.5 mobile)
 *
 * Pure 2D canvas — no Three.js, no extra deps.
 */

import React, { useEffect, useRef } from "react";

interface Sphere {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  r: number;
  depth: number; // 0..1 — used for parallax + perspective
  group: number; // -1 = free; otherwise molecule id
  next: number; // index of next sphere in chain (-1 = none)
}

export const MoleculesBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const isMobile =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 768px)").matches;

    const DPR = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);

    let w = 0;
    let h = 0;
    let cssW = 0;
    let cssH = 0;

    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false };
    let spheres: Sphere[] = [];

    const buildScene = () => {
      cssW = window.innerWidth;
      cssH = window.innerHeight;
      w = cssW * DPR;
      h = cssH * DPR;
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;

      spheres = [];
      const moleculeCount = isMobile ? 5 : 9;
      let groupId = 0;

      for (let m = 0; m < moleculeCount; m++) {
        const chainLen = 2 + Math.floor(Math.random() * 3); // 2-4 spheres
        const ox = Math.random() * w;
        const oy = Math.random() * h;
        const angle = Math.random() * Math.PI * 2;
        const depth = Math.random();
        const baseR = (24 + Math.random() * 56) * DPR * (0.6 + depth * 0.7);
        const driftX = (Math.random() - 0.5) * 0.25 * DPR;
        const driftY = (Math.random() - 0.5) * 0.18 * DPR;

        let prevX = ox;
        let prevY = oy;
        let prevR = baseR;

        for (let i = 0; i < chainLen; i++) {
          const r = prevR * (0.65 + Math.random() * 0.5);
          const dist = (prevR + r) * 0.85;
          const a = angle + (Math.random() - 0.5) * 1.0;
          const x = prevX + Math.cos(a) * dist;
          const y = prevY + Math.sin(a) * dist;

          const idx = spheres.length;
          spheres.push({
            x,
            y,
            vx: driftX,
            vy: driftY,
            baseX: x,
            baseY: y,
            r,
            depth,
            group: groupId,
            next: -1,
          });
          if (i > 0) spheres[idx - 1].next = idx;

          prevX = x;
          prevY = y;
          prevR = r;
        }
        groupId++;
      }
    };

    // ── Render passes ──

    const drawBackdrop = () => {
      // Solid luminous off-white (no muddy gradient)
      ctx.fillStyle = "#F2F2F0";
      ctx.fillRect(0, 0, w, h);

      // Soft radial glow toward viewport center (very subtle)
      const grd = ctx.createRadialGradient(
        w / 2,
        h / 2,
        0,
        w / 2,
        h / 2,
        Math.max(w, h) * 0.7
      );
      grd.addColorStop(0, "rgba(255,255,255,0.6)");
      grd.addColorStop(1, "rgba(220,220,220,0)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);
    };

    const drawShadow = (s: Sphere) => {
      // Soft elliptical shadow below each sphere on the implicit floor
      const shY = s.y + s.r * 1.2;
      const shR = s.r * (1.2 + s.depth * 0.4);
      const grd = ctx.createRadialGradient(s.x, shY, 0, s.x, shY, shR);
      grd.addColorStop(0, "rgba(0,0,0,0.18)");
      grd.addColorStop(0.6, "rgba(0,0,0,0.05)");
      grd.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.ellipse(s.x, shY, shR, shR * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawConnector = (a: Sphere, b: Sphere) => {
      // Glossy stem between two spheres of the same molecule (metaball-ish)
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.hypot(dx, dy);
      if (len < 1) return;
      const nx = dx / len;
      const ny = dy / len;
      const px = -ny;
      const py = nx;

      const wA = a.r * 0.55;
      const wB = b.r * 0.55;

      ctx.beginPath();
      ctx.moveTo(a.x + px * wA, a.y + py * wA);
      ctx.bezierCurveTo(
        a.x + nx * len * 0.4 + px * wA * 1.1,
        a.y + ny * len * 0.4 + py * wA * 1.1,
        b.x - nx * len * 0.4 + px * wB * 1.1,
        b.y - ny * len * 0.4 + py * wB * 1.1,
        b.x + px * wB,
        b.y + py * wB
      );
      ctx.lineTo(b.x - px * wB, b.y - py * wB);
      ctx.bezierCurveTo(
        b.x - nx * len * 0.4 - px * wB * 1.1,
        b.y - ny * len * 0.4 - py * wB * 1.1,
        a.x + nx * len * 0.4 - px * wA * 1.1,
        a.y + ny * len * 0.4 - py * wA * 1.1,
        a.x - px * wA,
        a.y - py * wA
      );
      ctx.closePath();

      // Body (deep black with subtle vertical shading)
      const grd = ctx.createLinearGradient(a.x, a.y - wA, a.x, a.y + wA);
      grd.addColorStop(0, "#2a2a2a");
      grd.addColorStop(0.5, "#080808");
      grd.addColorStop(1, "#000000");
      ctx.fillStyle = grd;
      ctx.fill();
    };

    const drawSphere = (s: Sphere) => {
      // Body — radial gradient from deep black to slightly lighter rim
      const body = ctx.createRadialGradient(
        s.x - s.r * 0.35,
        s.y - s.r * 0.4,
        s.r * 0.05,
        s.x,
        s.y,
        s.r
      );
      body.addColorStop(0, "#3a3a3a");
      body.addColorStop(0.35, "#0e0e0e");
      body.addColorStop(0.85, "#000000");
      body.addColorStop(1, "#1a1a1a");
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();

      // Specular highlight (top-left)
      const hi = ctx.createRadialGradient(
        s.x - s.r * 0.45,
        s.y - s.r * 0.5,
        0,
        s.x - s.r * 0.45,
        s.y - s.r * 0.5,
        s.r * 0.55
      );
      hi.addColorStop(0, "rgba(255,255,255,0.9)");
      hi.addColorStop(0.4, "rgba(255,255,255,0.25)");
      hi.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = hi;
      ctx.beginPath();
      ctx.arc(s.x - s.r * 0.4, s.y - s.r * 0.45, s.r * 0.55, 0, Math.PI * 2);
      ctx.fill();

      // Tiny crisp highlight dot
      const dot = ctx.createRadialGradient(
        s.x - s.r * 0.55,
        s.y - s.r * 0.6,
        0,
        s.x - s.r * 0.55,
        s.y - s.r * 0.6,
        s.r * 0.18
      );
      dot.addColorStop(0, "rgba(255,255,255,1)");
      dot.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = dot;
      ctx.beginPath();
      ctx.arc(s.x - s.r * 0.55, s.y - s.r * 0.6, s.r * 0.18, 0, Math.PI * 2);
      ctx.fill();

      // Subtle bottom rim light (reflection)
      const rim = ctx.createRadialGradient(
        s.x + s.r * 0.3,
        s.y + s.r * 0.55,
        0,
        s.x + s.r * 0.3,
        s.y + s.r * 0.55,
        s.r * 0.7
      );
      rim.addColorStop(0, "rgba(180,180,180,0.18)");
      rim.addColorStop(1, "rgba(180,180,180,0)");
      ctx.fillStyle = rim;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    };

    let raf = 0;
    const loop = () => {
      // Smooth mouse follow
      mouse.x += (mouse.tx - mouse.x) * 0.15;
      mouse.y += (mouse.ty - mouse.y) * 0.15;

      // Update physics
      const repelR = 180 * DPR;
      const repelForce = 0.6;
      const parallaxX = (mouse.x - cssW / 2) * DPR;
      const parallaxY = (mouse.y - cssH / 2) * DPR;

      for (const s of spheres) {
        // Drift
        s.baseX += s.vx;
        s.baseY += s.vy;

        // Wrap
        if (s.baseX < -s.r * 2) s.baseX = w + s.r;
        if (s.baseX > w + s.r * 2) s.baseX = -s.r;
        if (s.baseY < -s.r * 2) s.baseY = h + s.r;
        if (s.baseY > h + s.r * 2) s.baseY = -s.r;

        // Parallax offset by depth
        const px = s.baseX + parallaxX * (0.02 + s.depth * 0.06);
        const py = s.baseY + parallaxY * (0.02 + s.depth * 0.06);

        // Mouse repel
        let tx = px;
        let ty = py;
        if (mouse.active) {
          const dx = px - mouse.x * DPR;
          const dy = py - mouse.y * DPR;
          const d = Math.hypot(dx, dy);
          if (d < repelR && d > 0.01) {
            const k = (1 - d / repelR) * repelR * repelForce;
            tx += (dx / d) * k;
            ty += (dy / d) * k;
          }
        }

        // Smooth approach
        s.x += (tx - s.x) * 0.12;
        s.y += (ty - s.y) * 0.12;
      }

      // Sort by depth (back→front)
      spheres.sort((a, b) => a.depth - b.depth);

      // Render
      drawBackdrop();

      // Pass 1 — shadows
      for (const s of spheres) drawShadow(s);

      // Pass 2 — molecule connectors
      for (let i = 0; i < spheres.length; i++) {
        const s = spheres[i];
        if (s.next >= 0 && s.next < spheres.length) {
          const next = spheres[s.next];
          if (next.group === s.group) drawConnector(s, next);
        }
      }

      // Pass 3 — spheres
      for (const s of spheres) drawSphere(s);

      raf = requestAnimationFrame(loop);
    };

    // ── Events ──
    const onResize = () => buildScene();
    const onMouseMove = (e: MouseEvent) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
      mouse.active = true;
    };
    const onMouseLeave = () => {
      mouse.active = false;
      mouse.tx = -9999;
      mouse.ty = -9999;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouse.tx = e.touches[0].clientX;
        mouse.ty = e.touches[0].clientY;
        mouse.active = true;
      }
    };
    const onTouchEnd = () => {
      mouse.active = false;
    };

    const burst = (clientX: number, clientY: number) => {
      // Spawn a small free-floating sphere chain at click location
      const baseR = (18 + Math.random() * 28) * DPR;
      const x = clientX * DPR;
      const y = clientY * DPR;
      const groupId = 9999 + spheres.length;
      const angle = Math.random() * Math.PI * 2;
      let prevX = x;
      let prevY = y;
      let prevR = baseR;
      const chainLen = 2 + Math.floor(Math.random() * 2);
      const start = spheres.length;
      for (let i = 0; i < chainLen; i++) {
        const r = prevR * (0.7 + Math.random() * 0.4);
        const dist = (prevR + r) * 0.85;
        const a = angle + (Math.random() - 0.5) * 1.0;
        const nx = prevX + Math.cos(a) * dist;
        const ny = prevY + Math.sin(a) * dist;

        const idx = spheres.length;
        spheres.push({
          x: nx,
          y: ny,
          vx: (Math.random() - 0.5) * 0.6 * DPR,
          vy: (Math.random() - 0.5) * 0.6 * DPR,
          baseX: nx,
          baseY: ny,
          r,
          depth: 0.5 + Math.random() * 0.5,
          group: groupId,
          next: -1,
        });
        if (i > 0) spheres[idx - 1].next = idx;
        prevX = nx;
        prevY = ny;
        prevR = r;
      }
      // Cap total spheres so memory stays bounded
      const MAX = isMobile ? 60 : 120;
      if (spheres.length > MAX) {
        spheres.splice(0, spheres.length - MAX);
      }
      // Re-link next indices after splice (best effort: clear cross-group nexts)
      for (let i = 0; i < spheres.length; i++) {
        if (spheres[i].next >= spheres.length) spheres[i].next = -1;
      }
      void start;
    };
    const onClick = (e: MouseEvent) => burst(e.clientX, e.clientY);
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches[0]) burst(e.touches[0].clientX, e.touches[0].clientY);
    };

    buildScene();
    raf = requestAnimationFrame(loop);

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("click", onClick);
    window.addEventListener("touchstart", onTouchStart, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("click", onClick);
      window.removeEventListener("touchstart", onTouchStart);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      data-testid="molecules-background-canvas"
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        display: "block",
        background: "#F2F2F0",
      }}
    />
  );
};

export default MoleculesBackground;
