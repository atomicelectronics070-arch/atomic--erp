const fs = require('fs');
const readline = require('readline');

async function searchBuildCommands() {
    const fileStream = fs.createReadStream('C:\\Users\\SANTIAGO\\.gemini\\antigravity\\brain\\9f2fa25d-d389-41e8-b7aa-aaf567691c42\\.system_generated\\logs\\transcript.jsonl');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let lineNumber = 0;
    
    for await (const line of rl) {
        lineNumber++;
        try {
            const parsed = JSON.parse(line);
            if (parsed.tool_calls) {
                parsed.tool_calls.forEach(tc => {
                    if (tc.name === 'run_command' && (tc.args.CommandLine.includes('gradle') || tc.args.CommandLine.includes('apk') || tc.args.CommandLine.includes('jbr') || tc.args.CommandLine.includes('JAVA_HOME'))) {
                        console.log(`Line ${lineNumber} (Tool: run_command):`, JSON.stringify(tc.args));
                    }
                });
            }
        } catch(e) {
            // ignore
        }
    }
}

searchBuildCommands();
