# ResumeForge AI — Full-Stack AI Resume Analysis

ResumeForge AI is a full-stack application for uploading a PDF/DOCX résumé, inspecting an explainable ATS-style score and keyword match, receiving AI-assisted suggestions, tailoring content to a job description, and exporting an updated PDF.

> **Project status:** Portfolio prototype. Treat scores and generated suggestions as decision-support, not a guarantee of ATS outcomes or hiring results. Review every generated change before using it in an application.

## Features

- PDF and DOCX résumé upload and text extraction
- Deterministic multi-category scoring and job-description keyword comparison
- Optional OpenAI-powered improvement suggestions and tailoring
- PDF export of tailored résumé content
- Async persistence with SQLAlchemy and SQLite
- React/TypeScript frontend and FastAPI backend

## Stack

| Layer | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| API | Python, FastAPI, Uvicorn |
| AI | OpenAI API (optional for non-AI analysis paths) |
| Data | SQLAlchemy async, aiosqlite |
| Documents | PyMuPDF, python-docx, FPDF2 |

## Run locally

Requirements: Python 3.11+ (see deployment/runtime config), Node.js and npm.

### Backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Add your own API key only if using AI-powered features.
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm ci
npm run dev
```

The Vite development server runs at `http://localhost:5173`. The API health route is `GET /api/health` on port 8000. Review the Vite configuration for API proxy/base URL behavior before deployment.

## Environment

Backend `.env`:

```env
OPENAI_API_KEY=
DATABASE_URL=sqlite+aiosqlite:///./resumeforge.db
FRONTEND_URL=http://localhost:5173
```

Never commit a real API key, uploaded résumé, database file, or production credential. Use environment variables in the hosting platform.

## Repository layout

```text
frontend/   React + TypeScript application
backend/
  app/
    routes/     API endpoints
    services/   document and AI business logic
    main.py     FastAPI application
    database.py async database setup
    models.py   data models
  tests/        parser and ATS-scoring regression tests
  requirements.txt
.github/workflows/ci.yml
README.md
```

## API surface

The backend registers upload, analysis, tailoring, and download routers under `/api`, plus `GET /api/health`. Consult the route modules for the current request/response schemas; those are the source of truth if this overview becomes outdated.

## Tests and continuous integration

Run the backend regression suite from `backend/` with `python -m pytest -q`. GitHub Actions runs the backend pytest suite and installs/builds the frontend with `npm ci` and `npm run build` on pushes and pull requests to `main`. These checks do not exercise live OpenAI requests, production hosting, or a multi-user deployment.

## Deployment notes

The repository includes a Render backend blueprint and a Vercel frontend configuration. Configure `OPENAI_API_KEY` and the exact deployed frontend origin in the hosting environment. The backend CORS allow-list should contain only trusted origins; do not use wildcard origins with credentialed requests.

## Responsible use and limitations

- A heuristic score is not the same as any employer's proprietary ATS ranking.
- Generated content can introduce inaccuracies. Verify every date, metric, skill, and claim.
- Résumés contain personal data. Avoid uploading sensitive documents to untrusted deployments and define retention/deletion behavior before public launch.
- This README does not claim a successful production deployment or a validated hiring-performance improvement.

## License

No license file is currently included. Do not assume reuse or redistribution rights until a license is explicitly added.
