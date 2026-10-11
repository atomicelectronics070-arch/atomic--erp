import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

let cachedBase64: string | null = null;
let cachedBuffer: Buffer | null = null;

function loadLogoFromTemplate(): { base64: string; buffer: Buffer } | null {
  if (cachedBase64 && cachedBuffer) {
    return { base64: cachedBase64, buffer: cachedBuffer };
  }

  // 1. Official Atomic brand icon
  const iconPaths = [
    path.join(process.cwd(), "public", "icon-192.png"),
    path.join(process.cwd(), "public", "apple-icon.png"),
    path.join(process.cwd(), "public", "icon-64.png"),
    path.join(process.cwd(), "public", "icon-32.png"),
  ];

  for (const iconPath of iconPaths) {
    if (fs.existsSync(iconPath)) {
      try {
        const buf = fs.readFileSync(iconPath);
        cachedBuffer = buf;
        cachedBase64 = `data:image/png;base64,${buf.toString("base64")}`;

        // Overwrite any legacy/stale parking barrier image
        try {
          const outPng = path.join(process.cwd(), "public", "templates", "atomic_quote_logo.png");
          const dir = path.dirname(outPng);
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(outPng, buf);
        } catch (_) {}

        return { base64: cachedBase64, buffer: cachedBuffer };
      } catch (e) {
        console.warn(`[API/quotes/logo] Error reading ${iconPath}:`, e);
      }
    }
  }

  return null;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format");

    const logo = loadLogoFromTemplate();
    if (!logo) {
      return NextResponse.json({ success: false, error: "Logo no encontrado" }, { status: 404 });
    }

    if (format === "png") {
      return new Response(logo.buffer, {
        status: 200,
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    return NextResponse.json({
      success: true,
      base64: logo.base64,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
