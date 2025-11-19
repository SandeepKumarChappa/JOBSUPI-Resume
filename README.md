# JOBSUPI-Resume – Universal Resume Builder for Bharat Workforce
A multi-modal, AI-powered resume builder designed for blue-, grey-, and white-collar workers.

JOBSUPI-Resume is a feature-rich, modern resume builder created specifically for the JobsUPl Hackathon (P.3).
It helps users create professional resumes using voice input, chat-based guidance, simple forms, and AI enhancements.
The system also generates PDF resumes, public profile pages, and QR codes for easy sharing.

🎯 Project Objective
To empower the Bharat workforce with an inclusive, low-literacy-friendly, and AI-enhanced resume builder that works across all devices.

The system supports:

Voice-based resume creation

Guided chat-style question flow

Standard form-based entry

Professional PDF generation

Multi-version resume history

Shareable QR-coded public profile

Optional AI-generated resume summary & skill inference

⚒️ Core Features
Feature	Description
Multi-Modal Input	Users can create resumes via voice, chat, or forms, making it accessible for low-literacy users.
Real-time PDF Preview	Resume preview updates instantly while typing.
AI-Assisted Resume Content	Auto-generates summaries, skills, and clean formatting using Gemini/OpenAI.
Resume Versioning	Stores multiple versions using MongoDB.
QR Code + Public Profile	Creates a mobile-friendly public resume page linked via QR.
Resume Import (PDF)	Upload a resume PDF and extract details.
Privacy & Local Editing	Data stays local unless user chooses to save.
Multi-Language Support (Optional)	Translate resume content to Hindi/English.

📚 Tech Stack
Frontend
Technology	Purpose
TypeScript	Type-safe JavaScript
React + Next.js	Resume builder UI + routing
Tailwind CSS	Fast utility-based styling
Redux Toolkit	Central state management
Web Speech API	Voice input
React-PDF	PDF rendering

Backend
Technology	Purpose
Node.js + Express.js	REST API backend
MongoDB + Mongoose	Resume/version storage
pdf-lib / Puppeteer	PDF generation
qrcode	QR code creation
Gemini / OpenAI API	AI enhancements

Utilities
Tool	Usage
PDF.js	Resume import parser
Git	Version control
Vercel / Render	Deployment

📁 Project Structure (Updated)
JOBSUPI-Resume/
│
├── client/  (Next.js + React frontend)
│   ├── src/app
│   ├── components/
│   ├── modules/chat-builder/
│   ├── modules/voice-input/
│   └── modules/resume-preview/
│
├── server/ (Node.js backend)
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── services/
│   └── utils/
│
└── README.md

🚀 Local Development
📥 Clone the Repository
git clone https://github.com/SandeepKumarChappa/JOBSUPI-Resume.git
cd jobsupi-resume

Frontend Setup
cd client
npm install
npm run dev
Runs on:
➡️ http://localhost:3000

Backend Setup
cd server
npm install
npm start
Backend runs on:
➡️ http://localhost:5000

Frontend Interacts with Backend For:
AI summary

Resume saving

Versioning

QR generation

🔗 API Routes
Route	Description
POST /api/resume/create	Create new resume entry
POST /api/resume/version	Save a new version
GET /api/resume/:id	Fetch resume details
GET /api/profile/:username	Public profile page
POST /api/ai/summary	AI-generated summary

🧠 AI Features
✔ Resume Summary Generator
✔ Skill Extraction
✔ Text Enhancement
✔ Hindi/English Translation (optional)

🛠️ Future Enhancements
More resume templates

Dark/light theme

AI-powered interview tips

📝 License
MIT License