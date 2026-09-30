import { useState } from 'react'
import { Copy, Check, CheckCircle2, CircleDashed, XCircle } from 'lucide-react'

export const Section = ({ title, children }) => (<section className="card"><h2 className="text-lg font-bold mb-3">{title}</h2>{children}</section>)
const Empty = ({ text }) => <p className="text-sm text-slate-500">{text}</p>
const text = (x) => typeof x === 'string' ? x : x?.item || x?.name || JSON.stringify(x)

export function Strengths({ items }) {
  return <Section title="Strengths">{items.length ? <div className="flex flex-wrap gap-2">{items.map((s, i) => <span key={i} className="bg-mint text-pine text-sm px-3 py-1 rounded-full">{s}</span>)}</div> : <Empty text="No clear strengths found for this role." />}</Section>
}

export function SkillMatch({ matched, partial, missing }) {
  const cols = [
    ['Matched', matched, CheckCircle2, 'text-emerald-700 bg-emerald-50 border-emerald-200'],
    ['Partial', partial, CircleDashed, 'text-amber-700 bg-amber-50 border-amber-200'],
    ['Missing', missing, XCircle, 'text-rose-700 bg-rose-50 border-rose-200']]
  return (<Section title="Skill match"><div className="grid md:grid-cols-3 gap-4">
    {cols.map(([t, list, Icon, cls]) => (<div key={t}><h3 className="font-semibold mb-2 flex items-center gap-2"><Icon size={16} />{t} ({list.length})</h3>
      <div className="flex flex-wrap gap-2">{list.length ? list.map((s, i) => <span key={i} className={`border text-sm px-2.5 py-1 rounded-md ${cls}`}>{s}</span>) : <Empty text="None" />}</div></div>))}
  </div><p className="text-xs text-slate-500 mt-3">Missing means not found in the provided resume. Add a skill only if you have actual experience with it.</p></Section>)
}

export function ExperienceAnalysis({ data }) {
  const blocks = [['Relevant experience', data.relevant_experience], ['Less relevant experience', data.less_relevant_experience], ['Missing experience evidence', data.missing_experience_requirements]]
  return (<Section title="Experience analysis"><div className="space-y-4">{blocks.map(([t, list = []]) => (<div key={t}><h3 className="font-semibold text-sm mb-1">{t}</h3>
    {list.length ? <ul className="list-disc ml-5 text-sm space-y-1">{list.map((x, i) => <li key={i}>{text(x)}{x?.reason && <span className="text-slate-500"> - {x.reason}</span>}</li>)}</ul> : <Empty text="Nothing found." />}</div>))}</div></Section>)
}

export function ProjectAnalysis({ projects }) {
  return (<Section title="Project analysis">{projects.length ? <div className="grid md:grid-cols-2 gap-4">{projects.map((p, i) => (<div key={i} className="border border-[#dfe7e4] rounded-lg p-3 text-sm">
    <div className="flex justify-between"><h3 className="font-semibold">{p.project}</h3><span className="text-xs bg-mint text-pine px-2 py-0.5 rounded-full">{p.relevance} relevance</span></div>
    <div className="flex flex-wrap gap-1 my-2">{(p.relevant_skills || []).map(s => <span key={s} className="text-xs bg-slate-100 px-2 py-0.5 rounded">{s}</span>)}</div>
    <p>{p.why_relevant}</p>
    {p.missing_details?.length > 0 && <p className="text-slate-500 mt-1">Missing: {p.missing_details.join('; ')}</p>}
    {p.suggestion && <p className="mt-1 text-pine">{p.suggestion}</p>}</div>))}</div> : <Empty text="No projects found in the resume." />}</Section>)
}

export function WeakAreas({ items }) {
  const color = { High: 'bg-rose-100 text-rose-700', Medium: 'bg-amber-100 text-amber-700', Low: 'bg-slate-100 text-slate-600' }
  return (<Section title="Weak areas">{items.length ? <div className="space-y-3">{items.map((w, i) => (<div key={i} className="text-sm border-l-4 border-pine pl-3">
    <div className="flex items-center gap-2"><b>{w.section}</b><span className={`text-xs px-2 py-0.5 rounded-full ${color[w.priority] || color.Low}`}>{w.priority}</span></div>
    <p>{w.issue}</p><p className="text-slate-600">{w.suggestion}</p></div>))}</div> : <Empty text="No weak areas identified." />}</Section>)
}

export const Recommendations = ({ items }) => (<Section title="Recommendations">{items.length ? <ol className="list-decimal ml-5 text-sm space-y-2">{items.map((r, i) => <li key={i}>{r}</li>)}</ol> : <Empty text="No recommendations." />}</Section>)

function CopyButton({ value }) {
  const [done, setDone] = useState(false)
  return <button className="btn-ghost text-xs !py-1 !px-2 inline-flex items-center gap-1" onClick={() => { navigator.clipboard.writeText(value); setDone(true); setTimeout(() => setDone(false), 1500) }}>{done ? <Check size={14} /> : <Copy size={14} />}{done ? 'Copied' : 'Copy'}</button>
}
export function ImprovedContent({ items }) {
  return (<Section title="Improved content">{items.length ? <div className="space-y-4">{items.map((c, i) => (<div key={i} className="text-sm border border-[#dfe7e4] rounded-lg p-3">
    <b>{c.section}</b>
    <div className="grid md:grid-cols-2 gap-3 mt-2"><div className="bg-slate-50 rounded p-2"><div className="text-xs text-slate-500 mb-1">Before</div>{c.original}</div>
      <div className="bg-mint rounded p-2"><div className="flex justify-between items-center text-xs text-pine mb-1">After<CopyButton value={c.improved} /></div>{c.improved}</div></div>
    <p className="text-slate-600 mt-2">Why: {c.reason}</p></div>))}
    <p className="text-xs text-slate-500">Rewrites use only details already in your resume. Check each one for accuracy before using it.</p></div> : <Empty text="No rewrites suggested." />}</Section>)
}

const AGENTS = ['Resume Parser', 'Resume Analyzer', 'Job Analyzer', 'Skill Matcher', 'Gap Analyzer', 'Resume Reviewer', 'Improvement Agent', 'Final Report']
export function WorkflowTrace({ done = [] }) {
  return (<Section title="AI agent workflow"><ol className="flex flex-wrap gap-2 items-center text-sm">{AGENTS.map((a, i) => (<li key={a} className="flex items-center gap-2">
    <span className={`px-3 py-1.5 rounded-lg border ${done.includes(a) ? 'border-pine bg-mint text-pine' : 'border-slate-200 text-slate-400'}`}>{a} {done.includes(a) && '✓'}</span>{i < AGENTS.length - 1 && <span className="text-slate-300">›</span>}</li>))}</ol></Section>)
}
