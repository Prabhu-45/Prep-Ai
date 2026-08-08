import axios from "axios";

const api = axios.create({
    baseURL: "",
    withCredentials: true,
})


/**
 * @description Service to generate interview report based on user self description, resume and job description.
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {

    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)
    formData.append("resume", resumeFile)

    const response = await api.post("/api/interview/", formData)

    return response.data

}


/**
 * @description Service to get interview report by interviewId.
 */
export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`)

    return response.data
}


/**
 * @description Service to get all interview reports of logged in user.
 */
export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/")

    return response.data
}


/**
 * @description Service to generate resume pdf based on user self description, resume content and job description.
 */
export const generateResumePdf = async ({ interviewReportId }) => {
    const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
        responseType: "blob"
    })

    return response.data
}

/**
 * @description Service to chat with the AI career coach
 */
export const chatWithCoach = async (interviewId, message, history) => {
    const response = await api.post(`/api/interview/chat/${interviewId}`, {
        message,
        history
    })

    return response.data
}

/**
 * @description Service to rewrite a resume bullet point using NVIDIA API
 */
export const rewriteResumeBullet = async (interviewId, bullet) => {
    const response = await api.post(`/api/interview/resume/rewrite/${interviewId}`, {
        bullet
    })
    return response.data
}

/**
 * @description Service to render HTML to PDF buffer
 */
export const renderHtmlToPdf = async (html) => {
    const response = await api.post(`/api/interview/resume/render-pdf`, { html }, {
        responseType: "blob"
    })
    return response.data
}

/**
 * @description Service to parse a LinkedIn PDF
 */
export const parseLinkedinPdf = async (pdfFile) => {
    const formData = new FormData();
    formData.append("linkedinPdf", pdfFile);
    const response = await api.post(`/api/interview/resume/parse-linkedin`, formData);
    return response.data;
}