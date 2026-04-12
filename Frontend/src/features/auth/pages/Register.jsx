import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router'
import { UserPlus, Mail, Lock, User } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useAuth } from '../hooks/useAuth'
import "../auth.form.scss"

const Register = () => {
    const { handleRegister, user } = useAuth()
    const navigate = useNavigate()
    const container = useRef()

    const [ username, setUsername ] = useState("")
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
        const response = await handleRegister({ username, email, password })
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