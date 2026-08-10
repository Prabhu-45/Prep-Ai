import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { UploadCloud, FileText, Settings, Users, ArrowLeft, LogOut, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import { scanBulkResumes } from '../services/interview.api';
import NetworkBackground from '../components/NetworkBackground';
import './HrDashboard.scss';

const HrDashboard = () => {
    const { user, handleLogout } = useAuth();
    const navigate = useNavigate();

    const [jobDescription, setJobDescription] = useState("");
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [error, setError] = useState("");

    const [showProfile, setShowProfile] = useState(false);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(prevFiles => {
            const newFiles = [...prevFiles, ...selectedFiles];
            // Filter out duplicates by name
            const uniqueFiles = newFiles.reduce((acc, current) => {
                const exists = acc.find(item => item.name === current.name);
                if (!exists) {
                    return acc.concat([current]);
                }
                return acc;
            }, []);

            if (uniqueFiles.length > 5) {
                setError("You can only upload a maximum of 5 resumes at a time.");
                return uniqueFiles.slice(0, 5);
            } else {
                setError("");
                return uniqueFiles;
            }
        });
    };

    const handleScan = async () => {
        if (!jobDescription) {
            setError("Please enter a Job Description.");
            return;
        }
        if (files.length === 0) {
            setError("Please upload at least one resume.");
            return;
        }

        setError("");
        setLoading(true);

        const formData = new FormData();
        formData.append("jobDescription", jobDescription);
        files.forEach(file => {
            formData.append("resumes", file);
        });

        try {
            const data = await scanBulkResumes(formData);
            if (data.success) {
                setResults(data.results);
            } else {
                setError(data.message || "Failed to scan resumes.");
            }
        } catch (err) {
            console.error(err);
            setError("An error occurred during the scan. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        await handleLogout();
        navigate('/');
    };

    return (
        <div className="hr-dashboard">
            <NetworkBackground />
            <nav className="dashboard-nav glass">
                <div className="dashboard-nav__container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <div className='dashboard-nav__logo' onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <img src="/logo.png" alt="NIYUKTI Logo" style={{ width: '40px', height: '40px' }} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.5px', margin: 0 }}>NIYUKTI <span style={{ color: 'var(--primary)' }}>HR</span></h2>
                    </div>
                    <div className='dashboard-nav__profile' style={{ position: 'relative' }}>
                        <button
                            className={`profile-trigger ${showProfile ? 'active' : ''}`}
                            onClick={() => setShowProfile(!showProfile)}
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.5rem 1rem', borderRadius: '30px', cursor: 'pointer', color: 'white' }}
                        >
                            <div className='avatar' style={{ background: 'var(--primary)', borderRadius: '50%', padding: '5px' }}>
                                <Users size={16} />
                            </div>
                            <span className='username' style={{ fontWeight: 600 }}>{user?.username || 'HR Admin'}</span>
                        </button>

                        {showProfile && (
                            <div className='profile-card glass' style={{ position: 'absolute', top: '120%', right: '0', background: '#111', border: '1px solid #333', borderRadius: '12px', padding: '1rem', width: '220px', zIndex: 100 }}>
                                <div className='profile-card__info' style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
                                    <div className='info-item' style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc', fontSize: '0.9rem' }}>
                                        <Users size={14} className='icon-dim' />
                                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.username || 'HR Admin'}</span>
                                    </div>
                                    <div className='info-item' style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc', fontSize: '0.9rem' }}>
                                        <Settings size={14} className='icon-dim' />
                                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email || 'hr@company.com'}</span>
                                    </div>
                                </div>
                                <div className='profile-card__divider' style={{ height: '1px', background: '#333', margin: '0 0 15px 0' }} />
                                <button onClick={handleSignOut} className='signout-btn' style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600 }}>
                                    <LogOut size={16} />
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <main className="hr-content">
                <header className="hr-header">
                    <h1>Candidate Scanner</h1>
                    <p>Upload resumes and rank them instantly against your Job Description.</p>
                </header>

                <div className="hr-grid">
                    <section className="hr-input-section glass-panel">
                        <div className="form-group">
                            <label><FileText size={18} /> Job Description</label>
                            <textarea
                                placeholder="Paste the full job description here..."
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                rows={8}
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label><Users size={18} /> Resumes (Max 5)</label>
                            <div className="file-upload-box">
                                <UploadCloud size={40} className="upload-icon" />
                                <p>Drag & drop PDFs or click to browse</p>
                                <input
                                    type="file"
                                    multiple
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                />
                            </div>
                            {files.length > 0 && (
                                <ul className="selected-files" style={{ listStyleType: 'none', padding: 0, marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {files.map((f, i) => (
                                        <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.05)', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.9rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{i + 1}.</span>
                                                📄 {f.name}
                                            </div>
                                            <button
                                                onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))}
                                                style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                                title="Remove resume"
                                            >
                                                <XCircle size={16} />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {error && <div className="error-alert">{error}</div>}

                        <button
                            className="scan-btn button button--primary button--full"
                            onClick={handleScan}
                            disabled={loading}
                        >
                            {loading ? "Scanning AI..." : "Scan Candidates"}
                        </button>
                    </section>

                    <section className="hr-results-section glass-panel">
                        <h2><Settings size={20} /> Leaderboard</h2>

                        {loading && (
                            <div className="loading-state">
                                <div className="scanner-box"></div>
                                <p>AI is scanning candidates...</p>
                            </div>
                        )}

                        {!loading && results.length === 0 && (
                            <div className="empty-state">
                                <Users size={48} className="empty-icon" />
                                <h3>No candidates scanned yet</h3>
                                <p>Fill out the form and scan to see ranked results.</p>
                            </div>
                        )}

                        {!loading && results.length > 0 && (
                            <div className="leaderboard">
                                {results.map((res, index) => (
                                    <div key={index} className="candidate-card">
                                        <div className="card-header">
                                            <div className="rank">#{index + 1}</div>
                                            <h3>{res.name.replace('.pdf', '')}</h3>
                                            <div className={`score ${res.matchScore >= 80 ? 'high' : res.matchScore >= 60 ? 'medium' : 'low'}`}>
                                                {res.matchScore}% Match
                                            </div>
                                        </div>
                                        <p className="summary">{res.summary}</p>
                                        <div className="metrics">
                                            <div className="strengths">
                                                <h4><CheckCircle size={14} color="#10b981" /> Strengths</h4>
                                                <ul>
                                                    {res.strengths.slice(0, 2).map((s, i) => <li key={i}>{s}</li>)}
                                                </ul>
                                            </div>
                                            <div className="weaknesses">
                                                <h4><XCircle size={14} color="#ef4444" /> Weaknesses</h4>
                                                <ul>
                                                    {res.weaknesses.slice(0, 2).map((w, i) => <li key={i}>{w}</li>)}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
};

export default HrDashboard;
