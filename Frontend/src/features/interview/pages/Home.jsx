import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router'
import {
    FileText,
    Upload,
    Zap,
    User,
    Briefcase,
    Info,
    Calendar,
    ChevronRight,
    CheckCircle2,
    LogOut,
    Mail,
    Cpu,
    ChevronDown
} from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useAuth } from '../../auth/hooks/useAuth.js'
import AuroraBackground from '../components/AuroraBackground'

const Home = () => {
    const { loading, generateReport, reports, getReports } = useInterview()
    const { user, handleLogout } = useAuth()
    const [showProfile, setShowProfile] = useState(false)
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [selectedFile, setSelectedFile] = useState(null)
    const [error, setError] = useState("")
    const resumeInputRef = useRef()
    const container = useRef()
    const navigate = useNavigate()

    useEffect(() => {
        getReports()
    }, [])

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

        tl.from('.dashboard-nav', { y: -20, opacity: 0, duration: 0.8 })
            .from('.page-header h1', { y: 20, opacity: 0, duration: 0.8 }, '-=0.4')
            .from('.page-header p', { y: 15, opacity: 0, duration: 0.8 }, '-=0.6')
            .from('.interview-card', { y: 40, opacity: 0, duration: 1 }, '-=0.5')
            .from('.recent-reports h2', { x: -20, opacity: 0, duration: 0.6 }, '-=0.4')
            .from('.report-item', {
                y: 20,
                opacity: 0,
                stagger: 0.1,
                duration: 0.6
            }, '-=0.3')
    }, { scope: container })

    const onLogout = async () => {
        await handleLogout()
        navigate('/')
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedFile(file)
            setError("")
        }
    }

    const handleGenerateReport = async () => {
        setError("")

        if (!jobDescription || jobDescription.trim().length < 50) {
            setError("Please provide a more detailed Job Description (min 50 chars).")
            return
        }

        const resumeFile = resumeInputRef.current.files[0]
        if (!resumeFile && !selfDescription.trim()) {
            setError("Please either upload a Resume or provide a Quick Self-Description.")
            return
        }

        try {
            const data = await generateReport({
                jobDescription,
                selfDescription,
                resumeFile
            })

            if (data && data._id) {
                navigate(`/interview/${data._id}`)
            } else {
                setError("Failed to generate report. Please check your inputs and try again.")
            }
        } catch (err) {
            console.error("Generate Report Error:", err)
            const backendMessage = err.response?.data?.message
            setError(backendMessage || "A server error occurred. Please try again.")
        }
    }

    return (
        <div className='home-page' ref={container}>
            <AuroraBackground />

            {/* Dashboard Navigation */}
            <nav className='dashboard-nav glass'>
                <div className='dashboard-nav__container'>
                    <div className='dashboard-nav__logo' onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src="/logo.png" alt="NIYUKTI Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                        <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>NIYUKTI</span>
                    </div>

                    <div className='dashboard-nav__profile'>
                        <button
                            className={`profile-trigger ${showProfile ? 'active' : ''}`}
                            onClick={() => setShowProfile(!showProfile)}
                        >
                            <div className='avatar'>
                                <User size={18} />
                            </div>
                            <span className='username'>{user?.username || 'User'}</span>
                            <ChevronDown size={14} className={`arrow ${showProfile ? 'rotate' : ''}`} />
                        </button>

                        {showProfile && (
                            <div className='profile-card glass'>
                                <div className='profile-card__info'>
                                    <div className='info-item'>
                                        <User size={14} className='icon-dim' />
                                        <span>{user?.username}</span>
                                    </div>
                                    <div className='info-item'>
                                        <Mail size={14} className='icon-dim' />
                                        <span>{user?.email}</span>
                                    </div>
                                </div>
                                <div className='profile-card__divider' />
                                <button onClick={onLogout} className='signout-btn'>
                                    <LogOut size={16} />
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Page Header */}
            <header className='page-header'>
                <h1>Create Your Custom <span className='highlight'>Interview Plan</span></h1>
                <p>Let our AI analyze job requirements and your unique profile to build a winning strategy.</p>
            </header>

            {/* Main Card */}
            <div className='interview-card glass'>
                <div className='interview-card__body'>

                    {/* Left Panel - Job Description */}
                    <div className='panel panel--left'>
                        <div className='panel__header'>
                            <span className='panel__icon'><Briefcase size={20} /></span>
                            <h2>Target Job Description</h2>
                            <span className='badge badge--required'>Required</span>
                        </div>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => { setJobDescription(e.target.value) }}
                            className='panel__textarea'
                            placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript...'`}
                            maxLength={5000}
                        />
                        <div className='char-counter'>{jobDescription.length} / 5000 chars</div>
                    </div>

                    <div className='panel-divider' />

                    {/* Right Panel - Profile */}
                    <div className='panel panel--right'>
                        <div className='panel__header'>
                            <span className='panel__icon'><User size={20} /></span>
                            <h2>Your Profile</h2>
                        </div>

                        {/* Upload Resume */}
                        <div className='upload-section'>
                            <label className='section-label'>
                                <FileText size={16} className="highlight" />
                                Upload Resume
                                <span className='badge badge--best'>Best Results</span>
                            </label>
                            <label className={`dropzone ${selectedFile ? 'dropzone--selected' : ''}`} htmlFor='resume'>
                                <span className='dropzone__icon'>
                                    {selectedFile ? <CheckCircle2 size={32} color="var(--primary)" /> : <Upload size={32} />}
                                </span>
                                <p className='dropzone__title'>
                                    {selectedFile ? selectedFile.name : 'Click to upload or drag & drop'}
                                </p>
                                <p className='dropzone__subtitle'>
                                    {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'PDF or DOCX (Max 5MB)'}
                                </p>
                                <input
                                    ref={resumeInputRef}
                                    onChange={handleFileChange}
                                    hidden
                                    type='file'
                                    id='resume'
                                    name='resume'
                                    accept='.pdf,.docx'
                                />
                            </label>
                        </div>

                        <div className='or-divider'><span>OR</span></div>

                        {/* Quick Self-Description */}
                        <div className='self-description'>
                            <label className='section-label' htmlFor='selfDescription'>
                                <FileText size={16} />
                                Quick Self-Description
                            </label>
                            <textarea
                                value={selfDescription}
                                onChange={(e) => { setSelfDescription(e.target.value) }}
                                id='selfDescription'
                                name='selfDescription'
                                className='panel__textarea'
                                style={{ height: '120px' }}
                                placeholder="Describe your experience, key skills, and role goals..."
                            />
                        </div>

                        {/* Error/Info Box */}
                        <div className={`info-box ${error ? 'info-box--error' : ''}`}>
                            <span className='info-box__icon'><Info size={18} /></span>
                            <p>{error || "A Resume or Self Description is required for a personalized plan."}</p>
                        </div>
                    </div>
                </div>

                {/* Card Footer */}
                <div className='interview-card__footer'>
                    <span className='footer-info'>
                        <Zap size={14} fill="currentColor" style={{ marginRight: '6px' }} />
                        AI Analysis &bull; Approx 60s
                    </span>
                    <button
                        onClick={handleGenerateReport}
                        disabled={loading}
                        className='generate-btn'>
                        {loading ? <span className="spinner"></span> : <Zap size={18} fill="currentColor" />}
                        {loading ? "Analyzing Profile..." : "Generate My Strategy"}
                    </button>
                </div>
            </div>

            {/* Recent Reports List */}
            {reports && reports.length > 0 && (
                <section className='recent-reports'>
                    <h2>Recent Interview Plans</h2>
                    <ul className='reports-list'>
                        {reports.map(report => (
                            <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                                <h3>{report.title || 'Untitled Position'}</h3>
                                <div className='report-meta'>
                                    <Calendar size={12} />
                                    {new Date(report.createdAt).toLocaleDateString()}
                                </div>
                                <div className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>
                                    Score: {report.matchScore}%
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Page Footer */}
            <footer className='page-footer' style={{ marginTop: 'auto', padding: '4rem 0', display: 'flex', gap: '2rem', justifyContent: 'center', opacity: 0.5 }}>
                <a href='#' style={{ textDecoration: 'none', color: 'inherit', fontSize: '0.85rem' }}>Privacy Policy</a>
                <a href='#' style={{ textDecoration: 'none', color: 'inherit', fontSize: '0.85rem' }}>Terms of Service</a>
                <a href='#' style={{ textDecoration: 'none', color: 'inherit', fontSize: '0.85rem' }}>Help Center</a>
            </footer>
        </div>
    )
}

export default Home