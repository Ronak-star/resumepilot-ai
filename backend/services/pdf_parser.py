import re
import fitz  # PyMuPDF

MAX_BYTES = 8 * 1024 * 1024
MAX_PAGES = 10

class PDFError(Exception):
    pass

def extract_text(data: bytes) -> str:
    if len(data) > MAX_BYTES:
        raise PDFError("PDF is too large. Please upload a file under 8 MB.")
    try:
        doc = fitz.open(stream=data, filetype="pdf")
    except Exception:
        raise PDFError("Invalid PDF file.")
    if doc.page_count > MAX_PAGES:
        raise PDFError(f"PDF has too many pages (max {MAX_PAGES}).")
    text = "\n".join(page.get_text() for page in doc)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text).strip()
    if len(text) < 30:
        raise PDFError("Unable to extract readable text from this PDF.")
    return text
