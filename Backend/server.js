require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")

const PORT = process.env.PORT || 3000

// Senior-Level Startup Guard
async function bootstrap() {
    try {
        console.log("🚀 SkillSync Backend Starting...")
        
        await connectToDB()
        console.log("✅ DATABASE CONNECTED")
        
        app.listen(PORT, () => {
            console.log(`✅ SERVER IS ONLINE ON PORT ${PORT}`)
            console.log(`✅ DISCOVERY: http://localhost:${PORT}/api/auth/register`)
        })
    } catch (err) {
        console.error("❌ BOOTSTRAP FAILED:", err.message)
        console.error(err.stack)
        process.exit(1)
    }
}

bootstrap()