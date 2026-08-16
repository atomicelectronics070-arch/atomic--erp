import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    version: '3d-coverflow-v100', 
    timestamp: new Date().toISOString(),
    message: 'ATOMIC ERP RAILWAY LIVE DEPLOYMENT'
  });
}
