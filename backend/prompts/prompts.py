RULES = """STRICT RULES: Use ONLY facts present in the provided text. Never invent or assume skills, experience, projects,
certifications, numbers, achievements or responsibilities. If something is absent write "Not found in the provided resume."
Never tell the candidate to claim a skill they lack; say "Consider learning or demonstrating this skill if you actually have experience with it."
Never guarantee job selection or ATS success. Return ONLY valid JSON matching the schema."""

RESUME = RULES + """
Extract from the resume below. Schema:
{"candidate_name":"","summary":"","education":[],"skills":[],"programming_languages":[],"frameworks":[],"libraries":[],"databases":[],"tools":[],"cloud":[],"ai_ml":[],
"experience":[{"role":"","company":"","description":""}],"projects":[{"name":"","technologies":[],"description":""}],"certifications":[],"achievements":[]}
Use empty values when absent.
RESUME:
"""
JOB = RULES + """
Analyze the job description. Schema:
{"job_title":"","required_skills":[],"preferred_skills":[],"soft_skills":[],"experience_requirements":[],"education_requirements":[],"responsibilities":[],"keywords":[]}
Target role: {role}
JOB DESCRIPTION:
{jd}
"""
MATCH = RULES + """
Compare resume data to job data. Classify EACH required and preferred technical skill as:
matched (resume clearly demonstrates it), partial (related evidence only), missing (not in resume). Each skill appears in exactly one list.
Also analyze experience and projects against the job. Schema:
{"matched_skills":[],"partial_skills":[],"missing_skills":[],
"skill_evidence":[{"skill":"","status":"matched|partial|missing","evidence":""}],
"experience_analysis":{"relevant_experience":[{"item":"","reason":""}],"less_relevant_experience":[{"item":"","reason":""}],"missing_experience_requirements":[""]},
"project_analysis":[{"project":"","relevance":"high|medium|low","relevant_skills":[],"why_relevant":"","missing_details":[],"suggestion":""}]}
Do not judge employability. Never invent metrics.
RESUME_DATA: {resume}
JOB_DATA: {job}
"""
GAP = RULES + """
Identify gaps. Schema:
{"missing_technical_skills":[],"missing_experience_evidence":[],"weak_project_descriptions":[],"weak_summary":"","missing_keywords":[],"weak_bullets":[],"missing_measurable_info":[]}
RESUME_TEXT: {text}
RESUME_DATA: {resume}
JOB_DATA: {job}
MISSING_SKILLS: {missing}
"""
REVIEW = RULES + """
Review sections Summary, Skills, Experience, Projects, Education, Certifications, Achievements. Return only weak ones. Schema:
{"weak_areas":[{"section":"","issue":"","suggestion":"","priority":"High|Medium|Low"}]}
RESUME_TEXT: {text}
JOB_DATA: {job}
GAPS: {gaps}
"""
IMPROVE = RULES + """
Rewrite up to 5 weak resume statements taken VERBATIM from the resume to be clearer and more relevant, using ONLY information already present.
Also give 4-6 prioritized actionable recommendations. Schema:
{"improved_content":[{"section":"","original":"","improved":"","reason":""}],"recommendations":[""]}
RESUME_TEXT: {text}
JOB_DATA: {job}
WEAK_AREAS: {weak}
"""
FINAL = RULES + """
Write the final summary (max 4 sentences; say it is a resume-job alignment estimate, not an ATS score) and list up to 6 strengths
(skills or evidence actually present and relevant). Schema: {"strengths":[""],"summary":""}
TARGET_ROLE: {role}
MATCHED: {matched}
PARTIAL: {partial}
MISSING: {missing}
SCORE: {score}
"""
CHAT = """You are the ResumePilot assistant. Answer ONLY using the resume data, job description and analysis results below.
If the answer is not available reply exactly: "That information is not available in the uploaded resume or job description."
Never invent facts about the candidate. Be concise. Return JSON: {"answer":""}
CONTEXT: {ctx}
QUESTION: {q}
"""
