export const generateReportHtml = (report, user) => {
    if (!report) return '';

    const getScoreColor = (score) => {
        if (score >= 80) return '#22c55e'; // Green
        if (score >= 60) return '#f59e0b'; // Orange
        return '#ef4444'; // Red
    };

    const getScoreText = (score) => {
        if (score >= 80) return 'Exceptional Fit';
        if (score >= 60) return 'Strong Candidate';
        return 'Focus on Skill Gaps';
    };

    const getSeverityColor = (severity) => {
        switch (severity?.toLowerCase()) {
            case 'high': return '#ef4444';
            case 'medium': return '#f59e0b';
            case 'low': return '#22c55e';
            default: return '#3b82f6';
        }
    };

    const scoreColor = getScoreColor(report.matchScore);
    const scoreText = getScoreText(report.matchScore);

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Interview Preparation Report</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            
            body {
                font-family: 'Inter', sans-serif;
                background-color: #0a0a0c;
                color: #ffffff;
                margin: 0;
                padding: 40px;
                line-height: 1.6;
            }

            .container {
                max-width: 800px;
                margin: 0 auto;
                background: #141419;
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 16px;
                padding: 40px;
            }

            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                padding-bottom: 24px;
                margin-bottom: 32px;
            }

            .header-left h1 {
                margin: 0;
                font-size: 28px;
                background: linear-gradient(135deg, #ff1e56, #ff4d7e);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-bottom: 8px;
            }

            .header-left p {
                margin: 0;
                color: #a1a1aa;
                font-size: 14px;
            }

            .header-right {
                text-align: right;
            }
            
            .header-right .user-name {
                font-weight: 600;
                font-size: 16px;
                color: #e4e4e7;
            }
            
            .header-right .user-email {
                font-size: 14px;
                color: #71717a;
            }

            .section-title {
                font-size: 18px;
                font-weight: 700;
                color: #e4e4e7;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-top: 40px;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .section-title::before {
                content: '';
                display: block;
                width: 4px;
                height: 20px;
                background: #ff1e56;
                border-radius: 4px;
            }

            /* Score Section */
            .score-container {
                display: flex;
                align-items: center;
                gap: 24px;
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.05);
                border-radius: 12px;
                padding: 24px;
                margin-bottom: 32px;
            }

            .score-ring {
                width: 100px;
                height: 100px;
                border-radius: 50%;
                border: 6px solid ${scoreColor};
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 32px;
                font-weight: 800;
                color: #ffffff;
            }

            .score-ring span {
                font-size: 16px;
                opacity: 0.6;
                margin-left: 2px;
            }

            .score-text h2 {
                margin: 0 0 8px 0;
                font-size: 24px;
                color: ${scoreColor};
            }

            .score-text p {
                margin: 0;
                color: #a1a1aa;
                font-size: 15px;
                max-width: 400px;
            }

            /* Gaps Section */
            .gaps-grid {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
            }

            .gap-item {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                padding: 8px 16px;
                border-radius: 50px;
                font-size: 14px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .gap-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
            }

            /* Roadmap Section */
            .roadmap {
                position: relative;
                padding-left: 24px;
                margin-top: 24px;
            }

            .roadmap::before {
                content: '';
                position: absolute;
                left: 7px;
                top: 8px;
                bottom: 24px;
                width: 2px;
                background: rgba(255, 255, 255, 0.1);
            }

            .roadmap-day {
                position: relative;
                margin-bottom: 32px;
            }

            .roadmap-day::before {
                content: '';
                position: absolute;
                left: -24px;
                top: 4px;
                width: 16px;
                height: 16px;
                background: #141419;
                border: 2px solid #ff1e56;
                border-radius: 50%;
            }

            .day-title {
                font-size: 18px;
                font-weight: 700;
                color: #ffffff;
                margin: 0 0 8px 0;
            }

            .day-focus {
                font-size: 15px;
                color: #ff1e56;
                font-weight: 600;
                margin: 0 0 12px 0;
            }

            .task-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .task-list li {
                position: relative;
                padding-left: 16px;
                color: #a1a1aa;
                font-size: 14px;
                margin-bottom: 8px;
            }

            .task-list li::before {
                content: '';
                position: absolute;
                left: 0;
                top: 8px;
                width: 6px;
                height: 6px;
                background: #3f3f46;
                border-radius: 50%;
            }

            /* Footer */
            .footer {
                margin-top: 60px;
                text-align: center;
                color: #71717a;
                font-size: 12px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                padding-top: 24px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="header-left">
                    <h1>NIYUKTI Report</h1>
                    <p>Generated on ${new Date().toLocaleDateString()}</p>
                </div>
                <div class="header-right">
                    <div class="user-name">${user?.username || 'Interview Candidate'}</div>
                    <div class="user-email">${user?.email || ''}</div>
                </div>
            </div>

            <h2 class="section-title">Profile Match Analysis</h2>
            <div class="score-container">
                <div class="score-ring">
                    ${report.matchScore || 0}<span>%</span>
                </div>
                <div class="score-text">
                    <h2>${scoreText}</h2>
                    <p>This score reflects how well your provided resume and self-description align with the requirements of the role.</p>
                </div>
            </div>

            <h2 class="section-title">Identified Skill Gaps</h2>
            <div class="gaps-grid">
                ${(report.skillGaps || []).map(gap => `
                    <div class="gap-item">
                        <div class="gap-dot" style="background-color: ${getSeverityColor(gap.severity)}"></div>
                        ${gap.skill}
                    </div>
                `).join('')}
                ${!(report.skillGaps?.length) ? '<div style="color: #a1a1aa;">No significant gaps identified.</div>' : ''}
            </div>

            <h2 class="section-title">Preparation Roadmap</h2>
            <div class="roadmap">
                ${(report.preparationPlan || []).map(day => `
                    <div class="roadmap-day">
                        <h3 class="day-title">Day ${day.day}</h3>
                        <p class="day-focus">${day.focus}</p>
                        <ul class="task-list">
                            ${(day.tasks || []).map(task => `<li>${task}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
                ${!(report.preparationPlan?.length) ? '<div style="color: #a1a1aa;">No roadmap generated.</div>' : ''}
            </div>

            <div class="footer">
                Prepared by NIYUKTI • Powering your next career move
            </div>
        </div>
    </body>
    </html>
    `;
};
