import axios from 'axios'

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// Attach stored JWT on every request
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('sack3d_token') ||
    sessionStorage.getItem('sack3d_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Normalize errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!err.response) return Promise.reject(new Error('Network error — is the server running?'))
    if (err.response.status === 401) {
      localStorage.removeItem('sack3d_token')
      localStorage.removeItem('sack3d_user')
      sessionStorage.removeItem('sack3d_token')
      sessionStorage.removeItem('sack3d_user')
    }
    const message = err.response.data?.error || err.response.data?.message || 'An unexpected error occurred'
    return Promise.reject(new Error(message))
  }
)

export default api
