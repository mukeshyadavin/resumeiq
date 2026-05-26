# ResumeIQ 🤖

An AI-powered Resume & Job Match Platform that helps job seekers optimize their resumes for specific job descriptions.

## Live Demo
- Frontend: [your-vercel-url.vercel.app]
- Backend: [your-railway-url.railway.app]

## Features
- 📄 Upload resume in PDF format
- 🤖 AI-powered match score (0-100%)
- ✅ Matched skills & ❌ missing skills analysis
- ✏️ AI rewrites your resume for the job
- 📝 AI generates a tailored cover letter
- 📋 History of all past analyses
- 🔐 Secure JWT authentication

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MySQL |
| AI Engine | Groq API (Llama 3.3 70B) |
| Auth | JWT |
| Deployment | Vercel + Railway |

## Local Setup

### Prerequisites
- Node.js v18+
- MySQL 8.0+

### Backend
```bash
cd server
npm install
cp .env.example .env  # fill in your values
npm run dev
```

### Frontend
```bash
cd client
npm install
npm start
```

### Environment Variables
```env
PORT=5001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=resumeiq
JWT_SECRET=your_secret
GROQ_API_KEY=your_groq_key
```

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| POST | /api/resume/upload | Upload PDF resume |
| POST | /api/analyze | Run AI analysis |
| GET | /api/analyze | Get history |

## Screenshots
[Add screenshots here]

## Author
Mukesh Yadav — [your-github-url]