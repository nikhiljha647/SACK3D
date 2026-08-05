import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Box, ChevronDown, ShieldCheck, LayoutDashboard, Upload, LogOut, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { isAuthenticated, logout, coins, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
    setMenuOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#dce2e8] border-b border-[#c8cfd6]">
      <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Box className="w-7 h-7 text-orange-500" strokeWidth={2.5} />
            <span className="font-bold text-gray-900 tracking-tight text-base">
              SACK <span className="text-orange-500">3D</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-5">
            <Link to="/gallery" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">
              Gallery
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role === 'admin' ? (
                  <Link to="/admin" className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors">
                    Admin Dashboard
                  </Link>
                ) : (
                  <>
                    {/* Coin balance badge */}
                    <Link
                      to="/dashboard"
                      className="inline-flex items-center gap-1.5 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      <svg className="w-4 h-4 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="10" className="text-orange-100" fill="#fed7aa"/>
                        <text x="12" y="16" textAnchor="middle" fontSize="9" fill="#ea580c" fontWeight="bold">$</text>
                      </svg>
                      <span className="font-semibold">{coins}</span>
                    </Link>

                    <Link to="/dashboard" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">
                      Dashboard
                    </Link>

                    <Link
                      to="/upload"
                      className="text-sm font-semibold bg-orange-500 hover:bg-orange-400 text-white px-4 py-1.5 rounded transition-colors"
                    >
                      Upload
                    </Link>
                  </>
                )}

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold text-sm">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <ChevronDown className="w-4 h-4" strokeWidth={2} />
                  </button>

                  {/* Dropdown Menu */}
                  {profileOpen && (
                    <>
                      {/* Backdrop to close dropdown */}
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setProfileOpen(false)}
                      />
                      
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                        </div>

                        {/* Menu Items */}
                        {user?.role === 'admin' ? (
                          <Link
                            to="/admin"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 font-medium transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 text-orange-600" strokeWidth={2} />
                            Admin Dashboard
                          </Link>
                        ) : (
                          <>
                            <Link
                              to="/dashboard"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <LayoutDashboard className="w-4 h-4" strokeWidth={2} />
                              Dashboard
                            </Link>

                            <Link
                              to="/gallery?filter=my-models"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
                              </svg>
                              My Models
                            </Link>

                            <Link
                              to="/upload"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <Upload className="w-4 h-4" strokeWidth={2} />
                              Upload Model
                            </Link>
                          </>
                        )}

                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button
                            onClick={() => { handleLogout(); setProfileOpen(false); }}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                          >
                            <LogOut className="w-4 h-4" strokeWidth={2} />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={() => navigate('/auth')}
                className="text-sm font-semibold bg-orange-500 hover:bg-orange-400 text-white px-4 py-1.5 rounded transition-colors"
              >
                Sign in
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" strokeWidth={2} /> : <Menu className="w-5 h-5" strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#dce2e8] border-t border-[#c8cfd6] px-4 py-4 flex flex-col gap-3">
          <Link to="/gallery" onClick={() => setMenuOpen(false)} className="text-sm text-gray-700 hover:text-gray-900 py-1">
            Gallery
          </Link>
          {isAuthenticated && (
            <>
              {user?.role === 'admin' ? (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-sm text-orange-600 font-semibold hover:text-orange-700 py-1">
                  Admin Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-sm text-gray-700 hover:text-gray-900 py-1">
                    Dashboard · {coins} coins
                  </Link>
                  <Link to="/upload" onClick={() => setMenuOpen(false)}
                    className="inline-flex items-center text-sm font-semibold bg-orange-500 hover:bg-orange-400 text-white px-4 py-1.5 rounded transition-colors w-fit">
                    Upload
                  </Link>
                </>
              )}
              <button onClick={handleLogout} className="text-sm text-gray-700 hover:text-gray-900 text-left py-1">
                Sign out
              </button>
            </>
          )}
          {!isAuthenticated && (
            <button
              onClick={() => { navigate('/auth'); setMenuOpen(false) }}
              className="text-sm font-semibold bg-orange-500 hover:bg-orange-400 text-white px-4 py-1.5 rounded transition-colors w-fit"
            >
              Sign in
            </button>
          )}
        </div>
      )}
    </nav>
  )
}
