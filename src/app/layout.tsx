import { Providers } from "@/components/Providers";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ATOMIC INDUSTRIES",
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

