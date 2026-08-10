import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router'
import { UserPlus, Mail, Lock, User, Briefcase, Building } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useAuth } from '../hooks/useAuth'
import "../auth.form.scss"
import AuthBackground from '../components/AuthBackground'

const Register = () => {
    const { handleRegister, user } = useAuth()
    const navigate = useNavigate()
    const container = useRef()

    const [ username, setUsername ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ role, setRole ] = useState("student")
    const [ submitting, setSubmitting ] = useState(false)
    const [ error, setError ] = useState("")

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

        tl.from('.form-card', {
            y: 50,
            opacity: 0,
            duration: 1,
            scale: 0.95
        })
        .from('.form-card__header h1, .form-card__header p', {
            y: 20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1
        }, "-=0.5")
        .from('.input-group', {
            x: -20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1
        }, "-=0.6")
        .from('.role-selector', {
            y: 20,
            opacity: 0,
            duration: 0.8
        }, "-=0.4")
        .from('.form-card__footer', {
            opacity: 0,
            duration: 0.8
        }, "-=0.4");
    }, { scope: container })

    useEffect(() => {
        if (user) {
            if (user.role === 'hr') {
                navigate('/hr-dashboard')
            } else {
                navigate('/dashboard')
            }
        }
    }, [ user, navigate ])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSubmitting(true)
        const response = await handleRegister({ username, email, password, role })
        if (response && !response.success) {
            setError(response.message)
        }
        setSubmitting(false)
    }

    return (
        <main className='auth-container' ref={container}>
            <AuthBackground />

            <div className="form-card glass">
                <div className="form-card__header">
                    <h1>Create Account</h1>
                    <p>Start your journey to interview success.</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Full Name</label>
                        <input
                            onChange={(e) => { setUsername(e.target.value) }}
                            type="text" 
                            id="username" 
                            name='username' 
                            placeholder='John Doe' 
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email" 
                            id="email" 
                            name='email' 
                            placeholder='name@company.com' 
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <Lock size={18} className='input-icon' />
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password" 
                            id="password" 
                            name='password' 
                            placeholder='Create a password' 
                            required 
                        />
                    </div>

                    <div className="role-selector" style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
                        <div 
                            className={`role-card ${role === 'student' ? 'active' : ''}`}
                            onClick={() => setRole('student')}
                            style={{ flex: 1, padding: '1rem', borderRadius: '12px', background: role === 'student' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', border: `1px solid ${role === 'student' ? 'var(--primary)' : 'var(--border)'}`, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', transition: 'all 0.3s' }}
                        >
                            <User size={24} color={role === 'student' ? '#fff' : 'var(--text-muted)'} />
                            <span style={{ fontSize: '0.8rem', color: role === 'student' ? '#fff' : 'var(--text-muted)', fontWeight: 600 }}>Student</span>
                        </div>
                        <div 
                            className={`role-card ${role === 'professional' ? 'active' : ''}`}
                            onClick={() => setRole('professional')}
                            style={{ flex: 1, padding: '1rem', borderRadius: '12px', background: role === 'professional' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', border: `1px solid ${role === 'professional' ? 'var(--primary)' : 'var(--border)'}`, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', transition: 'all 0.3s' }}
                        >
                            <Briefcase size={24} color={role === 'professional' ? '#fff' : 'var(--text-muted)'} />
                            <span style={{ fontSize: '0.8rem', color: role === 'professional' ? '#fff' : 'var(--text-muted)', fontWeight: 600 }}>Professional</span>
                        </div>
                        <div 
                            className={`role-card ${role === 'hr' ? 'active' : ''}`}
                            onClick={() => setRole('hr')}
                            style={{ flex: 1, padding: '1rem', borderRadius: '12px', background: role === 'hr' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', border: `1px solid ${role === 'hr' ? 'var(--primary)' : 'var(--border)'}`, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', transition: 'all 0.3s' }}
                        >
                            <Building size={24} color={role === 'hr' ? '#fff' : 'var(--text-muted)'} />
                            <span style={{ fontSize: '0.8rem', color: role === 'hr' ? '#fff' : 'var(--text-muted)', fontWeight: 600, textAlign: 'center' }}>HR / Company</span>
                        </div>
                    </div>

                    <button type="submit" className='button primary-button' disabled={submitting}>
                        {submitting ? 'Creating account...' : (
                            <>
                                <UserPlus size={18} />
                                Register Now
                            </>
                        )}
                    </button>
                </form>

                <div className="form-card__footer">
                    Already have an account? <Link to={"/login"}>Sign in</Link>
                </div>
            </div>
        </main>
    )
}

export default Register