export interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  createdAt: string
  coins?: number
}

export interface AuthResponse {
  success: boolean
  token: string
  user: User
}

export interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  coins: number
  setCoins: (coins: number) => void
  login: (data: LoginFormData) => Promise<void>
  register: (data: RegisterFormData) => Promise<void>
  logout: () => Promise<void>
}
