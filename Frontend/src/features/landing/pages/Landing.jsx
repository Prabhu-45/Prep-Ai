import React, { useRef } from 'react'
import { Link, useNavigate } from 'react-router'
import { Sparkles, Target, Zap, Shield, ChevronDown, Cpu, LogOut, LayoutDashboard } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useAuth } from '../../auth/hooks/useAuth'
import '../style/landing.scss'

const Landing = () => {
    const { user, handleLogout } = useAuth()
    const container = useRef()
    const heroRef = useRef()
    const navigate = useNavigate()

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 0.8 } })

        tl.fromTo('.navbar', { y: -20, opacity: 0 }, { y: 0, opacity: 1 })
            .fromTo('.hero__badge', { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.4')
            .fromTo('.hero h1 span', { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.2 }, '-=0.6')
            .fromTo('.hero__description', { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.8')
            .fromTo('.hero__actions .button', { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.15 }, '-=0.8')

        // Scroll indicator animation
        gsap.to('.scroll-indicator', {
            y: 10,
            opacity: 0.4,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        })

        // Floating blobs animation
        gsap.to('.blob--1', {
            x: '10%',
            y: '10%',
            duration: 10,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        })
        gsap.to('.blob--2', {
            x: '-10%',
            y: '-10%',
            duration: 12,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        })
    }, { scope: container })

    const onLogout = async () => {
        await handleLogout()
        navigate('/')
    }

    return (
        <div className='landing-page' ref={container}>
            <div className="blob blob--1"></div>
            <div className="blob blob--2"></div>

            <nav className="navbar">
                <div className="navbar__container">
                    <Link to="/" className="navbar__logo">
                        <Cpu size={24} />
                        <span>Prep-AI</span>
                    </Link>
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
                                <Link to="/register" className="nav-link">Sign Up</Link>
                                <Link to="/dashboard" className="button primary-button button--sm">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <section className='hero' ref={heroRef}>
                <div className="hero__badge">
                    <Sparkles size={14} />
                    <span>AI-Powered Interview Intelligence</span>
                </div>

                <h1>
                    <span>Master Your Next</span>
                    <span className='highlight'>Technical Interview</span>
                </h1>

                <p className='hero__description'>
                    Prep-AI uses advanced AI to analyze your resume and job requirements,
                    generating hyper-specific interview strategies and preparation roadmaps.
                </p>

                <div className='hero__actions'>
                    {user ? (
                        <Link to="/dashboard" className='button primary-button'>
                            Go to Dashboard
                            <Zap size={18} fill="currentColor" />
                        </Link>
                    ) : (
                        <>
                            <Link to="/dashboard" className='button primary-button'>
                                Get Started Free
                                <Zap size={18} fill="currentColor" />
                            </Link>
                            <Link to="/login" className='button secondary-button'>
                                Sign In
                            </Link>
                        </>
                    )}
                </div>

                <div className="scroll-indicator">
                    <ChevronDown size={28} />
                </div>
            </section>

            <section className='features'>
                <div className="feature-card glass">
                    <div className="feature-card__icon">
                        <Target size={24} />
                    </div>
                    <h3>Smart Analysis</h3>
                    <p>Our AI analyzes your resume and job description to identify the exact technical and behavioral gaps you need to bridge.</p>
                </div>

                <div className="feature-card glass">
                    <div className="feature-card__icon">
                        <Zap size={24} />
                    </div>
                    <h3>Precision Roadmap</h3>
                    <p>Get a custom-tailored 5-day preparation plan with specific focus areas and tasks designed to maximize your impact.</p>
                </div>

                <div className="feature-card glass">
                    <div className="feature-card__icon">
                        <Shield size={24} />
                    </div>
                    <h3>Expert Insights</h3>
                    <p>Gain insights into recruiter intentions with model answers and proven strategies for complex technical questions.</p>
                </div>
            </section>
        </div>
    )
}

export default Landing
