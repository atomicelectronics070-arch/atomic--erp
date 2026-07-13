import { NextResponse } from "next/server"
import { LATEST_APK_VERSION, LATEST_APK_VERSION_CODE, APK_DOWNLOAD_PATH, LATEST_CHANGELOG } from "@/lib/apkVersion"

// Compara versiones semánticas: retorna true si latest > current
function isNewerVersion(current: string, latest: string): boolean {
  const parse = (v: string) => v.split(".").map(Number)
  const [cMaj, cMin, cPatch] = parse(current)
  const [lMaj, lMin, lPatch] = parse(latest)
  if (lMaj !== cMaj) return lMaj > cMaj
  if (lMin !== cMin) return lMin > cMin
  return lPatch > cPatch
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const clientVersion = searchParams.get("v") || "0.0.0"
  const updateAvailable = isNewerVersion(clientVersion, LATEST_APK_VERSION)

  return NextResponse.json({
    latestVersion: LATEST_APK_VERSION,
    latestVersionCode: LATEST_APK_VERSION_CODE,
    updateAvailable,
    downloadUrl: APK_DOWNLOAD_PATH,
    changelog: LATEST_CHANGELOG,
    checkedAt: new Date().toISOString(),
  })
}
