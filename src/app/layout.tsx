import { Providers } from "@/components/Providers";
// SpaceBackground removed for cleaner corporate look
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,700&family=IBM+Plex+Mono:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-[#F8FAFC] text-[#0F172A] selection:bg-[#1E3A8A]/10 selection:text-[#1E3A8A]" style={{ fontFamily: "'IBM Plex Sans', ui-sans-serif, system-ui" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}



