import axios from 'axios'

const api = axios.create({ 
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api' 
})

// Otomatis sisipkan token di setiap request kalau user sudah login
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Token ${token}`
  return config
})

export const getEvents  = (params) => api.get('/events/', { params })
export const getEvent   = (id)     => api.get(`/events/${id}/`)

export const getBookmarks   = (sid)      => api.get('/bookmarks/', { params: { session_id: sid } })
export const addBookmark    = (sid, eid) => api.post('/bookmarks/', { session_id: sid, event_id: eid })
export const removeBookmark = (sid, eid) => api.delete(`/bookmarks/${eid}/`, { params: { session_id: sid } })

export const registerUser = (data) => api.post('/auth/register/', data)
export const loginUser    = (data) => api.post('/auth/login/', data)

export const registerEvent = (eventId, token) => api.post(
  `/events/${eventId}/register/`,
  {},
  { headers: { Authorization: `Token ${token}` } }
)

export const cancelRegistration = (eventId) => api.delete(
  `/events/${eventId}/unregister/`
)

export const getMyRegistrations = (token) => api.get(
  '/events/my_registrations/',
  { headers: { Authorization: `Token ${token}` } }
)