import os, json, re
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()
MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

class LLMError(Exception):
    def __init__(self, message, status=502):
        super().__init__(message)
        self.message, self.status = message, status

def _parse(text: str):
    text = re.sub(r"^```(?:json)?|```$", "", (text or "").strip(), flags=re.M).strip()
    return json.loads(text)

def call_json(prompt: str):
    """Call Gemini expecting JSON. Retries once on malformed output."""
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        raise LLMError("GEMINI_API_KEY is not configured on the server.", 500)
    client = genai.Client(api_key=key, http_options=types.HttpOptions(timeout=90000))
    for _ in range(2):
        try:
            resp = client.models.generate_content(
                model=MODEL, contents=prompt,
                config=types.GenerateContentConfig(response_mime_type="application/json", temperature=0.1))
        except Exception as e:
            msg = str(e).lower()
            if "429" in msg or "quota" in msg:
                raise LLMError("Gemini rate limit reached. Wait a moment and retry.", 429)
            if "timeout" in msg or "deadline" in msg:
                raise LLMError("Gemini request timed out. Please retry.", 504)
            raise LLMError("Gemini API error. Check your API key and try again.", 502)
        try:
            return _parse(resp.text)
        except Exception:
            prompt += "\n\nYour previous reply was not valid JSON. Return ONLY valid JSON."
    raise LLMError("The AI returned a malformed response. Please retry.", 502)
