import React from 'react';

// Common base styles for all templates to reset margins and set base fonts
const baseStyles = `
    body { font-family: 'Helvetica', 'Arial', sans-serif; color: #333; line-height: 1.5; font-size: 11pt; padding: 0; margin: 0; }
    ul { margin: 0; padding-left: 20px; }
    li { margin-bottom: 4px; text-align: justify; }
`;

export const TemplateClassic = ({ personalInfo, summary, education, experience, projects, skills, profiles, certifications, sectionConfig }) => {
    const contactLine = [
        personalInfo?.email,
        personalInfo?.mobile,
        personalInfo?.location,
        personalInfo?.linkedin,
        personalInfo?.github
    ].filter(Boolean).join(' | ');

    // Map section IDs to their rendering components for the single-column layout
    const renderSection = (sectionId) => {
        switch(sectionId) {
            case 'education':
                return education?.length > 0 && (
                    <div className="classic-section" key="edu">
                        <div className="classic-section-title">Education</div>
                        {education.map(edu => (
                            <div key={edu.id} className="classic-item">
                                <div className="classic-item-header">
                                    <span>{edu.institution}</span>
                                    <span>{edu.startDate} - {edu.endDate}</span>
                                </div>
                                <div className="classic-item-sub">
                                    <span>{edu.degree}</span>
                                    <span>{edu.location} {edu.score ? `| ${edu.score}` : ''}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'experience':
                return experience?.length > 0 && (
                    <div className="classic-section" key="exp">
                        <div className="classic-section-title">Work Experience</div>
                        {experience.map(exp => (
                            <div key={exp.id} className="classic-item">
                                <div className="classic-item-header">
                                    <span>{exp.role}</span>
                                    <span>{exp.duration}</span>
                                </div>
                                <div className="classic-item-sub">
                                    <span>{exp.company}</span>
                                </div>
                                <ul>
                                    {exp.bullets.map((b, i) => b.trim() && <li key={i}>{b}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                );
            case 'projects':
                return projects?.length > 0 && (
                    <div className="classic-section" key="proj">
                        <div className="classic-section-title">Projects</div>
                        {projects.map(proj => (
                            <div key={proj.id} className="classic-item">
                                <div className="classic-item-header">
                                    <span>{proj.name} {proj.link ? `| ${proj.link}` : ''}</span>
                                    <span>{proj.tech}</span>
                                </div>
                                <ul>
                                    {proj.bullets.map((b, i) => b.trim() && <li key={i}>{b}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                );
            case 'skills':
                return skills?.length > 0 && (
                    <div className="classic-section" key="skills">
                        <div className="classic-section-title">Technical Skills</div>
                        {skills.map(skill => (
                            <div key={skill.id} className="classic-text" style={{ marginBottom: '4px' }}>
                                <strong>{skill.category}:</strong> {skill.text}
                            </div>
                        ))}
                    </div>
                );
            case 'certifications':
                return certifications?.length > 0 && (
                    <div className="classic-section" key="certs">
                        <div className="classic-section-title">Achievements / Certifications</div>
                        <ul>
                            {certifications.map(cert => cert.details.trim() && (
                                <li key={cert.id}>{cert.details}</li>
                            ))}
                        </ul>
                    </div>
                );
            case 'profiles':
                // Handled in header for Classic
                return null;
            default: return null;
        }
    };

    return (
        <>
            <style>
                {`
                    ${baseStyles}
                    .classic-header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 12px; margin-bottom: 12px; }
                    .classic-header h1 { margin: 0; font-size: 22pt; font-weight: bold; text-transform: uppercase; }
                    .classic-header p { margin: 5px 0 0 0; font-size: 9.5pt; color: #444; }
                    .classic-section { margin-bottom: 12px; }
                    .classic-section-title { font-size: 12pt; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #ccc; margin-bottom: 8px; padding-bottom: 2px; }
                    .classic-item { margin-bottom: 10px; }
                    .classic-item-header { display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 3px; font-size: 10.5pt; }
                    .classic-item-sub { display: flex; justify-content: space-between; font-style: italic; font-size: 10pt; margin-bottom: 4px; color: #555; }
                    .classic-text { font-size: 10pt; }
                    ul { font-size: 10pt; margin-top: 2px; }
                `}
            </style>
            <div className="classic-header">
                <h1>{personalInfo?.fullName || 'Your Name'}</h1>
                <p>{contactLine}</p>
                {/* Profiles visible check for classic header */}
                {sectionConfig?.find(s => s.id === 'profiles')?.visible && profiles?.length > 0 && (
                    <p style={{ marginTop: '2px', fontSize: '9pt' }}>
                        {profiles.map(p => `${p.platform}: ${p.url}`).join(' | ')}
                    </p>
                )}
            </div>
            
            {summary && (
                <div className="classic-section">
                    <div className="classic-section-title">Professional Summary</div>
                    <p className="classic-text">{summary}</p>
                </div>
            )}

            {/* Map the visible sections in the ordered array */}
            {sectionConfig?.filter(s => s.visible).map(s => renderSection(s.id))}
        </>
    );
};

export const TemplateModern = ({ personalInfo, summary, education, experience, projects, skills, profiles, certifications, sectionConfig }) => {
    // Split the global config into sidebar and main configs preserving relative order
    const sidebarSections = sectionConfig?.filter(s => ['skills', 'profiles', 'certifications'].includes(s.id) && s.visible) || [];
    const mainSections = sectionConfig?.filter(s => ['education', 'experience', 'projects'].includes(s.id) && s.visible) || [];

    const renderSidebarSection = (sectionId) => {
        if (sectionId === 'profiles' && profiles?.length > 0) {
            return (
                <React.Fragment key="profiles">
                    <div className="modern-sidebar-title">Profiles</div>
                    {profiles.map(p => p.url && <div key={p.id} className="modern-contact-item"><strong>{p.platform}:</strong><br/>{p.url}</div>)}
                </React.Fragment>
            );
        }
        if (sectionId === 'skills' && skills?.length > 0) {
            return (
                <React.Fragment key="skills">
                    <div className="modern-sidebar-title">Skills</div>
                    {skills.map(s => s.text && (
                        <div key={s.id} className="modern-skills-text">
                            <strong>{s.category}:</strong><br/>{s.text}
                        </div>
                    ))}
                </React.Fragment>
            );
        }
        if (sectionId === 'certifications' && certifications?.length > 0) {
            return (
                <React.Fragment key="certs">
                    <div className="modern-sidebar-title">Achievements</div>
                    {certifications.map(c => c.details && (
                        <div key={c.id} className="modern-skills-text">• {c.details}</div>
                    ))}
                </React.Fragment>
            );
        }
        return null;
    };

    const renderMainSection = (sectionId) => {
        if (sectionId === 'experience' && experience?.length > 0) {
            return (
                <React.Fragment key="exp">
                    <div className="modern-section-title">Experience</div>
                    {experience.map(exp => (
                        <div key={exp.id} className="modern-item">
                            <div className="modern-item-role">{exp.role}</div>
                            <div className="modern-item-company">
                                <span>{exp.company}</span>
                                <span>{exp.duration}</span>
                            </div>
                            <ul>{exp.bullets.map((b, i) => b.trim() && <li key={i}>{b}</li>)}</ul>
                        </div>
                    ))}
                </React.Fragment>
            );
        }
        if (sectionId === 'education' && education?.length > 0) {
            return (
                <React.Fragment key="edu">
                    <div className="modern-section-title">Education</div>
                    {education.map(edu => (
                        <div key={edu.id} className="modern-item">
                            <div className="modern-item-role">{edu.institution}</div>
                            <div className="modern-item-company">
                                <span>{edu.degree} {edu.score ? `(${edu.score})` : ''}</span>
                                <span>{edu.startDate} - {edu.endDate}</span>
                            </div>
                        </div>
                    ))}
                </React.Fragment>
            );
        }
        if (sectionId === 'projects' && projects?.length > 0) {
            return (
                <React.Fragment key="proj">
                    <div className="modern-section-title">Projects</div>
                    {projects.map(proj => (
                        <div key={proj.id} className="modern-item">
                            <div className="modern-item-role">{proj.name}</div>
                            <div className="modern-item-company">
                                <span>{proj.tech}</span>
                                <span>{proj.link}</span>
                            </div>
                            <ul>{proj.bullets.map((b, i) => b.trim() && <li key={i}>{b}</li>)}</ul>
                        </div>
                    ))}
                </React.Fragment>
            );
        }
        return null;
    };

    return (
        <>
            <style>
                {`
                    ${baseStyles}
                    .modern-layout { display: flex; width: 100%; min-height: 297mm; }
                    .modern-sidebar { width: 33%; background-color: var(--primary, #115e59); color: white; padding: 30px 25px; }
                    .modern-photo-container { width: 140px; height: 140px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.4); margin: 0 auto 30px auto; display: flex; align-items: center; justify-content: center; overflow: hidden; background: rgba(255,255,255,0.1); }
                    .modern-photo { width: 100%; height: 100%; object-fit: cover; }
                    .modern-photo-placeholder { width: 60px; height: 60px; color: rgba(255,255,255,0.6); }
                    .modern-main { width: 67%; padding: 40px 35px; background: white; }
                    .modern-name { font-size: 24pt; font-weight: bold; text-transform: uppercase; color: var(--primary, #1f3b5c); margin: 0 0 5px 0; line-height: 1.1; }
                    .modern-sidebar-title { font-size: 11pt; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,0.3); margin-bottom: 12px; padding-bottom: 4px; margin-top: 25px; letter-spacing: 1px; color: #93c5fd; }
                    .modern-contact-item { font-size: 9pt; margin-bottom: 10px; line-height: 1.4; word-break: break-all; opacity: 0.9; }
                    .modern-skills-text { font-size: 9pt; line-height: 1.5; opacity: 0.9; margin-bottom: 8px; }
                    .modern-section-title { font-size: 13pt; font-weight: bold; text-transform: uppercase; color: var(--primary, #1f3b5c); border-bottom: 2px solid var(--primary, #1f3b5c); margin-bottom: 12px; padding-bottom: 4px; margin-top: 20px; }
                    .modern-item { margin-bottom: 15px; }
                    .modern-item-role { font-weight: bold; font-size: 10.5pt; color: #333; }
                    .modern-item-company { font-weight: normal; color: #1f3b5c; font-style: italic; margin-bottom: 5px; font-size: 10pt; display: flex; justify-content: space-between; }
                    .modern-summary { font-size: 10pt; margin-bottom: 20px; text-align: justify; }
                    .modern-main ul { font-size: 9.5pt; margin-top: 3px; }
                `}
            </style>
            <div className="modern-layout">
                <div className="modern-sidebar">
                    <div className="modern-photo-container">
                        {personalInfo?.photoUrl ? (
                            <img src={personalInfo.photoUrl} alt="Profile" className="modern-photo" />
                        ) : (
                            <svg className="modern-photo-placeholder" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                        )}
                    </div>
                    <div style={{ marginTop: '0' }} className="modern-sidebar-title">Contact</div>
                    {personalInfo?.email && <div className="modern-contact-item">{personalInfo.email}</div>}
                    {personalInfo?.mobile && <div className="modern-contact-item">{personalInfo.mobile}</div>}
                    {personalInfo?.location && <div className="modern-contact-item">{personalInfo.location}</div>}
                    {personalInfo?.linkedin && <div className="modern-contact-item">{personalInfo.linkedin}</div>}
                    {personalInfo?.github && <div className="modern-contact-item">{personalInfo.github}</div>}

                    {sidebarSections.map(s => renderSidebarSection(s.id))}
                </div>
                
                <div className="modern-main">
                    <h1 className="modern-name">{personalInfo?.fullName || 'Your Name'}</h1>
                    
                    {summary && (
                        <>
                            <div className="modern-section-title" style={{marginTop:0}}>Profile</div>
                            <p className="modern-summary">{summary}</p>
                        </>
                    )}

                    {mainSections.map(s => renderMainSection(s.id))}
                </div>
            </div>
        </>
    );
};

export const TemplateExecutive = ({ personalInfo, summary, education, experience, projects, skills, profiles, certifications, sectionConfig }) => {
    const contactLine = [
        personalInfo?.email,
        personalInfo?.mobile,
        personalInfo?.location,
        personalInfo?.linkedin
    ].filter(Boolean).join(' • ');

    const renderSection = (sectionId) => {
        switch(sectionId) {
            case 'experience':
                return experience?.length > 0 && (
                    <React.Fragment key="exp">
                        <div className="exec-section-title">Professional Experience</div>
                        {experience.map(exp => (
                            <div key={exp.id} className="exec-item">
                                <div className="exec-item-header">
                                    <span className="exec-item-title">{exp.role} <span className="exec-item-subtitle">| {exp.company}</span></span>
                                    <span className="exec-item-date">{exp.duration}</span>
                                </div>
                                <ul className="exec-ul">
                                    {exp.bullets.map((b, i) => b.trim() && <li key={i}>{b}</li>)}
                                </ul>
                            </div>
                        ))}
                    </React.Fragment>
                );
            case 'projects':
                return projects?.length > 0 && (
                    <React.Fragment key="proj">
                        <div className="exec-section-title">Key Projects</div>
                        {projects.map(proj => (
                            <div key={proj.id} className="exec-item">
                                <div className="exec-item-header">
                                    <span className="exec-item-title">{proj.name}</span>
                                    <span className="exec-item-date">{proj.tech}</span>
                                </div>
                                <ul className="exec-ul">
                                    {proj.bullets.map((b, i) => b.trim() && <li key={i}>{b}</li>)}
                                </ul>
                            </div>
                        ))}
                    </React.Fragment>
                );
            case 'education':
                return education?.length > 0 && (
                    <React.Fragment key="edu">
                        <div className="exec-section-title">Education</div>
                        {education.map(edu => (
                            <div key={edu.id} className="exec-item">
                                <div className="exec-item-header">
                                    <span className="exec-item-title">{edu.degree}</span>
                                    <span className="exec-item-date">{edu.startDate} - {edu.endDate}</span>
                                </div>
                                <div className="exec-text">{edu.institution}, {edu.location} {edu.score ? `(${edu.score})` : ''}</div>
                            </div>
                        ))}
                    </React.Fragment>
                );
            case 'skills':
                return skills?.length > 0 && (
                    <React.Fragment key="skills">
                        <div className="exec-section-title">Core Competencies</div>
                        <div className="exec-text">
                            {skills.map(s => s.text && (
                                <div key={s.id} style={{marginBottom:'4px'}}><strong>{s.category}:</strong> {s.text}</div>
                            ))}
                        </div>
                    </React.Fragment>
                );
            case 'certifications':
                return certifications?.length > 0 && (
                    <React.Fragment key="certs">
                        <div className="exec-section-title">Achievements</div>
                        <ul className="exec-ul">
                            {certifications.map(cert => cert.details.trim() && (
                                <li key={cert.id}>{cert.details}</li>
                            ))}
                        </ul>
                    </React.Fragment>
                );
            case 'profiles':
                // Handled in header if needed, but Executive doesn't explicitly show profiles in body
                return null;
            default: return null;
        }
    };

    return (
        <>
            <style>
                {`
                    ${baseStyles}
                    .exec-header { background-color: #f8fafc; color: #0f172a; padding: 25px 30px; margin: -40px -40px 20px -40px; display: flex; align-items: center; justify-content: space-between; border-left: 5px solid var(--primary, #6366f1); border-bottom: 1px solid #e2e8f0; }
                    .exec-header-left { flex: 1; }
                    .exec-photo-container { width: 75px; height: 85px; border-radius: 4px; border: 1px dashed #cbd5e1; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f1f5f9; overflow: hidden; color: #94a3b8; }
                    .exec-photo { width: 100%; height: 100%; object-fit: cover; }
                    .exec-photo-placeholder-icon { width: 28px; height: 28px; margin-bottom: 4px; }
                    .exec-photo-placeholder-text { font-size: 7.5pt; text-transform: uppercase; letter-spacing: 0.5px; }
                    .exec-name { font-size: 28pt; font-weight: bold; margin: 0 0 4px 0; letter-spacing: 2px; color: var(--primary, #0f4a3c); text-transform: uppercase; }
                    .exec-job-title { font-size: 13pt; color: #475569; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; }
                    .exec-contact { font-size: 9pt; color: #64748b; }
                    .exec-section-title { font-size: 11.5pt; font-weight: bold; text-transform: uppercase; color: var(--primary, #166534); border-bottom: 2px solid var(--primary, #166534); margin-bottom: 12px; padding-bottom: 3px; margin-top: 18px; }
                    .exec-item { margin-bottom: 15px; }
                    .exec-item-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
                    .exec-item-title { font-weight: bold; font-size: 11pt; color: #222; }
                    .exec-item-subtitle { font-weight: bold; color: #666; font-size: 10pt; }
                    .exec-item-date { font-size: 9.5pt; color: #555; }
                    .exec-text { font-size: 10pt; line-height: 1.5; }
                    .exec-ul { font-size: 10pt; margin-top: 2px; }
                `}
            </style>
            <div className="exec-header">
                <div className="exec-header-left">
                    <h1 className="exec-name" style={{ color: 'var(--primary, #0f4a3c)' }}>{personalInfo?.fullName || 'Your Name'}</h1>
                    {personalInfo?.targetJobTitle && <div className="exec-job-title">{personalInfo.targetJobTitle}</div>}
                    <div className="exec-contact">
                        {contactLine.split(' | ').map((part, i) => (
                            <React.Fragment key={i}>
                                {part}
                                {i < contactLine.split(' | ').length - 1 && <span style={{color:'#cbd5e1', margin:'0 6px'}}>|</span>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
                <div className="exec-photo-container">
                    {personalInfo?.photoUrl ? (
                        <img src={personalInfo.photoUrl} alt="Profile" className="exec-photo" />
                    ) : (
                        <>
                            <svg className="exec-photo-placeholder-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                            <span className="exec-photo-placeholder-text">Photo</span>
                        </>
                    )}
                </div>
            </div>
            
            {summary && (
                <>
                    <div className="exec-section-title">Executive Summary</div>
                    <p className="exec-text">{summary}</p>
                </>
            )}

            {sectionConfig?.filter(s => s.visible).map(s => renderSection(s.id))}
        </>
    );
};
