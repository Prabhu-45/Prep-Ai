import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useInterview } from '../hooks/useInterview'
import { ArrowLeft, Sparkles, Download, Loader2, Trash2, Plus, User, GraduationCap, Briefcase, Rocket, Wrench, Link as LinkIcon, Award, GripVertical, Eye, EyeOff, FileUp, ToggleLeft, LayoutTemplate, ChevronDown, CloudUpload, FileText, X } from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { TemplateClassic, TemplateModern, TemplateExecutive } from '../components/ResumeTemplates'
import TemplateModal from '../components/TemplateModal'
import '../../../style.scss'

const initialSectionConfig = [
    { id: 'education', title: 'Education', visible: true },
    { id: 'experience', title: 'Work Experience', visible: true },
    { id: 'projects', title: 'Projects', visible: true },
    { id: 'skills', title: 'Technical Skills', visible: true },
    { id: 'profiles', title: 'Profiles', visible: true },
    { id: 'certifications', title: 'Achievements/Certifications', visible: true }
]

export default function ResumeBuilder() {
    const { interviewId } = useParams()
    const navigate = useNavigate()
    const { report, loading, rewriteResumeBullet, renderHtmlToPdf, handleParseLinkedinPdf } = useInterview()
    
    // Resume State
    const [personalInfo, setPersonalInfo] = useState({
        fullName: 'Alex Carter', email: 'alex.carter@gmail.com', mobile: '+1 (415) 555-0192', location: 'San Francisco, CA', linkedin: 'linkedin.com/in/alexcarter-dev', github: 'github.com/alexcarter', photoUrl: ''
    })
    const [summary, setSummary] = useState('Experienced and driven Software Engineer with an impressive background in building scalable APIs.')
    const [education, setEducation] = useState([{
        id: Date.now(), institution: 'University of California, Berkeley', degree: 'B.S. in Computer Science', location: 'Berkeley, CA', startDate: 'Aug 2019', endDate: 'May 2023', score: '3.85 GPA'
    }])
    const [experience, setExperience] = useState([{
        id: Date.now() + 1, role: 'Software Engineer', company: 'Stripe', duration: 'July 2023 - Present', bullets: ['Built and maintained high-throughput payment APIs processing $2B+ in annual transactions with 99.99% uptime.']
    }])
    const [projects, setProjects] = useState([{
        id: Date.now() + 2, name: 'Nexus — Open Source API Gateway', tech: 'Go, Redis, Docker', link: 'github.com/alexcarter/nexus', bullets: ['Engineered a lightweight, high-performance API gateway handling up to 10k requests per second.']
    }])
    const [skills, setSkills] = useState([{
        id: Date.now() + 3, category: 'Frontend', text: 'React, Next.js, TypeScript, Tailwind CSS'
    }])
    const [profiles, setProfiles] = useState([{
        id: Date.now() + 4, platform: 'LeetCode', url: 'leetcode.com/alexcarter'
    }])
    const [certifications, setCertifications] = useState([{
        id: Date.now() + 5, details: 'Certificates: AWS Certified Solutions Architect – Associate (2023)'
    }])

    const [sectionConfig, setSectionConfig] = useState(initialSectionConfig)

    const [isRewriting, setIsRewriting] = useState(null)
    const [isExporting, setIsExporting] = useState(false)
    const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState(false)
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
    const [isParsingLinkedin, setIsParsingLinkedin] = useState(false)
    const [accentColor, setAccentColor] = useState('#1d4ed8') // Default blue
    const [backupData, setBackupData] = useState(null)
    const previewRef = useRef(null)
    const linkedinFileRef = useRef(null)
    const colorInputRef = useRef(null)

    // Load from local storage
    useEffect(() => {
        const saved = localStorage.getItem(`resume_${interviewId}_v3`)
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                setPersonalInfo(parsed.personalInfo || personalInfo)
                setSummary(parsed.summary || summary)
                setEducation(parsed.education || education)
                setExperience(parsed.experience || experience)
                setProjects(parsed.projects || projects)
                setSkills(parsed.skills || skills)
                setProfiles(parsed.profiles || profiles)
                setCertifications(parsed.certifications || certifications)
                setSectionConfig(parsed.sectionConfig || initialSectionConfig)
            } catch (e) { }
        }
    }, [interviewId])

    // Save to local storage
    useEffect(() => { 
        localStorage.setItem(`resume_${interviewId}_v3`, JSON.stringify({ 
            personalInfo, summary, education, experience, projects, skills, profiles, certifications, sectionConfig 
        }))
    }, [personalInfo, summary, education, experience, projects, skills, profiles, certifications, sectionConfig, interviewId])

    if (loading || !report) {
        return <div className="loading-screen"><div className="spinner"></div></div>
    }

    const handleRewrite = async (type, index, bulletIndex, text) => {
        setIsRewriting(`${type}-${index}-${bulletIndex}`)
        try {
            const data = await rewriteResumeBullet(interviewId, text)
            if (type === 'exp') {
                const newArr = [...experience]; newArr[index].bullets[bulletIndex] = data.rewritten; setExperience(newArr)
            } else if (type === 'proj') {
                const newArr = [...projects]; newArr[index].bullets[bulletIndex] = data.rewritten; setProjects(newArr)
            } else if (type === 'cert') {
                const newArr = [...certifications]; newArr[index].details = data.rewritten; setCertifications(newArr)
            }
        } catch (error) {
            alert("Failed to rewrite bullet: " + error.message)
        } finally {
            setIsRewriting(null)
        }
    }

    const { search } = window.location;
    const templateParam = new URLSearchParams(search).get('template') || 'classic';

    const renderTemplate = () => {
        const props = { personalInfo, summary, education, experience, projects, skills, profiles, certifications, sectionConfig };
        if (templateParam === 'modern') return <TemplateModern {...props} />;
        if (templateParam === 'executive') return <TemplateExecutive {...props} />;
        return <TemplateClassic {...props} />;
    };

    const handleClearBlank = () => {
        if (backupData) {
            // Restore from backup
            setPersonalInfo(backupData.personalInfo)
            setSummary(backupData.summary)
            setEducation(backupData.education)
            setExperience(backupData.experience)
            setProjects(backupData.projects)
            setSkills(backupData.skills)
            setProfiles(backupData.profiles)
            setCertifications(backupData.certifications)
            setBackupData(null)
        } else {
            // Backup and clear
            if(window.confirm("Are you sure you want to clear your resume? You can click Blank again to restore it.")) {
                setBackupData({ personalInfo, summary, education, experience, projects, skills, profiles, certifications })
                setPersonalInfo({fullName: '', email: '', mobile: '', location: '', linkedin: '', github: '', photoUrl: ''})
                setSummary('')
                setEducation([])
                setExperience([])
                setProjects([])
                setSkills([])
                setProfiles([])
                setCertifications([])
            }
        }
    }

    const handleLinkedinFileChange = async (e) => {
        const file = e.target.files[0];
        if(!file) return;
        if(file.type !== 'application/pdf') {
            alert('Please upload a valid PDF file.');
            return;
        }

        setIsParsingLinkedin(true);
        try {
            const data = await handleParseLinkedinPdf(file);
            if(data) {
                if(data.personalInfo) setPersonalInfo(prev => ({...prev, ...data.personalInfo}));
                if(data.summary) setSummary(data.summary);
                if(data.education && data.education.length) setEducation(data.education);
                if(data.experience && data.experience.length) setExperience(data.experience);
                if(data.skills && data.skills.length) setSkills(data.skills);
                setIsLinkedInModalOpen(false);
            }
        } catch(err) {
            alert('Failed to parse LinkedIn profile. Try a shorter PDF or paste your resume details.');
        } finally {
            setIsParsingLinkedin(false);
            if(linkedinFileRef.current) linkedinFileRef.current.value = '';
        }
    };

    const handleExport = async () => {
        if (!previewRef.current) return
        setIsExporting(true)
        try {
            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { margin: 0; padding: 0; box-sizing: border-box; }
                        * { box-sizing: inherit; }
                    </style>
                </head>
                <body>
                    ${previewRef.current.innerHTML}
                </body>
                </html>
            `
            const blob = await renderHtmlToPdf(htmlContent)
            const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `Optimized_Resume_${templateParam}.pdf`)
            document.body.appendChild(link)
            link.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(link)
        } catch (error) {
            alert("Failed to generate PDF")
            console.error(error)
        } finally {
            setIsExporting(false)
        }
    }

    // Handlers for adding/removing items
    const addEducation = () => setEducation([...education, { id: Date.now(), institution: '', degree: '', location: '', startDate: '', endDate: '', score: '' }])
    const addExperience = () => setExperience([...experience, { id: Date.now(), role: '', company: '', duration: '', bullets: [''] }])
    const addProject = () => setProjects([...projects, { id: Date.now(), name: '', tech: '', link: '', bullets: [''] }])
    const addSkill = () => setSkills([...skills, { id: Date.now(), category: '', text: '' }])
    const addProfile = () => setProfiles([...profiles, { id: Date.now(), platform: '', url: '' }])
    const addCert = () => setCertifications([...certifications, { id: Date.now(), details: '' }])

    const removeEducation = (index) => setEducation(education.filter((_, i) => i !== index))
    const removeExperience = (index) => setExperience(experience.filter((_, i) => i !== index))
    const removeProject = (index) => setProjects(projects.filter((_, i) => i !== index))
    const removeSkill = (index) => setSkills(skills.filter((_, i) => i !== index))
    const removeProfile = (index) => setProfiles(profiles.filter((_, i) => i !== index))
    const removeCert = (index) => setCertifications(certifications.filter((_, i) => i !== index))

    // DND Logic
    const onDragEnd = (result) => {
        if (!result.destination) return;
        const { source, destination, type } = result;

        if (type === 'section') {
            const items = Array.from(sectionConfig);
            const [reorderedItem] = items.splice(source.index, 1);
            items.splice(destination.index, 0, reorderedItem);
            setSectionConfig(items);
            return;
        }

        const updateList = (list, setter) => {
            const items = Array.from(list);
            const [reorderedItem] = items.splice(source.index, 1);
            items.splice(destination.index, 0, reorderedItem);
            setter(items);
        }

        switch (type) {
            case 'education': return updateList(education, setEducation);
            case 'experience': return updateList(experience, setExperience);
            case 'projects': return updateList(projects, setProjects);
            case 'skills': return updateList(skills, setSkills);
            case 'profiles': return updateList(profiles, setProfiles);
            case 'certifications': return updateList(certifications, setCertifications);
            default: break;
        }
    }

    const toggleVisibility = (id) => {
        setSectionConfig(sectionConfig.map(s => s.id === id ? { ...s, visible: !s.visible } : s));
    }

    const renderSectionContent = (id) => {
        switch (id) {
            case 'education':
                return (
                    <Droppable droppableId="education" type="education">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {education.map((edu, index) => (
                                    <Draggable key={edu.id} draggableId={`edu-${edu.id}`} index={index}>
                                        {(provided, snapshot) => (
                                            <div 
                                                className={`editor-subcard relative ${snapshot.isDragging ? 'is-dragging' : ''}`}
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                style={{ ...provided.draggableProps.style, paddingLeft: '45px' }}
                                            >
                                                <div {...provided.dragHandleProps} style={{ position: 'absolute', top: '15px', left: '15px', color: '#94a3b8', cursor: 'grab' }}>
                                                    <GripVertical size={16} />
                                                </div>
                                                <button onClick={() => removeEducation(index)} className="delete-btn"><Trash2 size={16}/></button>
                                                <div className="grid-2">
                                                    <div className="form-group"><label>Institution Name</label><input value={edu.institution} onChange={e => {const arr=[...education]; arr[index].institution=e.target.value; setEducation(arr)}} className="input-field"/></div>
                                                    <div className="form-group"><label>Degree / Major</label><input value={edu.degree} onChange={e => {const arr=[...education]; arr[index].degree=e.target.value; setEducation(arr)}} className="input-field"/></div>
                                                    <div className="form-group"><label>Location</label><input value={edu.location} onChange={e => {const arr=[...education]; arr[index].location=e.target.value; setEducation(arr)}} className="input-field"/></div>
                                                    <div className="form-group"><label>Start Date</label><input value={edu.startDate} onChange={e => {const arr=[...education]; arr[index].startDate=e.target.value; setEducation(arr)}} className="input-field"/></div>
                                                    <div className="form-group"><label>End Date</label><input value={edu.endDate} onChange={e => {const arr=[...education]; arr[index].endDate=e.target.value; setEducation(arr)}} className="input-field"/></div>
                                                    <div className="form-group"><label>CGPA / Score</label><input value={edu.score} onChange={e => {const arr=[...education]; arr[index].score=e.target.value; setEducation(arr)}} className="input-field"/></div>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                                <button onClick={addEducation} className="add-btn"><Plus size={16}/> Add Education</button>
                            </div>
                        )}
                    </Droppable>
                );
            case 'experience':
                return (
                    <Droppable droppableId="experience" type="experience">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {experience.map((exp, index) => (
                                    <Draggable key={exp.id} draggableId={`exp-${exp.id}`} index={index}>
                                        {(provided, snapshot) => (
                                            <div 
                                                className={`editor-subcard relative ${snapshot.isDragging ? 'is-dragging' : ''}`}
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                style={{ ...provided.draggableProps.style, paddingLeft: '45px' }}
                                            >
                                                <div {...provided.dragHandleProps} style={{ position: 'absolute', top: '15px', left: '15px', color: '#94a3b8', cursor: 'grab' }}>
                                                    <GripVertical size={16} />
                                                </div>
                                                <button onClick={() => removeExperience(index)} className="delete-btn"><Trash2 size={16}/></button>
                                                <div className="grid-2">
                                                    <div className="form-group"><label>Role / Title</label><input value={exp.role} onChange={e => {const arr=[...experience]; arr[index].role=e.target.value; setExperience(arr)}} className="input-field"/></div>
                                                    <div className="form-group"><label>Company Name</label><input value={exp.company} onChange={e => {const arr=[...experience]; arr[index].company=e.target.value; setExperience(arr)}} className="input-field"/></div>
                                                </div>
                                                <div className="form-group"><label>Duration</label><input value={exp.duration} onChange={e => {const arr=[...experience]; arr[index].duration=e.target.value; setExperience(arr)}} className="input-field"/></div>
                                                
                                                <label className="block mt-4 mb-2 text-sm text-gray-400">Key Responsibilities / Bullets</label>
                                                {exp.bullets.map((b, bIndex) => (
                                                    <div key={bIndex} className="bullet-row">
                                                        <textarea value={b} onChange={e => {const arr=[...experience]; arr[index].bullets[bIndex]=e.target.value; setExperience(arr)}} className="input-field" rows={2}/>
                                                        <button onClick={() => handleRewrite('exp', index, bIndex, b)} className="rewrite-btn" disabled={isRewriting===`exp-${index}-${bIndex}`}>
                                                            {isRewriting===`exp-${index}-${bIndex}` ? <Loader2 size={16} className="spin"/> : <Sparkles size={16}/>}
                                                        </button>
                                                    </div>
                                                ))}
                                                <button onClick={() => {const arr=[...experience]; arr[index].bullets.push(''); setExperience(arr)}} className="add-text-btn mt-2"><Plus size={14}/> Add Bullet Point</button>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                                <button onClick={addExperience} className="add-btn"><Plus size={16}/> Add New Experience</button>
                            </div>
                        )}
                    </Droppable>
                );
            case 'projects':
                return (
                    <Droppable droppableId="projects" type="projects">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {projects.map((proj, index) => (
                                    <Draggable key={proj.id} draggableId={`proj-${proj.id}`} index={index}>
                                        {(provided, snapshot) => (
                                            <div 
                                                className={`editor-subcard relative ${snapshot.isDragging ? 'is-dragging' : ''}`}
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                style={{ ...provided.draggableProps.style, paddingLeft: '45px' }}
                                            >
                                                <div {...provided.dragHandleProps} style={{ position: 'absolute', top: '15px', left: '15px', color: '#94a3b8', cursor: 'grab' }}>
                                                    <GripVertical size={16} />
                                                </div>
                                                <button onClick={() => removeProject(index)} className="delete-btn"><Trash2 size={16}/></button>
                                                <div className="grid-2">
                                                    <div className="form-group"><label>Project Name</label><input value={proj.name} onChange={e => {const arr=[...projects]; arr[index].name=e.target.value; setProjects(arr)}} className="input-field"/></div>
                                                    <div className="form-group"><label>Technologies Used</label><input value={proj.tech} onChange={e => {const arr=[...projects]; arr[index].tech=e.target.value; setProjects(arr)}} className="input-field"/></div>
                                                </div>
                                                <div className="form-group"><label>Project Link / URL</label><input value={proj.link} onChange={e => {const arr=[...projects]; arr[index].link=e.target.value; setProjects(arr)}} className="input-field"/></div>
                                                
                                                <label className="block mt-4 mb-2 text-sm text-gray-400">Project Details / Bullets</label>
                                                {proj.bullets.map((b, bIndex) => (
                                                    <div key={bIndex} className="bullet-row">
                                                        <textarea value={b} onChange={e => {const arr=[...projects]; arr[index].bullets[bIndex]=e.target.value; setProjects(arr)}} className="input-field" rows={2}/>
                                                        <button onClick={() => handleRewrite('proj', index, bIndex, b)} className="rewrite-btn" disabled={isRewriting===`proj-${index}-${bIndex}`}>
                                                            {isRewriting===`proj-${index}-${bIndex}` ? <Loader2 size={16} className="spin"/> : <Sparkles size={16}/>}
                                                        </button>
                                                    </div>
                                                ))}
                                                <button onClick={() => {const arr=[...projects]; arr[index].bullets.push(''); setProjects(arr)}} className="add-text-btn mt-2"><Plus size={14}/> Add Bullet Point</button>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                                <button onClick={addProject} className="add-btn"><Plus size={16}/> Add Project</button>
                            </div>
                        )}
                    </Droppable>
                );
            case 'skills':
                return (
                    <Droppable droppableId="skills" type="skills">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {skills.map((skill, index) => (
                                    <Draggable key={skill.id} draggableId={`skill-${skill.id}`} index={index}>
                                        {(provided, snapshot) => (
                                            <div 
                                                className={`editor-subcard relative ${snapshot.isDragging ? 'is-dragging' : ''}`}
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                style={{ ...provided.draggableProps.style, paddingLeft: '45px' }}
                                            >
                                                <div {...provided.dragHandleProps} style={{ position: 'absolute', top: '15px', left: '15px', color: '#94a3b8', cursor: 'grab' }}>
                                                    <GripVertical size={16} />
                                                </div>
                                                <button onClick={() => removeSkill(index)} className="delete-btn"><Trash2 size={16}/></button>
                                                <div className="form-group"><label>Category Name</label><input value={skill.category} onChange={e => {const arr=[...skills]; arr[index].category=e.target.value; setSkills(arr)}} className="input-field" placeholder="e.g. Frontend"/></div>
                                                <div className="form-group"><label>Skills (comma separated)</label><input value={skill.text} onChange={e => {const arr=[...skills]; arr[index].text=e.target.value; setSkills(arr)}} className="input-field"/></div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                                <button onClick={addSkill} className="add-btn"><Plus size={16}/> Add Category</button>
                            </div>
                        )}
                    </Droppable>
                );
            case 'profiles':
                return (
                    <Droppable droppableId="profiles" type="profiles">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {profiles.map((prof, index) => (
                                    <Draggable key={prof.id} draggableId={`prof-${prof.id}`} index={index}>
                                        {(provided, snapshot) => (
                                            <div 
                                                className={`editor-subcard relative ${snapshot.isDragging ? 'is-dragging' : ''}`}
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                style={{ ...provided.draggableProps.style, paddingLeft: '45px' }}
                                            >
                                                <div {...provided.dragHandleProps} style={{ position: 'absolute', top: '15px', left: '15px', color: '#94a3b8', cursor: 'grab' }}>
                                                    <GripVertical size={16} />
                                                </div>
                                                <button onClick={() => removeProfile(index)} className="delete-btn"><Trash2 size={16}/></button>
                                                <div className="grid-2">
                                                    <div className="form-group"><label>Platform</label><input value={prof.platform} onChange={e => {const arr=[...profiles]; arr[index].platform=e.target.value; setProfiles(arr)}} className="input-field" placeholder="e.g. LeetCode"/></div>
                                                    <div className="form-group"><label>Profile URL</label><input value={prof.url} onChange={e => {const arr=[...profiles]; arr[index].url=e.target.value; setProfiles(arr)}} className="input-field"/></div>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                                <button onClick={addProfile} className="add-btn"><Plus size={16}/> Add Profile</button>
                            </div>
                        )}
                    </Droppable>
                );
            case 'certifications':
                return (
                    <Droppable droppableId="certifications" type="certifications">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {certifications.map((cert, index) => (
                                    <Draggable key={cert.id} draggableId={`cert-${cert.id}`} index={index}>
                                        {(provided, snapshot) => (
                                            <div 
                                                className={`editor-subcard relative ${snapshot.isDragging ? 'is-dragging' : ''}`}
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                style={{ ...provided.draggableProps.style, paddingLeft: '45px' }}
                                            >
                                                <div {...provided.dragHandleProps} style={{ position: 'absolute', top: '15px', left: '15px', color: '#94a3b8', cursor: 'grab' }}>
                                                    <GripVertical size={16} />
                                                </div>
                                                <button onClick={() => removeCert(index)} className="delete-btn"><Trash2 size={16}/></button>
                                                <div className="bullet-row" style={{ marginTop: '10px' }}>
                                                    <textarea value={cert.details} onChange={e => {const arr=[...certifications]; arr[index].details=e.target.value; setCertifications(arr)}} className="input-field" rows={2}/>
                                                    <button onClick={() => handleRewrite('cert', index, 0, cert.details)} className="rewrite-btn" disabled={isRewriting===`cert-${index}-0`}>
                                                        {isRewriting===`cert-${index}-0` ? <Loader2 size={16} className="spin"/> : <Sparkles size={16}/>}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                                <button onClick={addCert} className="add-btn"><Plus size={16}/> Add Achievement/Certification</button>
                            </div>
                        )}
                    </Droppable>
                );
            default:
                return null;
        }
    }

    return (
        <div className="resume-builder-wrapper">
            <header className="global-editor-header" style={{ justifyContent: 'space-between' }}>
                <div className="header-left">
                    <button onClick={() => navigate(`/interview/${interviewId}`)} className="btn-nav">
                        <ArrowLeft size={18} /> Build Resume
                    </button>
                </div>
                
                <div className="header-center" style={{ display: 'flex', alignItems: 'center', gap: '25px', flex: 1, justifyContext: 'center', marginLeft: '40px' }}>
                    <button onClick={() => setIsLinkedInModalOpen(true)} className="btn-nav">
                        <FileUp size={18} /> LinkedIn Import
                    </button>

                    <button onClick={handleClearBlank} className="btn-nav" style={{ opacity: 0.8, color: backupData ? '#6366f1' : 'inherit' }}>
                        <Eye size={18} /> {backupData ? 'Restore' : 'Blank'}
                    </button>

                    <div className="color-picker-bar">
                        {['#1e293b', '#1d4ed8', '#0f766e', '#5b21b6', '#be123c', '#334155', '#047857', '#9a3412'].map((c, i) => (
                            <div key={i} onClick={() => setAccentColor(c)} className={`color-circle ${accentColor === c ? 'active' : ''}`} style={{background: c}}></div>
                        ))}
                        <div className="color-add" onClick={() => colorInputRef.current?.click()}>
                            <Plus size={14}/>
                        </div>
                        <input 
                            type="color" 
                            ref={colorInputRef} 
                            style={{ opacity: 0, position: 'absolute', width: 0, height: 0 }} 
                            value={accentColor}
                            onChange={(e) => setAccentColor(e.target.value)}
                        />
                    </div>
                    
                    <button onClick={() => setIsTemplateModalOpen(true)} className="btn-nav">
                        <LayoutTemplate size={18} /> Templates
                    </button>
                </div>

                <div className="header-right">
                    <button onClick={handleExport} disabled={isExporting} className="btn-primary" style={{ backgroundColor: '#6366f1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {isExporting ? <Loader2 size={16} className="spin" /> : <Download size={16} />} 
                        Export <ChevronDown size={14} />
                    </button>
                </div>
            </header>

            <div className="resume-builder-layout">
                <div className="editor-panel">
                    <div className="editor-content form-container">
                    
                    <div className="editor-card">
                        <div className="editor-card-header">
                            <User size={18} className="text-primary"/> <h3>Personal Information</h3>
                        </div>
                        <div className="grid-2">
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label>Profile Photo</label>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setPersonalInfo({...personalInfo, photoUrl: reader.result});
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }} 
                                    className="input-field file-input" 
                                    style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input value={personalInfo.fullName} onChange={e => setPersonalInfo({...personalInfo, fullName: e.target.value})} className="input-field" />
                            </div>
                            <div className="form-group">
                                <label>Target Job Title</label>
                                <input value={personalInfo.targetJobTitle || ''} onChange={e => setPersonalInfo({...personalInfo, targetJobTitle: e.target.value})} className="input-field" placeholder="e.g. Software Engineer" />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input value={personalInfo.email} onChange={e => setPersonalInfo({...personalInfo, email: e.target.value})} className="input-field" />
                            </div>
                            <div className="form-group">
                                <label>Mobile Number</label>
                                <input value={personalInfo.mobile} onChange={e => setPersonalInfo({...personalInfo, mobile: e.target.value})} className="input-field" />
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <input value={personalInfo.location} onChange={e => setPersonalInfo({...personalInfo, location: e.target.value})} className="input-field" />
                            </div>
                            <div className="form-group">
                                <label>LinkedIn Profile</label>
                                <input value={personalInfo.linkedin} onChange={e => setPersonalInfo({...personalInfo, linkedin: e.target.value})} className="input-field" />
                            </div>
                            <div className="form-group">
                                <label>GitHub Profile</label>
                                <input value={personalInfo.github} onChange={e => setPersonalInfo({...personalInfo, github: e.target.value})} className="input-field" />
                            </div>
                        </div>
                        <div className="form-group" style={{marginTop:'15px'}}>
                            <label>Professional Summary</label>
                            <textarea value={summary} onChange={e => setSummary(e.target.value)} className="input-field" rows={3} />
                        </div>
                    </div>

                    {/* Draggable Sections */}
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="sections" type="section">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {sectionConfig.map((section, index) => {
                                        const getSectionIcon = (id) => {
                                            switch(id) {
                                                case 'education': return GraduationCap;
                                                case 'experience': return Briefcase;
                                                case 'projects': return Rocket;
                                                case 'skills': return Wrench;
                                                case 'profiles': return LinkIcon;
                                                case 'certifications': return Award;
                                                default: return Rocket;
                                            }
                                        }
                                        const Icon = getSectionIcon(section.id);
                                        return (
                                            <Draggable key={section.id} draggableId={section.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div 
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className={`editor-card ${snapshot.isDragging ? 'is-dragging' : ''}`}
                                                        style={{
                                                            ...provided.draggableProps.style,
                                                            marginBottom: '20px',
                                                            opacity: section.visible ? 1 : 0.4,
                                                            transition: snapshot.isDragging ? 'none' : 'opacity 0.2s ease'
                                                        }}
                                                    >
                                                        <div className="editor-card-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                <div {...provided.dragHandleProps} style={{ cursor: 'grab', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
                                                                    <GripVertical size={18} />
                                                                </div>
                                                                <Icon size={18} className="text-primary"/> 
                                                                <h3>{section.title}</h3>
                                                            </div>
                                                            <button 
                                                                onClick={() => toggleVisibility(section.id)}
                                                                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                                                            >
                                                                {section.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                                                            </button>
                                                        </div>
                                                        <div style={{ display: section.visible ? 'block' : 'none' }}>
                                                            {renderSectionContent(section.id)}
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        )
                                    })}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            </div>

            {/* Preview Panel */}
            <div className="preview-panel">
                <div className="a4-container">
                    <div className="a4-page" ref={previewRef} style={{ '--primary': accentColor }}>
                        {renderTemplate()}
                    </div>
                </div>
            </div>
        </div>

        {/* Template Modal */}
        <TemplateModal isOpen={isTemplateModalOpen} onClose={() => setIsTemplateModalOpen(false)} interviewId={interviewId} />

        {/* LinkedIn Import Modal */}
            {isLinkedInModalOpen && (
                <div className="modal-overlay" onClick={() => setIsLinkedInModalOpen(false)}>
                    <div className="linkedin-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Import Your LinkedIn Profile</h2>
                            <p>Upload your LinkedIn profile PDF and we'll automatically extract your information to build your resume.</p>
                            <button className="close-btn" onClick={() => setIsLinkedInModalOpen(false)}><X size={18}/></button>
                        </div>
                        <div className="modal-body">
                            <div className="instructions-box">
                                <h4><FileText size={16} /> How to get your LinkedIn PDF:</h4>
                                <ol>
                                    <li>Go to your LinkedIn profile</li>
                                    <li>Click the <strong>More/Resources</strong> button</li>
                                    <li>Select <strong>Save to PDF</strong></li>
                                </ol>
                            </div>
                            <input 
                                type="file" 
                                accept="application/pdf" 
                                style={{display: 'none'}} 
                                ref={linkedinFileRef}
                                onChange={handleLinkedinFileChange}
                            />
                            <div className={`upload-zone ${isParsingLinkedin ? 'parsing' : ''}`} onClick={() => !isParsingLinkedin && linkedinFileRef.current.click()}>
                                {isParsingLinkedin ? (
                                    <>
                                        <Loader2 size={32} className="spin" style={{ color: '#6366f1' }} />
                                        <h3 style={{ marginTop: '10px' }}>Extracting your profile with AI...</h3>
                                        <p>This may take up to 20 seconds.</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="upload-icon"><CloudUpload size={24} /></div>
                                        <h3>Click to upload your PDF</h3>
                                        <p><FileText size={14} /> PDF only • Max 10MB</p>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-btn" onClick={() => setIsLinkedInModalOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
