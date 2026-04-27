const { Client } = require('pg');
const connectionString = "postgresql://postgres.kkvujjyohspdynxltwqo:Jp2024013gg002%40@db.kkvujjyohspdynxltwqo.supabase.co:5432/postgres";

async function test() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("Connected successfully to 5432!");
    await client.end();
  } catch (err) {
    console.error("Connection failed on 5432:", err.message);
  }
}
test();
