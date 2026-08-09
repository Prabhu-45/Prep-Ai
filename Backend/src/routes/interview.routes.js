const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")

const interviewRouter = express.Router()



/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description,resume pdf and job description.
 * @access private
 */
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterViewReportController)

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId.
 * @access private
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController)


/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController)


/**
 * @route GET /api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController)
/**
 * @route POST /api/interview/chat/:interviewId
 * @description Chat with the AI Career Coach.
 * @access private
 */
interviewRouter.post("/chat/:interviewId", authMiddleware.authUser, interviewController.chatWithCoachController)

/**
 * @route POST /api/interview/resume/rewrite/:interviewId
 * @description Rewrite a resume bullet point using NVIDIA API.
 * @access private
 */
interviewRouter.post("/resume/rewrite/:interviewId", authMiddleware.authUser, interviewController.rewriteResumeBulletController)

/**
 * @route POST /api/interview/resume/render-pdf
 * @description Render HTML to PDF buffer.
 * @access private
 */
interviewRouter.post("/resume/render-pdf", authMiddleware.authUser, interviewController.renderHtmlToPdfController)

/**
 * @route POST /api/interview/resume/parse-linkedin
 * @description Parse a LinkedIn PDF and return a structured JSON resume.
 * @access private
 */
interviewRouter.post("/resume/parse-linkedin", authMiddleware.authUser, upload.single("linkedinPdf"), interviewController.parseLinkedinPdfController)

/**
 * @route POST /api/interview/hr/scan
 * @description Processes up to 5 resumes against a JD for the HR dashboard.
 * @access private
 */
interviewRouter.post("/hr/scan", authMiddleware.authUser, upload.array("resumes", 5), interviewController.bulkResumeScanController)

module.exports = interviewRouter