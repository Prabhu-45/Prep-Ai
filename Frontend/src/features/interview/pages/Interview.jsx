import React, { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router'
import { 
    Code, 
    MessageSquare, 
    Map as MapIcon, 
    Download, 
    ChevronDown, 
    Target, 
    Lightbulb, 
    User, 
    LogOut, 
    Mail, 
    Cpu,
    Bot,
    FileCheck
} from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useAuth } from '../../auth/hooks/useAuth.js'
import CoachChat from '../components/CoachChat.jsx'
import TemplateModal from '../components/TemplateModal.jsx'

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Prep', icon: <Code size={20} /> },
    { id: 'behavioral', label: 'Behavioral Skills', icon: <MessageSquare size={20} /> },
    { id: 'roadmap', label: 'Road Map', icon: <MapIcon size={20} /> },
]

// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [ open, setOpen ] = useState(false)
    return (
        <div className='q-card'>
            <div className='q-card__header' onClick={() => setOpen(o => !o)}>
                <span className='q-card__index'>{index + 1}</span>
                <p className='q-card__question'>{item.question}</p>
                <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                    <ChevronDown size={20} />
                </span>
            </div>
            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--intention'>
                            <Target size={12} />
                            Recruiter Intention
                        </span>
                        <p>{item.intention}</p>
                    </div>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--answer'>
                            <Lightbulb size={12} />
                            Expert Answer Strategy
                        </span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className='roadmap-day'>
        <div className='roadmap-day__badge' />
        <div className='roadmap-day__content'>
            <h3 className='roadmap-day__focus'>Day {day.day}: {day.focus}</h3>
            <ul className='roadmap-day__tasks'>
                {day.tasks.map((task, i) => (
                    <li key={i}>
                        <span className='roadmap-day__bullet' />
                        {task}
                    </li>
                ))}
            </ul>
        </div>
    </div>
)

// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
    const [ activeNav, setActiveNav ] = useState('technical')
    const [ showProfile, setShowProfile ] = useState(false)
    const [ isCoachOpen, setIsCoachOpen ] = useState(false)
    const [ isTemplateModalOpen, setIsTemplateModalOpen ] = useState(false)
    const { report, loading, getResumePdf, downloadInterviewReportPdf } = useInterview()
    const { user, handleLogout } = useAuth()
    const { interviewId } = useParams()
    const navigate = useNavigate()
    const container = useRef()

    useGSAP(() => {
        // Animation fires once per report load
        if (!loading && report && report._id === interviewId) {
            const ctx = gsap.context(() => {
                const tl = gsap.timeline({ 
                    defaults: { ease: 'power3.out', duration: 0.6 }
                })

                tl.to('.interview-layout', { y: 0, opacity: 1, scale: 1, duration: 0.8 })
                  .fromTo('.interview-nav__item', { x: -15, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.08, clearProps: 'all' }, '-=0.4')
                  .fromTo('.interview-content', { opacity: 0, y: 10 }, { opacity: 1, y: 0, clearProps: 'all' }, '-=0.3')
                  .fromTo('.sidebar-content', { opacity: 0 }, { opacity: 1, stagger: 0.1, clearProps: 'all' }, '-=0.3')
            }, container)

            return () => ctx.revert()
        }
    }, { dependencies: [ loading, report, interviewId ] })

    const onLogout = async () => {
        await handleLogout()
        navigate('/')
    }

    const isActuallyLoading = loading || !report || report._id !== interviewId

    if (isActuallyLoading) {
        return (
            <main className='loading-screen'>
                <div className="spinner"></div>
                <h2>Generating Expert Insights...</h2>
            </main>
        )
    }

    const scoreColor =
        report.matchScore >= 80 ? 'score--high' :
            report.matchScore >= 60 ? 'score--mid' : 'score--low'

    return (
        <div className='interview-page' ref={container}>
            
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

            <div className="interview-layout glass" style={{ opacity: 0, transform: 'translateY(15px) scale(0.98)' }}>

                {/* Left Nav */}
                <nav className='interview-nav'>
                    <div className="nav-content">
                        <p className='interview-nav__label'>Sections</p>
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <span className='interview-nav__icon'>{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </div>
                    
                    <div className="nav-actions" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button
                            onClick={() => setIsTemplateModalOpen(true)}
                            className='button ats-button' 
                            style={{ 
                                width: '100%', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                gap: '8px',
                                fontSize: '0.85rem'
                            }}
                        >
                            <FileCheck size={18} />
                            Interactive ATS Resume
                        </button>

                        <button
                            onClick={() => { downloadInterviewReportPdf(report, user) }}
                            className='button primary-button' 
                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        >
                            <Download size={18} />
                            Get PDF Report
                        </button>
                    </div>
                </nav>

                <div className='interview-divider' />

                {/* ── Center Content ── */}
                <main className='interview-content'>
                    {activeNav === 'technical' && (
                        <div className='section-fade-in'>
                            <div className='content-header'>
                                <h2>Technical Deep-Dive</h2>
                                <span className='content-header__count'>{report.technicalQuestions?.length || 0} Questions</span>
                            </div>
                            <div className='q-list'>
                                {report.technicalQuestions?.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </div>
                    )}

                    {activeNav === 'behavioral' && (
                        <div className='section-fade-in'>
                            <div className='content-header'>
                                <h2>Behavioral & Culture</h2>
                                <span className='content-header__count'>{report.behavioralQuestions?.length || 0} Scenarios</span>
                            </div>
                            <div className='q-list'>
                                {report.behavioralQuestions?.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </div>
                    )}

                    {activeNav === 'roadmap' && (
                        <div className='section-fade-in'>
                            <div className='content-header'>
                                <h2>Preparation Roadmap</h2>
                                <span className='content-header__count'>{report.preparationPlan?.length || 0} Days</span>
                            </div>
                            <div className='roadmap-list'>
                                {report.preparationPlan?.map((day) => (
                                    <RoadMapDay key={day.day} day={day} />
                                ))}
                            </div>
                        </div>
                    )}
                </main>

                <div className='interview-divider' />

                {/* Right Sidebar */}
                <aside className='interview-sidebar'>
                    <div className='sidebar-content'>
                        <div className='match-score'>
                            <span className='match-score__label'>Profile Match</span>
                            <div className={`match-score__ring ${scoreColor}`}>
                                <span>{report.matchScore}<small>%</small></span>
                            </div>
                            <p className='highlight' style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                                {report.matchScore >= 80 ? 'Exceptional Fit' : report.matchScore >= 60 ? 'Strong Candidate' : 'Focus on Skill Gaps'}
                            </p>
                        </div>
                    </div>

                    <div className='sidebar-divider' />

                    <div className='sidebar-content'>
                        <div className='skill-gaps'>
                            <span className='skill-gaps__label'>Identified Gaps</span>
                            <div className='skill-gaps__list'>
                                {report.skillGaps?.map((gap, i) => (
                                    <span key={i} className={`skill-tag skill-tag--${gap.severity}`}>
                                        {gap.skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className='sidebar-divider' />

                    <div className='sidebar-content'>
                        <div className='coach-teaser glass' style={{ padding: '1.25rem', borderRadius: '1.25rem', border: '1px solid var(--primary)', background: 'rgba(255, 30, 86, 0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                <Bot size={18} className='text-primary' />
                                <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>AI Career Coach</h4>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>
                                Ask questions about your resume and get on-the-spot advice.
                            </p>
                            <button 
                                className='button' 
                                onClick={() => setIsCoachOpen(true)}
                                style={{ 
                                    width: '100%', 
                                    marginTop: '1rem', 
                                    background: 'var(--primary)', 
                                    color: 'white', 
                                    fontSize: '0.75rem', 
                                    fontWeight: 700,
                                    borderRadius: '10px',
                                    padding: '10px'
                                }}
                            >
                                Open Coach
                            </button>
                        </div>
                    </div>

                </aside>
            </div>

            <CoachChat isOpen={isCoachOpen} onClose={() => setIsCoachOpen(false)} interviewId={interviewId} />
            <TemplateModal isOpen={isTemplateModalOpen} onClose={() => setIsTemplateModalOpen(false)} interviewId={interviewId} />
        </div>
    )
}

export default Interview