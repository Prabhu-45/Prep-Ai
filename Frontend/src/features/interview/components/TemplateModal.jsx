import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { TemplateClassic, TemplateModern, TemplateExecutive } from './ResumeTemplates';

// A mock avatar from Unsplash for realistic thumbnails
const MOCK_PHOTO_URL = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80';

const sampleData = {
    personalInfo: {
        fullName: 'RICHARD SANCHEZ',
        email: 'richard.sanchez@gmail.com',
        mobile: '+1 (415) 555-0192',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/rsanchez',
        github: 'github.com/rsanchez',
        photoUrl: MOCK_PHOTO_URL
    },
    summary: 'Experienced and driven Professional with an impressive background in managing multi-million dollar projects and leading high-performing teams.',
    education: [
        { id: 1, institution: 'Wanderer University', degree: 'Master of Business', location: 'New York, NY', startDate: '2020', endDate: '2022', score: '3.9 GPA' },
        { id: 2, institution: 'Wanderer University', degree: 'Bachelor of Science', location: 'New York, NY', startDate: '2016', endDate: '2020', score: '3.8 GPA' }
    ],
    experience: [
        { id: 1, role: 'Senior Manager', company: 'Stelle Group', duration: '2022 - Present', bullets: ['Lead and execute comprehensive marketing strategies.', 'Manage a high-performing team of 15 members.'] },
        { id: 2, role: 'Marketing Specialist', company: 'Insight Studio', duration: '2020 - 2022', bullets: ['Developed and launched targeted email campaigns.', 'Increased user engagement by 40%.'] }
    ],
    projects: [],
    skills: [
        { id: 1, category: 'Core', text: 'Project Management, Team Leadership, Strategy' },
        { id: 2, category: 'Tools', text: 'Jira, Asana, Salesforce, Tableau' }
    ],
    profiles: [],
    certifications: [
        { id: 1, details: 'Project Management Professional (PMP)' }
    ],
    sectionConfig: [
        { id: 'education', visible: true },
        { id: 'experience', visible: true },
        { id: 'skills', visible: true },
        { id: 'certifications', visible: true }
    ]
};

const ScaledThumbnail = ({ TemplateComponent }) => {
    const containerRef = useRef(null);
    const [scale, setScale] = useState(0.24);

    useEffect(() => {
        const updateScale = () => {
            if (containerRef.current) {
                // 210mm is approximately 793.7px
                setScale(containerRef.current.offsetWidth / 793.7);
            }
        };
        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, []);

    return (
        <div ref={containerRef} style={{ width: '100%', aspectRatio: '1 / 1.414', position: 'relative', overflow: 'hidden', background: 'white' }}>
            <div style={{ 
                position: 'absolute', 
                top: 0, left: 0, 
                width: '210mm', height: '297mm',
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                pointerEvents: 'none'
            }}>
                <TemplateComponent {...sampleData} />
            </div>
        </div>
    );
};

export default function TemplateModal({ isOpen, onClose, interviewId }) {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const templates = [
        {
            id: 'classic',
            name: 'Classic ATS',
            desc: 'A clean, single-column design optimized for Applicant Tracking Systems. Perfect for corporate roles.',
            component: TemplateClassic
        },
        {
            id: 'modern',
            name: 'Modern Sidebar',
            desc: 'A professional two-column layout with a stylish blue sidebar. Great for standing out.',
            component: TemplateModern
        },
        {
            id: 'executive',
            name: 'Executive Blue',
            desc: 'A sleek, modern design with a distinct blue header and profile picture support.',
            component: TemplateExecutive
        }
    ];

    const handleSelect = (templateId) => {
        onClose();
        navigate(`/interview/${interviewId}/resume?template=${templateId}`);
    };

    return (
        <div className="template-modal-overlay">
            <div className="template-modal glass" style={{ maxWidth: '1000px', width: '90%' }}>
                <button className="template-modal-close" onClick={onClose}>
                    <X size={24} />
                </button>
                
                <div className="template-modal-header">
                    <h2>Choose a Template</h2>
                    <p>Select the layout that best fits your industry and style.</p>
                </div>

                <div className="template-cards-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px' }}>
                    {templates.map(tpl => (
                        <div key={tpl.id} className="template-card" onClick={() => handleSelect(tpl.id)} style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="template-img-container" style={{ aspectRatio: '1 / 1.414', padding: '0' }}>
                                <ScaledThumbnail TemplateComponent={tpl.component} />
                                <div className="template-overlay">
                                    <CheckCircle2 size={32} className="check-icon" style={{ color: 'white' }} />
                                </div>
                            </div>
                            <h3 style={{ marginTop: '5px' }}>{tpl.name}</h3>
                            <p>{tpl.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
