from fpdf import FPDF
import io

class ResumePDF(FPDF):
    def header(self):
        # We don't necessarily want a page header on every page for a resume
        pass

    def footer(self):
        # Page numbers
        self.set_y(-15)
        self.set_font("helvetica", "I", 8)
        self.cell(0, 10, f"Page {self.page_no()}", align="C")

def generate_pdf(resume_text: str, filename: str) -> bytes:
    pdf = ResumePDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    # Try to parse sections roughly if formatted
    lines = resume_text.split('\n')
    
    for line in lines:
        line = line.strip()
        if not line:
            pdf.ln(5)
            continue
            
        # Check if line looks like a header (all caps, short)
        if line.isupper() and len(line) < 40 and not line.startswith("•") and not line.startswith("-"):
            pdf.set_font("helvetica", "B", 14)
            pdf.cell(0, 10, line, new_x="LMARGIN", new_y="NEXT")
            pdf.ln(2)
        else:
            pdf.set_font("helvetica", "", 11)
            # handle bullets roughly
            if line.startswith("•") or line.startswith("-"):
                pdf.set_x(15) # indent
                # remove bullet char for fpdf
                clean_line = line[1:].strip()
                pdf.multi_cell(0, 6, chr(149) + " " + clean_line)
            else:
                pdf.set_x(10)
                pdf.multi_cell(0, 6, line)
                
    return pdf.output(dest="S")
