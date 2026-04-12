const mongoose = require("mongoose")

/**
 * @name connectToDB
 * @description Establishes connection to MongoDB Atlas with strict error handling.
 */
async function connectToDB() {
    // Add connection options for better resilience in development
    const options = {
        serverSelectionTimeoutMS: 5000, // Fail fast (5s) instead of default (30s)
        socketTimeoutMS: 45000,         // Close sockets after 45s of inactivity
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, options)
        console.log("✅ DATABASE: Connection established successfully.")
    } catch (err) {
        console.error("❌ DATABASE CONNECTION ERROR:", err.message)
        // Re-throw so the bootstrap process knows it failed
        throw err 
    }
}

module.exports = connectToDB