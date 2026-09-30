import axios from 'axios'
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000', timeout: 240000 })

export const errorMessage = (e) => e.response?.data?.detail
  ? (typeof e.response.data.detail === 'string' ? e.response.data.detail : 'Invalid request.')
  : e.code === 'ERR_NETWORK' ? 'Cannot reach the backend. Is it running?' : 'Something went wrong. Please retry.'

export const getDemo = () => api.get('/api/demo').then(r => r.data)
export const analyze = ({ file, targetRole, jobDescription, useDemo }) => {
  const fd = new FormData()
  if (useDemo) fd.append('demo_resume', 'true'); else fd.append('resume', file)
  fd.append('target_role', targetRole); fd.append('job_description', jobDescription)
  return api.post('/api/analyze', fd).then(r => r.data)
}
export const reanalyze = (result, role, jd) => api.post('/api/reanalyze', {
  resume_data: result.resume_data, resume_text: result.resume_text, new_target_role: role, new_job_description: jd }).then(r => r.data)
export const chat = (question, analysis_context) => api.post('/api/chat', { question, analysis_context }).then(r => r.data.answer)
