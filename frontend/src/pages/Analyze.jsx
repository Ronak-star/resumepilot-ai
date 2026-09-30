import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Upload, X, FileText, AlertCircle } from 'lucide-react'
import { analyze, getDemo, errorMessage } from '../services/api.js'
import AnalysisLoader from '../components/AnalysisLoader.jsx'

export default function Analyze() {
  const nav = useNavigate(); const [params] = useSearchParams()
  const [file, setFile] = useState(null); const [role, setRole] = useState(''); const [jd, setJd] = useState('')
  const [demo, setDemo] = useState(null); const [busy, setBusy] = useState(false); const [error, setError] = useState('')
  const loadDemo = async () => {
    try { const d = await getDemo(); setDemo(d); setFile(null); setRole(d.target_role); setJd(d.job_description); setError('') } catch (e) { setError(errorMessage(e)) }
  }
  useEffect(() => { if (params.get('demo')) loadDemo() }, [])
  const submit = async (e) => {
    e.preventDefault(); setError('')
    if (!file && !demo) return setError('Upload a resume PDF or load the demo data.')
    if (!role.trim()) return setError('Enter a target role.')
    if (!jd.trim()) return setError('Paste the job description.')
    setBusy(true)
    try { const result = await analyze({ file, targetRole: role, jobDescription: jd, useDemo: !!demo && !file }); sessionStorage.setItem('result', JSON.stringify(result)); nav('/results') }
    catch (err) { setError(errorMessage(err)); setBusy(false) }
  }
  if (busy) return <AnalysisLoader />
  return (<form onSubmit={submit} className="max-w-2xl mx-auto space-y-5">
    <div className="flex justify-between items-center"><h1 className="text-3xl font-bold">Analyze your resume</h1><button type="button" onClick={loadDemo} className="btn-ghost text-sm">Load demo data</button></div>
    {demo && <div className="text-sm bg-amber-50 border border-amber-200 rounded-lg p-3">{demo.label}. <button type="button" className="underline" onClick={() => { setDemo(null); setRole(''); setJd('') }}>Clear</button></div>}
    {!demo && (file ? <div className="card flex items-center gap-3"><FileText className="text-pine" /><div className="flex-1 text-sm"><div className="font-medium">{file.name}</div><div className="text-slate-500">{(file.size / 1024).toFixed(0)} KB</div></div>
      <button type="button" aria-label="Remove file" onClick={() => setFile(null)}><X size={18} /></button></div>
      : <label className="card border-dashed flex flex-col items-center gap-2 py-10 cursor-pointer text-sm text-slate-600"><Upload className="text-pine" />Upload your resume (PDF)
        <input type="file" accept="application/pdf" className="hidden" onChange={e => setFile(e.target.files[0] || null)} /></label>)}
    <div><label className="text-sm font-medium">Target role</label><input className="input mt-1" value={role} onChange={e => setRole(e.target.value)} placeholder="Full Stack Developer" /></div>
    <div><label className="text-sm font-medium">Job description</label><textarea className="input mt-1 h-56" value={jd} onChange={e => setJd(e.target.value)} placeholder="Paste the complete job description here." /></div>
    {error && <div role="alert" className="flex gap-2 items-start text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-3"><AlertCircle size={16} className="mt-0.5" />{error}</div>}
    <button className="btn">Analyze Resume</button></form>)
}
