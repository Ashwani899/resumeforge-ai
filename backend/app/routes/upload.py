import json
from pathlib import Path

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db, ResumeAnalysis
from app.models import UploadResponse
from app.services.resume_parser import parse_resume
from app.services.ats_engine import analyze
from app.services.keyword_analyzer import extract_keywords

router = APIRouter()


@router.post("/upload", response_model=UploadResponse)
async def upload_resume(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="A filename is required.")

    safe_filename = Path(file.filename.replace("\\", "/")).name
    extension = safe_filename.rsplit(".", 1)[-1].lower() if "." in safe_filename else ""
    if extension not in {"pdf", "docx"}:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported.")

    max_bytes = max(1, settings.max_file_size_mb) * 1024 * 1024
    file_bytes = await file.read(max_bytes + 1)
    if len(file_bytes) > max_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"File exceeds the {settings.max_file_size_mb} MB upload limit."
        )
    if not file_bytes:
        raise HTTPException(status_code=400, detail="The uploaded file is empty.")

    try:
        parsed_data = parse_resume(file_bytes, safe_filename)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    ats_result = analyze(parsed_data)
    keywords_result = extract_keywords(parsed_data["raw_text"])

    db_resume = ResumeAnalysis(
        filename=safe_filename,
        raw_text=parsed_data["raw_text"],
        parsed_data=json.dumps(parsed_data),
        ats_result=json.dumps(ats_result),
        keywords_result=json.dumps(keywords_result)
    )

    db.add(db_resume)
    try:
        await db.commit()
        await db.refresh(db_resume)
    except Exception:
        await db.rollback()
        raise

    return UploadResponse(
        id=db_resume.id,
        filename=db_resume.filename,
        ats_score=ats_result,
        keywords={"extracted": keywords_result},
        parsed_sections=parsed_data.get("sections", {})
    )
