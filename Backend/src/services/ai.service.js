const axios = require("axios")
require("dotenv").config()

// Senior Dev Strategy: Direct-to-Gemini REST API (Bypassing broken SDK)
const API_KEY = process.env.GOOGLE_GENAI_API_KEY
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models"

/**
 * @description Extracts text from a raw Gemini REST response
 */
function extractTextFromRESTResponse(res) {
    try {
        return res.candidates?.[0]?.content?.parts?.[0]?.text || null
    } catch (e) {
        return null
    }
}

/**
 * @description DIRECT REST interface with self-healing fallback
 */
async function generateWithFallbackDirect(prompt) {
    // List of models verified available in 2026-04-07
    const models = [
        "gemini-3.1-flash-live-preview",
        "gemini-2.5-flash",
        "gemini-1.5-flash",
        "gemini-pro"
    ]

    let lastError = null

    for (const modelName of models) {
        try {
            console.log(`🚀 AI [REST]: Attempting '${modelName}'...`)

            const response = await axios.post(
                `${BASE_URL}/${modelName}:generateContent?key=${API_KEY}`,
                {
                    contents: [{
                        parts: [{ text: prompt }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        responseMimeType: "application/json"
                    }
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 45000 // Resume/Interview logic can take time
                }
            )

            const text = extractTextFromRESTResponse(response.data)
            if (!text) throw new Error("Empty response from Gemini")

            // Clean JSON
            const cleanJson = text.replace(/```json|```/g, "").trim()
            const parsedData = JSON.parse(cleanJson)

            // Essential schema fields for database integrity
            if (!parsedData.title) parsedData.title = "Direct AI Strategy Session"
            if (!parsedData.matchScore) parsedData.matchScore = 0

            console.log(`✅ Success with model: ${modelName}`)
            return parsedData

        } catch (err) {
            const apiError = err.response?.data?.error?.message || err.message
            console.error(`⚠️ ${modelName} Failed:`, apiError)
            lastError = err
        }
    }

    throw new Error(`AI Generation Failed: ${lastError?.response?.data?.error?.message || lastError?.message}`)
}

module.exports = {
    generateWithFallback: generateWithFallbackDirect
}