require("dotenv").config()
const app = require("./app")
const connectToDB = require("./config/database")

const PORT = process.env.PORT || 3000

async function bootstrap() {
    try {
        console.log("🚀 SkillSync Backend Starting...")
        await connectToDB()
        console.log("✅ DATABASE CONNECTED")
        app.listen(PORT, () => {
            console.log(`✅ SERVER IS ONLINE ON PORT ${PORT}`)
        })
    } catch (err) {
        console.error("❌ BOOTSTRAP FAILED:", err.message)
        process.exit(1)
    }
}

bootstrap()
