from pydantic import BaseModel
from typing import Any

class ChatRequest(BaseModel):
    question: str
    analysis_context: dict[str, Any]

class ReanalyzeRequest(BaseModel):
    resume_data: dict[str, Any]
    new_target_role: str
    new_job_description: str
    resume_text: str = ""
