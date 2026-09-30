import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts'
const LABELS = { skill_match: 'Skill match', experience_match: 'Experience match', project_match: 'Project match' }
export default function ScoreCard({ score, breakdown }) {
  return (<div className="card grid md:grid-cols-[200px_1fr] gap-6 items-center">
    <div className="relative w-[180px] h-[180px] mx-auto">
      <RadialBarChart width={180} height={180} innerRadius={70} outerRadius={90} data={[{ v: score }]} startAngle={90} endAngle={-270}>
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} /><RadialBar dataKey="v" fill="#0f5c4d" background cornerRadius={10} /></RadialBarChart>
      <div className="absolute inset-0 grid place-items-center text-center"><div><div className="text-4xl font-display font-bold">{Math.round(score)}%</div>
        <div className="text-xs text-slate-500">Resume-job alignment</div></div></div></div>
    <div className="space-y-3"><p className="text-xs text-slate-500">Estimate = 60% skills + 20% experience + 20% projects. Calculated by fixed rules, not by the AI. Not an ATS score.</p>
      {Object.entries(breakdown).map(([k, b]) => (<div key={k}><div className="flex justify-between text-sm font-medium"><span>{LABELS[k]} ({b.weight * 100}%)</span><span>{b.score}%</span></div>
        <div className="h-2 bg-mint rounded-full overflow-hidden"><div className="h-full bg-pine" style={{ width: `${b.score}%` }} /></div>
        <div className="text-xs text-slate-500 mt-1">{b.detail}</div></div>))}</div></div>)
}
