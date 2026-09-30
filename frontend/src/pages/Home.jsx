import { Link } from 'react-router-dom'
import { FileSearch, Target, Puzzle, Wand2 } from 'lucide-react'
const F = [[FileSearch, 'Resume analysis'], [Puzzle, 'Skill gap detection'], [Target, 'Role matching'], [Wand2, 'AI improvements']]
export default function Home() {
  return (<div className="py-10"><h1 className="text-5xl md:text-6xl font-bold leading-tight max-w-3xl">ResumePilot AI</h1>
    <p className="text-xl text-pine font-display mt-2">Your Resume. Your Target Role. Your AI Career Assistant.</p>
    <p className="mt-4 text-slate-600 max-w-xl">Analyze your resume against any job role with an AI-powered resume assistant. It only uses what is actually in your resume.</p>
    <div className="flex gap-3 mt-6"><Link to="/analyze" className="btn">Analyze My Resume</Link><Link to="/analyze?demo=1" className="btn-ghost">Try Demo</Link></div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">{F.map(([Icon, t]) => (<div key={t} className="card flex items-center gap-3"><Icon className="text-pine" size={20} /><span className="font-medium text-sm">{t}</span></div>))}</div></div>)
}
