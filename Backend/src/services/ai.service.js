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
                        responseMimeType: expectJson ? "application/json" : "text/plain"
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
                
                // 🛡️ Defense: If the model stubbornly returns a JSON string anyway, try to extract the text
                try {
                    const clean = text.replace(/```json|```/g, "").trim();
                    if (clean.startsWith("{") && clean.endsWith("}")) {
                        const parsed = JSON.parse(clean);
                        if (parsed.response) return parsed.response;
                        if (parsed.reply) return parsed.reply;
                        if (parsed.message) return parsed.message;
                    }
                } catch (e) {
                    // Ignore parse errors, it's probably actual plain text
                }
                
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
    const { resume, selfDescription, jobDescription } = data;
    
    console.log("🚀 AI: Generating ATS-optimized HTML resume...");
    const prompt = `You are an expert ATS resume writer. Your task is to transform the candidate's details into a highly professional, perfectly formatted, single-column ATS-friendly resume in HTML.

Candidate Resume / Extracted Text:
${resume}

Candidate Self-Description:
${selfDescription}

Target Job Description:
${jobDescription}

CRITICAL INSTRUCTIONS:
1. You MUST output ONLY raw, valid HTML code. Do NOT wrap the response in markdown blocks (like \`\`\`html). Do NOT include any JSON.
2. Your output MUST start exactly with <!DOCTYPE html> and end with </html>.
3. You MUST use the following CSS structure to ensure perfect alignment and ATS readability:

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
    body { font-family: 'Arial', sans-serif; line-height: 1.4; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { font-size: 24px; text-transform: uppercase; border-bottom: 2px solid #333; margin-bottom: 10px; padding-bottom: 5px; text-align: center; }
    h2 { font-size: 16px; text-transform: uppercase; border-bottom: 1px solid #ccc; margin-top: 20px; margin-bottom: 10px; padding-bottom: 5px; }
    h3 { font-size: 14px; margin: 5px 0; font-weight: bold; }
    p { margin: 5px 0; font-size: 12px; }
    .contact-info { text-align: center; font-size: 12px; margin-bottom: 20px; }
    ul { margin-top: 5px; margin-bottom: 10px; padding-left: 20px; }
    li { font-size: 12px; margin-bottom: 4px; }
    .date-location { float: right; font-weight: normal; font-size: 12px; color: #666; }
    .clear { clear: both; }
</style>
</head>
<body>
    <!-- Fill in the highly optimized, ATS-friendly resume content here using Semantic HTML (h1, h2, h3, p, ul, li) -->
</body>
</html>

4. Make sure to structure the sections typically found in a resume: Professional Summary, Technical Skills, Professional Experience, Projects, and Education.
5. Emphasize keywords from the target job description naturally.
6. Ensure no raw "\\n" text strings appear in the final output; use proper HTML tags instead.`;

    // 1. Generate HTML with AI
    let htmlContent = await generateWithFallbackDirect(prompt, false);
    
    // Clean up if the model wrapped it in markdown code blocks
    htmlContent = htmlContent.replace(/```html|```/g, "").trim();
    if (!htmlContent.toLowerCase().startsWith("<!doctype html>")) {
        htmlContent = "<!DOCTYPE html><html><body>" + htmlContent + "</body></html>";
    }

    // 2. Render to PDF with Puppeteer
    console.log("📄 PDF: Rendering HTML to PDF buffer with Puppeteer...");
    const puppeteer = require("puppeteer");
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
        });
        
        console.log("✅ PDF: Successfully generated ATS Resume PDF.");
        return pdfBuffer;
    } finally {
        await browser.close();
    }
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

/**
 * @description Rewrite a specific resume bullet point using Native Gemini (bypassing OpenRouter free tier)
 */
async function rewriteResumeBullet(bullet, jobDescription) {
    const prompt = `You are an expert resume writer. The user is applying for a job with this description:
"${jobDescription}"

Rewrite the following resume bullet point to be more impactful, using the STAR method (Situation, Task, Action, Result) if possible. Incorporate keywords from the job description naturally.
Keep it to a single, concise sentence. Do NOT output your thought process. Do NOT output any conversational text. Return ONLY the final rewritten bullet point.
Original Bullet: "${bullet}"`;

    try {
        console.log("🚀 AI: Rewriting bullet point via Gemini...");
        // Use the native fallback direct method with expectJson = false
        const rewrittenText = await generateWithFallbackDirect(prompt, false);
        return rewrittenText.trim();
    } catch (err) {
        console.error("❌ Rewrite Bullet Error:", err.message);
        throw new Error("Failed to rewrite bullet using AI");
    }
}

/**
 * @description Renders a raw HTML string into a PDF buffer using Puppeteer.
 */
async function renderHtmlToPdf(htmlContent) {
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({ 
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    
    try {
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
        });
        
        return pdfBuffer;
    } finally {
        await browser.close();
    }
}

/**
 * @description Extracts structured JSON from a LinkedIn PDF text dump using OpenRouter
 */
async function parseLinkedinProfile(text) {
    const prompt = `You are an expert ATS resume parser. I will provide you with raw text extracted from a LinkedIn PDF profile. 
Your task is to extract this information and return it strictly as a JSON object matching this schema:
{
  "personalInfo": {
    "fullName": "Name",
    "email": "Email if found",
    "mobile": "Phone if found",
    "location": "Location if found",
    "linkedin": "LinkedIn URL if found",
    "github": "Github if found",
    "targetJobTitle": "Current or target title"
  },
  "summary": "Professional summary paragraph",
  "education": [{ "id": 1, "institution": "", "degree": "", "location": "", "startDate": "", "endDate": "", "score": "" }],
  "experience": [{ "id": 1, "role": "", "company": "", "duration": "", "bullets": ["string"] }],
  "skills": [{ "id": 1, "category": "General", "text": "Comma separated skills" }]
}

IMPORTANT:
- Return ONLY valid JSON.
- DO NOT wrap the output in markdown blocks like \`\`\`json. Just return the raw JSON string.

Raw LinkedIn Text:
${text.substring(0, 8000)}`;

    try {
        const apiKey = process.env.OPENROUTER_API_KEY || process.env.NVIDIA_API_KEY;
        if (!apiKey) throw new Error("API key is missing");
        
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "nvidia/nemotron-3-nano-30b-a3b:free",
                messages: [{ role: "user", content: prompt }],
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'HTTP-Referer': 'http://localhost:5174',
                    'Content-Type': 'application/json'
                }
            }
        );

        let jsonString = response.data.choices[0].message.content.trim();
        if (jsonString.startsWith('\`\`\`json')) {
            jsonString = jsonString.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '').trim();
        }
        
        return JSON.parse(jsonString);
    } catch (err) {
        console.error("❌ LinkedIn Parsing Error:", err.message);
        throw new Error("Failed to parse LinkedIn profile");
    }
}

module.exports = {
    generateWithFallback: generateWithFallbackDirect,
    generateInterviewReport,
    generateResumePdf,
    generateCoachResponse,
    rewriteResumeBullet,
    renderHtmlToPdf,
    parseLinkedinProfile
}