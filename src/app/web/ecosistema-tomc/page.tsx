"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WebEcosistemaTomcRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/ecosistema-tomc");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#05070f] flex flex-col items-center justify-center font-mono">
      <div className="flex items-center gap-3 text-cyan-400">
        <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs uppercase tracking-widest font-bold animate-pulse">
          CONECTANDO AL NÚCLEO ECOSISTEMA TOMC...
        </span>
      </div>
    </div>
  );
}
