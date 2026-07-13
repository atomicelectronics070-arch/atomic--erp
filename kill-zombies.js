const { exec } = require('child_process');

console.log("Killing zombie chrome/chromium processes...");
exec('taskkill /F /F /IM chrome.exe', (err, stdout, stderr) => {
    console.log("chrome.exe kill result:");
    console.log(stdout || "none");
});
exec('taskkill /F /F /IM msedge.exe', (err, stdout, stderr) => {
    console.log("msedge.exe kill result:");
    console.log(stdout || "none");
});
