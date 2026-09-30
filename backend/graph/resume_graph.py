from typing import TypedDict
from langgraph.graph import StateGraph, START, END
from agents import nodes

class ResumeState(TypedDict, total=False):
    resume_text: str
    target_role: str
    job_description: str
    resume_data: dict
    job_data: dict
    matched_skills: list
    partial_skills: list
    missing_skills: list
    skill_evidence: list
    experience_analysis: dict
    project_analysis: list
    gaps: dict
    weak_areas: list
    recommendations: list
    improved_content: list
    alignment_score: float
    final_report: dict
    trace: list

_ORDER = [("resume_parser", nodes.resume_parser), ("resume_analyzer", nodes.resume_analyzer),
          ("job_analyzer", nodes.job_analyzer), ("skill_matcher", nodes.skill_matcher),
          ("gap_analyzer", nodes.gap_analyzer), ("resume_reviewer", nodes.resume_reviewer),
          ("improvement_agent", nodes.improvement_agent), ("final_report", nodes.final_report)]

def build_graph():
    g = StateGraph(ResumeState)
    for name, fn in _ORDER: g.add_node(name, fn)
    g.add_edge(START, _ORDER[0][0])
    for (a, _), (b, _) in zip(_ORDER, _ORDER[1:]): g.add_edge(a, b)
    g.add_edge(_ORDER[-1][0], END)
    return g.compile()

graph = build_graph()

def run_analysis(resume_text, target_role, job_description, resume_data=None):
    state = graph.invoke({"resume_text": resume_text, "target_role": target_role, "job_description": job_description,
                          "resume_data": resume_data or {}, "trace": []})
    return state["final_report"]
