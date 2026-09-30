import json
from prompts import prompts as P
from services.llm_service import call_json
from services.scoring_service import calculate_alignment

def _j(x): return json.dumps(x, ensure_ascii=False)
def _fill(t, **kw):
    for k, v in kw.items(): t = t.replace("{" + k + "}", str(v))
    return t
def _mark(s, name): return s["trace"] + [name]

def resume_parser(s):  # text already extracted by pdf_parser; cap length
    return {"resume_text": s["resume_text"][:15000], "trace": _mark(s, "Resume Parser")}

def resume_analyzer(s):
    if s.get("resume_data"):  # re-analysis reuses the parsed resume
        return {"trace": _mark(s, "Resume Analyzer")}
    return {"resume_data": call_json(P.RESUME + s["resume_text"]), "trace": _mark(s, "Resume Analyzer")}

def job_analyzer(s):
    data = call_json(_fill(P.JOB, role=s["target_role"], jd=s["job_description"][:10000]))
    return {"job_data": data, "trace": _mark(s, "Job Analyzer")}

def skill_matcher(s):
    r = call_json(_fill(P.MATCH, resume=_j(s["resume_data"]), job=_j(s["job_data"])))
    return {"matched_skills": r.get("matched_skills", []), "partial_skills": r.get("partial_skills", []),
            "missing_skills": r.get("missing_skills", []), "skill_evidence": r.get("skill_evidence", []),
            "experience_analysis": r.get("experience_analysis", {}), "project_analysis": r.get("project_analysis", []),
            "trace": _mark(s, "Skill Matcher")}

def gap_analyzer(s):
    g = call_json(_fill(P.GAP, text=s["resume_text"], resume=_j(s["resume_data"]), job=_j(s["job_data"]), missing=_j(s["missing_skills"])))
    return {"gaps": g, "trace": _mark(s, "Gap Analyzer")}

def resume_reviewer(s):
    r = call_json(_fill(P.REVIEW, text=s["resume_text"], job=_j(s["job_data"]), gaps=_j(s["gaps"])))
    return {"weak_areas": r.get("weak_areas", []), "trace": _mark(s, "Resume Reviewer")}

def improvement_agent(s):
    r = call_json(_fill(P.IMPROVE, text=s["resume_text"], job=_j(s["job_data"]), weak=_j(s["weak_areas"])))
    return {"improved_content": r.get("improved_content", []), "recommendations": r.get("recommendations", []),
            "trace": _mark(s, "Improvement Agent")}

def final_report(s):
    sc = calculate_alignment(s["matched_skills"], s["partial_skills"], s["missing_skills"],
                             s["experience_analysis"], s["project_analysis"])
    f = call_json(_fill(P.FINAL, role=s["target_role"], matched=_j(s["matched_skills"]), partial=_j(s["partial_skills"]),
                        missing=_j(s["missing_skills"]), score=sc["alignment_score"]))
    trace = _mark(s, "Final Report")
    report = {"target_role": s["target_role"], "alignment_score": sc["alignment_score"], "score_breakdown": sc["breakdown"],
              "strengths": f.get("strengths", []), "matched_skills": s["matched_skills"], "partial_skills": s["partial_skills"],
              "missing_skills": s["missing_skills"], "skill_evidence": s.get("skill_evidence", []),
              "experience_analysis": s["experience_analysis"], "project_analysis": s["project_analysis"],
              "weak_areas": s["weak_areas"], "gaps": s.get("gaps", {}), "recommendations": s["recommendations"],
              "improved_content": s["improved_content"], "summary": f.get("summary", ""), "workflow": trace,
              "job_description": s["job_description"], "resume_data": s["resume_data"], "resume_text": s["resume_text"]}
    return {"alignment_score": sc["alignment_score"], "final_report": report, "trace": trace}
