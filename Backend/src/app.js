const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const path = require("path")

const app = express()

app.use(express.json())
app.use((req, res, next) => {
    console.log(`[REQ] ${req.method} ${req.url}`);
    next();
})
app.use(cookieParser())
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "http://127.0.0.1:5174"],
    credentials: true
}))

/* Routes */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

/* Status Check */
app.get("/", (req, res) => {
    res.json({ status: "OK", server: "SkillSync Backend", port: 3000 })
})

/* Global Error Handler */
app.use((err, req, res, next) => {
    console.error("💥 GLOBAL ERROR:", err.message)
    console.error(err.stack)
    
    // Log to persistent file for offline debugging
    const fs = require('fs')
    const logEntry = `[${new Date().toISOString()}] SERVER_ERROR: ${err.message}\nSTACK: ${err.stack}\n\n`
    try { fs.appendFileSync(path.join(__dirname, '../backend-debug.log'), logEntry) } catch(e) {}

    res.status(err.status || 500).json({
        message: err.message || "An unexpected error occurred in the SkillSync engine.",
        trace: process.env.NODE_ENV === 'development' ? err.stack : undefined
    })
})

module.exports = app