import json
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db, ResumeAnalysis
from app.models import UploadResponse
from app.services.resume_parser import parse_resume
from app.services.ats_engine import analyze
from app.services.keyword_analyzer import extract_keywords

router = APIRouter()

@router.post("/upload", response_model=UploadResponse)
async def upload_resume(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    if not file.filename.lower().endswith(('.pdf', '.docx')):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")
        
    try:
        file_bytes = await file.read()
        parsed_data = parse_resume(file_bytes, file.filename)
        ats_result = analyze(parsed_data)
        keywords_result = extract_keywords(parsed_data["raw_text"])
        
        db_resume = ResumeAnalysis(
            filename=file.filename,
            raw_text=parsed_data["raw_text"],
            parsed_data=json.dumps(parsed_data),
            ats_result=json.dumps(ats_result),
            keywords_result=json.dumps(keywords_result)
        )
        
        db.add(db_resume)
        await db.commit()
        await db.refresh(db_resume)
        
        return UploadResponse(
            id=db_resume.id,
            filename=db_resume.filename,
            ats_score=ats_result,
            keywords={"extracted": keywords_result},
            parsed_sections=parsed_data.get("sections", {})
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
