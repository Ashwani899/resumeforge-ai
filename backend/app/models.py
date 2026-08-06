from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class UploadResponse(BaseModel):
    id: str
    filename: str
    ats_score: Dict[str, Any]
    keywords: Dict[str, Any]
    parsed_sections: Dict[str, Any]

class AnalysisResponse(BaseModel):
    id: str
    filename: str
    overall_score: int
    breakdown: Dict[str, Any]
    keywords: Dict[str, Any]
    suggestions: Optional[List[Dict[str, Any]]] = None

class SuggestionsResponse(BaseModel):
    suggestions: List[Dict[str, Any]]

class TailorRequest(BaseModel):
    resume_id: str
    job_description: str
    target_role: Optional[str] = None

class TailorResponse(BaseModel):
    tailored_text: str
    original_text: str
    match_score: int
    added_keywords: List[str]
    suggestions: List[str]

class DownloadRequest(BaseModel):
    resume_id: str
    format: str = "pdf"
