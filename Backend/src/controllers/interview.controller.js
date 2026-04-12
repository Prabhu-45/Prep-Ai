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

module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
}