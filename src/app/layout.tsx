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
      <body className="antialiased bg-white text-neutral-900 font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

