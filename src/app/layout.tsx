import { Providers } from "@/components/Providers";
import { SpaceBackground } from "@/components/SpaceBackground";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ATOMIC Solutions",
  description: "Enterprise ERP & CRM Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased bg-[#020617] text-slate-200 font-sans selection:bg-secondary/30 selection:text-white">
        <SpaceBackground />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}



