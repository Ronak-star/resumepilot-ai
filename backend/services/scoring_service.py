def _pct(x): return round(max(0.0, min(1.0, x)) * 100, 1)

def calculate_alignment(matched, partial, missing, experience, projects):
    """Deterministic score: 60% skills, 20% experience, 20% projects."""
    total = len(matched) + len(partial) + len(missing)
    skill = _pct((len(matched) + 0.5 * len(partial)) / total) if total else 0.0
    rel = len(experience.get("relevant_experience", []))
    less = len(experience.get("less_relevant_experience", []))
    gaps = len(experience.get("missing_experience_requirements", []))
    exp = _pct(rel / (rel + less + gaps)) if (rel + less + gaps) else 0.0
    w = {"high": 1.0, "medium": 0.5, "low": 0.0}
    proj = _pct(sum(w.get(str(p.get("relevance", "low")).lower(), 0) for p in projects) / len(projects)) if projects else 0.0
    overall = round(skill * 0.6 + exp * 0.2 + proj * 0.2, 1)
    return {"alignment_score": overall, "breakdown": {
        "skill_match": {"score": skill, "weight": 0.6, "detail": f"{len(matched)} matched + {len(partial)} partial (counted 0.5) of {total} skills"},
        "experience_match": {"score": exp, "weight": 0.2, "detail": f"{rel} relevant vs {less} less relevant and {gaps} missing requirements"},
        "project_match": {"score": proj, "weight": 0.2, "detail": f"Average relevance of {len(projects)} projects (high=1, medium=0.5, low=0)"}}}
