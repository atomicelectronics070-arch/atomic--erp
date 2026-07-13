import { NextResponse } from "next/server"
import path from "path"
import fs from "fs"

// Sirve el APK más reciente con los headers correctos para que Android lo descargue e instale
export async function GET() {
  const apkPath = path.join(process.cwd(), "public", "downloads", "atomic-erp-latest.apk")

  if (!fs.existsSync(apkPath)) {
    return NextResponse.json(
      { error: "APK no disponible en este momento" },
      { status: 404 }
    )
  }

  const apkBuffer = fs.readFileSync(apkPath)
  const stats = fs.statSync(apkPath)

  return new NextResponse(apkBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.android.package-archive",
      "Content-Disposition": "attachment; filename=\"atomic-erp-latest.apk\"",
      "Content-Length": stats.size.toString(),
      "Cache-Control": "no-cache",
    },
  })
}
