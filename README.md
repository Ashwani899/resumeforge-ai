# ResumeForge AI — Full-Stack AI Resume Builder

An intelligent resume analysis and optimization platform built with React + TypeScript + Tailwind CSS (frontend) and Python + FastAPI (backend), powered by OpenAI's GPT for AI-driven suggestions and resume tailoring.

![ResumeForge AI](https://img.shields.io/badge/ResumeForge-AI-6366f1?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=flat-square&logo=openai)

## Features

- **Resume Upload** — Drag-and-drop PDF/DOCX upload with instant parsing
- **ATS Score** — Deterministic 10-category scoring engine (0-100) with detailed breakdown
- **Missing Keywords** — Algorithmic keyword extraction and matching against job descriptions
- **AI Improvement Suggestions** — GPT-powered actionable resume improvement tips
- **Internship Tailoring** — AI rewrites your resume to match specific internship postings
- **Download Improved Resume** — Export tailored resume as PDF

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS v4 |
| Backend | Python 3.11+ + FastAPI |
| AI | OpenAI API (GPT-4o-mini) |
| Database | SQLite (via SQLAlchemy async) |
| PDF Parsing | PyMuPDF |
| PDF Generation | FPDF2 |

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- OpenAI API key (optional — ATS scoring and keywords work without it)

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate
# Activate (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# Run the server
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies API calls to the backend at `http://localhost:8000`.

### Environment Variables

Create `backend/.env` with:

```env
OPENAI_API_KEY=sk-your-key-here     # Required for AI features
DATABASE_URL=sqlite+aiosqlite:///./resumeforge.db
FRONTEND_URL=http://localhost:5173
```

## Project Structure

```
├── frontend/                  # React + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route pages
│   │   ├── services/          # API client
│   │   └── types/             # TypeScript interfaces
│   └── ...
│
├── backend/                   # Python + FastAPI
│   ├── app/
│   │   ├── routes/            # API endpoints
│   │   ├── services/          # Business logic
│   │   ├── main.py            # FastAPI app
│   │   ├── database.py        # SQLAlchemy setup
│   │   └── models.py          # Pydantic models
│   └── requirements.txt
│
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/upload` | Upload resume (PDF/DOCX) |
| GET | `/api/analysis/{id}` | Get full analysis results |
| POST | `/api/analysis/{id}/suggestions` | Generate AI suggestions |
| POST | `/api/tailor` | Tailor resume for a job |
| GET | `/api/download/{id}` | Download improved resume PDF |
| GET | `/api/health` | Health check |

## Deployment

### Frontend (Vercel)

```bash
cd frontend
npm run build
# Deploy dist/ to Vercel
```

Set environment variable: `VITE_API_URL=https://your-backend.onrender.com`

### Backend (Render)

1. Connect your GitHub repo
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables (OPENAI_API_KEY, FRONTEND_URL)

## License

MIT
