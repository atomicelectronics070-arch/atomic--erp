const bcrypt = require('bcryptjs');

async function test() {
    console.log("Starting bcryptjs 3.0.3 test...");
    const start = Date.now();
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash("password123", salt);
    console.log("Hash generated:", hash);
    const match = await bcrypt.compare("password123", hash);
    console.log("Match result:", match);
    console.log("Time taken (ms):", Date.now() - start);
}

test().catch(err => console.error("Bcrypt test error:", err));
