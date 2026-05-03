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
async function generateWithFallbackDirect(prompt, expectJson = true) {
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

            if (!expectJson) {
                console.log(`✅ Success with model: ${modelName}`);
                return text;
            }

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

async function generateInterviewReport(data) {
    const { resume, selfDescription, jobDescription } = data;
    const prompt = `You are an expert technical interviewer and career coach.
Given the following candidate details and job description, generate a comprehensive interview preparation strategy.

Candidate Resume/Extracted Text:
${resume}

Candidate Self-Description:
${selfDescription}

Job Description:
${jobDescription}

Return ONLY a raw JSON object (no markdown, no backticks). The JSON must EXACTLY match this schema:
{
  "title": "A short, engaging title for this strategy session",
  "matchScore": 85,
  "technicalQuestions": [
    { "question": "...", "intention": "...", "answer": "..." }
  ],
  "behavioralQuestions": [
    { "question": "...", "intention": "...", "answer": "..." }
  ],
  "skillGaps": [
    { "skill": "...", "severity": "low" } // severity must be "low", "medium", or "high"
  ],
  "preparationPlan": [
    { "day": 1, "focus": "...", "tasks": ["...", "..."] }
  ]
}`;

    return await generateWithFallbackDirect(prompt);
}

async function generateResumePdf(data) {
    throw new Error("PDF generation is not implemented yet in the REST version.");
}

async function generateCoachResponse(context, history, userMessage) {
    const { resume, jobDescription } = context;
    
    // Format history for the prompt
    let historyText = "";
    if (history && history.length > 0) {
        historyText = "Chat History:\n" + history.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join("\n") + "\n\n";
    }

    const prompt = `You are a friendly, encouraging, and highly technical AI Career Coach helping a candidate prepare for an interview.
    
Context about the candidate:
Resume/Extracted Text:
${resume}

Job Description:
${jobDescription}

${historyText}
USER: ${userMessage}

Respond directly to the user as the Career Coach. Keep your answer concise, engaging, and highly relevant to their resume and the job description. Do NOT output JSON. Just output the plain text response.`;

    // Use the fallback logic but expect plain text, not JSON
    return await generateWithFallbackDirect(prompt, false);
}

module.exports = {
    generateWithFallback: generateWithFallbackDirect,
    generateInterviewReport,
    generateResumePdf,
    generateCoachResponse
}