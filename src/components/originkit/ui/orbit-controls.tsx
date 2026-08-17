"use client";

import React from "react";

export default function OrbitControls() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {/* Outer atmosphere ring 1 */}
      <div className="absolute w-[440px] h-[440px] rounded-full border border-blue-500/20 animate-[spin_30s_linear_infinite]" />
      {/* Inner atmosphere ring 2 */}
      <div className="absolute w-[500px] h-[500px] rounded-full border border-indigo-500/10 border-dashed animate-[spin_45s_linear_infinite_reverse]" />
    </div>
  );
}
