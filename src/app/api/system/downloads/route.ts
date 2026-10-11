import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const downloadsDir = "C:\\Users\\SANTIAGO\\Downloads";
    if (!fs.existsSync(downloadsDir)) {
      return NextResponse.json({ success: false, error: "Downloads directory not found" }, { status: 404 });
    }

    const files = fs.readdirSync(downloadsDir);
    const imageExtensions = [".png", ".jpg", ".jpeg", ".webp", ".bmp"];
    const excelExtensions = [".xlsx", ".xls", ".pdf"];

    const fileDetails = files
      .map((fileName) => {
        try {
          const fullPath = path.join(downloadsDir, fileName);
          const stat = fs.statSync(fullPath);
          const ext = path.extname(fileName).toLowerCase();
          const isImage = imageExtensions.includes(ext);
          const isDoc = excelExtensions.includes(ext);

          if (!isImage && !isDoc) return null;

          return {
            name: fileName,
            fullPath,
            size: stat.size,
            mtime: stat.mtimeMs,
            isImage,
            isDoc,
            ext,
          };
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .sort((a: any, b: any) => b.mtime - a.mtime)
      .slice(0, 30); // Top 30 most recent files

    return NextResponse.json({
      success: true,
      files: fileDetails,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
