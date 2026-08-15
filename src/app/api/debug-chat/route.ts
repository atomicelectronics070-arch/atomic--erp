export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";

export async function GET() {
    const results: any = {};

    const GOOGLE_API_KEY = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;

    // Test Gemini
    if (GOOGLE_API_KEY) {
        try {
            const payload = {
                contents: [{
                    role: 'user',
                    parts: [{ text: "Respond with exactly 'HELLO GEMINI' if you hear me." }]
                }]
            };

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            results.geminiStatus = response.status;
            const data = await response.json();
            results.geminiRaw = data;
            if (response.ok) {
                results.geminiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No text candidates";
            }

            // Test Gemini 2.5 Flash as well
            const response25 = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            results.gemini25Status = response25.status;
            results.gemini25Raw = await response25.json();
        } catch (e: any) {
            results.geminiException = e.message;
        }
    } else {
        results.geminiStatus = "no key";
    }

    // Test NVIDIA
    if (NVIDIA_API_KEY) {
        try {
            const nvidiaBaseUrl = process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";
            const nvidiaModel = process.env.WORKER_MODEL || "nvidia/llama-3.3-nemotron-super-49b-v1.5";

            const payload = {
                model: nvidiaModel,
                messages: [{ role: 'user', content: 'Respond with exactly "HELLO NVIDIA" if you hear me.' }],
                temperature: 0.2,
                max_tokens: 50
            };

            const response = await fetch(`${nvidiaBaseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${NVIDIA_API_KEY}`
                },
                body: JSON.stringify(payload)
            });

            results.nvidiaStatus = response.status;
            const data = await response.json();
            results.nvidiaRaw = data;
            if (response.ok) {
                results.nvidiaText = data.choices?.[0]?.message?.content || "No choices";
            }
        } catch (e: any) {
            results.nvidiaException = e.message;
        }
    } else {
        results.nvidiaStatus = "no key";
    }

    return NextResponse.json(results);
}
