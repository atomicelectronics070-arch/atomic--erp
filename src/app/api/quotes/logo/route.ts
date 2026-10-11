import fs from "fs";
import path from "path";
import * as fflate from "fflate";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

let cachedBase64: string | null = null;
let cachedBuffer: Buffer | null = null;

function loadLogoFromTemplate(): { base64: string; buffer: Buffer } | null {
  if (cachedBase64 && cachedBuffer) {
    return { base64: cachedBase64, buffer: cachedBuffer };
  }

  const candidatePaths = [
    path.join(process.cwd(), "public", "templates", "quote_template_atomic.xlsx"),
    path.join(process.cwd(), "public", "templates", "atomic_quote_logo.png"),
    "C:\\Users\\SANTIAGO\\Downloads\\PROP-09-71_Anthony_Ávila_..xlsx"
  ];

  // 1. Direct png file if already extracted
  const directPng = path.join(process.cwd(), "public", "templates", "atomic_quote_logo.png");
  if (fs.existsSync(directPng)) {
    try {
      const buf = fs.readFileSync(directPng);
      cachedBuffer = buf;
      cachedBase64 = `data:image/png;base64,${buf.toString("base64")}`;
      return { base64: cachedBase64, buffer: cachedBuffer };
    } catch (_) {}
  }

  // 2. Extract from Excel template
  for (const tPath of candidatePaths) {
    if (tPath.endsWith(".xlsx") && fs.existsSync(tPath)) {
      try {
        const fileBytes = fs.readFileSync(tPath);
        const unzipped = fflate.unzipSync(new Uint8Array(fileBytes));
        
        // Find image in zip
        const imgKey = Object.keys(unzipped).find(k => k.startsWith("xl/media/image1.") || k.startsWith("xl/media/"));
        if (imgKey && unzipped[imgKey]) {
          const buf = Buffer.from(unzipped[imgKey]);
          cachedBuffer = buf;
          cachedBase64 = `data:image/png;base64,${buf.toString("base64")}`;

          // Cache to public directory for static serving
          try {
            const outPng = path.join(process.cwd(), "public", "templates", "atomic_quote_logo.png");
            const dir = path.dirname(outPng);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(outPng, buf);
          } catch (_) {}

          return { base64: cachedBase64, buffer: cachedBuffer };
        }
      } catch (err) {
        console.warn(`[API/quotes/logo] Failed unzipping ${tPath}:`, err);
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
      return NextResponse.json({ success: false, error: "Logo no encontrado en la plantilla" }, { status: 404 });
    }

    if (format === "png") {
      return new Response(logo.buffer, {
        status: 200,
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=31536000, immutable"
        }
      });
    }

    return NextResponse.json({
      success: true,
      base64: logo.base64
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
