import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf, rewriteResumeBullet, renderHtmlToPdf, parseLinkedinPdf } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const handleGenerateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        try {
            const data = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            if (data && data.interviewReport) {
                setReport(data.interviewReport)
                return data.interviewReport
            }
            return null
        } catch (error) {
            console.error("Generate report error:", error)
            throw error // Let the UI handle the error or show it
        } finally {
            setLoading(false)
        }
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        try {
            const data = await getInterviewReportById(interviewId)
            if (data && data.interviewReport) {
                setReport(data.interviewReport)
                return data.interviewReport
            }
            return null
        } catch (error) {
            console.error("Get report by ID error:", error)
            return null
        } finally {
            setLoading(false)
        }
    }

    const getReports = async () => {
        setLoading(true)
        try {
            const data = await getAllInterviewReports()
            if (data && data.interviewReports) {
                setReports(data.interviewReports)
                return data.interviewReports
            }
            return []
        } catch (error) {
            console.error("Get all reports error:", error)
            return []
        } finally {
            setLoading(false)
        }
    }

    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        try {
            const blob = await generateResumePdf({ interviewReportId })

            // 🛡️ Defense: Validate if it's actually a PDF
            if (blob.type !== 'application/pdf') {
                // If it's not a PDF, it's likely a JSON error blob
                const text = await blob.text()
                const error = JSON.parse(text)
                throw new Error(error.message || "Failed to generate valid PDF")
            }

            const url = window.URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `PrepAI_Report_${interviewReportId.slice(-6)}.pdf`)
            document.body.appendChild(link)
            link.click()

            // Cleanup
            window.URL.revokeObjectURL(url)
            document.body.removeChild(link)
        }
        catch (error) {
            console.error("❌ PDF Handle Failure:", error.message)
            alert(`Download Failed: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (interviewId) {
            // 🛡️ Smart Guard: Only fetch if we don't already have this report
            if (!report || report._id !== interviewId) {
                getReportById(interviewId)
            }
        } else {
            getReports()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interviewId, report?._id]) // Dependency on report._id ensures stability

    const handleParseLinkedinPdf = async (pdfFile) => {
        setLoading(true)
        try {
            const data = await parseLinkedinPdf(pdfFile)
            return data
        } catch (error) {
            console.error("Parse LinkedIn Error:", error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    return {
        loading,
        report,
        reports,
        generateReport: handleGenerateReport,
        getReportById,
        getReports,
        getResumePdf,
        rewriteResumeBullet,
        renderHtmlToPdf,
        handleParseLinkedinPdf
    }

}