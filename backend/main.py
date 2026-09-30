from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from services.pdf_parser import extract_text, PDFError
from services.llm_service import call_json, LLMError
from graph.resume_graph import run_analysis
from models.schemas import ChatRequest, ReanalyzeRequest
from prompts.prompts import CHAT
import demo_data, json

app = FastAPI(title="ResumePilot AI")
app.add_middleware(CORSMiddleware, allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5173").split(","),
                   allow_methods=["*"], allow_headers=["*"])

@app.exception_handler(LLMError)
async def llm_err(_, e: LLMError):
    return JSONResponse({"detail": e.message}, status_code=e.status)

@app.get("/api/health")
def health():
    return {"status": "ok", "gemini_configured": bool(os.getenv("GEMINI_API_KEY"))}

@app.get("/api/demo")
def demo():
    return {"label": demo_data.DEMO_LABEL, "resume_text": demo_data.DEMO_RESUME,
            "target_role": demo_data.DEMO_ROLE, "job_description": demo_data.DEMO_JD}

@app.post("/api/analyze")
async def analyze(target_role: str = Form(...), job_description: str = Form(...),
                  resume: UploadFile | None = File(None), demo_resume: bool = Form(False)):
    if not target_role.strip() or not job_description.strip():
        raise HTTPException(400, "Target role and job description are required.")
    if demo_resume:
        text = demo_data.DEMO_RESUME
    else:
        if resume is None:
            raise HTTPException(400, "Please upload a resume PDF.")
        if not (resume.filename or "").lower().endswith(".pdf"):
            raise HTTPException(400, "Only PDF files are supported.")
        try:
            text = extract_text(await resume.read())
        except PDFError as e:
            raise HTTPException(422, str(e))
    return run_analysis(text, target_role.strip(), job_description.strip())

@app.post("/api/reanalyze")
def reanalyze(req: ReanalyzeRequest):
    if not req.new_target_role.strip() or not req.new_job_description.strip():
        raise HTTPException(400, "New role and job description are required.")
    text = req.resume_text or json.dumps(req.resume_data)
    return run_analysis(text, req.new_target_role.strip(), req.new_job_description.strip(), resume_data=req.resume_data)

@app.post("/api/chat")
def chat(req: ChatRequest):
    if not req.question.strip():
        raise HTTPException(400, "Question is required.")
    ctx = {k: v for k, v in req.analysis_context.items() if k != "resume_text"}
    ctx["resume_text"] = req.analysis_context.get("resume_text", "")[:6000]
    out = call_json(CHAT.replace("{ctx}", json.dumps(ctx, ensure_ascii=False)).replace("{q}", req.question))
    return {"answer": out.get("answer", "That information is not available in the uploaded resume or job description.")}
