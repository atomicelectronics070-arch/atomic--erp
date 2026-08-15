export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";

export async function GET() {
  const envInfo = {
    hasGeminiKey: !!(process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY),
    hasNvidiaKey: !!process.env.NVIDIA_API_KEY,
    nvidiaBaseUrl: process.env.NVIDIA_BASE_URL || "not set",
    workerModel: process.env.WORKER_MODEL || "not set",
    nodeEnv: process.env.NODE_ENV || "not set"
  };
  return NextResponse.json(envInfo);
}
