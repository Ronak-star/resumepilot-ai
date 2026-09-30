import { useState } from 'react'
import { Send } from 'lucide-react'
import { chat, errorMessage } from '../services/api.js'
import { Section } from './Sections.jsx'
export default function ResumeChat({ result }) {
  const [msgs, setMsgs] = useState([]); const [q, setQ] = useState(''); const [busy, setBusy] = useState(false)
  const send = async (e) => {
    e.preventDefault(); const question = q.trim(); if (!question || busy) return
    setMsgs(m => [...m, { role: 'user', text: question }]); setQ(''); setBusy(true)
    try { const answer = await chat(question, result); setMsgs(m => [...m, { role: 'ai', text: answer }]) }
    catch (err) { setMsgs(m => [...m, { role: 'ai', text: errorMessage(err) }]) }
    finally { setBusy(false) }
  }
  return (<Section title="Ask about your resume">
    <div className="space-y-2 mb-3 max-h-80 overflow-y-auto">{msgs.length === 0 && <p className="text-sm text-slate-500">Try: "Why is Docker missing?" or "Why did I get this alignment score?"</p>}
      {msgs.map((m, i) => <div key={i} className={`text-sm p-2.5 rounded-lg max-w-[85%] ${m.role === 'user' ? 'bg-pine text-white ml-auto' : 'bg-slate-100'}`}>{m.text}</div>)}
      {busy && <div className="text-sm text-slate-500">Thinking...</div>}</div>
    <form onSubmit={send} className="flex gap-2"><input className="input" value={q} onChange={e => setQ(e.target.value)} placeholder="Ask a question about this analysis" />
      <button className="btn" disabled={busy} aria-label="Send"><Send size={16} /></button></form></Section>)
}
