import React, { useRef, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { Sparkles, Zap, LogOut, LayoutDashboard, Globe, CheckCircle2, AlertCircle, FileText, ArrowRight, UserCheck, Briefcase, TrendingUp } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useAuth } from '../../auth/hooks/useAuth'
import '../style/landing.scss'

const Landing = () => {
    const { user, handleLogout } = useAuth()
    const container = useRef()
    const navigate = useNavigate()

    const atsScoreRef = useRef(null)
    const interviewScoreRef = useRef(null)
    const metric1Ref = useRef(null)
    const metric2Ref = useRef(null)
    const metric3Ref = useRef(null)

    const TAGLINES = [
        "Skills. Careers. Opportunities.",
        "कौशल। करियर। अवसर।",
        "ଦକ୍ଷତା କ୍ୟାରିୟର ସୁଯୋଗ"
    ]
    const [langIndex, setLangIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setLangIndex((prev) => (prev + 1) % TAGLINES.length)
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 0.8 } })

        // Navbar
        tl.fromTo('.navbar', { y: -20, opacity: 0 }, { y: 0, opacity: 1 })

        // Hero Left
        tl.fromTo('.hero-modern__badge', { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.4')
        tl.fromTo('.hero-modern h1', { y: 30, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.6')
        tl.fromTo('.hero-modern__tagline', { y: 15, opacity: 0, filter: 'blur(5px)' }, { y: 0, opacity: 1, filter: 'blur(0px)' }, '-=0.7')
        tl.fromTo('.hero-modern__description', { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.8')
        tl.fromTo('.hero-modern__actions .button', { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.15 }, '-=0.8')

        // Hero Right Cards
        tl.fromTo('.ai-card--main', { x: 40, opacity: 0, scale: 0.95 }, { x: 0, opacity: 1, scale: 1, duration: 1 }, '-=0.8')
        tl.fromTo('.ai-card--secondary', { x: -30, opacity: 0, scale: 0.95 }, { x: 0, opacity: 1, scale: 1, duration: 1 }, '-=0.6')

        // Floating animation
        gsap.to('.ai-card--main', {
            y: 10,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        })
        gsap.to('.ai-card--secondary', {
            y: -8,
            duration: 2.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        })

        // Number counting animations
        const countUp = (ref, targetValue) => {
            if (ref.current) {
                const obj = { val: 0 };
                gsap.to(obj, {
                    val: targetValue,
                    duration: 2.5,
                    ease: "power2.out",
                    onUpdate: () => {
                        ref.current.innerHTML = Math.round(obj.val) + "%";
                    }
                });
            }
        };

        countUp(atsScoreRef, 92);
        countUp(interviewScoreRef, 86);
        countUp(metric1Ref, 92);
        countUp(metric2Ref, 87);
        countUp(metric3Ref, 86);

    }, { scope: container })

    // Animate tagline changes
    useGSAP(() => {
        gsap.fromTo('.hero-modern__tagline',
            { y: 10, opacity: 0, filter: 'blur(4px)' },
            { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.6, ease: 'power2.out' }
        )
    }, { dependencies: [langIndex], scope: container })

    const onLogout = async () => {
        await handleLogout()
        navigate('/')
    }

    return (
        <div className='landing-page' ref={container}>
            <nav className="navbar">
                <div className="navbar__container">
                    <Link to="/" className="navbar__logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src="/logo.png" alt="NIYUKTI Logo" style={{ width: '45px', height: '45px', objectFit: 'contain' }} />
                        <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>NIYUKTI</span>
                    </Link>

                    {/* Navbar center intentionally left blank to restore original layout */}

                    <div className="navbar__links">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="nav-link">
                                    <LayoutDashboard size={18} />
                                    Dashboard
                                </Link>
                                <button onClick={onLogout} className="button secondary-button button--sm">
                                    <LogOut size={16} />
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="nav-link">Sign In</Link>
                                <Link to="/dashboard" className="button primary-button button--sm">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <section className='hero-modern'>
                <div className="hero-modern__left">
                    <div className="hero-modern__badge">
                        <Sparkles size={14} />
                        <span>AI-POWERED CAREER INTELLIGENCE</span>
                    </div>

                    <h1>
                        Build Your Career.<br />
                        <span className='highlight'>Stand Out. Get Hired.</span>
                    </h1>

                    <div style={{ height: '40px', display: 'flex', alignItems: 'center', margin: '1rem 0 1rem 0' }}>
                        <p key={langIndex} className='hero-modern__tagline' style={{
                            fontSize: '1.2rem',
                            fontWeight: 700,
                            color: '#fff',
                            letterSpacing: '4px',
                            textTransform: 'uppercase',
                            margin: 0
                        }}>
                            {TAGLINES[langIndex]}
                        </p>
                    </div>

                    <p className='hero-modern__description'>
                        NIYUKTI uses AI to analyze your resume, understand job requirements, optimize your ATS profile, and prepare you for the interview ahead.
                    </p>

                    <div className='hero-modern__actions'>
                        <Link to="/dashboard" className='button primary-button'>
                            Build My Resume
                            <ArrowRight size={18} />
                        </Link>
                        <Link to="/dashboard" className='button secondary-button'>
                            Analyze My Resume
                        </Link>
                    </div>
                </div>

                <div className="hero-modern__right">
                    <div className="ai-card ai-card--main glass">
                        <div className="ai-card__header">
                            <FileText size={18} className="text-primary" />
                            <span>AI RESUME ANALYSIS</span>
                        </div>
                        <div className="ai-card__score-row">
                            <div>
                                <span className="label">ATS Compatibility</span>
                                <span className="value text-primary" ref={atsScoreRef}>0%</span>
                            </div>
                            <div className="progress-bar"><div className="progress-fill" style={{ width: '92%' }}></div></div>
                        </div>
                        <div className="ai-card__list">
                            <div className="list-item"><CheckCircle2 size={14} className="text-success" /> Skills Match</div>
                            <div className="list-item"><CheckCircle2 size={14} className="text-success" /> Keywords</div>
                            <div className="list-item"><CheckCircle2 size={14} className="text-success" /> Experience</div>
                            <div className="list-item warning"><AlertCircle size={14} className="text-warning" /> 2 Skills Missing</div>
                        </div>
                    </div>

                    <div className="ai-card ai-card--secondary glass">
                        <div className="ai-card__header">
                            <UserCheck size={16} className="text-cyan" />
                            <span>INTERVIEW READINESS</span>
                        </div>
                        <div className="ai-card__score-row compact">
                            <span className="value text-cyan" ref={interviewScoreRef}>0%</span>
                        </div>
                        <div className="ai-card__stats">
                            <div className="stat"><span>Technical</span> <span>91%</span></div>
                            <div className="stat"><span>Behavioral</span> <span>82%</span></div>
                            <div className="stat"><span>Role Fit</span> <span>88%</span></div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="trust-metrics">
                <div className="trust-metrics__container">
                    <div className="metric-card glass">
                        <span className="metric-value" ref={metric1Ref}>0%</span>
                        <span className="metric-label">ATS SCORE</span>
                    </div>
                    <div className="metric-card glass">
                        <span className="metric-value" ref={metric2Ref}>0%</span>
                        <span className="metric-label">JOB MATCH</span>
                    </div>
                    <div className="metric-card glass">
                        <span className="metric-value" ref={metric3Ref}>0%</span>
                        <span className="metric-label">INTERVIEW READY</span>
                    </div>
                </div>
            </section>

            <section className="product-story">
                <div className="product-story__container">
                    <div className="story-step">
                        <div className="step-number">01</div>
                        <h3>BUILD</h3>
                        <p>Create an ATS-friendly resume tailored to your career goals.</p>
                    </div>
                    <div className="story-step">
                        <div className="step-number">02</div>
                        <h3>ANALYZE</h3>
                        <p>Understand your ATS score, strengths, weaknesses, and missing keywords.</p>
                    </div>
                    <div className="story-step">
                        <div className="step-number">03</div>
                        <h3>MATCH</h3>
                        <p>Compare your profile with real job requirements.</p>
                    </div>
                    <div className="story-step">
                        <div className="step-number">04</div>
                        <h3>PREPARE</h3>
                        <p>Get AI-powered interview questions and preparation strategies.</p>
                    </div>
                    <div className="story-step">
                        <div className="step-number">05</div>
                        <h3>MOVE FORWARD</h3>
                        <p>Apply with confidence and track your career progress.</p>
                    </div>
                </div>
            </section>

            <section className="interview-prep glass">
                <div className="interview-prep__content">
                    <h2>Your Resume Got You In.<br />Now Get Ready.</h2>
                    <p>NIYUKTI analyzes your resume and target job to create a personalized interview strategy based on your skills, gaps, and target role.</p>
                    <Link to="/dashboard" className="button primary-button">
                        Prepare Smarter
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </section>
        </div>
    )
}

export default Landing
