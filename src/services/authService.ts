import api from './api'
import type { AuthResponse, LoginFormData, RegisterFormData, User } from '../types/auth'

const TOKEN_KEY = 'sack3d_token'
const USER_KEY = 'sack3d_user'

export const authService = {
  async register(data: RegisterFormData): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/signup', {
      name: data.name,
      email: data.email,
      password: data.password,
    })
    localStorage.setItem(TOKEN_KEY, res.data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(res.data.user))
    return res.data
  },

  async login(data: LoginFormData): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/login', {
      email: data.email,
      password: data.password,
    })
    const store = data.rememberMe ? localStorage : sessionStorage
    store.setItem(TOKEN_KEY, res.data.token)
    store.setItem(USER_KEY, JSON.stringify(res.data.user))
    return res.data
  },

  async logout(): Promise<void> {
    try { await api.post('/auth/logout') } catch { /* ignore */ }
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(USER_KEY)
  },

  getStoredToken(): string | null {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
  },

  getStoredUser(): User | null {
    try {
      const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY)
      return raw ? JSON.parse(raw) as User : null
    } catch { return null }
  },

  async getMe(): Promise<{ user: User & { coins: number } }> {
    const res = await api.get('/auth/me')
    return res.data
  },
}
