import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Analyze from './pages/Analyze.jsx'
import Results from './pages/Results.jsx'
export default function App() {
  return (<><Navbar /><main className="max-w-6xl mx-auto px-4 py-8">
    <Routes><Route path="/" element={<Home />} /><Route path="/analyze" element={<Analyze />} /><Route path="/results" element={<Results />} /></Routes>
  </main></>)
}
