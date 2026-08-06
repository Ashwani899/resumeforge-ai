import json
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db, ResumeAnalysis
from app.models import AnalysisResponse, SuggestionsResponse
from app.services.ai_service import get_suggestions

router = APIRouter()

@router.get("/analysis/{resume_id}", response_model=AnalysisResponse)
async def get_analysis(resume_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ResumeAnalysis).where(ResumeAnalysis.id == resume_id))
    db_resume = result.scalar_one_or_none()
    
    if not db_resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    ats_result = json.loads(db_resume.ats_result)
    keywords_result = json.loads(db_resume.keywords_result)
    suggestions = json.loads(db_resume.suggestions) if db_resume.suggestions else None
    
    return AnalysisResponse(
        id=db_resume.id,
        filename=db_resume.filename,
        overall_score=ats_result.get("overall", 0),
        breakdown=ats_result.get("breakdown", {}),
        keywords={"extracted": keywords_result},
        suggestions=suggestions
    )

@router.post("/analysis/{resume_id}/suggestions", response_model=SuggestionsResponse)
async def generate_suggestions(resume_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ResumeAnalysis).where(ResumeAnalysis.id == resume_id))
    db_resume = result.scalar_one_or_none()
    
    if not db_resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    ats_result = json.loads(db_resume.ats_result)
    suggestions = await get_suggestions(db_resume.raw_text, ats_result)
    
    db_resume.suggestions = json.dumps(suggestions)
    await db.commit()
    
    return SuggestionsResponse(suggestions=suggestions)
