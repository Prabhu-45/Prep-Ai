import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router'
import { LogIn, Mail, Lock } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'

const Login = () => {
    const { handleLogin, user } = useAuth()
    const navigate = useNavigate()
    const container = useRef()

    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ submitting, setSubmitting ] = useState(false)
    const [ error, setError ] = useState("")

    useGSAP(() => {
        gsap.from('.form-card', {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: 'power4.out'
        })
    }, { scope: container })

    useEffect(() => {
        if (user) {
            navigate('/dashboard')
        }
    }, [ user ])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSubmitting(true)
        const response = await handleLogin({ email, password })
        if (response && !response.success) {
            setError(response.message)
        }
        setSubmitting(false)
    }

    return (
        <main className='auth-container' ref={container}>
            <div className="blob blob--1"></div>
            <div className="blob blob--2"></div>
            
            <div className="form-card glass">
                <div className="form-card__header">
                    <h1>Welcome Back</h1>
                    <p>Enter your credentials to continue your prep.</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
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
                        <input
                            onChange={(e) => { setPassword(e.target.value) }}
                            type="password" 
                            id="password" 
                            name='password' 
                            placeholder='••••••••' 
                            required 
                        />
                    </div>
                    
                    <button className='button primary-button' disabled={submitting}>
                        {submitting ? 'Authenticating...' : (
                            <>
                                <LogIn size={18} />
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                <div className="form-card__footer">
                    Don't have an account? <Link to={"/register"}>Create account</Link>
                </div>
            </div>
        </main>
    )
}

export default Login