import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { authService } from '../services/authService'
import type { AuthContextType, LoginFormData, RegisterFormData, User } from '../types/auth'

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [coins, setCoins] = useState(0)

  // Rehydrate from storage on mount
  useEffect(() => {
    const storedToken = authService.getStoredToken()
    const storedUser = authService.getStoredUser()
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(storedUser)
      if (storedUser.coins !== undefined) setCoins(storedUser.coins)
      // Fetch fresh coin balance from server
      authService.getMe().then(res => {
        setCoins(res.user.coins ?? 0)
      }).catch(() => {})
    }
    setIsLoading(false)
  }, [])

  const register = useCallback(async (data: RegisterFormData) => {
    const res = await authService.register(data)
    setToken(res.token)
    setUser(res.user)
    // Fetch coins after register
    try {
      const me = await authService.getMe()
      setCoins(me.user.coins ?? 0)
    } catch { setCoins(0) }
  }, [])

  const login = useCallback(async (data: LoginFormData) => {
    const res = await authService.login(data)
    setToken(res.token)
    setUser(res.user)
    // Fetch coins after login
    try {
      const me = await authService.getMe()
      setCoins(me.user.coins ?? 0)
    } catch { setCoins(0) }
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setToken(null)
    setUser(null)
    setCoins(0)
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      isAuthenticated: !!token,
      coins,
      setCoins,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
