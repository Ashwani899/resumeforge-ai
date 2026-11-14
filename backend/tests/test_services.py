from io import BytesIO

import fitz
import pytest
from docx import Document

from app.services.ats_engine import analyze
from app.services.resume_parser import parse_resume


def make_docx() -> bytes:
    document = Document()
    document.add_paragraph("SUMMARY")
    document.add_paragraph("Backend engineer with experience building APIs.")
    document.add_paragraph("EXPERIENCE")
    document.add_paragraph("Improved service latency by 25% and saved $1,200.")
    table = document.add_table(rows=1, cols=2)
    table.cell(0, 0).text = "SKILLS"
    table.cell(0, 1).text = "Python, FastAPI"
    buffer = BytesIO()
    document.save(buffer)
    return buffer.getvalue()


def make_pdf() -> bytes:
    document = fitz.open()
    page = document.new_page()
    page.insert_text((72, 72), "SUMMARY\nBackend engineer")
    content = document.tobytes()
    document.close()
    return content


def test_parse_docx_includes_paragraphs_and_tables():
    parsed = parse_resume(make_docx(), "resume.docx")
    assert "Backend engineer" in parsed["raw_text"]
    assert "Python, FastAPI" in parsed["raw_text"]
    assert parsed["word_count"] > 0


def test_parse_valid_pdf():
    parsed = parse_resume(make_pdf(), "resume.pdf")
    assert "Backend engineer" in parsed["raw_text"]


def test_reject_invalid_pdf_signature():
    with pytest.raises(ValueError, match="valid PDF"):
        parse_resume(b"not a pdf", "resume.pdf")


def test_reject_unsupported_legacy_word_format():
    with pytest.raises(ValueError, match="Only PDF and DOCX"):
        parse_resume(b"not a document", "resume.doc")


def test_reject_empty_document():
    with pytest.raises(ValueError, match="empty"):
        parse_resume(b"", "resume.pdf")


def test_ats_impact_score_recognizes_percent_and_currency_metrics():
    parsed = {
        "sections": {
            "summary": "",
            "experience": "Improved response time by 25% and saved $1,200.",
            "education": "",
            "skills": "",
        },
        "contact": {},
        "word_count": 100,
    }
    result = analyze(parsed)
    assert result["breakdown"]["impact"] == 4
