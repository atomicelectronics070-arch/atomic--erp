const fs = require('fs');
const readline = require('readline');

async function search() {
    const fileStream = fs.createReadStream('C:\\Users\\SANTIAGO\\.gemini\\antigravity\\brain\\9f2fa25d-d389-41e8-b7aa-aaf567691c42\\.system_generated\\logs\\transcript.jsonl');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const keywords = [/electron/i, /tauri/i, /desktop/i, /build/i, /exe\b/i, /empaquet/i, /app\b/i, /neutralino/i];
    let lineNumber = 0;
    
    for await (const line of rl) {
        lineNumber++;
        // Check if line matches any keyword
        for (const kw of keywords) {
            if (kw.test(line)) {
                // Try to parse JSON to make it readable
                try {
                    const parsed = JSON.parse(line);
                    if (parsed.type === 'USER_INPUT' || parsed.type === 'PLANNER_RESPONSE') {
                        console.log(`Line ${lineNumber} (${parsed.type}): ${parsed.content ? parsed.content.substring(0, 300) : ''}`);
                    } else if (parsed.tool_calls) {
                        console.log(`Line ${lineNumber} (Tool Call):`, JSON.stringify(parsed.tool_calls));
                    }
                } catch(e) {
                    // Fallback to line content substring
                    console.log(`Line ${lineNumber} (raw): ${line.substring(0, 200)}`);
                }
                break; // print once per line
            }
        }
    }
}

search();
