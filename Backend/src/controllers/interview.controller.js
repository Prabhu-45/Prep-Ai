const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

/**
 * @name generateInterViewReportController
 * @description Controller to generate interview report based on profile and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        const { selfDescription, jobDescription } = req.body

        if (!jobDescription || jobDescription.trim().length === 0) {
            return res.status(400).json({
                message: "Job description is required to generate a plan."
            })
        }

        let resumeText = ""

        // Process PDF if file exists
        if (req.file) {
            try {
                console.log(`📄 PDF: Processing '${req.file.originalname}' (${(req.file.size / 1024).toFixed(2)} KB)...`)

                let extracted = ""
                try {
                    // Modern pdf-parse usage often requires Uint8Array
                    const pdfData = new Uint8Array(req.file.buffer)
                    const parser = new pdfParse.PDFParse(pdfData)
                    const result = await parser.getText()
                    extracted = (typeof result === 'string') ? result : (result.text || "")
                } catch (pdfErr) {
                    console.warn("⚠️ PDF: Advanced parser failed, trying legacy fallback...", pdfErr.message)
                    // Fallback to simple string extraction if the binary parser fails
                    extracted = req.file.buffer.toString('utf-8').replace(/[^\x20-\x7E\n]/g, '')
                }

                resumeText = extracted.trim()

                if (!resumeText || resumeText.length < 10) {
                    throw new Error("No readable text found in PDF.")
                }

                console.log(`✅ PDF: Extracted ${resumeText.length} characters.`)
            } catch (err) {
                console.error("❌ PDF Parse Critical Failure:", err.message)
                return res.status(422).json({
                    message: `We encountered a problem reading your PDF: ${err.message}. Please copy-paste the text manually into 'Self Description'.`
                })
            }
        }

        // Final content check
        if (!resumeText.trim() && (!selfDescription || selfDescription.trim() === "")) {
            return res.status(400).json({
                message: "Please provide either a Resume or a Self Description so I can generate your strategy."
            })
        }

        // Call AI Service
        console.log(`🚀 AI: Generating report for User [${req.user.id}]...`)
        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription: selfDescription || "",
            jobDescription
        })

        // Senior Dev Check: Ensure 'title' is present since schema requires it
        const reportData = {
            user: req.user.id,
            resume: resumeText,
            selfDescription: selfDescription || "",
            jobDescription,
            title: interViewReportByAi.title || "Interview Strategy",
            matchScore: interViewReportByAi.matchScore || 0,
            technicalQuestions: interViewReportByAi.technicalQuestions || [],
            behavioralQuestions: interViewReportByAi.behavioralQuestions || [],
            skillGaps: interViewReportByAi.skillGaps || [],
            preparationPlan: interViewReportByAi.preparationPlan || []
        }

        // Create Report
        const interviewReport = await interviewReportModel.create(reportData)

        console.log(`✅ Success: Interview report [${interviewReport._id}] created.`)

        res.status(201).json({
            message: "Success! Your interview strategy is ready.",
            interviewReport
        })

    } catch (err) {
        console.error("💥 Critical Failure in Interview Controller:", err)

        // Return a clean error to the frontend
        res.status(err.status || 500).json({
            message: "I encountered a problem while generating your strategy. This usually happens if the AI is busy or the resume content is too complex. Please try again in a moment."
        })
    }
}

/**
 * @name getInterviewReportByIdController
 */
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params
        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found." })
        }

        res.status(200).json({ interviewReport })
    } catch (err) {
        res.status(500).json({ message: "Error fetching report." })
    }
}


/** 
 * @name getAllInterviewReportsController
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

        res.status(200).json({ interviewReports })
    } catch (err) {
        res.status(500).json({ message: "Error listing reports." })
    }
}


/**
 * @name generateResumePdfController
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params
        const interviewReport = await interviewReportModel.findOne({ _id: interviewReportId, user: req.user.id })

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found." })
        }

        const { resume, jobDescription, selfDescription } = interviewReport
        const pdfBuffer = await generateResumePdf({
            resume: resume || "",
            jobDescription: jobDescription || "",
            selfDescription: selfDescription || ""
        })

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        })

        res.send(pdfBuffer)
    } catch (err) {
        console.error("PDF Resume Controller Error:", err)
        res.status(500).json({ message: "Error generating resume PDF." })
    }
}

/**
 * @name chatWithCoachController
 */
