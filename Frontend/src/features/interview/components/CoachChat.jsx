import React, { useState, useRef, useEffect } from 'react'
import { Send, X, Bot, User, Sparkles, Loader2 } from 'lucide-react'
import '../style/interview.scss'

import { chatWithCoach } from '../services/interview.api.js'

const CoachChat = ({ isOpen, onClose, interviewId }) => {
    const [ message, setMessage ] = useState('')
    const [ isTyping, setIsTyping ] = useState(false)
    const [ chatHistory, setChatHistory ] = useState([
        { 
            role: 'assistant', 
            content: "Hello! I'm your AI Career Coach. I've analyzed your resume against this job description. Do you have any 'on-the-spot' questions about your profile or how to prepare?" 
        }
    ])
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [ chatHistory, isTyping ])

    const handleSend = async (e) => {
        e.preventDefault()
        if (!message.trim() || isTyping) return
        
        const userMsg = { role: 'user', content: message }
        const currentHistory = [...chatHistory, userMsg]
        setChatHistory(currentHistory)
        setMessage('')
        setIsTyping(true)

        try {
            const data = await chatWithCoach(interviewId, message, chatHistory)
            const aiMsg = { 
                role: 'assistant', 
                content: data.reply
            }
            setChatHistory(prev => [ ...prev, aiMsg ])
        } catch (error) {
            console.error("Coach Chat Error:", error)
            const errorMsg = { 
                role: 'assistant', 
                content: "I'm sorry, I'm having trouble connecting right now. Please try again." 
            }
            setChatHistory(prev => [ ...prev, errorMsg ])
        } finally {
            setIsTyping(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className={`coach-sidebar ${isOpen ? 'coach-sidebar--open' : ''}`}>
            <div className='coach-sidebar__header'>
                <div className='title'>
                    <div className='icon-bg'>
                        <Bot size={20} className='text-primary' />
                    </div>
                    <div>
                        <h3>Career Coach</h3>
                        <span className='status'>Ready to Help</span>
                    </div>
                </div>
                <button onClick={onClose} className='close-btn'>
                    <X size={20} />
                </button>
            </div>

            <div className='coach-sidebar__messages'>
                {chatHistory.map((msg, i) => (
                    <div key={i} className={`message-wrapper ${msg.role === 'user' ? 'message-wrapper--user' : 'message-wrapper--ai'}`}>
                        <div className='avatar'>
                            {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                        </div>
                        <div className='message-content'>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className='message-wrapper message-wrapper--ai'>
                        <div className='avatar'><Bot size={14} /></div>
                        <div className='message-content typing'>
                            <Loader2 size={16} className='animate-spin' />
                            Analyzing...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form className='coach-sidebar__input' onSubmit={handleSend}>
                <input 
                    type='text' 
                    placeholder='Ask about your resume...' 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isTyping}
                />
                <button type='submit' disabled={!message.trim() || isTyping}>
                    <Send size={18} />
                </button>
            </form>

            <div className='coach-sidebar__footer'>
                <Sparkles size={12} />
                <span>NIYUKTI Career Coach</span>
            </div>
        </div>
    )
}

export default CoachChat
