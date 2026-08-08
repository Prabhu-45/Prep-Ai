# Prep-Ai 🚀

Prep-Ai is a powerful, AI-driven platform designed to help candidates prepare for interviews and build world-class, ATS-friendly resumes. With a modern interface, real-time AI assistance, and dynamic styling, Prep-Ai takes the friction out of the job application process.

## ✨ Features

- **🤖 AI Career Coach**: Chat with a highly technical AI Career Coach to practice for your upcoming interviews based on your specific job description.
- **📄 Resume Builder**: A fully interactive resume builder with live previews.
- **💼 LinkedIn PDF Parsing**: Upload your LinkedIn profile PDF and let the AI automatically extract and map your personal information, experience, education, and skills.
- **✨ AI Bullet Rewriting**: Automatically enhance your resume bullet points using the STAR method (Situation, Task, Action, Result) powered by Google Gemini.
- **🎨 Dynamic Theming & Templates**: Choose from multiple professional templates (Classic, Modern, Executive) and apply infinite custom accent colors using a native color picker.
- **📥 PDF Export**: Instantly export your tailored resume to a perfectly formatted A4 PDF.
- **🔒 Secure Authentication**: Full user authentication system powered by JWT.

## 🛠️ Tech Stack

### Frontend
- **React.js & Vite**: Lightning-fast frontend development.
- **SCSS**: Advanced, maintainable styling and dynamic CSS variables for theming.
- **Lucide React**: Beautiful, consistent iconography.

### Backend
- **Node.js & Express**: Robust and scalable backend server.
- **MongoDB Atlas**: Cloud-hosted NoSQL database for secure data persistence.
- **Google Gemini API**: Deeply integrated native REST client for intelligent NLP tasks (bullet rewriting, LinkedIn parsing, coaching).

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas Account (or local MongoDB)
- Google Gemini API Key

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/Prabhu-45/Prep-Ai.git
cd Prep-Ai
\`\`\`

### 2. Backend Setup
Navigate to the backend directory, install dependencies, and configure your environment:
\`\`\`bash
cd Backend
npm install
\`\`\`
Create a \`.env\` file in the `Backend` directory with the following variables:
\`\`\`env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_GENAI_API_KEY=your_gemini_api_key
\`\`\`
Start the backend server:
\`\`\`bash
npm run dev
\`\`\`

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
\`\`\`bash
cd Frontend
npm install
\`\`\`
Start the frontend development server:
\`\`\`bash
npm run dev
\`\`\`

### 4. Open the App
Navigate to \`http://localhost:5173\` in your browser and start building your career!

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).
