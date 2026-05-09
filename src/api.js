const BASE_URL = import.meta.env.VITE_API_URL || ''

export const api = {
  get: (path) => fetch(`${BASE_URL}${path}`, { cache: 'no-store' }).then(r => r.json()),
  post: (path, body) => fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(r => r.json()),
}

export const getEngineering = () => Promise.all([
  api.get('/api/engineering/specs'),
  api.get('/api/engineering/stats'),
]).then(([specs, stats]) => ({ specs, stats }))

export const getTeam = () => api.get('/api/team')
export const getAchievements = () => api.get('/api/achievements')
export const getSponsors = () => api.get('/api/sponsors')
export const getContactInfo = () => api.get('/api/contact/info')
export const submitMessage = (data) => api.post('/api/contact/message', data)
