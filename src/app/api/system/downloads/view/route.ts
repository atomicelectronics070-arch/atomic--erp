import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get("file");
    if (!fileName) {
      return NextResponse.json({ error: "Missing file parameter" }, { status: 400 });
    }

    // Sanitize to prevent directory traversal
    const safeBaseName = path.basename(fileName);
    const fullPath = path.join("C:\\Users\\SANTIAGO\\Downloads", safeBaseName);

    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const buffer = fs.readFileSync(fullPath);
    const ext = path.extname(safeBaseName).toLowerCase();

    let mimeType = "application/octet-stream";
    if (ext === ".png") mimeType = "image/png";
    else if (ext === ".jpg" || ext === ".jpeg") mimeType = "image/jpeg";
    else if (ext === ".webp") mimeType = "image/webp";
    else if (ext === ".pdf") mimeType = "application/pdf";

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
