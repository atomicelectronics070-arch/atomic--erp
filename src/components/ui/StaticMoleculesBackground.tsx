"use client";

/**
 * StaticMoleculesBackground — Zero-JS, GPU-accelerated static background.
 *
 * Just a fixed-position image with subtle overlay. No canvas, no requestAnimationFrame,
 * no event listeners. Fluid on every device, including low-power phones.
 */

import React from "react";

export const StaticMoleculesBackground: React.FC = () => {
  return (
    <div
      data-testid="molecules-bg-static"
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0"
      style={{ contain: "strict" }}
    >
      {/* Cream base (warmer than pure white — premium feel) */}
      <div
        className="absolute inset-0"
        style={{ background: "#F4F1EB" }}
      />

      {/* The molecules image — tenuous, slightly desaturated, with gentle bottom fade */}
      <div
        className="absolute inset-0 bg-no-repeat bg-cover bg-center"
        style={{
          backgroundImage: "url(/backgrounds/molecules.png)",
          opacity: 0.32,
          filter: "saturate(0.85) contrast(1.05)",
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 60%, rgba(0,0,0,0.7) 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 60%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Soft warm vignette to blend the image into the cream base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 30%, rgba(244,241,235,0) 0%, rgba(244,241,235,0.55) 70%, rgba(244,241,235,0.85) 100%)",
        }}
      />
    </div>
  );
};

export default StaticMoleculesBackground;
