const fs = require('fs');
const readline = require('readline');

async function searchCapacitor() {
    const fileStream = fs.createReadStream('C:\\Users\\SANTIAGO\\.gemini\\antigravity\\brain\\9f2fa25d-d389-41e8-b7aa-aaf567691c42\\.system_generated\\logs\\transcript.jsonl');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const keywords = [/capacitor/i, /npx cap/i, /gradle/i, /android/i, /apk/i];
    let lineNumber = 0;
    
    for await (const line of rl) {
        lineNumber++;
        for (const kw of keywords) {
            if (kw.test(line)) {
                try {
                    const parsed = JSON.parse(line);
                    // Filter down to steps that might contain implementation details
                    if (parsed.type === 'PLANNER_RESPONSE' || parsed.type === 'USER_INPUT') {
                        console.log(`Line ${lineNumber} (${parsed.type}): ${parsed.content ? parsed.content.substring(0, 500) : ''}`);
                    } else if (parsed.tool_calls) {
                        parsed.tool_calls.forEach(tc => {
                            if (tc.name === 'run_command' || tc.name === 'write_to_file' || tc.name === 'replace_file_content') {
                                console.log(`Line ${lineNumber} (Tool: ${tc.name}):`, JSON.stringify(tc.args));
                            }
                        });
                    }
                } catch(e) {
                    console.log(`Line ${lineNumber} (raw error): ${line.substring(0, 150)}`);
                }
                break;
            }
        }
    }
}

searchCapacitor();
