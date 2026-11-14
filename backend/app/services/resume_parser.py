import io
import re
import zipfile

import fitz
from docx import Document


def parse_pdf(file_bytes: bytes) -> str:
    if not file_bytes.startswith(b"%PDF-"):
        raise ValueError("The uploaded file is not a valid PDF.")
    try:
        with fitz.open(stream=file_bytes, filetype="pdf") as doc:
            if doc.is_encrypted and not doc.authenticate(""):
                raise ValueError("Password-protected PDFs are not supported.")
            return "\n".join(page.get_text() for page in doc)
    except ValueError:
        raise
    except Exception as exc:
        raise ValueError("The uploaded PDF is invalid or unreadable.") from exc


def parse_docx(file_bytes: bytes) -> str:
    if not zipfile.is_zipfile(io.BytesIO(file_bytes)):
        raise ValueError("The uploaded file is not a valid DOCX document.")
    try:
        doc = Document(io.BytesIO(file_bytes))
        parts = [para.text for para in doc.paragraphs if para.text]
        for table in doc.tables:
            for row in table.rows:
                parts.append(" | ".join(cell.text for cell in row.cells))
        return "\n".join(parts)
    except Exception as exc:
        raise ValueError("The uploaded DOCX document is invalid or unreadable.") from exc


def extract_contact_info(text: str) -> dict:
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    phone_pattern = r'(?<!\w)(?:\+?\d[\d\s().-]{7,}\d)(?!\w)'
    linkedin_pattern = r'linkedin\.com/in/[a-zA-Z0-9_-]+'
    github_pattern = r'github\.com/[a-zA-Z0-9_-]+'

    email_match = re.search(email_pattern, text)
    phone_match = re.search(phone_pattern, text)
    linkedin_match = re.search(linkedin_pattern, text)
    github_match = re.search(github_pattern, text)

    return {
        "email": email_match.group(0) if email_match else None,
        "phone": phone_match.group(0).strip() if phone_match else None,
        "linkedin": linkedin_match.group(0) if linkedin_match else None,
        "github": github_match.group(0) if github_match else None
    }


def detect_sections(text: str) -> dict:
    headers = ["SUMMARY", "EXPERIENCE", "EDUCATION", "SKILLS", "PROJECTS", "CERTIFICATIONS"]
    sections = {h.lower(): "" for h in headers}
    sections["contact"] = text[:500]

    current_section = None
    for line in text.split("\n"):
        clean_line = line.strip().upper()
        matched_header = None
        for header in headers:
            if clean_line.startswith(header) and len(clean_line) < len(header) + 5:
                matched_header = header
                break
        if matched_header:
            current_section = matched_header.lower()
        elif current_section:
            sections[current_section] += line + "\n"
    return sections


def parse_resume(file_bytes: bytes, filename: str) -> dict:
    if not file_bytes:
        raise ValueError("The uploaded file is empty.")
    extension = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if extension == "pdf":
        raw_text = parse_pdf(file_bytes)
    elif extension == "docx":
        raw_text = parse_docx(file_bytes)
    else:
        raise ValueError("Only PDF and DOCX files are supported.")

    if not raw_text.strip():
        raise ValueError("No selectable text was found in the document. Scanned PDFs need OCR before upload.")

    sections = detect_sections(raw_text)
    contact = extract_contact_info(raw_text)
    word_count = len(raw_text.split())

    return {
        "raw_text": raw_text,
        "sections": sections,
        "contact": contact,
        "word_count": word_count
    }
