import { Providers } from "@/components/Providers";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ATOMIC Solutions",
  description: "Enterprise ERP & CRM Dashboard",
  icons: {
    icon: [
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-64.png", sizes: "64x64", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/icon-32.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* ── Appit Real Fonts: preconnect ── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* ── Inter Tight (Appit headings — weight 600/700/900) ── */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,600;0,700;0,900;1,600;1,700;1,900&display=swap"
          rel="stylesheet"
        />

        {/* ── Instrument Sans (Appit body — weight 500/600/700) ── */}
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,500;0,600;0,700;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />

        {/* ── Inter (Appit UI elements — weight 400/500/600/700) ── */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* ── Appit Real Design Token CSS (extracted from Originkit template) ── */}
        <link rel="stylesheet" href="/appit-theme.css" />
      </head>
      <body
        className="antialiased selection:bg-blue-500/20 selection:text-blue-300"
        style={{
          backgroundColor: "#09090A",
          color: "#FFFFFF",
          fontFamily: "'Instrument Sans', 'Inter', ui-sans-serif, system-ui",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
