import json
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db, ResumeAnalysis
from app.models import TailorRequest, TailorResponse
from app.services.ai_service import tailor_resume
from app.services.keyword_analyzer import match_keywords

router = APIRouter()

@router.post("/tailor", response_model=TailorResponse)
async def tailor_resume_endpoint(request: TailorRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ResumeAnalysis).where(ResumeAnalysis.id == request.resume_id))
    db_resume = result.scalar_one_or_none()
    
    if not db_resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    tailor_result = await tailor_resume(db_resume.raw_text, request.job_description, request.target_role or "")
    tailored_text = tailor_result.get("tailored_text", "")
    
    match_result = match_keywords(tailored_text, request.job_description)
    
    db_resume.tailored_text = tailored_text
    db_resume.job_description = request.job_description
    await db.commit()
    
    return TailorResponse(
        tailored_text=tailored_text,
        original_text=db_resume.raw_text,
        match_score=match_result.get("match_score", 0),
        added_keywords=[m["keyword"] for m in match_result.get("matched", [])],
        suggestions=tailor_result.get("changes_made", [])
    )
