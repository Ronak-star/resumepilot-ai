import { useState } from 'react'
import { Link } from 'react-router-dom'
import { reanalyze, errorMessage } from '../services/api.js'
import AnalysisLoader from '../components/AnalysisLoader.jsx'
import ScoreCard from '../components/ScoreCard.jsx'
import ResumeChat from '../components/ResumeChat.jsx'
import { Section, Strengths, SkillMatch, ExperienceAnalysis, ProjectAnalysis, WeakAreas, Recommendations, ImprovedContent, WorkflowTrace } from '../components/Sections.jsx'

export default function Results() {
  const [result, setResult] = useState(() => { try { return JSON.parse(sessionStorage.getItem('result')) } catch { return null } })
  const [role, setRole] = useState(''); const [jd, setJd] = useState(''); const [busy, setBusy] = useState(false); const [error, setError] = useState('')
  if (!result) return <div className="card text-center"><p className="mb-3">No analysis yet.</p><Link to="/analyze" className="btn">Analyze a resume</Link></div>
  if (busy) return <AnalysisLoader />
  const rerun = async (e) => {
    e.preventDefault(); if (!role.trim() || !jd.trim()) return setError('Enter a new role and its job description.')
    setError(''); setBusy(true)
    try { const r = await reanalyze(result, role, jd); sessionStorage.setItem('result', JSON.stringify(r)); setResult(r); setRole(''); setJd('') }
    catch (err) { setError(errorMessage(err)) } finally { setBusy(false) }
  }
  return (<div className="space-y-5">
    <div><h1 className="text-3xl font-bold">{result.target_role}</h1><p className="text-slate-600 mt-1 max-w-3xl">{result.summary}</p></div>
    <ScoreCard score={result.alignment_score} breakdown={result.score_breakdown} />
    <Strengths items={result.strengths} />
    <SkillMatch matched={result.matched_skills} partial={result.partial_skills} missing={result.missing_skills} />
    <div className="grid lg:grid-cols-2 gap-5"><ExperienceAnalysis data={result.experience_analysis} /><WeakAreas items={result.weak_areas} /></div>
    <ProjectAnalysis projects={result.project_analysis} />
    <Recommendations items={result.recommendations} />
    <ImprovedContent items={result.improved_content} />
    <Section title="What if I apply for another role?">
      <form onSubmit={rerun} className="space-y-3"><input className="input" value={role} onChange={e => setRole(e.target.value)} placeholder="Python Developer" />
        <textarea className="input h-32" value={jd} onChange={e => setJd(e.target.value)} placeholder="Paste the job description for the new role" />
        {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}<button className="btn">Re-run analysis with same resume</button></form></Section>
    <ResumeChat result={result} />
    <WorkflowTrace done={result.workflow} />
  </div>)
}
