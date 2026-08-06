import json
import logging
from typing import List, Dict, Any
from openai import AsyncOpenAI
from app.config import settings

logger = logging.getLogger(__name__)

async def get_suggestions(resume_text: str, ats_result: dict) -> List[Dict[str, Any]]:
    if not settings.openai_api_key:
        return [{"priority": "medium", "category": "General", "text": "Set OpenAI API key for AI suggestions.", "example": ""}]
        
    client = AsyncOpenAI(api_key=settings.openai_api_key)
    
    prompt = f"""
    You are an expert ATS resume reviewer. Based on the following resume text and ATS score, provide 5-8 specific, actionable suggestions for improvement.
    Format your response as a JSON array of objects with keys: "priority" (high/medium/low), "category", "text", "example".
    
    ATS Result: {json.dumps(ats_result)}
    
    Resume Text:
    {resume_text[:2000]}... (truncated)
    """
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "system", "content": "You are a resume expert. Always respond in valid JSON array format."},
                      {"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        
        # We asked for a JSON array, but openai response_format json_object requires an object.
        # Let's adjust prompt or just parse.
        content = response.choices[0].message.content
        # attempt to parse if it's an object containing an array, or just an array
        try:
            data = json.loads(content)
            if isinstance(data, dict):
                for k, v in data.items():
                    if isinstance(v, list):
                        return v
            elif isinstance(data, list):
                return data
        except json.JSONDecodeError:
            pass
            
        return [{"priority": "medium", "category": "Error", "text": "Failed to parse AI suggestions.", "example": ""}]
        
    except Exception as e:
        logger.error(f"OpenAI API error: {e}")
        return [{"priority": "high", "category": "Error", "text": f"AI service error: {str(e)}", "example": ""}]

async def tailor_resume(resume_text: str, job_description: str, target_role: str) -> Dict[str, Any]:
    if not settings.openai_api_key:
        return {
            "tailored_text": resume_text,
            "changes_made": ["No AI key set. Returned original text."]
        }
        
    client = AsyncOpenAI(api_key=settings.openai_api_key)
    
    prompt = f"""
    Tailor the following resume for this job description. Target role: {target_role}.
    Keep facts the same, but adjust wording, emphasize relevant skills, and incorporate keywords from the JD naturally.
    
    Return a JSON object with:
    - "tailored_text": the complete rewritten resume text
    - "changes_made": an array of strings describing key changes made
    
    Job Description:
    {job_description}
    
    Resume:
    {resume_text}
    """
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "system", "content": "You are an expert resume writer. Respond in valid JSON format."},
                      {"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        
        data = json.loads(response.choices[0].message.content)
        return {
            "tailored_text": data.get("tailored_text", resume_text),
            "changes_made": data.get("changes_made", [])
        }
    except Exception as e:
        logger.error(f"OpenAI API error during tailoring: {e}")
        return {
            "tailored_text": resume_text,
            "changes_made": [f"AI error: {str(e)}"]
        }
