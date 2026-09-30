import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
export default function Navbar() {
  return (<header className="border-b border-[#dfe7e4] bg-white"><div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
    <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg"><Compass className="text-pine" size={22} />ResumePilot AI</Link>
    <Link to="/analyze" className="text-sm font-semibold text-pine">New analysis</Link></div></header>)
}
