import bcrypt from 'bcryptjs'

const pass = "juan123"
const hash = "$2a$10$7Z8b9c... (Wait, I need a real hash)"

async function run() {
    const salts = await bcrypt.genSalt(10)
    const newHash = await bcrypt.hash("test", salts)
    console.log("New Hash:", newHash)
    const match = await bcrypt.compare("test", newHash)
    console.log("Match:", match)
}

run()
