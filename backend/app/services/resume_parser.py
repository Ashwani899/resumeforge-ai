import io
import re
import fitz  # PyMuPDF
from docx import Document

def parse_pdf(file_bytes: bytes) -> str:
    text = ""
    with fitz.open(stream=file_bytes, filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()
    return text

def parse_docx(file_bytes: bytes) -> str:
    doc = Document(io.BytesIO(file_bytes))
    return "\n".join([para.text for para in doc.paragraphs])

def extract_contact_info(text: str) -> dict:
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    phone_pattern = r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
    linkedin_pattern = r'linkedin\.com/in/[a-zA-Z0-9_-]+'
    github_pattern = r'github\.com/[a-zA-Z0-9_-]+'
    
    email_match = re.search(email_pattern, text)
    phone_match = re.search(phone_pattern, text)
    linkedin_match = re.search(linkedin_pattern, text)
    github_match = re.search(github_pattern, text)
    
    return {
        "email": email_match.group(0) if email_match else None,
        "phone": phone_match.group(0) if phone_match else None,
        "linkedin": linkedin_match.group(0) if linkedin_match else None,
        "github": github_match.group(0) if github_match else None
    }

def detect_sections(text: str) -> dict:
    # basic section detection based on common headers
    headers = ["SUMMARY", "EXPERIENCE", "EDUCATION", "SKILLS", "PROJECTS", "CERTIFICATIONS"]
    sections = {h.lower(): "" for h in headers}
    sections["contact"] = text[:500] # Assumption: contact info at top
    
    current_section = None
    lines = text.split('\n')
    
    for line in lines:
        clean_line = line.strip().upper()
        matched_header = None
        for h in headers:
            if clean_line.startswith(h) and len(clean_line) < len(h) + 5:
                matched_header = h
                break
                
        if matched_header:
            current_section = matched_header.lower()
        elif current_section:
            sections[current_section] += line + "\n"
            
    return sections

def parse_resume(file_bytes: bytes, filename: str) -> dict:
    if filename.lower().endswith('.pdf'):
        raw_text = parse_pdf(file_bytes)
    elif filename.lower().endswith('.docx'):
        raw_text = parse_docx(file_bytes)
    else:
        raise ValueError("Unsupported file format")
        
    sections = detect_sections(raw_text)
    contact = extract_contact_info(raw_text)
    word_count = len(raw_text.split())
    
    return {
        "raw_text": raw_text,
        "sections": sections,
        "contact": contact,
        "word_count": word_count
    }
