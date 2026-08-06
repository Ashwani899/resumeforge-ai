from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db, ResumeAnalysis
from app.services.pdf_generator import generate_pdf
import io

router = APIRouter()

@router.get("/download/{resume_id}")
async def download_resume(resume_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ResumeAnalysis).where(ResumeAnalysis.id == resume_id))
    db_resume = result.scalar_one_or_none()
    
    if not db_resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    text_to_use = db_resume.tailored_text if db_resume.tailored_text else db_resume.raw_text
    
    try:
        pdf_bytes = generate_pdf(text_to_use, db_resume.filename)
        return StreamingResponse(
            io.BytesIO(pdf_bytes), 
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=tailored_{db_resume.filename}.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")
