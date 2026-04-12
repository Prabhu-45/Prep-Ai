import React, { useState, useRef, useEffect } from 'react'
import { Send, X, Bot, User, Sparkles, Loader2 } from 'lucide-react'
import '../style/interview.scss'

const CoachChat = ({ isOpen, onClose }) => {
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

    const handleSend = (e) => {
        e.preventDefault()
        if (!message.trim() || isTyping) return
        
        const userMsg = { role: 'user', content: message }
        setChatHistory(prev => [ ...prev, userMsg ])
        setMessage('')
        setIsTyping(true)

        // Mock automated response
        setTimeout(() => {
            const aiMsg = { 
                role: 'assistant', 
                content: "That's a great question! Based on your resume, I'd recommend highlighting your specific technical achievements. (Note: Real AI analysis is currently in UI-only mode)." 
            }
            setChatHistory(prev => [ ...prev, aiMsg ])
            setIsTyping(false)
        }, 1500)
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
                <span>Prep-AI Career Coach</span>
            </div>
        </div>
    )
}

export default CoachChat