async function chatWithCoachController(req, res) {
    try {
        const { interviewId } = req.params;
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id });

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview context not found." });
        }

        const context = {
            resume: interviewReport.resume,
            jobDescription: interviewReport.jobDescription
        };

        const aiService = require("../services/ai.service");
        const reply = await aiService.generateCoachResponse(context, history, message);

        res.status(200).json({ reply });
    } catch (err) {
        console.error("Coach Chat Error:", err);
        res.status(500).json({ message: "Failed to get response from Coach" });
    }
}

/**
 * @name rewriteResumeBulletController
 */
async function rewriteResumeBulletController(req, res) {
    try {
        const { interviewId } = req.params;
        const { bullet } = req.body;

        if (!bullet) {
            return res.status(400).json({ message: "Bullet point text is required" });
        }

        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id });
        if (!interviewReport) {
            return res.status(404).json({ message: "Interview context not found." });
        }

        const aiService = require("../services/ai.service");
        const rewritten = await aiService.rewriteResumeBullet(bullet, interviewReport.jobDescription);

        res.status(200).json({ rewritten });
    } catch (err) {
        console.error("Rewrite Bullet Error:", err);
        res.status(500).json({ message: "Failed to rewrite bullet point" });
    }
}

/**
 * @name renderHtmlToPdfController
 */
async function renderHtmlToPdfController(req, res) {
    try {
        const { html } = req.body;
        if (!html) {
            return res.status(400).json({ message: "HTML content is required" });
        }

        const aiService = require("../services/ai.service");
        const pdfBuffer = await aiService.renderHtmlToPdf(html);

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume.pdf`
        });

        res.send(pdfBuffer);
    } catch (err) {
        console.error("HTML to PDF Error:", err);
        res.status(500).json({ message: "Failed to render PDF." });
    }
}

/**
 * @name bulkResumeScanController
 * @description Processes up to 5 resumes against a JD for the HR dashboard
 */
async function bulkResumeScanController(req, res) {
    try {
        const { jobDescription } = req.body;
        const files = req.files;

        if (!jobDescription) {
            return res.status(400).json({ message: "Job Description is required" });
        }

        if (!files || files.length === 0) {
            return res.status(400).json({ message: "At least one resume must be uploaded" });
        }

        if (files.length > 5) {
            return res.status(400).json({ message: "Maximum 5 resumes allowed per scan" });
        }

        const aiService = require("../services/ai.service");
        
        // Process each file sequentially to avoid AI rate limits (429 Too Many Requests)
        const results = [];
        for (const file of files) {
            let resumeText = "";
            try {
                const pdfData = new Uint8Array(file.buffer);
                const parser = new pdfParse.PDFParse(pdfData);
                const result = await parser.getText();
                resumeText = (typeof result === 'string') ? result : (result.text || "");
            } catch (err) {
                console.error("Failed to parse PDF:", file.originalname, err);
                results.push({ name: file.originalname, matchScore: 0, strengths: [], weaknesses: ["Failed to read PDF format"], summary: "Error reading file." });
                continue;
            }

            const aiResult = await aiService.generateBulkResumeScore(jobDescription, resumeText, file.originalname);
            results.push(aiResult);
            
            // Add a small 1-second delay between requests to be safe with free tier APIs
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Sort results descending by score
        results.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

        res.status(200).json({ success: true, results });
    } catch (err) {
        console.error("Bulk Resume Scan Error:", err);
        res.status(500).json({ message: "Failed to process bulk scan." });
    }
}

/**
 * @name parseLinkedinPdfController
 */
async function parseLinkedinPdfController(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No LinkedIn PDF uploaded" });
        }

        const aiService = require("../services/ai.service");
        
        let extracted = "";
        try {
            const pdfData = new Uint8Array(req.file.buffer);
            const parser = new pdfParse.PDFParse(pdfData);
            const result = await parser.getText();
            extracted = (typeof result === 'string') ? result : (result.text || "");
        } catch (pdfErr) {
            extracted = req.file.buffer.toString('utf-8').replace(/[^\x20-\x7E\n]/g, '');
        }

        if (!extracted || extracted.trim().length < 10) {
            return res.status(400).json({ message: "Could not read text from the uploaded PDF" });
        }

        const structuredData = await aiService.parseLinkedinProfile(extracted);
        res.status(200).json(structuredData);

    } catch (err) {
        console.error("LinkedIn Parse Error:", err);
        res.status(500).json({ message: "Failed to parse LinkedIn profile" });
    }
}

module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController,
    chatWithCoachController,
    rewriteResumeBulletController,
    renderHtmlToPdfController,
    parseLinkedinPdfController,
    bulkResumeScanController
}