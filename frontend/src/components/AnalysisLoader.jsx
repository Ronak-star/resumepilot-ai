import { useEffect, useState } from 'react'
import { Check, Loader2, Circle } from 'lucide-react'
const STEPS = ['Parsing resume', 'Understanding job description', 'Matching skills', 'Finding skill gaps', 'Reviewing resume', 'Generating recommendations']
// Steps advance on a timer while the real request runs; the results page shows the true agent trace from the backend.
export default function AnalysisLoader() {
  const [i, setI] = useState(0)
  useEffect(() => { const t = setInterval(() => setI(v => Math.min(v + 1, STEPS.length - 1)), 6000); return () => clearInterval(t) }, [])
  return (<div className="card max-w-md mx-auto"><h2 className="text-xl font-bold mb-4">Analyzing your resume...</h2>
    <ul className="space-y-3">{STEPS.map((s, k) => (<li key={s} className="flex items-center gap-3 text-sm">
      {k < i ? <Check size={18} className="text-pine" /> : k === i ? <Loader2 size={18} className="animate-spin text-pine" /> : <Circle size={18} className="text-slate-300" />}
      <span className={k > i ? 'text-slate-400' : ''}>{s}</span></li>))}</ul>
    <p className="text-xs text-slate-500 mt-4">This runs several AI agents in sequence and can take up to a minute.</p></div>)
}
